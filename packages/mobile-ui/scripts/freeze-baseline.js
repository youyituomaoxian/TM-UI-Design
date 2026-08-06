#!/usr/bin/env node
/*
 * freeze-baseline.js — W2 任务0：冻结移动端旧生成流水线 5 文件指纹
 * 生成 packages/mobile-ui/sha256-baseline.json
 * 路径相对仓库根（与 validate-static.js 读取一致）。
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const FILES = [
  '弘讯移动端design-system/tokens.json',
  '弘讯移动端design-system/components.json',
  '弘讯移动端design-system/validate-spec.js',
  '弘讯移动端design-system/page-template.html',
  '弘讯移动端design-system/scripts/generate-design-tokens-md.js',
];

const files = {};
for (const f of FILES) {
  const full = path.join(ROOT, f);
  if (!fs.existsSync(full)) {
    console.error('❌ 冻结文件缺失:', f);
    process.exit(1);
  }
  files[f] = crypto.createHash('sha256').update(fs.readFileSync(full)).digest('hex');
}

const out = path.join(__dirname, '..', 'sha256-baseline.json');
fs.writeFileSync(out, JSON.stringify({ generatedAt: new Date().toISOString(), files }, null, 2) + '\n');
console.log('✅ 已冻结移动端 5 文件指纹 →', path.relative(ROOT, out));
for (const [f, h] of Object.entries(files)) console.log('   ', f, '->', h.slice(0, 16) + '…');
