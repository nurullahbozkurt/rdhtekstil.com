import Image from "next/image";
import type { ReferenceView } from "@/lib/content";
import { cn } from "@/lib/utils";

function ReferenceTile({ reference, className }: { reference: ReferenceView; className?: string }) {
  return (
    <div
      className={cn(
        "flex h-20 min-w-44 shrink-0 items-center justify-center rounded-2xl border border-cream-300 bg-cream-50 px-6 sm:h-24 sm:min-w-52",
        className,
      )}
      data-placeholder={reference.logo?.src ? undefined : "TODO(content)"}
    >
      {reference.logo?.src ? (
        <Image
          src={reference.logo.src}
          alt={reference.logo.alt}
          width={160}
          height={64}
          className="max-h-12 w-auto object-contain grayscale transition hover:grayscale-0"
        />
      ) : (
        <span className="text-center font-heading text-lg leading-tight font-medium tracking-tight text-navy-800/80">
          {reference.name}
        </span>
      )}
    </div>
  );
}

/**
 * Referans logoları. Masaüstünde yavaş akan şerit (hover/odakta durur, azaltılmış harekette sabit),
 * mobilde parmakla kaydırılabilir şerit.
 */
export function ReferenceStrip({
  references,
  label,
  notice,
}: {
  references: ReferenceView[];
  label: string;
  notice?: string;
}) {
  if (!references.length) return null;
  return (
    <div>
      {/* Mobil: kaydırılabilir */}
      <ul
        aria-label={label}
        className="-mx-5 flex snap-x snap-mandatory [scrollbar-width:none] gap-3 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 md:hidden"
      >
        {references.map((reference) => (
          <li key={reference.id} className="snap-start">
            <ReferenceTile reference={reference} />
          </li>
        ))}
      </ul>

      {/* Masaüstü: akan şerit */}
      <div className="group relative hidden overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] md:block">
        <ul
          aria-label={label}
          className="flex w-max animate-marquee gap-4 group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused]"
        >
          {[...references, ...references].map((reference, index) => (
            <li
              key={`${reference.id}-${index}`}
              aria-hidden={index >= references.length || undefined}
            >
              <ReferenceTile reference={reference} />
            </li>
          ))}
        </ul>
      </div>
      {notice ? <p className="mt-4 text-center text-xs text-ink-600">{notice}</p> : null}
    </div>
  );
}

export function ReferenceGrid({ references }: { references: ReferenceView[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {references.map((reference) => (
        <li key={reference.id}>
          <ReferenceTile reference={reference} className="h-28 w-full min-w-0" />
        </li>
      ))}
    </ul>
  );
}
