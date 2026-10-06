import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { createSignedDownloadUrl } from "@/lib/uploads/storage";

export type RequestStatus = "NEW" | "IN_REVIEW" | "REPLIED";
export type ProductType = "BEANIE" | "SCARF" | "SET";

export type RequestListItem = {
  id: string;
  number: string;
  created_at: string;
  locale: string;
  product_type: ProductType;
  product_slug: string | null;
  quantity_range: string;
  full_name: string;
  company: string;
  email: string;
  country: string;
  status: RequestStatus;
  read_at: string | null;
  previewUrl: string | null;
  hasFiles: boolean;
};

export type RequestFile = {
  id: string;
  kind: "LOGO" | "REFERENCE" | "OTHER";
  original_name: string;
  storage_key: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
};

export type RequestDetail = RequestListItem & {
  model_slug: string | null;
  style_slug: string | null;
  industry: string | null;
  color1: string;
  color2: string | null;
  color3: string | null;
  slogan: string | null;
  desired_date: string | null;
  note: string | null;
  phone: string;
  privacy_consent_at: string;
  privacy_consent_version: string;
  marketing_consent: boolean;
  internal_note: string | null;
  files: RequestFile[];
};

export type RequestFilters = {
  q?: string;
  status?: RequestStatus | "";
  productType?: ProductType | "";
  locale?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
};

export async function listRequests(filters: RequestFilters = {}) {
  const admin = createAdminClient();
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(50, Math.max(5, filters.pageSize ?? 20));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = admin
    .from("requests")
    .select(
      "id, number, created_at, locale, product_type, product_slug, quantity_range, full_name, company, email, country, status, read_at",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.productType) query = query.eq("product_type", filters.productType);
  if (filters.locale) query = query.eq("locale", filters.locale);
  if (filters.from) query = query.gte("created_at", filters.from);
  if (filters.to) query = query.lte("created_at", `${filters.to}T23:59:59.999Z`);
  if (filters.q?.trim()) {
    const q = `%${filters.q.trim()}%`;
    query = query.or(`full_name.ilike.${q},company.ilike.${q},email.ilike.${q},number.ilike.${q}`);
  }

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  const rows = (data ?? []) as Omit<RequestListItem, "previewUrl" | "hasFiles">[];
  const items = await attachRequestPreviews(rows);

  return {
    items,
    total: count ?? 0,
    page,
    pageSize,
  };
}

type PreviewFileRow = {
  id: string;
  request_id: string;
  kind: RequestFile["kind"];
  mime_type: string;
  storage_key: string;
};

function previewRank(kind: RequestFile["kind"]) {
  if (kind === "REFERENCE") return 0;
  if (kind === "LOGO") return 1;
  return 2;
}

async function attachRequestPreviews(
  rows: Omit<RequestListItem, "previewUrl" | "hasFiles">[],
): Promise<RequestListItem[]> {
  if (!rows.length) return [];

  const admin = createAdminClient();
  const ids = rows.map((row) => row.id);
  const { data: files, error } = await admin
    .from("request_files")
    .select("id, request_id, kind, mime_type, storage_key")
    .in("request_id", ids);
  if (error) throw new Error(error.message);

  const filesByRequest = new Map<string, PreviewFileRow[]>();
  for (const file of (files ?? []) as PreviewFileRow[]) {
    const list = filesByRequest.get(file.request_id) ?? [];
    list.push(file);
    filesByRequest.set(file.request_id, list);
  }

  return Promise.all(
    rows.map(async (row) => {
      const requestFiles = filesByRequest.get(row.id) ?? [];
      const image = [...requestFiles]
        .filter((file) => file.mime_type.startsWith("image/"))
        .sort((a, b) => previewRank(a.kind) - previewRank(b.kind))[0];

      let previewUrl: string | null = null;
      if (image) {
        try {
          previewUrl = await createSignedDownloadUrl(image.storage_key, 60 * 60);
        } catch {
          previewUrl = null;
        }
      }

      return {
        ...row,
        previewUrl,
        hasFiles: requestFiles.length > 0,
      };
    }),
  );
}

export async function getRequest(id: string): Promise<RequestDetail | null> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("requests").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;

  const { data: files, error: filesError } = await admin
    .from("request_files")
    .select("*")
    .eq("request_id", id)
    .order("created_at", { ascending: true });
  if (filesError) throw new Error(filesError.message);

  return { ...(data as Omit<RequestDetail, "files">), files: (files ?? []) as RequestFile[] };
}

export async function markRequestRead(id: string) {
  const admin = createAdminClient();
  const { data } = await admin.from("requests").select("read_at").eq("id", id).maybeSingle();
  if (data && !data.read_at) {
    await admin.from("requests").update({ read_at: new Date().toISOString() }).eq("id", id);
  }
}

export async function updateRequestStatus(id: string, status: RequestStatus) {
  const admin = createAdminClient();
  const { error } = await admin.from("requests").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function updateRequestInternalNote(id: string, internalNote: string) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("requests")
    .update({ internal_note: internalNote || null })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function listRequestsByEmail(email: string, excludeId?: string) {
  const admin = createAdminClient();
  let query = admin
    .from("requests")
    .select("id, number, created_at, status")
    .eq("email", email)
    .order("created_at", { ascending: false })
    .limit(10);
  if (excludeId) query = query.neq("id", excludeId);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function countUnreadRequests() {
  const admin = createAdminClient();
  const { count, error } = await admin
    .from("requests")
    .select("*", { count: "exact", head: true })
    .is("read_at", null);
  if (error) throw new Error(error.message);
  return count ?? 0;
}
