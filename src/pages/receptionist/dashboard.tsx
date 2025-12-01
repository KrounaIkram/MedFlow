"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

// Types
type Patient = { id: string; firstName: string; lastName: string; email?: string | null; phone?: string | null };
type Doctor = { id: string; name: string };
type Appointment = { id: number; date: string; type: string; status: string; notes?: string | null; doctor: Doctor; patient: Patient };
type Consultation = { id: number; datetime: string; diagnosis: string; patient: Patient; doctor: Doctor };
type Invoice = { id: number; amount: number; currency: string; status: string; paidAt?: string | null; createdAt: string; patient: Patient | null; consultation: Consultation | null };

export default function ReceptionistDashboard() {
  const [activeTab, setActiveTab] = useState<"appointments" | "patients" | "invoices">("appointments");

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [newPatient, setNewPatient] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [newInvoice, setNewInvoice] = useState({ patientId: "", consultationId: "", amount: "" });

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
    } catch {
      toast.error("Erreur réseau");
    }
  };

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
          amount: Math.round(amountNum * 100),
          currency: "tnd",
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
    } catch {
      toast.error("Erreur réseau");
    }
  };

  return (
    <div className="dashboardWrapper">
      <div className="dashboardContainer">
        <h1>Dashboard Réceptionniste</h1>

        <div className="tabs">
          <button className={activeTab==="appointments"?"active":""} onClick={()=>setActiveTab("appointments")}>🗓️ Rendez-vous</button>
          <button className={activeTab==="patients"?"active":""} onClick={()=>setActiveTab("patients")}>👤 Patients</button>
          <button className={activeTab==="invoices"?"active":""} onClick={()=>setActiveTab("invoices")}>💰 Facturation</button>
        </div>

        {activeTab==="appointments" && (
          <div className="section">
            <h2>Liste des Rendez-vous</h2>
            <div className="tableWrapper">
              <table>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Docteur</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(appt=>(
                    <tr key={appt.id}>
                      <td>{appt.patient.firstName} {appt.patient.lastName}</td>
                      <td>{appt.doctor.name}</td>
                      <td>{new Date(appt.date).toLocaleString()}</td>
                      <td>{appt.type}</td>
                      <td>
                        <span className={`status ${appt.status.toLowerCase()}`}>{appt.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab==="patients" && (
          <div className="section">
            <h2>Enregistrement Patient</h2>
            <form onSubmit={handleCreatePatient} className="formBox">
              <input type="text" placeholder="Prénom" value={newPatient.firstName} onChange={e=>setNewPatient({...newPatient, firstName:e.target.value})} required/>
              <input type="text" placeholder="Nom" value={newPatient.lastName} onChange={e=>setNewPatient({...newPatient, lastName:e.target.value})} required/>
              <input type="email" placeholder="Email" value={newPatient.email} onChange={e=>setNewPatient({...newPatient, email:e.target.value})}/>
              <input type="tel" placeholder="Téléphone" value={newPatient.phone} onChange={e=>setNewPatient({...newPatient, phone:e.target.value})}/>
              <button type="submit">➕ Ajouter Patient</button>
            </form>

            <h2>Liste des Patients</h2>
            <div className="tableWrapper">
              <table>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map(p=>(
                    <tr key={p.id}>
                      <td>{p.firstName} {p.lastName}</td>
                      <td>{p.email||"–"}</td>
                      <td>{p.phone||"–"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab==="invoices" && (
          <div className="section">
            <h2>Créer une Facture</h2>
            <form onSubmit={handleCreateInvoice} className="formBox">
              <select value={newInvoice.patientId} onChange={e=>setNewInvoice({...newInvoice, patientId:e.target.value})} required>
                <option value="">Sélectionner un patient</option>
                {patients.map(p=><option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
              </select>
              <select value={newInvoice.consultationId} onChange={e=>setNewInvoice({...newInvoice, consultationId:e.target.value})}>
                <option value="">Aucune consultation</option>
                {consultations.map(c=><option key={c.id} value={c.id}>{new Date(c.datetime).toLocaleString()} - {c.patient.firstName}</option>)}
              </select>
              <input type="number" step="0.01" placeholder="Montant (TND)" value={newInvoice.amount} onChange={e=>setNewInvoice({...newInvoice, amount:e.target.value})} required/>
              <button type="submit">💳 Créer Facture (TND)</button>
            </form>

            <h2>Liste des Factures</h2>
            <div className="tableWrapper">
              <table>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Montant</th>
                    <th>Statut</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(inv=>(
                    <tr key={inv.id}>
                      <td>{inv.patient?`${inv.patient.firstName} ${inv.patient.lastName}`:"Patient supprimé"}</td>
                      <td>{(inv.amount/100).toFixed(2)} TND</td>
                      <td><span className={`status ${inv.status.toLowerCase()}`}>{inv.status}</span></td>
                      <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        /* Wrapper fullscreen avec background */
        .dashboardWrapper {
          min-height: 100vh;
          width: 100%;
          background: url('https://i.pinimg.com/1200x/ae/f6/17/aef6170679bdead47b720fd69615d286.jpg') no-repeat center center fixed;
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
        .formBox input, .formBox select {
          padding:12px; border-radius:12px; border:1px solid #90caf9; flex:1; min-width:180px; transition:0.3s;
        }
        .formBox input:focus, .formBox select:focus {
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
        @media(max-width:768px){.section{padding:15px;}}
      `}</style>
    </div>
  );
}