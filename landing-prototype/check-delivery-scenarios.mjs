import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/Legion/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });

try {
  for (const width of (process.env.WIDTHS?.split(",").map(Number) ?? [375, 768, 1024, 1100, 1440])) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const response = await page.goto(`http://127.0.0.1:${process.env.PORT ?? "3000"}/geoflow-hero-preview`, { waitUntil: "networkidle" });
    const section = page.locator("#delivery-scenarios");
    const triggers = section.locator("button[aria-expanded]");
    const count = await triggers.count();
    if (response?.status() !== 200 || count !== 9) throw new Error(`${width}: page or scenarios missing (status ${response?.status()}, found ${count}, title ${await page.title()})`);
    if (await triggers.first().getAttribute("aria-expanded") !== "true") throw new Error(`${width}: first scenario is not open initially`);
    const firstAccent = await section.locator("article").first().evaluate(element => getComputedStyle(element).getPropertyValue("--accent").trim());
    if (firstAccent !== "#12951a") throw new Error(`${width}: first scenario does not use primary color`);
    if (width < 1100) {
      const alignment = await section.evaluate((element) => {
        const errors = [];
        let singleLineCount = 0;
        let multiLineCount = 0;
        for (const button of element.querySelectorAll("button[aria-expanded='false']")) {
          const title = button.querySelector("[class*='horizontalTitle']");
          const number = button.querySelector("[class*='number']");
          const chevron = button.querySelector("[class*='chevron']");
          const oneLine = title.offsetHeight <= Number.parseFloat(getComputedStyle(title).lineHeight) + 1;
          if (oneLine) {
            singleLineCount++;
            const middle = button.getBoundingClientRect().top + button.getBoundingClientRect().height / 2;
            for (const part of [title, number, chevron]) {
              const rect = part.getBoundingClientRect();
              if (Math.abs(rect.top + rect.height / 2 - middle) > 1) errors.push(`${title.textContent}: not centered`);
            }
          } else {
            multiLineCount++;
            if (Math.abs(number.offsetTop - title.offsetTop) > 1 || Math.abs(chevron.offsetTop - title.offsetTop) > 1) errors.push(`${title.textContent}: not top aligned`);
          }
        }
        return { singleLineCount, multiLineCount, errors };
      });
      if (alignment.errors.length || !alignment.singleLineCount || (width <= 550 && !alignment.multiLineCount)) throw new Error(`${width}: collapsed title alignment ${JSON.stringify(alignment)}`);
    }
    await triggers.nth(2).click();
    if (await triggers.nth(2).getAttribute("aria-expanded") !== "true") throw new Error(`${width}: distributor scenario did not open`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    if (overflow) throw new Error(`${width}: horizontal page overflow`);
    const body = section.locator("#delivery-scenarios-scenario-2");
    if (!(await body.isVisible())) throw new Error(`${width}: active scenario content hidden`);
    const scenarioCopy = await body.locator("h3, [class*='detail'] p").allTextContents();
    if (scenarioCopy.map((text) => text.replace(/\u00a0/g, " ")).join("|") !== "Дистрибьюторы|Товар нужно забрать у производителя и развезти по торговым точкам. У каждой — своё время приёмки.|Сервис рассчитывает маршрут от производителя до конечных точек с учётом времени доставки") throw new Error(`${width}: distributor copy ${JSON.stringify(scenarioCopy)}`);
    if (width >= 1100) await page.waitForTimeout(550);
    const typography = await page.evaluate(() => {
      const section = document.querySelector("#delivery-scenarios");
      const title = section?.querySelector("button[aria-expanded] [class*='horizontalTitle']");
      const openTitle = section?.querySelector("article:has(button[aria-expanded='true']) h3");
      const details = section?.querySelectorAll("[class*='detail'] p");
      const situation = details?.[0];
      const automation = details?.[1];
      const label = section?.querySelector("[class*='detail'] span");
      const chevron = section?.querySelector("[class*='chevron'] img");
      const number = section?.querySelector("button[aria-expanded] [class*='number']");
      const style = (element) => element ? getComputedStyle(element) : null;
      const activeBody = section?.querySelector("article:has(button[aria-expanded='true']) [class*='body']:not([class*='bodyInner'])");
      const inner = activeBody?.querySelector("[class*='bodyInner']");
      const outerRect = activeBody?.getBoundingClientRect();
      const firstRect = inner?.firstElementChild?.getBoundingClientRect();
      const lastRect = inner?.lastElementChild?.getBoundingClientRect();
      return { title: style(title)?.fontSize, titleWeight: style(title)?.fontWeight, openTitle: style(openTitle)?.fontSize, openWeight: style(openTitle)?.fontWeight, situation: style(situation)?.fontSize, automation: style(automation)?.fontSize, label: style(label)?.fontSize, families: [title, openTitle, situation, automation, label].map(element => style(element)?.fontFamily ?? ""), topGap: outerRect && firstRect ? firstRect.top - outerRect.top : null, bottomGap: outerRect && lastRect ? outerRect.bottom - lastRect.bottom : null, chevron: chevron?.getAttribute("src"), chevronLoaded: Boolean(chevron?.complete && chevron.naturalWidth), numberTitleTopGap: number && title ? number.getBoundingClientRect().top - title.getBoundingClientRect().top : null, chevronTitleTopGap: chevron?.parentElement && title ? chevron.parentElement.offsetTop - title.offsetTop : null, text: section?.textContent ?? "" };
    });
    if (typography.text.includes("МАРШРУТ ДНЯ") || typography.text.includes("Вечерняя разнарядка")) throw new Error(`${width}: removed content remains`);
    if (typography.openTitle !== "24px" || typography.openWeight !== "500" || typography.situation !== "16px" || typography.automation !== "16px" || typography.label !== "14px" || typography.families.some(family => !family.toLowerCase().includes("suisse"))) throw new Error(`${width}: detail typography ${JSON.stringify(typography)}`);
    if (width < 1100 && (typography.title !== "20px" || typography.titleWeight !== "500" || !typography.chevron?.endsWith("/icons/header/chevron-down-small-stroke.svg") || !typography.chevronLoaded || typography.numberTitleTopGap === null || Math.abs(typography.numberTitleTopGap) > 1 || typography.chevronTitleTopGap === null || Math.abs(typography.chevronTitleTopGap) > 1)) throw new Error(`${width}: accordion typography or top alignment ${JSON.stringify(typography)}`);
    if (width >= 1100) {
      for (let index = 0; index < count; index++) {
        await triggers.nth(index).click();
        await page.waitForTimeout(550);
        const layout = await section.evaluate(element => {
          const body = element.querySelector("article:has(button[aria-expanded='true']) [class*='body']:not([class*='bodyInner'])");
          const inner = body?.querySelector("[class*='bodyInner']");
          const bounds = body?.getBoundingClientRect();
          const first = inner?.firstElementChild?.getBoundingClientRect();
          const last = inner?.lastElementChild?.getBoundingClientRect();
          const css = inner ? getComputedStyle(inner) : null;
          return { top: bounds && first ? first.top - bounds.top : null, bottom: bounds && last ? bounds.bottom - last.bottom : null, padding: css ? [css.paddingTop, css.paddingRight, css.paddingBottom, css.paddingLeft] : [] };
        });
        if (layout.top === null || layout.bottom === null || Math.abs(layout.top - 24) > 2 || layout.bottom < 23 || layout.padding.some(value => value !== "24px")) throw new Error(`${width}: scenario ${index + 1} spacing ${JSON.stringify(layout)}`);
      }
    }
    console.log(`${width}px: 9 scenarios, switching and layout OK`);
    await page.close();
  }
} finally {
  await browser.close();
}
