// pages/doctor/dashboard.tsx
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

// Types
type Patient = { id: string; firstName: string; lastName: string; email?: string | null; phone?: string | null };
type Appointment = { id: number; date: string; status: string; patient: Patient };
type Consultation = { id: number; datetime: string; diagnosis: string; patient: Patient; prescription?: any };
type Prescription = { 
  id: string; 
  createdAt: string; 
  medications: any[]; 
  patient: Patient; 
  consultation: Consultation;
};

export default function DoctorDashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<"agenda" | "dossiers" | "ordonnances" | "nouvelle">("agenda");

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  useEffect(() => {
    if (!session) return;

    const loadData = async () => {
      try {
        const apptRes = await fetch("/api/appointments");
        if (apptRes.ok) setAppointments(await apptRes.json());

        const patRes = await fetch("/api/patients");
        if (patRes.ok) setPatients(await patRes.json());

        const consultRes = await fetch("/api/consultations");
        if (consultRes.ok) setConsultations(await consultRes.json());

        const prescRes = await fetch("/api/prescriptions");
        if (prescRes.ok) setPrescriptions(await prescRes.json());
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, [session]);

  if (status === "loading") return <div>Chargement...</div>;
  if (!session || session.user.role !== "DOCTOR") return <div>Accès refusé</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Bienvenue, Dr. {session.user.name}</h1>

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button onClick={() => setActiveTab("agenda")} style={tabStyle(activeTab === "agenda")}>
          🗓️ Agenda
        </button>
        <button onClick={() => setActiveTab("dossiers")} style={tabStyle(activeTab === "dossiers")}>
          📁 Dossiers Médicaux
        </button>
        <button onClick={() => setActiveTab("ordonnances")} style={tabStyle(activeTab === "ordonnances")}>
          💊 Ordonnances
        </button>
        <button onClick={() => setActiveTab("nouvelle")} style={tabStyle(activeTab === "nouvelle")}>
          ➕ Nouvelle Consultation
        </button>
      </div>

      {activeTab === "agenda" && (
        <AgendaTab
          appointments={appointments}
          onAppointmentUpdate={(updatedAppt) => {
            setAppointments(prev =>
              prev.map(appt => (appt.id === updatedAppt.id ? updatedAppt : appt))
            );
          }}
        />
      )}
      {activeTab === "dossiers" && <DossiersTab patients={patients} consultations={consultations} />}
      {activeTab === "ordonnances" && (
        <OrdonnancesTab 
          prescriptions={prescriptions} 
          consultations={consultations}
          onPrescriptionCreated={(newPresc) => setPrescriptions(prev => [...prev, newPresc])} 
        />
      )}
      {activeTab === "nouvelle" && (
        <NouvelleConsultationTab
          patients={patients}
          onConsultationCreated={(newConsult: Consultation) =>
            setConsultations(prev => [...prev, newConsult])
          }
        />
      )}
    </div>
  );
}

// 🗓️ Agenda complet
const AgendaTab = ({ appointments, onAppointmentUpdate }: { 
  appointments: Appointment[]; 
  onAppointmentUpdate: (updated: Appointment) => void;
}) => {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "DONE": return "✅ Confirmé";
      case "CANCELLED": return "❌ Annulé";
      case "SCHEDULED": return "⏳ En attente";
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DONE": return "#4caf50";
      case "CANCELLED": return "#f44336";
      case "SCHEDULED": return "#ff9800";
      default: return "black";
    }
  };

  const handleUpdateStatus = async (id: number, status: "DONE" | "CANCELLED") => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        const updatedAppt: Appointment = await res.json();
        onAppointmentUpdate(updatedAppt);
      } else {
        let errorMessage = "Erreur inconnue";
        try {
          const errData = await res.json();
          errorMessage = errData.error || "Impossible de mettre à jour";
        } catch (e) {
          errorMessage = `Erreur ${res.status}: ${res.statusText}`;
        }
        alert("Erreur: " + errorMessage);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau");
    }
  };

  const sortedAppts = [...appointments].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div>
      <h2>🗓️ Tous vos rendez-vous</h2>
      {sortedAppts.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {sortedAppts.map(appt => (
            <div 
              key={appt.id} 
              style={{ 
                border: "1px solid #ddd", 
                padding: "14px", 
                borderRadius: "8px",
                backgroundColor: appt.status === "CANCELLED" ? "#ffebee" : "white"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <strong>{appt.patient.firstName} {appt.patient.lastName}</strong><br />
                  📅 {new Date(appt.date).toLocaleString("fr-FR", {
                    weekday: 'short', 
                    day: '2-digit', 
                    month: 'short', 
                    hour: '2-digit', 
                    minute: '2-digit'
                  })}
                  <br />
                  <span style={{ color: getStatusColor(appt.status) }}>
                    {getStatusLabel(appt.status)}
                  </span>
                </div>
                <div>
                  {appt.status === "SCHEDULED" && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(appt.id, "DONE")}
                        style={{
                          marginRight: "6px",
                          padding: "6px 10px",
                          backgroundColor: "#4caf50",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        ✅ Confirmer
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(appt.id, "CANCELLED")}
                        style={{
                          padding: "6px 100px",
                          backgroundColor: "#f44336",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        ❌ Annuler
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Aucun rendez-vous trouvé.</p>
      )}
    </div>
  );
};

// 📁 Dossiers Médicaux
const DossiersTab = ({ patients, consultations }: { patients: Patient[]; consultations: Consultation[] }) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const patientConsults = selectedPatient
    ? consultations.filter(c => c.patient.id === selectedPatient.id)
    : [];

  return (
    <div>
      <h2>📁 Dossiers Médicaux</h2>
      <div style={{ marginBottom: "10px" }}>
        <label>Sélectionner un patient :</label>
        <select onChange={e => {
          const id = e.target.value;
          setSelectedPatient(patients.find(p => p.id === id) || null);
        }}>
          <option value="">-- Tous --</option>
          {patients.map(p => (
            <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
          ))}
        </select>
      </div>

      {selectedPatient && (
        <div>
          <h3>Dossier de {selectedPatient.firstName} {selectedPatient.lastName}</h3>
          {patientConsults.length > 0 ? (
            <ul>
              {patientConsults.map(consult => (
                <li key={consult.id}>
                  <strong>{new Date(consult.datetime).toLocaleString()}</strong>
                  <br />Diagnostic: {consult.diagnosis}
                  {consult.prescription && <div>Ordonnance: {consult.prescription.notes}</div>}
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucune consultation.</p>
          )}
        </div>
      )}
    </div>
  );
};

// 💊 Ordonnances avec formulaire (lié à une consultation)
const OrdonnancesTab = ({ prescriptions, consultations, onPrescriptionCreated }: { 
  prescriptions: Prescription[]; 
  consultations: Consultation[];
  onPrescriptionCreated: (newPresc: Prescription) => void;
}) => {
  const [selectedConsultationId, setSelectedConsultationId] = useState<string>("");
  const [medications, setMedications] = useState<{ name: string; dosage: string; frequency: string; duration: string; notes: string }[]>([]);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  const addMedication = () => {
    setMedications(prev => [...prev, { name: "", dosage: "", frequency: "", duration: "", notes: "" }]);
  };

  const removeMedication = (index: number) => {
    setMedications(prev => prev.filter((_, i) => i !== index));
  };

  const updateMedication = (index: number, field: string, value: string) => {
    setMedications(prev =>
      prev.map((med, i) => (i === index ? { ...med, [field]: value } : med))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedConsultationId || medications.length === 0) {
      setMessage("Veuillez sélectionner une consultation et ajouter au moins un médicament.");
      return;
    }

    const selectedConsult = consultations.find(c => c.id.toString() === selectedConsultationId);
    if (!selectedConsult) {
      setMessage("Consultation invalide.");
      return;
    }

    try {
      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultationId: selectedConsultationId,
          patientId: selectedConsult.patient.id,
          medications,
          notes,
        }),
      });

      if (res.ok) {
        const newPresc: Prescription = await res.json();
        onPrescriptionCreated(newPresc);
        setMessage("Ordonnance créée avec succès !");
        setSelectedConsultationId("");
        setMedications([]);
        setNotes("");
      } else {
        let errorMessage = "Erreur inconnue";
        try {
          const errData = await res.json();
          errorMessage = errData.error || "Impossible de créer l'ordonnance";
        } catch (e) {
          errorMessage = `Erreur ${res.status}: ${res.statusText}`;
        }
        setMessage("Erreur: " + errorMessage);
      }
    } catch (err) {
      console.error(err);
      setMessage("Erreur réseau");
    }
  };

  return (
    <div>
      <h2>💊 Mes Ordonnances</h2>

      {/* Formulaire */}
      <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px", marginBottom: "20px", backgroundColor: "#f9f9f9" }}>
        <h3>➕ Créer une nouvelle ordonnance</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          
          <label>
            Consultation :
            <select 
              value={selectedConsultationId} 
              onChange={e => setSelectedConsultationId(e.target.value)} 
              required
              style={{ width: "100%", padding: "8px", marginTop: "4px" }}
            >
              <option value="">-- Sélectionner une consultation --</option>
              {consultations.map(c => (
                <option key={c.id} value={c.id.toString()}>
                  {new Date(c.datetime).toLocaleDateString("fr-FR")} - {c.patient.firstName} {c.patient.lastName}
                </option>
              ))}
            </select>
          </label>

          <div>
            <h4>Médicaments</h4>
            {medications.map((med, index) => (
              <div key={index} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto auto", gap: "6px", marginBottom: "6px", alignItems: "center" }}>
                <input type="text" placeholder="Médicament" value={med.name} onChange={e => updateMedication(index, "name", e.target.value)} required style={{ padding: "6px", fontSize: "14px" }} />
                <input type="text" placeholder="Dosage" value={med.dosage} onChange={e => updateMedication(index, "dosage", e.target.value)} style={{ padding: "6px", fontSize: "14px" }} />
                <input type="text" placeholder="Fréquence" value={med.frequency} onChange={e => updateMedication(index, "frequency", e.target.value)} style={{ padding: "6px", fontSize: "14px" }} />
                <input type="text" placeholder="Durée" value={med.duration} onChange={e => updateMedication(index, "duration", e.target.value)} style={{ padding: "6px", fontSize: "14px" }} />
                <input type="text" placeholder="Notes" value={med.notes} onChange={e => updateMedication(index, "notes", e.target.value)} style={{ padding: "6px", fontSize: "14px" }} />
                <button type="button" onClick={() => removeMedication(index)} style={{ padding: "4px 8px", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>❌</button>
              </div>
            ))}
            <button type="button" onClick={addMedication} style={{ marginTop: "8px", padding: "6px 12px", backgroundColor: "#2196f3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>➕ Ajouter un médicament</button>
          </div>

          <label>
            Notes générales :
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Instructions supplémentaires..."
              rows={2}
              style={{ width: "100%", padding: "8px", marginTop: "4px", fontSize: "14px" }}
            />
          </label>

          <button type="submit" style={{ padding: "10px 16px", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
            📄 Générer l'ordonnance
          </button>
        </form>
        {message && <p style={{ color: message.includes("Erreur") ? "red" : "green", margin: "10px 0", fontWeight: "bold" }}>{message}</p>}
      </div>

      {/* Liste */}
      <h3>📋 Liste des ordonnances</h3>
      {prescriptions.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {prescriptions.map(presc => (
            <div key={presc.id} style={{ border: "1px solid #eee", padding: "12px", borderRadius: "6px" }}>
              <p><strong>Patient:</strong> {presc.patient.firstName} {presc.patient.lastName}</p>
              <p><strong>Consultation:</strong> {new Date(presc.consultation.datetime).toLocaleDateString("fr-FR")}</p>
              <p><strong>Médicaments:</strong></p>
              <pre style={{ backgroundColor: "#f5f5f5", padding: "8px", borderRadius: "4px", whiteSpace: "pre-wrap", fontSize: "14px" }}>
                {JSON.stringify(presc.medications, null, 2)}
              </pre>
              <button 
                onClick={() => window.open(`/api/prescriptions/${presc.id}/pdf`, "_blank")}
                style={{ marginTop: "8px", padding: "6px 12px", backgroundColor: "#4caf50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
              >
                📄 Télécharger PDF
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>Aucune ordonnance trouvée.</p>
      )}
    </div>
  );
};

// ➕ Nouvelle Consultation
type NouvelleConsultationProps = {
  patients: Patient[];
  onConsultationCreated: (consult: Consultation) => void;
};

const NouvelleConsultationTab = ({ patients, onConsultationCreated }: NouvelleConsultationProps) => {
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [datetime, setDatetime] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPatientId || !datetime || !diagnosis) {
      setMessage("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: selectedPatientId,
          datetime,
          diagnosis,
          notes: notes || undefined,
        }),
      });

      if (res.ok) {
        const newConsult: Consultation = await res.json();
        onConsultationCreated(newConsult);
        setMessage("Consultation créée avec succès !");
        setSelectedPatientId("");
        setDatetime("");
        setDiagnosis("");
        setNotes("");
      } else {
        let errorMessage = "Erreur inconnue";
        try {
          const errData = await res.json();
          errorMessage = errData.error || "Impossible de créer la consultation";
        } catch (e) {
          errorMessage = `Erreur ${res.status}: ${res.statusText}`;
        }
        setMessage("Erreur: " + errorMessage);
        console.error("Erreur API:", res.status, res.statusText);
      }
    } catch (err) {
      console.error("Erreur réseau:", err);
      setMessage("Erreur de connexion.");
    }
  };

  return (
    <div>
      <h2>➕ Nouvelle Consultation</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
        <label>
          Patient :
          <select value={selectedPatientId} onChange={e => setSelectedPatientId(e.target.value)} required>
            <option value="">-- Sélectionner --</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
            ))}
          </select>
        </label>

        <label>
          Date et heure :
          <input type="datetime-local" value={datetime} onChange={e => setDatetime(e.target.value)} required />
        </label>

        <label>
          Diagnostic :
          <textarea 
            value={diagnosis} 
            onChange={e => setDiagnosis(e.target.value)} 
            required 
            rows={3}
            style={{ width: "100%", padding: "6px", marginTop: "4px" }}
          />
        </label>

        <label>
          Notes (facultatif) :
          <textarea 
            value={notes} 
            onChange={e => setNotes(e.target.value)} 
            rows={2}
            style={{ width: "100%", padding: "6px", marginTop: "4px" }}
          />
        </label>

        <button
          type="submit"
          style={{
            padding: "8px 16px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Créer
        </button>
        {message && (
          <p style={{ color: message.includes("Erreur") ? "red" : "green", margin: 0, fontWeight: "bold" }}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

const tabStyle = (isActive: boolean) => ({
  padding: "8px 16px",
  backgroundColor: isActive ? "#0070f3" : "#e0e0e0",
  color: isActive ? "white" : "black",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
});