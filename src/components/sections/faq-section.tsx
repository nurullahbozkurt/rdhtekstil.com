import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqView } from "@/lib/content";
import { faqJsonLd } from "@/lib/seo/jsonld";
import { JsonLd } from "../site/json-ld";
import { Section, SectionHeading } from "../site/section";

export function FaqList({ faqs }: { faqs: FaqView[] }) {
  return (
    <Accordion className="divide-y divide-cream-300 border-y border-cream-300">
      {faqs.map((faq) => (
        <AccordionItem key={faq.id} value={faq.id} className="not-last:border-b-0">
          <AccordionTrigger className="gap-6 rounded-none py-6 text-left font-heading text-lg font-medium text-navy-900 hover:no-underline sm:text-xl">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="max-w-3xl pb-6 text-base leading-relaxed text-ink-600">
            <p>{faq.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function FaqSection({
  faqs,
  title,
  eyebrow,
  tone = "ivory",
  id = "faq",
}: {
  faqs: FaqView[];
  title: string;
  eyebrow?: string;
  tone?: "cream" | "ivory" | "sand";
  id?: string;
}) {
  if (!faqs.length) return null;
  return (
    <Section tone={tone} labelledBy={`${id}-title`}>
      <div className="container-site grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionHeading
          id={`${id}-title`}
          eyebrow={eyebrow}
          title={title}
          className="mb-0 lg:mb-0"
        />
        <FaqList faqs={faqs} />
      </div>
      <JsonLd data={faqJsonLd(faqs)} />
    </Section>
  );
}
