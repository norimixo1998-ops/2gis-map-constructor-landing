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
  for (const width of [375, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    const runtimeErrors = [];
    page.on("pageerror", (error) => runtimeErrors.push(error.message));
    await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
    const form = page.locator("#lead-form");
    const field = (name) => form.locator(`[name="${name}"]`);
    const snapshot = async (names) => form.evaluate((element, fieldNames) => Object.fromEntries(fieldNames.map((name) => {
      const control = element.querySelector(`[name="${name}"]`);
      const label = control.closest("label");
      const field = control.closest('[class*="productField"]') ?? (label.className.includes("control") ? label.parentElement : label);
      const caption = field.querySelector('span[class*="floatLabel"]');
      const wrap = field.parentElement;
      return [name, {
        value: control.value,
        valid: control.checkValidity(),
        ariaInvalid: name === "productId" ? field.querySelector('[role="combobox"]').getAttribute("aria-invalid") : control.getAttribute("aria-invalid"),
        error: wrap.querySelector('[role="alert"]')?.textContent ?? null,
        background: getComputedStyle(field).backgroundColor,
        captionSize: getComputedStyle(caption).fontSize,
        captionTop: Math.round(caption.getBoundingClientRect().top - field.getBoundingClientRect().top),
      }];
    })), names);

    const result = { width, initial: await snapshot(["fullName", "email", "phone", "productId", "task"]) };
    await form.locator('button[type="submit"]').click();
    result.emptySubmit = {
      focusedField: await page.evaluate(() => document.activeElement?.getAttribute("name")),
      fields: await snapshot(["fullName", "email", "productId"]),
      errorMessages: await form.locator('[role="alert"]').allTextContents(),
    };
    await form.screenshot({ path: join(output, `lead-form-empty-submit-${width}.png`) });

    await field("fullName").fill("Анна Иванова");
    await field("email").fill("person@example.com");
    await form.locator('button[type="submit"]').click();
    result.missingProduct = {
      focused: await page.evaluate(() => document.activeElement?.getAttribute("role")),
      error: await form.getByRole("alert").allTextContents(),
    };

    await field("fullName").fill("   ");
    await field("productId").selectOption(await field("productId").locator('option:not([value=""])').first().getAttribute("value"));
    await form.locator('button[type="submit"]').click();
    result.whitespaceName = {
      field: (await snapshot(["fullName"])).fullName,
      previewCount: await form.getByRole("status").count(),
    };

    await field("fullName").fill("Анна Иванова");
    await field("phone").fill("not a number");
    await form.locator('button[type="submit"]').click();
    result.invalidPhone = {
      field: (await snapshot(["phone"])).phone,
      previewCount: await form.getByRole("status").count(),
    };
    result.phoneCases = {};
    for (const [caseName, value] of [["short", "123"], ["long", "1234567890123456"], ["empty", ""], ["formatted", "+7 (999) 123-45-67"]]) {
      await field("phone").fill(value);
      await field("company").focus();
      result.phoneCases[caseName] = (await snapshot(["phone"])).phone.ariaInvalid;
    }

    await field("email").fill("wrong-address");
    await field("company").focus();
    result.invalidEmail = (await snapshot(["email"])).email;
    await field("email").fill("person@example.com");
    result.correctedEmail = (await snapshot(["email"])).email;

    await field("phone").fill("+7 999 123-45-67");
    await field("task").fill("Подключить карту к сайту и показать филиалы. ".repeat(7));
    await field("company").focus();
    result.entered = await snapshot(["fullName", "phone", "email", "productId", "task"]);
    result.productOptions = await field("productId").locator("option").allTextContents();
    const productButton = form.getByRole("combobox", { name: "Выберите продукт" });
    await productButton.click();
    result.productDropdown = {
      options: await form.getByRole("listbox", { name: "Продукты" }).getByRole("option").count(),
      expanded: await productButton.getAttribute("aria-expanded"),
    };
    await form.screenshot({ path: join(output, `lead-form-products-${width}.png`) });
    await form.getByRole("listbox", { name: "Продукты" }).getByRole("option", { name: "2ГИС Про" }).click();
    result.clickedProduct = await field("productId").inputValue();
    await productButton.press("ArrowDown");
    await form.getByRole("option", { name: "2ГИС Про" }).press("Escape");
    result.productEscapeClosesList = await form.getByRole("listbox", { name: "Продукты" }).count() === 0;
    await field("productId").selectOption("geoflow-logistics");
    await field("company").focus();
    result.selectedProduct = await field("productId").evaluate((control) => {
      const field = control.closest('[class*="productField"]');
      const button = field.querySelector('[role="combobox"]');
      const caption = field.querySelector('span[class*="floatLabel"]');
      return {
        value: control.value,
        disabled: control.disabled,
        color: getComputedStyle(button).color,
        textFill: getComputedStyle(button).webkitTextFillColor,
        captionColor: getComputedStyle(caption).color,
        background: getComputedStyle(field).backgroundColor,
      };
    });
    await form.locator('button[type="submit"]').click();
    result.validSubmit = await form.getByRole("status").count() === 1;
    result.taskGeometry = await field("task").evaluate((control) => ({
      clientHeight: control.clientHeight,
      scrollHeight: control.scrollHeight,
      canResize: getComputedStyle(control).resize,
    }));
    await form.screenshot({ path: join(output, `lead-form-entered-${width}.png`) });
    result.accessibleNames = {
      name: await form.getByRole("textbox", { name: "Имя и фамилия" }).count(),
      phone: await form.getByRole("textbox", { name: "Телефон" }).count(),
      task: await form.getByRole("textbox", { name: "Опишите задачу" }).count(),
      product: await form.getByRole("combobox", { name: "Выберите продукт" }).count(),
    };
    await field("fullName").focus();
    result.tabOrder = [];
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press("Tab");
      result.tabOrder.push(await page.evaluate(() => document.activeElement?.getAttribute("name") ?? document.activeElement?.getAttribute("type")));
    }
    const countryButton = form.getByRole("button", { name: /Выбрать код страны/ });
    await countryButton.click();
    result.phoneArrow = {
      listboxes: await page.getByRole("listbox").count(),
      options: await page.getByRole("listbox").getByRole("option").count(),
    };
    await form.screenshot({ path: join(output, `lead-form-countries-${width}.png`) });
    await page.getByRole("option", { name: /Армения/ }).click();
    result.selectedCountry = {
      iso: await field("phoneCountry").inputValue(),
      code: await field("phoneCountryCode").inputValue(),
      phone: await field("phone").inputValue(),
      listboxes: await page.getByRole("listbox").count(),
      previewCount: await form.getByRole("status").count(),
    };
    if (width === 375) await form.screenshot({ path: join(output, "lead-form-country-selected-375.png") });
    await countryButton.press("ArrowDown");
    await page.getByRole("option", { name: /Армения/ }).press("ArrowDown");
    await page.getByRole("option", { name: /Грузия/ }).press("Enter");
    result.keyboardCountry = await field("phoneCountry").inputValue();
    await countryButton.press("ArrowDown");
    await page.getByRole("option", { name: /Грузия/ }).press("Escape");
    result.escapeClosesList = await page.getByRole("listbox").count() === 0;
    result.runtimeErrors = runtimeErrors;
    result.passed = result.missingProduct.focused === "combobox"
      && result.missingProduct.error.includes("Выберите продукт")
      && result.whitespaceName.field.ariaInvalid === "true"
      && result.whitespaceName.previewCount === 0
      && result.invalidPhone.field.ariaInvalid === "true"
      && result.invalidPhone.previewCount === 0
      && result.phoneCases.short === "true"
      && result.phoneCases.long === "true"
      && result.phoneCases.empty === "false"
      && result.phoneCases.formatted === "false"
      && result.correctedEmail.ariaInvalid === "false"
      && result.productOptions.length === 13
      && result.productOptions.includes("2ГИС ГеоПоток: Логистика")
      && result.productOptions.includes("Другое")
      && result.productDropdown.options === 12
      && result.productDropdown.expanded === "true"
      && result.clickedProduct === "2gis-pro"
      && result.productEscapeClosesList
      && result.selectedProduct.value === "geoflow-logistics"
      && !result.selectedProduct.disabled
      && result.selectedProduct.color === "rgb(255, 255, 255)"
      && result.selectedProduct.textFill === "rgb(255, 255, 255)"
      && result.selectedProduct.background === "rgba(255, 255, 255, 0.12)"
      && result.validSubmit
      && result.phoneArrow.options === 237
      && result.selectedCountry.iso === "AM"
      && result.selectedCountry.code === "+374"
      && result.selectedCountry.phone === "+7 999 123-45-67"
      && result.selectedCountry.listboxes === 0
      && result.selectedCountry.previewCount === 0
      && result.keyboardCountry === "GE"
      && result.escapeClosesList
      && result.runtimeErrors.length === 0;
    console.log(JSON.stringify(result));
    if (!result.passed) process.exitCode = 1;
    await page.close();
  }
} finally {
  await browser.close();
}
