#!/usr/bin/env node
'use strict';
/* ============================================================
 * page-contracts.js — 页面级契约检查（2026-11-25 反方复核修订）
 *
 * 契约来源：弘讯web端design-system/components.json#pageContracts
 *   pager.placement   pager 层级（卡内必须在 card-body/table-card 内）
 *   stackSpacing      card-body 内相邻业务块的显式间距
 *
 * 设计原则（吸取 11-25 初版误报教训）：
 *   - 先剥 HTML 注释 / <script> / <style> 再解析（与 validate-spec 同口径）
 *   - 相邻只认「元素序列里紧挨着的两个块」——中间有任何元素即断开
 *   - pager 判据用「卡内无 body」而不是「必须在白名单祖先内」（内容级 pager 合法）
 *   - stack-spacing 为 MED（启发式，先不阻断），pager 为 HIGH（结构不变量）
 * ============================================================ */
const fs = require('fs');
const path = require('path');
const { WEB } = require('./lib/shell-tools');

const VOID_ELS = new Set(['br', 'img', 'hr', 'input', 'meta', 'link', 'source', 'wbr', 'col', 'area', 'base', 'track', 'embed', 'param']);
const BLOCK_TAGS = new Set(['div', 'table', 'ul', 'ol', 'section', 'p']);

function contracts() {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(WEB, 'components.json'), 'utf8'));
    return j.pageContracts || {};
  } catch (e) { return {}; }
}
function classOf(attrs) {
  const m = (attrs || '').match(/class\s*=\s*"([^"]*)"/);
  return m ? m[1].trim() : '';
}
function hasClass(cls, name) {
  return new RegExp('(?:^|\\s)' + name + '(?=\\s|$)').test(cls || '');
}
function selfClosed(attrs) { return /\/\s*$/.test((attrs || '').trim()); }
// 注释 / 脚本 / 内联样式块不参与 DOM 解析（样式已单独抽取）
function stripForParse(html) {
  return String(html)
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
}
function styleOf(attrs) {
  const m = (attrs || '').match(/style\s*=\s*"([^"]*)"/);
  return m ? m[1] : '';
}
function walkElements(html, onOpen) {
  const stack = [];
  const re = /<\s*(\/)?\s*([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/g;
  let m;
  while ((m = re.exec(html))) {
    const closing = !!m[1], tag = m[2].toLowerCase(), attrs = m[3] || '';
    if (closing) {
      for (let i = stack.length - 1; i >= 0; i--) if (stack[i].tag === tag) { stack.splice(i, 1); break; }
      continue;
    }
    const el = { tag, cls: classOf(attrs), style: styleOf(attrs), kids: [] };
    const parent = stack[stack.length - 1];
    if (parent) parent.kids.push(el);
    onOpen(el, stack);
    if (!selfClosed(attrs) && !VOID_ELS.has(tag)) stack.push(el);
  }
}

// ===== STATE-CLASS-01：JS 状态类 ↔ CSS 组件规则契约 =====
// 不绑死变量名：凡 activate(a, b, 'aria-pressed'[, 'state']) 都算契约调用。
// 契约找不到 → MED（门禁失明要报警，不能静默通过）；切了 CSS 里不存在的类 → HIGH。
function checkStateClassContract() {
  const jsPath = path.join(WEB, 'js', 'page-ui.js');
  const cssPath = path.join(WEB, 'template.css');
  if (!fs.existsSync(jsPath) || !fs.existsSync(cssPath)) return { level: null, messages: [] };
  const js = fs.readFileSync(jsPath, 'utf8');
  const css = fs.readFileSync(cssPath, 'utf8');
  const re = /activate\(\s*[^,]+,\s*[^,]+,\s*'([^']+)'(?:\s*,\s*'([^']+)')?\s*\)/g;
  const checks = [];
  let m;
  while ((m = re.exec(js))) {
    if (m[1] === 'aria-pressed') checks.push(m[2] || 'active');
  }
  if (!checks.length) {
    return {
      level: 'MED',
      messages: ['page-ui.js 未找到 filter-chip 的 activate(…, \'aria-pressed\', …) 调用——状态类门禁可能失明；若已重构请同步更新检查。'],
    };
  }
  const bad = checks.filter(c => !new RegExp('\\.filter-chip\\.' + c + '\\b').test(css));
  if (bad.length) {
    return {
      level: 'HIGH',
      messages: bad.map(c => 'page-ui.js 的 filter-chip 交互切 .' + c + '，但 template.css 无 .filter-chip.' + c +
        ' 规则（真源选中态是 .filter-chip.on）——点击胶囊视觉无反应、aria 与视觉相反。'),
    };
  }
  return { level: null, messages: [] };
}

// ===== STACK-SPACING-01：card-body 内相邻业务块显式间距（MED） ====
// 只检查「元素序列里紧挨着的两个块级业务元素」；中间有占位 div / hr / 任意元素即断开。
// 证据：内联 margin/padding/border、页面或真源 CSS 的 margin/padding/border、父容器 gap。
// 双方任一类在 template.css 中已定义（真源组件）→ 间距归真源管，跳过。
function checkStackSpacing(pageHtml) {
  const out = [];
  const pageCss = (String(pageHtml).match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [])
    .map(s => s.replace(/<\/?style[^>]*>/gi, '')).join('\n');
  const tplCss = fs.existsSync(path.join(WEB, 'template.css'))
    ? fs.readFileSync(path.join(WEB, 'template.css'), 'utf8') : '';
  const stripCss = s => s.replace(/\/\*[\s\S]*?\*\//g, '');
  const allCss = stripCss(pageCss) + '\n' + stripCss(tplCss);
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const classDefined = c => new RegExp('\\.' + esc(c) + '(?![\\w-])').test(stripCss(tplCss));

  const rules = [];
  const ruleRe = /([^{}]+)\{([^{}]*)\}/g;
  let rm;
  while ((rm = ruleRe.exec(allCss))) {
    rm[1].split(',').forEach(sg => rules.push({ sel: sg.trim(), body: rm[2] }));
  }
  // 元素自身证据：接受后代/作用域选择器（.wo-list .wo-row）与直接子级。
  const ruleHas = (c, prop) => rules.some(r =>
    new RegExp('\\.' + esc(c) + '(?![\\w-])').test(r.sel) &&
    new RegExp('(?:^|[;\\s])' + prop + '\\s*:').test(r.body));
  // 父容器 gap：只认「该 class 就是选择器最后一段」的直接规则——排除 `.detail-card .card-body`
  // 这类祖先限定 gap（否则每个普通 card-body 都会因别处的一条规则被误判为「已有 gap」）。
  const ruleHasDirect = (c, prop) => rules.some(r =>
    new RegExp('(?:^|[>+~])\\.' + esc(c) + '(?![\\w-])$').test(r.sel) &&
    new RegExp('(?:^|[;\\s])' + prop + '\\s*:').test(r.body));
  const anyRule = (clsList, props) => clsList.some(c => props.some(p => ruleHas(c, p)));
  const inlineHas = (el, re) => re.test(el.style || '');

  const bodies = [];
  walkElements(stripForParse(pageHtml), el => {
    if (hasClass(el.cls, 'card-body')) bodies.push(el);
  });

  for (const body of bodies) {
    const bodyCls = body.cls.split(/\s+/).filter(Boolean);
    const evGap = /(?:^|;)\s*(?:row-)?gap\s*:/.test(body.style || '') ||
      bodyCls.some(c => ruleHasDirect(c, 'gap') || ruleHasDirect(c, 'row-gap'));
    for (let i = 0; i + 1 < body.kids.length; i++) {
      const A = body.kids[i], B = body.kids[i + 1];
      // 只认紧挨着的两个块级业务元素；A/B 之间若有任何元素（占位 div/hr/…），kids 不会相邻
      if (!BLOCK_TAGS.has(A.tag) || !A.cls || !BLOCK_TAGS.has(B.tag) || !B.cls) continue;
      const clsA = A.cls.split(/\s+/).filter(Boolean);
      const clsB = B.cls.split(/\s+/).filter(Boolean);
      if (clsA.some(classDefined) || clsB.some(classDefined)) continue;
      const evA = inlineHas(A, /(?:^|;)\s*(?:margin-bottom|padding-bottom|border-bottom)\s*:/) ||
        anyRule(clsA, ['margin-bottom', 'padding-bottom', 'border-bottom']);
      const evB = inlineHas(B, /(?:^|;)\s*(?:margin-top|padding-top|border-top)\s*:/) ||
        anyRule(clsB, ['margin-top', 'padding-top', 'border-top']);
      if (!evA && !evB && !evGap) {
        out.push('card-body 内相邻业务块 .' + clsA[0] + ' → .' + clsB[0] +
          ' 未发现显式垂直间距（前块 margin/padding-bottom、后块 margin/padding-top、父容器 gap 均缺）' +
          '——裸堆叠 0 间距；建议用 .mt/.mb 或 spacing token。');
      }
    }
  }
  return out;
}

// ===== PAGER-CONTEXT-01：卡内 pager 必须有 card-body/table-card 的内边距上下文 ====
// 反向判据：只在「pager 位于 .card 内、且自 pager 向上到该 .card 之间没有 .card-body /
// .table-card」时判 HIGH。内容级 pager（.card-grid 之后、.modal-body 内、.comp-card 陈列位）
// 没有 .card 祖先，自然放行——不再需要 .comp-card 页面局部类白名单。
function checkPagerContext(pageHtml) {
  const out = [];
  const pagers = [];
  walkElements(stripForParse(pageHtml), (el, stack) => {
    if (hasClass(el.cls, 'pager')) pagers.push({ anc: stack.slice(), parent: stack[stack.length - 1] });
  });
  const note = (contracts().pager || {}).placement ||
    'pager 位于 .card 内时必须处于 .card-body / .table-card / .card--fill 直接子级（footer）内；内容级 pager（.card-grid 之后）不受限。';
  for (const pager of pagers) {
    let violation = false;
    for (let i = pager.anc.length - 1; i >= 0; i--) {
      const c = pager.anc[i].cls;
      if (hasClass(c, 'card-body') || hasClass(c, 'table-card')) { violation = false; break; }
      if (hasClass(c, 'card')) {
        // 2026-11-25 用户拍板：card footer pager 合法——仅限 .card--fill 的直接子级；
        // 普通 .card 内裸 pager 仍判 HIGH（无 card-body 内边距，左右贴边）。
        const footerOk = hasClass(c, 'card--fill') && pager.parent === pager.anc[i];
        violation = !footerOk;
        break;
      }
    }
    if (violation) {
      out.push('.pager 位于 .card 内但不在 .card-body / .table-card / .card--fill 直接子级（footer）内——卡片无内边距，分页器会左右贴边。' + note);
    }
  }
  return out;
}

// ===== 报告（供 verify.js page 使用；status 由调用方决定） =====
function reportStateClass() {
  const r = checkStateClassContract();
  if (r.level === 'HIGH') {
    console.error('\n🔴 JS状态类↔CSS契约不一致：' + r.messages.length + ' 项 [state-class.contract]');
    r.messages.forEach(m => console.error('  ↳ ' + m));
    process.exitCode = 1;
    return false;
  }
  if (r.level === 'MED') {
    console.warn('\n🟡 JS状态类↔CSS契约未找到 [state-class.contract·MED]');
    r.messages.forEach(m => console.warn('  ↳ ' + m));
    return true;
  }
  console.log('\n✅ JS状态类↔CSS契约：filter-chip 状态类与真源一致');
  return true;
}
function reportStackSpacing(pageHtml) {
  const bad = checkStackSpacing(pageHtml);
  if (!bad.length) { console.log('✅ card-body 相邻业务块间距：未发现 0 间距对'); return true; }
  console.warn('\n🟡 card-body 相邻业务块 0 间距（不阻断·MED）：' + bad.length + ' 项 [stack-spacing.zero-gap]');
  bad.forEach(m => console.warn('  ↳ ' + m));
  return true;
}
function reportPagerContext(pageHtml) {
  const bad = checkPagerContext(pageHtml);
  if (!bad.length) { console.log('✅ pager 放置层级：无卡内裸 pager'); return true; }
  console.error('\n🔴 pager 放置层级违规：' + bad.length + ' 项 [pager.context-missing]');
  bad.forEach(m => console.error('  ↳ ' + m));
  process.exitCode = 1;
  return false;
}

// ===== fixtures 自测：合法页 0 命中 / 非法页精确命中 =====
function runFixtures() {
  const dir = path.join(__dirname, 'fixtures', 'page-contracts');
  const expectPath = path.join(dir, 'expect.json');
  if (!fs.existsSync(expectPath)) {
    console.warn('⚠️ 页面契约 fixtures 缺失：' + expectPath);
    return { ok: false, failures: ['expect.json missing'], ran: 0 };
  }
  const expect = JSON.parse(fs.readFileSync(expectPath, 'utf8'));
  const failures = [];
  for (const [rel, exp] of Object.entries(expect)) {
    const p = path.join(dir, rel);
    if (!fs.existsSync(p)) { failures.push(rel + ': 文件缺失'); continue; }
    const html = fs.readFileSync(p, 'utf8');
    const got = { pager: checkPagerContext(html).length, stack: checkStackSpacing(html).length };
    if (got.pager !== exp.pager || got.stack !== exp.stack) {
      failures.push(rel + ': pager ' + got.pager + '/' + exp.pager + '，stack ' + got.stack + '/' + exp.stack);
    }
  }
  if (failures.length) {
    console.error('🔴 页面契约 fixtures 不一致：' + failures.length);
    failures.forEach(f => console.error('  ↳ ' + f));
  } else {
    console.log('✅ 页面契约 fixtures：' + Object.keys(expect).length + ' 组（pager/stack）');
  }
  return { ok: !failures.length, failures, ran: Object.keys(expect).length };
}

module.exports = {
  checkStateClassContract,
  checkStackSpacing,
  checkPagerContext,
  reportStateClass,
  reportStackSpacing,
  reportPagerContext,
  runFixtures,
};
