"use client";

import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { Toaster } from "react-hot-toast";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-technic-bg font-sans text-technic-secondary flex">
      <AdminSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col md:pl-64 min-w-0 transition-all duration-300">
        <AdminHeader onMenu={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-technic-bg p-4 sm:p-6">
          {children}
        </main>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#FFFFFF",
            color: "#1F2937",
            border: "1px solid #E5E7EB",
            boxShadow: "0 8px 24px rgba(31, 41, 55, 0.08)",
          },
        }}
      />
    </div>
  );
}
