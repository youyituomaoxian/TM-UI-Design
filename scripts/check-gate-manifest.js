#!/usr/bin/env node
'use strict';
/* ============================================================
 * check-gate-manifest.js — 门禁清单自检（2026-11-20）
 *
 * 为什么需要它：门禁清单一旦成为唯一输入，「把文件从清单里删掉」就成了新绕过通道
 *   （等价于删检查）。本门禁把清单本身变成被测对象：
 *     1) 每个登记路径必须真实存在（防改名/删文件后门禁悄悄少查一页）；
 *     2) 同一路径不得重复登记、也不得同时出现在 pageScan.ignore 里（防清单自相矛盾）；
 *     3) 受控目录下的每个 .html 必须被登记或被显式忽略（覆盖性；防「删条目逃逸」）；
 *     4) ignore 必须写理由，shell 契约必须声明 id（防空手套）。
 *
 * 退出码：0 通过 / 1 失败 / 2 清单不可读。
 * ============================================================ */
const fs = require('fs');
const path = require('path');
const { ROOT, readManifest, abs } = require('./lib/shell-tools');

let m;
try { m = readManifest(); } catch (e) { console.error('❌ gate-manifest.json 不可读：' + e.message); process.exit(2); }

const rel = p => path.relative(ROOT, p).split(path.sep).join('/');
const uniq = list => [...new Set(list)];
let fail = 0;

const listed = [
  m.shell.truth,
  ...m.shell.inject,
  ...m.shell.derived,
  ...m.newScope.pages,
  ...m.newScope.treePages,
  ...m.newScope.shares
];
const ignored = (m.pageScan.ignore || []).map(i => i.path);

console.log('▶ 门禁清单自检（' + listed.length + ' 条登记 / ' + ignored.length + ' 条忽略）');

// 1) 存在性
for (const p of uniq(listed)) {
  if (!fs.existsSync(abs(p))) { console.error('✗ 登记了不存在的文件：' + p); fail++; }
}

// 2) 组内去重；inject/derived 不得交叉；登记与忽略不得冲突
const groups = {
  truth: [m.shell.truth],
  inject: m.shell.inject,
  derived: m.shell.derived,
  pages: m.newScope.pages,
  treePages: m.newScope.treePages,
  shares: m.newScope.shares
};
for (const [name, arr] of Object.entries(groups)) {
  const d = arr.filter((p, i) => arr.indexOf(p) !== i);
  if (d.length) { console.error('✗ ' + name + ' 组内重复：' + uniq(d).join(', ')); fail++; }
}
const cross = m.shell.inject.filter(p => m.shell.derived.includes(p));
if (cross.length) { console.error('✗ 同一页既当注入目标又当派生件：' + cross.join(', ')); fail++; }
const both = ignored.filter(p => listed.includes(p));
if (both.length) { console.error('✗ 同时登记又忽略：' + both.join(', ')); fail++; }

// 3) 覆盖性：受控目录下每个 .html 要么登记、要么显式忽略
const covered = new Set([...listed, ...ignored]);
const injectSet = new Set(m.shell.inject);
const derivedSet = new Set(m.shell.derived);
const ignoredSet = new Set(ignored);
for (const dir of m.pageScan.dirs) {
  const d = abs(dir);
  if (!fs.existsSync(d)) { console.error('✗ pageScan 目录不存在：' + dir); fail++; continue; }
  for (const f of fs.readdirSync(d).sort()) {
    if (!/\.html$/i.test(f)) continue;
    const p = rel(path.join(d, f));
    if (!covered.has(p)) {
      console.error('✗ 未登记页面：' + p + ' —— 登记进 gate-manifest.json 或写进 pageScan.ignore（含理由）');
      fail++;
    }
    // 3b) 含外壳工具区的页面必须进 inject/derived——否则「从清单删掉」等于绕过外壳门禁
    if (!ignoredSet.has(p) && fs.readFileSync(abs(p), 'utf8').includes('<div class="ws-tools">')
        && !injectSet.has(p) && !derivedSet.has(p)) {
      console.error('✗ 含 .ws-tools 却未列为 inject/derived：' + p + ' —— 删条目不能成为绕过外壳门禁的通道');
      fail++;
    }
  }
}

// 4) 忽略必须带理由；契约必须声明
for (const i of m.pageScan.ignore || []) {
  if (!i.reason || !String(i.reason).trim()) { console.error('✗ ignore 缺理由：' + i.path); fail++; }
}
const ids = (m.shell.contract && m.shell.contract.requiredIds) || [];
if (!ids.length) { console.error('✗ shell.contract.requiredIds 为空（工具区契约不可空）'); fail++; }

if (fail) { console.log('\n❌ gate-manifest：' + fail + ' 项失败'); process.exit(1); }
console.log('✅ gate-manifest：存在性 / 去重 / 覆盖性 / 契约声明 全过');
