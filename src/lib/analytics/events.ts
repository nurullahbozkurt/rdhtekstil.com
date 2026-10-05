import { hasAnalyticsConsent } from "./consent";

/**
 * dataLayer event'leri. Parametreler kişisel veri (ad, e-posta, telefon) İÇERMEZ;
 * yalnızca içerik kimlikleri ve konum bilgisi taşır.
 * Faz 2'de form/talep event'leri bu haritaya eklenecek.
 */
export type AnalyticsEvents = {
  view_product: { product_id: string; category_id: string };
  view_industry: { industry_id: string };
  view_case_study: { case_study_id: string };
  whatsapp_click: { location: string };
  email_click: { location: string };
};

export type AnalyticsEventName = keyof AnalyticsEvents;

export function track<E extends AnalyticsEventName>(event: E, params: AnalyticsEvents[E]): void {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
}
