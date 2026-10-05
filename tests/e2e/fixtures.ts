import { test as base, expect } from "@playwright/test";

/** Çerez bannerı testleri engellemesin diye "yalnızca gerekli" tercihini önceden kaydeder. */
export const test = base.extend<{ withConsent: void }>({
  withConsent: [
    async ({ page }, use) => {
      await page.addInitScript(() => {
        window.localStorage.setItem(
          "rdh-consent",
          JSON.stringify({
            necessary: true,
            analytics: false,
            marketing: false,
            version: 1,
            updatedAt: "2026-01-01",
          }),
        );
      });
      await use();
    },
    { auto: true },
  ],
});

export { expect };
