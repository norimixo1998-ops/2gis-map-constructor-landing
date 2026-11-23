import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/Legion/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const output = join(dirname(fileURLToPath(import.meta.url)), "preview-checks");
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
try {
  for (const width of [375, 768, 1024, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    const errors = [];
    const checks = [];
    const check = (name, passed, detail) => checks.push({ name, passed, ...(detail === undefined ? {} : { detail }) });
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
    const form = page.locator("#lead-form");
    const name = form.locator('[name="fullName"]');
    const email = form.locator('[name="email"]');
    const product = form.locator('[name="productId"]');
    const nameField = name.locator("xpath=ancestor::label[1]");
    const nameLabel = nameField.locator("span[class*='floatLabel']");

    check("page", response?.status() === 200 && errors.length === 0);
    check("no horizontal overflow", await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    check("product starts empty", await product.inputValue() === "");
    check("country picker only in phone field", await form.locator('button[aria-haspopup="listbox"]').count() === 1
      && await nameField.locator('button[aria-haspopup="listbox"]').count() === 0);
    const gap = await form.locator('[name="phone"]').evaluate((input) => {
      const field = input.closest("label").parentElement;
      const arrow = field.querySelector('img[src$="flag-chevron.svg"]');
      const label = input.closest("label").querySelector('span[class*="floatLabel"]');
      return label.getBoundingClientRect().left - arrow.getBoundingClientRect().right;
    });
    check("phone prefix gap", Math.abs(gap - 8) < 0.1, gap);

    const baseBackground = await nameField.evaluate((element) => getComputedStyle(element).backgroundColor);
    check("active background", baseBackground === "rgba(255, 255, 255, 0.12)", baseBackground);
    if (width === 375 || width === 1440) await form.screenshot({ path: join(output, `lead-form-${width}.png`) });
    await name.hover();
    const hoverBackground = await nameField.evaluate((element) => getComputedStyle(element).backgroundColor);
    check("hover background", hoverBackground === (width >= 1080
      ? "rgba(255, 255, 255, 0.24)" : "rgba(255, 255, 255, 0.12)"), hoverBackground);
    await name.focus();
    check("focus background", await nameField.evaluate((element) => getComputedStyle(element).backgroundColor) === "rgba(255, 255, 255, 0.24)");
    check("focused label", await nameLabel.evaluate((element) => getComputedStyle(element).fontSize === "12px"));
    await name.fill("Тестовый посетитель");
    await email.focus();
    check("entered label", await nameLabel.evaluate((element) => getComputedStyle(element).fontSize === "12px"));

    await email.fill("wrong-email");
    await name.focus();
    const emailError = {
      invalid: await email.getAttribute("aria-invalid"),
      alerts: await form.locator('[role="alert"]').allTextContents(),
    };
    check("email error", emailError.invalid === "true"
      && emailError.alerts.includes("Укажите корректную эл. почту"), emailError);
    if (width === 375) await form.screenshot({ path: join(output, "lead-form-error-375.png") });
    await email.fill("test@example.com");
    check("error clears on correction", await email.getAttribute("aria-invalid") === "false");

    const disabledStyle = await form.locator('[name="city"]').evaluate((input) => {
      input.disabled = true;
      const field = input.closest("label");
      return {
        text: getComputedStyle(field.querySelector('span[class*="floatLabel"]')).color,
        input: getComputedStyle(input).color,
      };
    });
    check("disabled text 36%", disabledStyle.text === "rgba(255, 255, 255, 0.36)"
      && disabledStyle.input === "rgba(255, 255, 255, 0.36)", disabledStyle);

    await product.selectOption(await product.locator('option:not([value=""])').first().getAttribute("value"));
    await form.locator('button[type="submit"]').click();
    check("valid preview submit", (await form.getByRole("status").textContent())?.includes("Отправка заявок пока не подключена"));
    check("no runtime errors", errors.length === 0, errors);
    console.log(JSON.stringify({ width, checks }));
    if (checks.some((item) => !item.passed)) process.exitCode = 1;
    await page.close();
  }
} finally {
  await browser.close();
}
