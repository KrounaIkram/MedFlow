import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { requireRole } from "../../../server/rbac";
import { patientCreateSchema } from "../../../server/validators/patient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "GET") {
    const session = await requireRole(req, res, ["ADMIN", "DOCTOR", "RECEPTIONIST"]);
    if (!session) return;

    const patient = await prisma.patient.findUnique({ where: { id: String(id) } });
    return res.status(200).json(patient);
  }

  if (req.method === "PUT") {
    const session = await requireRole(req, res, ["ADMIN", "DOCTOR"]);
    if (!session) return;

    const parse = patientCreateSchema.partial().safeParse(req.body);
    if (!parse.success)
      return res.status(400).json({ error: parse.error.format() });

    const updated = await prisma.patient.update({
      where: { id: String(id) },
      data: parse.data
    });

    return res.status(200).json(updated);
  }

  if (req.method === "DELETE") {
    const session = await requireRole(req, res, ["ADMIN"]);
    if (!session) return;

    await prisma.patient.delete({ where: { id: String(id) } });
    return res.status(204).end();
  }

  return res.status(405).end();
}
