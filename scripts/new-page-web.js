#!/usr/bin/env node
/* ============================================================
 * new-page-web.js — Web B 端页面脚手架（2026-08-07，P2 克隆来源标记）
 *
 * 用法：node new-page-web.js <语义名> [目标目录，默认 cwd/output]
 *
 * 行为：
 *   1. cp 弘讯web端design-system/page-template.html → <目标>/output/<语义名>_<YYYYMMDD>_<HHmm>.html
 *   2. 修正 CSS link（template.css → 相对仓库端目录的相对路径）
 *   3. 注入 <meta name="x-template-clone" content="弘讯web端design-system/page-template.html">
 *      —— P1 门禁 template.clone.missing 的克隆凭证（缺 meta 的 B 端页面报 HIGH）
 *   4. 同目录同名自动追加 _2/_3（绝不覆盖）
 *
 * 铁律：page-template.html 是唯一框架来源；禁止从空白 HTML 或自搭框架起步。
 * ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const END = '弘讯web端design-system';
const SRC = path.join(REPO_ROOT, END, 'page-template.html');
const META = `<meta name="x-template-clone" content="${END}/page-template.html">`;

function pad(n) { return String(n).padStart(2, '0'); }

function main() {
  const name = process.argv[2];
  if (!name || !/^[\u4e00-\u9fa5A-Za-z0-9_-]+$/.test(name)) {
    console.error('用法: node new-page-web.js <语义名> [目标目录]（语义名：中文/字母/数字/-/_）');
    process.exit(1);
  }
  const base = process.argv[3] ? path.resolve(process.argv[3]) : process.cwd();
  const outDir = path.join(base, 'output');
  fs.mkdirSync(outDir, { recursive: true });

  const ts = new Date();
  const stamp = pad(ts.getFullYear()) + pad(ts.getMonth() + 1) + pad(ts.getDate()) + '_' + pad(ts.getHours()) + pad(ts.getMinutes());
  let file = path.join(outDir, `${name}_${stamp}.html`);
  let n = 2;
  while (fs.existsSync(file)) { file = path.join(outDir, `${name}_${stamp}_${n}.html`); n++; }

  if (!fs.existsSync(SRC)) {
    console.error(`❌ 框架克隆源不存在: ${SRC}`);
    process.exit(1);
  }
  let html = fs.readFileSync(SRC, 'utf8');

  // 1) link 修正：template.css（同目录）→ 相对仓库端目录（同盘才能相对；跨盘警告保留原样）
  const rel = path.relative(outDir, path.join(REPO_ROOT, END)).split(path.sep).join('/');
  if (/^[A-Za-z]:\//.test(rel)) {
    console.warn(`⚠️ 目标目录与仓库不在同一盘符（${rel}），无法写相对 link——请手动把 <link rel="stylesheet"> 的 href 改为指向仓库 ${END}/template.css 的相对路径`);
  } else {
    html = html.replace('<link rel="stylesheet" href="template.css">', `<link rel="stylesheet" href="${rel}/template.css">`);
  }

  // 2) meta 注入（<title> 前，P1 克隆凭证）
  html = html.replace(/<title>/, META + '\n<title>');

  fs.writeFileSync(file, html, 'utf8');
  console.log(`✅ 已创建: ${file}`);
  console.log(`   框架来源: ${SRC}`);
  console.log(`   门禁: cd "${path.join(REPO_ROOT, END)}" && node validate-spec.js "${file}"  → 期望 0 HIGH`);
  console.log(`   下一步: 在 <main class="content"> 内按业务填内容（框架外壳零改动）。`);
}

main();
