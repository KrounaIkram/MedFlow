"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

type Appointment = {
  id: string;
  date: string;
  type: string;
  status: string;
  notes?: string | null;
  patient: { id: string; firstName: string; lastName: string };
  doctor: { id: string; name: string };
};

type Consultation = {
  id: string;
  diagnosis: string | null;
  treatment: string | null;
  notes: string | null;
  datetime: string;
  patient: { firstName: string; lastName: string };
};

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [formData, setFormData] = useState({
    diagnosis: "",
    treatment: "",
    notes: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [apptRes, consultRes] = await Promise.all([
        fetch("/api/appointments"),
        fetch("/api/consultations"),
      ]);
      if (apptRes.ok) setAppointments(await apptRes.json());
      if (consultRes.ok) setConsultations(await consultRes.json());
    } catch (err) {
      toast.error("Erreur chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtrer les RDV du jour POUR CE MÉDECIN
  const todayAppointments = appointments.filter(appt => {
    const apptDate = new Date(appt.date);
    return (
      apptDate.toDateString() === new Date().toDateString() &&
      ["SCHEDULED", "CONFIRMED"].includes(appt.status)
    );
  });

  // Confirmer un RDV
  const handleConfirm = async (id: string) => {
    try {
      const res = await fetch(`/api/appointments?id=${id}&action=confirm`, { method: "POST" });
      if (res.ok) {
        toast.success("RDV confirmé !");
        fetchData();
      } else throw new Error();
    } catch (err) {
      toast.error("Erreur confirmation");
    }
  };

  // Annuler un RDV
  const handleCancel = async (id: string) => {
    try {
      const res = await fetch(`/api/appointments?id=${id}&action=cancel`, { method: "POST" });
      if (res.ok) {
        toast.success("RDV annulé !");
        fetchData();
      } else throw new Error();
    } catch (err) {
      toast.error("Erreur annulation");
    }
  };

  // Ouvrir le formulaire de consultation
  const openConsultationForm = (appt: Appointment) => {
    setSelectedAppointment(appt);
    setIsConsultationOpen(true);
    setFormData({ diagnosis: "", treatment: "", notes: "" });
  };

  // Soumettre la consultation
  const handleSubmitConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: selectedAppointment.id,
          diagnosis: formData.diagnosis,
          treatment: formData.treatment,
          notes: formData.notes,
        }),
      });

      if (res.ok) {
        toast.success("Consultation enregistrée !");
        setIsConsultationOpen(false);
        fetchData();
      } else throw new Error();
    } catch (err) {
      toast.error("Erreur enregistrement");
    }
  };

  // Télécharger l'ordonnance PDF
  const downloadPrescription = (consultationId: string) => {
    window.open(`/api/prescriptions/pdf/${consultationId}`, "_blank");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Dashboard Médecin</h1>

      {loading ? (
        <p className="text-center">Chargement...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rendez-vous du jour */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Rendez-vous Aujourd'hui</h2>
            {todayAppointments.length === 0 ? (
              <p>Aucun rendez-vous aujourd'hui.</p>
            ) : (
              <div className="space-y-4">
                {todayAppointments.map(appt => (
                  <div key={appt.id} className="p-4 border rounded-lg">
                    <p className="font-medium">{appt.patient.firstName} {appt.patient.lastName}</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(appt.date), "HH:mm")} • {appt.type}
                    </p>
                    <p className="text-sm mt-1">
                      <span className="font-semibold">Statut:</span>{" "}
                      <span className={
                        appt.status === "SCHEDULED" 
                          ? "text-yellow-600" 
                          : appt.status === "CONFIRMED" 
                            ? "text-green-600" 
                            : "text-red-600"
                      }>
                        {appt.status}
                      </span>
                    </p>
                    <div className="flex gap-2 mt-3">
                      {appt.status === "SCHEDULED" && (
                        <>
                          <button
                            onClick={() => handleConfirm(appt.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Confirmer
                          </button>
                          <button
                            onClick={() => handleCancel(appt.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Annuler
                          </button>
                        </>
                      )}
                      {["SCHEDULED", "CONFIRMED"].includes(appt.status) && (
                        <button
                          onClick={() => openConsultationForm(appt)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Consulter
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Dernières consultations */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Dernières Consultations</h2>
            {consultations.length === 0 ? (
              <p>Aucune consultation.</p>
            ) : (
              <div className="space-y-4">
                {consultations.slice(0, 5).map(cons => (
                  <div key={cons.id} className="p-4 border rounded-lg">
                    <p className="font-medium">{cons.patient.firstName} {cons.patient.lastName}</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(cons.datetime), "dd/MM/yyyy HH:mm")}
                    </p>
                    {cons.diagnosis && (
                      <p className="mt-2 text-sm">
                        <span className="font-semibold">Diagnostic:</span> {cons.diagnosis}
                      </p>
                    )}
                    <button
                      onClick={() => downloadPrescription(cons.id)}
                      className="mt-2 bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded text-sm"
                    >
                      Ordonnance PDF
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Modal Consultation */}
      {isConsultationOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  Consultation - {selectedAppointment.patient.firstName} {selectedAppointment.patient.lastName}
                </h2>
                <button onClick={() => setIsConsultationOpen(false)}>✕</button>
              </div>

              <form onSubmit={handleSubmitConsultation} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Diagnostic</label>
                  <textarea
                    value={formData.diagnosis}
                    onChange={e => setFormData({ ...formData, diagnosis: e.target.value })}
                    className="w-full p-2 border rounded"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Traitement</label>
                  <textarea
                    value={formData.treatment}
                    onChange={e => setFormData({ ...formData, treatment: e.target.value })}
                    className="w-full p-2 border rounded"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full p-2 border rounded"
                    rows={2}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsConsultationOpen(false)}
                    className="px-4 py-2 border rounded"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
