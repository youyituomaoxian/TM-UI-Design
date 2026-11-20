#!/usr/bin/env node
'use strict';
/* ============================================================
 * sync-showcase.js — 从端目录根生成 showcase 副本（2026-11-17）
 *
 * 当前 showcase 只保留新左右结构示例，不再从 V2.1 展示页生成副本。
 * 只做路径改写 + 生成头，不改内容、不改门禁。
 *
 * 用法：
 *   node scripts/sync-showcase.js          # 写入
 *   node scripts/sync-showcase.js --check  # 只检查是否漂移，exit 1 表示需要同步
 * ============================================================ */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const WEB = path.join(ROOT, '弘讯web端design-system');
const SHOW = path.join(WEB, 'showcase');
const TEMPLATE = fs.readFileSync(path.join(WEB, 'template.css'), 'utf8');
const CHECK = process.argv.includes('--check');

const HEADER = '<!-- AUTO-GENERATED from 弘讯web端design-system/ root files by scripts/sync-showcase.js. DO NOT EDIT. -->\n';

function read(p) { return fs.readFileSync(p, 'utf8'); }
function withHeader(html) {
  return html.replace(/^<!DOCTYPE html>\r?\n?/i, m => m + HEADER);
}
function inlineTemplate(html) {
  return html.replace(/<link rel="stylesheet" href="template\.css(?:\?[^"]*)?"\s*\/?>/, '<style>\n' + TEMPLATE + '\n</style>');
}
function toShowcase(html) {
  return withHeader(
    html
      .replace('<link rel="stylesheet" href="template.css">', '<link rel="stylesheet" href="../template.css">')
      .replace('<link rel="stylesheet" href="template.css?v=sticky-20261113">', '<link rel="stylesheet" href="../template.css?v=sticky-20261113">')
      .replace(/href="showcase\//g, 'href="')
      .replace(/src="assets\//g, 'src="../assets/')
      .replace(/src="js\//g, 'src="../js/')
  );
}
function toRootShare(html) {
  return withHeader(inlineTemplate(html));
}
function toShowcaseShare(html) {
  return withHeader(
    inlineTemplate(html)
      .replace(/href="showcase\//g, 'href="')
      .replace(/src="assets\//g, 'src="../assets/')
  );
}


const outputs = [
  [path.join(SHOW, 'web规范展示_左右结构.html'), toShowcase(read(path.join(WEB, 'web规范展示_左右结构.html')))],
  [path.join(SHOW, 'web规范展示_左右结构_分享版.html'), toShowcaseShare(read(path.join(WEB, 'web规范展示_左右结构_分享版.html')))]
];

let bad = 0;
for (const [p, content] of outputs) {
  const old = fs.existsSync(p) ? read(p) : '';
  if (old === content) {
    console.log('✓ ' + path.relative(ROOT, p));
    continue;
  }
  if (CHECK) {
    console.error('✗ 需要同步: ' + path.relative(ROOT, p));
    bad++;
  } else {
    fs.writeFileSync(p, content, 'utf8');
    console.log('↻ 已生成: ' + path.relative(ROOT, p));
  }
}
if (CHECK && bad) {
  console.error('showcase 漂移 ' + bad + ' 个文件；运行 node scripts/sync-showcase.js');
  process.exit(1);
}
