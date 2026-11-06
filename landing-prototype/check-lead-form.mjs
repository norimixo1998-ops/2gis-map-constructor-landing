import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/Legion/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const output = join(dirname(fileURLToPath(import.meta.url)), "preview-checks");
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
let failed = false;
try {
  for (const width of [375, 390, 768, 899, 900, 1024, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const geometry = await page.evaluate(() => {
      const form = document.querySelector("#lead-form");
      const fields = [...form.querySelectorAll('input:not([type="hidden"]), select, textarea')];
      const boxes = fields.map((field) => ({ name: field.name, x: field.getBoundingClientRect().x, y: field.getBoundingClientRect().y, width: field.getBoundingClientRect().width }));
      const image = form.querySelector('img[src$="illustration.png"]');
      const phone = form.querySelector('[name="phone"]');
      const arrow = phone.closest("label").querySelector('img[src$="flag-chevron.svg"]');
      const contacts = form.closest("section").lastElementChild;
      const section = form.closest("section");
      const card = section.firstElementChild;
      const heading = card.querySelector("h2");
      return {
        scrollWidth: document.documentElement.scrollWidth,
        pageProductId: form.querySelector('[name="pageProductId"]').value,
        productValue: form.querySelector('select[name="productId"]').value,
        productPlaceholder: form.querySelector('select[name="productId"] option:checked').textContent,
        phoneGap: phone.getBoundingClientRect().left + parseFloat(getComputedStyle(phone).paddingLeft) - arrow.getBoundingClientRect().right,
        contactBackground: getComputedStyle(contacts).backgroundColor,
        contactLeft: contacts.querySelector("img").getBoundingClientRect().left,
        cardLeft: card.getBoundingClientRect().left,
        cardToContacts: contacts.getBoundingClientRect().top - card.getBoundingClientRect().bottom,
        ctaToFooter: document.querySelector("footer").getBoundingClientRect().top - section.getBoundingClientRect().bottom,
        headingSize: getComputedStyle(heading).fontSize,
        headingLineHeight: getComputedStyle(heading).lineHeight,
        heroHref: [...document.querySelectorAll("a")].find((a) => a.textContent.trim() === "Получить консультацию")?.getAttribute("href"),
        fields: boxes,
        imageLoaded: image.complete && image.naturalWidth > 0,
        legalLinks: [...form.querySelectorAll("a")].filter((a) => a.href.startsWith("https://law.2gis.ru/")).length,
      };
    });
    const twoColumns = width >= 768 ? geometry.fields[0].y === geometry.fields[1].y : geometry.fields[0].y < geometry.fields[1].y;
    const mobile = width <= 899;
    const mobileContacts = !mobile || (geometry.contactBackground === "rgba(0, 0, 0, 0)" && geometry.contactLeft === geometry.cardLeft && geometry.cardToContacts === 32);
    const verticalRhythm = Math.abs(geometry.ctaToFooter - (mobile ? 64 : 120)) < 0.1 && (!mobile || (geometry.headingSize === "24px" && geometry.headingLineHeight === "28px"));
    const passed = response?.status() === 200 && !errors.length && geometry.scrollWidth <= width && geometry.pageProductId === "geoflow-logistics" && geometry.productValue === "" && geometry.productPlaceholder === "Выберите продукт" && Math.abs(geometry.phoneGap - 8) < 0.1 && mobileContacts && verticalRhythm && geometry.heroHref === "#lead-form" && geometry.fields.length === 7 && geometry.imageLoaded && geometry.legalLinks === 3 && twoColumns;
    if (!passed) failed = true;
    if (width === 375 || width === 1440) {
      await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
      await page.locator("#lead-form").screenshot({ path: join(output, `lead-form-${width}.png`) });
    }
    console.log(JSON.stringify({ width, passed, errors, geometry }));
    if (width === 375) {
      await page.locator('button[type="submit"]').click();
      const invalid = await page.locator('[name="fullName"]').evaluate((element) => !element.validity.valid);
      await page.locator('[name="fullName"]').fill("Тестовый посетитель");
      await page.locator('[name="email"]').fill("test@example.com");
      await page.locator('select[name="productId"]').selectOption("geoflow-logistics");
      await page.locator('button[type="submit"]').click();
      const message = await page.getByRole("status").textContent();
      if (!invalid || !message?.includes("Отправка заявок пока не подключена")) failed = true;
    }
    await page.close();
  }
} finally {
  await browser.close();
}
if (failed) process.exitCode = 1;
