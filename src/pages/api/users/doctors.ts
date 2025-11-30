import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { requireRole } from "../../../server/rbac";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Autorise PATIENT aussi
  const session = await requireRole(req, res, ["ADMIN", "PATIENT", "RECEPTIONIST", "DOCTOR"]);
  if (!session) return;

  if (req.method === "GET") {
    try {
      const doctors = await prisma.user.findMany({
        where: { role: "DOCTOR" },
        select: { id: true, name: true }, // on ne renvoie que l'ID et le nom
      });

      return res.status(200).json(doctors);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Impossible de récupérer les docteurs" });
    }
  }

  return res.status(405).end();
}
