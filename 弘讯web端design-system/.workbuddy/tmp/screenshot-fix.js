const puppeteer = require('puppeteer');
const path = require('path');
const { pathToFileURL } = require('url');

(async () => {
  const file = process.argv[2] || 'production-overview.html';
  const out = process.argv[3] || '.workbuddy/tmp/fix-shot.png';
  const cwd = process.cwd();
  const url = pathToFileURL(path.resolve(cwd, file)).href;

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: out, fullPage: false, clip: { x: 0, y: 0, width: 1440, height: 420 } });
  await browser.close();
  console.log('saved', out);
})();
