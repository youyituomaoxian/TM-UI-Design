# 暗色模式（Dark Mode）设计令牌对照 · 弘讯双端

> 2026-07-30 · C 包产物
> 真源：`tokens.json` 顶层 `dark` 节（值来自 brand-color-engine `generatePalette('#005EAE',{mode:'dark'})` 快照，引擎为唯一真源，勿手改）
> 切换：`page-template.html` 的 `:root[data-theme="dark"]` 属性选择器
> 国际对标：见 `TOKENS-EVIDENCE.md` 第八节（引证 16–20：Material / AntD / Apple HIG / Atlassian / Polaris）
> 适用：Web 后台（Ant Design 风）+ 移动端（微信小程序 / Android / iOS 跨端）

---

## 一、如何启用暗色

在根元素或任意容器上加 `data-theme="dark"` 即可整体切换，无需改组件：

```html
<!-- 全局暗色 -->
<html lang="zh-CN" data-theme="dark">

<!-- 或局部暗色容器 -->
<div data-theme="dark"> … </div>
```

原理：`page-template.html` 的 `:root` 定义亮色变量；`:root[data-theme="dark"]` 块用暗色值**覆盖同名变量**。所有组件只引用 `var(--n1)` / `var(--primary)` 等短名变量，因此自动适配，无需逐组件改样式。

> ⚠️ 亮色 `:root` 与 `[data-density]` 块**未改动**；C 包仅在亮色 `:root` 新增 `--brand-surface:#005EAE`，并新增 `[data-theme="dark"]` 块。

---

## 二、亮 ↔ 暗 令牌映射表（双端共用，平台差异见第四节）

### 品牌色 primary

| 变量 | 亮色 | 暗色 | 说明 |
|------|------|------|------|
| `--primary` | `#005EAE` | `#3B82F6` | 暗色提亮保对比（全饱和蓝） |
| `--primary-hover` | `#1A75D2` | `#60A5FA` | |
| `--primary-active` / `--primary-pressed` | `#004A8F` / `#004ABF` | `#2563EB` | Web=click，Mobile=pressed |
| `--primary-dis-bg` | `#DAEAFA` | `#374151` | |
| `--primary-dis-fg` | `#A0B4C0` | `#9CA3AF` | |
| `--brand-surface` | `#005EAE` | `#0A2540` | 品牌深表面（如品牌区底色） |

### 中性色 neutral（暗色为独立色阶，对齐引擎 `background.*` + 文本阶梯；**非**亮色机械反相）

| 变量 | 亮色 | 暗色 | 引擎来源 |
|------|------|------|----------|
| `--n1` | `#FFFFFF` | `#1E293B` | `background.surface` |
| `--n2` | `#FAFAFA` / `#F5F7FB` | `#243044` | `background.elevated` |
| `--n3` | `#F6F9FC` / `#E9ECF0` | `#334155` | `background.border` |
| `--n4` | `#F5F7FB` / `#DEE2E5` | `#121826` | `background.page` |
| `--n5` | `#EAEAED` / `#CED4E4` | `#1E293B` | 输入框底 = surface |
| `--n6` | `#DEE2E6` / `#ADB5BF` | `#334155` | 边框 = border |
| `--n7` | `#CED4DA` / `#6C757D` | `#475569` | — |
| `--n8` | `#ADB5BD` / `#334155` | `#94A3B8` | `textTertiary` |
| `--n9` | `#6C757D` / `#343A46` | `#CBD5E1` | `textSecondary` |
| `--n10` | `#334155` / `#21253C` | `#F1F5F9` | `textPrimary` |
| `--n11` | `#212532` / — | `#FFFFFF` | 白色 |

> **关键设计决策**：暗色 `--n1..--n6` 不再是亮色的简单反相（如 `#FFFFFF→#0F172A`），而是**引擎 `background.*` 层级映射**：
> 页面底(`n4`)最深 `#121826` → 卡片表面(`n1`)稍浅 `#1E293B` → 抬升面(`n2`)更浅 `#243044`。
> 这保证了暗色下**页面 < 卡片 < 浮层**的明度层级与亮色一致（亮色：灰白页 < 白卡 < 白浮层）。

### 背景 / 表面 background

| 变量 | 亮色 | 暗色 |
|------|------|------|
| 页面底 `page` | `#F5F7FB`（Web）/ `#F5F7FB`（移动） | `#121826` |
| 卡片底 `surface` | `#FFFFFF` | `#1E293B` |
| 浮层底 `elevated` | `#FFFFFF` | `#243044` |
| 主文本 `textPrimary` | `#334155` / `#343A46` | `#F1F5F9` |
| 次文本 `textSecondary` | `#6C757D` | `#CBD5E1` |
| 三文本 `textTertiary` | `#ADB5BD` | `#94A3B8` |
| 边框 `border` | `#DEE2E6` / `#DEE2E5` | `#334155` |

### 功能色 functional（语义=背景色，平台/模式固定，见第四节）

| 角色 | 变量 | 亮色（Web） | 暗色（Web） | 暗色（移动） |
|------|------|------|------|------|
| 成功 | `--suc` / `bg` / `text` | `#389E0D` / `#F6FFED` / `#FFFFFF` | `#52C41A` / `#162312` / `#FFFFFF` | `#34D399` / `#0C2E22` / `#06281C` |
| 警告 | `--warn` / `bg` / `text` | `#FA8C16` / `#FFF7E6` / `#FFFFFF` | `#FFA940` / `#2E2410` / `#1A1A1A` | `#FBBF24` / `#2E2410` / `#1A1A1A` |
| 错误 | `--err` / `bg` / `text` | `#F5222D` / `#FFF1F0` / `#FFFFFF` | `#FF4D4F` / `#2A1414` / `#FFFFFF` | `#F87171` / `#2A1414` / `#FFFFFF` |
| 运行 | `--run` / `bg` / `text` | `#16A34A` / `#ECFDF5` / `#FFFFFF` | `#22C55E` / `#0E2018` / `#FFFFFF` | `#22C55E` / `#0E2018` / `#FFFFFF` |

### 图表色 chart（暗色，2026-08-06 联动 CHART-SPEC §4）

> 两端 `template.css` 的 `:root[data-theme="dark"]` **不重定义 `--chart-*`**（图表色沿用亮色值）——图表数据色语义跨模式保持，靠「暗底对比筛选」而非换色。

| 端 | 亮色可用 | 暗色（暗底 `#121826`~`#1E293B`）|
|---|---|---|
| Web（8 色）| 全量 | **禁用主系列线/描边**：`--chart-tech-blue` `#0066CC`（暗底对比 <3:1）；其余（smart-cyan/data-cyan/fresh-green/vivid-orange/alert-red/wisdom-purple/modern-pink）可作线条/描边 |
| 移动（13 色）| 全量 | **禁用主系列线/描边**：`--chart-blue-aux` `#1D4ED8`、`--chart-green-growth` `#059669`（暗底对比偏低）；`--chart-blue` `#0061FF` 作描边勉强（≥3:1），作大面积填充需提亮或换 `--chart-cyan` |

**规则**（写入 CHART-SPEC §4）：
- 暗色下主系列线/描边优先用**亮系**（Web data-cyan/fresh-green/vivid-orange/alert-red；移动 cyan/orange/red/rose/purple-a），禁深色系（tech-blue / blue-aux / green-growth）作主线条
- 图表文字（轴标签/数值/图例）暗色走 `n` 级文字 token（dark 段已定义 n8/n9 变体），**不直接引 chart 色作文字**
- 环状图暗色：底环 `--n3` 暗色变体已由 dark 段处理，分段色同上筛选

### 投影 / Elevation（暗色：暗底 + 白色发丝线）

| 节 | 亮色（示例 card） | 暗色（card） |
|----|------|------|
| `shadow` | `0 1px 2px rgba(0,0,0,.10), 0 0 0 1px rgba(0,0,0,.04)` | `0 1px 2px rgba(0,0,0,.40), 0 0 0 1px rgba(255,255,255,.04)` |
| `elevation.default` surface | `#FFFFFF` | `#1E293B` |
| `elevation.raised` surface | `#FFFFFF` | `#243044` |
| `elevation.overlay` surface | `#FFFFFF` | `#1E293B` / `#243044` |

### 暗态结构骨架（Chrome）背景切换 — **通用规则**

> **问题**：亮态下顶栏/侧栏/底栏使用 `background:var(--primary)`（品牌蓝 `#005EAE`），切到暗态后
> `--primary` 变为 `#3B82F6`（更亮的蓝），导致**蓝壳 + 黑芯**——结构骨架仍是亮蓝色，
> 与深色内容区（`#121826`）形成强烈割裂感。
>
> **通用解法**：在 `:root[data-theme="dark"]` 内增加一条 CSS 规则，将结构骨架的背景
> 从 `--primary` 切换到 `--brand-surface`（引擎 `background.brandSurface = #0A2540`，深蓝黑带品牌调）。

```css
/* 写在 :root[data-theme="dark"] 块内 */
.topbar, .sidebar, .footer { background: var(--brand-surface); }
```

| 元素 | 亮态背景 | 暗态背景 | Token |
|------|----------|----------|-------|
| 顶栏 `.topbar` | `var(--primary)` → `#005EAE` 蓝色 | `var(--brand-surface)` → `#0A2540` 深蓝黑 | 引擎 `brandSurface` |
| 侧栏 `.sidebar` | 同上 | 同上 | 同上 |
| 底栏 `.footer` | 同上 | 同上 | 同上 |

**文字颜色不受影响**：上述元素的白字由同块内的嵌套规则统一覆盖：
```css
.topbar, .topbar .nav a, .topbar .btn-text, .sidebar, .tree-node,
.tree-sw, .btn-primary, .footer, .collapse-btn, .pager .pg.active {
  color: var(--n11); /* #FFFFFF 白色 */
}
```

**适用范围**：所有基于弘讯 Web 设计系统（`template.css` + `page-template.html`）生成的后台页面。
Agent 克隆模板时自动继承此规则，无需逐页手写。

**引擎来源**：`base-spec.json` → `darkDefaults.background.brandSurface = "#0A2540"`。
此值是配色引擎根据品牌色 `#005EAE` 在暗色模式下推导的品牌表面色，**不可手改**。

---

## 三、模板暗色切换代码（节选自 page-template.html）

```css
/* 亮色（已有，未改） */
:root{ --primary:#005EAE; --n1:#FFFFFF; --brand-surface:#005EAE; … }

/* 暗色（C 包新增 + Chrome 背景切换） */
:root[data-theme="dark"]{
  --primary:#3B82F6; --primary-hover:#60A5FA; --primary-active:#2563EB;
  --primary-dis-bg:#374151; --primary-dis-fg:#9CA3AF;
  /* 中性 N1–N11：对齐引擎 background.* + 文本阶梯 */
  --n1:#1E293B; --n2:#243044; --n3:#334155; --n4:#121826;
  --n5:#1E293B; --n6:#334155; --n7:#475569; --n8:#94A3B8;
  --n9:#CBD5E1; --n10:#F1F5F9; --n11:#FFFFFF;
  /* 功能色（Web，来自引擎 functional.web） */
  --suc:#52C41A; --suc-soft:#162312; --suc-fg:#FFFFFF;
  --warn:#FFA940; --warn-soft:#2E2410; --warn-fg:#1A1A1A;
  --err:#FF4D4F; --err-soft:#2A1414; --err-fg:#FFFFFF;
  --run:#22C55E; --run-soft:#0E2018; --run-fg:#FFFFFF;
  --brand-surface:#0A2540;
  /* 投影 / Elevation */
  --shadow-card:0 1px 2px rgba(0,0,0,.40), 0 0 0 1px rgba(255,255,255,.04);
  --elev-default-surface:#1E293B; …
  /* ★ Chrome 背景切换：结构骨架从 primary(蓝) → brand-surface(深蓝黑) */
  .topbar, .sidebar, .footer{background:var(--brand-surface);}
  /* ★ 主色底白字：暗态 n1 已是表面色，主色底文字改走 n11 */
  .topbar, .topbar .nav a, .topbar .btn-text, .sidebar, .tree-node,
  .tree-sw, .btn-primary, .footer, .collapse-btn, .pager .pg.active{
    color:var(--n11);
  }
}
```

---

## 四、平台差异（W1 / W2 必须注意）

1. **功能色暗色值分平台**：Web 成功绿 `#52C41A` / 移动端 `#34D399`（均来自 `darkDefaults.functional`）。Web 错误 `#FF4D4F` / 移动端 `#F87171`；警告 Web `#FFA940` / 移动端 `#FBBF24`；运行两平台同 `#22C55E`。**不可混用**。
2. **中性色阶级数**：Web 11 级（N1–N11），移动端 10 级（N1–N10）。
3. **主色按下态键名**：Web `click`，移动端 `pressed`。
4. **移动端特有变量**：`--suc-pressed/--suc-dis/--suc-text`、`--run-pressed/--run-bg/--run-border`、`--link` 暗色 `#60A5FA`，均见 `tokens.json` `dark.colors`。

---

## 五、校验与维护

- **唯一真源**：`tokens.json` 的 `dark` 节。改暗色请改这里，再重跑 `scripts/generate-design-tokens-md.js`。
- **引擎等式**：`dark` 节的值必须逐键等于 `generatePalette('#005EAE',{mode:'dark',platform})` 输出（见 `brand-color-engine/`）。`ci-local.js` 已加暗色快照等式断言，不符即 fail。
- **不要**：手改 `page-template.html` 里 `[data-theme="dark"]` 的色值（应以 tokens.json 为准）；把亮色 `:root` 变量改进暗色块。
- **微信小程序**：小程序不支持 `data-theme` 属性选择器切换，W2 阶段需由组件库（如 Taro/NutUI）用 `dark` 节 token 做条件样式或 CSS 变量注入。

---

## 六、国际对标要点（详情见 TOKENS-EVIDENCE.md 引证 16–20）

- **深灰非纯黑**：暗色页面底 `#121826`（带品牌冷调），对标 Material「Darken with grey」。
- **elevation 暗色保留暗阴影 + 白色发丝线**，不用浅色光晕替代阴影（Material 明示）。
- **中性色独立暗色阶**（非亮色反相），对标 Atlassian dedicated dark ramp。
- **功能色平台/模式固定**（非机械反相），对标 Apple HIG「语义色自适应但非简单反相」+ Polaris 语义令牌分组。
- **切换机制**：属性选择器切换 = AntD `algorithm` / Atlassian token theme / Polaris `colorScheme` 同理念。
