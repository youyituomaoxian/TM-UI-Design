#!/usr/bin/env node
// ===== L0 CSS 无用类审计（只读，不删）· 2026-11-12 =====
// 用途：给 template.css 里"定义了但仓库内找不到引用"的类出候选清单，供人工确认后再决定删除/拆层。
// 注意：动态拼类（如 `btn-${type}`）会产生假阳性；本脚本只出候选，不自动删任何样式。
// 用法：node scripts/audit-css-usage.js [--json]
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const CSS = path.join(ROOT, '弘讯web端design-system/template.css');
const EXTS = /\.(html?|jsx|tsx|vue|ts)$/i;
const SKIP = /(^|[\\/])(node_modules|\.git|dist|dist-static|archive)([\\/]|$)/;

function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (SKIP.test(p)) continue;
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (EXTS.test(f) && p !== CSS) out.push(p);
  }
  return out;
}

const css = fs.readFileSync(CSS, 'utf8').replace(/\r\n/g, '\n');
const defined = new Map(); // class -> 定义次数
for (const m of css.matchAll(/\.([a-zA-Z_][\w-]*)/g)) {
  defined.set(m[1], (defined.get(m[1]) || 0) + 1);
}

const refs = new Map(); // class -> 外部引用次数
const files = walk(ROOT);
const texts = files.map(f => ({ f, t: fs.readFileSync(f, 'utf8') }));
for (const [cls] of defined) {
  if (cls.length < 2) continue;
  const re = new RegExp('(^|[^\\w-])' + cls.replace(/[-]/g, '\\-') + '([^\\w-]|$)', 'g');
  let n = 0;
  for (const { t } of texts) { const mm = t.match(re); if (mm) n += mm.length; }
  refs.set(cls, n);
}

const zero = [...defined.entries()]
  .filter(([c]) => (refs.get(c) || 0) === 0)
  .sort((a, b) => b[1] - a[1]);

// 动态拼类风险：常见前缀（命中即标注，不当作可直接删）
const DYNAMIC = /^(t-|m-text-|btn-|mbtn-|badge-|tag-|tab|seg-|tree-|dot-|status-|chart-|ring-|kpi-|card-|table-|col-|grid-|filter-|pager-|nav-|login-|ph-|page-|head-|ico|em-|hx-)/;
const risky = zero.filter(([c]) => DYNAMIC.test(c));
const safe = zero.filter(([c]) => !DYNAMIC.test(c));

const report = {
  generated: new Date().toISOString().slice(0, 10),
  cssChars: css.length,
  definedClasses: defined.size,
  zeroRefClasses: zero.length,
  zeroRefDynamicRisk: risky.length,
  zeroRefSafeCandidates: safe.length,
  topSafeCandidates: safe.slice(0, 80).map(([c, n]) => ({ class: c, cssDefinitions: n })),
  dynamicRisk: risky.slice(0, 80).map(([c, n]) => ({ class: c, cssDefinitions: n })),
};
const outDir = path.join(ROOT, 'output');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
fs.writeFileSync(path.join(outDir, 'css-usage-report_20261112.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');

console.log('== L0 CSS 无用类审计 ==');
console.log(`template.css ${css.length} 字符 / 定义类 ${defined.size} 个`);
console.log(`零引用：${zero.length} 个（动态拼类风险 ${risky.length} / 安全候选 ${safe.length}）`);
console.log('\n安全候选 Top 30（定义次数降序；仍需人工确认）：');
for (const [c, n] of safe.slice(0, 30)) console.log(`  .${c}  (定义 ${n} 次)`);
if (process.argv.includes('--json')) console.log('\n完整报告：output/css-usage-report_20261112.json');
console.log('\n注：动态拼类（btn-* / t-* / chart-* 等）已单列，不在安全候选内；本脚本不删任何样式。');
