"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ApiClient } from "../../../../../../lib/api";

type Preview = {
  title?: string;
  status?: string;
  description?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroImage?: string;
  cardImage?: string;
};

export default function SolutionPreviewPage() {
  const params = useParams();
  const [solution, setSolution] = useState<Preview | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    ApiClient.get(`/api/admin/solutions/${params.id}`)
      .then((response) => setSolution(response.data))
      .catch(() => setError("Unable to load this solution."));
  }, [params.id]);

  if (error) return <p className="text-technic-error">{error}</p>;
  if (!solution) return <p className="text-technic-muted">Loading preview...</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-technic-cyan-deep">Draft preview</p>
          <h1 className="font-heading text-4xl font-bold text-technic-text">{solution.heroTitle || solution.title}</h1>
        </div>
        <Link href={`/admin/solutions/${params.id}`} className="text-sm font-semibold text-technic-cyan-deep">Back to edit</Link>
      </div>
      <p className="text-technic-secondary">This {solution.status || "Draft"} solution stays off the public site until it is Published.</p>
      <p className="text-lg text-technic-secondary">{solution.heroDescription || solution.description}</p>
      {(solution.heroImage || solution.cardImage) && <img src={solution.heroImage || solution.cardImage} alt="" className="w-full rounded-2xl border border-technic-border" />}
    </div>
  );
}
