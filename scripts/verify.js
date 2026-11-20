#!/usr/bin/env node
'use strict';
/* ============================================================
 * verify.js — 统一门禁入口（2026-11-17）
 *
 * 原则：只按固定顺序调用现有脚本，不新增检查、不改判定、不吞退出码。
 * 现有脚本仍是权威；本文件是入口包装，避免新人记忆一堆子命令。
 *
 * 用法：
 *   node scripts/verify.js all
 *   node scripts/verify.js page <页面.html> [web|mobile]
 *   node scripts/verify.js themes
 *   node scripts/verify.js docs
 *   node scripts/verify.js sync
 *   node scripts/verify.js reach
 * ============================================================ */
const fs = require('fs');
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
    if (args.includes('--scope=new')) {
      run('新规范范围 verify-new', path.join(ROOT, 'scripts', 'verify-new.js'), []);
    } else {
      // 交付口径 = 存量全链路 + 新规范范围；两者都跑完再给结论（任一红即 exitCode 非 0）
      run('存量全链路 ci-local', path.join(ROOT, 'ci-local.js'), []);
      run('新规范范围 verify-new', path.join(ROOT, 'scripts', 'verify-new.js'), []);
    }
    break;

  case 'page': {
    const file = args[0];
    if (!file) {
      console.error('用法: node scripts/verify.js page <页面.html> [web|mobile]');
      process.exit(2);
    }
    const abs = path.resolve(ROOT, file);
    const end = args[1] || (/移动端/.test(abs) ? 'mobile' : 'web');
    const pageHtml = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : '';
    if (end === 'mobile') {
      run('移动端单页 validate', path.join(MOB, 'validate-spec.js'), [abs], MOB);
    } else {
      run('Web 单页 validate', path.join(WEB, 'validate-spec.js'), [abs], WEB);
      run('组件复用门禁', path.join(ROOT, 'scripts', 'audit-component-reuse.js'), [abs]);
      if (pageHtml.includes('class="rail"')) {
        run('作业树运行时门禁', path.join(ROOT, 'scripts', 'audit-tree-runtime.js'), [abs]);
      }
    }
    // 图表页提示（2026-11-20）：门禁只兜部分规则，色彩/交互/门禁细节必须回真源
    if (/class="chart-(box|svg)/.test(pageHtml)) {
      console.log('\nℹ️ 本页含图表：按「图表页」加载集读 CHART-SPEC §4（色彩）/§5（交互）/§7（门禁）' +
        '（generate-web-chart ≈37.9k，超预算 check-reach 会红）');
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

  case 'tree': {
    const files = args;
    if (!files.length) { console.error('用法: node scripts/verify.js tree <页面.html> [...]'); process.exit(2); }
    run('作业树运行时门禁', path.join(ROOT, 'scripts', 'audit-tree-runtime.js'), files.map(f => path.resolve(ROOT, f)));
    break;
  }

  case 'reuse': {
    const file = args[0];
    if (!file) { console.error('用法: node scripts/verify.js reuse <页面.html>'); process.exit(2); }
    run('组件复用门禁', path.join(ROOT, 'scripts', 'audit-component-reuse.js'), [path.resolve(ROOT, file)]);
    break;
  }

  case 'showcase':
    run('showcase 生成物同步检查', path.join(ROOT, 'scripts', 'sync-showcase.js'), ['--check']);
    break;

  case 'chrome':
    run('外壳工具区一致性', path.join(ROOT, 'scripts', 'check-shell-chrome.js'), []);
    break;

  case 'shell':
    run('外壳工具区未漂移', path.join(ROOT, 'scripts', 'sync-shell-tools.js'), ['--check']);
    break;

  case 'manifest':
    run('门禁清单自检', path.join(ROOT, 'scripts', 'check-gate-manifest.js'), []);
    break;

  case 'icons':
    run('图标库 ↔ 展示页', path.join(ROOT, 'scripts', 'check-icon-gallery.js'), []);
    break;

  case 'spec':
    run('规范展示页自检', path.join(ROOT, 'scripts', 'check-spec-page.js'), []);
    break;

  default:
    console.log('用法：');
    console.log('  node scripts/verify.js all                 # 交付口径：ci-local 105 + 新规范范围');
    console.log('  node scripts/verify.js all --scope=new     # 只跑新规范范围（真源/生成/分享）');
    console.log('  node scripts/verify.js page <文件> [端]     # 单页');
    console.log('  node scripts/verify.js themes              # 主题契约');
    console.log('  node scripts/verify.js docs                # 文档体积');
    console.log('  node scripts/verify.js sync                # 双端同构');
    console.log('  node scripts/verify.js reach               # 可达性');
    console.log('  node scripts/verify.js reuse <文件>          # 组件复用门禁');
    console.log('  node scripts/verify.js tree <文件...>        # 作业树运行时门禁');
    console.log('  node scripts/verify.js chrome              # 工具区与真源一致 + 脚本可加载');
    console.log('  node scripts/verify.js shell               # 工具区真源是否已注入各页（漂移检查）');
    console.log('  node scripts/verify.js manifest            # 门禁清单（gate-manifest.json）自检');
    console.log('  node scripts/verify.js icons               # 图标库 ↔ 规范展示图标模块');
    console.log('  node scripts/verify.js spec                # 规范展示页自检（坐标/计数/锚点/分页/变量）');
    console.log('  node scripts/verify.js showcase            # 示例副本是否漂移');
    if (cmd) process.exitCode = 2;
}
