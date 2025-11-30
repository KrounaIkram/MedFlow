import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { patientCreateSchema } from "../../../server/validators/patient";
import { requireRole } from "../../../server/rbac";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const session = await requireRole(req, res, ["ADMIN", "DOCTOR", "RECEPTIONIST"]);
    if (!session) return;

    const data = await prisma.patient.findMany();
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const session = await requireRole(req, res, ["ADMIN", "DOCTOR","RECEPTIONIST"]);
    if (!session) return;

    const parse = patientCreateSchema.safeParse(req.body);
    if (!parse.success)
      return res.status(400).json({ error: parse.error.format() });

    const created = await prisma.patient.create({ data: parse.data });
    return res.status(201).json(created);
  }

  return res.status(405).end();
}
