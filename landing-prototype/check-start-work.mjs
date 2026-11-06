import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/Legion/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });

try {
  for (const width of [375, 768, 900, 1024, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto(process.env.PREVIEW_URL ?? "http://127.0.0.1:3000", { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    const list = page.locator("#start-work ul");
    const geometry = await list.evaluate((element) => {
      const cards = [...element.querySelectorAll("li")];
      const section = element.closest("section");
      const reasons = document.querySelector("#reasons");
      const faq = document.querySelector("#faq");
      const heading = cards[0].querySelector("h3");
      const headingStyle = getComputedStyle(heading);
      return {
        count: cards.length,
        headingCards: cards.map((card) => Boolean(card.querySelector("h3"))),
        descriptionCards: cards.map((card) => Boolean(card.querySelector("p"))),
        headingFontSize: headingStyle.fontSize,
        headingLineHeight: headingStyle.lineHeight,
        headingFontWeight: headingStyle.fontWeight,
        actionCards: cards.map((card) => Boolean(card.querySelector("a"))),
        actionHref: cards[0].querySelector("a")?.href,
        width: section.getBoundingClientRect().width,
        scrollWidth: element.scrollWidth,
        clientWidth: element.clientWidth,
        cardWidth: cards[0].getBoundingClientRect().width,
        cardHeight: cards[0].getBoundingClientRect().height,
        gap: cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().right,
        reasonsGap: section.getBoundingClientRect().top - reasons.getBoundingClientRect().bottom,
        faqGap: faq.getBoundingClientRect().top - section.getBoundingClientRect().bottom,
        pageOverflow: document.documentElement.scrollWidth > innerWidth,
      };
    });
    const mobile = width < 900;
    let keyboardScroll = true;
    let lastAligned = true;
    if (mobile) {
      await list.focus();
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(350);
      keyboardScroll = await list.evaluate((element) => element.scrollLeft > 0);
      await list.evaluate((element) => { element.scrollLeft = element.scrollWidth; });
      lastAligned = await list.evaluate((element) => Math.abs(element.lastElementChild.getBoundingClientRect().left - element.getBoundingClientRect().left) < 1);
    }
    if (width === 375 || width === 1440) {
      await list.evaluate((element) => { element.blur(); element.scrollLeft = 0; });
      await page.locator("#start-work").screenshot({ path: `preview-checks/start-work-${width}.png` });
    }
    const passed = response.status() === 200 && !errors.length && !geometry.pageOverflow && geometry.count === 4 && geometry.headingCards.every(Boolean) && geometry.descriptionCards.every(Boolean) && geometry.headingFontWeight === "500" && geometry.headingFontSize === (mobile ? "20px" : "24px") && geometry.headingLineHeight === (mobile ? "28px" : "32px") && geometry.actionCards.join() === "true,false,false,false" && geometry.actionHref === "https://platform.2gis.ru/" && geometry.width === Math.min(width - 32, 1168) && Math.abs(geometry.reasonsGap - (mobile ? 64 : 120)) < 1 && Math.abs(geometry.faqGap - (mobile ? 64 : 120)) < 1 && (mobile ? geometry.scrollWidth > geometry.clientWidth && Math.abs(geometry.gap - 12) < 1 && geometry.cardHeight >= 236 && keyboardScroll && lastAligned : geometry.scrollWidth === geometry.clientWidth && geometry.cardHeight >= 256);
    console.log(JSON.stringify({ width, passed, keyboardScroll, lastAligned, geometry, errors }));
    if (!passed) process.exitCode = 1;
    await page.close();
  }
  for (const width of [375, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const base = process.env.PREVIEW_URL ?? "http://127.0.0.1:3000";
    await page.goto(`${base}/start-work-preview`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    const variants = await page.evaluate(() => [3, 6].map((count) => {
      const section = document.querySelector(count === 3 ? "#start-work-three" : "#start-work-six");
      const list = section.querySelector("ul");
      const cards = [...list.querySelectorAll("li")];
      return { count: cards.length, headingCards: cards.map((card) => Boolean(card.querySelector("h3"))), actionCards: cards.map((card) => Boolean(card.querySelector("a"))), columns: getComputedStyle(list).gridTemplateColumns.split(" ").length, scrollable: list.scrollWidth > list.clientWidth };
    }));
    const passed = variants[0].count === 3 && variants[1].count === 6 && variants[0].headingCards.every((hasHeading) => !hasHeading) && variants[1].headingCards.every(Boolean) && variants.every((variant) => variant.actionCards[0] && variant.actionCards.slice(1).every((hasAction) => !hasAction)) && (width === 1440 ? variants[0].columns === 3 && variants[1].columns === 3 : variants.every((variant) => variant.scrollable));
    await page.locator("#start-work-six").screenshot({ path: `preview-checks/start-work-variant-six-${width}.png` });
    console.log(JSON.stringify({ width, variants, passed }));
    if (!passed) process.exitCode = 1;
    await page.close();
  }
} finally {
  await browser.close();
}
