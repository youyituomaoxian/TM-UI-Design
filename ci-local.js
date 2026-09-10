#!/usr/bin/env node
/*
 * ci-local.js — 弘讯设计系统 A 包本地 CI 等效验证（2026-07-30）
 * ---------------------------------------------------------------------------
 * 串联：两端门禁 validate-spec.js page-template.html + tokens 结构断言 + 模板值断言
 * 全绿 exit 0；任一失败 exit 1。CI 文件本身不动（待 push 后接入 .github/workflows/validate.yml）。
 * 自包含：不依赖 .workbuddy/tmp 脚本，断言逻辑内联。
 * ---------------------------------------------------------------------------
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { generatePalette } = require('./brand-color-engine/generate.js');

const NODE = process.execPath; // RED-022 修复：不再硬编码具体用户名/Node 版本绝对路径
const ROOT = __dirname;
const WEB = path.join(ROOT, '弘讯web端design-system');
const MOB = path.join(ROOT, '弘讯移动端design-system');
const norm = (s) => String(s).replace(/\s+/g, '').replace(/;$/, '');

let pass = 0, fail = 0;
function ok(name, cond) { console.log(`  ${cond ? '✅' : '❌'} ${name}`); cond ? pass++ : fail++; }
// RED-012 修复：任何遗漏异常都应以 exit 1 收场（fail-closed），而非栈回溯
process.on('uncaughtException', e => { console.error('❌ ci-local 异常:', e.message); process.exit(1); });

function runGate(label, cwd) {
  process.stdout.write(`\n▶ ${label}\n`);
  try {
    execSync(`"${NODE}" validate-spec.js page-template.html`, { cwd, stdio: 'inherit' });
    return true;
  } catch (e) { return false; }
}

// ===== tokens 结构 + 模板值断言（两端） =====
function checkEnd(label, dir, isMobile) {
  const t = JSON.parse(fs.readFileSync(path.join(dir, 'tokens.json'), 'utf8'));
  const html = fs.readFileSync(path.join(dir, 'page-template.html'), 'utf8');
  // 仅取亮色 :root{...}（无属性选择器）作为变量真源；[data-theme="dark"] / [data-density] 块忽略，
  // 否则暗色块重定义的同名变量会覆盖亮色值，导致与亮色 tokens 比较失败。
  const rootMatch = html.match(/:root\s*\{([^}]*)\}/);
  const rootCss = rootMatch ? rootMatch[1] : html;
  const vars = {};
  const re = /(--[\w-]+)\s*:\s*([^;]+)/g;
  let m; while ((m = re.exec(rootCss))) vars[m[1]] = m[2].trim();

  console.log(`\n▶ ${label} tokens + 模板值断言`);
  // elevation 5 级 + 模板变量
  ok('elevation 恰 5 级', JSON.stringify(Object.keys(t.elevation)) === JSON.stringify(['sunken','default','raised','overlay','overflow']));
  Object.entries(t.elevation).forEach(([lv, obj]) => {
    ok(`--elev-${lv}-surface 模板值=tokens`, norm(vars[`--elev-${lv}-surface`]) === norm(obj.surface));
    ok(`--elev-${lv}-shadow 模板值=tokens`, norm(vars[`--elev-${lv}-shadow`]) === norm(obj.shadow));
  });
  // motion duration 4 档 + 模板
  ok('motion.duration 恰 6 档', JSON.stringify(Object.keys(t.motion.duration)) === JSON.stringify(['instant','fast','normal','slow','slower','slowest']));
  Object.entries(t.motion.duration).forEach(([k, v]) => {
    ok(`--motion-duration-${k} 模板值=${v}ms`, norm(vars[`--motion-duration-${k}`]) === norm(v + 'ms'));
  });
  // motion easing 模板值
  Object.entries(t.motion.easing).forEach(([k, v]) => {
    ok(`--motion-${k} 模板值=tokens`, norm(vars[`--motion-${k}`]) === norm(v));
  });
  // shadow 旧名 + 双层(rgba≥2)
  const shadowMap = isMobile
    ? [['--shadow-s', t.shadows.s.value], ['--shadow-m', t.shadows.m.value], ['--shadow-l', t.shadows.l.value]]
    : [['--shadow-card', t.shadow.card], ['--shadow-modal', t.shadow.modal], ['--shadow-float', t.shadow.float], ['--shadow-row-hover', t.shadow.tableRowHover]];
  shadowMap.forEach(([cv, tv]) => {
    ok(`${cv} 模板值=tokens`, norm(vars[cv]) === norm(tv));
    ok(`${cv} 双层(rgba≥2)`, typeof vars[cv] === 'string' && (vars[cv].match(/rgba\(/g) || []).length >= 2); // RED-012 修复：缺失变量时 guard，避免崩溃
  });
  // B 包：字阶 13 级（Web）+ familyMono + density + bottom-nav（移动端）
  if (!isMobile) {
    ok('Web font.scale ≥12 级', Object.keys(t.font.scale).length >= 12);
    ok('Web H1(display) size∈[28,32]', t.font.scale.display.size >= 28 && t.font.scale.display.size <= 32);
    ok('Web font.familyMono 存在', !!t.font.familyMono);
    ok('Web --font-mono 模板存在', !!vars['--font-mono']);
    ok('Web density 三档键齐全', JSON.stringify(Object.keys(t.density)) === JSON.stringify(['compact','comfortable','spacious']));
    ok('Web --density-row-height 模板存在', !!vars['--density-row-height']);
  } else {
    ok('移动端 typography.fontFamilyMono 存在', !!t.typography.fontFamilyMono);
    ok('移动端 --font-mono 模板存在', !!vars['--font-mono']);
    ok('移动端 density comfortable only', t.density.compact === null && t.density.spacious === null && !!t.density.comfortable);
    ok('移动端 shadows 含 bottom-nav', !!t.shadows['bottom-nav']);
    ok('移动端 --density-row-height 模板存在', !!vars['--density-row-height']);
  }
}

// ===== C 包：dark 节 = 引擎快照等式断言（防手改；值唯一真源 = brand-color-engine） =====
function verifyDark(label, dir, isMobile) {
  const t = JSON.parse(fs.readFileSync(path.join(dir, 'tokens.json'), 'utf8'));
  console.log(`\n▶ ${label} dark 节 = 引擎快照等式`);
  const platform = isMobile ? 'mobile' : 'web';
  const p = generatePalette('#005EAE', { mode: 'dark', platform });
  const d = t.dark;
  ok(`${label} dark 节存在`, !!d);
  if (!d) return;
  // primary（移动端按下态键名=pressed，Web=click）
  const pk = isMobile ? 'pressed' : 'click';
  const primeOk = ['default','hover','disabledBg','disabledText'].every(k => d.colors.primary[k] === p.primary[k])
                 && d.colors.primary[pk] === p.primary[pk];
  ok(`${label} dark.primary 5 键 = 引擎`, primeOk);
  // neutral（Web 11 级 / 移动端 10 级，独立暗色阶）
  const steps = isMobile ? 10 : 11;
  let neuOk = true;
  for (let i = 0; i < steps; i++) {
    const name = 'N' + (i + 1);
    const tv = isMobile ? d.colors.neutral[name].hex : d.colors.neutral[name];
    if (tv !== p.neutral[i].hex) neuOk = false;
  }
  ok(`${label} dark.neutral N1..N${steps} = 引擎`, neuOk);
  // functional（success/warning/error/running × {default,bg,border,text}，平台/模式固定）
  let fnOk = true;
  for (const role of ['success','warning','error','running']) {
    const df = d.colors.functional[role], pf = p.functional[role];
    if (!df || !pf) { fnOk = false; continue; }
    for (const k of ['default','bg','border','text']) if (df[k] !== pf[k]) fnOk = false;
  }
  ok(`${label} dark.functional 4 角色×4 键 = darkDefaults`, fnOk);
  // brandSurface + background
  ok(`${label} dark.brandSurface = 引擎`, d.colors.brandSurface === p.background.brandSurface);
  let bgOk = true;
  for (const k of ['page','surface','elevated','textPrimary','textSecondary','textTertiary','border'])
    if (d.background[k] !== p.background[k]) bgOk = false;
  ok(`${label} dark.background 7 键 = 引擎`, bgOk);
}

// ===== NEW-006 修复：引擎输入(base-spec.json) 与 值真源(tokens.json) 亮色图表色一致性 =====
// 此前无任何检查横跨这两份「真源」，结果移动端亮色图表在 tokens.json 是 13 色、
// 在 base-spec.json 只有 12 色（缺 gray #64748B），读不同源的消费者拿到不同调色板且长期无感。
function verifyEngineVsTokens(label, dir, isMobile) {
  const t = JSON.parse(fs.readFileSync(path.join(dir, 'tokens.json'), 'utf8'));
  const p = generatePalette('#005EAE', { mode: 'light', platform: isMobile ? 'mobile' : 'web' });
  console.log(`\n▶ ${label} 引擎 vs tokens.json 亮色图表色一致性（NEW-006）`);
  const raw = t.colors && t.colors.chart;
  if (!raw) { ok(`${label} tokens.json 存在 colors.chart`, false); return; }
  const tokenHex = (Array.isArray(raw) ? raw.map((c) => c.hex || c) : Object.values(raw).map((v) => v.hex || v))
    .map((h) => String(h).toUpperCase());
  const engineHex = p.chart.map((c) => c.hex.toUpperCase());
  ok(`${label} 图表色条数一致（tokens ${tokenHex.length} / 引擎 ${engineHex.length}）`, tokenHex.length === engineHex.length);
  const diff = [];
  for (let i = 0; i < Math.max(tokenHex.length, engineHex.length); i++) {
    if (tokenHex[i] !== engineHex[i]) diff.push(`  #${i + 1} tokens=${tokenHex[i] || '(缺)'} 引擎=${engineHex[i] || '(缺)'}`);
  }
  if (diff.length) console.log(diff.join('\n'));
  ok(`${label} 图表色逐项一致`, diff.length === 0);
}

console.log('========== 弘讯设计系统 A+B+C 包 ci-local ==========');
const gW = runGate('Web 门禁 page-template.html', WEB);
const gM = runGate('移动端门禁 page-template.html', MOB);
ok('Web 门禁 0 HIGH exit 0', gW);
ok('移动端门禁 0 HIGH exit 0', gM);
function guard(name, fn) { try { fn(); } catch (e) { console.log(`  ❌ ${name} 执行异常: ${e.message}`); fail++; } }
guard('Web tokens 断言', () => checkEnd('Web', WEB, false));
guard('移动端 tokens 断言', () => checkEnd('移动端', MOB, true));
guard('Web dark 断言', () => verifyDark('Web', WEB, false));
guard('移动端 dark 断言', () => verifyDark('移动端', MOB, true));

guard('Web 引擎vs tokens 图表色', () => verifyEngineVsTokens('Web', WEB, false));
guard('移动端 引擎vs tokens 图表色', () => verifyEngineVsTokens('移动端', MOB, true));

// RED-015 修复：引擎亮/暗对等性自检接入门禁。
// 此前「亮色有、暗色没有」的 CSS 变量缺口（如 web 暗色缺 --color-primary-active）
// 没有任何信号，一路静默流到页面上变成失效声明。
console.log(`\n▶ brand-color-engine 亮/暗对等性自检（RED-015）`);
guard('引擎对等性自检', () => {
  const { assertParity } = require('./brand-color-engine/generate.js');
  const { warnings } = assertParity();
  warnings.forEach((w) => console.log(`  ⚠ ${w}`));
  ok('引擎亮/暗对等性无硬错误', true);
});

// ===== P0-1 文档计数门禁（2026-08-25）：让手写文档的数字被机器管住 =====
// 背景：MASTER.md（声称 196）/ RULES.md（声称 84）与 icons/ 实际数（Web 185 / 移动 184）
// 长期漂移无信号——图标库换新后文档没跟上，直到 HANDOFF §7 P0-1 才发现。
// 方案：解析双端 MASTER.md / RULES.md 的「N 个」声称数字，与 icons/ 目录实际 SVG 数比对，不一致即 fail。
// 治本思路（相对 P2-4「删数字只留指针」）：数字是文档最易漂移也最该被校验的部分，
// 删掉数字门禁就无的放矢；保留数字 + 机器断言，让文档像代码一样被门禁管住。
function iconCountAssertions() {
  console.log(`\n▶ 文档图标计数 vs 目录实际（P0-1 · 阻断）`);
  const ends = [['Web', WEB], ['移动端', MOB]];
  for (const [label, dir] of ends) {
    const iconsDir = path.join(dir, 'icons');
    if (!fs.existsSync(iconsDir)) { ok(`${label} icons/ 目录存在`, false); continue; }
    const actual = fs.readdirSync(iconsDir).filter(f => /\.svg$/i.test(f)).length;
    ok(`${label} icons/ 实际 ${actual} 个 SVG`, actual > 0);
    for (const doc of ['MASTER.md', 'RULES.md']) {
      const docPath = path.join(dir, doc);
      if (!fs.existsSync(docPath)) { ok(`${label} ${doc} 存在`, false); continue; }
      const text = fs.readFileSync(docPath, 'utf8');
      // 限定「图标库/图标集/Icon」语境，避免误抓「~38 个独立组件（图标/原子元件）」这类组件计数；
      // 逐行取首个声明（一行同时写双端数字如「185 个…移动端 184 个」时，以首个即本端总数为准）。
      const claimed = [];
      for (const line of text.split('\n')) {
        const m = line.match(/(图标库|图标集|Icon)[^\n]*?(\d+)\s*个|(\d+)\s*个[^\n]*?(图标库|图标集|Icon)/);
        if (m) claimed.push(parseInt(m[2] || m[3], 10));
      }
      ok(`${label} ${doc} 图标数声明 ${claimed.join('/') || '(无声明)'} = 目录 ${actual}`, claimed.length === 0 || claimed.every(c => c === actual));
    }
  }
}
guard('文档图标计数断言', iconCountAssertions);

// RED-003 升级（2026-08-25）：根目录 *.html 由「信息性」升级为「阻断」。
// 前提已核实：NEW-001 假阳性已在 validate-spec.js L624-628 彻底修复（类名判定分两级，
// 页面自带 <style> 定义即可通过），且当前根目录 2 个 HTML（USAGE.html / USAGE_分享版.html）实测 HIGH 0。
// 范围分层（第一性原理）：根目录 *.html = 交付物 → 任一 HIGH 即 fail；
// output/ = 历史归档（非交付标准下的旧产物，如规范效果验证_20260807 实测 HIGH 17）→ 报告但信息性，
// 阻断会让 ci-local 对历史欠账立即红，且这些文件本就不是新标准产物。交付物 0 HIGH 才是门禁本义。
console.log(`\n▶ 仓库根 *.html 门禁覆盖扫描（RED-003 · 阻断）`);
let scanned = 0, anyHigh = 0;
for (const f of fs.readdirSync(ROOT)) {
  if (!/\.html?$/i.test(f)) continue;
  if (!fs.statSync(path.join(ROOT, f)).isFile()) continue;
  const end = /mobile|移动/i.test(f) ? MOB : WEB;
  const spec = path.join(end, 'validate-spec.js');
  let out = '';
  try {
    out = execSync(`"${NODE}" "${spec}" "${path.resolve(ROOT, f)}"`, { encoding: 'utf8' }).toString();
  } catch (e) {
    out = (e.stdout || '').toString(); // 子进程非零退出仍读取已打印的报告
  }
  const m = out.match(/HIGH (\d+)/);
  const h = m ? parseInt(m[1], 10) : 0;
  scanned++; anyHigh += h;
  console.log(`  ${h > 0 ? '❌' : '✅'} ${f} — HIGH ${h}`);
}
ok(`根目录 ${scanned} 个 HTML 交付物 0 HIGH（阻断）`, scanned > 0 ? anyHigh === 0 : true);

// ===== 存量改造增量审计（audit-rules.json M-01/02/03 · audit-spec.js · 2026-09-09）=====
// 与 validate-spec（生成门禁）互补的 machine 类审计规则：CSS 裸 hex / 按钮状态矩阵 / 状态点语义白名单。
// 范围分层与 RED-003 同构：双端 page-template 真源模板 + 根目录交付物（阻断）。
console.log(`\n▶ 存量改造增量审计 audit-spec（M-01/02/03 · 阻断）`);
function runAudit(file, end) {
  let out = '';
  try {
    out = execSync(`"${NODE}" "${path.join(ROOT, 'audit-spec.js')}" "${file}" --end ${end}`, { encoding: 'utf8' }).toString();
  } catch (e) {
    out = (e.stdout || '').toString(); // HIGH 时子进程 exit 1，仍读取已打印报告
  }
  const h = parseInt((out.match(/HIGH (\d+)/) || [])[1] || '0', 10);
  const m = parseInt((out.match(/MEDIUM (\d+)/) || [])[1] || '0', 10);
  console.log(`  ${h > 0 ? '❌' : '✅'} ${path.basename(file)} — audit HIGH ${h} / MED ${m}`);
  return h;
}
let auditHigh = 0;
auditHigh += runAudit(path.join(WEB, 'page-template.html'), 'web');
auditHigh += runAudit(path.join(MOB, 'page-template.html'), 'mobile');
for (const f of fs.readdirSync(ROOT)) {
  if (!/\.html?$/i.test(f) || !fs.statSync(path.join(ROOT, f)).isFile()) continue;
  auditHigh += runAudit(path.join(ROOT, f), /mobile|移动/i.test(f) ? 'mobile' : 'web');
}
ok('audit 增量审计（双端 page-template + 根目录交付物）0 HIGH（阻断）', auditHigh === 0);

// ===== 真源一致性 check-sync（vendor↔真源同构 + 双端同名类漂移白名单 · 2026-09-09）=====
// 检查一：packages/*/dist-static components.css ↔ template.css 同构段逐声明一致（阻断）；
// 检查二：双端 template.css 同名类属性键差集比对，SYNC_WHITELIST 白名单外阻断。
console.log(`\n▶ 真源一致性 check-sync（vendor 同构 + 双端同名类 · 阻断）`);
let syncOk = false;
try {
  execSync(`"${NODE}" "${path.join(ROOT, 'check-sync.js')}"`, { stdio: 'inherit' });
  syncOk = true;
} catch (e) { syncOk = false; }
ok('check-sync：vendor 同构段一致 + 双端同名类白名单外零漂移（阻断）', syncOk);

// RED-003 扩展：output/ 历史归档扫描（信息性，不阻断）——展示历史产物规范漂移趋势，不追溯交付。
console.log(`\n▶ output/ 历史归档门禁覆盖扫描（RED-003-ext · 信息性，不阻断）`);
const outDir = path.join(ROOT, 'output');
let scannedOut = 0, outHigh = 0;
if (fs.existsSync(outDir)) {
  for (const f of fs.readdirSync(outDir)) {
    if (!/\.html?$/i.test(f)) continue;
    if (!fs.statSync(path.join(outDir, f)).isFile()) continue;
    const end = /mobile|移动/i.test(f) ? MOB : WEB;
    const spec = path.join(end, 'validate-spec.js');
    let out = '';
    try {
      out = execSync(`"${NODE}" "${spec}" "${path.resolve(outDir, f)}"`, { encoding: 'utf8' }).toString();
    } catch (e) {
      out = (e.stdout || '').toString();
    }
    const m = out.match(/HIGH (\d+)/);
    const h = m ? parseInt(m[1], 10) : 0;
    scannedOut++; outHigh += h;
    console.log(`  ${h > 0 ? '⚠️' : '✅'} ${f} — HIGH ${h}`);
  }
}
console.log(scannedOut > 0
  ? `  ℹ️ 共扫描 ${scannedOut} 个 output/ HTML，HIGH 合计 ${outHigh}（信息性，历史归档不阻断）`
  : `  ℹ️ output/ 未发现 HTML 归档，跳过。`);

// ===== V11-T5 运行时首屏截断检查（RULES §4.4c · 一期信息性，观察误报后另议升级阻断）=====
console.log(`\n▶ V11 运行时首屏截断检查（看板页核心卡完整性 · 信息性一期）`);
try {
  const foldGate = path.join(WEB, 'scripts', 'fold-gate-web.js');
  if (!fs.existsSync(foldGate)) throw new Error('fold-gate-web.js 不存在');
  if (!fs.existsSync(outDir)) throw new Error('无 output/ 目录');
  const boards = fs.readdirSync(outDir)
    .filter(f => /\.html?$/i.test(f))
    .filter(f => { try { return fs.readFileSync(path.join(outDir, f), 'utf8').includes('stat-grid'); } catch (e) { return false; } })
    .map(f => path.join(outDir, f));
  if (!boards.length) throw new Error('无看板页（含 stat-grid）');
  let out3 = '';
  try {
    out3 = execSync(`"${NODE}" "${foldGate}" ${boards.map(b => `"${b}"`).join(' ')}`, { encoding: 'utf8', timeout: 120000 }).toString();
  } catch (e) {
    out3 = ((e.stdout || '') + '\n' + (e.stderr || '')).toString();
  }
  let results = null;
  try { results = JSON.parse(out3.slice(out3.indexOf('['))); } catch (e) {}
  if (!results) throw new Error('fold-gate 输出解析失败');
  for (const r of results) {
    if (r.skip) { console.log(`  ⏭️ ${r.file} — ${r.skip}（SKIP）`); continue; }
    if (r.error) { console.log(`  ⚠️ ${r.file} — 检查异常：${r.error}`); continue; }
    if (r.cut && r.cut.length) {
      console.log(`  ⚠️ ${r.file} — 首屏核心卡被截断：${r.cut.map(c => `${c.title}（可见 ${c.visiblePct}%）`).join('、')}`);
    } else {
      console.log(`  ✅ ${r.file} — 主图行 ${r.cards} 卡首屏完整（切点落 gap）`);
    }
  }
  console.log(`  ℹ️ 一期信息性：结果不计入 fail（阻断升级观察误报后另议）。`);
} catch (e) {
  console.log(`  ⏭️ 跳过：${e.message.slice(0, 60)}（环境不可用时自动 SKIP，不计失败）`);
}

console.log(`\n========== ci-local 总结 ==========`);
console.log(`📊 ${pass} pass / ${fail} fail | 门禁 ${gW && gM ? '✅' : '❌'}`);
const allOk = gW && gM && fail === 0;
console.log(allOk ? '✅ 全绿 exit 0' : '❌ 存在失败 exit 1');
process.exit(allOk ? 0 : 1);
