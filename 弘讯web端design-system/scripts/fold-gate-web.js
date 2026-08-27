#!/usr/bin/env node
/* ============================================================
 * fold-gate-web.js — V11-T5 运行时首屏截断门禁（一期 · 信息性）
 *
 * 原则（RULES §4.4c，用户拍板）：滚动自由，但视口底边只允许落在
 * 区块之间的 gap 上——看板页首屏核心卡片禁止被底边拦腰截断。
 *
 * 判定：页面含 .stat-grid（看板特征）→ stat-grid 之后第一个 .grid12
 * （主图行）内每张卡片必须完整在 main.content 可视底边之内。
 * 次屏行（第二个及之后的 grid12）不检查——滚动后内容被切是正常形态。
 *
 * 用法：node fold-gate-web.js <html> [<html> ...]
 * exit 0 = 全部完整 / 无看板特征；exit 1 = 存在核心卡被截断；
 * exit 2 = 环境不可用（ci-local 显示 SKIP，不计失败）。
 * ============================================================ */
'use strict';
const path = require('path');

let chromium;
const PW_CANDIDATES = [
  path.join(process.env.USERPROFILE || '', '.workbuddy', 'binaries', 'node', 'workspace', 'node_modules', 'playwright-core'),
];
let pw = null;
for (const c of PW_CANDIDATES) { try { pw = require(c); break; } catch (e) {} }
if (!pw) { try { pw = require('playwright-core'); } catch (e) {} }
if (!pw) { console.log(JSON.stringify([{ skip: 'playwright-core 不可用' }])); process.exit(2); }
chromium = pw.chromium;

const files = process.argv.slice(2);
if (!files.length) { console.log(JSON.stringify([{ skip: '未提供文件' }])); process.exit(2); }

(async () => {
  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
  } catch (e) {
    console.log(JSON.stringify([{ skip: 'Chrome 启动失败: ' + String(e.message).slice(0, 80) }]));
    process.exit(2);
  }
  const results = [];
  for (const f of files) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    try {
      await page.goto('file:///' + path.resolve(f).replace(/\\/g, '/'), { waitUntil: 'load', timeout: 15000 });
      await page.waitForTimeout(700); // 入场动画结束（transform 归零后量测才准，V10 教训）
      const r = await page.evaluate(() => {
        if (!document.querySelector('.stat-grid')) return { skip: '非看板页（无 stat-grid）' };
        const content = document.querySelector('main.content') || document.body;
        const fold = content.getBoundingClientRect().bottom;
        const grids = [...document.querySelectorAll('.grid12')];
        if (!grids.length) return { skip: '无 grid12 主图行' };
        const hero = grids[0]; // 主图行 = 第一个 grid12（RULES §4.4c B 矩阵：看板核心 = KPI + 主图行）
        const cards = [...hero.querySelectorAll(':scope > [class*="col-"] > .card, :scope > [class*="col-"] > section')]
          .filter(c => { const b = c.getBoundingClientRect(); return b.height > 40; });
        const cut = [];
        cards.forEach(c => {
          const b = c.getBoundingClientRect();
          if (b.top < fold && b.bottom > fold + 2)
            cut.push({ title: (c.querySelector('.card-title') || {}).textContent || (c.className + '').slice(0, 20),
              visiblePct: Math.round((fold - b.top) / b.height * 100) });
        });
        return { cards: cards.length, cut,
          foldCutPct: cut.length ? cut[0].visiblePct : 0 };
      });
      results.push({ file: path.basename(f), ...r });
    } catch (e) {
      results.push({ file: path.basename(f), error: String(e.message).slice(0, 80) });
    }
    await page.close();
  }
  await browser.close();
  console.log(JSON.stringify(results, null, 1));
  const bad = results.filter(r => r.cut && r.cut.length);
  process.exit(bad.length ? 1 : 0);
})();
