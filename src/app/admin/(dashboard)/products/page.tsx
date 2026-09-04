"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { ApiClient } from "../../../../lib/api";

export default function ProductsListPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await ApiClient.delete(`/api/admin/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white font-heading">Products</h1>
        <Link 
          href="/admin/products/new" 
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </Link>
      </div>

      <div className="bg-[#131C31] border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No products found. Create one!</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-white/5 text-slate-300 border-b border-white/10">
              <tr>
                <th className="p-4 font-medium">Order</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Tagline</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.sort((a, b) => a.order - b.order).map((product) => (
                <tr key={product._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-slate-400">{product.order}</td>
                  <td className="p-4 text-white font-medium">{product.name}</td>
                  <td className="p-4 text-slate-400">{product.tagline}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${product.status === 'Published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="p-4 flex space-x-3">
                    <Link href={`/admin/products/${product._id}`} className="text-blue-400 hover:text-blue-300">
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button onClick={() => deleteProduct(product._id)} className="text-rose-400 hover:text-rose-300">
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
