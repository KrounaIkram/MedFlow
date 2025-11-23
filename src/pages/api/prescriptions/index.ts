import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { requireRole } from "../../../server/rbac";
import { prescriptionCreateSchema } from "../../../server/validators/prescription";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // GET list - ADMIN, DOCTOR (list all), RECEPTIONIST (list), PATIENT (only own via query)
    if (req.method === "GET") {
      const session = await requireRole(req, res, ["ADMIN", "DOCTOR", "RECEPTIONIST"]);
      if (!session) return;

      const { patientId, doctorId, from, to } = req.query;
      const where: any = {};
      if (patientId) where.patientId = String(patientId);
      if (doctorId) where.doctorId = String(doctorId);
      if (from || to) where.createdAt = {};
      if (from) where.createdAt.gte = new Date(String(from));
      if (to) where.createdAt.lte = new Date(String(to));

      const list = await prisma.prescription.findMany({
        where,
        include: { doctor: true, patient: true, consultation: true },
        orderBy: { createdAt: "desc" }
      });

      return res.status(200).json(list);
    }

    // POST create - ADMIN, DOCTOR, RECEPTIONIST
    if (req.method === "POST") {
      const session = await requireRole(req, res, ["ADMIN", "DOCTOR", "RECEPTIONIST"]);
      if (!session) return;

      const parse = prescriptionCreateSchema.safeParse(req.body);
      if (!parse.success) return res.status(400).json({ error: parse.error.format() });

      const data = parse.data;

      // Ensure consultation exists
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
