import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/Legion/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
await mkdir("preview-checks", { recursive: true });

const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
try {
  for (const width of [375, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto("http://127.0.0.1:3000/faq-preview", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const faq = page.locator("#faq");
    const rows = faq.locator("button[aria-expanded]");
    const count = await rows.count();
    const initial = await rows.evaluateAll((nodes) => nodes.map((node) => node.getAttribute("aria-expanded") === "true"));
    const geometry = await page.evaluate(() => {
      const section = document.querySelector("#faq");
      const buttons = section.querySelectorAll('button[aria-expanded]');
      const first = buttons[0].parentElement;
      const second = buttons[1].parentElement;
      const questionStyle = getComputedStyle(buttons[0]);
      const answerStyle = getComputedStyle(buttons[0].nextElementSibling);
      const hero = document.querySelector("main > section:first-child");
      const reasons = document.querySelector("#reasons");
      const leadForm = document.querySelector("#lead-form");
      return {
        overflow: document.documentElement.scrollWidth > innerWidth,
        fullLanding: Boolean(document.querySelector("header") && document.querySelector("main h1") && reasons && leadForm && document.querySelector("footer")),
        heroToReasons: reasons.getBoundingClientRect().top - hero.getBoundingClientRect().bottom,
        reasonsToFaq: section.getBoundingClientRect().top - reasons.getBoundingClientRect().bottom,
        faqToCta: leadForm.getBoundingClientRect().top - section.getBoundingClientRect().bottom,
        sectionWidth: section.getBoundingClientRect().width,
        sectionHeight: section.getBoundingClientRect().height,
        heading: section.querySelector("h2")?.textContent,
        headingHeight: section.querySelector("h2")?.getBoundingClientRect().height,
        firstHeight: first.getBoundingClientRect().height,
        closedHeight: second.getBoundingClientRect().height,
        gap: second.getBoundingClientRect().top - first.getBoundingClientRect().bottom,
        questionFontSize: questionStyle.fontSize,
        questionWeight: questionStyle.fontWeight,
        questionLineHeight: questionStyle.lineHeight,
        answerFontSize: answerStyle.fontSize,
        answerWeight: answerStyle.fontWeight,
        answerLineHeight: answerStyle.lineHeight,
        answerTransition: answerStyle.transitionDuration,
      };
    });
    await page.setViewportSize({ width, height: 1600 });
    await faq.screenshot({ path: `preview-checks/faq-${width}.png` });
    if (width !== 768) await page.screenshot({ path: `preview-checks/faq-landing-${width}.png`, fullPage: true });
    await rows.nth(1).focus();
    await page.keyboard.press("Enter");
    const keyboardOpened = await rows.nth(1).getAttribute("aria-expanded") === "true";
    const independent = await rows.first().getAttribute("aria-expanded") === "true";
    await page.waitForTimeout(120);
    const midHeight = await rows.nth(1).evaluate((node) => node.nextElementSibling.getBoundingClientRect().height);
    await page.waitForTimeout(240);
    const finalHeight = await rows.nth(1).evaluate((node) => node.nextElementSibling.getBoundingClientRect().height);
    await page.keyboard.press("Enter");
    const keyboardClosed = await rows.nth(1).getAttribute("aria-expanded") === "false";
    await page.waitForTimeout(360);
    const closedHeight = await rows.nth(1).evaluate((node) => node.nextElementSibling.getBoundingClientRect().height);
    const expectedWidth = Math.min(width - 32, 1168);
    const mobile = width <= 899;
    const passed = response?.status() === 200 && !errors.length && geometry.fullLanding && count === 10 && initial[0] && initial.slice(1).every((open) => !open) && keyboardOpened && keyboardClosed && independent && finalHeight > 0 && closedHeight === 0 && geometry.answerTransition === "0.3s" && !geometry.overflow && geometry.sectionWidth === expectedWidth && Math.abs(geometry.gap - 16) < 1 && Math.abs(geometry.closedHeight - (mobile ? 64 : 88)) < 1 && Math.abs(geometry.heroToReasons - (mobile ? 64 : 120)) < 1 && Math.abs(geometry.reasonsToFaq - (mobile ? 64 : 120)) < 1 && Math.abs(geometry.faqToCta - (mobile ? 64 : 120)) < 1 && geometry.questionFontSize === (mobile ? "20px" : "18px") && geometry.questionWeight === "500" && geometry.questionLineHeight === (mobile ? "24px" : "28px") && geometry.answerFontSize === "16px" && geometry.answerWeight === "400" && Math.abs(parseFloat(geometry.answerLineHeight) - (mobile ? 24 : 22.4)) < 0.1;
    console.log(JSON.stringify({ width, passed, count, geometry, animation: { midHeight, finalHeight, closedHeight }, errors }));
    if (!passed) process.exitCode = 1;
    await page.close();
  }
  const page = await browser.newPage();
  await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
  const mainCount = await page.locator("#faq button[aria-expanded]").count();
  console.log(JSON.stringify({ route: "/", count: mainCount, passed: mainCount === 4 }));
  if (mainCount !== 4) process.exitCode = 1;
  await page.emulateMedia({ reducedMotion: "reduce" });
  const reducedMotion = await page.locator("#faq button[aria-expanded]").first().evaluate((node) => getComputedStyle(node.nextElementSibling).transitionDuration);
  console.log(JSON.stringify({ reducedMotion, passed: reducedMotion === "0s" }));
  if (reducedMotion !== "0s") process.exitCode = 1;
} finally {
  await browser.close();
}
