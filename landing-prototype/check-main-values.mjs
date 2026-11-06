import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/Legion/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });

try {
  for (const width of [375, 768, 900, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("http://127.0.0.1:3000/main-values-preview", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const initial = await page.evaluate(() => [3, 4, 5].map((count) => {
      const section = document.querySelector(`#main-values-${["three", "four", "five"][[3, 4, 5].indexOf(count)]}`);
      const list = section.querySelector("ul");
      return { count: list.querySelectorAll("li").length, scrollable: list.scrollWidth > list.clientWidth, gap: parseFloat(getComputedStyle(list).gap), controls: !!section.querySelector("button"), columns: getComputedStyle(list).gridTemplateColumns.split(" ").length };
    }));
    const typography = await page.locator("#main-values-three li:first-child").evaluate((card) => {
      const icon = card.querySelector("img") || card.querySelector("span");
      const heading = card.querySelector("h3");
      const description = card.querySelector("p");
      return {
        iconWidth: icon.getBoundingClientRect().width,
        iconHeight: icon.getBoundingClientRect().height,
        headingSize: getComputedStyle(heading).fontSize,
        headingLine: getComputedStyle(heading).lineHeight,
        headingWeight: getComputedStyle(heading).fontWeight,
        descriptionSize: getComputedStyle(description).fontSize,
        descriptionLine: getComputedStyle(description).lineHeight,
      };
    });
    let controlsWork = true;
    if (width >= 900) {
      const list = page.locator("#main-values-four ul");
      await page.locator("#main-values-four button[aria-label='Следующие преимущества']").click();
      await page.waitForTimeout(500);
      controlsWork = await list.evaluate((element) => element.scrollLeft > 0);
      await page.locator("#main-values-four button[aria-label='Предыдущие преимущества']").click();
      await page.waitForTimeout(500);
      controlsWork &&= await list.evaluate((element) => element.scrollLeft < 2);
    }
    const mobile = width < 900;
    const passed = !errors.length && controlsWork && typography.iconWidth === 96 && typography.iconHeight === 96 && typography.headingSize === (mobile ? "20px" : "24px") && typography.headingLine === (mobile ? "24px" : "32px") && typography.headingWeight === "500" && typography.descriptionSize === "16px" && typography.descriptionLine === "24px" && initial[0].count === 3 && initial[1].count === 4 && initial[2].count === 5 && !initial[0].controls && initial[1].controls && initial[2].controls && (mobile ? initial.every((value) => value.scrollable && value.gap === 12) : !initial[0].scrollable && initial[0].columns === 3 && initial[1].scrollable && initial[2].scrollable);
    if ([375, 1440].includes(width)) await page.locator("#main-values-four").screenshot({ path: `preview-checks/main-values-four-${width}.png` });
    console.log(JSON.stringify({ width, passed, controlsWork, typography, initial, errors }));
    if (!passed) process.exitCode = 1;
    await page.close();
  }
} finally {
  await browser.close();
}
