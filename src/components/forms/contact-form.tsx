"use client";

import { CheckCircle2, CircleAlert } from "lucide-react";
import Link from "next/link";
import { useId, useRef, useState, type ReactNode } from "react";
import type { Messages } from "@/i18n/messages";
import { track } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";
import {
  contactFormSchema,
  parseErrorCode,
  type ContactField,
  type ContactFormInput,
} from "@/lib/validation/contact";
import { ctaVariants } from "../site/button-link";

type Option = { value: string; label: string };
type Errors = Partial<Record<ContactField, string>>;

const FIELD_ORDER: ContactField[] = [
  "fullName",
  "company",
  "email",
  "phone",
  "country",
  "productInterest",
  "quantityRange",
  "message",
  "privacyConsent",
];

function interpolate(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (m, key: string) => values[key] ?? m);
}

const inputClass =
  "block h-12 w-full rounded-xl border border-input bg-cream-50 px-4 text-base text-navy-900 transition-colors placeholder:text-ink-500 focus-visible:border-navy-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-navy-700 aria-invalid:border-destructive";

export function ContactForm({
  locale,
  messages,
  options,
  privacyHref,
  submitLabel,
}: {
  locale: "tr" | "en";
  messages: Messages["form"];
  options: { countries: Option[]; products: Option[]; quantities: Option[] };
  privacyHref: string;
  submitLabel: string;
}) {
  const formId = useId();
  const summaryRef = useRef<HTMLDivElement>(null);
  const noticeRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const errorText = (code: string) => {
    const parsed = parseErrorCode(code);
    const template =
      messages.errors[parsed.code as keyof Messages["form"]["errors"]] ?? messages.errors.required;
    return interpolate(template, parsed.params);
  };

  const readForm = (form: HTMLFormElement): ContactFormInput => {
    const data = new FormData(form);
    const value = (name: string) => String(data.get(name) ?? "");
    return {
      fullName: value("fullName"),
      company: value("company"),
      email: value("email"),
      phone: value("phone"),
      country: value("country"),
      productInterest: value("productInterest"),
      quantityRange: value("quantityRange"),
      message: value("message"),
      privacyConsent: (data.get("privacyConsent") === "on") as true,
    };
  };

  const validate = (form: HTMLFormElement) => {
    const result = contactFormSchema.safeParse(readForm(form));
    const next: Errors = {};
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0] as ContactField;
        next[field] ??= issue.message;
      }
    }
    return { ok: result.success, errors: next };
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
      const payload = { ...readForm(form), locale, website: "", turnstileToken: "" };
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setServerError(messages.errors.submitFailed);
        return;
      }
      setSubmitted(true);
      form.reset();
      track("contact_submit");
      requestAnimationFrame(() => noticeRef.current?.focus());
    } catch {
      setServerError(messages.errors.submitFailed);
    } finally {
      setPending(false);
    }
  };

  const onBlurField = (event: React.FocusEvent<HTMLFormElement>) => {
    const target: EventTarget = event.target;
    if (!(
      target instanceof HTMLInputElement ||
      target instanceof HTMLSelectElement ||
      target instanceof HTMLTextAreaElement
    )) {
      return;
    }
    const name = target.name as ContactField;
    if (!name || !(name in errors)) return;
    const { errors: nextErrors } = validate(event.currentTarget);
    setErrors((prev) => ({ ...prev, [name]: nextErrors[name] }));
  };

  const errorCount = Object.values(errors).filter(Boolean).length;
  const fieldProps = (name: ContactField) => ({
    id: `${formId}-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${formId}-${name}-error` : undefined,
  });

  const [consentBefore, consentAfter] = messages.fields.privacyConsent.split("{link}");

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      onBlur={onBlurField}
      className="relative space-y-6"
      aria-describedby={`${formId}-hint`}
    >
      <p id={`${formId}-hint`} className="text-sm text-ink-600">
        <span aria-hidden className="text-destructive">
          *
        </span>{" "}
        {messages.required}
      </p>

      {errorCount > 0 ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="flex gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
        >
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          <p>{interpolate(messages.errors.summary, { count: String(errorCount) })}</p>
        </div>
      ) : null}

      {serverError ? (
        <div
          role="alert"
          className="flex gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
        >
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          <p>{serverError}</p>
        </div>
      ) : null}

      {submitted ? (
        <div
          ref={noticeRef}
          tabIndex={-1}
          role="status"
          data-testid="contact-success"
          className="flex gap-3 rounded-xl border border-gold-500/40 bg-gold-200/40 p-4 text-sm text-navy-900"
        >
          <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0 text-gold-700" />
          <div>
            <p className="font-semibold">{messages.successTitle}</p>
            <p className="mt-1 text-ink-600">{messages.successText}</p>
          </div>
        </div>
      ) : null}

      {/* Honeypot */}
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

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label={messages.fields.fullName}
          required
          htmlFor={`${formId}-fullName`}
          error={errors.fullName && errorText(errors.fullName)}
          errorId={`${formId}-fullName-error`}
        >
          <input
            {...fieldProps("fullName")}
            type="text"
            autoComplete="name"
            required
            className={inputClass}
          />
        </Field>
        <Field
          label={messages.fields.company}
          htmlFor={`${formId}-company`}
          error={errors.company && errorText(errors.company)}
          errorId={`${formId}-company-error`}
        >
          <input
            {...fieldProps("company")}
            type="text"
            autoComplete="organization"
            className={inputClass}
          />
        </Field>
        <Field
          label={messages.fields.email}
          required
          htmlFor={`${formId}-email`}
          error={errors.email && errorText(errors.email)}
          errorId={`${formId}-email-error`}
        >
          <input
            {...fieldProps("email")}
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            className={inputClass}
          />
        </Field>
        <Field
          label={messages.fields.phone}
          htmlFor={`${formId}-phone`}
          error={errors.phone && errorText(errors.phone)}
          errorId={`${formId}-phone-error`}
        >
          <input
            {...fieldProps("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className={inputClass}
          />
        </Field>
        <Field
          label={messages.fields.country}
          htmlFor={`${formId}-country`}
          error={errors.country && errorText(errors.country)}
          errorId={`${formId}-country-error`}
        >
          <Select
            {...fieldProps("country")}
            placeholder={messages.selectPlaceholder}
            options={options.countries}
            autoComplete="country"
          />
        </Field>
        <Field
          label={messages.fields.productInterest}
          htmlFor={`${formId}-productInterest`}
          error={errors.productInterest && errorText(errors.productInterest)}
          errorId={`${formId}-productInterest-error`}
        >
          <Select
            {...fieldProps("productInterest")}
            placeholder={messages.selectPlaceholder}
            options={options.products}
          />
        </Field>
        <Field
          label={messages.fields.quantityRange}
          htmlFor={`${formId}-quantityRange`}
          error={errors.quantityRange && errorText(errors.quantityRange)}
          errorId={`${formId}-quantityRange-error`}
          className="sm:col-span-2"
        >
          <Select
            {...fieldProps("quantityRange")}
            placeholder={messages.selectPlaceholder}
            options={options.quantities}
          />
        </Field>
        <Field
          label={messages.fields.message}
          required
          htmlFor={`${formId}-message`}
          error={errors.message && errorText(errors.message)}
          errorId={`${formId}-message-error`}
          className="sm:col-span-2"
        >
          <textarea
            {...fieldProps("message")}
            rows={6}
            required
            className={cn(inputClass, "h-auto min-h-36 py-3")}
          />
        </Field>
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input
            {...fieldProps("privacyConsent")}
            type="checkbox"
            required
            className="mt-1 size-5 shrink-0 rounded accent-navy-800"
          />
          <label
            htmlFor={`${formId}-privacyConsent`}
            className="text-sm leading-relaxed text-ink-600"
          >
            {consentBefore}
            <Link
              href={privacyHref}
              className="font-semibold text-navy-800 underline underline-offset-4"
            >
              {messages.fields.privacyConsentLink}
            </Link>
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

      <button
        type="submit"
        disabled={pending}
        className={cn(ctaVariants({ variant: "primary", size: "lg" }), "w-full sm:w-auto")}
      >
        {pending ? "…" : submitLabel}
      </button>
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
