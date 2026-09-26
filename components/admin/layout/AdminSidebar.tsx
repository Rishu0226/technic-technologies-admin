"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { apiBaseUrl, clearAdminToken, readAdminToken } from "../../../src/lib/session";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Layers,
  Building2,
  Box,
  Inbox,
  Image as ImageIcon,
  Settings,
  LogOut,
  Users,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    label: "Content",
    items: [
      { label: "Blogs", href: "/admin/blogs", icon: FileText },
      { label: "Careers", href: "/admin/careers", icon: Briefcase },
      { label: "Services", href: "/admin/services", icon: Layers },
      { label: "Solutions", href: "/admin/solutions", icon: Building2 },
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

export default function AdminSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  useEffect(() => {
    onClose();
    // Close the drawer after navigation. onClose is stable enough for this layout.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin" || pathname === "/admin/dashboard";
    }
    return pathname?.startsWith(href);
  };

  const itemClass = (active: boolean) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200 border-l-2 ${
      active
        ? "bg-technic-cyan-soft text-technic-cyan-deep border-technic-cyan font-medium"
        : "text-technic-secondary border-transparent hover:bg-technic-cyan-soft hover:text-technic-cyan-deep"
    }`;

  const handleLogout = async () => {
    const token = readAdminToken();
    clearAdminToken();
    try {
      await Promise.allSettled([
        fetch("/api/session", { method: "DELETE" }),
        fetch(`${apiBaseUrl()}/api/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
        }),
      ]);
    } catch (e) {
      console.error("Logout error", e);
    }
    window.location.replace("/admin/login");
  };

  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-technic-text/30 md:hidden"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-technic-border z-50 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-technic-border shrink-0">
          <Link href="/admin" className="flex items-center min-w-0" aria-label="Technic Technologies admin">
            <Image
              src="/Assest/logo-brand.png"
              alt="Technic Technologies"
              width={180}
              height={48}
              className="h-10 w-auto"
              priority
            />
          </Link>
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-technic-secondary hover:bg-technic-bg"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 no-scrollbar">
          <div>
            <Link href="/admin" className={itemClass(isActive("/admin"))}>
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
          </div>

          {NAV_ITEMS.filter((item) => item.items).map((group) => (
            <div key={group.label}>
              <h2 className="text-xs font-semibold text-technic-muted uppercase tracking-widest mb-3 px-3">
                {group.label}
              </h2>
              <div className="space-y-1">
                {group.items?.map((item) => (
                  <Link key={item.href} href={item.href} className={itemClass(!!isActive(item.href))}>
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-technic-border shrink-0">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-technic-secondary hover:text-technic-error hover:bg-technic-error-soft transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
