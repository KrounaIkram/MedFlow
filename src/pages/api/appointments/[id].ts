import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const appointmentId = Number(req.query.id);

  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { status } = req.body;

    // Vérification stricte selon ton enum Prisma
    const allowedStatuses = ["SCHEDULED", "CANCELLED", "DONE"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: `Status invalide. Valeurs acceptées : ${allowedStatuses.join(", ")}`,
      });
    }

    const updated = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status },
      include: {
        patient: true,
        doctor: true,
      },
    });

    return res.status(200).json(updated);

  } catch (error) {
    console.error("Erreur update appointment:", error);
    return res.status(500).json({ error: "Erreur interne" });
  }
}
