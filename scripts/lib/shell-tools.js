'use strict';
/* scripts/lib/shell-tools.js — 外壳工具区契约的单一实现（2026-11-20）
 *
 * sync-shell-tools（写）与 check-shell-chrome（读/校验）共用本模块，
 * 避免「注入逻辑」和「比对逻辑」各写一份、然后在某个边界上互相打架。
 *
 * 导出：ROOT / WEB / OPEN / extract / norm / toSubdir / readManifest
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const WEB = path.join(ROOT, '弘讯web端design-system');
const MANIFEST = path.join(ROOT, 'scripts', 'gate-manifest.json');
const OPEN = '<div class="ws-tools">';

function extract(html) {
  const i = html.indexOf(OPEN);
  if (i < 0) return null;
  let depth = 0, j = i;
  while (j < html.length) {
    if (html.startsWith('<div', j)) depth++;
    if (html.startsWith('</div>', j)) { depth--; if (depth === 0) { j += 6; break; } }
    j++;
  }
  return html.slice(i, j);
}

/* 归一化：图片 src 一律抹平（分享版会把本地图片内联成 data URI）；
   资源型 href 也抹平（根目录写 assets/…、showcase 下写 ../assets/…）。 */
const norm = s => s
  .replace(/\ssrc="[^"]*"/g, ' src=""')
  .replace(/\shref="(?:\.\.\/)?assets\/[^"]*"/g, ' href=""')
  .replace(/>\s+</g, '><')
  .replace(/\s+/g, ' ')
  .trim();

// Web 根相对 → 子目录相对（showcase/ 下的注入目标）
const toSubdir = s => s.replace(/(src|href)="assets\//g, '$1="../assets/');

function readManifest() {
  return JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
}
const abs = rel => path.join(ROOT, rel);

module.exports = { ROOT, WEB, MANIFEST, OPEN, extract, norm, toSubdir, readManifest, abs };
