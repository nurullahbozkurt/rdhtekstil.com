import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { formatCountryLabel } from "@/lib/admin/countries";
import { exportTableResponse, parseExportFormat, type ExportColumn } from "@/lib/admin/export-table";
import {
  REQUEST_PRODUCT_LABEL,
  REQUEST_STATUS_LABEL,
} from "@/lib/admin/request-labels";
import {
  listAllRequestsForExport,
  type ProductType,
  type RequestExportRow,
  type RequestStatus,
} from "@/lib/admin/requests";
import { assertSameOrigin } from "@/lib/security/origin";

const columns: ExportColumn<RequestExportRow>[] = [
  { header: "Talep no", key: "number", width: 16, value: (row) => row.number },
  { header: "Tarih", key: "createdAt", width: 20, value: (row) => row.created_at },
  { header: "Ad Soyad", key: "fullName", width: 22, value: (row) => row.full_name },
  { header: "Firma", key: "company", width: 22, value: (row) => row.company },
  { header: "E-posta", key: "email", width: 28, value: (row) => row.email },
  { header: "Telefon", key: "phone", width: 18, value: (row) => row.phone },
  { header: "Ülke", key: "country", width: 18, value: (row) => formatCountryLabel(row.country) },
  {
    header: "Ürün tipi",
    key: "productType",
    width: 12,
    value: (row) => REQUEST_PRODUCT_LABEL[row.product_type] ?? row.product_type,
  },
  { header: "Ürün slug", key: "productSlug", width: 18, value: (row) => row.product_slug },
  { header: "Model slug", key: "modelSlug", width: 18, value: (row) => row.model_slug },
  { header: "Kalıp", key: "styleSlug", width: 16, value: (row) => row.style_slug },
  { header: "Kullanım alanı", key: "industry", width: 16, value: (row) => row.industry },
  { header: "Ana renk", key: "color1", width: 14, value: (row) => row.color1 },
  { header: "İkinci renk", key: "color2", width: 14, value: (row) => row.color2 },
  { header: "Üçüncü renk", key: "color3", width: 14, value: (row) => row.color3 },
  { header: "Slogan", key: "slogan", width: 24, value: (row) => row.slogan },
  { header: "Slogan rengi", key: "sloganColor", width: 14, value: (row) => row.slogan_color },
  { header: "Tahmini adet", key: "quantityRange", width: 14, value: (row) => row.quantity_range },
  { header: "Teslim tarihi", key: "desiredDate", width: 14, value: (row) => row.desired_date },
  { header: "Not", key: "note", width: 36, value: (row) => row.note },
  {
    header: "Durum",
    key: "status",
    width: 14,
    value: (row) => REQUEST_STATUS_LABEL[row.status] ?? row.status,
  },
  { header: "Dil", key: "locale", width: 8, value: (row) => row.locale.toUpperCase() },
  {
    header: "Pazarlama izni",
    key: "marketingConsent",
    width: 14,
    value: (row) => (row.marketing_consent ? "Evet" : "Hayır"),
  },
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
  const status = (url.searchParams.get("status") ?? "") as RequestStatus | "";
  const productType = (url.searchParams.get("productType") ?? "") as ProductType | "";
  const locale = url.searchParams.get("locale") ?? "";
  const format = parseExportFormat(url.searchParams.get("format"));

  try {
    const rows = await listAllRequestsForExport({ q, status, productType, locale });
    return exportTableResponse({
      format,
      filenameBase: "talepler",
      sheetName: "Talepler",
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
