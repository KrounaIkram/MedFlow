import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { requireRole } from "../../../server/rbac";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await requireRole(req, res, ["ADMIN", "RECEPTIONIST"]);
  if (!session) return;

  const [totalPatients, totalInvoices, totalPaid] = await Promise.all([
    prisma.patient.count(),
    prisma.invoice.count(),
    prisma.invoice.count({ where: { status: "PAID" } }),
  ]);

  return res.status(200).json({
    totalPatients,
    totalInvoices,
    totalPaid,
  });
}
