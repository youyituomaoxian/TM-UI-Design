/*
 * new-page-react.js — React B端页生成器（对标 弘讯web端design-system/scripts/new-page.js 的 HTML 版）
 * 用法：
 *   node scripts/new-page-react.js <PageName> [outputPath]
 * 例：
 *   node scripts/new-page-react.js CncDashboard            # → src/demo/pages/CncDashboard.tsx
 *   node scripts/new-page-react.js OrderList src/pages/x.tsx
 * 行为：克隆 src/templates/BizAdminPage.tsx，将组件名 BizAdminPage 替换为 <PageName>，写入目标。
 */
const fs = require('fs');
const path = require('path');

const tpl = path.join(__dirname, '..', 'src', 'templates', 'BizAdminPage.tsx');
const repoRoot = path.resolve(__dirname, '..'); // packages/web-ui
const name = process.argv[2];
if (!name) {
  console.error('用法: node new-page-react.js <PageName> [outputPath]');
  process.exit(1);
}
if (!/^[A-Za-z][A-Za-z0-9]*$/.test(name)) {
  console.error('PageName 须为合法标识符（字母开头，仅字母数字），得到: ' + name);
  process.exit(1);
}
const out = process.argv[3]
  ? path.resolve(process.argv[3])
  : path.join(__dirname, '..', 'src', 'demo', 'pages', name + '.tsx');

// GEN-RED-01 修复：输出路径必须位于 packages/web-ui 内（防路径穿越写出仓库）
const relOut = path.relative(repoRoot, out);
if (relOut === '' || relOut.startsWith('..') || path.isAbsolute(relOut)) {
  console.error('输出路径越界（必须位于 packages/web-ui 内）: ' + out);
  process.exit(1);
}

if (!fs.existsSync(tpl)) {
  console.error('模板不存在: ' + tpl);
  process.exit(1);
}
// GEN-RED-02 修复：拒绝覆盖已有文件（防静默数据丢失）
if (fs.existsSync(out)) {
  console.error('目标已存在，拒绝覆盖: ' + out + '（如需覆盖请先删除）');
  process.exit(1);
}
let src = fs.readFileSync(tpl, 'utf8').replace(/BizAdminPage/g, name);
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, src, 'utf8');
console.log('✅ 已生成 React 页面: ' + out);
console.log('   组件名: ' + name + '（基于 AdminLayout + @techmation/web-ui 真实组件）');
