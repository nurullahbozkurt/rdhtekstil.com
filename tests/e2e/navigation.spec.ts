import { expect, test } from "./fixtures";

test.describe("dil yönlendirmesi", () => {
  test("kök adres tarayıcı diline göre yönlendirir", async ({ request }) => {
    const tr = await request.get("/", {
      maxRedirects: 0,
      headers: { "accept-language": "tr-TR,tr;q=0.9" },
    });
    expect(tr.status()).toBe(307);
    expect(tr.headers().location).toBe("/tr");

    const en = await request.get("/", {
      maxRedirects: 0,
      headers: { "accept-language": "en-US,en;q=0.9" },
    });
    expect(en.headers().location).toBe("/en");

    const other = await request.get("/", { maxRedirects: 0, headers: { "accept-language": "ja" } });
    expect(other.headers().location).toBe("/tr");
  });

  test("dil önekisiz alt yol yönlendirilir", async ({ request }) => {
    const res = await request.get("/bere-uretimi", {
      maxRedirects: 0,
      headers: { "accept-language": "tr" },
    });
    expect(res.headers().location).toBe("/tr/bere-uretimi");
  });
});

test.describe("gezinme", () => {
  test("TR ana sayfa ve ana CTA", async ({ page, isMobile }) => {
    await page.goto("/tr");
    await expect(page).toHaveTitle(/RDH Tekstil/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Markanıza Özel Bere ve Atkı Üretimi",
    );
    await expect(page.locator("html")).toHaveAttribute("lang", "tr");
    const cta = page.getByTestId("header-cta");
    if (!isMobile) {
      await expect(cta).toHaveAttribute("href", "/tr/talep");
    }
  });

  test("EN ana sayfa", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Custom Beanies and Scarves, Made for Your Brand",
    );
  });

  test("dil seçici aynı sayfanın karşılığına gider", async ({ page }) => {
    await page.goto("/tr/bere-uretimi");
    await page.getByRole("contentinfo").getByRole("link", { name: "English" }).click();
    await expect(page).toHaveURL(/\/en\/beanie-manufacturing$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("kategori → ürün → talep (?urun=)", async ({ page }) => {
    await page.goto("/tr/bere-uretimi");
    await page
      .getByRole("link", { name: /Troisdorf Jets/ })
      .first()
      .click();
    await expect(page).toHaveURL(/\/tr\/bere-uretimi\/[a-z0-9-]+$/);
    const cta = page.getByTestId("product-request-cta");
    await expect(cta).toHaveAttribute("href", /\/tr\/talep\?urun=troisdorf-jets-bere$/);
    await cta.click();
    await expect(page).toHaveURL(/\/tr\/talep\?urun=troisdorf-jets-bere$/);
    await expect(page.getByTestId("request-prefill")).toContainText("Troisdorf Jets");
    await expect(page.getByTestId("request-phase-notice")).toBeVisible();
  });

  test("kullanım alanı → talep (?alan=)", async ({ page }) => {
    await page.goto("/en/fan-scarves");
    const cta = page.getByTestId("industry-request-cta");
    await expect(cta).toHaveAttribute("href", "/en/request?alan=fans");
    await cta.click();
    await expect(page.getByTestId("request-prefill")).toContainText("Fan");
  });

  test("kategori filtresi ürünleri daraltır", async ({ page }) => {
    await page.goto("/tr/bere-uretimi");
    const items = page.locator("main ul li article");
    const total = await items.count();
    await page.getByRole("button", { name: /Çocuk/ }).click();
    await expect(page.getByRole("button", { name: /Çocuk/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(await items.count()).toBeLessThan(total);
  });

  test("bilinmeyen adres 404 döner", async ({ page }) => {
    const res = await page.goto("/tr/olmayan-sayfa");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

test.describe("mobil", () => {
  test.skip(({ isMobile }) => !isMobile, "Yalnızca mobil");

  test("sticky CTA ve menü", async ({ page }) => {
    await page.goto("/tr");
    const sticky = page.getByTestId("sticky-cta");
    await expect(sticky).toBeVisible();
    await expect(sticky.getByRole("link")).toHaveAttribute("href", "/tr/talep");

    await page.getByRole("button", { name: "Menüyü aç" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("link", { name: "Hakkımızda" }).click();
    await expect(page).toHaveURL(/\/tr\/hakkimizda$/);
  });

  test("talep sayfasında sticky CTA gizlenir", async ({ page }) => {
    await page.goto("/tr/talep");
    await expect(page.getByTestId("sticky-cta")).toHaveCount(0);
  });

  test("yatay taşma yok", async ({ page }) => {
    for (const path of ["/tr", "/tr/bere-uretimi", "/tr/iletisim", "/en/references"]) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow, path).toBeLessThanOrEqual(1);
    }
  });
});
