import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/Legion/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });

try {
  for (const route of ["/geoflow-hero-preview", "/geoflow-holiday", "/faq-preview"]) {
    for (const [width, reducedMotion] of [[1440, "no-preference"], [375, "no-preference"], [375, "reduce"]]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion });
      await page.goto(`http://127.0.0.1:3000${route}`, { waitUntil: "domcontentloaded" });
      const motion = await page.locator("main picture img").first().evaluate((image) => {
        const style = getComputedStyle(image);
        return {
          name: style.animationName,
          duration: style.animationDuration,
          timing: style.animationTimingFunction,
          keyframes: image.getAnimations()[0]?.effect?.getKeyframes().map(({ transform }) => transform),
        };
      });
      if (reducedMotion === "reduce") {
        assert.equal(motion.name, "none", `${route} ${width}px reduced motion`);
      } else {
        assert.match(motion.name, /heroFloat/, `${route} ${width}px`);
        assert.equal(motion.duration, "5s", `${route} ${width}px`);
        assert.equal(motion.timing, "ease-in-out", `${route} ${width}px`);
        assert.deepEqual(motion.keyframes, ["translateY(0px)", "translateY(-12px)", "translateY(0px)"], `${route} ${width}px`);
      }
      await page.close();
    }
    console.log(`${route}: desktop, mobile, reduced motion OK`);
  }
} finally {
  await browser.close();
}
