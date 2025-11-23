import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import PDFDocument from "pdfkit";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    if (typeof id !== "string") return res.status(400).json({ error: "Invalid id" });

    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: { doctor: true, patient: true, consultation: true }
    });

    if (!prescription) return res.status(404).json({ error: "Prescription not found" });

    // Set headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=prescription-${prescription.id}.pdf`);

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    doc.pipe(res);

    // Header
    doc.fontSize(18).text("Ordonnance Médicale", { align: "center" });
    doc.moveDown();

    // Doctor info
    doc.fontSize(12).text(`Médecin: ${prescription.doctor?.name ?? ""}`);
    doc.text(`Email: ${prescription.doctor?.email ?? ""}`);
    doc.moveDown();

    // Patient info
    doc.text(`Patient: ${prescription.patient?.firstName ?? ""} ${prescription.patient?.lastName ?? ""}`);
    if (prescription.patient?.email) doc.text(`Email: ${prescription.patient.email}`);
    if (prescription.patient?.phone) doc.text(`Téléphone: ${prescription.patient.phone}`);
    doc.moveDown();

    // Consultation info
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

    // Prescriptions (medications)
    doc.text("Médicaments:", { underline: true });
    const meds = prescription.medications as any[];
    meds.forEach((m, idx) => {
      const lines = [`${idx + 1}. ${m.name}`];
      if (m.dosage) lines.push(`Dosage: ${m.dosage}`);
      if (m.frequency) lines.push(`Posologie: ${m.frequency}`);
      if (m.duration) lines.push(`Durée: ${m.duration}`);
      if (m.notes) lines.push(`Notes: ${m.notes}`);
      doc.moveDown(0.2);
      doc.fontSize(11).text(lines.join(" · "));
    });

    doc.moveDown(2);
    doc.text("Signature du médecin: __________________________", { align: "left" });
    doc.end();
    // pdf is streamed to res by piping; no explicit res.end() needed here
  } catch (err) {
    console.error(err);
    if (!res.headersSent) res.status(500).json({ error: "Internal server error" });
  }
}
