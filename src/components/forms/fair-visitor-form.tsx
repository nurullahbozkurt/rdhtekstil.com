"use client";

import { CheckCircle2, CircleAlert } from "lucide-react";
import Link from "next/link";
import { useId, useRef, useState, type ReactNode } from "react";
import type { Messages } from "@/i18n/messages";
import { cn } from "@/lib/utils";
import { parseErrorCode } from "@/lib/validation/contact";
import { localTodayISO } from "@/lib/validation/request";
import {
  FAIR_PRODUCT_GROUPS,
  fairVisitorFormSchema,
  type FairVisitorField,
  type FairVisitorFormInput,
  type FairVisitorSource,
} from "@/lib/validation/fair-visitor";
import { ctaVariants } from "../site/button-link";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

type Option = { value: string; label: string };
type Errors = Partial<Record<FairVisitorField, string>>;

const FIELD_ORDER: FairVisitorField[] = [
  "fullName",
  "company",
  "jobTitle",
  "country",
  "email",
  "phone",
  "productGroup",
  "quantityRange",
  "desiredDate",
  "notes",
  "privacyConsent",
];

function interpolate(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (m, key: string) => values[key] ?? m);
}

const inputClass =
  "block h-14 w-full rounded-2xl border border-input bg-white px-4 text-base text-navy-900 transition-colors placeholder:text-ink-500 focus-visible:border-navy-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-navy-700 aria-invalid:border-destructive sm:h-12 sm:rounded-xl";

export function FairVisitorForm({
  locale,
  formMessages,
  fairMessages,
  options,
  privacyHref,
  submitLabel,
  disclosure,
  disclosureClose,
  disclosureOpenFull,
  source = "STAFF",
}: {
  locale: "tr" | "en";
  formMessages: Messages["form"];
  fairMessages: Messages["fair"];
  options: { countries: Option[]; quantities: Option[] };
  privacyHref: string;
  submitLabel: string;
  disclosure: {
    title: string;
    intro?: string;
    sections: { heading: string; paragraphs: string[] }[];
  };
  disclosureClose: string;
  disclosureOpenFull: string;
  source?: FairVisitorSource;
}) {
  const formId = useId();
  const summaryRef = useRef<HTMLDivElement>(null);
  const noticeRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [disclosureOpen, setDisclosureOpen] = useState(false);
  const [productGroup, setProductGroup] = useState("");
  const [quantityRange, setQuantityRange] = useState("");

  const productOptions = FAIR_PRODUCT_GROUPS.map((value) => ({
    value,
    label: fairMessages.productGroups[value],
  }));

  const errorText = (code: string) => {
    const parsed = parseErrorCode(code);
    const template =
      formMessages.errors[parsed.code as keyof Messages["form"]["errors"]] ??
      formMessages.errors.required;
    return interpolate(template, parsed.params);
  };

  const readForm = (form: HTMLFormElement): FairVisitorFormInput => {
    const data = new FormData(form);
    const value = (name: string) => String(data.get(name) ?? "");
    return {
      fullName: value("fullName"),
      company: value("company"),
      jobTitle: value("jobTitle"),
      country: value("country"),
      email: value("email"),
      phone: value("phone"),
      productGroup: (value("productGroup") || productGroup) as FairVisitorFormInput["productGroup"],
      quantityRange: value("quantityRange") || quantityRange,
      desiredDate: value("desiredDate") || undefined,
      notes: value("notes") || undefined,
      privacyConsent: (consent || data.get("privacyConsent") === "on") as true,
    };
  };

  const validate = (form: HTMLFormElement) => {
    const result = fairVisitorFormSchema.safeParse(readForm(form));
    const next: Errors = {};
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0] as FairVisitorField;
        next[field] ??= issue.message;
      }
    }
    return { ok: result.success, errors: next };
  };

  const resetForAnother = () => {
    setSubmitted(false);
    setErrors({});
    setServerError(null);
    setConsent(false);
    setProductGroup("");
    setQuantityRange("");
    formRef.current?.reset();
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const { ok, errors: nextErrors } = validate(form);
    setErrors(nextErrors);
    setServerError(null);
    if (!ok) {
      setSubmitted(false);
      const first = FIELD_ORDER.find((f) => nextErrors[f]);
      requestAnimationFrame(() => {
        summaryRef.current?.focus();
        if (first)
          form.querySelector<HTMLElement>(`[name="${first}"]`)?.scrollIntoView({
            block: "center",
          });
      });
      return;
    }

    setPending(true);
    try {
      const payload = { ...readForm(form), locale, source, website: "", turnstileToken: "" };
      const res = await fetch("/api/fair-visitors", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setServerError(fairMessages.submitFailed);
        return;
      }
      setSubmitted(true);
      setConsent(false);
      setProductGroup("");
      setQuantityRange("");
      form.reset();
      requestAnimationFrame(() => noticeRef.current?.focus());
    } catch {
      setServerError(fairMessages.submitFailed);
    } finally {
      setPending(false);
    }
  };

  const onBlurField = (event: React.FocusEvent<HTMLFormElement>) => {
    const target: EventTarget = event.target;
    if (
      !(
        target instanceof HTMLInputElement ||
        target instanceof HTMLSelectElement ||
        target instanceof HTMLTextAreaElement
      )
    ) {
      return;
    }
    const name = target.name as FairVisitorField;
    if (!name || !(name in errors)) return;
    const { errors: nextErrors } = validate(event.currentTarget);
    setErrors((prev) => ({ ...prev, [name]: nextErrors[name] }));
  };

  const errorCount = Object.values(errors).filter(Boolean).length;
  const fieldProps = (name: FairVisitorField) => ({
    id: `${formId}-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${formId}-${name}-error` : undefined,
  });

  const [consentBefore, consentAfter] = formMessages.fields.privacyConsent.split("{link}");

  if (submitted) {
    return (
      <div
        ref={noticeRef}
        tabIndex={-1}
        role="status"
        data-testid="fair-visitor-success"
        className="space-y-5 rounded-[1.25rem] border border-gold-500/40 bg-gold-200/30 p-5 sm:space-y-6 sm:rounded-[1.75rem] sm:p-10"
      >
        <div className="flex gap-3 text-navy-900">
          <CheckCircle2 aria-hidden className="mt-0.5 size-7 shrink-0 text-gold-700 sm:size-6" />
          <div>
            <p className="font-heading text-xl font-medium sm:text-2xl">{fairMessages.successTitle}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-600 sm:text-base">
              {fairMessages.successText}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={resetForAnother}
          className={cn(ctaVariants({ variant: "primary", size: "lg" }), "h-14 w-full rounded-2xl")}
        >
          {fairMessages.another}
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      onBlur={onBlurField}
      className="relative space-y-5 pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:space-y-6 sm:pb-0"
      aria-describedby={`${formId}-hint`}
    >
      <p id={`${formId}-hint`} className="text-sm text-ink-600">
        <span aria-hidden className="text-destructive">
          *
        </span>{" "}
        {formMessages.required}
      </p>

      {errorCount > 0 ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="flex gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
        >
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          <p>{interpolate(formMessages.errors.summary, { count: String(errorCount) })}</p>
        </div>
      ) : null}

      {serverError ? (
        <div
          role="alert"
          className="flex gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
        >
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          <p>{serverError}</p>
        </div>
      ) : null}

      <div aria-hidden className="absolute top-auto -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${formId}-website`}>Website</label>
        <input
          id={`${formId}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        <Field
          label={fairMessages.fields.fullName}
          required
          htmlFor={`${formId}-fullName`}
          error={errors.fullName && errorText(errors.fullName)}
          errorId={`${formId}-fullName-error`}
        >
          <input
            {...fieldProps("fullName")}
            type="text"
            autoComplete="name"
            autoCapitalize="words"
            enterKeyHint="next"
            required
            className={inputClass}
          />
        </Field>
        <Field
          label={fairMessages.fields.company}
          required
          htmlFor={`${formId}-company`}
          error={errors.company && errorText(errors.company)}
          errorId={`${formId}-company-error`}
        >
          <input
            {...fieldProps("company")}
            type="text"
            autoComplete="organization"
            autoCapitalize="words"
            enterKeyHint="next"
            required
            className={inputClass}
          />
        </Field>
        <Field
          label={fairMessages.fields.jobTitle}
          htmlFor={`${formId}-jobTitle`}
          error={errors.jobTitle && errorText(errors.jobTitle)}
          errorId={`${formId}-jobTitle-error`}
          className="sm:col-span-2"
        >
          <input
            {...fieldProps("jobTitle")}
            type="text"
            autoComplete="organization-title"
            autoCapitalize="words"
            enterKeyHint="next"
            className={inputClass}
          />
        </Field>
        <Field
          label={fairMessages.fields.country}
          htmlFor={`${formId}-country`}
          error={errors.country && errorText(errors.country)}
          errorId={`${formId}-country-error`}
        >
          <Select
            {...fieldProps("country")}
            placeholder={formMessages.selectPlaceholder}
            options={options.countries}
            autoComplete="country"
          />
        </Field>
        <Field
          label={fairMessages.fields.email}
          htmlFor={`${formId}-email`}
          error={errors.email && errorText(errors.email)}
          errorId={`${formId}-email-error`}
        >
          <input
            {...fieldProps("email")}
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            enterKeyHint="next"
            className={inputClass}
          />
        </Field>
        <Field
          label={fairMessages.fields.phone}
          htmlFor={`${formId}-phone`}
          error={errors.phone && errorText(errors.phone)}
          errorId={`${formId}-phone-error`}
          className="sm:col-span-2"
        >
          <input
            {...fieldProps("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            enterKeyHint="next"
            className={inputClass}
          />
        </Field>

        <Field
          label={fairMessages.fields.productGroup}
          required
          htmlFor={`${formId}-productGroup`}
          error={errors.productGroup && errorText(errors.productGroup)}
          errorId={`${formId}-productGroup-error`}
          className="sm:col-span-2"
        >
          <ChipGroup
            name="productGroup"
            value={productGroup}
            options={productOptions}
            required
            invalid={Boolean(errors.productGroup)}
            onChange={(value) => {
              setProductGroup(value);
              setErrors((prev) => ({ ...prev, productGroup: undefined }));
            }}
          />
        </Field>

        <Field
          label={fairMessages.fields.quantityRange}
          htmlFor={`${formId}-quantityRange`}
          error={errors.quantityRange && errorText(errors.quantityRange)}
          errorId={`${formId}-quantityRange-error`}
          className="sm:col-span-2"
        >
          <ChipGroup
            name="quantityRange"
            value={quantityRange}
            options={options.quantities}
            invalid={Boolean(errors.quantityRange)}
            onChange={(value) => {
              setQuantityRange(value);
              setErrors((prev) => ({ ...prev, quantityRange: undefined }));
            }}
          />
        </Field>

        <Field
          label={fairMessages.fields.desiredDate}
          htmlFor={`${formId}-desiredDate`}
          error={errors.desiredDate && errorText(errors.desiredDate)}
          errorId={`${formId}-desiredDate-error`}
          className="sm:col-span-2"
        >
          <input
            {...fieldProps("desiredDate")}
            type="date"
            min={localTodayISO()}
            className={cn(inputClass, "min-h-14 appearance-none sm:min-h-12")}
          />
        </Field>
        <Field
          label={fairMessages.fields.notes}
          htmlFor={`${formId}-notes`}
          error={errors.notes && errorText(errors.notes)}
          errorId={`${formId}-notes-error`}
          className="sm:col-span-2"
        >
          <textarea
            {...fieldProps("notes")}
            rows={4}
            enterKeyHint="done"
            className={cn(inputClass, "h-auto min-h-28 py-3.5 sm:min-h-32")}
          />
        </Field>
      </div>

      <div className="rounded-2xl border border-cream-300 bg-white/70 p-4 sm:border-0 sm:bg-transparent sm:p-0">
        <div className="flex items-start gap-3">
          <input
            {...fieldProps("privacyConsent")}
            type="checkbox"
            required
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            className="mt-0.5 size-6 shrink-0 rounded-md accent-navy-800 sm:mt-1 sm:size-5"
          />
          <label
            htmlFor={`${formId}-privacyConsent`}
            className="text-[0.95rem] leading-relaxed text-ink-600 sm:text-sm"
          >
            {consentBefore}
            <button
              type="button"
              className="font-semibold text-navy-800 underline underline-offset-4"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setDisclosureOpen(true);
              }}
            >
              {formMessages.fields.privacyConsentLink}
            </button>
            {consentAfter}{" "}
            <span aria-hidden className="text-destructive">
              *
            </span>
          </label>
        </div>
        {errors.privacyConsent ? (
          <p
            id={`${formId}-privacyConsent-error`}
            className="mt-2 text-sm font-medium text-destructive"
          >
            {errorText(errors.privacyConsent)}
          </p>
        ) : null}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-cream-300/80 bg-cream-50/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:static sm:z-auto sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <button
          type="submit"
          disabled={pending || !consent}
          className={cn(
            ctaVariants({ variant: "primary", size: "lg" }),
            "h-14 w-full rounded-2xl text-base sm:w-auto sm:rounded-full",
          )}
        >
          {pending ? "…" : submitLabel}
        </button>
      </div>

      <Dialog open={disclosureOpen} onOpenChange={setDisclosureOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{disclosure.title}</DialogTitle>
          </DialogHeader>
          <DialogBody className="space-y-6 text-sm leading-relaxed text-ink-600">
            {disclosure.intro ? <p>{disclosure.intro}</p> : null}
            {disclosure.sections.map((section) => (
              <section key={section.heading}>
                <h3 className="font-heading text-base font-medium text-navy-900">
                  {section.heading}
                </h3>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-2">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </DialogBody>
          <DialogFooter className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href={privacyHref}
              className="text-sm font-semibold text-navy-800 underline underline-offset-2"
              target="_blank"
              rel="noreferrer"
            >
              {disclosureOpenFull}
            </Link>
            <DialogClose
              render={
                <button
                  type="button"
                  className={cn(ctaVariants({ variant: "primary", size: "md" }), "h-12 w-full sm:w-auto")}
                />
              }
            >
              {disclosureClose}
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  required,
  error,
  errorId,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  errorId: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-navy-900">
        {label}
        {required ? (
          <span aria-hidden className="ml-0.5 text-destructive">
            *
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p id={errorId} className="mt-2 text-sm font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ChipGroup({
  name,
  value,
  options,
  required,
  invalid,
  onChange,
}: {
  name: string;
  value: string;
  options: Option[];
  required?: boolean;
  invalid?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <input type="hidden" name={name} value={value} required={required} aria-invalid={invalid} />
      <div
        role="radiogroup"
        aria-required={required || undefined}
        aria-invalid={invalid || undefined}
        className="grid grid-cols-2 gap-2 sm:grid-cols-3"
      >
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.value === value ? "" : option.value)}
              className={cn(
                "min-h-12 rounded-2xl border px-3 py-3 text-sm font-semibold transition-colors active:scale-[0.98]",
                selected
                  ? "border-navy-800 bg-navy-800 text-cream-50"
                  : "border-cream-300 bg-white text-navy-900 hover:border-navy-800/30",
                invalid && !selected && "border-destructive/50",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Select({
  options,
  placeholder,
  ...props
}: React.ComponentProps<"select"> & { options: Option[]; placeholder: string }) {
  return (
    <select
      {...props}
      defaultValue=""
      className={cn(
        inputClass,
        "appearance-none bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-10",
      )}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2317264a' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
