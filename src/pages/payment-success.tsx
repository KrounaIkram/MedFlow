// pages/payment-success.tsx
import Link from "next/link";
import { useEffect } from "react";

export default function PaymentSuccess() {
  // Optionnel : tu peux appeler une API ici pour rafraîchir l'état des factures
  // ou afficher un message personnalisé

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Paiement réussi !</h1>
        <p className="text-gray-600 mb-6">
          Votre facture a été payée avec succès. Vous recevrez un reçu par e-mail sous peu.
        </p>
        <Link
          href="/patient"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full transition"
        >
          Retour à mon espace
        </Link>
      </div>
    </div>
  );
}