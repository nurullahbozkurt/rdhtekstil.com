import type { ProductType, RequestStatus } from "@/lib/admin/requests";

export const REQUEST_STATUS_LABEL: Record<RequestStatus, string> = {
  NEW: "Yeni",
  IN_REVIEW: "İnceleniyor",
  REPLIED: "Yanıtlandı",
};

export const REQUEST_PRODUCT_LABEL: Record<ProductType, string> = {
  BEANIE: "Bere",
  SCARF: "Atkı",
  SET: "Set",
};

export const REQUEST_FILE_KIND_LABEL: Record<string, string> = {
  LOGO: "Logo",
  REFERENCE: "Örnek model",
  OTHER: "Diğer",
};

export function requestStatusClass(status: RequestStatus): string {
  switch (status) {
    case "NEW":
      return "bg-gold-500/20 text-navy-900 ring-gold-500/40";
    case "IN_REVIEW":
      return "bg-navy-800/10 text-navy-900 ring-navy-800/20";
    case "REPLIED":
      return "bg-cream-200 text-navy-700 ring-cream-400/60";
  }
}

export function formatAdminDate(
  value: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: "short", timeStyle: "short" },
) {
  return new Intl.DateTimeFormat("tr-TR", options).format(new Date(value));
}
