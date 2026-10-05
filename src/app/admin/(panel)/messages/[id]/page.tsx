import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactActions } from "@/components/admin/contact-actions";
import { getContactMessage, markContactRead } from "@/lib/admin/contacts";

export const metadata = { title: "Mesaj detayı" };

export default async function AdminMessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const message = await getContactMessage(id);
  if (!message) notFound();
  await markContactRead(id);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/messages" className="text-sm font-semibold text-ink-600">
          ← Mesajlar
        </Link>
        <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight">{message.full_name}</h1>
        <p className="mt-1 text-ink-600">
          {new Intl.DateTimeFormat("tr-TR", { dateStyle: "long", timeStyle: "short" }).format(
            new Date(message.created_at),
          )}
        </p>
      </div>

      <dl className="grid gap-4 rounded-2xl border border-cream-300 bg-white p-5 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-ink-500">E-posta</dt>
          <dd>
            <a className="font-medium underline" href={`mailto:${message.email}`}>
              {message.email}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-ink-500">Telefon</dt>
          <dd className="font-medium">{message.phone || "—"}</dd>
        </div>
        <div>
          <dt className="text-ink-500">Firma</dt>
          <dd className="font-medium">{message.company || "—"}</dd>
        </div>
        <div>
          <dt className="text-ink-500">Ülke / Dil</dt>
          <dd className="font-medium">
            {message.country || "—"} · {message.locale.toUpperCase()}
          </dd>
        </div>
        <div>
          <dt className="text-ink-500">Ürün / Adet</dt>
          <dd className="font-medium">
            {message.product_interest || "—"} · {message.quantity_range || "—"}
          </dd>
        </div>
        <div>
          <dt className="text-ink-500">KVKK</dt>
          <dd className="font-medium">
            {message.privacy_consent_version} ·{" "}
            {new Intl.DateTimeFormat("tr-TR", { dateStyle: "short", timeStyle: "short" }).format(
              new Date(message.privacy_consent_at),
            )}
          </dd>
        </div>
      </dl>

      <section className="rounded-2xl border border-cream-300 bg-white p-5">
        <h2 className="font-heading text-xl font-medium">Mesaj</h2>
        <p className="mt-3 whitespace-pre-wrap leading-relaxed text-navy-900">{message.message}</p>
      </section>

      <ContactActions id={message.id} status={message.status} />
    </div>
  );
}
