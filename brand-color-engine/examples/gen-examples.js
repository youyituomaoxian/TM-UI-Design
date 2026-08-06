const fs = require('fs');
const base = 'H:/global-workspace/设计系统/设计系统_V2.1/';
const webCss = fs.readFileSync(base + '弘讯web端design-system/template.css','utf8');
const mobCss = fs.readFileSync(base + '弘讯移动端design-system/template.css','utf8');
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
<style>
${webCss}
</style>
</head>
<body>
<div class="app">
  <header class="topbar">
    <div class="topbar-brand"><span class="topbar-logo"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:32px;height:32px;"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg></span>
      <div class="topbar-titles"><span class="topbar-title">弘讯科技</span><span class="topbar-subtitle">智能工厂管理系统</span></div></div>
    <div class="spacer"></div>
    <div class="topbar-right">
      <span class="topbar-item">首页</span><span class="topbar-sep"></span><span class="topbar-item"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>管理员</span>
      <span class="topbar-sep"></span><button class="topbar-item" title="修改密码"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
      <button class="topbar-item" title="退出登录"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></button>
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
            <span class="kpi-ico kpi-ico--lg kpi-ico--run"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span>
            <div class="stat-body"><div class="stat-num">72</div><div class="stat-foot"><div class="stat-sub">在产设备</div><span class="stat-delta stat-delta--up">+4.2%</span></div></div>
          </div></div>
          <div class="card"><div class="card-body stat-card--icon">
            <span class="kpi-ico kpi-ico--lg kpi-ico--primary"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>
            <div class="stat-body"><div class="stat-num">18</div><div class="stat-foot"><div class="stat-sub">待机就绪</div><span class="stat-delta stat-delta--up">+1.6%</span></div></div>
          </div></div>
          <div class="card"><div class="card-body stat-card--icon">
            <span class="kpi-ico kpi-ico--lg kpi-ico--warn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
            <div class="stat-body"><div class="stat-num">3</div><div class="stat-foot"><div class="stat-sub">需关注</div><span class="stat-delta stat-delta--down">−1 台</span></div></div>
          </div></div>
          <div class="card"><div class="card-body stat-card--icon">
            <span class="kpi-ico kpi-ico--lg kpi-ico--err"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span>
            <div class="stat-body"><div class="stat-num">1</div><div class="stat-foot"><div class="stat-sub">已停机</div><span class="stat-delta stat-delta--down">紧急</span></div></div>
          </div></div>
        </div>
        <!-- 图表区：折线图 col-7 + 柱状图 col-5 并排（grid12 · CHART-SPEC 五要素 + 三对齐） -->
        <section class="grid12" style="margin-bottom:16px;">
          <div class="col-7 card card--fill">
            <div class="card-head"><h3 class="card-title">良品率趋势</h3></div>
            <div class="card-body">
              <div class="chart-box">
                <svg class="chart-svg chart-svg--fill" viewBox="0 0 400 160" preserveAspectRatio="none" role="img" aria-label="良品率折线图">
                  <g class="chart-grid">
                    <line x1="20" y1="20" x2="380" y2="20"/><line x1="20" y1="50" x2="380" y2="50"/>
                    <line x1="20" y1="80" x2="380" y2="80"/><line x1="20" y1="110" x2="380" y2="110"/><line x1="20" y1="150" x2="380" y2="150"/>
                  </g>
                  <polyline class="chart-line" fill="none" stroke="var(--chart-data-cyan)" stroke-width="2" points="20,112 80,90 140,98 200,62 260,72 320,42 380,55" style="stroke-dasharray:2000;stroke-dashoffset:0;"/>
                  <circle class="chart-dot" cx="20" cy="112" r="4" fill="var(--primary)"/>
                  <circle class="chart-dot" cx="80" cy="90" r="4" fill="var(--primary)"/>
                  <circle class="chart-dot" cx="140" cy="98" r="4" fill="var(--primary)"/>
                  <circle class="chart-dot" cx="200" cy="62" r="4" fill="var(--primary)"/>
                  <circle class="chart-dot" cx="260" cy="72" r="4" fill="var(--primary)"/>
                  <circle class="chart-dot" cx="320" cy="42" r="4" fill="var(--primary)"/>
                  <circle class="chart-dot" cx="380" cy="55" r="4" fill="var(--primary)"/>
                </svg>
              </div>
              <div class="chart-x-labels" style="padding:0 2.5%;"><span>周一</span><span>周二</span><span>周三</span><span>周四</span><span>周五</span><span>周六</span><span>周日</span></div>
              <div class="chart-legend">
                <span class="legend-item"><span class="legend-line" style="border-color:var(--chart-data-cyan)"></span>良品率</span>
              </div>
            </div>
          </div>
          <div class="col-5 card card--fill">
            <div class="card-head"><h3 class="card-title">近 7 日产能</h3></div>
            <div class="card-body">
              <div class="chart-box">
                <svg class="chart-svg chart-svg--fill" viewBox="0 0 400 160" preserveAspectRatio="none" role="img" aria-label="近7日产能柱状图">
                  <g class="chart-grid">
                    <line x1="20" y1="25" x2="380" y2="25"/><line x1="20" y1="55" x2="380" y2="55"/>
                    <line x1="20" y1="85" x2="380" y2="85"/><line x1="20" y1="115" x2="380" y2="115"/><line x1="20" y1="145" x2="380" y2="145"/>
                  </g>
                  <g fill="var(--chart-smart-cyan)">
                    <rect class="chart-bar" x="40" y="83" width="40" height="62" rx="2"/>
                    <rect class="chart-bar" x="110" y="65" width="40" height="80" rx="2"/>
                    <rect class="chart-bar" x="180" y="45" width="40" height="100" rx="2"/>
                    <rect class="chart-bar" x="250" y="93" width="40" height="52" rx="2"/>
                    <rect class="chart-bar" x="320" y="35" width="40" height="110" rx="2"/>
                  </g>
                </svg>
              <span class="chart-v t-overline" style="left:15%;top:46.9%;">62</span>
              <span class="chart-v t-overline" style="left:32.5%;top:35.6%;">80</span>
              <span class="chart-v t-overline" style="left:50%;top:23.1%;">100</span>
              <span class="chart-v t-overline" style="left:67.5%;top:53.1%;">52</span>
              <span class="chart-v t-overline" style="left:85%;top:16.9%;">110</span>
              </div>
              <div class="chart-x-labels" style="padding:0 7.5%;"><span>周一</span><span>周二</span><span>周三</span><span>周四</span><span>周五</span></div>
              <div class="chart-legend">
                <span class="legend-item"><span class="legend-dot" style="background:var(--chart-smart-cyan)"></span>产能</span>
              </div>
            </div>
          </div>
        </section>

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
                <tr><td>注塑机 A-05</td><td><span class="status-dot"><i class="dot-run"></i>运行中</span></td><td class="num">66%</td><td class="num">1,120</td><td><span class="tag tag-def">无</span></td><td><button class="btn btn-sm btn-secondary">详情</button></td></tr>
                <tr><td>机械手 C-08</td><td><span class="status-dot"><i class="dot-ok"></i>正常</span></td><td class="num">35%</td><td class="num">480</td><td><span class="tag tag-def">无</span></td><td><button class="btn btn-sm btn-secondary">详情</button></td></tr>
                <tr><td>注塑机 A-06</td><td><span class="status-dot"><i class="dot-warn"></i>维护</span></td><td class="num">—</td><td class="num">210</td><td><span class="tag tag-suc">已排程</span></td><td><button class="btn btn-sm btn-secondary">详情</button></td></tr>
              </tbody>
            </table>
            <div class="pager"><span class="pg">‹</span><span class="pg active">1</span><span class="pg">2</span><span class="pg">3</span><span class="pg">›</span><span class="pg-tot">共 142 条 · 29 页</span></div>
          </div>
        </div>

<section class="grid12">
        <div class="col-7 card">
          <div class="card-head"><h3 class="card-title">告警与提示</h3></div>
          <div class="card-body" style="display:flex;flex-direction:column;gap:12px;">
            <div class="alert alert-err"><b>3 台设备故障</b> — 机械手 C-07 已停机超过 15 分钟，建议立即处理。</div>
            <div class="alert alert-warn"><b>干燥机 D-03 保养到期</b> — 剩余运行 6.2 小时后需例行保养。</div>
            <div class="badge-row" style="margin-top:auto;"><span class="badge badge-outline">生产正常</span><span class="badge badge-run">开机率达标</span><span class="badge">今日已报警 5 次</span></div>
          </div>
        </div>
        <div class="col-5 card">
          <div class="card-head"><h3 class="card-title">快速新建工单</h3></div>
          <div class="card-body">
            <div class="form-row"><label class="label" style="width:80px;">设备</label><input class="input" style="flex:1;min-width:0;" placeholder="选择或搜索设备"></div>
            <div class="form-row"><label class="label" style="width:80px;">故障类型</label><select class="sel-trigger" style="flex:1;min-width:0;"><option>机械故障</option><option>电气故障</option><option>保养需求</option></select></div>
            <div class="form-row"><label class="label" style="width:80px;">描述</label><textarea class="textarea" style="flex:1;min-width:0;" placeholder="故障现象描述…"></textarea></div>
            <div class="form-actions" style="display:flex;justify-content:flex-end;gap:12px;margin-top:16px;"><button class="btn btn-secondary">取消</button><button class="btn btn-primary">提交工单</button></div>
          </div>
        </div>
      </section>
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
<style>
${mobCss}
</style>

</head>
<body class="ios">
<div class="phone-stage">
  <div class="phone">
    <!-- 状态栏（透明悬浮，品牌导航栏上白字） -->
    <div class="m-statusbar m-statusbar-ios">
      <span class="sb-time">9:41</span>
      <div class="sb-icons">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 17h2v3H2zM6.5 14h2v6h-2zM11 10.5h2V20h-2zM15.5 7h2v13h-2zM20 3.5h2V20h-2z"/></svg>
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 6a9 9 0 0 1 6.36 2.64l-1.41 1.41A7 7 0 0 0 12 8a7 7 0 0 0-4.95 2.05L5.64 8.64A9 9 0 0 1 12 6zm0 4a5 5 0 0 1 3.54 1.46l-1.41 1.41A3 3 0 0 0 12 12a3 3 0 0 0-2.12.88l-1.42-1.42A5 5 0 0 1 12 10zm-2.12 6.12L12 18.24l2.12-2.12A3 3 0 0 0 12 14.6a3 3 0 0 0-2.12 1.52z"/></svg>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="1.5" y="9" width="17" height="11" rx="2.5"/><path d="M4.5 9V6.5a3.5 3.5 0 0 1 7 0V9"/><path d="M20.5 12.5v4"/></svg>
      </div>
    </div>
    <!-- 顶部导航（三槽位：返回 + 标题 + 右侧操作，与展示页同构） -->
    <header class="navbar navbar-ios">
      <div class="navbar-main">
        <button class="navbar-back" style="visibility:hidden;width:40px">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div class="navbar-title">设备监控中心</div>
        <div class="navbar-actions" style="width:40px"></div>
      </div>
    </header>

  <div class="screen-scroll">
    <div class="screen">
    <div class="page-view on">
      <!--       <!-- KPI 概览条（品牌蓝 3 列 · 页面组合：真源文字类 + 内联排布） -->
      <div style="display:flex;background:var(--primary);border-radius:var(--radius-md);padding:14px 0;box-shadow:var(--elev-raised-shadow);">
        <div style="flex:1;text-align:center;"><div class="mcard-title" style="color:rgba(255,255,255,.85)">设备总数</div><div class="m-text-num" style="color:#fff;font-size:22px">128</div></div>
        <div style="flex:1;text-align:center;"><div class="mcard-title" style="color:rgba(255,255,255,.85)">开机率</div><div class="m-text-num" style="color:#fff;font-size:22px">90.1%</div></div>
        <div style="flex:1;text-align:center;"><div class="mcard-title" style="color:rgba(255,255,255,.85)">今日产量</div><div class="m-text-num" style="color:#fff;font-size:22px">2,480</div></div>
      </div>
      <!-- 折线图（chart-box--sm 真源 + SVG 数据层 + 标签层） -->
      <div class="mcard"><div class="mcard-body">
        <div class="mcard-title">近 7 日产量趋势</div>
        <div class="chart-box chart-box--sm"><svg class="chart-svg" viewBox="0 0 340 120" preserveAspectRatio="xMidYMid meet" role="img" aria-label="近7日产量折线图">
          <line x1="16" y1="20" x2="324" y2="20" stroke="var(--n4)" stroke-width="1"/>
          <line x1="16" y1="50" x2="324" y2="50" stroke="var(--n4)" stroke-width="1"/>
          <line x1="16" y1="80" x2="324" y2="80" stroke="var(--n4)" stroke-width="1"/>
          <line x1="16" y1="110" x2="324" y2="110" stroke="var(--n4)" stroke-width="1"/>
          <polyline fill="none" stroke="var(--primary)" stroke-width="2" points="16,96 56,74 96,84 136,52 176,60 216,34 256,44 296,20"/>
          <circle cx="296" cy="20" r="4" fill="var(--primary)"/>
          <circle cx="256" cy="44" r="4" fill="var(--primary)"/>
        </svg></div>
        <div class="chart-x-labels"><span>周一</span><span>周二</span><span>周三</span><span>周四</span><span>周五</span><span>周六</span><span>周日</span><span></span></div>
      </div></div>
      <!-- 双行列表 92px（mlist-double 真源结构：top(thumb+text(head+sub)+more) + foot） -->
      <div class="mlist-double">
        <div class="mlist-double-top">
          <div class="mlist-thumb"><svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.6" stroke-linecap="round"><rect x="5" y="4" width="14" height="16" rx="2"/><path d="M9 8h6M9 12h6"/></svg></div>
          <div class="mlist-double-text">
            <div class="mlist-double-head"><span class="mlist-title">注塑机 A-01</span><span class="mtag mtag-sm mtag-run">运行中</span></div>
            <div class="mlist-sub">负载 72% · 产量 1,860</div>
          </div>
          <div class="mlist-more">›</div>
        </div>
        <div class="mlist-double-foot"><span class="m-text-note">运行时长 8.2h · 更新于 10:24</span></div>
      </div>
      <div class="mlist-double">
        <div class="mlist-double-top">
          <div class="mlist-thumb"><svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.6" stroke-linecap="round"><path d="M12 5a7 7 0 0 1 7 7v7"/><circle cx="12" cy="12" r="3"/><path d="M5 12a7 7 0 0 1 7-7"/></svg></div>
          <div class="mlist-double-text">
            <div class="mlist-double-head"><span class="mlist-title">机械手 C-07</span><span class="mtag mtag-sm mtag-warn">告警</span></div>
            <div class="mlist-sub">温度过高 · 需关注</div>
          </div>
          <div class="mlist-more">›</div>
        </div>
        <div class="mlist-double-foot"><span class="m-text-note">已持续 15 分钟 · 建议立即处理</span></div>
      </div>
      <div class="mlist-double">
        <div class="mlist-double-top">
          <div class="mlist-thumb"><svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.6" stroke-linecap="round"><path d="M4 8h16v12H4z"/><path d="M8 8V4h8v4"/><path d="M8 14h8M8 17h5"/></svg></div>
          <div class="mlist-double-text">
            <div class="mlist-double-head"><span class="mlist-title">干燥机 D-03</span><span class="mtag mtag-sm mtag-suc">保养</span></div>
            <div class="mlist-sub">保养到期 · 剩余 6.2 小时</div>
          </div>
          <div class="mlist-more">›</div>
        </div>
        <div class="mlist-double-foot"><span class="m-text-note">已排程 · 下午 15:00 执行</span></div>
      </div>
      <!-- 主操作按钮（mbtn 真源） -->
      <div style="display:flex;gap:12px;margin-top:4px;">
        <button class="mbtn mbtn-primary mbtn-lg" style="flex:1">新建工单</button>
        <button class="mbtn mbtn-secondary mbtn-lg" style="flex:1">设备巡检</button>
      </div>
</div>
    </div>
  </div>

  <!-- 2. 底部导航（菜单项 3–5 个，按业务增减；最后一项后挂 iOS home indicator） -->
  <div class="bottomnav bottomnav-ios">
    <div class="bn-item active">
      <svg class="bn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9.5 21v-6h5v6"/></svg>
      <span class="bn-label">监控</span>
    </div>
    <div class="bn-item">
      <svg class="bn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5 21 7v10l-9 4.5L3 17V7z"/><path d="M3 7l9 4.5L21 7"/><path d="M12 11.5V21.5"/></svg>
      <span class="bn-label">参数</span>
    </div>
    <div class="bn-item">
      <svg class="bn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>
      <span class="bn-label">历史</span>
    </div>
    <div class="m-home-indicator m-home-indicator--show"></div>
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
const outDir = base + 'docs/examples/';
const mOutDir = base + 'docs/examples/';
const jobs = [
  { file: 'web-弘讯运营中心.html', fn: webPage, dir: outDir, arg: { brand: '#005EAE', mode: 'light', title: '默认品牌 #005EAE 亮色', coverNote: '零覆盖：与 template.css :root 默认值一致。' } },
  { file: 'web-弘讯暗色.html', fn: webPage, dir: outDir, arg: { brand: '#005EAE', mode: 'dark', title: '默认品牌 #005EAE 暗色', coverNote: 'data-theme="dark" 切换暗色 token，零覆盖。' } },
  { file: 'web-品牌色2E7D5B.html', fn: webPage, dir: outDir, arg: { brand: '#2E7D5B', mode: 'light', title: '品牌 #2E7D5B 亮色', coverNote: '仅 :root 覆盖 primary 系（引擎 generatePalette 派生）。' } },
  { file: 'mobile-弘讯监控.html', fn: mobilePage, dir: mOutDir, arg: { brand: '#005EAE', mode: 'light', title: '默认品牌 #005EAE 亮色', coverNote: '零覆盖：与 template.css :root 默认值一致。' } },
  { file: 'mobile-弘讯暗色.html', fn: mobilePage, dir: mOutDir, arg: { brand: '#005EAE', mode: 'dark', title: '默认品牌 #005EAE 暗色', coverNote: 'data-theme="dark" 切换暗色 token，零覆盖。' } },
  { file: 'mobile-品牌色2E7D5B.html', fn: mobilePage, dir: mOutDir, arg: { brand: '#C2185B', mode: 'light', title: '品牌 #C2185B 亮色', coverNote: '仅 :root 覆盖 primary 系（引擎 generatePalette 派生）。' } }
];
for (const j of jobs) {
  let html = j.fn(j.arg);
  if (j.arg.brand !== '#005EAE') {
    // 品牌覆盖注入到 <head>（内联 style 之后）
    const cover = brandCover(j.arg.brand, j.arg.mode, j.arg.brand === '#C2185B' ? 'mobile' : 'web');
    html = html.replace('</head>', cover + '</head>');
  }
  fs.writeFileSync(j.dir + j.file, html, 'utf8');
  console.log('已生成:', j.dir.split('design-system/')[0].slice(-2) + '/' + j.file, '(' + html.length + 'B)');
}
console.log('6 个示例页生成完成');
