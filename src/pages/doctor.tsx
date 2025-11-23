// app/doctor/page.tsx   (ou pages/doctor.tsx)
"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url, { credentials: "include" }).then(res => res.json());

export default function DoctorDashboard() {
  const { data: appointments, mutate } = useSWR("/api/appointments?today=true", fetcher);
  const [selectedAppt, setSelectedAppt] = useState<any>(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [meds, setMeds] = useState([{ name: "", dosage: "", frequency: "", duration: "", notes: "" }]);
  const [notes, setNotes] = useState("");

  const addMed = () => setMeds([...meds, { name: "", dosage: "", frequency: "", duration: "", notes: "" }]);

  const saveConsultation = async () => {
    if (!selectedAppt) return;

    const res = await fetch("/api/consultations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appointmentId: selectedAppt.id,
        diagnosis,
        notes,
        medications: meds.filter(m => m.name),
      }),
    });

    if (res.ok) {
      alert("Consultation enregistrée ! PDF généré et envoyé au patient");
      mutate();
      setSelectedAppt(null);
      setDiagnosis("");
      setNotes("");
      setMeds([{ name: "", dosage: "", frequency: "", duration: "", notes: "" }]);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord Médecin</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Liste RDV du jour */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">RDV du jour</h2>
          {appointments?.map((appt: any) => (
            <div key={appt.id} className={`p-4 mb-3 rounded-lg border ${selectedAppt?.id === appt.id ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}>
              <div className="font-bold">{appt.patient.firstName} {appt.patient.lastName}</div>
              <div>{new Date(appt.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</div>
              <button
                onClick={() => setSelectedAppt(appt)}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Commencer la consultation
              </button>
            </div>
          ))}
        </div>

        {/* Formulaire consultation */}
        {selectedAppt && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">
              Consultation - {selectedAppt.patient.firstName} {selectedAppt.patient.lastName}
            </h2>

            <div className="mb-6">
              <label className="block font-bold mb-2">Diagnostic</label>
              <textarea
                value={diagnosis}
                onChange={e => setDiagnosis(e.target.value)}
                className="w-full p-3 border rounded-lg"
                rows={4}
                placeholder="Entrez le diagnostic..."
              />
            </div>

            <div className="mb-6">
              <label className="block font-bold mb-2">Ordonnance</label>
              {meds.map((med, i) => (
                <div key={i} className="grid grid-cols-2 gap-3 mb-3 p-3 bg-gray-50 rounded">
                  <input placeholder="Nom du médicament" value={med.name} onChange={e => {
                    const newMeds = [...meds];
                    newMeds[i].name = e.target.value;
                    setMeds(newMeds);
                  }} />
                  <input placeholder="Dosage" value={med.dosage} onChange={e => {
                    const newMeds = [...meds];
                    newMeds[i].dosage = e.target.value;
                    setMeds(newMeds);
                  }} />
                  <input placeholder="Fréquence (ex: 3x/jour)" value={med.frequency} onChange={e => {
                    const newMeds = [...meds];
                    newMeds[i].frequency = e.target.value;
                    setMeds(newMeds);
                  }} />
                  <input placeholder="Durée (ex: 5 jours)" value={med.duration} onChange={e => {
                    const newMeds = [...meds];
                    newMeds[i].duration = e.target.value;
                    setMeds(newMeds);
                  }} />
                </div>
              ))}
              <button onClick={addMed} className="bg-gray-600 text-white px-4 py-2 rounded">+ Ajouter médicament</button>
            </div>

            <div className="mb-6">
              <label className="block font-bold mb-2">Notes supplémentaires</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full p-3 border rounded-lg"
                rows={3}
              />
            </div>

            <button
              onClick={saveConsultation}
              className="bg-green-600 text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-green-700"
            >
              Terminer & Générer le PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}