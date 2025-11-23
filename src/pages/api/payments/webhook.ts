import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { prisma } from "../../../lib/prisma";

export const config = {
  api: { bodyParser: false },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const buf = await new Promise<Buffer>((resolve) => {
    let data: Uint8Array[] = [];
    req.on("data", (chunk) => data.push(chunk));
    req.on("end", () => resolve(Buffer.concat(data)));
  });

  const sig = req.headers["stripe-signature"]!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature error", err);
    return res.status(400).send(`Webhook error`);
  }

  // 🧾 Paiement réussi
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const invoiceId = session.metadata.invoiceId;

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: "PAID",
        paidAt: new Date(),
      },
    });

    await prisma.payment.create({
      data: {
        invoiceId,
        stripePaymentId: session.payment_intent,
        amount: session.amount_total,
        currency: session.currency,
        status: "SUCCEEDED",
      },
    });
  }

  return res.json({ received: true });
}
