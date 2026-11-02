import {
  FAIR_PRODUCT_GROUP_LABEL,
  FAIR_VISITOR_STATUS_LABEL,
} from "@/lib/admin/fair-visitor-labels";
import { formatCountryLabel } from "@/lib/admin/countries";
import type { FairVisitorStatus } from "@/lib/admin/fair-visitors";
import type { FairProductGroup } from "@/lib/validation/fair-visitor";

export const FAIR_VISITOR_EDITABLE_FIELD_LABEL: Record<string, string> = {
  full_name: "Ad Soyad",
  company: "Firma",
  job_title: "Görev",
  country: "Ülke",
  email: "E-posta",
  phone: "Telefon",
  product_group: "Ürün grubu",
  quantity_range: "Tahmini adet",
  desired_date: "Hedef teslim",
  notes: "Görüşme notu",
  status: "Durum",
  internal_note: "İç not",
};

export type FairVisitorChange = {
  field: string;
  from: string | null;
  to: string | null;
};

export function formatFairVisitorFieldValue(field: string, value: string | null): string {
  if (value == null || value === "") return "—";
  if (field === "status") {
    return FAIR_VISITOR_STATUS_LABEL[value as FairVisitorStatus] ?? value;
  }
  if (field === "product_group") {
    return FAIR_PRODUCT_GROUP_LABEL[value as FairProductGroup] ?? value;
  }
  if (field === "country") {
    return formatCountryLabel(value);
  }
  return value;
}
