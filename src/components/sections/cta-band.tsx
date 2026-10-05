import { ArrowRight } from "lucide-react";
import { ButtonLink } from "../site/button-link";

export function CtaBand({
  title,
  text,
  cta,
  secondary,
}: {
  title: string;
  text?: string;
  cta: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="bg-cream-100 py-16 sm:py-20">
      <div className="container-site">
        <div className="on-dark relative overflow-hidden rounded-[2rem] bg-navy-800 px-6 py-14 text-cream-50 sm:px-12 lg:px-16 lg:py-20">
          <div
            aria-hidden
            className="bg-weave pointer-events-none absolute inset-y-0 right-0 w-1/2 [mask-image:linear-gradient(to_left,black,transparent)] opacity-[0.12]"
          />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-h2 font-medium tracking-tight">{title}</h2>
              {text ? (
                <p className="mt-4 text-lg leading-relaxed text-cream-50/80">{text}</p>
              ) : null}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={cta.href} variant="gold" size="lg">
                {cta.label}
                <ArrowRight aria-hidden />
              </ButtonLink>
              {secondary ? (
                <ButtonLink href={secondary.href} variant="light" size="lg">
                  {secondary.label}
                </ButtonLink>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
