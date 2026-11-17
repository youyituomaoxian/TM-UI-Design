#!/usr/bin/env node
'use strict';
/* ============================================================
 * verify.js — 统一门禁入口（2026-11-17）
 *
 * 原则：只按固定顺序调用现有脚本，不新增检查、不改判定、不吞退出码。
 * 现有脚本仍是权威；本文件是入口包装，避免新人记忆 8 个命令。
 *
 * 用法：
 *   node scripts/verify.js all
 *   node scripts/verify.js page <页面.html> [web|mobile]
 *   node scripts/verify.js themes
 *   node scripts/verify.js docs
 *   node scripts/verify.js sync
 *   node scripts/verify.js reach
 * ============================================================ */
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const NODE = process.execPath;

function run(label, script, args, cwd = ROOT) {
  console.log(`\n▶ ${label}`);
  const r = spawnSync(NODE, [script, ...args], { cwd, stdio: 'inherit' });
  if (r.error) {
    console.error('❌ 无法启动:', r.error.message);
    process.exitCode = 1;
    return false;
  }
  const code = r.status === null ? 1 : r.status;
  if (code !== 0) process.exitCode = code;
  return code === 0;
}

const [cmd, ...args] = process.argv.slice(2);
const WEB = path.join(ROOT, '弘讯web端design-system');
const MOB = path.join(ROOT, '弘讯移动端design-system');

switch (cmd) {
  case 'all':
    run('全链路 ci-local', path.join(ROOT, 'ci-local.js'), []);
    break;

  case 'page': {
    const file = args[0];
    if (!file) {
      console.error('用法: node scripts/verify.js page <页面.html> [web|mobile]');
      process.exit(2);
    }
    const abs = path.resolve(ROOT, file);
    const end = args[1] || (/移动端/.test(abs) ? 'mobile' : 'web');
    if (end === 'mobile') {
      run('移动端单页 validate', path.join(MOB, 'validate-spec.js'), [abs], MOB);
    } else {
      run('Web 单页 validate', path.join(WEB, 'validate-spec.js'), [abs], WEB);
    }
    break;
  }

  case 'themes':
    run('主题契约 check-themes', path.join(ROOT, 'scripts', 'check-themes.js'), []);
    break;

  case 'docs':
    run('文档体积 check-size', path.join(ROOT, 'check-size.js'), []);
    break;

  case 'sync':
    run('双端同构 check-sync', path.join(ROOT, 'check-sync.js'), []);
    break;

  case 'reach':
    run('规范可达性 check-reach', path.join(ROOT, 'check-reach.js'), []);
    break;

  case 'showcase':
    run('showcase 生成物同步检查', path.join(ROOT, 'scripts', 'sync-showcase.js'), ['--check']);
    break;

  default:
    console.log('用法：');
    console.log('  node scripts/verify.js all                 # 全链路');
    console.log('  node scripts/verify.js page <文件> [端]     # 单页');
    console.log('  node scripts/verify.js themes              # 主题契约');
    console.log('  node scripts/verify.js docs                # 文档体积');
    console.log('  node scripts/verify.js sync                # 双端同构');
    console.log('  node scripts/verify.js reach               # 可达性');
    console.log('  node scripts/verify.js showcase            # 示例副本是否漂移');
    if (cmd) process.exitCode = 2;
}
