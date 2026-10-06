"use client";

import Script from "next/script";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  clearMarketingCookies,
  CONSENT_EVENT,
  CONSENT_STORAGE_KEY,
  parseConsent,
  writeConsent,
  type ConsentChoices,
  type ConsentState,
} from "@/lib/analytics/consent";
import { CookieBanner, type CookieBannerText } from "./cookie-banner";

type ConsentContextValue = {
  consent: ConsentState | null;
  save: (choices: ConsentChoices) => void;
  openPreferences: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readRawConsent(): string | null {
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function useConsent(): ConsentContextValue {
  const value = useContext(ConsentContext);
  if (!value) throw new Error("useConsent, ConsentProvider içinde kullanılmalıdır.");
  return value;
}

export function ConsentProvider({
  children,
  gtmId,
  text,
  policyHref,
}: {
  children: ReactNode;
  gtmId?: string;
  text: CookieBannerText;
  policyHref: string;
}) {
  // Sunucuda `undefined` (bilinmiyor); istemcide localStorage'daki ham değer.
  const raw = useSyncExternalStore(subscribe, readRawConsent, () => undefined);
  const ready = raw !== undefined;
  const consent = useMemo(() => parseConsent(raw ?? null), [raw]);
  const [panelOverride, setPanelOpen] = useState<boolean | null>(null);
  const panelOpen = panelOverride ?? consent === null;

  const save = useCallback(
    (choices: ConsentChoices) => {
      const next = { analytics: true as const, marketing: choices.marketing };
      const revoked = Boolean(consent?.marketing && !next.marketing);
      writeConsent(next);
      setPanelOpen(false);
      if (revoked) {
        clearMarketingCookies();
        window.location.reload();
      }
    },
    [consent],
  );

  const value = useMemo<ConsentContextValue>(
    () => ({ consent, save, openPreferences: () => setPanelOpen(true) }),
    [consent, save],
  );

  // Analitik her tercih sonrası açıktır; GTM onay kaydı oluşunca yüklenir.
  const loadTags = Boolean(gtmId && consent);

  return (
    <ConsentContext.Provider value={value}>
      {children}
      {ready && panelOpen ? (
        <CookieBanner
          text={text}
          policyHref={policyHref}
          initial={consent ?? { analytics: true, marketing: false }}
          onSave={save}
          dismissible={consent !== null}
          onClose={() => setPanelOpen(false)}
        />
      ) : null}
      {loadTags && consent ? <GoogleTagManager id={gtmId as string} consent={consent} /> : null}
    </ConsentContext.Provider>
  );
}

/** GTM yalnızca kullanıcı onay verdikten sonra DOM'a eklenir. */
function GoogleTagManager({ id, consent }: { id: string; consent: ConsentState }) {
  const g = (granted: boolean) => (granted ? "granted" : "denied");
  const consentDefaults = JSON.stringify({
    analytics_storage: g(consent.analytics),
    ad_storage: g(consent.marketing),
    ad_user_data: g(consent.marketing),
    ad_personalization: g(consent.marketing),
  });
  return (
    <Script id="gtm-loader" strategy="afterInteractive">
      {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',${consentDefaults});
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(id)});`}
    </Script>
  );
}
