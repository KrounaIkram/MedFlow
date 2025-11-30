// pages/api/consultations/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { consultationCreateSchema } from "../../../server/validators/consultation";
import { requireRole } from "../../../server/rbac";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const session = await requireRole(req, res, ["ADMIN", "DOCTOR", "RECEPTIONIST", "PATIENT"]);
      if (!session) return;

      const { doctorId, patientId, from, to } = req.query;

      const where: any = {};

      if (session.user.role === "PATIENT") {
        const patientRecord = await prisma.patient.findFirst({
          where: { ownerId: session.user.id },
        });
        if (!patientRecord) {
          return res.status(404).json({ error: "Patient record not found" });
        }
        where.patientId = patientRecord.id;
      } else {
        if (doctorId) where.doctorId = String(doctorId);
        if (patientId) where.patientId = String(patientId);
      }

      if (from || to) where.datetime = {};
      if (from) where.datetime.gte = new Date(String(from));
      if (to) where.datetime.lte = new Date(String(to));

      const consultations = await prisma.consultation.findMany({
        where,
        orderBy: { datetime: "desc" },
        include: { doctor: true, patient: { include: { owner: true } }, prescription: true },
      });

      return res.status(200).json(consultations);
    }

    if (req.method === "POST") {
      const session = await requireRole(req, res, ["ADMIN", "DOCTOR", "RECEPTIONIST"]);
      if (!session) return;

      const parse = consultationCreateSchema.safeParse(req.body);
      if (!parse.success) {
        return res.status(400).json({ error: "Invalid input", details: parse.error.flatten() });
      }

      const { patientId, datetime, duration, diagnosis, notes } = parse.data;

      const doctorId = session.user.id;

      const doctor = await prisma.user.findUnique({
        where: { id: doctorId, role: "DOCTOR" },
      });
      if (!doctor) {
        return res.status(403).json({ error: "You must be a doctor to create a consultation" });
      }

      const patient = await prisma.patient.findUnique({
        where: { id: patientId },
      });
      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }

      const created = await prisma.consultation.create({
        data: { // ✅ CORRIGÉ : "data" est requis
          doctorId,
          patientId,
          datetime: new Date(datetime),
          diagnosis,
          notes,
          duration,
        },
        include: {
          doctor: { select: { id: true, name: true } },
          patient: { include: { owner: { select: { name: true } } } },
        },
      });

      return res.status(201).json(created);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error("API consultation error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}