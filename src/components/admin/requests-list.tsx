"use client";

import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { DeleteRequestButton } from "@/components/admin/delete-request-button";
import { formatCountryLabel } from "@/lib/admin/countries";
import {
  formatAdminDate,
  REQUEST_PRODUCT_LABEL,
  REQUEST_STATUS_LABEL,
  requestStatusClass,
} from "@/lib/admin/request-labels";
import type { RequestListItem } from "@/lib/admin/requests";
import { cn } from "@/lib/utils";

function PreviewThumb({
  url,
  alt,
  className,
}: {
  url: string | null;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-xl bg-cream-100 ring-1 ring-cream-300",
        className,
      )}
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={alt} className="size-full object-cover" />
      ) : (
        <div className="flex size-full flex-col items-center justify-center gap-1 text-ink-400">
          <ImageIcon className="size-5" aria-hidden />
          <span className="sr-only">Örnek görsel yok</span>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: RequestListItem["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        requestStatusClass(status),
      )}
    >
      {REQUEST_STATUS_LABEL[status]}
    </span>
  );
}

export function RequestsList({ items }: { items: RequestListItem[] }) {
  const router = useRouter();

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-cream-300 bg-white px-4 py-14 text-center text-sm text-ink-600">
        Kayıt bulunamadı.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-3 md:hidden">
        {items.map((item) => (
          <li
            key={item.id}
            className={cn(
              "overflow-hidden rounded-2xl border border-cream-300 bg-white",
              !item.read_at && "border-gold-500/40 bg-gold-200/15",
            )}
          >
            <button
              type="button"
              onClick={() => router.push(`/admin/requests/${item.id}`)}
              className="flex w-full gap-3 p-3 text-left transition-colors active:bg-cream-50"
            >
              <PreviewThumb
                url={item.previewUrl}
                alt={`${item.number} önizleme`}
                className="size-16"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-navy-900">
                      {item.number}
                      {!item.read_at ? (
                        <span className="ml-2 inline-flex rounded-full bg-gold-500 px-1.5 py-0.5 text-[10px] font-bold text-navy-900">
                          YENİ
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-0.5 truncate text-sm font-medium text-navy-900">
                      {item.full_name}
                    </p>
                    <p className="truncate text-xs text-ink-600">{item.company || item.email}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-600">
                  <span>{REQUEST_PRODUCT_LABEL[item.product_type]}</span>
                  <span>{item.quantity_range}</span>
                  <span>{formatCountryLabel(item.country)}</span>
                  <span>{formatAdminDate(item.created_at)}</span>
                </div>
              </div>
            </button>
            <div className="flex items-center justify-end border-t border-cream-200/80 bg-white/60 px-2 py-1.5">
              <DeleteRequestButton id={item.id} number={item.number} variant="icon" />
            </div>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto rounded-2xl border border-cream-300 bg-white md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-cream-300 bg-cream-50 text-ink-600">
            <tr>
              <th className="w-16 px-4 py-3 font-semibold" scope="col">
                <span className="sr-only">Önizleme</span>
              </th>
              <th className="px-4 py-3 font-semibold" scope="col">
                No
              </th>
              <th className="px-4 py-3 font-semibold" scope="col">
                Tarih
              </th>
              <th className="px-4 py-3 font-semibold" scope="col">
                Müşteri
              </th>
              <th className="px-4 py-3 font-semibold" scope="col">
                Ürün
              </th>
              <th className="px-4 py-3 font-semibold" scope="col">
                Adet
              </th>
              <th className="px-4 py-3 font-semibold" scope="col">
                Ülke
              </th>
              <th className="px-4 py-3 font-semibold" scope="col">
                Durum
              </th>
              <th className="w-12 px-3 py-3 font-semibold" scope="col">
                <span className="sr-only">İşlem</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                tabIndex={0}
                role="link"
                aria-label={`${item.number} talebini aç`}
                onClick={() => router.push(`/admin/requests/${item.id}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    router.push(`/admin/requests/${item.id}`);
                  }
                }}
                className={cn(
                  "cursor-pointer border-b border-cream-200 transition-colors last:border-0 hover:bg-cream-50 focus-visible:bg-cream-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-navy-800/30",
                  !item.read_at && "bg-gold-200/15",
                )}
              >
                <td className="px-4 py-3">
                  <PreviewThumb
                    url={item.previewUrl}
                    alt={`${item.number} önizleme`}
                    className="size-12"
                  />
                </td>
                <td className="px-4 py-3">
                  <span className="font-semibold text-navy-900">{item.number}</span>
                  {!item.read_at ? (
                    <span className="ml-2 inline-flex rounded-full bg-gold-500 px-1.5 py-0.5 text-[10px] font-bold text-navy-900">
                      YENİ
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-ink-600">
                  {formatAdminDate(item.created_at)}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-navy-900">{item.full_name}</div>
                  <div className="text-ink-600">{item.company}</div>
                  <div className="text-xs text-ink-500">{item.email}</div>
                </td>
                <td className="px-4 py-3">{REQUEST_PRODUCT_LABEL[item.product_type]}</td>
                <td className="px-4 py-3">{item.quantity_range}</td>
                <td className="px-4 py-3 whitespace-nowrap">{formatCountryLabel(item.country)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col items-start gap-1">
                    <StatusBadge status={item.status} />
                    <span className="text-xs text-ink-500">{item.locale.toUpperCase()}</span>
                  </div>
                </td>
                <td className="px-3 py-3" onClick={(event) => event.stopPropagation()}>
                  <DeleteRequestButton id={item.id} number={item.number} variant="icon" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
