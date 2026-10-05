import { hasAnalyticsConsent } from "./consent";

/**
 * dataLayer event'leri. Parametreler kişisel veri (ad, e-posta, telefon) İÇERMEZ;
 * yalnızca içerik kimlikleri ve konum bilgisi taşır.
 */
export type AnalyticsEvents = {
  view_product: { product_id: string; category_id: string };
  view_industry: { industry_id: string };
  view_case_study: { case_study_id: string };
  whatsapp_click: { location: string };
  email_click: { location: string };
  start_request: Record<string, never>;
  select_product: { product_type: string };
  select_model: { model: string };
  select_color: Record<string, never>;
  upload_logo: Record<string, never>;
  upload_reference: Record<string, never>;
  submit_request: Record<string, never>;
  contact_submit: Record<string, never>;
};

export type AnalyticsEventName = keyof AnalyticsEvents;

export function track<E extends AnalyticsEventName>(
  event: E,
  params: AnalyticsEvents[E] = {} as AnalyticsEvents[E],
): void {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
}
