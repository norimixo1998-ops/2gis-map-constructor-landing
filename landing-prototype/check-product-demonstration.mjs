import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/Legion/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });

try {
  await mkdir("preview-checks", { recursive: true });
  for (const width of [375, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    const response = await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const section = page.locator("#product-demonstration");
    const result = await page.evaluate(() => {
      const block = document.querySelector("#product-demonstration");
      const screen = block.querySelector('[class*="screen"]');
      const heading = block.querySelector("h2");
      const background = block.querySelector('picture[class*="background"] img');
      const inset = block.querySelector('[class*="screenInset"]');
      const rect = screen.getBoundingClientRect();
      const previous = document.querySelector("#solved-tasks");
      const next = document.querySelector("#reasons");
      return {
        scrollWidth: document.documentElement.scrollWidth,
        screenWidth: Math.round(rect.width),
        screenHeight: Math.round(rect.height),
        title: heading.textContent,
        placeholder: inset.textContent.trim() === "Изображение",
        blur: getComputedStyle(inset).backdropFilter,
        screenShadow: getComputedStyle(screen).boxShadow,
        innerHighlight: getComputedStyle(screen, "::after").display,
        imageCount: inset.querySelectorAll("img").length,
        backgroundLoaded: background?.complete && background.naturalWidth > 0,
        backgroundSrc: background ? new URL(background.currentSrc).pathname : null,
        gapBeforeBlock: Math.round(block.getBoundingClientRect().top - previous.getBoundingClientRect().bottom),
        gapBeforeHeading: Math.round(heading.getBoundingClientRect().top - previous.getBoundingClientRect().bottom),
        gapAfterBlock: Math.round(next.getBoundingClientRect().top - block.getBoundingClientRect().bottom),
      };
    });
    await section.screenshot({ path: `preview-checks/product-demonstration-${width}.png` });
    const headingFlow = width === 375 ? await page.evaluate(() => {
      const block = document.querySelector("#product-demonstration");
      const heading = block.querySelector("h2");
      const screen = block.querySelector('[class*="screen"]');
      const original = heading.textContent;
      const short = { top: heading.getBoundingClientRect().top, screenTop: screen.getBoundingClientRect().top };
      heading.textContent = "Инструмент для планирования маршрутов";
      const medium = { top: heading.getBoundingClientRect().top, screenTop: screen.getBoundingClientRect().top };
      heading.textContent += " и управления задачами выездного персонала на каждом этапе работы и планирования рабочих поездок";
      const long = { screenTop: screen.getBoundingClientRect().top };
      heading.textContent = original;
      return { short, medium, long };
    }) : null;
    const expectedBackground = width <= 699 ? "/images/product-demonstration/Light_mobile.png" : "/images/product-demonstration/light_desktop.png";
    const headingPass = !headingFlow || (Math.abs(headingFlow.medium.top - headingFlow.short.top) < 1 && headingFlow.medium.screenTop > headingFlow.short.screenTop && headingFlow.long.screenTop > headingFlow.medium.screenTop);
    const mobileFramePass = width > 699 || (result.screenShadow === "none" && result.innerHighlight === "none");
    const spacing = width <= 699 ? 64 : 120;
    const spacingPass = result.gapBeforeBlock === spacing && result.gapAfterBlock === spacing && (width > 699 || result.gapBeforeHeading === spacing);
    const passed = response.status() === 200 && !errors.length && result.scrollWidth <= width && result.screenWidth > 0 && result.screenHeight > 0 && result.placeholder && result.imageCount === 0 && result.blur !== "none" && result.backgroundLoaded && result.backgroundSrc === expectedBackground && headingPass && mobileFramePass && spacingPass;
    console.log(`${width}px ${passed ? "PASS" : "FAIL"} ${JSON.stringify({ ...result, headingFlow, errors })}`);
    await page.close();
    if (!passed) process.exitCode = 1;
  }
  for (const width of [375, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto("http://127.0.0.1:3000/product-demonstration-preview", { waitUntil: "networkidle" });
    const section = page.locator("#product-without-title");
    const result = await section.evaluate(block => {
      const screen = block.querySelector('[class*="screen"]');
      const background = block.querySelector('picture[class*="background"] img');
      return {
        hasHeading: Boolean(block.querySelector("h2")),
        accessibleName: block.getAttribute("aria-label"),
        screenOffset: Math.round(screen.getBoundingClientRect().top - block.getBoundingClientRect().top),
        backgroundOffset: Math.round(background.getBoundingClientRect().top - block.getBoundingClientRect().top),
      };
    });
    await section.screenshot({ path: `preview-checks/product-demonstration-no-title-${width}.png` });
    const passed = !result.hasHeading && result.accessibleName === "Демонстрация продукта" && result.screenOffset === (width <= 699 ? 74 : 116) && result.backgroundOffset === 0;
    console.log(`no-title ${width}px ${passed ? "PASS" : "FAIL"} ${JSON.stringify(result)}`);
    if (!passed) process.exitCode = 1;
    await page.close();
  }
} finally {
  await browser.close();
}
