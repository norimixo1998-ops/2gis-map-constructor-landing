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
    await page.locator("footer img").evaluateAll(async (images) => { await Promise.all(images.map((img) => img.decode().catch(() => {}))); });
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    const result = await page.evaluate(() => {
      const footer = document.querySelector("footer");
      const mobile = footer.querySelector('[class*="mobileContent"]');
      const desktop = footer.querySelector('[class*="desktopContent"]');
      const images = [...footer.querySelectorAll("img")].filter((img) => getComputedStyle(img).display !== "none" && img.getBoundingClientRect().width > 0);
      const columns = [...desktop.querySelectorAll(':scope > [class*="desktopColumn"]')];
      const firstColumn = columns[0];
      const groupedLinks = [...firstColumn.querySelectorAll('[class*="productColumns"] > div')];
      const cssColor = (node) => getComputedStyle(node).color;
      const developerColumn = groupedLinks[1];
      const developerLastLink = developerColumn.querySelector('[class*="group"]:nth-child(2) li:last-child');
      const developerDirect = [...developerColumn.querySelectorAll('[class*="directLinks"] li')];
      return {
        scrollWidth: document.documentElement.scrollWidth,
        viewport: innerWidth,
        mobileVisible: getComputedStyle(mobile).display !== "none",
        desktopVisible: getComputedStyle(desktop).display !== "none",
        openGroups: [...footer.querySelectorAll("details")].filter((item) => item.open).length,
        chevrons: [...footer.querySelectorAll("details")].map((item) => ({ open: item.open, visible: [...item.querySelectorAll("summary img")].filter((img) => getComputedStyle(img).display !== "none").map((img) => new URL(img.src).pathname) })),
        columnTitles: columns.map((column) => column.querySelector("h2")?.textContent),
        linkHierarchy: {
          casesLeft: groupedLinks[0]?.textContent.includes("Кейсы"),
          docsRight: groupedLinks[1]?.textContent.includes("Документация") && groupedLinks[1]?.textContent.includes("О качестве данных"),
          otherProducts: columns[1]?.textContent.includes("Для бизнеса") && columns[1]?.textContent.includes("Для пользователей"),
        },
        accentColors: [firstColumn.querySelector("h3"), firstColumn.querySelector('[class*="directLinks"] a'), columns[1]?.querySelector("h3"), columns[2]?.querySelector("h3")].map(cssColor),
        developerLinkSpacing: {
          afterGroup: developerDirect[0].getBoundingClientRect().top - developerLastLink.getBoundingClientRect().bottom,
          betweenDirect: developerDirect[1].getBoundingClientRect().top - developerDirect[0].getBoundingClientRect().bottom,
          arrowOpacity: getComputedStyle(developerDirect[0].querySelector("img")).opacity,
        },
        images: images.map((img) => ({ src: new URL(img.src).pathname, loaded: img.complete && img.naturalWidth > 0, width: img.getBoundingClientRect().width, height: img.getBoundingClientRect().height })),
        tel: footer.querySelector('a[href="tel:88002003600"]') !== null,
        email: footer.querySelector('a[href="mailto:dev@2gis.ru"]') !== null,
      };
    });
    const mobile = width < 900;
    if (width === 375 || width === 900 || width === 1440) {
      await page.evaluate(() => window.scrollBy(0, 100));
      await footer.screenshot({ path: join(output, `footer-${width}.png`) });
    }
    let accordionWorks = true;
    let footerHover = true;
    if (width === 1440) {
      const link = footer.locator('[class*="directLinks"] a').first();
      await link.hover();
      footerHover = await link.evaluate((item) => getComputedStyle(item).color === "rgb(34, 170, 39)");
    }
    if (mobile) {
      const groups = footer.locator("details");
      await groups.nth(1).locator("summary").click();
      const secondOpened = await groups.nth(1).evaluate((item) => item.open);
      await groups.nth(0).locator("summary").click();
      const firstClosed = await groups.nth(0).evaluate((item) => !item.open && [...item.querySelectorAll("summary img")].filter((img) => getComputedStyle(img).display !== "none").every((img) => img.src.endsWith("chevron-up-small-stroke.svg")));
      await groups.nth(2).locator("summary").click();
      const companyNotRepeated = await groups.nth(2).evaluate((item) => ![...item.querySelectorAll("h3")].some((heading) => heading.textContent === "Компания"));
      await groups.nth(3).locator("summary").click();
      const compactSpacing = await groups.nth(2).evaluate((company) => {
        const legal = company.nextElementSibling;
        const list = company.querySelector("ul");
        const items = [...list.querySelectorAll("li")];
        const legalList = legal.querySelector("ul");
        return {
          companyTop: items[0].getBoundingClientRect().top - company.querySelector("summary").getBoundingClientRect().bottom,
          itemGap: items[1].getBoundingClientRect().top - items[0].getBoundingClientRect().bottom,
          whatsNewGap: company.querySelector("h3").getBoundingClientRect().top - items.at(-1).getBoundingClientRect().bottom,
          legalTop: legalList.querySelector("li").getBoundingClientRect().top - legal.querySelector("summary").getBoundingClientRect().bottom,
          legalItemGap: legalList.querySelectorAll("li")[1].getBoundingClientRect().top - legalList.querySelector("li").getBoundingClientRect().bottom,
        };
      });
      if (width === 375) await footer.screenshot({ path: join(output, "footer-375-compact.png") });
      accordionWorks = secondOpened && firstClosed && companyNotRepeated &&
        Math.abs(compactSpacing.companyTop - 16) < 1 && Math.abs(compactSpacing.itemGap - 8) < 1 &&
        Math.abs(compactSpacing.whatsNewGap - 20) < 1 && Math.abs(compactSpacing.legalTop - 16) < 1 &&
        Math.abs(compactSpacing.legalItemGap - 8) < 1;
      if (!accordionWorks) errors.push(`compact spacing: ${JSON.stringify(compactSpacing)}`);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    let headerHover = true;
    if (width === 1440) {
      const item = page.locator('header [aria-label="Разделы сайта, предпросмотр"] > span').first();
      await item.hover();
      headerHover = await item.evaluate((node) => getComputedStyle(node).color === "rgb(34, 170, 39)");
    }
    await page.evaluate(() => window.scrollTo(0, 700));
    await page.waitForTimeout(100);
    await page.evaluate(() => window.scrollBy(0, -100));
    await page.waitForTimeout(100);
    const headerMode = await page.locator("header").getAttribute("data-header-mode");
    const passed = response?.status() === 200 && !errors.length && result.scrollWidth <= width &&
      result.mobileVisible === mobile && result.desktopVisible !== mobile &&
      (!mobile || (result.openGroups === 1 && result.chevrons[0].visible[0].endsWith("chevron-off-small-stroke.svg") && result.chevrons.slice(1).every((item) => item.visible[0].endsWith("chevron-up-small-stroke.svg")))) &&
      result.columnTitles.join("|") === "Данные и технологии 2ГИС|Другие продукты|Компания|Условия использования" &&
      Object.values(result.linkHierarchy).every(Boolean) && result.accentColors.every((color) => color === "rgba(255, 255, 255, 0.64)") &&
      (mobile || (result.developerLinkSpacing.afterGroup === 36 && result.developerLinkSpacing.betweenDirect === 20)) &&
      result.developerLinkSpacing.arrowOpacity === "0.64" &&
      result.images.every((img) => img.loaded) &&
      result.tel && result.email && accordionWorks && footerHover && headerHover && headerMode === "returning";
    if (!passed) failed = true;
    console.log(JSON.stringify({ width, passed, accordionWorks, footerHover, headerHover, headerMode, errors, overflow: result.scrollWidth > width, hierarchy: result.linkHierarchy, accentColors: result.accentColors, spacing: result.developerLinkSpacing, chevrons: result.chevrons }));
    await page.close();
  }
} finally {
  await browser.close();
}
if (failed) process.exitCode = 1;
