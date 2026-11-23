import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/Legion/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });

try {
  for (const route of ["/", "/geoflow-holiday", "/image-feature-cards-preview", "/icon-feature-cards-preview"]) {
    for (const width of [390, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      const response = await page.goto(`http://127.0.0.1:3000${route}`, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const headings = await page.evaluate(() => [...document.querySelectorAll("main h1, main h2")].map((element) => {
        const style = getComputedStyle(element);
        return {
          tag: element.tagName,
          section: element.closest("section")?.id ?? "",
          size: style.fontSize,
          lineHeight: style.lineHeight,
          weight: style.fontWeight,
          text: element.textContent?.trim(),
        };
      }));
      const expected = width === 390
        ? { H1: ["40px", "44px"], H2: ["30px", "38px"] }
        : { H1: ["56px", "68px"], H2: ["44px", "52px"] };
      const deviations = headings.filter(({ tag, section, size, lineHeight, weight }) => {
        const [expectedSize, expectedLineHeight] = width === 390 && section === "lead-form"
          ? ["24px", "28px"]
          : expected[tag];
        return size !== expectedSize || lineHeight !== expectedLineHeight || weight !== "500";
      });
      console.log(JSON.stringify({ route, width, status: response?.status(), headings: headings.length, deviations }));
      if (response?.status() !== 200 || deviations.length || !headings.length) process.exitCode = 1;
      await page.close();
    }
  }
} finally {
  await browser.close();
}
