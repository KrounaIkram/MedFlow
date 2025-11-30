// pages/receptionist/dashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

// Types
type Patient = { id: string; firstName: string; lastName: string; email?: string | null; phone?: string | null };
type Doctor = { id: string; name: string };
type Appointment = {
  id: number;
  date: string;
  type: string;
  status: string;
  notes?: string | null;
  doctor: Doctor;
  patient: Patient;
};
type Consultation = {
  id: number;
  datetime: string;
  diagnosis: string;
  patient: Patient;
  doctor: Doctor;
};
type Invoice = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  paidAt?: string | null;
  createdAt: string;
  patient: Patient | null;
  consultation: Consultation | null;
};

export default function ReceptionistDashboard() {
  const [activeTab, setActiveTab] = useState<"appointments" | "patients" | "invoices">("appointments");

  // Données
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Formulaires
  const [newPatient, setNewPatient] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [newInvoice, setNewInvoice] = useState({ patientId: "", consultationId: "", amount: "" });

  // Chargement
  useEffect(() => {
    const loadData = async () => {
      const [apptRes, patRes, docRes, consultRes, invRes] = await Promise.all([
        fetch("/api/appointments"),
        fetch("/api/patients"),
        fetch("/api/users/doctors"),
        fetch("/api/consultations"),
        fetch("/api/invoices"),
      ]);

      if (apptRes.ok) setAppointments(await apptRes.json());
      if (patRes.ok) setPatients(await patRes.json());
      if (docRes.ok) setDoctors(await docRes.json());
      if (consultRes.ok) setConsultations(await consultRes.json());
      if (invRes.ok) setInvoices(await invRes.json());
    };

    loadData();
  }, []);

  // Créer un patient
  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPatient),
      });
      if (res.ok) {
        const newPat = await res.json();
        setPatients(prev => [...prev, newPat]);
        setNewPatient({ firstName: "", lastName: "", email: "", phone: "" });
        toast.success("Patient créé avec succès !");
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Erreur lors de la création du patient");
      }
    } catch (err) {
      toast.error("Erreur réseau");
    }
  };

  // Créer une facture en dinar tunisien (TND)
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(newInvoice.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Veuillez entrer un montant valide");
      return;
    }

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: newInvoice.patientId,
          consultationId: newInvoice.consultationId || undefined,
          amount: Math.round(amountNum * 100), // Convertir en centimes (ex: 50.5 TND → 5050)
          currency: "tnd", // ✅ Devise fixée en dinar tunisien
        }),
      });
      if (res.ok) {
        const newInv = await res.json();
        setInvoices(prev => [newInv, ...prev]);
        setNewInvoice({ patientId: "", consultationId: "", amount: "" });
        toast.success("Facture créée !");
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Erreur lors de la création de la facture");
      }
    } catch (err) {
      toast.error("Erreur réseau");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard Réceptionniste</h1>

      <div className="mb-6">
        <button
          onClick={() => setActiveTab("appointments")}
          className={`px-4 py-2 mr-2 rounded ${activeTab === "appointments" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          🗓️ Rendez-vous
        </button>
        <button
          onClick={() => setActiveTab("patients")}
          className={`px-4 py-2 mr-2 rounded ${activeTab === "patients" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          👤 Patients
        </button>
        <button
          onClick={() => setActiveTab("invoices")}
          className={`px-4 py-2 rounded ${activeTab === "invoices" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          💰 Facturation
        </button>
      </div>

      {/* Rendez-vous */}
      {activeTab === "appointments" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Liste des Rendez-vous</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Patient</th>
                  <th className="py-2 px-4 border">Docteur</th>
                  <th className="py-2 px-4 border">Date</th>
                  <th className="py-2 px-4 border">Type</th>
                  <th className="py-2 px-4 border">Statut</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(appt => (
                  <tr key={appt.id}>
                    <td className="py-2 px-4 border">{appt.patient.firstName} {appt.patient.lastName}</td>
                    <td className="py-2 px-4 border">{appt.doctor.name}</td>
                    <td className="py-2 px-4 border">{new Date(appt.date).toLocaleString()}</td>
                    <td className="py-2 px-4 border">{appt.type}</td>
                    <td className="py-2 px-4 border">
                      <span className={`px-2 py-1 rounded text-xs ${
                        appt.status === "DONE" ? "bg-green-100 text-green-800" :
                        appt.status === "CANCELLED" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {appt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Patients */}
      {activeTab === "patients" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Enregistrement Patient</h2>
          <form onSubmit={handleCreatePatient} className="mb-8 p-4 border rounded">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Prénom"
                value={newPatient.firstName}
                onChange={e => setNewPatient({...newPatient, firstName: e.target.value})}
                className="p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Nom"
                value={newPatient.lastName}
                onChange={e => setNewPatient({...newPatient, lastName: e.target.value})}
                className="p-2 border rounded"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newPatient.email}
                onChange={e => setNewPatient({...newPatient, email: e.target.value})}
                className="p-2 border rounded"
              />
              <input
                type="tel"
                placeholder="Téléphone"
                value={newPatient.phone}
                onChange={e => setNewPatient({...newPatient, phone: e.target.value})}
                className="p-2 border rounded"
              />
            </div>
            <button type="submit" className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
              ➕ Ajouter Patient
            </button>
          </form>

          <h2 className="text-2xl font-semibold mb-4">Liste des Patients</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Nom</th>
                  <th className="py-2 px-4 border">Email</th>
                  <th className="py-2 px-4 border">Téléphone</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(pat => (
                  <tr key={pat.id}>
                    <td className="py-2 px-4 border">{pat.firstName} {pat.lastName}</td>
                    <td className="py-2 px-4 border">{pat.email || "–"}</td>
                    <td className="py-2 px-4 border">{pat.phone || "–"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Facturation */}
      {activeTab === "invoices" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Créer une Facture</h2>
          <form onSubmit={handleCreateInvoice} className="mb-8 p-4 border rounded">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={newInvoice.patientId}
                onChange={e => setNewInvoice({...newInvoice, patientId: e.target.value})}
                className="p-2 border rounded"
                required
              >
                <option value="">Sélectionner un patient</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                ))}
              </select>
              <select
                value={newInvoice.consultationId}
                onChange={e => setNewInvoice({...newInvoice, consultationId: e.target.value})}
                className="p-2 border rounded"
              >
                <option value="">Aucune consultation (facture manuelle)</option>
                {consultations.map(c => (
                  <option key={c.id} value={c.id}>
                    {new Date(c.datetime).toLocaleString()} - {c.patient.firstName}
                  </option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                placeholder="Montant (TND)"
                value={newInvoice.amount}
                onChange={e => setNewInvoice({...newInvoice, amount: e.target.value})}
                className="p-2 border rounded"
                required
              />
              {/* ❌ Plus de selecteur de devise */}
            </div>
            <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
              💳 Créer Facture (TND)
            </button>
          </form>

          <h2 className="text-2xl font-semibold mb-4">Liste des Factures</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Patient</th>
                  <th className="py-2 px-4 border">Montant</th>
                  <th className="py-2 px-4 border">Statut</th>
                  <th className="py-2 px-4 border">Date</th>
                  {/* ❌ Colonne "Actions" supprimée */}
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id}>
                    <td className="py-2 px-4 border">
                      {inv.patient 
                        ? `${inv.patient.firstName} ${inv.patient.lastName}` 
                        : "Patient supprimé"}
                    </td>
                    <td className="py-2 px-4 border">
                      {(inv.amount / 100).toFixed(2)} TND
                    </td>
                    <td className="py-2 px-4 border">
                      <span className={`px-2 py-1 rounded text-xs ${
                        inv.status === "PAID" ? "bg-green-100 text-green-800" :
                        inv.status === "CANCELED" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 border">{new Date(inv.createdAt).toLocaleDateString()}</td>
                    {/* ❌ Plus de bouton "Payer" ici */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}