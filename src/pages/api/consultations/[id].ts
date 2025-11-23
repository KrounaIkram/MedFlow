// src/pages/api/consultations/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { consultationUpdateSchema } from "../../../server/validators/consultation";
import { requireRole } from "../../../server/rbac";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    if (typeof id !== "string") {
      return res.status(400).json({ error: "Invalid id" });
    }

    // GET single consultation
    if (req.method === "GET") {
      const session = await requireRole(req, res, ["ADMIN", "DOCTOR", "RECEPTIONIST", "PATIENT"]);
      if (!session) return;

      const consult = await prisma.consultation.findUnique({
        where: { id },
        include: { doctor: true, patient: true, prescription: true },
      });

      if (!consult) {
        return res.status(404).json({ error: "Consultation not found" });
      }

      // Patients can only see their own consultations
      if (session.user.role === "PATIENT" && session.user.id !== consult.patient.ownerId) {
        return res.status(403).json({ error: "Access denied" });
      }

      return res.status(200).json(consult);
    }

    // PUT - update consultation
    if (req.method === "PUT") {
      const session = await requireRole(req, res, ["ADMIN", "DOCTOR", "RECEPTIONIST"]);
      if (!session) return;

      const parse = consultationUpdateSchema.safeParse(req.body);
      if (!parse.success) {
        return res.status(400).json({ error: parse.error.format() });
      }

      const data = parse.data;
      const updateData: any = {};

      if (data.datetime) updateData.datetime = new Date(data.datetime);
      if (data.duration !== undefined) updateData.duration = data.duration;
      if (data.diagnosis !== undefined) updateData.diagnosis = data.diagnosis;
      if (data.notes !== undefined) updateData.notes = data.notes;

      const updated = await prisma.consultation.update({
        where: { id },
        data: updateData,
        include: { doctor: true, patient: true, prescription: true },
      });

      return res.status(200).json(updated);
    }

    // DELETE - ADMIN only
    if (req.method === "DELETE") {
      const session = await requireRole(req, res, ["ADMIN"]);
      if (!session) return;

      await prisma.consultation.delete({ where: { id } });
      return res.status(204).end();
    }

    // Method not allowed
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).end();
  } catch (err) {
    console.error("Consultation [id] API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}