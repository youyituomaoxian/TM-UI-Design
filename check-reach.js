#!/usr/bin/env node
// ===== 规范可达性门禁 check-reach（2026-11-12 · P0）=====
// 目的：不测「文件多大」，只测「规范能不能被准确读到」。
// R1 路由准确：双端 RULES「章节索引」必须与标题/字符数一致（由 sync-index 生成；手改即 FAIL）
// R2 预算达标：每类任务的加载集实测 ≤ 预算（超预算 FAIL，≥95% WARN）
// R3 覆盖完整：[软] 规则必须有必读/按需分级（unset 只 WARN）；[硬] 规则应挂门禁 id（缺失只 WARN）
// R4 引用可解析：全仓库 `RULES §x` 引用必须落到真实标题（断链 FAIL）
// R5 入口链存在：AGENTS / CLAUDE / 双 SKILL / SOP / 双端 RULES + tokens
const fs = require('fs');
const path = require('path');
const { build } = require('./sync-index.js');

const ROOT = __dirname;
const norm = p => fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
let fail = 0, warn = 0;
const fails = [], warns = [];
const bad = (msg) => { fails.push(msg); fail++; console.log(`  ✗ ${msg}`); };
const soft = (msg) => { warns.push(msg); warn++; console.log(`  ⚠ ${msg}`); };
const good = (msg) => console.log(`  ✓ ${msg}`);

const generated = build();
const { outputs, ruleIndex } = generated;

// ---- R1 索引一致 + 规则表最新 + 标题无重复 ----
console.log('\n[R1] 路由准确（章节索引 / rule-index.json）');
for (const e of Object.keys(outputs)) {
  const cur = norm(path.join(ROOT, ruleIndex.files[e]));
  if (cur !== outputs[e].text) bad(`${ruleIndex.files[e]}：章节索引与标题/字符数不一致（跑 node sync-index.js）`);
  else good(`${ruleIndex.files[e]}：索引与实测一致`);
}
const idxPath = path.join(ROOT, 'rule-index.json');
let oldIdx = null;
try { oldIdx = JSON.parse(norm(idxPath)); } catch (e) { bad('rule-index.json 缺失或无法解析（跑 node sync-index.js）'); }
if (oldIdx) {
  const same = JSON.stringify({ files: oldIdx.files, rules: oldIdx.rules, loadPlans: oldIdx.loadPlans })
    === JSON.stringify({ files: ruleIndex.files, rules: ruleIndex.rules, loadPlans: ruleIndex.loadPlans });
  if (!same) bad('rule-index.json 与当前标题不一致（跑 node sync-index.js）');
  else good('rule-index.json：与标题一致');
}
// 重复标题 id（锚点歧义）
for (const key of Object.keys(ruleIndex.files)) {
  const lines = norm(path.join(ROOT, ruleIndex.files[key])).split('\n');
  const seen = new Map();
  lines.forEach((l, i) => {
    const m = l.match(/^##\s+\[(硬|软)\]\s*([0-9]+(?:\.[0-9]+[a-z]?)?)/);
    if (!m) return;
    if (seen.has(m[2])) bad(`${ruleIndex.files[key]}：标题 id 重复 §${m[2]}（行 ${seen.get(m[2])} / ${i + 1}）`);
    else seen.set(m[2], i + 1);
  });
}

// ---- R2 加载预算 ----
console.log('\n[R2] 加载预算（任务 → 实测字符）');
const sectionChars = new Map(ruleIndex.rules.map(r => [`${r.end}:${r.section}`, r.chars]));
for (const [name, plan] of Object.entries(ruleIndex.loadPlans)) {
  let total = 0, detail = [];
  for (const item of plan.items) {
    const p = path.join(ROOT, item.file);
    if (!fs.existsSync(p)) { if (!item.optional) bad(`${name}：加载项缺失 ${item.file}`); continue; }
    if (item.whole) { const n = norm(p).length; total += n; detail.push(`${item.file} ${n}`); continue; }
    if (item.from && item.to) {
      const t = norm(p);
      const a = t.indexOf('\n' + item.from), b = t.indexOf('\n' + item.to);
      if (a < 0 || b < 0) { bad(`${name}：章节锚点找不到 ${item.file} ${item.from}~${item.to}`); continue; }
      const n = t.slice(a, b).length; total += n; detail.push(`${item.from.trim()} ${n}`); continue;
    }
    if (item.section) {
      const end = item.file.includes('移动端') ? 'mobile' : (item.file.includes('web端') ? 'web' : null);
      const key = `${end}:${item.section}`;
      if (!sectionChars.has(key)) { bad(`${name}：规则表缺章节 ${key}`); continue; }
      const n = sectionChars.get(key); total += n; detail.push(`§${item.section} ${n}`); continue;
    }
    if (item.jsonPath) {
      const j = JSON.parse(norm(p)); const n = JSON.stringify(j[item.jsonPath] || {}).length;
      total += n; detail.push(`${item.jsonPath} ${n}`); continue;
    }
  }
  const pct = total / plan.budget;
  const line = `${name}：${total} / ${plan.budget}（${(pct * 100).toFixed(1)}%）— ${detail.join(' + ')}`;
  if (total > plan.budget) bad(line + ' → 超预算');
  else if (pct >= 0.95) soft(line + ' → 余量 <5%');
  else good(line);
}

// ---- R3 覆盖 ----
console.log('\n[R3] 规则覆盖（[软] 必读分级 / [硬] 门禁映射）');
const softRules = ruleIndex.rules.filter(r => r.hard === '软');
const unset = softRules.filter(r => r.read === 'unset');
const hardRules = ruleIndex.rules.filter(r => r.hard === '硬');
// 容器章（## 有 ### 子节）不单独要求门禁：由叶子节覆盖情况判定
const hasChild = (r) => ruleIndex.rules.some(x => x.end === r.end && x.level === 3 && x.section.startsWith(r.section + '.'));
const hardLeaves = hardRules.filter(r => !hasChild(r));
const ungated = hardLeaves.filter(r => !r.gate);
// 死映射校验：validate 规则名必须真实存在于对应端 validate-spec.js；audit id 必须存在于 audit-rules.json
const validateRules = { web: new Set(), mobile: new Set() };
for (const [end, file] of [['web', '弘讯web端design-system/validate-spec.js'], ['mobile', '弘讯移动端design-system/validate-spec.js']]) {
  const t = norm(path.join(ROOT, file));
  for (const m of t.matchAll(/['"]([a-z][a-z0-9]*(?:\.[a-z0-9]+){1,3})['"]/g)) validateRules[end].add(m[1]);
}
const auditIds = new Set();
try {
  const ar = JSON.parse(norm(path.join(ROOT, 'audit-rules.json')));
  (function walk(n) {
    if (Array.isArray(n)) return n.forEach(walk);
    if (!n || typeof n !== 'object') return;
    if (n.id) auditIds.add(n.id);
    for (const k of Object.keys(n)) walk(n[k]);
  })(ar);
} catch (e) { /* ignore */ }
const dead = [];
for (const r of hardLeaves) {
  for (const g of (r.gate || [])) {
    if (/^[MHRD]-\d/.test(g)) { if (!auditIds.has(g)) dead.push(`${r.end}:§${r.section} → ${g}`); }
    else if (!validateRules[r.end].has(g)) dead.push(`${r.end}:§${r.section} → ${g}`);
  }
}
if (unset.length) soft(`[软] ${unset.length}/${softRules.length} 条未分级（unset）：${unset.map(r => `${r.end}:§${r.section}`).join(' ')}`);
else good(`[软] ${softRules.length} 条全部有必读/按需分级`);
if (dead.length) soft(`门禁映射死链 ${dead.length} 条：${dead.slice(0, 10).join('；')}`);
else good('门禁映射 0 死链（validate 规则名 / audit id 均真实存在）');
if (ungated.length) soft(`[硬] 叶子节 ${ungated.length}/${hardLeaves.length} 条未映射门禁 id（容器章不计；不影响阻断，逐批补）`);
else good(`[硬] 叶子节 ${hardLeaves.length} 条全部有门禁映射`);

// ---- R4 引用完整性 ----
console.log('\n[R4] 引用完整性（RULES §x）');
const valid = new Set(ruleIndex.rules.map(r => r.section));
const isOk = id => valid.has(id) || valid.has(id.split('-')[0]);
const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    if (f === '.git' || f === 'node_modules' || f === 'dist') continue;
    const p = path.join(d, f), st = fs.statSync(p);
    if (st.isDirectory()) walk(p);
    else if (/\.(md|js|json|html|css|ts|tsx)$/i.test(f)) files.push(p);
  }
})(ROOT);
let refCount = 0; const broken = [];
for (const f of files) {
  const t = norm(f), rel = path.relative(ROOT, f).replace(/\\/g, '/');
  const re = /RULES(?:\.md)?[^\n]{0,16}?§\s*([0-9]+(?:\.[0-9]+[a-z]?)?)/g;
  let m;
  while ((m = re.exec(t))) {
    refCount++;
    if (!isOk(m[1])) broken.push(`${rel}:${t.slice(0, m.index).split('\n').length} → §${m[1]}`);
  }
}
if (broken.length) { bad(`引用断链 ${broken.length}/${refCount} 处：`); broken.slice(0, 20).forEach(b => console.log(`      ${b}`)); }
else good(`引用 ${refCount} 处，0 断链`);

// ---- R5 入口链 ----
console.log('\n[R5] 入口链');
const entries = ['AGENTS.md', 'CLAUDE.md', '.workbuddy/skills/tm-design-system/SKILL.md', '.dsh/skills/tm-design-system/SKILL.md',
  'GENERATION-SOP.md', '弘讯web端design-system/RULES.md', '弘讯移动端design-system/RULES.md',
  '弘讯web端design-system/tokens.json', '弘讯移动端design-system/tokens.json'];
const missing = entries.filter(e => !fs.existsSync(path.join(ROOT, e)));
if (missing.length) bad(`入口文件缺失：${missing.join(', ')}`);
else good('入口文件齐全（AGENTS / CLAUDE / SKILL ×2 / SOP / 双端 RULES + tokens）');
const claude = fs.existsSync(path.join(ROOT, 'CLAUDE.md')) ? norm(path.join(ROOT, 'CLAUDE.md')) : '';
if (!/@AGENTS\.md/.test(claude)) bad('CLAUDE.md 未 @AGENTS.md（Claude Code 入口断链）');
else good('CLAUDE.md → @AGENTS.md 导入链正常');

// ---- 汇总 ----
console.log(`\ncheck-reach：${fail} FAIL / ${warn} WARN`);
if (fail) process.exit(1);
