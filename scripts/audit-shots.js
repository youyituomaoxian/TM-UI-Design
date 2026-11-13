#!/usr/bin/env node
/*
 * audit-shots.js — 存量改造 · 表现层截图证据门禁（2026-11-12，F12 / R-08）
 * ---------------------------------------------------------------------------
 * 解决什么：P3 只写「逐 tab × 逐皮 × 滚动态截图审查」，但没有任何产物与门禁
 * ——「已人工审查」不可验证，缺图与「看过且没问题」在记录上无法区分。
 * 本脚本只做一件事：**按矩阵校验截图是否存在**（fail-closed），内容判定仍归人/视觉模型。
 *
 * 约定（与 templates/存量改造审计台账模板.md §4 一致）：
 *   <shots>/<页面相对路径去扩展名>/<theme>-<state>.png
 *   theme ∈ light | dark      state ∈ default | scroll50（有 tab 时可用 <tab>--<theme>-<state>.png）
 *
 * 用法：
 *   node scripts/audit-shots.js <项目目录> [--shots output/audit-shots] [--themes light,dark]
 *        [--states default,scroll50] [--init] [--min-bytes 1024]
 *     --init     只建目录骨架 + manifest.json（填清单用），不判定，exit 0
 *     --min-bytes 小于该字节数的 png 视为无效（占位图）——默认 1024
 * exit：任一格缺图/无效 → 1；全部齐全 → 0。
 *
 * 说明：不拍摄，只验收。拍摄可用 Chrome CDP（参考 output/_cdp-shot.js）或人工截图后按命名落盘。
 * ---------------------------------------------------------------------------
 */
'use strict';
const fs = require('fs');
const path = require('path');

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'dist-static', 'build', 'packages', '.reasonix', '.workbuddy']);
const argv = process.argv.slice(2);
const opt = { dir: null, shots: 'output/audit-shots', themes: ['light', 'dark'], states: ['default', 'scroll50'], init: false, minBytes: 1024 };
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--shots') opt.shots = argv[++i];
  else if (a === '--themes') opt.themes = argv[++i].split(',').map(s => s.trim()).filter(Boolean);
  else if (a === '--states') opt.states = argv[++i].split(',').map(s => s.trim()).filter(Boolean);
  else if (a === '--min-bytes') opt.minBytes = parseInt(argv[++i], 10) || 1024;
  else if (a === '--init') opt.init = true;
  else if (!a.startsWith('-')) opt.dir = a;
}
if (!opt.dir) { console.error('用法: node scripts/audit-shots.js <项目目录> [--shots 目录] [--init]'); process.exit(2); }
const dir = path.resolve(opt.dir);
if (!fs.existsSync(dir)) { console.error('目录不存在: ' + dir); process.exit(2); }

function walk(d, out) {
  for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name)) walk(p, out); }
    else if (/\.html?$/i.test(e.name)) out.push(p);
  }
}
const pages = [];
walk(dir, pages);
if (!pages.length) { console.error('❌ 未枚举到 HTML（' + dir + '）'); process.exit(1); }

const shotsRoot = path.resolve(opt.shots);
const rows = [];
let missing = 0, invalid = 0;
for (const p of pages) {
  const rel = path.relative(dir, p).replace(/\\/g, '/').replace(/\.html?$/i, '');
  const outDir = path.join(shotsRoot, ...rel.split('/'));
  if (opt.init) { fs.mkdirSync(outDir, { recursive: true }); continue; }
  const cells = [];
  for (const theme of opt.themes) for (const state of opt.states) {
    const f = path.join(outDir, theme + '-' + state + '.png');
    let ok = false, why = '缺图';
    if (fs.existsSync(f)) {
      const sz = fs.statSync(f).size;
      if (sz >= opt.minBytes) ok = true;
      else { why = '占位图 ' + sz + 'B'; invalid++; }
    } else missing++;
    cells.push({ file: theme + '-' + state, ok, why });
  }
  rows.push({ rel, cells });
}

if (opt.init) {
  const manifest = { project: dir, shotsRoot, themes: opt.themes, states: opt.states, pages: pages.map(p => path.relative(dir, p).replace(/\\/g, '/')) };
  fs.writeFileSync(path.join(shotsRoot, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`✅ 已建目录骨架：${shotsRoot}（${pages.length} 页，每页 ${opt.themes.length * opt.states.length} 格）`);
  console.log('   接下来把截图按 <theme>-<state>.png 落盘，再跑本脚本（不带 --init）验收。');
  process.exit(0);
}

const head = ['页面'].concat(opt.themes.flatMap(t => opt.states.map(s => t + '-' + s)));
console.log('\n📸 表现层截图证据校验（' + shotsRoot + '）');
console.log('  ' + head.join(' | '));
for (const r of rows) {
  const marks = r.cells.map(c => (c.ok ? '✅' : '❌'));
  const bad = r.cells.filter(c => !c.ok).map(c => c.file + '(' + c.why + ')');
  console.log('  ' + r.rel + ' | ' + marks.join(' | ') + (bad.length ? '  ← ' + bad.join('、') : ''));
}
const total = rows.length * opt.themes.length * opt.states.length;
console.log(`\n📊 ${rows.length} 页 × ${opt.themes.length} 主题 × ${opt.states.length} 状态 = ${total} 格；缺 ${missing} / 无效 ${invalid}`);
if (missing || invalid) { console.log('❌ 证据不全，P3 未完成（缺图 = 该格未审），exit 1。'); process.exit(1); }
console.log('✅ 证据齐全（exit 0）。内容判定仍须人工/视觉模型逐格签字。');
process.exit(0);
