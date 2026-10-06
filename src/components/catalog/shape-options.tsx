"use client";

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
    <div className="grid gap-2" aria-invalid={invalid ? true : undefined}>
      {options.map((option) => {
        const selected = value === option.id;
        return (
          <label
            key={option.id}
            className={cn(
              "flex min-h-12 cursor-pointer gap-3 rounded-xl border px-4 py-3 transition-colors",
              selected
                ? "border-navy-800 bg-navy-800 text-cream-50"
                : invalid
                  ? "border-destructive bg-destructive/5 text-navy-900"
                  : "border-cream-300 bg-cream-100 text-navy-900 hover:border-navy-700/40",
            )}
          >
            <input
              type="radio"
              name={name}
              className="mt-1"
              checked={selected}
              onChange={() => onChange(option.id)}
            />
            <span>
              <span className="block font-semibold">{option.label}</span>
              {option.description ? (
                <span
                  className={cn(
                    "mt-1 block text-sm",
                    selected ? "text-cream-50/80" : "text-ink-600",
                  )}
                >
                  {option.description}
                </span>
              ) : null}
            </span>
          </label>
        );
      })}
    </div>
  );
}
