#!/usr/bin/env node
'use strict';
/* check-page-contracts.js — 页面契约门禁（fixtures + 新规范清单页）
 * 用法：node scripts/check-page-contracts.js
 * 退出码：fixtures 不一致 / state-class HIGH / pager HIGH → 1；stack-spacing 仅 MED 警告。
 */
const fs = require('fs');
const path = require('path');
const { ROOT, WEB, readManifest, abs } = require('./lib/shell-tools');
const pc = require('./page-contracts');

let fail = 0;

console.log('▶ 页面契约 fixtures（合法页 0 命中 / 非法页精确命中）');
if (!pc.runFixtures().ok) fail++;

console.log('\n▶ JS 状态类 ↔ CSS 契约（page-ui.js）');
const st = pc.checkStateClassContract();
if (st.level === 'HIGH') {
  fail++;
  console.error('🔴 [state-class.contract] ' + st.messages.length + ' 项');
  st.messages.forEach(m => console.error('  ↳ ' + m));
} else if (st.level === 'MED') {
  console.warn('🟡 [state-class.contract·MED] 契约调用未找到（门禁可能失明）');
  st.messages.forEach(m => console.warn('  ↳ ' + m));
} else {
  console.log('✅ state-class 契约一致');
}

const m = readManifest();
const pages = (m.newScope && m.newScope.pages) || [];
console.log('\n▶ 页面契约（gate-manifest.newScope.pages，' + pages.length + ' 页）');
let stackWarn = 0;
for (const rel of pages) {
  const p = abs(rel);
  if (!fs.existsSync(p)) { console.error('❌ 缺失 ' + rel); fail++; continue; }
  const html = fs.readFileSync(p, 'utf8');
  const pager = pc.checkPagerContext(html);
  const stack = pc.checkStackSpacing(html);
  if (pager.length) {
    fail++;
    console.error('🔴 [pager.context-missing] ' + rel + ' ×' + pager.length);
    pager.forEach(x => console.error('  ↳ ' + x));
  }
  if (stack.length) {
    stackWarn += stack.length;
    console.warn('🟡 [stack-spacing.zero-gap·MED] ' + rel + ' ×' + stack.length);
    stack.forEach(x => console.warn('  ↳ ' + x));
  }
  if (!pager.length && !stack.length) console.log('✅ ' + rel);
}
if (stackWarn) {
  console.warn('\n🟡 stack-spacing 合计 ' + stackWarn + ' 项 MED（不阻断；契约见 components.json#pageContracts.stackSpacing）');
}

// 分享版内联 CSS 指纹：真源 template.css 改完必须 build-share-web 重建，否则分享版与真源不一致。
const shares = (m.newScope && m.newScope.shares) || [];
console.log('\n▶ 分享版内联 CSS 指纹（' + shares.length + ' 个）');
const tplCss = fs.readFileSync(path.join(WEB, 'template.css'), 'utf8').replace(/\r\n/g, '\n').trim();
for (const rel of shares) {
  const p = abs(rel);
  if (!fs.existsSync(p)) { console.error('❌ 缺失分享版 ' + rel); fail++; continue; }
  const s = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
  if (!s.includes(tplCss)) {
    fail++;
    console.error('🔴 分享版内联 CSS 不是当前 template.css：' + rel + '（请 node scripts/build-share-web.js <源页> 重建）');
  } else {
    console.log('✅ ' + rel);
  }
}

console.log(fail ? '\n❌ 页面契约失败 ' + fail : '\n✅ 页面契约通过（pager HIGH 0）');
process.exit(fail ? 1 : 0);
