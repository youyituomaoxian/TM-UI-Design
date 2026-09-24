#!/usr/bin/env node
// ===== roll-changelog：CHANGELOG 自动滚动归档（2026-09-23）=====
// 用途：主 CHANGELOG 超出 check-size 阈值时，自动把最旧条目滚入 CHANGELOG-archive.md。
// 阈值单一真源 = check-size.js LIMITS（本脚本正则现读，不设副本）。归档条目原样移入。
// 用法：node roll-changelog.js [--dry]   （--dry 只报告不写）
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const dry = process.argv.includes('--dry');

// 从 check-size.js 现读阈值（单一真源）
const cs = fs.readFileSync(path.join(ROOT, 'check-size.js'), 'utf8');
function limitOf(rel) {
  const m = cs.match(new RegExp("\\['" + rel.replace(/\//g, '\\/') + "', (\\d+)\\]"));
  return m ? Number(m[1]) : null;
}

let fail = 0;
for (const dir of ['弘讯web端design-system', '弘讯移动端design-system']) {
  const rel = dir + '/CHANGELOG.md';
  const max = limitOf(rel);
  if (!max) { console.error(`FAIL ${rel}: check-size.js 无该文件阈值`); fail++; continue; }
  const mainP = path.join(ROOT, dir, 'CHANGELOG.md');
  const archP = path.join(ROOT, dir, 'CHANGELOG-archive.md');
  let rolled = 0;
  while (true) {
    const lines = fs.readFileSync(mainP, 'utf8').split('\n');
    const size = lines.join('\n').length;
    if (size <= max) break;
    // 最旧条目 = 最后一个 "^## [" 的行
    let iLast = -1;
    for (let i = lines.length - 1; i >= 0; i--) if (/^## \[/.test(lines[i])) { iLast = i; break; }
    if (iLast < 0) { console.error(`FAIL ${rel}: 无条目可滚`); fail++; break; }
    const rollId = (lines[iLast].match(/^## \[([^\]]+)\]/) || [])[1];
    const chunk = lines.splice(iLast, lines.length - iLast).join('\n').replace(/\n+$/, '');
    // archive：插入到头部注记之后
    let arch = fs.readFileSync(archP, 'utf8');
    const aIns = arch.indexOf('\n', arch.lastIndexOf('> 切割线'));
    arch = arch.slice(0, aIns + 1) + '\n' + chunk + '\n\n---\n' + arch.slice(aIns + 1).replace(/^\n+/, '');
    arch = arch.replace(/^> 切割线（滚动更新）：.*$/m,
      `> 切割线（滚动更新）：${dir.includes('web') ? 'web' : 'mobile'} 归档 \`[${rollId}]\` 及更早。新条目一律写主文件顶部；超限时由 roll-changelog.js 自动滚动。`);
    if (!dry) {
      fs.writeFileSync(archP, arch, 'utf8');
      fs.writeFileSync(mainP, lines.join('\n'), 'utf8');
    } else {
      console.log(`[dry] ${dir}: 将滚出 [${rollId}]（约 ${chunk.length} 字符）`);
      break; // dry 模式文件未变，循环无意义：只报告最旧一条
    }
    rolled++;
    if (rolled >= 8) { console.error(`FAIL ${rel}: 单次滚动超过 8 条，中止排查`); fail++; break; }
  }
  const after = fs.readFileSync(mainP, 'utf8').length;
  console.log(`${dry ? '[dry] ' : ''}${dir}: 滚出 ${rolled} 条 → 主文件 ${after}/${max} 字符`);
}
if (fail) process.exit(1);
console.log('ROLL DONE');
