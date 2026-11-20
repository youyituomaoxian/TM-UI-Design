#!/usr/bin/env node
/*
 * map-tokens.js — W2 任务2：移动端 tokens.json → src/styles/globals.css
 *
 * 亮色写 :root；暗色写 :root[data-theme="dark"]，值来自
 *   generatePalette('#005EAE',{mode:'dark',platform:'mobile'})（引擎 mobile 快照）。
 * 禁用 NutUI 原生 dark 类；品牌色 hex + oklch 双声明（oklch 回退）。
 *
 * 暗色块逐键 = 引擎输出（validate-static 规则④）。
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const TOKENS = JSON.parse(
  fs.readFileSync(path.join(ROOT, '弘讯移动端design-system', 'tokens.json'), 'utf8')
);
const ENGINE_PATH = path.join(ROOT, 'brand-color-engine', 'generate.js');
const { generatePalette } = require(ENGINE_PATH);

const BASE_BRAND = TOKENS.colors.primary.default.hex; // '#005EAE'
const OUT = path.join(__dirname, '..', 'src', 'styles', 'globals.css');

/* ---------- 工具 ---------- */
const W = { Medium: 500, Regular: 400, Bold: 700 };
// sRGB → OKLab → OKLCH（标准近似），用于品牌色 oklch 回退声明
function hexToOklch(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const lin = (c) => (c > 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92);
  const [R, G, B] = [lin(r), lin(g), lin(b)];
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m2 = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const m3 = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  const L = 1.0 * l - 0.0000000000 * m2 + 0.0000000000 * m3;
  const a = 1.0 * (l - m2);
  const bb = 0.7 * (m2 - m3);
  const C = Math.sqrt(a * a + bb * bb);
  let H = (Math.atan2(bb, a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return `oklch(${(L * 100).toFixed(1)}% ${(C * 100).toFixed(1)}% ${H.toFixed(1)})`;
}

function decl(key, hex) {
  const ok = hexToOklch(hex);
  return `  --${key}: ${hex};\n  --${key}-oklch: ${ok};`;
}

function fontDecl(name, weight, size, lh) {
  return `  --font-${name}: ${W[weight] || 400} ${size}px/${lh}px;`;
}

/* ---------- 亮色 :root ---------- */
const C = TOKENS.colors;
const neutralLight = C.neutral; // N1..N10
const spacing = TOKENS.spacing.scale; // 4,8,16,24,32,40,48,56
const radius = TOKENS.borderRadius;
const fontAndroid = TOKENS.typography.android.styles;

let light = ':root {\n';
// 主色
light += decl('primary', C.primary.default.hex) + '\n';
light += decl('primary-hover', C.primary.hover.hex) + '\n';
light += decl('primary-active', C.primary.clicked.hex) + '\n';
light += decl('primary-dis-bg', C.primary.disabledFill.hex) + '\n';
light += decl('primary-dis-fg', C.primary.disabledText.hex) + '\n';
light += decl('brand-surface', '#003868') + '\n';
// 中性 N1..N10
for (let i = 1; i <= 10; i++) {
  light += decl('n' + i, neutralLight['N' + i].hex) + '\n';
}
// 功能色（亮色取 bgDefault 为面型主色）
const fLight = C.functional;
light += decl('suc', fLight.success.bgDefault.hex) + '\n';
light += decl('suc-bg', fLight.success.bgDefault.hex) + '\n';
light += decl('suc-fg', fLight.success.text.hex) + '\n';
light += decl('warn', fLight.warning.bgDefault.hex) + '\n';
light += decl('warn-bg', fLight.warning.bgDefault.hex) + '\n';
light += decl('warn-fg', fLight.warning.text.hex) + '\n';
light += decl('err', fLight.error.bgDefault.hex) + '\n';
light += decl('err-bg', fLight.error.bgDefault.hex) + '\n';
light += decl('err-fg', fLight.error.text.hex) + '\n';
light += decl('link', fLight.link.hex) + '\n';
light += decl('run', fLight.statusRunning.text) + '\n';
light += decl('run-bg', fLight.statusRunning.bg) + '\n';
light += decl('run-border', fLight.statusRunning.border) + '\n';
// 背景（亮色由中性推导，不引非 token 值）
light += decl('bg-page', neutralLight.N2.hex) + '\n';
light += decl('bg-surface', neutralLight.N1.hex) + '\n';
light += decl('bg-elevated', neutralLight.N1.hex) + '\n';
light += decl('text-1', neutralLight.N10.hex) + '\n';
light += decl('text-2', neutralLight.N9.hex) + '\n';
light += decl('text-3', neutralLight.N7.hex) + '\n';
light += decl('border', neutralLight.N4.hex) + '\n';
// 间距
spacing.forEach((v) => {
  light += `  --space-${v}: ${v}px;\n`;
});
// 圆角
light += `  --radius-sm: ${radius.sm.value}px;\n`;
light += `  --radius-md: ${radius.md.value}px;\n`;
light += `  --radius-lg: ${radius.lg.value}px;\n`;
light += `  --radius-full: ${radius.full.value}px;\n`;
// 阴影（亮色）
const sh = TOKENS.shadows;
light += `  --shadow-s: ${sh.s.value};\n`;
light += `  --shadow-m: ${sh.m.value};\n`;
light += `  --shadow-l: ${sh.l.value};\n`;
light += `  --shadow-bottom-nav: ${sh['bottom-nav'].value};\n`;
// elevation（亮色）
for (const lv of ['sunken', 'default', 'raised', 'overlay', 'overflow']) {
  const e = TOKENS.elevation[lv];
  light += `  --elev-${lv}-surface: ${e.surface};\n`;
  light += `  --elev-${lv}-shadow: ${e.shadow};\n`;
}
// 字阶（android 9 键 + cn/en/mono 参考）
fontAndroid.forEach((s) => {
  light += fontDecl(s.name, s.weight, s.size, s.lineHeight) + '\n';
});
light += `  --font-cn: '${TOKENS.typography.android.fontFamilyCN}';\n`;
light += `  --font-en: '${TOKENS.typography.android.fontFamilyEN}';\n`;
light += `  --font-mono: ${TOKENS.typography.fontFamilyMono};\n`;
light += '}\n';

/* ---------- 暗色 :root[data-theme="dark"] = 引擎 mobile ---------- */
const dp = generatePalette(BASE_BRAND, { mode: 'dark', platform: 'mobile' });
let dark = ':root[data-theme="dark"] {\n';
dark += decl('primary', dp.primary.default) + '\n';
dark += decl('primary-hover', dp.primary.hover) + '\n';
dark += decl('primary-active', dp.primary.active || dp.primary.pressed) + '\n';
dark += decl('primary-dis-bg', dp.primary.disabledBg) + '\n';
dark += decl('primary-dis-fg', dp.primary.disabledFg || dp.primary.disabledText) + '\n';
dark += decl('brand-surface', dp.background.brandSurface) + '\n';
// 中性：引擎 mobile 暗色为 11 级（含 N11=#FFFFFF），逐键 = 引擎
dp.neutral.forEach((n, i) => {
  dark += decl('n' + (i + 1), n.hex) + '\n';
});
// 功能色（引擎 dark 结构：default/bg/border/text）
const fmap = { suc: 'success', warn: 'warning', err: 'error', run: 'running' };
for (const [short, role] of Object.entries(fmap)) {
  const f = dp.functional[role];
  dark += decl(short, f.default) + '\n';
  dark += decl(short + '-bg', f.bg) + '\n';
  dark += decl(short + '-fg', f.text) + '\n';
}
dark += decl('link', dp.primary.hover) + '\n';
// 背景
dark += decl('bg-page', dp.background.page) + '\n';
dark += decl('bg-surface', dp.background.surface) + '\n';
dark += decl('bg-elevated', dp.background.elevated) + '\n';
dark += decl('text-1', dp.background.textPrimary) + '\n';
dark += decl('text-2', dp.background.textSecondary) + '\n';
dark += decl('text-3', dp.background.textTertiary) + '\n';
dark += decl('border', dp.background.border) + '\n';
// 间距 / 圆角（与亮色一致，4 倍数）
spacing.forEach((v) => {
  dark += `  --space-${v}: ${v}px;\n`;
});
dark += `  --radius-sm: ${radius.sm.value}px;\n`;
dark += `  --radius-md: ${radius.md.value}px;\n`;
dark += `  --radius-lg: ${radius.lg.value}px;\n`;
dark += `  --radius-full: ${radius.full.value}px;\n`;
// 阴影 / elevation（暗色取自 tokens.json.dark，引擎不含此节）
const d = TOKENS.dark;
dark += `  --shadow-card: ${d.shadow.card};\n`;
dark += `  --shadow-modal: ${d.shadow.modal};\n`;
dark += `  --shadow-float: ${d.shadow.float};\n`;
dark += `  --shadow-row-hover: ${d.shadow.tableRowHover};\n`;
for (const lv of ['sunken', 'default', 'raised', 'overlay', 'overflow']) {
  const e = d.elevation[lv];
  dark += `  --elev-${lv}-surface: ${e.surface};\n`;
  dark += `  --elev-${lv}-shadow: ${e.shadow};\n`;
}
// 字阶（暗色沿用亮色 android 9 键定义，不重复引擎）
fontAndroid.forEach((s) => {
  dark += fontDecl(s.name, s.weight, s.size, s.lineHeight) + '\n';
});
dark += `  --font-cn: '${TOKENS.typography.android.fontFamilyCN}';\n`;
dark += `  --font-en: '${TOKENS.typography.android.fontFamilyEN}';\n`;
dark += `  --font-mono: ${TOKENS.typography.fontFamilyMono};\n`;
dark += '}\n';

/* ---------- NutUI 主题覆盖（京东红 → 品牌蓝） ---------- */
// 在 token 块内把 NutUI 原生变量指向我方 token，覆盖默认主题。
// NutUI v4 Taro 使用 --nutui-color-primary 等 CSS 变量。
const themeOverride = [
  ':root, :root[data-theme="dark"] {',
  '  --nutui-color-primary: var(--primary);',
  '  --nutui-color-primary-hover: var(--primary-hover);',
  '  --nutui-color-primary-pressed: var(--primary-active);',
  '  --nutui-brand-color: var(--primary);',
  '  --nutui-color-text: var(--text-1);',
  '  --nutui-gray-1: var(--n1);',
  '  --nutui-gray-2: var(--n2);',
  '  --nutui-gray-3: var(--n3);',
  '  --nutui-gray-4: var(--n4);',
  '  --nutui-gray-5: var(--n5);',
  '  --nutui-gray-6: var(--n6);',
  '  --nutui-gray-7: var(--n7);',
  '  --nutui-gray-8: var(--n8);',
  '  --nutui-gray-9: var(--n9);',
  '  --nutui-gray-10: var(--n10);',
  '}\n',
].join('\n');

const header =
  '/* globals.css — 由 scripts/map-tokens.js 生成（W2）。勿手改。\n' +
  ` * 暗色块逐键 = generatePalette('${BASE_BRAND}',{mode:'dark',platform:'mobile'})\n` +
  ' * 禁用 NutUI 原生 dark 类；暗色走 :root[data-theme="dark"]。 */\n\n';

fs.writeFileSync(OUT, header + light + '\n' + dark + '\n' + themeOverride + '\n');
console.log('✅ globals.css 已生成 →', path.relative(ROOT, OUT));
console.log('   亮色 :root（中性 N1..N10 / 功能色 / 字阶 9 键 android）');
console.log(`   暗色 :root[data-theme="dark"]（引擎 mobile，中性 ${dp.neutral.length} 级 = N1..N${dp.neutral.length}）`);
