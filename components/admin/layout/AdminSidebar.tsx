"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Layers,
  Box,
  Inbox,
  Image as ImageIcon,
  Settings,
  LogOut,
  Users
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    label: "Content",
    items: [
      { label: "Blogs", href: "/admin/blogs", icon: FileText },
      { label: "Careers", href: "/admin/careers", icon: Briefcase },
      { label: "Services", href: "/admin/services", icon: Layers },
      { label: "Products", href: "/admin/products", icon: Box },
    ],
  },
  {
    label: "Applications",
    items: [
      { label: "Job Applications", href: "/admin/applications", icon: Users },
      { label: "Contacts", href: "/admin/contacts", icon: Inbox },
    ],
  },
  {
    label: "Media",
    items: [{ label: "Media Library", href: "/admin/media", icon: ImageIcon }],
  },
  {
    label: "Configuration",
    items: [{ label: "Site Settings", href: "/admin/settings", icon: Settings }],
  },
];

const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin" || pathname === "/admin/dashboard";
    }
    return pathname?.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      // Import axios dynamically or just use standard fetch since we need withCredentials
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      window.location.href = '/admin/login?expired=true';
    }
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-[#0B1221] border-r border-white/10 z-40 hidden md:flex flex-col">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
        <Link href="/admin" className="text-xl font-bold text-white tracking-wider flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)]">
            <span className="text-white font-bold text-lg leading-none">T</span>
          </div>
          Technic Admin
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 no-scrollbar">
        {/* Dashboard Link */}
        <div>
          <Link
            href="/admin"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              isActive("/admin")
                ? "bg-white/10 text-orange-400 font-medium shadow-[0_0_15px_rgba(249,115,22,0.1)] border border-orange-500/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
        </div>

        {/* Groups */}
        {NAV_ITEMS.filter((item) => item.items).map((group, idx) => (
          <div key={idx}>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 px-3">
              {group.label}
            </h4>
            <div className="space-y-1">
              {group.items?.map((item, itemIdx) => (
                <Link
                  key={itemIdx}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-white/10 text-orange-400 font-medium shadow-[0_0_15px_rgba(249,115,22,0.1)] border border-orange-500/20"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-white/10 shrink-0">
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors group">
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
