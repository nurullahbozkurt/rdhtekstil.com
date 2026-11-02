import ExcelJS from "exceljs";
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
  type FairVisitorStatus,
} from "@/lib/admin/fair-visitors";
import { assertSameOrigin } from "@/lib/security/origin";
import type { FairVisitorSource } from "@/lib/validation/fair-visitor";

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

  try {
    const rows = await listAllFairVisitorsForExport({ q, status, source });
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "RDH Tekstil";
    workbook.created = new Date();
    const sheet = workbook.addWorksheet("Fuar ziyaretçileri");

    sheet.columns = [
      { header: "Tarih", key: "createdAt", width: 20 },
      { header: "Ad Soyad", key: "fullName", width: 22 },
      { header: "Firma", key: "company", width: 22 },
      { header: "Görev", key: "jobTitle", width: 18 },
      { header: "Ülke", key: "country", width: 18 },
      { header: "E-posta", key: "email", width: 28 },
      { header: "Telefon", key: "phone", width: 18 },
      { header: "Ürün grubu", key: "productGroup", width: 16 },
      { header: "Tahmini adet", key: "quantityRange", width: 14 },
      { header: "Hedef teslim", key: "desiredDate", width: 14 },
      { header: "Görüşme notu", key: "notes", width: 36 },
      { header: "Kaynak", key: "source", width: 12 },
      { header: "Durum", key: "status", width: 18 },
      { header: "Dil", key: "locale", width: 8 },
      { header: "KVKK onay zamanı", key: "privacyConsentAt", width: 22 },
      { header: "KVKK sürüm", key: "privacyConsentVersion", width: 16 },
      { header: "İç not", key: "internalNote", width: 28 },
    ];

    sheet.getRow(1).font = { bold: true };

    for (const row of rows) {
      sheet.addRow({
        createdAt: row.created_at,
        fullName: row.full_name,
        company: row.company,
        jobTitle: row.job_title,
        country: formatCountryLabel(row.country),
        email: row.email,
        phone: row.phone,
        productGroup: FAIR_PRODUCT_GROUP_LABEL[row.product_group] ?? row.product_group,
        quantityRange: row.quantity_range,
        desiredDate: row.desired_date ?? "",
        notes: row.notes ?? "",
        source: FAIR_VISITOR_SOURCE_LABEL[row.source] ?? row.source,
        status: FAIR_VISITOR_STATUS_LABEL[row.status] ?? row.status,
        locale: row.locale.toUpperCase(),
        privacyConsentAt: row.privacy_consent_at,
        privacyConsentVersion: row.privacy_consent_version,
        internalNote: row.internal_note ?? "",
      });
    }

    const buffer = Buffer.from(await workbook.xlsx.writeBuffer());
    const stamp = new Date().toISOString().slice(0, 10);
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="fuar-ziyaretcileri-${stamp}.xlsx"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "export_failed" },
      { status: 500 },
    );
  }
}
