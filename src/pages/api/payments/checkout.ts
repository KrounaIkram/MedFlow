// pages/api/payments/checkout.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

const TND_TO_EUR_RATE = 3.4;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("🚀 [PAYMENT] Requête reçue");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  // Récupérer la session
  const session = await getServerSession(req, res, authOptions);
  console.log("🔐 Session récupérée :", !!session);
  if (!session) {
    return res.status(401).json({ error: "Non authentifié" });
  }

  console.log("👤 Utilisateur connecté :", session.user.id, "Rôle :", session.user.role);
  if (session.user.role !== "PATIENT") {
    return res.status(403).json({ error: "Seul un patient peut payer" });
  }

  const { invoiceId } = req.body;
  if (!invoiceId) {
    return res.status(400).json({ error: "invoiceId requis" });
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { patient: true },
  });

  if (!invoice) {
    return res.status(404).json({ error: "Facture non trouvée" });
  }

  // Vérifier que le patient correspond
  const patient = await prisma.patient.findFirst({
    where: { ownerId: session.user.id },
  });

  if (!patient) {
    return res.status(403).json({ error: "Vous n'avez pas de dossier patient." });
  }

  if (invoice.patientId !== patient.id) {
    return res.status(403).json({ error: "Cette facture ne vous appartient pas." });
  }

  // Conversion TND → EUR
  const amountInTND = invoice.amount / 100;
  const amountInEUR = amountInTND / TND_TO_EUR_RATE;
  const amountInEURCents = Math.round(amountInEUR * 100);

  if (amountInEURCents < 50) {
    return res.status(400).json({ error: "Montant trop faible." });
  }

  try {
    const checkout = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Facture #${invoice.id}`,
              description: `Paiement - ${invoice.patient?.firstName || "Patient"}`,
            },
            unit_amount: amountInEURCents,
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
  } catch (err) {
    console.error("💥 Erreur Stripe:", err);
    return res.status(500).json({ error: "Erreur Stripe" });
  }
}
