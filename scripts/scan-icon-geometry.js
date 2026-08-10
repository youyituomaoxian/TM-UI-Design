const fs = require('fs');
const dir = process.argv[2] || '弘讯web端design-system/icons new';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.svg'));
let hasFillColor = [], hasTransform = [], negCoord = [], overCoord = [], other = [];
for (const f of files) {
  const c = fs.readFileSync(dir + '/' + f, 'utf8');
  if (/fill="currentColor"/.test(c)) hasFillColor.push(f);
  if (/transform=/.test(c)) hasTransform.push(f);
  // 坐标越界：提取 path d 中的数字对
  for (const m of c.matchAll(/<path[^>]*d="([^"]+)"/g)) {
    const nums = m[1].match(/-?\d+(?:\.\d+)?/g) || [];
    for (let i = 0; i + 1 < nums.length; i += 2) {
      const x = parseFloat(nums[i]), y = parseFloat(nums[i + 1]);
      if (x < 0 || y < 0 || x > 24 || y > 24) { negCoord.push(f + '(' + x + ',' + y + ')'); break; }
    }
  }
  if (/<(circle|rect|line|polyline|polygon)[ >]/.test(c)) other.push(f);
}
console.log('文件数:', files.length);
console.log('含 fill=currentColor 点缀:', hasFillColor.length, hasFillColor.slice(0, 10).join(','));
console.log('含 transform:', hasTransform.length, hasTransform.slice(0, 8).join(','));
console.log('坐标越界/负坐标:', negCoord.length, negCoord.slice(0, 8).join(','));
console.log('含基本图形元素(circle/rect/line等):', other.length);
