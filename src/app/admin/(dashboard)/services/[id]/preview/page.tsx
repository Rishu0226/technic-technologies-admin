"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ApiClient } from "../../../../../../lib/api";

type PreviewService = {
  title?: string;
  slug?: string;
  description?: string;
  status?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroImage?: string;
  overview?: { title?: string; description?: string; image?: string };
  benefits?: { title?: string; description?: string }[];
  features?: { title?: string; description?: string }[];
  faqs?: { question?: string; answer?: string }[];
};

export default function ServicePreviewPage() {
  const params = useParams();
  const [service, setService] = useState<PreviewService | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    ApiClient.get(`/api/admin/services/${params.id}`)
      .then((response) => setService(response.data))
      .catch(() => setError("Unable to load this service."));
  }, [params.id]);

  if (error) return <p className="text-technic-error">{error}</p>;
  if (!service) return <p className="text-technic-muted">Loading preview...</p>;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-technic-cyan-deep">Draft preview</p>
          <h1 className="font-heading text-4xl font-bold text-technic-text">{service.heroTitle || service.title}</h1>
        </div>
        <Link href={`/admin/services/${params.id}`} className="text-sm font-semibold text-technic-cyan-deep">Back to edit</Link>
      </div>
      <p className="text-technic-secondary">This {service.status || "Draft"} service is hidden on the public site until it is Published.</p>
      <p className="text-lg leading-relaxed text-technic-secondary">{service.heroDescription || service.description}</p>
      {service.heroImage && <img src={service.heroImage} alt="" className="w-full rounded-2xl border border-technic-border" />}
      {service.overview?.description && (
        <section>
          <h2 className="mb-3 font-heading text-2xl font-bold text-technic-text">{service.overview.title || "What We Build"}</h2>
          <p className="text-technic-secondary">{service.overview.description}</p>
        </section>
      )}
      <PreviewList title="Benefits" items={service.benefits} />
      <PreviewList title="Capabilities" items={service.features} />
      {!!service.faqs?.length && (
        <section>
          <h2 className="mb-3 font-heading text-2xl font-bold text-technic-text">FAQ</h2>
          {service.faqs.map((item) => (
            <p key={item.question} className="mb-3 text-technic-secondary"><strong className="text-technic-text">{item.question}</strong> {item.answer}</p>
          ))}
        </section>
      )}
    </div>
  );
}

function PreviewList({ title, items }: { title: string; items?: { title?: string; description?: string }[] }) {
  if (!items?.length) return null;
  return (
    <section>
      <h2 className="mb-3 font-heading text-2xl font-bold text-technic-text">{title}</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <article key={item.title} className="rounded-2xl border border-technic-border bg-white p-4">
            <h3 className="font-semibold text-technic-text">{item.title}</h3>
            <p className="text-sm text-technic-secondary">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
