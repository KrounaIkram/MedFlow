
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
    <div className="bg-[#eaf7ff] min-h-screen flex flex-col items-center justify-center px-4">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full h-[80px] bg-[#eaf7ff] flex items-center justify-between px-6 md:px-10 shadow-md z-50">
        <div className="text-2xl md:text-3xl font-bold text-blue-600">DiagnoTech</div>
        <ul className="hidden md:flex gap-6 text-lg text-gray-700">
          <li><a href="/home" className="hover:text-blue-600">HOME</a></li>
          <li><a href="/about-us" className="hover:text-blue-600">ABOUT</a></li>
          <li><a href="#" className="hover:text-blue-600">SERVICES</a></li>
          <li><a href="#" className="hover:text-blue-600">FAQs</a></li>
          <li><a href="/contact" className="hover:text-blue-600">CONTACT</a></li>
        </ul>
        <div className="hidden md:flex items-center gap-3 text-lg">
          <a href="/login" className="text-gray-700 hover:text-blue-600">Login</a>
          <a href="/register" className="bg-[#4BB2FC] text-white px-4 py-2 rounded hover:bg-blue-500">Sign Up</a>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl mt-20 gap-8">
        {/* Left image */}
        <div className="w-full md:w-5/12 flex justify-center">
          <img src="/doctors.png" alt="Doctors" className="w-full max-w-[450px] object-contain" />
        </div>

        {/* Right form */}
        <div className="w-full md:w-7/12 flex justify-center">
          <div className="bg-white p-8 md:p-12 rounded-xl shadow-xl border w-full max-w-[480px]">
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-base font-normal text-blue-500 mb-1">Username</label>
                <input 
                  type="text"
                  name="name"
                  required
                  className="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700" 
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-base font-normal text-blue-500 mb-1">Email</label>
                <input 
                  type="email"
                  name="email"
                  required
                  className="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700" 
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-base font-normal text-blue-500 mb-1">Password</label>
                <input 
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  className="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700" 
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-base font-normal text-blue-500 mb-1">Role</label>
                <select
                  name="role"
                  defaultValue="PATIENT"
                  className="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="DOCTOR">DOCTOR</option>
                  <option value="RECEPTIONIST">RECEPTIONIST</option>
                  <option value="PATIENT">PATIENT</option>
                </select>
              </div>

              {/* Register button */}
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white text-lg py-3 rounded-md transition font-medium mt-6"
              >
                {isLoading ? "Création..." : "Register"}
              </button>

              {/* Login link */}
              <p className="text-center text-gray-600 text-base mt-4">
                Already have an account? <a href="/login" className="font-semibold text-blue-600 hover:underline">Login</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
