// pages/api/consultations/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { consultationCreateSchema } from "../../../server/validators/consultation";
import { requireRole } from "../../../server/rbac";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const session = await requireRole(req, res, ["ADMIN", "DOCTOR", "RECEPTIONIST"]);
      if (!session) return;

      const { doctorId, patientId, from, to } = req.query;

      const where: any = {};
      if (doctorId) where.doctorId = String(doctorId);
      if (patientId) where.patientId = String(patientId);
      if (from || to) where.datetime = {};
      if (from) where.datetime.gte = new Date(String(from));
      if (to) where.datetime.lte = new Date(String(to));

      const consultations = await prisma.consultation.findMany({
        where,
        orderBy: { datetime: "desc" },
        include: { doctor: true, patient: true, prescription: true },
      });

      return res.status(200).json(consultations);
    }

    if (req.method === "POST") {
      // const session = await requireRole(req, res, ["ADMIN", "DOCTOR", "RECEPTIONIST"]);
      // if (!session) return;

      const parse = consultationCreateSchema.safeParse(req.body);
      if (!parse.success) return res.status(400).json({ error: parse.error.format() });

      const data = parse.data;

      // Récupérer le docteur
      const doctor = await prisma.user.findFirst({
        where: { name: data.doctorName, role: "DOCTOR" },
      });
      if (!doctor) return res.status(404).json({ error: "Doctor not found" });

      // Récupérer le patient user
      const patientUser = await prisma.user.findFirst({
        where: { name: data.patientName, role: "PATIENT" },
      });
      if (!patientUser) return res.status(404).json({ error: "Patient user not found" });

      // Récupérer le patient réel lié au user
      const patient = await prisma.patient.findFirst({
        where: { ownerId: patientUser.id },
      });
      if (!patient) return res.status(404).json({ error: "Patient record not found" });

      // Créer la consultation avec l'id correct du patient
      const created = await prisma.consultation.create({
        data: {
          doctorId: doctor.id,
          patientId: patient.id, // <-- id correct de Patient
          datetime: new Date(data.datetime),
          duration: data.duration ?? undefined,
          diagnosis: data.diagnosis ?? undefined,
          notes: data.notes ?? undefined,
        },
        include: { doctor: true, patient: true },
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
