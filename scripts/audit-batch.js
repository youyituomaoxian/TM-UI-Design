#!/usr/bin/env node
/*
 * audit-batch.js — 存量改造 · 项目级批量审计与覆盖率台账（2026-11-12）
 * ---------------------------------------------------------------------------
 * 解决什么：audit-spec.js / validate-spec.js 都是「一次一个文件」的 CLI，
 * 而 GENERATION-SOP §② 的 P0 要求「脚本 + 维度清单**全量**扫描」。二者之间
 * 缺一个载体：项目目录 → 页面清单 → 逐页门禁 → 覆盖率台账。
 * 没有它，「全量」只能靠人/Agent 手写循环，漏页不可见（台账只记找到了什么，
 * 不记没扫什么）。
 *
 * 用法：
 *   node scripts/audit-batch.js <项目目录> [--end web|mobile|auto] [--json <台账.json>] [--list] [--include dist]
 *     --end     默认 auto（文件名含 mobile/移动 → 移动端，否则 web）
 *     --json    写出结构化台账（含 pages / skipped / coverage）；不传只打印摘要
 *     --list    只枚举页面清单（F1 的「页面清单」第一步），不跑门禁
 *     --include 额外纳入的目录名（默认跳过 node_modules/.git/dist/dist-static/build/packages）
 *
 * 台账结构（供 P0/P1 消费）：
 *   { project, end, generatedAt, ruleset, totals{pages,scanned,skipped,failed,high,medium,coverage},
 *     pages[{file, rel, end, audit:{high,medium,status}, validate:{high,medium,status}, ok, error}],
 *     skipped[{rel, reason}] }
 *
 * exit：任一页 audit HIGH>0 / validate exit!=0 / 子进程异常 → 1；否则 0。--list 恒 0。
 * 说明：这不是真源文件，未接入 ci-local；是否升级为门禁（F12）需单独拍板。
 * ---------------------------------------------------------------------------
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const NODE = process.execPath;
const ROOT = path.resolve(__dirname, '..');
const AUDIT = path.join(ROOT, 'audit-spec.js');
const VALIDATE = {
  web: path.join(ROOT, '弘讯web端design-system', 'validate-spec.js'),
  mobile: path.join(ROOT, '弘讯移动端design-system', 'validate-spec.js'),
};
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'dist-static', 'build', 'packages', '.reasonix', '.workbuddy']);

function parseArgs(argv) {
  const o = { dir: null, end: 'auto', json: null, list: false, include: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--end') o.end = argv[++i];
    else if (a === '--json') o.json = argv[++i];
    else if (a === '--list') o.list = true;
    else if (a === '--include') o.include.push(argv[++i]);
    else if (!a.startsWith('-')) o.dir = a;
  }
  return o;
}

function walk(dir, out, include, skipped) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { skipped.push({ rel: dir, reason: '读取失败: ' + e.code }); return; }
  for (const ent of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(ent.name) && !include.includes(ent.name)) { skipped.push({ rel: p, reason: '默认跳过目录 ' + ent.name }); continue; }
      walk(p, out, include, skipped);
    } else if (/\.html?$/i.test(ent.name)) {
      out.push(p);
    }
  }
}

function endOf(file, byArg) {
  if (byArg !== 'auto') return byArg;
  return /mobile|移动/i.test(path.basename(file)) ? 'mobile' : 'web';
}

// 子进程捕获：stdout 走文件 fd（本机 execSync/spawnSync 管道会 EBUSY → e.stdout 恒空，
// 属「门禁看起来全绿实则从未执行」的失效模式，见 gate-capture.js VERDICT-A）。
// 退出码 = 权威判据；输出仅信息性。
let _seq = 0;
function run(cmd, args) {
  const os = require('os');
  const tmp = path.join(os.tmpdir(), `audit-batch-${process.pid}-${_seq++}.txt`);
  let out = '', status = null, why = null;
  let fd = null;
  try { fd = fs.openSync(tmp, 'w'); } catch (e) { return { status: null, out, spawnFailed: true, error: '临时文件不可写: ' + e.code }; }
  let r = null;
  try {
    r = spawnSync(cmd, args, { stdio: ['ignore', fd, 'ignore'], windowsHide: true });
  } catch (e) {
    why = 'spawn 抛错: ' + e.code;
  }
  try { fs.closeSync(fd); } catch (_) {}
  if (!why && r && r.error) why = 'spawn 失败: ' + r.error.code;
  status = r && typeof r.status === 'number' ? r.status : null;
  if (status === null && !why) why = '子进程无退出码（signal=' + (r && r.signal) + '）';
  // Windows 下子进程句柄释放存在滞后：读失败就重试，仍失败则显式报告（不静默当成 0）
  for (let i = 0; i < 20 && !out; i++) {
    try { out = fs.readFileSync(tmp, 'utf8'); break; } catch (e) { why = why || ('读输出失败: ' + e.code); }
    const t = Date.now(); while (Date.now() - t < 15) { /* 短等 */ }
  }
  try { fs.unlinkSync(tmp); } catch (_) {}
  return { status, out, spawnFailed: status === null, error: why };
}

function parseSummary(text) {
  // 兼容两脚本的摘要行；取不到就返回 null（不做「默认 0」的 fail-open）
  const high = /HIGH\s*(\d+)/.exec(text);
  const med = /MEDIUM\s*(\d+)/.exec(text);
  if (!high && !med) return null;
  return { high: high ? +high[1] : null, medium: med ? +med[1] : null };
}

// F11（2026-11-12）：MEDIUM 分档——「必修」判视觉缺陷，「提示」多为写法/噪声（自造类、裸尺寸、
// 色板定义行、已知禁配等）。分档只为让台账排序，不放松任何门槛；清单集中在此处维护（与 check-size
// 的 LIMITS 同理：阈值/分档属脚本策略，不散落到文档）。
const ADVISORY_PREFIXES = [
  'css.vardef.hex', 'css.asset.hex', 'wcag.contrast.banned', 'contrast.near-invisible', 'text.layer', 'grid.4px',
  'layout.inline.dimension', 'layout.module-spacing', 'layout.table-minrow', 'class.self-defined',
  'aesthetic.', 'icon.source', 'page.species.missing', 'chart.line.vertical', 'chart.svg.',
  'scroll.global.body', 'table.row.', 'm.empty.placeholder', 'mtag.size', 'kv.row.required',
  'card.fill-in-grid', 'font.family', 'tree.collapsed.contract',
];
const isAdvisory = (c) => ADVISORY_PREFIXES.some((p) => String(c || '').startsWith(p));

function auditOne(file, end) {
  const tmp = path.join(require('os').tmpdir(), 'audit-batch-' + process.pid + '-' + Math.random().toString(36).slice(2) + '.json');
  const r = run(NODE, [AUDIT, file, '--end', end, '--json', tmp]);
  let summary = null, ruleset = null, must = null, advisory = null;
  if (fs.existsSync(tmp)) {
    try {
      const j = JSON.parse(fs.readFileSync(tmp, 'utf8'));
      summary = j.summary; ruleset = j.ruleset;
      if (Array.isArray(j.violations)) {
        const meds = j.violations.filter((v) => v.severity === 'MEDIUM');
        must = meds.filter((v) => !isAdvisory(v.contract)).length;
        advisory = meds.length - must;
      }
    } catch (e) { /* 解析失败 → 保持 null */ }
    try { fs.unlinkSync(tmp); } catch (e) {}
  }
  const parsed = summary || parseSummary(r.out);
  return {
    high: parsed ? parsed.high : null,
    medium: parsed ? parsed.medium : null,
    mediumMust: must,
    mediumAdvisory: advisory,
    status: r.status,
    countAvailable: !!parsed,
    ruleset,
    error: r.error,
  };
}

function validateOne(file, end) {
  const r = run(NODE, [VALIDATE[end], file]);
  return {
    high: null, medium: null,           // validate-spec 无 --json；HIGH 数从摘要行取，取不到为 null
    summary: parseSummary(r.out),
    status: r.status,
    error: r.error,
  };
}

function main() {
  const opt = parseArgs(process.argv.slice(2));
  if (!opt.dir) { console.error('用法: node scripts/audit-batch.js <项目目录> [--end web|mobile|auto] [--json 台账.json] [--list]'); process.exit(2); }
  const dir = path.resolve(opt.dir);
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) { console.error('目录不存在: ' + dir); process.exit(2); }

  const files = [], skipped = [];
  walk(dir, files, opt.include, skipped);
  const rows = files.map(f => ({ file: f, rel: path.relative(dir, f).split(path.sep).join('/'), end: endOf(f, opt.end) }));

  if (opt.list) {
    console.log(`\n📋 页面清单（${rows.length} 个 HTML · ${dir}）`);
    rows.forEach((r, i) => console.log(`  ${String(i + 1).padStart(3)}. [${r.end}] ${r.rel}`));
    if (skipped.length) console.log(`  ⏭️ 跳过 ${skipped.length} 项（${skipped.slice(0, 3).map(s => s.rel).join(', ')}${skipped.length > 3 ? ' …' : ''}）`);
    process.exit(0);
  }

  // fail-closed：0 页 = 范围没指向页面（路径写错/产物在 dist 里），不是「全部通过」
  if (!rows.length) {
    console.error(`\n❌ 未枚举到任何 HTML（${dir}）——跳过 ${skipped.length} 项。`);
    console.error('   先确认目录选对；若页面在 dist/build，用 --include dist 显式纳入。');
    process.exit(1);
  }

  console.log(`\n🔍 存量改造批量审计（项目级）`);
  console.log(`   项目: ${dir}`);
  console.log(`   页面: ${rows.length} 个 HTML（跳过 ${skipped.length} 项）\n`);

  let failed = 0, highSum = 0, medSum = 0, mustSum = 0;
  const pages = [];
  rows.forEach((r, i) => {
    const a = auditOne(r.file, r.end);
    const v = validateOne(r.file, r.end);
    const validateHigh = v.summary && v.summary.high !== null ? v.summary.high : null;
    const blocked = !a.countAvailable || (a.high !== null && a.high > 0) || v.status !== 0 || !!a.error || !!v.error;
    if (blocked) failed++;
    if (a.high) highSum += a.high;
    if (a.medium) medSum += a.medium;
    if (a.mediumMust) mustSum += a.mediumMust;
    pages.push({ ...r, audit: a, validate: { ...v, high: validateHigh }, ok: !blocked });
    const mark = blocked ? '❌' : '✅';
    const av = a.countAvailable
      ? `audit H${a.high}/M${a.medium}` + (a.mediumMust ? `（必修 ${a.mediumMust}）` : '')
      : 'audit 计数不可用';
    const vv = validateHigh !== null ? `validate H${validateHigh}/M${(v.summary && v.summary.medium) ?? '?'}` : (v.status === 0 ? 'validate ✅' : 'validate ❌');
    console.log(`  ${mark} [${String(i + 1).padStart(3)}/${rows.length}] ${r.rel}  ${av} · ${vv}`);
  });

  const scanned = pages.length;
  const ledger = {
    project: dir,
    end: opt.end,
    generatedAt: new Date().toISOString(),
    ruleset: (pages.find(p => p.audit && p.audit.ruleset) || {}).ruleset || null,
    totals: {
      pages: rows.length, scanned, skipped: skipped.length, failed,
      high: highSum, medium: medSum, mediumMust: mustSum,
      coverage: scanned ? +(scanned / rows.length).toFixed(4) : 0,
    },
    pages, skipped,
  };

  console.log(`\n📊 合计：${rows.length} 页 / 已扫 ${scanned} / 覆盖率 ${(ledger.totals.coverage * 100).toFixed(1)}% / 不通过 ${failed}`);
  console.log(`   audit HIGH ${highSum} · MEDIUM ${medSum}（必修 ${mustSum} / 提示 ${medSum - mustSum}）`);

  if (opt.json) {
    const out = path.resolve(opt.json);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, JSON.stringify(ledger, null, 2), 'utf8');
    console.log(`📝 台账已写出: ${out}`);
  } else {
    console.log('ℹ️ 未传 --json，台账未落盘（P0 盘点的「全量覆盖率」需要它，建议随手落盘）。');
  }

  if (failed > 0) { console.log('❌ 存在不通过页面，exit 1。'); process.exit(1); }
  console.log('✅ 全部页面通过（0 HIGH / validate exit 0）。');
  process.exit(0);
}

main();
