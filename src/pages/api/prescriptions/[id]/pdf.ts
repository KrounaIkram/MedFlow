// pages/api/prescriptions/[id]/pdf.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import PDFDocument from "pdfkit";
import { requireRole } from "../../../../server/rbac";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const session = await requireRole(req, res, ["PATIENT", "DOCTOR", "ADMIN"]);
  if (!session) return;

  const { id } = req.query;
  if (typeof id !== "string") {
    return res.status(400).json({ error: "ID invalide" });
  }

  const prescription = await prisma.prescription.findUnique({
    where: { id },
    include: { 
      doctor: true, 
      patient: { include: { owner: true } }, // ← Important pour vérifier l'accès
      consultation: true 
    }
  });

  if (!prescription) {
    return res.status(404).json({ error: "Ordonnance introuvable" });
  }

  // 🔒 Vérification d'accès
  let hasAccess = false;

  if (session.user.role === "PATIENT") {
    hasAccess = prescription.patient.ownerId === session.user.id;
  } else if (session.user.role === "DOCTOR") {
    hasAccess = prescription.doctorId === session.user.id;
  } else {
    hasAccess = true; // ADMIN
  }

  if (!hasAccess) {
    return res.status(403).json({ error: "Accès refusé" });
  }

  // ✅ Génération du PDF
  try {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=ordonnance-${prescription.id}.pdf`);

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    doc.pipe(res);

    // Titre
    doc.fontSize(20).text("ORDONNANCE MÉDICALE", { align: "center" });
    doc.moveDown();

    // Médecin
    doc.fontSize(12).text(`Dr. ${prescription.doctor?.name || "Non spécifié"}`);
    if (prescription.doctor?.email) {
      doc.text(`Email: ${prescription.doctor.email}`);
    }
    doc.moveDown();

    // Patient
    doc.text(`Patient: ${prescription.patient.firstName} ${prescription.patient.lastName}`);
    if (prescription.patient.email) doc.text(`Email: ${prescription.patient.email}`);
    if (prescription.patient.phone) doc.text(`Téléphone: ${prescription.patient.phone}`);
    doc.moveDown();

    // Consultation (si liée)
    if (prescription.consultation) {
      doc.text(`Consultation du: ${new Date(prescription.consultation.datetime).toLocaleDateString("fr-FR")}`);
      if (prescription.consultation.diagnosis) {
        doc.moveDown();
        doc.text("Diagnostic:", { underline: true });
        doc.text(prescription.consultation.diagnosis);
      }
      doc.moveDown();
    }

    // Médicaments
    doc.text("Médicaments prescrits:", { underline: true });
    const meds = (prescription.medications || []) as any[];
    if (meds.length === 0) {
      doc.text("Aucun médicament prescrit.");
    } else {
      meds.forEach((m, idx) => {
        doc.moveDown(0.2);
        const lines = [`• ${m.name || "Médicament"}`];
        if (m.dosage) lines.push(`Dosage: ${m.dosage}`);
        if (m.frequency) lines.push(`Fréquence: ${m.frequency}`);
        if (m.duration) lines.push(`Durée: ${m.duration} jours`);
        if (m.notes) lines.push(`Notes: ${m.notes}`);
        doc.fontSize(11).text(lines.join(" | "));
      });
    }

    doc.moveDown(2);
    doc.fontSize(10).text("Ce document a été généré électroniquement.", { align: "center" });
    doc.text("Signature non requise selon l'article R. 4127-6 du Code de la santé publique.", { align: "center" });

    doc.end();
  } catch (err) {
    console.error("Erreur génération PDF:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Erreur lors de la génération du PDF" });
    }
  }
}