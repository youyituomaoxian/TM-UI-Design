#!/usr/bin/env node
'use strict';
/*
 * build-share-web.js — 生成 Web 分享版（2026-11-20）
 * 用法：node scripts/build-share-web.js <页面.html> [--out <输出.html>]
 * 行为：内联 template.css、tree-nav/i18n/page-ui/shell-ui、本地图片；校验零外链。
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const WEB = path.join(ROOT, '弘讯web端design-system');
const SHARED = ['tree-nav.js', 'i18n.js', 'page-ui.js', 'shell-ui.js'];

function readIf(p) { try { return fs.readFileSync(p, 'utf8'); } catch (e) { return null; } }
function mimeOf(p) {
  const ext = path.extname(p).toLowerCase();
  if (ext === '.svg') return 'image/svg+xml';
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.gif') return 'image/gif';
  return 'application/octet-stream';
}
function dataUri(p) {
  return 'data:' + mimeOf(p) + ';base64,' + fs.readFileSync(p).toString('base64');
}
function resolveLocal(fromFile, ref) {
  if (!ref || /^(data:|https?:|mailto:|tel:|#)/.test(ref)) return null;
  const clean = ref.split('?')[0].split('#')[0];
  const p = path.resolve(path.dirname(fromFile), clean);
  return fs.existsSync(p) ? p : null;
}

const args = process.argv.slice(2);
const src = args.find(a => !a.startsWith('--'));
const outIdx = args.indexOf('--out');
const out = outIdx >= 0 ? path.resolve(args[outIdx + 1]) : src.replace(/\.html$/i, '_分享版.html');
if (!src || !fs.existsSync(src)) { console.error('用法: node scripts/build-share-web.js <页面.html> [--out <输出.html>]'); process.exit(2); }

let html = fs.readFileSync(src, 'utf8');
const pageDir = path.dirname(path.resolve(src));

// 1) CSS 真源内联
html = html.replace(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi, tag => {
  const m = tag.match(/href=["']([^"']+)["']/i);
  if (!m) return tag;
  const p = resolveLocal(src, m[1]) || path.join(WEB, 'template.css');
  const css = readIf(p);
  return css ? '<style>\n' + css + '\n</style>' : tag;
});

// 2) 共享脚本内联
html = html.replace(/<script\b[^>]*src=["']([^"']+)["'][^>]*>\s*<\/script>/gi, tag => {
  const m = tag.match(/src=["']([^"']+)["']/i);
  if (!m) return tag;
  const ref = m[1];
  if (!SHARED.some(n => ref.endsWith('/' + n) || ref === n || ref.endsWith(n))) return tag;
  let p = resolveLocal(src, ref);
  if (!p) p = path.join(WEB, 'js', path.basename(ref));
  const js = readIf(p);
  return js ? '<script>\n' + js + '\n</script>' : tag;
});

// 3) 本地图片 / 资源内联
html = html.replace(/\bsrc=["']([^"']+)["']/gi, (tag, ref) => {
  const p = resolveLocal(src, ref);
  return p ? 'src="' + dataUri(p) + '"' : tag;
});

// 4) 零外链校验
const bad = [];
for (const m of html.matchAll(/\bsrc=["']([^"']+)["']/gi)) {
  if (!/^(data:|https?:)/.test(m[1])) bad.push('src=' + m[1]);
}
for (const m of html.matchAll(/<script\b[^>]*src=["']([^"']+)["']/gi)) bad.push('script=' + m[1]);
for (const m of html.matchAll(/<link\b[^>]*href=["']([^"']+)["']/gi)) {
  if (!/^(data:|https?:)/.test(m[1])) bad.push('link=' + m[1]);
}
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html, 'utf8');
console.log('✅ 分享版：' + out);
console.log('   内联 CSS / 共享脚本 / 本地资源；外链残留：' + bad.length);
if (bad.length) { console.error(bad.slice(0, 10).join('\n')); process.exit(1); }
