import { expect, test } from "./fixtures";

test.describe("SEO", () => {
  test.skip(({ isMobile }) => isMobile, "Masaüstünde bir kez çalışır");

  test("robots.txt ve sitemap.xml", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBe(true);
    expect(await robots.text()).toContain("Sitemap:");

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBe(true);
    const xml = await sitemap.text();
    expect(xml).toContain("/tr/bere-uretimi");
    expect(xml).toContain("/en/beanie-manufacturing");
    expect(xml).toContain('hreflang="en"');
    expect(xml).not.toContain("/tr/talep");
    expect(xml).not.toContain("/en/request");
  });

  test("talep sayfaları noindex", async ({ page }) => {
    for (const path of ["/tr/talep", "/tr/talep/tamamlandi", "/en/request"]) {
      await page.goto(path);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    }
  });

  test("sitemap'teki her sayfa çalışır ve SEO alanları doludur", async ({ page, request }) => {
    test.setTimeout(180_000);
    const xml = await (await request.get("/sitemap.xml")).text();
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1] ?? "").pathname);
    expect(urls.length).toBeGreaterThan(50);

    for (const path of urls) {
      const res = await page.goto(path);
      expect(res?.status(), path).toBe(200);
      await expect(page.locator("h1"), path).toHaveCount(1);
      const title = await page.title();
      expect(title.length, `${path} title`).toBeGreaterThan(10);
      await expect(page.locator('meta[name="description"]'), path).toHaveAttribute(
        "content",
        /.{50,}/,
      );
      await expect(page.locator('link[rel="canonical"]'), path).toHaveAttribute(
        "href",
        /^https?:\/\//,
      );
      await expect(page.locator('link[rel="alternate"][hreflang="tr"]'), path).toHaveCount(1);
      await expect(page.locator('link[rel="alternate"][hreflang="en"]'), path).toHaveCount(1);
      await expect(page.locator('meta[property="og:title"]'), path).toHaveCount(1);
      await expect(page.locator('meta[property="og:image"]'), path).toHaveCount(1);
    }
  });

  test("ürün sayfasında Product ve BreadcrumbList JSON-LD", async ({ page }) => {
    await page.goto("/tr/bere-uretimi");
    await page
      .getByRole("link", { name: /Troisdorf Jets/ })
      .first()
      .click();
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = blocks.map((b) => (JSON.parse(b) as { "@type": string })["@type"]);
    expect(types).toEqual(expect.arrayContaining(["Organization", "Product", "BreadcrumbList"]));
  });

  test("ana sayfada FAQPage JSON-LD", async ({ page }) => {
    await page.goto("/tr");
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = blocks.map((b) => (JSON.parse(b) as { "@type": string })["@type"]);
    expect(types).toEqual(expect.arrayContaining(["Organization", "FAQPage"]));
  });
});
