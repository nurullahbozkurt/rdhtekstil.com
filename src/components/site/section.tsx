import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "cream" | "ivory" | "sand" | "navy";

const toneClasses: Record<Tone, string> = {
  cream: "bg-cream-100 text-navy-900",
  ivory: "bg-cream-50 text-navy-900",
  sand: "bg-cream-200 text-navy-900",
  navy: "on-dark bg-navy-800 text-cream-50",
};

export function Section({
  children,
  tone = "cream",
  className,
  id,
  labelledBy,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  id?: string;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("relative py-20 sm:py-24 lg:py-28", toneClasses[tone], className)}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  text,
  align = "left",
  className,
  action,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "left" | "center";
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "mb-12 flex flex-col gap-6 lg:mb-16",
        align === "center"
          ? "items-center text-center"
          : "lg:flex-row lg:items-end lg:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
        <h2 id={id} className="text-h2 font-medium tracking-tight">
          {title}
        </h2>
        {text ? <p className="mt-5 text-lg leading-relaxed text-current/75">{text}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
