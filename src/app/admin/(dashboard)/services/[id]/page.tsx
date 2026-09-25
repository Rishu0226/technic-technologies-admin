"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ApiClient } from "../../../../../lib/api";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ImageUpload from "../../../../../../components/admin/ui/ImageUpload";

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

  if (loading) return <div className="text-technic-text p-8">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="flex items-center mb-8">
        <Link href="/admin/services" className="text-technic-muted hover:text-technic-cyan-deep mr-4 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold text-technic-text font-heading">
          {isNew ? 'Create New Service' : 'Edit Service'}
        </h1>
      </div>

      {error && (
        <div className="bg-technic-error-soft border border-technic-error/20 text-technic-error p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white border border-technic-border rounded-2xl shadow-tn-md p-6">
          <h2 className="text-xl font-bold text-technic-text mb-6">Service Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="tn-label">Service Title *</label>
              <input name="title" value={formData.title} onChange={handleChange} required className="tn-input" />
            </div>
            
            <div>
              <label className="tn-label">Slug (URL friendly) *</label>
              <input name="slug" value={formData.slug} onChange={handleChange} required className="tn-input" />
            </div>
            
            <div>
              <label className="tn-label">Icon Name (Lucide React) *</label>
              <input name="icon" value={formData.icon} onChange={handleChange} required className="tn-input" placeholder="e.g. Code2, Smartphone, Globe" />
              <p className="text-xs text-technic-muted mt-1">Must exactly match a Lucide React icon name.</p>
            </div>
            
            <div className="md:col-span-2">
              <label className="tn-label">Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="tn-input"></textarea>
            </div>
            
            <div className="md:col-span-2">
              <ImageUpload
                label="Header image"
                value={formData.image}
                folder="services"
                onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
              />
            </div>
            
            <div>
              <label className="tn-label">Display Order</label>
              <input type="number" name="order" value={formData.order} onChange={handleChange} className="tn-input" />
              <p className="text-xs text-technic-muted mt-1">Lower numbers appear first.</p>
            </div>
            
            <div>
              <label className="tn-label">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="tn-input">
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="bg-brand-gradient text-white px-8 py-3 rounded-xl font-bold flex items-center hover:shadow-tn-sm transition-all disabled:opacity-50">
            {saving ? 'Saving...' : <><Save className="w-5 h-5 mr-2" /> Save Service</>}
          </button>
        </div>
      </form>
    </div>
  );
}
