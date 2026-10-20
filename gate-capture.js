#!/usr/bin/env node
/*
 * gate-capture.js — 门禁子进程结果捕获（弘讯设计系统 · 2026-10-08 对抗审查 VERDICT-A修复）
 * ---------------------------------------------------------------------------
 * 存在理由（第一性原理）：
 *   门禁的阻断判定必须拿到子进程的**权威结论**，而不是它的文本投影。
 *   原实现用 execSync(cmd, {encoding:'utf8'}) 捕获 stdout 再正则取 HIGH 数，
 *   这条链路有三处独立失效点：
 *     1) 捕获通道：本机（Git Bash + Node 22.22.2）实测所有 execSync/execFileSync
 *        管道捕获抛 EBUSY、e.stdout 恒为 undefined → 空串 → 正则无匹配 →
 *        parseInt(... || '0') → HIGH 恒计 0（门禁「看起来全绿，实际从未执行」）。
 *     2) 脚本崩溃：子进程语法错误/未捕获异常时 e.stdout 为 undefined → 同样落到 0。
 *     3) 输出上限：maxBuffer 默认 1MB，违规条目多时输出超限被杀 → 同样落到 0
 *        （危害方向为「问题越严重越判通过」，属有罪推定）。
 *
 * 三条路径的共同后果一致：违规 → 判通过。故根治点不是逐个堵洞，而是换判据。
 *
 * 本模块的契约：
 *   权威判据 = **退出码**（子进程正常退出且 status === 0 才算通过）。
 *   stdout计数 = 信息性展示，取不到时明示「不可用」，绝不默认 0。
 *   输出通道 = 文件 fd（stdio 接文件而非管道），既绕过管道 EBUSY，又免疫 maxBuffer。
 *
 * 单一真源：ci-local.js 由此模块取门禁结果；后续任何门禁若需退出码判定，复用本模块，
 *   不再各自实现 execSync 文本解析（避免同一缺陷在多处重演）。
 * ---------------------------------------------------------------------------
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

const NODE = process.execPath;
let _seq = 0;

/**
 * 执行一个门禁子进程并返回权威结果。
 * @param {string} label 展示用标签（文件名等）
 * @param {string} cmd   完整命令行
 * @param {object} [opt] { cwd, timeout }
 * @returns {{label:string, ok:boolean, status:number|null, spawnFailed:boolean,
 *             high:number|null, medium:number|null, countAvailable:boolean, out:string}}
 */
function runGateCapture(label, cmd, opt = {}) {
  const tmp = path.join(os.tmpdir(), `gate-cap-${process.pid}-${_seq++}.txt`);
  let status = 0;
  let spawnFailed = false;
  let fd = null;
  try {
    fd = fs.openSync(tmp, 'w');
    try {
      execSync(cmd, {
        cwd: opt.cwd,
        timeout: opt.timeout,
        stdio: ['ignore', fd, 'pipe'], // stdout → 文件 fd；stderr 仍走管道但仅用于报错，不参与判定
      });
      status = 0;
    } catch (e) {
      // e.status 为子进程退出码；null/undefined = 被信号杀死或 spawn 失败
      if (typeof e.status === 'number') status = e.status;
      else { status = null; spawnFailed = true; }
    }
  } finally {
    if (fd !== null) { try { fs.closeSync(fd); } catch (_) {} }
  }
  let out = '';
  try { out = fs.readFileSync(tmp, 'utf8'); } catch (_) {}
  try { fs.unlinkSync(tmp); } catch (_) {}
  const hM = out.match(/HIGH (\d+)/);
  const mM = out.match(/MEDIUM (\d+)/);
  return {
    label, status, spawnFailed,
    ok: !spawnFailed && status === 0,          // 权威判据
    high: hM ? parseInt(hM[1], 10) : null,      // 仅信息性
    medium: mM ? parseInt(mM[1], 10) : null,
    countAvailable: hM !== null,
    out,
  };
}

/**
 * 渲染捕获结果的一行展示。计数不可用时必须显式说明，不得显示为 0。
 * （「显示 0」与「没有违规」在视觉上不可区分，是本模块要消除的歧义）
 */
function renderCap(r) {
  if (r.spawnFailed) return `${r.label} — 子进程异常终止（status=${r.status}），无法取得结果`;
  if (!r.countAvailable) return `${r.label} — 退出码 ${r.status}，HIGH 计数不可用（输出未含摘要行）`;
  return `${r.label} — HIGH ${r.high} / MED ${r.medium ?? 0}`;
}

/**
 * fail-closed 判定：仅当「子进程正常退出 且 退出码 0 且 计数可取」时才算通过。
 * 计数不可取= 门禁自身故障，不能读作「检查通过」。
 * 注意（2026-10-10 复盘 T-5）：countAvailable 依赖输出含「HIGH n」摘要行。若子进程输出为
 * JSON 等非摘要格式（如 fold-gate），**勿用 capPassed**——自行解析输出并判定，否则会因
 * 「计数不可取」被恒判不通过。fold-gate 即走自解析路径，不受此影响。
 */
function capPassed(r) {
  return r.ok && r.countAvailable;
}

module.exports = { runGateCapture, renderCap, capPassed, NODE };