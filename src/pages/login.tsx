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
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        const role = sessionData?.user?.role;

        if (role === "PATIENT") window.location.href = "/patient";
        else if (role === "DOCTOR") window.location.href = "/doctor/dashboard";
        else if (role === "RECEPTIONIST") window.location.href = "/receptionist/dashboard";
        else if (role === "ADMIN") window.location.href = "/admin/dashboard";
        else window.location.href = "/";
      }
    } catch {
      toast.error("Erreur serveur ou réseau");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="leftSection">
        <img src="/doctors.png" alt="Doctors" className="doctorsImage" />
      </div>

      <div className="rightSection">
        <form onSubmit={onSubmit} className="loginBox">
          <h2>Bienvenue sur DiagnoTech</h2>

          <div className="inputGroup">
            <label>Email</label>
            <input type="email" name="email" placeholder="Email" required />
          </div>

          <div className="inputGroup">
            <label>Mot de passe</label>
            <input type="password" name="password" placeholder="Mot de passe" required minLength={6} />
          </div>

          <button type="submit" className="loginBtn" disabled={isLoading}>
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>

          <p className="registerText">
            Pas de compte ? <a href="/register">Créer un compte</a>
          </p>
        </form>
      </div>

      {/* Styles identiques à Register */}
      <style jsx>{`
        * { margin:0; padding:0; box-sizing:border-box; font-family:Arial,sans-serif;}
        body { background-color:#eaf7ff; }

        .container { display:flex; width:100%; height:100vh; }
        .leftSection { width:50%; background-color:#4bb2fc; display:flex; justify-content:center; align-items:center; }
        .doctorsImage { width:70%; max-height:60%; display:block; }

        .rightSection { width:50%; display:flex; justify-content:center; align-items:center; background-color:#f7fcff; }
        .loginBox { background:#fff; padding:60px; border-radius:30px; box-shadow:0 4px 10px rgba(0,0,0,0.1); width:70%; max-width:500px; text-align:center; }

        h2 { color:#086df2; margin-bottom:20px; }

        .inputGroup { text-align:left; margin-bottom:20px; }
        .inputGroup label { font-size:18px; font-weight:bold; color:#4bb2fc; display:block; margin-bottom:5px; }
        .inputGroup input { width:100%; padding:10px; border:none; border-bottom:1px solid #ccc; font-size:16px; outline:none; }

        .loginBtn { width:50%; padding:12px; background-color:#4bb2fc; color:white; border:none; border-radius:20px; font-size:18px; cursor:pointer; transition:0.3s; }
        .loginBtn:hover { background-color:#054bb5; }
        .loginBtn:disabled { background-color:#7aa7e0; cursor:not-allowed; }

        .registerText { font-size:16px; margin-top:15px; }
        .registerText a { color:#292b84; text-decoration:none; }
        .registerText a:hover { text-decoration:underline; }

        @media(max-width:992px){ .container{ flex-direction:column; height:auto; } .leftSection,.rightSection{ width:100%; padding:40px; } .loginBox{ width:80%; } .doctorsImage{ width:60%; } }
        @media(max-width:768px){ .loginBox{ width:90%; } }
        @media(max-width:480px){ h2{ font-size:24px; } .doctorsImage{ width:80%; } .loginBox{ width:95%; } }
      `}</style>
    </div>
  );
}