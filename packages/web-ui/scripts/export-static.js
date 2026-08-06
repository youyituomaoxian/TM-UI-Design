#!/usr/bin/env node
/*
 * export-static.js — W1v2 任务4：全量 vendored shadcn 组件默认态 → 静态 HTML 样例页
 *
 * 产物（dist-static/）：
 *   sample-default-light.html   默认品牌 #005EAE · 亮色（:root）
 *   sample-brand-2E7D5B.html    非默认品牌 #2E7D5B · 亮色（primary 系=brand-color-engine 推导）
 *   sample-dark.html            默认品牌 · 暗色（<html data-theme="dark">，:root[data-theme="dark"] 由换色引擎驱动）
 *
 * 特性：
 *   - 带完整 CSS 变量（globals.css 内联）+ 组件参考样式（components.css 内联），无 React 运行时依赖
 *   - 暗色：<html data-theme="dark"> + :root[data-theme="dark"]（W1v2 纠偏点 2：弃 shadcn 原生 .dark 类）
 *   - 组件消费 tokens.json 导出的 CSS 变量，与 components.json 解耦（W1v2 纠偏点 1：全量 vendor shadcn，不绑原 11 契约）
 *   - 页面布局 CSS 遵守 validate-static.js 三门禁（无硬编码色 / 字阶白名单 / 间距 4 倍数）
 */
const fs = require('fs');
const path = require('path');
const { buildCss } = require('./map-tokens.js');

const PKG = path.resolve(__dirname, '..');
const OUT_DIR = path.join(PKG, 'dist-static');

/**
 * 剥离 CSS 注释：validate-spec.js 的规则解析器不剥注释，注释中的类名字样
 * （如 ".btn / .tag"）会被吞进 selector 造成契约误匹配 → 产物统一去注释。
 */
function stripCssComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\n{3,}/g, '\n\n');
}

const COMPONENTS_CSS = stripCssComments(
  fs.readFileSync(path.join(PKG, 'src', 'styles', 'components.css'), 'utf8')
);

/* ---------- 页面级布局 CSS（间距全 4 倍数；颜色全走变量） ---------- */
const PAGE_CSS = `
*{box-sizing:border-box;}
body{margin:0;font-family:var(--font-cn);font-size:14px;color:var(--text-1);background:var(--bg-page);padding:24px;}
.page-head{margin-bottom:24px;}
.page-head .sub{color:var(--text-2);font-size:13px;margin-top:4px;}
.sec{background:var(--bg-surface);border-radius:var(--radius-md);box-shadow:var(--shadow-card);margin-bottom:16px;}
.sec-head{height:40px;display:flex;align-items:center;gap:8px;padding:0 16px;border-bottom:1px solid var(--border);
  font-size:14px;font-weight:500;color:var(--n11);}
.sec-head .idx{color:var(--text-3);font-weight:400;font-size:12px;}
.sec-body{padding:16px;}
.row{display:flex;align-items:center;gap:12px;flex-wrap:wrap;}
.row + .row{margin-top:12px;}
.side-sim{width:240px;background:var(--primary);border-radius:var(--radius-base);padding:8px;}
/* 品牌表面树选中态：framework.css .tree--brand 语义（--primary-active 实底+白字），sample 不内联 framework.css 故自携 */
.tree--brand .tree-node.on{background:var(--primary-active);color:var(--text-on-brand);font-weight:500;}
.note{color:var(--text-2);font-size:12px;margin-top:8px;}
`;

/* ---------- 全量组件默认态 markup（id 与 vendored shadcn 组件对齐） ---------- */
function section(idx, id, title, body, note) {
  return `
  <div class="sec" id="${id}">
    <div class="sec-head"><span class="idx">${String(idx).padStart(2, '0')}</span>${title}</div>
    <div class="sec-body">${body}${note ? `<div class="note">${note}</div>` : ''}</div>
  </div>`;
}

const SECTIONS = [
  ['button', '按钮 Button', `
      <div class="row">
        <button class="btn btn-primary">主按钮</button>
        <button class="btn btn-secondary">次按钮</button>
        <button class="btn btn-text">文字按钮</button>
        <button class="btn btn-lg btn-primary">大按钮 40</button>
        <button class="btn btn-sm btn-secondary">小按钮 24</button>
        <button class="btn btn-primary" disabled>禁用</button>
      </div>`, '圆角8 · 字重400 · 高 32/40/24'],
  ['input', '单行输入 Input', `
      <div class="row">
        <input class="input" placeholder="请输入设备编号">
        <input class="input" value="注塑机 A-01">
        <input class="input" value="禁用态" disabled>
      </div>`, '高32 · 半径4 · N5底 N6边'],
  ['textarea', '多行输入 Textarea', `
      <div class="row" style="width:360px;">
        <textarea class="textarea">注塑机 A-01 于 14:20 切换至自动模式，工艺参数：保压 8s / 模温 65℃。</textarea>
      </div>`, '最小高80 · N5底 N6边 · 聚焦 primary'],
  ['label', '标签 Label', `
      <div class="row">
        <label class="label label-req">设备名称</label>
        <label class="label">运行状态</label>
        <label class="label">负责人</label>
      </div>`, '字14/22 · 字重500 · 必填红色星号'],
  ['dropdown', '下拉选择 Select / Dropdown', `
      <div class="row">
        <div class="sel">
          <div class="sel-trigger">全部状态 <span style="color:var(--n9)">▾</span></div>
          <div class="sel-panel">
            <div class="sel-opt on">全部状态</div>
            <div class="sel-opt">运行中</div>
            <div class="sel-opt">故障</div>
          </div>
        </div>
        <div class="sel open" style="min-width:160px;margin-right:120px;">
          <div class="sel-trigger">运行中 <span style="color:var(--n9)">▾</span></div>
          <div class="sel-panel" style="position:static;margin-top:4px;">
            <div class="sel-opt">全部状态</div>
            <div class="sel-opt on">运行中</div>
            <div class="sel-opt">故障</div>
            <div class="sel-opt">离线</div>
          </div>
        </div>
      </div>`, '触发器同输入 · 浮层 elevation overlay（r8 双层投影）'],
  ['checkbox', '复选框 Checkbox', `
      <div class="row">
        <label class="checkbox-wrap"><input type="checkbox" class="checkbox" checked> 启用自动巡检</label>
        <label class="checkbox-wrap"><input type="checkbox" class="checkbox"> 异常告警推送</label>
        <label class="checkbox-wrap"><input type="checkbox" class="checkbox" disabled> 已锁定</label>
      </div>`, '16×16 · 选中 primary 实底 + 白勾'],
  ['radio', '单选 Radio', `
      <div class="radio-group">
        <label class="checkbox-wrap"><input type="radio" name="mode" class="radio" checked> 自动模式</label>
        <label class="checkbox-wrap"><input type="radio" name="mode" class="radio"> 手动模式</label>
      </div>`, '16 圆点 · 选中 primary 内点'],
  ['switch', '开关 Switch', `
      <div class="row">
        <span class="switch" data-on="true"><span class="switch-thumb"></span></span>
        <span class="switch"><span class="switch-thumb"></span></span>
      </div>`, '36×20 轨 · 选中 primary · 白钮平移'],
  ['slider', '滑块 Slider', `
      <div class="row" style="width:320px;">
        <input type="range" class="slider" min="0" max="100" value="72">
      </div>`, 'N5 轨 · primary 钮 · 高度8'],
  ['toggle', '切换 Toggle', `
      <div class="row">
        <button class="toggle" data-on="true">已订阅</button>
        <button class="toggle">未订阅</button>
      </div>`, '字14 · 选中 primary 实底白字'],
  ['datepicker', '日期选择 DatePicker', `
      <div class="row">
        <div class="dp"><div class="dp-trigger">2026-07-30 <span style="color:var(--n9)">📅</span></div></div>
        <div class="dp"><div class="dp-trigger"><span style="color:var(--n8)">选择日期</span> <span style="color:var(--n9)">📅</span></div></div>
      </div>`, '触发器同输入（h32 r4）'],
  ['tree', '树菜单 Tree', `
      <div class="side-sim">
        <div class="tree">
          <div class="tree-node"><span class="tree-sw">▾</span><span class="tree-label">注塑车间</span></div>
          <div class="tree-node on" style="padding-left:28px"><span class="tree-sw"></span><span class="tree-label">A 线 · 注塑机 A-01</span></div>
          <div class="tree-node" style="padding-left:28px"><span class="tree-sw"></span><span class="tree-label">B 线 · 机械手 C-07</span></div>
          <div class="tree-node"><span class="tree-sw">▸</span><span class="tree-label">装配车间</span></div>
        </div>
      </div>`, '节点高32 · 主色底侧栏白字场景（side-sim 模拟侧栏）'],
  ['card', '卡片 Card', `
      <div class="card" style="width:320px;">
        <div class="card-head"><span class="card-title">设备概览</span></div>
        <div class="card-body">注塑机 A-01 · 运行中 · 负载 72% · 温度 64℃</div>
      </div>`, 'r8 · 头40 · elevation raised 浮层'],
  ['badge', '徽章 Badge', `
      <div class="row">
        <span class="badge badge-suc">成功</span>
        <span class="badge badge-warn">警告</span>
        <span class="badge badge-err">错误</span>
        <span class="badge badge-run">运行</span>
        <span class="badge badge-outline">描边</span>
        <span class="badge badge-muted">静默</span>
      </div>`, '高22 · 半径4 · 字12 · soft 浅底'],
  ['avatar', '头像 Avatar', `
      <div class="row">
        <span class="avatar">张</span>
        <span class="avatar avatar-sm">李</span>
        <span class="avatar avatar-lg">王</span>
        <span class="avatar"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E" alt=""></span>
      </div>`, '32/24/40 圆 · N5底 N10字'],
  ['table', '表格 Table', `
      <div class="table-wrap">
      <table class="table">
        <thead><tr><th>设备</th><th>状态</th><th>负载</th><th>最近告警</th><th>操作</th></tr></thead>
        <tbody>
          <tr><td>注塑机 A-01</td><td><span class="status-dot"><i class="dot-run"></i>运行中</span></td><td>72%</td><td><span class="tag tag-def">无</span></td><td><button class="btn btn-sm btn-secondary">详情</button></td></tr>
          <tr><td>机械手 C-07</td><td><span class="status-dot"><i class="dot-ok"></i>正常</span></td><td>41%</td><td><span class="tag tag-warn">温度过高</span></td><td><button class="btn btn-sm btn-secondary">详情</button></td></tr>
          <tr><td>输送带 D-02</td><td><span class="status-dot"><i class="dot-err"></i>故障</span></td><td>—</td><td><span class="tag tag-err">堵转</span></td><td><button class="btn btn-sm btn-secondary">详情</button></td></tr>
        </tbody>
      </table>
      </div>`, '表头 h44 w500 N2底 · 行高走密度变量（默认44）'],
  ['tabs', '页签 Tabs', `
      <div class="tabs">
        <div class="tab">概览</div>
        <div class="tab active">实时监控</div>
        <div class="tab">历史</div>
      </div>`, '高32 · 字13 · 激活 primary + 2px 下划线 + 字重500'],
  ['tag', '标签 Tag', `
      <div class="row">
        <span class="tag tag-suc">成功</span>
        <span class="tag tag-warn">警告</span>
        <span class="tag tag-err">错误</span>
        <span class="tag tag-run">运行</span>
        <span class="tag tag-def">默认</span>
      </div>`, '高22 · 半径4 · 字重400 · soft 浅底'],
  ['pager', '分页器 Pagination', `
      <div class="pager">
        <span class="pg">‹</span>
        <span class="pg active">1</span>
        <span class="pg">2</span>
        <span class="pg">3</span>
        <span class="pg">›</span>
        <span class="pg-tot">共 27 条</span>
      </div>`, '24×24 圆钮 · 半径999 · 字12 · 激活 primary 实底'],
  ['status-dot', '状态指示灯 / 状态点', `
      <div class="row">
        <span class="status-dot"><i class="dot-run"></i>运行中</span>
        <span class="status-dot"><i class="dot-ok"></i>正常</span>
        <span class="status-dot"><i class="dot-warn"></i>维护</span>
        <span class="status-dot"><i class="dot-err"></i>故障</span>
        <span class="status-dot"><i class="dot-off"></i>离线</span>
      </div>`, '直径10 · 运行绿 --run(#16A34A) 独立于成功绿'],
  ['progress', '进度条 Progress', `
      <div class="row" style="width:320px;">
        <div class="progress"><div class="progress-bar" style="width:72%"></div></div>
      </div>`, '高8 圆轨 N5 · primary 填充'],
  ['skeleton', '骨架屏 Skeleton', `
      <div class="row" style="width:320px;flex-direction:column;align-items:stretch;gap:8px;">
        <div class="skeleton"></div>
        <div class="skeleton" style="width:60%"></div>
        <div class="skeleton" style="width:80%"></div>
      </div>`, 'N5 占位 · 可选 pulse 微动效'],
  ['separator', '分割线 Separator', `
      <div class="row" style="width:320px;flex-direction:column;align-items:stretch;">
        <span class="label">分组 A · 基础参数</span>
        <hr class="separator">
        <span class="label">分组 B · 告警规则</span>
      </div>`, '1px N6 分隔 · 纵向变体 .separator-v'],
  ['accordion', '手风琴 Accordion', `
      <div class="accordion" style="width:320px;">
        <div class="accordion-item"><button class="accordion-trigger">基本参数 <span>▾</span></button><div class="accordion-content">注塑压力 / 保压时间 / 模具温度</div></div>
        <div class="accordion-item"><button class="accordion-trigger">告警规则 <span>▾</span></button><div class="accordion-content">温度 &gt; 80℃ 触发高温告警</div></div>
      </div>`, '项间 N6 分隔 · 触发高44'],
  ['alert', '警告提示 Alert', `
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div class="alert alert-suc"><span class="alert-icon">✓</span><div><div class="alert-title">下发成功</div><div class="alert-desc">参数已同步至现场控制器</div></div></div>
        <div class="alert alert-warn"><span class="alert-icon">!</span><div><div class="alert-title">温度过高</div><div class="alert-desc">注塑机 A-01 当前 82℃</div></div></div>
        <div class="alert alert-err"><span class="alert-icon">✕</span><div><div class="alert-title">通讯中断</div><div class="alert-desc">与机械手 C-07 失联</div></div></div>
        <div class="alert alert-info"><span class="alert-icon">i</span><div><div class="alert-title">例行维护</div><div class="alert-desc">计划于今晚 22:00 执行</div></div></div>
      </div>`, '4 态：成功/警告/错误/信息 · soft 浅底'],
  ['modal', '弹窗 Modal / Dialog', `
      <div class="modal-mask show modal-inline">
        <div class="modal">
          <div class="modal-head">设备参数确认</div>
          <div class="modal-body">确认将「注塑机 A-01」切换至自动模式？此操作将下发至现场控制器，执行后不可撤销。</div>
          <div class="modal-foot">
            <button class="btn btn-secondary">取消</button>
            <button class="btn btn-primary">确认下发</button>
          </div>
        </div>
      </div>`, '382×257 · 圆角8 · 头40 · elevation overlay（内联展示态）'],
  ['alert-dialog', '确认弹窗 AlertDialog', `
      <div class="alert-dialog-mask" style="position:static;background:rgba(0,0,0,0);">
        <div class="alert-dialog">
          <div class="alert-dialog-head">删除确认</div>
          <div class="alert-dialog-body">确认删除「注塑机 A-01」设备档案？此操作不可撤销。</div>
          <div class="alert-dialog-foot"><button class="btn btn-secondary">取消</button><button class="btn btn-primary">删除</button></div>
        </div>
      </div>`, '宽400 · 头16 · 脚右对齐 · elevation modal'],
  ['sheet', '抽屉 Sheet / Drawer', `
      <div class="sheet sheet-right" style="position:static;height:auto;min-height:200px;box-shadow:none;">
        <div class="sheet-head">设备详情</div>
        <div class="card-body">注塑机 A-01 · 运行中 · 负载 72%<br>负责人：张工</div>
      </div>`, '右/左/上/下四向 · elevation modal · 宽320'],
  ['dropdown-menu', '下拉菜单 DropdownMenu', `
      <div class="row">
        <div class="dropdown">
          <div class="sel-trigger">操作 ▾</div>
          <div class="dropdown-content" style="position:static;margin-top:4px;">
            <div class="dropdown-item">查看详情</div>
            <div class="dropdown-item">编辑参数</div>
            <div class="dropdown-sep"></div>
            <div class="dropdown-item danger">删除</div>
          </div>
        </div>
      </div>`, '浮层 N1底 · elevation overlay · 危险项红字'],
  ['popover', '气泡卡片 Popover', `
      <div class="row">
        <div class="popover">
          <div class="sel-trigger">触发气泡 ▾</div>
          <div class="popover-content" style="position:static;margin-top:4px;">这是一段上下文说明文字，可用于解释字段含义。</div>
        </div>
      </div>`, '浮层 N1底 · elevation overlay · 宽240'],
  ['tooltip', '文字提示 Tooltip', `
      <div class="row">
        <span class="tooltip">悬停查看<span class="tooltip-content">设备编号：A-01 · 产线：A</span></span>
      </div>`, '悬停显 N11底白字气泡'],
  ['breadcrumb', '面包屑 Breadcrumb', `
      <div class="row">
        <div class="breadcrumb">
          <span class="breadcrumb-item">生产管理</span><span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-item">设备</span><span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-item" aria-current="page">注塑机 A-01</span>
        </div>
      </div>`, 'N9 链 · 当前项 N11'],
  ['spinner', '加载指示 Spinner', `
      <div class="row">
        <span class="spinner"></span>
        <span style="color:var(--text-2)">加载中…</span>
      </div>`, '20×20 · N6 轨 + primary 顶 · spin 动效'],
];

function buildPage({ title, subtitle, brand, dark }) {
  const globals = stripCssComments(buildCss(brand ? { brand } : {}));
  // --text-on-brand 语义变量来自 framework.css 真源（亮 --n1 / 暗 --n11），sample 自包含页须自携
  const brandSurfaceVars = `:root{--text-on-brand:var(--n1);}\n:root[data-theme="dark"]{--text-on-brand:var(--n11);}\n`;
  const globalsBlock = globals + '\n' + brandSurfaceVars;
  const sections = SECTIONS.map(([id, t, body, note], i) => section(i + 1, id, t, body, note)).join('\n');
  const themeAttr = dark ? ' data-theme="dark"' : '';
  return `<!DOCTYPE html>
<html lang="zh-CN"${themeAttr}>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<!--
  由 packages/web-ui/scripts/export-static.js 自动生成 — 请勿手改。
  真源: 弘讯web端design-system/tokens.json → map-tokens.js → CSS 变量。
  暗色: <html data-theme="dark"> + :root[data-theme="dark"]（换色引擎 generatePalette 驱动，弃 shadcn 原生 .dark 类）
  验收: node packages/web-ui/scripts/validate-static.js → 四门禁（含暗色块=引擎逐键比对）。
-->
<style>
${globalsBlock}
${COMPONENTS_CSS}
${PAGE_CSS}
</style>
</head>
<body>
  <div class="page-head">
    <div class="t-h3">${title}</div>
    <div class="sub">${subtitle}</div>
  </div>
${sections}
  <div class="sec" id="typography">
    <div class="sec-head"><span class="idx">${String(SECTIONS.length + 1).padStart(2, '0')}</span>字阶参考（12 级，非组件）</div>
    <div class="sec-body">
      <div class="t-display">display 32/40</div>
      <div class="t-h1">h1 28/36</div>
      <div class="t-h2">h2 24/32</div>
      <div class="t-h3">h3 20/28</div>
      <div class="t-h4">h4 18/26</div>
      <div class="t-h5">h5 16/24</div>
      <div class="t-body1">body1 14/22 正文</div>
      <div class="t-body2">body2 13/20 辅助说明</div>
      <div class="t-caption">caption 12/16 标注</div>
      <div class="t-label">label 12/16 标签</div>
      <div class="t-overline">overline 11/16</div>
      <div class="t-link">link 14/22 超链接</div>
      <div class="t-mono t-body2">mono 0123456789 JetBrains Mono</div>
    </div>
  </div>
</body>
</html>
`;
}

const PAGES = [
  {
    file: 'sample-default-light.html',
    title: '弘讯B端 Web 组件库 · 默认亮色样例',
    subtitle: '品牌 #005EAE · 全量 vendored shadcn（packages/web-ui）· 与 components.json 解耦',
    brand: null,
    dark: false
  },
  {
    file: 'sample-brand-2E7D5B.html',
    title: '弘讯B端 Web 组件库 · 品牌换肤样例（#2E7D5B）',
    subtitle: '非默认品牌 · primary 系 = brand-color-engine 亮色推导 · 中性/功能色不随品牌变',
    brand: '#2E7D5B',
    dark: false
  },
  {
    file: 'sample-dark.html',
    title: '弘讯B端 Web 组件库 · 暗色样例',
    subtitle: '品牌 #005EAE · <html data-theme="dark"> 切换 · :root[data-theme="dark"] 值 = 换色引擎 generatePalette 输出',
    brand: null,
    dark: true
  }
];

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const p of PAGES) {
    const html = buildPage(p);
    fs.writeFileSync(path.join(OUT_DIR, p.file), html);
    console.log(`✅ ${p.file}（${(html.length / 1024).toFixed(1)} KB · ${SECTIONS.length} 组件默认态）`);
  }
  console.log(`\n📦 3 样例页已导出 → ${OUT_DIR}`);
  console.log('   下一步验收: node packages/web-ui/scripts/validate-static.js');
}

if (require.main === module) main();
module.exports = { buildPage, PAGES, SECTIONS };
