"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ApiClient } from "../../../../../lib/api";
import { Save, ArrowLeft, Mail, Phone, Calendar, User, Tag } from "lucide-react";
import Link from "next/link";

export default function ContactViewPage() {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [contact, setContact] = useState<any>(null);
  const [status, setStatus] = useState("New");

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const response = await ApiClient.get<any[]>(`/api/admin/contacts`);
      const found = response.data.find((c: any) => c._id === params.id);
      if (found) {
        setContact(found);
        setStatus(found.status || "New");
        
        // Auto-mark as read if it's currently New
        if (found.status === "New") {
          updateStatusSilent(found._id, "Read");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load contact data");
    } finally {
      setLoading(false);
    }
  };

  const updateStatusSilent = async (id: string, newStatus: string) => {
    try {
      await ApiClient.put(`/api/admin/contacts/${id}`, { status: newStatus });
      setStatus(newStatus);
    } catch (e) {
      console.error("Failed to auto-update status", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await ApiClient.put(`/api/admin/contacts/${params.id}`, { status });
      router.push('/admin/contacts');
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-technic-text p-8">Loading...</div>;
  if (!contact) return <div className="text-technic-text p-8">Contact message not found.</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center mb-8">
        <Link href="/admin/contacts" className="text-technic-muted hover:text-technic-cyan-deep mr-4 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold text-technic-text font-heading">
          View Message
        </h1>
      </div>

      {error && (
        <div className="bg-technic-error-soft border border-technic-error/20 text-technic-error p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      <div className="bg-white border border-technic-border rounded-2xl shadow-tn-md p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 pb-8 border-b border-technic-border gap-6">
          <div className="space-y-4 flex-1">
            <div className="flex items-center text-xl font-bold text-technic-text">
              <User className="w-6 h-6 mr-3 text-technic-cyan-deep" />
              {contact.firstName} {contact.lastName}
            </div>
            <div className="flex items-center text-technic-secondary">
              <Mail className="w-5 h-5 mr-3 text-technic-cyan-deep" />
              <a href={`mailto:${contact.email}`} className="hover:text-technic-cyan transition-colors">{contact.email}</a>
            </div>
            {contact.phone && (
              <div className="flex items-center text-technic-secondary">
                <Phone className="w-5 h-5 mr-3 text-technic-success" />
                <a href={`tel:${contact.phone}`} className="hover:text-technic-cyan-deep transition-colors">{contact.phone}</a>
              </div>
            )}
          </div>

          <div className="space-y-4 md:text-right">
            <div className="flex items-center md:justify-end text-technic-muted text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(contact.createdAt).toLocaleString()}
            </div>
            <div className="flex items-center md:justify-end text-technic-secondary">
              <Tag className="w-4 h-4 mr-2 text-technic-error" />
              <span className="bg-technic-header border border-technic-border px-3 py-1 rounded-full text-sm">
                {contact.interest}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-medium text-technic-muted uppercase tracking-wider mb-4">Message Details</h3>
          <div className="bg-technic-header0 border border-technic-border p-6 rounded-xl">
            <p className="text-technic-text leading-relaxed whitespace-pre-wrap font-sans text-lg">
              {contact.message}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="border-t border-technic-border pt-8 flex items-center justify-between">
          <div className="flex items-center">
            <label className="text-sm text-technic-secondary mr-4 font-medium">Update Status:</label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              className="bg-white border border-technic-border rounded-lg px-4 py-2 text-technic-text outline-none focus:border-technic-cyan transition-colors"
            >
              <option value="New">New</option>
              <option value="Read">Read</option>
              <option value="Responded">Responded</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
          <button type="submit" disabled={saving} className="bg-brand-gradient text-white px-6 py-2 rounded-lg font-medium flex items-center shadow-tn-sm transition-opacity hover:opacity-95 disabled:opacity-50">
            {saving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Status</>}
          </button>
        </form>
      </div>
      
      <div className="flex justify-center">
        <a 
          href={`mailto:${contact.email}?subject=Re: Inquiry at Technic Technologies`}
          className="bg-brand-gradient text-white px-8 py-4 rounded-xl font-semibold flex items-center shadow-tn-sm transition-opacity hover:opacity-95"
        >
          <Mail className="w-5 h-5 mr-3" />
          Reply via Email Client
        </a>
      </div>
    </div>
  );
}
