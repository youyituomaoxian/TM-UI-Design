#!/usr/bin/env node
/* ============================================================
 * chart-x-labels.js — 图表 x 轴标签渲染 SSoT（V12-A3，2026-08-28）
 *
 * 背景（订单总览V2 实战）：x 标签行是「各页自绘」模式，连续两代页面复犯
 * 同一缺陷——数据点 x 在绘图区（X0–X1）内均布，标签却 flex 全宽均分，
 * 两套坐标系系统性错位（V2 实测 delta -54/+36px）；且标签行与 SVG/汇总行
 * 竖直空间冲突（「7月」叠「客单价」）。
 *
 * 本函数是唯一标准实现：从 SVG polyline 的 points 反解数据点 x 坐标，
 * 标签与数据点共用同一坐标系（absolute + left% + translateX(-50%)）。
 *
 * 用法（生成页必须引用本实现，禁止页面自绘标签行）：
 *   <div class="chart-x-labels" id="trendXRow"></div>   ← 容器：position:relative; height:20px; margin-top:8px
 *   <script src=".../chart-x-labels.js"></script>       ← 或整段复制本函数
 *   renderChartXLabels({ svg: document.getElementById('trendSvg'),
 *                        labels: ['1月','2月',...],
 *                        container: document.getElementById('trendXRow') });
 *
 * 配套守则（RULES「图表底部结构顺序」）：SVG → x-labels（独立行，本组件）
 *   → legend → summary，各占独立文档流行，禁 absolute 互相侵入。
 * ============================================================ */
'use strict';

function renderChartXLabels(opts) {
  const svg = opts.svg;
  const labels = opts.labels || [];
  const container = opts.container;
  if (!svg || !container) return { error: 'svg/container 缺失' };

  // 1. 取 polyline 数据点 x 坐标（viewBox 系）；无 polyline 时均分兜底
  const vb = (svg.getAttribute('viewBox') || '0 0 100 100').split(/[\s,]+/).map(Number);
  const vbW = vb[2] || 100;
  let xs = null;
  const pl = svg.querySelector('polyline');
  if (pl && pl.getAttribute('points')) {
    const pts = pl.getAttribute('points').trim().split(/\s+/).map(p => p.split(',').map(Number));
    xs = pts.map(p => p[0]);
  }
  const n = labels.length;
  if (!xs || xs.length !== n) {
    // 兜底：与折线同逻辑的绘图区均布（需 opts.x0/x1，缺省全宽均分）
    const x0 = opts.x0 != null ? opts.x0 : 0, x1 = opts.x1 != null ? opts.x1 : vbW;
    xs = labels.map((_, i) => (n === 1 ? (x0 + x1) / 2 : x0 + (x1 - x0) * (i / (n - 1))));
  }

  // 2. 渲染：absolute + left%（与数据点同坐标系）+ translateX(-50%) 居中
  container.innerHTML = labels.map(function (l, i) {
    const leftPct = (xs[i] / vbW * 100).toFixed(2);
    return '<span class="t-caption" style="position:absolute;left:' + leftPct +
      '%;top:0;transform:translateX(-50%);white-space:nowrap">' + l + '</span>';
  }).join('');

  // 3. 端点防溢出：首尾标签中心贴边时平移回视口内（半宽钳制）
  const cw = container.clientWidth || 0;
  if (cw) {
    [...container.children].forEach(function (s, i) {
      const half = s.offsetWidth / 2;
      const cx = xs[i] / vbW * cw;
      const min = half + 2, max = cw - half - 2;
      if (cx < min) s.style.left = (min / cw * 100).toFixed(2) + '%';
      else if (cx > max) s.style.left = (max / cw * 100).toFixed(2) + '%';
    });
  }
  return { count: n, aligned: true };
}

if (typeof module !== 'undefined' && module.exports) module.exports = { renderChartXLabels };
