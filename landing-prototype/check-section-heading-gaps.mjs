import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/Legion/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });

try {
  for (const route of ["/", "/geoflow-hero-preview", "/image-feature-cards-preview", "/icon-feature-cards-preview"]) {
    for (const width of [375, 767, 768, 769, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      const response = await page.goto(`http://127.0.0.1:3000${route}`, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const gaps = await page.evaluate(() => [...document.querySelectorAll("main section")].flatMap((section) => {
        const heading = section.querySelector("h2");
        if (!heading) return [];
        const headingBottom = heading.getBoundingClientRect().bottom;
        const following = heading.nextElementSibling ?? heading.parentElement?.nextElementSibling;
        const description = following?.tagName === "P" ? following : following?.className?.includes?.("summaryRow") ? following.querySelector(":scope > p") : null;
        if (description) return [{ section: section.id || heading.textContent, gap: Math.round(description.getBoundingClientRect().top - headingBottom), expected: 20 }];
        let current = heading;
        while (current && current !== section) {
          let next = current.nextElementSibling;
          while (next) {
            const box = next.getBoundingClientRect();
            if (box.height > 0 && box.top >= headingBottom - 1) {
              return [{ section: section.id || heading.textContent, gap: Math.round(box.top - headingBottom), expected: innerWidth <= 768 ? 36 : 48 }];
            }
            next = next.nextElementSibling;
          }
          current = current.parentElement;
        }
        return [{ section: section.id || heading.textContent, gap: null, expected: innerWidth <= 768 ? 36 : 48 }];
      }));
      const failures = gaps.filter(({ gap, expected }) => gap !== expected);
      console.log(JSON.stringify({ route, width, checked: gaps.length, failures }));
      if (response?.status() !== 200 || failures.length || !gaps.length) process.exitCode = 1;
      await page.close();
    }
  }
} finally {
  await browser.close();
}
