"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Briefcase, Mail, CheckCircle, XCircle, Clock } from "lucide-react";
import { ApiClient } from "../../../../lib/api";

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New': return <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-1 rounded-md text-xs font-medium">New</span>;
      case 'Reviewing': return <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-1 rounded-md text-xs font-medium">Reviewing</span>;
      case 'Shortlisted': return <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-1 rounded-md text-xs font-medium">Shortlisted</span>;
      case 'Interview': return <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-1 rounded-md text-xs font-medium">Interview</span>;
      case 'Hired': return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-md text-xs font-medium">Hired</span>;
      case 'Rejected': return <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-1 rounded-md text-xs font-medium">Rejected</span>;
      default: return <span className="bg-slate-500/20 text-slate-400 border border-slate-500/30 px-2 py-1 rounded-md text-xs font-medium">{status}</span>;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white font-heading">Job Applications</h1>
      </div>

      <div className="bg-[#131C31] border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No applications received yet.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-white/5 text-slate-300 border-b border-white/10">
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
                <tr key={app._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-slate-400 text-sm">{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <div className="text-white font-medium">{app.applicantName}</div>
                    <div className="text-slate-400 text-xs flex items-center mt-1">
                      <Mail className="w-3 h-3 mr-1" /> {app.email}
                    </div>
                  </td>
                  <td className="p-4 text-slate-300">
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-2 text-orange-400" />
                      {app.jobId?.title || 'Unknown Job'}
                    </div>
                  </td>
                  <td className="p-4 text-slate-400">{app.experience}</td>
                  <td className="p-4">
                    {getStatusBadge(app.status)}
                  </td>
                  <td className="p-4 flex space-x-3">
                    <Link href={`/admin/applications/${app._id}`} className="text-blue-400 hover:text-blue-300" title="Review Application">
                      <Eye className="w-5 h-5" />
                    </Link>
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
