"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useMemo, useState, useSyncExternalStore } from "react";
import { CircleAlert } from "lucide-react";
import type { Messages } from "@/i18n/messages";
import { track } from "@/lib/analytics/events";
import { ON_REQUEST_STYLE } from "@/lib/catalog/styles";
import { cn } from "@/lib/utils";
import { parseErrorCode } from "@/lib/validation/contact";
import { requestFormSchema, localTodayISO, type RequestFormData } from "@/lib/validation/request";
import { ShapeOptions, type ShapeOption } from "../catalog/shape-options";
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
import type { UploadedFileMeta } from "./request-file-upload";

const RequestFileUpload = dynamic(
  () => import("./request-file-upload").then((m) => m.RequestFileUpload),
  { ssr: false },
);

type Option = { value: string; label: string };
type ProductOption = {
  id: string;
  name: string;
  categoryId: string;
  typeIds: string[];
};

type Draft = {
  productType?: "BEANIE" | "SCARF" | "SET";
  productSlug?: string;
  styleSlug?: string;
  styleNote?: string;
  industry?: string;
  color1?: string;
  color2?: string;
  color3?: string;
  slogan?: string;
  quantityRange?: string;
  desiredDate?: string;
  note?: string;
  fullName?: string;
  company?: string;
  email?: string;
  phone?: string;
  country?: string;
  privacyConsent?: boolean;
  marketingConsent?: boolean;
};

type FieldName =
  | "productType"
  | "styleSlug"
  | "styleNote"
  | "color1"
  | "quantityRange"
  | "desiredDate"
  | "fullName"
  | "company"
  | "email"
  | "phone"
  | "country"
  | "privacyConsent";

type FieldErrors = Partial<Record<FieldName, string>>;
type DisclosureSection = { heading: string; paragraphs: string[] };

const STORAGE_KEY = "rdh-request-draft";
const ALL_STEPS = ["product", "brand", "project", "contact"] as const;
type StepKey = (typeof ALL_STEPS)[number];

const inputClass =
  "h-12 w-full rounded-xl border border-cream-300 bg-cream-100 px-4 transition-colors focus-visible:border-navy-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-navy-700 aria-invalid:border-destructive aria-invalid:bg-destructive/5";

function categoryToType(categoryId: string): Draft["productType"] {
  if (categoryId === "scarves") return "SCARF";
  if (categoryId === "sets") return "SET";
  return "BEANIE";
}

function loadDraft(): Draft {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Draft;
  } catch {
    return {};
  }
}

function saveDraft(draft: Draft) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

function subscribe() {
  return () => undefined;
}

function interpolate(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (m, key: string) => values[key] ?? m);
}

function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className="mt-2 flex items-start gap-1.5 text-sm font-medium text-destructive"
    >
      <CircleAlert aria-hidden className="mt-0.5 size-3.5 shrink-0" />
      <span>{message}</span>
    </p>
  );
}

export function RequestForm({
  locale,
  messages,
  formMessages,
  privacyHref,
  disclosure,
  completeHref,
  products,
  shapes,
  quantities,
  countries,
  submitLabel,
}: {
  locale: "tr" | "en";
  messages: Messages["request"];
  formMessages: Messages["form"];
  privacyHref: string;
  disclosure: { title: string; sections: DisclosureSection[] };
  completeHref: string;
  products: ProductOption[];
  shapes: Record<"beanies" | "scarves" | "sets", ShapeOption[]>;
  quantities: Option[];
  countries: Option[];
  submitLabel: string;
}) {
  const id = useId();
  const router = useRouter();
  const search = useSearchParams();
  const urun = search.get("urun") ?? undefined;
  const alan = search.get("alan") ?? undefined;
  const kalip = search.get("kalip") ?? undefined;
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>({});
  const [logoFiles, setLogoFiles] = useState<UploadedFileMeta[]>([]);
  const [refFiles, setRefFiles] = useState<UploadedFileMeta[]>([]);
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [filesWarned, setFilesWarned] = useState(false);
  const [initKey, setInitKey] = useState("");
  const [disclosureOpen, setDisclosureOpen] = useState(false);

  const prefilledProduct = urun ? products.find((p) => p.id === urun) : undefined;
  const skipProductStep = Boolean(prefilledProduct);

  const steps = useMemo<StepKey[]>(
    () => (skipProductStep ? ALL_STEPS.filter((s) => s !== "product") : [...ALL_STEPS]),
    [skipProductStep],
  );

  const nextInitKey = hydrated ? `${urun ?? ""}:${alan ?? ""}:${kalip ?? ""}` : "";
  if (hydrated && initKey !== nextInitKey) {
    const stored = loadDraft();
    const product = urun ? products.find((p) => p.id === urun) : undefined;
    setInitKey(nextInitKey);
    setStep(0);

    if (product) {
      const inferredStyle = product.typeIds[0];
      const pastDate =
        stored.desiredDate && stored.desiredDate < localTodayISO()
          ? undefined
          : stored.desiredDate;
      setDraft({
        ...stored,
        productSlug: product.id,
        industry: alan ?? stored.industry,
        productType: categoryToType(product.categoryId),
        styleSlug: kalip ?? inferredStyle ?? stored.styleSlug,
        styleNote:
          kalip === ON_REQUEST_STYLE || inferredStyle === ON_REQUEST_STYLE
            ? stored.styleNote
            : undefined,
        color1: undefined,
        color2: undefined,
        color3: undefined,
        desiredDate: pastDate,
      });
    } else {
      const pastDate =
        stored.desiredDate && stored.desiredDate < localTodayISO()
          ? undefined
          : stored.desiredDate;
      setDraft({
        ...stored,
        productSlug: urun ?? stored.productSlug,
        industry: alan ?? stored.industry,
        styleSlug: kalip ?? stored.styleSlug,
        color1: undefined,
        color2: undefined,
        color3: undefined,
        desiredDate: pastDate,
      });
    }
    setFilesWarned(Boolean(Object.keys(stored).length));
  }

  useEffect(() => {
    if (!hydrated || !initKey) return;
    saveDraft(draft);
  }, [draft, hydrated, initKey]);

  const shapeKey =
    draft.productType === "SCARF" ? "scarves" : draft.productType === "SET" ? "sets" : "beanies";
  const shapeOptions = shapes[shapeKey];
  const showStyleNote = draft.styleSlug === ON_REQUEST_STYLE;

  const patch = (partial: Draft) => {
    setDraft((d) => ({ ...d, ...partial }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(partial) as (keyof Draft)[]) {
        if (key in next) delete next[key as FieldName];
      }
      return next;
    });
    setFormError(null);
  };

  const errorText = (code: string) => {
    const parsed = parseErrorCode(code);
    const template =
      formMessages.errors[parsed.code as keyof Messages["form"]["errors"]] ??
      formMessages.errors.required;
    return interpolate(template, parsed.params);
  };

  const buildPayloadInput = () => {
    const files = [
      ...logoFiles.map((f) => ({ ...f, kind: "LOGO" as const })),
      ...refFiles.map((f) => ({ ...f, kind: "REFERENCE" as const })),
    ].map(({ kind, originalName, storageKey, mimeType, sizeBytes }) => ({
      kind,
      originalName,
      storageKey,
      mimeType,
      sizeBytes,
    }));

    return {
      locale,
      productType: draft.productType,
      productSlug: draft.productSlug,
      styleSlug: draft.styleSlug ?? "",
      styleNote: draft.styleNote,
      industry: draft.industry,
      color1: draft.color1 ?? "",
      color2: draft.color2,
      color3: draft.color3,
      slogan: draft.slogan,
      quantityRange: draft.quantityRange ?? "",
      desiredDate: draft.desiredDate,
      note: draft.note,
      fullName: draft.fullName ?? "",
      company: draft.company,
      email: draft.email ?? "",
      phone: draft.phone ?? "",
      country: draft.country ?? "",
      privacyConsent: draft.privacyConsent === true ? true : undefined,
      marketingConsent: draft.marketingConsent === true,
      files,
      idempotencyKey,
      website: "",
      turnstileToken: "",
    };
  };

  const validateStep = (): boolean => {
    setFormError(null);
    const stepKey = steps[step];
    const next: FieldErrors = {};

    switch (stepKey) {
      case "product": {
        if (!draft.productType) {
          next.productType = formMessages.errors.required;
          break;
        }
        if (!draft.styleSlug || !shapeOptions.some((option) => option.id === draft.styleSlug)) {
          next.styleSlug = formMessages.errors.selectOption;
        }
        if (draft.styleSlug === ON_REQUEST_STYLE) {
          const note = draft.styleNote?.trim() ?? "";
          if (note.length < 10) {
            next.styleNote = note
              ? formMessages.errors.tooShort.replace("{min}", "10")
              : formMessages.errors.required;
          }
        }
        break;
      }
      case "brand":
        if (!draft.color1?.trim()) next.color1 = formMessages.errors.required;
        break;
      case "project":
        if (!draft.quantityRange) next.quantityRange = formMessages.errors.selectOption;
        if (draft.desiredDate && draft.desiredDate < localTodayISO()) {
          next.desiredDate = formMessages.errors.pastDate;
        }
        break;
      case "contact": {
        const result = requestFormSchema.safeParse(buildPayloadInput());
        if (!result.success) {
          for (const issue of result.error.issues) {
            const field = issue.path[0];
            if (typeof field === "string" && !(field in next)) {
              next[field as FieldName] = errorText(issue.message);
            }
          }
        }
        break;
      }
      default:
        break;
    }

    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const goBack = () => {
    setFieldErrors({});
    setFormError(null);
    setStep((s) => s - 1);
  };

  const onNext = () => {
    if (!validateStep()) return;
    setFieldErrors({});
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    void onSubmit();
  };

  const onSubmit = async () => {
    setPending(true);
    setFormError(null);
    try {
      const parsed = requestFormSchema.safeParse(buildPayloadInput());
      if (!parsed.success) {
        const next: FieldErrors = {};
        for (const issue of parsed.error.issues) {
          const field = issue.path[0];
          if (typeof field === "string" && !(field in next)) {
            next[field as FieldName] = errorText(issue.message);
          }
        }
        setFieldErrors(next);
        return;
      }
      const payload: RequestFormData = parsed.data;
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setFormError(messages.submitFailed);
        return;
      }
      localStorage.removeItem(STORAGE_KEY);
      track("submit_request");
      router.push(completeHref);
    } catch {
      setFormError(messages.submitFailed);
    } finally {
      setPending(false);
    }
  };

  const stepKey = steps[step]!;
  const [consentBefore, consentAfter] = formMessages.fields.privacyConsent.split("{link}");

  return (
    <div className="mt-10">
      {filesWarned ? (
        <p className="mb-6 rounded-xl border border-gold-500/40 bg-gold-200/30 px-4 py-3 text-sm text-navy-900">
          {messages.filesPersistWarning}
        </p>
      ) : null}

      <ol className="mb-8 flex gap-1 overflow-x-auto" aria-label={messages.stepsLabel}>
        {steps.map((key, index) => (
          <li key={key} className="min-w-8 flex-1">
            <div
              className={cn("h-1.5 rounded-full", index <= step ? "bg-navy-800" : "bg-cream-300")}
              title={messages.steps[key]}
            />
          </li>
        ))}
      </ol>

      <div className="space-y-6 rounded-[1.75rem] border border-cream-300 bg-cream-50 p-6 sm:p-8">
        <h2 className="font-heading text-xl font-medium text-navy-900">{messages.steps[stepKey]}</h2>

        {stepKey === "product" ? (
          <div className="space-y-8">
            <fieldset>
              <legend className="mb-4 text-sm font-semibold text-navy-900">
                {messages.fields.productType} *
              </legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {(["BEANIE", "SCARF", "SET"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    aria-pressed={draft.productType === type}
                    aria-invalid={fieldErrors.productType ? true : undefined}
                    className={cn(
                      "min-h-14 rounded-2xl border px-4 py-3 text-left font-semibold transition-colors",
                      draft.productType === type
                        ? "border-navy-800 bg-navy-800 text-cream-50"
                        : fieldErrors.productType
                          ? "border-destructive bg-destructive/5 text-navy-900"
                          : "border-cream-300 bg-cream-100 text-navy-900 hover:border-navy-700/40",
                    )}
                    onClick={() => {
                      const nextKey =
                        type === "SCARF" ? "scarves" : type === "SET" ? "sets" : "beanies";
                      const allowed = new Set(shapes[nextKey].map((option) => option.id));
                      patch({
                        productType: type,
                        styleSlug:
                          draft.styleSlug && allowed.has(draft.styleSlug)
                            ? draft.styleSlug
                            : undefined,
                        styleNote:
                          draft.styleSlug && allowed.has(draft.styleSlug)
                            ? draft.styleNote
                            : undefined,
                      });
                      track("select_product", { product_type: type });
                    }}
                  >
                    {messages.productTypes[type]}
                  </button>
                ))}
              </div>
              <FieldError message={fieldErrors.productType} />
            </fieldset>

            {draft.productType ? (
              <fieldset>
                <legend className="mb-2 text-sm font-semibold text-navy-900">
                  {messages.fields.shape} *
                </legend>
                <p className="mb-4 text-sm text-ink-600">{messages.shapeHelp}</p>
                <ShapeOptions
                  name="shape"
                  options={shapeOptions}
                  value={draft.styleSlug}
                  invalid={Boolean(fieldErrors.styleSlug)}
                  onChange={(styleSlug) =>
                    patch({
                      styleSlug,
                      styleNote: styleSlug === ON_REQUEST_STYLE ? draft.styleNote : undefined,
                    })
                  }
                />
                <FieldError message={fieldErrors.styleSlug} />
                {showStyleNote ? (
                  <label className="mt-4 block space-y-2">
                    <span className="text-sm font-semibold text-navy-900">
                      {messages.fields.styleNote} *
                    </span>
                    <p className="text-sm text-ink-600">{messages.styleNoteHelp}</p>
                    <textarea
                      rows={3}
                      maxLength={1000}
                      aria-invalid={fieldErrors.styleNote ? true : undefined}
                      className={cn(
                        "w-full rounded-xl border border-cream-300 bg-cream-100 px-4 py-3 transition-colors aria-invalid:border-destructive aria-invalid:bg-destructive/5",
                      )}
                      placeholder={messages.styleNotePlaceholder}
                      value={draft.styleNote ?? ""}
                      onChange={(e) => patch({ styleNote: e.target.value })}
                    />
                    <FieldError message={fieldErrors.styleNote} />
                  </label>
                ) : null}
              </fieldset>
            ) : null}
          </div>
        ) : null}

        {stepKey === "brand" ? (
          <div className="space-y-8">
            <fieldset className="space-y-4">
              <legend className="mb-2 text-sm font-semibold text-navy-900">
                {messages.fields.colors} *
              </legend>
              {(
                [
                  ["color1", messages.fields.color1, true],
                  ["color2", messages.fields.color2, false],
                  ["color3", messages.fields.color3, false],
                ] as const
              ).map(([key, label, required]) => {
                const hasColor = Boolean(draft[key]?.trim());
                const pickerValue =
                  draft[key]?.startsWith("#") && draft[key]!.length >= 4
                    ? draft[key]!.slice(0, 7)
                    : "#ffffff";
                const showError = key === "color1" ? fieldErrors.color1 : undefined;
                return (
                  <div key={key} className="block space-y-2">
                    <span className="text-sm font-semibold text-navy-900">
                      {label}
                      {required ? " *" : ""}
                    </span>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        aria-label={label}
                        className={cn(
                          "h-12 w-14 cursor-pointer rounded-xl border border-cream-300 bg-cream-100",
                          !hasColor && "opacity-60",
                          showError && "border-destructive",
                        )}
                        value={pickerValue}
                        onChange={(e) => {
                          patch({ [key]: e.target.value });
                          track("select_color");
                        }}
                      />
                      <input
                        type="text"
                        aria-invalid={showError ? true : undefined}
                        className={cn(inputClass, "flex-1")}
                        placeholder="#1A2744 / Pantone"
                        value={draft[key] ?? ""}
                        onChange={(e) => patch({ [key]: e.target.value })}
                      />
                    </div>
                    <FieldError message={showError} />
                  </div>
                );
              })}
            </fieldset>

            <div>
              <h3 className="mb-4 text-sm font-semibold text-navy-900">{messages.fields.logo}</h3>
              <RequestFileUpload
                kind="LOGO"
                files={logoFiles}
                onChange={(files) => {
                  setLogoFiles(files);
                  if (files.length) track("upload_logo");
                }}
                labels={{
                  drop: messages.fileDrop,
                  uploading: messages.fileUploading,
                  remove: messages.fileRemove,
                  retry: messages.fileRetry,
                  help: messages.fileHelp,
                  privacy: messages.filePrivacy,
                }}
              />
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-navy-900">{messages.fields.slogan}</span>
              <input
                type="text"
                maxLength={200}
                className={inputClass}
                value={draft.slogan ?? ""}
                onChange={(e) => patch({ slogan: e.target.value })}
              />
            </label>
          </div>
        ) : null}

        {stepKey === "project" ? (
          <div className="space-y-8">
            <div>
              <h3 className="mb-4 text-sm font-semibold text-navy-900">
                {messages.fields.references}
              </h3>
              <RequestFileUpload
                kind="REFERENCE"
                multiple
                files={refFiles}
                onChange={(files) => {
                  setRefFiles(files);
                  if (files.length) track("upload_reference");
                }}
                labels={{
                  drop: messages.fileDrop,
                  uploading: messages.fileUploading,
                  remove: messages.fileRemove,
                  retry: messages.fileRetry,
                  privacy: messages.filePrivacy,
                }}
              />
            </div>

            <div className="space-y-2">
              <span className="text-sm font-semibold text-navy-900">
                {messages.fields.quantityRange} *
              </span>
              <select
                aria-invalid={fieldErrors.quantityRange ? true : undefined}
                className={inputClass}
                value={draft.quantityRange ?? ""}
                onChange={(e) => patch({ quantityRange: e.target.value })}
              >
                <option value="">{formMessages.selectPlaceholder}</option>
                {quantities.map((q) => (
                  <option key={q.value} value={q.value}>
                    {q.label}
                  </option>
                ))}
              </select>
              <FieldError message={fieldErrors.quantityRange} />
            </div>

            <div className="space-y-2">
              <span className="text-sm font-semibold text-navy-900">
                {messages.fields.desiredDate}
              </span>
              <input
                type="date"
                min={localTodayISO()}
                aria-invalid={fieldErrors.desiredDate ? true : undefined}
                className={inputClass}
                value={draft.desiredDate ?? ""}
                onChange={(e) => patch({ desiredDate: e.target.value })}
              />
              <FieldError message={fieldErrors.desiredDate} />
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-navy-900">{messages.fields.note}</span>
              <textarea
                rows={4}
                maxLength={3000}
                className="w-full rounded-xl border border-cream-300 bg-cream-100 px-4 py-3"
                value={draft.note ?? ""}
                onChange={(e) => patch({ note: e.target.value })}
              />
            </label>
          </div>
        ) : null}

        {stepKey === "contact" ? (
          <div className="space-y-4">
            {(
              [
                ["fullName", messages.fields.fullName, "text", true],
                ["company", messages.fields.company, "text", false],
                ["email", messages.fields.email, "email", true],
                ["phone", messages.fields.phone, "tel", true],
              ] as const
            ).map(([key, label, type, required]) => (
              <div key={key} className="space-y-2">
                <span className="text-sm font-semibold text-navy-900">
                  {label}
                  {required ? " *" : ""}
                </span>
                <input
                  type={type}
                  required={required}
                  aria-invalid={fieldErrors[key] ? true : undefined}
                  className={inputClass}
                  value={draft[key] ?? ""}
                  onChange={(e) => patch({ [key]: e.target.value })}
                />
                <FieldError message={fieldErrors[key]} />
              </div>
            ))}
            <div className="space-y-2">
              <span className="text-sm font-semibold text-navy-900">
                {messages.fields.country} *
              </span>
              <select
                aria-invalid={fieldErrors.country ? true : undefined}
                className={inputClass}
                value={draft.country ?? ""}
                onChange={(e) => patch({ country: e.target.value })}
              >
                <option value="">{formMessages.selectPlaceholder}</option>
                {countries.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <FieldError message={fieldErrors.country} />
            </div>
            <div className="space-y-2">
              <label
                className={cn(
                  "flex gap-3 rounded-xl text-sm leading-relaxed text-navy-900",
                  fieldErrors.privacyConsent && "rounded-xl border border-destructive/30 bg-destructive/5 p-3",
                )}
              >
                <input
                  type="checkbox"
                  className="mt-1 size-4"
                  aria-invalid={fieldErrors.privacyConsent ? true : undefined}
                  checked={draft.privacyConsent === true}
                  onChange={(e) => patch({ privacyConsent: e.target.checked })}
                />
                <span>
                  {consentBefore}
                  <button
                    type="button"
                    className="font-semibold underline underline-offset-2"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDisclosureOpen(true);
                    }}
                  >
                    {formMessages.fields.privacyConsentLink}
                  </button>
                  {consentAfter}
                </span>
              </label>
              <FieldError message={fieldErrors.privacyConsent} />
            </div>
            <label className="flex gap-3 text-sm leading-relaxed text-ink-600">
              <input
                type="checkbox"
                className="mt-1 size-4"
                checked={draft.marketingConsent === true}
                onChange={(e) => patch({ marketingConsent: e.target.checked })}
              />
              <span>{messages.marketingConsent}</span>
            </label>
            <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" />
            </div>
          </div>
        ) : null}

        {formError ? (
          <div
            role="alert"
            className="flex gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
          >
            <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
            <p>{formError}</p>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3 pt-2">
          {step > 0 ? (
            <button
              type="button"
              className={cn(ctaVariants({ variant: "outline", size: "md" }))}
              onClick={goBack}
              disabled={pending}
            >
              {messages.back}
            </button>
          ) : null}
          <button
            type="button"
            className={cn(ctaVariants({ variant: "primary", size: "md" }))}
            onClick={onNext}
            disabled={pending}
          >
            {pending
              ? messages.submitting
              : step === steps.length - 1
                ? submitLabel
                : messages.next}
          </button>
        </div>
      </div>

      <Dialog open={disclosureOpen} onOpenChange={setDisclosureOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{disclosure.title}</DialogTitle>
          </DialogHeader>
          <DialogBody className="space-y-6 text-sm leading-relaxed text-ink-600">
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
              {messages.disclosureOpenFull}
            </Link>
            <DialogClose
              render={
                <button type="button" className={cn(ctaVariants({ variant: "primary", size: "md" }))} />
              }
            >
              {messages.disclosureClose}
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
