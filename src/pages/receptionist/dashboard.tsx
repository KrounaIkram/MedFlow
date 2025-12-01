"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// Types
type Patient = { id: string; firstName: string; lastName: string; email?: string | null; phone?: string | null };
type Appointment = { id: number; date: string; status: string; patient: Patient };
type Consultation = { id: number; datetime: string; diagnosis: string; patient: Patient; prescription?: any };
type Prescription = { id: string; createdAt: string; medications: any[]; patient: Patient; consultation: Consultation };

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
        toast.error("Erreur de chargement des données");
      }
    };

    loadData();
  }, [session]);

  if (status === "loading") return <div>Chargement...</div>;
  if (!session || session.user.role !== "DOCTOR") return <div>Accès refusé</div>;

  return (
    <div className="dashboardWrapper">
      <div className="dashboardContainer">
        <h1>Bienvenue, Dr. {session.user.name}</h1>

        <div className="tabs">
          <button className={activeTab==="agenda"?"active":""} onClick={()=>setActiveTab("agenda")}>🗓️ Agenda</button>
          <button className={activeTab==="dossiers"?"active":""} onClick={()=>setActiveTab("dossiers")}>📁 Dossiers Médicaux</button>
          <button className={activeTab==="ordonnances"?"active":""} onClick={()=>setActiveTab("ordonnances")}>💊 Ordonnances</button>
          <button className={activeTab==="nouvelle"?"active":""} onClick={()=>setActiveTab("nouvelle")}>➕ Nouvelle Consultation</button>
        </div>

        {activeTab==="agenda" && <AgendaTab appointments={appointments} onAppointmentUpdate={(updated) => {
          setAppointments(prev => prev.map(a => a.id === updated.id ? updated : a));
        }} />}
        {activeTab==="dossiers" && <DossiersTab patients={patients} consultations={consultations} />}
        {activeTab==="ordonnances" && <OrdonnancesTab prescriptions={prescriptions} consultations={consultations} onPrescriptionCreated={(newPresc) => setPrescriptions(prev => [...prev, newPresc])} />}
        {activeTab==="nouvelle" && <NouvelleConsultationTab patients={patients} onConsultationCreated={(newC) => setConsultations(prev => [...prev, newC])} />}
      </div>

      <style jsx>{`
        .dashboardWrapper {
          min-height: 100vh;
          width: 100%;
          background: url('https://i.pinimg.com/1200x/ae/f6/17/aef6170679bdead47b720fd69615d286.jpg') no-repeat center center fixed;
          background-size: cover;
          display: flex;
          justify-content: center;
          padding: 30px 0;
        }

        .dashboardContainer {
          max-width: 1400px;
          width: 100%;
          padding: 30px;
        }

        h1{
          color:#fff;
          text-align:center;
          margin-bottom:30px;
          font-size:36px;
          text-shadow: 2px 2px 8px rgba(0,0,0,0.5);
        }

        .tabs {text-align:center; margin-bottom:40px;}
        .tabs button {
          padding:12px 25px;
          margin:0 7px;
          border:none;
          border-radius:30px;
          cursor:pointer;
          background:rgba(255,255,255,0.3);
          color:white;
          font-weight:bold;
          font-size:16px;
          transition:0.4s;
          transform:scale(1);
          backdrop-filter: blur(5px);
        }
        .tabs button:hover {transform:scale(1.1); background:rgba(255,255,255,0.5);}
        .tabs button.active {background:rgba(255,255,255,0.8); color:#0d47a1; box-shadow:0 5px 15px rgba(0,0,0,0.3);}

        .section {
          margin-bottom:50px;
          background:rgba(255,255,255,0.85);
          padding:25px;
          border-radius:20px;
          box-shadow:0 8px 20px rgba(0,0,0,0.25);
          backdrop-filter: blur(10px);
        }

        .section h2 {margin-bottom:20px; color:#0d47a1;}

        .formBox, form {
          display:flex; flex-wrap:wrap; gap:15px; margin-bottom:20px; padding:20px; border-radius:15px;
          background:rgba(255,255,255,0.9); box-shadow:0 4px 15px rgba(0,0,0,0.15);
        }
        .formBox input, .formBox select, form input, form select, form textarea {
          padding:12px; border-radius:12px; border:1px solid #90caf9; flex:1; min-width:180px;
        }
        .formBox input:focus, .formBox select:focus, form input:focus, form select:focus, form textarea:focus {
          outline:none; border-color:#0d47a1; box-shadow:0 0 8px #0d47a1;
        }
        .formBox button, form button {
          padding:12px 25px; background:#0d47a1; color:white; border:none; border-radius:25px; cursor:pointer;
          font-weight:bold;
        }
        .formBox button:hover, form button:hover {background:#1565c0; transform:translateY(-2px);}

        .tableWrapper {overflow-x:auto; border-radius:15px; box-shadow:0 4px 20px rgba(0,0,0,0.1);}
        table {width:100%; border-collapse:collapse; background:#fff;}
        th, td {padding:12px; border-bottom:1px solid #ccc; text-align:left;}
        th {background:#90caf9; color:#0d47a1; font-weight:bold;}
        tbody tr:hover {background:rgba(0, 123, 255, 0.1); transform:scale(1.01); transition:0.2s;}

        .status {padding:5px 12px; border-radius:15px; font-weight:bold; font-size:13px; text-align:center;}
        .status.done {background:#d1fae5; color:#065f46;}
        .status.cancelled {background:#fee2e2; color:#991b1b;}
        .status.pending {background:#fff3cd; color:#856404;}

        @media(max-width:1024px){.dashboardContainer{padding:20px;}.tabs button{padding:10px 15px; font-size:14px;}.formBox input, .formBox select{min-width:140px;}}
        @media(max-width:768px){.section{padding:15px;}}
      `}</style>
    </div>
  );
}

/* ---------------- Tabs ---------------- */

const AgendaTab = ({ appointments, onAppointmentUpdate }: { appointments: Appointment[], onAppointmentUpdate: (updated: Appointment) => void }) => {
  const handleUpdateStatus = async (id: number, status: "DONE" | "CANCELLED") => {
    try {
      const res = await fetch(`/api/appointments/${id}`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify({status}) });
      if(res.ok){ const updated = await res.json(); onAppointmentUpdate(updated); }
    } catch(err){ console.error(err); alert("Erreur réseau"); }
  };
  
  return (
    <div className="section">
      <h2>🗓️ Tous vos rendez-vous</h2>
      {appointments.length>0 ? (
        <div className="tableWrapper">
          <table>
            <thead><tr><th>Patient</th><th>Date</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody>
              {appointments.map(a => (
                <tr key={a.id}>
                  <td>{a.patient.firstName} {a.patient.lastName}</td>
                  <td>{new Date(a.date).toLocaleString("fr-FR")}</td>
                  <td className={`status ${a.status.toLowerCase()}`}>{a.status}</td>
                  <td>
                    {a.status==="SCHEDULED" && (
                      <>
                        <button onClick={()=>handleUpdateStatus(a.id,"DONE")}>✅ Confirmer</button>
                        <button onClick={()=>handleUpdateStatus(a.id,"CANCELLED")}>❌ Annuler</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p>Aucun rendez-vous trouvé.</p>}
    </div>
  );
};

const DossiersTab = ({ patients, consultations }: { patients: Patient[], consultations: Consultation[] }) => (
  <div className="section">
    <h2>📁 Dossiers Médicaux</h2>
    {patients.length>0 ? (
      <div className="tableWrapper">
        <table>
          <thead><tr><th>Patient</th><th>Consultations</th></tr></thead>
          <tbody>
            {patients.map(p => {
              const patientConsults = consultations.filter(c=>c.patient.id===p.id);
              return (
                <tr key={p.id}>
                  <td>{p.firstName} {p.lastName}</td>
                  <td>{patientConsults.length}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    ) : <p>Aucun patient trouvé.</p>}
  </div>
);

const OrdonnancesTab = ({ prescriptions, consultations, onPrescriptionCreated }: { prescriptions: Prescription[], consultations: Consultation[], onPrescriptionCreated: (p: Prescription)=>void }) => (
  <div className="section">
    <h2>💊 Ordonnances</h2>
    {prescriptions.length>0 ? (
      <div className="tableWrapper">
        <table>
          <thead><tr><th>Patient</th><th>Date</th><th>Médicaments</th></tr></thead>
          <tbody>
            {prescriptions.map(p => (
              <tr key={p.id}>
                <td>{p.patient.firstName} {p.patient.lastName}</td>
                <td>{new Date(p.createdAt).toLocaleDateString("fr-FR")}</td>
                <td>{p.medications.map(m=>m.name).join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : <p>Aucune ordonnance trouvée.</p>}
  </div>
);

const NouvelleConsultationTab = ({ patients, onConsultationCreated }: { patients: Patient[], onConsultationCreated: (c: Consultation)=>void }) => {
  const [patientId, setPatientId] = useState(""); const [diagnosis, setDiagnosis] = useState("");

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    if(!patientId || !diagnosis) return alert("Remplissez tous les champs");
    try {
      const res = await fetch("/api/consultations", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({patientId, diagnosis}) });
      if(res.ok){ const newC = await res.json(); onConsultationCreated(newC); setPatientId(""); setDiagnosis(""); toast.success("Consultation créée"); }
    } catch(err){ console.error(err); toast.error("Erreur réseau"); }
  };

  return (
    <div className="section">
      <h2>➕ Nouvelle Consultation</h2>
      <form onSubmit={handleSubmit}>
        <select value={patientId} onChange={e=>setPatientId(e.target.value)}>
          <option value="">Sélectionner un patient</option>
          {patients.map(p=><option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
        </select>
        <textarea value={diagnosis} onChange={e=>setDiagnosis(e.target.value)} placeholder="Diagnostic"></textarea>
        <button type="submit">Créer</button>
      </form>
    </div>
  );
};
