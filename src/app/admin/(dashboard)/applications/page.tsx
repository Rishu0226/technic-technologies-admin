"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Briefcase, Mail, Download, CheckCircle, XCircle, Clock } from "lucide-react";
import { ApiClient } from "../../../../lib/api";
import { toast } from "react-hot-toast";

export default function ApplicationsListPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await ApiClient.get<any[]>('/api/admin/applications');
      setApplications(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openResume = async (id: string) => {
    try {
      const response = await ApiClient.get<{ downloadUrl: string }>(`/api/admin/applications/${id}/resume`);
      window.open(response.data.downloadUrl, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("Could not open the resume.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New': return <span className="bg-technic-cyan-soft text-technic-cyan-deep border border-technic-cyan/30 px-2 py-1 rounded-md text-xs font-medium">New</span>;
      case 'Reviewing': return <span className="bg-technic-orange-soft text-technic-orange-deep border border-technic-orange/30 px-2 py-1 rounded-md text-xs font-medium">Reviewing</span>;
      case 'Shortlisted': return <span className="bg-technic-cyan-soft text-technic-cyan-deep border border-technic-cyan/30 px-2 py-1 rounded-md text-xs font-medium">Shortlisted</span>;
      case 'Interview': return <span className="bg-technic-orange-soft text-technic-orange-deep border border-technic-orange/30 px-2 py-1 rounded-md text-xs font-medium">Interview</span>;
      case 'Hired': return <span className="bg-technic-success-soft text-technic-success border border-technic-success/20 px-2 py-1 rounded-md text-xs font-medium">Hired</span>;
      case 'Rejected': return <span className="bg-technic-error-soft text-technic-error border border-technic-error/20 px-2 py-1 rounded-md text-xs font-medium">Rejected</span>;
      default: return <span className="bg-technic-neutral-soft text-technic-muted border border-technic-border px-2 py-1 rounded-md text-xs font-medium">{status}</span>;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-technic-text font-heading">Job Applications</h1>
      </div>

      <div className="bg-white border border-technic-border rounded-2xl shadow-tn-md overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-technic-muted">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="p-8 text-center text-technic-muted">No applications received yet.</div>
        ) : (
          <table className="w-full min-w-[720px] text-left">
            <thead className="bg-technic-header text-technic-muted border-b border-technic-border">
              <tr>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Applicant</th>
                <th className="p-4 font-medium">Position</th>
                <th className="p-4 font-medium">Experience</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id} className="border-b border-technic-border hover:bg-technic-bg transition-colors">
                  <td className="p-4 text-technic-muted text-sm">{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <div className="text-technic-text font-medium">{app.applicantName}</div>
                    <div className="text-technic-muted text-xs flex items-center mt-1">
                      <Mail className="w-3 h-3 mr-1" /> {app.email}
                    </div>
                  </td>
                  <td className="p-4 text-technic-secondary">
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-2 text-technic-cyan-deep" />
                      {app.jobId?.title || 'Unknown Job'}
                    </div>
                  </td>
                  <td className="p-4 text-technic-muted">{app.experience}</td>
                  <td className="p-4">
                    {getStatusBadge(app.status)}
                  </td>
                  <td className="p-4 flex space-x-3">
                    <Link href={`/admin/applications/${app._id}`} className="text-technic-cyan-deep hover:text-technic-cyan" title="Review Application">
                      <Eye className="w-5 h-5" aria-hidden="true" /><span className="sr-only">View</span>
                    </Link>
                    {/^https?:\/\//i.test(app.resumeUrl || "") && (
                      <button type="button" onClick={() => openResume(app._id)} className="text-technic-cyan-deep hover:text-technic-cyan" title="Open resume PDF">
                        <Download className="w-5 h-5" aria-hidden="true" /><span className="sr-only">Download resume</span>
                      </button>
                    )}
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
