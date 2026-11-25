import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/Legion/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });

try {
  for (const width of [375, 768, 1024, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    const response = await page.goto("http://127.0.0.1:3001/geoflow-hero-preview");
    await page.evaluate(() => document.fonts.ready);
    const result = await page.locator("#connect").evaluate((section) => {
      const heading = section.querySelector("h2").getBoundingClientRect();
      const description = section.querySelector("p");
      const paragraph = description.getBoundingClientRect();
      const intro = section.querySelector("div").querySelector("div").getBoundingClientRect();
      const form = section.querySelector("form").getBoundingClientRect();
      const descriptionStyle = getComputedStyle(description);
      return {
        headingGap: paragraph.top - heading.bottom,
        bottomGap: form.bottom - intro.bottom,
        descriptionSize: descriptionStyle.fontSize,
        descriptionColor: descriptionStyle.color,
        fieldCount: section.querySelectorAll("input").length,
        anchorCount: document.querySelectorAll('a[href="#connect"]').length,
        overflow: document.documentElement.scrollWidth > window.innerWidth,
      };
    });
    await page.locator("#connect").screenshot({ path: `preview-checks/optional-cta-form-${width}.png` });
    if (width === 1440) {
      await page.locator("#delivery-scenarios h2").screenshot({ path: "preview-checks/delivery-scenarios-heading-1440.png" });
      await page.locator("#capabilities h2").screenshot({ path: "preview-checks/capabilities-heading-1440.png" });
      await page.locator("#connect button[type=submit]").click();
      const errorAlignment = await page.locator("#connect").evaluate((section) => {
        const headingTop = section.querySelector("h2").getBoundingClientRect().top;
        const firstFieldTop = section.querySelector("input").closest("label").getBoundingClientRect().top;
        return { offset: firstFieldTop - headingTop, errors: section.querySelectorAll('[role="alert"]').length };
      });
      if (Math.abs(errorAlignment.offset) > 1 || errorAlignment.errors < 2) throw new Error(`error alignment: ${JSON.stringify(errorAlignment)}`);
    }
    if (response?.status() !== 200 || Math.abs(result.headingGap - 20) > 1 || (width >= 1080 && Math.abs(result.bottomGap) > 1) || result.descriptionSize !== "16px" || result.descriptionColor !== "rgb(255, 255, 255)" || result.fieldCount !== 4 || result.anchorCount < 2 || result.overflow) {
      throw new Error(`${width}px: ${JSON.stringify(result)}`);
    }
    console.log(`${width}px: ${JSON.stringify(result)}`);
    await page.close();
  }
} finally {
  await browser.close();
}
