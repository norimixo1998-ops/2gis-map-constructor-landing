import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/Legion/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
await mkdir("preview-checks", { recursive: true });

const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
try {
  for (const width of [375, 390, 768, 900, 1024, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1100 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto(process.env.PREVIEW_URL ?? "http://127.0.0.1:3000", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const geometry = await page.evaluate(() => {
      const section = document.querySelector("#reasons");
      const list = section.querySelector("ul");
      const cards = [...list.querySelectorAll("li")];
      const images = cards.map((card) => card.querySelector("img"));
      const hero = document.querySelector("main > section:first-child");
      const startWork = document.querySelector("#start-work");
      return {
        pageOverflow: document.documentElement.scrollWidth > innerWidth,
        sectionWidth: section.getBoundingClientRect().width,
        heroToReasons: section.getBoundingClientRect().top - hero.getBoundingClientRect().bottom,
        reasonsToStartWork: startWork.getBoundingClientRect().top - section.getBoundingClientRect().bottom,
        count: cards.length,
        listWidth: list.clientWidth,
        listScrollWidth: list.scrollWidth,
        firstWidth: cards[0].getBoundingClientRect().width,
        firstHeight: cards[0].getBoundingClientRect().height,
        gap: cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().right,
        iconGeometry: images.map((image) => ({ loaded: image.complete && image.naturalWidth === 192 && image.naturalHeight === 192, width: image.getBoundingClientRect().width, height: image.getBoundingClientRect().height })),
        link: cards[2].querySelector("a")?.href,
      };
    });
    const mobile = width <= 899;
    if (width === 375 || width === 1440) {
      await page.locator("#reasons").screenshot({ path: `preview-checks/reasons-${width}.png` });
      await page.screenshot({ path: `preview-checks/reasons-landing-${width}.png`, fullPage: true });
    }
    let keyboardScroll = true;
    let lastReachable = true;
    let lastAligned = true;
    if (mobile) {
      const list = page.locator("#reasons ul");
      await list.focus();
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(350);
      keyboardScroll = await list.evaluate((element) => element.scrollLeft > 0);
      await list.evaluate((element) => element.scrollTo({ left: element.scrollWidth, behavior: "instant" }));
      await page.waitForTimeout(100);
      lastReachable = await list.evaluate((element) => element.lastElementChild.getBoundingClientRect().right <= element.getBoundingClientRect().right + 1);
      lastAligned = await list.evaluate((element) => {
        element.scrollLeft = element.scrollWidth;
        const lastCard = element.querySelector("li:last-of-type");
        return Math.abs(lastCard.getBoundingClientRect().left - element.getBoundingClientRect().left) < 1;
      });
    }
    const expectedSectionWidth = Math.min(width - 32, 1168);
    const passed = response?.status() === 200 && !errors.length && !geometry.pageOverflow && geometry.count === 4 && geometry.sectionWidth === expectedSectionWidth && geometry.iconGeometry.every((icon) => icon.loaded && icon.width === 96 && icon.height === 96) && geometry.link === "https://dev.2gis.ru/company" && Math.abs(geometry.heroToReasons - (mobile ? 64 : 120)) < 1 && Math.abs(geometry.reasonsToStartWork - (mobile ? 64 : 120)) < 1 && (mobile ? geometry.listScrollWidth > geometry.listWidth && Math.abs(geometry.gap - 12) < 1 && geometry.firstHeight >= 236 && keyboardScroll && lastReachable && lastAligned : geometry.listScrollWidth === geometry.listWidth && geometry.firstHeight >= 304);
    console.log(JSON.stringify({ width, passed, keyboardScroll, lastReachable, lastAligned, geometry, errors }));
    if (!passed) process.exitCode = 1;
    await page.close();
  }
} finally {
  await browser.close();
}
