import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/Legion/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });

try {
  for (const width of [375, 768, 900, 1024, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    await page.goto("http://127.0.0.1:3000/geoflow-hero-preview", { waitUntil: "networkidle" });
    const section = page.locator("#audience-scenarios");
    const result = await section.evaluate((element) => {
      const media = element.querySelector('[class*="media"]');
      const [desktop, mobile] = media.querySelectorAll("img");
      const placeholder = media.querySelector("span");
      const rect = media.getBoundingClientRect();
      return {
        width: Math.round(rect.width), height: Math.round(rect.height),
        desktopVisible: getComputedStyle(desktop).display !== "none",
        mobileVisible: getComputedStyle(mobile).display !== "none",
        desktopLoaded: desktop.complete && desktop.naturalWidth > 0,
        mobileLoaded: mobile.complete && mobile.naturalWidth > 0,
        desktopSource: new URL(desktop.src).pathname,
        mobileSource: new URL(mobile.src).pathname,
        placeholderVisible: placeholder ? getComputedStyle(placeholder).display !== "none" : false,
        bottomAligned: Math.abs(rect.bottom - media.parentElement.getBoundingClientRect().bottom) < 1,
      };
    });
    assert.equal(result.desktopLoaded && result.mobileLoaded, true, `${width}px source failed`);
    assert.equal(result.desktopVisible, width >= 900, `${width}px desktop image visibility`);
    assert.equal(result.mobileVisible, width < 900, `${width}px mobile image visibility`);
    assert.equal(result.desktopSource.endsWith("/geopotok-image-desktop.png"), true);
    assert.equal(result.mobileSource.endsWith("/geopotok-image-mobile.png"), true);
    assert.equal(result.placeholderVisible, false);
    assert.equal(result.bottomAligned, true, `${width}px media alignment`);
    if (width === 1440 || width === 900 || width === 375) {
      await section.locator('[class*="panel"]').screenshot({ path: `preview-checks/audience-image-${width}.png` });
    }
    console.log(`${width}px: ${JSON.stringify(result)}`);
    await page.close();
  }
} finally {
  await browser.close();
}
