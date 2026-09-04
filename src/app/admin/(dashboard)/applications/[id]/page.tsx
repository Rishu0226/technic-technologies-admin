"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ApiClient } from "../../../../../lib/api";
import { Save, ArrowLeft, Mail, Phone, Calendar, User, Briefcase, FileText, Download } from "lucide-react";
import Link from "next/link";

export default function ApplicationViewPage() {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [application, setApplication] = useState<any>(null);
  const [status, setStatus] = useState("New");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchApplication();
  }, []);

  const fetchApplication = async () => {
    try {
      const response = await ApiClient.get<any[]>(`/api/admin/applications`);
      const found = response.data.find((a: any) => a._id === params.id);
      if (found) {
        setApplication(found);
        setStatus(found.status || "New");
        setNotes(found.notes || "");
        
        // Auto-mark as Reviewing if it's currently New
        if (found.status === "New") {
          updateStatusSilent(found._id, "Reviewing");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load application data");
    } finally {
      setLoading(false);
    }
  };

  const updateStatusSilent = async (id: string, newStatus: string) => {
    try {
      await ApiClient.put(`/api/admin/applications/${id}/status`, { status: newStatus });
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
      await ApiClient.put(`/api/admin/applications/${params.id}/status`, { status, notes });
      router.push('/admin/applications');
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white p-8">Loading...</div>;
  if (!application) return <div className="text-white p-8">Application not found.</div>;

  return (
    <div className="max-w-5xl pb-20">
      <div className="flex items-center mb-8">
        <Link href="/admin/applications" className="text-slate-400 hover:text-white mr-4 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold text-white font-heading flex items-center">
          <FileText className="w-8 h-8 mr-3 text-orange-400" />
          Review Application
        </h1>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#131C31] border border-white/10 rounded-2xl p-8 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 pb-8 border-b border-white/10 gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex items-center text-2xl font-bold text-white">
                  <User className="w-6 h-6 mr-3 text-blue-400" />
                  {application.applicantName}
                </div>
                <div className="flex items-center text-slate-300">
                  <Mail className="w-5 h-5 mr-3 text-rose-400" />
                  <a href={`mailto:${application.email}`} className="hover:text-rose-400 transition-colors">{application.email}</a>
                </div>
                {application.phone && (
                  <div className="flex items-center text-slate-300">
                    <Phone className="w-5 h-5 mr-3 text-emerald-400" />
                    <a href={`tel:${application.phone}`} className="hover:text-emerald-400 transition-colors">{application.phone}</a>
                  </div>
                )}
              </div>

              <div className="space-y-4 md:text-right">
                <div className="flex items-center md:justify-end text-slate-300 font-medium">
                  <Briefcase className="w-5 h-5 mr-2 text-orange-400" />
                  {application.jobId?.title || 'Unknown Job'}
                </div>
                <div className="flex items-center md:justify-end text-slate-400 text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(application.createdAt).toLocaleString()}
                </div>
                <div className="flex items-center md:justify-end">
                  <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg text-sm flex items-center transition-colors">
                    <Download className="w-4 h-4 mr-2" />
                    View Resume
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-6">Application Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0B1221]/50 border border-white/5 p-4 rounded-xl">
                  <span className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Experience Level</span>
                  <span className="text-white font-medium">{application.experience}</span>
                </div>
                
                {/* Render Dynamic Fields */}
                {application.fields && Object.entries(application.fields).map(([key, value]) => {
                  // Skip keys that are already main fields
                  if (['applicantName', 'email', 'phone', 'experience', 'resumeUrl', 'name', 'Full Name', 'Email', 'Phone', 'Experience', 'Resume'].includes(key)) return null;
                  
                  return (
                    <div key={key} className="bg-[#0B1221]/50 border border-white/5 p-4 rounded-xl col-span-1 md:col-span-2">
                      <span className="block text-xs text-slate-500 uppercase tracking-wider mb-1">{key}</span>
                      <span className="text-white whitespace-pre-wrap">{value as React.ReactNode}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <form onSubmit={handleSubmit} className="bg-[#131C31] border border-white/10 rounded-2xl p-6 shadow-xl sticky top-24">
            <h3 className="text-lg font-bold text-white mb-6">Review & Action</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-slate-300 mb-2 font-medium">Application Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-[#0B1221] border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-orange-500 transition-colors"
                >
                  <option value="New">New</option>
                  <option value="Reviewing">Reviewing</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview">Interview</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Hired">Hired</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2 font-medium">Internal Notes</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={6}
                  placeholder="Private notes about this candidate..."
                  className="w-full bg-[#0B1221] border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-orange-500 transition-colors resize-none"
                ></textarea>
              </div>

              <button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-orange-600 to-rose-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all disabled:opacity-50">
                {saving ? 'Saving...' : <><Save className="w-5 h-5 mr-2" /> Save Review</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
