"use client";

import React, { useEffect, useState } from "react";
import { ApiClient } from "../../../../lib/api";
import { Save, Globe, MapPin, Mail, Phone, MessageCircle } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    address: "",
    email: "",
    phone: "",
    whatsapp: "",
    googleMaps: "",
    footerInformation: "",
    socialLinks: {
      linkedin: "",
      twitter: "",
      facebook: "",
      instagram: ""
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await ApiClient.get<any>('/api/settings');
      if (response.data) {
        setFormData({
          companyName: response.data.companyName || "",
          address: response.data.address || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          whatsapp: response.data.whatsapp || "",
          googleMaps: response.data.googleMaps || "",
          footerInformation: response.data.footerInformation || "",
          socialLinks: {
            linkedin: response.data.socialLinks?.linkedin || "",
            twitter: response.data.socialLinks?.twitter || "",
            facebook: response.data.socialLinks?.facebook || "",
            instagram: response.data.socialLinks?.instagram || ""
          }
        });
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await ApiClient.put('/api/admin/settings', formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred while saving settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white p-8">Loading settings...</div>;

  return (
    <div className="max-w-4xl pb-20">
      <div className="flex items-center mb-8">
        <h1 className="text-3xl font-bold text-white font-heading">
          Global Site Settings
        </h1>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl mb-6 flex items-center">
          <Globe className="w-5 h-5 mr-2" /> Settings updated successfully and pushed to the live site.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Info */}
        <div className="bg-[#131C31] border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-blue-400" />
            General Information
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm text-slate-300 mb-2">Company Name</label>
              <input name="companyName" value={formData.companyName} onChange={handleChange} required className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">Footer Information / Copyright text</label>
              <input name="footerInformation" value={formData.footerInformation} onChange={handleChange} className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-[#131C31] border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Mail className="w-5 h-5 mr-2 text-orange-400" />
            Contact Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-300 mb-2 flex items-center">
                <Mail className="w-4 h-4 mr-2" /> Email Address
              </label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2 flex items-center">
                <Phone className="w-4 h-4 mr-2" /> Phone Number
              </label>
              <input name="phone" value={formData.phone} onChange={handleChange} required className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-300 mb-2 flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp Number (Include country code)
              </label>
              <input name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-300 mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-2" /> Office Address
              </label>
              <textarea name="address" value={formData.address} onChange={handleChange} rows={3} required className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white"></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-300 mb-2">Google Maps Embed HTML (iframe)</label>
              <textarea name="googleMaps" value={formData.googleMaps} onChange={handleChange} rows={3} className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white"></textarea>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-[#131C31] border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-300 mb-2">LinkedIn URL</label>
              <input name="linkedin" value={formData.socialLinks.linkedin} onChange={handleSocialChange} className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">Twitter (X) URL</label>
              <input name="twitter" value={formData.socialLinks.twitter} onChange={handleSocialChange} className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">Facebook URL</label>
              <input name="facebook" value={formData.socialLinks.facebook} onChange={handleSocialChange} className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">Instagram URL</label>
              <input name="instagram" value={formData.socialLinks.instagram} onChange={handleSocialChange} className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="bg-gradient-to-r from-orange-600 to-rose-600 text-white px-8 py-3 rounded-xl font-bold flex items-center hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all disabled:opacity-50">
            {saving ? 'Saving...' : <><Save className="w-5 h-5 mr-2" /> Save Global Settings</>}
          </button>
        </div>
      </form>
    </div>
  );
}
