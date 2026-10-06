import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

export type ContactStatus = "NEW" | "READ" | "ARCHIVED";

export type ContactListItem = {
  id: string;
  created_at: string;
  locale: string;
  full_name: string;
  company: string | null;
  email: string;
  country: string | null;
  product_interest: string | null;
  message: string;
  status: ContactStatus;
  read_at: string | null;
};

export type ContactDetail = ContactListItem & {
  phone: string | null;
  quantity_range: string | null;
  message: string;
  privacy_consent_at: string;
  privacy_consent_version: string;
};

export async function listContactMessages(filters: {
  q?: string;
  status?: ContactStatus | "";
  page?: number;
  pageSize?: number;
} = {}) {
  const admin = createAdminClient();
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(50, Math.max(5, filters.pageSize ?? 20));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = admin
    .from("contact_messages")
    .select(
      "id, created_at, locale, full_name, company, email, country, product_interest, message, status, read_at",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.q?.trim()) {
    const q = `%${filters.q.trim()}%`;
    query = query.or(`full_name.ilike.${q},company.ilike.${q},email.ilike.${q}`);
  }

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);
  return { items: (data ?? []) as ContactListItem[], total: count ?? 0, page, pageSize };
}

export async function getContactMessage(id: string): Promise<ContactDetail | null> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("contact_messages").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as ContactDetail) ?? null;
}

export async function markContactRead(id: string) {
  const admin = createAdminClient();
  const { data } = await admin.from("contact_messages").select("read_at, status").eq("id", id).maybeSingle();
  if (data && !data.read_at) {
    await admin
      .from("contact_messages")
      .update({ read_at: new Date().toISOString(), status: data.status === "NEW" ? "READ" : data.status })
      .eq("id", id);
  }
}

export async function updateContactStatus(id: string, status: ContactStatus) {
  const admin = createAdminClient();
  const { error } = await admin.from("contact_messages").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteContactMessage(id: string) {
  const admin = createAdminClient();
  const { error } = await admin.from("contact_messages").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function countUnreadContacts() {
  const admin = createAdminClient();
  const { count, error } = await admin
    .from("contact_messages")
    .select("*", { count: "exact", head: true })
    .eq("status", "NEW");
  if (error) throw new Error(error.message);
  return count ?? 0;
}
