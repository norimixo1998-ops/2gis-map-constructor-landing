import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/Legion/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });

try {
  await mkdir("preview-checks", { recursive: true });
  for (const width of [375, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    const response = await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const section = page.locator("#intermediate-cta");
    const before = await section.evaluate(block => {
      const card = block.querySelector('[class*="card"]');
      const visual = block.querySelector('[class*="visual"]');
      const actions = block.querySelector('[class*="actions"]');
      const previous = document.querySelector("#product-demonstration");
      const next = document.querySelector("#reasons");
      return {
        cardHeight: Math.round(card.getBoundingClientRect().height),
        visualHeight: Math.round(visual.getBoundingClientRect().height),
        visualWidth: Math.round(visual.getBoundingClientRect().width),
        visualBeforeAction: visual.getBoundingClientRect().bottom < actions.getBoundingClientRect().top,
        gapBefore: Math.round(block.getBoundingClientRect().top - previous.getBoundingClientRect().bottom),
        gapAfter: Math.round(next.getBoundingClientRect().top - block.getBoundingClientRect().bottom),
        imageLoaded: visual.querySelector("img")?.complete && visual.querySelector("img")?.naturalWidth > 0,
        imageSource: visual.querySelector("img")?.currentSrc,
        buttonCount: [...actions.querySelectorAll("a")].filter(a => getComputedStyle(a).display !== "none").length,
        scrollWidth: document.documentElement.scrollWidth,
      };
    });
    await section.screenshot({ path: `preview-checks/intermediate-cta-${width}.png` });
    if (width !== 768) await page.screenshot({ path: `preview-checks/landing-current-${width}.png`, fullPage: true });
    const after = await section.evaluate(block => {
      block.querySelector("h2").textContent = "Заголовок промежуточного призыва к действию, который занимает несколько строк и подробно объясняет следующий шаг для посетителя";
      block.querySelector("p").textContent = "Более подробное описание продукта и действия. Этот текст может занимать несколько строк и должен увеличивать карточку без наложения на иллюстрацию или кнопки.";
      return {
        cardHeight: Math.round(block.querySelector('[class*="card"]').getBoundingClientRect().height),
        visualHeight: Math.round(block.querySelector('[class*="visual"]').getBoundingClientRect().height),
        scrollWidth: document.documentElement.scrollWidth,
      };
    });
    if (width !== 768) await section.screenshot({ path: `preview-checks/intermediate-cta-long-${width}.png` });
    const mobile = width <= 899;
    const spacing = width <= 699 ? 64 : 120;
    const passed = response.status() === 200 && !errors.length && before.imageLoaded && before.imageSource.endsWith(mobile ? "mobile_image.png" : "desktop_image.png") && before.scrollWidth <= width && after.scrollWidth <= width && before.gapBefore === spacing && before.gapAfter === spacing && before.buttonCount === (mobile ? 1 : 2) && (mobile ? before.visualBeforeAction : !before.visualBeforeAction) && after.cardHeight > before.cardHeight && (mobile || after.visualHeight > before.visualHeight);
    console.log(`${width}px ${passed ? "PASS" : "FAIL"} ${JSON.stringify({ before, after, errors })}`);
    if (!passed) process.exitCode = 1;
    await page.close();
  }
} finally {
  await browser.close();
}
