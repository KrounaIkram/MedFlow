import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import PDFDocument from "pdfkit";
import { requireRole } from "../../../../server/rbac";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await requireRole(req, res, ["PATIENT", "ADMIN", "DOCTOR", "RECEPTIONIST"]);
  if (!session) return;

  const { id } = req.query;
  if (typeof id !== "string") {
    return res.status(400).json({ error: "ID invalide" });
  }

  const prescription = await prisma.prescription.findUnique({
    where: { id },
    include: { doctor: true, patient: true, consultation: true }
  });

  if (!prescription) {
    return res.status(404).json({ error: "Ordonnance introuvable" });
  }

  // 🔒 Vérification d'accès
  if (
    session.user.role === "PATIENT" &&
    session.user.id !== prescription.patientId
  ) {
    return res.status(403).json({ error: "Accès refusé" });
  }

  // Générer le PDF
  try {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=ordonnance-${prescription.id}.pdf`);

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    doc.pipe(res);

    doc.fontSize(18).text("Ordonnance Médicale", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Médecin: ${prescription.doctor?.name ?? ""}`);
    doc.text(`Email: ${prescription.doctor?.email ?? ""}`);
    doc.moveDown();

    doc.text(`Patient: ${prescription.patient?.firstName ?? ""} ${prescription.patient?.lastName ?? ""}`);
    if (prescription.patient?.email) doc.text(`Email: ${prescription.patient.email}`);
    if (prescription.patient?.phone) doc.text(`Téléphone: ${prescription.patient.phone}`);
    doc.moveDown();

    if (prescription.consultation) {
      doc.text(`Consultation: ${prescription.consultation.id}`);
      doc.text(`Date: ${new Date(prescription.consultation.datetime).toLocaleString()}`);
      if (prescription.consultation.diagnosis) {
        doc.moveDown();
        doc.text("Diagnostic:", { underline: true });
        doc.text(prescription.consultation.diagnosis);
      }
      doc.moveDown();
    }

    doc.text("Médicaments:", { underline: true });
    const meds = prescription.medications as any[];
    if (meds.length === 0) {
      doc.text("Aucun médicament prescrit.");
    } else {
      meds.forEach((m, idx) => {
        const lines = [`${idx + 1}. ${m.name}`];
        if (m.dosage) lines.push(`Dosage: ${m.dosage}`);
        if (m.frequency) lines.push(`Posologie: ${m.frequency}`);
        if (m.duration) lines.push(`Durée: ${m.duration}`);
        if (m.notes) lines.push(`Notes: ${m.notes}`);
        doc.moveDown(0.2);
        doc.fontSize(11).text(lines.join(" · "));
      });
    }

    doc.moveDown(2);
    doc.text("Signature du médecin: __________________________", { align: "left" });

    doc.end();
  } catch (err) {
    console.error("Erreur PDF:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Erreur génération PDF" });
    }
  }
}