#!/usr/bin/env node
/*
 * export-static.js — W2 任务4：组件默认态 → 静态 HTML（Taro-H5 预览，无运行时依赖）
 * 生成 3 样例页：sample-default-light.html / sample-brand-2E7D5B.html / sample-dark.html
 * 每页内联 globals.css(去注释) + components.css + 组件默认态静态标记。
 * 暗色页 html 加 data-theme="dark"，其 :root[data-theme="dark"] 块逐键 = 引擎 mobile 快照。
 */
const fs = require('fs');
const path = require('path');
const { generatePalette } = require(path.join(__dirname, '..', '..', '..', 'brand-color-engine', 'generate.js'));

const PKG = path.resolve(__dirname, '..');
const ROOT = path.resolve(PKG, '..', '..');
const DIST = path.join(PKG, 'dist-static');
const GLOBALS = fs.readFileSync(path.join(PKG, 'src', 'styles', 'globals.css'), 'utf8');
const COMPONENTS = fs.readFileSync(path.join(PKG, 'src', 'styles', 'components.css'), 'utf8');

const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

/* ---------- 组件默认态展示（静态标记，类由 components.css 驱动） ---------- */
const SECTIONS = `
<div class="mn-section">
  <span class="mn-section-title">顶部导航 NavBar</span>
  <div class="mn-navbar"><span class="mn-navbar-title">弘讯控制台</span></div>
</div>

<div class="mn-section">
  <span class="mn-section-title">按钮 Button</span>
  <button class="mn-btn mn-btn--primary">主按钮</button>
  <button class="mn-btn mn-btn--secondary">次按钮</button>
  <br/>
  <button class="mn-btn mn-btn--lg mn-btn--primary">大按钮</button>
  <button class="mn-btn mn-btn--sm mn-btn--primary">小按钮</button>
  <br/>
  <button class="mn-btn mn-btn--block mn-btn--primary">整宽主按钮</button>
</div>

<div class="mn-section">
  <span class="mn-section-title">标签 Tag</span>
  <span class="mn-tag mn-tag--primary">主色</span>
  <span class="mn-tag mn-tag--success">成功</span>
  <span class="mn-tag mn-tag--warning">警示</span>
  <span class="mn-tag mn-tag--error">错误</span>
</div>

<div class="mn-section">
  <span class="mn-section-title">列表项 ListItem</span>
  <ul class="mn-list">
    <li class="mn-list-item"><span class="mn-list-title">设备 A · 运行中</span></li>
    <li class="mn-list-item">
      <div><div class="mn-list-title">设备 B</div><div class="mn-list-desc">温度 62℃ · 压力正常</div></div>
    </li>
  </ul>
</div>

<div class="mn-section">
  <span class="mn-section-title">卡片 Card</span>
  <div class="mn-card">
    <div class="mn-card-title">生产概览</div>
    <div class="mn-card-body">今日产量 1,284 件，良率 98.6%，3 条告警待处理。</div>
  </div>
</div>

<div class="mn-section">
  <span class="mn-section-title">弹窗 Dialog</span>
  <div class="mn-dialog-mask">
    <div class="mn-dialog">
      <div class="mn-dialog-title">确认提交？</div>
      <div class="mn-dialog-body">提交后将同步至 MES，操作不可撤销。</div>
      <button class="mn-btn mn-btn--primary">确认</button>
      <button class="mn-btn mn-btn--secondary">取消</button>
    </div>
  </div>
</div>

<div class="mn-section">
  <span class="mn-section-title">搜索 Search</span>
  <div class="mn-search"><input class="mn-search-input" placeholder="搜索设备 / 工单"/></div>
</div>

<div class="mn-section">
  <span class="mn-section-title">页签 Tabs</span>
  <div class="mn-tabs">
    <div class="mn-tab mn-tab--active">概览</div>
    <div class="mn-tab">设备</div>
    <div class="mn-tab">告警</div>
  </div>
</div>

<div class="mn-section">
  <span class="mn-section-title">状态点 StatusDot</span>
  <span class="mn-status-dot mn-status-dot--running"></span>运行
  <span class="mn-status-dot mn-status-dot--success"></span>成功
  <span class="mn-status-dot mn-status-dot--warning"></span>警示
  <span class="mn-status-dot mn-status-dot--error"></span>错误
</div>

<div class="mn-section">
  <span class="mn-section-title">底部导航 BottomNav</span>
  <div class="mn-bottom-nav">
    <div class="mn-bottom-nav-item mn-bottom-nav-item--active"><div class="mn-bottom-nav-icon">●</div><div class="mn-bottom-nav-label">首页</div></div>
    <div class="mn-bottom-nav-item"><div class="mn-bottom-nav-icon">●</div><div class="mn-bottom-nav-label">设备</div></div>
    <div class="mn-bottom-nav-item"><div class="mn-bottom-nav-icon">●</div><div class="mn-bottom-nav-label">我的</div></div>
  </div>
</div>

<div class="mn-section">
  <span class="mn-section-title">字阶参考（android 9 键）</span>
  <div class="mn-type-row"><span class="mn-type-name">显示文本</span><span class="mn-type-sample">全屏标题</span></div>
  <div class="mn-type-row"><span class="mn-type-name">H1</span><span class="mn-type-sample">页面主标题</span></div>
  <div class="mn-type-row"><span class="mn-type-name">强调正文</span><span class="mn-type-sample">列表项文本</span></div>
  <div class="mn-type-row"><span class="mn-type-name">辅助说明</span><span class="mn-type-sample">表单提示</span></div>
</div>
`;

function buildPage({ themeAttr, brandOverride }) {
  const override = brandOverride
    ? `\n:root{\n${brandOverride}}\n`
    : '';
  return `<!DOCTYPE html>
<html lang="zh-CN"${themeAttr}>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=375, initial-scale=1.0"/>
<title>弘讯移动端组件库预览</title>
<style>
${stripComments(GLOBALS)}${override}${stripComments(COMPONENTS)}
</style>
</head>
<body>
<div class="mn-page">
${SECTIONS}
</div>
</body>
</html>
`;
}

/* 品牌换肤：#2E7D5B 亮色推导（primary 系走引擎；其余 token 不变） */
function brandOverrideCss(brand) {
  const p = generatePalette(brand, { mode: 'light', platform: 'mobile' });
  return [
    `  --primary: ${p.primary.default};`,
    `  --primary-hover: ${p.primary.hover};`,
    `  --primary-active: ${p.primary.active || p.primary.pressed};`,
    `  --primary-dis-bg: ${p.primary.disabledBg};`,
    `  --primary-dis-fg: ${p.primary.disabledFg || p.primary.disabledText};`,
    `  --brand-surface: ${p.background.brandSurface};`,
  ].join('\n');
}

const PAGES = [
  { file: 'sample-default-light.html', themeAttr: '', brand: null },
  { file: 'sample-brand-2E7D5B.html', themeAttr: '', brand: '#2E7D5B' },
  { file: 'sample-dark.html', themeAttr: ' data-theme="dark"', brand: null },
];

if (!fs.existsSync(DIST)) fs.mkdirSync(DIST, { recursive: true });
for (const pg of PAGES) {
  const html = buildPage({
    themeAttr: pg.themeAttr,
    brandOverride: pg.brand ? brandOverrideCss(pg.brand) : null,
  });
  fs.writeFileSync(path.join(DIST, pg.file), html);
  console.log(`✅ ${pg.file}（${pg.brand ? '品牌 ' + pg.brand : pg.themeAttr ? '暗色' : '默认亮色'} · 组件默认态预览）`);
}
console.log(`\n📦 3 样例页已导出 → ${path.relative(ROOT, DIST)}\n   下一步验收: node packages/mobile-ui/scripts/validate-static.js`);
