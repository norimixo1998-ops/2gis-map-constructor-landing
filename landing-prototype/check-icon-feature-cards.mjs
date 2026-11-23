import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/Legion/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });

try {
  for (const width of [375, 768, 1024, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto("http://127.0.0.1:3000/icon-feature-cards-preview", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const result = await page.evaluate(() => {
      const section = document.querySelector("#icon-feature-cards");
      const longSection = document.querySelector("#long-copy");
      const cards = [...section.querySelectorAll("li")];
      const longCards = [...longSection.querySelectorAll("li")];
      const icons = [...document.querySelectorAll("#icon-feature-cards li img")];
      const longHeights = longCards.map((card) => Math.round(card.getBoundingClientRect().height));
      const firstRowEqual = longHeights.slice(0, innerWidth >= 1080 ? 3 : innerWidth >= 700 ? 2 : 1).every((height) => height === longHeights[0]);
      const gaps = [...longSection.querySelectorAll("li img")].map((icon) => {
        const description = icon.closest("li").querySelector("p");
        return Math.round(icon.getBoundingClientRect().top - description.getBoundingClientRect().bottom);
      });
      return {
        cardCount: cards.length,
        iconCount: icons.length,
        iconsLoaded: icons.every((icon) => icon.complete && icon.naturalWidth > 0),
        ctaLinks: cards.at(-1).querySelectorAll("a").length,
        columns: getComputedStyle(section.querySelector("ul")).gridTemplateColumns.split(" ").length,
        cardWidth: Math.round(cards[0].getBoundingClientRect().width),
        cardHeight: Math.round(cards[0].getBoundingClientRect().height),
        longHeights,
        firstRowEqual,
        minIconGap: Math.min(...gaps),
        overflow: document.documentElement.scrollWidth > innerWidth,
      };
    });
    if (width === 375 || width === 1440) {
      await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
      await page.locator("#icon-feature-cards").screenshot({ path: `preview-checks/icon-feature-cards-${width}.png` });
      await page.locator("#long-copy").screenshot({ path: `preview-checks/icon-feature-cards-long-${width}.png` });
    }
    const expectedColumns = width >= 1080 ? 3 : width >= 700 ? 2 : 1;
    const passed = response.status() === 200 && errors.length === 0 && !result.overflow && result.cardCount === 6 && result.iconCount === 5 && result.iconsLoaded && result.ctaLinks === 2 && result.columns === expectedColumns && result.cardHeight >= 320 && result.firstRowEqual && result.minIconGap >= 24;
    console.log(JSON.stringify({ width, passed, ...result, errors }));
    if (!passed) process.exitCode = 1;
    await page.close();
  }
} finally {
  await browser.close();
}
