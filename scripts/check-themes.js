#!/usr/bin/env node
'use strict';
/* ============================================================
 * check-themes.js — 主题换肤契约门禁（2026-11-17）
 *
 * 校验：
 *   1) tokens.json.themes 存在 default，且 default.brand = colors.primary.default；
 *   2) 每个主题 id 合法、brand 为 6 位 hex；
 *   3) 每个主题的 text-on-brand 对 primary 的 WCAG 对比度 ≥ 4.5:1；
 *   4) page-template 已有 themeSel 时，其选项 id 与 themes + dark 完全一致。
 *
 * 设计：themes 缺失视为旧版（M0/M1 前）跳过；themeSel 缺失视为 M2 前跳过。
 * 退出码：0 通过，1 失败（ci-local 阻断）。
 * ============================================================ */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const TOKENS = path.join(ROOT, '弘讯web端design-system', 'tokens.json');
const TEMPLATE = path.join(ROOT, '弘讯web端design-system', 'page-template.html');
const { generatePalette } = require(path.join(ROOT, 'brand-color-engine', 'generate.js'));

function lum(hex) {
  const h = String(hex).replace('#', '');
  const c = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255)
    .map(v => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function contrast(a, b) {
  const l1 = Math.max(lum(a), lum(b));
  const l2 = Math.min(lum(a), lum(b));
  return (l1 + 0.05) / (l2 + 0.05);
}

let fail = 0;
function bad(msg) { console.error('❌ ' + msg); fail++; }

const tokens = JSON.parse(fs.readFileSync(TOKENS, 'utf8'));
const themes = tokens.themes || [];
if (!themes.length) {
  console.log('check-themes：未登记 themes（旧版），跳过');
  process.exit(0);
}

const base = String((tokens.colors && tokens.colors.primary && tokens.colors.primary.default) || '').toUpperCase();
const def = themes.find(t => t.id === 'default');
if (!def) bad('themes 缺 default 主题');
else if (String(def.brand).toUpperCase() !== base) bad('themes.default.brand 与 colors.primary.default 不一致（' + def.brand + ' vs ' + base + '）');

for (const t of themes) {
  if (!t.id || !/^[a-z0-9-]+$/.test(t.id)) { bad('主题 id 非法: ' + JSON.stringify(t.id)); continue; }
  if (!/^#?[0-9a-f]{6}$/i.test(String(t.brand))) { bad('主题 ' + t.id + ' brand 非 6 位 hex: ' + t.brand); continue; }
  const p = generatePalette(t.brand, { mode: 'light', platform: 'web' });
  const onBrand = String(t.textOnBrand || '#FFFFFF').toUpperCase();
  const ratio = contrast(onBrand, p.primary.default);
  if (ratio < 4.5) bad('主题 ' + t.id + ' 文字对比不足: ' + onBrand + ' on ' + p.primary.default + ' = ' + ratio.toFixed(2) + ':1 (<4.5)');
}

const html = fs.readFileSync(TEMPLATE, 'utf8');
if (html.includes('id="themeSel"')) {
  const opts = [...html.matchAll(/data-skin="([^"]+)"/g)].map(m => m[1]);
  const dark = /data-theme-choice="dark"/.test(html);
  const expected = new Set(themes.map(t => t.id));
  const actual = new Set(opts);
  for (const id of expected) if (!actual.has(id)) bad('page-template 缺主题选项: ' + id);
  for (const id of actual) if (!expected.has(id)) bad('page-template 多出未登记主题: ' + id);
  if (!dark) bad('page-template 缺「暗色」选项（data-theme-choice="dark"）');
} else {
  console.log('check-themes：page-template 尚无 themeSel（M2 前），跳过选项检查');
}

if (fail) {
  console.error('check-themes：' + fail + ' 项失败');
  process.exit(1);
}
console.log('check-themes：' + themes.length + ' 个主题 token / 对比度 / 选项一致');
