import type { SiteSettingsView } from "@/lib/content";
import { Icon } from "../site/icon";
import { Reveal } from "../site/reveal";

export function ValueProps({
  items,
  variant = "short",
}: {
  items: SiteSettingsView["valueProps"];
  variant?: "short" | "long";
}) {
  return (
    <ul className="grid gap-px overflow-hidden rounded-[1.75rem] border border-cream-300 bg-cream-300 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <li key={item.id} className="bg-cream-50">
          <Reveal delay={(index % 3) * 0.06} className="flex h-full flex-col p-7 sm:p-8">
            <span className="flex size-12 items-center justify-center rounded-full bg-navy-800 text-gold-400">
              <Icon name={item.icon} className="size-5" />
            </span>
            <h3 className="mt-6 font-heading text-xl font-medium text-navy-900">{item.title}</h3>
            <p className="mt-2 leading-relaxed text-ink-600">
              {variant === "short" ? item.short : item.long}
            </p>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
