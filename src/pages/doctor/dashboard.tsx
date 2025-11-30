// pages/doctor/dashboard.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type Appointment = {
  id: number;
  date: string;
  type: string;
  status: string;
  notes?: string;
  doctor: { name: string };
  patient: { firstName: string; lastName: string };
};

type Consultation = {
  id: number;
  datetime: string;
  diagnosis: string;
  notes?: string;
  doctor: { name: string };
  patient: { firstName: string; lastName: string };
  prescription?: {
    id: number;
    medications: string[];
    instructions: string;
    createdAt: string;
  };
};

type Prescription = {
  id: number;
  consultationId: number;
  medications: string[];
  instructions: string;
  createdAt: string;
};

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Charger les données au montage
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Récupérer les rendez-vous du docteur
        const apptRes = await fetch("/api/appointments", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!apptRes.ok) throw new Error("Erreur lors du chargement des rendez-vous");
        const apptsData = await apptRes.json();
        setAppointments(apptsData);

        // Récupérer les consultations du docteur (dernières)
        const consultRes = await fetch("/api/consultations", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!consultRes.ok) throw new Error("Erreur lors du chargement des consultations");
        const consultsData = await consultRes.json();
        setConsultations(consultsData);

      } catch (err: any) {
        setError(err.message || "Une erreur inattendue est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fonction pour confirmer un RDV
  const confirmAppointment = async (appointmentId: number) => {
    if (!confirm("Confirmer ce rendez-vous ?")) return;

    try {
      const res = await fetch("/api/appointments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: appointmentId.toString(),
          date: new Date().toISOString(), // On ne change pas la date ici, juste le statut
          type: "CONSULTATION", // Type par défaut, à adapter si besoin
          notes: "Rendez-vous confirmé par le médecin.",
        }),
      });

      if (!res.ok) throw new Error("Échec de la confirmation");

      // Mettre à jour localement
      setAppointments(prev =>
        prev.map(appt =>
          appt.id === appointmentId ? { ...appt, status: "CONFIRMED" } : appt
        )
      );

      alert("Rendez-vous confirmé avec succès !");
    } catch (err: any) {
      alert(`Erreur : ${err.message}`);
    }
  };

  // Fonction pour annuler un RDV
  const cancelAppointment = async (appointmentId: number) => {
    if (!confirm("Annuler ce rendez-vous ?")) return;

    try {
      const res = await fetch("/api/appointments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: appointmentId.toString(),
          date: new Date().toISOString(),
          type: "CONSULTATION",
          notes: "Rendez-vous annulé par le médecin.",
        }),
      });

      if (!res.ok) throw new Error("Échec de l'annulation");

      // Mettre à jour localement
      setAppointments(prev =>
        prev.map(appt =>
          appt.id === appointmentId ? { ...appt, status: "CANCELLED" } : appt
        )
      );

      alert("Rendez-vous annulé avec succès !");
    } catch (err: any) {
      alert(`Erreur : ${err.message}`);
    }
  };

  // Fonction pour générer une ordonnance PDF (simulée ici, à remplacer par votre logique réelle)
  const generatePrescriptionPDF = (consultationId: number) => {
    alert(`Génération de l'ordonnance PDF pour la consultation #${consultationId}...`);
    // Ici, vous pouvez rediriger vers une page de génération PDF ou appeler une API dédiée
    // Exemple : router.push(`/prescriptions/${consultationId}/pdf`);
  };

  // Gestion du formulaire de création de consultation
  const [newConsultation, setNewConsultation] = useState({
    patientName: "",
    diagnosis: "",
    notes: "",
    medications: "", // Pour l'ordonnance
    instructions: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewConsultation(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitConsultation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newConsultation.patientName.trim()) {
      alert("Le nom du patient est requis.");
      return;
    }

    try {
      // Créer la consultation
      const consultRes = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorName: "Dr. Votre Nom", // À récupérer dynamiquement si possible
          patientName: newConsultation.patientName,
          datetime: new Date().toISOString(),
          duration: 30,
          diagnosis: newConsultation.diagnosis,
          notes: newConsultation.notes,
        }),
      });

      if (!consultRes.ok) throw new Error("Échec de la création de la consultation");

      const createdConsult = await consultRes.json();

      // Créer l'ordonnance associée
      const prescRes = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultationId: createdConsult.id,
          medications: newConsultation.medications.split(",").map(m => m.trim()).filter(Boolean),
          instructions: newConsultation.instructions,
        }),
      });

      if (!prescRes.ok) throw new Error("Échec de la création de l'ordonnance");

      const createdPresc = await prescRes.json();

      // Réinitialiser le formulaire
      setNewConsultation({
        patientName: "",
        diagnosis: "",
        notes: "",
        medications: "",
        instructions: "",
      });

      alert("Consultation et ordonnance créées avec succès !");
      // Optionnel : recharger les données
      // window.location.reload(); // Ou mettre à jour l'état localement

    } catch (err: any) {
      alert(`Erreur : ${err.message}`);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div style={{ color: 'red' }}>Erreur : {error}</div>;

  // Filtrer les RDV d'aujourd'hui
  const today = new Date().toDateString();
  const todaysAppointments = appointments.filter(
    appt => new Date(appt.date).toDateString() === today
  );

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>DashBoard Médecin</h1>

      {/* Section Rendez-vous Aujourd'hui */}
      <section>
        <h2>Rendez-vous Aujourd'hui</h2>
        {todaysAppointments.length > 0 ? (
          <ul>
            {todaysAppointments.map((appt) => (
              <li key={appt.id}>
                <strong>{appt.patient.firstName} {appt.patient.lastName}</strong> - {new Date(appt.date).toLocaleTimeString()}
                <br />
                Type: {appt.type}
                <br />
                Statut: {appt.status}
                <br />
                <button onClick={() => confirmAppointment(appt.id)} disabled={appt.status !== "SCHEDULED"}>
                  Confirmer
                </button>
                <button onClick={() => cancelAppointment(appt.id)} disabled={appt.status !== "SCHEDULED"}>
                  Annuler
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun rendez-vous aujourd'hui.</p>
        )}
      </section>

      {/* Section Dernières Consultations */}
      <section>
        <h2>Dernières Consultations</h2>
        {consultations.length > 0 ? (
          <ul>
            {consultations.map((consult) => (
              <li key={consult.id}>
                <strong>{consult.patient.firstName} {consult.patient.lastName}</strong>
                <br />
                {new Date(consult.datetime).toLocaleString()}
                <br />
                Diagnostic: {consult.diagnosis}
                <br />
                {consult.prescription && (
                  <button onClick={() => generatePrescriptionPDF(consult.id)}>
                    Ordonnance PDF
                  </button>
                )}
                {!consult.prescription && (
                  <span style={{ color: 'gray' }}>Pas d'ordonnance associée</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucune consultation récente.</p>
        )}
      </section>

      {/* Formulaire Nouvelle Consultation */}
      <section>
        <h2>Créer une Nouvelle Consultation</h2>
        <form onSubmit={handleSubmitConsultation}>
          <div>
            <label>Patient (Nom complet):</label>
            <input
              type="text"
              name="patientName"
              value={newConsultation.patientName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Diagnostic:</label>
            <textarea
              name="diagnosis"
              value={newConsultation.diagnosis}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Notes:</label>
            <textarea
              name="notes"
              value={newConsultation.notes}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Médicaments (séparés par des virgules):</label>
            <input
              type="text"
              name="medications"
              value={newConsultation.medications}
              onChange={handleInputChange}
              placeholder="Ex: Paracétamol, Ibuprofène"
            />
          </div>
          <div>
            <label>Instructions:</label>
            <textarea
              name="instructions"
              value={newConsultation.instructions}
              onChange={handleInputChange}
              placeholder="Ex: Prendre 1 comprimé toutes les 6 heures"
            />
          </div>
          <button type="submit">Enregistrer Consultation & Ordonnance</button>
        </form>
      </section>
    </div>
  );
}