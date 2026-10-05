import Link from "next/link";
import { listRequests, type RequestStatus, type ProductType } from "@/lib/admin/requests";

export const metadata = { title: "Talepler" };

const STATUS_LABEL: Record<RequestStatus, string> = {
  NEW: "Yeni",
  IN_REVIEW: "İnceleniyor",
  REPLIED: "Yanıtlandı",
};

const PRODUCT_LABEL: Record<ProductType, string> = {
  BEANIE: "Bere",
  SCARF: "Atkı",
  SET: "Set",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const status = (typeof sp.status === "string" ? sp.status : "") as RequestStatus | "";
  const productType = (typeof sp.productType === "string" ? sp.productType : "") as
    | ProductType
    | "";
  const locale = typeof sp.locale === "string" ? sp.locale : "";
  const page = Number(typeof sp.page === "string" ? sp.page : "1") || 1;

  const { items, total, pageSize } = await listRequests({
    q,
    status,
    productType,
    locale,
    page,
  });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-medium tracking-tight text-navy-900">Talepler</h1>
        <p className="mt-1 text-sm text-ink-600">{total} kayıt</p>
      </div>

      <form className="grid gap-3 rounded-2xl border border-cream-300 bg-cream-50 p-4 md:grid-cols-5">
        <input
          name="q"
          defaultValue={q}
          placeholder="Ad, firma, e-posta, no…"
          className="h-11 rounded-xl border border-cream-300 bg-white px-3 md:col-span-2"
        />
        <select name="status" defaultValue={status} className="h-11 rounded-xl border border-cream-300 bg-white px-3">
          <option value="">Tüm durumlar</option>
          <option value="NEW">Yeni</option>
          <option value="IN_REVIEW">İnceleniyor</option>
          <option value="REPLIED">Yanıtlandı</option>
        </select>
        <select
          name="productType"
          defaultValue={productType}
          className="h-11 rounded-xl border border-cream-300 bg-white px-3"
        >
          <option value="">Tüm ürünler</option>
          <option value="BEANIE">Bere</option>
          <option value="SCARF">Atkı</option>
          <option value="SET">Set</option>
        </select>
        <button type="submit" className="h-11 rounded-xl bg-navy-800 px-4 font-semibold text-cream-50">
          Filtrele
        </button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-cream-300 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-cream-300 bg-cream-50 text-ink-600">
            <tr>
              <th className="px-4 py-3 font-semibold">No</th>
              <th className="px-4 py-3 font-semibold">Tarih</th>
              <th className="px-4 py-3 font-semibold">Müşteri</th>
              <th className="px-4 py-3 font-semibold">Ürün</th>
              <th className="px-4 py-3 font-semibold">Adet</th>
              <th className="px-4 py-3 font-semibold">Ülke</th>
              <th className="px-4 py-3 font-semibold">Durum</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className={`border-b border-cream-200 last:border-0 ${!item.read_at ? "bg-gold-200/20" : ""}`}
              >
                <td className="px-4 py-3">
                  <Link href={`/admin/requests/${item.id}`} className="font-semibold text-navy-900 underline-offset-2 hover:underline">
                    {item.number}
                    {!item.read_at ? (
                      <span className="ml-2 rounded-full bg-gold-500 px-1.5 py-0.5 text-[10px] font-bold text-navy-900">
                        YENİ
                      </span>
                    ) : null}
                  </Link>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-ink-600">{formatDate(item.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-navy-900">{item.full_name}</div>
                  <div className="text-ink-600">{item.company}</div>
                  <div className="text-xs text-ink-500">{item.email}</div>
                </td>
                <td className="px-4 py-3">{PRODUCT_LABEL[item.product_type]}</td>
                <td className="px-4 py-3">{item.quantity_range}</td>
                <td className="px-4 py-3">{item.country}</td>
                <td className="px-4 py-3">{STATUS_LABEL[item.status]} · {item.locale.toUpperCase()}</td>
              </tr>
            ))}
            {!items.length ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-ink-600">
                  Kayıt bulunamadı.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center gap-3 text-sm">
          {page > 1 ? (
            <Link
              href={`/admin/requests?${new URLSearchParams({ q, status, productType, locale, page: String(page - 1) })}`}
              className="rounded-lg border border-cream-300 px-3 py-1.5"
            >
              Önceki
            </Link>
          ) : null}
          <span>
            Sayfa {page} / {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={`/admin/requests?${new URLSearchParams({ q, status, productType, locale, page: String(page + 1) })}`}
              className="rounded-lg border border-cream-300 px-3 py-1.5"
            >
              Sonraki
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
