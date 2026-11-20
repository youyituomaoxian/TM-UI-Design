#!/usr/bin/env node
'use strict';
/* ============================================================
 * check-shell-chrome.js — 外壳工具区一致性（2026-11-20 方向纠正）
 *
 * 旧机制（已废）：以 V7 工作台为「视觉基准」，示例页成了标准；缺页就 continue、
 *   基准缺失就静默退回 page-template —— 红绿都不可信（实证见 HANDOFF 2026-11-20）。
 *
 * 现机制：真源 = 弘讯web端design-system/partials/shell-tools.html（单点片段），
 *   各页副本由 scripts/sync-shell-tools.js 注入；本门禁把每页 .ws-tools 与真源比对。
 *   缺页 / 缺 .ws-tools / 漂移 一律 FAIL——示例页只是被测对象，不再定义标准。
 *
 * 另查：
 *   1) 外链 js/*.js 必须能按页面目录解析到（生成副本常见 ../js 漏改写）；
 *   2) 无外链 js 的分享版，必须内联 4 个运行脚本标记。
 *
 * 退出码：0 通过 / 1 失败 / 2 真源缺失。
 * ============================================================ */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const WEB = path.join(ROOT, '弘讯web端design-system');
const SRC = path.join(WEB, 'partials', 'shell-tools.html');
const FILES = [
  path.join(WEB, 'page-template.html'),
  path.join(WEB, 'web规范展示_左右结构.html'),
  path.join(WEB, 'web规范展示_左右结构_分享版.html'),
  path.join(WEB, 'showcase', 'web规范展示_左右结构.html'),
  path.join(WEB, 'showcase', 'web规范展示_左右结构_分享版.html'),
  path.join(WEB, 'showcase', '弘讯亮色注塑机看板.html'),
  path.join(WEB, 'showcase', '弘讯亮色注塑机看板_分享版.html'),
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

const srcRel = path.relative(ROOT, SRC);
if (!fs.existsSync(SRC)) { console.error('❌ 外壳工具区真源缺失：' + srcRel); process.exit(2); }
const canonical = extractDiv(fs.readFileSync(SRC, 'utf8'), '<div class="ws-tools">');
if (!canonical) { console.error('❌ 真源缺 .ws-tools：' + srcRel); process.exit(2); }
const baseline = norm(canonical);
console.log('▶ shell chrome 一致性（真源：' + srcRel + '）');

let fail = 0;
for (const f of FILES) {
  const rel = path.relative(ROOT, f);
  if (!fs.existsSync(f)) { console.error('❌ 页面不存在：' + rel); fail++; continue; }
  const html = fs.readFileSync(f, 'utf8');

  const tools = extractDiv(html, '<div class="ws-tools">');
  if (!tools) { console.error('❌ 缺 .ws-tools：' + rel); fail++; continue; }
  const t = norm(tools);
  if (t !== baseline) {
    let k = 0; while (k < t.length && k < baseline.length && t[k] === baseline[k]) k++;
    console.error('❌ 工具区与真源不一致：' + rel);
    console.error('   差异位置 ~' + k + '：当前 …' + t.slice(Math.max(0, k - 60), k + 120).replace(/\s+/g, ' '));
    console.error('   真源 …' + baseline.slice(Math.max(0, k - 60), k + 120).replace(/\s+/g, ' '));
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
console.log('✅ shell chrome：' + FILES.length + ' 页工具区与真源一致 + 运行脚本可加载');
