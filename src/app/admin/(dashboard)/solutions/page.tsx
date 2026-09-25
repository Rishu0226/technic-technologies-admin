"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { ApiClient } from "../../../../lib/api";
import ConfirmDialog from "../../../../../components/admin/ui/ConfirmDialog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3005";

type SolutionRow = {
  _id: string;
  title: string;
  slug: string;
  icon?: string;
  order?: number;
  status?: string;
  updatedAt?: string;
};

export default function SolutionsListPage() {
  const [solutions, setSolutions] = useState<SolutionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchSolutions = async () => {
    try {
      const response = await ApiClient.get<SolutionRow[]>("/api/solutions");
      setSolutions(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolutions();
  }, []);

  const remove = async () => {
    if (!deleteId) return;
    try {
      await ApiClient.delete(`/api/admin/solutions/${deleteId}`);
      toast.success("Solution deleted");
      fetchSolutions();
    } catch {
      toast.error("Failed to delete solution");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-3xl font-bold text-technic-text">Solutions</h1>
        <div className="flex gap-3">
          <Link href="/admin/solutions/new" className="flex items-center rounded-lg bg-brand-gradient px-4 py-2 text-white">
            <Plus className="mr-2 h-5 w-5" /> Add Solution
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-technic-border bg-white shadow-tn-md">
        {loading ? <p className="p-8 text-center text-technic-muted">Loading solutions...</p> : solutions.length === 0 ? <p className="p-8 text-center text-technic-muted">No solutions yet.</p> : (
          <table className="w-full min-w-[760px] text-left">
            <thead className="border-b border-technic-border bg-technic-header text-technic-muted">
              <tr>
                {["Order", "Icon", "Title", "Slug", "Status", "Updated", "Actions"].map((heading) => <th key={heading} className="p-4 font-medium">{heading}</th>)}
              </tr>
            </thead>
            <tbody>
              {[...solutions].sort((a, b) => (a.order || 0) - (b.order || 0)).map((solution) => (
                <tr key={solution._id} className="border-b border-technic-border">
                  <td className="p-4 text-technic-muted">{solution.order}</td>
                  <td className="p-4 text-technic-muted">{solution.icon}</td>
                  <td className="p-4 font-medium text-technic-text">{solution.title}</td>
                  <td className="p-4 text-technic-muted">{solution.slug}</td>
                  <td className="p-4">{solution.status}</td>
                  <td className="p-4 text-technic-muted">{solution.updatedAt ? new Date(solution.updatedAt).toLocaleDateString() : "—"}</td>
                  <td className="flex gap-3 p-4">
                    {solution.status === "Published" ? (
                      <a href={`${siteUrl}/solutions/${solution.slug}`} target="_blank" rel="noreferrer" className="text-technic-cyan-deep"><Eye className="h-5 w-5" /><span className="sr-only">View</span></a>
                    ) : (
                      <Link href={`/admin/solutions/${solution._id}/preview`} className="text-technic-cyan-deep"><Eye className="h-5 w-5" /><span className="sr-only">View</span></Link>
                    )}
                    <Link href={`/admin/solutions/${solution._id}`} className="text-technic-cyan-deep"><Edit className="h-5 w-5" /><span className="sr-only">Edit</span></Link>
                    <button type="button" onClick={() => setDeleteId(solution._id)} className="text-technic-error"><Trash2 className="h-5 w-5" /><span className="sr-only">Delete</span></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <ConfirmDialog open={!!deleteId} title="Delete solution" content="This removes the solution from the public site." onClose={() => setDeleteId(null)} onConfirm={remove} />
    </div>
  );
}
