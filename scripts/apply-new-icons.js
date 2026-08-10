const fs = require('fs');
const path = require('path');
const src = '弘讯web端design-system/icons new';
const dst = '弘讯web端design-system/icons';
const bak = '弘讯web端design-system/icons_bak_20260807';
const skip = new Set(['edit (1).svg', 'e_stop (1).svg']);

// 1) 备份旧库（回滚点）
fs.mkdirSync(bak, { recursive: true });
let backed = 0;
for (const f of fs.readdirSync(dst)) {
  if (f.endsWith('.svg')) { fs.copyFileSync(path.join(dst, f), path.join(bak, f)); backed++; }
}
console.log('备份旧库:', backed, '个 →', bak);

// 2) 规范化 + 写入
let n = 0, warn = [];
for (const f of fs.readdirSync(src)) {
  if (!f.endsWith('.svg') || skip.has(f)) continue;
  let c = fs.readFileSync(path.join(src, f), 'utf8');
  // 插 viewBox（width/height 前）
  if (!/viewBox=/.test(c)) {
    const r = c.replace(/(<svg[^>]*?)(width="24" height="24")/, '$1viewBox="0 0 24 24" $2');
    if (r === c) warn.push(f + ': 未插入 viewBox');
    c = r;
  }
  // 颜色 token 化（仅 #333 → currentColor；none 保持）
  c = c.replace(/fill="#333"/g, 'fill="currentColor"');
  c = c.replace(/stroke="#333"/g, 'stroke="currentColor"');
  fs.writeFileSync(path.join(dst, f), c, 'utf8');
  n++;
}
console.log('规范化写入:', n, '个 →', dst);
if (warn.length) { console.log('⚠️ 未插入 viewBox:', warn.join(', ')); }
