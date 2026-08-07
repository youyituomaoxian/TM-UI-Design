#!/usr/bin/env node
/**
 * generate-design-tokens-md.js
 * ---------------------------------------------------------------------------
 * 从 tokens.json（值真源）生成 DESIGN-TOKENS.md（CSS 变量文档）。
 *
 * 统一命名：全文使用「短名」CSS 变量（--primary / --n5 / --suc / --run /
 *           --radius-base …），与 components.json referenceCss、page-template.html
 *           :root **1:1 对齐**。旧版 --color-* 全名已废弃。
 *
 * 用法：
 *   node scripts/generate-design-tokens-md.js          # 重新生成 DESIGN-TOKENS.md（写盘）
 *   node scripts/generate-design-tokens-md.js --check  # CI：若已 drift 则 exit 1（不写盘）
 *
 * ⚠️ 本文件为自动生成——请勿手改 DESIGN-TOKENS.md；改 token 请编辑 tokens.json
 *    （值）或本脚本内的命名映射（名）后重跑本脚本。
 * ---------------------------------------------------------------------------
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');          // 设计系统目录
const TOKENS = path.join(ROOT, 'tokens.json');
const OUT = path.join(ROOT, 'DESIGN-TOKENS.md');

const tokens = JSON.parse(fs.readFileSync(TOKENS, 'utf8'));
const c = tokens.colors;
const lay = tokens.layout;
const sp = tokens.spacing;
const rad = tokens.radius;
const sh = tokens.shadow;
const ft = tokens.font;
const elev = tokens.elevation;
const mot = tokens.motion;

/** 功能色 key → 短名后缀映射（成功/警告/错误/运行 共用） */
const FMAP = {
  bg: '', bgHover: '-hover', bgActive: '-active', bgDisabled: '-dis',
  soft: '-soft', softHover: '-soft-hover', softActive: '-soft-active',
  border: '-border', borderHover: '-border-hover', borderActive: '-border-active',
  fg: '-fg',
  disabledFg: '-dis-fg' };
function funcGroup(label, short, obj) {
  return Object.entries(obj).map(([k, v]) => [`--${short}${FMAP[k] !== undefined ? FMAP[k] : ''}`, v, `${label} ${k}`]);
}

function build() {
  const L = [];
  const line = (s = '') => L.push(s);
  const code = (rows) => { line('```css'); rows.forEach(r => line(r)); line('```'); line(''); };
  const root = (title, entries) => {
    if (title) line(`### ${title}`);
    line('```css');
    line(':root {');
    entries.forEach(([name, val, cmt]) => line(`  ${name}: ${val};${cmt ? ` /* ${cmt} */` : ''}`));
    line('}');
    line('```');
    line('');
  };

  // ===== 标题 + 生成说明 =====
  line('# 弘讯B端视觉系统 — Design Tokens (CSS Variables)');
  line('');
  line('> ⚠️ **本文件由 `scripts/generate-design-tokens-md.js` 自动生成，请勿手改。** 改 token 请编辑 `tokens.json`（值真源）或脚本内的命名映射后重跑。');
  line('> **命名规范**：全文使用「短名」CSS 变量（`--primary` / `--n5` / `--suc` / `--run` / `--radius-base` …），与 `components.json` referenceCss 及 `page-template.html :root` **1:1 对齐**。旧版 `--color-*` 全名已废弃。');
  line('> **平台**: Web / B端 / 后台管理系统（Ant Design 风格）');
  line(`> **生成日期**: ${new Date().toISOString().slice(0, 10)}`);
  line('');
  line('---');
  line('');

  // ===== 一、品牌信息（静态） =====
  line('## 一、品牌信息');
  line('');
  code([
    ':root {',
    '  --brand-name: "弘讯科技 TECHMATION";',
    '  --product: "注塑机工业控制 · B端后台管理系统";',
    '  --style: "Ant Design 风格 · 极简工业风";',
    '  --viewport-base: 1440px;        /* 设计基准宽度 */',
    '  --grid-unit: 4px;               /* 最小原子网格（web 常用 4/8） */',
    '  --grid-columns: 24;             /* Ant Design 24 栅格 */',
    '}'
  ]);

  // ===== 二、色彩体系 =====
  line('## 二、色彩体系');
  line('');
  line('### 2.1 品牌色 Primary');
  line('');
  root('', [
    ['--primary', c.primary.default, '主色默认 — 按钮、顶栏、侧边栏、品牌强调'],
    ['--primary-hover', c.primary.hover, '主色悬停 — 按钮 hover、链接、聚焦'],
    ['--primary-active', c.primary.active, '主色点击 — 按钮 active/pressed'],
    ['--primary-dis-bg', c.primary.disabledBg, '主色禁用背景'],
    ['--primary-dis-fg', c.primary.disabledFg, '主色禁用文字']
  ]);

  line('### 2.2 辅助色 Secondary（强调 / 操作辅助）');
  line('');
  root('', [
    ['--secondary', c.secondary.default, '辅助色默认 — 次级强调、图表高亮'],
    ['--secondary-hover', c.secondary.hover, '辅助色悬停'],
    ['--secondary-active', c.secondary.active, '辅助色点击'],
    ['--secondary-dis-bg', c.secondary.disabledBg, '辅助色禁用填充'],
    ['--secondary-dis-fg', c.secondary.disabledFg, '辅助色禁用文字']
  ]);

  line('### 2.3 链接 Link');
  line('');
  root('', [['--link', c.link, '链接默认（同主色悬停）']]);

  line('### 2.4 中性色 Neutral（N1–N11）');
  line('');
  root('', [
    ['--n1', c.neutral.N1, 'N1 — 卡片底色、次按钮填充'],
    ['--n2', c.neutral.N2, 'N2 — 表头底色'],
    ['--n3', c.neutral.N3, 'N3 — 行悬停'],
    ['--n4', c.neutral.N4, 'N4 — 页面背景、禁用填充、悬停底色'],
    ['--n5', c.neutral.N5, 'N5 — 输入框底色、行悬停、按钮选中填充'],
    ['--n6', c.neutral.N6, 'N6 — 分割线、组件边框、按钮禁用边框'],
    ['--n7', c.neutral.N7, 'N7 — 次按钮边框、未激活图标、表单提示'],
    ['--n8', c.neutral.N8, 'N8 — 禁用文字、次按钮悬停边框、辅助说明'],
    ['--n9', c.neutral.N9, 'N9 — 三级文字、辅助说明、选中边框'],
    ['--n10', c.neutral.N10, 'N10 — 二级文字、正文、按钮默认悬停、选中文字'],
    ['--n11', c.neutral.N11, 'N11 — 一级文字、主标题、关键数据']
  ]);

  line('### 2.5 信息化图表 Chart Palette（8 色）');
  line('');
  root('', [
    ['--chart-tech-blue', c.chart.techBlue, '科技蓝 — 核心指标'],
    ['--chart-smart-cyan', c.chart.smartCyan, '智能青 — 趋势线'],
    ['--chart-data-cyan', c.chart.dataCyan, '数据青 — 对比'],
    ['--chart-fresh-green', c.chart.freshGreen, '清新绿 — 正向'],
    ['--chart-vivid-orange', c.chart.vividOrange, '活力橙 — 中性/预警'],
    ['--chart-alert-red', c.chart.alertRed, '醒目红 — 负向/告警'],
    ['--chart-wisdom-purple', c.chart.wisdomPurple, '智慧紫 — 多维分析'],
    ['--chart-modern-pink', c.chart.modernPink, '现代粉 — 关键标注']
  ]);

  line('### 2.6 功能色 Functional（成功 / 警告 / 错误 / 运行）');
  line('');
  root('', [
    ...funcGroup('成功 Success', 'suc', c.functional.success),
    ...funcGroup('警告 Warning', 'warn', c.functional.warning),
    ...funcGroup('错误 Error', 'err', c.functional.error),
    ...funcGroup('运行/在线 Running', 'run', c.functional.statusRunning)
  ]);

  // ===== 三、字体体系 =====
  line('## 三、字体体系');
  line('');
  root('', [
    ['--font-cn', `"${ft.familyCN}", "思源黑体", sans-serif`, '中文'],
    ['--font-en', `"${ft.familyEN}", sans-serif`, '英文 / 数字'],
    ['--font-mono', ft.familyMono, '等宽（B 包新增；工控数据/代码，对标 AntD fontFamilyCode + Polaris mono）']
  ]);
  line('### 3.1 字体层级 Token（B 包 13 级硬切换；对标 M3 15 级 + AntD heading）');
  line('');
  root('', Object.entries(ft.scale).map(([k, v]) =>
    [`--font-${k}`, `${v.weight} ${v.size}px/${v.lineHeight}px var(--font-cn)`, v.usage]));
  line('### 3.2 密度模式 Density（B 包新增；对标 Material compact/comfortable/spacious）');
  line('');
  root('', [
    ['--density-compact-row-height', `${tokens.density.compact.rowHeight}px`, 'compact 行高（数据密集，opt-in）'],
    ['--density-compact-padding', `${tokens.density.compact.contentPadding}px`, 'compact padding'],
    ['--density-comfortable-row-height', `${tokens.density.comfortable.rowHeight}px`, 'comfortable 行高（默认基准）'],
    ['--density-comfortable-padding', `${tokens.density.comfortable.contentPadding}px`, 'comfortable padding'],
    ['--density-spacious-row-height', `${tokens.density.spacious.rowHeight}px`, 'spacious 行高（聚焦/大间距）'],
    ['--density-spacious-padding', `${tokens.density.spacious.contentPadding}px`, 'spacious padding']
  ]);

  // ===== 四、间距体系 =====
  line('## 四、间距体系');
  line('');
  root('', [
    ['--space-xs', `${sp.xs}px`, '微间距：图标与文字、栅格步进'],
    ['--space-sm', `${sp.sm}px`, '紧凑元素间隙'],
    ['--space-md', `${sp.md}px`, '组件内次级间距'],
    ['--space-base', `${sp.base}px`, '标准：卡片内边距、列表项、内容区左右边距'],
    ['--space-lg', `${sp.lg}px`, '模块间、卡片外边距'],
    ['--space-xl', `${sp.xl}px`, '区块分隔'],
    ['--space-xxl', `${sp.xxl}px`, '页面级分隔'],
    ['--page-padding-x', `${sp.pagePaddingX}px`, '页面左右 padding'],
    ['--content-padding', `${sp.contentPadding}px`, '内容卡内边距'],
    ['--card-gap', `${sp.cardGap}px`, '卡片间距']
  ]);

  // ===== 五、圆角体系 =====
  line('## 五、圆角体系');
  line('');
  root('', [
    ['--radius-sm', `${rad.sm}px`, '弹窗投影等细微圆角'],
    ['--radius-base', `${rad.base}px`, '输入框、标签、小型控件'],
    ['--radius-md', `${rad.md}px`, '卡片、按钮、下拉'],
    ['--radius-lg', `${rad.lg}px`, '大卡片、形象区'],
    ['--radius-round', `${rad.round}px`, '状态点、头像、分页圆钮']
  ]);

  // ===== 六、投影体系（双层复合：柔光层 + 1px 发丝线） =====
  line('## 六、投影体系（双层复合）');
  line('');
  line('> 升级为双层复合阴影（柔光层 + 1px 发丝线），对标 Atlassian elevation.shadow + AntD boxShadow。旧名保留，引用方零改动。详见 TOKENS-EVIDENCE.md。');
  line('');
  root('', [
    ['--shadow-card', sh.card, '卡片（双层复合）'],
    ['--shadow-modal', sh.modal, '弹窗（双层复合）'],
    ['--shadow-float', sh.float, '悬浮块 / 按钮（双层复合）'],
    ['--shadow-row-hover', sh.tableRowHover, '表格行悬停（双层复合）']
  ]);

  // ===== 七、Elevation 层级体系（5 级，A 包新增） =====
  line('## 七、Elevation 层级体系（5 级）');
  line('');
  line('> 国际对标：Atlassian 5 级（sunken/default/raised/overlay/overflow）surface+shadow 配对 + Material 3 层级递进 + Polaris 组件映射。暗色值属 C 包。详见 TOKENS-EVIDENCE.md。');
  line('');
  root('', [
    ['--elev-sunken', `${elev.sunken.surface} / ${elev.sunken.shadow}`, elev.sunken.usage],
    ['--elev-default', `${elev.default.surface} / ${elev.default.shadow}`, elev.default.usage],
    ['--elev-raised', `${elev.raised.surface} / ${elev.raised.shadow}`, elev.raised.usage],
    ['--elev-overlay', `${elev.overlay.surface} / ${elev.overlay.shadow}`, elev.overlay.usage],
    ['--elev-overflow', `${elev.overflow.surface} / ${elev.overflow.shadow}`, elev.overflow.usage]
  ]);

  // ===== 八、Motion 动效体系（A 包新增） =====
  line('## 八、Motion 动效体系');
  line('');
  line('> 国际对标：Material 3 duration 档位 + Ant Design motion token（duration 0.1/0.2/0.3s + easing cubic-bezier 精确值）。详见 TOKENS-EVIDENCE.md。');
  line('');
  line('### 8.1 Duration（4 档）');
  line('');
  root('', [
    ['--motion-duration-instant', `${mot.duration.instant}ms`, '微交互（状态切换、ripple）'],
    ['--motion-duration-fast', `${mot.duration.fast}ms`, '小型组件 enter/exit'],
    ['--motion-duration-normal', `${mot.duration.normal}ms`, '标准转场'],
    ['--motion-duration-slow', `${mot.duration.slow}ms`, '全屏转场、复杂展开']
  ]);
  line('### 8.2 Easing（cubic-bezier 曲线库）');
  line('');
  root('', Object.entries(mot.easing).map(([k, v]) =>
    [`--motion-ease-${k}`, v, 'AntD 官方曲线']));

  // ===== 九、组件级精确 Token =====
  line('## 九、组件级精确 Token');
  line('');
  line('> 注：组件「尺寸/圆角/字重」的**唯一真源**是 `components.json`；本节为便于速查的 CSS 变量镜像，引用前请优先对齐 components.json。');
  line('');
  line('### 7.1 按钮 Button');
  line('');
  code([
    ':root {',
    '  /* 尺寸（Ant Design 标准；单按钮以 32 为准） */',
    '  --btn-large-height: 40px;',
    '  --btn-default-height: 32px;',
    '  --btn-small-height: 24px;',
    '  --btn-padding-x: 16px;',
    '  --btn-min-width: 64px;',
    '  --btn-primary-bg: var(--primary);',
    '  --btn-primary-fg: var(--n1);',
    '  --btn-primary-hover-bg: var(--primary-hover);',
    '  --btn-primary-active-bg: var(--primary-active);',
    '  --btn-primary-disabled-bg: var(--primary-dis-bg);',
    '  --btn-primary-disabled-fg: var(--primary-dis-fg);',
    '  --btn-secondary-bg: var(--n1);',
    '  --btn-secondary-border: var(--primary);',
    '  --btn-secondary-fg: var(--primary);',
    '  --btn-secondary-hover-border: var(--n7);',
    '  --btn-text-fg: var(--primary);',
    '  --btn-text-hover-fg: var(--primary-hover);',
    '  --btn-radius: var(--radius-md);',
    '}'
  ]);

  line('### 7.2 输入 Input');
  line('');
  code([
    ':root {',
    '  --input-height: 32px;',
    '  --input-padding-x: 12px;',
    '  --input-bg: var(--n5);',
    '  --input-border: var(--n6);',
    '  --input-radius: var(--radius-base);',
    '  --input-placeholder: var(--n8);',
    '  --input-focus-border: var(--primary);',
    '  --input-focus-ring: rgba(0, 94, 174, 0.20);',
    '  --input-disabled-bg: var(--n4);',
    '}'
  ]);

  line('### 7.3 标签 Tag');
  line('');
  code([
    ':root {',
    '  --tag-height: 22px;',
    '  --tag-padding-x: 10px;',
    '  --tag-font: Regular 12px/20px var(--font-cn);',
    '  --tag-radius: var(--radius-base);',
    '  --tag-success-bg: var(--suc-soft);   --tag-success-fg: var(--suc);',
    '  --tag-warning-bg: var(--warn-soft);  --tag-warning-fg: var(--warn);',
    '  --tag-error-bg: var(--err-soft);     --tag-error-fg: var(--err);',
    '  --tag-running-bg: var(--run-soft);   --tag-running-fg: var(--run);',
    '  --tag-default-bg: var(--n3);       --tag-default-fg: var(--n9);',
    '}'
  ]);

  line('### 7.4 卡片 Card');
  line('');
  code([
    ':root {',
    '  --card-bg: var(--n1);',
    '  --card-radius: var(--radius-md);',
    '  --card-shadow: var(--shadow-card);',
    '  --card-header-height: 40px;',
    '  --card-header-padding-x: 16px;',
    '  --card-header-title-font: Medium 14px/24px var(--font-cn);',
    '  --card-header-title-color: var(--n11);',
    '  --card-content-padding: 16px;',
    '  --card-divider: var(--n6);',
    '}'
  ]);

  line('### 7.5 弹窗 Modal');
  line('');
  code([
    ':root {',
    '  --modal-width: 382px;',
    '  --modal-header-height: 40px;',
    '  --modal-header-padding-x: 16px;',
    '  --modal-shadow: var(--shadow-modal);',
    '  --modal-radius: var(--radius-md);',
    '  --modal-bg: var(--n1);',
    '}'
  ]);

  line('### 7.6 表格 Table');
  line('');
  code([
    ':root {',
    '  --table-header-height: 44px;',
    '  --table-row-height: 44px;',
    '  --table-header-bg: var(--n2);',
    '  --table-row-hover-bg: var(--n3);',
    '  --table-border: var(--n6);',
    '  --table-cell-padding-x: 16px;',
    '  --table-checkbox-size: 16px;',
    '}'
  ]);

  line('### 7.7 导航与布局 Navigation & Layout');
  line('');
  root('', [
    ['--topbar-height', `${lay.topbarHeight}px`, '顶部导航高'],
    ['--topbar-bg', 'var(--primary)', '顶栏底'],
    ['--topbar-fg', 'var(--n1)', '顶栏字'],
    ['--sidebar-width', `${lay.sidebarWidth}px`, '侧边栏宽'],
    ['--sidebar-collapsed-width', `${lay.sidebarCollapsedWidth}px`, '侧边栏折叠宽'],
    ['--sidebar-bg', 'var(--primary)', '侧边栏底'],
    ['--sidebar-fg', 'var(--n1)', '侧边栏字'],
    ['--footer-height', `${lay.footerHeight}px`, '底栏高'],
    ['--footer-bg', 'var(--primary)', '底栏底'],
    ['--footer-fg', 'var(--n1)', '底栏字'],
    ['--content-bg', lay.contentBg, '内容区底 N4 #F5F7FB'],
    ['--content-padding', `${sp.contentPadding}px`, '内容区内边距'],
    ['--tab-height', `${lay.tabHeight}px`, '页签高'],
    ['--tab-gap', '4px', '页签间距'],
    ['--pagination-height', `${lay.paginationHeight}px`, '分页器高'],
    ['--status-dot', `${lay.statusDot}px`, '状态指示灯直径（约）'],
    ['--grid-columns', `${lay.gridColumns}`, 'Ant Design 24 栅格']
  ]);

  // ===== 八、响应式断点 =====
  line('## 十、响应式断点（Ant Design 基准）');
  line('');
  root('', [
    ['--bp-sm', `${lay.breakpoints.sm}px`, '断点 sm'],
    ['--bp-md', `${lay.breakpoints.md}px`, '断点 md'],
    ['--bp-lg', `${lay.breakpoints.lg}px`, '断点 lg'],
    ['--bp-xl', `${lay.breakpoints.xl}px`, '断点 xl'],
    ['--bp-xxl', `${lay.breakpoints.xxl}px`, '断点 xxl']
  ]);

  return L.join('\n') + '\n';
}

const content = build();
if (process.argv.includes('--check')) {
  const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  // RED-11 修复：剥离「生成日期」行再比对——日期随当天漂移不算 tokens 漂移（否则 --check 隔天必红）
  const stripDate = s => String(s).replace(/^>\s*\*\*生成日期\*\*.*$/m, '').trim();
  if (stripDate(cur) !== stripDate(content)) {
    console.error('✗ DESIGN-TOKENS.md 与 tokens.json 不同步，请重跑 node scripts/generate-design-tokens-md.js');
    process.exit(1);
  }
  console.log('✓ DESIGN-TOKENS.md 与 tokens.json 同步');
} else {
  fs.writeFileSync(OUT, content);
  console.log('✓ 已生成 DESIGN-TOKENS.md（短名统一，与 components.json / page-template.html 对齐）');
}
