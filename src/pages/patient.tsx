"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

// Types
type Patient = { id: string; firstName: string; lastName: string; email?: string | null; phone?: string | null };
type Doctor = { id: string; name: string };
type Appointment = { id: number; date: string; type: string; status: string; notes?: string | null; doctor: Doctor; patient: Patient };
type Consultation = { id: number; datetime: string; diagnosis: string; patient: Patient; doctor: Doctor };
type Invoice = { id: string; amount: number; currency: string; status: "PENDING" | "PAID" | "CANCELED"; createdAt: string };
type Prescription = { id: string; createdAt: string; doctor: { name: string }; patient: { firstName: string; lastName: string }; consultation: { id: string; datetime: string } | null };

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState<"appointments" | "invoices" | "prescriptions">("appointments");

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
      const [apptRes, docRes, invRes, prescRes] = await Promise.all([
        fetch("/api/appointments"),
        fetch("/api/users/doctors"),
        fetch("/api/patients/me/invoices"),
        fetch("/api/prescriptions"),
      ]);
      if (apptRes.ok) setAppointments(await apptRes.json());
      if (docRes.ok) setDoctors(await docRes.json());
      if (invRes.ok) setInvoices(await invRes.json());
      if (prescRes.ok) setPrescriptions(await prescRes.json());
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
        if (!res.ok) throw new Error("Erreur lors de la modification");
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
        if (!res.ok) throw new Error("Erreur lors de la création");
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

  const handlePayInvoice = async (invoiceId: string) => {
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Impossible de lancer le paiement");
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err: any) {
      toast.error(err.message || "Erreur lors du lancement du paiement");
    }
  };

  // Calcul KPI
  const pendingInvoices = invoices.filter(i => i.status === "PENDING").length;
  const upcomingAppointments = appointments.filter(a => new Date(a.date) > new Date()).length;
  const totalPrescriptions = prescriptions.length;

  return (
    <div className="dashboardWrapper">
      <div className="dashboardContainer">
        <h1>Tableau Patient</h1>

        {/* KPI Cards */}
        <div className="kpiCards">
          <div className="kpiCard">
            <h3>Rendez-vous à venir</h3>
            <p>{upcomingAppointments}</p>
          </div>
          <div className="kpiCard">
            <h3>Factures en attente</h3>
            <p>{pendingInvoices}</p>
          </div>
          <div className="kpiCard">
            <h3>Ordonnances</h3>
            <p>{totalPrescriptions}</p>
          </div>
        </div>

        <div className="tabs">
          <button className={activeTab === "appointments" ? "active" : ""} onClick={() => setActiveTab("appointments")}>🗓️ Rendez-vous</button>
          <button className={activeTab === "invoices" ? "active" : ""} onClick={() => setActiveTab("invoices")}>💰 Factures</button>
          <button className={activeTab === "prescriptions" ? "active" : ""} onClick={() => setActiveTab("prescriptions")}>📄 Ordonnances</button>
        </div>

        {loading ? <p>Chargement...</p> : (
          <>
            {activeTab === "appointments" && (
              <div className="section">
                <h2>Mes Rendez-vous</h2>
                <div className="cardsWrapper">
                  {appointments.map(a => (
                    <div key={a.id} className={`card ${a.status.toLowerCase()}`}>
                      <h4>{new Date(a.date).toLocaleString()}</h4>
                      <p>Type: {a.type}</p>
                      <p>Docteur: {a.doctor.name}</p>
                      <p>Status: <span className={`status ${a.status.toLowerCase()}`}>{a.status}</span></p>
                      <button onClick={() => handleEdit(a)} className="btnYellow">Modifier</button>
                    </div>
                  ))}
                </div>

                <h2>{editingId ? "Modifier Rendez-vous" : "Créer Rendez-vous"}</h2>
                <form onSubmit={handleSubmitAppointment} className="formBox">
                  <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} required disabled={!!editingId}>
                    <option value="">Sélectionner un docteur</option>
                    {doctors.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                  <input type="datetime-local" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} required />
                  <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                    <option value="CONSULTATION">Consultation</option>
                    <option value="URGENCY">Urgence</option>
                    <option value="FOLLOW_UP">Suivi</option>
                    <option value="CONTROL">Contrôle</option>
                  </select>
                  <textarea placeholder="Notes (facultatif)" value={notes} onChange={(e) => setNotes(e.target.value)} />
                  <button type="submit" disabled={creating}>{creating ? "En cours..." : editingId ? "Modifier" : "Créer"}</button>
                </form>
              </div>
            )}

            {activeTab === "invoices" && (
              <div className="section">
                <h2>Mes Factures</h2>
                <div className="cardsWrapper">
                  {invoices.map(inv => (
                    <div key={inv.id} className={`card ${inv.status.toLowerCase()}`}>
                      <h4>{(inv.amount / 100).toFixed(2)} {inv.currency.toUpperCase()}</h4>
                      <p>Status: <span className={`status ${inv.status.toLowerCase()}`}>{inv.status}</span></p>
                      <p>Date: {new Date(inv.createdAt).toLocaleDateString()}</p>
                      {inv.status === "PENDING" && <button onClick={() => handlePayInvoice(inv.id)} className="btnGreen">Payer</button>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "prescriptions" && (
              <div className="section">
                <h2>Mes Ordonnances</h2>
                <div className="cardsWrapper">
                  {prescriptions.map(p => (
                    <div key={p.id} className="card">
                      <h4>Dr {p.doctor.name}</h4>
                      <p>Date: {p.consultation ? new Date(p.consultation.datetime).toLocaleDateString() : new Date(p.createdAt).toLocaleDateString()}</p>

                      {/* 🔥 Correction ici */}
                      <button onClick={() => window.open(`/api/prescriptions/${p.id}/pdf`, "_blank")} className="btnBlue">
                        PDF
                      </button>

                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
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
          max-width: 1200px;
          width: 100%;
          padding: 30px;
        }
        h1 {text-align:center;color:white;margin-bottom:20px;text-shadow:2px 2px 8px rgba(0,0,0,0.5);}
        
        /* KPI */
        .kpiCards {display:flex; justify-content:space-around; margin-bottom:30px; flex-wrap:wrap; gap:15px;}
        .kpiCard {flex:1; min-width:180px; padding:20px; border-radius:20px; background:rgba(255,255,255,0.9); text-align:center; box-shadow:0 8px 20px rgba(0,0,0,0.2); transition:0.3s;}
        .kpiCard:hover {transform:translateY(-5px); box-shadow:0 12px 25px rgba(0,0,0,0.3);}
        .kpiCard h3 {margin-bottom:10px; color:#0d47a1;}
        .kpiCard p {font-size:24px; font-weight:bold;}

        .tabs {text-align:center;margin-bottom:20px;}
        .tabs button {
          padding:12px 25px; margin:0 7px; border:none; border-radius:30px; cursor:pointer;
          background:rgba(255,255,255,0.3); color:white; font-weight:bold; font-size:16px;
          transition:0.4s; transform:scale(1); backdrop-filter: blur(5px);
        }
        .tabs button:hover {transform:scale(1.1); background:rgba(255,255,255,0.5);}
        .tabs button.active {background:rgba(255,255,255,0.8); color:#0d47a1; box-shadow:0 5px 15px rgba(0,0,0,0.3);}

        .section {margin-bottom:50px; background:rgba(255,255,255,0.85); padding:25px; border-radius:20px; box-shadow:0 8px 20px rgba(0,0,0,0.25); backdrop-filter: blur(10px);}
        .section h2 {margin-bottom:20px;color:#0d47a1;}

        .formBox {display:flex; flex-wrap:wrap; gap:15px; margin-bottom:20px; padding:20px; border-radius:15px; background:rgba(255,255,255,0.9); box-shadow:0 4px 15px rgba(0,0,0,0.15);}
        .formBox input, .formBox select, .formBox textarea {padding:12px;border-radius:12px;border:1px solid #90caf9;flex:1;min-width:180px;transition:0.3s;}
        .formBox input:focus, .formBox select:focus, .formBox textarea:focus {outline:none;border-color:#0d47a1;box-shadow:0 0 8px #0d47a1;}
        .formBox button {padding:12px 25px;background:#0d47a1;color:white;border:none;border-radius:25px;cursor:pointer;transition:0.3s;font-weight:bold;flex:1;}
        .formBox button:hover {background:#1565c0;transform:translateY(-2px);}

        /* Cards Wrapper */
        .cardsWrapper {display:grid; grid-template-columns:repeat(auto-fill,minmax(250px,1fr)); gap:15px;}
        .card {background:rgba(255,255,255,0.9); padding:20px; border-radius:15px; box-shadow:0 6px 20px rgba(0,0,0,0.2); transition:0.3s;}
        .card:hover {transform:translateY(-5px); box-shadow:0 12px 25px rgba(0,0,0,0.3);}
        .card h4 {margin-bottom:8px;color:#0d47a1;}
        .status {padding:5px 12px;border-radius:15px;font-weight:bold;font-size:13px;text-align:center;}
        .status.pending {background:#fff3cd;color:#856404;}
        .status.paid {background:#d1fae5;color:#065f46;}
        .status.canceled {background:#fee2e2;color:#991b1b;}

        .btnGreen{background:#22c55e;color:#fff;padding:8px 14px;border-radius:12px;border:none;cursor:pointer;margin-top:5px;}
        .btnGreen:hover{background:#16a34a;}
        .btnYellow{background:#facc15;color:#fff;padding:8px 14px;border-radius:12px;border:none;cursor:pointer;margin-top:5px;}
        .btnYellow:hover{background:#eab308;}
        .btnBlue{background:#3b82f6;color:#fff;padding:8px 14px;border-radius:12px;border:none;cursor:pointer;margin-top:5px;}
        .btnBlue:hover{background:#2563eb;}

        @media(max-width:768px){.kpiCards{flex-direction:column;}}
      `}</style>
    </div>
  );
}
