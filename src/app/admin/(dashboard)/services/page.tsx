"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { ApiClient } from "../../../../lib/api";

export default function ServicesListPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await ApiClient.get<any[]>('/api/services');
      setServices(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await ApiClient.delete(`/api/admin/services/${id}`);
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white font-heading">Services</h1>
        <Link 
          href="/admin/services/new" 
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Service
        </Link>
      </div>

      <div className="bg-[#131C31] border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No services found. Create one!</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-white/5 text-slate-300 border-b border-white/10">
              <tr>
                <th className="p-4 font-medium">Order</th>
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium">Icon (Ref)</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.sort((a, b) => a.order - b.order).map((service) => (
                <tr key={service._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-slate-400">{service.order}</td>
                  <td className="p-4 text-white font-medium">{service.title}</td>
                  <td className="p-4 text-slate-400">{service.icon}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${service.status === 'Published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                      {service.status}
                    </span>
                  </td>
                  <td className="p-4 flex space-x-3">
                    <Link href={`/admin/services/${service._id}`} className="text-blue-400 hover:text-blue-300">
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button onClick={() => deleteService(service._id)} className="text-rose-400 hover:text-rose-300">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
