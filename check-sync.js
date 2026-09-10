#!/usr/bin/env node
/*
 * check-sync.js — 弘讯设计系统 · 真源一致性门禁（2026-09-10）
 * ---------------------------------------------------------------------------
 * 防两类漂移（真源治理契约 · 维护者六步流程第 3 步「双端同步」的机器化）：
 *
 *   检查一 [阻断] vendor 层 ↔ 真源 同包一致性：
 *     packages/{web,mobile}-ui/src/styles/components.css 自我声明「以 template.css 为真源重建」，
 *     同名类的声明块应与 template.css 逐属性一致（normalize 后比对）。
 *     教训：2026-09-10 补 .btn 四态时 template.css 与 W1 层 components.css 靠人肉双处同步。
 *
 *   检查二 [信息性一期] 双端同名类结构一致性：
 *     web/mobile template.css 同名类（实测交集 33 个：.anim-* 动效族 / .chart-* 图表族 /
 *     .legend-* / .section-title）比对声明属性键集合——值允许平台差异（触控目标/字阶合法不同），
 *     属性键漂移 = 结构性遗漏（如一端补了 :focus-visible 另一端没补）。一期信息性，观察后另议升级。
 *
 * 用法：node check-sync.js [--report]   （--report 输出全部差异明细）
 * exit：检查一存在差异 → 1；否则 0。
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

function parseClasses(cssText) {
  const css = stripComments(cssText);
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
    const selKey = selRaw.split(/[\s,>+~]+/).map(s => s.replace(/::?[a-zA-Z-]+(\([^)]*\))?$/g, '')).filter(s => s.startsWith('.')).sort().join('>');
    if (!map.has(base)) map.set(base, new Map());
    const bucket = map.get(base);
    if (!bucket.has(selKey)) bucket.set(selKey, new Set());
    bucket.get(selKey).add(decls);
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
  ok(`${label} vendor 同构段 ${sharedCount} 类与真源一致`, diffCount === 0);
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

// ---- 主流程 ----
function main() {
  const report = process.argv.includes('--report');
  console.log(`\n🔍 真源一致性门禁 check-sync（治理契约第 3 步「双端同步」机器化）`);
  let diff = 0;
  diff += checkVendor('Web', FILES.webTemplate, FILES.webVendor);
  diff += checkVendor('Mobile', FILES.mobTemplate, FILES.mobVendor);
  diff += checkCrossEnd(report);
  console.log(`\n📊 check-sync：${pass} pass / ${fail} fail`);
  if (diff > 0) { console.log('❌ 真源一致性存在漂移，exit 1（六步流程第 3 步「双端同步」未完成）。'); process.exit(1); }
  console.log('✅ 真源一致性通过，exit 0。');
  process.exit(0);
}

if (require.main === module) main();
