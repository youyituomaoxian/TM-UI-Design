#!/usr/bin/env node
/*
 * ci-local.js — 弘讯设计系统 A 包本地 CI 等效验证（2026-07-30）
 * ---------------------------------------------------------------------------
 * 串联：两端门禁 validate-spec.js page-template.html + tokens 结构断言 + 模板值断言
 * 全绿 exit 0；任一失败 exit 1。CI 文件本身不动（待 push 后接入 .github/workflows/validate.yml，见 BLOCKED.md）。
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
  ok('motion.duration 恰 4 档', JSON.stringify(Object.keys(t.motion.duration)) === JSON.stringify(['instant','fast','normal','slow']));
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

// RED-003 修复（增量、非阻断）：遍历仓库根 *.html 逐个过门禁，暴露「已交付产物未受门禁覆盖」的缺口。
// 注：当前 checkClassWhitelist 对页面自带 <style> 的定义会误报（NEW-001），故仅作信息展示、暂不影响 allOk；
// 待 NEW-001 修复后可改为阻断。
console.log(`\n▶ 仓库根 *.html 门禁覆盖扫描（RED-003 · 信息性，暂不阻断）`);
// 真 glob：不写死文件名（早期版本硬编码已废弃的 cnc-dashboard*.html，文件删除后扫描静默失效）。
// 端别按文件名启发式路由：含 mobile/移动 → 移动端门禁，其余 → Web 门禁。
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
  console.log(`  ${h > 0 ? '⚠️' : '✅'} ${f} — HIGH ${h}${h > 0 ? '（含 NEW-001 已知假阳性，待修后转阻断）' : ''}`);
}
console.log(scanned > 0
  ? `  ℹ️ 共扫描 ${scanned} 个根目录 HTML，HIGH 合计 ${anyHigh}（信息性）`
  : `  ℹ️ 仓库根未发现 HTML 交付产物，跳过。`);

console.log(`\n========== ci-local 总结 ==========`);
console.log(`📊 ${pass} pass / ${fail} fail | 门禁 ${gW && gM ? '✅' : '❌'}`);
const allOk = gW && gM && fail === 0;
console.log(allOk ? '✅ 全绿 exit 0' : '❌ 存在失败 exit 1');
process.exit(allOk ? 0 : 1);
