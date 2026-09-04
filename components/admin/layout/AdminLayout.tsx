"use client";

import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0B1221] font-sans text-slate-300 selection:bg-orange-500/30 selection:text-white flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col md:pl-64 transition-all duration-300">
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#0B1221] p-6 relative">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
