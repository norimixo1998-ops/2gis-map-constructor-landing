import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/Legion/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });

try {
  for (const width of [375, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto("http://127.0.0.1:3000/solved-tasks-preview", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const result = await page.evaluate(() => {
      const two = document.querySelector("#solved-tasks-two");
      const four = document.querySelector("#solved-tasks-four");
      const card = two.querySelector("li");
      const title = card.querySelector("h3");
      const description = card.querySelector("p");
      const action = card.querySelector("a");
      const media = card.querySelector("li > div");
      return {
        twoCount: two.querySelectorAll("li").length,
        fourCount: four.querySelectorAll("li").length,
        twoActions: two.querySelectorAll("li a").length,
        fourActions: four.querySelectorAll("li a").length,
        placeholders: document.querySelectorAll("main section li > div > span").length,
        title: [getComputedStyle(title).fontSize, getComputedStyle(title).fontWeight, getComputedStyle(title).lineHeight],
        description: [getComputedStyle(description).fontSize, getComputedStyle(description).fontWeight, getComputedStyle(description).lineHeight],
        action: [getComputedStyle(action).fontSize, getComputedStyle(action).fontWeight, getComputedStyle(action).lineHeight, Math.round(action.getBoundingClientRect().height)],
        columns: getComputedStyle(two.querySelector("ul")).gridTemplateColumns.split(" ").length,
        cardWidth: Math.round(card.getBoundingClientRect().width),
        mediaHeight: Math.round(media.getBoundingClientRect().height),
        overflow: document.documentElement.scrollWidth > innerWidth,
      };
    });
    if (width === 375 || width === 1440) {
      await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
      await page.locator("#solved-tasks-two").screenshot({ path: `preview-checks/solved-tasks-two-${width}.png` });
      await page.locator("#solved-tasks-four").screenshot({ path: `preview-checks/solved-tasks-four-${width}.png` });
    }
    const passed = response.status() === 200 && !errors.length && !result.overflow && result.twoCount === 2 && result.fourCount === 4 && result.twoActions === 2 && result.fourActions === 0 && result.placeholders === 6 && result.columns === (width < 700 ? 1 : 2) && result.title.join() === (width < 700 ? "20px,500,24px" : "24px,500,32px") && result.description.join() === "16px,400,24px" && result.action.join() === "16px,500,24px,56";
    console.log(JSON.stringify({ width, passed, ...result, errors }));
    if (!passed) process.exitCode = 1;
    await page.close();
  }
} finally {
  await browser.close();
}
