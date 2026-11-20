#!/usr/bin/env node
'use strict';
/*
 * verify-new.js — 新规范范围全链路（2026-11-20）
 * 只覆盖左右结构真源 / 生成页 / 分享版；旧 output 走存量审计，不阻塞新规范。
 * 页面清单来自 scripts/gate-manifest.json（newScope），不再写死路径。
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { ROOT, WEB, readManifest, abs } = require('./lib/shell-tools');

const m = readManifest();
const pages = m.newScope.pages.map(abs);
// 作业树运行时只跑含 .rail 的工作台页（USAGE / 登录页为 document 页，不参与）
const treePages = m.newScope.treePages.map(abs);
const shares = m.newScope.shares.map(abs);

let fail = 0;
function run(label, cmd, args) {
  const r = spawnSync(cmd, args, { encoding: 'utf8', maxBuffer: 1024 * 1024 * 30 });
  const out = (r.stdout || '') + (r.stderr || '');
  const ok = r.status === 0;
  console.log((ok ? '✅ ' : '❌ ') + label);
  if (!ok) { fail++; console.log(out.split('\n').filter(Boolean).slice(-8).join('\n')); }
}
run('门禁清单 gate-manifest', process.execPath, [path.join(ROOT, 'scripts', 'check-gate-manifest.js')]);
for (const p of pages) {
  if (!fs.existsSync(p)) { console.error('❌ 缺失 ' + path.relative(ROOT, p) + '（登记在 gate-manifest.json）'); fail++; continue; }
  run('validate ' + path.basename(p), process.execPath, [path.join(WEB, 'validate-spec.js'), p]);
  run('reuse ' + path.basename(p), process.execPath, [path.join(ROOT, 'scripts', 'audit-component-reuse.js'), p]);
}
run('tree runtime（工作台页）', process.execPath, [path.join(ROOT, 'scripts', 'audit-tree-runtime.js'), ...treePages]);
run('外壳工具区未漂移', process.execPath, [path.join(ROOT, 'scripts', 'sync-shell-tools.js'), '--check']);
run('shell chrome 一致', process.execPath, [path.join(ROOT, 'scripts', 'check-shell-chrome.js')]);
run('图标库 ↔ 展示页', process.execPath, [path.join(ROOT, 'scripts', 'check-icon-gallery.js')]);
run('规范展示页自检', process.execPath, [path.join(ROOT, 'scripts', 'check-spec-page.js')]);
for (const p of shares) {
  if (!fs.existsSync(p)) { console.error('❌ 缺失分享版 ' + path.relative(ROOT, p)); fail++; continue; }
  const s = fs.readFileSync(p, 'utf8');
  const bad = [];
  for (const mm of s.matchAll(/\bsrc=["']([^"']+)["']/gi)) if (!/^(data:|https?:)/.test(mm[1])) bad.push(mm[1]);
  for (const mm of s.matchAll(/<script\b[^>]*src=["']([^"']+)["']/gi)) bad.push(mm[1]);
  console.log((bad.length ? '❌ ' : '✅ ') + 'share 零外链 ' + path.basename(p) + (bad.length ? ' → ' + bad.slice(0, 3).join(', ') : ''));
  if (bad.length) fail++;
}
run('check-size', process.execPath, [path.join(ROOT, 'check-size.js')]);
console.log(fail ? '\n❌ verify-new 失败 ' + fail : '\n✅ verify-new 通过');
process.exit(fail ? 1 : 0);
