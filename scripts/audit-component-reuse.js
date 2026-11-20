#!/usr/bin/env node
'use strict';
/* ============================================================
 * audit-component-reuse.js — 组件复用门禁（2026-11-19）
 *
 * 目的：已有组件能覆盖时，禁止 Agent 在页面 <style> 里新造同族组件或做私有变形。
 * 真源：template.css（globals+components+framework+utilities+workbench 的合并产物）。
 *
 * 判定：
 *   页面 <style> 中定义的类，若：
 *   - 不在 template.css；
 *   - 命中组件命名空间前缀（kpi/stat/card/table/modal/btn/...）；
 *   - 且不是 data-page-local 声明的业务布局前缀；
 *   → HIGH component.reuse。
 *
 * 用法：
 *   node scripts/audit-component-reuse.js <page.html>
 *   node scripts/audit-component-reuse.js <page.html> --json
 * ============================================================ */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATE = path.join(ROOT, '弘讯web端design-system', 'template.css');
const file = process.argv[2];
const asJson = process.argv.includes('--json');
if (!file) { console.error('用法: node scripts/audit-component-reuse.js <page.html>'); process.exit(2); }
const html = fs.readFileSync(path.resolve(ROOT, file), 'utf8');
const tpl = fs.readFileSync(TEMPLATE, 'utf8');
const style = (html.match(/<style[^>]*>([\s\S]*?)<\/style>/i) || [,''])[1];
const classes = (text) => new Set([...text.matchAll(/\.([a-zA-Z][a-zA-Z0-9_-]*)/g)].map(m => m[1]));
const local = classes(style);
const canonical = classes(tpl);
const COMPONENT_PREFIXES = /^(kpi|stat|card|btn|button|table|modal|dialog|tabs?|tag|badge|form|input|select|sel|pager|alert|toast|empty|avatar|progress|status|machine|chart|tree|topbar|sidebar|footer|toggle|switch|checkbox|radio|upload|date|dropdown|popover|tooltip|skeleton|spinner|drawer|sheet|breadcrumb|toolbar|seg|filter|detail|nav|list|search|pop|panel)/;
const LAYOUT_PREFIXES = /^(page-|workspace-|layout-|grid-|stack-|cluster-|demo-|showcase-|section-|col-|row-|flex-|gap-|mt-|mb-|pt-|pb-)/;
const violations = [];
for (const c of local) {
  if (canonical.has(c) || LAYOUT_PREFIXES.test(c)) continue;
  if (COMPONENT_PREFIXES.test(c)) {
    violations.push({ class: c, severity: 'HIGH', contract: 'component.reuse' });
  }
}
if (asJson) {
  console.log(JSON.stringify({ file, violations }, null, 2));
} else if (!violations.length) {
  console.log('✅ 组件复用门禁通过：页面未新造同族组件类');
} else {
  console.log('🔴 组件复用门禁：页面自造/变形组件类 ' + violations.length + ' 个');
  for (const v of violations) {
    console.log('  - .' + v.class + '  → 请优先使用 template.css 已有组件；确需新变体，先入 components.css + components.json + build:template');
  }
}
process.exit(violations.length ? 1 : 0);
