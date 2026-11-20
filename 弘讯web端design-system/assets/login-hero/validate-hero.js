#!/usr/bin/env node
/*
 * validate-hero.js — 登录页背景图资产准入（DS-20261118-02 §8.3）
 * 零依赖：直接解析 WebP 头拿宽高（VP8 / VP8L / VP8X 三种）。
 * 判据：1:1 ±1%；login-hero-default.webp 2160±1%；@1x 1024±1%；单文件 ≤400KB。
 * 用法：node validate-hero.js   → 0 通过 / 1 违例
 */
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const MAX_BYTES = 400 * 1024;
const EXPECT = { 'login-hero-default.webp': 2160, 'login-hero-default@1x.webp': 1024 };

function dims(buf) {
  if (buf.length < 30) return null;
  if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WEBP') return null;
  const cc = buf.toString('ascii', 12, 16);
  if (cc === 'VP8 ') {
    if (buf[23] !== 0x9d || buf[24] !== 0x01 || buf[25] !== 0x2a) return null;
    return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff, kind: 'VP8' };
  }
  if (cc === 'VP8L') {
    const bits = buf.readUInt32LE(21);
    return { w: (bits & 0x3fff) + 1, h: ((bits >>> 14) & 0x3fff) + 1, kind: 'VP8L' };
  }
  if (cc === 'VP8X') {
    return { w: buf.readUIntLE(24, 3) + 1, h: buf.readUIntLE(27, 3) + 1, kind: 'VP8X' };
  }
  return null;
}

function near(v, target, pct) { return Math.abs(v - target) <= target * pct; }

function check(dir) {
  const base = dir || DIR;
  const files = fs.readdirSync(base).filter(f => /\.webp$/i.test(f)).sort();
  const fail = [];
  if (!files.includes('login-hero-default.webp')) fail.push('缺少 login-hero-default.webp（默认背景图）');
  files.forEach(f => {
    const buf = fs.readFileSync(path.join(base, f));
    const kb = Math.round(buf.length / 1024);
    const d = dims(buf);
    if (!d) { fail.push(`${f}: 无法解析 WebP 头`); return; }
    if (!near(d.w / d.h, 1, 0.01)) fail.push(`${f}: 比例 ${d.w}×${d.h} 非 1:1（±1%）`);
    if (buf.length > MAX_BYTES) fail.push(`${f}: ${kb}KB 超过 400KB`);
    const target = EXPECT[f];
    if (target && !(near(d.w, target, 0.01) && near(d.h, target, 0.01))) {
      fail.push(`${f}: 尺寸 ${d.w}×${d.h} 应为 ${target}²（±1%）`);
    }
    console.log(`  ${fail.some(x => x.startsWith(f)) ? '✗' : '✓'} ${f} ${d.w}×${d.h} ${kb}KB（${d.kind}）`);
  });
  if (!files.length) fail.push('assets/login-hero/ 内无 .webp');
  return fail;
}

if (require.main === module) {
  console.log(`▶ 登录背景图资产准入（${DIR}）`);
  const fail = check(process.argv[2]);
  if (fail.length) {
    fail.forEach(m => console.error(`  ✗ ${m}`));
    console.error(`validate-hero：${fail.length} FAIL → exit 1（见 assets/login-hero/README.md §6）`);
    process.exit(1);
  }
  console.log('  ✓ 全部通过（1:1 · 尺寸 · ≤400KB）');
}

module.exports = { check };
