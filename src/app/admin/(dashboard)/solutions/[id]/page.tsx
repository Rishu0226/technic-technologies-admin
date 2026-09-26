"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowDown, ArrowLeft, ArrowUp, Plus, Save, Trash2 } from "lucide-react";
import { ApiClient } from "../../../../../lib/api";
import AIGenerator from "../../../../../../components/admin/ui/AIGenerator";
import ImageUpload from "../../../../../../components/admin/ui/ImageUpload";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3005";
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type Named = { title: string; description: string; icon: string };
type Tech = { name: string; category: string; icon: string };
type Step = { step: string; title: string; description: string };
type Pair = { title: string; description: string };
type Metric = { value: string; label: string };
type Faq = { question: string; answer: string };

type FormState = {
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  description: string;
  industry: string;
  icon: string;
  order: number;
  status: "Draft" | "Published";
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  cardImage: string;
  overview: { title: string; description: string };
  overviewImage: string;
  benefits: Named[];
  features: Named[];
  useCases: Pair[];
  process: Step[];
  technologies: Tech[];
  metrics: Metric[];
  faqs: Faq[];
  cta: { title: string; description: string; buttonText: string };
  seo: { metaTitle: string; metaDescription: string; keywords: string };
};

function emptyForm(): FormState {
  return {
    title: "", slug: "", shortDescription: "", longDescription: "", description: "", industry: "", icon: "Layers", order: 0, status: "Draft",
    heroTitle: "", heroDescription: "", heroImage: "", cardImage: "",
    overview: { title: "What We Build", description: "" }, overviewImage: "",
    benefits: [], features: [], useCases: [], process: [], technologies: [], metrics: [], faqs: [],
    cta: { title: "", description: "", buttonText: "Talk to Our Experts" },
    seo: { metaTitle: "", metaDescription: "", keywords: "" },
  };
}

function toSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value as T[] : [];
}

export default function SolutionFormPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === "new";
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugEdited, setSlugEdited] = useState(!isNew);
  const [originalSlug, setOriginalSlug] = useState("");

  useEffect(() => {
    if (isNew) return;
    ApiClient.get(`/api/admin/solutions/${params.id}`)
      .then((response) => {
        const item = response.data;
        setOriginalSlug(item.slug || "");
        setForm({
          ...emptyForm(),
          ...item,
          shortDescription: item.shortDescription || "",
          longDescription: item.longDescription || "",
          industry: item.industry || "",
          heroTitle: item.heroTitle || "",
          heroDescription: item.heroDescription || "",
          heroImage: item.heroImage || "",
          cardImage: item.cardImage || "",
          overviewImage: item.overviewImage || "",
          overview: { title: item.overview?.title || "What We Build", description: item.overview?.description || "" },
          benefits: asArray<Named>(item.benefits),
          features: asArray<Named>(item.features),
          useCases: asArray<Pair>(item.useCases),
          process: asArray<Step>(item.process),
          technologies: asArray<Tech>(item.technologies),
          metrics: asArray<Metric>(item.metrics),
          faqs: asArray<Faq>(item.faqs),
          cta: { title: item.cta?.title || "", description: item.cta?.description || "", buttonText: item.cta?.buttonText || "Talk to Our Experts" },
          seo: { metaTitle: item.seo?.metaTitle || "", metaDescription: item.seo?.metaDescription || "", keywords: item.seo?.keywords || "" },
          order: item.order || 0,
          status: item.status || "Draft",
        });
      })
      .catch(() => setError("Failed to load solution"))
      .finally(() => setLoading(false));
  }, [isNew, params.id]);

  const handleGenerateSolution = async (prompt: string) => {
    const response = await ApiClient.post("/api/admin/ai/generate-solution", { prompt });
    const data = response.data?.data;
    if (!data) return;

    setSlugEdited(true);
    setForm((prev) => ({
      ...prev,
      title: data.title || prev.title,
      slug: isNew ? (data.slug || prev.slug) : prev.slug,
      shortDescription: data.shortDescription || prev.shortDescription,
      description: data.description || prev.description,
      industry: data.industry || prev.industry,
      icon: data.icon || prev.icon,
      heroTitle: data.heroTitle || prev.heroTitle,
      heroDescription: data.heroDescription || prev.heroDescription,
      heroImage: prev.heroImage,
      cardImage: prev.cardImage,
      overviewImage: prev.overviewImage,
      overview: {
        title: data.overview?.title || prev.overview.title,
        description: data.overview?.description || prev.overview.description,
      },
      benefits: Array.isArray(data.benefits) ? data.benefits : prev.benefits,
      features: Array.isArray(data.features) ? data.features : prev.features,
      useCases: Array.isArray(data.useCases) ? data.useCases : prev.useCases,
      process: Array.isArray(data.process) ? data.process : prev.process,
      technologies: Array.isArray(data.technologies) ? data.technologies : prev.technologies,
      faqs: Array.isArray(data.faqs) ? data.faqs : prev.faqs,
      cta: {
        title: data.cta?.title || prev.cta.title,
        description: data.cta?.description || prev.cta.description,
        buttonText: data.cta?.buttonText || prev.cta.buttonText,
      },
      seo: {
        metaTitle: data.seo?.metaTitle || prev.seo.metaTitle,
        metaDescription: data.seo?.metaDescription || prev.seo.metaDescription,
        keywords: data.seo?.keywords || prev.seo.keywords,
      },
    }));
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!slugPattern.test(form.slug)) {
      setError("Slug must be lowercase words separated by hyphens.");
      return;
    }
    setSaving(true);
    setError("");
    const payload = {
      title: form.title,
      slug: form.slug,
      shortDescription: form.shortDescription,
      longDescription: form.longDescription,
      description: form.description,
      industry: form.industry,
      icon: form.icon,
      order: form.order,
      status: form.status,
      heroTitle: form.heroTitle,
      heroDescription: form.heroDescription,
      heroImage: form.heroImage,
      cardImage: form.cardImage,
      overview: form.overview,
      overviewImage: form.overviewImage,
      cta: form.cta,
      seo: form.seo,
      benefits: form.benefits.filter((item) => item.title.trim()),
      features: form.features.filter((item) => item.title.trim()),
      useCases: form.useCases.filter((item) => item.title.trim()),
      process: form.process.filter((item) => item.title.trim()),
      technologies: form.technologies.filter((item) => item.name.trim()),
      metrics: form.metrics.filter((item) => item.value.trim() && item.label.trim()),
      faqs: form.faqs.filter((item) => item.question.trim()),
    };
    try {
      if (isNew) await ApiClient.post("/api/admin/solutions", payload);
      else await ApiClient.put(`/api/admin/solutions/${params.id}`, payload);
      router.push("/admin/solutions");
    } catch (err: unknown) {
      const response = err as { response?: { data?: { error?: string } } };
      setError(response.response?.data?.error || "Unable to save this solution.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-8 text-technic-text">Loading...</p>;

  return (
    <div className="mx-auto max-w-4xl pb-20">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/admin/solutions" className="mr-4 text-technic-muted"><ArrowLeft className="h-6 w-6" /></Link>
          <h1 className="font-heading text-3xl font-bold text-technic-text">{isNew ? "Create Solution" : "Edit Solution"}</h1>
        </div>
        {form.status === "Published" && form.slug && (
          <a href={`${siteUrl}/solutions/${form.slug}`} target="_blank" rel="noreferrer" className="rounded-xl border border-technic-border px-4 py-2 text-sm font-semibold">View</a>
        )}
      </div>
      <AIGenerator onGenerate={handleGenerateSolution} disabled={saving} replaceExisting={!isNew && Boolean(form.title)} type="solution" />
      {error && <p className="mb-4 rounded-xl bg-technic-error-soft p-4 text-technic-error">{error}</p>}
      <form onSubmit={save} className="space-y-4">
        <Section title="Basic Information" open>
          <Field label="Title"><input required className="tn-input" value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value, slug: isNew && !slugEdited ? toSlug(event.target.value) : prev.slug }))} /></Field>
          <Field label="Slug"><input required className="tn-input" value={form.slug} onChange={(event) => { setSlugEdited(true); setForm({ ...form, slug: event.target.value.trim().toLowerCase() }); }} />
            {!isNew && originalSlug && form.slug !== originalSlug && <p className="mt-2 text-sm text-technic-orange">Changing this slug changes the public URL.</p>}
          </Field>
          <Field label="Short Description"><textarea className="tn-input" rows={2} value={form.shortDescription} onChange={(event) => setForm({ ...form, shortDescription: event.target.value })} /></Field>
          <Field label="Description"><textarea required className="tn-input" rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></Field>
          <Field label="Long description">
            <textarea className="tn-input font-mono text-sm" rows={10} value={form.longDescription} onChange={(event) => setForm({ ...form, longDescription: event.target.value })} placeholder="<h2>Overview</h2><p>Detailed HTML content for the solution page.</p>" />
            <p className="mt-2 text-sm text-technic-muted">Shown on the detail page. Scripts are removed when you save.</p>
          </Field>
          <div className="grid gap-4 md:grid-cols-4">
            <Field label="Industry"><input className="tn-input" value={form.industry} onChange={(event) => setForm({ ...form, industry: event.target.value })} /></Field>
            <Field label="Icon"><input required className="tn-input" value={form.icon} onChange={(event) => setForm({ ...form, icon: event.target.value })} /></Field>
            <Field label="Order"><input type="number" className="tn-input" value={form.order} onChange={(event) => setForm({ ...form, order: Number(event.target.value) || 0 })} /></Field>
            <Field label="Status"><select className="tn-input" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as FormState["status"] })}><option>Draft</option><option>Published</option></select></Field>
          </div>
        </Section>
        <Section title="Hero">
          <Field label="Hero Title"><input className="tn-input" value={form.heroTitle} onChange={(event) => setForm({ ...form, heroTitle: event.target.value })} /></Field>
          <Field label="Hero Description"><textarea className="tn-input" rows={3} value={form.heroDescription} onChange={(event) => setForm({ ...form, heroDescription: event.target.value })} /></Field>
          <ImageUpload label="Hero Image" value={form.heroImage} folder="solutions" onChange={(url) => setForm({ ...form, heroImage: url })} />
          <ImageUpload label="Industry Card Image" value={form.cardImage} folder="solutions" onChange={(url) => setForm({ ...form, cardImage: url })} />
        </Section>
        <Section title="Overview">
          <Field label="Overview Title"><input className="tn-input" value={form.overview.title} onChange={(event) => setForm({ ...form, overview: { ...form.overview, title: event.target.value } })} /></Field>
          <Field label="Overview Description"><textarea className="tn-input" rows={4} value={form.overview.description} onChange={(event) => setForm({ ...form, overview: { ...form.overview, description: event.target.value } })} /></Field>
          <ImageUpload label="Overview Image" value={form.overviewImage} folder="solutions" onChange={(url) => setForm({ ...form, overviewImage: url })} />
        </Section>
        <Section title="Benefits"><NamedList items={form.benefits} onChange={(benefits) => setForm({ ...form, benefits })} /></Section>
        <Section title="Features"><NamedList items={form.features} onChange={(features) => setForm({ ...form, features })} /></Section>
        <Section title="Use Cases">
          <ListEditor items={form.useCases} blank={() => ({ title: "", description: "" })} onChange={(useCases) => setForm({ ...form, useCases })} render={(item, update) => (
            <div className="grid gap-3"><input className="tn-input" placeholder="Title" value={item.title} onChange={(event) => update({ ...item, title: event.target.value })} /><textarea className="tn-input" rows={2} placeholder="Description" value={item.description} onChange={(event) => update({ ...item, description: event.target.value })} /></div>
          )} />
        </Section>
        <Section title="Process">
          <ListEditor items={form.process} blank={() => ({ step: "", title: "", description: "" })} onChange={(process) => setForm({ ...form, process })} render={(item, update) => (
            <div className="grid gap-3"><div className="grid gap-3 md:grid-cols-2"><input className="tn-input" placeholder="Step" value={item.step} onChange={(event) => update({ ...item, step: event.target.value })} /><input className="tn-input" placeholder="Title" value={item.title} onChange={(event) => update({ ...item, title: event.target.value })} /></div><textarea className="tn-input" rows={2} value={item.description} onChange={(event) => update({ ...item, description: event.target.value })} /></div>
          )} />
        </Section>
        <Section title="Technologies">
          <ListEditor items={form.technologies} blank={() => ({ name: "", category: "", icon: "" })} onChange={(technologies) => setForm({ ...form, technologies })} render={(item, update) => (
            <div className="grid gap-3 md:grid-cols-3"><input className="tn-input" placeholder="Technology" value={item.name} onChange={(event) => update({ ...item, name: event.target.value })} /><input className="tn-input" placeholder="Category" value={item.category} onChange={(event) => update({ ...item, category: event.target.value })} /><input className="tn-input" placeholder="Icon" value={item.icon} onChange={(event) => update({ ...item, icon: event.target.value })} /></div>
          )} />
        </Section>
        <Section title="Metrics">
          <ListEditor items={form.metrics} blank={() => ({ value: "", label: "" })} onChange={(metrics) => setForm({ ...form, metrics })} render={(item, update) => (
            <div className="grid gap-3 md:grid-cols-2"><input className="tn-input" placeholder="Value" value={item.value} onChange={(event) => update({ ...item, value: event.target.value })} /><input className="tn-input" placeholder="Label" value={item.label} onChange={(event) => update({ ...item, label: event.target.value })} /></div>
          )} />
        </Section>
        <Section title="FAQ">
          <ListEditor items={form.faqs} blank={() => ({ question: "", answer: "" })} onChange={(faqs) => setForm({ ...form, faqs })} render={(item, update) => (
            <div className="grid gap-3"><input className="tn-input" placeholder="Question" value={item.question} onChange={(event) => update({ ...item, question: event.target.value })} /><textarea className="tn-input" rows={2} placeholder="Answer" value={item.answer} onChange={(event) => update({ ...item, answer: event.target.value })} /></div>
          )} />
        </Section>
        <Section title="CTA">
          <Field label="Title"><input className="tn-input" value={form.cta.title} onChange={(event) => setForm({ ...form, cta: { ...form.cta, title: event.target.value } })} /></Field>
          <Field label="Description"><textarea className="tn-input" rows={3} value={form.cta.description} onChange={(event) => setForm({ ...form, cta: { ...form.cta, description: event.target.value } })} /></Field>
          <Field label="Button"><input className="tn-input" value={form.cta.buttonText} onChange={(event) => setForm({ ...form, cta: { ...form.cta, buttonText: event.target.value } })} /></Field>
        </Section>
        <Section title="SEO">
          <Field label="Meta Title"><input className="tn-input" value={form.seo.metaTitle} onChange={(event) => setForm({ ...form, seo: { ...form.seo, metaTitle: event.target.value } })} /></Field>
          <Field label="Meta Description"><textarea className="tn-input" rows={3} value={form.seo.metaDescription} onChange={(event) => setForm({ ...form, seo: { ...form.seo, metaDescription: event.target.value } })} /></Field>
          <Field label="Keywords"><input className="tn-input" value={form.seo.keywords} onChange={(event) => setForm({ ...form, seo: { ...form.seo, keywords: event.target.value } })} /></Field>
        </Section>
        <div className="flex justify-end"><button type="submit" disabled={saving} className="inline-flex items-center rounded-xl bg-brand-gradient px-8 py-3 font-bold text-white disabled:opacity-50"><Save className="mr-2 h-5 w-5" />{saving ? "Saving..." : "Save Solution"}</button></div>
      </form>
    </div>
  );
}

function Section({ title, open = false, children }: { title: string; open?: boolean; children: React.ReactNode }) {
  return <details open={open} className="rounded-2xl border border-technic-border bg-white shadow-tn-md"><summary className="cursor-pointer px-6 py-4 font-heading text-xl font-bold text-technic-text">{title}</summary><div className="space-y-4 px-6 pb-6">{children}</div></details>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="tn-label">{label}</span>{children}</label>;
}

function NamedList({ items, onChange }: { items: Named[]; onChange: (items: Named[]) => void }) {
  return <ListEditor items={items} blank={() => ({ title: "", description: "", icon: "" })} onChange={onChange} render={(item, update) => (
    <div className="grid gap-3"><div className="grid gap-3 md:grid-cols-2"><input className="tn-input" placeholder="Title" value={item.title} onChange={(event) => update({ ...item, title: event.target.value })} /><input className="tn-input" placeholder="Icon" value={item.icon} onChange={(event) => update({ ...item, icon: event.target.value })} /></div><textarea className="tn-input" rows={2} placeholder="Description" value={item.description} onChange={(event) => update({ ...item, description: event.target.value })} /></div>
  )} />;
}

function ListEditor<T>({ items, blank, onChange, render }: { items: T[]; blank: () => T; onChange: (items: T[]) => void; render: (item: T, update: (item: T) => void) => React.ReactNode }) {
  const move = (index: number, direction: -1 | 1) => {
    const next = [...items];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="rounded-xl border border-technic-border p-4">
          {render(item, (next) => onChange(items.map((entry, entryIndex) => entryIndex === index ? next : entry)))}
          <div className="mt-3 flex gap-3">
            <button type="button" onClick={() => move(index, -1)} aria-label="Move up"><ArrowUp className="h-4 w-4" /></button>
            <button type="button" onClick={() => move(index, 1)} aria-label="Move down"><ArrowDown className="h-4 w-4" /></button>
            <button type="button" onClick={() => onChange(items.filter((_, entryIndex) => entryIndex !== index))} className="text-technic-error" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
          </div>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, blank()])} className="inline-flex items-center text-sm font-semibold text-technic-cyan-deep"><Plus className="mr-1 h-4 w-4" /> Add</button>
    </div>
  );
}
