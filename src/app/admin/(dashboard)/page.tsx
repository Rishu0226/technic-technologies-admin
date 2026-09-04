"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  Package, 
  Settings 
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
      // Fetch all collections concurrently to calculate stats
      // In a production app, you would create a dedicated /api/admin/stats endpoint
      const [careersRes, blogsRes, servicesRes, productsRes, contactsRes] = await Promise.all([
        ApiClient.get<any[]>('/api/careers').catch(() => ({ data: [] })),
        ApiClient.get<any[]>('/api/blogs').catch(() => ({ data: [] })),
        ApiClient.get<any[]>('/api/services').catch(() => ({ data: [] })),
        ApiClient.get<any[]>('/api/products').catch(() => ({ data: [] })),
        ApiClient.get<any[]>('/api/admin/contacts').catch(() => ({ data: [] })) // Protected route
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
    {
      title: "Active Careers",
      value: stats.careers,
      icon: <Briefcase className="w-8 h-8 text-orange-400" />,
      color: "from-orange-500/20 to-orange-500/5",
      borderColor: "border-orange-500/20",
      link: "/admin/careers"
    },
    {
      title: "Blog Posts",
      value: stats.blogs,
      icon: <FileText className="w-8 h-8 text-blue-400" />,
      color: "from-blue-500/20 to-blue-500/5",
      borderColor: "border-blue-500/20",
      link: "/admin/blogs"
    },
    {
      title: "Services",
      value: stats.services,
      icon: <Settings className="w-8 h-8 text-emerald-400" />,
      color: "from-emerald-500/20 to-emerald-500/5",
      borderColor: "border-emerald-500/20",
      link: "/admin/services"
    },
    {
      title: "Products",
      value: stats.products,
      icon: <Package className="w-8 h-8 text-rose-400" />,
      color: "from-rose-500/20 to-rose-500/5",
      borderColor: "border-rose-500/20",
      link: "/admin/products"
    },
    {
      title: "Contact Messages",
      value: stats.contacts,
      icon: <MessageSquare className="w-8 h-8 text-amber-400" />,
      color: "from-amber-500/20 to-amber-500/5",
      borderColor: "border-amber-500/20",
      link: "/admin/contacts"
    }
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white font-heading">Dashboard Overview</h1>
          <p className="text-slate-400 mt-2">Welcome back to the Technic Technologies admin panel.</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-[#131C31] h-32 rounded-2xl border border-white/5"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {statCards.map((card, idx) => (
            <Link href={card.link} key={idx} className="block group">
              <div className={`bg-[#131C31] rounded-2xl p-6 border ${card.borderColor} bg-gradient-to-br ${card.color} hover:scale-105 transition-transform duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.2)] h-full`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-[#0B1221]/50 rounded-xl">
                    {card.icon}
                  </div>
                  <TrendingUp className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-slate-400 text-sm font-medium mb-1">{card.title}</h3>
                  <p className="text-3xl font-bold text-white font-heading">{card.value}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity Mockup (Could be connected to an audit log backend later) */}
        <div className="bg-[#131C31] border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">System Status</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mr-4">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
              </div>
              <div>
                <h4 className="text-white font-medium">Database Connected</h4>
                <p className="text-sm text-slate-400 mt-1">MongoDB cluster is fully operational.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
                <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse"></div>
              </div>
              <div>
                <h4 className="text-white font-medium">API Endpoints Online</h4>
                <p className="text-sm text-slate-400 mt-1">All REST services are responding.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#131C31] border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/careers/new" className="bg-[#0B1221] border border-white/5 hover:border-orange-500/30 p-4 rounded-xl flex flex-col items-center justify-center text-center transition-all group">
              <Briefcase className="w-6 h-6 text-slate-400 group-hover:text-orange-400 mb-2" />
              <span className="text-sm font-medium text-slate-300 group-hover:text-white">New Career</span>
            </Link>
            <Link href="/admin/blogs/new" className="bg-[#0B1221] border border-white/5 hover:border-blue-500/30 p-4 rounded-xl flex flex-col items-center justify-center text-center transition-all group">
              <FileText className="w-6 h-6 text-slate-400 group-hover:text-blue-400 mb-2" />
              <span className="text-sm font-medium text-slate-300 group-hover:text-white">Write Blog</span>
            </Link>
            <Link href="/admin/services" className="bg-[#0B1221] border border-white/5 hover:border-emerald-500/30 p-4 rounded-xl flex flex-col items-center justify-center text-center transition-all group">
              <Settings className="w-6 h-6 text-slate-400 group-hover:text-emerald-400 mb-2" />
              <span className="text-sm font-medium text-slate-300 group-hover:text-white">Manage Services</span>
            </Link>
            <Link href="/admin/contacts" className="bg-[#0B1221] border border-white/5 hover:border-amber-500/30 p-4 rounded-xl flex flex-col items-center justify-center text-center transition-all group">
              <MessageSquare className="w-6 h-6 text-slate-400 group-hover:text-amber-400 mb-2" />
              <span className="text-sm font-medium text-slate-300 group-hover:text-white">View Messages</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
