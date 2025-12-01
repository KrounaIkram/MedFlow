"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

type Appointment = {
  id: string;
  date: string;
  type: string;
  status: string;
  notes?: string | null;
  doctor: { name: string };
};

type Doctor = {
  id: string;
  name: string;
};

type Invoice = {
  id: string;
  amount: number; // en centimes
  currency: string;
  status: "PENDING" | "PAID" | "CANCELED";
  createdAt: string;
};

type Prescription = {
  id: string;
  createdAt: string;
  doctor: { name: string };
  patient: { firstName: string; lastName: string };
  consultation: { id: string; datetime: string } | null;
};

export default function PatientPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedType, setSelectedType] = useState("CONSULTATION");
  const [notes, setNotes] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const apptRes = await fetch("/api/appointments");
      if (!apptRes.ok) throw new Error("Erreur chargement rendez-vous");
      const apptData = await apptRes.json();
      setAppointments(apptData);

      const docRes = await fetch("/api/users/doctors");
      if (!docRes.ok) throw new Error("Erreur chargement docteurs");
      const docData = await docRes.json();
      setDoctors(docData);

      // ✅ Bon endpoint : factures du patient
      const invoiceRes = await fetch("/api/patients/me/invoices");
      if (invoiceRes.ok) {
        setInvoices(await invoiceRes.json());
      }

      const prescRes = await fetch("/api/prescriptions");
      if (prescRes.ok) {
        setPrescriptions(await prescRes.json());
      }
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message || "Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitAppointment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);

    try {
      if (!selectedDate) throw new Error("Veuillez sélectionner une date");

      const dateObj = new Date(selectedDate);
      const day = dateObj.getDay();
      const hour = dateObj.getHours();

      if ((day === 0 || day === 6) && hour >= 12) {
        throw new Error("Rendez-vous impossible le samedi ou dimanche après 12h");
      }

      const isoDate = dateObj.toISOString();

      if (editingId) {
        const res = await fetch("/api/appointments", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            appointmentId: editingId,
            date: isoDate,
            type: selectedType,
            notes: notes || undefined,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error?.message || "Erreur lors de la modification");
        }

        toast.success("Rendez-vous modifié avec succès !");
      } else {
        if (!selectedDoctor) throw new Error("Veuillez sélectionner un docteur");

        const res = await fetch("/api/appointments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            doctorName: selectedDoctor,
            date: isoDate,
            type: selectedType,
            notes: notes || undefined,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error?.message || "Erreur lors de la création");
        }

        toast.success("Rendez-vous créé avec succès !");
      }

      await fetchData();

      setSelectedDoctor("");
      setSelectedDate("");
      setSelectedType("CONSULTATION");
      setNotes("");
      setEditingId(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erreur serveur");
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingId(appointment.id.toString());
    setSelectedDoctor(appointment.doctor.name);
    setSelectedDate(new Date(appointment.date).toISOString().slice(0, 16));
    setSelectedType(appointment.type);
    setNotes(appointment.notes || "");
  };

  // ✅ Paiement : appelle /api/invoices/pay
  const handlePayInvoice = async (invoiceId: string) => {
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Impossible de lancer le paiement");
      }

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("URL de redirection manquante");
      }
    } catch (err: any) {
      toast.error(err.message || "Erreur lors du lancement du paiement");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Interface Patient</h1>

      {loading ? (
        <p className="text-center">Chargement...</p>
      ) : (
        <>
          {/* Rendez-vous */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Mes Rendez-vous</h2>
            {appointments.length === 0 ? (
              <p>Aucun rendez-vous trouvé.</p>
            ) : (
              <ul className="space-y-3">
                {appointments.map((a) => (
                  <li key={a.id} className="p-4 border rounded-lg shadow-sm flex justify-between items-start">
                    <div>
                      <p><strong>Date :</strong> {new Date(a.date).toLocaleString()}</p>
                      <p><strong>Type :</strong> {a.type}</p>
                      <p><strong>Docteur :</strong> {a.doctor.name}</p>
                      <p><strong>Status :</strong> {a.status}</p>
                      {a.notes && <p><strong>Notes :</strong> {a.notes}</p>}
                    </div>
                    <button
                      onClick={() => handleEdit(a)}
                      className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-3 rounded mt-2"
                    >
                      Modifier
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Factures */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Mes Factures</h2>
            {invoices.length === 0 ? (
              <p>Aucune facture trouvée.</p>
            ) : (
              <ul className="space-y-3">
                {invoices.map((invoice) => (
                  <li key={invoice.id} className="p-4 border rounded-lg flex justify-between items-center">
                    <div>
                      <p><strong>Facture #{invoice.id}</strong></p>
                      <p>Montant : {(invoice.amount / 100).toFixed(2)} {invoice.currency.toUpperCase()}</p>
                      <p>Status : 
                        {invoice.status === "PAID" ? "✅ Payée" : 
                         invoice.status === "CANCELED" ? "❌ Annulée" : "⏳ En attente"}
                      </p>
                    </div>
                    {invoice.status === "PENDING" && (
                      <button
                        onClick={() => handlePayInvoice(invoice.id)}
                        className="bg-green-600 hover:bg-green-700 text-white py-1 px-4 rounded"
                      >
                        Payer
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Ordonnances */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Mes Ordonnances</h2>
            {prescriptions.length === 0 ? (
              <p>Aucune ordonnance disponible.</p>
            ) : (
              <ul className="space-y-3">
                {prescriptions.map((presc) => (
                  <li key={presc.id} className="p-4 border rounded-lg flex justify-between items-center">
                    <div>
                      <p><strong>Ordonnance #{presc.id}</strong></p>
                      <p>Médecin : {presc.doctor.name}</p>
                      <p>
                        Date : {presc.consultation
                          ? new Date(presc.consultation.datetime).toLocaleDateString()
                          : new Date(presc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => window.open(`/api/prescriptions/${presc.id}/pdf`, "_blank")}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded"
                    >
                      PDF
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Formulaire de RDV */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {editingId ? "Modifier le Rendez-vous" : "Créer un Rendez-vous"}
            </h2>
            <form onSubmit={handleSubmitAppointment} className="space-y-4 p-4 border rounded-lg shadow-sm">
              <div>
                <label className="block font-medium mb-1">Docteur</label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                  disabled={!!editingId}
                >
                  <option value="">Sélectionner un docteur</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Date & Heure</label>
                <input
                  type="datetime-local"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Type de RDV</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="CONSULTATION">Consultation</option>
                  <option value="URGENCY">Urgence</option>
                  <option value="FOLLOW_UP">Suivi</option>
                  <option value="CONTROL">Contrôle</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Notes (facultatif)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Ajoutez des notes si nécessaire"
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full bg-blue-600 hover:bg-blue-800 text-white py-2 rounded-full"
              >
                {creating ? "En cours..." : editingId ? "Modifier Rendez-vous" : "Créer Rendez-vous"}
              </button>
            </form>
          </section>
        </>
      )}
    </div>
  );
}