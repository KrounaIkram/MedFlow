"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        toast.error("Email ou mot de passe incorrect");
      } else {
        toast.success("Connexion réussie !");

        // 🔥 Redirection selon rôle
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        const role = sessionData?.user?.role;

        if (role === "PATIENT") {
          window.location.href = "/patient";
        } else if (role === "DOCTOR") {
          window.location.href = "/doctor/dashboard";
        } else if (role === "RECEPTIONIST") {
          window.location.href = "/receptionist/dashboard";
        } else if (role === "ADMIN") {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/";
        }
      }
    } catch (err) {
      toast.error("Erreur serveur ou réseau");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#eaf7ff] min-h-screen flex justify-center items-center px-4">
      <form
        onSubmit={onSubmit}
        className="bg-white p-8 md:p-12 rounded-3xl shadow-lg w-full max-w-[430px]"
      >
        <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
          DiagnoTech Login
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full mb-4 p-2 border-b"
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          required
          minLength={6}
          className="w-full mb-4 p-2 border-b"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-800 text-white py-2 rounded-full"
        >
          {isLoading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
