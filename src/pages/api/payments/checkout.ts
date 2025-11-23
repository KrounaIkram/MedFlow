import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { prisma } from "../../../lib/prisma";
import { requireRole } from "../../../server/rbac";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await requireRole(req, res, ["ADMIN", "RECEPTIONIST"]);
  if (!session) return;

  const { invoiceId } = req.body;

  const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
  if (!invoice) return res.status(404).json({ error: "Invoice not found" });

  const checkout = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: invoice.currency,
          product_data: {
            name: `Consultation médicale - Facture #${invoice.id}`,
          },
          unit_amount: invoice.amount,
        },
        quantity: 1,
      },
    ],
    success_url: `${req.headers.origin}/payment-success`,
    cancel_url: `${req.headers.origin}/payment-cancel`,
    metadata: {
      invoiceId: invoice.id,
    },
  });

  return res.status(200).json({ url: checkout.url });
}
