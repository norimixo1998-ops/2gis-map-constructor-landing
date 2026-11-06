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
  for (const width of [375, 390, 768, 899, 900, 1024, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 800 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto("http://127.0.0.1:3000/header-preview", { waitUntil: "networkidle" });

    async function read() {
      return page.evaluate(() => {
        const header = document.querySelector("header");
        const logo = header.querySelector('img[alt="2ГИС"]');
        const nav = header.querySelector('[aria-label="Разделы сайта, предпросмотр"]');
        const section = document.querySelector(".headerPreviewSection");
        const background = getComputedStyle(header, "::before");
        return {
          mode: header.dataset.headerMode,
          top: logo.getBoundingClientRect().top,
          rowTop: logo.parentElement.getBoundingClientRect().top,
          headerTop: header.getBoundingClientRect().top,
          headerBottom: header.getBoundingClientRect().bottom,
          position: getComputedStyle(header).position,
          bottomRadius: getComputedStyle(header).borderBottomLeftRadius,
          backgroundColor: getComputedStyle(header).backgroundColor,
          backgroundLayer: {
            display: background.display,
            width: parseFloat(background.width),
            height: parseFloat(background.height),
            color: background.backgroundColor,
            bottomRadius: background.borderBottomLeftRadius,
          },
          navRadius: getComputedStyle(nav).borderBottomLeftRadius,
          navShadow: getComputedStyle(nav).boxShadow,
          navLeft: nav.getBoundingClientRect().left,
          navRight: nav.getBoundingClientRect().right,
          navBottom: nav.getBoundingClientRect().bottom,
          sectionLeft: section.getBoundingClientRect().left,
          sectionRight: section.getBoundingClientRect().right,
          sectionTop: section.getBoundingClientRect().top,
          logoLoaded: logo.complete && logo.naturalWidth > 0,
          scrollWidth: document.documentElement.scrollWidth,
          viewport: innerWidth,
        };
      });
    }

    const initial = await read();
    if (width === 375 || width === 1440) await page.screenshot({ path: join(output, `header-top-${width}.png`) });
    await page.evaluate(() => window.scrollTo(0, 100));
    await page.waitForTimeout(100);
    const earlyDown = await read();
    await page.evaluate(() => window.scrollTo(0, 700));
    await page.waitForTimeout(250);
    const down = await read();
    await page.evaluate(() => window.scrollBy(0, -100));
    await page.waitForTimeout(250);
    const up = await read();
    if (width === 375 || width === 1440) await page.screenshot({ path: join(output, `header-returning-${width}.png`) });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(250);
    const backAtTop = await read();

    const passed = response?.status() === 200 && !errors.length && initial.logoLoaded &&
      initial.mode === "top" && Math.abs(initial.rowTop - (width < 900 ? 16 : 28)) < 1 &&
      initial.position === "absolute" &&
      earlyDown.mode === "top" && earlyDown.position === "absolute" && Math.abs(earlyDown.headerTop + 100) < 1 &&
      Math.abs(initial.sectionTop - initial.headerBottom) < 1 &&
      (width < 900 || (
        Math.abs(initial.navLeft - initial.sectionLeft) < 1 &&
        Math.abs(initial.navRight - initial.sectionRight) < 1 &&
        Math.abs(up.headerBottom - up.navBottom) < 1
      )) &&
      down.mode === "hidden" && down.position === "absolute" && Math.abs(down.headerTop + 700) < 1 &&
      up.mode === "returning" && up.position === "fixed" && Math.abs(up.headerTop) < 1 &&
      (width < 900
        ? up.bottomRadius === "16px" && up.backgroundColor === "rgb(25, 32, 37)" && up.backgroundLayer.display === "none"
        : up.backgroundColor === "rgba(0, 0, 0, 0)" &&
          up.backgroundLayer.color === "rgb(25, 32, 37)" && up.backgroundLayer.bottomRadius === "16px" &&
          Math.abs(up.backgroundLayer.width - (up.navRight - up.navLeft)) < 1 &&
          Math.abs(up.backgroundLayer.height - (up.headerBottom - up.headerTop)) < 1 &&
          up.navRadius === "16px") &&
      backAtTop.mode === "top" && backAtTop.position === "absolute" &&
      [initial, earlyDown, down, up, backAtTop].every((state) => state.scrollWidth <= state.viewport);

    console.log(JSON.stringify({ width, passed, errors, initial, earlyDown, down, up, backAtTop }));
    if (!passed) failed = true;
    await page.close();
  }
} finally {
  await browser.close();
}

if (failed) process.exitCode = 1;
