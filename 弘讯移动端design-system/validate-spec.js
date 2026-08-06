#!/usr/bin/env node
/*
 * validate-spec.js — 弘讯移动端设计系统 · 规范合规扫描器
 *
 * 数据源：与本文件同目录的 components.json（contract 字段为机器可校验硬约束）。
 * 用途：扫描任意 HTML/WXSS 的 <style> 组件规则，对照 contract 检查尺寸/字重/半径/色值，
 *       捕获「教规范的文档自己没守规范」类回归（如按钮字重 400、非 token 硬编码色）。
 * 零写入：只读档 + 打印报告；存在 HIGH 违反时 exit 1（可作 pre-commit / CI gate）。
 *
 * 用法：
 *   node validate-spec.js [目标文件.html] [spec.json]
 *   默认目标 = ../Techmation设计系统使用说明.html ；默认 spec = ./components.json
 */
const fs = require('fs');
const path = require('path');

const SPEC_DEFAULT = path.join(__dirname, 'components.json');
const TARGET_DEFAULT = path.resolve(__dirname, '..', 'Techmation设计系统使用说明.html');

// 移动端合法 token 色板（非 token 硬编码色 → MEDIUM 违规）。
// 含：品牌色 / 中性 N1-N10 / 功能色(移动端成功绿 #10B981 合法) / 运行绿 / 图表 / 渐变。
// 注意：Web 功能色（#389E0D/#FA8C16/#F5222D）故意不入此板 → 移动端出现即违规。
// NEW-008 修复（2026-08-01，与 Web 端同步）：手写清单会与 tokens.json 各自演化而过期
//   （Web 端实测已漏 chart.alertRed #FF4D4D），故降级为「tokens 之外的示例/渐变色」白名单，
//   实际色板 = 本清单 ∪ tokens.json 全量 hex 叶子，运行时装配。
const PALETTE_EXTRA = new Set([
  // primary
  '#005EAE','#1A75D2','#004ABF','#DAEAFA','#A0B4C0',
  // neutral N1-N10
  '#FFFFFF','#F5F7FB','#E9ECF0','#DEE2E5','#CED4E4','#ADB5BF','#6C757D','#334155','#343A46','#21253C',
  // functional (移动端：成功绿 #10B981 合法)
  '#10B981','#0D9E6F','#A6D4C5','#F0FFFA',
  '#F59E0B','#DB8E09','#F5D9A6','#FEF2E8',
  '#EF4444','#D63B3B','#F5A6A6','#FEDED8',
  '#1A75D2',
  // running green (跨端共用)
  '#16A34A','#15803D','#ECFDF5','#BBF7D0',
  // chart
  '#0061FF','#059669','#D97706','#DC2626','#A78BFA','#8B5CF6','#06B6D4','#EC4899','#64748B','#1D4ED8',
  // gradients
  '#003868','#0F172A','#0606D4'
].map(c => c.toUpperCase()));

// 运行时装配的实际色板（在 run() 里赋值）
let PALETTE = new Set(PALETTE_EXTRA);

function collectHexLeaves(node, out) {
  if (typeof node === 'string') {
    const s = node.trim();
    if (/^#[0-9a-fA-F]{3,8}$/.test(s)) out.add(toPaletteKey(s));
    return out;
  }
  if (Array.isArray(node)) { for (const n of node) collectHexLeaves(n, out); return out; }
  if (node && typeof node === 'object') { for (const n of Object.values(node)) collectHexLeaves(n, out); return out; }
  return out;
}

// fail-closed：tokens.json 缺失/损坏直接报错，不静默退化成宽松模式
function buildPalette(specPath) {
  const tokensPath = path.join(path.dirname(specPath), 'tokens.json');
  if (!fs.existsSync(tokensPath)) {
    throw new Error(`色板真源缺失：${tokensPath}（validate-spec 需要它构建 token 白名单）`);
  }
  let tokens;
  try {
    tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
  } catch (e) {
    throw new Error(`tokens.json 解析失败，无法构建 token 白名单：${e.message}`);
  }
  const set = new Set(PALETTE_EXTRA);
  collectHexLeaves(tokens, set);
  return set;
}

function loadSpec(specPath) {
  const raw = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  if (!raw.contract || !Array.isArray(raw.contract)) {
    throw new Error('components.json 缺少 contract 字段');
  }
  return raw;
}

// ===== RED-018 修复（2026-08-01，与 Web 端同步）：未定义 token 用哨兵标记，而非拼残缺括号 =====
// 原实现 fallback 拼 `'var(--' + n`（**故意少一个右括号**）只是为了让下一轮正则失配跳出 while ——
// 把「终止条件」寄生在「损坏数据」上。后果：① 残缺串流进错误消息（输出 `实际 1px solid var(--nope`）；
// ② 「引用了不存在的变量」这一确凿缺陷（浏览器中该声明整条失效）没有任何分支上报，
//    expectToken 更是遇 var( 就 continue 放行 —— 而这恰是「Agent 自造 token」最典型的表现。
// 改为可识别哨兵：既能终止循环，又能被 checkUndefinedTokens 精确捕获并定位变量名。
// 仅匹配无 fallback 的 var(--x)；var(--x, 默认值) 是合法防御写法，不视为未定义。
const UNDEF_TOKEN = '\u0000UNDEF\u0000';
// 两条正则分工，避免 /g 的 lastIndex 在 test() 上留状态导致隔次漏判：
const VAR_REF_G = /var\(\s*--([\w-]+)\s*\)/g;  // replace / exec 遍历用
const VAR_REF_1 = /var\(\s*--[\w-]+\s*\)/;     // test 用（无 g，无状态）
function markUndef(n) { return UNDEF_TOKEN + n + UNDEF_TOKEN; }
// 供错误消息使用：把哨兵还原成人类可读的 var(--x)，内部标记绝不进报告
function humanize(s) {
  return String(s).replace(new RegExp(UNDEF_TOKEN + '([\\w-]+)' + UNDEF_TOKEN, 'g'), 'var(--$1)');
}

function flattenVars(map) {
  for (const k in map) {
    let v = map[k], d = 0;
    while (VAR_REF_1.test(v) && d < 5) {
      v = v.replace(VAR_REF_G, (_, n) => (map['--' + n] !== undefined ? map['--' + n] : markUndef(n)));
      d++;
    }
    map[k] = v;
  }
  return map;
}

function extractVars(css) {
  const map = {};
  const re = /(--[\w-]+)\s*:\s*([^;{}]+)/g;
  let m;
  while ((m = re.exec(css))) map[m[1]] = m[2].trim();
  return flattenVars(map);
}

// NEW-007 修复（2026-08-01，与 Web 端同步）：变量按主题作用域切分，
// 避免把亮/暗定义压成 last-wins 的「混合态」（浏览器任何主题下都不存在的值），
// 那会让所有基于 resolve() 的判定失真（Web 端实测已因此误报 surface.tree 门禁）。
const DARK_SCOPE_RE = /\[data-theme\s*=\s*["']?dark["']?\]/i;
function extractVarsScoped(rawCss) {
  const css = stripCssComments(rawCss); // 否则 /* [data-theme="dark"] */ 会把亮色块误判成暗色
  const light = {}, darkOverride = {};
  const blockRe = /([^{}]*)\{([^{}]*)\}/g;
  let m;
  while ((m = blockRe.exec(css))) {
    const target = DARK_SCOPE_RE.test(m[1]) ? darkOverride : light;
    const vre = /(--[\w-]+)\s*:\s*([^;{}]+)/g;
    let v;
    while ((v = vre.exec(m[2]))) target[v[1]] = v[2].trim();
  }
  return {
    light: flattenVars(Object.assign({}, light)),
    dark: flattenVars(Object.assign({}, light, darkOverride))
  };
}
function themeOfRule(rule) {
  return rule.selectors.some(s => DARK_SCOPE_RE.test(s)) ? 'dark' : 'light';
}

function resolve(v, vars) {
  let r = (v || '').trim(), d = 0;
  while (VAR_REF_1.test(r) && d < 5) {
    r = r.replace(VAR_REF_G, (_, n) => (vars['--' + n] !== undefined ? vars['--' + n] : markUndef(n)));
    d++;
  }
  return r.trim();
}

function num(v) {
  const m = String(v).match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : NaN;
}

// RED-017 修复（2026-08-01，与 Web 端同步）：hex 归一化须覆盖 4/5/9 位（带 alpha）形态。
//   原实现只展开 #RGB，对 #RGBA(5) 与 #RRGGBBAA(9) 原样返回 →
//   `color:#005EAE80`（品牌主色 50% 透明，完全合规的 token 派生用法）因
//   PALETTE.has('#005EAE80') 为 false 被判「非 token 硬编码色」。
//   该假阳性还会把人推向 rgba() 写法 —— 而 rgba() 恰好完全不受 forbidNonTokenHex 约束，
//   等于门禁同时制造假阳性并引导出真盲区。
//   修法：先把缩写展开成全长，再截断 alpha 通道后与色板比对（透明度不改变色相归属）。
function toPaletteKey(h) {
  h = h.toUpperCase();
  const body = h.replace(/^#/, '');
  if (body.length === 3 || body.length === 4) {
    // #RGB / #RGBA → 逐位倍写；只取 RGB 三通道
    return '#' + body[0] + body[0] + body[1] + body[1] + body[2] + body[2];
  }
  if (body.length === 6 || body.length === 8) {
    // #RRGGBB / #RRGGBBAA → 截断 alpha
    return '#' + body.slice(0, 6);
  }
  return h; // 5/7 位等非法长度：原样返回，交由上层判为非 token
}

function hexList(text) {
  const re = /#([0-9a-fA-F]{3,8})\b/g;
  const out = [];
  let m;
  while ((m = re.exec(text))) out.push(toPaletteKey('#' + m[1]));
  return out;
}

// 剥离 CSS 注释：用等长空格替换（保留字符偏移与行号）。
// 不剥离会导致注释被吞进选择器（报告失真）+ 注释里的 hex 色被误判为硬编码违规。
function stripCssComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '));
}

// RED-013③ 修复（2026-08-01，与 Web 端同步）：剥离 HTML 注释（等宽空格替换以保偏移/行号）。
// 不剥离的后果：被 <!-- --> 注释掉的旧版 <style>/<link>/class 全部照常参与判定 ——
//   「删代码要连注释一起删」这种要求不可能长期成立，注释掉的死代码会持续产生违规，
//   最终逼人给门禁加 ignore。凡以 HTML 文本为输入的扫描一律先过这一层。
function stripHtmlComments(html) {
  return String(html).replace(/<!--[\s\S]*?-->/g, m => m.replace(/[^\n]/g, ' '));
}

// ===== RED-013② 修复（2026-08-01，与 Web 端同步）：at-rule 感知 =====
// 原正则 /([^{}]+)\{([^{}]*)\}/ 完全不理解嵌套，@media 内的规则被**拍平成基态规则**：
//   `@media (max-width:375px){ .cell{height:99px} }` 解析出 {sel:'.cell', decl:'height:99px'}，
//   媒体条件被丢弃 → 响应式断点里的合法覆盖值被当基态参与 contract 数值比对 = 假阳性。
// 同时 @keyframes 内的 `0%,100%{opacity:1}` 也会被当成组件规则（selector 是 `0%`）。
// 分两类处置：
//   cond（@media/@supports/@container/@layer/@scope）→ 下钻解析，但给规则打 atRule 标记，
//     数值型断言跳过（断点覆盖合法），颜色/token 类断言照常执行。
//   skip（@keyframes/@font-face/@property/@counter-style/@page）→ 整块跳过。
function atRuleRanges(css) {
  const out = [];
  const re = /@([a-zA-Z-]+)([^;{}]*)\{/g;
  let m;
  while ((m = re.exec(css))) {
    const name = m[1].toLowerCase();
    const isCond = /^(media|supports|container|layer|scope)$/.test(name);
    const isSkip = /(keyframes|font-face|counter-style|property|page|font-feature-values)$/.test(name);
    if (!isCond && !isSkip) continue;
    const openIdx = m.index + m[0].length - 1; // 指向 '{'
    let depth = 0, end = css.length;
    for (let i = openIdx; i < css.length; i++) {
      if (css[i] === '{') depth++;
      else if (css[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
    }
    out.push({
      start: openIdx + 1,
      end,
      kind: isCond ? 'cond' : 'skip',
      cond: ('@' + name + ' ' + (m[2] || '').trim()).trim()
    });
    re.lastIndex = openIdx + 1; // 继续从块内扫，允许嵌套 at-rule 各自登记
  }
  return out;
}
function atCtxAt(ranges, idx) {
  let cond = null;
  for (const r of ranges) {
    if (idx < r.start || idx >= r.end) continue;
    if (r.kind === 'skip') return { skip: true, cond: null };
    cond = cond ? cond + ' / ' + r.cond : r.cond;
  }
  return { skip: false, cond };
}

function parseRules(rawFullText) {
  // RED-06 修复：先剥 <script>（等宽空格替换保行号），防脚本内 <style> 模板串污染规则列表
  const fullText = stripScriptTags(stripHtmlComments(rawFullText)); // RED-013③：注释掉的 <style> 不参与判定
  const rules = [];
  const styleRe = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let sm;
  while ((sm = styleRe.exec(fullText))) {
    const css = stripCssComments(sm[1]);
    // RED-021 修复：补齐开标签长度，使行号对齐真实规则位置
    const base = sm.index + (sm[0].length - sm[1].length - '</style>'.length);
    const ranges = atRuleRanges(css);
    const re = /([^{}]+)\{([^{}]*)\}/g;
    let m;
    while ((m = re.exec(css))) {
      // 行号取「选择器实际起点」：([^{}]+) 会吞掉规则前的空行/剥离注释留下的空白（RED-021 遗留漂移）
      const lead = m[1].length - m[1].replace(/^\s+/, '').length;
      const at = atCtxAt(ranges, m.index + lead);
      if (at.skip) continue;
      const line = fullText.slice(0, base + m.index + lead).split('\n').length;
      const selectors = m[1].split(',').map(s => s.trim()).filter(Boolean);
      rules.push({ selectors, decl: m[2], line, theme: themeOfRule({ selectors }), atRule: at.cond || undefined });
    }
  }
  return rules;
}

// 抽取页面自身内联 <style> 的纯 CSS 文本（供 checkRootVars 只吃真 CSS 用）
function inlineStyleCss(fullText) {
  // RED-06 修复：同样先剥 <script>（等宽替换），防脚本内 <style> 字符串冒充真实样式
  const noScript = stripScriptTags(fullText);
  const re = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  const parts = [];
  let m;
  while ((m = re.exec(noScript))) parts.push(m[1]);
  return parts.join('\n');
}

// ===== RED-002 修复（2026-08-01，与 Web 端同步）：跟随 <link> 外链本地样式表 =====
// 移动端 agent-starter.html 同样是「零 <style> + <link rel=stylesheet href=template.css>」结构，
// 原实现只解析内联 <style> → 解析出 0 条规则，整个 contract 扫描静默空过（fail-open 旁路）。
// 安全边界：只跟随本地相对路径，拒绝 http(s):/协议相对///data:，且必须仍在仓库根内。
const REPO_ROOT = path.resolve(__dirname, '..');
function collectLinkedCss(targetPath, rawHtml) {
  // RED-013③：自行剥离 HTML 注释，不依赖调用方先处理 —— 「安全性取决于调用顺序」
  //   本身就是缺陷；注释掉的 <link> 若被跟随，会把早已废弃的样式表拉回来参与判定。
  const html = stripHtmlComments(rawHtml);
  const out = [];
  const seen = new Set();
  const dir = path.dirname(path.resolve(targetPath));
  const linkRe = /<link\b[^>]*>/gi;
  let m;
  while ((m = linkRe.exec(html))) {
    const tag = m[0];
    if (!/\brel\s*=\s*["']?stylesheet["']?/i.test(tag)) continue;
    // RED-09 修复：兼容无引号 href（HTML5 合法）；REPO_ROOT 边界判定保持不变
    const hm = tag.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i);
    if (!hm) continue;
    const href = (hm[1] || hm[2] || hm[3] || '').trim();
    if (!href) continue;
    if (/^(?:[a-z][a-z0-9+.\-]*:|\/\/)/i.test(href)) continue;
    const abs = path.resolve(dir, href.split(/[?#]/)[0]);
    const relToRoot = path.relative(REPO_ROOT, abs);
    if (!relToRoot || relToRoot.startsWith('..') || path.isAbsolute(relToRoot)) continue;
    if (seen.has(abs)) continue;
    seen.add(abs);
    if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) continue;
    out.push({ abs, label: relToRoot.replace(/\\/g, '/'), css: fs.readFileSync(abs, 'utf8') });
  }
  return out;
}

// 从纯 CSS 文件抽规则；line = 该 CSS 文件内行号，src = 来源文件标签
function parseCssRules(rawCss, src) {
  const rules = [];
  const css = stripCssComments(rawCss);
  const ranges = atRuleRanges(css); // RED-013②：外链 CSS 同样需要 at-rule 感知
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(css))) {
    const lead = m[1].length - m[1].replace(/^\s+/, '').length;
    const at = atCtxAt(ranges, m.index + lead);
    if (at.skip) continue;
    const line = css.slice(0, m.index + lead).split('\n').length;
    const selectors = m[1].split(',').map(s => s.trim()).filter(Boolean);
    rules.push({ selectors, decl: m[2], line, src, theme: themeOfRule({ selectors }), atRule: at.cond || undefined });
  }
  return rules;
}

function declMap(decl) {
  const map = {};
  decl.split(';').forEach(part => {
    const i = part.indexOf(':');
    if (i < 0) return;
    const prop = part.slice(0, i).trim().toLowerCase();
    const val = part.slice(i + 1).trim();
    if (prop) map[prop] = val;
  });
  return map;
}

function cleanSeg(seg) {
  return seg.replace(/:(?::)?[a-z-]+(?:\([^)]*\))?/gi, '').replace(/\[[^\]]*\]/g, '').trim();
}

function selectorMatches(ruleSel, pattern, exclude) {
  if (exclude && exclude.some(ex => ruleSel.some(s => s.includes(ex)))) return false;
  // RED-021 修复：子串匹配会把 .navbar-main/.navbar-back/.navbar-search 等子元素
  // 误判为 .navbar 组件本体，套上「容器契约」（如 80/88 高度）→ 误报。
  // 改为「空格分隔的复合选择器片段」精确匹配：pattern 的每个片段（类名/元素标签）须全部出现在
  // 规则选择器中 —— ① .navbar-main ≠ .navbar（子元素天然排除）② .table th 与 .table td 的
  // th/td 标签保留（表头/表体区分）③ 伪类/属性选择器剥离后比较（.mtag:hover 仍命中 .mtag）。
  const segs = String(pattern).split(/\s+/).map(cleanSeg).filter(Boolean);
  if (!segs.length) return ruleSel.some(s => s.includes(pattern)); // 非选择器（:root 等）退回子串
  return ruleSel.some(s => {
    const parts = String(s).split(/\s+/).map(cleanSeg).filter(Boolean);
    return segs.every(seg => parts.includes(seg));
  });
}

// A 包新增（2026-07-30）：:root 变量门禁 — elevation/motion 新 token 组存在 + shadow 双层 + duration 白名单 + easing 合法
// 只加不删：不影响既有 contract 扫描。opts 按端配置（shadow 名不同）。仅对 page-template.html 生效。
//
// RED-019 修复（2026-08-01，与 Web 端同步）：只把「无属性选择器的裸 :root{}」内容喂给存在性检查。
//   移动端原实现比 Web 端更松 —— 连块结构都不看，对整份文档无差别正则扫 `--x: y`：
//   把 --elev-raised-shadow 写在 :root[data-theme="dark"]{}、.some-widget{}，
//   甚至写在文档正文的 <code> 代码示例里，都能满足「须在 :root 定义」。
//   token 没进全局作用域时页面照样失效，门禁却绿灯 = 「检查了个寂寞」的假阴性；
//   叠加 last-wins 后校验的还可能是暗色覆盖值而非基准值。
// 输入必须是**纯 CSS**（外链 CSS + 内联 <style> 内容），不要直接喂 HTML 全文。
//   仍保留 <style> 标签剥离作为兜底（等宽空格，保偏移），使函数对两种输入都安全。
// 说明：:root[data-density="compact"] 这类**派生覆盖块**被正确排除；基准值本就应在裸 :root。
function extractRootScopeVars(rawCss) {
  const css = stripCssComments(
    stripHtmlComments(String(rawCss)).replace(/<\/?style[^>]*>/gi, m => m.replace(/[^\n]/g, ' '))
  );
  const vars = {};
  const blockRe = /([^{}]*)\{([^{}]*)\}/g;
  let m;
  while ((m = blockRe.exec(css))) {
    const isBareRoot = m[1].split(',').some(s => {
      const t = s.trim();
      // 允许 :root 与 html/page 作为全局根；任何附加条件（属性/类/伪类/后代）一律不算
      return t === ':root' || t === 'html' || t === 'page';
    });
    if (!isBareRoot) continue;
    const vre = /(--[\w-]+)\s*:\s*([^;{}]+)/g;
    let v;
    while ((v = vre.exec(m[2]))) vars[v[1]] = v[2].trim();
  }
  return vars;
}

function checkRootVars(cssText, opts) {
  const violations = [];
  const vars = extractRootScopeVars(cssText);
  // 1. elevation 5 级 surface+shadow 须在 :root 存在
  for (const lv of opts.elevLevels) {
    for (const suf of ['surface', 'shadow']) {
      const v = `--elev-${lv}-${suf}`;
      if (vars[v] === undefined) violations.push({ line: 0, severity: 'HIGH', contract: 'a-pack.elevation', sel: ':root', msg: `${v} 缺失（A 包 elevation 5 级须在 :root 定义）` });
    }
  }
  // 2. 旧 shadow 名须保留且值为双层复合（含逗号）
  for (const name of opts.shadowNames) {
    const v = vars[name];
    if (v === undefined) violations.push({ line: 0, severity: 'HIGH', contract: 'a-pack.shadow.exists', sel: ':root', msg: `${name} 缺失（旧 shadow 名须保留）` });
    else if ((v.match(/rgba\(/g) || []).length < 2) violations.push({ line: 0, severity: 'HIGH', contract: 'a-pack.shadow.dual-layer', sel: ':root', msg: `${name} 须为双层复合（≥2 个 rgba 层），实际 ${v}` });
  }
  // 3. motion duration 白名单
  const durWhitelist = ['120ms', '240ms', '360ms', '480ms'];
  for (const k of opts.durationKeys) {
    const v = vars[`--motion-duration-${k}`];
    if (v === undefined) violations.push({ line: 0, severity: 'HIGH', contract: 'a-pack.motion.duration', sel: ':root', msg: `--motion-duration-${k} 缺失` });
    else if (!durWhitelist.includes(v.trim())) violations.push({ line: 0, severity: 'HIGH', contract: 'a-pack.motion.duration', sel: ':root', msg: `--motion-duration-${k} 须为 ${durWhitelist.join('/')}，实际 ${v}` });
  }
  // 4. motion easing 须为合法 cubic-bezier
  for (const name of Object.keys(vars)) {
    if (name.startsWith('--motion-ease-') && !/^cubic-bezier\(/.test(vars[name].trim())) {
      violations.push({ line: 0, severity: 'HIGH', contract: 'a-pack.motion.easing', sel: ':root', msg: `${name} 须为 cubic-bezier(...)，实际 ${vars[name]}` });
    }
  }
  // 5. B 包新增：elev-*-shadow 双层检查（raised/overlay/overflow，排除 none；补 A 包缺口）
  for (const lv of ['raised','overlay','overflow']) {
    const v = vars[`--elev-${lv}-shadow`];
    if (v !== undefined && v.trim() !== 'none' && (v.match(/rgba\(/g) || []).length < 2) {
      violations.push({ line: 0, severity: 'HIGH', contract: 'b-pack.elev-shadow.dual-layer', sel: ':root', msg: `--elev-${lv}-shadow 须为双层复合（≥2 rgba）或 none，实际 ${v}` });
    }
  }
  // 6. B 包新增：density 变量须存在
  for (const dv of ['--density-row-height','--density-content-padding']) {
    if (vars[dv] === undefined) violations.push({ line: 0, severity: 'HIGH', contract: 'b-pack.density', sel: ':root', msg: `${dv} 缺失（B 包 density 须在 :root 定义）` });
  }
  return violations;
}

// ===== 类名白名单门禁（2026-08-01 补齐，与 Web 端同步）=====
// 途中发现的同族 fail-open：移动端同样有 template.css 单一真源，却从未做类名比对。
//   实测立刻抓到真阳性 `.mtag-md` —— components.json#tag.sizing.md 明确定义了
//   { height:24, minWidth:86 }，且 ardot.variantMapping 写着「mtag-lg/md/sm 对应大/中/小」，
//   但 template.css 只实现了 .mtag/-lg/-sm，md 从来没有 CSS → 页面上「中」号标签
//   拿不到 min-width:86（sm 有 72、lg 有 96），是契约与实现的真实缺口。
// 分级同 Web：真源与页面 <style> 都没有 → HIGH（不渲染）；只在页面 <style> 有 → MEDIUM 聚合。
function buildDefinedClasses(rawCssText) {
  const cssText = stripCssComments(rawCssText || ''); // 被注释掉的 .foo{} 不算已定义
  const set = new Set();
  const re = /\.([a-zA-Z][\w-]*)/g;
  let m;
  while ((m = re.exec(cssText))) set.add(m[1]);
  return set;
}
function collectUsedClasses(html) {
  // RED-06 修复：先剥 <script>（JS 字符串里的 class="..." 会污染判定）+ class 属性引号兼容（单/双/无引号）
  const set = new Set();
  const noScript = stripScriptTags(html);
  const re = /class\s*=\s*(?:["']([^"']*)["']|([^\s>]+))/g;
  let m;
  while ((m = re.exec(noScript))) {
    (m[1] || m[2] || '').split(/\s+/).forEach(c => { if (c) set.add(c); });
  }
  return set;
}
function checkClassWhitelist(html, canonicalCss, selfCss, opts) {
  const violations = [];
  const canonical = buildDefinedClasses(canonicalCss);
  const canonRules = parseRules('<style>' + canonicalCss + '</style>');
  const canonMap = new Map();
  for (const cr of canonRules) {
    const ct = lastTargetClass(cr.selectors);
    if (ct && !canonMap.has(ct)) canonMap.set(ct, JSON.stringify(cr.declarations || []));
  }
  const self = buildDefinedClasses(selfCss || '');
  const used = collectUsedClasses(html);
  const ignore = (opts && opts.ignore) || new Set();
  const selfOnly = [];
  for (const c of used) {
    if (ignore.has(c)) continue;
    if (canonical.has(c)) continue;
    if (self.has(c)) { selfOnly.push(c); continue; }
    violations.push({
      line: 0, severity: (opts && opts.severity) || 'HIGH', contract: 'class.undefined',
      sel: '.' + c,
      msg: `.${c} 在 template.css 单一真源与页面自身 <style> 中均无定义 —— 该样式不会渲染（漂移真实根因）。请改用规范类；若确为合法新增，请先补进 template.css 并同步 components.json#referenceCss。`
    });
  }
  if (selfOnly.length) {
    selfOnly.sort();
    violations.push({
      line: 0, severity: 'MEDIUM', contract: 'class.self-defined',
      sel: selfOnly.slice(0, 5).map(c => '.' + c).join(' ') + (selfOnly.length > 5 ? ` …共 ${selfOnly.length} 个` : ''),
      msg: `页面自身 <style> 定义了 ${selfOnly.length} 个 template.css 之外的类（会正常渲染，但脱离单一真源，长期有漂移风险）：${selfOnly.map(c => '.' + c).join(', ')}。文档/演示脚手架可接受；若属通用组件，请沉淀进 template.css。`
    });
  }
  return violations;
}

// ===== 守则缺口补强（2026-08-06 用户拍板 P2 解禁）：覆写检测 / 网格 calc / 自造类 token 化 =====
// 组件类模式（两端通用；工具类 .ico/.t-*/.m-text-*/文字类/.anim-* 等豁免，尺寸调整允许）
const COMPONENT_CLASS_RE = /^(mbtn|mtag|mlist|mcard|msearch|mtabs|mtab|m-hero|m-kingkong|m-kk|m-porcelain|m-po|m-capsule|m-dot|m-progress|m-switch|m-stepper|m-textarea|m-upload|m-skeleton|m-empty|m-notice|m-cell|m-item|m-avatar|m-statusbar|m-home-indicator|mmodal|mdialog|mmask|m-dialog|navbar|bottomnav|bn-|toast|section-title|kv-|chart-|spinner|btn|table|tree|topbar|sidebar|footer|form|input|sel-|card|tag|badge|tabs|pager|modal|sheet|dropdown|accordion|collapse|breadcrumb|alert|stat-|kpi-|status-dot|radio|checkbox|switch|progress|skeleton|pagination|callout|group-title)/;

// 取选择器链最后一个类（目标类），忽略伪类/伪元素
function lastTargetClass(selectors) {
  const classes = [];
  for (const sel of selectors) {
    const re = /\.([a-zA-Z0-9_-]+)/g;
    let m;
    while ((m = re.exec(sel))) classes.push(m[1]);
  }
  return classes.length ? classes[classes.length - 1] : null;
}

// H2 硬执行：页面 <style> 覆写真源组件类 → HIGH
function checkOverride(selfCss, canonicalCss) {
  const canonical = buildDefinedClasses(canonicalCss);
  const canonRules = parseRules('<style>' + canonicalCss + '</style>');
  const canonMap = new Map();
  for (const cr of canonRules) {
    const ct = lastTargetClass(cr.selectors);
    if (ct && !canonMap.has(ct)) canonMap.set(ct, JSON.stringify(cr.declarations || []));
  }
  const selfRules = parseRules('<style>' + selfCss + '</style>');
  const seen = new Set();
  const violations = [];
  for (const r of selfRules) {
    if (r.selectors.some(s => s.includes(':root'))) continue;
    const target = lastTargetClass(r.selectors);
    if (target && canonical.has(target) && COMPONENT_CLASS_RE.test(target) && !seen.has(target)) {
      seen.add(target);
      violations.push({
        line: r.line, severity: 'HIGH', contract: 'css.override',
        sel: r.selectors.join(','),
        msg: `页面 <style> 覆写了 template.css 组件类 .${target} —— 属性改动破坏组件一致性（自造守则 H2）。需调整请用变体类/组合或上报维护者；禁止页面级覆写真源组件。`
      });
    }
  }
  return violations;
}

// G4 硬执行：页面自造类布局 px（含 calc 内）须 %4==0 → MED；:root 变量定义豁免（token 值不受网格约束）
function checkGrid4px(selfCss) {
  const selfRules = parseRules('<style>' + selfCss + '</style>');
  const violations = [];
  const seen = new Set();
  const skipProp = /font-size|line-height|letter-spacing|border|box-shadow|top|left|right|bottom|transform|background-position|text-shadow/i;
  for (const r of selfRules) {
    if (r.selectors.some(s => s.includes(':root'))) continue;
    const decls = r.decl.split(';');
    for (const d of decls) {
      const mm = d.match(/^\s*([a-z-]+)\s*:\s*(.+)$/);
      if (!mm) continue;
      if (skipProp.test(mm[1])) continue;
      const pxNums = [];
      const rePx = /(-?\d+)px/g;
      let m;
      while ((m = rePx.exec(mm[2]))) pxNums.push(parseInt(m[1]));
      const calcRe = /calc\(([^)]*)\)/g;
      let cm;
      while ((cm = calcRe.exec(mm[2]))) {
        const re2 = /(-?\d+)px/g;
        let n;
        while ((n = re2.exec(cm[1]))) pxNums.push(parseInt(n[1]));
      }
      for (const n of pxNums) {
        if (n % 4 !== 0 && Math.abs(n) !== 1 && !seen.has(r.line + '|' + mm[1] + '|' + n)) {
          seen.add(r.line + '|' + mm[1] + '|' + n);
          violations.push({
            line: r.line, severity: 'MEDIUM', contract: 'grid.4px',
            sel: r.selectors.join(','),
            msg: `属性 ${mm[1]}: ${n}px 非 4px 网格（含 calc 内）——布局尺寸/间距须 %4==0（自造守则 ③）。`
          });
        }
      }
    }
  }
  return violations;
}

// H1 边线补强：自造类禁裸 font-size（text.layer 只查 inline，这里补 <style> 内）→ MED
function checkCustomProps(selfCss, canonicalCss) {
  const canonical = buildDefinedClasses(canonicalCss);
  const selfRules = parseRules('<style>' + selfCss + '</style>');
  const violations = [];
  for (const r of selfRules) {
    if (r.selectors.some(s => s.includes(':root'))) continue;
    const target = lastTargetClass(r.selectors);
    if (target && canonical.has(target)) continue; // 覆写已由 checkOverride 报 HIGH
    const fm = r.decl.match(/font-size\s*:\s*(\d+)px/);
    if (fm) {
      violations.push({
        line: r.line, severity: 'MEDIUM', contract: 'text.layer-custom',
        sel: r.selectors.join(','),
        msg: `自造类 .${target} 内裸 font-size:${fm[1]}px —— 文字层级须走 .m-text-* 语义类（自造守则 ③）。`
      });
    }
  }
  return violations;
}

// ===== RED-018 上报侧（2026-08-01，与 Web 端同步）：引用未定义 CSS 变量 =====
// 这是确凿的真实缺陷（该声明在浏览器/小程序中直接失效），此前是门禁的完全盲区：
//   resolve 把它悄悄变成残缺串，expectToken 分支更是遇 var( 就 continue 放行。
//   而「引用不存在的 token」正是 Agent 自造 token 最常见的表现形式。
// 按变量名聚合（同一个错误 token 用 10 处只报 1 条），定位到首次出现处。
// 仅统计无 fallback 的 var(--x)；var(--x, 兜底值) 是合法防御写法，不报。
function checkUndefinedTokens(rules, varsByTheme) {
  const missing = new Map();
  for (const r of rules) {
    const vars = r.theme === 'dark' ? varsByTheme.dark : varsByTheme.light;
    const re = new RegExp(VAR_REF_G.source, 'g');
    let m;
    while ((m = re.exec(r.decl))) {
      const name = '--' + m[1];
      if (vars[name] !== undefined) continue;
      if (!missing.has(name)) missing.set(name, { count: 0, first: r });
      missing.get(name).count++;
    }
  }
  const violations = [];
  for (const [name, info] of missing) {
    const r = info.first;
    violations.push({
      line: r.line, src: r.src, severity: 'HIGH', contract: 'token.undefined',
      sel: r.selectors.join(','),
      msg: `引用了未定义的 CSS 变量 ${name}（共 ${info.count} 处）—— 该声明整条失效，属「自造 token」漂移。请改用 tokens.json / template.css 已有变量；若确需新增，先进 tokens 真源。（如为有意的可选覆盖，请写成 var(${name}, 兜底值)）`
    });
  }
  return violations;
}

// ===== M4 动效门禁（2026-08-02，与 Web 端同步镜像）：组件 transition/animation 时长必须走 token =====
// 拍板分级：transition 时长裸数字秒 → HIGH（交互反馈必须统一节奏）；
//   animation 时长裸数字秒 → MEDIUM（持续状态指示周期天然可超 4 档 token 上限）。
// 白名单：0s/0ms（即时切换合法）；var(--motion-duration-*)（token 引用）。
// 只扫组件规则（页面 <style> + 外链 CSS）；@keyframes 块内部不扫（atCtxAt 已跳过 skip 块）。
// 简写与单属性都查；逗号多段每段独立判定。本端已有 checkRootVars motion 段，此处只加 checkMotion。
const MOTION_DUR_RE = /^(?:\d+(?:\.\d+)?|\.\d+)(?:ms|s)$/i;        // RED-02 修复：单位大小写不敏感（CSS 单位合法大写）
const MOTION_ZERO_RE = /^0(?:\.0+)?(?:ms|s)$/i;                     // 0s/0ms/0.0s —— 即时切换合法（.0s 不算 0）
const MOTION_VAR_RE = /^var\(\s*--motion-duration-[\w-]+\s*\)$/;  // token 引用（完整闭合）
const MOTION_VAR_PREFIX_RE = /^var\(\s*--motion-duration-/;        // RED-02 修复：带 fallback 的 token 引用（var(--motion-duration-fast, 0.2s)）也算通过
const MOTION_KEY_RE = /^(?:instant|fast|normal|slow)$/;            // 裸 key 名（没包 var()）→ 违规
// RED-02 修复：括号感知顶层逗号分割 —— var(--x, 0.2s) 的 fallback 逗号是参数分隔符，
//   不是 transition/animation 的多段分隔符；naive split(',') 会把 fallback 值拆成独立段误报
function splitTopLevelComma(val) {
  const parts = [];
  let depth = 0, cur = '';
  for (const ch of val) {
    if (ch === '(') depth++;
    else if (ch === ')') depth = Math.max(0, depth - 1);
    if (ch === ',' && depth === 0) { parts.push(cur); cur = ''; continue; }
    cur += ch;
  }
  parts.push(cur);
  return parts;
}
function firstMotionToken(tokens) {
  for (const raw of tokens) {
    const t = raw.replace(/\)+$/, '').trim(); // RED-02：分析时剥 var(...) 右括号残留，使 fallback 段裸时长可识别
    if (MOTION_DUR_RE.test(t)) return raw;     // 返回原始 token，后续验证用剥括号后的值（见 checkMotion）
    if (MOTION_VAR_PREFIX_RE.test(t) || MOTION_VAR_RE.test(t)) return raw;
    if (MOTION_KEY_RE.test(t)) return raw;
  }
  return null;
}
function checkMotion(rules) {
  const violations = [];
  for (const r of rules) {
    const dm = declMap(r.decl);
    const checks = [
      ['transition', dm['transition'], 'transition'],
      ['transition-duration', dm['transition-duration'], 'transition'],
      ['animation', dm['animation'], 'animation'],
      ['animation-duration', dm['animation-duration'], 'animation']
    ];
    for (const [prop, rawVal, kind] of checks) {
      if (rawVal === undefined) continue;
      const val = String(rawVal).replace(/\s*!important\s*$/, '').trim();
      if (!val) continue;
      const segments = splitTopLevelComma(val); // RED-02：括号感知分割，var fallback 逗号不拆段
      for (const seg of segments) {
        const segVal = seg.trim();
        if (!segVal) continue;
        let dur = segVal;
        if (prop === 'transition' || prop === 'animation') {
          dur = firstMotionToken(segVal.split(/\s+/).filter(Boolean)) || '';
        }
        if (!dur) continue;
        const durClean = dur.replace(/\)+$/, '').trim(); // RED-02：判定用剥括号值，兼容 var(--x, 0.2s) 的 fallback 段
        if (MOTION_ZERO_RE.test(durClean)) continue; // 0s/0ms 即时切换合法
        if (MOTION_VAR_PREFIX_RE.test(durClean) || MOTION_VAR_RE.test(durClean)) continue; // var(--motion-duration-*)（含带 fallback）通过
        const sev = kind === 'transition' ? 'HIGH' : 'MEDIUM';
        violations.push({
          line: r.line, src: r.src, severity: sev,
          contract: kind === 'transition' ? 'motion.transition.non-token' : 'motion.animation.non-token',
          sel: r.selectors.join(','),
          msg: `${prop} 时长 ${dur} 未走动效 token —— 须用 var(--motion-duration-*)（transition 强制 HIGH / animation 建议 MEDIUM；0s/0ms 即时切换除外）。见 MASTER.md §5.2 / components.json motion`
        });
      }
    }
  }
  return violations;
}

// ===== SVG 绘制属性门禁（任务书 S，2026-08-03）：stroke=/fill=/stop-color= 裸 hex 必须走 token =====
// 分级与 forbidNonTokenHex 语义一致（领导拍板）：
//   非调色板色（自造色）→ HIGH 阻断；调色板内色值（值对但没走 var）→ MEDIUM 提示。
// 只扫双引号属性形式 stroke="/fill="/stop-color="，不扫 style=""（避免误伤色板 swatch 展示区
// 的合法 hex 展示）。先剥 <script> 块（防图表库配置串误报）。
// 3 位 hex 经 toPaletteKey 扩成 6 位（#0AF→#00AAFF）后判 PALETTE.has()；
// currentColor/none/transparent/url(#...) 天然豁免（非 hex 不匹配）。
function stripScriptTags(html) {
  // RED-06 修复：等宽空格替换（保留换行与字符偏移），而非删除 —— 否则 <script> 之后的行号全数漂移
  return html.replace(/<script[\s\S]*?<\/script>/gi, m => m.replace(/[^\n]/g, ' '));
}
function checkSvgPaint(html) {
  const violations = [];
  const noScript = stripScriptTags(html);
  // RED-01 修复：兼容单引号/无引号属性值（HTML 三种写法均合法）；hex 才能命中，fill=none/currentColor 天然豁免
  const paintRe = /(?:stroke|fill|stop-color)\s*=\s*(?:["']?)#([0-9a-fA-F]{3,8})(?:["']?)/g;
  let m;
  while ((m = paintRe.exec(noScript))) {
    const prop = m[0].split('=')[0];
    const isPalette = PALETTE.has(toPaletteKey(m[1]));
    violations.push({
      line: 0, severity: isPalette ? 'MEDIUM' : 'HIGH',
      contract: isPalette ? 'svg.paint.non-token' : 'svg.paint.non-palette',
      sel: prop,
      msg: 'SVG 绘制属性 ' + prop + '="' + m[1].toUpperCase() + '" 使用裸 hex（'
        + (isPalette ? '值在调色板内但未走 token' : '非调色板自造色')
        + '）——须改用 style="' + prop + ':var(--…)" 形式（SVG 属性支持 var()，比裸属性稳）。'
        + (isPalette
          ? '见 components.json#chart-* / GENERATION-SOP 图表生成规范'
          : '色值不在 tokens.json 色板内，属自造色，禁止入稿')
    });
  }
  return violations;
}

// ===== 图表门禁（CHART-SPEC §7 落地 2026-08-06：与 Web 同构 + 移动差异）=====
// ① checkChartBox：canvas 图表必须挂 .chart-box 容器（MEDIUM 不阻断，防留白失控；不扫 <script> 防 ECharts 配置误报）
function checkChartBox(html) {
  const violations = [];
  const noScript = stripScriptTags(html);
  const canvasRe = /<canvas\b[^>]*>/gi;
  let m;
  while ((m = canvasRe.exec(noScript))) {
    const before = noScript.slice(0, m.index);
    const openTags = before.match(/<[a-zA-Z][^>]*\bclass="[^"]*"[^>]*>/g);
    const last = openTags && openTags.length ? openTags[openTags.length - 1] : null;
    const clsMatch = last ? /class="([^"]*)"/.exec(last) : null;
    const cls = clsMatch ? clsMatch[1] : '';
    if (!cls.split(/\s+/).includes('chart-box')) {
      violations.push({
        line: 0, severity: 'MEDIUM', contract: 'chart.container.missing', sel: 'canvas',
        msg: 'canvas 图表须挂载在 .chart-box 容器内（定高防留白失控）：外层最近带 class 的容器是「' + (cls || '无 class') + '」。见 CHART-SPEC §2'
      });
    }
  }
  return violations;
}

// ② checkChartSvgStretch（移动差异）：svg.chart-svg 禁 preserveAspectRatio="none"
// 移动端图表 = 定尺寸 1:1（viewBox 宽 = 容器内容宽，chart-box 高度 = viewBoxH），none 会把图表拉伸变形（RULES §9.7）
function checkChartSvgStretch(html) {
  const violations = [];
  const noScript = stripScriptTags(html);
  const svgRe = /<svg\b[^>]*>/gi;
  let m;
  while ((m = svgRe.exec(noScript))) {
    const tag = m[0];
    const clsMatch = /\bclass="([^"]*)"/.exec(tag);
    const cls = clsMatch ? clsMatch[1] : '';
    if (!/\bchart-svg\b/.test(cls)) continue;
    if (/preserveAspectRatio\s*=\s*["'][^"']*none["']/.test(tag)) {
      violations.push({
        line: 0, severity: 'MEDIUM', contract: 'chart.svg.stretch', sel: cls,
        msg: '移动端 svg.chart-svg 禁 preserveAspectRatio="none"（定尺寸 1:1 等比，none 会把图表拉伸变形）——viewBox 宽 = 容器内容宽、chart-box 高度 = viewBoxH，见 CHART-SPEC §6 / RULES §9.7'
      });
    }
  }
  return violations;
}

// ③ checkChartViewboxEdge：chart-svg 内部元素 x 不得贴 viewBox 右缘（数据元素末端 x ≤ 宽 − 20，网格线同步收窄）
function checkChartViewboxEdge(html) {
  const violations = [];
  const noScript = stripScriptTags(html);
  const svgRe = /<svg\b[^>]*>/gi;
  let m;
  while ((m = svgRe.exec(noScript))) {
    const tag = m[0];
    const clsMatch = /\bclass="([^"]*)"/.exec(tag);
    const cls = clsMatch ? clsMatch[1] : '';
    if (!/\bchart-svg\b/.test(cls)) continue;
    const vb = /\bviewBox\s*=\s*["']0 0 (\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)["']/.exec(tag);
    if (!vb) continue;
    const W = parseFloat(vb[1]);
    const svgEnd = noScript.indexOf('</svg>', m.index);
    const inner = svgEnd === -1 ? '' : noScript.slice(m.index + tag.length, svgEnd);
    let maxX = -1;
    const ptsRe = /\bpoints\s*=\s*["']([^"']*)["']/g;
    let pm;
    while ((pm = ptsRe.exec(inner))) {
      const nums = pm[1].trim().split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
      for (let i = 0; i < nums.length; i += 2) if (nums[i] > maxX) maxX = nums[i];
    }
    const attrRe = /\b(?:x|cx|x2)\s*=\s*["'](\d+(?:\.\d+)?)["']/g;
    let am;
    while ((am = attrRe.exec(inner))) {
      const v = parseFloat(am[1]);
      if (v > maxX) maxX = v;
    }
    if (maxX >= W) {
      violations.push({
        line: 0, severity: 'MEDIUM', contract: 'chart.svg.viewbox-edge', sel: cls,
        msg: 'svg.chart-svg 内部元素最大 x=' + maxX + ' 贴 viewBox 右边缘（宽 ' + W + '）——数据元素末端 x 须 ≤ viewBox 宽 − 20（网格线同步收窄），见 CHART-SPEC §3'
      });
    }
  }
  return violations;
}

// ④ checkChartLayout（2026-08-06 复盘补强，与 Web 同款）：SVG 内文字 / 数据区左右对称 / 柱底对齐基线
// ① chart.text.inline（MED）② chart.symmetry（MED）③ chart.baseline（MED）——环状图跳过；横向柱状无网格线仅跳过基线
function checkChartLayout(html) {
  const violations = [];
  const noScript = stripScriptTags(html);
  const svgRe = /<svg\b[^>]*>/gi;
  let m;
  while ((m = svgRe.exec(noScript))) {
    const tag = m[0];
    const clsMatch = /\bclass="([^"]*)"/.exec(tag);
    const cls = clsMatch ? clsMatch[1] : '';
    if (!/\bchart-svg\b/.test(cls)) continue;
    if (/\bchart-ring-svg\b/.test(cls)) continue;
    const vb = /\bviewBox\s*=\s*["']0 0 (\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)["']/.exec(tag);
    if (!vb) continue;
    const W = parseFloat(vb[1]);
    const svgEnd = noScript.indexOf('</svg>', m.index);
    const inner = svgEnd === -1 ? '' : noScript.slice(m.index + tag.length, svgEnd);
    if (/<text\b/i.test(inner)) {
      violations.push({
        line: 0, severity: 'MEDIUM', contract: 'chart.text.inline', sel: cls,
        msg: 'SVG 内禁放 <text>（none 拉伸会变形；1:1 也不利样式 token）——轴标签/数值/图例一律 HTML 叠层（.chart-x-labels / .chart-v / .chart-hl/.chart-hr / .chart-ring-center）。见 CHART-SPEC §1③'
      });
    }
    const gridXs = []; const gridYs = [];
    const lineRe = /<line\b[^>]*>/g;
    let lm;
    while ((lm = lineRe.exec(inner))) {
      const x1m = /\bx1\s*=\s*["']([\d.]+)/.exec(lm[0]);
      const x2m = /\bx2\s*=\s*["']([\d.]+)/.exec(lm[0]);
      const y1m = /\by1\s*=\s*["']([\d.]+)/.exec(lm[0]);
      if (x1m && x2m) { gridXs.push([parseFloat(x1m[1]), parseFloat(x2m[1])]); gridYs.push(y1m ? parseFloat(y1m[1]) : NaN); }
    }
    for (const [x1, x2] of gridXs) {
      if (Math.abs((x1 + x2) - W) > 2) {
        violations.push({
          line: 0, severity: 'MEDIUM', contract: 'chart.symmetry', sel: cls,
          msg: `网格线 x1=${x1} + x2=${x2} ≠ viewBox 宽 ${W}（应 x1+x2=W，左右留白一致）——数据区左右不对称，见 CHART-SPEC §3`
        });
        break;
      }
    }
    const bars = [];
    const barRe = /<rect\b[^>]*class="[^"]*chart-bar[^"]*"[^>]*>/g;
    let bm;
    while ((bm = barRe.exec(inner))) {
      const xm = /\bx\s*=\s*["']([\d.]+)/.exec(bm[0]);
      const wm = /\bwidth\s*=\s*["']([\d.]+)/.exec(bm[0]);
      const ym = /\by\s*=\s*["']([\d.]+)/.exec(bm[0]);
      const hm = /\bheight\s*=\s*["']([\d.]+)/.exec(bm[0]);
      if (xm && wm && ym && hm) bars.push({ x: parseFloat(xm[1]), w: parseFloat(wm[1]), y: parseFloat(ym[1]), h: parseFloat(hm[1]) });
    }
    if (bars.length) {
      const minX = Math.min(...bars.map(b => b.x));
      const maxRight = Math.max(...bars.map(b => b.x + b.w));
      if (Math.abs((minX + maxRight) - W) > 2) {
        violations.push({
          line: 0, severity: 'MEDIUM', contract: 'chart.symmetry', sel: cls,
          msg: `柱数据区 左=${minX} 右=${maxRight}（应 minX+maxRight=viewBox 宽 ${W}）——数据区左右不对称，见 CHART-SPEC §3`
        });
      }
      const baseYs = gridYs.filter(y => !isNaN(y));
      if (baseYs.length) {
        const baseY = Math.max(...baseYs);
        const barBottom = Math.max(...bars.map(b => b.y + b.h));
        if (Math.abs(barBottom - baseY) > 2) {
          violations.push({
            line: 0, severity: 'MEDIUM', contract: 'chart.baseline', sel: cls,
            msg: `柱底 ${barBottom} 未对齐最下网格线 ${baseY}（差 ${Math.abs(barBottom - baseY)} > 2）——柱底悬空无基线 = 漂移，见 CHART-SPEC §3`
          });
        }
      }
    }
    const ptsRe = /\bpoints\s*=\s*["']([^"']*)["']/g;
    let pm;
    while ((pm = ptsRe.exec(inner))) {
      const nums = pm[1].trim().split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
      if (nums.length < 2) continue;
      let minX = Infinity, maxX = -Infinity;
      for (let i = 0; i < nums.length; i += 2) { if (nums[i] < minX) minX = nums[i]; if (nums[i] > maxX) maxX = nums[i]; }
      if (Math.abs((minX + maxX) - W) > 2) {
        violations.push({
          line: 0, severity: 'MEDIUM', contract: 'chart.symmetry', sel: cls,
          msg: `折线数据 x 左=${minX} 右=${maxX}（应 min+max=viewBox 宽 ${W}）——数据区左右不对称，见 CHART-SPEC §3`
        });
        break;
      }
    }
  }
  return violations;
}

// ⑤ checkTemplateRootSync（2026-08-06：克隆源内联 :root 与 template.css 一致性门禁——防克隆页错色）
// 仅对 page-template（title 含 page-template）生效：内联 <style> 第一个 :root 须 = template.css 亮色 :root 全量
// 背景：2026-08-06 发现移动端克隆源内联 :root 为旧暗色值（primary #3B82F6 / n1 #0F172A），克隆页整体暗色错色
function checkTemplateRootSync(html, canonicalCss) {
  const violations = [];
  if (!/<title>[^<]*page-template/i.test(html)) return violations;
  const styleM = /<style>([\s\S]*?)<\/style>/.exec(html);
  const rootM = styleM && /:root\s*\{([^}]*)\}/.exec(styleM[1]);
  const tplRootM = /:root\s*\{([^}]*)\}/.exec(canonicalCss);
  if (!rootM || !tplRootM) return violations;
  function parseVars(css) {
    const out = {};
    const re = /(--[\w-]+)\s*:\s*([^;]+);/g;
    let m;
    while ((m = re.exec(css))) out[m[1].trim()] = m[2].trim();
    return out;
  }
  const pv = parseVars(rootM[1]);
  const tv = parseVars(tplRootM[1]);
  const diff = Object.keys(pv).filter(k => k in tv && pv[k] !== tv[k]);
  const missing = Object.keys(tv).filter(k => !(k in pv));
  if (diff.length) {
    violations.push({
      line: 0, severity: 'MEDIUM', contract: 'template.root.sync', sel: ':root',
      msg: `克隆源内联 :root 与 template.css :root 有 ${diff.length} 个值不一致（${diff.slice(0, 3).join(', ')}…）——内联后加载会覆盖真源值，克隆页错色。须同步内联 :root 为 template.css 亮色段全量（2026-08-06 规则）`
    });
  }
  if (missing.length) {
    violations.push({
      line: 0, severity: 'MEDIUM', contract: 'template.root.sync', sel: ':root',
      msg: `克隆源内联 :root 缺失 ${missing.length} 个变量（${missing.slice(0, 5).join(', ')}…）——补为 template.css 亮色段全量（2026-08-06 规则）`
    });
  }
  return violations;
}

// ===== WCAG 2.0 前景/背景对比度门禁（2026-08-05 对抗审查 DEFECT-07：与 Web 端同款，防深字方案回归）=====
// 亮色作用域（:root 默认）已知禁止组合：白 on 功能色 / 浅底+同系色字 / 白 on 浅灰。
// 暗色 dark n1 是深色（合法），不适用白字判定；hex 前景（#fff/white）也拦截。
function checkWcagContrast(rules, varsByTheme) {
  const BANNED = [
    { bg: '--suc', fg: '--n1' }, { bg: '--warn', fg: '--n1' }, { bg: '--run', fg: '--n1' }, { bg: '--err', fg: '--n1' },
    { bg: '--suc-text', fg: '--suc' }, { bg: '--warn-text', fg: '--warn' }, { bg: '--err-text', fg: '--err' },
    { bg: '--n5', fg: '--n1' }, { bg: '--n4', fg: '--n1' },
  ];
  const HEX_WHITE = /(?:^|;)\s*color\s*:\s*(?:#(?:fff|ffffff|FFF|FFFFFF)|white)\b/;
  const violations = [];
  const seen = new Set();
  for (const r of rules) {
    if (r.theme === 'dark') continue;
    const bgM = r.decl.match(/background(?:-color)?\s*:\s*var\(\s*(--[\w-]+)\s*\)/);
    const fgM = r.decl.match(/(?:^|;)\s*color\s*:\s*var\(\s*(--[\w-]+)\s*\)/);
    // hex 白字前景（#fff/white）配功能色底也拦——DEFECT-07 Web 盲区同步修复
    const hexWhite = bgM && HEX_WHITE.test(r.decl);
    if (hexWhite) {
      violations.push({
        line: r.line, src: r.src, severity: 'MEDIUM', contract: 'wcag.contrast.banned',
        sel: r.selectors.join(','),
        msg: '已知 WCAG 禁止组合：hex 白字（#fff/white）on 彩色底（RULES §10.3b）——功能色底用深字 n10，白字仅允许 on primary'
      });
      continue;
    }
    if (!bgM || !fgM) continue;
    for (const b of BANNED) {
      if (bgM[1] === b.bg && fgM[1] === b.fg) {
        const key = r.selectors.join(',') + '|' + b.bg + '|' + b.fg;
        if (seen.has(key)) continue;
        seen.add(key);
        violations.push({
          line: r.line, src: r.src, severity: 'MEDIUM', contract: 'wcag.contrast.banned',
          sel: r.selectors.join(','),
          msg: `已知 WCAG 2.0 禁止组合：${b.fg}（白）on ${b.bg}（功能色/浅底）对比度 <4.5:1（RULES §10.3b）——组件模板已改深字方案，页面请勿覆盖回白字`
        });
      }
    }
  }
  return violations;
}

function run(specPath, targetPath) {
  const spec = loadSpec(specPath);
  PALETTE = buildPalette(specPath); // NEW-008：色板 = 手写额外色 ∪ tokens.json 全量 hex
  const rawHtml = fs.readFileSync(targetPath, 'utf8');
  // RED-013③：所有以 HTML 文本为输入的扫描统一走剥离注释后的版本（等宽空格替换，行号不变）
  const html = stripHtmlComments(rawHtml);
  // RED-002：样式真源 = 内联 <style> + 本地外链样式表
  const linked = collectLinkedCss(targetPath, html);
  const linkedCss = linked.map(l => l.css).join('\n');
  const selfCss = inlineStyleCss(html);
  // NEW-007：按主题切分变量表，规则按自身作用域取表求值
  const varsByTheme = extractVarsScoped(linkedCss + '\n' + selfCss); // RED-04 修复：只喂真实 CSS（与 checkRootVars 同源），正文/脚本字符串不再污染变量表
  const varsOf = r => (r && r.theme === 'dark' ? varsByTheme.dark : varsByTheme.light);
  const rules = parseRules(html).concat(...linked.map(l => parseCssRules(l.css, l.label)));
  // RED-001 同型修复（与 Web 端对齐）：豁免依据由 basename().includes() 改为精确路径比对，
  // 否则任何含 "page-template" 子串的文件名都能拿到 type.* 断言豁免（改名即绕过门禁）。
  const isTemplate = path.resolve(targetPath) === path.resolve(__dirname, 'page-template.html');

  const violations = [];
  for (const c of spec.contract) {
    if (!isTemplate && c.id && c.id.startsWith('type.')) continue; // B 包：字阶断言仅对 page-template（移动端无 type.* contract，gate 无影响但一致）
    for (const rule of rules) {
      if (!c.selector.some(p => selectorMatches(rule.selectors, p, c.exclude))) continue;
      const dm = declMap(rule.decl);
      for (const ruleDef of c.rules) {
        const prop = ruleDef.prop;
        if (prop === '*') {
          if (ruleDef.forbidNonTokenHex) {
            const bad = hexList(rule.decl).filter(h => !PALETTE.has(h));
            bad.forEach(h => violations.push({
              line: rule.line, src: rule.src, severity: ruleDef.severity, contract: c.id,
              sel: rule.selectors.join(','),
              msg: `组件 CSS 出现非 token 硬编码色 ${h}（${ruleDef.note || '须用规范变量'}）`
            }));
          }
          continue;
        }
        const rawVal = dm[prop];
        if (rawVal === undefined) continue;
        const resolved = resolve(rawVal, varsOf(rule)); // NEW-007：按规则所属主题求值
        if (ruleDef.forbidHex) {
          const hit = ruleDef.forbidHex.some(h => rawVal.toUpperCase().includes(h.toUpperCase()));
          if (hit) violations.push({
            line: rule.line, src: rule.src, severity: ruleDef.severity, contract: c.id,
            sel: rule.selectors.join(','),
            msg: `${prop} 含禁用色 ${ruleDef.forbidHex.join('/')}（${ruleDef.note || ''}）`
          });
          continue;
        }
        if (ruleDef.expectToken) {
          const isHex = /^#/.test(resolved);
          const isVar = /var\(/.test(rawVal);
          if (isVar) continue;
          if (isHex && PALETTE.has(toPaletteKey(resolved))) continue;
          violations.push({
            line: rule.line, src: rule.src, severity: ruleDef.severity, contract: c.id,
            sel: rule.selectors.join(','),
            msg: `${prop} 须为 token（var 或规范色），实际 ${rawVal}（${ruleDef.note || ''}）`
          });
          continue;
        }
        // RED-013② 修复：条件 at-rule 内的**数值**断言豁免（响应式断点覆盖合法）。
        //   只豁免数值：颜色/token 类断言在上方已各自 continue，仍旧生效。
        if (rule.atRule) continue;
        if (Array.isArray(ruleDef.expect)) {
          const n = num(resolved);
          if (isNaN(n) || !ruleDef.expect.includes(n)) violations.push({
            line: rule.line, src: rule.src, severity: ruleDef.severity, contract: c.id,
            sel: rule.selectors.join(','),
            msg: `${prop} 应为 ${ruleDef.expect.join('/')}，实际 ${rawVal}`
          });
        } else {
          const n = num(resolved);
          if (isNaN(n)) {
            if (!/var\(/.test(rawVal)) violations.push({
              line: rule.line, src: rule.src, severity: ruleDef.severity, contract: c.id,
              sel: rule.selectors.join(','),
              msg: `${prop} 无法解析为数值（期望值 ${ruleDef.expect}），实际 ${rawVal}`
            });
          } else if (n !== ruleDef.expect) {
            violations.push({
              line: rule.line, src: rule.src, severity: ruleDef.severity, contract: c.id,
              sel: rule.selectors.join(','),
              msg: `${prop} 应为 ${ruleDef.expect}，实际 ${rawVal}`
            });
          }
        }
      }
    }
  }
  // A 包新增：:root 变量门禁（仅对 page-template.html 生效，避免破坏未采用新 token 的旧文件）
  // RED-019：只喂纯 CSS（外链 + 内联 <style> 内容），不喂 HTML 正文
  const rootV = isTemplate ? checkRootVars(linkedCss + '\n' + selfCss, {
    elevLevels: ['sunken','default','raised','overlay','overflow'],
    shadowNames: ['--shadow-s','--shadow-m','--shadow-l','--shadow-bottom-nav'],
    durationKeys: ['instant','fast','normal','slow']
  }) : [];
  // RED-018：引用未定义 CSS 变量（无 fallback）→ 该声明整条失效
  const tokenV = checkUndefinedTokens(rules, varsByTheme);
  // M4（2026-08-02）：动效门禁对所有页面生效（不用 isTemplate 门控）
  const motionV = checkMotion(rules);
  // 类名白名单：对照单一真源 template.css + 页面实际外链 CSS（根治自造组件）
  const templatePath = path.join(path.dirname(specPath), 'template.css');
  const tplCss = fs.existsSync(templatePath) ? fs.readFileSync(templatePath, 'utf8') : '';
  const canonicalCss = tplCss + '\n' + linkedCss;
  const whitelistV = canonicalCss.trim()
    ? checkClassWhitelist(html, canonicalCss, selfCss, { ignore: new Set() })
    : [];
  // SVG 绘制属性门禁（任务书 S，2026-08-03）：stroke=/fill=/stop-color= 裸 hex 分级（HIGH 自造 / MEDIUM 调色板内）
  const svgV = checkSvgPaint(html);
  // WCAG 2.0 对比度门禁（2026-08-05 对抗审查 DEFECT-07 补齐：与 Web 端 checkWcagContrast 同款）——
  // 功能色底 + 白字（亮色 n1）等已知禁止组合 → MED；组件模板已改深字 n10/err-fg-deep，拦页面覆盖回归
  const wcagV = checkWcagContrast(rules, varsByTheme);
  // 守则缺口补强（2026-08-06）：覆写检测 / 网格 calc / 自造类 token 化
  // 豁免「内联模板克隆页」（page-template.html 及克隆：selfCss 即 template.css 本体，
  //   组件类目标 ≥40 视为整份模板内联，其样式一致性由既有契约门禁 checkComponentRules 负责）
  const inlineClone = (() => {
    const selfRules = parseRules('<style>' + selfCss + '</style>');
    const canonical = buildDefinedClasses(canonicalCss);
    let n = 0;
    for (const r of selfRules) {
      const t = lastTargetClass(r.selectors);
      if (t && canonical.has(t) && COMPONENT_CLASS_RE.test(t)) n++;
    }
    return n >= 40;
  })();
  const overrideV = inlineClone ? [] : checkOverride(selfCss, canonicalCss);
  const gridV = inlineClone ? [] : checkGrid4px(selfCss);
  const customV = inlineClone ? [] : checkCustomProps(selfCss, canonicalCss);
  // 图表门禁（CHART-SPEC §7，2026-08-06）：容器缺失 / 移动端禁 none 拉伸 / 内容贴 viewBox 右缘
  const chartV = checkChartBox(html);
  const chartStretchV = checkChartSvgStretch(html);
  const chartEdgeV = checkChartViewboxEdge(html);
  // 图表布局门禁（2026-08-06 复盘补强）：SVG 内文字 / 左右对称 / 柱底基线
  const chartLayoutV = checkChartLayout(html);
  // 克隆源内联 :root 与 template.css 一致性门禁（2026-08-06：仅 page-template）
  const templateSyncV = checkTemplateRootSync(html, canonicalCss);
  // HTML 结构配对门禁（2026-08-06）：div 开闭配对 + bottomnav 父链必须是 .phone
  const structV = checkHtmlStructure(html);
  return violations.concat(rootV, tokenV, motionV, whitelistV, svgV, wcagV, gridV, overrideV, customV, chartV, chartStretchV, chartEdgeV, chartLayoutV, templateSyncV, structV);
}

// ===== HTML 结构配对门禁（2026-08-06：展示页测试多 1 个 </div> 把 .phone 提前闭合 → bottomnav 被挤出手机壳，门禁此前未拦截）=====
// 两个约束：
//   1) html.structure.pairing（HIGH）：div 开闭必须配对（多/少闭合都报）
//   2) html.structure.bottomnav（HIGH）：页面含 .bottomnav 时，其父元素必须是 .phone（bottomnav 在手机壳 flex 底部）
// 输入用 stripHtmlComments 后的文本（注释等宽空格替换，不误判注释里的示例标签）。
function checkHtmlStructure(html) {
  const violations = [];
  // body/html 完整性（2026-08-06：展示页测试曾缺 </body>，浏览器容忍但规范页应完整）
  if (!/<body[\s>]/i.test(html)) violations.push({ line: 0, src: 'html', severity: 'HIGH', contract: 'html.structure.body', sel: 'HTML', msg: '缺少 <body> 开标签' });
  if (!/<\/body>/i.test(html)) violations.push({ line: 0, src: 'html', severity: 'HIGH', contract: 'html.structure.body', sel: 'HTML', msg: '缺少 </body> 闭合标签——页面结构不完整' });
  if (!/<\/html>/i.test(html)) violations.push({ line: 0, src: 'html', severity: 'HIGH', contract: 'html.structure.body', sel: 'HTML', msg: '缺少 </html> 闭合标签' });
  const noScript = stripScriptTags(html);
  const lines = noScript.split('\n');
  const stack = [];
  for (let i = 0; i < lines.length; i++) {
    const re = /<div\b[^>]*>|<\/div>/g;
    let m;
    while ((m = re.exec(lines[i]))) {
      const tok = m[0];
      if (tok.startsWith('</div>')) {
        const open = stack.pop();
        if (!open) {
          violations.push({ line: i + 1, src: 'html', severity: 'HIGH', contract: 'html.structure.pairing', sel: 'HTML', msg: `多余的 </div>（第 ${i + 1} 行）——div 配对失败，会导致后续元素被挤出容器（如 bottomnav 移出 .phone）` });
        }
      } else {
        const clsM = tok.match(/class="([^"]*)"/);
        const cls = clsM ? clsM[1] : '';
        if (cls === 'bottomnav' || cls === 'bottomnav bottomnav-ios') {
          const parent = stack[stack.length - 1];
          if (!parent || parent.cls !== 'phone') {
            violations.push({ line: i + 1, src: 'html', severity: 'HIGH', contract: 'html.structure.bottomnav', sel: 'HTML', msg: `.bottomnav 的父元素必须是 .phone（当前父: ${parent ? parent.cls || '?' : '无'}）——bottomnav 不在手机壳 flex 底部会被内容挤出可视区` });
          }
        }
        stack.push({ cls, line: i + 1 });
      }
    }
  }
  stack.forEach(s => violations.push({ line: s.line, src: 'html', severity: 'HIGH', contract: 'html.structure.pairing', sel: 'HTML', msg: `div 未闭合：<div class="${s.cls}">（第 ${s.line} 行开）——div 配对失败` }));
  if (process.env.DEBUG_STRUCT) console.error('[STRUCT] violations=' + violations.length + ' stack=' + stack.length);
  return violations;
}

function main() {
  const target = process.argv[2] || TARGET_DEFAULT;
  const specPath = process.argv[3] || SPEC_DEFAULT;
  if (!fs.existsSync(target)) { console.error('目标文件不存在: ' + target); process.exit(2); }
  if (!fs.existsSync(specPath)) { console.error('spec 文件不存在: ' + specPath); process.exit(2); }

  console.log(`\n🔍 移动端规范合规扫描`);
  console.log(`   目标: ${path.basename(target)}`);
  console.log(`   规范: ${path.basename(specPath)} (components.json contract)\n`);

  const violations = run(specPath, target);
  const high = violations.filter(v => v.severity === 'HIGH');
  const med = violations.filter(v => v.severity === 'MEDIUM');

  if (violations.length === 0) {
    console.log('✅ 0 违反 — 目标文件全部组件规则符合 components.json 规范合同。\n');
    process.exit(0);
  }

  for (const v of violations.sort((a, b) => (a.severity === b.severity ? a.line - b.line : a.severity === 'HIGH' ? -1 : 1))) {
    const tag = v.severity === 'HIGH' ? '🔴 HIGH' : '🟡 MED';
    // RED-002：外链 CSS 的违规须标注来源文件，否则行号指向目标 HTML 会误导定位
    const where = v.src ? `${v.src}:L${v.line}` : `L${v.line}`;
    // RED-018：输出前统一把内部哨兵还原成 var(--x)，内部标记绝不出现在报告里
    console.log(`${tag}  ${where}  [${v.contract}]  ${v.sel}`);
    console.log(`       ↳ ${humanize(v.msg)}`);
  }
  console.log(`\n📊 共 ${violations.length} 项：HIGH ${high.length} / MEDIUM ${med.length}`);
  if (high.length > 0) {
    console.log('❌ 存在 HIGH 违反，exit 1（应作为交付门禁拦截）。\n');
    process.exit(1);
  }
  console.log('⚠️  仅 MEDIUM，exit 0（建议修复但不阻断）。\n');
  process.exit(0);
}

if (require.main === module) main();

module.exports = { checkHtmlStructure };
