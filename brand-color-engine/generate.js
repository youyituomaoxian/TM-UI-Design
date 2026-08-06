#!/usr/bin/env node
'use strict';
/**
 * brand-color-engine / generate.js
 *
 * 弘讯设计系统 · 品牌色推导引擎
 * --------------------------------------------------------------------------
 * 在智能体（Agent）中调用 generatePalette(brandColor, { mode, platform })
 * 即可拿到一套「可直接套用到应用页 HTML 原型」的完整调色板 JSON。
 *
 * 设计原则（来自 2026-07 规划决策）：
 *   A. 产出是「应用页」（HTML 原型），不是可视化规范展示页。
 *   B. 功能色（成功/警告/错误/运行）保持固定语义色，不随品牌色推导 —— 防止识别性偏低。
 *   C. 默认 005EAE 直接返回 2026 规范原值（以 2026 规范为准，HTML 2025 基准仅作算法来源）。
 *   D. 暗色模式输出完整暗色调色板。
 *   E. 不限页面类型，从零生成。
 *   F. 模块落地于仓库根独立目录 brand-color-engine/。
 *
 * 005EAE 暗色特例与原 HTML 色彩系统（【20251226】弘讯UI色彩系统）保持一致。
 */

const fs = require('fs');
const path = require('path');

const BASE_BRAND = '#005EAE';
const BASE_FILE = path.join(__dirname, 'base-spec.json');

/**
 * 加载并结构性校验 base-spec.json（R-23 修复）。
 * 原实现是裸 `JSON.parse(fs.readFileSync(...))`：文件缺失/被截断/键被删时，
 * 要么抛出无上下文的 ENOENT/SyntaxError，要么在几十行之后才以
 * "Cannot read properties of undefined" 的形式炸在无关位置。
 * 这里前置成一次显式断言，失败即报出「哪个文件、缺哪条路径」。
 */
function loadSpec(file) {
  let raw;
  try {
    raw = fs.readFileSync(file, 'utf8');
  } catch (e) {
    throw new Error(
      `[brand-color-engine] 无法读取基准规范 ${file}：${e.code === 'ENOENT' ? '文件不存在' : e.message}`
    );
  }
  let spec;
  try {
    spec = JSON.parse(raw);
  } catch (e) {
    throw new Error(`[brand-color-engine] ${file} 不是合法 JSON：${e.message}`);
  }

  // 必需路径清单：任一缺失都会让下游推导产出 undefined 而非报错，必须在此拦截
  const required = [
    'brand',
    'platforms.web.light.primary',
    'platforms.web.light.neutral',
    'platforms.web.light.chart',
    'platforms.web.light.functional',
    'platforms.web.light.background',
    'platforms.mobile.light.primary',
    'platforms.mobile.light.neutral',
    'platforms.mobile.light.chart',
    'platforms.mobile.light.functional',
    'platforms.mobile.light.background',
    'darkDefaults.neutralScale',
    'darkDefaults.background',
    'darkDefaults.primarySpecial.web',
    'darkDefaults.primarySpecial.mobile',
    'darkDefaults.functional.web',
    'darkDefaults.functional.mobile',
    'darkDefaults.chartWeb',
    'darkDefaults.chartMobile',
  ];
  const missing = required.filter((p) => {
    let cur = spec;
    for (const seg of p.split('.')) {
      if (cur == null || typeof cur !== 'object' || !(seg in cur)) return true;
      cur = cur[seg];
    }
    return cur == null;
  });
  if (missing.length) {
    throw new Error(
      `[brand-color-engine] ${file} 结构不完整，缺失必需路径：\n  - ${missing.join('\n  - ')}`
    );
  }

  // 数组型路径必须真的是非空数组（`{}` 也能通过 in 检查，但下游 .map 会炸）
  const arrays = [
    'platforms.web.light.neutral', 'platforms.web.light.chart',
    'platforms.mobile.light.neutral', 'platforms.mobile.light.chart',
    'darkDefaults.neutralScale', 'darkDefaults.chartWeb', 'darkDefaults.chartMobile',
  ];
  for (const p of arrays) {
    const v = p.split('.').reduce((o, k) => o[k], spec);
    if (!Array.isArray(v) || v.length === 0) {
      throw new Error(`[brand-color-engine] ${file} 路径 ${p} 必须是非空数组，实际为 ${JSON.stringify(v)}`);
    }
  }
  return spec;
}

const SPEC = loadSpec(BASE_FILE);

/* ============================================================
 * 颜色基础工具（移植自原 HTML 色彩系统，已对齐 2026 规范语义）
 * ============================================================ */

function hexToRgb(hex) {
  hex = String(hex).replace('#', '');
  if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16),
  };
}

function rgbToHex(r, g, b) {
  const c = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  return ('#' + c(r) + c(g) + c(b)).toUpperCase();
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return { r: r * 255, g: g * 255, b: b * 255 };
}

function adjustLightness(hex, dl) {
  const { r, g, b } = hexToRgb(hex);
  const hsl = rgbToHsl(r, g, b);
  hsl.l = Math.max(0, Math.min(100, hsl.l + dl));
  const nr = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(nr.r, nr.g, nr.b);
}

function adjustSaturation(hex, ds) {
  const { r, g, b } = hexToRgb(hex);
  const hsl = rgbToHsl(r, g, b);
  hsl.s = Math.max(0, Math.min(100, hsl.s + ds));
  const nr = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(nr.r, nr.g, nr.b);
}

function adjustHue(hex, dh) {
  const { r, g, b } = hexToRgb(hex);
  const hsl = rgbToHsl(r, g, b);
  hsl.h = (hsl.h + dh) % 360;
  if (hsl.h < 0) hsl.h += 360;
  const nr = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(nr.r, nr.g, nr.b);
}

const clone = (o) => JSON.parse(JSON.stringify(o));

/* ============================================================
 * 主色推导（移植 generatePrimaryColors）
 * ============================================================ */

function generatePrimary(brand, theme, platform) {
  // 005EAE 特例
  if (brand.toUpperCase() === BASE_BRAND) {
    if (theme === 'dark') return clone(SPEC.darkDefaults.primarySpecial[platform]);
    const p = clone(SPEC.platforms[platform].light.primary);
    // 统一字段名：active / pressed 都保留
    if (platform === 'mobile' && p.pressed) { p.active = p.pressed; }
    return p;
  }

  const { r, g, b } = hexToRgb(brand);
  const hsl = rgbToHsl(r, g, b);
  let clickAdj, hoverAdj;

  if (theme === 'dark') {
    if (hsl.l < 40) { clickAdj = -5; hoverAdj = 15; }
    else if (hsl.l > 70) { clickAdj = -15; hoverAdj = -5; }
    else { clickAdj = -10; hoverAdj = 10; }
  } else {
    if (hsl.l < 40) { clickAdj = -8; hoverAdj = 15; }
    else if (hsl.l > 70) { clickAdj = -15; hoverAdj = -5; }
    else { clickAdj = -12; hoverAdj = 10; }
  }

  const click = adjustLightness(brand, clickAdj);
  const hover = adjustLightness(brand, hoverAdj);
  const disabled = theme === 'dark'
    ? { disabledBg: '#374151', disabledText: '#9CA3AF' }
    : { disabledBg: '#E2E8F0', disabledText: '#94A3B8' };

  const key = platform === 'mobile' ? 'pressed' : 'click';
  return {
    default: brand,
    hover,
    [key]: click,
    // schema 对齐（R-02 修复）：推导路径与 005EAE 特例路径统一提供 active，
    // 保留 click/pressed 原键向后兼容
    active: click,
    ...disabled,
    // disabledFg 别名 = disabledText，对齐文档契约与特例路径
    disabledFg: disabled.disabledText,
  };
}

/* ============================================================
 * 中性色推导（移植 adjustNeutralColors）
 * ============================================================ */

function deriveNeutral(brand, theme, platform) {
  if (brand.toUpperCase() === BASE_BRAND) {
    return theme === 'dark'
      ? clone(SPEC.darkDefaults.neutralScale)
      : clone(SPEC.platforms[platform].light.neutral);
  }

  const { r, g, b } = hexToRgb(brand);
  const hsl = rgbToHsl(r, g, b);
  const base = theme === 'dark'
    ? SPEC.darkDefaults.neutralScale
    : SPEC.platforms[platform].light.neutral;

  let hueInf, satInf, lightInf;
  if (hsl.h >= 0 && hsl.h < 60) { hueInf = theme === 'light' ? 8 : -5; }
  else if (hsl.h >= 60 && hsl.h < 180) { hueInf = theme === 'light' ? 15 : -8; }
  else if (hsl.h >= 180 && hsl.h < 300) { hueInf = theme === 'light' ? -10 : 5; }
  else { hueInf = theme === 'light' ? -5 : 10; }

  if (hsl.s > 60) satInf = -5;
  else if (hsl.s < 30) satInf = 3;
  else satInf = 0;

  if (hsl.l > 70) lightInf = theme === 'light' ? 5 : -3;
  else if (hsl.l < 40) lightInf = theme === 'light' ? -3 : 5;
  else lightInf = 0;

  return base.map((n, i) => {
    if (i === 0 || i === base.length - 1) return clone(n);
    const nr = hexToRgb(n.hex);
    const nh = rgbToHsl(nr.r, nr.g, nr.b);
    const factor = 1 - Math.abs(nh.l - 50) / 50;
    let ah = nh.h + hueInf * factor;
    let as = nh.s + satInf * factor;
    let al = nh.l + lightInf * factor;
    ah = ((ah % 360) + 360) % 360;
    as = Math.max(0, Math.min(20, as));
    al = Math.max(0, Math.min(100, al));
    const rr = hslToRgb(ah, as, al);
    return { ...clone(n), hex: rgbToHex(rr.r, rr.g, rr.b) };
  });
}

/* ============================================================
 * 辅助/图表色推导（移植 adjustAuxiliaryColors：纯色 + 渐变）
 * ============================================================ */

function deriveChart(brand, theme, platform) {
  const baseChart = SPEC.platforms[platform].light.chart;

  // 005EAE 暗色特例：两端各有权威暗色图表板
  // （R-16 修复：此前仅 web 分支存在，移动端暗色会掉进下面的 `return clone(baseChart)`，
  //  把为白底调的亮色图表色原样丢到 #121826 暗底上——中性橙 #F59E0B 之类对比度不足。）
  if (brand.toUpperCase() === BASE_BRAND && theme === 'dark') {
    return clone(platform === 'mobile' ? SPEC.darkDefaults.chartMobile : SPEC.darkDefaults.chartWeb);
  }
  // 005EAE 亮色：直接返回规范原值
  if (brand.toUpperCase() === BASE_BRAND) {
    return clone(baseChart);
  }

  const { r, g, b } = hexToRgb(brand);
  const hsl = rgbToHsl(r, g, b);
  const baseMain = theme === 'light' ? BASE_BRAND : '#3B82F6';
  const bm = hexToRgb(baseMain);
  const bmHsl = rgbToHsl(bm.r, bm.g, bm.b);
  const hueDiff = hsl.h - bmHsl.h;
  const satDiff = hsl.s - bmHsl.s;
  const lightDiff = hsl.l - bmHsl.l;

  return baseChart.map((c, i) => {
    const cr = hexToRgb(c.hex);
    const ch = rgbToHsl(cr.r, cr.g, cr.b);
    let hueAdj = 0;
    if (i <= 2) hueAdj = hueDiff * 0.4;
    else if (i === 3) hueAdj = hueDiff * 0.2;
    else if (i === 4 || i === 5) hueAdj = hueDiff * 0.1;
    else hueAdj = hueDiff * 0.05;

    const satAdj = satDiff * 0.3;
    let lightAdj = lightDiff * 0.2;
    if (theme === 'dark' && ch.l < 40) lightAdj += 15;

    let ah = (ch.h + hueAdj) % 360; if (ah < 0) ah += 360;
    let as = Math.max(20, Math.min(90, ch.s + satAdj));
    let al = Math.max(20, Math.min(80, ch.l + lightAdj));
    const rr = hslToRgb(ah, as, al);
    return { name: c.name, hex: rgbToHex(rr.r, rr.g, rr.b) };
  });
}

// 渐变：start = 纯色，end = 按原 HTML 8 组规则做色相/明度偏移（移植 adjustAuxiliaryColors gradient 段）
function deriveGradient(chart, theme) {
  const take = chart.slice(0, 8);
  return take.map((c, i) => {
    const cr = hexToRgb(c.hex);
    const cs = rgbToHsl(cr.r, cr.g, cr.b);
    const start = { h: cs.h, s: cs.s, l: cs.l };
    let end = { h: cs.h, s: cs.s, l: cs.l };
    switch (i) {
      case 0: end.h = (end.h + 15) % 360; if (theme === 'light') { end.l = Math.min(85, end.l + 10); end.s = Math.max(50, end.s - 10); } else { end.l = Math.min(80, end.l + 20); end.s = Math.max(60, end.s - 5); } break;
      case 1: end.h = (end.h + 10) % 360; if (theme === 'light') { end.l = Math.min(80, end.l + 8); end.s = Math.max(55, end.s - 15); } else { end.l = Math.min(85, end.l + 15); end.s = Math.max(65, end.s - 10); } break;
      case 2: end.h = (end.h + 8) % 360; if (theme === 'light') { end.l = Math.min(82, end.l + 12); end.s = Math.max(60, end.s - 12); } else { end.l = Math.min(87, end.l + 18); end.s = Math.max(70, end.s - 8); } break;
      case 3: end.h = (end.h - 5) % 360; if (theme === 'light') { end.l = Math.min(90, end.l + 20); end.s = Math.max(40, end.s - 30); } else { end.l = Math.min(88, end.l + 15); end.s = Math.max(50, end.s - 20); } break;
      case 4: end.h = (end.h - 10) % 360; if (theme === 'light') { end.l = Math.min(85, end.l + 15); end.s = Math.max(60, end.s - 20); } else { end.l = Math.min(82, end.l + 12); end.s = Math.max(70, end.s - 15); } break;
      case 5: end.h = (end.h + 5) % 360; if (theme === 'light') { end.l = Math.min(80, end.l + 20); end.s = Math.max(50, end.s - 25); } else { end.l = Math.min(78, end.l + 15); end.s = Math.max(60, end.s - 20); } break;
      case 6: end.h = (end.h + 5) % 360; if (theme === 'light') { end.l = Math.min(85, end.l + 15); end.s = Math.max(55, end.s - 20); } else { end.l = Math.min(83, end.l + 12); end.s = Math.max(65, end.s - 15); } break;
      case 7: end.h = (end.h - 5) % 360; if (theme === 'light') { end.l = Math.min(90, end.l + 18); end.s = Math.max(45, end.s - 25); } else { end.l = Math.min(88, end.l + 14); end.s = Math.max(55, end.s - 20); } break;
      default: if (theme === 'light') { end.l = Math.min(85, end.l + 15); end.s = Math.max(50, end.s - 15); } else { end.l = Math.min(82, end.l + 12); end.s = Math.max(60, end.s - 10); }
    }
    end.h = ((end.h % 360) + 360) % 360;
    end.s = Math.max(30, Math.min(90, end.s));
    end.l = Math.max(40, Math.min(95, end.l));
    const sr = hslToRgb(start.h, start.s, start.l);
    const er = hslToRgb(end.h, end.s, end.l);
    return {
      name: c.name,
      start: rgbToHex(sr.r, sr.g, sr.b),
      end: rgbToHex(er.r, er.g, er.b),
    };
  });
}

/* ============================================================
 * 功能色（固定语义，不随品牌推导）
 * ============================================================ */

function resolveFunctional(brand, theme, platform) {
  if (theme === 'dark') return clone(SPEC.darkDefaults.functional[platform]);
  return clone(SPEC.platforms[platform].light.functional);
}

/* ============================================================
 * 背景（亮色中性主题不随品牌变；暗色 brandSurface 取品牌深色调）
 * ============================================================ */

function resolveBackground(brand, theme, platform) {
  if (theme === 'light') return clone(SPEC.platforms[platform].light.background);
  const bg = clone(SPEC.darkDefaults.background);
  if (brand.toUpperCase() !== BASE_BRAND) {
    bg.brandSurface = adjustLightness(brand, -32); // 品牌深色调表面
  }
  return bg;
}

/* ============================================================
 * 展平为 CSS 变量（供 Agent 注入 :root）
 * ============================================================ */

function buildCss(palette) {
  const css = {};
  const p = palette.primary;
  css['--color-primary'] = p.default;
  css['--color-primary-hover'] = p.hover;
  // R-04 修复：取值链原为 `p.active || p.pressed`，web 暗色特例只有 `click` 键，
  // 两者皆 undefined → 产出字面量 "--color-primary-active: undefined"。
  // 现补全 click 回退，并在末尾做显式断言（宁可抛错也不要把 undefined 写进 CSS）。
  css['--color-primary-active'] = p.active || p.pressed || p.click;
  if (p.disabledBg) css['--color-primary-disabled-bg'] = p.disabledBg;
  if (p.disabledFg || p.disabledText) {
    css['--color-primary-disabled-fg'] = p.disabledFg || p.disabledText;
  }

  palette.neutral.forEach((n, i) => { css[`--color-neutral-${i + 1}`] = n.hex; });

  palette.chart.forEach((c, i) => { css[`--color-chart-${i + 1}`] = c.hex; });

  palette.gradient.forEach((g, i) => {
    css[`--gradient-${i + 1}`] = `linear-gradient(135deg, ${g.start} 0%, ${g.end} 100%)`;
  });

  const f = palette.functional;
  Object.keys(f).forEach((k) => {
    const v = f[k];
    if (typeof v === 'string') { css[`--color-${k}`] = v; return; }
    // flat 变量（R-01 修复）：--color-success 等 = default，供按钮/状态点/标签直接消费
    if (v.default) css[`--color-${k}`] = v.default;
    Object.keys(v).forEach((sk) => { css[`--color-${k}-${sk}`] = v[sk]; });
  });

  const bg = palette.background;
  css['--color-bg-page'] = bg.page;
  css['--color-bg-surface'] = bg.surface;
  css['--color-text-primary'] = bg.textPrimary;
  css['--color-text-secondary'] = bg.textSecondary;
  css['--color-text-tertiary'] = bg.textTertiary;
  css['--color-border'] = bg.border;
  css['--color-brand-surface'] = bg.brandSurface;
  css['--color-brand-surface-fg'] = bg.brandSurfaceFg;

  // R-04 兜底断言：任何一条 CSS 变量落到 undefined/null/空串/NaN 色值，
  // 都会在页面上变成静默失效的声明（浏览器丢弃该行，元素回退到继承色）。
  // 这类缺陷肉眼极难发现，故在生成侧直接 fail-fast。
  const bad = Object.entries(css).filter(([, v]) =>
    v == null || v === '' || /undefined|null|NaN/i.test(String(v))
  );
  if (bad.length) {
    throw new Error(
      `[brand-color-engine] CSS 变量生成出现无效值（${palette.platform}/${palette.mode}）：\n` +
      bad.map(([k, v]) => `  ${k}: ${v}`).join('\n')
    );
  }
  return css;
}

/* ============================================================
 * 主入口
 * ============================================================ */

function generatePalette(brandColor, opts = {}) {
  const mode = (opts.mode || 'light') === 'dark' ? 'dark' : 'light';
  const platform = opts.platform === 'mobile' ? 'mobile' : 'web';
  // 输入归一化 + 校验（R-03/R-04 修复）：trim 后必须是 3 位或 6 位十六进制，
  // 非法输入显式 throw，禁止静默产出 #NANNANNAN 垃圾色值
  let raw = String(brandColor == null || brandColor === '' ? BASE_BRAND : brandColor)
    .trim()
    .replace(/^#/, '')
    .toUpperCase();
  if (!/^[0-9A-F]{6}$/.test(raw) && !/^[0-9A-F]{3}$/.test(raw)) {
    throw new Error(
      `[brand-color-engine] 非法品牌色 "${brandColor}"：必须是 3 位或 6 位十六进制颜色（如 #005EAE）`
    );
  }
  if (raw.length === 3) raw = raw[0] + raw[0] + raw[1] + raw[1] + raw[2] + raw[2];
  const brand = '#' + raw;

  const primary = generatePrimary(brand, mode, platform);
  const neutral = deriveNeutral(brand, mode, platform);
  const chart = deriveChart(brand, mode, platform);
  const gradient = deriveGradient(chart, mode);
  const functional = resolveFunctional(brand, mode, platform);
  const background = resolveBackground(brand, mode, platform);

  const palette = {
    brand: brand,
    mode,
    platform,
    primary,
    neutral,
    chart,
    gradient,
    functional,
    background,
    css: {},
  };
  palette.css = buildCss(palette);
  return palette;
}

/* ============================================================
 * 自检：亮/暗调色板对等性（R-15 修复）
 * ------------------------------------------------------------
 * 此前引擎没有任何「亮色有、暗色没有」的检查，所以 base-spec.json 里
 * 少一个键（如 primarySpecial.web 缺 active）不会有任何信号，
 * 一路静默流到 CSS 变量里变成 undefined。
 * 这里把「同一平台下亮/暗必须提供同一组可消费键」变成可执行断言。
 * ============================================================ */

// buildCss 实际消费的 primary 规范键 —— 亮暗两模式都必须能解析出值
const PRIMARY_CANONICAL = ['default', 'hover', 'active', 'disabledBg', 'disabledFg'];

// NEW-005 已知缺口白名单：仅覆盖「功能色 × 交互态后缀」，
// 不得放宽到 --color-primary-* / --color-chart-* / --color-text-* 等其它族。
const KNOWN_DARK_FUNCTIONAL_GAP =
  /^--color-(success|warning|error|running)-(hover|active|pressed|disabled|bgHover|borderHover|borderActive)$/;

function resolvePrimaryKey(p, key) {
  if (key === 'active') return p.active || p.pressed || p.click;
  if (key === 'disabledFg') return p.disabledFg || p.disabledText;
  return p[key];
}

/**
 * @param {object} [opts]
 * @param {boolean} [opts.throwOnWarn=false] 把软告警也升级成错误
 * @returns {{errors: string[], warnings: string[]}}
 */
function assertParity(opts = {}) {
  const errors = [];
  const warnings = [];
  const platforms = ['web', 'mobile'];

  for (const platform of platforms) {
    let light, dark;
    try {
      light = generatePalette(BASE_BRAND, { mode: 'light', platform });
      dark = generatePalette(BASE_BRAND, { mode: 'dark', platform });
    } catch (e) {
      errors.push(`[${platform}] 调色板生成失败：${e.message}`);
      continue;
    }

    // 1) primary 规范键：亮暗都必须解析出非空值（硬错误）
    for (const key of PRIMARY_CANONICAL) {
      for (const [mode, pal] of [['light', light], ['dark', dark]]) {
        const v = resolvePrimaryKey(pal.primary, key);
        if (v == null || v === '') {
          errors.push(`[${platform}/${mode}] primary.${key} 缺失或为空（buildCss 会产出 undefined）`);
        }
      }
    }

    // 2) CSS 变量集合对等：亮色有而暗色没有的变量 = 暗色页面上该样式静默失效
    const lk = new Set(Object.keys(light.css));
    const dk = new Set(Object.keys(dark.css));
    const onlyLight = [...lk].filter((k) => !dk.has(k));
    const onlyDark = [...dk].filter((k) => !lk.has(k));
    // 已知跨模式差异（NEW-005，待裁决）：暗色功能色目前只定义 default/bg/border/text 四键，
    // 交互态（hover/active/pressed/disabled/bgHover/border*Hover/borderActive）未提供。
    // 后果是暗色下这些声明静默失效（按钮 hover 不变色），但补齐需为 005EAE 权威板新造约 30 个
    // 色值，超出本轮授权范围，故降级为告警、单独立案，不在此处静默造值。
    const known = (k) => KNOWN_DARK_FUNCTIONAL_GAP.test(k);
    const hardMissing = onlyLight.filter((k) => !known(k));
    const softMissing = onlyLight.filter(known);
    if (hardMissing.length) errors.push(`[${platform}] 暗色缺少亮色已有的 CSS 变量：${hardMissing.join(', ')}`);
    if (softMissing.length) warnings.push(`[${platform}] NEW-005 暗色功能色缺交互态 ${softMissing.length} 项（已立案，非本轮范围）：${softMissing.join(', ')}`);
    if (onlyDark.length) warnings.push(`[${platform}] 暗色独有 CSS 变量（若为有意设计可忽略）：${onlyDark.join(', ')}`);

    // 3) 数组长度对等：图表色条数不一致会让「第 N 条序列」在切换主题后换色（硬错误）
    if (light.chart.length !== dark.chart.length) {
      errors.push(`[${platform}] chart 条数亮=${light.chart.length} 暗=${dark.chart.length}，序列色会在主题切换时错位`);
    }
    // 中性阶两端本就不同长（移动端亮色 10 阶、暗色共用 11 阶），降级为告警
    if (light.neutral.length !== dark.neutral.length) {
      warnings.push(`[${platform}] neutral 阶数亮=${light.neutral.length} 暗=${dark.neutral.length}（已知跨端差异）`);
    }

    // 4) 图表色名对等：同一序号必须是同一语义
    const n = Math.min(light.chart.length, dark.chart.length);
    for (let i = 0; i < n; i++) {
      if (light.chart[i].name !== dark.chart[i].name) {
        errors.push(`[${platform}] chart[${i}] 语义错位：亮="${light.chart[i].name}" 暗="${dark.chart[i].name}"`);
      }
    }
  }

  if (errors.length || (opts.throwOnWarn && warnings.length)) {
    throw new Error(
      '[brand-color-engine] 亮/暗对等性自检未通过：\n' +
      [...errors, ...(opts.throwOnWarn ? warnings : [])].map((s) => '  ✗ ' + s).join('\n')
    );
  }
  return { errors, warnings };
}

module.exports = { generatePalette, assertParity, SPEC, BASE_BRAND };

/* ============================================================
 * CLI：node generate.js <brand> [mode] [platform]
 * ============================================================ */

if (require.main === module) {
  const args = process.argv.slice(2);

  // `node generate.js --check` → 只跑亮/暗对等性自检（供 ci-local.js 调用）
  if (args[0] === '--check') {
    try {
      const { warnings } = assertParity();
      warnings.forEach((w) => process.stdout.write(`  ⚠ ${w}\n`));
      process.stdout.write('  ✅ brand-color-engine 亮/暗对等性自检通过\n');
      process.exit(0);
    } catch (e) {
      process.stderr.write(e.message + '\n');
      process.exit(1);
    }
  }

  const brand = args[0] || BASE_BRAND;
  const mode = args[1] || 'light';
  const platform = args[2] || 'web';
  // CLI 参数告警（R-08 修复）：非法 mode/platform 不再静默降级
  if (args[1] && mode !== 'light' && mode !== 'dark') {
    process.stderr.write(`⚠ 未知 mode "${mode}"，已回退 light（合法值: light | dark）\n`);
  }
  if (args[2] && platform !== 'web' && platform !== 'mobile') {
    process.stderr.write(`⚠ 未知 platform "${platform}"，已回退 web（合法值: web | mobile）\n`);
  }
  const out = generatePalette(brand, { mode, platform });
  process.stdout.write(JSON.stringify(out, null, 2) + '\n');
}
