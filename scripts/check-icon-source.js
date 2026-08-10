// 图标命中率核对 v2：双端 page-template / 展示页 / 看板 / USAGE 的内联 SVG 是否在对应端 icons/ 库内
// 豁免：.topbar-logo（品牌 logo）、状态栏图形（移动 .sb-icons / 电池——系统图形，不在库语义内）
'use strict';
const fs = require('fs');
const path = require('path');
const root = 'H:/global-workspace/设计系统/设计系统_V2.1';

function loadSet(dir) {
  const set = new Set();
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.svg'))) {
    const svg = fs.readFileSync(path.join(dir, f), 'utf8');
    const m = svg.match(/<path[^>]*d="([^"]+)"/g) || [];
    for (const x of m) set.add(x.match(/d="([^"]+)"/)[1]);
  }
  return set;
}
function check(file, dSet, exemptCls) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const paths = [...html.matchAll(/<svg[^>]*class="([^"]*)"[^>]*>[\s\S]*?<\/svg>/g)].map(m => {
    const cls = m[1];
    const inner = m[0];
    const ds = [...inner.matchAll(/<path[^>]*d="([^"]+)"/g)].map(x => x[1]);
    return { cls, ds };
  });
  let hit = 0, miss = 0, exempt = 0;
  const missList = [];
  for (const s of paths) {
    if (exemptCls.some(c => s.cls.includes(c))) { exempt += s.ds.length; continue; }
    for (const d of s.ds) {
      if (dSet.has(d)) hit++; else { miss++; if (missList.length < 6) missList.push(d.slice(0, 55)); }
    }
  }
  console.log(file, '| path 总数:', paths.reduce((a, s) => a + s.ds.length, 0),
    '| 命中:', hit, '| 未命中:', miss, '| 豁免:', exempt);
  missList.forEach(d => console.log('   MISS:', d));
}
const webSet = loadSet(root + '/弘讯web端design-system/icons');
const mSet = loadSet(root + '/弘讯移动端design-system/icons');
check('弘讯web端design-system/page-template.html', webSet, ['topbar-logo']);
check('弘讯移动端design-system/page-template.html', mSet, ['sb-icons']);
check('弘讯web端design-system/web规范展示_框架版_20260806_1050.html', webSet, ['topbar-logo']);
check('USAGE.html', webSet, ['topbar-logo']);
