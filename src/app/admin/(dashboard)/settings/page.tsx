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

  if (loading) return <div className="text-technic-text p-8">Loading settings...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center mb-8">
        <h1 className="text-3xl font-bold text-technic-text font-heading">
          Global Site Settings
        </h1>
      </div>

      {error && (
        <div className="bg-technic-error-soft border border-technic-error/20 text-technic-error p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-technic-success-soft border border-technic-success/20 text-technic-success p-4 rounded-xl mb-6 flex items-center">
          <Globe className="w-5 h-5 mr-2" /> Settings updated successfully and pushed to the live site.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Info */}
        <div className="bg-white border border-technic-border rounded-2xl shadow-tn-md p-6">
          <h2 className="text-xl font-bold text-technic-text mb-6 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-technic-cyan-deep" />
            General Information
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="tn-label">Company Name</label>
              <input name="companyName" value={formData.companyName} onChange={handleChange} required className="tn-input" />
            </div>
            <div>
              <label className="tn-label">Footer Information / Copyright text</label>
              <input name="footerInformation" value={formData.footerInformation} onChange={handleChange} className="tn-input" />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white border border-technic-border rounded-2xl shadow-tn-md p-6">
          <h2 className="text-xl font-bold text-technic-text mb-6 flex items-center">
            <Mail className="w-5 h-5 mr-2 text-technic-cyan-deep" />
            Contact Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="tn-label flex items-center">
                <Mail className="w-4 h-4 mr-2" /> Email Address
              </label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="tn-input" />
            </div>
            <div>
              <label className="tn-label flex items-center">
                <Phone className="w-4 h-4 mr-2" /> Phone Number
              </label>
              <input name="phone" value={formData.phone} onChange={handleChange} required className="tn-input" />
            </div>
            <div className="md:col-span-2">
              <label className="tn-label flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp Number (Include country code)
              </label>
              <input name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="tn-input" />
            </div>
            <div className="md:col-span-2">
              <label className="tn-label flex items-center">
                <MapPin className="w-4 h-4 mr-2" /> Office Address
              </label>
              <textarea name="address" value={formData.address} onChange={handleChange} rows={3} required className="tn-input"></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="tn-label">Google Maps Embed HTML (iframe)</label>
              <textarea name="googleMaps" value={formData.googleMaps} onChange={handleChange} rows={3} className="tn-input"></textarea>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white border border-technic-border rounded-2xl shadow-tn-md p-6">
          <h2 className="text-xl font-bold text-technic-text mb-6">Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="tn-label">LinkedIn URL</label>
              <input name="linkedin" value={formData.socialLinks.linkedin} onChange={handleSocialChange} className="tn-input" />
            </div>
            <div>
              <label className="tn-label">Twitter (X) URL</label>
              <input name="twitter" value={formData.socialLinks.twitter} onChange={handleSocialChange} className="tn-input" />
            </div>
            <div>
              <label className="tn-label">Facebook URL</label>
              <input name="facebook" value={formData.socialLinks.facebook} onChange={handleSocialChange} className="tn-input" />
            </div>
            <div>
              <label className="tn-label">Instagram URL</label>
              <input name="instagram" value={formData.socialLinks.instagram} onChange={handleSocialChange} className="tn-input" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="bg-brand-gradient text-white px-8 py-3 rounded-xl font-bold flex items-center hover:shadow-tn-sm transition-all disabled:opacity-50">
            {saving ? 'Saving...' : <><Save className="w-5 h-5 mr-2" /> Save Global Settings</>}
          </button>
        </div>
      </form>
    </div>
  );
}
