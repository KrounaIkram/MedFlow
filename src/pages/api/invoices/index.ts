import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { requireRole } from "../../../server/rbac";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // -------------------------------------
    // GET ALL INVOICES (ADMIN, RECEPTIONIST)
    // -------------------------------------
    if (req.method === "GET") {
      const session = await requireRole(req, res, ["ADMIN", "RECEPTIONIST"]);
      if (!session) return;

      const invoices = await prisma.invoice.findMany({
        orderBy: { createdAt: "desc" },
        include: { patient: true, consultation: true },
      });

      return res.status(200).json(invoices);
    }

    // --------------------
    // CREATE INVOICE (REC)
    // --------------------
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
      });

      return res.status(201).json(invoice);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
