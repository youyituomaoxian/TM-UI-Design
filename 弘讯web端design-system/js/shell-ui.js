/* shell-ui.js — 左右结构外壳交互真源（2026-11-20）
 * 主题、popover（主题 / APP / 语言 / 用户）开关、用户菜单关闭。
 * 语言文案由 i18n.js 负责；树由 tree-nav.js 负责；页签由 page-ui.js 负责。
 */
(function () {
  'use strict';
  var root = document.documentElement;

  function closePops(except) {
    document.querySelectorAll('.pop.open').forEach(function (p) { if (p !== except) p.classList.remove('open'); });
    document.querySelectorAll('.pop > [aria-haspopup]').forEach(function (b) {
      if (!except || !except.contains(b)) b.setAttribute('aria-expanded', 'false');
    });
  }
  document.querySelectorAll('.pop > [aria-haspopup]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var pop = btn.parentElement;
      var open = !pop.classList.contains('open');
      closePops(pop);
      pop.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', function () { closePops(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePops(); });

  function applyTheme(skin, dark) {
    if (dark) root.setAttribute('data-theme', 'dark'); else root.removeAttribute('data-theme');
    if (!skin || skin === 'default') root.removeAttribute('data-skin'); else root.setAttribute('data-skin', skin);
    try {
      localStorage.setItem('hx-skin', skin || 'default');
      localStorage.setItem('hx-theme', dark ? 'dark' : 'light');
    } catch (e) {}
  }
  function syncTheme() {
    var skin = 'default', dark = false;
    try { skin = localStorage.getItem('hx-skin') || 'default'; dark = localStorage.getItem('hx-theme') === 'dark'; } catch (e) {}
    if (dark) root.setAttribute('data-theme', 'dark'); else root.removeAttribute('data-theme');
    if (skin !== 'default') root.setAttribute('data-skin', skin);
    document.querySelectorAll('.theme-opt').forEach(function (o) {
      var isDark = o.getAttribute('data-theme') === 'dark';
      var isSkin = (o.getAttribute('data-skin') || 'default') === skin;
      o.classList.toggle('on', dark ? isDark : (!isDark && isSkin));
    });
  }
  document.querySelectorAll('.theme-opt').forEach(function (opt) {
    opt.addEventListener('click', function (e) {
      e.stopPropagation();
      var skin = opt.getAttribute('data-skin');
      var theme = opt.getAttribute('data-theme');
      if (theme === 'dark') applyTheme(skin || localStorage.getItem('hx-skin') || 'default', true);
      else applyTheme(skin, false);
      document.querySelectorAll('.theme-opt').forEach(function (o) { o.classList.remove('on'); });
      opt.classList.add('on');
      var pop = opt.closest('.pop'); if (pop) pop.classList.remove('open');
    });
  });
  document.querySelectorAll('#userPop .pop-item').forEach(function (item) {
    item.addEventListener('click', function () { closePops(); });
  });
  syncTheme();
})();
