import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { requireRole } from "../../../server/rbac";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await requireRole(req, res, ["ADMIN", "RECEPTIONIST"]);
  if (!session) return;

  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: { invoice: true },
  });

  return res.status(200).json(payments);
}
