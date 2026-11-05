"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type ShapeOption = {
  id: string;
  label: string;
  description?: string;
};

export function ShapeOptions({
  name,
  options,
  value,
  onChange,
  invalid,
}: {
  name: string;
  options: ShapeOption[];
  value?: string;
  onChange: (id: string) => void;
  invalid?: boolean;
}) {
  return (
    <div className="grid gap-2.5" role="radiogroup" aria-invalid={invalid ? true : undefined}>
      {options.map((option) => {
        const selected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={option.label}
            data-name={name}
            className={cn(
              "flex min-h-14 w-full touch-manipulation items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors",
              selected
                ? "border-navy-800 bg-navy-800 text-cream-50"
                : invalid
                  ? "border-destructive bg-destructive/5 text-navy-900"
                  : "border-cream-300 bg-cream-100 text-navy-900 active:bg-cream-200 hover:border-navy-700/40",
            )}
            onClick={() => onChange(option.id)}
          >
            <span
              className={cn(
                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
                selected ? "border-cream-50 bg-cream-50 text-navy-900" : "border-navy-800/30",
              )}
              aria-hidden
            >
              {selected ? <Check className="size-3 stroke-[3]" /> : null}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[0.95rem] font-semibold leading-snug">{option.label}</span>
              {option.description ? (
                <span
                  className={cn(
                    "mt-1 block text-sm leading-snug",
                    selected ? "text-cream-50/80" : "text-ink-600",
                  )}
                >
                  {option.description}
                </span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
