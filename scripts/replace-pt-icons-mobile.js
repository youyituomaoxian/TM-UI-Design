const fs = require('fs');
const pt = '弘讯移动端design-system/page-template.html';
const iconsDir = '弘讯移动端design-system/icons';
// 按 page-template 内联 svg 出现顺序（#1-3 状态栏系统图形豁免，跳过）
const MAP = ['back', 'home', 'report_chart', 'trend'];
let html = fs.readFileSync(pt, 'utf8');
const re = /<svg([^>]*)>([\s\S]*?)<\/svg>/g;
let m, idx = 0, replaced = 0, errors = [];
const jobs = [];
while ((m = re.exec(html))) {
  idx++;
  if (idx <= 3) continue; // 状态栏豁免
  const slot = MAP[idx - 4];
  if (!slot) { errors.push('#' + idx + ' 超出映射'); continue; }
  const f = iconsDir + '/' + slot + '.svg';
  if (!fs.existsSync(f)) { errors.push(slot + '.svg 不存在'); continue; }
  const c = fs.readFileSync(f, 'utf8');
  const inner = /<svg[^>]*>([\s\S]*?)<\/svg>/.exec(c)[1];
  jobs.push({ full: m[0], inner: inner, slot: slot });
}
for (const j of jobs.reverse()) {
  const newSvg = j.full.replace(/>[\s\S]*?<\/svg>/, '>' + j.inner + '</svg>');
  if (newSvg === j.full) { errors.push(j.slot + ': 替换无变化'); continue; }
  html = html.split(j.full).join(newSvg);
  replaced++;
}
fs.writeFileSync(pt, html, 'utf8');
console.log('移动 page-template 替换:', replaced, '/', MAP.length);
if (errors.length) console.log('⚠️', errors.join('; '));
