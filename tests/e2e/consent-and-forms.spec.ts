import { test as base, expect } from "@playwright/test";
import { test } from "./fixtures";

base.describe("çerez onayı", () => {
  base("onay verilmeden analytics yüklenmez; tercih kaydedilir", async ({ page }) => {
    const tagRequests: string[] = [];
    page.on("request", (req) => {
      if (/googletagmanager|google-analytics/.test(req.url())) tagRequests.push(req.url());
    });

    await page.goto("/tr");
    const banner = page.getByTestId("cookie-banner");
    await expect(banner).toBeVisible();
    expect(await page.locator('script#gtm-loader, script[src*="googletagmanager"]').count()).toBe(
      0,
    );
    expect(tagRequests).toHaveLength(0);

    await banner.getByRole("button", { name: "Yalnızca gerekli" }).click();
    await expect(banner).toBeHidden();
    await page.reload();
    await expect(page.getByTestId("cookie-banner")).toBeHidden();
    expect(tagRequests).toHaveLength(0);

    const stored = await page.evaluate(() => window.localStorage.getItem("rdh-consent"));
    expect(JSON.parse(stored ?? "{}")).toMatchObject({ analytics: false, marketing: false });
  });

  base("tercihler footer'dan yeniden açılabilir", async ({ page }) => {
    await page.goto("/en");
    await page.getByTestId("cookie-banner").getByRole("button", { name: "Accept all" }).click();
    await page.getByRole("contentinfo").getByRole("button", { name: "Cookie Preferences" }).click();
    await expect(page.getByTestId("cookie-banner")).toBeVisible();
  });
});

test.describe("iletişim formu (Faz 1: yalnızca arayüz)", () => {
  test("boş gönderimde alan bazlı hata gösterir", async ({ page }) => {
    await page.goto("/tr/iletisim");
    await page.getByRole("button", { name: "Projemi Gönder" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "düzeltilmesi gereken" })).toBeVisible();
    await expect(page.getByLabel(/Ad Soyad/)).toHaveAttribute("aria-invalid", "true");
    await expect(
      page
        .getByText("Geçerli bir e-posta")
        .or(page.getByText("Bu alanı doldurmanız gerekiyor."))
        .first(),
    ).toBeVisible();
  });

  test("geçerli girişte veri gönderilmeden bilgilendirme gösterir", async ({ page }) => {
    const posts: string[] = [];
    page.on("request", (req) => {
      if (req.method() === "POST") posts.push(req.url());
    });
    await page.goto("/en/contact");
    await page.getByLabel(/Full Name/).fill("Test User");
    await page.getByLabel(/^Email/).fill("test@example.com");
    await page.getByLabel(/Message/).fill("We would like 500 jacquard scarves for our club.");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Send My Project" }).click();
    await expect(page.getByTestId("contact-phase-notice")).toBeVisible();
    expect(posts).toHaveLength(0);
  });
});
