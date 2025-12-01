// pages/api/patients/me/invoices.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma"; // ✅ vérifie le chemin relatif
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end();
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Non authentifié" });
  }

  if (session.user.role !== "PATIENT") {
    return res.status(403).json({ error: "Accès réservé aux patients" });
  }

  try {
    // 🔑 ÉTAPE CLÉ : Trouver le dossier Patient lié à cet utilisateur
    const patient = await prisma.patient.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!patient) {
      return res.status(404).json({ error: "Dossier patient non trouvé" });
    }

    // ✅ Maintenant, on filtre les factures par le VRAI patientId
    const invoices = await prisma.invoice.findMany({
      where: { patientId: patient.id }, // ← patient.id, pas session.user.id !
      orderBy: { createdAt: "desc" },
      include: {
        patient: {
          select: { firstName: true, lastName: true }
        },
        consultation: true,
      },
    });

    return res.status(200).json(invoices);
  } catch (err) {
    console.error("Erreur lors de la récupération des factures :", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}