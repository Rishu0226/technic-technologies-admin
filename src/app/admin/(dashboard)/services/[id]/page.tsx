"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ApiClient } from "../../../../../lib/api";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ServiceFormPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    icon: "Settings", // Default Lucide icon
    image: "",
    order: 0,
    status: "Draft",
  });

  useEffect(() => {
    if (!isNew) {
      fetchService();
    }
  }, [isNew]);

  const fetchService = async () => {
    try {
      const response = await ApiClient.get<any[]>(`/api/services`);
      const service = response.data.find((s: any) => s._id === params.id);
      if (service) {
        setFormData({
          title: service.title || "",
          slug: service.slug || "",
          description: service.description || "",
          icon: service.icon || "Settings",
          image: service.image || "",
          order: service.order || 0,
          status: service.status || "Draft",
        });
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load service data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "order" ? parseInt(value) || 0 : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (isNew) {
        await ApiClient.post('/api/admin/services', formData);
      } else {
        await ApiClient.put(`/api/admin/services/${params.id}`, formData);
      }
      router.push('/admin/services');
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="max-w-3xl pb-20">
      <div className="flex items-center mb-8">
        <Link href="/admin/services" className="text-slate-400 hover:text-white mr-4 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold text-white font-heading">
          {isNew ? 'Create New Service' : 'Edit Service'}
        </h1>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-[#131C31] border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Service Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-300 mb-2">Service Title *</label>
              <input name="title" value={formData.title} onChange={handleChange} required className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" />
            </div>
            
            <div>
              <label className="block text-sm text-slate-300 mb-2">Slug (URL friendly) *</label>
              <input name="slug" value={formData.slug} onChange={handleChange} required className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" />
            </div>
            
            <div>
              <label className="block text-sm text-slate-300 mb-2">Icon Name (Lucide React) *</label>
              <input name="icon" value={formData.icon} onChange={handleChange} required className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" placeholder="e.g. Code2, Smartphone, Globe" />
              <p className="text-xs text-slate-500 mt-1">Must exactly match a Lucide React icon name.</p>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-300 mb-2">Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white"></textarea>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-300 mb-2">Optional Header Image URL</label>
              <input name="image" value={formData.image} onChange={handleChange} className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" placeholder="https://..." />
            </div>
            
            <div>
              <label className="block text-sm text-slate-300 mb-2">Display Order</label>
              <input type="number" name="order" value={formData.order} onChange={handleChange} className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" />
              <p className="text-xs text-slate-500 mt-1">Lower numbers appear first.</p>
            </div>
            
            <div>
              <label className="block text-sm text-slate-300 mb-2">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white">
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="bg-gradient-to-r from-orange-600 to-rose-600 text-white px-8 py-3 rounded-xl font-bold flex items-center hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all disabled:opacity-50">
            {saving ? 'Saving...' : <><Save className="w-5 h-5 mr-2" /> Save Service</>}
          </button>
        </div>
      </form>
    </div>
  );
}
