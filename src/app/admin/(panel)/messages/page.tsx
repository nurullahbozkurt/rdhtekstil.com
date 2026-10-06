import Link from "next/link";
import { MessagesList } from "@/components/admin/messages-list";
import { listContactMessages, type ContactStatus } from "@/lib/admin/contacts";

export const metadata = { title: "İletişim mesajları" };

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const status = (typeof sp.status === "string" ? sp.status : "") as ContactStatus | "";
  const page = Number(typeof sp.page === "string" ? sp.page : "1") || 1;
  const { items, total, pageSize } = await listContactMessages({ q, status, page });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const queryParams = { q, status };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight text-navy-900 sm:text-3xl">
          İletişim mesajları
        </h1>
        <p className="mt-1 text-sm text-ink-600">{total} kayıt</p>
      </div>

      <form className="grid gap-3 rounded-2xl border border-cream-300 bg-cream-50 p-3 sm:p-4 md:grid-cols-5">
        <input
          name="q"
          defaultValue={q}
          placeholder="Ad, firma, e-posta…"
          className="h-11 rounded-xl border border-cream-300 bg-white px-3 text-base md:col-span-2"
        />
        <select
          name="status"
          defaultValue={status}
          className="h-11 rounded-xl border border-cream-300 bg-white px-3 text-base"
        >
          <option value="">Tüm durumlar</option>
          <option value="NEW">Yeni</option>
          <option value="READ">Okundu</option>
          <option value="ARCHIVED">Arşiv</option>
        </select>
        <div className="grid grid-cols-2 gap-2 md:col-span-2">
          <button
            type="submit"
            className="h-11 rounded-xl bg-navy-800 px-4 font-semibold text-cream-50"
          >
            Filtrele
          </button>
          <Link
            href="/admin/messages"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-cream-300 bg-white px-4 font-semibold text-navy-900 hover:bg-cream-50"
          >
            Temizle
          </Link>
        </div>
      </form>

      <MessagesList items={items} />

      {totalPages > 1 ? (
        <div className="flex items-center justify-between gap-3 text-sm">
          {page > 1 ? (
            <Link
              href={`/admin/messages?${new URLSearchParams({ ...queryParams, page: String(page - 1) })}`}
              className="rounded-lg border border-cream-300 px-3 py-2 font-semibold"
            >
              Önceki
            </Link>
          ) : (
            <span />
          )}
          <span className="text-ink-600">
            Sayfa {page} / {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={`/admin/messages?${new URLSearchParams({ ...queryParams, page: String(page + 1) })}`}
              className="rounded-lg border border-cream-300 px-3 py-2 font-semibold"
            >
              Sonraki
            </Link>
          ) : (
            <span />
          )}
        </div>
      ) : null}
    </div>
  );
}
