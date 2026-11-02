import {
  FAIR_VISITOR_EDITABLE_FIELD_LABEL,
  formatFairVisitorFieldValue,
} from "@/lib/admin/fair-visitor-field-labels";
import type { FairVisitorEditLog } from "@/lib/admin/fair-visitors";
import { formatAdminDate } from "@/lib/admin/request-labels";

export function FairVisitorChangeLog({ logs }: { logs: FairVisitorEditLog[] }) {
  return (
    <section className="space-y-4 rounded-2xl border border-cream-300 bg-cream-50 p-4 sm:p-5">
      <div>
        <h2 className="font-heading text-lg font-medium text-navy-900">Değişiklik geçmişi</h2>
        <p className="mt-1 text-sm text-ink-600">Bu kayıt üzerinde yapılan düzenlemeler</p>
      </div>

      {!logs.length ? (
        <p className="rounded-xl border border-dashed border-cream-300 bg-white px-4 py-8 text-center text-sm text-ink-600">
          Henüz düzenleme yok.
        </p>
      ) : (
        <ol className="space-y-3">
          {logs.map((log) => (
            <li
              key={log.id}
              className="rounded-xl border border-cream-300 bg-white px-4 py-3 text-sm"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-semibold text-navy-900">{log.actor_name}</p>
                <time className="text-xs text-ink-500" dateTime={log.created_at}>
                  {formatAdminDate(log.created_at, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </time>
              </div>
              <ul className="mt-2 space-y-1.5 text-ink-600">
                {log.changes.map((change) => (
                  <li key={`${log.id}-${change.field}`}>
                    <span className="font-medium text-navy-900">
                      {FAIR_VISITOR_EDITABLE_FIELD_LABEL[change.field] ?? change.field}
                    </span>
                    {": "}
                    <span className="line-through decoration-cream-400">
                      {formatFairVisitorFieldValue(change.field, change.from)}
                    </span>
                    {" → "}
                    <span className="font-medium text-navy-900">
                      {formatFairVisitorFieldValue(change.field, change.to)}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
