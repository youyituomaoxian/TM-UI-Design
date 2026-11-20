#!/usr/bin/env node
'use strict';
/*
 * audit-tree-runtime.js — 作业树运行时门禁（2026-11-20）
 * 用 Edge headless + dump-dom 在真实 DOM 上执行：折叠 → 点组 → 浮层 → 点浮层项 → 选中。
 * 用法：node scripts/audit-tree-runtime.js <页面.html> [...]
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const files = process.argv.slice(2);
if (!files.length) { console.error('用法: node scripts/audit-tree-runtime.js <页面.html> [...]'); process.exit(2); }
if (!fs.existsSync(EDGE)) { console.error('❌ 未找到 Edge，无法运行 tree runtime 门禁'); process.exit(2); }

const probe = `
<script>
setTimeout(function(){
  var r=document.getElementById('rail'), t=document.getElementById('tree'), f=document.getElementById('railFly'), b=document.getElementById('railToggle');
  var out={hasRail:!!r,hasTree:!!t,hasFly:!!f,hasToggle:!!b};
  try{localStorage.removeItem('hx-rail-collapsed');}catch(e){}
  if(b){ if(r&&r.classList.contains('collapsed')) b.click(); b.click(); out.collapsed=r&&r.classList.contains('collapsed'); }
  var g=document.querySelector('#tree [data-group]');
  if(g){g.click(); out.flyOpen=!!(f&&f.classList.contains('open')); out.flyItems=f?f.querySelectorAll('.fly-item').length:0;
    var first=f&&f.querySelector('.fly-item'); if(first) first.click();
    out.hasActive=!!document.querySelector('#tree .tree-node.on');
  }
  var th=document.querySelector('.theme-opt[data-skin="cyan"]'); if(th){th.click(); out.theme=document.documentElement.getAttribute('data-skin')==='cyan';}
  var ap=document.querySelector('#appPop > [aria-haspopup]'); if(ap){ap.click(); out.app=document.getElementById('appPop').classList.contains('open');}
  var lp=document.querySelector('#langPop > [aria-haspopup]'); if(lp){lp.click(); out.langPop=document.getElementById('langPop').classList.contains('open');}
  var lo=document.querySelector('#langPop .lang-opt[data-lang="en"]'); if(lo){lo.click(); out.lang=document.documentElement.getAttribute('lang')==='en';}
  var up=document.querySelector('#userPop > [aria-haspopup]'); if(up){up.click(); out.user=document.getElementById('userPop').classList.contains('open');}
  out.oneScreen = document.documentElement.scrollHeight <= window.innerHeight + 2 || document.body.hasAttribute('data-allow-scroll');
  document.documentElement.setAttribute('data-tree-audit', JSON.stringify(out));
}, 700);
</script>`;

let fail = 0;
for (const rel of files) {
  const p = path.resolve(ROOT, rel);
  if (!fs.existsSync(p)) { console.error('❌ 不存在', p); fail++; continue; }
  const dir = path.dirname(p);
  const tmp = path.join(dir, '_tree_runtime_' + process.pid + '.html');
  const html = fs.readFileSync(p, 'utf8');
  fs.writeFileSync(tmp, html.replace('</body>', probe + '</body>'), 'utf8');
  let dom = '';
  try {
    dom = execFileSync(EDGE, ['--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
      '--user-data-dir=' + path.join(require('os').tmpdir(), 'dsh-tree-' + process.pid),
      '--virtual-time-budget=2500', '--dump-dom', tmp], { encoding: 'utf8', timeout: 30000, maxBuffer: 50 * 1024 * 1024 });
  } catch (e) { dom = e.stdout ? String(e.stdout) : ''; }
  fs.unlinkSync(tmp);
  const m = dom.match(/data-tree-audit="([^"]+)"/);
  if (!m) { console.error('❌ ' + rel + '：未能读取运行时结果'); fail++; continue; }
  const raw = m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&');
  let r; try { r = JSON.parse(raw); } catch (e) { console.error('❌ ' + rel + '：结果解析失败 ' + raw); fail++; continue; }
  const ok = r.hasRail && r.hasTree && r.hasToggle && r.hasFly && r.collapsed && r.flyOpen && r.flyItems > 0 && r.hasActive && r.theme && r.app && r.langPop && r.lang && r.user && r.oneScreen;
  console.log((ok ? '✅ ' : '❌ ') + rel + '  ' + JSON.stringify(r));
  if (!ok) fail++;
}
console.log(fail ? '❌ tree runtime 门禁失败 ' + fail : '✅ tree runtime 门禁通过');
process.exit(fail ? 1 : 0);
