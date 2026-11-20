#!/usr/bin/env node
'use strict';
/* ============================================================
 * sync-shell-tools.js — 外壳工具区（.ws-tools）单点真源注入（2026-11-20）
 *
 * 背景：顶部工具区曾在 page-template / 规范展示 / 看板 / V7 各存一份，
 *   漂移后只能靠「以 V7 为基准」的补丁防回退——示例页被逼成了标准。
 *   现在真源 = partials/shell-tools.html，各页是从它注入的副本；
 *   check-shell-chrome 以真源比对，缺副本或漂移都判 FAIL。
 *
 * 注入目标来自 scripts/gate-manifest.json → shell.inject（禁止在脚本里写死页面）。
 * 派生件（showcase 副本 / 分享版）仍由 sync-showcase.js / build-share-web.js 生成。
 *
 * 用法：
 *   node scripts/sync-shell-tools.js          # 注入（只写有差异的页）
 *   node scripts/sync-shell-tools.js --check  # 只检查漂移，exit 1 表示需要同步
 * ============================================================ */
const fs = require('fs');
const path = require('path');
const { WEB, extract, norm, toSubdir, readManifest, abs } = require('./lib/shell-tools');

const CHECK = process.argv.includes('--check');
const m = readManifest();
const truth = m.shell.truth;
const truthBlock = extract(fs.readFileSync(abs(truth), 'utf8'));
if (!truthBlock) { console.error('✗ 真源缺 .ws-tools：' + truth); process.exit(2); }

// 内容契约（DOM 挂钩）：真源必须满足 shell-ui.js 依赖的选择器/钩子
const c = m.shell.contract || {};
const missing = (c.requiredIds || []).filter(id => !truthBlock.includes('id="' + id + '"'));
for (const [key, min] of Object.entries(c.minCount || {})) {
  const n = (truthBlock.match(new RegExp(key, 'g')) || []).length;
  if (n < min) missing.push(key + '×' + n + '(<' + min + ')');
}
for (const token of c.required || []) if (!truthBlock.includes(token)) missing.push(token);
if (missing.length) {
  console.error('✗ 真源不满足工具区契约：' + missing.join(', '));
  console.error('  这些钩子被 js/shell-ui.js 与 i18n 依赖，删/改名会静默废掉主题、弹层、双语。');
  process.exit(2);
}

let bad = 0;
for (const rel of m.shell.inject) {
  const p = abs(rel);
  if (!fs.existsSync(p)) { console.error('✗ 注入目标不存在：' + rel); bad++; continue; }
  const html = fs.readFileSync(p, 'utf8');
  const cur = extract(html);
  if (!cur) { console.error('✗ 目标缺 .ws-tools：' + rel); bad++; continue; }
  const want = path.dirname(p) === WEB ? truthBlock : toSubdir(truthBlock);
  if (norm(cur) === norm(want)) { console.log('✓ ' + rel); continue; }
  if (CHECK) { console.error('✗ 需同步：' + rel); bad++; continue; }
  const i = html.indexOf('<div class="ws-tools">');
  fs.writeFileSync(p, html.slice(0, i) + want + html.slice(i + cur.length), 'utf8');
  console.log('↻ 已注入：' + rel);
}

if (bad) {
  console.error(CHECK ? '外壳工具区漂移 ' + bad + ' 页；运行 node scripts/sync-shell-tools.js' : '外壳工具区同步失败 ' + bad + ' 页');
  process.exit(1);
}
console.log('✓ 外壳工具区与真源一致（' + m.shell.inject.length + ' 页）');
