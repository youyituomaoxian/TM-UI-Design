const fs = require('fs');
const dir = process.argv[2] || '弘讯web端design-system/icons';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.svg'));
const sw = new Map();
const noStroke = [];
const issues = [];
for (const f of files) {
  const c = fs.readFileSync(dir + '/' + f, 'utf8');
  const widths = [...c.matchAll(/stroke-width="([^"]+)"/g)].map(m => m[1]);
  for (const w of widths) sw.set(w, (sw.get(w) || 0) + 1);
  const hasStroke = /stroke=/.test(c);
  if (!hasStroke) noStroke.push(f);
  for (const m of c.matchAll(/<([a-z]+)[^>]*stroke-width="([^"]+)"[^>]*>/g)) {
    if (m[2] !== '1.8') issues.push(f + ': <' + m[1] + '> stroke-width=' + m[2]);
  }
}
console.log('文件数:', files.length);
console.log('stroke-width 值分布:', [...sw.entries()].map(([k, v]) => k + 'x' + v).join(' '));
console.log('纯 fill（无 stroke 元素）:', noStroke.length, '个');
console.log('非 1.8 的 stroke-width:', issues.length, '处');
issues.slice(0, 40).forEach(i => console.log('  ' + i));
