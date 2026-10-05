"use client";

import { useConsent } from "./consent-provider";

export function CookiePreferencesButton({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const { openPreferences } = useConsent();
  return (
    <button type="button" onClick={openPreferences} className={className}>
      {label}
    </button>
  );
}
