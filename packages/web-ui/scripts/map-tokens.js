#!/usr/bin/env node
/*
 * map-tokens.js — W1v2 任务2：token 桥接层
 *
 * 真源：../../弘讯web端design-system/tokens.json（唯一值真源，本脚本零写入真源）
 * 产物：src/styles/globals.css —— :root 亮色 + :root[data-theme="dark"] 暗色 + [data-density] 三档
 *
 * 约定（与 components.json contract / page-template.html 短名 1:1）：
 *   --primary/--primary-hover/--primary-active/--primary-dis-bg/--primary-dis-fg
 *   --brand-surface / --secondary* / --n1..--n11
 *   --suc/--warn/--err/--run（+ -soft/-fg，语义=背景色）
 *   --radius-* / --shadow-card|modal|float|row-hover / --elev-<lv>-surface|shadow
 *   --motion-duration-* / --motion-ease-* / --font-cn|en|mono / --font-<12级字阶>
 *   --space-* / --density-* / 布局骨架变量
 *
 * 暗色（W1v2 纠偏点 2）：弃用 shadcn 原生 `.dark` 类，改用 `:root[data-theme="dark"]`。
 *   颜色键（primary/neutral/functional/brandSurface/background）直接来自 tokens.json.dark 节，
 *   以 tokens.json 为唯一值真源；shadow/elevation 同样取自 tokens.json.dark 节。
 * 品牌色 oklch 表达 + hex 回退：同名变量声明两次（hex 在前，oklch 在后），老浏览器自动回退 hex。
 *
 * 用法：
 *   node scripts/map-tokens.js                        # 默认品牌 #005EAE → src/styles/globals.css
 *   node scripts/map-tokens.js --brand #2E7D5B --out dist-static/globals-2E7D5B.css
 *     （非默认品牌：primary 系走 brand-color-engine 亮色推导；中性/功能/字阶等不随品牌变；
 *      暗色块恒为 005EAE 引擎输出，与品牌无关）
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const TOKENS_PATH = path.join(ROOT, '弘讯web端design-system', 'tokens.json');
const ENGINE_PATH = path.join(ROOT, 'brand-color-engine', 'generate.js');
const OUT_DEFAULT = path.join(__dirname, '..', 'src', 'styles', 'globals.css');
const BASE_BRAND = '#005EAE';

/* ---------- sRGB hex → OKLCH（品牌色 oklch 表达；数值保留 4 位有效） ---------- */
function hexToOklch(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const [r, g, b] = [0, 2, 4].map(i => parseInt(full.slice(i, i + 2), 16) / 255);
  const lin = c => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const [R, G, B] = [lin(r), lin(g), lin(b)];
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const b2 = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.sqrt(a * a + b2 * b2);
  let H = (Math.atan2(b2, a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return `oklch(${(L * 100).toFixed(2)}% ${C.toFixed(4)} ${H.toFixed(2)})`;
}

/** hex + oklch 双声明（hex 回退在前） */
function dual(name, hex) {
  return `${name}:${hex}; ${name}:${hexToOklch(hex)};`;
}

function loadTokens() {
  return JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf8'));
}

/**
 * 生成完整 globals.css 文本。
 * @param {object} opts { brand?: string }  非默认品牌时 primary 系走引擎亮色推导
 */
function buildCss(opts = {}) {
  const t = loadTokens();
  const brand = (opts.brand || t.meta.brand || BASE_BRAND).toUpperCase();
  const isBaseBrand = brand === BASE_BRAND;

  // 亮色 primary 来源：默认品牌=tokens.json；非默认品牌=引擎推导（功能色/中性不随品牌变，引擎不变式）
  let P = {
    default: t.colors.primary.default,
    hover: t.colors.primary.hover,
    active: t.colors.primary.active,
    disabledBg: t.colors.primary.disabledBg,
    disabledFg: t.colors.primary.disabledFg
  };
  let brandSurface = brand === BASE_BRAND ? BASE_BRAND : brand;
  if (!isBaseBrand) {
    const { generatePalette } = require(ENGINE_PATH);
    const p = generatePalette(brand, { mode: 'light', platform: 'web' });
    P = {
      default: p.primary.default,
      hover: p.primary.hover,
      active: p.primary.click || p.primary.active,
      disabledBg: p.primary.disabledBg,
      disabledFg: p.primary.disabledText || p.primary.disabledFg
    };
    if (p.background && p.background.brandSurface) brandSurface = p.background.brandSurface;
  }

  const n = t.colors.neutral;
  const f = t.colors.functional;
  const d = t.dark;
  const dn = d.colors.neutral;
  const df = d.colors.functional;
  const W = { Medium: 500, Regular: 400 }; // tokens weight → CSS font-weight

  // 暗色颜色键直接来自 tokens.json.dark 节（唯一值真源）

  const fontVars = Object.entries(t.font.scale)
    .map(([k, v]) => `  --font-${k}:${W[v.weight] || 400} ${v.size}px/${v.lineHeight}px var(--font-cn);`)
    .join('\n');

  const elev = lv =>
    `  --elev-${lv}-surface:${t.elevation[lv].surface}; --elev-${lv}-shadow:${t.elevation[lv].shadow};`;
  const delev = lv =>
    `  --elev-${lv}-surface:${d.elevation[lv].surface}; --elev-${lv}-shadow:${d.elevation[lv].shadow};`;

  const spaceVars = Object.entries(t.spacing)
    .filter(([k]) => !/^page|^content|^card/.test(k))
    .map(([k, v]) => `--space-${k}:${v}px;`)
    .join(' ');

  const chartVars = Object.entries(t.colors.chart)
    .map(([k, v]) => `--chart-${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v};`)
    .join(' ');

  const css = `/*
 * globals.css — AUTO-GENERATED by packages/web-ui/scripts/map-tokens.js. DO NOT EDIT.
 * 真源: 弘讯web端design-system/tokens.json（改 token 请改真源后重新生成）
 * 品牌: ${brand}${isBaseBrand ? '（默认）' : '（非默认，primary 系=brand-color-engine 亮色推导）'}
 * 暗色: :root[data-theme="dark"] 切换（我方换色引擎 generatePalette('#005EAE',{mode:'dark',platform:'web'}) 驱动；弃用 shadcn 原生 .dark 类，W1v2 纠偏）
 */
:root{
  /* 品牌色（oklch 表达 + hex 回退） */
  ${dual('--primary', P.default)}
  ${dual('--primary-hover', P.hover)}
  ${dual('--primary-active', P.active)}
  --primary-dis-bg:${P.disabledBg}; --primary-dis-fg:${P.disabledFg};
  ${dual('--brand-surface', brandSurface)}
  --secondary:${t.colors.secondary.default}; --secondary-hover:${t.colors.secondary.hover}; --secondary-active:${t.colors.secondary.active}; --secondary-disabled-bg:${t.colors.secondary.disabledBg}; --secondary-disabled-fg:${t.colors.secondary.disabledFg};
  --link:${t.colors.link};
  /* 中性 N1–N11 */
  --n1:${n.N1}; --n2:${n.N2}; --n3:${n.N3}; --n4:${n.N4}; --n5:${n.N5}; --n6:${n.N6};
  --n7:${n.N7}; --n8:${n.N8}; --n9:${n.N9}; --n10:${n.N10}; --n11:${n.N11};
  /* 功能色（--suc/--warn/--err/--run 语义=背景色；Web 对齐 Ant Design，运行绿独立） */
  --suc:${f.success.bg}; --suc-soft:${f.success.soft}; --suc-fg:${f.success.fg};
  --warn:${f.warning.bg}; --warn-soft:${f.warning.soft}; --warn-fg:${f.warning.fg};
  --err:${f.error.bg}; --err-soft:${f.error.soft}; --err-fg:${f.error.fg}; --err-fg-deep:${f.error.fgDeep};
  --run:${f.statusRunning.bg}; --run-soft:${f.statusRunning.soft}; --run-fg:${f.statusRunning.fg};
  /* 亮色功能色交互态（与暗色 NEW-005 对称：hover/active/disabled + soft/border 派生） */
  --suc-hover:${f.success.bgHover}; --suc-active:${f.success.bgActive}; --suc-disabled:${f.success.bgDisabled}; --suc-soft-hover:${f.success.softHover}; --suc-soft-active:${f.success.softActive}; --suc-border-hover:${f.success.borderHover}; --suc-border-active:${f.success.borderActive}; --suc-dis-fg:${f.success.disabledFg};
  --warn-hover:${f.warning.bgHover}; --warn-active:${f.warning.bgActive}; --warn-disabled:${f.warning.bgDisabled}; --warn-soft-hover:${f.warning.softHover}; --warn-soft-active:${f.warning.softActive}; --warn-border-hover:${f.warning.borderHover}; --warn-border-active:${f.warning.borderActive}; --warn-dis-fg:${f.warning.disabledFg};
  --err-hover:${f.error.bgHover}; --err-active:${f.error.bgActive}; --err-disabled:${f.error.bgDisabled}; --err-soft-hover:${f.error.softHover}; --err-soft-active:${f.error.softActive}; --err-border-hover:${f.error.borderHover}; --err-border-active:${f.error.borderActive}; --err-dis-fg:${f.error.disabledFg};
  --run-hover:${f.statusRunning.bgHover}; --run-active:${f.statusRunning.bgActive}; --run-disabled:${f.statusRunning.bgDisabled}; --run-soft-hover:${f.statusRunning.softHover}; --run-soft-active:${f.statusRunning.softActive}; --run-border-hover:${f.statusRunning.borderHover}; --run-border-active:${f.statusRunning.borderActive}; --run-dis-fg:${f.statusRunning.disabledFg};
  /* 图表色 */
  ${chartVars}
  /* 圆角 */
  --radius-sm:${t.radius.sm}px; --radius-base:${t.radius.base}px; --radius-md:${t.radius.md}px; --radius-lg:${t.radius.lg}px; --radius-round:${t.radius.round}px; --radius-btn-ios:${t.radius.btnIos || 6}px;
  /* 间距（4 的倍数） */
  ${spaceVars}
  /* 投影（双层复合：柔光层+1px发丝线） */
  --shadow-card:${t.shadow.card};
  --shadow-modal:${t.shadow.modal};
  --shadow-float:${t.shadow.float};
  --shadow-row-hover:${t.shadow.tableRowHover};
  /* Elevation 5 级 */
${['sunken', 'default', 'raised', 'overlay', 'overflow'].map(elev).join('\n')}
  /* Motion */
  --motion-duration-instant:${t.motion.duration.instant}ms; --motion-duration-fast:${t.motion.duration.fast}ms; --motion-duration-normal:${t.motion.duration.normal}ms; --motion-duration-slow:${t.motion.duration.slow}ms;
${Object.entries(t.motion.easing).map(([k, v]) => `  --motion-ease-${k.replace(/^ease-/, '')}:${v};`).join('\n')}
  /* 字体族 */
  --font-cn:"${t.font.familyCN}","思源黑体",sans-serif; --font-en:"${t.font.familyEN}",sans-serif;
  --font-mono:${t.font.familyMono};
  /* 字阶（12 级硬切换；与 tokens.json.font.scale / contract type.* 1:1） */
${fontVars}
  /* 密度（默认 comfortable） */
  --density-row-height:${t.density.comfortable.rowHeight}px; --density-content-padding:${t.density.comfortable.contentPadding}px;
  /* 背景/文本语义（W1 桥接层约定：亮色取自 tokens 布局+中性；暗色取自 dark.background） */
  --bg-page:${t.layout.contentBg}; --bg-surface:${n.N1}; --bg-elevated:${n.N1};
  --text-1:${n.N11}; --text-2:${n.N9}; --text-3:${n.N8}; --border:${n.N6};
  /* 布局骨架 */
  --topbar-height:${t.layout.topbarHeight}px; --sidebar-width:${t.layout.sidebarWidth}px;
  --sidebar-collapsed-width:${t.layout.sidebarCollapsedWidth}px; --footer-height:${t.layout.footerHeight}px;
}

/* 密度三档（opt-in；对标 Material compact/comfortable/spacious） */
:root[data-density="compact"],.density-compact{--density-row-height:${t.density.compact.rowHeight}px;--density-content-padding:${t.density.compact.contentPadding}px;}
:root[data-density="comfortable"],.density-comfortable{--density-row-height:${t.density.comfortable.rowHeight}px;--density-content-padding:${t.density.comfortable.contentPadding}px;}
:root[data-density="spacious"],.density-spacious{--density-row-height:${t.density.spacious.rowHeight}px;--density-content-padding:${t.density.spacious.contentPadding}px;}

/* ===== 暗色（W1v2 纠偏点 2）：:root[data-theme="dark"]，值 = tokens.json.dark 节（唯一值真源） ===== */
:root[data-theme="dark"]{
  ${dual('--primary', d.colors.primary.default)}
  ${dual('--primary-hover', d.colors.primary.hover)}
  ${dual('--primary-active', d.colors.primary.click)}
  --primary-dis-bg:${d.colors.primary.disabledBg}; --primary-dis-fg:${d.colors.primary.disabledText};
  ${dual('--brand-surface', d.colors.brandSurface)}
  --n1:${dn.N1}; --n2:${dn.N2}; --n3:${dn.N3}; --n4:${dn.N4}; --n5:${dn.N5}; --n6:${dn.N6};
  --n7:${dn.N7}; --n8:${dn.N8}; --n9:${dn.N9}; --n10:${dn.N10}; --n11:${dn.N11};
  --suc:${df.success.default}; --suc-soft:${df.success.bg}; --suc-fg:${df.success.text};
  --warn:${df.warning.default}; --warn-soft:${df.warning.bg}; --warn-fg:${df.warning.text};
  --err:${df.error.default}; --err-soft:${df.error.bg}; --err-fg:${df.error.text};
  --run:${df.running.default}; --run-soft:${df.running.bg}; --run-fg:${df.running.text};
  /* 暗色功能色交互态（NEW-005：hover/active/disabled + soft/border 派生，均由 tokens.json.dark 计算生成） */
  --suc-hover:${df.success.hover}; --suc-active:${df.success.active}; --suc-disabled:${df.success.disabled}; --suc-soft-hover:${df.success.softHover}; --suc-soft-active:${df.success.softActive}; --suc-border-hover:${df.success.borderHover}; --suc-border-active:${df.success.borderActive}; --suc-dis-fg:${df.success.disabledFg};
  --warn-hover:${df.warning.hover}; --warn-active:${df.warning.active}; --warn-disabled:${df.warning.disabled}; --warn-soft-hover:${df.warning.softHover}; --warn-soft-active:${df.warning.softActive}; --warn-border-hover:${df.warning.borderHover}; --warn-border-active:${df.warning.borderActive}; --warn-dis-fg:${df.warning.disabledFg};
  --err-hover:${df.error.hover}; --err-active:${df.error.active}; --err-disabled:${df.error.disabled}; --err-soft-hover:${df.error.softHover}; --err-soft-active:${df.error.softActive}; --err-border-hover:${df.error.borderHover}; --err-border-active:${df.error.borderActive}; --err-dis-fg:${df.error.disabledFg};
  --run-hover:${df.running.hover}; --run-active:${df.running.active}; --run-disabled:${df.running.disabled}; --run-soft-hover:${df.running.softHover}; --run-soft-active:${df.running.softActive}; --run-border-hover:${df.running.borderHover}; --run-border-active:${df.running.borderActive}; --run-dis-fg:${df.running.disabledFg};
  --shadow-card:${d.shadow.card};
  --shadow-modal:${d.shadow.modal};
  --shadow-float:${d.shadow.float};
  --shadow-row-hover:${d.shadow.tableRowHover};
  /* 暗色次级/链接/图表（D-T2-17 2026-08-05 补齐：dark 键集与亮色对称；图表色深底直接复用亮值对比更高） */
  --secondary:${d.colors.secondary.default}; --secondary-hover:${d.colors.secondary.hover}; --secondary-active:${d.colors.secondary.active}; --secondary-disabled-bg:${d.colors.secondary.disabledBg}; --secondary-disabled-fg:${d.colors.secondary.disabledFg};
  --link:${d.colors.link};
  ${Object.entries(d.colors.chart || {}).map(([k, v]) => `--chart-${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v};`).join(' ')}
${['sunken', 'default', 'raised', 'overlay', 'overflow'].map(delev).join('\n')}
  --bg-page:${d.background.page}; --bg-surface:${d.background.surface}; --bg-elevated:${d.background.elevated};
  --text-1:${d.background.textPrimary}; --text-2:${d.background.textSecondary}; --text-3:${d.background.textTertiary}; --border:${d.background.border};
}
`;
  // DEFECT-12/守卫（2026-08-05 对抗审查）：token 缺字段输出 undefined 会让声明失效——替换 inherit 兜底，
  //   但为避免"无声降级"，生成后对残留 :inherit 断言告警（缺键应在 tokens.json 补，不得静默）。
  const out = css.replace(/:undefined/g, ':inherit');
  const inheritCount = (out.match(/:inherit;/g) || []).length;
  if (inheritCount > 0) {
    console.warn(`⚠️ map-tokens 检测到 ${inheritCount} 个 :inherit 兜底（tokens.json 缺字段）——请在真源补键，勿依赖兜底`);
  }
  return out;
}

module.exports = { buildCss, hexToOklch, TOKENS_PATH, ENGINE_PATH };

if (require.main === module) {
  const args = process.argv.slice(2);
  const get = flag => {
    const i = args.indexOf(flag);
    return i >= 0 ? args[i + 1] : undefined;
  };
  const brand = get('--brand');
  const out = get('--out') ? path.resolve(get('--out')) : OUT_DEFAULT;
  const css = buildCss({ brand });
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, css);
  console.log(`✅ globals.css 已生成 → ${out}${brand ? `（品牌 ${brand}）` : ''}`);
}
