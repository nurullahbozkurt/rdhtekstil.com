import type { SiteSettingsView } from "@/lib/content";
import { Reveal } from "../site/reveal";

export function ProcessSteps({ steps }: { steps: SiteSettingsView["processSteps"] }) {
  return (
    <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {steps.map((step, index) => (
        <li key={step.title}>
          <Reveal delay={(index % 3) * 0.06} className="relative border-t border-cream-50/25 pt-6">
            <span aria-hidden className="absolute -top-px left-0 h-0.5 w-12 bg-gold-400" />
            <span className="font-heading text-sm font-medium tracking-[0.2em] text-gold-400">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 font-heading text-2xl font-medium">{step.title}</h3>
            <p className="mt-2 leading-relaxed text-cream-50/80">{step.text}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
