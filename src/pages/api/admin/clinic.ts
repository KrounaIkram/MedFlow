// pages/api/admin/clinic.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { requireRole } from "../../../server/rbac";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await requireRole(req, res, ["ADMIN"]);
  if (!session) return;

  if (req.method === "GET") {
    const clinic = await prisma.clinic.findFirst({
      where: { ownerId: session.user.id },
    });

    return res.status(200).json(clinic);
  }

  if (req.method === "PUT") {
    const { name, address, phone, email, logo } = req.body;

    const clinic = await prisma.clinic.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!clinic) {
      return res.status(404).json({ error: "Clinique non trouvée" });
    }

    const updated = await prisma.clinic.update({
      where: { id: clinic.id },
      data: {
        name,
        address,
        phone,
        email,
        logo,
      },
    });

    return res.status(200).json(updated);
  }

  res.setHeader("Allow", ["GET", "PUT"]);
  return res.status(405).json({ error: "Méthode non autorisée" });
}
