// pages/api/prescriptions/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { requireRole } from "../../../server/rbac";
import { prescriptionCreateSchema } from "../../../server/validators/prescription";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await requireRole(req, res, ["ADMIN", "DOCTOR", "RECEPTIONIST", "PATIENT"]);
    if (!session) return;

    // GET list
    if (req.method === "GET") {
      const { patientId, doctorId, from, to } = req.query;
      const where: any = {};

      // 🔒 Si c'est un PATIENT, il ne peut voir QUE ses ordonnances
      if (session.user.role === "PATIENT") {
        where.patientId = session.user.id;
      } else {
        // ADMIN / DOCTOR / RECEPTIONIST : peuvent filtrer
        if (patientId) where.patientId = String(patientId);
        if (doctorId) where.doctorId = String(doctorId);
        if (from || to) where.createdAt = {};
        if (from) where.createdAt.gte = new Date(String(from));
        if (to) where.createdAt.lte = new Date(String(to));
      }

      const list = await prisma.prescription.findMany({
        where,
        include: { doctor: true, patient: true, consultation: true },
        orderBy: { createdAt: "desc" }
      });

      return res.status(200).json(list);
    }

    // POST create - réservé aux professionnels
    if (req.method === "POST") {
      if (session.user.role === "PATIENT") {
        return res.status(403).json({ error: "Non autorisé" });
      }

      const parse = prescriptionCreateSchema.safeParse(req.body);
      if (!parse.success) return res.status(400).json({ error: parse.error.format() });

      const data = parse.data;
      const consult = await prisma.consultation.findUnique({ where: { id: data.consultationId } });
      if (!consult) return res.status(404).json({ error: "Consultation not found" });

      const created = await prisma.prescription.create({
        data: {
          consultationId: data.consultationId,
          doctorId: data.doctorId,
          patientId: data.patientId,
          medications: data.medications as any,
          notes: data.notes ?? undefined
        },
        include: { doctor: true, patient: true, consultation: true }
      });

      return res.status(201).json(created);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}