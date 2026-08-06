#!/usr/bin/env node
/*
 * validate-static.js — W1v2 任务5：packages/web-ui 静态产物门禁（零写入，HIGH 即 exit 1）
 *
 * 扫描对象：dist-static/sample-*.html（3 样例页）+ src/styles/globals.css
 *
 * 规则：
 *   ① :root / :root[data-theme="dark"] / [data-density] 之外禁止硬编码 HEX 色（白 #FFFFFF/#FFF 按钮字约定除外）
 *      —— 暗色必须用 :root[data-theme="dark"]；若发现 shadcn 原生 .dark 类承载颜色，视为违规（边界：弃 .dark 类）。
 *   ② 字阶白名单：:root --font-* 键集必须逐键等于 tokens.json.font.scale（12 键，不多不少，
 *      值匹配 weight size/lineHeight）；组件/布局 CSS 中 font-size 只能取 12 键的 size 集合
 *   ③ spacing 4 倍数：--space-* 变量与 padding/margin/gap 声明须为 4 的倍数
 *      （0 与「冻结参考 page-template.html 同属性实测遗留值」白名单除外，白名单动态采集）
 *   ④ sha256：旧生成流水线 5 文件指纹 = sha256-baseline.json（W1 禁区看护）
 *   ⑤ 暗色等式：:root[data-theme="dark"] 块变量逐键 = generatePalette('#005EAE',{mode:'dark',platform:'web'})
 *      （primary 5 + neutral 11 + 功能 4×3 + brandSurface + shadow 4 + elevation 10 + background 7）
 *
 * 用法：node packages/web-ui/scripts/validate-static.js
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PKG = path.resolve(__dirname, '..');
const ROOT = path.resolve(PKG, '..', '..');
const DIST = path.join(PKG, 'dist-static');
const TOKENS = JSON.parse(fs.readFileSync(path.join(ROOT, '弘讯web端design-system', 'tokens.json'), 'utf8'));
const BASELINE = JSON.parse(fs.readFileSync(path.join(PKG, 'sha256-baseline.json'), 'utf8'));
const REF_TEMPLATE = fs.readFileSync(path.join(ROOT, '弘讯web端design-system', 'page-template.html'), 'utf8');
const { generatePalette } = require(path.join(ROOT, 'brand-color-engine', 'generate.js'));

const PAGES = ['sample-default-light.html', 'sample-brand-2E7D5B.html', 'sample-dark.html'];
const violations = []; // {file, rule, severity, msg}
const V = (file, rule, msg, severity = 'HIGH') => violations.push({ file, rule, severity, msg });

/* ---------- CSS 工具 ---------- */
function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}
function extractStyles(html) {
  const out = [];
  const re = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let m;
  while ((m = re.exec(html))) out.push(m[1]);
  return out.join('\n');
}
/** 解析成规则数组 {sel, decl} */
function parseRules(css) {
  const rules = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(css))) rules.push({ sel: m[1].trim(), decl: m[2] });
  return rules;
}
// token 块：:root（含 :root[data-theme]）与 density 块允许承载颜色/变量；.dark 不再视为 token 块（边界：弃 .dark 类）
const isTokenBlock = sel => /:root|data-theme|data-density|\.density-/.test(sel);
function hexes(text) {
  const out = [];
  const re = /#([0-9a-fA-F]{3,8})\b/g;
  let m;
  while ((m = re.exec(text))) {
    let h = m[1].toUpperCase();
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    out.push('#' + h);
  }
  return out;
}
function pxNums(val) {
  const out = [];
  const re = /(-?\d+(?:\.\d+)?)px/g;
  let m;
  while ((m = re.exec(val))) out.push(parseFloat(m[1]));
  return out;
}
const SPACING_PROPS = /^(padding|margin|gap|row-gap|column-gap|padding-(top|right|bottom|left)|margin-(top|right|bottom|left))$/;
function declEntries(decl) {
  return decl
    .split(';')
    .map(p => {
      const i = p.indexOf(':');
      if (i < 0) return null;
      return [p.slice(0, i).trim().toLowerCase(), p.slice(i + 1).trim()];
    })
    .filter(Boolean);
}

/* ---------- 规则③ 白名单：冻结参考模板同属性实测遗留值（如 tag 0 10px / status-dot gap 6px） ---------- */
const refAllowed = new Set([0]);
for (const r of parseRules(stripComments(extractStyles(REF_TEMPLATE)))) {
  if (isTokenBlock(r.sel)) continue;
  for (const [prop, val] of declEntries(r.decl)) {
    if (SPACING_PROPS.test(prop)) pxNums(val).forEach(n => refAllowed.add(n));
  }
}

/* ---------- 规则② 白名单：tokens.json.font.scale 12 键 ---------- */
const SCALE = TOKENS.font.scale;
const SCALE_KEYS = Object.keys(SCALE); // 12 键
const SIZE_WHITELIST = new Set(Object.values(SCALE).map(s => s.size));
const W = { Medium: 500, Regular: 400 };

/* ---------- 逐文件扫描（规则①②③） ---------- */
function scanCssText(fileLabel, cssRaw) {
  const css = stripComments(cssRaw);
  const rules = parseRules(css);

  // ① 硬编码色 + 暗色不得用 .dark 类
  for (const r of rules) {
    if (r.sel === '.dark' || /\.dark\b/.test(r.sel)) {
      V(fileLabel, '①暗色实现', `发现 shadcn 原生 .dark 类「${r.sel}」承载样式——W1v2 边界：暗色必须用 :root[data-theme="dark"]，禁用 .dark 类`);
    }
    if (isTokenBlock(r.sel)) continue;
    for (const h of hexes(r.decl)) {
      if (h === '#FFFFFF') continue; // 白字约定
      V(fileLabel, '①硬编码色', `选择器「${r.sel.slice(0, 60)}」出现非 token 硬编码色 ${h}（须走 :root 变量）`);
    }
  }

  // ② 字阶：--font-* 键集逐键 = tokens.font.scale
  const rootRules = rules.filter(r => /:root/.test(r.sel) && !/data-density|data-theme/.test(r.sel));
  const fontVars = {};
  for (const r of rootRules) {
    for (const [prop, val] of declEntries(r.decl)) {
      const m = prop.match(/^--font-([a-z0-9]+)$/);
      if (m && !['cn', 'en', 'mono'].includes(m[1]) && fontVars[m[1]] === undefined) fontVars[m[1]] = val;
    }
  }
  if (rootRules.length) {
    for (const k of SCALE_KEYS) {
      if (fontVars[k] === undefined) { V(fileLabel, '②字阶白名单', `:root 缺少 --font-${k}（tokens.json.font.scale 12 键须齐）`); continue; }
      const exp = `${W[SCALE[k].weight] || 400} ${SCALE[k].size}px/${SCALE[k].lineHeight}px`;
      if (!fontVars[k].startsWith(exp)) V(fileLabel, '②字阶白名单', `--font-${k} 应以「${exp}」开头，实际「${fontVars[k]}」`);
    }
    for (const k of Object.keys(fontVars)) {
      if (!SCALE_KEYS.includes(k)) V(fileLabel, '②字阶白名单', `:root 出现白名单外字阶变量 --font-${k}（12 键之外禁止）`);
    }
  }
  // ② 组件/布局 font-size 白名单
  for (const r of rules) {
    if (isTokenBlock(r.sel)) continue;
    for (const [prop, val] of declEntries(r.decl)) {
      if (prop === 'font-size') {
        for (const n of pxNums(val)) {
          if (!SIZE_WHITELIST.has(n)) V(fileLabel, '②字阶白名单', `选择器「${r.sel.slice(0, 60)}」font-size:${n}px 不在 font.scale 12 键 size 集合 {${[...SIZE_WHITELIST].join(',')}}`);
        }
      }
    }
  }

  // ③ spacing 4 倍数
  for (const r of rules) {
    if (isTokenBlock(r.sel)) continue;
    for (const [prop, val] of declEntries(r.decl)) {
      if (!SPACING_PROPS.test(prop)) continue;
      for (const n of pxNums(val)) {
        if (n % 4 === 0) continue;
        if (refAllowed.has(n)) continue; // 冻结参考模板实测遗留（如 10/6/14）
        V(fileLabel, '③间距4倍数', `选择器「${r.sel.slice(0, 60)}」${prop}:${n}px 非 4 倍数且不在参考模板遗留白名单`);
      }
    }
  }
  // ③ --space-* 变量本身
  for (const r of rootRules) {
    for (const [prop, val] of declEntries(r.decl)) {
      if (/^--space-/.test(prop)) {
        for (const n of pxNums(val)) if (n % 4 !== 0) V(fileLabel, '③间距4倍数', `${prop}:${n}px 非 4 倍数`);
      }
    }
  }
}

/* ---------- 规则⑤ 暗色逐键等式 ---------- */
function checkDarkEquality(fileLabel, html) {
  const css = stripComments(extractStyles(html));
  const darkRules = parseRules(css).filter(r => r.sel.trim() === ':root[data-theme="dark"]' || /(^|[,\s]):root\[data-theme="dark"\]\s*$/.test(r.sel));
  if (!darkRules.length) {
    V(fileLabel, '⑤暗色等式', '缺少 :root[data-theme="dark"] 块（暗色页必须携带该变量层；禁用 .dark 类）');
    return;
  }
  // 收集 :root[data-theme="dark"] 变量；同名多次声明（hex+oklch 回退）取第一条 hex
  const vars = {};
  for (const r of darkRules) {
    for (const [prop, val] of declEntries(r.decl)) {
      if (prop.startsWith('--') && vars[prop] === undefined) vars[prop] = val.trim().toUpperCase();
    }
  }
  const p = generatePalette('#005EAE', { mode: 'dark', platform: 'web' });
  const expect = {
    '--primary': p.primary.default,
    '--primary-hover': p.primary.hover,
    '--primary-active': p.primary.click,
    '--primary-dis-bg': p.primary.disabledBg,
    '--primary-dis-fg': p.primary.disabledText,
    '--brand-surface': p.background.brandSurface,
    '--bg-page': p.background.page,
    '--bg-surface': p.background.surface,
    '--bg-elevated': p.background.elevated,
    '--text-1': p.background.textPrimary,
    '--text-2': p.background.textSecondary,
    '--text-3': p.background.textTertiary,
    '--border': p.background.border
  };
  for (let i = 1; i <= 11; i++) {
    const item = Array.isArray(p.neutral) ? p.neutral.find(x => x.name === `D${i}` || x.name === `N${i}`) : null;
    expect[`--n${i}`] = item ? item.hex : p.neutral[`N${i}`];
  }
  const fmap = { suc: 'success', warn: 'warning', err: 'error', run: 'running' };
  for (const [short, role] of Object.entries(fmap)) {
    expect[`--${short}`] = p.functional[role].default;
    expect[`--${short}-soft`] = p.functional[role].bg;
    expect[`--${short}-fg`] = p.functional[role].text;
  }
  // shadow / elevation 以 tokens.json.dark 为期望（ci-local 已证 tokens.dark = 引擎快照）
  const d = TOKENS.dark;
  expect['--shadow-card'] = d.shadow.card;
  expect['--shadow-modal'] = d.shadow.modal;
  expect['--shadow-float'] = d.shadow.float;
  expect['--shadow-row-hover'] = d.shadow.tableRowHover;
  for (const lv of ['sunken', 'default', 'raised', 'overlay', 'overflow']) {
    expect[`--elev-${lv}-surface`] = d.elevation[lv].surface;
    expect[`--elev-${lv}-shadow`] = d.elevation[lv].shadow;
  }
  const norm = s => String(s).toUpperCase().replace(/\s+/g, ' ').trim();
  let checked = 0;
  for (const [k, exp] of Object.entries(expect)) {
    checked++;
    if (vars[k] === undefined) V(fileLabel, '⑤暗色等式', `:root[data-theme="dark"] 缺少 ${k}（期望 ${exp}）`);
    else if (norm(vars[k]) !== norm(exp)) V(fileLabel, '⑤暗色等式', `${k} 应为 ${exp}，实际 ${vars[k]}`);
  }
  return checked;
}

/* ---------- 规则④ sha256 基线 ---------- */
function checkBaseline() {
  for (const [f, expected] of Object.entries(BASELINE.files)) {
    const full = path.join(ROOT, f);
    if (!fs.existsSync(full)) { V(f, '④sha256基线', '冻结文件不存在'); continue; }
    const actual = crypto.createHash('sha256').update(fs.readFileSync(full)).digest('hex');
    if (actual !== expected) V(f, '④sha256基线', `指纹变化！期望 ${expected.slice(0, 16)}… 实际 ${actual.slice(0, 16)}…（W1 禁区：旧生成流水线文件不得改动）`);
  }
}

/* ---------- 主流程 ---------- */
function main() {
  console.log('\n🔍 validate-static — packages/web-ui 静态产物门禁\n');

  // 页面存在性
  for (const f of PAGES) {
    if (!fs.existsSync(path.join(DIST, f))) V(f, '⓪产物存在', '样例页缺失（先跑 export-static.js）');
  }

  // ①②③：3 页 + globals.css
  for (const f of PAGES) {
    const full = path.join(DIST, f);
    if (fs.existsSync(full)) scanCssText(f, extractStyles(fs.readFileSync(full, 'utf8')));
  }
  const globalsPath = path.join(PKG, 'src', 'styles', 'globals.css');
  if (fs.existsSync(globalsPath)) scanCssText('src/styles/globals.css', fs.readFileSync(globalsPath, 'utf8'));
  else V('src/styles/globals.css', '⓪产物存在', 'globals.css 缺失（先跑 map-tokens.js）');

  // ⑤ 暗色逐键 = 引擎
  const darkFull = path.join(DIST, 'sample-dark.html');
  let darkChecked = 0;
  if (fs.existsSync(darkFull)) darkChecked = checkDarkEquality('sample-dark.html', fs.readFileSync(darkFull, 'utf8')) || 0;

  // ④ sha256
  checkBaseline();

  // 汇总
  const high = violations.filter(v => v.severity === 'HIGH');
  if (violations.length === 0) {
    console.log(`  ✅ 规则① 硬编码色：0 违反（:root / :root[data-theme="dark"] 外无非白 HEX；禁用 .dark 类）`);
    console.log(`  ✅ 规则② 字阶白名单：--font-* 12 键逐键匹配 tokens.json.font.scale；font-size 全在 size 集合`);
    console.log(`  ✅ 规则③ 间距 4 倍数：--space-* 与 padding/margin/gap 合规（参考模板遗留白名单生效）`);
    console.log(`  ✅ 规则④ sha256 基线：旧生成流水线 ${Object.keys(BASELINE.files).length} 文件指纹未变`);
    console.log(`  ✅ 规则⑤ 暗色等式：:root[data-theme="dark"] ${darkChecked} 键逐键 = generatePalette('#005EAE',{mode:'dark',platform:'web'})`);
    console.log('\n✅ 0 HIGH — 全部门禁通过，exit 0\n');
    process.exit(0);
  }
  for (const v of violations) console.log(`  🔴 ${v.severity}  [${v.rule}]  ${v.file}\n       ↳ ${v.msg}`);
  console.log(`\n📊 共 ${violations.length} 项违反（HIGH ${high.length}）`);
  if (high.length) { console.log('❌ 存在 HIGH，exit 1\n'); process.exit(1); }
  process.exit(0);
}

main();
