"use client";

import React, { useEffect, useState } from "react";
import {
  Briefcase,
  FileText,
  MessageSquare,
  Package,
  Settings,
} from "lucide-react";
import { ApiClient } from "../../../lib/api";
import Link from "next/link";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    careers: 0,
    blogs: 0,
    services: 0,
    products: 0,
    contacts: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [careersRes, blogsRes, servicesRes, productsRes, contactsRes] = await Promise.all([
        ApiClient.get<any[]>("/api/careers").catch(() => ({ data: [] })),
        ApiClient.get<any[]>("/api/blogs").catch(() => ({ data: [] })),
        ApiClient.get<any[]>("/api/services").catch(() => ({ data: [] })),
        ApiClient.get<any[]>("/api/products").catch(() => ({ data: [] })),
        ApiClient.get<any[]>("/api/admin/contacts").catch(() => ({ data: [] })),
      ]);

      setStats({
        careers: (careersRes as any).data?.length || 0,
        blogs: (blogsRes as any).data?.length || 0,
        services: (servicesRes as any).data?.length || 0,
        products: (productsRes as any).data?.length || 0,
        contacts: (contactsRes as any).data?.length || 0,
      });
    } catch (error) {
      console.error("Failed to load dashboard stats", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: "Careers", value: stats.careers, icon: Briefcase, link: "/admin/careers", accent: false },
    { title: "Blogs", value: stats.blogs, icon: FileText, link: "/admin/blogs", accent: true },
    { title: "Services", value: stats.services, icon: Settings, link: "/admin/services", accent: false },
    { title: "Products", value: stats.products, icon: Package, link: "/admin/products", accent: true },
    { title: "Contacts", value: stats.contacts, icon: MessageSquare, link: "/admin/contacts", accent: false },
  ];

  const actions = [
    { href: "/admin/careers/new", label: "New Career", icon: Briefcase },
    { href: "/admin/blogs/new", label: "Write Blog", icon: FileText },
    { href: "/admin/services", label: "Manage Services", icon: Settings },
    { href: "/admin/contacts", label: "View Messages", icon: MessageSquare },
  ];

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-technic-text">Dashboard Overview</h1>
        <p className="text-technic-muted mt-2">Welcome back to the Technic Technologies admin panel.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white h-32 rounded-2xl border border-technic-border animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link href={card.link} key={card.title} className="block group">
                <div className="bg-white rounded-2xl p-6 border border-technic-border shadow-tn-card hover:-translate-y-0.5 hover:border-technic-cyan transition-all duration-300 h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-technic-cyan-soft rounded-xl">
                      <Icon className="w-6 h-6 text-technic-cyan-deep" />
                    </div>
                    <span className={`mt-1 h-2 w-2 rounded-full ${card.accent ? "bg-technic-orange" : "bg-technic-cyan"}`} />
                  </div>
                  <h2 className="text-technic-muted text-sm font-medium mb-1">{card.title}</h2>
                  <p className="text-3xl font-bold text-technic-text">{card.value}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-technic-border rounded-2xl p-6 shadow-tn-sm">
          <h2 className="text-xl font-bold text-technic-text mb-6">System Status</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-technic-success-soft flex items-center justify-center mr-4">
                <div className="w-3 h-3 rounded-full bg-technic-success" />
              </div>
              <div>
                <h3 className="text-technic-text font-medium">Database Connected</h3>
                <p className="text-sm text-technic-muted mt-1">MongoDB cluster is fully operational.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-technic-cyan-soft flex items-center justify-center mr-4">
                <div className="w-3 h-3 rounded-full bg-technic-cyan" />
              </div>
              <div>
                <h3 className="text-technic-text font-medium">API Endpoints Online</h3>
                <p className="text-sm text-technic-muted mt-1">All REST services are responding.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-technic-border rounded-2xl p-6 shadow-tn-sm">
          <h2 className="text-xl font-bold text-technic-text mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="bg-technic-bg border border-technic-border hover:border-technic-cyan p-4 rounded-xl flex flex-col items-center justify-center text-center transition-colors group"
                >
                  <Icon className="w-6 h-6 text-technic-cyan-deep mb-2" />
                  <span className="text-sm font-medium text-technic-secondary group-hover:text-technic-cyan-deep">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
