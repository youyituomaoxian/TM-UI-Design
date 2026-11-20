#!/usr/bin/env node
'use strict';
/* ============================================================
 * check-shell-chrome.js — 外壳 chrome 一致性（2026-11-20）
 *
 * 背景：page-template / 规范展示 / 看板 / V7 各自带一份 .ws-tools（顶部工具区），
 *   历史多次出现「V7 调好的图标没有回灌模板」与「生成副本 js 路径断掉」两类回归。
 *   本脚本把「顶部工具区必须与 V7 视觉源一致」和「4 个运行 js 可加载」变成门禁。
 *
 * 检查：
 *   1) .ws-tools 归一化 HTML 与基准一致（基准优先 output/v7，其次 page-template）；
 *   2) 页面引用的 js/*.js 必须能按页面目录解析到（生成副本常见 ../js 漏改写）；
 *   3) 无外链 js 时（分享版），必须内联 4 个运行脚本标记。
 * 退出码：0 通过 / 1 失败。
 * ============================================================ */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const WEB = path.join(ROOT, '弘讯web端design-system');
const FILES = [
  path.join(WEB, 'page-template.html'),
  path.join(WEB, 'web规范展示_左右结构.html'),
  path.join(WEB, 'showcase', 'web规范展示_左右结构.html'),
  path.join(WEB, 'showcase', '弘讯亮色注塑机看板.html'),
  path.join(WEB, 'showcase', '左右结构_v7_设备运维工作台.html'),
  path.join(WEB, 'showcase', '左右结构_v7_设备运维工作台_分享版.html')
];
const MARKERS = ['hx-rail-collapsed', 'data-i18n'];
const MARKER_RES = [/close(Pops|AllPops)\(/, /(activate\(|tab\.addEventListener)/];

function extractDiv(html, marker) {
  const i = html.indexOf(marker);
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

let fail = 0;
let canonical = null, canonicalName = '';
for (const f of FILES) {
  if (!fs.existsSync(f)) continue;
  const tools = extractDiv(fs.readFileSync(f, 'utf8'), '<div class="ws-tools">');
  if (!tools) { console.error('❌ 缺 .ws-tools：' + path.relative(ROOT, f)); fail++; continue; }
  if (!canonical && /左右结构_v7_设备运维工作台\.html$/.test(f)) { canonical = norm(tools); canonicalName = path.relative(ROOT, f); }
}
if (!canonical) {
  const p = path.join(WEB, 'page-template.html');
  canonical = norm(extractDiv(fs.readFileSync(p, 'utf8'), '<div class="ws-tools">'));
  canonicalName = path.relative(ROOT, p);
}
console.log('▶ shell chrome 一致性（基准：' + canonicalName + '）');

for (const f of FILES) {
  if (!fs.existsSync(f)) continue;
  const rel = path.relative(ROOT, f);
  const html = fs.readFileSync(f, 'utf8');
  const tools = extractDiv(html, '<div class="ws-tools">');
  if (!tools) continue;
  const t = norm(tools);
  if (t !== canonical) {
    let k = 0; while (k < t.length && k < canonical.length && t[k] === canonical[k]) k++;
    console.error('❌ 顶部工具区与基准不一致：' + rel);
    console.error('   差异位置 ~' + k + '：当前 …' + t.slice(Math.max(0, k - 60), k + 120).replace(/\s+/g, ' '));
    console.error('   基准 …' + canonical.slice(Math.max(0, k - 60), k + 120).replace(/\s+/g, ' '));
    fail++;
  }
  // 外链 js 必须可解析
  const dir = path.dirname(f);
  for (const m of html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)) {
    const ref = m[1];
    if (/^(data:|https?:)/.test(ref)) continue;
    if (!fs.existsSync(path.resolve(dir, ref))) {
      console.error('❌ 脚本 404：' + rel + ' → ' + ref);
      fail++;
    }
  }
  // 无外链 js 的分享版：必须内联 4 个运行脚本
  const hasExternalJs = /<script\b[^>]*\bsrc="[^"]*\/?js\//.test(html);
  if (!hasExternalJs) {
    const miss = MARKERS.filter(m => !html.includes(m))
      .concat(MARKER_RES.filter(re => !re.test(html)).map(re => String(re)));
    if (miss.length) {
      console.error('❌ 分享版缺内联运行脚本标记：' + rel + ' → ' + miss.join(', '));
      fail++;
    }
  }
}

if (fail) { console.log('\n❌ shell chrome：' + fail + ' 项失败'); process.exit(1); }
console.log('✅ shell chrome：工具区一致 + 运行脚本可加载');
