"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      password: fd.get("password") as string,
      role: (fd.get("role") as string) || "PATIENT",
    };

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Compte créé avec succès !");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        toast.error(result.error ?? "Erreur lors de l'inscription");
      }
    } catch {
      toast.error("Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      {/* Left image */}
      <div className="leftSection">
        <img src="/doctors.png" alt="Doctors" className="doctorsImage" />
      </div>

      {/* Right form */}
      <div className="rightSection">
        <form onSubmit={onSubmit} className="loginBox">
          <h2>Créer un compte DiagnoTech</h2>

          <div className="inputGroup">
            <label>Nom & Prénom</label>
            <input type="text" name="name" placeholder="Votre nom" required />
          </div>

          <div className="inputGroup">
            <label>Email</label>
            <input type="email" name="email" placeholder="Email" required />
          </div>

          <div className="inputGroup">
            <label>Mot de passe</label>
            <input type="password" name="password" placeholder="Mot de passe" required minLength={6} />
          </div>

          <div className="inputGroup">
            <label>Rôle</label>
            <select name="role" defaultValue="PATIENT">
              <option value="DOCTOR">DOCTOR</option>
              <option value="RECEPTIONIST">RECEPTIONIST</option>
              <option value="PATIENT">PATIENT</option>
            </select>
          </div>

          <button type="submit" className="loginBtn" disabled={isLoading}>
            {isLoading ? "Création..." : "S'inscrire"}
          </button>

          <p className="registerText">
            Déjà un compte ? <a href="/login">Se connecter</a>
          </p>
        </form>
      </div>

      <style jsx>{`
        .container {
          display: flex;
          width: 100%;
          height: 100vh;
        }

        .leftSection {
          width: 50%;
          background-color: #4bb2fc;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .doctorsImage {
          width: 70%;
          max-height: 60%;
        }

        .rightSection {
          width: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f7fcff;
        }

        .loginBox {
          background: #ffffff;
          padding: 60px;
          border-radius: 30px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          width: 70%;
          max-width: 500px;
          text-align: center;
        }

        h2 {
          color: #086df2;
          margin-bottom: 20px;
        }

        .inputGroup {
          text-align: left;
          margin-bottom: 20px;
        }

        .inputGroup label {
          font-size: 18px;
          font-weight: bold;
          color: #4bb2fc;
          display: block;
          margin-bottom: 5px;
        }

        .inputGroup input,
        .inputGroup select {
          width: 100%;
          padding: 10px;
          border: none;
          border-bottom: 1px solid #ccc;
          font-size: 16px;
          outline: none;
        }

        .loginBtn {
          width: 50%;
          padding: 12px;
          background-color: #4bb2fc;
          color: white;
          border: none;
          border-radius: 20px;
          font-size: 18px;
          cursor: pointer;
          transition: 0.3s;
        }

        .loginBtn:hover {
          background-color: #054bb5;
        }

        .loginBtn:disabled {
          background-color: #7aa7e0;
          cursor: not-allowed;
        }

        .registerText {
          font-size: 16px;
          margin-top: 15px;
        }

        .registerText a {
          color: #292b84;
          text-decoration: none;
        }

        .registerText a:hover {
          text-decoration: underline;
        }

        @media (max-width: 992px) {
          .container {
            flex-direction: column;
            height: auto;
          }

          .leftSection,
          .rightSection {
            width: 100%;
            padding: 40px;
          }

          .loginBox {
            width: 80%;
          }

          .doctorsImage {
            width: 60%;
          }
        }

        @media (max-width: 768px) {
          .loginBox {
            width: 90%;
          }
        }

        @media (max-width: 480px) {
          h2 {
            font-size: 24px;
          }

          .doctorsImage {
            width: 80%;
          }

          .loginBox {
            width: 95%;
          }
        }
      `}</style>
    </div>
  );
}