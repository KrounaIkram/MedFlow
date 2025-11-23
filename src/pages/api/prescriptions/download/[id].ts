import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { requireRole } from "../../../../server/rbac";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await requireRole(req, res, ["PATIENT"]);
  if (!session) return;

  const { id } = req.query;

  const presc = await prisma.prescription.findUnique({
    where: { id: String(id) },
  });

  if (!presc) return res.status(404).json({ error: "Not found" });

  if (presc.patientId !== session.user.id)
    return res.status(403).json({ error: "Access denied" });

  return res.redirect(`/api/prescriptions/pdf/${id}`);
}
