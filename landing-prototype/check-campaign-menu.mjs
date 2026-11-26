import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/Legion/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });

try {
  for (const width of [320, 375, 768, 769, 991, 992]) {
    const page = await browser.newPage({ viewport: { width, height: 800 } });
    await page.goto("http://127.0.0.1:3000/geoflow-hero-preview", { waitUntil: "domcontentloaded" });
    const menuButton = page.getByRole("button", { name: "Открыть меню" });
    const badge = page.locator("header span[class*='badge']");
    const headerOverflow = await page.locator("header > div:first-child").evaluate((inner) => [...inner.querySelectorAll("img, span, button, a")].filter((element) => getComputedStyle(element).display !== "none" && element.getBoundingClientRect().right > innerWidth + 1).map((element) => ({ tag: element.tagName, text: element.textContent, right: element.getBoundingClientRect().right })));
    assert.deepEqual(headerOverflow, [], `${width}px header overflow`);
    assert.equal(await menuButton.isVisible(), width <= 768, `${width}px burger visibility`);
    assert.equal(await badge.isVisible(), width <= 768 || width >= 992, `${width}px badge visibility`);

    if (width <= 768) {
      const positions = await page.evaluate(() => {
        const header = document.querySelector("header");
        const logo = header.querySelector('img[alt="2ГИС"]');
        const badge = header.querySelector('span[class*="badge"]');
        const button = header.querySelector('button[aria-label="Открыть меню"]');
        return { logoRight: logo.getBoundingClientRect().right, badgeLeft: badge.getBoundingClientRect().left, badgeRight: badge.getBoundingClientRect().right, buttonLeft: button.getBoundingClientRect().left };
      });
      assert.ok(positions.logoRight < positions.badgeLeft && positions.badgeRight < positions.buttonLeft, `${width}px header spacing: ${JSON.stringify(positions)}`);
      if (width === 375) {
        await mkdir("preview-checks", { recursive: true });
        await page.screenshot({ path: "preview-checks/campaign-header-375.png" });
      }
      await menuButton.click();
      const dialog = page.getByRole("dialog", { name: "Меню" });
      await dialog.waitFor();
      assert.equal(await menuButton.getAttribute("aria-expanded"), "true");
      assert.deepEqual(await dialog.getByRole("navigation").getByRole("link").allTextContents(), ["Акция", "Как работает", "Кому подходит", "Вопросы"]);
      assert.equal(await dialog.getByRole("link", { name: "Подключить курьеров" }).isVisible(), true);
      assert.equal(await page.evaluate(() => document.body.style.overflow), "hidden");
      assert.equal(await page.evaluate(() => document.activeElement?.getAttribute("aria-label")), "Закрыть меню");
      await page.keyboard.press("Shift+Tab");
      assert.equal(await page.evaluate(() => document.activeElement?.textContent?.trim()), "Подключить курьеров");
      await page.keyboard.press("Tab");
      assert.equal(await page.evaluate(() => document.activeElement?.getAttribute("aria-label")), "Закрыть меню");
      const bounds = await dialog.boundingBox();
      assert.equal(Math.round(bounds.width), width);
      assert.equal(Math.round(bounds.height), 800);
      if (width === 375) {
        await mkdir("preview-checks", { recursive: true });
        await page.screenshot({ path: "preview-checks/campaign-menu-375.png" });
      }
      await page.keyboard.press("Escape");
      assert.equal(await dialog.count(), 0);
      await menuButton.click();
      await dialog.getByRole("link", { name: "Вопросы" }).click();
      assert.equal(new URL(page.url()).hash, "#faq");
      assert.equal(await dialog.count(), 0);
      assert.notEqual(await page.evaluate(() => document.body.style.overflow), "hidden");
      if (width === 768) {
        await menuButton.click();
        await page.setViewportSize({ width: 769, height: 800 });
        assert.equal(await dialog.count(), 0);
      }
    }
    console.log(`${width}px OK`);
    await page.close();
  }
} finally {
  await browser.close();
}
