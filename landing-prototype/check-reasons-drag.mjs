import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/Legion/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });

async function measure(page) {
  return page.locator("#reasons ul").evaluate((element) => element.scrollLeft);
}

try {
  for (const pointer of ["touch", "mouse"]) {
    const context = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: pointer === "touch", hasTouch: pointer === "touch" });
    const page = await context.newPage();
    await page.goto(process.env.PREVIEW_URL ?? "http://127.0.0.1:3000", { waitUntil: "networkidle" });
    const list = page.locator("#reasons ul");
    await list.scrollIntoViewIfNeeded();
    const box = await list.boundingBox();
    const y = box.y + Math.min(110, box.height / 2);
    const from = box.x + box.width - 40;
    const to = box.x + 40;
    if (pointer === "touch") {
      const cdp = await context.newCDPSession(page);
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: from, y }] });
      for (let step = 1; step <= 12; step++) {
        await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: from + (to - from) * step / 12, y }] });
        await page.waitForTimeout(16);
      }
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    } else {
      await page.mouse.move(from, y);
      await page.mouse.down();
      await page.mouse.move(to, y, { steps: 12 });
      await page.mouse.up();
    }
    await page.waitForTimeout(500);
    const afterLeft = await measure(page);
    if (pointer === "touch") {
      const cdp = await context.newCDPSession(page);
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: to, y }] });
      for (let step = 1; step <= 12; step++) {
        await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: to + (from - to) * step / 12, y }] });
        await page.waitForTimeout(16);
      }
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    } else {
      await page.mouse.move(to, y);
      await page.mouse.down();
      await page.mouse.move(from, y, { steps: 12 });
      await page.mouse.up();
    }
    await page.waitForTimeout(500);
    const afterRight = await measure(page);
    let linkClick = true;
    let lastAligned = true;
    if (pointer === "mouse") {
      const link = page.locator("#reasons li a");
      await link.evaluate((element) => {
        element.addEventListener("click", (event) => {
          event.preventDefault();
          element.dataset.clicked = "true";
        }, { once: true });
      });
      await link.click();
      linkClick = await link.getAttribute("data-clicked") === "true";
      for (let swipe = 0; swipe < 3; swipe++) {
        await page.mouse.move(from, y);
        await page.mouse.down();
        await page.mouse.move(to, y, { steps: 12 });
        await page.mouse.up();
        await page.waitForTimeout(260);
      }
      lastAligned = await list.evaluate((element) =>
        Math.abs(element.lastElementChild.getBoundingClientRect().left - element.getBoundingClientRect().left) < 1
      );
    }
    const passed = afterLeft > 50 && afterRight < afterLeft - 50 && linkClick && lastAligned;
    console.log(JSON.stringify({ pointer, afterLeft, afterRight, linkClick, lastAligned, passed }));
    if (!passed) process.exitCode = 1;
    await context.close();
  }
} finally {
  await browser.close();
}
