/*
 * tree-nav.js — 左右结构作业树交互真源（2026-11-20）
 *
 * 契约：
 *   .rail > #tree.tree
 *     .tree-node[data-group] + .tree-group > .tree-node--child[data-leaf]
 *   折叠态：.rail.collapsed + #railFly（可由脚本补建）
 *
 * 行为：组展开/折叠；折叠态一级浮层；leaf 选中 + hash 同步；
 *       Tab/方向键/Enter/Space；窄屏自动折叠；hx-rail-collapsed 持久化。
 */
(function () {
  'use strict';
  document.documentElement.setAttribute('data-tree-nav','start');
  var rail = document.getElementById('rail');
  var tree = document.getElementById('tree');
  if (!rail || !tree) return;
  var fly = document.getElementById('railFly');
  if (!fly) {
    fly = document.createElement('div');
    fly.id = 'railFly';
    fly.className = 'rail-fly';
    fly.setAttribute('role', 'menu');
    fly.hidden = true;
    document.body.appendChild(fly);
  }
  var toggle = document.getElementById('railToggle');
  var mq = window.matchMedia('(max-width: 1100px)');
  var KEY = 'hx-rail-collapsed';
  var lastGroup = null;

  function groups() { return Array.prototype.slice.call(tree.querySelectorAll('[data-group]')); }
  function leaves() { return Array.prototype.slice.call(tree.querySelectorAll('[data-leaf]')); }
  function closeFly() {
    fly.classList.remove('open');
    fly.hidden = true;
    lastGroup = null;
    groups().forEach(function (g) { g.classList.remove('branch-active'); });
  }
  function setCollapsed(collapsed, persist) {
    rail.classList.toggle('collapsed', collapsed);
    if (toggle) {
      toggle.setAttribute('aria-expanded', String(!collapsed));
      toggle.setAttribute('title', collapsed ? '展开侧栏' : '收起侧栏');
      toggle.setAttribute('aria-label', collapsed ? '展开侧栏' : '收起侧栏');
    }
    if (!collapsed) closeFly();
    if (persist) { try { localStorage.setItem(KEY, collapsed ? '1' : '0'); } catch (e) {} }
  }
  function openFly(groupNode) {
    var group = groupNode.nextElementSibling;
    if (!group || !group.classList.contains('tree-group')) return;
    var titleEl = groupNode.querySelector('.tree-text');
    fly.innerHTML = '';
    var head = document.createElement('div');
    head.className = 'fly-title';
    head.textContent = titleEl ? titleEl.textContent : '';
    fly.appendChild(head);
    Array.prototype.forEach.call(group.children, function (node) {
      if (!node.classList.contains('tree-node')) return;
      var labelEl = node.querySelector('.tree-text');
      var linkEl = node.querySelector('a[href]');
      var item = linkEl ? document.createElement('a') : document.createElement('div');
      item.className = 'fly-item' + (node.classList.contains('on') ? ' on' : '');
      item.setAttribute('role', 'menuitem');
      item.setAttribute('tabindex', '0');
      if (linkEl && linkEl.getAttribute('href')) item.setAttribute('href', linkEl.getAttribute('href'));
      var icon = node.querySelector('.tree-ico');
      if (icon) item.appendChild(icon.cloneNode(true));
      var span = document.createElement('span');
      span.textContent = labelEl ? labelEl.textContent : '';
      item.appendChild(span);
      item.addEventListener('click', function (e) {
        e.stopPropagation();
        setActive(node);
        closeFly();
      });
      fly.appendChild(item);
    });
    fly.hidden = false;
    fly.classList.add('open');
    var r = groupNode.getBoundingClientRect();
    var top = r.top - 6;
    var maxTop = window.innerHeight - fly.offsetHeight - 8;
    fly.style.left = (r.right + 8) + 'px';
    fly.style.top = Math.max(8, Math.min(top, maxTop)) + 'px';
    groups().forEach(function (g) { g.classList.remove('branch-active'); });
    groupNode.classList.add('branch-active');
    lastGroup = groupNode;
    var first = fly.querySelector('.fly-item');
    if (first) first.focus();
  }
  function setActive(node) {
    tree.querySelectorAll('.tree-node.on').forEach(function (n) {
      n.classList.remove('on');
      n.removeAttribute('aria-current');
    });
    node.classList.add('on');
    node.setAttribute('aria-current', 'page');
    var a = node.querySelector('a[href]');
    if (a) {
      var href = a.getAttribute('href');
      if (href && href.charAt(0) === '#') {
        try { history.replaceState(null, '', href); } catch (e) { location.hash = href; }
      }
    }
  }
  function visibleNodes() {
    return Array.prototype.filter.call(tree.querySelectorAll('.tree-node'), function (n) {
      if (n.closest('.tree-group.is-collapsed')) return false;
      return n.offsetParent !== null;
    });
  }
  function focusNode(node) {
    if (!node) return;
    if (!node.hasAttribute('tabindex')) node.setAttribute('tabindex', '0');
    node.focus();
  }
  function handleKey(e) {
    var node = e.target.closest('.tree-node');
    if (!node) return;
    var list = visibleNodes();
    var i = list.indexOf(node);
    if (e.key === 'ArrowDown') { e.preventDefault(); focusNode(list[Math.min(list.length - 1, i + 1)]); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); focusNode(list[Math.max(0, i - 1)]); }
    else if (e.key === 'Home') { e.preventDefault(); focusNode(list[0]); }
    else if (e.key === 'End') { e.preventDefault(); focusNode(list[list.length - 1]); }
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (node.hasAttribute('data-group')) {
        if (rail.classList.contains('collapsed')) openFly(node);
        else toggleGroup(node);
      } else {
        setActive(node);
        var a = node.querySelector('a[href]');
        if (a && a.getAttribute('href')) location.hash = a.getAttribute('href');
      }
    } else if (e.key === 'ArrowRight' && node.hasAttribute('data-group')) {
      e.preventDefault();
      if (rail.classList.contains('collapsed')) openFly(node);
      else {
        var g = node.nextElementSibling;
        if (g && g.classList.contains('is-collapsed')) toggleGroup(node);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (rail.classList.contains('collapsed')) closeFly();
      else if (node.hasAttribute('data-group')) {
        var g2 = node.nextElementSibling;
        if (g2 && !g2.classList.contains('is-collapsed')) toggleGroup(node);
      }
    } else if (e.key === 'Escape') { closeFly(); }
  }
  function toggleGroup(node) {
    var group = node.nextElementSibling;
    if (!group || !group.classList.contains('tree-group')) return;
    var collapsed = group.classList.toggle('is-collapsed');
    node.classList.toggle('is-closed', collapsed);
    node.setAttribute('aria-expanded', String(!collapsed));
  }

  tree.querySelectorAll('[data-group],[data-leaf]').forEach(function (node) {
    if (!node.hasAttribute('tabindex')) node.setAttribute('tabindex', '0');
  });
  groups().forEach(function (node) {
    node.addEventListener('click', function (e) {
      if (e.target.closest('a')) return;
      e.stopPropagation();
      if (rail.classList.contains('collapsed')) openFly(node); else toggleGroup(node);
    });
  });
  leaves().forEach(function (node) {
    node.addEventListener('click', function (e) {
      if (e.target.closest('a')) return; // 让 anchor 默认跳转
      e.stopPropagation();
      setActive(node);
      closeFly();
    });
  });
  tree.addEventListener('keydown', handleKey);
  if (toggle) toggle.addEventListener('click', function () {
    setCollapsed(!rail.classList.contains('collapsed'), true);
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('#railFly') && !e.target.closest('#tree')) closeFly();
  });
  window.addEventListener('resize', closeFly);
  tree.addEventListener('scroll', closeFly);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeFly(); });

  // 初始折叠：本地持久化；窄屏自动折叠
  try {
    if (localStorage.getItem(KEY) === '1') setCollapsed(true, false);
  } catch (e) {}
  if (mq.matches) setCollapsed(true, false);
  if (mq.addEventListener) mq.addEventListener('change', function (e) { if (e.matches) setCollapsed(true, false); });

  // hash → 树选中
  function syncHash() {
    var h = location.hash;
    if (!h) return;
    var link = tree.querySelector('a[href="' + h.replace(/"/g, '\\"') + '"]');
    if (link) {
      var node = link.closest('.tree-node');
      if (node) {
        tree.querySelectorAll('.tree-node.on').forEach(function (n) { n.classList.remove('on'); });
        node.classList.add('on');
        node.setAttribute('aria-current', 'page');
      }
    }
  }
  window.addEventListener('hashchange', syncHash);
  syncHash();
  document.documentElement.setAttribute('data-tree-nav','ready');
})();
