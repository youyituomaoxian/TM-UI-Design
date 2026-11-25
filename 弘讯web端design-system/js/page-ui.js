/* page-ui.js — 页面级轻交互真源（2026-11-20 · pane 联动 DS-20261120-03 增补）
 * 契约：
 *   .tabs .tab / .seg .item —— 选中态 .active + aria-selected（不绑定业务数据）
 *   .filter-chip —— 互斥筛选胶囊（RULES「列表页·数据范围筛选」条款）：按直接父元素分组，选中态 .on + aria-pressed。
 *     容器可用 .table-tools 等任意真源布局类；不再要求不存在的 .filter-chips。
 *   .tabs .tab[data-pane="x"] + .page-sec[data-pane="x"] —— 一级页签 ↔ 正文 pane 联动（body[data-pane] + .page-sec.is-active）
 */
(function () {
  'use strict';
  function activate(list, current, selectedAttr, stateClass) {
    var cls = stateClass || 'active'; // tabs/seg 沿用 .active；filter-chip 传 .on
    list.forEach(function (el) {
      var on = el === current;
      el.classList.toggle(cls, on);
      if (selectedAttr) el.setAttribute(selectedAttr, String(on));
    });
  }
  document.querySelectorAll('.tabs').forEach(function (tabs) {
    var items = Array.prototype.slice.call(tabs.querySelectorAll('.tab'));
    items.forEach(function (tab) {
      tab.setAttribute('tabindex', '0');
      tab.addEventListener('click', function () { activate(items, tab, 'aria-selected'); });
      tab.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(items, tab, 'aria-selected'); }
      });
    });
  });
  document.querySelectorAll('.seg').forEach(function (seg) {
    var items = Array.prototype.slice.call(seg.querySelectorAll('.item'));
    items.forEach(function (item) {
      item.setAttribute('tabindex', '0');
      item.addEventListener('click', function () { activate(items, item, 'aria-selected'); });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(items, item, 'aria-selected'); }
      });
    });
  });
  /* 互斥筛选胶囊（RULES「列表页·数据范围筛选」条款）：按直接父元素分组，选中态 .on。
   * 不依赖 .filter-chips 容器（真源无此类）；页面用 .table-tools 等真源布局类即可。
   * 兼容存量页手写的初始 .on / aria-pressed；缺则按 .on 补写，保证视觉与语义同源。 */
  document.querySelectorAll('.filter-chip').forEach(function (chip) {
    var group = chip.parentElement;
    if (!group || group.__filterBound) return; // 同父元素只绑定一次
    group.__filterBound = true;
    var chips = Array.prototype.slice.call(group.querySelectorAll('.filter-chip'));
    chips.forEach(function (c) {
      if (!c.hasAttribute('aria-pressed')) {
        c.setAttribute('aria-pressed', c.classList.contains('on') ? 'true' : 'false');
      }
      c.addEventListener('click', function () { activate(chips, c, 'aria-pressed', 'on'); });
      c.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); c.click(); }
      });
    });
  });

  /* ---------- 一级页签 ↔ 正文 pane 联动（RULES §4.4c「超预算 → 移入 tabs」的落地实现） ----------
   * 用法：<div class="tab active" data-pane="overview">总览</div>
   *       <section class="page-sec" data-pane="overview">…</section>
   * 行为：写入 body[data-pane]（关闭 body:not([data-pane]) 的「全部 pane 可见」兜底）并给对应用户 pane 加 .is-active。
   * 无 data-pane 页签时完全不介入，存量单 pane 页零影响。
   */
  var paneTabs = Array.prototype.slice.call(document.querySelectorAll('.tabs .tab[data-pane]'));
  if (!paneTabs.length) return;
  var panes = Array.prototype.slice.call(document.querySelectorAll('.page-sec[data-pane]'));
  function showPane(name) {
    document.body.setAttribute('data-pane', name);
    panes.forEach(function (sec) {
      sec.classList.toggle('is-active', sec.getAttribute('data-pane') === name);
    });
    var hash = '#' + name;
    if (location.hash !== hash) {
      try { history.replaceState(null, '', hash); } catch (e) { location.hash = name; }
    }
  }
  paneTabs.forEach(function (tab) {
    var name = tab.getAttribute('data-pane');
    tab.addEventListener('click', function () { showPane(name); });
    tab.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showPane(name); }
    });
  });
  var initial = paneTabs.filter(function (t) { return t.classList.contains('active'); })[0] || paneTabs[0];
  showPane(initial.getAttribute('data-pane'));
})();

/* ---------- pagebar 刷新（LIVE + 30s 倒计时，视觉/行为契约见 v7 工作台） ----------
 * 用法：<span class="live-badge"><i></i>LIVE</span><span class="bar-sep"></span>
 *       <button class="bar-refresh" id="pageRefresh">…<span class="bar-refresh-sec" id="refreshSec">30s</span></button>
 * 行为：倒计时 30s 循环；点击 = 图标旋转一圈 + 重置倒计时；无 #pageRefresh 时零介入。
 * 边界：本 IIFE 只做机制（倒计时/旋转），业务反馈（toast、数据刷新）由页面自绑 #pageRefresh 实现。
 */
(function () {
  'use strict';
  var btn = document.getElementById('pageRefresh');
  if (!btn) return;
  var secEl = document.getElementById('refreshSec');
  var left = 30;
  function render() { if (secEl) secEl.textContent = left + 's'; }
  render();
  btn.addEventListener('click', function () {
    btn.classList.remove('is-spinning');
    void btn.offsetWidth;
    btn.classList.add('is-spinning');
    left = 30; render();
  });
  setInterval(function () { left = left <= 1 ? 30 : left - 1; render(); }, 1000);
})();
