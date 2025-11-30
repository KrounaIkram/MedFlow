"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-6">DiagnoTech</h2>

        <nav className="space-y-3">
          <a href="#" className="block py-2 px-3 rounded hover:bg-blue-900">Dashboard</a>
          <a href="#" className="block py-2 px-3 rounded hover:bg-blue-900">Profile</a>
          <a href="#" className="block py-2 px-3 rounded hover:bg-blue-900">Notifications</a>
        </nav>

        <button 
          onClick={() => signOut()}
          className="mt-auto flex items-center gap-2 bg-red-500 hover:bg-red-700 py-2 px-4 rounded">
          <LogOut size={18} /> Logout
        </button>
      </aside>

      <main className="flex-1 p-10 bg-gray-100">{children}</main>
    </div>
  );
}
