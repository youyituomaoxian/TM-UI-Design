const fs = require('fs');
const dir = process.argv[2] || '.';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.svg'));
let noVB = 0, noStroke = 0, otherStroke = 0, hasFill = 0;
const issues = [];
for (const f of files) {
  const c = fs.readFileSync(dir + '/' + f, 'utf8');
  const vb = /viewBox="([^"]+)"/.exec(c);
  const st = /stroke="([^"]+)"/.exec(c);
  const w = /width="([^"]+)"/.exec(c);
  const fl = /fill="([^"]+)"/.exec(c);
  const hasViewBox24 = vb ? vb[1] === '0 0 24 24' : false;
  if (!vb || !hasViewBox24) { noVB++; if (issues.length < 20) issues.push(f + ': vb=' + (vb ? vb[1] : '无') + ' w=' + (w ? w[1] : '?')); }
  if (!st) noStroke++;
  else if (st[1] !== 'currentColor') otherStroke++;
  if (fl) hasFill++;
}
console.log('总文件:', files.length);
console.log('无24viewBox:', noVB);
console.log('无stroke属性:', noStroke, '| stroke非currentColor:', otherStroke, '| 有fill属性:', hasFill);
console.log('--- 无24viewBox 样例 ---');
issues.forEach(i => console.log(' ', i));
