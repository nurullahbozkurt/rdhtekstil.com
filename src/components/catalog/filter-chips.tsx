"use client";

import { cn } from "@/lib/utils";

export function FilterChips({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: string; label: string; count?: number }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="-mx-5 flex [scrollbar-width:none] gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
    >
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.id)}
            className={cn(
              "inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors",
              active
                ? "border-navy-800 bg-navy-800 text-cream-50"
                : "border-cream-400 bg-cream-50 text-navy-900 hover:border-navy-800",
            )}
          >
            {option.label}
            {option.count !== undefined ? (
              <span className={cn("text-xs", active ? "text-cream-50/70" : "text-ink-600")}>
                {option.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
