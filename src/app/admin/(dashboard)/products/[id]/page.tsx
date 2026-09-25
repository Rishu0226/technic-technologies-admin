"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ApiClient } from "../../../../../lib/api";
import { Save, ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import ImageUpload from "../../../../../../components/admin/ui/ImageUpload";

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

  if (loading) return <div className="text-technic-text p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center mb-8">
        <Link href="/admin/products" className="text-technic-muted hover:text-technic-cyan-deep mr-4 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold text-technic-text font-heading">
          {isNew ? 'Create New Product' : 'Edit Product'}
        </h1>
      </div>

      {error && (
        <div className="bg-technic-error-soft border border-technic-error/20 text-technic-error p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white border border-technic-border rounded-2xl shadow-tn-md p-6">
          <h2 className="text-xl font-bold text-technic-text mb-6">Product Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="tn-label">Product Name *</label>
              <input name="name" value={formData.name} onChange={handleChange} required className="tn-input" />
            </div>
            
            <div>
              <label className="tn-label">Slug (URL friendly) *</label>
              <input name="slug" value={formData.slug} onChange={handleChange} required className="tn-input" />
            </div>

            <div className="md:col-span-2">
              <label className="tn-label">Tagline *</label>
              <input name="tagline" value={formData.tagline} onChange={handleChange} required className="tn-input" placeholder="e.g. AI-Powered Enterprise Resource Planning" />
            </div>
            
            <div>
              <label className="tn-label">Icon Name (Lucide React) *</label>
              <input name="icon" value={formData.icon} onChange={handleChange} required className="tn-input" placeholder="e.g. Brain, Database, Cloud" />
            </div>

            <div>
              <label className="tn-label">Display Order</label>
              <input type="number" name="order" value={formData.order} onChange={handleChange} className="tn-input" />
            </div>
            
            <div className="md:col-span-2">
              <label className="tn-label">Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="tn-input"></textarea>
            </div>
            
            <div className="md:col-span-2">
              <ImageUpload
                label="Header image"
                value={formData.image}
                folder="products"
                onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
              />
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

        {/* Dynamic Features List */}
        <div className="bg-white border border-technic-border rounded-2xl shadow-tn-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-technic-text">Product Features</h2>
            <button type="button" onClick={addFeature} className="text-technic-cyan-deep text-sm flex items-center">
              <Plus className="w-4 h-4 mr-1" /> Add Feature
            </button>
          </div>
          <p className="text-sm text-technic-muted mb-4">List the key features of this product (displayed as bullet points).</p>
          <div className="space-y-3">
            {features.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <input value={item} onChange={(e) => handleFeatureChange(idx, e.target.value)} className="tn-input flex-1" placeholder={`Feature ${idx + 1}`} />
                <button type="button" onClick={() => removeFeature(idx)} className="p-2 text-technic-error hover:bg-technic-error-soft rounded-lg"><Trash2 className="w-5 h-5" aria-hidden="true" /><span className="sr-only">Delete</span></button>
              </div>
            ))}
            {features.length === 0 && <p className="text-technic-muted italic text-sm">No features added yet.</p>}
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="bg-brand-gradient text-white px-8 py-3 rounded-xl font-bold flex items-center hover:shadow-tn-sm transition-all disabled:opacity-50">
            {saving ? 'Saving...' : <><Save className="w-5 h-5 mr-2" /> Save Product</>}
          </button>
        </div>
      </form>
    </div>
  );
}
