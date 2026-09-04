"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ApiClient } from "../../../../../lib/api";
import { Save, ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

export default function ProductFormPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    tagline: "",
    description: "",
    icon: "Package", // Default Lucide icon
    image: "",
    order: 0,
    status: "Draft",
  });

  const [features, setFeatures] = useState<string[]>([]);

  useEffect(() => {
    if (!isNew) {
      fetchProduct();
    }
  }, [isNew]);

  const fetchProduct = async () => {
    try {
      const response = await ApiClient.get<any[]>(`/api/products`);
      const product = response.data.find((p: any) => p._id === params.id);
      if (product) {
        setFormData({
          name: product.name || "",
          slug: product.slug || "",
          tagline: product.tagline || "",
          description: product.description || "",
          icon: product.icon || "Package",
          image: product.image || "",
          order: product.order || 0,
          status: product.status || "Draft",
        });
        setFeatures(product.features || []);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load product data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "order" ? parseInt(value) || 0 : value });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const addFeature = () => setFeatures([...features, ""]);
  const removeFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...formData,
      features: features.filter(Boolean)
    };

    try {
      if (isNew) {
        await ApiClient.post('/api/admin/products', payload);
      } else {
        await ApiClient.put(`/api/admin/products/${params.id}`, payload);
      }
      router.push('/admin/products');
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="max-w-4xl pb-20">
      <div className="flex items-center mb-8">
        <Link href="/admin/products" className="text-slate-400 hover:text-white mr-4 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold text-white font-heading">
          {isNew ? 'Create New Product' : 'Edit Product'}
        </h1>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-[#131C31] border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Product Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-300 mb-2">Product Name *</label>
              <input name="name" value={formData.name} onChange={handleChange} required className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" />
            </div>
            
            <div>
              <label className="block text-sm text-slate-300 mb-2">Slug (URL friendly) *</label>
              <input name="slug" value={formData.slug} onChange={handleChange} required className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-slate-300 mb-2">Tagline *</label>
              <input name="tagline" value={formData.tagline} onChange={handleChange} required className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" placeholder="e.g. AI-Powered Enterprise Resource Planning" />
            </div>
            
            <div>
              <label className="block text-sm text-slate-300 mb-2">Icon Name (Lucide React) *</label>
              <input name="icon" value={formData.icon} onChange={handleChange} required className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" placeholder="e.g. Brain, Database, Cloud" />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">Display Order</label>
              <input type="number" name="order" value={formData.order} onChange={handleChange} className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" />
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
              <label className="block text-sm text-slate-300 mb-2">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white">
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Features List */}
        <div className="bg-[#131C31] border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Product Features</h2>
            <button type="button" onClick={addFeature} className="text-orange-400 text-sm flex items-center">
              <Plus className="w-4 h-4 mr-1" /> Add Feature
            </button>
          </div>
          <p className="text-sm text-slate-400 mb-4">List the key features of this product (displayed as bullet points).</p>
          <div className="space-y-3">
            {features.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <input value={item} onChange={(e) => handleFeatureChange(idx, e.target.value)} className="flex-1 bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" placeholder={`Feature ${idx + 1}`} />
                <button type="button" onClick={() => removeFeature(idx)} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"><Trash2 className="w-5 h-5" /></button>
              </div>
            ))}
            {features.length === 0 && <p className="text-slate-500 italic text-sm">No features added yet.</p>}
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="bg-gradient-to-r from-orange-600 to-rose-600 text-white px-8 py-3 rounded-xl font-bold flex items-center hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all disabled:opacity-50">
            {saving ? 'Saving...' : <><Save className="w-5 h-5 mr-2" /> Save Product</>}
          </button>
        </div>
      </form>
    </div>
  );
}
