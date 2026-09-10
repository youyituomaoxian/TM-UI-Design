#!/usr/bin/env node
/*
 * audit-spec.js — 弘讯设计系统 · 存量改造增量审计（2026-09-09）
 * ---------------------------------------------------------------------------
 * 与 validate-spec.js（生成门禁）互补：本脚本只实现 validate-spec 未覆盖的
 * machine 类审计规则（audit-rules.json M-01/M-02/M-03 + M-06 引用 CSS 资产扫描
 * 2026-09-10），用于存量项目按弘讯设计系统改造时的 P0 盘点。不重复实现已有规则。
 *
 * 规则真源：../audit-rules.json（变更须经漏检回灌，见其 change_policy）
 *
 * 用法：
 *   node audit-spec.js <目标.html> [--end web|mobile] [--json 输出.json]
 *   --end 决定 tokens.json 色板真源与状态点白名单（默认 web）
 *   --json 额外输出结构化台账（P0 盘点产物，供 P1 分类 / agent 分批消费）
 *
 * exit：HIGH > 0 → 1（阻断）；否则 0。
 * ---------------------------------------------------------------------------
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const TOKENS = {
  web: path.join(ROOT, '弘讯web端design-system', 'tokens.json'),
  mobile: path.join(ROOT, '弘讯移动端design-system', 'tokens.json'),
};
// tokens 之外的合法示例/文档色（与 validate-spec PALETTE_EXTRA 同口径，保守子集）
const PALETTE_EXTRA = new Set([
  '#005EAE', '#1A75D2', '#004A8F', '#DAEAFA', '#A0B4C0',
  '#FFFFFF', '#FAFAFA', '#F6F9FC', '#F5F7FB', '#EAEAED', '#DEE2E6', '#CED4DA', '#ADB5BD', '#6C757D', '#334155', '#212532',
  '#389E0D', '#52C41A', '#237804', '#F6FFED', '#FA8C16', '#FFF7E6', '#FFA940', '#D46B08', '#F5222D', '#FFF1F0', '#FF4D4F', '#CF1322',
  '#16A34A', '#ECFDF5', '#BBF7D0', '#22C55E', '#15803D',
  '#00A3E0', '#00C7BE', '#00D4A1', '#FF9500', '#8A5CF5', '#FF66C2',
  '#10B981', '#059669', '#F59E0B', '#EF4444', '#0E7490', '#003868', '#0061FF', '#1D4ED8', '#D97706', '#DC2626', '#A78BFA', '#8B5CF6', '#06B6D4', '#EC4899',
].map(c => c.toUpperCase()));

const DOT_WHITELIST = new Set(['run', 'idle', 'off', 'offline', 'err', 'ok', 'warn']);

// ---- 工具 ----
function collectHexLeaves(node, out) {
  if (typeof node === 'string') {
    const s = node.trim();
    if (/^#[0-9a-fA-F]{3,8}$/.test(s)) out.add(s.toUpperCase());
    return out;
  }
  if (Array.isArray(node)) { for (const n of node) collectHexLeaves(n, out); return out; }
  if (node && typeof node === 'object') { for (const n of Object.values(node)) collectHexLeaves(n, out); return out; }
  return out;
}

function buildPalette(end) {
  const tokensPath = TOKENS[end];
  if (!fs.existsSync(tokensPath)) throw new Error(`tokens.json 缺失：${tokensPath}`);
  const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
  const set = new Set(PALETTE_EXTRA);
  collectHexLeaves(tokens, set);
  return set;
}

function stripScriptTags(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, '');
}

// 行号映射：index → 行号（1-based）
function lineOf(index, lineStarts) {
  let lo = 0, hi = lineStarts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (lineStarts[mid] <= index) lo = mid; else hi = mid - 1;
  }
  return lo + 1;
}
function buildLineStarts(text) {
  const starts = [0];
  for (let i = 0; i < text.length; i++) if (text[i] === '\n') starts.push(i + 1);
  return starts;
}

// ---- 渐变色标点定位（M-01 扩展 2026-09-10）----
// 11242 案例一：linear-gradient(180deg,#fff 0%,var(--n2) 100%) 暗皮露白顶——
// 渐变定义的是面/边界，白字豁免（#FFF）在色标点内不适用；色标点内 hex 必须参与判定。
function findGradientRanges(text) {
  const ranges = [];
  const re = /(?:linear|radial|conic)-gradient\s*\(/gi;
  let m;
  while ((m = re.exec(text))) {
    let depth = 1, i = m.index + m[0].length;
    for (; i < text.length && depth > 0; i++) {
      if (text[i] === '(') depth++;
      else if (text[i] === ')') depth--;
    }
    ranges.push([m.index, i]);
  }
  return ranges;
}
function inRanges(idx, ranges) {
  for (const [s, e] of ranges) if (idx >= s && idx < e) return true;
  return false;
}

// ---- M-01 css.hex.literal ----
function checkHexLiteral(noScript, palette, lineStarts) {
  const violations = [];
  // 1) <style> 块（剥离 :root / [data-theme] 令牌定义区，逐行豁免 swatch 展示区）
  const styleRe = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let m;
  while ((m = styleRe.exec(noScript))) {
    const css = m[1];
    const base = m.index + m[0].indexOf(m[1]);
    const cssStarts = buildLineStarts(css);
    // 令牌定义/投影区剥离：:root{...} 与 [data-theme...]{...}（非贪婪配平到首个 })
    const stripped = css
      .replace(/:root\s*\{[^}]*\}/g, '')
      .replace(/\[data-theme[^\]]*\]\s*\{[^}]*\}/g, '');
    const hexRe = /#([0-9a-fA-F]{3,8})\b/g;
    const gradRanges = findGradientRanges(stripped);
    let h;
    while ((h = hexRe.exec(stripped))) {
      const abs = base + h.index;
      const line = lineOf(abs, lineStarts);
      const lineText = noScript.slice(lineStarts[line - 1], lineStarts[line] || undefined);
      if (/swatch|data-audit-exempt/i.test(lineText)) continue; // 色板展示区豁免
      const hex = ('#' + h[1]).toUpperCase();
      const isGradStop = inRanges(h.index, gradRanges);
      if (!isGradStop && (hex === '#FFFFFF' || hex === '#FFF')) continue; // 白字约定豁免（渐变色标点内不适用，M-01 扩展 2026-09-10）
      const inPalette = palette.has(hex) || palette.has(normalizeShort(hex));
      violations.push({
        rule: 'M-01', contract: isGradStop ? 'css.hex.gradient-stop' : 'css.hex.literal', line,
        severity: inPalette ? 'MEDIUM' : 'HIGH',
        excerpt: hex + (isGradStop ? ' @gradient' : ''),
        msg: isGradStop
          ? `渐变色标点裸 hex ${hex}${inPalette ? '（色板内）' : '（自造色）'}——渐变是面/边界非文字，白字豁免不适用；改用 var(--token) 色标点，防暗色模式露白底`
          : inPalette
          ? `CSS 裸 hex ${hex} 在 token 色板内——合法色但必须改用 var(--token) 引用（禁字面量，防漂移）`
          : `CSS 裸 hex ${hex} 不在 token 色板——自造色，改用 var(--token)；确需新色走 brand-color-engine 回 tokens.json`,
      });
    }
  }
  // 2) inline style="..." 属性值
  const inlineRe = /\sstyle\s*=\s*"([^"]*)"/gi;
  while ((m = inlineRe.exec(noScript))) {
    const abs = m.index + m[0].indexOf(m[1]);
    const line = lineOf(abs, lineStarts);
    const lineText = noScript.slice(lineStarts[line - 1], lineStarts[line] || undefined);
    if (/swatch|data-audit-exempt/i.test(lineText)) continue;
    const hexRe = /#([0-9a-fA-F]{3,8})\b/g;
    const gradRanges = findGradientRanges(m[1]);
    let h;
    while ((h = hexRe.exec(m[1]))) {
      const hex = ('#' + h[1]).toUpperCase();
      const isGradStop = inRanges(h.index, gradRanges);
      if (!isGradStop && (hex === '#FFFFFF' || hex === '#FFF')) continue;
      const inPalette = palette.has(hex) || palette.has(normalizeShort(hex));
      violations.push({
        rule: 'M-01', contract: isGradStop ? 'css.hex.gradient-stop' : 'css.hex.literal', line,
        severity: inPalette ? 'MEDIUM' : 'HIGH',
        excerpt: hex + (isGradStop ? ' @gradient' : ''),
        msg: isGradStop
          ? `inline 渐变色标点裸 hex ${hex}——白字豁免不适用于色标点，改用 var(--token)`
          : inPalette
          ? `inline style 裸 hex ${hex} 在 token 色板内——改用 var(--token) 引用`
          : `inline style 裸 hex ${hex} 不在 token 色板——自造色，改用 var(--token)`,
      });
    }
  }
  return violations;
}
function normalizeShort(hex) {
  // #ABC → #AABBCC，与 tokens 中长写法比对
  if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
    return '#' + hex.slice(1).split('').map(c => c + c).join('').toUpperCase();
  }
  return hex.toUpperCase();
}

// ---- M-02 btn.state.matrix（组合语义版 2026-09-10）----
// 判定谓词（与 audit-rules.json M-02 同步）：
//   只审「类自身定义了 background」的按钮类（含伪类的选择器不参与背景归属，.btn:disabled 不算基类背景）；
//   变体类（.btn-xxx）的某态若自身或基类提供 → 覆盖；基类（.btn）的 hover/active 若任一变体提供 → 覆盖；
//   :focus-visible 无组合兜底惯例，全家族必须显式存在（键盘可达）。
function checkBtnState(noScript, lineStarts) {
  const violations = [];
  const styleRe = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let m;
  while ((m = styleRe.exec(noScript))) {
    const css = m[1];
    const base = m.index + m[0].indexOf(m[1]);
    const cssStarts = buildLineStarts(css);
    const blockRe = /([^{}]+)\{([^}]*)\}/g;
    const defs = new Map(); // cls -> {line, hasBg, states:Set}
    let b;
    while ((b = blockRe.exec(css))) {
      const sel = b[1], body = b[2];
      // 按 token 定位按钮类：先剥掉伪类再匹配（.btn-primary:focus-visible 整段含 ':'，须 strip 后匹配）
      const seg = sel.split(/[\s,>+~]+/).find(t => /\.(btn|button)[\w-]*/i.test(t.replace(/:.*$/, '')));
      if (!seg) continue;
      const cls = seg.replace(/:.*$/, '').match(/\.[\w-]+/)[0].slice(1);
      const pseudoMatch = seg.match(/:(hover|active|focus-visible|focus)\b/i);
      const entry = defs.get(cls) || { line: lineOf(base + b.index, cssStarts), hasBg: false, states: new Set() };
      if (pseudoMatch) {
        const st = pseudoMatch[1].toLowerCase() === 'focus' ? 'focus-visible' : pseudoMatch[1].toLowerCase();
        entry.states.add(st);
      } else if (!seg.includes(':') && /background/i.test(body)) {
        entry.hasBg = true; // 纯类选择器才算背景归属；:disabled 等其他伪类块不参与
      }
      defs.set(cls, entry);
    }
    for (const [cls, info] of defs) {
      if (!info.hasBg) continue;
      const baseName = cls.split('-')[0];
      const baseEntry = defs.get(baseName);
      const isBase = cls === baseName;
      const variantCovers = (state) => [...defs.entries()].some(
        ([k, v]) => k !== baseName && k.startsWith(baseName + '-') && v.states.has(state)
      );
      const has = (state) => info.states.has(state) || (!isBase && baseEntry && baseEntry.states.has(state));
      const missing = [];
      if (!has('hover') && !(isBase && variantCovers('hover'))) missing.push(':hover');
      if (!has('active') && !(isBase && variantCovers('active'))) missing.push(':active');
      if (!has('focus-visible') && !(isBase && variantCovers('focus-visible'))) missing.push(':focus-visible');
      if (missing.length) {
        violations.push({
          rule: 'M-02', contract: 'btn.state.matrix', line: info.line,
          severity: 'MEDIUM', excerpt: `.${cls}`,
          msg: `按钮类 .${cls} 缺交互态：${missing.join(' / ')}——按 RULES §3.1 补齐四态（token 化）；focus-visible 无组合兜底，须显式定义`,
        });
      }
    }
  }
  return violations;
}

// ---- M-03 status.dot.unknown ----
function checkStatusDot(noScript, end, lineStarts) {
  const violations = [];
  const classAttrRe = /class\s*=\s*"([^"]*)"/g;
  let m;
  while ((m = classAttrRe.exec(noScript))) {
    const tokens = m[1].trim().split(/\s+/);
    const line = lineOf(m.index, lineStarts);
    if (end === 'web') {
      if (!tokens.includes('status-dot')) continue;
      for (const t of tokens) {
        const mm = t.match(/^dot-([\w-]+)$/);
        if (mm && !DOT_WHITELIST.has(mm[1])) {
          violations.push({
            rule: 'M-03', contract: 'status.dot.unknown', line,
            severity: 'HIGH', excerpt: t,
            msg: `状态点 ${t} 不在语义白名单（run/idle/off/offline/err/ok/warn）——机器状态禁自造语义色，新语义先回 RULES §11.11 登记`,
          });
        }
      }
    } else {
      if (!tokens.includes('m-dot')) continue;
      for (const t of tokens) {
        if (t === 'm-dot') continue;
        if (!DOT_WHITELIST.has(t)) {
          violations.push({
            rule: 'M-03', contract: 'status.dot.unknown', line,
            severity: 'HIGH', excerpt: t,
            msg: `m-dot 状态类 ${t} 不在语义白名单（run/idle/off/offline/err/ok/warn）——机器状态禁自造语义色`,
          });
        }
      }
    }
  }
  return violations;
}

// ---- M-06 css.asset.hex（2026-09-10 新增）----
// 11242 案例二：dist 分页条 background:#fff 白底横条——脏值在被 <link> 引用的冻结 CSS 里，
// 只扫页面 HTML 是假阴性。冻结 dist 降级 MEDIUM『硬编码清单』（供映射决策）；自维护 CSS 维持 HIGH。
// 白字豁免仅适用于 color: 声明（文字白约定）；background/border 等面性声明中的 #fff 照判。
function checkLinkedCss(targetFile, palette) {
  const violations = [];
  const html = fs.readFileSync(targetFile, 'utf8');
  const dir = path.dirname(path.resolve(targetFile));
  const seen = new Set();
  const linkRe = /<link\b[^>]*>/gi;
  let lk;
  while ((lk = linkRe.exec(html))) {
    const tag = lk[0];
    if (!/stylesheet/i.test(tag)) continue;
    const hm = tag.match(/href\s*=\s*["']([^"']+)["']/i);
    if (!hm) continue;
    const href = hm[1].trim();
    if (/^(https?:)?\/\//i.test(href) || /^data:/i.test(href)) continue;
    const abs = path.resolve(dir, href.split('?')[0].split('#')[0]);
    if (!/\.css$/i.test(abs) || seen.has(abs)) continue;
    seen.add(abs);
    if (!fs.existsSync(abs)) continue; // 缺失引用由浏览器/其他门禁管，不在此报
    const css = fs.readFileSync(abs, 'utf8');
    const normPath = abs.replace(/\\/g, '/');
    const frozen = /(^|[\\/])(dist|dist-static|vendor|node_modules|build)([\\/]|$)/i.test(normPath);
    const rel = path.relative(path.dirname(targetFile), abs).replace(/\\/g, '/') || path.basename(abs);

    // 掩码区：注释 + :root/[data-theme] 令牌定义区（与页面侧同口径豁免）
    const masks = [];
    let cm;
    const commentRe = /\/\*[\s\S]*?\*\//g;
    while ((cm = commentRe.exec(css))) masks.push([cm.index, cm.index + cm[0].length]);
    let rb;
    const rootRe = /:root\s*\{[^}]*\}|\[data-theme[^\]]*\]\s*\{[^}]*\}/g;
    while ((rb = rootRe.exec(css))) masks.push([rb.index, rb.index + rb[0].length]);

    const lineStartsCss = buildLineStarts(css);
    const hexRe = /#([0-9a-fA-F]{3,8})\b/g;
    let h;
    while ((h = hexRe.exec(css))) {
      const idx = h.index;
      if (inRanges(idx, masks)) continue;
      const line = lineOf(idx, lineStartsCss);
      const lineText = css.slice(lineStartsCss[line - 1], lineStartsCss[line] || undefined);
      if (/swatch|data-audit-exempt/i.test(lineText)) continue;
      // 所在声明上下文：向前后扫到 ; { } 边界，取属性名
      let st = idx - 1;
      while (st >= 0 && !';{}'.includes(css[st])) st--;
      let en = idx;
      while (en < css.length && !';}'.includes(css[en])) en++;
      const decl = css.slice(st + 1, en).trim();
      const pm = decl.match(/^([-a-zA-Z]+)\s*:/);
      const prop = pm ? pm[1].toLowerCase() : '';
      const hex = ('#' + h[1]).toUpperCase();
      if ((hex === '#FFFFFF' || hex === '#FFF') && prop === 'color') continue; // 白字豁免仅限文字声明
      const inPalette = palette.has(hex) || palette.has(normalizeShort(hex));
      const severity = frozen ? 'MEDIUM' : (inPalette ? 'MEDIUM' : 'HIGH');
      violations.push({
        rule: 'M-06', contract: 'css.asset.hex', line,
        severity,
        excerpt: `${hex} @${rel}`,
        msg: frozen
          ? `引用冻结 dist CSS（${rel} L${line}）声明 \`${decl}\` 含裸 hex ${hex} —— dist 硬编码清单（信息级，供映射决策；dist 不可改，修法=页面/合规层同优先级覆盖）`
          : `引用自维护 CSS（${rel} L${line}）声明 \`${decl}\` 含裸 hex ${hex}${inPalette ? '（色板内）' : '（自造色）'} —— 自维护合规层维持 HIGH 口径，改用 var(--token)`,
      });
    }
  }
  return violations;
}

// ---- 主流程 ----
function main() {
  const args = process.argv.slice(2);
  const target = args[0];
  let end = 'web', jsonOut = null;
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--end') end = args[++i];
    else if (args[i] === '--json') jsonOut = args[++i];
  }
  if (!target) { console.error('用法: node audit-spec.js <目标.html> [--end web|mobile] [--json out.json]'); process.exit(2); }
  if (!fs.existsSync(target)) { console.error('目标文件不存在: ' + target); process.exit(2); }
  if (!['web', 'mobile'].includes(end)) { console.error('--end 仅支持 web|mobile'); process.exit(2); }

  const palette = buildPalette(end);
  const html = fs.readFileSync(target, 'utf8');
  const noScript = stripScriptTags(html);
  const lineStarts = buildLineStarts(noScript);

  const violations = [
    ...checkHexLiteral(noScript, palette, lineStarts),
    ...checkBtnState(noScript, lineStarts),
    ...checkStatusDot(noScript, end, lineStarts),
    ...checkLinkedCss(target, palette),
  ].sort((a, b) => (a.severity === b.severity ? a.line - b.line : a.severity === 'HIGH' ? -1 : 1));

  const high = violations.filter(v => v.severity === 'HIGH').length;
  const med = violations.filter(v => v.severity === 'MEDIUM').length;

  console.log(`\n🔍 存量改造增量审计 audit-spec（规则真源 audit-rules.json v1.2.0 · ${end} 色板）`);
  console.log(`   目标: ${path.basename(target)}`);
  console.log('');
  for (const v of violations) {
    const tag = v.severity === 'HIGH' ? '🔴 HIGH' : '🟡 MED';
    console.log(`${tag}  L${v.line}  [${v.contract}]  ${v.excerpt}`);
    console.log(`       ↳ ${v.msg}`);
  }
  console.log(`\n📊 audit 增量审计共 ${violations.length} 项：HIGH ${high} / MEDIUM ${med}`);

  if (jsonOut) {
    fs.writeFileSync(jsonOut, JSON.stringify({
      target: path.resolve(target),
      end, generatedAt: new Date().toISOString(),
      ruleset: 'audit-rules.json v1.0.0',
      summary: { high, medium: med, total: violations.length },
      violations,
    }, null, 2));
    console.log(`📝 台账已写出: ${jsonOut}`);
  }

  if (high > 0) { console.log('❌ 存在 HIGH，exit 1（P0 台账需先归零/豁免）。'); process.exit(1); }
  console.log('✅ 无 HIGH，exit 0。');
  process.exit(0);
}

if (require.main === module) main();
