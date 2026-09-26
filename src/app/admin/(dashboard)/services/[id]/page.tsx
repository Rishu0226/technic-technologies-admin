"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowUp, Plus, Save, Trash2 } from "lucide-react";
import { ApiClient } from "../../../../../lib/api";
import ImageUpload from "../../../../../../components/admin/ui/ImageUpload";
import AIGenerator from "../../../../../../components/admin/ui/AIGenerator";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3005";
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type Named = { title: string; description: string; icon: string };
type Tech = { name: string; category: string; icon: string };
type Step = { step: string; title: string; description: string };
type Faq = { question: string; answer: string };

type ServiceForm = {
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  description: string;
  icon: string;
  image: string;
  heroImage: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  benefits: Named[];
  overview: { title: string; description: string; image: string };
  features: Named[];
  technologies: Tech[];
  process: Step[];
  deliverables: string[];
  useCases: { title: string; description: string }[];
  faqs: Faq[];
  cta: { title: string; description: string; buttonText: string };
  seo: { metaTitle: string; metaDescription: string; keywords: string };
  order: number;
  status: "Draft" | "Published";
};

const blank = {
  named: (): Named => ({ title: "", description: "", icon: "" }),
  tech: (): Tech => ({ name: "", category: "", icon: "" }),
  step: (): Step => ({ step: "", title: "", description: "" }),
  useCase: () => ({ title: "", description: "" }),
  faq: (): Faq => ({ question: "", answer: "" }),
};

function emptyForm(): ServiceForm {
  return {
    title: "",
    slug: "",
    shortDescription: "",
    longDescription: "",
    description: "",
    icon: "Layout",
    image: "",
    heroImage: "",
    heroEyebrow: "Service",
    heroTitle: "",
    heroDescription: "",
    benefits: [],
    overview: { title: "What We Build", description: "", image: "" },
    features: [],
    technologies: [],
    process: [],
    deliverables: [],
    useCases: [],
    faqs: [],
    cta: { title: "", description: "", buttonText: "Get a Free Consultation" },
    seo: { metaTitle: "", metaDescription: "", keywords: "" },
    order: 0,
    status: "Draft",
  };
}

function toSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value as T[] : [];
}

export default function ServiceFormPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === "new";
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(!isNew);
  const [originalSlug, setOriginalSlug] = useState("");
  const [formData, setFormData] = useState<ServiceForm>(emptyForm);

  useEffect(() => {
    if (!isNew) fetchService();
  }, [isNew]);

  const fetchService = async () => {
    try {
      const response = await ApiClient.get(`/api/admin/services/${params.id}`);
      const service = response.data;
      setOriginalSlug(service.slug || "");
      setFormData({
        ...emptyForm(),
        ...service,
        shortDescription: service.shortDescription || "",
        longDescription: service.longDescription || "",
        image: service.image || "",
        heroImage: service.heroImage || "",
        heroEyebrow: service.heroEyebrow || "Service",
        heroTitle: service.heroTitle || "",
        heroDescription: service.heroDescription || "",
        benefits: asArray<Named>(service.benefits),
        overview: { title: service.overview?.title || "What We Build", description: service.overview?.description || "", image: service.overview?.image || "" },
        features: asArray<Named>(service.features),
        technologies: asArray<Tech>(service.technologies),
        process: asArray<Step>(service.process),
        deliverables: asArray<string>(service.deliverables),
        useCases: asArray(service.useCases),
        faqs: asArray<Faq>(service.faqs),
        cta: { title: service.cta?.title || "", description: service.cta?.description || "", buttonText: service.cta?.buttonText || "Get a Free Consultation" },
        seo: { metaTitle: service.seo?.metaTitle || "", metaDescription: service.seo?.metaDescription || "", keywords: service.seo?.keywords || "" },
        order: service.order || 0,
        status: service.status || "Draft",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load service data");
    } finally {
      setLoading(false);
    }
  };

  const setField = (name: keyof ServiceForm, value: ServiceForm[keyof ServiceForm]) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateService = async (prompt: string) => {
    const response = await ApiClient.post("/api/admin/ai/generate-service", { prompt });
    const data = response.data?.data;
    if (!data) return;

    setSlugEdited(true);
    setFormData((prev) => ({
      ...prev,
      title: data.title || prev.title,
      slug: data.slug || prev.slug,
      shortDescription: data.shortDescription || prev.shortDescription,
      description: data.description || prev.description,
      icon: data.icon || prev.icon,
      image: prev.image,
      heroImage: prev.heroImage,
      heroEyebrow: data.heroEyebrow || prev.heroEyebrow,
      heroTitle: data.heroTitle || prev.heroTitle,
      heroDescription: data.heroDescription || prev.heroDescription,
      benefits: Array.isArray(data.benefits) ? data.benefits : prev.benefits,
      overview: {
        title: data.overview?.title || prev.overview.title,
        description: data.overview?.description || prev.overview.description,
        image: prev.overview.image,
      },
      features: Array.isArray(data.features) ? data.features : prev.features,
      technologies: Array.isArray(data.technologies) ? data.technologies : prev.technologies,
      process: Array.isArray(data.process) ? data.process : prev.process,
      deliverables: Array.isArray(data.deliverables) ? data.deliverables : prev.deliverables,
      useCases: Array.isArray(data.useCases) ? data.useCases : prev.useCases,
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!slugPattern.test(formData.slug)) {
      setError("Slug must be lowercase words separated by hyphens.");
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      title: formData.title,
      slug: formData.slug,
      shortDescription: formData.shortDescription,
      longDescription: formData.longDescription,
      description: formData.description,
      icon: formData.icon,
      image: formData.image,
      heroImage: formData.heroImage,
      heroEyebrow: formData.heroEyebrow,
      heroTitle: formData.heroTitle,
      heroDescription: formData.heroDescription,
      overview: formData.overview,
      cta: formData.cta,
      seo: formData.seo,
      order: formData.order,
      status: formData.status,
      benefits: formData.benefits.filter((item) => item.title.trim()),
      features: formData.features.filter((item) => item.title.trim()),
      technologies: formData.technologies.filter((item) => item.name.trim()),
      process: formData.process.filter((item) => item.title.trim()),
      deliverables: formData.deliverables.map((item) => item.trim()).filter(Boolean),
      useCases: formData.useCases.filter((item) => item.title.trim()),
      faqs: formData.faqs.filter((item) => item.question.trim()),
    };
    try {
      if (isNew) await ApiClient.post("/api/admin/services", payload);
      else await ApiClient.put(`/api/admin/services/${params.id}`, payload);
      router.push("/admin/services");
    } catch (err: unknown) {
      const response = err as { response?: { data?: { error?: string } } };
      setError(response.response?.data?.error || "An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  const preview = () => {
    if (formData.status === "Published" && formData.slug) {
      window.open(`${siteUrl}/services/${formData.slug}`, "_blank", "noopener,noreferrer");
      return;
    }
    if (!isNew) router.push(`/admin/services/${params.id}/preview`);
  };

  if (loading) return <div className="p-8 text-technic-text">Loading...</div>;

  return (
    <div className="mx-auto max-w-4xl pb-20">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center">
          <Link href="/admin/services" className="mr-4 text-technic-muted hover:text-technic-cyan-deep">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="font-heading text-3xl font-bold text-technic-text">{isNew ? "Create New Service" : "Edit Service"}</h1>
        </div>
        <button type="button" onClick={preview} disabled={isNew && formData.status !== "Published"} className="rounded-xl border border-technic-border px-4 py-2 text-sm font-semibold text-technic-text hover:border-technic-cyan">
          Preview Service
        </button>
      </div>

      <AIGenerator onGenerate={handleGenerateService} disabled={saving} replaceExisting={!isNew && Boolean(formData.title)} type="service" />

      {error && <div className="mb-6 rounded-xl border border-technic-error/20 bg-technic-error-soft p-4 text-technic-error">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Section title="Basic Information" open>
          <Field label="Title">
            <input required className="tn-input" value={formData.title} onChange={(event) => {
              const title = event.target.value;
              setFormData((prev) => ({ ...prev, title, slug: isNew && !slugEdited ? toSlug(title) : prev.slug }));
            }} />
          </Field>
          <Field label="Slug">
            <input required className="tn-input" value={formData.slug} onChange={(event) => { setSlugEdited(true); setField("slug", event.target.value.trim().toLowerCase()); }} />
            {!isNew && originalSlug && formData.slug !== originalSlug && (
              <p className="mt-2 text-sm text-technic-orange">Changing this slug changes the public URL. Existing links to /services/{originalSlug} will stop working.</p>
            )}
          </Field>
          <Field label="Short Description">
            <textarea className="tn-input" rows={2} value={formData.shortDescription} onChange={(event) => setField("shortDescription", event.target.value)} />
          </Field>
          <Field label="Description">
            <textarea required className="tn-input" rows={4} value={formData.description} onChange={(event) => setField("description", event.target.value)} />
          </Field>
          <Field label="Long description">
            <textarea className="tn-input font-mono text-sm" rows={10} value={formData.longDescription} onChange={(event) => setField("longDescription", event.target.value)} placeholder="<h2>Overview</h2><p>Detailed HTML content for the service page.</p>" />
            <p className="mt-2 text-sm text-technic-muted">Shown on the detail page. Scripts are removed when you save.</p>
          </Field>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Icon">
              <input required className="tn-input" value={formData.icon} onChange={(event) => setField("icon", event.target.value)} />
            </Field>
            <Field label="Status">
              <select className="tn-input" value={formData.status} onChange={(event) => setField("status", event.target.value as ServiceForm["status"])}>
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </Field>
            <Field label="Order">
              <input type="number" className="tn-input" value={formData.order} onChange={(event) => setField("order", Number(event.target.value) || 0)} />
            </Field>
          </div>
        </Section>

        <Section title="Hero">
          <Field label="Hero Eyebrow"><input className="tn-input" value={formData.heroEyebrow} onChange={(event) => setField("heroEyebrow", event.target.value)} /></Field>
          <Field label="Hero Title"><input className="tn-input" value={formData.heroTitle} onChange={(event) => setField("heroTitle", event.target.value)} /></Field>
          <Field label="Hero Description"><textarea className="tn-input" rows={3} value={formData.heroDescription} onChange={(event) => setField("heroDescription", event.target.value)} /></Field>
          <ImageUpload label="Hero Image" value={formData.heroImage} folder="services" onChange={(url) => setField("heroImage", url)} />
          <ImageUpload label="Card Image" value={formData.image} folder="services" onChange={(url) => setField("image", url)} />
        </Section>

        <Section title="Benefits">
          <NamedList items={formData.benefits} onChange={(benefits) => setField("benefits", benefits)} />
        </Section>

        <Section title="Overview">
          <Field label="Title"><input className="tn-input" value={formData.overview.title} onChange={(event) => setField("overview", { ...formData.overview, title: event.target.value })} /></Field>
          <Field label="Description"><textarea className="tn-input" rows={4} value={formData.overview.description} onChange={(event) => setField("overview", { ...formData.overview, description: event.target.value })} /></Field>
          <ImageUpload label="Overview Image" value={formData.overview.image} folder="services" onChange={(url) => setField("overview", { ...formData.overview, image: url })} />
        </Section>

        <Section title="Capabilities">
          <NamedList items={formData.features} onChange={(features) => setField("features", features)} />
        </Section>

        <Section title="Technologies">
          <ListEditor
            items={formData.technologies}
            blank={blank.tech}
            onChange={(technologies) => setField("technologies", technologies)}
            render={(item, update) => (
              <div className="grid gap-3 md:grid-cols-3">
                <input className="tn-input" placeholder="Technology" value={item.name} onChange={(event) => update({ ...item, name: event.target.value })} />
                <input className="tn-input" placeholder="Category" value={item.category} onChange={(event) => update({ ...item, category: event.target.value })} />
                <input className="tn-input" placeholder="Icon" value={item.icon} onChange={(event) => update({ ...item, icon: event.target.value })} />
              </div>
            )}
          />
        </Section>

        <Section title="Process">
          <ListEditor
            items={formData.process}
            blank={blank.step}
            onChange={(process) => setField("process", process)}
            render={(item, update) => (
              <div className="grid gap-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <input className="tn-input" placeholder="Step" value={item.step} onChange={(event) => update({ ...item, step: event.target.value })} />
                  <input className="tn-input" placeholder="Title" value={item.title} onChange={(event) => update({ ...item, title: event.target.value })} />
                </div>
                <textarea className="tn-input" rows={2} placeholder="Description" value={item.description} onChange={(event) => update({ ...item, description: event.target.value })} />
              </div>
            )}
          />
        </Section>

        <Section title="Deliverables">
          <div className="space-y-3">
            {formData.deliverables.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input className="tn-input" value={item} onChange={(event) => setField("deliverables", formData.deliverables.map((entry, entryIndex) => entryIndex === index ? event.target.value : entry))} />
                <button type="button" onClick={() => setField("deliverables", formData.deliverables.filter((_, entryIndex) => entryIndex !== index))} className="text-technic-error"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            <button type="button" onClick={() => setField("deliverables", [...formData.deliverables, ""])} className="inline-flex items-center text-sm font-semibold text-technic-cyan-deep"><Plus className="mr-1 h-4 w-4" /> Add deliverable</button>
          </div>
        </Section>

        <Section title="Use Cases">
          <ListEditor
            items={formData.useCases}
            blank={blank.useCase}
            onChange={(useCases) => setField("useCases", useCases)}
            render={(item, update) => (
              <div className="grid gap-3">
                <input className="tn-input" placeholder="Title" value={item.title} onChange={(event) => update({ ...item, title: event.target.value })} />
                <textarea className="tn-input" rows={2} placeholder="Description" value={item.description} onChange={(event) => update({ ...item, description: event.target.value })} />
              </div>
            )}
          />
        </Section>

        <Section title="FAQ">
          <ListEditor
            items={formData.faqs}
            blank={blank.faq}
            onChange={(faqs) => setField("faqs", faqs)}
            render={(item, update) => (
              <div className="grid gap-3">
                <input className="tn-input" placeholder="Question" value={item.question} onChange={(event) => update({ ...item, question: event.target.value })} />
                <textarea className="tn-input" rows={2} placeholder="Answer" value={item.answer} onChange={(event) => update({ ...item, answer: event.target.value })} />
              </div>
            )}
          />
        </Section>

        <Section title="CTA">
          <Field label="Title"><input className="tn-input" value={formData.cta.title} onChange={(event) => setField("cta", { ...formData.cta, title: event.target.value })} /></Field>
          <Field label="Description"><textarea className="tn-input" rows={3} value={formData.cta.description} onChange={(event) => setField("cta", { ...formData.cta, description: event.target.value })} /></Field>
          <Field label="Button Text"><input className="tn-input" value={formData.cta.buttonText} onChange={(event) => setField("cta", { ...formData.cta, buttonText: event.target.value })} /></Field>
        </Section>

        <Section title="SEO">
          <Field label="Meta Title"><input className="tn-input" value={formData.seo.metaTitle} onChange={(event) => setField("seo", { ...formData.seo, metaTitle: event.target.value })} /></Field>
          <Field label="Meta Description"><textarea className="tn-input" rows={3} value={formData.seo.metaDescription} onChange={(event) => setField("seo", { ...formData.seo, metaDescription: event.target.value })} /></Field>
          <Field label="Keywords"><input className="tn-input" value={formData.seo.keywords} onChange={(event) => setField("seo", { ...formData.seo, keywords: event.target.value })} /></Field>
        </Section>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="flex items-center rounded-xl bg-brand-gradient px-8 py-3 font-bold text-white disabled:opacity-50">
            {saving ? "Saving..." : <><Save className="mr-2 h-5 w-5" /> Save Service</>}
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, open = false, children }: { title: string; open?: boolean; children: React.ReactNode }) {
  return (
    <details open={open} className="rounded-2xl border border-technic-border bg-white shadow-tn-md">
      <summary className="cursor-pointer px-6 py-4 font-heading text-xl font-bold text-technic-text">{title}</summary>
      <div className="space-y-4 px-6 pb-6">{children}</div>
    </details>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="tn-label">{label}</span>
      {children}
    </label>
  );
}

function NamedList({ items, onChange }: { items: Named[]; onChange: (items: Named[]) => void }) {
  return (
    <ListEditor
      items={items}
      blank={blank.named}
      onChange={onChange}
      render={(item, update) => (
        <div className="grid gap-3">
          <div className="grid gap-3 md:grid-cols-2">
            <input className="tn-input" placeholder="Title" value={item.title} onChange={(event) => update({ ...item, title: event.target.value })} />
            <input className="tn-input" placeholder="Icon" value={item.icon} onChange={(event) => update({ ...item, icon: event.target.value })} />
          </div>
          <textarea className="tn-input" rows={2} placeholder="Description" value={item.description} onChange={(event) => update({ ...item, description: event.target.value })} />
        </div>
      )}
    />
  );
}

function ListEditor<T>({
  items,
  blank: create,
  onChange,
  render,
}: {
  items: T[];
  blank: () => T;
  onChange: (items: T[]) => void;
  render: (item: T, update: (item: T) => void) => React.ReactNode;
}) {
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
            <button type="button" onClick={() => move(index, -1)} className="text-technic-muted" aria-label="Move up"><ArrowUp className="h-4 w-4" /></button>
            <button type="button" onClick={() => move(index, 1)} className="text-technic-muted" aria-label="Move down"><ArrowDown className="h-4 w-4" /></button>
            <button type="button" onClick={() => onChange(items.filter((_, entryIndex) => entryIndex !== index))} className="text-technic-error" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
          </div>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, create()])} className="inline-flex items-center text-sm font-semibold text-technic-cyan-deep">
        <Plus className="mr-1 h-4 w-4" /> Add
      </button>
    </div>
  );
}
