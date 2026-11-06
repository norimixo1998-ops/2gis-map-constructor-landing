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
      const media = card.lastElementChild;
      const picture = media.querySelector("picture");
      const img = media.querySelector("img");
      const sections = [...document.querySelectorAll("main > section")];
      return {
        sections: sections.map(node => node.id || "hero"),
        title: element.querySelector("h2")?.textContent,
        copyX: copy.getBoundingClientRect().x,
        copyTop: copy.getBoundingClientRect().top,
        headingBottom: heading.getBoundingClientRect().bottom,
        descriptionTop: description?.getBoundingClientRect().top,
        mediaX: media.getBoundingClientRect().x,
        copyBottom: copy.getBoundingClientRect().bottom,
        mediaTop: media.getBoundingClientRect().top,
        mediaBottom: media.getBoundingClientRect().bottom,
        cardBottom: card.getBoundingClientRect().bottom,
        pictureX: picture?.getBoundingClientRect().x,
        cardX: card.getBoundingClientRect().x,
        cardTop: card.getBoundingClientRect().top,
        mediaOverflow: getComputedStyle(media).overflow,
        cardWidth: card.getBoundingClientRect().width,
        mediaWidth: media.getBoundingClientRect().width,
        mediaHeight: media.getBoundingClientRect().height,
        image: img && {
          src: new URL(img.currentSrc).pathname,
          width: img.naturalWidth,
          height: img.naturalHeight,
          fit: getComputedStyle(img).objectFit,
        },
        scrollWidth: document.documentElement.scrollWidth,
      };
    });
    const output = join("preview-checks", `technical-demonstration-landing-${width}.png`);
    await section.screenshot({ path: output });
    console.log(JSON.stringify({ width, status: response.status(), output, ...result, errors }));
    const expected = width < 700 ? "image_mobile.png" : "demonstration%20block_desktop.png";
    const inset = width < 700 ? 20 : 48;
    if (response.status() !== 200 || errors.length || result.scrollWidth > width || !result.title || result.sections.indexOf("technical-demonstration") < 0 || !result.image?.src.endsWith(expected) || !result.image.width || result.image.fit !== "cover" || result.mediaX !== result.copyX || result.mediaOverflow !== "visible" || Math.abs(result.mediaTop - result.copyBottom - 36) > 1 || Math.abs(result.cardBottom - result.mediaBottom) > 1 || result.copyX - result.cardX !== inset || result.copyTop - result.cardTop !== inset || (width < 700 && (result.pictureX !== result.cardX || Math.abs(result.descriptionTop - result.headingBottom - 20) > 1)) || (width >= 700 && Math.abs(result.descriptionTop - result.headingBottom - 16) > 1)) process.exitCode = 1;
    if (width === 390 || width === 1440) {
      const generic = await page.evaluate(async () => {
        const section = document.querySelector("#technical-demonstration");
        const media = section.firstElementChild.lastElementChild;
        const copy = section.firstElementChild.firstElementChild;
        const picture = media.querySelector("picture");
        const img = picture.querySelector("img");
        picture.querySelector("source")?.remove();
        media.className = media.className.split(" ")[0];
        media.removeAttribute("style");
        img.src = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="1200"><rect width="600" height="1200" fill="#759b82"/></svg>');
        await img.decode();
        const imageStyle = getComputedStyle(img);
        return {
          fit: imageStyle.objectFit,
          position: imageStyle.objectPosition,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          pictureX: picture.getBoundingClientRect().x,
          copyX: copy.getBoundingClientRect().x,
          imageHeight: img.getBoundingClientRect().height,
          mediaHeight: media.getBoundingClientRect().height,
          textGap: media.getBoundingClientRect().top - copy.getBoundingClientRect().bottom,
          scrollWidth: document.documentElement.scrollWidth,
        };
      });
      const genericOutput = join("preview-checks", `technical-demonstration-generic-${width}.png`);
      await section.screenshot({ path: genericOutput });
      console.log(JSON.stringify({ width, variant: "generic", output: genericOutput, ...generic }));
      if (generic.fit !== "contain" || generic.position !== "0% 0%" || generic.naturalWidth !== 600 || generic.naturalHeight !== 1200 || generic.pictureX !== generic.copyX || Math.abs(generic.mediaHeight - generic.imageHeight) > 1 || Math.abs(generic.textGap - 36) > 1 || generic.scrollWidth > width || generic.imageHeight > (width < 700 ? 320 : 497)) process.exitCode = 1;
    }
    await page.close();
  }
} finally {
  await browser.close();
}
