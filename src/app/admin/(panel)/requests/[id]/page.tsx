import Link from "next/link";
import { notFound } from "next/navigation";
import { FilePreviewList } from "@/components/admin/file-preview-list";
import { RequestActions } from "@/components/admin/request-actions";
import {
  getRequest,
  listRequestsByEmail,
  markRequestRead,
} from "@/lib/admin/requests";

export const metadata = { title: "Talep detayı" };

const STATUS_LABEL = {
  NEW: "Yeni",
  IN_REVIEW: "İnceleniyor",
  REPLIED: "Yanıtlandı",
} as const;

const PRODUCT_LABEL = {
  BEANIE: "Bere",
  SCARF: "Atkı",
  SET: "Set",
} as const;

function waLink(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "").replace(/^\+/, "");
  return `https://wa.me/${digits}`;
}

function ColorSwatch({ value, label }: { value: string; label: string }) {
  const hex = value.startsWith("#") ? value : undefined;
  return (
    <div className="flex items-center gap-3 rounded-xl border border-cream-300 bg-white px-3 py-2">
      <span
        className="size-8 rounded-lg border border-cream-300"
        style={{ backgroundColor: hex ?? "#ddd" }}
        aria-hidden
      />
      <div>
        <p className="text-xs text-ink-500">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

export default async function AdminRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const request = await getRequest(id);
  if (!request) notFound();
  await markRequestRead(id);
  const previous = await listRequestsByEmail(request.email, request.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin/requests" className="text-sm font-semibold text-ink-600 hover:text-navy-900">
            ← Talepler
          </Link>
          <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight text-navy-900">
            {request.number}
          </h1>
          <p className="mt-1 text-ink-600">
            {STATUS_LABEL[request.status]} ·{" "}
            {new Intl.DateTimeFormat("tr-TR", { dateStyle: "long", timeStyle: "short" }).format(
              new Date(request.created_at),
            )}
          </p>
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-cream-300 bg-white p-5">
          <h2 className="font-heading text-xl font-medium">Müşteri</h2>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-ink-500">Ad Soyad</dt>
              <dd className="font-medium">{request.full_name}</dd>
            </div>
            <div>
              <dt className="text-ink-500">Firma</dt>
              <dd className="font-medium">{request.company}</dd>
            </div>
            <div>
              <dt className="text-ink-500">E-posta</dt>
              <dd>
                <a className="font-medium underline" href={`mailto:${request.email}`}>
                  {request.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-ink-500">Telefon / WhatsApp</dt>
              <dd className="flex flex-wrap gap-3">
                <a className="font-medium underline" href={`tel:${request.phone}`}>
                  {request.phone}
                </a>
                <a className="font-medium underline" href={waLink(request.phone)} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-ink-500">Ülke / Dil</dt>
              <dd className="font-medium">
                {request.country} · {request.locale.toUpperCase()}
              </dd>
            </div>
          </dl>
        </div>

        <div className="space-y-3 rounded-2xl border border-cream-300 bg-white p-5">
          <h2 className="font-heading text-xl font-medium">Talep detayı</h2>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-ink-500">Ürün tipi</dt>
              <dd className="font-medium">{PRODUCT_LABEL[request.product_type]}</dd>
            </div>
            <div>
              <dt className="text-ink-500">Model / ürün</dt>
              <dd className="font-medium">{request.model_slug || request.product_slug || "—"}</dd>
            </div>
            <div>
              <dt className="text-ink-500">Kullanım alanı</dt>
              <dd className="font-medium">{request.industry || "—"}</dd>
            </div>
            <div>
              <dt className="text-ink-500">Adet</dt>
              <dd className="font-medium">{request.quantity_range}</dd>
            </div>
            <div>
              <dt className="text-ink-500">Teslim tarihi</dt>
              <dd className="font-medium">{request.desired_date || "—"}</dd>
            </div>
            <div>
              <dt className="text-ink-500">Slogan</dt>
              <dd className="font-medium">{request.slogan || "—"}</dd>
            </div>
            <div>
              <dt className="text-ink-500">Not</dt>
              <dd className="font-medium whitespace-pre-wrap">{request.note || "—"}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-xl font-medium">Renkler</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <ColorSwatch label="Ana renk" value={request.color1} />
          {request.color2 ? <ColorSwatch label="İkinci renk" value={request.color2} /> : null}
          {request.color3 ? <ColorSwatch label="Üçüncü renk" value={request.color3} /> : null}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-xl font-medium">Dosyalar</h2>
        {request.files.length ? (
          <FilePreviewList requestId={request.id} files={request.files} />
        ) : (
          <p className="text-sm text-ink-600">Dosya yok.</p>
        )}
      </section>

      <section className="rounded-2xl border border-cream-300 bg-white p-5 text-sm">
        <h2 className="font-heading text-xl font-medium">Meta / KVKK</h2>
        <dl className="mt-3 space-y-2">
          <div>
            <dt className="text-ink-500">KVKK onay zamanı</dt>
            <dd className="font-medium">
              {new Intl.DateTimeFormat("tr-TR", { dateStyle: "long", timeStyle: "medium" }).format(
                new Date(request.privacy_consent_at),
              )}
            </dd>
          </div>
          <div>
            <dt className="text-ink-500">Metin sürümü</dt>
            <dd className="font-medium">{request.privacy_consent_version}</dd>
          </div>
          <div>
            <dt className="text-ink-500">Pazarlama izni</dt>
            <dd className="font-medium">{request.marketing_consent ? "Verildi" : "Verilmedi"}</dd>
          </div>
        </dl>
      </section>

      <RequestActions
        id={request.id}
        status={request.status}
        internalNote={request.internal_note ?? ""}
      />

      {previous.length ? (
        <section className="rounded-2xl border border-cream-300 bg-white p-5">
          <h2 className="font-heading text-xl font-medium">Aynı e-postadan önceki talepler</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {previous.map((item) => (
              <li key={item.id}>
                <Link href={`/admin/requests/${item.id}`} className="font-semibold underline">
                  {item.number}
                </Link>{" "}
                <span className="text-ink-600">
                  · {STATUS_LABEL[item.status as keyof typeof STATUS_LABEL]} ·{" "}
                  {new Intl.DateTimeFormat("tr-TR", { dateStyle: "short" }).format(
                    new Date(item.created_at),
                  )}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
