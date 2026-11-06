import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/Legion/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const output = join(dirname(fileURLToPath(import.meta.url)), "preview-checks");
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
let failed = false;
try {
  for (const width of [375, 390, 768, 959, 960, 991, 992, 1024, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1080 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const result = await page.evaluate(() => {
      const element = (selector) => document.querySelector(selector);
      const box = (selector) => {
        const r = element(selector).getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height, bottom: r.bottom };
      };
      const img = element("picture img");
      const h1 = element("h1");
      const desc = element("section p");
      const buttons = [...document.querySelector("main > section").querySelectorAll("a")];
      return {
        title: h1.textContent,
        description: desc.textContent,
        fontLoaded: document.fonts.check('500 40px "Suisse Intl"') || document.fonts.status === "loaded",
        fontFamily: getComputedStyle(h1).fontFamily,
        h1Weight: getComputedStyle(h1).fontWeight,
        descWeight: getComputedStyle(desc).fontWeight,
        h1Size: getComputedStyle(h1).fontSize,
        h1LineHeight: getComputedStyle(h1).lineHeight,
        descSize: getComputedStyle(desc).fontSize,
        descLineHeight: getComputedStyle(desc).lineHeight,
        image: { complete: img.complete, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight, src: new URL(img.currentSrc).pathname },
        h1: box("h1"), descriptionBox: box("section p"), visual: box("section picture"), actions: (() => { const r = buttons[0].parentElement.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height, bottom: r.bottom }; })(),
        buttons: buttons.map((a) => ({ text: a.textContent.trim(), href: a.getAttribute("href"), box: { x: a.getBoundingClientRect().x, y: a.getBoundingClientRect().y, width: a.getBoundingClientRect().width } })),
        scrollWidth: document.documentElement.scrollWidth,
        viewportWidth: innerWidth,
      };
    });
    const mobile = width < 992;
    const correctImage = result.image.src.endsWith(mobile ? "logistics-mobile.png" : "logistics-desktop.png");
    const correctOrder = mobile
      ? result.visual.bottom <= result.h1.y && result.descriptionBox.bottom <= result.actions.y
      : result.h1.x < result.visual.x;
    const noOverflow = result.scrollWidth <= width;
    const buttonsFit = mobile
      ? result.buttons.every((b) => b.box.width === result.actions.width)
      : result.buttons[0].box.y === result.buttons[1].box.y;
    const passed = response?.status() === 200 && !errors.length && result.image.complete && result.image.naturalWidth > 0 && correctImage && correctOrder && noOverflow && buttonsFit && result.h1Weight === "500" && result.descWeight === "400";
    if (!passed) failed = true;
    if (width === 375 || width === 768 || width === 960 || width === 1440) {
      await page.screenshot({ path: join(output, `hero-${width}.png`), fullPage: true });
    }
    console.log(JSON.stringify({ width, mobile, status: response?.status(), passed, correctImage, correctOrder, noOverflow, buttonsFit, errors, result }));
    await page.close();
  }
} finally {
  await browser.close();
}
if (failed) process.exitCode = 1;
