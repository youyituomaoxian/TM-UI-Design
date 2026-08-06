const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const target = process.argv[2] || 'page-template.html';
  const outDir = process.argv[3] || '.workbuddy/tmp';
  const fileUrl = 'file://' + path.resolve(target);
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  const r = {};
  r.sidebarWidthExpanded = await page.$eval('.sidebar', el => Math.round(el.getBoundingClientRect().width));
  r.firstNodeHasIco = await page.$eval('.sidebar .tree-node', el => !!el.querySelector('.tree-ico'));
  r.icoVisibleExpanded = await page.$eval('.sidebar .tree-node .tree-ico', el => getComputedStyle(el).display !== 'none');
  r.labelVisibleExpanded = await page.$eval('.sidebar .tree-node .tree-label', el => getComputedStyle(el).display !== 'none');
  r.footerJustifyExpanded = await page.$eval('.footer', el => getComputedStyle(el).justifyContent);
  // 选中态不应有左侧白强调条（box-shadow 不得含 inset）
  r.selectedShadows = await page.$$eval('.tree-node.on', els => els.map(e => getComputedStyle(e).boxShadow));
  r.selectedHasInsetBar = r.selectedShadows.some(s => /inset/.test(s));
  await page.screenshot({ path: path.join(outDir, 'shot-expanded.png'), fullPage: false });

  // 折叠
  await page.click('.collapse-btn');
  await new Promise(res => setTimeout(res, 450));
  r.sidebarWidthCollapsed = await page.$eval('.sidebar', el => Math.round(el.getBoundingClientRect().width));
  r.icoVisibleCollapsed = await page.$eval('.sidebar .tree-node .tree-ico', el => getComputedStyle(el).display !== 'none');
  r.labelVisibleCollapsed = await page.$eval('.sidebar .tree-node .tree-label', el => getComputedStyle(el).display !== 'none');
  r.footerJustifyCollapsed = await page.$eval('.footer', el => getComputedStyle(el).justifyContent);
  await page.screenshot({ path: path.join(outDir, 'shot-collapsed.png'), fullPage: false });

  console.log(JSON.stringify(r, null, 2));
  await browser.close();
})().catch(e => { console.error('ERR', e); process.exit(1); });
