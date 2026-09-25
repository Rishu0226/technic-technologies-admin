"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Trash2, Mail } from "lucide-react";
import { ApiClient } from "../../../../lib/api";
import ConfirmDialog from "../../../../../components/admin/ui/ConfirmDialog";
import toast from "react-hot-toast";

export default function ContactsListPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

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

  const deleteContact = async () => {
    if (!deleteId) return;
    try {
      await ApiClient.delete(`/api/admin/contacts/${deleteId}`);
      toast.success('Contact message deleted successfully');
      fetchContacts();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete contact message');
    } finally {
      setDeleteId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-technic-cyan-soft text-technic-cyan-deep border border-technic-cyan/30';
      case 'Read': return 'bg-technic-neutral-soft text-technic-muted border border-technic-border';
      case 'Responded': return 'bg-technic-success-soft text-technic-success border border-technic-success/20';
      case 'Archived': return 'bg-technic-neutral-soft text-technic-muted border border-technic-border';
      default: return 'bg-technic-neutral-soft text-technic-muted border border-technic-border';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-technic-text font-heading">Contact Messages</h1>
      </div>

      <div className="bg-white border border-technic-border rounded-2xl shadow-tn-md overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-technic-muted">Loading messages...</div>
        ) : contacts.length === 0 ? (
          <div className="p-8 text-center text-technic-muted">No messages found.</div>
        ) : (
          <table className="w-full min-w-[720px] text-left">
            <thead className="bg-technic-header text-technic-muted border-b border-technic-border">
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
                <tr key={contact._id} className="border-b border-technic-border hover:bg-technic-bg transition-colors">
                  <td className="p-4 text-technic-muted text-sm">{new Date(contact.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-technic-text font-medium">{contact.firstName} {contact.lastName}</td>
                  <td className="p-4 text-technic-muted flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {contact.email}
                  </td>
                  <td className="p-4 text-technic-secondary">{contact.interest}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="p-4 flex space-x-3">
                    <Link href={`/admin/contacts/${contact._id}`} className="text-technic-cyan-deep hover:text-technic-cyan" title="View Message">
                      <Eye className="w-5 h-5" aria-hidden="true" /><span className="sr-only">View</span>
                    </Link>
                    <button onClick={() => setDeleteId(contact._id)} className="text-technic-error hover:text-technic-error" title="Delete Message">
                      <Trash2 className="w-5 h-5" aria-hidden="true" /><span className="sr-only">Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Confirm Deletion"
        content="Are you sure you want to delete this contact message? This action cannot be undone."
        onClose={() => setDeleteId(null)}
        onConfirm={deleteContact}
      />
    </div>
  );
}
