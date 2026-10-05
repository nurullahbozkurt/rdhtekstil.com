import Link from "next/link";
import { listContactMessages, type ContactStatus } from "@/lib/admin/contacts";

export const metadata = { title: "İletişim mesajları" };

const STATUS_LABEL: Record<ContactStatus, string> = {
  NEW: "Yeni",
  READ: "Okundu",
  ARCHIVED: "Arşiv",
};

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-medium tracking-tight">İletişim mesajları</h1>
        <p className="mt-1 text-sm text-ink-600">{total} kayıt</p>
      </div>

      <form className="grid gap-3 rounded-2xl border border-cream-300 bg-cream-50 p-4 md:grid-cols-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="Ad, firma, e-posta…"
          className="h-11 rounded-xl border border-cream-300 bg-white px-3 md:col-span-2"
        />
        <select name="status" defaultValue={status} className="h-11 rounded-xl border border-cream-300 bg-white px-3">
          <option value="">Tüm durumlar</option>
          <option value="NEW">Yeni</option>
          <option value="READ">Okundu</option>
          <option value="ARCHIVED">Arşiv</option>
        </select>
        <button type="submit" className="h-11 rounded-xl bg-navy-800 px-4 font-semibold text-cream-50">
          Filtrele
        </button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-cream-300 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-cream-300 bg-cream-50 text-ink-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Tarih</th>
              <th className="px-4 py-3 font-semibold">Gönderen</th>
              <th className="px-4 py-3 font-semibold">Ürün</th>
              <th className="px-4 py-3 font-semibold">Durum</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className={`border-b border-cream-200 last:border-0 ${item.status === "NEW" ? "bg-gold-200/20" : ""}`}
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <Link href={`/admin/messages/${item.id}`} className="font-semibold underline-offset-2 hover:underline">
                    {new Intl.DateTimeFormat("tr-TR", { dateStyle: "short", timeStyle: "short" }).format(
                      new Date(item.created_at),
                    )}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{item.full_name}</div>
                  <div className="text-ink-600">{item.email}</div>
                </td>
                <td className="px-4 py-3">{item.product_interest || "—"}</td>
                <td className="px-4 py-3">{STATUS_LABEL[item.status]}</td>
              </tr>
            ))}
            {!items.length ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-ink-600">
                  Mesaj yok.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <p className="text-sm text-ink-600">
          Sayfa {page} / {totalPages}
        </p>
      ) : null}
    </div>
  );
}
