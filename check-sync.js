#!/usr/bin/env node
/*
 * check-sync.js — 弘讯设计系统 · 真源一致性门禁（2026-09-10；RED-001 修2026-10-08）
 * ---------------------------------------------------------------------------
 * 防两类漂移（真源治理契约 · 维护者六步流程第 3 步「双端同步」的机器化）：
 *
 *   检查一 [阻断] vendor 层 ↔ 真源同包一致性：
 *     packages/{web,mobile}-ui/src/styles/components.css 自我声明「以 template.css 为真源重建」，
 *     同名类声明块应与 template.css 逐属性一致。教训：2026-09-10 补 .btn 四态时靠人肉双处同步。
 *
 *   检查二 [白名单外阻断] 双端同名类属性键结构一致性：
 *     web/mobile template.css 同名类（实测交集 33 个）比对属性键集合——值允许平台合法差异，
 *     属性键漂移 = 结构性遗漏（一端补了另一端没补）。SYNC_WHITELIST 逐条登记合法差异。
 *     RED-001 前@media/@supports 内声明不入映射 → 断点内漂移可拿 exit 0，现已修复（见下）。
 *
 *   检查三 [阻断] 真源未覆盖类登记闭环（RED-002 三档 · T-6 2026-10-10）：
 *     真源有而 vendor 缺的类必须登记 vendor-coverage.json（tokenProjection 豁免 / gaps 真缺口），
 *     未登记 → FAIL。仅比对 Web 端（Mobile 经 T-7 结案不适用）。
 *
 * 用法：node check-sync.js [--report]   exit：存在差异 → 1；否则 0。
 * ---------------------------------------------------------------------------
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const FILES = {
  webTemplate: path.join(ROOT, '弘讯web端design-system', 'template.css'),
  mobTemplate: path.join(ROOT, '弘讯移动端design-system', 'template.css'),
  webVendor: path.join(ROOT, 'packages', 'web-ui', 'src', 'styles', 'components.css'),
  mobVendor: path.join(ROOT, 'packages', 'mobile-ui', 'src', 'styles', 'components.css'),
};

// ---- CSS 解析：文件 → Map<基类名, Map<选择器, 声明串(normalized)>> ----
function stripComments(css) { return css.replace(/\/\*[\s\S]*?\*\//g, ''); }

// RED-001 修复（2026-10-08）：原 blockRe 无嵌套能力，遇 @media/@supports 时 [^}]* 只吃到
// 第一个 }，媒体查询内声明被整体丢弃；且丢弃发生在「声明入映射之前」，故写在响应式断点
// 内的双端漂移可拿到 exit 0（实测：向 Web 真源注入 .chart-legend 独有属性 → 检查一/二双双通过）。
// 修法选择（最小手术，不重写原解析逻辑，避免引入新回归）：
//   在 stripComments 之后加一步「at-rule 提升」——把 @media/@supports/@layer/@container/@scope
//   块内的规则原样提升到顶层，并把条件作为选择器前缀（`选择器 @ 条件`），于是媒体查询内的
//   声明进入比对面，且与同名顶层规则分属不同桶（不产生假漂移）。
//   仅对「可嵌套规则」的 at-rule 做提升；@keyframes/@font-face 内部结构不同，跳过。
//   括号配平扫描只处理一层嵌套（真源实际用法即一层），不递归，避免复杂度与回归风险。
const NESTABLE_AT = /^@(media|supports|layer|container|scope)\b/i;
function liftNestedAtRules(css) {
  const out = [];
  let i = 0;
  const n = css.length;
  while (i < n) {
    const at = css.indexOf('{', i);
    if (at < 0) { out.push(css.slice(i)); break; }
    // 配平读取该块体（无论是否 at-rule 都要读，保证 i 推进到块后，prelude 才不会被截断）
    let depth = 1, k = at + 1;
    while (k < n && depth > 0) {
      if (css[k] === '{') depth++;
      else if (css[k] === '}') { depth--; if (depth === 0) break; }
      k++;
    }
    const prelude = css.slice(i, at).trim();
    // prelude 可能含上一块残留的声明尾巴与 '}'，取最后一个 '}' 之后的真选择器部分
    const realSel = (prelude.lastIndexOf('}') >= 0
      ? prelude.slice(prelude.lastIndexOf('}') + 1) : prelude).trim();
    if (NESTABLE_AT.test(realSel)) {
      // at-rule：把块内规则加条件前缀提升到顶层，与同名顶层规则分桶（免假漂移）
      const inner = css.slice(at + 1, k);
      const lifted = inner.replace(/([^{}]+)\{([^{}]*)\}/g, (m, sel, body) => {
        const s = sel.trim();
        // :root 变量块与嵌套 at 规则不提升（record 自行跳过前者，后者无类选择器）
        if (!s || s.startsWith('@') || s.startsWith(':root')) return '';
        return `${s} @ ${realSel} {${body}}`;
      });
      if (lifted.trim()) out.push(lifted);
    } else {
      // 普通规则：整块原样输出（含 prelude 残留），保持与原实现逐字节等价
      out.push(css.slice(i, k + 1));
    }
    i = k + 1;
  }
  return out.join('');
}

function parseClasses(cssText) {
  const css = liftNestedAtRules(stripComments(cssText));
  const map = new Map(); // base -> Map<selectorKey, declNormal>
  const blockRe = /([^{}]+)\{([^}]*)\}/g;
  let m;
  while ((m = blockRe.exec(css))) {
    const selRaw = m[1].trim(), body = m[2].trim();
    // 取选择器中首个类 token 的基名（剥伪类/伪元素）；无类选择器（元素/变量块）跳过
    const firstClass = selRaw.match(/\.([a-zA-Z][\w-]*)/);
    if (!firstClass) continue;
    const base = firstClass[1];
    // 声明 normalize：按属性排序拼接（顺序/空白/大小写不敏感）
    const decls = body.split(';').map(s => s.trim()).filter(Boolean)
      .map(s => s.replace(/\s+/g, ' '))
      .sort()
      .join(';');
    if (!decls) continue;
    // 选择器键：抽出尾部的「 @ 条件」后缀单独成键，使条件规则与顶层规则分桶（避免假漂移）
    const atCond = (selRaw.match(/\s+@\s+(.+)$/) || [])[1];
    const selOnly = atCond ? selRaw.slice(0, selRaw.length - (atCond.length + 3)).trim() : selRaw;
    const selKey = selOnly.split(/[\s,>+~]+/).map(s => s.replace(/::?[a-zA-Z-]+(\([^)]*\))?$/g, '')).filter(s => s.startsWith('.')).sort().join('>');
    const finalKey = atCond ? `${selKey} @ ${atCond}` : selKey;
    if (!map.has(base)) map.set(base, new Map());
    const bucket = map.get(base);
    if (!bucket.has(finalKey)) bucket.set(finalKey, new Set());
    bucket.get(finalKey).add(decls);
  }
  return map;
}

function propKeys(declNormal) {
  return new Set(declNormal.split(';').map(s => s.split(':')[0].trim()).filter(Boolean));
}

let pass = 0, fail = 0;
function ok(name, cond) { console.log(`  ${cond ? '✅' : '❌'} ${name}`); cond ? pass++ : fail++; }

// ---- 检查一：vendor ↔ 真源 ----
// 语义：vendor「与真源同构段」（两端交集基类）必须逐声明一致 → 阻断；
//       vendor 自有命名空间类（如 mobile .mn-* Taro 组件库）= 合法自有段，孤儿仅信息性清点（是否该迁入真源留给复盘）。
function checkVendor(label, templatePath, vendorPath) {
  const tpl = parseClasses(fs.readFileSync(templatePath, 'utf8'));
  const ven = parseClasses(fs.readFileSync(vendorPath, 'utf8'));
  console.log(`\n▶ 检查一 [阻断] ${label}：vendor components.css ↔ template.css 同名类声明一致`);
  let diffCount = 0;
  const orphans = [];
  for (const [base, venBuckets] of ven) {
    const tplBuckets = tpl.get(base);
    if (!tplBuckets) { orphans.push(base); continue; } // vendor 自有命名空间，信息性
    for (const [selKey, declSet] of venBuckets) {
      const tplSet = tplBuckets.get(selKey);
      if (!tplSet) { console.log(`  ❌ .${base} (${selKey}) — vendor 有该选择器形态而 template.css 无`); diffCount++; continue; }
      for (const d of declSet) {
        if (!tplSet.has(d)) {
          console.log(`  ❌ .${base} (${selKey}) — vendor 声明与真源不一致`);
          console.log(`       vendor: ${d.slice(0, 160)}`);
          const tplArr = [...tplSet].map(s => s.slice(0, 160));
          console.log(`       真源  : ${tplArr.join(' | ') || '(空)'}`);
          diffCount++;
          break;
        }
      }
    }
  }
  const sharedCount = [...ven.keys()].filter(k => tpl.has(k)).length;
  // RED-012 / T-7 结案（2026-10-10 拍板）：同构段 0 类 = 该检查对本端显式不适用（设计如此），
  // 不读作「✅ 一致」也不作阻断。实证：mobile vendor 46 类全 mn-*（Taro 组件层自有命名空间，
  // vendor 文件自述），非缺口。他端若现 0 类，按「不适用」语义输出，须复盘确认，不默认通过。
  if (sharedCount === 0) {
    console.log(`  ⏭️ ${label} vendor 同构段 0 类——不适用（自有命名空间组件层，T-7 结案 2026-10-10：设计如此，非遗漏）。`);
  } else {
    ok(`${label} vendor 同构段 ${sharedCount} 类与真源一致`, diffCount === 0);
  }
  if (orphans.length) {
    console.log(`  ℹ️ vendor 自有命名空间 ${orphans.length} 类（不比对，是否迁入真源留给复盘）: ${orphans.slice(0, 6).map(c => '.' + c).join(' ')}${orphans.length > 6 ? ' …' : ''}`);
  }
  return diffCount;
}

// ---- 检查二：双端同名类属性键结构 ----
// 白名单（2026-09-10 逐条人工核实为平台合法差异；新增漂移不在白名单内即 fail）：
const SYNC_WHITELIST = {
  'chart-bar': { onlyWeb: ['cursor', 'transform'], onlyMob: [] },                     // Web hover 交互（触屏无 hover）
  'chart-box': { onlyWeb: ['opacity'], onlyMob: [] },                                // Web hover
  'chart-dot': { onlyWeb: ['opacity', 'transition', 'cursor', 'filter'], onlyMob: [] }, // Web hover
  'chart-hl': { onlyWeb: [], onlyMob: ['font-size'] },                               // Mobile 字阶体系
  'chart-hr': { onlyWeb: [], onlyMob: ['font-size', 'line-height'] },                // Mobile 字阶体系
  'chart-legend': { onlyWeb: ['flex-wrap'], onlyMob: ['align-items', 'color', 'font-family', 'font-size'] }, // Web 换行 / Mobile 字阶
  'chart-line': { onlyWeb: ['transition', 'cursor', 'filter', 'stroke-width'], onlyMob: [] }, // Web hover
  'chart-ring-anim': { onlyWeb: ['transform-box', 'transform-origin', 'transition', 'cursor', 'filter', 'transform'], onlyMob: [] }, // Web hover 动画
  'chart-svg': { onlyWeb: [], onlyMob: ['height'] },                                 // Mobile 容器定高
  'chart-svg--fill': { onlyWeb: ['aspect-ratio'], onlyMob: [] },                     // Web 响应式
  'chart-v': { onlyWeb: [], onlyMob: ['font-size', 'line-height'] },                 // Mobile 字阶
  'legend-dot': { onlyWeb: ['background', 'flex-shrink'], onlyMob: [] },             // Web 视觉增强
  'legend-item': { onlyWeb: ['color', 'font-family', 'font-size'], onlyMob: [] },    // Mobile 上提至 .chart-legend 父容器继承（Web 子项显式声明）
  'legend-line': { onlyWeb: ['flex-shrink'], onlyMob: ['flex'] },                    // 等价 flex 写法差异
  'section-title': { onlyWeb: [], onlyMob: ['letter-spacing'] },                     // Mobile 排版
};

function checkCrossEnd(report) {
  const web = parseClasses(fs.readFileSync(FILES.webTemplate, 'utf8'));
  const mob = parseClasses(fs.readFileSync(FILES.mobTemplate, 'utf8'));
  const shared = [...web.keys()].filter(k => mob.has(k)).sort();
  console.log(`\n▶ 检查二 [白名单外阻断] 双端同名类结构一致（交集 ${shared.length} 个）`);
  const drift = [];
  for (const base of shared) {
    const keysOf = (buckets) => {
      const s = new Set();
      for (const [sel, decls] of buckets) for (const d of decls) for (const k of propKeys(d)) s.add(k);
      return s;
    };
    const webKeys = keysOf(web.get(base)), mobKeys = keysOf(mob.get(base));
    const wl = SYNC_WHITELIST[base] || { onlyWeb: [], onlyMob: [] };
    const onlyWeb = [...webKeys].filter(k => !mobKeys.has(k) && !wl.onlyWeb.includes(k));
    const onlyMob = [...mobKeys].filter(k => !webKeys.has(k) && !wl.onlyMob.includes(k));
    if (onlyWeb.length || onlyMob.length) drift.push({ base, onlyWeb, onlyMob });
  }
  ok(`双端同名类属性键结构一致（白名单 ${Object.keys(SYNC_WHITELIST).length} 类已登记平台合法差异）`, drift.length === 0);
  if (drift.length) {
    console.log(`  ❌ ${drift.length} 个同名类出现白名单外的新属性键漂移——疑似一端补了另一端没补，回维护者六步流程第 3 步`);
    for (const d of drift) {
      console.log(`  ❌ .${d.base}: 仅Web[${d.onlyWeb.join(',')}] 仅Mobile[${d.onlyMob.join(',')}]`);
    }
  }
  return drift.length;
}

// ---- 检查三：真源未覆盖类登记闭环（RED-002 三档 · T-6 拍板 2026-10-10）----
// 检查一单向比对的盲区：真源有而 vendor 缺的类从不比对、静默通过（Web 实测 282 类中 163 类）。
// 三档：tokenProjection=按设计不进 W1 组件层（豁免）/ gaps=真缺口（登记待修）/ 未登记 → FAIL。
// 登记真源 vendor-coverage.json。仅比对 Web；Mobile 经 T-7 结案（mn-* 组件层，检查一不适用）。
function checkCoverage(tplPath, venPath) {
  const tpl = parseClasses(fs.readFileSync(tplPath, 'utf8'));
  const ven = parseClasses(fs.readFileSync(venPath, 'utf8'));
  let cov;
  try { cov = JSON.parse(fs.readFileSync(path.join(ROOT, 'vendor-coverage.json'), 'utf8')); }
  catch (e) { ok('vendor-coverage.json 可读（检查三登记真源）', false); return 1; }
  const reg = new Set([...(cov.tokenProjection || []), ...(cov.gaps || [])]);
  const miss = [...tpl.keys()].filter(k => !ven.has(k) && !reg.has(k)).sort();
  ok(`真源未覆盖类全部登记（豁免 ${(cov.tokenProjection || []).length} / 缺口 ${(cov.gaps || []).length}）`, miss.length === 0);
  if (miss.length) console.log(`  ❌ ${miss.length} 类未登记: ${miss.slice(0, 8).map(c => '.' + c).join(' ')}${miss.length > 8 ? ' …' : ''}`);
  const stale = [...reg].filter(k => !tpl.has(k) || ven.has(k)).sort();
  if (stale.length) console.log(`  ℹ️ 登记过期 ${stale.length} 类（已被覆盖或真源已删）: ${stale.slice(0, 6).map(c => '.' + c).join(' ')}`);
  return miss.length ? 1 : 0;
}

// ---- 主流程 ----
function main() {
  const report = process.argv.includes('--report');
  console.log(`\n🔍 真源一致性门禁 check-sync（治理契约第 3 步「双端同步」机器化）`);
  let diff = 0;
  diff += checkVendor('Web', FILES.webTemplate, FILES.webVendor);
  diff += checkVendor('Mobile', FILES.mobTemplate, FILES.mobVendor);
  diff += checkCrossEnd(report);
  diff += checkCoverage(FILES.webTemplate, FILES.webVendor);
  console.log(`\n📊 check-sync：${pass} pass / ${fail} fail`);
  if (diff > 0) { console.log('❌ 真源一致性存在漂移，exit 1（六步流程第 3 步「双端同步」未完成）。'); process.exit(1); }
  console.log('✅ 真源一致性通过，exit 0。');
  process.exit(0);
}

if (require.main === module) main();
