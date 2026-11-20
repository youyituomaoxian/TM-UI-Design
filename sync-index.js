#!/usr/bin/env node
// ===== 规范可达性 · 索引同步（生成物 · 2026-11-12）=====
// 1) 按标题实测重写双端 RULES「章节索引」表（字符数 / 序号 / 标题），人工改索引会被 check-reach 判 FAIL。
// 2) 生成 rule-index.json（规则路由表：id / 端 / 层级 / 硬软 / 标题 / 行 / 字符 / 必读级 / 门禁映射 / 加载计划）。
// 用法：node sync-index.js          写入（幂等）
//       node sync-index.js --check  只校验，索引与标题不一致则 exit 1
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;

const ENDS = [
  { key: 'web', file: '弘讯web端design-system/RULES.md' },
  { key: 'mobile', file: '弘讯移动端design-system/RULES.md' },
];
const SOP = 'GENERATION-SOP.md';
const RULES_ID_RE = /^(#{2,3})\s+\[(硬|软)\]\s*([0-9]+(?:\.[0-9]+[a-z]?)?)\s*[.、]?\s*(.*)$/;
const IDX_ROW_RE = /^\|\s*\[(硬|软)\]\s*([0-9]+(?:\.[0-9]+[a-z]?)?)\s*[.、]\s*(.*?)\s*\|\s*([0-9.]+)k\s*\|\s*(.*?)\s*\|$/;

function parseFile(rel) {
  const text = fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n');
  const lines = text.split('\n');
  const headings = [];
  lines.forEach((line, i) => {
    const m = line.match(RULES_ID_RE);
    if (m) headings.push({ level: m[1].length, hard: m[2], id: m[3], title: m[4].trim(), line: i + 1 });
  });
  // 任一标题的体量：到下一个层级 <= 它的标题为止
  for (const h of headings) {
    let n = 0;
    for (let j = h.line - 1; j < lines.length; j++) {
      if (j > h.line - 1) {
        const m = lines[j].match(/^(#{1,3})\s+/);
        if (m && m[1].length <= h.level) break;
      }
      n += lines[j].length + 1;
    }
    h.chars = n;
  }
  // ## 章（含重复 id 合并）
  const chapters = [];
  for (const h of headings.filter(h => h.level === 2)) {
    const exist = chapters.find(c => c.id === h.id);
    if (exist) { exist.chars += h.chars; exist.dup = (exist.dup || 1) + 1; }
    else chapters.push({ id: h.id, hard: h.hard, title: h.title, line: h.line, chars: h.chars });
  }
  // 必读清单里的 §id：显式「必读」= must；显式「按需检索」= on-demand（不列为缺读事故）
  const mustStart = lines.findIndex(l => /^## 软规则必读清单/.test(l));
  const mustEnd = lines.findIndex((l, i) => i > mustStart && /^## /.test(l));
  const mustText = mustStart >= 0 && mustEnd > mustStart ? lines.slice(mustStart, mustEnd).join('\n') : '';
  const pullIds = (text) => {
    const set = new Set();
    let m; const re = /§\s*([0-9]+(?:\.[0-9]+[a-z]?)?)/g;
    while ((m = re.exec(text))) set.add(m[1]);
    return set;
  };
  const mustIds = pullIds(mustText.split('\n').filter(l => !/按需检索/.test(l)).join('\n'));
  const odIds = pullIds(mustText.split('\n').filter(l => /按需检索/.test(l)).join('\n'));

  // 索引表现状
  const idxStart = lines.findIndex(l => /^## 章节索引/.test(l));
  let idxRows = [];
  if (idxStart >= 0) {
    for (let i = idxStart + 1; i < lines.length && !/^---/.test(lines[i]); i++) {
      const m = lines[i].match(IDX_ROW_RE);
      if (m) idxRows.push({ id: m[2], hard: m[1], title: m[3], statedK: parseFloat(m[4]), when: m[5] });
    }
  }
  return { rel, text, lines, headings, chapters, mustIds, odIds, idxStart, idxRows };
}

function buildOne(parsed) {
  const { lines, chapters, idxRows, mustIds } = parsed;
  const total = parsed.text.length;
  // 索引行：沿用旧行的「何时读」；新章补默认
  const rows = chapters.map(c => {
    const old = idxRows.find(r => r.id === c.id);
    return {
      id: c.id,
      hard: c.hard,
      title: old ? old.title : c.title,
      k: (c.chars / 1000).toFixed(1),
      when: old ? old.when : '（待填：何时读）',
    };
  });
  const table = [
    '| 章 | 字符 | 何时读 |',
    '|---|---|---|',
    ...rows.map(r => `| [${r.hard}] ${r.id}. ${r.title} | ${r.k}k | ${r.when} |`),
  ];
  // 替换索引表块 + 总字数
  const idxStart = parsed.idxStart;
  let out = lines.slice();
  if (idxStart >= 0) {
    let first = -1, last = -1;
    for (let i = idxStart + 1; i < out.length && !/^---/.test(out[i]); i++) {
      if (/^\|/.test(out[i])) { if (first < 0) first = i; last = i; }
    }
    if (first >= 0) out = [...out.slice(0, first), ...table, ...out.slice(last + 1)];
    const hi = out.findIndex(l => /全文\s*\*\*约\s*[0-9.]+\s*k/.test(l));
    if (hi >= 0) out[hi] = out[hi].replace(/约\s*[0-9.]+\s*k/, '约 ' + Math.round(total / 1000) + 'k');
  }
  return { text: out.join('\n'), rows, total };
}

function build() {
  const data = {};
  for (const e of ENDS) data[e.key] = parseFile(e.file);
  const outputs = {};
  for (const e of ENDS) outputs[e.key] = buildOne(data[e.key]);

  // rule-index
  const rules = [];
  for (const e of ENDS) {
    for (const h of data[e.key].headings) {
      // 必读级：显式点名 = must；父章 must 则子节继承 must；其余 unset（待分级）
      let read;
      if (h.hard !== '软') read = 'on-demand';
      else if (data[e.key].mustIds.has(h.id)) read = 'must';
      else if (h.id.includes('.') && data[e.key].mustIds.has(h.id.split('.')[0])) read = 'must';
      else if (data[e.key].odIds.has(h.id)) read = 'on-demand';
      else if (h.id.includes('.') && data[e.key].odIds.has(h.id.split('.')[0])) read = 'on-demand';
      else read = 'unset';
      rules.push({
        id: `${e.key}-${h.id}`,
        end: e.key,
        section: h.id,
        level: h.level,
        hard: h.hard,
        title: h.title,
        line: h.line,
        chars: h.chars,
        read,
        gate: null,
      });
    }
  }
  // 门禁映射：audit-rules.json 中任何提到 §x.y 的规则 id → 该节
  const gateMap = {};
  const addRefs = (text, id) => {
    if (!id) return;
    // 按分句判断归属端：含「移动 / mobile」→ mobile；其余默认 web（不写端的引用多为 web 文档）
    for (const part of String(text).split(/[；;+、\n]/)) {
      let m; const re = /§\s*([0-9]+(?:\.[0-9]+[a-z]?)?)/g;
      while ((m = re.exec(part))) {
        const sec = m[1];
        const isMobile = /移动|mobile/i.test(part);
        const key = (isMobile ? 'mobile-' : 'web-') + sec;
        gateMap[key] = gateMap[key] || new Set();
        gateMap[key].add(id);
      }
    }
  };
  try {
    const ar = JSON.parse(fs.readFileSync(path.join(ROOT, 'audit-rules.json'), 'utf8').replace(/\r\n/g, '\n'));
    (function walk(node, ctxId) {
      if (Array.isArray(node)) { for (const item of node) walk(item, ctxId); return; }
      if (!node || typeof node !== 'object') return;
      const id = node.id || ctxId;
      for (const k of Object.keys(node)) {
        const v = node[k];
        if (typeof v === 'string') addRefs(v, id);
        else if (typeof v === 'object') walk(v, id);
      }
    })(ar, null);
  } catch (err) { /* 映射缺失不阻断生成 */ }
  for (const r of rules) {
    const set = gateMap[r.id];
    if (set && set.size) r.gate = [...set].sort();
  }
  // 人工确认的 validate 规则映射（gate-map.json）：与 audit 规则 id 合并
  try {
    const gm = JSON.parse(fs.readFileSync(path.join(ROOT, 'gate-map.json'), 'utf8'));
    for (const r of rules) {
      const extra = (gm[r.end] && gm[r.end][r.section]) || [];
      if (extra.length) r.gate = [...new Set([...(r.gate || []), ...extra])].sort();
    }
  } catch (e) { /* 映射缺失不阻断生成 */ }

  const loadPlans = {
    'generate-web': {
      budget: 40000,
      items: [
        { file: 'AGENTS.md', whole: true },
        { file: SOP, from: '## ① ', to: '## ② ' },
        { file: ENDS[0].file, section: '1.1b' },
        { file: ENDS[0].file, section: '7' },
        { file: ENDS[0].file, section: '9' },
        { file: '弘讯web端design-system/tokens.json', jsonPath: 'colors' },
      ],
    },
    'generate-mobile': {
      budget: 40000,
      items: [
        { file: 'AGENTS.md', whole: true },
        { file: SOP, from: '## ① ', to: '## ② ' },
        { file: ENDS[1].file, section: '1.1b' },
        { file: ENDS[1].file, section: '10' },
        { file: ENDS[1].file, section: '9.7' },
        { file: '弘讯移动端design-system/tokens.json', jsonPath: 'colors' },
      ],
    },
  };

  const ruleIndex = {
    generated: new Date().toISOString().slice(0, 10),
    note: '生成物 · 由 sync-index.js 维护；禁止手改（check-reach 会判 FAIL）',
    files: Object.fromEntries(ENDS.map(e => [e.key, e.file])),
    rules,
    loadPlans,
  };
  return { outputs, ruleIndex };
}

function main() {
  const check = process.argv.includes('--check');
  const { outputs, ruleIndex } = build();
  let drift = 0;
  for (const e of ENDS) {
    const cur = fs.readFileSync(path.join(ROOT, e.file), 'utf8').replace(/\r\n/g, '\n');
    const next = outputs[e.key].text;
    if (cur !== next) {
      drift++;
      const delta = next.length - cur.length;
      console.log(`  ${check ? '✗' : '↻'} ${e.file}：${delta >= 0 ? '+' : ''}${delta} 字符`);
    } else {
      console.log(`  ✓ ${e.file}：索引一致`);
    }
  }
  const idxPath = path.join(ROOT, 'rule-index.json');
  const idxText = JSON.stringify(ruleIndex, null, 2) + '\n';
  if (!check) {
    for (const e of ENDS) fs.writeFileSync(path.join(ROOT, e.file), outputs[e.key].text, 'utf8');
    fs.writeFileSync(idxPath, idxText, 'utf8');
    console.log(`  ✓ 已写入 rule-index.json（${ruleIndex.rules.length} 条规则 / ${Object.keys(ruleIndex.loadPlans).length} 个加载计划）`);
  } else {
    const old = fs.existsSync(idxPath) ? fs.readFileSync(idxPath, 'utf8') : '';
    let same = false;
    try { same = !!old && JSON.stringify(JSON.parse(old)) === JSON.stringify(ruleIndex); } catch (e) { same = false; }
    if (!same) { drift++; console.log('  ✗ rule-index.json：与当前标题不一致，请跑 node sync-index.js'); }
    else console.log('  ✓ rule-index.json：一致');
  }
  if (check && drift) process.exit(1);
}

if (require.main === module) main();
module.exports = { build, parseFile, ENDS };
