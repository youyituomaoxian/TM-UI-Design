#!/usr/bin/env node
'use strict';
/**
 * brand-color-engine / build-app.js
 *
 * 把 generatePalette() 的输出渲染成一份「应用页 HTML 原型」。
 * 这是引擎的落地形态：Agent 生成的是应用页，不是可视化规范展示页。
 *
 * 用法：
 *   node build-app.js <brand> [mode] [platform] [outPath]
 *   node build-app.js 2E7D5B dark web examples/dark-app-2E7D5B.html
 */

const fs = require('fs');
const path = require('path');
const { generatePalette } = require('./generate.js');

/** 文本节点转义（& < >）。不足以用于属性值 —— 属性请用 escAttr。 */
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * 属性值转义（R-11 修复）。
 * 原代码只有 esc()，却被用在 `title="${esc(c.name)}"` 这类双引号属性里：
 * 值中一个 `"` 就能闭合属性并注入 `onerror=...`。这里补齐引号与反引号转义。
 */
function escAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#96;');
}

// 允许出现在 CSS 值位置的形态：十六进制色 / rgb(a) / linear-gradient(…) / 纯数字长度
const SAFE_CSS_VALUE = /^(#[0-9A-Fa-f]{3,8}|rgba?\([\d\s.,%]+\)|linear-gradient\([-\w\s.,%()#]+\)|[\d.]+(px|rem|em|%)?)$/;

/**
 * 校验并输出 :root 变量块（R-11 修复）。
 * 原实现把 pal.css 的值裸拼进 <style>：任何含 `}` 或 `</style>` 的值都能越出
 * 声明块乃至闭合 style 标签。这里对每个值做形态白名单校验，不合规即中止。
 */
function cssVarsBlock(pal) {
  return Object.entries(pal.css)
    .map(([k, v]) => {
      if (!/^--[a-zA-Z0-9-]+$/.test(k)) {
        throw new Error(`[build-app] 非法 CSS 变量名：${JSON.stringify(k)}`);
      }
      if (!SAFE_CSS_VALUE.test(String(v))) {
        throw new Error(`[build-app] CSS 变量 ${k} 的值不在安全白名单内：${JSON.stringify(v)}`);
      }
      return `  ${k}: ${v};`;
    })
    .join('\n');
}

/** 内联 style 里使用的色值必须是纯十六进制，杜绝 `red;background:url(...)` 这类拼接。 */
function safeColor(hex) {
  if (!/^#[0-9A-Fa-f]{3,8}$/.test(String(hex))) {
    throw new Error(`[build-app] 非法色值：${JSON.stringify(hex)}`);
  }
  return hex;
}

function statusTag(kind, label) {
  // kind: success | warning | error | running
  return `<span class="tag tag-${kind}"><i class="dot dot-${kind}"></i>${esc(label)}</span>`;
}

function buildWeb(pal) {
  const chart = pal.chart;
  const bars = chart.map((c, i) => {
    const h = 40 + ((i * 37) % 120);
    return `<div class="bar" style="height:${h}px;background:${safeColor(c.hex)}" title="${escAttr(c.name)}"></div>`;
  }).join('');

  const kpis = chart.slice(0, 4).map((c, i) => `
    <div class="kpi">
      <div class="kpi-accent" style="background:${safeColor(c.hex)}"></div>
      <div class="kpi-label">指标 ${i + 1} · ${esc(c.name)}</div>
      <div class="kpi-value">${(1280 + i * 347).toLocaleString()}</div>
      <div class="kpi-trend ${i % 2 ? 'down' : 'up'}">${i % 2 ? '▼ 4.2%' : '▲ 12.8%'}</div>
    </div>`).join('');

  const rows = ['运行中', '故障', '维护中', '离线'].map((st, i) => {
    const kind = ['running', 'error', 'warning', 'neutral'][i];
    const label = ['运行中', '故障', '维护中', '离线'][i];
    return `<tr>
      <td>注塑机 #${1001 + i}</td>
      <td>车间 ${String.fromCharCode(65 + i)}</td>
      <td>${statusTag(kind, label)}</td>
      <td class="mono">${(82 - i * 11)}%</td>
    </tr>`;
  }).join('');

  return `
  <div class="web">
    <aside class="sidebar">
      <div class="logo">弘讯 TECHMATION</div>
      <nav>
        <a class="nav-item active">仪表盘</a>
        <a class="nav-item">设备群</a>
        <a class="nav-item">生产</a>
        <a class="nav-item">告警</a>
        <a class="nav-item">设置</a>
      </nav>
    </aside>
    <div class="main">
      <header class="topbar">
        <div class="topbar-title">生产仪表盘</div>
        <div class="topbar-actions">
          <button class="btn btn-ghost">导出</button>
          <button class="btn btn-primary">新建任务</button>
        </div>
      </header>
      <div class="content">
        <div class="kpi-row">${kpis}</div>
        <div class="grid-2">
          <div class="card">
            <div class="card-head">生产趋势（近 8 时段）</div>
            <div class="chart">${bars}</div>
          </div>
          <div class="card">
            <div class="card-head">设备状态</div>
            <table class="tbl">
              <thead><tr><th>设备</th><th>位置</th><th>状态</th><th>负载</th></tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>
        <div class="card">
          <div class="card-head">功能色示例（固定语义，不随品牌变）</div>
          <div class="btn-row">
            <button class="btn btn-success">${statusTag('success', '成功')}</button>
            <button class="btn btn-warning">${statusTag('warning', '警告')}</button>
            <button class="btn btn-error">${statusTag('error', '错误')}</button>
            <button class="btn btn-running">${statusTag('running', '运行中')}</button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function buildMobile(pal) {
  const hero = pal.gradient[0];
  const stat = pal.chart.slice(0, 4).map((c, i) => `
    <div class="m-stat">
      <div class="m-stat-val" style="color:${safeColor(c.hex)}">${(92 - i * 13)}%</div>
      <div class="m-stat-lbl">${esc(c.name)}</div>
    </div>`).join('');

  const list = ['运行中', '故障', '离线', '维护中'].map((st, i) => {
    const kind = ['running', 'error', 'neutral', 'warning'][i];
    return `<div class="m-list-item">
      <i class="dot dot-${kind}"></i>
      <div class="m-list-main"><div class="m-list-title">设备 #${2001 + i}</div><div class="m-list-sub">${esc(st)}</div></div>
      <div class="m-list-right mono">${['正常','需处理','失联','计划'][i]}</div>
    </div>`;
  }).join('');

  return `
  <div class="mobile">
    <header class="m-navbar" style="background:var(--gradient-1)">
      <div class="m-nav-title">设备中心</div>
    </header>
    <div class="m-content">
      <div class="m-hero">
        <div class="m-hero-title">今日生产概览</div>
        <div class="m-hero-sub">实时同步 · 共 24 台在线</div>
        <div class="m-stat-row">${stat}</div>
      </div>
      <div class="card">
        <div class="card-head">设备列表</div>
        ${list}
      </div>
    </div>
    <nav class="m-bottomnav">
      <a class="m-tab active"><i class="ico">⌂</i>首页</a>
      <a class="m-tab"><i class="ico">▦</i>设备</a>
      <a class="m-tab"><i class="ico">⚠</i>告警</a>
      <a class="m-tab"><i class="ico">⚙</i>我的</a>
    </nav>
    <button class="m-fab" style="background:var(--color-primary)">＋</button>
  </div>`;
}

function buildHtml(pal) {
  const p = pal.platform === 'mobile' ? buildMobile(pal) : buildWeb(pal);
  const title = `应用页原型 · ${pal.brand} · ${pal.mode} · ${pal.platform}`;
  return `<!DOCTYPE html>
<html lang="zh-CN" data-theme="${pal.mode}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<style>
  :root{
${cssVarsBlock(pal)}
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
    background: var(--color-bg-page);
    color: var(--color-text-primary);
    -webkit-font-smoothing: antialiased;
  }
  .card { background: var(--color-bg-surface); border:1px solid var(--color-border);
          border-radius: 8px; padding: 16px; margin-bottom: 16px; }
  .card-head { font-weight: 600; margin-bottom: 12px; color: var(--color-text-primary); font-size: 14px; }
  .btn { font: inherit; border: none; border-radius: 6px; padding: 8px 16px; cursor: pointer; font-size: 13px; }
  .btn-primary { background: var(--color-primary); color: var(--color-brand-surface-fg); }
  .btn-ghost { background: transparent; color: var(--color-brand-surface-fg); border:1px solid rgba(255,255,255,.4); }
  .btn-success { background: var(--color-success); color: var(--color-success-text); }
  .btn-warning { background: var(--color-warning); color: var(--color-warning-text); }
  .btn-error { background: var(--color-error); color: var(--color-error-text); }
  .btn-running { background: var(--color-running); color: var(--color-running-text); }
  .tag { display:inline-flex; align-items:center; gap:6px; padding:4px 10px; border-radius:4px; font-size:12px; font-weight:600; }
  .tag-success { background: var(--color-success-bg); color: var(--color-success); }
  .tag-warning { background: var(--color-warning-bg); color: var(--color-warning); }
  .tag-error { background: var(--color-error-bg); color: var(--color-error); }
  .tag-running { background: var(--color-running-bg); color: var(--color-running); }
  .dot { width:8px; height:8px; border-radius:50%; display:inline-block; }
  .dot-success, .dot-running { background: var(--color-success); }
  .dot-running { background: var(--color-running); }
  .dot-warning { background: var(--color-warning); }
  .dot-error { background: var(--color-error); }
  .dot-neutral { background: var(--color-text-tertiary); }
  .mono { font-family: "Roboto Mono", monospace; }

  /* ---- Web layout ---- */
  .web { display:flex; min-height:100vh; }
  .sidebar { width:240px; background: var(--color-brand-surface); color: var(--color-brand-surface-fg); padding:20px 12px; flex-shrink:0; }
  .logo { font-weight:700; font-size:16px; padding:8px 12px 20px; letter-spacing:.5px; }
  .nav-item { display:block; padding:10px 12px; border-radius:6px; color: rgba(255,255,255,.82); text-decoration:none; margin-bottom:4px; font-size:14px; }
  .nav-item.active, .nav-item:hover { background: rgba(255,255,255,.16); color:#fff; }
  .main { flex:1; display:flex; flex-direction:column; }
  .topbar { height:72px; background: var(--color-brand-surface); color: var(--color-brand-surface-fg);
            display:flex; align-items:center; justify-content:space-between; padding:0 24px; }
  .topbar-title { font-size:18px; font-weight:600; }
  .topbar-actions { display:flex; gap:12px; }
  .content { padding:24px; }
  .kpi-row { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:16px; }
  .kpi { background: var(--color-bg-surface); border:1px solid var(--color-border); border-radius:8px; padding:16px; position:relative; overflow:hidden; }
  .kpi-accent { position:absolute; left:0; top:0; bottom:0; width:4px; }
  .kpi-label { font-size:12px; color: var(--color-text-tertiary); }
  .kpi-value { font-size:24px; font-weight:700; margin:6px 0; }
  .kpi-trend { font-size:12px; }
  .kpi-trend.up { color: var(--color-running); }
  .kpi-trend.down { color: var(--color-error); }
  .grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .chart { display:flex; align-items:flex-end; gap:12px; height:160px; padding-top:8px; }
  .bar { flex:1; border-radius:6px 6px 0 0; min-height:4px; }
  .tbl { width:100%; border-collapse:collapse; font-size:13px; }
  .tbl th, .tbl td { text-align:left; padding:10px 8px; border-bottom:1px solid var(--color-border); }
  .tbl th { color: var(--color-text-tertiary); font-weight:600; }
  .btn-row { display:flex; gap:12px; flex-wrap:wrap; }

  /* ---- Mobile layout ---- */
  .mobile { max-width:420px; margin:0 auto; min-height:100vh; background: var(--color-bg-page); position:relative; padding-bottom:64px; }
  .m-navbar { padding:48px 16px 16px; color:#fff; }
  .m-nav-title { font-size:18px; font-weight:600; }
  .m-content { padding:16px; }
  .m-hero { background: var(--color-bg-surface); border:1px solid var(--color-border); border-radius:12px; padding:16px; margin-bottom:16px; }
  .m-hero-title { font-size:17px; font-weight:700; }
  .m-hero-sub { font-size:12px; color: var(--color-text-tertiary); margin:4px 0 12px; }
  .m-stat-row { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; }
  .m-stat { text-align:center; }
  .m-stat-val { font-size:18px; font-weight:700; }
  .m-stat-lbl { font-size:11px; color: var(--color-text-tertiary); margin-top:2px; }
  .m-list-item { display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid var(--color-border); }
  .m-list-main { flex:1; }
  .m-list-title { font-size:15px; font-weight:600; }
  .m-list-sub { font-size:12px; color: var(--color-text-tertiary); }
  .m-list-right { font-size:12px; color: var(--color-text-secondary); }
  .m-bottomnav { position:fixed; bottom:0; left:50%; transform:translateX(-50%); width:100%; max-width:420px;
                 height:56px; background: var(--color-bg-surface); border-top:1px solid var(--color-border);
                 display:flex; }
  .m-tab { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px;
           font-size:11px; color: var(--color-text-tertiary); text-decoration:none; }
  .m-tab.active { color: var(--color-primary); }
  .m-tab .ico { font-size:18px; font-style:normal; }
  .m-fab { position:fixed; bottom:72px; right:calc(50% - 210px + 16px); width:48px; height:48px; border-radius:50%;
            color:#fff; border:none; font-size:22px; box-shadow:0 4px 12px rgba(0,0,0,.3); cursor:pointer; }
</style>
</head>
<body>
${p}
</body>
</html>`;
}

// 写出根：仓库根目录。任何解析后落在此目录之外的输出路径一律拒绝。
const WRITE_ROOT = path.resolve(__dirname, '..');

/**
 * 校验命令行给出的输出路径（R-10 修复）。
 * 原实现把 argv[3] 直接交给 mkdirSync/writeFileSync：
 *   node build-app.js '#005EAE' light web ../../../../Users/x/.bashrc
 * 会在仓库外任意位置落盘并覆盖同名文件。这里强制三条约束：
 *   1) 解析后必须位于 WRITE_ROOT 之内（挡住 ../ 与绝对路径穿越）
 *   2) 扩展名必须是 .html（挡住覆盖 .js/.json/.sh 等可执行或配置文件）
 *   3) 不得指向已存在的目录
 */
function resolveOutPath(raw) {
  const abs = path.resolve(WRITE_ROOT, raw);
  const rel = path.relative(WRITE_ROOT, abs);
  if (rel === '' || rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error(
      `[build-app] 输出路径越界，拒绝写入：${raw}\n` +
      `  解析为 ${abs}\n  允许范围 ${WRITE_ROOT}`
    );
  }
  if (!/\.html?$/i.test(abs)) {
    throw new Error(`[build-app] 输出文件必须以 .html 结尾，拒绝写入：${raw}`);
  }
  if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) {
    throw new Error(`[build-app] 输出路径是一个已存在的目录：${abs}`);
  }
  return abs;
}

function main() {
  const args = process.argv.slice(2);
  const brand = args[0] || '#005EAE';
  const mode = args[1] || 'light';
  const platform = args[2] || 'web';

  // 先生成（generatePalette 会校验 brand 合法性），再用**校验后**的 pal.brand 拼默认文件名。
  // 原顺序是先用未校验的 argv[0] 拼路径，`../../x` 这类值会直接进入路径拼接。
  const pal = generatePalette(brand, { mode, platform });

  const out = resolveOutPath(
    args[3] || path.join('brand-color-engine', 'examples',
      `app-${pal.brand.replace('#', '')}-${pal.mode}-${pal.platform}.html`)
  );

  const html = buildHtml(pal);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html, 'utf8');
  process.stdout.write(`已生成: ${out}\n`);
  process.stdout.write(`  品牌=${pal.brand} 模式=${pal.mode} 平台=${pal.platform}\n`);
}

if (require.main === module) main();

module.exports = { buildHtml };
