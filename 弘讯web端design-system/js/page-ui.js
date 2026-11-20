/* page-ui.js — 页面级轻交互真源（2026-11-20）
 * 契约：.tabs .tab / .seg .item / .filter-chips .filter-chip
 * 只负责选中态与 aria，不绑定业务数据。
 */
(function () {
  'use strict';
  function activate(list, current, selectedAttr) {
    list.forEach(function (el) {
      var on = el === current;
      el.classList.toggle('active', on);
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
  document.querySelectorAll('.filter-chips').forEach(function (wrap) {
    var chips = Array.prototype.slice.call(wrap.querySelectorAll('.filter-chip'));
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () { activate(chips, chip, 'aria-pressed'); });
    });
  });
})();
