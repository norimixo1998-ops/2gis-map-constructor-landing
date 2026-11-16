import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/Legion/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });

const cases = [
  { label: "В кабинет", width: 1440, background: "rgba(255, 255, 255, 0.24)" },
  { label: "Получить консультацию", width: 1440, background: "rgb(0, 131, 12)" },
  { label: "Документация", width: 1440, background: "rgba(255, 255, 255, 0.24)" },
  { label: "Создать карту", width: 1440, background: "rgb(0, 131, 12)" },
  { label: "Открыть конструктор", width: 1440, background: "rgb(0, 131, 12)" },
  { label: "Документация", width: 375, background: "rgba(255, 255, 255, 0.24)" },
  { label: "Создать карту", width: 375, background: "rgb(0, 131, 12)" },
  { label: "Открыть конструктор", width: 375, background: "rgb(0, 131, 12)" },
];

try {
  for (const width of [1440, 375]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    for (const testCase of cases.filter((item) => item.width === width)) {
      const button = (testCase.label === "В кабинет" || testCase.label === "Получить консультацию" ? page.locator("header") : page.locator("main"))
        .getByText(testCase.label, { exact: true }).first();
      await button.hover();
      const style = await button.evaluate((element) => {
        const computed = getComputedStyle(element);
        return {
          background: computed.backgroundColor,
          color: computed.color,
          fontFamily: computed.fontFamily,
          fontSize: computed.fontSize,
          fontWeight: computed.fontWeight,
          lineHeight: computed.lineHeight,
          paddingLeft: computed.paddingLeft,
          paddingRight: computed.paddingRight,
        };
      });
      const passed = style.background === testCase.background && style.color === "rgb(255, 255, 255)" &&
        style.fontFamily.includes("suisse") && style.fontSize === "16px" && style.fontWeight === "500" && style.lineHeight === "24px";
      const paddingPassed = testCase.label !== "В кабинет" || (style.paddingLeft === "16px" && style.paddingRight === "16px");
      console.log(JSON.stringify({ width, label: testCase.label, passed: passed && paddingPassed, style }));
      if (!passed || !paddingPassed) process.exitCode = 1;
    }
    await page.close();
  }
} finally {
  await browser.close();
}
