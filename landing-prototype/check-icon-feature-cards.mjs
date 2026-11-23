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
      const singleActionSection = document.querySelector("#single-action");
      const withoutCtaSection = document.querySelector("#without-cta");
      const threeCardSection = document.querySelector("#three-cards");
      const twoWithCtaSection = document.querySelector("#two-with-cta");
      const twoCardSection = document.querySelector("#two-cards");
      const cards = [...section.querySelectorAll("li")];
      const longCards = [...longSection.querySelectorAll("li")];
      const withoutCtaCards = [...withoutCtaSection.querySelectorAll("li")];
      const mainList = section.querySelector("ul");
      const threeList = threeCardSection.querySelector("ul");
      const twoWithCtaList = twoWithCtaSection.querySelector("ul");
      const twoList = twoCardSection.querySelector("ul");
      const icons = [...document.querySelectorAll("#icon-feature-cards li img")];
      const longHeights = longCards.map((card) => Math.round(card.getBoundingClientRect().height));
      const firstRowEqual = longHeights.slice(0, innerWidth >= 1080 ? 3 : innerWidth >= 700 ? 2 : 1).every((height) => height === longHeights[0]);
      const gaps = [...longSection.querySelectorAll("li img")].map((icon) => {
        const description = icon.closest("li").querySelector("p");
        return Math.round(icon.getBoundingClientRect().top - description.getBoundingClientRect().bottom);
      });
      function reachesLastCard(list) {
        list.scrollLeft = list.scrollWidth;
        const listRect = list.getBoundingClientRect();
        const lastRect = list.querySelector("li:last-child").getBoundingClientRect();
        const reached = list.scrollLeft > 0 && lastRect.left >= listRect.left - 1 && lastRect.right <= listRect.right + 1;
        list.scrollLeft = 0;
        return reached;
      }
      return {
        cardCount: cards.length,
        iconCount: icons.length,
        iconsLoaded: icons.every((icon) => icon.complete && icon.naturalWidth > 0),
        ctaLinks: cards.at(-1).querySelectorAll("a").length,
        ctaButtonGap: Math.round(cards.at(-1).querySelectorAll("a")[1].getBoundingClientRect().top - cards.at(-1).querySelectorAll("a")[0].getBoundingClientRect().bottom),
        singleActionLinks: singleActionSection.querySelectorAll("li:last-child a").length,
        withoutCtaCount: withoutCtaCards.length,
        withoutCtaLinks: withoutCtaSection.querySelectorAll("a").length,
        withoutCtaLastWidth: Math.round(withoutCtaCards.at(-1).getBoundingClientRect().width),
        withoutCtaGridWidth: Math.round(withoutCtaSection.querySelector("ul").getBoundingClientRect().width),
        withoutCtaLastRight: Math.round(withoutCtaCards.at(-1).getBoundingClientRect().right),
        withoutCtaGridRight: Math.round(withoutCtaSection.querySelector("ul").getBoundingClientRect().right),
        columns: getComputedStyle(mainList).gridTemplateColumns.split(" ").length,
        display: getComputedStyle(mainList).display,
        mainScrolls: mainList.scrollWidth > mainList.clientWidth,
        threeScrolls: threeList.scrollWidth > threeList.clientWidth,
        twoWithCtaScrolls: twoWithCtaList.scrollWidth > twoWithCtaList.clientWidth,
        twoScrolls: twoList.scrollWidth > twoList.clientWidth,
        mainReachesLast: innerWidth <= 899 ? reachesLastCard(mainList) : null,
        threeReachesLast: innerWidth <= 899 ? reachesLastCard(threeList) : null,
        twoWithCtaReachesLast: innerWidth <= 899 ? reachesLastCard(twoWithCtaList) : null,
        headingGap: Math.round(mainList.getBoundingClientRect().top - section.querySelector("h2").getBoundingClientRect().bottom),
        cardTitle: [getComputedStyle(cards[0].querySelector("h3")).fontSize, getComputedStyle(cards[0].querySelector("h3")).lineHeight],
        cardDescription: [getComputedStyle(cards[0].querySelector("p")).fontSize, getComputedStyle(cards[0].querySelector("p")).lineHeight],
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
      await page.locator("#single-action").screenshot({ path: `preview-checks/icon-feature-cards-single-action-${width}.png` });
      await page.locator("#without-cta").screenshot({ path: `preview-checks/icon-feature-cards-without-cta-${width}.png` });
      await page.locator("#three-cards").screenshot({ path: `preview-checks/icon-feature-cards-three-${width}.png` });
    }
    const mobile = width <= 899;
    const expectedColumns = width >= 1080 ? 3 : 2;
    const expectedLastWidth = mobile ? result.cardWidth : width >= 1080 ? result.cardWidth * 2 + 32 : result.withoutCtaGridWidth;
    const correctScroll = mobile ? result.mainScrolls && result.threeScrolls && result.twoWithCtaScrolls && !result.twoScrolls && result.mainReachesLast && result.threeReachesLast && result.twoWithCtaReachesLast : !result.mainScrolls && !result.threeScrolls && !result.twoWithCtaScrolls && !result.twoScrolls;
    const correctType = result.cardTitle.join() === (mobile ? "20px,24px" : "24px,32px") && result.cardDescription.join() === "16px,24px";
    const passed = response.status() === 200 && errors.length === 0 && !result.overflow && result.cardCount === 6 && result.iconCount === 5 && result.iconsLoaded && result.ctaLinks === 2 && result.ctaButtonGap === 12 && result.singleActionLinks === 1 && result.withoutCtaCount === 5 && result.withoutCtaLinks === 0 && result.withoutCtaLastWidth === expectedLastWidth && (mobile || result.withoutCtaLastRight === result.withoutCtaGridRight) && (mobile ? result.display === "flex" : result.display === "grid" && result.columns === expectedColumns) && result.cardHeight >= 320 && result.firstRowEqual && result.minIconGap >= 24 && correctScroll && correctType && result.headingGap === (width <= 768 ? 36 : 48);
    console.log(JSON.stringify({ width, passed, ...result, errors }));
    if (!passed) process.exitCode = 1;
    await page.close();
  }
} finally {
  await browser.close();
}
