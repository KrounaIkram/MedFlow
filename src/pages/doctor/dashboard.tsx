"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

// Types
type Patient = { id: string; firstName: string; lastName: string; email?: string; phone?: string };
type Doctor = { id: string; name: string };
type Appointment = { id: number; date: string; type: string; status: string; patient: Patient; doctor: Doctor };
type Consultation = { id: number; datetime: string; diagnosis: string; patient: Patient };
type Prescription = { id: number; createdAt: string; medications: any[]; patient: Patient; consultation: Consultation };

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState<"agenda" | "dossiers" | "ordonnances" | "nouvelle">("agenda");

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  const [newConsultation, setNewConsultation] = useState({ patientId: "", datetime: "", diagnosis: "" });

  useEffect(() => {
    const loadData = async () => {
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
    };
    loadData();
  }, []);

  const handleCreateConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newConsultation),
      });
      if (res.ok) {
        const n = await res.json();
        setConsultations(prev => [...prev, n]);
        setNewConsultation({ patientId: "", datetime: "", diagnosis: "" });
        toast.success("Consultation créée !");
      } else {
        toast.error("Erreur création consultation");
      }
    } catch {
      toast.error("Erreur réseau");
    }
  };

  return (
    <div className="dashboardWrapper">
      <div className="dashboardContainer">
        <h1>Dashboard Docteur</h1>

        <div className="tabs">
          <button className={activeTab==="agenda"?"active":""} onClick={()=>setActiveTab("agenda")}>🗓️ Agenda</button>
          <button className={activeTab==="dossiers"?"active":""} onClick={()=>setActiveTab("dossiers")}>📁 Dossiers</button>
          <button className={activeTab==="ordonnances"?"active":""} onClick={()=>setActiveTab("ordonnances")}>💊 Ordonnances</button>
          <button className={activeTab==="nouvelle"?"active":""} onClick={()=>setActiveTab("nouvelle")}>➕ Nouvelle Consultation</button>
        </div>

        {activeTab==="agenda" && (
          <div className="section">
            <h2>Rendez-vous</h2>
            <div className="tableWrapper">
              <table>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(a=>(
                    <tr key={a.id}>
                      <td>{a.patient.firstName} {a.patient.lastName}</td>
                      <td>{new Date(a.date).toLocaleString()}</td>
                      <td>{a.type}</td>
                      <td><span className={`status ${a.status.toLowerCase()}`}>{a.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab==="dossiers" && (
          <div className="section">
            <h2>Dossiers Patients</h2>
            <div className="tableWrapper">
              <table>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Diagnostic</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {consultations.map(c=>(
                    <tr key={c.id}>
                      <td>{c.patient.firstName} {c.patient.lastName}</td>
                      <td>{c.diagnosis}</td>
                      <td>{new Date(c.datetime).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab==="ordonnances" && (
          <div className="section">
            <h2>Ordonnances</h2>
            <div className="tableWrapper">
              <table>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Consultation</th>
                    <th>Médicaments</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map(p=>(
                    <tr key={p.id}>
                      <td>{p.patient.firstName} {p.patient.lastName}</td>
                      <td>{new Date(p.consultation.datetime).toLocaleString()}</td>
                      <td>{p.medications.map(m=>m.name).join(", ")}</td>
                      <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab==="nouvelle" && (
          <div className="section">
            <h2>Nouvelle Consultation</h2>
            <form onSubmit={handleCreateConsultation} className="formBox">
              <select value={newConsultation.patientId} onChange={e=>setNewConsultation({...newConsultation, patientId:e.target.value})} required>
                <option value="">Sélectionner un patient</option>
                {patients.map(p=><option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
              </select>
              <input type="datetime-local" value={newConsultation.datetime} onChange={e=>setNewConsultation({...newConsultation, datetime:e.target.value})} required/>
              <textarea placeholder="Diagnostic" value={newConsultation.diagnosis} onChange={e=>setNewConsultation({...newConsultation, diagnosis:e.target.value})} required/>
              <button type="submit">➕ Créer Consultation</button>
            </form>
          </div>
        )}
      </div>

      <style jsx>{`
        .dashboardWrapper {
          min-height: 100vh;
          width: 100%;
          background: url('https://i.pinimg.com/736x/89/01/7c/89017cd7b1b2e4c5fbfd214253cb08be.jpg') no-repeat center center fixed;
          background-size: cover;
          display: flex;
          justify-content: center;
          padding: 30px 0;
          animation:fadeIn 1.5s ease;
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
          animation:fadeInDown 1s;
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
          transition:0.3s;
        }
        .section:hover {transform:translateY(-3px); box-shadow:0 12px 25px rgba(0,0,0,0.3);}
        .section h2 {margin-bottom:20px; color:#0d47a1;}

        .formBox {
          display:flex; flex-wrap:wrap; gap:15px; margin-bottom:20px; padding:20px; border-radius:15px;
          background:rgba(255,255,255,0.9); box-shadow:0 4px 15px rgba(0,0,0,0.15);
          transition:0.3s;
        }
        .formBox input, .formBox select, .formBox textarea {
          padding:12px; border-radius:12px; border:1px solid #90caf9; flex:1; min-width:180px; transition:0.3s;
        }
        .formBox textarea {flex:2;}
        .formBox input:focus, .formBox select:focus, .formBox textarea:focus {
          outline:none; border-color:#0d47a1; box-shadow:0 0 8px #0d47a1;
        }
        .formBox button {
          padding:12px 25px; background:#0d47a1; color:white; border:none; border-radius:25px; cursor:pointer;
          transition:0.3s; font-weight:bold;
        }
        .formBox button:hover {background:#1565c0; transform:translateY(-2px);}

        .tableWrapper {overflow-x:auto; border-radius:15px; box-shadow:0 4px 20px rgba(0,0,0,0.1);}
        table {width:100%; border-collapse:collapse; background:#fff; transition:0.3s;}
        th, td {padding:12px; border-bottom:1px solid #ccc; text-align:left;}
        th {background:#90caf9; color:#0d47a1; font-weight:bold;}
        tbody tr:hover {background:rgba(0, 123, 255, 0.1); transform:scale(1.01); transition:0.2s;}

        .status {padding:5px 12px; border-radius:15px; font-weight:bold; font-size:13px; text-align:center;}
        .status.done {background:#d1fae5; color:#065f46;}
        .status.cancelled {background:#fee2e2; color:#991b1b;}
        .status.pending {background:#fff3cd; color:#856404;}

        @keyframes fadeIn {0%{opacity:0;}100%{opacity:1;}}
        @keyframes fadeInDown {0%{opacity:0; transform:translateY(-20px);}100%{opacity:1; transform:translateY(0);}}

        @media(max-width:1024px){.dashboardContainer{padding:20px;}.tabs button{padding:10px 15px; font-size:14px;}.formBox input, .formBox select{min-width:140px;}}
        @media(max-width:768px){.section{padding:15px;}.formBox{flex-direction:column;}}
      `}</style>
    </div>
  );
}
 