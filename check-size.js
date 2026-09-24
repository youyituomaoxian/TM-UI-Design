#!/usr/bin/env node
// ===== 文档体积门禁 check-size（SSOT T-B · 2026-09-22）=====
// 目标：防真源文件无序膨胀（监督实战沉淀 J5：字符数为主、阈值先实测现值、防膨胀转移）。
// 规则：
//   1. 清单内文件字符数超限 → FAIL（阻断）。阈值 = 2026-09-22 实测现值 + 分级余量（≤10k:+15% / 10~50k:+8% / >50k:+5%）。
//   2. 清单封闭：根 / 双端目录顶层新增 .md/.json/.js/.html/.css/.txt/.log 未登记且未豁免 → FAIL 提示登记或豁免（防「拆文件绕阈值」及「换扩展名落根目录」的膨胀转移，2026-09-23 监督遗留风险）。
//   3. 现值 ≥ 阈值 90% → WARN（信息性，提前预警）。
// 阈值调整走维护者六步：登记 → 改本文件 → ci-local 全绿 → 双端 CHANGELOG 留痕。
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;

// [相对路径, 字符数上限, optional?]  optional=true：文件可不存在（本地不入库文件）
const LIMITS = [
  // 根
  ['GENERATION-SOP.md', 44300],
  ['AGENTS.md', 5900],
  ['README.md', 8500],
  ['USAGE-GUIDE.md', 11800],
  ['团队使用指南.md', 11600],
  ['CHART-SPEC.md', 16000],
  ['DARK-MODE.md', 10300],
  ['VISUAL-SPEC.md', 12400],
  ['CROSS-PLATFORM-COLORS.md', 2500],
  ['标准提示词模板.md', 5800],
  ['audit-rules.json', 28600],
  ['ci-local.js', 17800],
  ['audit-spec.js', 22000],
  ['check-sync.js', 9200],
  ['check-size.js', 6200],
  ['roll-changelog.js', 5600],
  ['HANDOFF.md', 12200, true],
  // Web 端
  ['弘讯web端design-system/RULES.md', 51600],
  ['弘讯web端design-system/MASTER.md', 22200],
  ['弘讯web端design-system/DESIGN-TOKENS.md', 15000],
  ['弘讯web端design-system/components.md', 16300],
  ['弘讯web端design-system/components.json', 74600],
  ['弘讯web端design-system/template.css', 57500],
  ['弘讯web端design-system/tokens.json', 13300],
  ['弘讯web端design-system/page-template.html', 36000],
  ['弘讯web端design-system/validate-spec.js', 113000],
  ['弘讯web端design-system/agent-starter.html', 4400],
  ['弘讯web端design-system/README.md', 4600],
  ['弘讯web端design-system/CHANGELOG.md', 11000],
  ['弘讯web端design-system/CHANGELOG-archive.md', 60000], // 滚动归档容器：只增不减，超 60k 按年拆分
  // 移动端
  ['弘讯移动端design-system/RULES.md', 54200],
  ['弘讯移动端design-system/MASTER.md', 26400],
  ['弘讯移动端design-system/DESIGN-TOKENS.md', 20100],
  ['弘讯移动端design-system/components.md', 8300],
  ['弘讯移动端design-system/components.json', 44800],
  ['弘讯移动端design-system/template.css', 62200],
  ['弘讯移动端design-system/tokens.json', 22800],
  ['弘讯移动端design-system/page-template.html', 11600],
  ['弘讯移动端design-system/validate-spec.js', 67800],
  ['弘讯移动端design-system/agent-starter.html', 8000],
  ['弘讯移动端design-system/README.md', 3800],
  ['弘讯移动端design-system/CHANGELOG.md', 5300],
  ['弘讯移动端design-system/CHANGELOG-archive.md', 60000], // 滚动归档容器：只增不减，超 60k 按年拆分
];

// 豁免：非真源文件（产物 / 过程记录 / 指针壳），不出现在清单也不触发「未登记」
const EXEMPT = new Set([
  '.gitignore', 'LICENSE', 'CLAUDE.md',
  'USAGE.html', 'USAGE_分享版.html',
  '设计系统创作记录.md', '图标库换新记录_20260814.md', '待绘制Icon清单.md',
  '弘讯web端design-system/CROSS-PLATFORM-COLORS.md',
  '弘讯web端design-system/web规范展示_框架版_20260806_1050.html',
  '弘讯web端design-system/web规范展示_框架版_20260806_1050_分享版.html',
  '弘讯移动端design-system/展示页测试.html',
  '弘讯移动端design-system/移动端规范展示_20260806_0755.html',
  '弘讯移动端design-system/移动端规范展示_20260806_0755_分享版.html',
]);

const DIRS = [ROOT, path.join(ROOT, '弘讯web端design-system'), path.join(ROOT, '弘讯移动端design-system')];
let fail = 0, warn = 0, totalNow = 0, totalMax = 0;

console.log('▶ 文档体积门禁 check-size（字符数为主 · 清单封闭防膨胀转移）');

// 1) 清单文件逐个检查
for (const [rel, max, optional] of LIMITS) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) {
    if (optional) continue;
    console.error(`  ✗ FAIL ${rel}：清单内文件不存在`);
    fail++; continue;
  }
  const n = fs.readFileSync(p, 'utf8').length;
  totalNow += n; totalMax += max;
  if (n > max) {
    console.error(`  ✗ FAIL ${rel}：${n} 字符 > 上限 ${max}（超 ${n - max}）——膨胀须走维护者六步（归位治理优先于调阈值）`);
    fail++;
  } else if (max - n < Math.max(1000, max * 0.02)) {
    console.warn(`  ⚠ WARN ${rel}：${n}/${max}（剩余增长空间 <2%，接近上限）`);
    warn++;
  }
}

// 2) 清单封闭：未登记的新文本文件 → FAIL
const limitSet = new Set(LIMITS.map(l => l[0]));
for (const dir of DIRS) {
  for (const f of fs.readdirSync(dir).sort()) {
    const p = path.join(dir, f);
    if (!fs.statSync(p).isFile() || !/\.(md|json|js|html|css|txt|log)$/i.test(f)) continue;
    const rel = path.relative(ROOT, p).split(path.sep).join('/');
    if (limitSet.has(rel) || EXEMPT.has(rel)) continue;
    console.error(`  ✗ FAIL 未登记新文件：${rel} —— 须登记进 check-size.js LIMITS（含阈值）或登记 EXEMPT 豁免`);
    fail++;
  }
}

console.log(`  体积总账：${totalNow} / ${totalMax} 字符（清单 ${LIMITS.length} 项）`);
if (fail) {
  console.error(`check-size：${fail} FAIL / ${warn} WARN → exit 1`);
  process.exit(1);
}
console.log(`  ✓ check-size 通过（0 FAIL / ${warn} WARN）`);
