"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Trash2, Mail } from "lucide-react";
import { ApiClient } from "../../../../lib/api";

export default function ContactsListPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await ApiClient.get<any[]>('/api/admin/contacts');
      setContacts(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact message?')) return;
    try {
      await ApiClient.delete(`/api/admin/contacts/${id}`);
      fetchContacts();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'Read': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Responded': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Archived': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white font-heading">Contact Messages</h1>
      </div>

      <div className="bg-[#131C31] border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading messages...</div>
        ) : contacts.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No messages found.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-white/5 text-slate-300 border-b border-white/10">
              <tr>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Interest</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((contact) => (
                <tr key={contact._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-slate-400 text-sm">{new Date(contact.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-white font-medium">{contact.firstName} {contact.lastName}</td>
                  <td className="p-4 text-slate-400 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {contact.email}
                  </td>
                  <td className="p-4 text-slate-300">{contact.interest}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="p-4 flex space-x-3">
                    <Link href={`/admin/contacts/${contact._id}`} className="text-blue-400 hover:text-blue-300" title="View Message">
                      <Eye className="w-5 h-5" />
                    </Link>
                    <button onClick={() => deleteContact(contact._id)} className="text-rose-400 hover:text-rose-300" title="Delete Message">
                      <Trash2 className="w-5 h-5" />
                    </button>
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
