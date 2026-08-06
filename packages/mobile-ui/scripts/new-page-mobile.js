/*
 * new-page-mobile.js — 移动端 Taro 页生成器（镜像 web-ui new-page-react.js + 路由注册）
 * 用法：
 *   node scripts/new-page-mobile.js <PageName> [outputPath] [--type <platform>]
 * 例：
 *   node scripts/new-page-mobile.js DeviceList                 # → weapp（默认）
 *   node scripts/new-page-mobile.js OrderForm --type h5        # → h5
 *   node scripts/new-page-mobile.js DeviceList src/pages/device-list/index.tsx
 * 行为：
 *   1) 克隆 src/templates/BizMobilePage.tsx，将组件名 BizMobilePage 替换为 <PageName>
 *   2) 生成同目录 index.config.ts（navigationBarTitleText = <PageName> 原文 + navigationStyle:'custom' 隐藏原生导航栏，避免与模板 NavBar 双导航）
 *   3) 在 src/app.config.ts 的 pages 数组末尾追加 'pages/<dirName>/index'（仅追加，不动 window，不重复注册）
 *   --type 仅影响打印的编译命令（Taro 页代码跨平台一致）；支持 weapp/h5/tt/alipay/swan/rn/jd/qq/ks
 */
const fs = require('fs');
const path = require('path');

const SCRIPT_DIR = __dirname;                       // packages/mobile-ui/scripts
const SRC_DIR = path.join(SCRIPT_DIR, '..', 'src');
const TPL = path.join(SRC_DIR, 'templates', 'BizMobilePage.tsx');
const TPL_SCSS = path.join(SRC_DIR, 'templates', 'BizMobilePage.scss');
const APP_CONFIG = path.join(SRC_DIR, 'app.config.ts');

// --type / -t 解析（支持 `--type h5` 与 `--type=h5` 两种写法）
const PLATFORMS = ['weapp', 'h5', 'tt', 'alipay', 'swan', 'rn', 'jd', 'qq', 'ks', 'dd', 'harmony'];
const ARGV = process.argv.slice(2);
function getOptIndex(flag) {
  return ARGV.findIndex((a) => a === flag || a.startsWith(flag + '='));
}
function getOpt(flag) {
  const i = getOptIndex(flag);
  if (i === -1) return null;
  return ARGV[i].includes('=') ? ARGV[i].split('=')[1] : ARGV[i + 1] || null;
}
// 跳过 `--type`/`-t` 的「值」token（两词形式 --type h5 中 h5 也会被当成 positional，需排除）
const SKIP = new Set();
['--type', '-t'].forEach((flag) => {
  const i = getOptIndex(flag);
  if (i !== -1 && !ARGV[i].includes('=')) SKIP.add(i + 1);
});
const positional = ARGV.filter((a, idx) => !a.startsWith('-') && !SKIP.has(idx));
const name = positional[0];
const outArg = positional[1];
let platform = (getOpt('--type') || getOpt('-t') || 'weapp').toLowerCase();
if (!PLATFORMS.includes(platform)) {
  console.error('不支持的平台: ' + platform + '（可选: ' + PLATFORMS.join(', ') + '）');
  process.exit(1);
}

// 1. 参数校验
if (!name) {
  console.error('用法: node new-page-mobile.js <PageName> [outputPath]');
  process.exit(1);
}
if (!/^[A-Z][A-Za-z0-9]*$/.test(name)) {
  console.error('PageName 须为 PascalCase（首字母大写，仅字母数字），得到: ' + name);
  process.exit(1);
}

// 2. 派生路径：PascalCase → kebab-case
//    DeviceList  → device-list
//    HTTPClient  → http-client（连续大写需拆：先在大写+大写+小写处插 -，再在 小写/数字+大写 处插 -）
function toKebab(s) {
  return s
    .replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1-$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
}
const dirName = toKebab(name);
const defaultOut = path.join(SRC_DIR, 'pages', dirName, 'index.tsx');
const out = outArg ? path.resolve(outArg) : defaultOut;
const outDir = path.dirname(out);

// GEN-RED-01 修复：输出路径必须位于 packages/mobile-ui 内（防路径穿越写出仓库）
const pkgRoot = path.resolve(SCRIPT_DIR, '..');
const relOut = path.relative(pkgRoot, out);
if (relOut === '' || relOut.startsWith('..') || path.isAbsolute(relOut)) {
  console.error('输出路径越界（必须位于 packages/mobile-ui 内）: ' + out);
  process.exit(1);
}
// GEN-RED-05 修复：outArg 必须落在 src/pages/<dirName>/ 下（路由按目录名注册，二者必须一致）
const expectDir = path.join(SRC_DIR, 'pages', dirName);
if (outArg && path.dirname(out) !== expectDir) {
  console.error('outArg 必须位于 src/pages/' + dirName + '/ 下（路由按目录名注册，二者必须一致）');
  process.exit(1);
}

// GEN-RED-03 修复：路由读取 + 查重前置到任何写入之前（防「先毁文件再报已注册」）
if (!fs.existsSync(APP_CONFIG)) {
  console.error('app.config.ts 不存在: ' + APP_CONFIG);
  process.exit(1);
}
let app = fs.readFileSync(APP_CONFIG, 'utf8');
const pagesMatch = app.match(/pages:\s*\[([\s\S]*?)\]/);
if (!pagesMatch) {
  console.error('app.config.ts 未找到 pages 数组');
  process.exit(1);
}
// GEN-RED-04 修复：pages 数组形态 fail-closed —— 仅支持单行单引号无注释格式，否则拒绝改写
const body = pagesMatch[1];
const shapeOk = /^\s*'(?:[^'\\]|\\.)*'\s*(,\s*'(?:[^'\\]|\\.)*'\s*)*$/.test(body.trim());
if (!shapeOk) {
  console.error('app.config.ts pages 数组仅支持单行单引号无注释格式，拒绝改写（请手动注册路由）');
  process.exit(1);
}
const existing = body
  .split(',')
  .map((s) => s.trim().replace(/^'|'$/g, ''))
  .filter(Boolean);
const route = 'pages/' + dirName + '/index';
if (existing.includes(route)) {
  console.error('页面已注册: ' + route);
  process.exit(1);
}

// GEN-RED-02 修复：三写入目标存在性检查前置（防静默覆盖已有页面）
const scssPath = path.join(outDir, 'index.scss');
const configPath = path.join(outDir, 'index.config.ts');
const targets = [out, scssPath, configPath];
const hit = targets.find((t) => fs.existsSync(t));
if (hit) {
  console.error('目标已存在，拒绝覆盖: ' + hit + '（如需覆盖请先删除）');
  process.exit(1);
}

// 3. 克隆模板（全部检查通过后）
if (!fs.existsSync(TPL)) {
  console.error('模板不存在: ' + TPL);
  process.exit(1);
}
const tplSrc = fs.readFileSync(TPL, 'utf8');
const pageSrc = tplSrc.split('BizMobilePage').join(name); // 全局替换（幂等）
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(out, pageSrc, 'utf8');

// 3.1 克隆模板样式（若存在）：BizMobilePage.scss → <dirName>/index.scss（原样复制，不改内容）
//     模板 tsx 已含 import './index.scss'，克隆产物天然引用 index.scss
let scssCloned = false;
if (fs.existsSync(TPL_SCSS)) {
  fs.writeFileSync(scssPath, fs.readFileSync(TPL_SCSS, 'utf8'), 'utf8');
  scssCloned = true;
}

// 4. 生成 config
const configSrc = "export default {\n  navigationBarTitleText: '" + name + "',\n  navigationStyle: 'custom',\n};\n";
fs.writeFileSync(configPath, configSrc, 'utf8');

// 5. 路由注册（检查已前置，此处仅回写）
const newBlock = "pages: [" + existing.map((p) => "'" + p + "'").join(', ') + ", '" + route + "']";
app = app.replace(/pages:\s*\[([\s\S]*?)\]/, newBlock);
fs.writeFileSync(APP_CONFIG, app, 'utf8');

// 6. 输出
console.log('✅ 已生成移动端页面: ' + out);
if (scssCloned) console.log('   已克隆样式 ' + path.join(outDir, 'index.scss'));
console.log('   组件名: ' + name + '（基于 NavBar + @nutui/nutui-react-taro 真实组件 + globals.css token）');
console.log('   路由已注册: ' + route);
console.log('   目标平台: ' + platform + (platform === 'weapp' ? '（默认）' : ''));
console.log('   跑 `cd packages/mobile-ui && ' +
  (platform === 'weapp' ? 'npm run build:weapp' : 'npx taro build --type ' + platform) + '` 验证');
