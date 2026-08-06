#!/usr/bin/env node
'use strict';
/**
 * 机器群览（Fleet Overview）应用页生成器 —— 验证 brand-color-engine。
 *
 * 读取设计规范布局规则（Web 布局黄金法则 G1–G7），用 generatePalette 的调色板
 * 渲染一个「橡塑机械行业后台控制系统 · 机器群览」应用页。
 *
 * 用法：
 *   node examples/build-fleet.js [brand] [mode] [platform]
 *   node examples/build-fleet.js 00D4A1 dark web
 */

const fs = require('fs');
const path = require('path');
const { generatePalette } = require('../generate.js');

const BRAND = process.argv[2] || '00D4A1';
const MODE = process.argv[3] || 'dark';
const PLATFORM = process.argv[4] || 'web';

const pal = generatePalette(BRAND, { mode: MODE, platform: PLATFORM });
const css = Object.entries(pal.css).map(([k, v]) => `  ${k}: ${v};`).join('\n');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// 功能色取暗色固定集（来自引擎，绝不用移动端 #10B981）
const C = {
  running: pal.functional.running.default,
  error: pal.functional.error.default,
  warning: pal.functional.warning.default,
  success: pal.functional.success.default,
  runningBg: pal.functional.running.bg,
  errorBg: pal.functional.error.bg,
  warningBg: pal.functional.warning.bg,
};

const tag = (kind, label) => {
  const map = { running: C.running, error: C.error, warning: C.warning, success: C.success, neutral: 'var(--color-text-tertiary)' };
  const bgmap = { running: C.runningBg, error: C.errorBg, warning: C.warningBg, success: 'var(--color-success-bg)', neutral: 'transparent' };
  const dot = kind === 'neutral' ? '' : `<i class="dot" style="background:${map[kind]}"></i>`;
  return `<span class="tag" style="color:${map[kind]};background:${bgmap[kind]||'transparent'};border:1px solid ${map[kind]}33">${dot}${esc(label)}</span>`;
};

// 机组卡片数据
const groups = [
  { name: '注塑机组 A', total: 32, running: 28, fault: 1, maint: 2, off: 1 },
  { name: '注塑机组 B', total: 28, running: 25, fault: 0, maint: 1, off: 2 },
  { name: '挤出机组', total: 18, running: 16, fault: 2, maint: 0, off: 0 },
  { name: '辅机群（供料/温控）', total: 36, running: 31, fault: 1, maint: 3, off: 1 },
  { name: '机械手群组', total: 14, running: 13, fault: 0, maint: 1, off: 0 },
];
const groupCard = (g) => {
  const total = g.total;
  const seg = (n, c) => n ? `<span style="flex:${n};background:${c}"></span>` : '';
  return `<div class="card group-card">
    <div class="group-head"><span class="group-name">${esc(g.name)}</span>${tag(g.fault ? 'error' : 'running', g.fault ? `${g.fault} 故障` : '正常')}</div>
    <div class="group-total">${total} <span class="unit">台</span></div>
    <div class="group-bar">
      ${seg(g.running, C.running)}
      ${seg(g.fault, C.error)}
      ${seg(g.maint, C.warning)}
      ${seg(g.off, 'var(--color-text-tertiary)')}
    </div>
    <div class="group-legend">
      <span><i class="dot" style="background:${C.running}"></i>运行 ${g.running}</span>
      <span><i class="dot" style="background:${C.error}"></i>故障 ${g.fault}</span>
      <span><i class="dot" style="background:${C.warning}"></i>维护 ${g.maint}</span>
      <span><i class="dot" style="background:var(--color-text-tertiary)"></i>离线 ${g.off}</span>
    </div>
  </div>`;
};

// 生产趋势柱状（12 时段），用图表色循环
const trend = Array.from({ length: 12 }, (_, i) => 45 + ((i * 53) % 110));
const bars = trend.map((h, i) => `<div class="bar" style="height:${h}px;background:${pal.chart[i % pal.chart.length].hex}" title="${i}:00"></div>`).join('');

// 设备列表
const rows = [
  ['INJ-A01', '注塑机 HT-650', 'running', 78, 232, 18.4],
  ['INJ-A02', '注塑机 HT-650', 'running', 71, 228, 18.9],
  ['INJ-A07', '注塑机 HT-850', 'error', 0, 96, 0],
  ['EXT-B03', '挤出机 SJ-120', 'running', 64, 210, 24.1],
  ['AUX-C11', '模温机 MC-09', 'warning', 52, 188, 12.0],
  ['ROB-D02', '机械手 R-20', 'running', 88, 41, 5.6],
  ['INJ-B09', '注塑机 HT-650', 'offline', 0, 26, 0],
];
const kindOf = { running: 'running', error: 'error', warning: 'warning', offline: 'neutral' };
const labelOf = { running: '运行中', error: '故障', warning: '维护中', offline: '离线' };
const trs = rows.map((r) => `<tr>
  <td class="mono">${r[0]}</td>
  <td>${r[1]}</td>
  <td>${tag(kindOf[r[2]], labelOf[r[2]])}</td>
  <td><div class="load"><div class="load-bar" style="width:${r[3]}%;background:${r[3] > 85 ? C.error : C.running}"></div></div><span class="mono load-num">${r[3]}%</span></td>
  <td class="mono">${r[4]}°C</td>
  <td class="mono">${r[5]}</td>
  <td><a class="link">查看</a></td>
</tr>`).join('');

const html = `<!DOCTYPE html>
<html lang="zh-CN" data-theme="${pal.mode}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>机器群览 · ${pal.brand} · ${pal.mode}</title>
<style>
  :root{
${css}
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
         background: var(--color-bg-page); color: var(--color-text-primary);
         -webkit-font-smoothing: antialiased; font-size: 14px; }

  /* 布局骨架：G1 顶栏72/侧栏240/底栏32，内容 FLEX */
  .topbar { height:72px; background: var(--color-brand-surface); color: var(--color-brand-surface-fg);
            display:flex; align-items:center; padding:0 24px; gap:24px; position:sticky; top:0; z-index:10; }
  .topbar .brand { font-weight:700; font-size:16px; letter-spacing:.5px; }
  .topbar .pagetitle { font-size:18px; font-weight:600; }
  .topbar .spacer { flex:1; }
  .topbar .search { background: rgba(255,255,255,.14); border:none; color:#fff; border-radius:16px;
                    padding:8px 16px; width:220px; font-size:13px; outline:none; }
  .topbar .search::placeholder { color: rgba(255,255,255,.7); }
  .topbar .avatar { width:34px; height:34px; border-radius:50%; background: rgba(255,255,255,.2);
                    display:flex; align-items:center; justify-content:center; font-size:13px; }

  .body { display:flex; min-height: calc(100vh - 104px); }
  .sidebar { width:240px; flex-shrink:0; background: var(--color-brand-surface); color: var(--color-brand-surface-fg);
             padding:20px 12px; }                       /* G2 菜单白字 */
  .sidebar .s-logo { font-weight:700; padding:8px 12px 20px; }
  .nav-item { display:block; padding:11px 12px; border-radius:6px; color: rgba(255,255,255,.82);
              text-decoration:none; margin-bottom:4px; font-size:14px; }
  .nav-item:hover { background: rgba(255,255,255,.14); color:#fff; }
  .nav-item.active { background: rgba(255,255,255,.20); color:#fff; font-weight:600; }

  .main { flex:1; display:flex; flex-direction:column; min-width:0; }
  .content { padding:24px; flex:1; }
  .crumb { font-size:12px; color: var(--color-text-tertiary); margin-bottom:8px; }
  .page-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
  .page-head h1 { font-size:22px; font-weight:600; }
  .page-head .acts { display:flex; gap:12px; }
  .btn { font:inherit; border:none; border-radius:6px; padding:8px 16px; cursor:pointer; font-size:13px; }
  .btn-primary { background: var(--color-primary); color: var(--color-brand-surface-fg); }
  .btn-ghost { background: transparent; color: var(--color-text-secondary); border:1px solid var(--color-border); }

  .tabs { display:flex; gap:4px; height:32px; margin-bottom:20px; }   /* G6 Tab=32 */
  .tab { height:32px; padding:0 16px; display:flex; align-items:center; font-size:13px;
         color: var(--color-text-secondary); cursor:pointer; border-bottom:2px solid transparent; }
  .tab.active { color: var(--color-primary); border-bottom-color: var(--color-primary); font-weight:600; }

  .kpis { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:16px; }  /* G4 栅格 gap16 */
  .kpi { background: var(--color-bg-surface); border:1px solid var(--color-border); border-radius:8px;
         padding:16px; position:relative; overflow:hidden; }
  .kpi .accent { position:absolute; left:0; top:0; bottom:0; width:4px; }
  .kpi .label { font-size:12px; color: var(--color-text-tertiary); }
  .kpi .value { font-size:26px; font-weight:700; margin:6px 0 2px; }
  .kpi .sub { font-size:12px; color: var(--color-text-secondary); }

  .card { background: var(--color-bg-surface); border:1px solid var(--color-border); border-radius:8px;
          padding:16px; margin-bottom:16px; }
  .card-head { font-weight:600; font-size:14px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center; }
  .card-head .more { font-size:12px; color: var(--color-primary); cursor:pointer; }

  .groups { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
  .group-card { margin-bottom:0; }
  .group-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
  .group-name { font-weight:600; font-size:14px; }
  .group-total { font-size:28px; font-weight:700; }
  .group-total .unit { font-size:13px; font-weight:400; color: var(--color-text-tertiary); margin-left:4px; }
  .group-bar { display:flex; height:10px; border-radius:5px; overflow:hidden; margin:12px 0 10px; background: var(--color-border); }
  .group-bar span { display:block; }
  .group-legend { display:flex; flex-wrap:wrap; gap:12px; font-size:12px; color: var(--color-text-secondary); }
  .group-legend .dot, .tag .dot { width:8px; height:8px; border-radius:50%; display:inline-block; margin-right:4px; }

  .grid-2 { display:grid; grid-template-columns:1.4fr 1fr; gap:16px; }
  .chart { display:flex; align-items:flex-end; gap:10px; height:170px; padding-top:8px; }
  .bar { flex:1; border-radius:6px 6px 0 0; min-height:4px; }

  .dist-row { display:flex; align-items:center; gap:10px; margin-bottom:14px; font-size:13px; }
  .dist-row .name { width:84px; color: var(--color-text-secondary); }
  .dist-track { flex:1; height:10px; border-radius:5px; background: var(--color-border); overflow:hidden; }
  .dist-fill { height:100%; border-radius:5px; }
  .dist-row .pct { width:42px; text-align:right; color: var(--color-text-primary); }

  .tbl { width:100%; border-collapse:collapse; font-size:13px; }
  .tbl th, .tbl td { text-align:left; padding:0 12px; height:44px; border-bottom:1px solid var(--color-border); }  /* G6 行高44 */
  .tbl th { color: var(--color-text-tertiary); font-weight:600; font-size:12px; background: var(--color-bg-page); }
  .tbl tbody tr:hover { background: var(--color-bg-page); }
  .mono { font-family: "Roboto Mono", monospace; font-size:12px; }
  .tag { display:inline-flex; align-items:center; padding:3px 10px; border-radius:4px; font-size:12px; font-weight:600; }
  .load { display:inline-block; width:90px; height:6px; border-radius:3px; background: var(--color-border); overflow:hidden; vertical-align:middle; margin-right:8px; }
  .load-bar { height:100%; border-radius:3px; }
  .load-num { color: var(--color-text-secondary); }
  .link { color: var(--color-primary); cursor:pointer; text-decoration:none; }

  .footer { height:32px; background: var(--color-brand-surface); color: var(--color-brand-surface-fg);
            display:flex; align-items:center; justify-content:space-between; padding:0 24px; font-size:12px;
            opacity:.92; }
  .footer .ok { display:inline-flex; align-items:center; gap:6px; }
  .footer .ok i { width:7px; height:7px; border-radius:50%; background: var(--color-running); display:inline-block; }
</style>
</head>
<body>
  <header class="topbar">
    <div class="brand">弘讯 TECHMATION</div>
    <div class="pagetitle">机器群览</div>
    <div class="spacer"></div>
    <input class="search" placeholder="搜索设备 / 机组 ...">
    <div class="avatar">A</div>
  </header>

  <div class="body">
    <aside class="sidebar">
      <div class="s-logo">设备中心</div>
      <a class="nav-item">仪表盘</a>
      <a class="nav-item active">机器群览</a>
      <a class="nav-item">生产监控</a>
      <a class="nav-item">告警中心</a>
      <a class="nav-item">工艺配方</a>
      <a class="nav-item">系统设置</a>
    </aside>

    <div class="main">
      <div class="content">
        <div class="crumb">首页 / 设备中心 / 机器群览</div>
        <div class="page-head">
          <h1>机器群览</h1>
          <div class="acts">
            <button class="btn btn-ghost">导出报表</button>
            <button class="btn btn-primary">刷新状态</button>
          </div>
        </div>

        <div class="tabs">
          <div class="tab active">总览</div>
          <div class="tab">注塑机组</div>
          <div class="tab">挤出机组</div>
          <div class="tab">辅机群</div>
        </div>

        <div class="kpis">
          <div class="kpi"><div class="accent" style="background:var(--color-primary)"></div>
            <div class="label">设备总数</div><div class="value">128</div><div class="sub">在线 116 · 离线 12</div></div>
          <div class="kpi"><div class="accent" style="background:${C.running}"></div>
            <div class="label">运行中</div><div class="value">96</div><div class="sub" style="color:${C.running}">78.1% 开机率</div></div>
          <div class="kpi"><div class="accent" style="background:${C.error}"></div>
            <div class="label">故障告警</div><div class="value">5</div><div class="sub" style="color:${C.error}">需立即处理</div></div>
          <div class="kpi"><div class="accent" style="background:${C.warning}"></div>
            <div class="label">平均负载</div><div class="value">72%</div><div class="sub">较昨日 +3.2%</div></div>
        </div>

        <div class="card">
          <div class="card-head">机群状态概览 <span class="more">全部机组 →</span></div>
          <div class="groups">
            ${groups.map(groupCard).join('')}
          </div>
        </div>

        <div class="grid-2">
          <div class="card">
            <div class="card-head">产线负载趋势（近 12 时段）</div>
            <div class="chart">${bars}</div>
          </div>
          <div class="card">
            <div class="card-head">设备状态分布</div>
            ${[
              ['运行中', 75, C.running],
              ['维护中', 12, C.warning],
              ['故障', 5, C.error],
              ['离线', 8, 'var(--color-text-tertiary)'],
            ].map(([n, p, c]) => `<div class="dist-row">
              <span class="name">${n}</span>
              <span class="dist-track"><span class="dist-fill" style="width:${p}%;background:${c}"></span></span>
              <span class="pct">${p}%</span>
            </div>`).join('')}
          </div>
        </div>

        <div class="card">
          <div class="card-head">设备列表 <span class="more">共 128 台 · 查看全部 →</span></div>
          <table class="tbl">
            <thead><tr><th>设备编号</th><th>机型</th><th>状态</th><th>实时负载</th><th>料筒温度</th><th>节拍(s)</th><th>操作</th></tr></thead>
            <tbody>${trs}</tbody>
          </table>
        </div>
      </div>

      <footer class="footer">
        <span>© 2026 · 橡塑机械行业后台控制系统</span>
        <span class="ok"><i></i> 实时数据同步正常 · 品牌色 ${pal.brand}</span>
      </footer>
    </div>
  </div>
</body>
</html>`;

const out = path.join(__dirname, `fleet-${BRAND.replace('#', '')}-${MODE}-${PLATFORM}.html`);
fs.writeFileSync(out, html, 'utf8');
process.stdout.write(`已生成机器群览页: ${out}\n`);
