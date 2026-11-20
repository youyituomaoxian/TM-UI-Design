#!/usr/bin/env node
'use strict';
/* ============================================================
 * check-shell-chrome.js — 外壳工具区一致性（2026-11-20 方向纠正）
 *
 * 旧机制（已废）：以 V7 工作台为「视觉基准」（示例页=标准），缺页 continue、
 *   基准缺失静默退回 page-template —— 红绿都不可信。
 *
 * 现机制：真源 = 弘讯web端design-system/partials/shell-tools.html（单点片段）。
 *   注入副本与派生件清单来自 scripts/gate-manifest.json → shell.inject / shell.derived；
 *   每页 .ws-tools 与真源比对，缺页 / 缺块 / 漂移 一律 FAIL；
 *   失败时按文件类别给出正确修复命令（源页 → sync-shell-tools；showcase 副本 → sync-showcase；
 *   分享版 → build-share-web），避免有人手改派生件把自己改回旧毛病。
 *
 * 另查：
 *   1) 真源必须满足 shell-ui/i18n 的 DOM 契约（id/数量/钩子）；
 *   2) 外链 js/*.js 必须能按页面目录解析到；
 *   3) 无外链 js 的分享版，必须内联 4 个运行脚本标记。
 *
 * 退出码：0 通过 / 1 失败 / 2 真源缺失或不满足契约。
 * ============================================================ */
const fs = require('fs');
const path = require('path');
const { ROOT, extract, norm, readManifest, abs } = require('./lib/shell-tools');

const MARKERS = ['hx-rail-collapsed', 'data-i18n'];
const MARKER_RES = [/close(Pops|AllPops)\(/, /(activate\(|tab\.addEventListener)/];

const m = readManifest();
const truthRel = m.shell.truth;
if (!fs.existsSync(abs(truthRel))) { console.error('❌ 外壳工具区真源缺失：' + truthRel); process.exit(2); }
const truthBlock = extract(fs.readFileSync(abs(truthRel), 'utf8'));
if (!truthBlock) { console.error('❌ 真源缺 .ws-tools：' + truthRel); process.exit(2); }

// DOM 契约：真源必须保住 shell-ui.js / i18n 依赖的钩子
const c = m.shell.contract || {};
const contractMiss = (c.requiredIds || []).filter(id => !truthBlock.includes('id="' + id + '"'));
for (const [key, min] of Object.entries(c.minCount || {})) {
  const n = (truthBlock.match(new RegExp(key, 'g')) || []).length;
  if (n < min) contractMiss.push(key + '×' + n + '(<' + min + ')');
}
for (const token of c.required || []) if (!truthBlock.includes(token)) contractMiss.push(token);
if (m.shell.truthMaxChars && truthBlock.length > m.shell.truthMaxChars) {
  contractMiss.push('工具区体积 ' + truthBlock.length + ' > 上限 ' + m.shell.truthMaxChars + '（片段超限说明混进了业务内容）');
}
if (contractMiss.length) {
  console.error('❌ 真源不满足工具区 DOM 契约：' + contractMiss.join(', '));
  console.error('  被 js/shell-ui.js 与 i18n 依赖；删/改名会静默废掉主题、弹层、双语。');
  process.exit(2);
}

const inject = new Set(m.shell.inject);
const files = [...m.shell.inject, ...m.shell.derived];
const hint = rel => inject.has(rel)
  ? 'node scripts/sync-shell-tools.js'
  : /_分享版\.html$/.test(rel)
    ? 'node scripts/build-share-web.js <该分享版的源页>（改真源后先 sync-shell-tools）'
    : 'node scripts/sync-showcase.js';

const baseline = norm(truthBlock);
console.log('▶ shell chrome 一致性（真源：' + truthRel + '）');

let fail = 0;
for (const rel of files) {
  const p = abs(rel);
  if (!fs.existsSync(p)) { console.error('❌ 页面不存在：' + rel + '（登记在 gate-manifest.json，缺件即失败）'); fail++; continue; }
  const html = fs.readFileSync(p, 'utf8');

  const tools = extract(html);
  if (!tools) { console.error('❌ 缺 .ws-tools：' + rel + ' → ' + hint(rel)); fail++; continue; }
  const t = norm(tools);
  if (t !== baseline) {
    let k = 0; while (k < t.length && k < baseline.length && t[k] === baseline[k]) k++;
    console.error('❌ 工具区与真源不一致：' + rel + ' → ' + hint(rel));
    console.error('   差异位置 ~' + k + '：当前 …' + t.slice(Math.max(0, k - 60), k + 120).replace(/\s+/g, ' '));
    console.error('   真源 …' + baseline.slice(Math.max(0, k - 60), k + 120).replace(/\s+/g, ' '));
    fail++;
  }

  // 外链 js 必须可解析
  const dir = path.dirname(p);
  for (const mm of html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)) {
    const ref = mm[1];
    if (/^(data:|https?:)/.test(ref)) continue;
    if (!fs.existsSync(path.resolve(dir, ref))) {
      console.error('❌ 脚本 404：' + rel + ' → ' + ref);
      fail++;
    }
  }
  // 无外链 js 的分享版：必须内联 4 个运行脚本
  const hasExternalJs = /<script\b[^>]*\bsrc="[^"]*\/?js\//.test(html);
  if (!hasExternalJs) {
    const miss = MARKERS.filter(x => !html.includes(x))
      .concat(MARKER_RES.filter(re => !re.test(html)).map(re => String(re)));
    if (miss.length) {
      console.error('❌ 分享版缺内联运行脚本标记：' + rel + ' → ' + miss.join(', ') + '（重跑 build-share-web）');
      fail++;
    }
  }
}

if (fail) { console.log('\n❌ shell chrome：' + fail + ' 项失败'); process.exit(1); }
console.log('✅ shell chrome：' + files.length + ' 页工具区与真源一致 + 运行脚本可加载');
