import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/Legion/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });

try {
  await mkdir("preview-checks", { recursive: true });
  for (const height of [900, 800]) {
    const page = await browser.newPage({ viewport: { width: 1440, height } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("http://127.0.0.1:3000/", { waitUntil: "load" });
    const launcher = page.getByRole("button", { name: "Открыть чат с AI-ассистентом" });
    if (await launcher.locator("svg").count() !== 1) throw new Error("Animated launcher SVG missing");
    await launcher.hover();
    await page.waitForTimeout(180);
    const hoverMotion = await launcher.evaluate((element) => {
      const star = element.querySelector('path[d^="M31.7435"]');
      return { brightness: getComputedStyle(element).filter, starTransform: getComputedStyle(star).transform, traceCount: element.querySelectorAll('path[stroke="#E5FFEA"]').length };
    });
    if (hoverMotion.brightness !== "brightness(1.12)" || hoverMotion.starTransform === "none" || hoverMotion.traceCount !== 0) throw new Error(`Launcher hover is wrong: ${JSON.stringify(hoverMotion)}`);
    if (height === 900) {
      await launcher.evaluate((element) => element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 360; }));
      await launcher.screenshot({ path: "preview-checks/ai-chat-launcher-hover.png" });
      await launcher.evaluate((element) => element.getAnimations({ subtree: true }).forEach((animation) => animation.play()));
    }
    await page.getByRole("button", { name: "Открыть чат с AI-ассистентом" }).click();
    const inputBar = page.locator('[data-state="default"]');
    await inputBar.waitFor();
    await inputBar.hover();
    const hoverColor = await inputBar.evaluate((element) => getComputedStyle(element).backgroundColor);
    if (hoverColor !== "rgba(255, 255, 255, 0.24)") throw new Error(`Wrong input hover: ${hoverColor}`);
    for (const asset of ["logo-assistent_icon.svg"]) {
      const loaded = await page.locator(`img[src$="${asset}"]`).evaluate((img) => img.complete && img.naturalWidth > 0);
      if (!loaded) throw new Error(`Chat asset did not load: ${asset}`);
    }
    const geometry = await page.evaluate(() => {
      const panel = document.querySelector('[aria-label="Чат с AI-ассистентом"]');
      const header = document.querySelector("header");
      const rect = panel.getBoundingClientRect();
      const headerLayer = panel.querySelector('[class*="panelHeader"]');
      return { width: rect.width, height: rect.height, top: rect.top, headerBottom: header.getBoundingClientRect().bottom, blur: getComputedStyle(panel, "::before").backdropFilter, headerBlur: getComputedStyle(headerLayer, "::before").backdropFilter };
    });
    if (geometry.width !== 350 || geometry.height > 503 || geometry.top < geometry.headerBottom || geometry.blur !== "blur(200px)" || geometry.headerBlur !== "blur(200px)") {
      throw new Error(`Invalid ${height}px geometry: ${JSON.stringify(geometry)}`);
    }
    if (height === 900) {
      await page.evaluate(() => window.scrollTo(0, 420));
      await page.locator('[aria-label="Чат с AI-ассистентом"]').evaluate((element) => element.style.setProperty("--chat-surface", "rgb(26 26 26 / 36%)"));
      await page.waitForTimeout(100);
      await page.screenshot({ path: "preview-checks/ai-chat-surface-36.png" });
      await page.locator('[aria-label="Чат с AI-ассистентом"]').evaluate((element) => element.style.removeProperty("--chat-surface"));
      await page.waitForTimeout(100);
      await page.screenshot({ path: "preview-checks/ai-chat-surface-48.png" });
      await page.evaluate(() => window.scrollTo(0, 0));
    }
    await page.screenshot({ path: `preview-checks/ai-chat-${height}.png` });
    const launcherTop = await page.getByRole("button", { name: "Закрыть чат" }).last().evaluate((element) => element.getBoundingClientRect().top);
    await page.evaluate(() => window.scrollTo(0, 1200));
    const scrolledTop = await page.locator('[aria-label="Чат с AI-ассистентом"]').evaluate((element) => element.getBoundingClientRect().top);
    const scrolledLauncherTop = await page.getByRole("button", { name: "Закрыть чат" }).last().evaluate((element) => element.getBoundingClientRect().top);
    if (scrolledTop !== geometry.top || scrolledLauncherTop !== launcherTop) throw new Error(`Chat moved during page scroll: panel ${geometry.top} -> ${scrolledTop}, launcher ${launcherTop} -> ${scrolledLauncherTop}`);
    await page.getByRole("button", { name: "Данные для геоаналитики" }).click();
    await page.getByText("Ассистент думает...").waitFor();
    await page.locator('[data-state="loading"]').waitFor();
    if (height === 900) await page.locator('[aria-label="Чат с AI-ассистентом"]').screenshot({ path: "preview-checks/ai-chat-input-loading.png" });
    const userColor = await page.getByText("Данные для геоаналитики", { exact: true }).evaluate((element) => getComputedStyle(element.closest('[class*="message"]')).backgroundColor);
    if (userColor !== "rgb(18, 149, 26)") throw new Error(`Wrong user bubble: ${userColor}`);
    await page.getByText("Могу помочь с выбором продукта.", { exact: false }).waitFor();
    const assistantColor = await page.getByText("Могу помочь с выбором продукта.", { exact: false }).evaluate((element) => getComputedStyle(element.closest('[class*="message"]')).backgroundColor);
    if (assistantColor !== "rgba(255, 255, 255, 0.12)") throw new Error(`Wrong assistant bubble: ${assistantColor}`);
    const dialogueGutters = await page.locator('[aria-label="Чат с AI-ассистентом"]').evaluate((panel) => {
      const conversation = panel.querySelector('[class*="conversation"]');
      const contentLeft = conversation.getBoundingClientRect().left + parseFloat(getComputedStyle(conversation).paddingLeft);
      const contentRight = conversation.getBoundingClientRect().right - parseFloat(getComputedStyle(conversation).paddingRight);
      const user = panel.querySelector('[class*="message"][class*="user"]')?.getBoundingClientRect();
      const assistant = panel.querySelector('[class*="message"][class*="assistant"]')?.getBoundingClientRect();
      return { userLeft: user.left - contentLeft, userRight: contentRight - user.right, assistantLeft: assistant.left - contentLeft, assistantRight: contentRight - assistant.right, userWidth: user.width, assistantWidth: assistant.width };
    });
    if (dialogueGutters.userLeft !== 32 || dialogueGutters.userRight !== 0 || dialogueGutters.assistantLeft !== 0 || dialogueGutters.assistantRight !== 32 || dialogueGutters.userWidth !== dialogueGutters.assistantWidth) throw new Error(`Wrong dialogue gutters: ${JSON.stringify(dialogueGutters)}`);
    if (height === 900) await page.screenshot({ path: "preview-checks/ai-chat-answer.png" });
    const edge = await page.locator('[aria-label="Чат с AI-ассистентом"]').evaluate((panel) => {
      const conversation = panel.querySelector('[class*="conversation"]');
      const bar = panel.querySelector('[class*="inputBar"]');
      conversation.scrollTop = Math.max(0, conversation.scrollHeight - conversation.clientHeight - 40);
      return { mask: getComputedStyle(conversation).maskImage, blur: getComputedStyle(bar).backdropFilter, radius: getComputedStyle(bar).borderRadius };
    });
    if (!edge.mask.includes("linear-gradient") || edge.blur !== "blur(200px)" || edge.radius !== "20px") throw new Error(`Wrong input edge treatment: ${JSON.stringify(edge)}`);
    if (height === 900) await page.locator('[aria-label="Чат с AI-ассистентом"]').screenshot({ path: "preview-checks/ai-chat-input-edge.png" });
    await page.getByRole("button", { name: "Закрыть чат" }).first().click();
    await page.getByRole("button", { name: "Открыть чат с AI-ассистентом" }).click();
    await page.getByRole("textbox", { name: "Задать вопрос" }).focus();
    await page.locator('[data-state="focused"]').waitFor();
    const focusOutline = await page.locator('[data-state="focused"]').evaluate((element) => getComputedStyle(element).boxShadow);
    if (!focusOutline.includes("rgba(255, 255, 255, 0.24)") || !focusOutline.includes("inset")) throw new Error(`Wrong focused outline: ${focusOutline}`);
    if (height === 900) await page.locator('[aria-label="Чат с AI-ассистентом"]').screenshot({ path: "preview-checks/ai-chat-input-focused.png" });
    await page.getByRole("textbox", { name: "Задать вопрос" }).fill("Как подключить карту?");
    await page.locator('[data-state="entered"]').waitFor();
    const entered = await page.locator('[data-state="entered"]').evaluate((element) => ({ outline: getComputedStyle(element).boxShadow, icon: element.querySelector("button img")?.getAttribute("src"), iconLoaded: element.querySelector("button img")?.naturalWidth > 0 }));
    if (!entered.outline.includes("rgba(255, 255, 255, 0.24)") || !entered.icon?.endsWith("send-active.svg") || !entered.iconLoaded) throw new Error(`Wrong entered state: ${JSON.stringify(entered)}`);
    const singleLinePadding = await page.locator('[data-state="entered"]').evaluate((element) => {
      const field = element.querySelector("textarea").getBoundingClientRect();
      const bar = element.getBoundingClientRect();
      return { top: field.top - bar.top, bottom: bar.bottom - field.bottom };
    });
    if (Math.abs(singleLinePadding.top - singleLinePadding.bottom) > 1) throw new Error(`Unequal single-line padding: ${JSON.stringify(singleLinePadding)}`);
    if (height === 900) await page.locator('[aria-label="Чат с AI-ассистентом"]').screenshot({ path: "preview-checks/ai-chat-input-entered.png" });
    const question = "Расскажите, какие возможности кастомизации карт доступны для геоаналитики и как подключить поиск объектов в нашем продукте?";
    await page.getByRole("textbox", { name: "Задать вопрос" }).fill(question);
    const multiline = await page.locator('[data-state="entered"]').evaluate((element) => {
      const field = element.querySelector("textarea");
      const button = element.querySelector("button");
      const conversation = element.closest("section").querySelector('[class*="conversation"]');
      const lastMessageBottom = conversation.querySelector('[class*="messages"]')?.getBoundingClientRect().bottom;
      return { barHeight: element.getBoundingClientRect().height, fieldHeight: field.getBoundingClientRect().height, fieldTop: field.getBoundingClientRect().top, fieldBottom: field.getBoundingClientRect().bottom, buttonBottom: button.getBoundingClientRect().bottom, barBottom: element.getBoundingClientRect().bottom, barTop: element.getBoundingClientRect().top, lastMessageBottom, blur: getComputedStyle(element).backdropFilter, radius: getComputedStyle(element).borderRadius, overflow: getComputedStyle(element).overflow };
    });
    if (multiline.barHeight <= 64 || multiline.fieldHeight <= 24 || Math.abs(multiline.barBottom - multiline.buttonBottom - 8) > 1) throw new Error(`Multiline input geometry: ${JSON.stringify(multiline)}`);
    if (Math.abs(multiline.fieldTop - multiline.barTop - (multiline.barBottom - multiline.fieldBottom)) > 1 || Math.abs(multiline.fieldTop - multiline.barTop - singleLinePadding.top) > 1) throw new Error(`Unequal multiline padding: ${JSON.stringify({ singleLinePadding, multiline })}`);
    if (multiline.blur !== "blur(200px)" || multiline.radius !== "20px" || multiline.overflow !== "hidden" || multiline.barTop - multiline.lastMessageBottom < 19) throw new Error(`Input background or message gap: ${JSON.stringify(multiline)}`);
    if (height === 900) await page.locator('[aria-label="Чат с AI-ассистентом"]').screenshot({ path: "preview-checks/ai-chat-input-multiline.png" });
    await page.getByRole("textbox", { name: "Задать вопрос" }).fill(question.repeat(8));
    const capped = await page.getByRole("textbox", { name: "Задать вопрос" }).evaluate((field) => ({ height: field.getBoundingClientRect().height, scrollHeight: field.scrollHeight }));
    if (capped.height !== 120 || capped.scrollHeight <= capped.height) throw new Error(`Long input did not scroll internally: ${JSON.stringify(capped)}`);
    await page.getByRole("textbox", { name: "Задать вопрос" }).fill("Как подключить карту?");
    await page.getByRole("textbox", { name: "Задать вопрос" }).press("Enter");
    await page.getByText("Как подключить карту?").waitFor();
    if (errors.length) throw new Error(errors.join("; "));
    console.log(`${height}px: ${JSON.stringify(geometry)}; chat flow passed`);
    await page.close();
  }
} finally {
  await browser.close();
}
