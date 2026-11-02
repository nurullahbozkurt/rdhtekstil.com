"use client";

import { Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { DeleteFairVisitorButton } from "@/components/admin/delete-fair-visitor-button";
import {
  FAIR_VISITOR_SOURCE_LABEL,
  FAIR_VISITOR_STATUS_LABEL,
  fairVisitorSourceClass,
  fairVisitorStatusClass,
  formatFairProductGroup,
} from "@/lib/admin/fair-visitor-labels";
import { formatCountryLabel } from "@/lib/admin/countries";
import { formatAdminDate } from "@/lib/admin/request-labels";
import type { FairVisitorListItem } from "@/lib/admin/fair-visitors";
import { cn } from "@/lib/utils";

function StatusBadge({ status }: { status: FairVisitorListItem["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        fairVisitorStatusClass(status),
      )}
    >
      {FAIR_VISITOR_STATUS_LABEL[status]}
    </span>
  );
}

function SourceBadge({ source }: { source: FairVisitorListItem["source"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        fairVisitorSourceClass(source),
      )}
    >
      {FAIR_VISITOR_SOURCE_LABEL[source]}
    </span>
  );
}

function Avatar() {
  return (
    <div className="text-ink-400 flex size-12 shrink-0 items-center justify-center rounded-xl bg-cream-100 ring-1 ring-cream-300">
      <Store className="size-5" aria-hidden />
    </div>
  );
}

export function FairVisitorsList({ items }: { items: FairVisitorListItem[] }) {
  const router = useRouter();

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-cream-300 bg-white px-4 py-14 text-center text-sm text-ink-600">
        Fuar ziyaretçisi bulunamadı.
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
              onClick={() => router.push(`/admin/fair-visitors/${item.id}`)}
              className="flex w-full gap-3 p-3 text-left transition-colors active:bg-cream-50"
            >
              <Avatar />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-navy-900">
                      {item.full_name}
                      {!item.read_at ? (
                        <span className="ml-2 inline-flex rounded-full bg-gold-500 px-1.5 py-0.5 text-[10px] font-bold text-navy-900">
                          YENİ
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-ink-600">
                      {[item.company, item.job_title].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <StatusBadge status={item.status} />
                    <SourceBadge source={item.source} />
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-500">
                  <span>{formatFairProductGroup(item.product_group)}</span>
                  <span>{item.quantity_range}</span>
                  <span>{formatCountryLabel(item.country)}</span>
                  <span>{formatAdminDate(item.created_at)}</span>
                </div>
              </div>
            </button>
            <div className="flex items-center justify-end border-t border-cream-200/80 bg-white/60 px-2 py-1.5">
              <DeleteFairVisitorButton id={item.id} name={item.full_name} variant="icon" />
            </div>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto rounded-2xl border border-cream-300 bg-white md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-cream-300 bg-cream-50 text-ink-600">
            <tr>
              <th className="w-14 px-4 py-3 font-semibold" scope="col">
                <span className="sr-only">Tür</span>
              </th>
              <th className="px-4 py-3 font-semibold" scope="col">
                Tarih
              </th>
              <th className="px-4 py-3 font-semibold" scope="col">
                Ziyaretçi
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
                Kaynak
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
                aria-label={`${item.full_name} kaydını aç`}
                onClick={() => router.push(`/admin/fair-visitors/${item.id}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    router.push(`/admin/fair-visitors/${item.id}`);
                  }
                }}
                className={cn(
                  "cursor-pointer border-b border-cream-200 transition-colors last:border-0 hover:bg-cream-50 focus-visible:bg-cream-50 focus-visible:ring-2 focus-visible:ring-navy-800/30 focus-visible:outline-none focus-visible:ring-inset",
                  !item.read_at && "bg-gold-200/15",
                )}
              >
                <td className="px-4 py-3">
                  <Avatar />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-ink-600">
                  {formatAdminDate(item.created_at)}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-navy-900">
                    {item.full_name}
                    {!item.read_at ? (
                      <span className="ml-2 inline-flex rounded-full bg-gold-500 px-1.5 py-0.5 text-[10px] font-bold text-navy-900">
                        YENİ
                      </span>
                    ) : null}
                  </div>
                  <div className="text-ink-600">{item.company}</div>
                  <div className="text-xs text-ink-500">
                    {[item.job_title, item.email].filter(Boolean).join(" · ") || "—"}
                  </div>
                </td>
                <td className="px-4 py-3">{formatFairProductGroup(item.product_group)}</td>
                <td className="px-4 py-3 whitespace-nowrap">{item.quantity_range || "—"}</td>
                <td className="px-4 py-3 whitespace-nowrap">{formatCountryLabel(item.country)}</td>
                <td className="px-4 py-3">
                  <SourceBadge source={item.source} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col items-start gap-1">
                    <StatusBadge status={item.status} />
                    <span className="text-xs text-ink-500">{item.locale.toUpperCase()}</span>
                  </div>
                </td>
                <td className="px-3 py-3" onClick={(event) => event.stopPropagation()}>
                  <DeleteFairVisitorButton id={item.id} name={item.full_name} variant="icon" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
