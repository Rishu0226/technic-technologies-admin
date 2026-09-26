"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ApiClient } from "../../../../../lib/api";
import { Save, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { DeleteIconButton } from "../../../../../../components/admin/ui/ConfirmDialog";
import Link from "next/link";
import AIGenerator from "../../../../../../components/admin/ui/AIGenerator";
import ImageUpload from "../../../../../../components/admin/ui/ImageUpload";

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
  const [gallery, setGallery] = useState<string[]>([]);
  const [seo, setSeo] = useState({ title: "", description: "" });

  useEffect(() => {
    if (!isNew) {
      fetchBlog();
    }
  }, [isNew]);

  const fetchBlog = async () => {
    try {
      const response = await ApiClient.get(`/api/admin/blogs/${params.id}`);
      const blog = response.data;
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
        setGallery(blog.gallery || []);
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

  const removeArrayItem = (setter: any, index: number, array: string[]) => {
    const newArray = array.filter((_, i) => i !== index);
    setter(newArray);
  };

  const handleGenerateBlog = async (prompt: string) => {
    const response = await ApiClient.post('/api/admin/ai/generate-blog', { prompt });
    const data = response.data?.data;
    
    if (data) {
      setFormData(prev => ({
        ...prev,
        title: data.title ?? prev.title,
        slug: data.slug ?? prev.slug,
        excerpt: data.shortDescription || data.excerpt || prev.excerpt,
        content: data.longDescription || data.content || prev.content,
        author: data.author ?? prev.author,
        category: data.category ?? prev.category,
        featuredImage: data.featuredImage ?? prev.featuredImage,
        video: data.video ?? prev.video,
      }));
      if (Array.isArray(data.tags)) {
        setTags(data.tags.join(", "));
      }
      if (Array.isArray(data.gallery)) {
        setGallery(data.gallery);
      }
      if (data.seo) {
        setSeo({
          title: data.seo.title || "",
          description: data.seo.description || ""
        });
      }
    }
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
      gallery: gallery.filter(Boolean),
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

  if (loading) return <div className="text-technic-text p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20 ">
      <div className="flex items-center mb-8">
        <Link href="/admin/blogs" className="text-technic-muted hover:text-technic-cyan-deep mr-4 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold text-technic-text font-heading">
          {isNew ? 'Create New Blog Post' : 'Edit Blog Post'}
        </h1>
      </div>

      <AIGenerator onGenerate={handleGenerateBlog} disabled={saving} replaceExisting={!isNew && Boolean(formData.title)} type="blog" />

      {error && (
        <div className="bg-technic-error-soft border border-technic-error/20 text-technic-error p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white border border-technic-border rounded-2xl shadow-tn-md p-6">
          <h2 className="text-xl font-bold text-technic-text mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="tn-label">Title *</label>
              <input name="title" value={formData.title} onChange={handleChange} required className="tn-input" />
            </div>
            <div>
              <label className="tn-label">Slug (URL friendly) *</label>
              <input name="slug" value={formData.slug} onChange={handleChange} required className="tn-input" />
            </div>
            <div>
              <label className="tn-label">Category *</label>
              <input name="category" value={formData.category} onChange={handleChange} required className="tn-input" />
            </div>
            <div>
              <label className="tn-label">Author *</label>
              <input name="author" value={formData.author} onChange={handleChange} required className="tn-input" />
            </div>
            <div>
              <label className="tn-label">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="tn-input">
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="tn-label">Excerpt *</label>
              <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} required rows={3} className="tn-input"></textarea>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white border border-technic-border rounded-2xl shadow-tn-md p-6">
          <h2 className="text-xl font-bold text-technic-text mb-6">Article Content</h2>
          <div className="mb-6">
            <label className="tn-label">Markdown Content *</label>
            <textarea name="content" value={formData.content} onChange={handleChange} required rows={15} className="tn-input font-mono text-sm leading-relaxed" placeholder="# Header\n\nParagraph text..."></textarea>
          </div>
        </div>

        {/* Media */}
        <div className="bg-white border border-technic-border rounded-2xl shadow-tn-md p-6">
          <h2 className="text-xl font-bold text-technic-text mb-6 flex items-center">
            <ImageIcon className="w-5 h-5 mr-2 text-technic-cyan-deep" /> Media
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <ImageUpload
                label="Featured image"
                value={formData.featuredImage}
                folder="blogs"
                onChange={(url) => setFormData((prev) => ({ ...prev, featuredImage: url }))}
              />
            </div>
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm text-technic-secondary">Gallery images</label>
              </div>
              <ImageUpload
                label="Add gallery image"
                folder="blogs"
                onChange={(url) => setGallery((prev) => [...prev, url])}
              />
              <div className="mt-4 space-y-3">
                {gallery.map((item, idx) => (
                  <div key={`${item}-${idx}`} className="flex items-center gap-3">
                    <img src={item} alt="" className="h-16 w-24 rounded-lg border border-technic-border object-cover" />
                    <p className="flex-1 break-all text-xs text-technic-muted">{item}</p>
                    <DeleteIconButton onConfirm={() => removeArrayItem(setGallery, idx, gallery)} message="Delete this gallery image?" />
                  </div>
                ))}
                {gallery.length === 0 && <p className="text-technic-muted italic text-sm">No gallery images added.</p>}
              </div>
            </div>
            <div className="md:col-span-2">
              <ImageUpload
                label="Video"
                value={formData.video}
                folder="blogs"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={(url) => setFormData((prev) => ({ ...prev, video: url }))}
              />
            </div>
          </div>
        </div>

        {/* Meta Data */}
        <div className="bg-white border border-technic-border rounded-2xl shadow-tn-md p-6">
          <h2 className="text-xl font-bold text-technic-text mb-6">SEO & Metadata</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="tn-label">Tags (comma separated)</label>
              <input value={tags} onChange={(e) => setTags(e.target.value)} className="tn-input" placeholder="technology, ai, cloud" />
            </div>
            <div>
              <label className="tn-label">SEO Title</label>
              <input name="title" value={seo.title} onChange={handleSeoChange} className="tn-input" />
            </div>
            <div className="md:col-span-2">
              <label className="tn-label">SEO Description</label>
              <textarea name="description" value={seo.description} onChange={handleSeoChange} rows={3} className="tn-input"></textarea>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="bg-brand-gradient text-white px-8 py-3 rounded-xl font-bold flex items-center hover:shadow-tn-sm transition-all disabled:opacity-50">
            {saving ? 'Saving...' : <><Save className="w-5 h-5 mr-2" /> Save Blog Post</>}
          </button>
        </div>
      </form>
    </div>
  );
}
