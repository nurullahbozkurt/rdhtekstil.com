import "server-only";

import type { FairVisitorChange } from "@/lib/admin/fair-visitor-field-labels";
import { createAdminClient } from "@/lib/supabase/admin";
import type { FairProductGroup, FairVisitorSource } from "@/lib/validation/fair-visitor";

export type FairVisitorStatus = "NEW" | "MET" | "QUOTED" | "FOLLOW_UP";

export type FairVisitorListItem = {
  id: string;
  created_at: string;
  locale: string;
  full_name: string;
  company: string;
  job_title: string | null;
  email: string | null;
  country: string | null;
  product_group: FairProductGroup;
  quantity_range: string | null;
  status: FairVisitorStatus;
  source: FairVisitorSource;
  read_at: string | null;
};

export type FairVisitorDetail = FairVisitorListItem & {
  phone: string | null;
  desired_date: string | null;
  notes: string | null;
  privacy_consent_at: string;
  privacy_consent_version: string;
  internal_note: string | null;
};

export type FairVisitorEditLog = {
  id: string;
  visitor_id: string;
  created_at: string;
  actor_id: string | null;
  actor_name: string;
  changes: FairVisitorChange[];
};

export type FairVisitorUpdateInput = {
  full_name: string;
  company: string;
  job_title: string | null;
  country: string | null;
  email: string | null;
  phone: string | null;
  product_group: FairProductGroup;
  quantity_range: string | null;
  desired_date: string | null;
  notes: string | null;
  status: FairVisitorStatus;
  internal_note: string | null;
};

const TRACKED_FIELDS = [
  "full_name",
  "company",
  "job_title",
  "country",
  "email",
  "phone",
  "product_group",
  "quantity_range",
  "desired_date",
  "notes",
  "status",
  "internal_note",
] as const;

function normalize(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export type FairVisitorListFilters = {
  q?: string;
  status?: FairVisitorStatus | "";
  source?: FairVisitorSource | "";
  page?: number;
  pageSize?: number;
};

export async function listFairVisitors(filters: FairVisitorListFilters = {}) {
  const admin = createAdminClient();
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(50, Math.max(5, filters.pageSize ?? 20));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = admin
    .from("fair_visitors")
    .select(
      "id, created_at, locale, full_name, company, job_title, email, country, product_group, quantity_range, status, source, read_at",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.source) query = query.eq("source", filters.source);
  if (filters.q?.trim()) {
    const q = `%${filters.q.trim()}%`;
    query = query.or(
      `full_name.ilike.${q},company.ilike.${q},email.ilike.${q},job_title.ilike.${q}`,
    );
  }

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);
  return { items: (data ?? []) as FairVisitorListItem[], total: count ?? 0, page, pageSize };
}

/** Export için filtreli tüm kayıtlar (sayfalama yok). */
export async function listAllFairVisitorsForExport(
  filters: Omit<FairVisitorListFilters, "page" | "pageSize"> = {},
) {
  const admin = createAdminClient();
  let query = admin
    .from("fair_visitors")
    .select(
      "id, created_at, locale, full_name, company, job_title, email, phone, country, product_group, quantity_range, desired_date, notes, status, source, privacy_consent_at, privacy_consent_version, internal_note, read_at",
    )
    .order("created_at", { ascending: false });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.source) query = query.eq("source", filters.source);
  if (filters.q?.trim()) {
    const q = `%${filters.q.trim()}%`;
    query = query.or(
      `full_name.ilike.${q},company.ilike.${q},email.ilike.${q},job_title.ilike.${q}`,
    );
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as FairVisitorDetail[];
}

export async function getFairVisitor(id: string): Promise<FairVisitorDetail | null> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("fair_visitors").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as FairVisitorDetail) ?? null;
}

export async function markFairVisitorRead(id: string) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("fair_visitors")
    .select("read_at")
    .eq("id", id)
    .maybeSingle();
  if (data && !data.read_at) {
    await admin.from("fair_visitors").update({ read_at: new Date().toISOString() }).eq("id", id);
  }
}

export async function listFairVisitorEditLogs(visitorId: string): Promise<FairVisitorEditLog[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("fair_visitor_edit_logs")
    .select("id, visitor_id, created_at, actor_id, actor_name, changes")
    .eq("visitor_id", visitorId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    id: row.id as string,
    visitor_id: row.visitor_id as string,
    created_at: row.created_at as string,
    actor_id: (row.actor_id as string | null) ?? null,
    actor_name: row.actor_name as string,
    changes: (Array.isArray(row.changes) ? row.changes : []) as FairVisitorChange[],
  }));
}

export async function updateFairVisitorWithLog(
  id: string,
  input: FairVisitorUpdateInput,
  actor: { id: string; name: string },
): Promise<{ changes: FairVisitorChange[] }> {
  const current = await getFairVisitor(id);
  if (!current) throw new Error("not_found");

  const next = {
    full_name: input.full_name.trim(),
    company: input.company.trim(),
    job_title: normalize(input.job_title),
    country: normalize(input.country),
    email: normalize(input.email),
    phone: normalize(input.phone),
    product_group: input.product_group,
    quantity_range: normalize(input.quantity_range),
    desired_date: normalize(input.desired_date),
    notes: normalize(input.notes),
    status: input.status,
    internal_note: normalize(input.internal_note),
  };

  const changes: FairVisitorChange[] = [];
  for (const field of TRACKED_FIELDS) {
    const fromNorm = normalize(String(current[field] ?? ""));
    const toNorm = normalize(String(next[field] ?? ""));
    if (fromNorm !== toNorm) {
      changes.push({ field, from: fromNorm, to: toNorm });
    }
  }

  if (!changes.length) return { changes: [] };

  const admin = createAdminClient();
  const { error } = await admin
    .from("fair_visitors")
    .update({
      full_name: next.full_name,
      company: next.company,
      job_title: next.job_title,
      country: next.country,
      email: next.email,
      phone: next.phone,
      product_group: next.product_group,
      quantity_range: next.quantity_range,
      desired_date: next.desired_date,
      notes: next.notes,
      status: next.status,
      internal_note: next.internal_note,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  const { error: logError } = await admin.from("fair_visitor_edit_logs").insert({
    visitor_id: id,
    actor_id: actor.id,
    actor_name: actor.name,
    changes,
  });
  if (logError) throw new Error(logError.message);

  return { changes };
}

export async function deleteFairVisitor(id: string) {
  const admin = createAdminClient();
  const { error } = await admin.from("fair_visitors").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function countUnreadFairVisitors() {
  const admin = createAdminClient();
  const { count, error } = await admin
    .from("fair_visitors")
    .select("*", { count: "exact", head: true })
    .is("read_at", null);
  if (error) throw new Error(error.message);
  return count ?? 0;
}
