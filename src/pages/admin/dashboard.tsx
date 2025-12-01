// pages/admin/index.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast"; // ⭐ IMPORTANT : ajouté pour corriger l'erreur

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"clinic" | "services" | "staff">("clinic");

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") {
      router.push("/login");
    }
  }, [session, status, router]);

  if (status === "loading") return <p>Chargement...</p>;
  if (!session || session.user.role !== "ADMIN") return null;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Administration – Propriétaire</h1>

      <div className="flex space-x-4 mb-6 border-b">
        <button
          className={`pb-2 px-4 ${activeTab === "clinic" ? "border-b-2 border-blue-600 font-bold" : ""}`}
          onClick={() => setActiveTab("clinic")}
        >
          🏥 Clinique
        </button>

        <button
          className={`pb-2 px-4 ${activeTab === "services" ? "border-b-2 border-blue-600 font-bold" : ""}`}
          onClick={() => setActiveTab("services")}
        >
          💸 Services
        </button>

        <button
          className={`pb-2 px-4 ${activeTab === "staff" ? "border-b-2 border-blue-600 font-bold" : ""}`}
          onClick={() => setActiveTab("staff")}
        >
          👥 Staff
        </button>
      </div>

      {activeTab === "clinic" && <ClinicSettings />}
      {activeTab === "services" && <ServicesManager />}
      {activeTab === "staff" && <StaffManager />}
    </div>
  );
}

/* ------------------------------------------------------------------
   🔽🔽🔽 COMPOSANTS
--------------------------------------------------------------------*/

// 🏥 Paramètres de la clinique
function ClinicSettings() {
  const [clinic, setClinic] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    logo: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/clinic", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clinic),
      });

      if (res.ok) {
        toast.success("Clinique mise à jour !");
      } else {
        const err = await res.json();
        toast.error(err.error || "Erreur lors de la mise à jour");
      }
    } catch {
      toast.error("Erreur réseau");
    }
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-semibold mb-4">Paramètres de la clinique</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Nom de la clinique</label>
          <input
            type="text"
            value={clinic.name}
            onChange={(e) => setClinic({ ...clinic, name: e.target.value })}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block">Adresse</label>
          <input
            type="text"
            value={clinic.address}
            onChange={(e) => setClinic({ ...clinic, address: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block">Téléphone</label>
          <input
            type="tel"
            value={clinic.phone}
            onChange={(e) => setClinic({ ...clinic, phone: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block">Email</label>
          <input
            type="email"
            value={clinic.email}
            onChange={(e) => setClinic({ ...clinic, email: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block">Logo (URL)</label>
          <input
            type="url"
            value={clinic.logo}
            onChange={(e) => setClinic({ ...clinic, logo: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
          Enregistrer
        </button>
      </form>
    </div>
  );
}

// 💸 Gestion des services
function ServicesManager() {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Gestion des Services</h2>
      <p>Ici, tu afficheras les services, prix, modification, suppression...</p>
    </div>
  );
}

// 👥 Gestion du staff
function StaffManager() {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Gestion du Staff</h2>
      <p>Ici, tu listeras les médecins, réceptionnistes, etc.</p>
    </div>
  );
}
