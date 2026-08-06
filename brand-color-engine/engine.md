# 弘讯设计系统 · 品牌色推导引擎（brand-color-engine）

> 在智能体中读取本引擎 → 生成「应用页 HTML 原型」（不是可视化规范展示页）。
> 配套文件：`base-spec.json`（005EAE 权威基准）、`generate.js`（推导引擎）、`build-app.js`（应用页生成示例）。

---

## 1. 它解决什么

设计系统已有 web / mobile 两套 `design-system/`（005EAE 规范页）。但实际项目中常需：

1. **默认**生成弘讯品牌色 `#005EAE` 的应用页；
2. **指定其他品牌色**时，自动推导出一套视觉协调、语义正确的应用页配色；
3. **暗色模式**下，根据品牌色生成对应的完整暗色调色板。

本引擎把上述能力收敛为一个可调用函数 `generatePalette(brand, {mode, platform})`，
Agent 只需读 `engine.md` + 调 `generate.js`，即可拿到可直接套用到 HTML 的调色板 JSON。

---

## 2. 核心决策（2026-07 规划锁定）

| 项 | 决策 | 说明 |
|----|------|------|
| 产出形态 | HTML 原型（可选同步 Ardot） | 不是规范展示页 |
| 功能色 | **固定语义色，不随品牌推导** | 防止识别性偏低；成功/警告/错误/运行跨品牌一致 |
| 默认 005EAE | 返回 2026 规范**原值** | HTML 2025 仅作算法来源，以 2026 规范为准 |
| 暗色 | 完整暗色调色板 | 中性暗阶、品牌深表面、暗功能色全覆盖 |
| 页面范围 | 不限类型，从零生成 | 引擎只出配色，页面结构由 Agent 决定 |
| 落地 | 仓库根独立模块 `brand-color-engine/` | 与两套 `design-system/` 解耦 |

---

## 3. 输入 / 输出契约

### 3.1 调用

```js
const { generatePalette } = require('./generate.js');

// 默认 005EAE 亮色 web
const webDefault = generatePalette('#005EAE', { mode: 'light', platform: 'web' });

// 指定品牌 + 暗色 + 移动端
const darkMobile = generatePalette('#2E7D5B', { mode: 'dark', platform: 'mobile' });
```

- `brand`：3 位或 6 位十六进制（带不带 `#` 均可），大小写不敏感，首尾空格自动 trim。
  **非法输入（如 `xyz`、`#12345`）会显式 `throw`，不会静默产出垃圾色值。**
- `mode`：`'light'`（默认）| `'dark'`。
- `platform`：`'web'`（默认）| `'mobile'`。
- **品牌色建议区间**：HSL 明度建议 25%–75%、饱和度 ≥ 20%。近纯白（如 `#FFFFFF`）或近纯黑
  （如 `#000000`）的退化品牌色虽可运行，但暗色模式下 `brandSurface` 白字对比度和推导图表色
  对比度可能低于 WCAG 3:1，请避免用于正式交付。

### 3.2 返回结构

```jsonc
{
  "brand": "#005EAE",
  "mode": "light",
  "platform": "web",
  "primary":   { "default", "hover", "active"(web)/"pressed"(mobile), "disabledBg", "disabledFg" },
  "neutral":   [ { "name": "N1", "hex", "usage" }, ... ],        // web 11 阶 / mobile 10 阶
  "chart":     [ { "name", "hex" }, ... ],                       // web 8 / mobile 12
  "gradient":  [ { "name", "start", "end" }, ... ],              // 最多 8 组
  "functional":{ "success", "warning", "error", "running"(, "link") },
  "background":{ "page", "surface", "textPrimary", "textSecondary",
                 "textTertiary", "border", "brandSurface", "brandSurfaceFg" },
  "css": { "--color-primary": "#005EAE", ... }  // 展平后的 CSS 变量，可直接注入 :root
}
```

`css` 字段把上面所有颜色展平为 `:root` 可用的变量名（含 `--gradient-1..N` 的
`linear-gradient(...)` 值），Agent 写 HTML 原型时直接 `<style>:root{ ... }</style>` 注入即可。

**primary 键名约定**：所有路径（005EAE 特例 / 任意品牌推导 × web / mobile）都保证提供
`active` 与 `disabledFg`；同时保留平台原生键（web `click` / mobile `pressed`、`disabledText`）
作为别名向后兼容。mobile 特例路径中 `active === pressed`（有意的跨端统一别名，值零漂移）。

**functional 的 CSS 变量双形态**：每个功能色同时输出 flat 变量 `--color-success`（= default，
供按钮/状态点/标签直接消费）与子键变量 `--color-success-default / -bg / -text` 等。

---

## 4. 推导规则（与 base-spec.json 的关系）

`base-spec.json` 是 **005EAE 唯一真值来源**，只存「亮色全量值 + 暗色共享常量」。
`generate.js` 负责「推导」，规则如下：

### 4.1 005EAE 亮色（`brand === '#005EAE' && mode === 'light'`）
**直接返回** `base-spec.json` 中 `platforms[platform].light` 原值（零推导漂移）。
功能色即 2026 规范固定值。

### 4.2 005EAE 暗色（`brand === '#005EAE' && mode === 'dark'`）
- 主色取 `darkDefaults.primarySpecial[platform]`（`#3B82F6 / #60A5FA / #2563EB`，与原 HTML 色彩系统一致）。
- 中性取 `darkDefaults.neutralScale`（D1–D11 暗阶）。
- web 图表取 `darkDefaults.chartWeb`（8 个提亮后的辅助色）；mobile 图表由亮色图表提亮推导。
- 功能色取 `darkDefaults.functional[platform]`（暗色优化的固定语义色）。
- 背景取 `darkDefaults.background`。

### 4.3 任意品牌 亮色
- **主色**：以品牌 HSL 明度为依据，按 `lightness` 分支算 `hover`(+)/`click`(-)（移植自原 HTML `generatePrimaryColors`），禁用态固定中性灰。
- **中性**：以 `base-spec` 亮色中性阶为基底，按品牌色相/饱和度/明度做 `hueInfluence / saturationInfluence / lightnessInfluence` 微调（中间调幅度大、极亮极暗幅度小，饱和度钳制 0–20%）。
- **图表/辅助**：以 `base-spec` 图表为基底，按「品牌与基准主色 `#005EAE` 的 HSL 差」做加权色相偏移（蓝青系 0.4、绿 0.2、橙红 0.1、紫粉 0.05），并叠加饱和/明度差。
- **渐变**：`start = 纯色`，`end = 纯色 + 按索引的色相/明度偏移`（移植自原 HTML 8 组渐变规则）。
- **功能色**：**保持固定** = `base-spec` 亮色功能色（不推导）。
- **背景**：中性主题（page/surface/text/border）同 005EAE 亮色；`brandSurface` 用品牌色本身。

### 4.4 任意品牌 暗色
- 中性取暗阶 `neutralScale`；背景取 `darkDefaults.background`，`brandSurface` 取品牌色深色调（`adjustLightness(brand, -32)`）。
- 主色 `default` 用品牌色本身，`hover/click` 走暗色分支。
- 图表由对应亮色图表提亮推导（暗色下整体提亮 +15 以保可读性）。
- 功能色保持固定 = `darkDefaults.functional[platform]`（不推导）。

> 关键不变式：**功能色（成功/警告/错误/运行）永不随品牌变化** —— 无论什么品牌、什么模式，
> 同一平台的功能色都来自 base-spec 的固定值，保证状态语义全局可识别。

---

## 5. Agent 工作流

1. 读本文档，确认 `brand / mode / platform` 参数。
2. `const pal = generatePalette(brand, { mode, platform })`。
3. 把 `pal.css` 注入 HTML 原型 `:root`：`document.documentElement.style.setProperty('--color-primary', pal.primary.default)` 或静态 `<style>`。
4. 用 `pal.primary / neutral / chart / functional / gradient / background` 搭建页面结构（卡片、表格、按钮、图表占位等）。
5. （可选）把最终色值同步回 Ardot 变量集。

---

## 6. CLI 快速预览

```bash
node generate.js 005EAE light web      # 默认规范页配色
node generate.js 2E7D5B dark web       # 绿品牌暗色 web
node generate.js C2185B dark mobile    # 粉品牌暗色移动端
```

输出完整 JSON，可管道给 `jq` 或保存为参考文件。

---

## 7. 文件清单

| 文件 | 作用 |
|------|------|
| `base-spec.json` | 005EAE 权威基准：亮色全量值（web/mobile）+ 暗色共享常量 |
| `generate.js` | 推导引擎，导出 `generatePalette(brand, opts)` |
| `engine.md` | 本文档 |
| `build-app.js` | 应用页生成示例：把调色板渲染成 HTML 原型（冒烟/演示用） |
| `examples/build-fleet.js` | 领域验证页生成脚本（橡塑机械·机器群览，`#00D4A1` 暗色 web） |
| `examples/gen-examples.js` | **品牌示例页生成器（2026-08-06 建立）**：重新生成两端示例页（default 亮 / dark 暗 / 任意品牌亮）；示例页当前已删，需要时重跑即重建 |

> demo HTML **按需生成、不入库**（`.gitignore` 已忽略 `examples/*.html`）：
> `node build-app.js <brand> [mode] [platform] [out]` 或 `node examples/build-fleet.js`。
