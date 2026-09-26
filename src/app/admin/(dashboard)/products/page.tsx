"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { ApiClient } from "../../../../lib/api";
import ConfirmDialog from "../../../../../components/admin/ui/ConfirmDialog";
import { toast } from "react-hot-toast";

export default function ProductsListPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await ApiClient.get<any[]>('/api/products');
      setProducts(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async () => {
    if (!deleteId) return;
    try {
      await ApiClient.delete(`/api/admin/products/${deleteId}`);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete product');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-technic-text font-heading">Products</h1>
        <Link 
          href="/admin/products/new" 
          className="bg-brand-gradient text-white px-4 py-2 rounded-lg flex items-center shadow-tn-sm hover:opacity-95 transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </Link>
      </div>

      <div className="bg-white border border-technic-border rounded-2xl shadow-tn-md overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-technic-muted">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-technic-muted">No products found. Create one!</div>
        ) : (
          <table className="w-full min-w-[720px] text-left">
            <thead className="bg-technic-header text-technic-muted border-b border-technic-border">
              <tr>
                <th className="p-4 font-medium">Order</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Tagline</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.sort((a, b) => a.order - b.order).map((product) => (
                <tr key={product._id} className="border-b border-technic-border hover:bg-technic-bg transition-colors">
                  <td className="p-4 text-technic-muted">{product.order}</td>
                  <td className="p-4 text-technic-text font-medium">{product.name}</td>
                  <td className="p-4 text-technic-muted">{product.tagline}</td>
                  <td className="p-4 text-technic-muted">{product.type === "app" ? "App" : product.type === "website" ? "Website" : product.type === "both" ? "App & Website" : "—"}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${product.status === 'Published' ? 'bg-technic-success-soft text-technic-success' : 'bg-technic-neutral-soft text-technic-muted'}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="p-4 flex space-x-3">
                    <Link href={`/admin/products/${product._id}`} className="text-technic-cyan-deep hover:text-technic-cyan">
                      <Edit className="w-5 h-5" aria-hidden="true" /><span className="sr-only">Edit</span>
                    </Link>
                    <button onClick={() => setDeleteId(product._id)} className="text-technic-error hover:text-technic-error">
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
        content="Are you sure you want to delete this product? This action cannot be undone."
        onClose={() => setDeleteId(null)}
        onConfirm={deleteProduct}
      />
    </div>
  );
}
