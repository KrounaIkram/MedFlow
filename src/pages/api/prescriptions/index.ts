// pages/api/prescriptions/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { requireRole } from "../../../server/rbac";
import { prescriptionCreateSchema } from "../../../server/validators/prescription";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await requireRole(req, res, ["ADMIN", "DOCTOR", "RECEPTIONIST", "PATIENT"]);
    if (!session) return;

    // GET - Liste des ordonnances
    if (req.method === "GET") {
      const { patientId, doctorId, from, to } = req.query;
      const where: any = {};

      if (session.user.role === "PATIENT") {
        const patient = await prisma.patient.findFirst({
          where: { ownerId: session.user.id },
        });
        if (!patient) return res.status(200).json([]);
        where.patientId = patient.id;
      } else {
        if (patientId) where.patientId = String(patientId);
        if (doctorId) where.doctorId = String(doctorId);
        if (from || to) where.createdAt = {};
        if (from) where.createdAt.gte = new Date(String(from));
        if (to) where.createdAt.lte = new Date(String(to));
      }

      const prescriptions = await prisma.prescription.findMany({
        where,
        include: { doctor: true, patient: true, consultation: true },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json(prescriptions);
    }

    // POST - Créer une ordonnance
    if (req.method === "POST") {
      if (session.user.role === "PATIENT") {
        return res.status(403).json({ error: "Non autorisé" });
      }

      const parse = prescriptionCreateSchema.safeParse(req.body);
      if (!parse.success) {
        console.error("Validation error:", parse.error.flatten());
        return res.status(400).json({ error: "Données invalides", details: parse.error.flatten() });
      }

      const { patientId, medications, notes, consultationId } = parse.data;

      const patient = await prisma.patient.findUnique({ where: { id: patientId } });
      if (!patient) return res.status(404).json({ error: "Patient non trouvé" });

      const doctorId = session.user.id;
      const created = await prisma.prescription.create({
         data:{
          doctorId,
          patientId,
          medications: medications as any,
          notes: notes ?? undefined,
          consultationId: consultationId ?? undefined,
        },
        include: { doctor: true, patient: true, consultation: true },
      });

      return res.status(201).json(created);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}