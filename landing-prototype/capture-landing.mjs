import { createRequire } from "node:module";
import { join } from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/Legion/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });

try {
  for (const width of [1440, 375]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map((img) => img.decode().catch(() => {})));
    });
    const result = await page.evaluate(() => ({
      sections: [...document.querySelectorAll("main > section")].map((section) => section.id || "hero"),
      icons: [...document.querySelectorAll("#main-values img")].map((img) => ({ src: new URL(img.src).pathname, loaded: img.complete && img.naturalWidth > 0 })),
      overflow: document.documentElement.scrollWidth > innerWidth,
    }));
    await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
    const output = join("preview-checks", `landing-current-${width}.png`);
    await page.screenshot({ path: output, fullPage: true });
    console.log(JSON.stringify({ width, status: response.status(), output, ...result, errors }));
    if (response.status() !== 200 || errors.length || result.overflow || result.icons.length !== 3 || result.icons.some((icon) => !icon.loaded)) process.exitCode = 1;
    await page.close();
  }
} finally {
  await browser.close();
}
