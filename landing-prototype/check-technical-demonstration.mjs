import { createRequire } from "node:module";
import { join } from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/Legion/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });

try {
  for (const width of [1440, 1024, 768, 390, 375]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    const response = await page.goto(process.env.PREVIEW_URL || "http://127.0.0.1:3000", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const section = page.locator("#technical-demonstration");
    const result = await page.evaluate(() => {
      const element = document.querySelector("#technical-demonstration");
      const card = element.firstElementChild;
      const copy = card.firstElementChild;
      const heading = copy.querySelector("h2");
      const description = copy.querySelector("p");
      const action = copy.querySelector("a");
      const headingWrap = heading.parentElement;
      const media = card.lastElementChild;
      const frame = media.firstElementChild;
      const slot = frame.firstElementChild;
      const picture = slot.querySelector("picture");
      const image = picture?.querySelector("img");
      const mobilePlaceholder = slot.querySelector("span");
      const bounds = node => node.getBoundingClientRect();
      const frameStyle = getComputedStyle(frame);
      return {
        title: heading.textContent,
        card: { x: bounds(card).x, y: bounds(card).y, width: bounds(card).width, height: bounds(card).height, bottom: bounds(card).bottom, glow: getComputedStyle(card, "::before").backgroundImage, glowOpacity: getComputedStyle(card, "::before").opacity },
        copy: { x: bounds(copy).x, y: bounds(copy).y, bottom: bounds(copy).bottom },
        headingBottom: bounds(heading).bottom,
        headingRightInset: parseFloat(getComputedStyle(headingWrap).paddingRight),
        descriptionTop: bounds(description).top,
        descriptionFontSize: getComputedStyle(description).fontSize,
        descriptionLineHeight: getComputedStyle(description).lineHeight,
        descriptionRight: bounds(description).right,
        descriptionBottom: bounds(description).bottom,
        action: action && { text: action.textContent, href: action.href, x: bounds(action).x, y: bounds(action).y, width: bounds(action).width, height: bounds(action).height, radius: getComputedStyle(action).borderRadius, fontSize: getComputedStyle(action).fontSize, lineHeight: getComputedStyle(action).lineHeight, weight: getComputedStyle(action).fontWeight },
        media: { x: bounds(media).x, y: bounds(media).y, width: bounds(media).width, height: bounds(media).height, bottom: bounds(media).bottom },
        frame: { x: bounds(frame).x, y: bounds(frame).y, width: bounds(frame).width, height: bounds(frame).height, paddingTop: frameStyle.paddingTop, paddingRight: frameStyle.paddingRight, paddingBottom: frameStyle.paddingBottom, paddingLeft: frameStyle.paddingLeft, radius: frameStyle.borderTopLeftRadius, shadow: frameStyle.boxShadow, background: getComputedStyle(frame, "::before").backgroundColor },
        slot: { x: bounds(slot).x, y: bounds(slot).y, width: bounds(slot).width, height: bounds(slot).height, radius: getComputedStyle(slot).borderTopLeftRadius },
        image: image && { src: new URL(image.currentSrc || image.src).pathname, width: image.naturalWidth, height: image.naturalHeight, display: getComputedStyle(picture).display },
        placeholder: mobilePlaceholder && { text: mobilePlaceholder.textContent, display: getComputedStyle(mobilePlaceholder).display },
        scrollWidth: document.documentElement.scrollWidth,
      };
    });
    const output = join("preview-checks", `technical-demonstration-landing-${width}.png`);
    await section.screenshot({ path: output });
    console.log(JSON.stringify({ width, status: response.status(), output, ...result, errors }));

    const inset = width < 700 ? 20 : 48;
    const frameInset = width < 700 ? 5 : 12;
    const descriptionGap = width < 700 ? 12 : 20;
    const close = (a, b) => Math.abs(a - b) < 1;
    if (
      response.status() !== 200 || errors.length || !result.title || result.scrollWidth > width ||
      !close(result.copy.x - result.card.x, inset) || !close(result.copy.y - result.card.y, inset) ||
      !close(result.media.x, result.copy.x) || !close(result.media.y - result.copy.bottom, 48) ||
      !close(result.descriptionTop - result.headingBottom, descriptionGap) || result.descriptionFontSize !== "16px" || result.descriptionLineHeight !== "24px" ||
      result.action?.text !== "Получить демо-ключ" || !result.action.href.startsWith("https://platform.2gis.ru/") || result.action.height !== 56 || result.action.radius !== "12px" || result.action.fontSize !== "16px" || result.action.lineHeight !== "24px" || result.action.weight !== "500" ||
      (width >= 900 ? !close(result.action.x - result.descriptionRight, 64) || !close(result.headingRightInset, 160) : !close(result.action.y - result.descriptionBottom, 24) || !close(result.headingRightInset, 0)) ||
      !close(result.media.bottom, result.card.bottom) ||
      !close(result.frame.width, result.media.width) || !close(result.frame.height, result.media.height) ||
      !close(result.slot.x - result.frame.x, frameInset) || !close(result.slot.y - result.frame.y, frameInset) ||
      !close(result.slot.width, result.frame.width - frameInset * 2) || !close(result.slot.height, result.frame.height - frameInset) ||
      result.frame.paddingTop !== `${frameInset}px` || result.frame.paddingBottom !== "0px" ||
      result.frame.radius !== (width < 700 ? "9px" : "32px") || result.slot.radius !== (width < 700 ? "6px" : "20px") ||
      result.frame.background !== "rgba(255, 255, 255, 0.12)" || result.frame.shadow !== "none" || !result.card.glow.includes("Glow%20(2).png") || result.card.glowOpacity !== (width < 700 ? "0.6" : "0.85") ||
      !result.image?.src.endsWith("API%20key_desktop.png") || result.image.width !== 3012 || result.image.height !== 1868 ||
      (width < 700 ? result.image.display !== "none" || result.placeholder?.display !== "grid" || result.placeholder.text !== "Изображение для мобильной версии" : result.image.display !== "block" || result.placeholder?.display !== "none") ||
      (width === 1440 && (!close(result.card.width, 1168) || !close(result.media.width, 1072) || !close(result.media.height, 661) || !close(result.slot.width, 1048) || !close(result.slot.height, 649)))
    ) process.exitCode = 1;
    await page.close();
  }
} finally {
  await browser.close();
}
