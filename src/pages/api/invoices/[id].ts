import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { requireRole } from "../../../server/rbac";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== "string")
    return res.status(400).json({ error: "Invalid ID" });

  try {
    // READ invoice
    if (req.method === "GET") {
      const session = await requireRole(req, res, ["ADMIN", "RECEPTIONIST", "PATIENT"]);
      if (!session) return;

      const invoice = await prisma.invoice.findUnique({
        where: { id },
        include: { patient: true, consultation: true },
      });

      if (!invoice) return res.status(404).json({ error: "Not found" });

      if (session.user.role === "PATIENT" && session.user.id !== invoice.patientId)
        return res.status(403).json({ error: "Forbidden" });

      return res.status(200).json(invoice);
    }

    // UPDATE invoice (only admin)
    if (req.method === "PUT") {
      const session = await requireRole(req, res, ["ADMIN"]);
      if (!session) return;

      const { status } = req.body;

      const updated = await prisma.invoice.update({
        where: { id },
        data: { status },
      });

      return res.status(200).json(updated);
    }

    // CANCEL invoice (admin only)
    if (req.method === "DELETE") {
      const session = await requireRole(req, res, ["ADMIN"]);
      if (!session) return;

      await prisma.invoice.update({
        where: { id },
        data: { status: "CANCELED" },
      });

      return res.status(204).end();
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
