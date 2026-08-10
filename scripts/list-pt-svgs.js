const fs = require('fs');
const html = fs.readFileSync('弘讯web端design-system/page-template.html', 'utf8');
// 找所有内联 svg（含 class）及其前后 90 字符上下文
const re = /<svg([^>]*)>([\s\S]*?)<\/svg>/g;
let m, i = 0;
while ((m = re.exec(html))) {
  i++;
  const attrs = m[1];
  const inner = m[2];
  const pre = html.slice(Math.max(0, m.index - 90), m.index).replace(/\s+/g, ' ').trim();
  const post = html.slice(m.index + m[0].length, m.index + m[0].length + 40).replace(/\s+/g, ' ').trim();
  const ds = [...inner.matchAll(/<path[^>]*d="([^"]+)"/g)].map(x => x[1].slice(0, 22));
  console.log('#' + i + ' attrs: ' + attrs.replace(/\s+/g, ' ').trim().slice(0, 70));
  console.log('   pre : ' + pre.slice(-70));
  console.log('   post: ' + post.slice(0, 40));
  console.log('   path: ' + ds.join(' | '));
}
