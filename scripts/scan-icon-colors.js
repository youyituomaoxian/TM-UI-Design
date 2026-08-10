const fs = require('fs');
const dir = process.argv[2] || '.';
const skip = new Set(['edit (1).svg', 'e_stop (1).svg']);
const files = fs.readdirSync(dir).filter(f => f.endsWith('.svg') && !skip.has(f));
const colors = new Map();
for (const f of files) {
  const c = fs.readFileSync(dir + '/' + f, 'utf8');
  const m = c.match(/(?:fill|stroke)="([^"]+)"/g) || [];
  for (const a of m) {
    const v = /="([^"]+)"/.exec(a)[1];
    colors.set(v, (colors.get(v) || 0) + 1);
  }
}
console.log('文件数:', files.length);
console.log('颜色值分布:');
[...colors.entries()].sort((a, b) => b[1] - a[1]).forEach(([v, n]) => console.log('  ' + v + ': ' + n));
// 其他格式检查：svg 标签属性、非 path 元素
let noWidth = 0, hasG = 0, hasOther = 0;
for (const f of files) {
  const c = fs.readFileSync(dir + '/' + f, 'utf8');
  const svg = /<svg[^>]*>/.exec(c)[0];
  if (!/width="24"/.test(svg)) noWidth++;
  if (/<g[ >]/.test(c)) hasG++;
  if (/<(rect|circle|line|polyline|polygon|ellipse)[ >]/.test(c)) hasOther++;
}
console.log('非24宽:', noWidth, '| 含<g>:', hasG, '| 含基本图形元素:', hasOther);
