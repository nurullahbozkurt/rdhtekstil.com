"use client";

import { useMemo, useState } from "react";
import { CaseStudyCard, type CaseStudyCardData } from "../cards/case-study-card";
import { FilterChips } from "./filter-chips";

export function CaseStudyGrid({
  caseStudies,
  categories,
  labels,
}: {
  caseStudies: CaseStudyCardData[];
  categories: { id: string; label: string }[];
  labels: { all: string; filter: string; empty: string; cta: string; placeholderImage: string };
}) {
  const [category, setCategory] = useState("all");
  const visible = useMemo(
    () =>
      category === "all" ? caseStudies : caseStudies.filter((c) => c.categories.includes(category)),
    [caseStudies, category],
  );

  return (
    <div>
      <div className="mb-10">
        <FilterChips
          label={labels.filter}
          value={category}
          onChange={setCategory}
          options={[{ id: "all", label: labels.all }, ...categories]}
        />
      </div>
      {visible.length ? (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((caseStudy) => (
            <li key={caseStudy.id}>
              <CaseStudyCard
                caseStudy={caseStudy}
                ctaLabel={labels.cta}
                placeholderLabel={labels.placeholderImage}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-cream-400 p-10 text-center text-ink-600">
          {labels.empty}
        </p>
      )}
    </div>
  );
}
