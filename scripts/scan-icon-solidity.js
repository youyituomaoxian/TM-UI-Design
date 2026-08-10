const fs = require('fs');
const dir = process.argv[2] || '弘讯web端design-system/icons';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.svg'));
let outlineLike = [], solid = [], mixed = [];
for (const f of files) {
  const c = fs.readFileSync(dir + '/' + f, 'utf8');
  if (/stroke=/.test(c)) { mixed.push(f); continue; }
  const paths = [...c.matchAll(/<path[^>]*d="([^"]+)"/g)].map(m => m[1]);
  let hasHole = false;
  for (const d of paths) {
    const subs = (d.match(/M/g) || []).length;
    if (subs >= 2) { hasHole = true; break; }
  }
  if (hasHole) outlineLike.push(f);
  else solid.push(f);
}
console.log('纯 fill 共:', outlineLike.length + solid.length);
console.log('--- 描边转轮廓（双路径中空，视觉约等于描边）:', outlineLike.length, '---');
console.log(outlineLike.join(', '));
console.log('--- 真实心块（单轮廓实心，视觉偏粗）:', solid.length, '---');
console.log(solid.join(', '));
