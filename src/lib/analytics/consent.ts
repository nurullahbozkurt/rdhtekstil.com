export type ConsentChoices = { analytics: boolean; marketing: boolean };

export type ConsentState = ConsentChoices & {
  necessary: true;
  version: number;
  updatedAt: string;
};

export const CONSENT_STORAGE_KEY = "rdh-consent";
/** Onay metni/kategorileri değişirse artırın; kullanıcıdan yeniden onay istenir. */
export const CONSENT_VERSION = 1;
export const CONSENT_EVENT = "rdh:consent-change";

export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    return parseConsent(window.localStorage.getItem(CONSENT_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function parseConsent(raw: string | null): ConsentState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    if (parsed.version !== CONSENT_VERSION) return null;
    return {
      necessary: true,
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
      version: CONSENT_VERSION,
      updatedAt: String(parsed.updatedAt ?? ""),
    };
  } catch {
    return null;
  }
}

export function writeConsent(choices: ConsentChoices): ConsentState {
  const state: ConsentState = {
    necessary: true,
    analytics: choices.analytics,
    marketing: choices.marketing,
    version: CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent<ConsentState>(CONSENT_EVENT, { detail: state }));
  return state;
}

export function hasAnalyticsConsent(): boolean {
  return readConsent()?.analytics === true;
}

/** Onay geri çekildiğinde Google Analytics çerezlerini temizler. */
export function clearAnalyticsCookies(): void {
  const host = window.location.hostname;
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0]?.trim();
    if (!name || !/^(_ga|_gid|_gat|_gcl)/.test(name)) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}
