import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import {
  FAIR_PRODUCT_GROUP_LABEL,
  FAIR_VISITOR_SOURCE_LABEL,
  FAIR_VISITOR_STATUS_LABEL,
} from "@/lib/admin/fair-visitor-labels";
import { formatCountryLabel } from "@/lib/admin/countries";
import {
  listAllFairVisitorsForExport,
  type FairVisitorDetail,
  type FairVisitorStatus,
} from "@/lib/admin/fair-visitors";
import { exportTableResponse, parseExportFormat, type ExportColumn } from "@/lib/admin/export-table";
import { assertSameOrigin } from "@/lib/security/origin";
import type { FairVisitorSource } from "@/lib/validation/fair-visitor";

const columns: ExportColumn<FairVisitorDetail>[] = [
  { header: "Tarih", key: "createdAt", width: 20, value: (row) => row.created_at },
  { header: "Ad Soyad", key: "fullName", width: 22, value: (row) => row.full_name },
  { header: "Firma", key: "company", width: 22, value: (row) => row.company },
  { header: "Görev", key: "jobTitle", width: 18, value: (row) => row.job_title },
  { header: "Ülke", key: "country", width: 18, value: (row) => formatCountryLabel(row.country) },
  { header: "E-posta", key: "email", width: 28, value: (row) => row.email },
  { header: "Telefon", key: "phone", width: 18, value: (row) => row.phone },
  {
    header: "Ürün grubu",
    key: "productGroup",
    width: 16,
    value: (row) => FAIR_PRODUCT_GROUP_LABEL[row.product_group] ?? row.product_group,
  },
  { header: "Tahmini adet", key: "quantityRange", width: 14, value: (row) => row.quantity_range },
  { header: "Hedef teslim", key: "desiredDate", width: 14, value: (row) => row.desired_date },
  { header: "Görüşme notu", key: "notes", width: 36, value: (row) => row.notes },
  {
    header: "Kaynak",
    key: "source",
    width: 12,
    value: (row) => FAIR_VISITOR_SOURCE_LABEL[row.source] ?? row.source,
  },
  {
    header: "Durum",
    key: "status",
    width: 18,
    value: (row) => FAIR_VISITOR_STATUS_LABEL[row.status] ?? row.status,
  },
  { header: "Dil", key: "locale", width: 8, value: (row) => row.locale.toUpperCase() },
  {
    header: "KVKK onay zamanı",
    key: "privacyConsentAt",
    width: 22,
    value: (row) => row.privacy_consent_at,
  },
  {
    header: "KVKK sürüm",
    key: "privacyConsentVersion",
    width: 16,
    value: (row) => row.privacy_consent_version,
  },
  { header: "İç not", key: "internalNote", width: 28, value: (row) => row.internal_note },
];

export async function GET(request: Request) {
  if (!assertSameOrigin(request)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  const status = (url.searchParams.get("status") ?? "") as FairVisitorStatus | "";
  const source = (url.searchParams.get("source") ?? "") as FairVisitorSource | "";
  const format = parseExportFormat(url.searchParams.get("format"));

  try {
    const rows = await listAllFairVisitorsForExport({ q, status, source });
    return exportTableResponse({
      format,
      filenameBase: "fuar-ziyaretcileri",
      sheetName: "Fuar ziyaretçileri",
      columns,
      rows,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "export_failed" },
      { status: 500 },
    );
  }
}
