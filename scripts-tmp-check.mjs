import { chromium } from "playwright";

const widths = [1440, 1280, 1024, 768, 640, 390, 375];
const outDir = "/private/tmp/claude-501/-Users-sudhirkumar-Documents-multicity/bce2e4a4-5d8c-46e7-b454-b1f5dc513d68/scratchpad/shots";

const browser = await chromium.launch();
const results = [];

for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto("http://localhost:3001/", { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(800);

  const overflow = await page.evaluate(() => {
    const docWidth = document.documentElement.scrollWidth;
    const winWidth = window.innerWidth;
    const overflowingEls = [];
    document.querySelectorAll("body *").forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.right > winWidth + 2 || rect.left < -2) {
        overflowingEls.push({
          tag: el.tagName,
          cls: typeof el.className === "string" ? el.className.slice(0, 120) : "",
          right: Math.round(rect.right),
          left: Math.round(rect.left),
        });
      }
    });
    return { docWidth, winWidth, hasOverflow: docWidth > winWidth + 2, overflowingEls: overflowingEls.slice(0, 15) };
  });

  await page.screenshot({ path: `${outDir}/full-${width}.png`, fullPage: true });

  // Also grab a viewport-only shot of the hero/header area
  await page.screenshot({ path: `${outDir}/top-${width}.png`, fullPage: false });

  results.push({ width, ...overflow });
  await page.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
