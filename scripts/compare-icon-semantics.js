const fs = require('fs');
function parse(mdPath) {
  const md = fs.readFileSync(mdPath, 'utf8');
  const map = {};
  for (const line of md.split('\n')) {
    const m = line.match(/^\| `([a-z0-9_]+\.svg)` \| ([^|]+) \|/);
    if (m) map[m[1]] = m[2].trim();
  }
  return map;
}
const w = parse('弘讯web端design-system/icons/icons.md');
const m = parse('弘讯移动端design-system/icons/icons.md');
console.log('Web 登记:', Object.keys(w).length, '| 移动登记:', Object.keys(m).length);
const same = [], diff = [], onlyMobile = [], onlyWeb = [];
for (const f of Object.keys(m)) {
  if (!w[f]) { onlyMobile.push(f); continue; }
  if (w[f] === m[f]) same.push(f);
  else diff.push(f + ' | Web:' + w[f] + ' | 移动:' + m[f]);
}
for (const f of Object.keys(w)) if (!m[f]) onlyWeb.push(f);
console.log('同名同义(可直接替换):', same.length);
console.log('同名异义(需判断):', diff.length);
console.log('--- 同名异义明细 ---');
diff.forEach(d => console.log('  ' + d));
console.log('移动独有文件名:', onlyMobile.length, onlyMobile.join(','));
