const fs = require('fs');
const dir = process.argv[2] || '弘讯web端design-system/icons new';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.svg'));
// 只解析绝对命令（大写 M/L/H/V/C/S/Q/T）后的坐标，忽略相对命令与 a/A 圆弧参数
let issues = [];
for (const f of files) {
  const c = fs.readFileSync(dir + '/' + f, 'utf8');
  for (const m of c.matchAll(/<path[^>]*d="([^"]+)"/g)) {
    const d = m[1];
    // 拆命令：大写绝对命令取后续数字对
    const re = /([MLHVCSQTA])\s*([-\d.,\s]+)/g;
    let cm;
    while ((cm = re.exec(d))) {
      const nums = (cm[2].match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
      if (cm[1] === 'H' || cm[1] === 'V') {
        for (const v of nums) {
          if (v < 0 || v > 24) issues.push(f + ': ' + cm[1] + '=' + v);
        }
      } else if (cm[1] === 'A') {
        // A rx ry rot laf sf x y —— 只查最后两个（x y）
        for (let i = 6; i < nums.length; i += 7) {
          const x = nums[i], y = nums[i + 1];
          if (x === undefined) continue;
          if (x < 0 || x > 24 || y < 0 || y > 24) issues.push(f + ': A终点(' + x + ',' + y + ')');
        }
      } else {
        for (let i = 0; i + 1 < nums.length; i += 2) {
          const x = nums[i], y = nums[i + 1];
          if (x < 0 || x > 24 || y < 0 || y > 24) issues.push(f + ': ' + cm[1] + '(' + x + ',' + y + ')');
        }
      }
    }
  }
}
const uniq = [...new Set(issues.map(i => i.split(':')[0]))];
console.log('绝对坐标越界文件:', uniq.length, '个');
issues.slice(0, 15).forEach(i => console.log('  ' + i));
