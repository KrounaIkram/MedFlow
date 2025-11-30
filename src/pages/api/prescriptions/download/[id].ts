// pages/api/prescriptions/download/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { requireRole } from "../../../../server/rbac";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const session = await requireRole(req, res, ["PATIENT", "DOCTOR", "ADMIN"]);
  if (!session) return;

  const { id } = req.query;
  if (typeof id !== "string") {
    return res.status(400).json({ error: "ID invalide" });
  }

  const prescription = await prisma.prescription.findUnique({
    where: { id },
    include: { patient: { include: { owner: true } } },
  });

  if (!prescription) {
    return res.status(404).json({ error: "Ordonnance introuvable" });
  }

  // 🔒 Vérification d'accès
  let hasAccess = false;
  if (session.user.role === "PATIENT") {
    hasAccess = prescription.patient.ownerId === session.user.id;
  } else if (session.user.role === "DOCTOR") {
    hasAccess = prescription.doctorId === session.user.id;
  } else {
    hasAccess = true;
  }

  if (!hasAccess) {
    return res.status(403).json({ error: "Accès refusé" });
  }

  // ✅ Redirection vers le PDF
  res.redirect(`/api/prescriptions/${id}/pdf`);
}