import { test } from "./fixtures";

/**
 * Görsel kontrol için tam sayfa ekran görüntüleri (CI'da çalışmaz).
 * Çalıştırma: CAPTURE=1 npx playwright test screenshots
 */
const PAGES = [
  "/tr",
  "/tr/urunler",
  "/tr/bere-uretimi",
  "/tr/atki-uretimi/troisdorf-jets-taraftar-atkisi",
  "/tr/taraftar-atkisi",
  "/tr/ozel-uretim",
  "/tr/referanslar",
  "/tr/hakkimizda",
  "/tr/iletisim",
  "/tr/talep?urun=troisdorf-jets-bere",
  "/en",
];

test.skip(!process.env.CAPTURE, "CAPTURE=1 ile çalıştırın");

for (const path of PAGES) {
  test(`ekran görüntüsü ${path}`, async ({ page }, info) => {
    const res = await page.goto(path);
    if (!res?.ok()) throw new Error(`${path} → ${res?.status()}`);
    await page.waitForLoadState("networkidle");
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(400);
    const name = path.replace(/[/?=]+/g, "_").replace(/^_/, "") || "root";
    const { width, height } = await page.evaluate(() => ({
      width: document.documentElement.clientWidth,
      height: document.documentElement.scrollHeight,
    }));
    const step = info.project.name === "mobile" ? 900 : 1300;
    for (let y = 0, i = 0; y < height; y += step, i++) {
      await page.screenshot({
        path: `test-results/screens/${info.project.name}-${name}-${String(i).padStart(2, "0")}.png`,
        fullPage: true,
        clip: { x: 0, y, width, height: Math.min(step, height - y) },
      });
    }
  });
}
