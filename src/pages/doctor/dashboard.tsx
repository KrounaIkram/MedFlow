"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

// Types
type Patient = { id: string; firstName: string; lastName: string; email?: string; phone?: string };
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
        const [apptRes, patRes, consultRes, prescRes] = await Promise.all([
          fetch("/api/appointments"),
          fetch("/api/patients"),
          fetch("/api/consultations"),
          fetch("/api/prescriptions"),
        ]);

        if (apptRes.ok) setAppointments(await apptRes.json());
        if (patRes.ok) setPatients(await patRes.json());
        if (consultRes.ok) setConsultations(await consultRes.json());
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
    <div className="dashboard-wrapper">
      <h1>Bienvenue, Dr. {session.user.name}</h1>

      {/* Tabs */}
      <div className="tabs">
        <button className={activeTab === "agenda" ? "active" : ""} onClick={() => setActiveTab("agenda")}>🗓️ Agenda</button>
        <button className={activeTab === "dossiers" ? "active" : ""} onClick={() => setActiveTab("dossiers")}>📁 Dossiers Médicaux</button>
        <button className={activeTab === "ordonnances" ? "active" : ""} onClick={() => setActiveTab("ordonnances")}>💊 Ordonnances</button>
        <button className={activeTab === "nouvelle" ? "active" : ""} onClick={() => setActiveTab("nouvelle")}>➕ Nouvelle Consultation</button>
      </div>

      {/* Content */}
      <div className="tab-content">
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

      {/* Styles */}
      <style jsx>{`
        .dashboard-wrapper {
          font-family: Arial, sans-serif;
          padding: 20px;
          min-height: 100vh;
          background: url('https://i.pinimg.com/1200x/ae/f6/17/aef6170679bdead47b720fd69615d286.jpg') no-repeat center center fixed;
          background-size: cover;
          color: #333;
          animation: fadeIn 1.5s ease;
        }

        h1 {
          text-align: center;
          font-size: 32px;
          margin-bottom: 30px;
          color: #fff;
          text-shadow: 2px 2px 8px rgba(0,0,0,0.6);
          animation: fadeInDown 1s;
        }

        .tabs {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .tabs button {
          padding: 10px 20px;
          border-radius: 25px;
          border: none;
          cursor: pointer;
          font-weight: bold;
          background-color: #e0e0e0;
          color: black;
          transition: 0.3s;
        }

        .tabs button.active {
          background-color: #fff;
          color: #0d47a1;
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }

        .tabs button:hover {
          transform: scale(1.1);
        }

        .tab-content h2 {
          color: #0d47a1;
          margin-bottom: 15px;
        }

        .tab-content h3 {
          color: #0d47a1;
          margin-top: 15px;
          margin-bottom: 10px;
        }

        .card {
          background: rgba(255,255,255,0.9);
          padding: 20px;
          border-radius: 15px;
          margin-bottom: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          transition: 0.3s;
        }

        .card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

        button.btn {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          transition: 0.3s;
        }

        button.btn-primary { background-color: #0d47a1; color: white; }
        button.btn-primary:hover { background-color: #1565c0; }

        button.btn-success { background-color: #4caf50; color: white; }
        button.btn-success:hover { background-color: #66bb6a; }

        button.btn-danger { background-color: #f44336; color: white; }
        button.btn-danger:hover { background-color: #e57373; }

        input, select, textarea {
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #90caf9;
          width: 100%;
          box-sizing: border-box;
          margin-top: 4px;
          margin-bottom: 6px;
          transition: 0.3s;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #0d47a1;
          box-shadow: 0 0 8px #0d47a1;
        }

        p.message {
          margin: 6px 0;
          font-weight: bold;
        }

        p.success { color: green; }
        p.error { color: red; }

        @keyframes fadeIn {0%{opacity:0;}100%{opacity:1;}}
        @keyframes fadeInDown {0%{opacity:0; transform:translateY(-20px);}100%{opacity:1; transform:translateY(0);}}
      `}</style>
    </div>
  );
}

// -----------------
// Agenda Tab
// -----------------
const AgendaTab = ({ appointments, onAppointmentUpdate }: { appointments: Appointment[]; onAppointmentUpdate: (updated: Appointment) => void }) => {
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
        alert("Erreur lors de la mise à jour");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau");
    }
  };

  const sortedAppts = [...appointments].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div>
      <h2>🗓️ Tous vos rendez-vous</h2>
      {sortedAppts.length > 0 ? (
        sortedAppts.map(appt => (
          <div key={appt.id} className="card">
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
              <div>
                <strong>{appt.patient.firstName} {appt.patient.lastName}</strong><br/>
                📅 {new Date(appt.date).toLocaleString("fr-FR", {weekday:'short', day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit'})}<br/>
                <span style={{color: getStatusColor(appt.status)}}>{getStatusLabel(appt.status)}</span>
              </div>
              <div>
                {appt.status === "SCHEDULED" && (
                  <>
                    <button className="btn btn-success" onClick={() => handleUpdateStatus(appt.id, "DONE")}>✅ Confirmer</button>
                    <button className="btn btn-danger" onClick={() => handleUpdateStatus(appt.id, "CANCELLED")}>❌ Annuler</button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (<p>Aucun rendez-vous trouvé.</p>)}
    </div>
  );
};

// -----------------
// Dossiers Tab
// -----------------
const DossiersTab = ({ patients, consultations }: { patients: Patient[]; consultations: Consultation[] }) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const patientConsults = selectedPatient ? consultations.filter(c => c.patient.id === selectedPatient.id) : [];

  return (
    <div>
      <h2>📁 Dossiers Médicaux</h2>
      <select onChange={e => setSelectedPatient(patients.find(p => p.id === e.target.value) || null)} value={selectedPatient?.id || ""}>
        <option value="">-- Tous --</option>
        {patients.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
      </select>

      {selectedPatient && (
        <div>
          <h3>Dossier de {selectedPatient.firstName} {selectedPatient.lastName}</h3>
          {patientConsults.length > 0 ? (
            patientConsults.map(consult => (
              <div key={consult.datetime} className="card">
                <strong>{new Date(consult.datetime).toLocaleString()}</strong><br/>
                Diagnostic: {consult.diagnosis}
                {consult.prescription && <div>Ordonnance: {consult.prescription.notes}</div>}
              </div>
            ))
          ) : <p>Aucune consultation.</p>}
        </div>
      )}
    </div>
  );
};

// -----------------
// Ordonnances Tab
// -----------------
const OrdonnancesTab = ({ prescriptions, consultations, onPrescriptionCreated }: { prescriptions: Prescription[]; consultations: Consultation[]; onPrescriptionCreated: (newPresc: Prescription) => void }) => {
  const [selectedConsultationId, setSelectedConsultationId] = useState("");
  const [medications, setMedications] = useState<any[]>([]);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  const addMedication = () => setMedications(prev => [...prev, {name:"", dosage:"", frequency:"", duration:"", notes:""}]);
  const removeMedication = (i:number) => setMedications(prev => prev.filter((_,idx)=>idx!==i));
  const updateMedication = (i:number, field:string, val:string) => setMedications(prev=>prev.map((m,idx)=>idx===i?{...m,[field]:val}:m));

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    if(!selectedConsultationId || medications.length===0){ setMessage("Sélectionner une consultation et ajouter au moins un médicament."); return;}
    const selectedConsult = consultations.find(c=>c.id.toString()===selectedConsultationId);
    if(!selectedConsult){ setMessage("Consultation invalide."); return;}
    try{
      const res = await fetch("/api/prescriptions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({consultationId:selectedConsultationId,patientId:selectedConsult.patient.id,medications,notes})});
      if(res.ok){
        const newPresc:Prescription = await res.json();
        onPrescriptionCreated(newPresc);
        setMessage("Ordonnance créée !");
        setSelectedConsultationId(""); setMedications([]); setNotes("");
      } else { setMessage("Erreur lors de la création"); }
    }catch(err){ console.error(err); setMessage("Erreur réseau"); }
  };

  return (
    <div>
      <h2>💊 Mes Ordonnances</h2>

      <div className="card">
        <h3>➕ Créer une nouvelle ordonnance</h3>
        <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          <select value={selectedConsultationId} onChange={e=>setSelectedConsultationId(e.target.value)} required>
            <option value="">-- Sélectionner une consultation --</option>
            {consultations.map(c=><option key={c.id} value={c.id}>{new Date(c.datetime).toLocaleDateString("fr-FR")} - {c.patient.firstName} {c.patient.lastName}</option>)}
          </select>

          {medications.map((med,i)=>(
            <div key={i} style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr auto", gap:"6px"}}>
              <input placeholder="Médicament" value={med.name} onChange={e=>updateMedication(i,"name",e.target.value)} required/>
              <input placeholder="Dosage" value={med.dosage} onChange={e=>updateMedication(i,"dosage",e.target.value)}/>
              <input placeholder="Fréquence" value={med.frequency} onChange={e=>updateMedication(i,"frequency",e.target.value)}/>
              <input placeholder="Durée" value={med.duration} onChange={e=>updateMedication(i,"duration",e.target.value)}/>
              <button type="button" className="btn btn-danger" onClick={()=>removeMedication(i)}>❌</button>
            </div>
          ))}
          <button type="button" className="btn btn-primary" onClick={addMedication}>➕ Ajouter un médicament</button>

          <textarea placeholder="Notes..." value={notes} onChange={e=>setNotes(e.target.value)} rows={2}/>

          <button type="submit" className="btn btn-primary">📄 Générer l'ordonnance</button>
        </form>
        {message && <p className={`message ${message.includes("Erreur")?"error":"success"}`}>{message}</p>}
      </div>

      <h3>📋 Liste des ordonnances</h3>
      {prescriptions.length>0 ? prescriptions.map(presc=>(
        <div key={presc.id} className="card">
          <p><strong>Patient:</strong> {presc.patient.firstName} {presc.patient.lastName}</p>
          <p><strong>Consultation:</strong> {new Date(presc.consultation.datetime).toLocaleDateString("fr-FR")}</p>
          <p><strong>Médicaments:</strong></p>
          <pre style={{background:"#f5f5f5",padding:"8px",borderRadius:"4px",whiteSpace:"pre-wrap"}}>{JSON.stringify(presc.medications,null,2)}</pre>
          <button className="btn btn-success" onClick={()=>window.open(`/api/prescriptions/${presc.id}/pdf`,"_blank")}>📄 Télécharger PDF</button>
        </div>
      )) : <p>Aucune ordonnance trouvée.</p>}
    </div>
  );
};

// -----------------
// Nouvelle Consultation Tab
// -----------------
type NouvelleConsultationProps = { patients: Patient[]; onConsultationCreated: (consult: Consultation) => void; };
const NouvelleConsultationTab = ({ patients, onConsultationCreated }: NouvelleConsultationProps) => {
  const [selectedPatientId,setSelectedPatientId]=useState("");
  const [datetime,setDatetime]=useState("");
  const [diagnosis,setDiagnosis]=useState("");
  const [notes,setNotes]=useState("");
  const [message,setMessage]=useState("");

  const handleSubmit=async(e:React.FormEvent)=>{
    e.preventDefault();
    if(!selectedPatientId || !datetime || !diagnosis){ setMessage("Tous les champs obligatoires"); return;}
    try{
      const res = await fetch("/api/consultations",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({patientId:selectedPatientId,datetime,diagnosis,notes})});
      if(res.ok){
        const newConsult:Consultation = await res.json();
        onConsultationCreated(newConsult);
        setMessage("Consultation créée !");
        setSelectedPatientId(""); setDatetime(""); setDiagnosis(""); setNotes("");
      } else setMessage("Erreur lors de la création");
    } catch(err){ console.error(err); setMessage("Erreur réseau"); }
  };

  return (
    <div>
      <h2>➕ Nouvelle Consultation</h2>
      <div className="card">
        <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          <select value={selectedPatientId} onChange={e=>setSelectedPatientId(e.target.value)} required>
            <option value="">-- Sélectionner un patient --</option>
            {patients.map(p=><option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
          </select>
          <input type="datetime-local" value={datetime} onChange={e=>setDatetime(e.target.value)} required/>
          <textarea placeholder="Diagnostic" value={diagnosis} onChange={e=>setDiagnosis(e.target.value)} rows={2} required/>
          <textarea placeholder="Notes complémentaires" value={notes} onChange={e=>setNotes(e.target.value)} rows={2}/>
          <button type="submit" className="btn btn-primary">Créer la consultation</button>
        </form>
        {message && <p className={`message ${message.includes("Erreur")?"error":"success"}`}>{message}</p>}
      </div>
    </div>
  );
};
