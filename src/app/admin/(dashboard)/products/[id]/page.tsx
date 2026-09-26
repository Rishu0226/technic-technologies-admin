"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ApiClient } from "../../../../../lib/api";
import { Save, ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import ImageUpload from "../../../../../../components/admin/ui/ImageUpload";
import AIGenerator from "../../../../../../components/admin/ui/AIGenerator";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type Named = { title: string; description: string; icon: string };
type Metric = { value: string; label: string };
type Tech = { name: string; icon: string };
type Shot = { image: string; platform: string };
type ProductType = "website" | "app" | "both";

type ProductForm = {
  name: string;
  slug: string;
  tagline: string;
  shortDescription: string;
  description: string;
  longDescription: string;
  category: string;
  heroDescription: string;
  icon: string;
  image: string;
  heroImage: string;
  logo: string;
  dashboardImage: string;
  websitePreviewImage: string;
  featureSectionTitle: string;
  featureSectionDescription: string;
  showcaseTitle: string;
  showcaseDescription: string;
  ctaTitle: string;
  ctaDescription: string;
  type: ProductType;
  playStoreUrl: string;
  appStoreUrl: string;
  websiteUrl: string;
  order: number;
  status: string;
  seoTitle: string;
  seoDescription: string;
};

function toSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function asNamed(value: unknown): Named[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    if (typeof item === "string") return { title: item, description: "", icon: "" };
    const row = item as Partial<Named>;
    return { title: row.title || "", description: row.description || "", icon: row.icon || "" };
  });
}

const emptyForm = (): ProductForm => ({
  name: "",
  slug: "",
  tagline: "",
  shortDescription: "",
  description: "",
  longDescription: "",
  category: "",
  heroDescription: "",
  icon: "Package",
  image: "",
  heroImage: "",
  logo: "",
  dashboardImage: "",
  websitePreviewImage: "",
  featureSectionTitle: "",
  featureSectionDescription: "",
  showcaseTitle: "",
  showcaseDescription: "",
  ctaTitle: "",
  ctaDescription: "",
  type: "website",
  playStoreUrl: "",
  appStoreUrl: "",
  websiteUrl: "",
  order: 0,
  status: "Draft",
  seoTitle: "",
  seoDescription: "",
});

export default function ProductFormPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === "new";
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(!isNew);
  const [formData, setFormData] = useState<ProductForm>(emptyForm);
  const [features, setFeatures] = useState<Named[]>([]);
  const [benefits, setBenefits] = useState<Named[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [technologies, setTechnologies] = useState<Tech[]>([]);
  const [shots, setShots] = useState<Shot[]>([]);
  const [gallery, setGallery] = useState<string[]>([]);

  useEffect(() => {
    if (!isNew) fetchProduct();
  }, [isNew]);

  const fetchProduct = async () => {
    try {
      const response = await ApiClient.get<Record<string, unknown>[]>(`/api/products`);
      const product = response.data.find((item) => item._id === params.id);
      if (!product) return;
      const type = product.type === "app" || product.type === "both" ? product.type : "website";
      setFormData({
        ...emptyForm(),
        name: String(product.name || ""),
        slug: String(product.slug || ""),
        tagline: String(product.tagline || ""),
        shortDescription: String(product.shortDescription || ""),
        description: String(product.description || ""),
        longDescription: String(product.longDescription || ""),
        category: String(product.category || ""),
        heroDescription: String(product.heroDescription || ""),
        icon: String(product.icon || "Package"),
        image: String(product.image || ""),
        heroImage: String(product.heroImage || ""),
        logo: String(product.logo || ""),
        dashboardImage: String(product.dashboardImage || ""),
        websitePreviewImage: String(product.websitePreviewImage || ""),
        featureSectionTitle: String(product.featureSectionTitle || ""),
        featureSectionDescription: String(product.featureSectionDescription || ""),
        showcaseTitle: String(product.showcaseTitle || ""),
        showcaseDescription: String(product.showcaseDescription || ""),
        ctaTitle: String(product.ctaTitle || ""),
        ctaDescription: String(product.ctaDescription || ""),
        type,
        playStoreUrl: String(product.playStoreUrl || ""),
        appStoreUrl: String(product.appStoreUrl || ""),
        websiteUrl: String(product.websiteUrl || ""),
        order: Number(product.order || 0),
        status: String(product.status || "Draft"),
        seoTitle: String((product.seo as { metaTitle?: string } | undefined)?.metaTitle || ""),
        seoDescription: String((product.seo as { metaDescription?: string } | undefined)?.metaDescription || ""),
      });
      setFeatures(asNamed(product.features));
      setBenefits(asNamed(product.benefits));
      setMetrics(Array.isArray(product.metrics) ? product.metrics as Metric[] : []);
      setTechnologies(Array.isArray(product.technologyStack) ? product.technologyStack as Tech[] : []);
      setShots(Array.isArray(product.mobileScreenshots) ? product.mobileScreenshots as Shot[] : []);
      setGallery(Array.isArray(product.gallery) ? product.gallery.map(String) : []);
      setSlugEdited(true);
    } catch (err) {
      console.error(err);
      setError("Failed to load product data");
    } finally {
      setLoading(false);
    }
  };

  const setField = (name: keyof ProductForm, value: ProductForm[keyof ProductForm]) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateProduct = async (prompt: string) => {
    const response = await ApiClient.post("/api/admin/ai/generate-product", { prompt });
    const data = response.data?.data;
    if (!data) return;
    const type: ProductType = data.type === "app" || data.type === "both" ? data.type : "website";
    setSlugEdited(true);
    setFormData((prev) => ({
      ...prev,
      name: data.name || prev.name,
      slug: data.slug || prev.slug,
      tagline: data.tagline || prev.tagline,
      description: data.description || prev.description,
      shortDescription: data.shortDescription || data.tagline || prev.shortDescription,
      icon: data.icon || prev.icon,
      type,
      playStoreUrl: type === "website" ? "" : data.playStoreUrl || "",
      appStoreUrl: type === "website" ? "" : data.appStoreUrl || "",
      websiteUrl: type === "app" ? "" : data.websiteUrl || "",
    }));
    if (Array.isArray(data.features)) setFeatures(asNamed(data.features));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!slugPattern.test(formData.slug)) {
      setError("Slug must be lowercase words separated by hyphens.");
      return;
    }
    setSaving(true);
    setError(null);
    const showWebsite = formData.type === "website" || formData.type === "both";
    const showApp = formData.type === "app" || formData.type === "both";
    const payload = {
      ...formData,
      type: formData.type,
      playStoreUrl: showApp ? formData.playStoreUrl.trim() : "",
      appStoreUrl: showApp ? formData.appStoreUrl.trim() : "",
      websiteUrl: showWebsite ? formData.websiteUrl.trim() : "",
      features: features.filter((item) => item.title.trim()),
      benefits: benefits.filter((item) => item.title.trim()),
      metrics: metrics.filter((item) => item.value.trim() || item.label.trim()),
      technologyStack: technologies.filter((item) => item.name.trim()),
      mobileScreenshots: shots.filter((item) => item.image.trim()),
      gallery: gallery.map((item) => item.trim()).filter(Boolean),
      seo: { metaTitle: formData.seoTitle, metaDescription: formData.seoDescription },
    };
    try {
      if (isNew) await ApiClient.post("/api/admin/products", payload);
      else await ApiClient.put(`/api/admin/products/${params.id}`, payload);
      router.push("/admin/products");
    } catch (err: unknown) {
      const response = err as { response?: { data?: { error?: string } } };
      setError(response.response?.data?.error || "An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-technic-text p-8">Loading...</div>;

  const showWebsite = formData.type === "website" || formData.type === "both";
  const showApp = formData.type === "app" || formData.type === "both";

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center mb-8">
        <Link href="/admin/products" className="text-technic-muted hover:text-technic-cyan-deep mr-4 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold text-technic-text font-heading">{isNew ? "Create New Product" : "Edit Product"}</h1>
      </div>

      <AIGenerator onGenerate={handleGenerateProduct} disabled={saving} replaceExisting={!isNew && Boolean(formData.name)} type="product" />
      {error && <div className="bg-technic-error-soft border border-technic-error/20 text-technic-error p-4 rounded-xl mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-white border border-technic-border rounded-2xl shadow-tn-md p-6">
          <h2 className="text-xl font-bold text-technic-text mb-6">Basic information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="tn-label">Product name *</label>
              <input required className="tn-input" value={formData.name} onChange={(event) => {
                const name = event.target.value;
                setFormData((prev) => ({ ...prev, name, slug: isNew && !slugEdited ? toSlug(name) : prev.slug }));
              }} />
            </div>
            <div>
              <label className="tn-label">Slug *</label>
              <input required className="tn-input" value={formData.slug} onChange={(event) => { setSlugEdited(true); setField("slug", event.target.value.trim().toLowerCase()); }} />
            </div>
            <div>
              <label className="tn-label">Category</label>
              <input className="tn-input" value={formData.category} onChange={(event) => setField("category", event.target.value)} placeholder="Enterprise Platform" />
            </div>
            <div>
              <label className="tn-label">Icon name</label>
              <input required className="tn-input" value={formData.icon} onChange={(event) => setField("icon", event.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="tn-label">Tagline *</label>
              <input required className="tn-input" value={formData.tagline} onChange={(event) => setField("tagline", event.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="tn-label">Short description</label>
              <textarea className="tn-input" rows={2} value={formData.shortDescription} onChange={(event) => setField("shortDescription", event.target.value)} placeholder="Used on cards and search previews" />
            </div>
            <div className="md:col-span-2">
              <label className="tn-label">Description *</label>
              <textarea required className="tn-input" rows={4} value={formData.description} onChange={(event) => setField("description", event.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="tn-label">Hero description</label>
              <textarea className="tn-input" rows={3} value={formData.heroDescription} onChange={(event) => setField("heroDescription", event.target.value)} />
            </div>
            <div>
              <label className="tn-label">Display order</label>
              <input type="number" className="tn-input" value={formData.order} onChange={(event) => setField("order", Number(event.target.value) || 0)} />
            </div>
            <div>
              <label className="tn-label">Status</label>
              <select className="tn-input" value={formData.status} onChange={(event) => setField("status", event.target.value)}>
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>
        </section>

        <section className="bg-white border border-technic-border rounded-2xl shadow-tn-md p-6">
          <h2 className="text-xl font-bold text-technic-text mb-2">Detailed content</h2>
          <p className="text-sm text-technic-muted mb-4">HTML for the product detail page. Headings, paragraphs, lists, links, and images are kept. Scripts are removed when you save.</p>
          <textarea className="tn-input font-mono text-sm" rows={12} value={formData.longDescription} onChange={(event) => setField("longDescription", event.target.value)} placeholder="<h2>Overview</h2><p>Describe the product.</p>" />
        </section>

        <section className="bg-white border border-technic-border rounded-2xl shadow-tn-md p-6">
          <h2 className="text-xl font-bold text-technic-text mb-6">Product type and links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="tn-label">Product type *</label>
              <select className="tn-input" value={formData.type} onChange={(event) => setField("type", event.target.value as ProductType)}>
                <option value="website">Website</option>
                <option value="app">App</option>
                <option value="both">Both</option>
              </select>
            </div>
            {showWebsite && (
              <div className={showApp ? "" : "md:col-span-2"}>
                <label className="tn-label">Website URL</label>
                <input type="url" className="tn-input" value={formData.websiteUrl} onChange={(event) => setField("websiteUrl", event.target.value)} placeholder="https://example.com" />
              </div>
            )}
            {showApp && (
              <>
                <div>
                  <label className="tn-label">Google Play URL</label>
                  <input type="url" className="tn-input" value={formData.playStoreUrl} onChange={(event) => setField("playStoreUrl", event.target.value)} placeholder="https://play.google.com/store/apps/details?id=" />
                </div>
                <div>
                  <label className="tn-label">App Store URL</label>
                  <input type="url" className="tn-input" value={formData.appStoreUrl} onChange={(event) => setField("appStoreUrl", event.target.value)} placeholder="https://apps.apple.com/app/" />
                </div>
              </>
            )}
          </div>
        </section>

        <section className="bg-white border border-technic-border rounded-2xl shadow-tn-md p-6 space-y-6">
          <h2 className="text-xl font-bold text-technic-text">Images</h2>
          <ImageUpload label="Card image" folder="products" value={formData.image} onChange={(url) => setField("image", url)} />
          <ImageUpload label="Hero image" folder="products" value={formData.heroImage} onChange={(url) => setField("heroImage", url)} />
          <ImageUpload label="Logo" folder="products" value={formData.logo} onChange={(url) => setField("logo", url)} />
          <ImageUpload label="Dashboard screenshot" folder="products" value={formData.dashboardImage} onChange={(url) => setField("dashboardImage", url)} />
          <ImageUpload label="Website preview" folder="products" value={formData.websitePreviewImage} onChange={(url) => setField("websitePreviewImage", url)} />
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-technic-text">Gallery</h3>
              <button type="button" className="text-sm text-technic-cyan-deep" onClick={() => setGallery((prev) => [...prev, ""])}><Plus className="mr-1 inline h-4 w-4" />Add image</button>
            </div>
            <div className="space-y-4">
              {gallery.map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="flex-1">
                    <ImageUpload label={`Gallery image ${index + 1}`} folder="products" value={item} onChange={(url) => setGallery((prev) => prev.map((entry, i) => i === index ? url : entry))} />
                  </div>
                  <button type="button" className="mt-8 text-technic-error" onClick={() => setGallery((prev) => prev.filter((_, i) => i !== index))}><Trash2 className="h-5 w-5" /></button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Repeater title="Features" onAdd={() => setFeatures((prev) => [...prev, { title: "", description: "", icon: "" }])}>
          {features.map((item, index) => (
            <div key={index} className="grid gap-3 md:grid-cols-[1fr_1fr_8rem_auto]">
              <input className="tn-input" placeholder="Title" value={item.title} onChange={(event) => setFeatures((prev) => prev.map((row, i) => i === index ? { ...row, title: event.target.value } : row))} />
              <input className="tn-input" placeholder="Description" value={item.description} onChange={(event) => setFeatures((prev) => prev.map((row, i) => i === index ? { ...row, description: event.target.value } : row))} />
              <input className="tn-input" placeholder="Icon" value={item.icon} onChange={(event) => setFeatures((prev) => prev.map((row, i) => i === index ? { ...row, icon: event.target.value } : row))} />
              <button type="button" className="text-technic-error" onClick={() => setFeatures((prev) => prev.filter((_, i) => i !== index))}><Trash2 className="h-5 w-5" /></button>
            </div>
          ))}
        </Repeater>

        <section className="bg-white border border-technic-border rounded-2xl shadow-tn-md p-6 grid gap-4">
          <h2 className="text-xl font-bold text-technic-text">Feature section</h2>
          <input className="tn-input" placeholder="Section title" value={formData.featureSectionTitle} onChange={(event) => setField("featureSectionTitle", event.target.value)} />
          <textarea className="tn-input" rows={2} placeholder="Section description" value={formData.featureSectionDescription} onChange={(event) => setField("featureSectionDescription", event.target.value)} />
        </section>

        <section className="bg-white border border-technic-border rounded-2xl shadow-tn-md p-6 grid gap-4">
          <h2 className="text-xl font-bold text-technic-text">Showcase</h2>
          <input className="tn-input" placeholder="Showcase title" value={formData.showcaseTitle} onChange={(event) => setField("showcaseTitle", event.target.value)} />
          <textarea className="tn-input" rows={3} placeholder="Showcase description" value={formData.showcaseDescription} onChange={(event) => setField("showcaseDescription", event.target.value)} />
        </section>

        <Repeater title="Metrics" onAdd={() => setMetrics((prev) => [...prev, { value: "", label: "" }])}>
          {metrics.map((item, index) => (
            <div key={index} className="grid gap-3 md:grid-cols-[8rem_1fr_auto]">
              <input className="tn-input" placeholder="120+" value={item.value} onChange={(event) => setMetrics((prev) => prev.map((row, i) => i === index ? { ...row, value: event.target.value } : row))} />
              <input className="tn-input" placeholder="Label" value={item.label} onChange={(event) => setMetrics((prev) => prev.map((row, i) => i === index ? { ...row, label: event.target.value } : row))} />
              <button type="button" className="text-technic-error" onClick={() => setMetrics((prev) => prev.filter((_, i) => i !== index))}><Trash2 className="h-5 w-5" /></button>
            </div>
          ))}
        </Repeater>

        <Repeater title="Benefits" onAdd={() => setBenefits((prev) => [...prev, { title: "", description: "", icon: "" }])}>
          {benefits.map((item, index) => (
            <div key={index} className="grid gap-3 md:grid-cols-[1fr_1fr_8rem_auto]">
              <input className="tn-input" placeholder="Title" value={item.title} onChange={(event) => setBenefits((prev) => prev.map((row, i) => i === index ? { ...row, title: event.target.value } : row))} />
              <input className="tn-input" placeholder="Description" value={item.description} onChange={(event) => setBenefits((prev) => prev.map((row, i) => i === index ? { ...row, description: event.target.value } : row))} />
              <input className="tn-input" placeholder="Icon" value={item.icon} onChange={(event) => setBenefits((prev) => prev.map((row, i) => i === index ? { ...row, icon: event.target.value } : row))} />
              <button type="button" className="text-technic-error" onClick={() => setBenefits((prev) => prev.filter((_, i) => i !== index))}><Trash2 className="h-5 w-5" /></button>
            </div>
          ))}
        </Repeater>

        <Repeater title="Technology stack" onAdd={() => setTechnologies((prev) => [...prev, { name: "", icon: "" }])}>
          {technologies.map((item, index) => (
            <div key={index} className="grid gap-3 md:grid-cols-[1fr_8rem_auto]">
              <input className="tn-input" placeholder="Next.js" value={item.name} onChange={(event) => setTechnologies((prev) => prev.map((row, i) => i === index ? { ...row, name: event.target.value } : row))} />
              <input className="tn-input" placeholder="Icon" value={item.icon} onChange={(event) => setTechnologies((prev) => prev.map((row, i) => i === index ? { ...row, icon: event.target.value } : row))} />
              <button type="button" className="text-technic-error" onClick={() => setTechnologies((prev) => prev.filter((_, i) => i !== index))}><Trash2 className="h-5 w-5" /></button>
            </div>
          ))}
        </Repeater>

        <Repeater title="Mobile screenshots" onAdd={() => setShots((prev) => [...prev, { image: "", platform: "android" }])}>
          {shots.map((item, index) => (
            <div key={index} className="grid gap-3 md:grid-cols-[1fr_10rem_auto] items-end">
              <ImageUpload label="Screenshot" folder="products" value={item.image} onChange={(url) => setShots((prev) => prev.map((row, i) => i === index ? { ...row, image: url } : row))} />
              <select className="tn-input" value={item.platform} onChange={(event) => setShots((prev) => prev.map((row, i) => i === index ? { ...row, platform: event.target.value } : row))}>
                <option value="android">Android</option>
                <option value="ios">iOS</option>
              </select>
              <button type="button" className="text-technic-error" onClick={() => setShots((prev) => prev.filter((_, i) => i !== index))}><Trash2 className="h-5 w-5" /></button>
            </div>
          ))}
        </Repeater>

        <section className="bg-white border border-technic-border rounded-2xl shadow-tn-md p-6 grid gap-4">
          <h2 className="text-xl font-bold text-technic-text">Call to action and SEO</h2>
          <input className="tn-input" placeholder="CTA title" value={formData.ctaTitle} onChange={(event) => setField("ctaTitle", event.target.value)} />
          <textarea className="tn-input" rows={2} placeholder="CTA description" value={formData.ctaDescription} onChange={(event) => setField("ctaDescription", event.target.value)} />
          <input className="tn-input" placeholder="SEO title" value={formData.seoTitle} onChange={(event) => setField("seoTitle", event.target.value)} />
          <textarea className="tn-input" rows={2} placeholder="SEO description" value={formData.seoDescription} onChange={(event) => setField("seoDescription", event.target.value)} />
        </section>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="bg-brand-gradient text-white px-8 py-3 rounded-xl font-bold flex items-center hover:shadow-tn-sm transition-all disabled:opacity-50">
            {saving ? "Saving..." : <><Save className="w-5 h-5 mr-2" /> Save Product</>}
          </button>
        </div>
      </form>
    </div>
  );
}

function Repeater({ title, onAdd, children }: { title: string; onAdd: () => void; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-technic-border rounded-2xl shadow-tn-md p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-technic-text">{title}</h2>
        <button type="button" onClick={onAdd} className="text-sm text-technic-cyan-deep inline-flex items-center"><Plus className="mr-1 h-4 w-4" />Add</button>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
