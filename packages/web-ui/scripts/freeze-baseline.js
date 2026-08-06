#!/usr/bin/env node
/*
 * freeze-baseline.js — 任务0：冻结旧生成流水线 5 核心 spec 文件的 sha256 指纹
 * 只在 W1 启动时跑一次生成 sha256-baseline.json；此后由 validate-static.js 复核。
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..', '..', '..'); // 仓库根
const FILES = [
  '弘讯web端design-system/tokens.json',
  '弘讯web端design-system/components.json',
  '弘讯web端design-system/validate-spec.js',
  '弘讯web端design-system/page-template.html',
  '弘讯web端design-system/scripts/generate-design-tokens-md.js'
];

const out = {
  frozen: '2026-07-30',
  note: 'W1 修订版冻结的旧生成流水线核心 spec 文件集；W1 全程不得改动，validate-static.js 内置复核',
  files: {}
};
for (const f of FILES) {
  const buf = fs.readFileSync(path.join(ROOT, f));
  out.files[f] = crypto.createHash('sha256').update(buf).digest('hex');
}
const dest = path.join(__dirname, '..', 'sha256-baseline.json');
fs.writeFileSync(dest, JSON.stringify(out, null, 2) + '\n');
console.log('✅ 已冻结 5 文件指纹 → ' + dest);
for (const [f, h] of Object.entries(out.files)) console.log('  ' + h.slice(0, 16) + '…  ' + f);
