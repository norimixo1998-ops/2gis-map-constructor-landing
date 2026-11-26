import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/Legion/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });

try {
  for (const width of [375, 390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    const response = await page.goto(`http://127.0.0.1:${process.env.PORT ?? "3000"}/geoflow-hero-preview`, { waitUntil: "networkidle" });
    const garland = page.locator("[data-garland-lit]");
    const pull = garland.getByRole("button", { name: "Зажечь новогоднюю гирлянду" });
    if (response?.status() !== 200 || await garland.count() !== 1 || await pull.getAttribute("aria-pressed") !== "false") throw new Error(`${width}: garland missing or initially lit`);
    const offOpacity = await garland.locator("svg:first-child g path").first().evaluate((node) => getComputedStyle(node).opacity);
    if (offOpacity !== "0.28") throw new Error(`${width}: off bulbs are not dimmed (${offOpacity})`);
    await page.screenshot({ path: `preview-checks/holiday-garland-off-${width}.png`, clip: { x: 0, y: 0, width, height: 520 } });
    await pull.hover();
    await page.waitForTimeout(300);
    const hover = await page.evaluate(() => {
      const garland = document.querySelector("[data-garland-lit]");
      const button = garland.querySelector("button");
      const cord = button.querySelector("span");
      const ornament = button.querySelector("img").parentElement;
      return { lit: garland.getAttribute("data-garland-lit"), pressed: button.getAttribute("aria-pressed"), cordHeight: cord.getBoundingClientRect().height, background: getComputedStyle(ornament).backgroundColor, blur: getComputedStyle(ornament).backdropFilter };
    });
    if (hover.lit !== "false" || hover.pressed !== "false" || hover.cordHeight < 75 || hover.background !== "rgba(255, 255, 255, 0.14)" || (width < 600 ? hover.blur !== "blur(10px)" : hover.blur !== "none")) throw new Error(`${width}: hover ${JSON.stringify(hover)}`);
    await page.screenshot({ path: `preview-checks/holiday-garland-hover-${width}.png`, clip: { x: 0, y: 0, width, height: 520 } });
    await page.mouse.move(0, 0);
    if (await garland.getAttribute("data-garland-lit") !== "false") throw new Error(`${width}: hover lit the garland`);
    await pull.click();
    if (await garland.getAttribute("data-garland-lit") !== "true" || await garland.getByRole("button", { name: "Погасить новогоднюю гирлянду" }).getAttribute("aria-pressed") !== "true") throw new Error(`${width}: lights did not turn on`);
    await page.mouse.move(0, 0);
    if (await garland.getAttribute("data-garland-lit") !== "true") throw new Error(`${width}: click did not keep lights on after hover`);
    await garland.locator("button").hover();
    await page.waitForTimeout(500);
    const layout = await page.evaluate(() => {
      const garland = document.querySelector("[data-garland-lit]");
      const desktop = garland.querySelector("svg:first-child");
      const mobile = garland.querySelector("svg:nth-child(2)");
      const ornament = garland.querySelector("button img");
      const ornamentSurface = ornament.parentElement;
      const cord = garland.querySelector("button span");
      const visibleLights = innerWidth < 600 ? mobile : desktop;
      const glass = visibleLights.querySelector("g path");
      const pulseDurations = [...visibleLights.querySelectorAll("g path")].map((bulb) => getComputedStyle(bulb).animationDuration);
      const wire = visibleLights.querySelector("path");
      const cordRect = cord.getBoundingClientRect();
      const cordX = cordRect.left + cordRect.width / 2;
      let nearest = { dx: Infinity, y: 0 };
      for (let step = 0; step <= 600; step++) {
        const point = wire.getPointAtLength(wire.getTotalLength() * step / 600);
        const screen = new DOMPoint(point.x, point.y).matrixTransform(wire.getScreenCTM());
        const dx = Math.abs(screen.x - cordX);
        if (dx < nearest.dx) nearest = { dx, y: screen.y };
      }
      return { overflow: document.documentElement.scrollWidth > innerWidth, desktopBulbs: desktop.querySelectorAll("g").length, mobileBulbs: mobile.querySelectorAll("g").length, desktopVisible: getComputedStyle(desktop).display !== "none", mobileVisible: getComputedStyle(mobile).display !== "none", headerHeight: document.querySelector("header").getBoundingClientRect().height, ornamentLoaded: ornament?.naturalWidth === 44, uprightBulbs: [...desktop.querySelectorAll("g")].every((bulb) => !bulb.getAttribute("transform").includes("rotate")), softGlow: getComputedStyle(glass).filter.includes("drop-shadow"), pulsing: getComputedStyle(glass).animationName !== "none", pulseVariety: new Set(pulseDurations).size, hoverBackground: getComputedStyle(ornamentSurface).backgroundColor, cordOverlap: cordRect.bottom - ornamentSurface.getBoundingClientRect().top, wireGap: cordRect.top - nearest.y, wireColor: getComputedStyle(wire).stroke, cordColor: getComputedStyle(cord).backgroundColor, wireWidth: parseFloat(getComputedStyle(wire).strokeWidth), cordWidth: cordRect.width };
    });
    if (layout.overflow || layout.headerHeight !== 80 || layout.desktopBulbs !== 12 || layout.mobileBulbs !== 7 || layout.mobileVisible !== (width < 600) || layout.desktopVisible === layout.mobileVisible || !layout.ornamentLoaded || !layout.uprightBulbs || !layout.softGlow || !layout.pulsing || layout.pulseVariety < 5 || layout.hoverBackground !== "rgba(255, 255, 255, 0.14)" || layout.cordOverlap < 1 || Math.abs(layout.wireGap) > 3 || layout.wireColor !== layout.cordColor || Math.abs(layout.wireWidth - layout.cordWidth) > .1) throw new Error(`${width}: ${JSON.stringify(layout)}`);
    await page.screenshot({ path: `preview-checks/holiday-garland-on-${width}.png`, clip: { x: 0, y: 0, width, height: 520 } });
    await garland.locator("button").focus();
    await page.keyboard.press("Space");
    if (await garland.getAttribute("data-garland-lit") !== "false") throw new Error(`${width}: keyboard toggle did not turn lights off`);
    await page.evaluate(() => window.scrollTo(0, 240));
    await page.waitForFunction(() => document.querySelector("header")?.getAttribute("data-header-mode") === "sticky" && getComputedStyle(document.querySelector("[data-garland-lit]")).opacity === "0");
    await page.close();
    console.log(`${width}px: toggle, responsive layout and sticky header OK`);
  }
  const other = await browser.newPage();
  await other.goto(`http://127.0.0.1:${process.env.PORT ?? "3000"}/`);
  if (await other.locator("[data-garland-lit]").count()) throw new Error("Garland leaked onto another landing page");
  await other.close();
  const reduced = await browser.newPage({ reducedMotion: "reduce" });
  await reduced.goto(`http://127.0.0.1:${process.env.PORT ?? "3000"}/geoflow-hero-preview`);
  await reduced.getByRole("button", { name: "Зажечь новогоднюю гирлянду" }).click();
  const reducedStyle = await reduced.locator("[data-garland-lit] svg:first-child g path").first().evaluate((node) => ({ animation: getComputedStyle(node).animationName, opacity: getComputedStyle(node).opacity }));
  if (reducedStyle.animation !== "none" || reducedStyle.opacity !== "1") throw new Error(`reduced motion: ${JSON.stringify(reducedStyle)}`);
  await reduced.close();
  const touch = await browser.newPage({ viewport: { width: 375, height: 900 }, hasTouch: true, isMobile: true });
  await touch.goto(`http://127.0.0.1:${process.env.PORT ?? "3000"}/geoflow-hero-preview`);
  await touch.getByRole("button", { name: "Зажечь новогоднюю гирлянду" }).tap();
  if (await touch.locator("[data-garland-lit]").getAttribute("data-garland-lit") !== "true") throw new Error("touch: tap did not turn lights on");
  await touch.getByRole("button", { name: "Погасить новогоднюю гирлянду" }).tap();
  if (await touch.locator("[data-garland-lit]").getAttribute("data-garland-lit") !== "false") throw new Error("touch: tap did not turn lights off");
  await touch.close();
} finally {
  await browser.close();
}
