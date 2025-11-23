import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { prescriptionUpdateSchema } from "../../../server/validators/prescription";
import { requireRole } from "../../../server/rbac";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    if (typeof id !== "string") return res.status(400).json({ error: "Invalid id" });

    // GET - ADMIN, DOCTOR, RECEPTIONIST, PATIENT (patient only own)
    if (req.method === "GET") {
      const session = await requireRole(req, res, ["ADMIN", "DOCTOR", "RECEPTIONIST", "PATIENT"]);
      if (!session) return;

      const p = await prisma.prescription.findUnique({
        where: { id },
        include: { doctor: true, patient: true, consultation: true }
      });
      if (!p) return res.status(404).json({ error: "Not found" });

      if (session.user.role === "PATIENT" && session.user.id !== p.patientId)
        return res.status(403).json({ error: "Access denied" });

      return res.status(200).json(p);
    }

    // PUT update - ADMIN, DOCTOR
    if (req.method === "PUT") {
      const session = await requireRole(req, res, ["ADMIN", "DOCTOR"]);
      if (!session) return;

      const parse = prescriptionUpdateSchema.safeParse(req.body);
      if (!parse.success) return res.status(400).json({ error: parse.error.format() });

      const updateData: any = {};
      if (parse.data.medications) updateData.medications = parse.data.medications as any;
      if (parse.data.notes !== undefined) updateData.notes = parse.data.notes;

      const updated = await prisma.prescription.update({
        where: { id },
        data: updateData,
        include: { doctor: true, patient: true, consultation: true }
      });

      return res.status(200).json(updated);
    }

    // DELETE - ADMIN only (or adapt)
    if (req.method === "DELETE") {
      const session = await requireRole(req, res, ["ADMIN"]);
      if (!session) return;

      await prisma.prescription.delete({ where: { id } });
      return res.status(204).end();
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
