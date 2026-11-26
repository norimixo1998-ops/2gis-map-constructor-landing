import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const source = readFileSync("content/geoflow-hero-preview.ts", "utf8");
const descriptions = [...source.matchAll(/\b(?:description|text|situation|automation|note):\s*"([^"\n]*)"/g)];
for (const [, value] of descriptions) {
    const sentenceEnds = [...value.matchAll(/[.!?](?=\s|$)/g)];
    assert.ok(sentenceEnds.length !== 1 || !value.endsWith("."), `Лишняя точка: ${value}`);
    assert.ok(sentenceEnds.length < 2 || /[.!?]$/.test(value), `Нет точки в конце нескольких предложений: ${value}`);
}
assert.ok(descriptions.length > 20, `Проверено слишком мало описаний: ${descriptions.length}`);
assert.ok(!source.includes("Сравнение плана и факта — в разработке"));

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/Legion/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
try {
  for (const width of [375, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto("http://127.0.0.1:3000/geoflow-hero-preview", { waitUntil: "domcontentloaded" });
    assert.equal((await page.locator("#audience-scenarios li").last().textContent())?.trim().replace(/\u00a0/g, " "), "Сравнение плана и факта");
    assert.equal((await page.locator("#audience-scenarios h2 + p").textContent())?.trim().endsWith("."), false);
    await page.close();
  }
} finally {
  await browser.close();
}
console.log(`${descriptions.length} описаний проверено; последняя плашка и текст секции проверены на 375 и 1440 px`);
