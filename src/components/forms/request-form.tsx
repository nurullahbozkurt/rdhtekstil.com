"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useMemo, useState, useSyncExternalStore } from "react";
import type { Messages } from "@/i18n/messages";
import { track } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";
import { requestFormSchema, type RequestFormData } from "@/lib/validation/request";
import { ctaVariants } from "../site/button-link";
import type { UploadedFileMeta } from "./request-file-upload";

const RequestFileUpload = dynamic(
  () => import("./request-file-upload").then((m) => m.RequestFileUpload),
  { ssr: false },
);

type Option = { value: string; label: string };
type ProductOption = { id: string; name: string; categoryId: string };

type Draft = {
  productType?: "BEANIE" | "SCARF" | "SET";
  productSlug?: string;
  modelSlug?: string;
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

const STORAGE_KEY = "rdh-request-draft";

const STEPS = [
  "productType",
  "model",
  "colors",
  "logo",
  "slogan",
  "references",
  "quantity",
  "date",
  "note",
  "contact",
] as const;

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

export function RequestForm({
  locale,
  messages,
  formMessages,
  privacyHref,
  completeHref,
  products,
  quantities,
  countries,
  submitLabel,
}: {
  locale: "tr" | "en";
  messages: Messages["request"];
  formMessages: Messages["form"];
  privacyHref: string;
  completeHref: string;
  products: ProductOption[];
  quantities: Option[];
  countries: Option[];
  submitLabel: string;
}) {
  const id = useId();
  const router = useRouter();
  const search = useSearchParams();
  const urun = search.get("urun") ?? undefined;
  const alan = search.get("alan") ?? undefined;
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
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [filesWarned, setFilesWarned] = useState(false);
  const [initKey, setInitKey] = useState("");

  const nextInitKey = hydrated ? `${urun ?? ""}:${alan ?? ""}` : "";
  if (hydrated && initKey !== nextInitKey) {
    const stored = loadDraft();
    const product = urun ? products.find((p) => p.id === urun) : undefined;
    setInitKey(nextInitKey);
    setDraft({
      ...stored,
      productSlug: urun ?? stored.productSlug,
      industry: alan ?? stored.industry,
      productType: product ? categoryToType(product.categoryId) : stored.productType,
      modelSlug: product ? product.id : stored.modelSlug,
    });
    setFilesWarned(Boolean(Object.keys(stored).length));
  }

  useEffect(() => {
    if (!hydrated || !initKey) return;
    saveDraft(draft);
  }, [draft, hydrated, initKey]);

  const models = useMemo(() => {
    if (!draft.productType) return products;
    const cat =
      draft.productType === "SCARF" ? "scarves" : draft.productType === "SET" ? "sets" : "beanies";
    return products.filter((p) => p.categoryId === cat);
  }, [draft.productType, products]);

  const patch = (partial: Draft) => setDraft((d) => ({ ...d, ...partial }));

  const validateStep = (): boolean => {
    setError(null);
    switch (STEPS[step]) {
      case "productType":
        if (!draft.productType) {
          setError(formMessages.errors.required);
          return false;
        }
        return true;
      case "colors":
        if (!draft.color1?.trim()) {
          setError(formMessages.errors.required);
          return false;
        }
        return true;
      case "quantity":
        if (!draft.quantityRange) {
          setError(formMessages.errors.selectOption);
          return false;
        }
        return true;
      case "contact": {
        const result = requestFormSchema.safeParse(buildPayload());
        if (!result.success) {
          setError(
            formMessages.errors.summary.replace("{count}", String(result.error.issues.length)),
          );
          return false;
        }
        return true;
      }
      default:
        return true;
    }
  };

  const buildPayload = (): RequestFormData => {
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

    return requestFormSchema.parse({
      locale,
      productType: draft.productType,
      productSlug: draft.productSlug,
      modelSlug: draft.modelSlug === "__none__" ? undefined : draft.modelSlug,
      industry: draft.industry,
      color1: draft.color1 ?? "",
      color2: draft.color2,
      color3: draft.color3,
      slogan: draft.slogan,
      quantityRange: draft.quantityRange ?? "",
      desiredDate: draft.desiredDate,
      note: draft.note,
      fullName: draft.fullName ?? "",
      company: draft.company ?? "",
      email: draft.email ?? "",
      phone: draft.phone ?? "",
      country: draft.country ?? "",
      privacyConsent: draft.privacyConsent === true ? true : undefined,
      marketingConsent: draft.marketingConsent === true,
      files,
      idempotencyKey,
      website: "",
      turnstileToken: "",
    });
  };

  const onNext = () => {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    void onSubmit();
  };

  const onSubmit = async () => {
    setPending(true);
    setError(null);
    try {
      const payload = buildPayload();
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setError(messages.submitFailed);
        return;
      }
      localStorage.removeItem(STORAGE_KEY);
      track("submit_request");
      router.push(completeHref);
    } catch {
      setError(messages.submitFailed);
      // Başarısız denemede aynı idempotency key korunur.
    } finally {
      setPending(false);
    }
  };

  const stepKey = STEPS[step]!;
  const [consentBefore, consentAfter] = formMessages.fields.privacyConsent.split("{link}");

  return (
    <div className="mt-10">
      {filesWarned ? (
        <p className="mb-6 rounded-xl border border-gold-500/40 bg-gold-200/30 px-4 py-3 text-sm text-navy-900">
          {messages.filesPersistWarning}
        </p>
      ) : null}

      <ol className="mb-8 flex gap-1 overflow-x-auto" aria-label={messages.stepsLabel}>
        {STEPS.map((key, index) => (
          <li key={key} className="min-w-8 flex-1">
            <div
              className={cn("h-1.5 rounded-full", index <= step ? "bg-navy-800" : "bg-cream-300")}
            />
          </li>
        ))}
      </ol>

      <div className="space-y-6 rounded-[1.75rem] border border-cream-300 bg-cream-50 p-6 sm:p-8">
        {stepKey === "productType" ? (
          <fieldset>
            <legend className="mb-4 font-heading text-xl font-medium text-navy-900">
              {messages.fields.productType}
            </legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {(["BEANIE", "SCARF", "SET"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  aria-pressed={draft.productType === type}
                  className={cn(
                    "min-h-14 rounded-2xl border px-4 py-3 text-left font-semibold transition-colors",
                    draft.productType === type
                      ? "border-navy-800 bg-navy-800 text-cream-50"
                      : "border-cream-300 bg-cream-100 text-navy-900 hover:border-navy-700/40",
                  )}
                  onClick={() => {
                    patch({ productType: type });
                    track("select_product", { product_type: type });
                  }}
                >
                  {messages.productTypes[type]}
                </button>
              ))}
            </div>
          </fieldset>
        ) : null}

        {stepKey === "model" ? (
          <fieldset>
            <legend className="mb-4 font-heading text-xl font-medium text-navy-900">
              {messages.fields.model}
            </legend>
            <div className="grid gap-2">
              <label className="flex min-h-12 items-center gap-3 rounded-xl border border-cream-300 bg-cream-100 px-4">
                <input
                  type="radio"
                  name="model"
                  checked={!draft.modelSlug || draft.modelSlug === "__none__"}
                  onChange={() => patch({ modelSlug: "__none__" })}
                />
                <span>{messages.undecidedModel}</span>
              </label>
              {models.map((product) => (
                <label
                  key={product.id}
                  className="flex min-h-12 items-center gap-3 rounded-xl border border-cream-300 bg-cream-100 px-4"
                >
                  <input
                    type="radio"
                    name="model"
                    checked={draft.modelSlug === product.id}
                    onChange={() => {
                      patch({ modelSlug: product.id, productSlug: product.id });
                      track("select_model", { model: product.id });
                    }}
                  />
                  <span>{product.name}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}

        {stepKey === "colors" ? (
          <fieldset className="space-y-4">
            <legend className="mb-2 font-heading text-xl font-medium text-navy-900">
              {messages.fields.colors}
            </legend>
            {(
              [
                ["color1", messages.fields.color1, true],
                ["color2", messages.fields.color2, false],
                ["color3", messages.fields.color3, false],
              ] as const
            ).map(([key, label, required]) => (
              <label key={key} className="block space-y-2">
                <span className="text-sm font-semibold text-navy-900">
                  {label}
                  {required ? " *" : ""}
                </span>
                <div className="flex gap-3">
                  <input
                    type="color"
                    aria-label={label}
                    className="h-12 w-14 cursor-pointer rounded-xl border border-cream-300 bg-cream-100"
                    value={
                      draft[key]?.startsWith("#") && draft[key]!.length >= 4
                        ? draft[key]!.slice(0, 7)
                        : "#1a2744"
                    }
                    onChange={(e) => {
                      patch({ [key]: e.target.value });
                      track("select_color");
                    }}
                  />
                  <input
                    type="text"
                    className="h-12 flex-1 rounded-xl border border-cream-300 bg-cream-100 px-4"
                    placeholder="#1A2744 / Pantone"
                    value={draft[key] ?? ""}
                    onChange={(e) => patch({ [key]: e.target.value })}
                  />
                </div>
              </label>
            ))}
          </fieldset>
        ) : null}

        {stepKey === "logo" ? (
          <div>
            <h2 className="mb-4 font-heading text-xl font-medium text-navy-900">
              {messages.fields.logo}
            </h2>
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
        ) : null}

        {stepKey === "slogan" ? (
          <label className="block space-y-2">
            <span className="font-heading text-xl font-medium text-navy-900">
              {messages.fields.slogan}
            </span>
            <input
              type="text"
              maxLength={200}
              className="h-12 w-full rounded-xl border border-cream-300 bg-cream-100 px-4"
              value={draft.slogan ?? ""}
              onChange={(e) => patch({ slogan: e.target.value })}
            />
          </label>
        ) : null}

        {stepKey === "references" ? (
          <div>
            <h2 className="mb-4 font-heading text-xl font-medium text-navy-900">
              {messages.fields.references}
            </h2>
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
        ) : null}

        {stepKey === "quantity" ? (
          <label className="block space-y-2">
            <span className="font-heading text-xl font-medium text-navy-900">
              {messages.fields.quantityRange} *
            </span>
            <select
              className="h-12 w-full rounded-xl border border-cream-300 bg-cream-100 px-4"
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
          </label>
        ) : null}

        {stepKey === "date" ? (
          <label className="block space-y-2">
            <span className="font-heading text-xl font-medium text-navy-900">
              {messages.fields.desiredDate}
            </span>
            <input
              type="date"
              className="h-12 w-full rounded-xl border border-cream-300 bg-cream-100 px-4"
              value={draft.desiredDate ?? ""}
              onChange={(e) => patch({ desiredDate: e.target.value })}
            />
          </label>
        ) : null}

        {stepKey === "note" ? (
          <label className="block space-y-2">
            <span className="font-heading text-xl font-medium text-navy-900">
              {messages.fields.note}
            </span>
            <textarea
              rows={5}
              maxLength={3000}
              className="w-full rounded-xl border border-cream-300 bg-cream-100 px-4 py-3"
              value={draft.note ?? ""}
              onChange={(e) => patch({ note: e.target.value })}
            />
          </label>
        ) : null}

        {stepKey === "contact" ? (
          <div className="space-y-4">
            {(
              [
                ["fullName", messages.fields.fullName, "text"],
                ["company", messages.fields.company, "text"],
                ["email", messages.fields.email, "email"],
                ["phone", messages.fields.phone, "tel"],
              ] as const
            ).map(([key, label, type]) => (
              <label key={key} className="block space-y-2">
                <span className="text-sm font-semibold text-navy-900">{label} *</span>
                <input
                  type={type}
                  required
                  className="h-12 w-full rounded-xl border border-cream-300 bg-cream-100 px-4"
                  value={draft[key] ?? ""}
                  onChange={(e) => patch({ [key]: e.target.value })}
                />
              </label>
            ))}
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-navy-900">
                {messages.fields.country} *
              </span>
              <select
                className="h-12 w-full rounded-xl border border-cream-300 bg-cream-100 px-4"
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
            </label>
            <label className="flex gap-3 text-sm leading-relaxed text-navy-900">
              <input
                type="checkbox"
                className="mt-1 size-4"
                checked={draft.privacyConsent === true}
                onChange={(e) => patch({ privacyConsent: e.target.checked })}
              />
              <span>
                {consentBefore}
                <Link href={privacyHref} className="font-semibold underline underline-offset-2">
                  {formMessages.fields.privacyConsentLink}
                </Link>
                {consentAfter}
              </span>
            </label>
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

        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3 pt-2">
          {step > 0 ? (
            <button
              type="button"
              className={cn(ctaVariants({ variant: "outline", size: "md" }))}
              onClick={() => setStep((s) => s - 1)}
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
              : step === STEPS.length - 1
                ? submitLabel
                : messages.next}
          </button>
        </div>
      </div>
    </div>
  );
}
