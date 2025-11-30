import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { requireRole } from "../../../server/rbac";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // GET - Liste des factures
    if (req.method === "GET") {
      const session = await requireRole(req, res, ["ADMIN", "RECEPTIONIST"]);
      if (!session) return;

      const invoices = await prisma.invoice.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true
            }
          },
          consultation: true
        },
      });

      return res.status(200).json(invoices);
    }

    // POST - Créer une facture
    if (req.method === "POST") {
      const session = await requireRole(req, res, ["ADMIN", "RECEPTIONIST"]);
      if (!session) return;

      const { patientId, consultationId, amount, currency } = req.body;

      const invoice = await prisma.invoice.create({
        data: {
          patientId,
          consultationId: consultationId ?? null,
          amount,
          currency: currency ?? "eur",
          status: "PENDING",
        },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true
            }
          },
          consultation: true
        },
      });

      return res.status(201).json(invoice); // ✅ Correction : 201 au lieu de 21
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}