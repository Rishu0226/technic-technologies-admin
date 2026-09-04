"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ApiClient } from "../../../../../lib/api";
import { Save, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function BlogFormPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "",
    category: "",
    status: "Draft",
    featuredImage: "",
    video: "",
  });

  const [tags, setTags] = useState("");
  const [gallery, setGallery] = useState("");
  const [seo, setSeo] = useState({ title: "", description: "" });

  useEffect(() => {
    if (!isNew) {
      fetchBlog();
    }
  }, [isNew]);

  const fetchBlog = async () => {
    try {
      const response = await ApiClient.get<any[]>(`/api/blogs`);
      const blog = response.data.find((b: any) => b._id === params.id);
      if (blog) {
        setFormData({
          title: blog.title || "",
          slug: blog.slug || "",
          excerpt: blog.excerpt || "",
          content: blog.content || "",
          author: blog.author || "",
          category: blog.category || "",
          status: blog.status || "Draft",
          featuredImage: blog.featuredImage || "",
          video: blog.video || "",
        });
        setTags(blog.tags?.join(", ") || "");
        setGallery(blog.gallery?.join(", ") || "");
        setSeo({
          title: blog.seo?.title || "",
          description: blog.seo?.description || ""
        });
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load blog data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSeoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSeo({ ...seo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...formData,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      gallery: gallery.split(",").map(t => t.trim()).filter(Boolean),
      seo,
    };

    try {
      if (isNew) {
        await ApiClient.post('/api/admin/blogs', payload);
      } else {
        await ApiClient.put(`/api/admin/blogs/${params.id}`, payload);
      }
      router.push('/admin/blogs');
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="max-w-4xl pb-20">
      <div className="flex items-center mb-8">
        <Link href="/admin/blogs" className="text-slate-400 hover:text-white mr-4 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold text-white font-heading">
          {isNew ? 'Create New Blog Post' : 'Edit Blog Post'}
        </h1>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-[#131C31] border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-300 mb-2">Title *</label>
              <input name="title" value={formData.title} onChange={handleChange} required className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">Slug (URL friendly) *</label>
              <input name="slug" value={formData.slug} onChange={handleChange} required className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">Category *</label>
              <input name="category" value={formData.category} onChange={handleChange} required className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">Author *</label>
              <input name="author" value={formData.author} onChange={handleChange} required className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white">
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-300 mb-2">Excerpt *</label>
              <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} required rows={3} className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white"></textarea>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-[#131C31] border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Article Content</h2>
          <div className="mb-6">
            <label className="block text-sm text-slate-300 mb-2">Markdown Content *</label>
            <textarea name="content" value={formData.content} onChange={handleChange} required rows={15} className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-4 text-white font-mono text-sm leading-relaxed" placeholder="# Header\n\nParagraph text..."></textarea>
          </div>
        </div>

        {/* Media */}
        <div className="bg-[#131C31] border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <ImageIcon className="w-5 h-5 mr-2 text-orange-400" /> Media
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-300 mb-2">Featured Image URL</label>
              <input name="featuredImage" value={formData.featuredImage} onChange={handleChange} className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" placeholder="https://..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-300 mb-2">Gallery Image URLs (comma separated)</label>
              <input value={gallery} onChange={(e) => setGallery(e.target.value)} className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" placeholder="url1, url2..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-300 mb-2">Video URL</label>
              <input name="video" value={formData.video} onChange={handleChange} className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" />
            </div>
          </div>
        </div>

        {/* Meta Data */}
        <div className="bg-[#131C31] border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">SEO & Metadata</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-300 mb-2">Tags (comma separated)</label>
              <input value={tags} onChange={(e) => setTags(e.target.value)} className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" placeholder="technology, ai, cloud" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">SEO Title</label>
              <input name="title" value={seo.title} onChange={handleSeoChange} className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-300 mb-2">SEO Description</label>
              <textarea name="description" value={seo.description} onChange={handleSeoChange} rows={3} className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white"></textarea>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="bg-gradient-to-r from-orange-600 to-rose-600 text-white px-8 py-3 rounded-xl font-bold flex items-center hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all disabled:opacity-50">
            {saving ? 'Saving...' : <><Save className="w-5 h-5 mr-2" /> Save Blog Post</>}
          </button>
        </div>
      </form>
    </div>
  );
}
