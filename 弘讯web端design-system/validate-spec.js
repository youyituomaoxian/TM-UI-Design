#!/usr/bin/env node
/*
 * validate-spec.js — 弘讯B端设计系统 · 规范合规扫描器
 *
 * 数据源：与本文件同目录的 components.json（contract 字段为机器可校验硬约束）。
 * 用途：扫描任意 HTML/CSS 的 <style> 组件规则，对照 contract 检查尺寸/字重/半径/色值，
 *       捕获「教规范的文档自己没守规范」类回归（如按钮字重 600、非 token 硬编码色）。
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

// NEW-008 修复（2026-08-01）：色板白名单不再全靠手写。
//   原实现把「合法 token 色」硬编码在此，与 tokens.json 各自演化 —— 实测已漏掉
//   tokens.json chart.alertRed `#FF4D4D`，导致 template.css 里的合法图表 token 被误报为
//   「非 token 硬编码色」。与 NEW-006 同类根因：门禁自带一份会过期的真源副本。
//   现改为运行时从 tokens.json 全量抽取 hex 叶子，下面这份手写清单降级为
//   「tokens 之外的示例/客户演示色」显式白名单（保留以便审计，union 合并）。
const PALETTE_EXTRA = new Set([
  // primary
  '#005EAE','#1A75D2','#004A8F','#DAEAFA','#A0B4C0',
  // secondary
  '#0A84FF','#3DA0FF','#0066CC',
  // neutral N1-N11
  '#FFFFFF','#FAFAFA','#F6F9FC','#F5F7FB','#EAEAED','#DEE2E6','#CED4DA','#ADB5BD','#6C757D','#334155','#212532',
  // functional
  '#389E0D','#52C41A','#237804','#F6FFED','#FA8C16','#FFF7E6','#FFA940','#D46B08','#F5222D','#FFF1F0','#FF4D4F','#CF1322',
  // running green
  '#16A34A','#ECFDF5','#BBF7D0','#22C55E','#15803D',
  // chart
  '#00A3E0','#00C7BE','#00D4A1','#FF9500','#8A5CF5','#FF66C2',
  // client (例3 暗色示例)
  '#42EED8','#71F2E2','#003125','#0A1F1A',
  // mobile tokens (文档/示例中出现，合法)
  '#10B981','#059669','#F59E0B','#EF4444','#0E7490','#003868','#0061FF','#1D4ED8','#D97706','#DC2626','#A78BFA','#8B5CF6','#06B6D4','#EC4899'
].map(c => c.toUpperCase()));

// 运行时装配的实际色板 = PALETTE_EXTRA ∪ tokens.json 全量 hex 叶子（在 run() 里赋值）
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

// fail-closed：tokens.json 是 components.json 的同目录必备真源，缺失/损坏直接报错，
// 不静默退化成「只有手写清单」的宽松模式（那会把大批合法 token 判成违规、逼人忽略门禁）。
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

// ===== RED-018 修复（2026-08-01）：未定义 token 用哨兵标记，而非拼残缺括号 =====
// 原实现 fallback 拼 `'var(--' + n`（**故意少一个右括号**）纯粹是为了让下一轮
//   /var\(--[\w-]+\)/ 失配从而跳出 while —— 一种把「终止条件」寄生在「损坏数据」上的 hack。
// 两个后果：① 残缺串流进错误消息，输出 `实际 1px solid var(--nope` 这种误导文本；
//   ② 「引用了不存在的变量」这一确凿缺陷（浏览器中该声明直接失效）**没有任何分支上报**，
//      expectToken 更是遇 var( 就 continue 放行 —— 而这恰是「Agent 自造 token」最典型的表现。
// 改为可识别哨兵：既能终止循环，又能被 checkUndefinedTokens 精确捕获并定位变量名。
// 注意：仅匹配无 fallback 的 var(--x)；var(--x, 默认值) 是合法防御写法，不视为未定义。
const UNDEF_TOKEN = '\u0000UNDEF\u0000';
// 两条正则分工，避免 /g 的 lastIndex 在 test() 上留状态导致隔次漏判：
const VAR_REF_G = /var\(\s*--([\w-]+)\s*\)/g;  // replace / exec 遍历用
const VAR_REF_1 = /var\(\s*--[\w-]+\s*\)/;     // test 用（无 g，无状态）
function markUndef(n) { return UNDEF_TOKEN + n + UNDEF_TOKEN; }
function undefNames(s) {
  const out = [];
  const re = new RegExp(UNDEF_TOKEN + '([\\w-]+)' + UNDEF_TOKEN, 'g');
  let m;
  while ((m = re.exec(String(s)))) out.push('--' + m[1]);
  return out;
}

// 把 {var → 原始值} 表逐层展开成最终值（var(--x) → 实际值），未定义的变量打哨兵以终止循环
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

// 抽取 :root / 任意 --var 定义并做一次变量解析（var(--x) → 实际值）
function extractVars(css) {
  const map = {};
  const re = /(--[\w-]+)\s*:\s*([^;{}]+)/g;
  let m;
  while ((m = re.exec(css))) map[m[1]] = m[2].trim();
  return flattenVars(map);
}

// ===== NEW-007 修复（2026-08-01）：变量解析必须按主题作用域切分 =====
// 实测缺陷：extractVars 把所有 --var 定义无视作用域压成一张 last-wins 表。
//   page-template.html 场景下得到 --text-on-brand = var(--n11)（取自 template.css:L516 暗色块）
//   却配上 --n11 = #212532（取自页面内联 <style> 的亮色块）→ 解析出 #212532。
//   这个「亮中性 + 暗语义别名」的嵌合体在浏览器任何一个主题下都不存在，
//   于是 checkSurfaceSelection 判定「品牌表面选中文字不是白色」而误报 —— 实际两个主题都是 #FFFFFF。
// 修法：按规则块选择器是否含 [data-theme="dark"] 分流，产出 light / dark 两张表，
//   dark 表 = light 表叠加暗色覆盖（符合 CSS 级联语义）。检查时按规则自身所属主题取表。
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
// 规则所属主题：选择器带 [data-theme="dark"] → 暗色，否则按亮色求值
// （无作用域规则在暗色下若需不同表现，规范要求另写 :root[data-theme="dark"] 覆盖规则，
//   那条覆盖规则会被单独按暗色表校验，因此不会漏检。）
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
// 供错误消息使用：把哨兵还原成人类可读的 var(--x)，避免把内部标记打进报告
function humanize(s) {
  return String(s).replace(new RegExp(UNDEF_TOKEN + '([\\w-]+)' + UNDEF_TOKEN, 'g'), 'var(--$1)');
}

function num(v) {
  const m = String(v).match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : NaN;
}

// RED-017 修复（2026-08-01）：hex 归一化须覆盖 4/5/9 位（带 alpha）形态。
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

// 剥离 CSS 注释：用等长空格替换（保留字符偏移与行号，供上层行号换算复用）。
// 不剥离会有两个后果：① 注释被 ([^{}]+)\{ 吞进选择器，报告里选择器显示成整段注释、
// 行号指向注释首行；② 注释里的 hex 色（如 /* 参考 #ABCDEF */）被 hexList 当成硬编码违规。
function stripCssComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '));
}

// RED-013③ 修复（2026-08-01）：剥离 HTML 注释（同样等宽空格替换以保偏移/行号）。
// 不剥离的后果：被 <!-- --> 注释掉的旧版 <style>/<link>/class 全部照常参与判定 ——
//   「删代码要连注释一起删」这种要求不可能长期成立，注释掉的死代码会持续产生违规，
//   最终逼人给门禁加 ignore。凡以 HTML 文本为输入的扫描一律先过这一层。
function stripHtmlComments(html) {
  return html.replace(/<!--[\s\S]*?-->/g, m => m.replace(/[^\n]/g, ' '));
}

// ===== RED-013② 修复（2026-08-01）：at-rule 感知 =====
// 原正则 /([^{}]+)\{([^{}]*)\}/ 完全不理解嵌套，@media 内的规则被**拍平成基态规则**：
//   `@media (max-width:640px){ .hero-num{font-size:44px} }` 解析出 {sel:'.hero-num', decl:'font-size:44px'}，
//   媒体条件被丢弃 → 响应式断点里的合法覆盖值被当基态参与 contract 数值比对 = 假阳性。
// 同时 @keyframes 内的 `0%,100%{opacity:1}` 也会被当成组件规则（selector 是 `0%`）。
// 分两类处置：
//   cond（@media/@supports/@container/@layer/@scope）→ 下钻解析，但给规则打 atRule 标记，
//     数值型断言跳过（断点覆盖合法），颜色/token 类断言照常执行（颜色不应因断点变成硬编码）。
//   skip（@keyframes/@font-face/@property/@counter-style/@page）→ 整块跳过，内部不是组件规则。
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
// 某偏移处的 at-rule 上下文：命中任一 skip 区间即整体跳过；多层 cond 条件串联展示
function atCtxAt(ranges, idx) {
  let cond = null;
  for (const r of ranges) {
    if (idx < r.start || idx >= r.end) continue;
    if (r.kind === 'skip') return { skip: true, cond: null };
    cond = cond ? cond + ' / ' + r.cond : r.cond;
  }
  return { skip: false, cond };
}

// 从 <style> 中抽取规则 {selectors:[], decl, line, atRule?}
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
      // 行号取「选择器实际起点」而非匹配起点：([^{}]+) 会贪婪吞掉规则前的空行/已剥离注释留下的空白，
      // 直接用 m.index 会把行号指到前一条规则结束处（RED-021 遗留的另一半行号漂移）。
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

// ===== RED-002 修复（2026-08-01）：样式来源收集 — 内联 <style> + <link> 外链本地样式表 =====
// 背景：原实现只解析内联 <style>。agent-starter.html 全篇 73 行、零个 <style>，
//   样式全部来自 <link rel="stylesheet" href="template.css"> → parseRules 返回 0 条规则，
//   整个 components.json contract 扫描（尺寸/字重/半径/硬编码色）静默空过 = fail-open 旁路。
//   同时 625 行的单一真源 template.css 自身从未被合同扫描。
// 安全边界（参照 build-app.js RED-010 的 WRITE_ROOT 约束）：
//   只跟随本地相对路径；拒绝 http(s):/协议相对///data: 等外部来源；
//   解析后的绝对路径必须仍位于仓库根内；必须是已存在的文件；同一文件只读一次。
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
    if (/^(?:[a-z][a-z0-9+.\-]*:|\/\/)/i.test(href)) continue;     // http(s): / data: / 协议相对 → 不跟随
    const abs = path.resolve(dir, href.split(/[?#]/)[0]);
    const relToRoot = path.relative(REPO_ROOT, abs);
    if (!relToRoot || relToRoot.startsWith('..') || path.isAbsolute(relToRoot)) continue; // 越出仓库根 → 拒绝
    if (seen.has(abs)) continue;
    seen.add(abs);
    if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) continue;
    out.push({ abs, label: relToRoot.replace(/\\/g, '/'), css: fs.readFileSync(abs, 'utf8') });
  }
  return out;
}

// 抽取页面自身内联 <style> 的纯 CSS 文本（NEW-001 判定「自定义但会渲染」用）
function inlineStyleCss(fullText) {
  // RED-06 修复：同样先剥 <script>（等宽替换），防脚本内 <style> 字符串冒充真实样式
  const noScript = stripScriptTags(fullText);
  const re = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  const parts = [];
  let m;
  while ((m = re.exec(noScript))) parts.push(m[1]);
  return parts.join('\n');
}

// 从纯 CSS 文件抽规则；line = 该 CSS 文件内的行号，src = 来源文件标签（区别于目标 HTML 行号）
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
  // RED-021 修复（与移动端同步）：子串匹配会把 .navbar-main/.navbar-back 等子元素
  // 误判为组件本体，套上「容器契约」→ 误报。改为「空格分隔的复合选择器片段」精确匹配：
  // pattern 的每个片段（类名/元素标签）须全部出现在规则选择器中 ——
  // ① .navbar-main ≠ .navbar（子元素天然排除）② .table th 与 .table td 的 th/td 标签保留（表头/表体区分）
  // ③ 伪类/属性选择器剥离后比较（.mbtn:hover 仍命中 .mbtn）。
  const segs = String(pattern).split(/\s+/).map(cleanSeg).filter(Boolean);
  if (!segs.length) return ruleSel.some(s => s.includes(pattern)); // 非选择器（:root 等）退回子串
  return ruleSel.some(s => {
    const parts = String(s).split(/\s+/).map(cleanSeg).filter(Boolean);
    return segs.every(seg => parts.includes(seg));
  });
}

// A 包新增（2026-07-30）：:root 变量门禁 — elevation/motion 新 token 组存在 + shadow 双层 + duration 白名单 + easing 合法
// 只加不删：不影响既有 contract 扫描。opts 按端配置（shadow 名不同）。仅对 page-template.html 生效。
// RED-019 修复（2026-08-01）：只把「无属性选择器的裸 :root{}」内容喂给存在性检查。
//   原实现 `while (re.exec(html))` 对整份文档无差别扫描，从不看变量落在哪个块里 ——
//   把 --elev-raised-shadow 写在 :root[data-theme="dark"]{}、.some-widget{} 甚至注释里
//   都能满足「须在 :root 定义」。token 没进全局作用域时页面照样失效，门禁却绿灯，
//   属于「检查了个寂寞」的假阴性；叠加 last-wins 后校验的还可能是暗色覆盖值而非基准值。
// 说明：:root[data-density="compact"] 这类**派生覆盖块**被正确排除；基准值本就应在裸 :root，
//   实测 template.css:L71 的 density 基态定义确在裸 :root{} 内，不会误伤。
// 输入必须是**纯 CSS**（外链 CSS + 内联 <style> 内容），不要直接喂 HTML 全文：
//   文档正文里 <code>:root{--shadow-card:…}</code> 这类代码示例同样会被块解析命中，
//   等于「把讲解文本当成实现」来放行门禁 —— 与 RED-019 是同一类作用域失控。
//   这里仍保留 <style> 标签剥离作为兜底（等宽空格，保偏移），使函数对两种输入都安全。
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
      // 允许 :root 与 html 作为全局根；任何附加条件（属性/类/伪类/后代）一律不算
      // （已按 ',' 拆分，故这里只需比对单个选择器；`:root,html` 组合会被拆成两项各自命中）
      return t === ':root' || t === 'html';
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
  // 3. motion duration 白名单（2026-08-04 M=4 适度放宽：100/200/300/400 → 120/240/360/480，与 tokens.json 对齐）
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

// ===== 表面感知选中门禁（2026-07-31 新增，RULES.md §3.6）=====
// 背景：作业树坐在品牌色侧栏上，却沿用「白底表面」的浅 primary-dis-bg 选中 chip
//（--primary-dis-bg 语义是禁用态），在蓝底上读作「逃出来的禁用块」而非选中。
// 两条高精度检查，只在能确证「树坐在品牌表面」时才报，避免误伤白底树：
//   S1 自相矛盾：.tree-node 默认文字是白色（=只可能坐在深/品牌表面），
//      但 .tree-node.on 背景仍是 primary-dis-bg / #DAEAFA。
//   S2 品牌作用域写错：.sidebar/.demo-sidebar/.tree--brand 下的 .tree-node.on
//      背景用了 primary-dis-bg / #DAEAFA。
const BRAND_SCOPES = ['.sidebar', '.demo-sidebar', '.tree--brand'];
function isWhiteish(val, vars) {
  if (!val) return false;
  const v = val.trim().toLowerCase();
  if (/var\(\s*--n1\s*\)/.test(v) || /var\(\s*--n11\s*\)/.test(v)) return true;
  const r = resolve(val, vars);
  return typeof r === 'string' && /^#(fff|ffffff)$/i.test(r.trim());
}
function isDisabledChip(val, vars) {
  if (!val) return false;
  if (/var\(\s*--primary-dis-bg\s*\)/i.test(val)) return true;
  const r = resolve(val, vars);
  return typeof r === 'string' && /#daeafa/i.test(r);
}
// NEW-007：改收 {light,dark} 双表，按规则自身主题求值，杜绝跨主题嵌合体误报
function checkSurfaceSelection(rules, varsByTheme) {
  const violations = [];
  const vOf = r => (r.theme === 'dark' ? varsByTheme.dark : varsByTheme.light);
  const hit = sel => rules.filter(r => r.selectors.some(sel));
  // 页面自定义的树默认态 / 选中态（不带品牌作用域前缀）
  const plainDefault = hit(s => /(^|[\s,])\.tree-node$/.test(s.trim()));
  const plainOn = hit(s => /^\.tree-node\.on$/.test(s.trim()));
  const brandOn = hit(s => BRAND_SCOPES.some(b => s.includes(b)) && s.includes('.tree-node.on') && !s.includes('.tree-sw'));

  // S1：默认白字（=品牌/深表面树）却用浅 chip 当选中，且没有品牌作用域覆盖来纠正
  const defaultIsWhite = plainDefault.some(r => isWhiteish(declMap(r.decl)['color'], vOf(r)));
  if (defaultIsWhite && brandOn.length === 0) {
    for (const r of plainOn) {
      const bg = declMap(r.decl)['background'] || declMap(r.decl)['background-color'];
      if (isDisabledChip(bg, vOf(r))) {
        violations.push({
          line: r.line, src: r.src, severity: 'HIGH', contract: 'surface.tree.selected-on-brand',
          sel: r.selectors.join(','),
          msg: '树默认文字为白色（说明坐在品牌/深色表面），选中态却用 --primary-dis-bg(#DAEAFA) 浅 chip —— 该色语义是「禁用态」。品牌表面选中须为 --primary-active 实底 + 白字（亮 --n1 / 暗 --n11），不用左侧白强调条。见 RULES.md §3.6'
        });
      }
    }
  }
  // S2：品牌作用域下的选中态直接写错
  for (const r of brandOn) {
    const dm = declMap(r.decl);
    const vars = vOf(r);
    const bg = dm['background'] || dm['background-color'];
    if (isDisabledChip(bg, vars)) {
      violations.push({
        line: r.line, src: r.src, severity: 'HIGH', contract: 'surface.tree.selected-on-brand',
        sel: r.selectors.join(','),
        msg: '品牌色表面(.sidebar/.demo-sidebar/.tree--brand)下的树选中态用了 --primary-dis-bg(#DAEAFA) 禁用态色，须改为 --primary-active 实底 + 白字。见 RULES.md §3.6'
      });
    }
    if (bg && !isDisabledChip(bg, vars) && dm['color'] && !isWhiteish(dm['color'], vars)) {
      violations.push({
        line: r.line, src: r.src, severity: 'HIGH', contract: 'surface.tree.selected-on-brand',
        sel: r.selectors.join(','),
        msg: `品牌色表面下的树选中文字须为白（亮 --n1 / 暗 --n11），实际 ${dm['color']}。见 RULES.md §3.6`
      });
    }
  }
  return violations;
}

// T6：B 端后台固定框架 — 品牌表面作业树每个节点（含二级子节点）必须带 .tree-ico 图标
// 按 class 属性内的独立类名计数（RED-020：避免 \btree-node\b 误匹配 BEM 派生类 tree-node-label）
function countClassInHtml(html, cls) {
  // RED-08 修复：class 属性兼容单/双/无引号（HTML 三种写法均合法）
  const re = /class\s*=\s*(?:["']([^"']*)["']|([^\s>]+))/g;
  let m, n = 0;
  while ((m = re.exec(html))) {
    if ((m[1] || m[2] || '').split(/\s+/).includes(cls)) n++;
  }
  return n;
}
function extractBrandBlocks(html) {
  const blocks = [];
  // RED-08 修复：open 标签 class 属性兼容单/双/无引号
  const openRe = /<(aside|div|nav)\b([^>]*?)\bclass\s*=\s*(?:["']([^"']*)["']|([^\s>]+))([^>]*)>/g;
  let m;
  while ((m = openRe.exec(html))) {
    const cls = m[3] || m[4];
    if (!/\b(sidebar|demo-sidebar|tree--brand)\b/.test(cls)) continue;
    const tag = m[1];
    const innerStart = m.index + m[0].length;
    let depth = 1, i = innerStart;
    const closeStr = '</' + tag + '>';
    while (i < html.length && depth > 0) {
      const ic = html.indexOf(closeStr, i);
      if (ic === -1) break;
      let nextOpen = -1, scan = i;
      while (scan !== -1) {
        const p = html.indexOf('<' + tag, scan);
        if (p === -1) break;
        const after = html[p + 1 + tag.length];
        if (after === ' ' || after === '>' || after === '\t' || after === '\n' || after === '/') { nextOpen = p; break; }
        scan = p + 1;
      }
      if (nextOpen !== -1 && nextOpen < ic) { depth++; i = nextOpen + 1; }
      else { depth--; i = ic + closeStr.length; }
    }
    // RED-08 修复：未闭合品牌块（畸形 HTML）→ fail-closed 扫描至文末，不再整块静默跳过
    if (depth > 0) i = html.length;
    blocks.push({ cls, inner: html.slice(innerStart, i - (depth === 0 ? closeStr.length : 0)) });
  }
  return blocks;
}

function checkTreeIcons(html) {
  const violations = [];
  for (const b of extractBrandBlocks(html)) {
    const nodeCount = countClassInHtml(b.inner, 'tree-node');
    const icoCount = countClassInHtml(b.inner, 'tree-ico');
    if (nodeCount > icoCount) {
      violations.push({
        line: 0, severity: 'HIGH', contract: 'tree.node.icon-required',
        sel: '.' + b.cls + ' .tree-node',
        msg: 'B 端后台固定框架：品牌表面(' + b.cls + ')作业树每个节点（含二级子节点）必须带 .tree-ico 图标。实际树节点 ' + nodeCount + ' 个、图标 ' + icoCount + ' 个。见 RULES.md §0 / components.json#tree'
      });
    }
  }
  return violations;
}

// ===== 类名白名单门禁（根治「Agent 自造组件」；2026-08-01 新增）=====
// 第一性原理：template.css 已是 globals+components+framework+utilities 合并的【单一真源】，
//   HTML 页面出现 CSS 未定义的类 = Agent 脱离规范自造组件 → 必漂移。
// 做法：收集 template.css 所有 .foo 类名（含复合选择器如 .tree-node.on 中的 on），
//   对照页面 class="..." 实际使用的类名，未命中即 HIGH。
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
// NEW-001 修复（2026-08-01）：类名判定分两级，杜绝「页面自己 <style> 定义了却报不渲染」的假阳性。
//   原实现只拿 template.css 比对，USAGE.html 的 43 个 .doc-* 文档脚手架类全被误判 HIGH，
//   而这些类实实在在定义在该页 <style>(L24-154) 里、渲染完全正常 —— 假阳性会训练人忽略门禁。
// 分级（严重性反映真实后果，不靠文件名豁免）：
//   ① 真源(template.css + 页面外链 CSS) 与 页面自身 <style> 都没有 → HIGH class.undefined
//      = 样式根本不渲染，是漂移/断样式的真实根因，逐条报以便定位。
//   ② 只在页面自身 <style> 有 → MEDIUM class.self-defined
//      = 会渲染，但脱离单一真源，长期漂移风险；聚合成 1 条，保持信噪比。
// ===== RED-018 上报侧：引用未定义 CSS 变量 =====
// 这是确凿的真实缺陷（该声明在浏览器中直接失效），此前是门禁的完全盲区：
//   resolve 把它悄悄变成残缺串，expectToken 分支更是遇 var( 就 continue 放行。
//   而「引用不存在的 token」正是 Agent 自造 token 最常见的表现形式，
//   与 class.undefined 想根治的是同一类漂移，理应同级别对待。
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
      msg: `引用了未定义的 CSS 变量 ${name}（共 ${info.count} 处）—— 浏览器中该声明整条失效，属「自造 token」漂移。请改用 tokens.json / template.css 已有变量；若确需新增，先进 tokens 真源再 npm run build:template。（如为有意的可选覆盖，请写成 var(${name}, 兜底值)）`
    });
  }
  return violations;
}

function checkClassWhitelist(html, canonicalCss, selfCss, opts) {
  const violations = [];
  const canonical = buildDefinedClasses(canonicalCss);
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
      msg: `.${c} 在 template.css 单一真源与页面自身 <style> 中均无定义 —— 该样式不会渲染（漂移真实根因）。请改用规范类；若确为合法新增，请先加入 components.css/utilities.css 后跑 npm run build:template 重新生成 template.css。`
    });
  }
  if (selfOnly.length) {
    selfOnly.sort();
    violations.push({
      line: 0, severity: 'MEDIUM', contract: 'class.self-defined',
      sel: selfOnly.slice(0, 5).map(c => '.' + c).join(' ') + (selfOnly.length > 5 ? ` …共 ${selfOnly.length} 个` : ''),
      msg: `页面自身 <style> 定义了 ${selfOnly.length} 个 template.css 之外的类（会正常渲染，但脱离单一真源，长期有漂移风险）：${selfOnly.map(c => '.' + c).join(', ')}。文档/演示脚手架可接受；若属通用组件，请沉淀进 components.css/utilities.css 再 build:template。`
    });
  }
  return violations;
}

// ===== 守则缺口补强（2026-08-06 用户拍板 P2 解禁）：覆写检测 / 网格 calc / 自造类 token 化 =====
const COMPONENT_CLASS_RE = /^(mbtn|mtag|mlist|mcard|msearch|mtabs|mtab|m-hero|m-kingkong|m-kk|m-porcelain|m-po|m-capsule|m-dot|m-progress|m-switch|m-stepper|m-textarea|m-upload|m-skeleton|m-empty|m-notice|m-cell|m-item|m-avatar|m-statusbar|m-home-indicator|mmodal|mdialog|mmask|m-dialog|navbar|bottomnav|bn-|toast|section-title|kv-|chart-|spinner|btn|table|tree|topbar|sidebar|footer|form|input|sel-|card|tag|badge|tabs|pager|modal|sheet|dropdown|accordion|collapse|breadcrumb|alert|stat-|kpi-|status-dot|radio|checkbox|switch|progress|skeleton|pagination|callout|group-title)/;

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

// G4 硬执行：页面自造类布局 px（含 calc 内）须 %4==0 → MED；:root 变量定义豁免
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
        msg: `自造类 .${target} 内裸 font-size:${fm[1]}px —— 文字层级须走语义类（移动 .m-text-* / Web .t-*，自造守则 ③）。`
      });
    }
  }
  return violations;
}
// 拍板分级（taskbook M4）：transition 时长裸数字秒 → HIGH（交互反馈必须统一节奏）；
//   animation 时长裸数字秒 → MEDIUM（持续状态指示周期天然可超 4 档 token 上限——
//   .spinner .8s / .skeleton 1.5s 属合理持续动画，MEDIUM 级保留）。
// 白名单：0s/0ms（即时切换合法）；var(--motion-duration-*)（token 引用）。
// 只扫组件规则（页面 <style> + 外链 CSS，即 parseRules/parseCssRules 产出的规则列表）；
//   @keyframes 块内部不扫（atCtxAt 已把 skip 块整块跳过）。
// 简写与单属性都查：transition/transition-duration/animation/animation-duration；
//   逗号多段每段独立判定。
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
// 简写段内找 duration：transition/animation 的第一个时间值即 duration（delay 是第二个时间值）
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
        // 其余裸值（数字秒 / 裸 key 名）→ 按拍板分级
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

// ===== 图表容器门禁（任务书 B，2026-08-03）：canvas 图表必须挂 .chart-box 容器 =====
// 轻量设计（不误伤基线——现有页面 0 个 <canvas>，实测）：
//   探测 <canvas> 元素，向上找最近带 class 的容器，无 .chart-box → MEDIUM chart.container.missing。
//   定级 MEDIUM 不阻断：历史页面可能有图表无容器类，HIGH 会误伤存量（拍板设计）。
//   先剔除 <script> 块再扫，避免 ECharts 配置字符串（renderer:'canvas' / 模板串）误报。
function stripScriptTags(html) {
  // RED-06 修复：等宽空格替换（保留换行与字符偏移），而非删除 —— 否则 <script> 之后的行号全数漂移
  return html.replace(/<script[\s\S]*?<\/script>/gi, m => m.replace(/[^\n]/g, ' '));
}
function checkChartBox(html) {
  const violations = [];
  const noScript = stripScriptTags(html);
  const canvasRe = /<canvas\b[^>]*>/gi;
  let m;
  while ((m = canvasRe.exec(noScript))) {
    // 向上找 canvas 之前最近一个带 class 的打开标签，取其 class 属性值作容器判断
    const before = noScript.slice(0, m.index);
    const openTags = before.match(/<[a-zA-Z][^>]*\bclass="[^"]*"[^>]*>/g);
    const last = openTags && openTags.length ? openTags[openTags.length - 1] : null;
    const clsMatch = last ? /class="([^"]*)"/.exec(last) : null;
    const cls = clsMatch ? clsMatch[1] : '';
    if (!cls.split(/\s+/).includes('chart-box')) {
      violations.push({
        line: 0, severity: 'MEDIUM', contract: 'chart.container.missing',
        sel: 'canvas',
        msg: 'canvas 图表须挂载在 .chart-box 容器内（定高防留白失控）：<canvas> 外层最近带 class 的容器是「' + (cls || '无 class') + '」，缺少 .chart-box。canvas 本体请加 .chart-canvas 占满容器。见 GENERATION-SOP 图表生成规范 / components.json#chart-box'
      });
    }
  }
  return violations;
}

// ===== 组件 DOM 契约门禁（2026-08-04，RULES §3.7）=====
// 背景：机器群览页实测 3 类执行级缺陷（按钮文字竖排截断 / 5 张 KPI 第 5 张掉行 /
//   折线图未撑开），根因全是「CSS 真源已就位、HTML 没按契约组 DOM」——旧门禁只扫
//   CSS 规则，不扫 HTML 结构 → 结构盲区。以下 3 条契约全部先 stripScriptTags（防
//   JS 模板字符串误报），行号统一 0（同 checkChartBox）。
//   ① btn.label.required（HIGH）：button 含 .btn-ico 时必须含 .btn-label 子节点
//   ② stat-grid.count.match（HIGH）：.stat-grid 直接子卡片数须与 --N 后缀一致
//   ③ chart.svg.fill（MEDIUM）：svg.chart-svg 带 preserveAspectRatio=meet → 改 --fill

// 统计容器区间内「直接子元素」数量（标签栈：相对容器 depth 0 时计数；self-closing 不入栈）
function countTopLevelChildren(html, startIdx, endIdx) {
  let depth = 0, count = 0;
  const re = /<(\/)?([a-zA-Z][a-zA-Z0-9-]*)(?:\s[^>]*?)?(\/?)>/g;
  re.lastIndex = startIdx;
  let m;
  while ((m = re.exec(html)) && m.index < endIdx) {
    if (m[3] === '/') continue; // self-closing
    if (m[1]) { if (depth === 0) break; depth--; }
    else { if (depth === 0) count++; depth++; }
  }
  return count;
}

// 提取 .stat-grid 容器：返回 [{openEnd（' >' 之后下标）, closeStart（'</' 下标）, cls, n（--N 或 null）}]
function findStatGrids(html) {
  const out = [];
  const openRe = /<div\b[^>]*\bclass="([^"]*\bstat-grid(?:--\d+)?\b[^"]*)"[^>]*>/g;
  let om;
  while ((om = openRe.exec(html))) {
    const openTagEnd = om.index + om[0].length;
    // 标签栈配对闭合 </div>
    let depth = 1, i = openTagEnd, closeIdx = -1;
    const tagRe = /<(\/?)(div)\b[^>]*>/g;
    tagRe.lastIndex = i;
    let tm;
    while ((tm = tagRe.exec(html))) {
      if (tm[1]) { depth--; if (depth === 0) { closeIdx = tm.index; break; } }
      else depth++;
    }
    if (closeIdx === -1) continue; // 未配对，跳过
    const cls = om[1];
    const nMatch = /\bstat-grid--(\d+)\b/.exec(cls);
    out.push({ openEnd: openTagEnd, closeStart: closeIdx, cls, n: nMatch ? Number(nMatch[1]) : null });
    openRe.lastIndex = closeIdx; // 跳过已配对区间，防嵌套 stat-grid 重复计
  }
  return out;
}

function checkStatGridCount(html) {
  const violations = [];
  const noScript = stripScriptTags(html);
  for (const g of findStatGrids(noScript)) {
    const count = countTopLevelChildren(noScript, g.openEnd, g.closeStart);
    const expect = g.n === null ? 4 : g.n;
    if (count !== expect) {
      violations.push({
        line: 0, severity: 'HIGH', contract: 'stat-grid.count.match', sel: g.cls,
        msg: `.stat-grid 直接子卡片 ${count} 张，但容器声明 ${g.n === null ? '基础类（默认 4 列）' : '--' + g.n}——卡数 ≠ 4 必须用 stat-grid--N（N=实际卡数），否则第 ${Math.min(count, expect) + 1} 张卡掉行只占 1/4 宽。见 RULES §3.7 / components.json#stat-grid`
      });
    }
  }
  return violations;
}

function checkBtnLabel(html) {
  const violations = [];
  const noScript = stripScriptTags(html);
  const btnRe = /<button\b[^>]*>([\s\S]*?)<\/button>/gi;
  let m;
  while ((m = btnRe.exec(noScript))) {
    const inner = m[1];
    if (!/\bclass="[^"]*btn-ico[^"]*"/.test(inner)) continue; // 无图标 → 契约不适用
    if (!/\bclass="[^"]*btn-label[^"]*"/.test(inner)) {
      violations.push({
        line: 0, severity: 'HIGH', contract: 'btn.label.required', sel: m[0].slice(0, 60),
        msg: '带 .btn-ico 的按钮文字必须用 <span class="btn-label"> 包裹（white-space:nowrap 兜底）——文字裸放会在容器收窄时逐字断行竖排截断。见 RULES §3.7 / components.json#button'
      });
    }
  }
  return violations;
}

function checkChartSvgFill(html) {
  const violations = [];
  const noScript = stripScriptTags(html);
  const svgRe = /<svg\b[^>]*>/gi;
  let m;
  while ((m = svgRe.exec(noScript))) {
    const tag = m[0];
    const clsMatch = /\bclass="([^"]*)"/.exec(tag);
    const cls = clsMatch ? clsMatch[1] : '';
    if (!/\bchart-svg\b/.test(cls)) continue;             // 非图表 SVG（icon 等）跳过
    if (/\bchart-svg--fill\b/.test(cls)) continue;        // 已用 fill 变体 → meet 检查通过
    if (/preserveAspectRatio\s*=\s*["'][^"']*meet["']/.test(tag)) {
      violations.push({
        line: 0, severity: 'MEDIUM', contract: 'chart.svg.fill', sel: cls,
        msg: 'svg.chart-svg 带 preserveAspectRatio="…meet" 会按 viewBox 等比缩放、撑不满容器（上下/左右留白）——请改 class="chart-svg--fill"（width/height:100% + non-scaling-stroke），或让 viewBox 纵横比匹配容器。见 RULES §3.7 / components.json#chart-box'
      });
    }
  }
  // ② viewbox-edge（2026-08-04 补强）：chart-svg--fill + preserveAspectRatio="none" 时，
  //    内部元素 x 坐标不得贴 viewBox 右边缘（拉伸后被 card-body padding 16px 裁切，实测 21:00→21）。
  //    规则：所有元素（polyline/path points / text x / circle cx / line x2）最大 x ≤ viewBox 宽 - 20。
  const fillRe = /<svg\b[^>]*\bclass="([^"]*chart-svg--fill[^"]*)"[^>]*>/gi;
  let fm;
  while ((fm = fillRe.exec(noScript))) {
    const tag = fm[0];
    if (!/preserveAspectRatio\s*=\s*["'][^"']*none["']/.test(tag)) continue; // 仅拉伸态需要边距
    const vb = /\bviewBox\s*=\s*["']0 0 (\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)["']/.exec(tag);
    if (!vb) continue;
    const W = parseFloat(vb[1]);
    const svgEnd = noScript.indexOf('</svg>', fm.index);
    const inner = svgEnd === -1 ? '' : noScript.slice(fm.index + tag.length, svgEnd);
    let maxX = -1;
    // polyline/path points：x 坐标为偶数下标
    const ptsRe = /\bpoints\s*=\s*["']([^"']*)["']/g;
    let pm;
    while ((pm = ptsRe.exec(inner))) {
      const nums = pm[1].trim().split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
      for (let i = 0; i < nums.length; i += 2) if (nums[i] > maxX) maxX = nums[i];
    }
    // text x / circle cx / line x2
    const attrRe = /\b(?:x|cx|x2)\s*=\s*["'](\d+(?:\.\d+)?)["']/g;
    let am;
    while ((am = attrRe.exec(inner))) {
      const v = parseFloat(am[1]);
      if (v > maxX) maxX = v;
    }
    if (maxX >= W) {
      violations.push({
        line: 0, severity: 'MEDIUM', contract: 'chart.svg.viewbox-edge', sel: fm[1],
        msg: `svg.chart-svg--fill（preserveAspectRatio="none" 拉伸态）内部元素最大 x=${maxX} 贴 viewBox 右边缘（宽 ${W}）——拉伸后末端 X 轴标签会被 card-body padding 16px 裁切（实测 21:00 → 21）。请把 viewBox 宽度改为 ${Math.round(maxX + 20)}（留 ≥20px 内部边距），数据元素末端 x 保持 ≤ viewBox 宽-20。见 RULES §3.7 配套约定 5`
      });
    }
  }
  return violations;
}

// ===== 图表布局门禁（2026-08-06 复盘补强，CHART-SPEC §3/§7）：SVG 内文字 / 数据区左右对称 / 柱底对齐基线 =====
// ① chart.text.inline（MED）：svg.chart-svg 内禁 <text>（文字 HTML 层铁律——none 拉伸变形，1:1 也不利样式 token）
// ② chart.symmetry（MED）：网格线 x1+x2=viewBox 宽；柱 minX+maxRight=W；折线 min+max points x=W（左右留白一致，血泪：Web 15/35、移动 44 单位）
// ③ chart.baseline（MED）：柱底 max(y+h) 对齐最下网格线 y（差 ≤2，柱底悬空无基线 = 漂移）
// 环状图（chart-ring-svg 定尺寸）无对称/基线概念 → 跳过；横向柱状图无网格线 → 仅跳过基线
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
    // ① SVG 内 text
    if (/<text\b/i.test(inner)) {
      violations.push({
        line: 0, severity: 'MEDIUM', contract: 'chart.text.inline', sel: cls,
        msg: 'SVG 内禁放 <text>（none 拉伸会变形；1:1 也不利样式 token）——轴标签/数值/图例一律 HTML 叠层（.chart-x-labels / .chart-v / .chart-hl/.chart-hr / .chart-ring-center）。见 CHART-SPEC §1③'
      });
    }
    // 网格线收集（含目标线，均应对称）
    const gridXs = []; const gridYs = [];
    const lineRe = /<line\b[^>]*>/g;
    let lm;
    while ((lm = lineRe.exec(inner))) {
      const x1m = /\bx1\s*=\s*["']([\d.]+)/.exec(lm[0]);
      const x2m = /\bx2\s*=\s*["']([\d.]+)/.exec(lm[0]);
      const y1m = /\by1\s*=\s*["']([\d.]+)/.exec(lm[0]);
      if (x1m && x2m) { gridXs.push([parseFloat(x1m[1]), parseFloat(x2m[1])]); gridYs.push(y1m ? parseFloat(y1m[1]) : NaN); }
    }
    // ② 对称：网格线
    for (const [x1, x2] of gridXs) {
      if (Math.abs((x1 + x2) - W) > 2) {
        violations.push({
          line: 0, severity: 'MEDIUM', contract: 'chart.symmetry', sel: cls,
          msg: `网格线 x1=${x1} + x2=${x2} ≠ viewBox 宽 ${W}（应 x1+x2=W，左右留白一致）——数据区左右不对称，见 CHART-SPEC §3`
        });
        break;
      }
    }
    // 柱对称 + 基线
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
    // 折线对称
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

// ===== 克隆源内联 :root 与 template.css 一致性门禁（2026-08-06：防克隆页错色，仅 page-template）=====
// 内联 <style> 第一个 :root 须 = template.css 亮色 :root 全量（内联后加载会覆盖真源值；曾因未同步克隆页显示旧 hex 而非 oklch）
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

// ===== col 内卡片对齐门禁（2026-08-04，RULES §4.4）：grid12 区间内 col-* 直接子 .card 须 card--fill =====
// 背景：col-* 内卡片默认 height:auto 不撑满，数据不足/图表短时与同 grid 行其他卡片不齐（表格/环形图/折线图/告警/换模全中招）。
//   只扫 <div class="grid12"> 配对区间内的 <div class="col-N"><div class="card"> 结构，缺 card--fill 报 MEDIUM（提示性不阻断）。
function checkCardFillInGrid(html) {
  const violations = [];
  const noScript = stripScriptTags(html);
  const gridRe = /<div\b[^>]*\bclass="([^"]*\bgrid12\b[^"]*)"[^>]*>/gi;
  let gm;
  while ((gm = gridRe.exec(noScript))) {
    // 标签栈配对 grid12 的闭合 </div>
    let depth = 1, i = gm.index + gm[0].length, closeIdx = -1;
    const tagRe = /<(\/?)(div)\b[^>]*>/g;
    tagRe.lastIndex = i;
    let tm;
    while ((tm = tagRe.exec(noScript))) {
      if (tm[1]) { depth--; if (depth === 0) { closeIdx = tm.index; break; } }
      else depth++;
    }
    if (closeIdx === -1) continue;
    const zone = noScript.slice(gm.index, closeIdx);
    const colRe = /<div\b[^>]*\bclass="([^"]*\bcol-(?:3|4|5|6|7|8|9|12)\b[^"]*)"[^>]*>\s*<div\b[^>]*\bclass="([^"]*\bcard\b[^"]*)"[^>]*>/g;
    let cm;
    while ((cm = colRe.exec(zone))) {
      if (!/\bcard--fill\b/.test(cm[2])) {
        violations.push({
          line: 0, severity: 'MEDIUM', contract: 'card.fill-in-grid', sel: cm[1].trim(),
          msg: 'grid12 内 col-* 直接子卡片缺 .card--fill（RULES §4.4）——col 内卡片默认 height:auto 不撑满，数据不足/图表短时与同 grid 行其他卡片底部不齐。请加 card--fill（flex column，card-body flex:1 撑满 col 高度），内容容器（donut-wrap/chart-box/table-wrap）再 flex:1 吃掉剩余高度'
        });
      }
    }
  }
  return violations;
}

// ===== 移动端组件 DOM 契约门禁（2026-08-04，移动端 RULES §3.5）=====
// 背景：设备台帐多轮复盘，执行级缺陷（Tag 尺寸/卡片间距/文本层级/空态）根因全是
//   「组件真源已就位、HTML 没按契约组 DOM」——与 Web 端 §3.7 同源，移动端补对应门禁。
// 触发：仅页面含 m 前缀组件类（mbtn/mlist/mtag/mtabs/m-dot/mcard/msearch/mmodal）时执行，
//   避免误伤 Web 页。全部先 stripScriptTags（JS 模板字符串不参与），行号统一 0。
function checkMobileDomContracts(html) {
  const violations = [];
  const noScript = stripScriptTags(html);
  const mClassRe = /\bclass="[^"]*\b(mbtn|mlist|mtag|mtabs|m-dot|mcard|msearch|mmodal)\b/;
  if (!mClassRe.test(noScript)) return violations;

  // ① ② ③：配对每个 .mlist-double 完整闭合区间（标签栈），检查标准子树 / Tag 尺寸 / kv-row
  // 注意：\bmlist-double\b 会误匹配 mlist-double-text/head/foot（\b 在 e- 之间成立），
  //   必须负向前瞻 (?![-a-z]) 排除子类名。
  const doubleRe = /<div\b[^>]*\bclass="([^"]*\bmlist-double\b(?![-a-z])[^"]*)"[^>]*>/gi;
  let dm;
  while ((dm = doubleRe.exec(noScript))) {
    let depth = 1, i = dm.index + dm[0].length, closeIdx = -1;
    const tagRe = /<(\/?)(div)\b[^>]*>/g;
    tagRe.lastIndex = i;
    let tm;
    while ((tm = tagRe.exec(noScript))) {
      if (tm[1]) { depth--; if (depth === 0) { closeIdx = tm.index; break; } }
      else depth++;
    }
    if (closeIdx === -1) continue;
    const zone = noScript.slice(dm.index, closeIdx);
    const sel = dm[1].trim();
    if (!/\bmlist-double-top\b/.test(zone)) {
      violations.push({
        line: 0, severity: 'MEDIUM', contract: 'mlist.structure', sel,
        msg: '.mlist-double 缺 .mlist-double-top 标准子树（移动端 RULES §3.5）——须 .mlist-double-top > (.mlist-thumb + .mlist-double-text > (.mlist-double-head + .mlist-sub) + .mlist-more) + .mlist-double-foot；自造结构（.list-line/.list-sub/.nm）破坏卡片布局与间距契约'
      });
    }
    if (/\bmtag-sm\b/.test(zone)) {
      violations.push({
        line: 0, severity: 'MEDIUM', contract: 'mtag.size.in-card', sel,
        msg: '.mlist-double 卡片内用 .mtag-sm（20px 高）醒目度不足（移动端 RULES §3.5）——卡片内 Tag 用 .mtag-md/.mtag-lg；.mtag-sm 仅用于标签云/密集次要场景'
      });
    }
    if (/\bmlist-double-foot\b/.test(zone) && /·/.test(zone) && !/\bkv-row\b/.test(zone)) {
      violations.push({
        line: 0, severity: 'MEDIUM', contract: 'kv.row.required', sel,
        msg: '.mlist-double-foot 数据指标行用 "·" 串文本（移动端 RULES §3.5）——用 .kv-row > .kv-item 分 cell（<b> 数字等宽 + 细线分隔）；.mlist-sub 单行辅助信息允许 · 串'
      });
    }
  }

  // ④ m.empty.placeholder：动态渲染（script 内 innerHTML 赋值）列表缺空态占位
  // 注意：script 内容已被 stripScriptTags 剥离，须从原始 html 提取 script 再检测
  const scripts = [];
  const scriptRe = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let sm;
  while ((sm = scriptRe.exec(html))) scripts.push(sm[1]);
  const dynamic = scripts.some(s => /(?:innerHTML)\s*=/.test(s));
  if (dynamic && !/\bm-empty\b/.test(noScript)) {
    violations.push({
      line: 0, severity: 'MEDIUM', contract: 'm.empty.placeholder', sel: 'dynamic-list',
      msg: '动态渲染列表（innerHTML 赋值）缺 .m-empty 空态占位（移动端 RULES §3.5）——数据 0 时应显示居中空态（.m-empty），而非空白'
    });
  }

  // ⑤ home.regions（2026-08-04，RULES §10.2 构图）：首页/看板须含 ≥1 个构图区域（Hero/金刚/瓷片）+ 列表区
  // 背景：Agent 生成"首页"时常把所有 KPI 平铺或单列列表，无视觉焦点 → 审美不在线。
  //   信号为 MEDIUM 提示（不阻断交付），指导 Agent 按 §10.2 补首焦/金刚/瓷片区域。
  if (/(?:首页|看板|运营|dashboard|home)/i.test(noScript)) {
    const hasHero = /\bm-hero\b/.test(noScript);
    const hasKingkong = /\bm-kingkong\b/.test(noScript);
    const hasPorcelain = /\bm-porcelain\b/.test(noScript);
    const hasList = /\b(?:mlist|mcard|mcell|m-item|mlist-double)\b/.test(noScript);
    if (!(hasHero || hasKingkong || hasPorcelain)) {
      violations.push({
        line: 0, severity: 'MEDIUM', contract: 'aesthetic.home.regions', sel: 'home',
        msg: '首页/看板缺构图区域（RULES §10.2）——建议含 ≥1 个：首焦区 .m-hero（视觉焦点）/ 金刚区 .m-kingkong（功能入口）/ 瓷片区 .m-porcelain（数据磁贴），再配列表区。全平铺列表或全 KPI 堆叠 = 审美不在线最常见形态'
      });
    }
    if (!hasList) {
      violations.push({
        line: 0, severity: 'MEDIUM', contract: 'aesthetic.home.list', sel: 'home',
        msg: '首页缺列表区（RULES §10.2 列表区必带）——用 .mlist / .mcard / .m-cell 承载列表/详情流内容'
      });
    }
  }

  // ⑥ text.layer（2026-08-04，RULES §10.3 文字层级语义类）：裸 inline font-size ≥3 处且页面无 .m-text-* 语义类 → MED
  // 背景：Agent 应用文字层级不严谨（哪里改用什么层级）——根因是移动端此前 0 语义类，只能裸 font-size。
  //   对齐 Web 端 .t-* 体系：语义类 .m-text-h1/h2/h3/body1/body2/caption/label/num。
  const inlineFont = (noScript.match(/style="[^"]*font-size\s*:/gi) || []).length;
  const hasTextSemantic = /\bm-text-(?:h[1-3]|body[12]|caption|label|num)\b/.test(noScript);
  if (inlineFont >= 3 && !hasTextSemantic) {
    violations.push({
      line: 0, severity: 'MEDIUM', contract: 'text.layer', sel: 'text',
      msg: '页面裸 inline font-size 达 ' + inlineFont + ' 处且未用 .m-text-* 文字语义类（RULES §10.3）——层级应用不严谨。语义类：页面标题 .m-text-h1/h2 / 卡标题 .m-text-h3 / 正文 .m-text-body1/body2 / 元信息 .m-text-caption / 表单标签 .m-text-label / 数值 .m-text-num；禁用裸 font-size'
    });
  }
  return violations;
}

// ===== Web 审美信号门禁（2026-08-04，Web RULES §7）=====
// 背景：Web 端与移动端同源问题（Agent 审美不在线）——组件/门禁保下限，缺"美学层"上限。
//   移动端 §10 已补（aesthetic.home.*）；Web 端对称补：
//   ① dashboard/看板语义页缺 KPI 区（stat-grid）或图表区（grid12）→ 三区骨架不完整
//   ② 页面 inline font-size ≥5 处且无 .t-* 字阶类 → 层次规范被绕过（禁裸 font-size）
// 触发：仅 Web 页面（含 btn/table/stat-grid/topbar 等 Web 特征类，且无 m 前缀类）→ 避免误伤移动端页。
function checkWebAesthetics(html) {
  const violations = [];
  const noScript = stripScriptTags(html);
  const isWeb = /\bclass="[^"]*\b(?:btn|table|stat-grid|topbar|grid12|tabs|pager)\b/.test(noScript);
  const isMobile = /\bclass="[^"]*\bm(?:btn|list|tag|tabs|card|search|modal)\b/.test(noScript);
  if (!isWeb || isMobile) return violations;

  // ① dashboard/看板/运营语义页：三区骨架（KPI 区 stat-grid + 图表区 grid12 + 表格区）
  if (/(?:看板|运营|dashboard|overview|监控)/i.test(noScript)) {
    const hasKpi = /\bstat-grid\b/.test(noScript);
    const hasChart = /\bgrid12\b/.test(noScript) || /\bchart-box\b/.test(noScript);
    if (!hasKpi || !hasChart) {
      violations.push({
        line: 0, severity: 'MEDIUM', contract: 'aesthetic.web.sections', sel: 'dashboard',
        msg: '看板/运营页缺三区骨架（Web RULES §7.2）——须 KPI 区 .stat-grid + 图表区 .grid12/.chart-box + 表格区；全平铺/单区 = 审美不在线最常见形态'
      });
    }
  }

  // ② 层次：inline font-size ≥5 处且无 .t-* 字阶类 → 文本层级绕过规范
  const inlineFont = (noScript.match(/style="[^"]*font-size\s*:/gi) || []).length;
  const hasTClass = /\bt-(?:h[1-5]|body\d?|caption|label|overline|link)\b/.test(noScript);
  if (inlineFont >= 5 && !hasTClass) {
    violations.push({
      line: 0, severity: 'MEDIUM', contract: 'aesthetic.web.tclass', sel: 'text',
      msg: '页面 inline font-size 达 ' + inlineFont + ' 处且未用 .t-* 字阶类（Web RULES §7.3）——文本层级靠裸字号会失去对比节奏；一律用字阶类（.t-h4/.t-body1/.t-caption…），禁用裸 font-size'
    });
  }
  return violations;
}

// ===== WCAG 2.0 前景/背景对比度门禁（2026-08-05，RULES §10.3b / §7.5b）=====
// 背景：移动端功能色按钮/标签原为白字（白 on suc 2.54 / warn 2.15 / run 3.30 / err 3.76 均 <4.5 AA 不达标），
//   08-05 组件模板已改「功能色底 + 深字 n10」（亮色）与「dark n1 深字」（暗色）。
//   本门禁只拦「页面级覆盖回已知禁止组合」的回归（防 Agent 手写 .mtag-suc{color:var(--n1)} 等）。
//   仅亮色作用域（:root 默认）判定——暗色 dark n1 是深色，白字判定不适用。
//   已知禁止组合（亮色，按实际 token 计算）：
//     fg n1 on bg suc/warn/run/err（白 on 功能色）   2.15~3.76 < 4.5
//     fg suc on bg suc-text / fg warn on bg warn-text / fg err on bg err-text（浅底+同系字）
//     fg n1 on bg n5/n4（白 on 浅灰）               1.3~1.48
function checkWcagContrast(rules, varsByTheme) {
  const BANNED = [
    { bg: '--suc', fg: '--n1' }, { bg: '--warn', fg: '--n1' }, { bg: '--run', fg: '--n1' }, { bg: '--err', fg: '--n1' },
    { bg: '--suc-text', fg: '--suc' }, { bg: '--warn-text', fg: '--warn' }, { bg: '--err-text', fg: '--err' },
    { bg: '--n5', fg: '--n1' }, { bg: '--n4', fg: '--n1' },
  ];
  const violations = [];
  const seen = new Set();
  for (const r of rules) {
    if (r.theme === 'dark') continue;                       // 暗色 n1 为深色，不适用白字判定
    const bgM = r.decl.match(/background(?:-color)?\s*:\s*var\(\s*(--[\w-]+)\s*\)/);
    const fgM = r.decl.match(/(?:^|;)\s*color\s*:\s*var\(\s*(--[\w-]+)\s*\)/);
    // DEFECT-07 补（08-05 对抗审查）：hex/关键字白字前景（#fff/#FFFFFF/white）配功能色底也拦——var() 引用盲区
    const hexWhite = bgM && /(?:^|;)\s*color\s*:\s*(?:#(?:fff|ffffff|FFF|FFFFFF)|white)\b/.test(r.decl);
    if (hexWhite) {
      violations.push({
        line: r.line, src: r.src, severity: 'MEDIUM', contract: 'wcag.contrast.banned',
        sel: r.selectors.join(','),
        msg: '已知 WCAG 禁止组合：hex 白字（#fff/white）on 彩色底（RULES §10.3b）——功能色底用深字 n10/err-fg-deep，白字仅允许 on primary'
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
          msg: `已知 WCAG 2.0 禁止组合：${b.fg}（白）on ${b.bg}（功能色/浅底）对比度 <4.5:1（RULES §10.3b/§7.5b）——组件模板已改深字方案，页面请勿覆盖回白字；需强调时用大文本（≥18.66px 粗体，3:1）或改用 -soft 浅底+深字`
        });
      }
    }
  }
  return violations;
}

// ===== 跨模块间距门禁（2026-08-04，RULES §4.3）：stat-grid/grid12 间距不得被页面覆盖 <16px =====
// 背景：KPI 区(.stat-grid)与图表区(.grid12)紧贴 / 卡片间距失控，根因是页面层覆盖容器 margin。
//   模板已保证 .stat-grid{margin-bottom:24px} + .grid12 .card{margin-bottom:0}（真源 utilities.css），
//   本门禁只拦「页面层破坏」：<style> 或 inline style 把 .stat-grid/.grid12 的 margin-bottom 设 <16px。
//   页面若需微调，用工具类 .mt/.mb 包容器，勿改容器自身 margin。
function checkModuleSpacing(html) {
  const violations = [];
  const selfCss = inlineStyleCss(html);
  // ① 页面 <style> 规则覆盖
  const ruleRe = /\.(stat-grid(?:--\d+)?|grid12)\s*\{([^}]*)\}/g;
  let m;
  while ((m = ruleRe.exec(selfCss))) {
    const mb = /margin-bottom\s*:\s*([^;]+)/.exec(m[2]);
    if (mb) {
      const v = parseFloat(mb[1]);
      if (!isNaN(v) && v < 16) {
        violations.push({
          line: 0, severity: 'MEDIUM', contract: 'layout.module-spacing', sel: '.' + m[1],
          msg: `页面 <style> 把 .${m[1]} 的 margin-bottom 覆盖为 ${mb[1].trim()}（< 16px）——模板已给 .stat-grid 24px 跨模块间距（RULES §4.3），覆盖归零会导致 KPI 区与图表区紧贴/间距失控。若需微调请用工具类 .mt/.mb 包容器，勿改容器 margin`
        });
      }
    }
  }
  // ② inline style 覆盖
  const inlineRe = /<(?:div|section)\b[^>]*\bclass="([^"]*\b(?:stat-grid(?:--\d+)?|grid12)\b[^"]*)"[^>]*\bstyle="([^"]*margin-bottom[^"]*)"/g;
  let im;
  while ((im = inlineRe.exec(html))) {
    const mb = /margin-bottom\s*:\s*([^;"]+)/.exec(im[2]);
    if (mb) {
      const v = parseFloat(mb[1]);
      if (!isNaN(v) && v < 16) {
        violations.push({
          line: 0, severity: 'MEDIUM', contract: 'layout.module-spacing', sel: im[1].split(/\s+/)[0],
          msg: `页面 inline style 把 ${im[1].split(/\s+/)[0]} 的 margin-bottom 覆盖为 ${mb[1].trim()}（< 16px）——模板跨模块间距 24px 被破坏（RULES §4.3）。用 .mt/.mb 工具类替代`
        });
      }
    }
  }
  return violations;
}

// ===== 表格空数据占位门禁（2026-08-04，RULES §4.4）：动态渲染表格须声明 minRow 占位 =====
// 背景：表格数据不足时卡片高度缩水、与同 grid 行其他卡片不齐（用户裁定：表格先撑起来对齐，空数据用占位行）。
//   只对「含 <table class="table"> 且有动态渲染（innerHTML/textContent 赋值）的页面」提示；
//   纯静态表格高度固定无需占位；脚本内已声明 minRow 常量视为已按契约实现。
function checkTableMinRow(html) {
  const violations = [];
  const scripts = html.match(/<script[\s\S]*?<\/script>/gi) || [];
  if (!scripts.length) return violations;                                   // 纯静态页
  if (!/<table\b[^>]*\bclass="[^"]*\btable\b[^"]*"/.test(html)) return violations; // 无规范表格
  const rendersDynamic = scripts.some(s => /innerHTML\s*=/.test(s));       // 动态渲染仅认 innerHTML（textContent 用于图标/文本更新，不属表格渲染——page-template 折叠箭头误报案例）
  if (!rendersDynamic) return violations;                                   // 表格为静态数据
  const hasMinRow = scripts.some(s => /\bmin_?row\b/i.test(s));             // 大小写+下划线兼容（MIN_ROW/minRow）
  if (!hasMinRow) {
    violations.push({
      line: 0, severity: 'MEDIUM', contract: 'layout.table-minrow', sel: 'table',
      msg: '页面含动态渲染表格但 JS 未声明 minRow 空数据占位（RULES §4.4）——表格数据不足时卡片高度缩水、与同 grid 行其他卡片不齐。请配合 .card--fill 使用：渲染 minRow=8 占位行（空 cell colspan 撑高、行高 44px），数据为 0 时同样占位 + 首行「无数据」提示'
    });
  }
  return violations;
}

// ===== 顶栏结构门禁（任务书 7A，2026-08-03）：顶栏禁模块级导航（双导航红线） =====
// 背景：生成页出现顶栏模块菜单（运营中心/生产管理…）与左侧作业树形成双导航，但旧 9 个
//   check 只扫内容区/颜色/类，不扫导航结构 → 结构盲区。只抓 <header class="topbar">…</header>
//   区间（正则标签配对），区间内命中以下任一 → HIGH：
//     ① class*="topbar-link"     → topbar.nav-menu（框架 2026-08-03 已废弃该类）
//     ② 文本含 TOPBAR_NAV_WORDS  → topbar.nav-text
//     ③ <a> 链接文本含上述词      → topbar.nav-link
//   豁免：topbar-item / topbar-sep / topbar-brand / topbar-logo / topbar-titles /
//     topbar-title / topbar-subtitle / topbar-right 容器子树（品牌区/工具区白名单，先整段剥除，
//     防平台名含模块词误报）；先 stripScriptTags 防 JS 字符串误报。行号统一 0（同 checkChartBox）。
//   词表可扩展：新增模块词只需追加常量。
const TOPBAR_NAV_WORDS = ['运营中心','生产管理','设备中心','质量管理','报表中心','配置中心','系统管理'];
// 顶栏白名单品牌区容器类（平台名/副标题可能含模块词，剥除防误报）。
// 工具区（topbar-item/topbar-sep/topbar-right）【不再豁免】——其文本（首页/管理员/改密/退出/全屏）
// 不含模块词，违规在工具区必须被抓（2026-08-03 补丁：原 8 类豁免致容器内违规漏报）。
const TOPBAR_EXEMPT_CLASSES = ['topbar-brand','topbar-logo','topbar-titles','topbar-title','topbar-subtitle'];

// 配对式剥除：从豁免容器开始标签到对应闭合标签（栈计数，支持嵌套），返回剥离后字符串
function stripExemptZone(zone, classToken) {
  // RED-03 修复：class 属性兼容单/双引号与 `=` 两侧留白（HTML 均合法）
  const openRe = new RegExp('<([a-zA-Z][a-zA-Z0-9]*)\\b[^>]*class\\s*=\\s*["\'][^"\']*' + classToken + '[^"\']*["\'][^>]*>', 'i');
  let out = '';
  let rest = zone;
  while (rest.length > 0) {
    const m = openRe.exec(rest);
    if (!m) { out += rest; break; }
    out += rest.slice(0, m.index);
    const tag = m[1].toLowerCase();
    let depth = 1;
    let pos = rest.indexOf('>', m.index) + 1;
    const tagRe = new RegExp('<\/?' + tag + '\\b', 'gi');
    tagRe.lastIndex = pos;
    let tm;
    while ((tm = tagRe.exec(rest))) {
      if (rest[tm.index + 1] === '/') { depth--; if (depth === 0) { pos = tagRe.lastIndex; break; } }
      else depth++;
    }
    rest = rest.slice(pos);
  }
  return out;
}

// ===== 表格列对齐门禁（2026-08-06）：数值列表头与数据同对齐（th.num ↔ td.num 双向一致） =====
// 背景：页面数值列 td 用 .num 右对齐、表头 th 仍默认左对齐 → 表头字段与数据错位。
// 对齐语义（RULES 表格列对齐）：文本列左 / 数值列右（.num，th 与 td 同用）/ 状态·操作·进度列左。
// 规则（HIGH）：① 任一 td.num → 对应列 th 必须带 num；② th.num → 该列所有数据 td 必须带 num。
// 实现：正则提取每个 <table>，解析 thead 首行 th（含 class）与 tbody 各行 td（含 class），
//   按列索引比对；行 td 数 ≠ th 数时该行跳过（防 tfoot/合并列误报）。行号统一 0。
function checkTableAlign(html) {
  const violations = [];
  const tables = html.match(/<table\b[^>]*>[\s\S]*?<\/table>/gi) || [];
  for (const tb of tables) {
    const ths = [...tb.matchAll(/<th\b[^>]*>/gi)].map(m => m[0]);
    if (!ths.length) continue; // 无表头行（如纯数据表）跳过
    const headClasses = ths.map(h => (h.match(/class="([^"]*)"/) || [, ''])[1]);
    const tbody = tb.match(/<tbody[\s\S]*?<\/tbody>/gi);
    const body = tbody ? tbody.join('') : tb; // match 返回字符串数组，直接 join（勿用 m[0]——那是取字符串首字符）
    const theadBlock = tb.match(/<thead[\s\S]*?<\/thead>/gi);
    const theadTrs = theadBlock ? [...theadBlock[0].matchAll(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi)].map(m => m[0]) : [];
    const dataTrs = [...body.matchAll(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi)].map(m => m[0]).filter(tr => !theadTrs.includes(tr));
    for (let c = 0; c < headClasses.length; c++) {
      const headHasNum = /\bnum\b/.test(headClasses[c]);
      const colTds = dataTrs.map(tr => {
        const tds = [...tr.matchAll(/<td\b[^>]*>/gi)].map(m => m[0]);
        return tds[c] || '';
      }).filter(td => td);
      if (!colTds.length) continue;
      const anyTdNum = colTds.some(td => /\bnum\b/.test(td));
      const allTdNum = colTds.every(td => /\bnum\b/.test(td));
      if (anyTdNum && !headHasNum) {
        violations.push({ line: 0, severity: 'HIGH', contract: 'table.align', sel: 'th.col' + (c + 1),
          msg: `表格第 ${c + 1} 列：数据单元格带 .num（右对齐）但表头未带 .num → 表头与数据错位。数值列表头须同用 .num（RULES 表格列对齐：文本列左 / 数值列右 / 状态·操作·进度左）` });
      } else if (headHasNum && !allTdNum) {
        violations.push({ line: 0, severity: 'HIGH', contract: 'table.align', sel: 'th.col' + (c + 1),
          msg: `表格第 ${c + 1} 列：表头带 .num（右对齐）但数据单元格未全部带 .num → 表头与数据错位。数值列所有 td 须带 .num` });
      }
    }
  }
  return violations;
}

function checkTopbar(html) {
  const violations = [];
  const noScript = stripScriptTags(html);
  // RED-03 修复：header class 属性兼容单/双引号与 `=` 两侧留白（HTML 均合法）
  const headerRe = /<header\b[^>]*class\s*=\s*["'][^"']*topbar[^"']*["'][\s\S]*?<\/header>/i;
  const hm = headerRe.exec(noScript);
  if (!hm) return violations;
  const zone = hm[0];
  // 剥除品牌区豁免容器（工具区不再豁免——见 L771 注释）
  let scan = zone;
  for (const c of TOPBAR_EXEMPT_CLASSES) {
    scan = stripExemptZone(scan, c);
  }
  // ① class*="topbar-link"（RED-03 修复：引号/空格兼容）
  if (/class\s*=\s*["'][^"']*topbar-link[^"']*["']/.test(scan)) {
    violations.push({
      line: 0, severity: 'HIGH', contract: 'topbar.nav-menu', sel: 'topbar-link',
      msg: '顶栏出现 .topbar-link 类（模块级菜单）——顶栏只允许品牌区 + 工具区（首页/管理员/修改密码/退出登录/全屏），模块导航只放左侧作业树；框架自 2026-08-03 起废弃 .topbar-link。见 RULES.md §0.1 顶栏白名单 / §0.2 单树导航'
    });
  }
  // ② TOPBAR_NAV_WORDS 文本命中（剥除豁免区后）
  for (const w of TOPBAR_NAV_WORDS) {
    if (scan.includes(w)) {
      violations.push({
        line: 0, severity: 'HIGH', contract: 'topbar.nav-text', sel: w,
        msg: '顶栏出现模块级导航词「' + w + '」——顶栏禁止模块菜单/tab（与左侧作业树构成双导航），模块导航只放左侧作业树。见 RULES.md §0.1 顶栏白名单'
      });
    }
  }
  // ③ <a> 链接文本含 TOPBAR_NAV_WORDS
  const linkRe = /<a\b[^>]*>([\s\S]*?)<\/a>/gi;
  let lm;
  while ((lm = linkRe.exec(scan))) {
    const text = lm[1].replace(/<[^>]+>/g, '').trim();
    for (const w of TOPBAR_NAV_WORDS) {
      if (text.includes(w)) {
        violations.push({
          line: 0, severity: 'HIGH', contract: 'topbar.nav-link', sel: 'a[' + text + ']',
          msg: '顶栏 <a> 链接文本「' + text + '」含模块级导航词「' + w + '」——顶栏禁模块导航，移入左侧作业树（树内平级 group-title 并列）。见 RULES.md §0.1/§0.2'
        });
      }
    }
  }
  return violations;
}

// ===== 内联尺寸门禁（任务书 7A，2026-08-03）：inline style 裸 px 尺寸/间距 → MEDIUM =====
// 设计：扫 style="..." 区间，抓 (height|width|margin-top|margin-bottom|padding):\s*(\d+)px。
//   豁免：0px；百分比（width:8% 等——swatch/间距演示用）；height:100%/width:100%；
//     var(--*) 包裹值（height:var(--topbar-height) 合法，无裸数字 px 不匹配）；
//     无尺寸声明的 style（position:fixed 等）。MEDIUM 不阻断。
//   行号 = 该 style 在剥注释后 HTML 中的行号；sel = 命中的声明。
// RED-07 修复：style 属性兼容单/双引号；支持负值/小数/大写单位（CSS 单位大小写不敏感，HTML 引号两种均合法）
function checkInlineDimensions(html) {
  const violations = [];
  const noScript = stripScriptTags(html);
  const styleRe = /style\s*=\s*(['"])([^'"]*)\1/g;
  let m;
  while ((m = styleRe.exec(noScript))) {
    const decls = m[2];
    const dimRe = /(height|width|margin-top|margin-bottom|padding):\s*([-+]?(?:\d+(?:\.\d+)?|\.\d+))px/gi;
    let dm;
    while ((dm = dimRe.exec(decls))) {
      const val = parseFloat(dm[2]);
      if (val === 0) continue; // 0px 豁免（含 -0px/0.0px）
      const line = noScript.slice(0, m.index).split('\n').length;
      const selDecl = dm[1].toLowerCase() + ':' + val + 'px';
      violations.push({
        line, severity: 'MEDIUM', contract: 'layout.inline.dimension', sel: selDecl,
        msg: 'inline style 裸尺寸/间距 ' + selDecl + '（值 ' + val + 'px）——须走 token/组件类（定高统一用 chart-box 等容器类，间距用 spacing token / utilities.css 工具类），禁裸 px。见 GENERATION-SOP 结构自检清单'
      });
    }
  }
  return violations;
}

// ===== SVG 绘制属性门禁（任务书 S，2026-08-03）：stroke=/fill=/stop-color= 裸 hex 必须走 token =====
// 分级与 forbidNonTokenHex 语义一致（领导拍板）：
//   非调色板色（自造色）→ HIGH 阻断；调色板内色值（值对但没走 var）→ MEDIUM 提示。
// 只扫双引号属性形式 stroke="/fill="/stop-color="，不扫 style=""（避免误伤色板 swatch 展示区
// 的合法 hex 展示，如 page-template 色板卡）。先剥 <script> 块（防 ECharts 配置串误报）。
// 3 位 hex 经 toPaletteKey 扩成 6 位（#0AF→#00AAFF）后判 PALETTE.has()；
// currentColor/none/transparent/url(#...) 天然豁免（非 hex 不匹配）。
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
        + '）——须改用 style="' + prop + ':var(--chart-*)" 形式（SVG 属性支持 var()，比裸属性稳）。'
        + (isPalette
          ? '见 components.json#chart-* / GENERATION-SOP 图表生成规范'
          : '色值不在 tokens.json 色板内，属自造色，禁止入稿')
    });
  }
  return violations;
}

function run(specPath, targetPath) {
  const spec = loadSpec(specPath);
  PALETTE = buildPalette(specPath); // NEW-008：色板 = 手写额外色 ∪ tokens.json 全量 hex
  const rawHtml = fs.readFileSync(targetPath, 'utf8');
  // RED-013③：所有以 HTML 文本为输入的扫描统一走剥离注释后的版本
  //（等宽空格替换，行号不变）。注释掉的 <style>/<link>/class 不应参与任何判定。
  const html = stripHtmlComments(rawHtml);
  // RED-002：样式真源 = 内联 <style> + 本地外链样式表，两者都要进 contract 扫描与变量解析
  const linked = collectLinkedCss(targetPath, html);
  const linkedCss = linked.map(l => l.css).join('\n');
  const selfCss = inlineStyleCss(html);
  // 变量合并顺序 = CSS 级联顺序：外链在前、内联在后 → 页面内联覆盖外链，与浏览器一致
  // NEW-007：按主题切分为 light/dark 两表，规则按自身作用域取表求值
  // RED-04 修复：只喂真实 CSS（linkedCss + selfCss，与 checkRootVars 同源），
  //   正文代码示例/脚本字符串里的 :root{...} 会污染变量表、把未定义 token「洗白」——不再喂 HTML 全文。
  const allCss = linkedCss + '\n' + selfCss;
  const varsByTheme = extractVarsScoped(linkedCss + '\n' + selfCss); // RED-04 修复：只喂真实 CSS（与 checkRootVars 同源），正文/脚本字符串不再污染变量表
  const varsOf = r => (r && r.theme === 'dark' ? varsByTheme.dark : varsByTheme.light);
  const rules = parseRules(html).concat(...linked.map(l => parseCssRules(l.css, l.label)));
  const isTemplate = path.resolve(targetPath) === path.resolve(__dirname, 'page-template.html'); // B 包：字阶断言 filename-gate（精确路径，避免按文件名豁免被绕过，RED-001）

  const violations = [];
  for (const c of spec.contract) {
    if (!isTemplate && c.id && c.id.startsWith('type.')) continue; // B 包：字阶断言仅对 page-template 生效（examples 不受约束，BLOCKED #5）
    const scopeNote = c.scope ? `[${c.scope}]` : '';
    for (const rule of rules) {
      if (!c.selector.some(p => selectorMatches(rule.selectors, p, c.exclude))) continue;
      const dm = declMap(rule.decl);
      for (const ruleDef of c.rules) {
        const prop = ruleDef.prop;
        // 全属性扫描（forbidNonTokenHex / forbidHex 通配）
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
        if (rawVal === undefined) {
          // 属性缺失：expect 含 null 视为允许（如字重继承自 body），否则跳过（不强制缺失项）
          continue;
        }
        const resolved = resolve(rawVal, varsOf(rule)); // NEW-007：按规则所属主题求值
        // forbidHex
        if (ruleDef.forbidHex) {
          const hit = ruleDef.forbidHex.some(h => rawVal.toUpperCase().includes(h.toUpperCase()));
          if (hit) violations.push({
            line: rule.line, src: rule.src, severity: ruleDef.severity, contract: c.id,
            sel: rule.selectors.join(','),
            msg: `${prop} 含禁用色 ${ruleDef.forbidHex.join('/')}（${ruleDef.note || ''}）`
          });
          continue;
        }
        // expectToken：必须为 var() 或 token 色
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
        // RED-013② 修复（2026-08-01）：条件 at-rule 内的**数值**断言豁免。
        //   `@media (max-width:640px){ .hero-num{font-size:44px} }` 是完全合法的响应式覆盖，
        //   基态 contract 的数值期望（尺寸/字重/半径）本就不适用于断点态；
        //   旧实现把媒体条件丢弃、拍平成基态规则参与比对 = 稳定假阳性。
        //   注意只豁免数值：颜色/token 类断言（forbidNonTokenHex / forbidHex / expectToken）
        //   在上方已各自 continue，仍旧生效 —— 换个断点不该让硬编码色变合法。
        if (rule.atRule) continue;
        // expect：数字/字符串 或 数组（缺失已在上方统一放过；数组列出所有合法值，支持数值与 var token 字面）
        if (Array.isArray(ruleDef.expect)) {
          const n = num(resolved);
          const strOk = ruleDef.expect.some(e => typeof e === 'string' && (rawVal === e || resolved === e));
          if (!(strOk || (!isNaN(n) && ruleDef.expect.includes(n)))) violations.push({
            line: rule.line, src: rule.src, severity: ruleDef.severity, contract: c.id,
            sel: rule.selectors.join(','),
            msg: `${prop} 应为 ${ruleDef.expect.join('/')}，实际 ${rawVal}`
          });
        } else {
          const n = num(resolved);
          if (isNaN(n)) {
            // 无法解析（如未识别值）→ 仅当有明确 expect 且值非 var 时提示
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
  // 只喂纯 CSS（外链 + 内联 <style> 内容），不喂 HTML 正文 —— 见 extractRootScopeVars 注释
  const rootV = isTemplate ? checkRootVars(linkedCss + '\n' + selfCss, {
    elevLevels: ['sunken','default','raised','overlay','overflow'],
    shadowNames: ['--shadow-card','--shadow-modal','--shadow-float','--shadow-row-hover'],
    durationKeys: ['instant','fast','normal','slow']
  }) : [];
  // 表面感知选中门禁：对所有页面生效（高精度，只在能确证品牌表面时报）
  const surfaceV = checkSurfaceSelection(rules, varsByTheme);
  // T6：B 端后台固定框架 — 品牌表面作业树节点必须带图标（对所有页面生效）
  const iconV = checkTreeIcons(html);
  // 类名白名单：对照单一真源 template.css + 页面实际外链 CSS（根治自造组件）。
  // NEW-001 修复：改为「按后果分级」而非「按文件豁免」——
  //   旧策略把 page-template / agent-starter 整体豁免（又一处 fail-open：参考源恰恰最该守规）；
  //   新策略对所有页面一视同仁，真不渲染的类 HIGH，页面自定义但会渲染的类聚合 MEDIUM。
  const templatePath = path.join(path.dirname(specPath), 'template.css');
  const tplCss = fs.existsSync(templatePath) ? fs.readFileSync(templatePath, 'utf8') : '';
  const canonicalCss = tplCss + '\n' + linkedCss;
  const whitelistV = canonicalCss.trim()
    ? checkClassWhitelist(html, canonicalCss, selfCss, { ignore: new Set() })
    : [];
  // RED-018：引用未定义 CSS 变量（无 fallback）→ 该声明在浏览器整条失效，与 class.undefined 同级
  const tokenV = checkUndefinedTokens(rules, varsByTheme);
  // M4（2026-08-02）：动效门禁对所有页面生效（不用 isTemplate 门控）——
  // transition 时长裸数字秒 HIGH / animation 时长裸数字秒 MEDIUM / 0s 白名单 / var(--motion-duration-*) 通过
  const motionV = checkMotion(rules);
  // 图表容器门禁（任务书 B，2026-08-03）：canvas 须挂 .chart-box（MEDIUM 不阻断，不扫 <script>）
  const chartV = checkChartBox(html);
  // SVG 绘制属性门禁（任务书 S，2026-08-03）：stroke=/fill=/stop-color= 裸 hex 分级（HIGH 自造 / MEDIUM 调色板内）
  const svgV = checkSvgPaint(html);
  // 顶栏结构门禁（任务书 7A，2026-08-03）：顶栏区间内禁模块级导航（topbar.nav-menu / nav-text / nav-link HIGH）
  const topbarV = checkTopbar(html);
  // 内联尺寸门禁（任务书 7A，2026-08-03）：inline style 裸 px 尺寸/间距（layout.inline.dimension MEDIUM）
  const dimV = checkInlineDimensions(html);
  // 组件 DOM 契约门禁（2026-08-04，RULES §3.7）：btn-label 包裹 / stat-grid 卡数 / chart-svg fill
  const btnLabelV = checkBtnLabel(html);
  const statGridV = checkStatGridCount(html);
  const chartFillV = checkChartSvgFill(html);
  // 图表布局门禁（2026-08-06 复盘补强）：SVG 内文字 / 左右对称 / 柱底基线
  const chartLayoutV = checkChartLayout(html);
  // 克隆源内联 :root 与 template.css 一致性门禁（2026-08-06：仅 page-template）
  const templateSyncV = checkTemplateRootSync(html, canonicalCss);
  // 跨模块间距门禁（2026-08-04，RULES §4.3）：页面层不得覆盖 stat-grid/grid12 margin-bottom <16px
  const moduleSpacingV = checkModuleSpacing(html);
  // 表格空数据占位门禁（2026-08-04，RULES §4.4）：动态表格须声明 minRow（MEDIUM 提示）
  const tableMinRowV = checkTableMinRow(html);
  const tableAlignV = checkTableAlign(html);
  // col 内卡片对齐门禁（2026-08-04，RULES §4.4）：grid12 区间内 col-* 直接子 .card 须 card--fill（MEDIUM 提示）
  const cardFillV = checkCardFillInGrid(html);
  const mobileV = checkMobileDomContracts(html);
  const webAesV = checkWebAesthetics(html);
  // WCAG 2.0 对比度门禁（2026-08-05，RULES §10.3b / §7.5b）：功能色底 + 白字（亮色 n1）等已知禁止组合 → MED
  // 组件模板已改深字 n10；此门禁拦「页面级覆盖回白字」的回归。暗色（dark n1 为深色）合法不查。
  const wcagV = checkWcagContrast(rules, varsByTheme);
  // 守则缺口补强（2026-08-06）：覆写检测 / 网格 calc / 自造类 token 化
  // 豁免「内联模板克隆页」（page-template.html 及克隆：selfCss 即 template.css 本体，
  //   组件类目标 ≥40 视为整份模板内联，其样式一致性由既有契约门禁负责）
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
  return violations.concat(rootV, surfaceV, iconV, whitelistV, tokenV, motionV, chartV, svgV, topbarV, dimV, btnLabelV, statGridV, chartFillV, chartLayoutV, templateSyncV, moduleSpacingV, tableMinRowV, tableAlignV, cardFillV, mobileV, webAesV, wcagV, gridV, overrideV, customV);
}

function main() {
  const target = process.argv[2] || TARGET_DEFAULT;
  const specPath = process.argv[3] || SPEC_DEFAULT;
  if (!fs.existsSync(target)) { console.error('目标文件不存在: ' + target); process.exit(2); }
  if (!fs.existsSync(specPath)) { console.error('spec 文件不存在: ' + specPath); process.exit(2); }

  console.log(`\n🔍 规范合规扫描`);
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

main();
