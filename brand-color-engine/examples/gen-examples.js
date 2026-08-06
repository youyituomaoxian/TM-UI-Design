const fs = require('fs');
const base = 'H:/global-workspace/设计系统/设计系统_V2.1/';
const { generatePalette } = require(base + 'brand-color-engine/generate.js');
// ============================================================
// pages/examples/ 示例页生成器（2026-08-06 建立）
// 用途：重新生成两端 pages/examples/ 的 3+3 个示例页（default 亮 / dark 暗 / 任意品牌亮）。
// 原则：页面 link ../../template.css（唯一真源，视觉自动跟随最新规范），
//       仅页面布局自造类内联（间距走 token）；品牌页仅 :root 覆盖 primary 系（引擎派生）。
// 用法：node brand-color-engine/examples/gen-examples.js
// 重新生成后跑两端 validate-spec 确认 0 HIGH。
// ============================================================

// ========== Web 模板（link ../../template.css，跟随真源） ==========
function webPage({ brand, mode, title, coverNote }) {
  const darkAttr = mode === 'dark' ? ' data-theme="dark"' : '';
  const cover = coverNote || '';
  return `<!DOCTYPE html>
<!-- 由品牌引擎重新生成：brand=${brand} mode=${mode} platform=web · ${title}（2026-08-06 对齐当前规范：表头48/输入白底/表格列对齐/CHART-SPEC 图表） -->
<html lang="zh-CN"${darkAttr}>
<!--
  弘讯B端 页面示例 —— ${title} —— 视觉真理 N=1：link ../../template.css（唯一真源），本页零组件 CSS。
  2026-08-06 重新生成：表格表头 48px、输入/下拉/文本域 --n1 白底、数值列 th.num/td.num 右对齐、
  图表按 CHART-SPEC（chart-box + SVG 数据层 + HTML 标签层）、.pager 上下对称。${cover}
-->
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="../../template.css">
</head>
<body>
<div class="app">
  <header class="topbar">
    <div class="topbar-brand"><span class="topbar-logo"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:32px;height:32px;"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg></span>
      <div class="topbar-titles"><span class="topbar-title">弘讯科技</span><span class="topbar-subtitle">智能工厂管理系统</span></div></div>
    <div class="spacer"></div>
    <div class="topbar-right">
      <span class="topbar-item">首页</span><span class="topbar-sep"></span><span class="topbar-item">Admin</span>
      <span class="topbar-sep"></span><button class="topbar-item" title="全屏"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M16 21h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg></button>
    </div>
  </header>
  <div class="body">
    <aside class="sidebar">
      <div class="group-title">设备作业树</div>
      <div class="tree">
        <div class="tree-node"><span class="tree-sw">▾</span><span class="tree-ico"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 20h20V9l-6 4V9l-6 4V4H2z"/><path d="M6 20v-4M10 20v-4M14 20v-4M18 20v-4"/></svg></span><span class="tree-label">注塑车间</span></div>
        <div class="tree-node on tree-node--child"><span class="tree-sw"></span><span class="tree-ico"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/></svg></span><span class="tree-label">A 线 · 注塑机 A-01</span></div>
        <div class="tree-node tree-node--child"><span class="tree-sw"></span><span class="tree-ico"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="18" r="3"/><circle cx="18" cy="6" r="3"/><path d="M8.5 15.5 15.5 8.5"/></svg></span><span class="tree-label">B 线 · 机械手 C-07</span></div>
        <div class="tree-node"><span class="tree-sw">▾</span><span class="tree-ico"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 20h20V9l-6 4V9l-6 4V4H2z"/><path d="M6 20v-4M10 20v-4M14 20v-4M18 20v-4"/></svg></span><span class="tree-label">装配车间</span></div>
        <div class="tree-node tree-node--child"><span class="tree-sw"></span><span class="tree-ico"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="9" width="20" height="6" rx="3"/><circle cx="7" cy="12" r="1.5"/><circle cx="17" cy="12" r="1.5"/></svg></span><span class="tree-label">总装线 · 输送带 D-02</span></div>
      </div>
      <div class="sidebar-foot"><button class="collapse-btn" onclick="document.querySelector('.sidebar').classList.toggle('collapsed')" title="收起/展开侧栏" aria-label="收起侧栏"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg></button></div>
    </aside>
    <div class="main">
      <main class="content">
        <div class="row" style="justify-content:space-between">
          <h2 class="page-title">设备监控总览</h2>
          <div class="row"><button class="btn btn-primary">刷新</button><button class="btn btn-secondary">导出</button></div>
        </div>
        <div class="tabs mt"><div class="tab">概览</div><div class="tab active">实时监控</div><div class="tab">历史</div></div>
        <div class="stat-grid mt">
          <div class="card"><div class="card-body stat-card--icon">
            <span class="kpi-ico kpi-ico--lg kpi-ico--run"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span>
            <div class="stat-body"><div class="stat-label">在产设备</div><div class="stat-num">72</div><div class="stat-foot"><span>较昨日</span><span class="stat-delta stat-delta--up">+4.2%</span></div></div>
          </div></div>
          <div class="card"><div class="card-body stat-card--icon">
            <span class="kpi-ico kpi-ico--lg kpi-ico--primary"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>
            <div class="stat-body"><div class="stat-label">待机就绪</div><div class="stat-num">18</div><div class="stat-foot"><span>今日</span><span class="stat-delta stat-delta--up">+1.6%</span></div></div>
          </div></div>
          <div class="card"><div class="card-body stat-card--icon">
            <span class="kpi-ico kpi-ico--lg kpi-ico--warn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
            <div class="stat-body"><div class="stat-label">需关注</div><div class="stat-num">3</div><div class="stat-foot"><span>较昨日</span><span class="stat-delta stat-delta--down">−1 台</span></div></div>
          </div></div>
          <div class="card"><div class="card-body stat-card--icon">
            <span class="kpi-ico kpi-ico--lg kpi-ico--err"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span>
            <div class="stat-body"><div class="stat-label">已停机</div><div class="stat-num">1</div><div class="stat-foot"><span>需处理</span><span class="stat-delta stat-delta--down">紧急</span></div></div>
          </div></div>
        </div>
        <!-- 表格卡：表头48 / 数值列 th.num↔td.num 右对齐 / 输入白底 / 分页上下对称 -->
        <div class="card mt">
          <div class="card-head">设备列表</div>
          <div class="card-body table-wrap">
            <div class="row">
              <input class="input" placeholder="搜索设备编号 / 名称">
              <div class="sel" id="sel1"><div class="sel-trigger" onclick="document.getElementById('sel1').classList.toggle('open')">全部状态 <span style="color:var(--n9)">▾</span></div>
                <div class="sel-panel"><div class="sel-opt on">全部状态</div><div class="sel-opt">运行中</div><div class="sel-opt">故障</div><div class="sel-opt">离线</div></div></div>
              <button class="btn btn-primary">查询</button><button class="btn btn-text">重置</button>
            </div>
            <table class="table">
              <thead><tr><th>设备</th><th>状态</th><th class="num">负载</th><th class="num">产量</th><th>最近告警</th><th>操作</th></tr></thead>
              <tbody>
                <tr><td>注塑机 A-01</td><td><span class="status-dot"><i class="dot-run"></i>运行中</span></td><td class="num">72%</td><td class="num">1,860</td><td><span class="tag tag-def">无</span></td><td><button class="btn btn-sm btn-secondary">详情</button></td></tr>
                <tr><td>机械手 C-07</td><td><span class="status-dot"><i class="dot-ok"></i>正常</span></td><td class="num">41%</td><td class="num">625</td><td><span class="tag tag-warn">温度过高</span></td><td><button class="btn btn-sm btn-secondary">详情</button></td></tr>
                <tr><td>输送带 D-02</td><td><span class="status-dot"><i class="dot-err"></i>故障</span></td><td class="num">—</td><td class="num">0</td><td><span class="tag tag-err">堵转</span></td><td><button class="btn btn-sm btn-secondary">详情</button></td></tr>
                <tr><td>注塑机 A-03</td><td><span class="status-dot"><i class="dot-warn"></i>维护</span></td><td class="num">—</td><td class="num">320</td><td><span class="tag tag-suc">已排程</span></td><td><button class="btn btn-sm btn-secondary">详情</button></td></tr>
              </tbody>
            </table>
            <div class="pager"><span class="pg">‹</span><span class="pg active">1</span><span class="pg">2</span><span class="pg">3</span><span class="pg">›</span><span class="pg-tot">共 142 条 · 29 页</span></div>
          </div>
        </div>
        <!-- 图表卡：CHART-SPEC 范式二（SVG 数据层 + HTML 标签层，柱顶数值 .chart-v） -->
        <div class="card mt">
          <div class="card-head">近 7 日产能</div>
          <div class="card-body">
            <div class="chart-box"><svg class="chart-svg chart-svg--fill" viewBox="0 0 400 160" preserveAspectRatio="none" role="img" aria-label="近7日产能柱状图">
              <line x1="12" y1="30" x2="388" y2="30" stroke="var(--n6)" stroke-width="1"/>
              <line x1="12" y1="80" x2="388" y2="80" stroke="var(--n6)" stroke-width="1"/>
              <line x1="12" y1="130" x2="388" y2="130" stroke="var(--n6)" stroke-width="1"/>
              <rect class="chart-bar" x="12" y="68" width="42" height="62" rx="2" fill="var(--primary)"/>
              <rect class="chart-bar" x="66" y="50" width="42" height="80" rx="2" fill="var(--chart-smart-cyan)"/>
              <rect class="chart-bar" x="120" y="30" width="42" height="100" rx="2" fill="var(--primary)"/>
              <rect class="chart-bar" x="174" y="78" width="42" height="52" rx="2" fill="var(--chart-data-cyan)"/>
              <rect class="chart-bar" x="228" y="20" width="42" height="110" rx="2" fill="var(--primary)"/>
              <rect class="chart-bar" x="282" y="58" width="42" height="72" rx="2" fill="var(--chart-smart-cyan)"/>
              <rect class="chart-bar" x="336" y="42" width="42" height="88" rx="2" fill="var(--primary)"/>
            </svg>
            <div class="chart-x-labels"><span>周一</span><span>周二</span><span>周三</span><span>周四</span><span>周五</span><span>周六</span><span>周日</span></div>
            </div>
          </div>
        </div>
        <!-- 状态标签区 -->
        <div class="card mt">
          <div class="card-head">状态标签</div>
          <div class="card-body">
            <div class="badge-row">
              <span class="badge badge-suc">已通过</span>
              <span class="badge badge-warn">审核中</span>
              <span class="badge badge-err">已驳回</span>
              <span class="badge badge-muted">草稿</span>
              <span class="badge badge-outline">已归档</span>
              <span class="tag tag-run">运行中</span>
              <span class="tag tag-suc">正常</span>
              <span class="tag tag-warn">告警</span>
              <span class="tag tag-err">故障</span>
            </div>
          </div>
        </div>
        <!-- 折线图卡：CHART-SPEC 范式一（数据点 hover 三合一 + HTML 标签层） -->
        <div class="card mt">
          <div class="card-head">良品率趋势</div>
          <div class="card-body">
            <div class="chart-box"><svg class="chart-svg chart-svg--fill" viewBox="0 0 400 160" preserveAspectRatio="none" role="img" aria-label="良品率折线图">
              <line x1="12" y1="30" x2="388" y2="30" stroke="var(--n6)" stroke-width="1"/>
              <line x1="12" y1="80" x2="388" y2="80" stroke="var(--n6)" stroke-width="1"/>
              <line x1="12" y1="130" x2="388" y2="130" stroke="var(--n6)" stroke-width="1"/>
              <polyline class="chart-line" points="12,112 75,90 138,98 200,62 263,72 325,42 388,55" fill="none" stroke="var(--primary)" stroke-width="2"/>
              <circle class="chart-dot" cx="12" cy="112" r="3.5" fill="var(--primary)"/>
              <circle class="chart-dot" cx="75" cy="90" r="3.5" fill="var(--primary)"/>
              <circle class="chart-dot" cx="138" cy="98" r="3.5" fill="var(--primary)"/>
              <circle class="chart-dot" cx="200" cy="62" r="3.5" fill="var(--primary)"/>
              <circle class="chart-dot" cx="263" cy="72" r="3.5" fill="var(--primary)"/>
              <circle class="chart-dot" cx="325" cy="42" r="3.5" fill="var(--primary)"/>
              <circle class="chart-dot" cx="388" cy="55" r="3.5" fill="var(--primary)"/>
            </svg>
            <div class="chart-x-labels"><span>周一</span><span>周二</span><span>周三</span><span>周四</span><span>周五</span><span>周六</span><span>周日</span></div>
            </div>
          </div>
        </div>
        <!-- 表单卡：输入/下拉/文本域（白底 + focus 描边） -->
        <div class="card mt">
          <div class="card-head">工单登记</div>
          <div class="card-body">
            <div class="form-row"><label class="label">工单号</label><input class="input" placeholder="WO-20260806"></div>
            <div class="form-row"><label class="label">优先级</label>
              <div class="sel" id="sel2"><div class="sel-trigger" onclick="document.getElementById('sel2').classList.toggle('open')">常规 <span style="color:var(--n9)">▾</span></div>
                <div class="sel-panel"><div class="sel-opt on">常规</div><div class="sel-opt">紧急</div><div class="sel-opt">加急</div></div></div>
            </div>
            <div class="form-row"><label class="label">备注</label><textarea class="textarea" rows="2" placeholder="补充说明（可选）"></textarea></div>
            <div class="form-actions"><button class="btn btn-secondary">取消</button><button class="btn btn-primary">提交工单</button></div>
          </div>
        </div>
      </main>
      <footer class="footer">弘讯 B 端页面示例（重新生成 2026-08-06）· 视觉取自 template.css 真源</footer>
    </div>
  </div>
</div>
</body>
</html>`;
}

// ========== 移动模板（link ../../template.css，跟随真源） ==========
function mobilePage({ brand, mode, title, coverNote }) {
  const darkAttr = mode === 'dark' ? ' data-theme="dark"' : '';
  const cover = coverNote || '';
  return `<!DOCTYPE html>
<!-- 由品牌引擎重新生成：brand=${brand} mode=${mode} platform=mobile · ${title}（2026-08-06 对齐当前规范：link template.css / msearch 40 / 双行列表 92 / 移动 CHART-SPEC） -->
<html lang="zh-CN"${darkAttr}>
<!--
  弘讯移动端 页面示例 —— ${title} —— 视觉真理 N=1：link ../../template.css（唯一真源），仅页面布局自造类内联。
  2026-08-06 重新生成：搜索框 .msearch 40px、双行列表 .mlist-double 92px、图表按移动 CHART-SPEC（.chart-box--sm 120px 真源 + SVG + HTML 标签层）。${cover}
-->
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=375, initial-scale=1.0">
<link rel="stylesheet" href="../../template.css">
<style>
  /* 页面布局自造类（间距走 token：8/12/16） */
  .page-pad{padding:16px;}
  .stat-row{display:flex;gap:8px;margin-bottom:12px;}
  .stat-cell{flex:1;background:var(--n1);border-radius:var(--radius-md);box-shadow:var(--elev-raised-shadow);padding:12px;display:flex;flex-direction:column;gap:4px;}
  .mstat-num{font-size:22px;font-weight:600;line-height:28px;font-family:var(--font-cn);}
  .msearch-input{flex:1;border:none;outline:none;background:transparent;font-size:14px;color:var(--n8);font-family:var(--font-cn);}
  .mlist-main{flex:1;margin-left:12px;display:flex;flex-direction:column;gap:4px;min-width:0;}
  .chart-card{margin-bottom:12px;}
</style>
</head>
<body class="ios">
<div class="phone-stage">
  <div class="phone">
    <div class="navbar navbar-ios"><div class="navbar-main"><span class="navbar-title">设备监控</span></div></div>
    <div class="page-pad">
      <div class="stat-row">
        <div class="stat-cell"><div class="mcard-title">运行中</div><div class="mstat-num" style="color:var(--run)">72</div></div>
        <div class="stat-cell"><div class="mcard-title">故障</div><div class="mstat-num" style="color:var(--err)">1</div></div>
        <div class="stat-cell"><div class="mcard-title">今日产量</div><div class="mstat-num" style="color:var(--primary)">2,480</div></div>
      </div>
      <div class="msearch"><input class="msearch-input" placeholder="搜索设备 / 工单"></div>
      <!-- 双行列表 92px（mlist-thumb + 文本 + right） -->
      <div class="mlist mlist-double">
        <div class="mlist-thumb" style="background:var(--n3)"></div>
        <div class="mlist-main"><div class="mlist-title">注塑机 A-01</div><div class="mlist-sub">运行中 · 负载 72%</div></div>
        <div class="mlist-right">›</div>
      </div>
      <div class="mlist mlist-double">
        <div class="mlist-thumb" style="background:var(--n3)"></div>
        <div class="mlist-main"><div class="mlist-title">机械手 C-07</div><div class="mlist-sub">温度过高 · 需关注</div></div>
        <div class="mlist-right">›</div>
      </div>
      <!-- 移动 CHART-SPEC：柱状图（.chart-box--sm 120px 真源 + SVG 数据层 + HTML 标签层） -->
      <div class="chart-card"><div class="mcard-title">近 7 日产量</div>
        <div class="chart-box chart-box--sm"><svg class="chart-svg" viewBox="0 0 340 120" preserveAspectRatio="xMidYMid meet" role="img" aria-label="近7日产量柱状图">
          <line x1="16" y1="20" x2="324" y2="20" stroke="var(--n4)" stroke-width="1"/>
          <line x1="16" y1="70" x2="324" y2="70" stroke="var(--n4)" stroke-width="1"/>
          <line x1="16" y1="110" x2="324" y2="110" stroke="var(--n4)" stroke-width="1"/>
          <rect class="chart-bar" x="16" y="72" width="28" height="38" rx="4" fill="var(--primary)"/>
          <rect class="chart-bar" x="56" y="54" width="28" height="56" rx="4" fill="var(--primary)"/>
          <rect class="chart-bar" x="96" y="36" width="28" height="74" rx="4" fill="var(--primary)"/>
          <rect class="chart-bar" x="136" y="47" width="28" height="63" rx="4" fill="var(--primary)"/>
          <rect class="chart-bar" x="176" y="27" width="28" height="83" rx="4" fill="var(--primary)"/>
          <rect class="chart-bar" x="216" y="62" width="28" height="48" rx="4" fill="var(--primary)"/>
          <rect class="chart-bar" x="256" y="41" width="28" height="69" rx="4" fill="var(--primary)"/>
          <rect class="chart-bar" x="296" y="69" width="28" height="41" rx="4" fill="var(--primary)"/>
        </svg>
        <div class="chart-x-labels"><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>日</span><span></span></div>
        </div>
      </div>
    </div>
    <div class="bottomnav bottomnav-ios">
      <div class="bn-item active"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg><span>首页</span></div>
      <div class="bn-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg><span>工单</span></div>
      <div class="bn-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg><span>我的</span></div>
    </div>
  </div>
</div>
</body>
</html>`;
}

// ========== 品牌覆盖块（非 005EAE 页注入 :root） ==========
function brandCover(brand, mode, platform) {
  const pal = generatePalette(brand, { mode, platform });
  const vars = {
    '--primary': pal.primary.default,
    '--primary-hover': pal.primary.hover,
    '--primary-active': pal.primary.active || pal.primary.click,
    '--primary-dis-bg': pal.primary.disabledBg,
    '--primary-dis-fg': pal.primary.disabledFg
  };
  if (mode === 'dark') vars['--brand-surface'] = pal.background.brandSurface;
  const body = Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`).join('\n');
  return `<style>\n:root{\n${body}\n}\n</style>`;
}

// ========== 生成 6 个页面 ==========
const outDir = base + '弘讯web端design-system/pages/examples/';
const mOutDir = base + '弘讯移动端design-system/pages/examples/';
const jobs = [
  { file: 'web-default-005EAE-light.html', fn: webPage, dir: outDir, arg: { brand: '#005EAE', mode: 'light', title: '默认品牌 #005EAE 亮色', coverNote: '零覆盖：与 template.css :root 默认值一致。' } },
  { file: 'web-005EAE-dark.html', fn: webPage, dir: outDir, arg: { brand: '#005EAE', mode: 'dark', title: '默认品牌 #005EAE 暗色', coverNote: 'data-theme="dark" 切换暗色 token，零覆盖。' } },
  { file: 'web-brand-2E7D5B-light.html', fn: webPage, dir: outDir, arg: { brand: '#2E7D5B', mode: 'light', title: '品牌 #2E7D5B 亮色', coverNote: '仅 :root 覆盖 primary 系（引擎 generatePalette 派生）。' } },
  { file: 'mobile-default-005EAE-light.html', fn: mobilePage, dir: mOutDir, arg: { brand: '#005EAE', mode: 'light', title: '默认品牌 #005EAE 亮色', coverNote: '零覆盖：与 template.css :root 默认值一致。' } },
  { file: 'mobile-005EAE-dark.html', fn: mobilePage, dir: mOutDir, arg: { brand: '#005EAE', mode: 'dark', title: '默认品牌 #005EAE 暗色', coverNote: 'data-theme="dark" 切换暗色 token，零覆盖。' } },
  { file: 'mobile-brand-C2185B-light.html', fn: mobilePage, dir: mOutDir, arg: { brand: '#C2185B', mode: 'light', title: '品牌 #C2185B 亮色', coverNote: '仅 :root 覆盖 primary 系（引擎 generatePalette 派生）。' } }
];
for (const j of jobs) {
  let html = j.fn(j.arg);
  if (j.arg.brand !== '#005EAE') {
    // 品牌覆盖注入到 <head>（link 之后）
    const cover = brandCover(j.arg.brand, j.arg.mode, j.arg.brand === '#C2185B' ? 'mobile' : 'web');
    html = html.replace('<link rel="stylesheet" href="../../template.css">', '<link rel="stylesheet" href="../../template.css">\n' + cover);
  }
  fs.writeFileSync(j.dir + j.file, html, 'utf8');
  console.log('已生成:', j.dir.split('design-system/')[0].slice(-2) + '/' + j.file, '(' + html.length + 'B)');
}
console.log('6 个示例页生成完成');
