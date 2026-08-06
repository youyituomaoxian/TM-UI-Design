#!/usr/bin/env node
/*
 * validate-static.js — W2 任务5：packages/mobile-ui 静态产物门禁（零写入，HIGH 即 exit 1）
 *
 * 扫描对象：dist-static/sample-*.html（3 样例页）+ src/styles/globals.css
 *
 * 规则：
 *   ① :root / :root[data-theme="dark"] 之外禁止硬编码 HEX 色（白 #FFFFFF 约定除外）
 *      —— 暗色必须用 :root[data-theme="dark"]；若发现 NutUI 原生 .dark 类承载颜色，视为违规（边界：弃 .dark 类）。
 *   ② 字阶白名单：:root --font-* 键集必须逐键等于移动端 android 字阶 9 键（显示文本/H1/H2/H3/强调正文/标准正文/辅助正文/辅助说明/次要注释）；
 *      组件/布局 CSS 中 font-size 只能取 android∪ios 尺寸集 {10,11,12,13,14,15,16,17,18,20,22,24,26,28,36,38}
 *   ③ spacing 4 倍数：--space-* 变量与 padding/margin/gap 声明须为 4 的倍数
 *      （0 与「冻结参考 page-template.html 同属性实测遗留值」白名单除外，白名单动态采集）
 *   ④ 暗色等式：:root[data-theme="dark"] 块变量逐键 = generatePalette('#005EAE',{mode:'dark',platform:'mobile'})
 *   ⑤(内置) sha256：移动端旧生成流水线 5 文件指纹 = sha256-baseline.json（W2 禁区看护）
 *
 * 用法：node packages/mobile-ui/scripts/validate-static.js
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PKG = path.resolve(__dirname, '..');
const ROOT = path.resolve(PKG, '..', '..');
const DIST = path.join(PKG, 'dist-static');
const TOKENS = JSON.parse(
  fs.readFileSync(path.join(ROOT, '弘讯移动端design-system', 'tokens.json'), 'utf8')
);
const BASELINE = JSON.parse(fs.readFileSync(path.join(PKG, 'sha256-baseline.json'), 'utf8'));
const REF_TEMPLATE = fs.readFileSync(
  path.join(ROOT, '弘讯移动端design-system', 'page-template.html'),
  'utf8'
);
const { generatePalette } = require(path.join(ROOT, 'brand-color-engine', 'generate.js'));

const PAGES = ['sample-default-light.html', 'sample-brand-2E7D5B.html', 'sample-dark.html'];
const violations = [];
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
function parseRules(css) {
  const rules = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(css))) rules.push({ sel: m[1].trim(), decl: m[2] });
  return rules;
}
const isTokenBlock = (sel) => /:root|data-theme|data-density|\.density-/.test(sel);
function hexes(text) {
  const out = [];
  const re = /#([0-9a-fA-F]{3,8})\b/g;
  let m;
  while ((m = re.exec(text))) {
    let h = m[1].toUpperCase();
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
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
    .map((p) => {
      const i = p.indexOf(':');
      if (i < 0) return null;
      // 注意：CSS 自定义属性名大小写敏感（如 --font-H1），仅标准属性本就小写，故 prop 保持原大小写
      return [p.slice(0, i).trim(), p.slice(i + 1).trim()];
    })
    .filter(Boolean);
}

/* ---------- 规则③ 白名单：冻结参考模板同属性实测遗留值 ---------- */
const refAllowed = new Set([0]);
for (const r of parseRules(stripComments(extractStyles(REF_TEMPLATE)))) {
  if (isTokenBlock(r.sel)) continue;
  for (const [prop, val] of declEntries(r.decl)) {
    if (SPACING_PROPS.test(prop)) pxNums(val).forEach((n) => refAllowed.add(n));
  }
}

/* ---------- 规则② 字阶白名单 ---------- */
// 移动端 android 9 键（中文名），与 globals.css :root --font-* 对应
const FONT_KEYS = TOKENS.typography.android.styles.map((s) => s.name);
const FONT_MAP = {};
TOKENS.typography.android.styles.forEach((s) => {
  FONT_MAP[s.name] = { weight: s.weight, size: s.size, lh: s.lineHeight };
});
const W = { Medium: 500, Regular: 400, Bold: 700 };
// android∪ios 尺寸集
const SIZE_WHITELIST = new Set(
  [...TOKENS.typography.android.styles, ...TOKENS.typography.ios.styles].map((s) => s.size)
);

/* ---------- 逐文件扫描（规则①②③） ---------- */
function scanCssText(fileLabel, cssRaw) {
  const css = stripComments(cssRaw);
  const rules = parseRules(css);

  // ① 硬编码色 + 暗色不得用 .dark 类
  for (const r of rules) {
    if (r.sel === '.dark' || /\.dark\b/.test(r.sel)) {
      V(fileLabel, '①暗色实现', `发现 NutUI 原生 .dark 类「${r.sel}」承载样式——W2 边界：暗色必须用 :root[data-theme="dark"]，禁用 .dark 类`);
    }
    if (isTokenBlock(r.sel)) continue;
    for (const h of hexes(r.decl)) {
      if (h === '#FFFFFF') continue; // 白字约定
      V(fileLabel, '①硬编码色', `选择器「${r.sel.slice(0, 60)}」出现非 token 硬编码色 ${h}（须走 :root 变量）`);
    }
  }

  // ② 字阶：--font-* 键集逐键 = android 9 键
  const rootRules = rules.filter(
    (r) => /:root/.test(r.sel) && !/data-density|data-theme/.test(r.sel)
  );
  const fontVars = {};
  for (const r of rootRules) {
    for (const [prop, val] of declEntries(r.decl)) {
      const m = prop.match(/^--font-(.+)$/);
      if (m && !['cn', 'en', 'mono'].includes(m[1]) && fontVars[m[1]] === undefined)
        fontVars[m[1]] = val;
    }
  }
  if (rootRules.length) {
    for (const k of FONT_KEYS) {
      if (fontVars[k] === undefined) {
        V(fileLabel, '②字阶白名单', `:root 缺少 --font-${k}（android 9 键须齐）`);
        continue;
      }
      const f = FONT_MAP[k];
      const exp = `${W[f.weight] || 400} ${f.size}px/${f.lh}px`;
      if (!fontVars[k].startsWith(exp))
        V(fileLabel, '②字阶白名单', `--font-${k} 应以「${exp}」开头，实际「${fontVars[k]}」`);
    }
    for (const k of Object.keys(fontVars)) {
      if (!FONT_KEYS.includes(k))
        V(fileLabel, '②字阶白名单', `:root 出现白名单外字阶变量 --font-${k}（9 键之外禁止）`);
    }
  }
  // ② 组件/布局 font-size 白名单
  for (const r of rules) {
    if (isTokenBlock(r.sel)) continue;
    for (const [prop, val] of declEntries(r.decl)) {
      if (prop === 'font-size') {
        for (const n of pxNums(val)) {
          if (!SIZE_WHITELIST.has(n))
            V(
              fileLabel,
              '②字阶白名单',
              `选择器「${r.sel.slice(0, 60)}」font-size:${n}px 不在 android∪ios 尺寸集 {${[...SIZE_WHITELIST].join(',')}}`
            );
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
        if (refAllowed.has(n)) continue;
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

/* ---------- 规则④ 暗色逐键等式 ---------- */
function checkDarkEquality(fileLabel, html) {
  const css = stripComments(extractStyles(html));
  const darkRules = parseRules(css).filter((r) => r.sel.trim() === ':root[data-theme="dark"]');
  if (!darkRules.length) {
    V(fileLabel, '④暗色等式', '缺少 :root[data-theme="dark"] 块（暗色页必须携带该变量层；禁用 .dark 类）');
    return;
  }
  const vars = {};
  for (const r of darkRules) {
    for (const [prop, val] of declEntries(r.decl)) {
      if (prop.startsWith('--') && vars[prop] === undefined) vars[prop] = val.trim().toUpperCase();
    }
  }
  const p = generatePalette('#005EAE', { mode: 'dark', platform: 'mobile' });
  const expect = {
    '--primary': p.primary.default,
    '--primary-hover': p.primary.hover,
    '--primary-active': p.primary.active || p.primary.pressed,
    '--primary-dis-bg': p.primary.disabledBg,
    '--primary-dis-fg': p.primary.disabledFg || p.primary.disabledText,
    '--brand-surface': p.background.brandSurface,
  };
  // 中性：引擎 mobile 暗色为 11 级（含 N11=#FFFFFF）
  for (let i = 0; i < p.neutral.length; i++) {
    expect[`--n${i + 1}`] = p.neutral[i].hex;
  }
  // 功能色（引擎 dark：default/bg/text）
  const fmap = { suc: 'success', warn: 'warning', err: 'error', run: 'running' };
  for (const [short, role] of Object.entries(fmap)) {
    expect[`--${short}`] = p.functional[role].default;
    expect[`--${short}-bg`] = p.functional[role].bg;
    expect[`--${short}-fg`] = p.functional[role].text;
  }
  // 背景
  expect['--bg-page'] = p.background.page;
  expect['--bg-surface'] = p.background.surface;
  expect['--bg-elevated'] = p.background.elevated;
  expect['--text-1'] = p.background.textPrimary;
  expect['--text-2'] = p.background.textSecondary;
  expect['--text-3'] = p.background.textTertiary;
  expect['--border'] = p.background.border;

  const norm = (s) => String(s).toUpperCase().replace(/\s+/g, ' ').trim();
  let checked = 0;
  for (const [k, exp] of Object.entries(expect)) {
    checked++;
    if (vars[k] === undefined) V(fileLabel, '④暗色等式', `:root[data-theme="dark"] 缺少 ${k}（期望 ${exp}）`);
    else if (norm(vars[k]) !== norm(exp)) V(fileLabel, '④暗色等式', `${k} 应为 ${exp}，实际 ${vars[k]}`);
  }
  return checked;
}

/* ---------- 规则⑤ sha256 基线 ---------- */
function checkBaseline() {
  for (const [f, expected] of Object.entries(BASELINE.files)) {
    const full = path.join(ROOT, f);
    if (!fs.existsSync(full)) {
      V(f, '⑤sha256基线', '冻结文件不存在');
      continue;
    }
    const actual = crypto.createHash('sha256').update(fs.readFileSync(full)).digest('hex');
    if (actual !== expected)
      V(f, '⑤sha256基线', `指纹变化！期望 ${expected.slice(0, 16)}… 实际 ${actual.slice(0, 16)}…（W2 禁区：旧生成流水线文件不得改动）`);
  }
}

/* ---------- 主流程 ---------- */
function main() {
  console.log('\n🔍 validate-static — packages/mobile-ui 静态产物门禁\n');

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

  // ④ 暗色逐键 = 引擎
  const darkFull = path.join(DIST, 'sample-dark.html');
  let darkChecked = 0;
  if (fs.existsSync(darkFull))
    darkChecked = checkDarkEquality('sample-dark.html', fs.readFileSync(darkFull, 'utf8')) || 0;

  // ⑤ sha256
  checkBaseline();

  const high = violations.filter((v) => v.severity === 'HIGH');
  if (violations.length === 0) {
    console.log(`  ✅ 规则① 硬编码色：0 违反（:root / :root[data-theme="dark"] 外无非白 HEX；禁用 .dark 类）`);
    console.log(`  ✅ 规则② 字阶白名单：--font-* 9 键(android)逐键匹配；font-size 全在 android∪ios 尺寸集`);
    console.log(`  ✅ 规则③ 间距 4 倍数：--space-* 与 padding/margin/gap 合规（参考模板遗留白名单生效）`);
    console.log(`  ✅ 规则④ 暗色等式：:root[data-theme="dark"] ${darkChecked} 键逐键 = generatePalette('#005EAE',{mode:'dark',platform:'mobile'})`);
    console.log(`  ✅ 规则⑤ sha256 基线：移动端旧线 ${Object.keys(BASELINE.files).length} 文件指纹未变`);
    console.log('\n✅ 0 HIGH — 全部门禁通过，exit 0\n');
    process.exit(0);
  }
  for (const v of violations) console.log(`  🔴 ${v.severity}  [${v.rule}]  ${v.file}\n       ↳ ${v.msg}`);
  console.log(`\n📊 共 ${violations.length} 项违反（HIGH ${high.length}）`);
  if (high.length) {
    console.log('❌ 存在 HIGH，exit 1\n');
    process.exit(1);
  }
  process.exit(0);
}

main();
