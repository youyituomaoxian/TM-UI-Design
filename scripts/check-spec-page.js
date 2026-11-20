#!/usr/bin/env node
'use strict';
/* ============================================================
 * check-spec-page.js — 规范展示页自检（2026-11-20）
 *
 * 背景：展示页是「活说明书」，但多次出现图表坐标 NaN、旧分页器平铺、
 *   计数声明与实际不符、锚点断链等描述性/结构性问题，validate 只拦 HIGH。
 *   本脚本把展示页的「可读正确性」变成门禁，防止再次误导使用者。
 *
 * 检查：
 *   1) 图表坐标无 NaN；折线 polyline 全为数字点；柱状区数值标签 ≥ 柱数；
 *   2) 章节 ↔ 树锚点双向一致；组件/字阶/范式计数声明与实际一致；
 *   3) 分页器不得是旧平铺结构（>2 个 .pg 直系必须包 .pg-nav）；
 *   4) inline style / 页面 style 引用的 CSS 变量必须在 template.css 或页面内定义。
 * 退出码：0 通过 / 1 失败。
 * ============================================================ */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const FILE = path.join(ROOT, '弘讯web端design-system', 'web规范展示_左右结构.html');
const TPL = path.join(ROOT, '弘讯web端design-system', 'template.css');
const c = fs.readFileSync(FILE, 'utf8');
const tpl = fs.readFileSync(TPL, 'utf8');
let fail = 0;
const bad = m => { console.log('❌ ' + m); fail++; };

if (/NaN/.test(c)) bad('图表坐标含 NaN');

const ids = [...c.matchAll(/<section[^>]*id="([^"]+)"/g)].map(m => m[1]);
const anchors = [...new Set([...c.matchAll(/href="#([^"]+)"/g)].map(m => m[1]))];
const missA = anchors.filter(a => !ids.includes(a));
if (missA.length) bad('锚点无目标: ' + missA.join(','));
const missS = ids.filter(i => !anchors.includes(i));
if (missS.length) bad('章节未进树: ' + missS.join(','));

const comp = (c.match(/class="comp-card"/g) || []).length;
const compDecl = (c.match(/核心\s*(\d+)\s*件/) || [])[1];
if (!compDecl || +compDecl !== comp) bad('组件数声明 ' + (compDecl || '无') + ' ≠ 实际 ' + comp);

const typeRows = (c.match(/class="type-row"/g) || []).length;
const typeDecl = (c.match(/Typography\s*(\d+)\s*级/) || [])[1];
if (!typeDecl || +typeDecl !== typeRows) bad('字阶声明 ' + (typeDecl || '无') + ' ≠ 实际 ' + typeRows);

const chartCards = (c.match(/class="[^"]*chart-card[^"]*"/g) || []).length;
const chartDecl = (c.match(/以下\s*(\d+)\s*种范式/) || [])[1];
if (!chartDecl || +chartDecl !== chartCards) bad('范式声明 ' + (chartDecl || '无') + ' ≠ 实际 ' + chartCards);

const chartSec = c.slice(c.indexOf('id="chart-demo"'), c.indexOf('<!-- 暗色'));
const polylines = [...chartSec.matchAll(/<polyline[^>]*class="chart-line"[^>]*points="([^"]+)"/g)].map(m => m[1]);
if (!polylines.length) bad('图表区无 chart-line');
for (const p of polylines) {
  if (!/^\s*[\d.]+,[\d.]+(?:\s+[\d.]+,[\d.]+)+$/.test(p)) bad('polyline 坐标非法: ' + p.slice(0, 40));
}
if (!/class="chart-dots"/.test(chartSec)) bad('缺 chart-dots（HTML 点）');

const boxes = [...chartSec.matchAll(/<div class="chart-box[^"]*">([\s\S]*?)<\/div>/g)].map(m => m[1]);
for (const b of boxes) {
  const bars = (b.match(/class="chart-bar/g) || []).length;
  if (bars) {
    const vs = (b.match(/class="chart-v/g) || []).length;
    if (vs < bars) bad('柱状区数值标签 ' + vs + ' < 柱数 ' + bars);
  }
}

const pagers = [...c.matchAll(/<div class="pager"[^>]*>([\s\S]*?)<\/div>/g)].map(m => m[1]);
for (const pg of pagers) {
  const direct = (pg.match(/class="pg( |")/g) || []).length;
  if (direct >= 3 && !/pg-nav/.test(pg)) bad('分页器为旧平铺结构（未包 pg-nav）');
}

const rootVars = new Set([...tpl.matchAll(/--([a-z0-9-]+)\s*:/gi)].map(m => m[1]));
const pageVars = new Set([...c.matchAll(/--([a-z0-9-]+)\s*:/gi)].map(m => m[1]));
const used = new Set([...c.matchAll(/var\(--([a-z0-9-]+)/gi)].map(m => m[1]));
const undef = [...used].filter(v => !v.endsWith('-') && !rootVars.has(v) && !pageVars.has(v));
if (undef.length) bad('未定义 CSS 变量: ' + undef.join(','));

if (fail) { console.log('\n❌ 规范展示页自检：' + fail + ' 项失败'); process.exit(1); }
console.log('✅ 规范展示页自检：坐标/计数/锚点/分页/变量一致');
