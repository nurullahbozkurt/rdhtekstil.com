"use client";

import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { DeleteContactButton } from "@/components/admin/delete-contact-button";
import {
  CONTACT_STATUS_LABEL,
  contactStatusClass,
  formatProductInterest,
  truncateMessage,
} from "@/lib/admin/contact-labels";
import { formatCountryLabel } from "@/lib/admin/countries";
import { formatAdminDate } from "@/lib/admin/request-labels";
import type { ContactListItem } from "@/lib/admin/contacts";
import { cn } from "@/lib/utils";

function StatusBadge({ status }: { status: ContactListItem["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        contactStatusClass(status),
      )}
    >
      {CONTACT_STATUS_LABEL[status]}
    </span>
  );
}

function Avatar() {
  return (
    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-cream-100 text-ink-400 ring-1 ring-cream-300">
      <Mail className="size-5" aria-hidden />
    </div>
  );
}

export function MessagesList({ items }: { items: ContactListItem[] }) {
  const router = useRouter();

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-cream-300 bg-white px-4 py-14 text-center text-sm text-ink-600">
        Mesaj bulunamadı.
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
              item.status === "NEW" && "border-gold-500/40 bg-gold-200/15",
            )}
          >
            <button
              type="button"
              onClick={() => router.push(`/admin/messages/${item.id}`)}
              className="flex w-full gap-3 p-3 text-left transition-colors active:bg-cream-50"
            >
              <Avatar />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-navy-900">
                      {item.full_name}
                      {item.status === "NEW" ? (
                        <span className="ml-2 inline-flex rounded-full bg-gold-500 px-1.5 py-0.5 text-[10px] font-bold text-navy-900">
                          YENİ
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-ink-600">
                      {item.company || item.email}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                <p className="mt-1.5 line-clamp-2 text-xs text-ink-600">
                  {truncateMessage(item.message, 100)}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-500">
                  <span>{formatProductInterest(item.product_interest)}</span>
                  <span>{formatCountryLabel(item.country)}</span>
                  <span>{formatAdminDate(item.created_at)}</span>
                </div>
              </div>
            </button>
            <div className="flex items-center justify-end border-t border-cream-200/80 bg-white/60 px-2 py-1.5">
              <DeleteContactButton id={item.id} name={item.full_name} variant="icon" />
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
                Gönderen
              </th>
              <th className="px-4 py-3 font-semibold" scope="col">
                Mesaj
              </th>
              <th className="px-4 py-3 font-semibold" scope="col">
                Ürün
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
                aria-label={`${item.full_name} mesajını aç`}
                onClick={() => router.push(`/admin/messages/${item.id}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    router.push(`/admin/messages/${item.id}`);
                  }
                }}
                className={cn(
                  "cursor-pointer border-b border-cream-200 transition-colors last:border-0 hover:bg-cream-50 focus-visible:bg-cream-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-navy-800/30",
                  item.status === "NEW" && "bg-gold-200/15",
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
                    {item.status === "NEW" ? (
                      <span className="ml-2 inline-flex rounded-full bg-gold-500 px-1.5 py-0.5 text-[10px] font-bold text-navy-900">
                        YENİ
                      </span>
                    ) : null}
                  </div>
                  <div className="text-ink-600">{item.company || "—"}</div>
                  <div className="text-xs text-ink-500">{item.email}</div>
                </td>
                <td className="max-w-[16rem] px-4 py-3 text-ink-600">
                  <p className="line-clamp-2">{truncateMessage(item.message, 120)}</p>
                </td>
                <td className="px-4 py-3">{formatProductInterest(item.product_interest)}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {formatCountryLabel(item.country)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col items-start gap-1">
                    <StatusBadge status={item.status} />
                    <span className="text-xs text-ink-500">{item.locale.toUpperCase()}</span>
                  </div>
                </td>
                <td className="px-3 py-3" onClick={(event) => event.stopPropagation()}>
                  <DeleteContactButton id={item.id} name={item.full_name} variant="icon" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
