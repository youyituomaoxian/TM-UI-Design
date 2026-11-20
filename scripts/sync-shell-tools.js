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
 * 目标：page-template.html（克隆源）、web规范展示_左右结构.html、showcase/看板、showcase/V7。
 *   派生件（showcase 副本 / 分享版）仍由 sync-showcase.js / build-share-web.js 生成，本脚本不碰。
 *
 * 用法：
 *   node scripts/sync-shell-tools.js          # 注入（只写有差异的页）
 *   node scripts/sync-shell-tools.js --check  # 只检查漂移，exit 1 表示需要同步
 * ============================================================ */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const WEB = path.join(ROOT, '弘讯web端design-system');
const SRC = path.join(WEB, 'partials', 'shell-tools.html');
const OPEN = '<div class="ws-tools">';
const TARGETS = [
  'page-template.html',
  'web规范展示_左右结构.html',
  path.join('showcase', '弘讯亮色注塑机看板.html'),
  path.join('showcase', '左右结构_v7_设备运维工作台.html')
];
const CHECK = process.argv.includes('--check');

function extract(html) {
  const i = html.indexOf(OPEN);
  if (i < 0) return null;
  let depth = 0, j = i;
  while (j < html.length) {
    if (html.startsWith('<div', j)) depth++;
    if (html.startsWith('</div>', j)) { depth--; if (depth === 0) { j += 6; break; } }
    j++;
  }
  return html.slice(i, j);
}
const norm = s => s.replace(/src="[^"]*"/g, 'src=""').replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
// Web 根相对 → 子目录相对（showcase/ 下的页面）
const toSubdir = s => s.replace(/(src|href)="assets\//g, '$1="../assets/');

const srcBlock = extract(fs.readFileSync(SRC, 'utf8'));
if (!srcBlock) { console.error('✗ 真源缺 .ws-tools：' + path.relative(ROOT, SRC)); process.exit(2); }

let bad = 0;
for (const rel of TARGETS) {
  const p = path.join(WEB, rel);
  if (!fs.existsSync(p)) { console.error('✗ 页面不存在：' + rel); bad++; continue; }
  const html = fs.readFileSync(p, 'utf8');
  const cur = extract(html);
  if (!cur) { console.error('✗ 缺 .ws-tools：' + rel); bad++; continue; }
  const want = path.dirname(p) === WEB ? srcBlock : toSubdir(srcBlock);
  if (norm(cur) === norm(want)) { console.log('✓ ' + rel); continue; }
  if (CHECK) { console.error('✗ 需同步：' + rel); bad++; continue; }
  const i = html.indexOf(OPEN);
  fs.writeFileSync(p, html.slice(0, i) + want + html.slice(i + cur.length), 'utf8');
  console.log('↻ 已注入：' + rel);
}
if (bad) {
  console.error(CHECK ? '外壳工具区漂移 ' + bad + ' 页；运行 node scripts/sync-shell-tools.js' : '外壳工具区同步失败 ' + bad + ' 页');
  process.exit(1);
}
console.log('✓ 外壳工具区与真源一致（' + TARGETS.length + ' 页）');
