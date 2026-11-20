#!/usr/bin/env node
'use strict';
/* ============================================================
 * check-icon-gallery.js — 图标库 ↔ 规范展示图标模块一致性（2026-11-20）
 *
 * 背景：icons/ 新增/更新图标后，规范展示页的「图标集」模块长期没跟上
 *   （home/language/close 仍是旧 path，palette/tick/avatar/app_download/eye_on 未展示）。
 *   本脚本把「库里的图标必须出现在展示页」变成门禁，防止入库即失联。
 *
 * 检查：
 *   1) icons/*.svg 的 path 至少有一处出现在规范展示页 `#icons` 的图标单元中；
 *   2) 展示页标题「图标集 · Icon（N）」N 与库内 SVG 数一致。
 * 退出码：0 通过 / 1 失败。
 * ============================================================ */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const WEB = path.join(ROOT, '弘讯web端design-system');
const ICONS = path.join(WEB, 'icons');
const SPEC = path.join(WEB, 'web规范展示_左右结构.html');
const norm = s => s.replace(/\s+/g, ' ').trim();

const html = fs.readFileSync(SPEC, 'utf8');
const cells = [...html.matchAll(/<div class="icon-cell">([\s\S]*?)<\/div>/g)].map(m => m[1]).join('');
const gallery = new Set([...cells.matchAll(/<path[^>]*\bd="([^"]+)"/g)].map(m => norm(m[1])));
const files = fs.readdirSync(ICONS).filter(f => f.endsWith('.svg'));
const missing = [];
for (const f of files) {
  const svg = fs.readFileSync(path.join(ICONS, f), 'utf8');
  const ds = [...svg.matchAll(/<path[^>]*\bd="([^"]+)"/g)].map(m => norm(m[1]));
  if (ds.length && !ds.some(d => gallery.has(d))) missing.push(f);
}

let fail = 0;
console.log('▶ 图标库 ↔ 规范展示图标模块（库 ' + files.length + ' / 展示单元 ' + (html.match(/class="icon-cell"/g) || []).length + '）');
if (missing.length) {
  console.error('❌ 图标未在展示页出现：' + missing.join(', '));
  fail++;
}
const m = html.match(/图标集 · Icon（(\d+)）/);
if (!m) { console.error('❌ 展示页缺「图标集 · Icon（N）」计数标题'); fail++; }
else if (Number(m[1]) !== files.length) { console.error('❌ 展示页图标计数 ' + m[1] + ' ≠ 库内 ' + files.length); fail++; }
else console.log('✓ 图标计数与库一致：' + files.length);

if (fail) { console.log('\n❌ icon gallery：' + fail + ' 项失败'); process.exit(1); }
console.log('✅ 图标库全部入库并在展示页可查');
