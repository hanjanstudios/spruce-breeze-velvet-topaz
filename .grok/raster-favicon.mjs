import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const svgBytes = readFileSync("/workspace/public/favicon.svg");
const html = `<!doctype html>
<html><body style="margin:0;background:#9aa">
  <div id="s16" style="width:16px;height:16px"><img src="/favicon.svg" width="16" height="16" style="display:block"></div>
  <div id="s32" style="width:32px;height:32px;margin-top:8px"><img src="/favicon.svg" width="32" height="32" style="display:block"></div>
  <div id="s64" style="width:64px;height:64px;margin-top:8px"><img src="/favicon.svg" width="64" height="64" style="display:block"></div>
</body></html>`;

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 160, height: 200 } });
await page.route("**/favicon.svg", (route) =>
  route.fulfill({ contentType: "image/svg+xml", body: svgBytes }),
);
await page.setContent(html, { waitUntil: "load" });
await page.waitForTimeout(150);
await page.screenshot({ path: "/workspace/.grok/favicon-preview.png" });
await page.locator("#s16").screenshot({ path: "/workspace/.grok/favicon-16.png" });
await page.locator("#s32").screenshot({ path: "/workspace/.grok/favicon-32.png" });
await browser.close();
console.log("ok");
