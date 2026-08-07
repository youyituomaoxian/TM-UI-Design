# 弘讯B端视觉系统 — Design Tokens (CSS Variables)

> ⚠️ **本文件由 `scripts/generate-design-tokens-md.js` 自动生成，请勿手改。** 改 token 请编辑 `tokens.json`（值真源）或脚本内的命名映射后重跑。
> **命名规范**：全文使用「短名」CSS 变量（`--primary` / `--n5` / `--suc` / `--run` / `--radius-base` …），与 `components.json` referenceCss 及 `page-template.html :root` **1:1 对齐**。旧版 `--color-*` 全名已废弃。
> **平台**: Web / B端 / 后台管理系统（Ant Design 风格）
> **生成日期**: 2026-08-06

---

## 一、品牌信息

```css
:root {
  --brand-name: "弘讯科技 TECHMATION";
  --product: "注塑机工业控制 · B端后台管理系统";
  --style: "Ant Design 风格 · 极简工业风";
  --viewport-base: 1440px;        /* 设计基准宽度 */
  --grid-unit: 4px;               /* 最小原子网格（web 常用 4/8） */
  --grid-columns: 24;             /* Ant Design 24 栅格 */
}
```

## 二、色彩体系

### 2.1 品牌色 Primary

```css
:root {
  --primary: #005EAE; /* 主色默认 — 按钮、顶栏、侧边栏、品牌强调 */
  --primary-hover: #1A75D2; /* 主色悬停 — 按钮 hover、链接、聚焦 */
  --primary-active: #004A8F; /* 主色点击 — 按钮 active/pressed */
  --primary-dis-bg: #DAEAFA; /* 主色禁用背景 */
  --primary-dis-fg: #A0B4C0; /* 主色禁用文字 */
}
```

### 2.2 辅助色 Secondary（强调 / 操作辅助）

```css
:root {
  --secondary: #0A84FF; /* 辅助色默认 — 次级强调、图表高亮 */
  --secondary-hover: #3DA0FF; /* 辅助色悬停 */
  --secondary-active: #0066CC; /* 辅助色点击 */
  --secondary-dis-bg: #0A84FF; /* 辅助色禁用填充 */
  --secondary-dis-fg: #FFFFFF; /* 辅助色禁用文字 */
}
```

### 2.3 链接 Link

```css
:root {
  --link: #1A75D2; /* 链接默认（同主色悬停） */
}
```

### 2.4 中性色 Neutral（N1–N11）

```css
:root {
  --n1: #FFFFFF; /* N1 — 卡片底色、次按钮填充 */
  --n2: #FAFAFA; /* N2 — 表头底色 */
  --n3: #F6F9FC; /* N3 — 行悬停 */
  --n4: #F5F7FB; /* N4 — 页面背景、禁用填充、悬停底色 */
  --n5: #EAEAED; /* N5 — 输入框底色、行悬停、按钮选中填充 */
  --n6: #DEE2E6; /* N6 — 分割线、组件边框、按钮禁用边框 */
  --n7: #CED4DA; /* N7 — 次按钮边框、未激活图标、表单提示 */
  --n8: #ADB5BD; /* N8 — 禁用文字、次按钮悬停边框、辅助说明 */
  --n9: #6C757D; /* N9 — 三级文字、辅助说明、选中边框 */
  --n10: #334155; /* N10 — 二级文字、正文、按钮默认悬停、选中文字 */
  --n11: #212532; /* N11 — 一级文字、主标题、关键数据 */
}
```

### 2.5 信息化图表 Chart Palette（8 色）

```css
:root {
  --chart-tech-blue: #0066CC; /* 科技蓝 — 核心指标 */
  --chart-smart-cyan: #00A3E0; /* 智能青 — 趋势线 */
  --chart-data-cyan: #00C7BE; /* 数据青 — 对比 */
  --chart-fresh-green: #00D4A1; /* 清新绿 — 正向 */
  --chart-vivid-orange: #FF9500; /* 活力橙 — 中性/预警 */
  --chart-alert-red: #FF4D4D; /* 醒目红 — 负向/告警 */
  --chart-wisdom-purple: #8A5CF5; /* 智慧紫 — 多维分析 */
  --chart-modern-pink: #FF66C2; /* 现代粉 — 关键标注 */
}
```

### 2.6 功能色 Functional（成功 / 警告 / 错误 / 运行）

```css
:root {
  --suc: #389E0D; /* 成功 Success bg */
  --suc-hover: #52C41A; /* 成功 Success bgHover */
  --suc-active: #237804; /* 成功 Success bgActive */
  --suc-dis: #B7EB8F; /* 成功 Success bgDisabled */
  --suc-soft: #F6FFED; /* 成功 Success soft */
  --suc-soft-hover: #D9F7BE; /* 成功 Success softHover */
  --suc-border: #B7EB8F; /* 成功 Success border */
  --suc-border-hover: #95DE64; /* 成功 Success borderHover */
  --suc-border-active: #73D13D; /* 成功 Success borderActive */
  --suc-fg: #FFFFFF; /* 成功 Success fg */
  --suc-soft-active: #D9F7BE; /* 成功 Success softActive */
  --suc-dis-fg: #B8B8B8; /* 成功 Success disabledFg */
  --warn: #FA8C16; /* 警告 Warning bg */
  --warn-hover: #FFA940; /* 警告 Warning bgHover */
  --warn-active: #D46B08; /* 警告 Warning bgActive */
  --warn-dis: #FFD591; /* 警告 Warning bgDisabled */
  --warn-soft: #FFF7E6; /* 警告 Warning soft */
  --warn-soft-hover: #FFE7BA; /* 警告 Warning softHover */
  --warn-border: #FFD591; /* 警告 Warning border */
  --warn-border-hover: #FFC069; /* 警告 Warning borderHover */
  --warn-border-active: #FF9C2A; /* 警告 Warning borderActive */
  --warn-fg: #FFFFFF; /* 警告 Warning fg */
  --warn-soft-active: #FFE7BA; /* 警告 Warning softActive */
  --warn-dis-fg: #B8B8B8; /* 警告 Warning disabledFg */
  --err: #F5222D; /* 错误 Error bg */
  --err-hover: #FF4D4F; /* 错误 Error bgHover */
  --err-active: #CF1322; /* 错误 Error bgActive */
  --err-dis: #FFC8C5; /* 错误 Error bgDisabled */
  --err-soft: #FFF1F0; /* 错误 Error soft */
  --err-soft-hover: #FFCCC7; /* 错误 Error softHover */
  --err-border: #FFA39E; /* 错误 Error border */
  --err-border-hover: #FF7875; /* 错误 Error borderHover */
  --err-border-active: #FF4D4F; /* 错误 Error borderActive */
  --err-fg: #FFFFFF; /* 错误 Error fg */
  --err-soft-active: #FFCCC7; /* 错误 Error softActive */
  --err-dis-fg: #B8B8B8; /* 错误 Error disabledFg */
  --err: #101010; /* 错误 Error fgDeep */
  --run: #16A34A; /* 运行/在线 Running bg */
  --run-hover: #22C55E; /* 运行/在线 Running bgHover */
  --run-soft: #ECFDF5; /* 运行/在线 Running soft */
  --run-soft-hover: #D1FAE5; /* 运行/在线 Running softHover */
  --run-border: #BBF7D0; /* 运行/在线 Running border */
  --run-border-hover: #86EFAC; /* 运行/在线 Running borderHover */
  --run-active: #15803D; /* 运行/在线 Running bgActive */
  --run-fg: #FFFFFF; /* 运行/在线 Running fg */
  --run-dis: #B8E3C9; /* 运行/在线 Running bgDisabled */
  --run-border-active: #4ADE80; /* 运行/在线 Running borderActive */
  --run-soft-active: #D1FAE5; /* 运行/在线 Running softActive */
  --run-dis-fg: #B8B8B8; /* 运行/在线 Running disabledFg */
}
```

## 三、字体体系

```css
:root {
  --font-cn: "Source Han Sans CN", "思源黑体", sans-serif; /* 中文 */
  --font-en: "Roboto", sans-serif; /* 英文 / 数字 */
  --font-mono: 'JetBrains Mono', 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace; /* 等宽（B 包新增；工控数据/代码，对标 AntD fontFamilyCode + Polaris mono） */
}
```

### 3.1 字体层级 Token（B 包 13 级硬切换；对标 M3 15 级 + AntD heading）

```css
:root {
  --font-display: Medium 32px/40px var(--font-cn); /* 页面主标题（最高级，对标 M3 headlineLarge 32/40） */
  --font-h1: Medium 28px/36px var(--font-cn); /* 模块标题（对标 M3 headlineMedium 28/36） */
  --font-h2: Medium 24px/32px var(--font-cn); /* 区块标题（对标 M3 headlineSmall 24/32） */
  --font-h3: Medium 20px/28px var(--font-cn); /* 卡片标题/弹窗标题（对标 M3 titleLarge） */
  --font-h4: Medium 18px/26px var(--font-cn); /* 子标题 */
  --font-h5: Medium 16px/24px var(--font-cn); /* 小节标题（对标 M3 titleMedium 16/24） */
  --font-body1: Regular 14px/22px var(--font-cn); /* 正文/列表/表单（对标 M3 bodyMedium） */
  --font-body2: Regular 13px/20px var(--font-cn); /* 辅助说明/次要文本 */
  --font-caption: Regular 12px/16px var(--font-cn); /* 图表标注/表单提示（对标 M3 bodySmall 12/16） */
  --font-label: Medium 12px/16px var(--font-cn); /* 标签/按钮文字（对标 M3 labelMedium 12/16） */
  --font-overline: Medium 11px/16px var(--font-cn); /* 极小标注/overline（对标 M3 labelSmall 11/16） */
  --font-link: Regular 14px/22px var(--font-cn); /* 超链接文本 */
}
```

### 3.2 密度模式 Density（B 包新增；对标 Material compact/comfortable/spacious）

```css
:root {
  --density-compact-row-height: 36px; /* compact 行高（数据密集，opt-in） */
  --density-compact-padding: 12px; /* compact padding */
  --density-comfortable-row-height: 44px; /* comfortable 行高（默认基准） */
  --density-comfortable-padding: 16px; /* comfortable padding */
  --density-spacious-row-height: 52px; /* spacious 行高（聚焦/大间距） */
  --density-spacious-padding: 20px; /* spacious padding */
}
```

## 四、间距体系

```css
:root {
  --space-xs: 4px; /* 微间距：图标与文字、栅格步进 */
  --space-sm: 8px; /* 紧凑元素间隙 */
  --space-md: 12px; /* 组件内次级间距 */
  --space-base: 16px; /* 标准：卡片内边距、列表项、内容区左右边距 */
  --space-lg: 24px; /* 模块间、卡片外边距 */
  --space-xl: 32px; /* 区块分隔 */
  --space-xxl: 48px; /* 页面级分隔 */
  --page-padding-x: 24px; /* 页面左右 padding */
  --content-padding: 16px; /* 内容卡内边距 */
  --card-gap: 16px; /* 卡片间距 */
}
```

## 五、圆角体系

```css
:root {
  --radius-sm: 2px; /* 弹窗投影等细微圆角 */
  --radius-base: 4px; /* 输入框、标签、小型控件 */
  --radius-md: 8px; /* 卡片、按钮、下拉 */
  --radius-lg: 16px; /* 大卡片、形象区 */
  --radius-round: 999px; /* 状态点、头像、分页圆钮 */
}
```

## 六、投影体系（双层复合）

> 升级为双层复合阴影（柔光层 + 1px 发丝线），对标 Atlassian elevation.shadow + AntD boxShadow。旧名保留，引用方零改动。详见 TOKENS-EVIDENCE.md。

```css
:root {
  --shadow-card: 0 1px 2px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04);   --shadow-data-hover: 0 1px 2px rgba(0,0,0,0.15); /* 图表数据元素悬停阴影（NEW-3 修复 2026-08-07） */ /* 卡片（双层复合） */
  --shadow-modal: 0 6px 16px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04); /* 弹窗（双层复合） */
  --shadow-float: 0 4px 8px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04); /* 悬浮块 / 按钮（双层复合） */
  --shadow-row-hover: 0 1px 2px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03); /* 表格行悬停（双层复合） */
}
```

## 七、Elevation 层级体系（5 级）

> 国际对标：Atlassian 5 级（sunken/default/raised/overlay/overflow）surface+shadow 配对 + Material 3 层级递进 + Polaris 组件映射。暗色值属 C 包。详见 TOKENS-EVIDENCE.md。

```css
:root {
  --elev-sunken: #F5F7FB / none; /* 凹槽/分组容器底（看板列、筛选区）— 仅在 default 层使用 */
  --elev-default: #FFFFFF / none; /* 基线平面（页面、flat card 配 border） */
  --elev-raised: #FFFFFF / 0 1px 2px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04); /* 可移动卡片/强调卡片（Jira 卡、hover 提升）— resting 态 */
  --elev-overlay: #FFFFFF / 0 6px 16px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04); /* 浮层（modal/dialog/dropdown/popover/tooltip）— 交互态最高层 */
  --elev-overflow: #FFFFFF / 0 0 8px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04); /* 滚动溢出（表格横向滚动、长列表边界）— border 不够明显时用 */
}
```

## 八、Motion 动效体系

> 国际对标：Material 3 duration 档位 + Ant Design motion token（duration 0.1/0.2/0.3s + easing cubic-bezier 精确值）。详见 TOKENS-EVIDENCE.md。

### 8.1 Duration（4 档）

```css
:root {
  --motion-duration-instant: 120ms; /* 微交互（状态切换、ripple） */
  --motion-duration-fast: 240ms; /* 小型组件 enter/exit */
  --motion-duration-normal: 360ms; /* 标准转场 */
  --motion-duration-slow: 480ms; /* 全屏转场、复杂展开 */
}
```

### 8.2 Easing（cubic-bezier 曲线库）

```css
:root {
  --motion-ease-ease-in-out: cubic-bezier(0.645, 0.045, 0.355, 1); /* AntD 官方曲线 */
  --motion-ease-ease-out: cubic-bezier(0.215, 0.61, 0.355, 1); /* AntD 官方曲线 */
  --motion-ease-ease-out-quint: cubic-bezier(0.23, 1, 0.32, 1); /* AntD 官方曲线 */
  --motion-ease-ease-in-out-circ: cubic-bezier(0.78, 0.14, 0.15, 0.86); /* AntD 官方曲线 */
  --motion-ease-ease-out-circ: cubic-bezier(0.08, 0.82, 0.17, 1); /* AntD 官方曲线 */
}
```

## 九、组件级精确 Token

> 注：组件「尺寸/圆角/字重」的**唯一真源**是 `components.json`；本节为便于速查的 CSS 变量镜像，引用前请优先对齐 components.json。

### 7.1 按钮 Button

```css
:root {
  /* 尺寸（Ant Design 标准；单按钮以 32 为准） */
  --btn-large-height: 40px;
  --btn-default-height: 32px;
  --btn-small-height: 24px;
  --btn-padding-x: 16px;
  --btn-min-width: 64px;
  --btn-primary-bg: var(--primary);
  --btn-primary-fg: var(--n1);
  --btn-primary-hover-bg: var(--primary-hover);
  --btn-primary-active-bg: var(--primary-active);
  --btn-primary-disabled-bg: var(--primary-dis-bg);
  --btn-primary-disabled-fg: var(--primary-dis-fg);
  --btn-secondary-bg: var(--n1);
  --btn-secondary-border: var(--primary);
  --btn-secondary-fg: var(--primary);
  --btn-secondary-hover-border: var(--n7);
  --btn-text-fg: var(--primary);
  --btn-text-hover-fg: var(--primary-hover);
  --btn-radius: var(--radius-md);
}
```

### 7.2 输入 Input

```css
:root {
  --input-height: 32px;
  --input-padding-x: 12px;
  --input-bg: var(--n5);
  --input-border: var(--n6);
  --input-radius: var(--radius-base);
  --input-placeholder: var(--n8);
  --input-focus-border: var(--primary);
  --input-focus-ring: rgba(0, 94, 174, 0.20);
  --input-disabled-bg: var(--n4);
}
```

### 7.3 标签 Tag

```css
:root {
  --tag-height: 22px;
  --tag-padding-x: 10px;
  --tag-font: Regular 12px/20px var(--font-cn);
  --tag-radius: var(--radius-base);
  --tag-success-bg: var(--suc-soft);   --tag-success-fg: var(--suc);
  --tag-warning-bg: var(--warn-soft);  --tag-warning-fg: var(--warn);
  --tag-error-bg: var(--err-soft);     --tag-error-fg: var(--err);
  --tag-running-bg: var(--run-soft);   --tag-running-fg: var(--run);
  --tag-default-bg: var(--n3);       --tag-default-fg: var(--n9);
}
```

### 7.4 卡片 Card

```css
:root {
  --card-bg: var(--n1);
  --card-radius: var(--radius-md);
  --card-shadow: var(--shadow-card);
  --card-header-height: 40px;
  --card-header-padding-x: 16px;
  --card-header-title-font: Medium 14px/24px var(--font-cn);
  --card-header-title-color: var(--n11);
  --card-content-padding: 16px;
  --card-divider: var(--n6);
}
```

### 7.5 弹窗 Modal

```css
:root {
  --modal-width: 382px;
  --modal-header-height: 40px;
  --modal-header-padding-x: 16px;
  --modal-shadow: var(--shadow-modal);
  --modal-radius: var(--radius-md);
  --modal-bg: var(--n1);
}
```

### 7.6 表格 Table

```css
:root {
  --table-header-height: 44px;
  --table-row-height: 44px;
  --table-header-bg: var(--n2);
  --table-row-hover-bg: var(--n3);
  --table-border: var(--n6);
  --table-cell-padding-x: 16px;
  --table-checkbox-size: 16px;
}
```

### 7.7 导航与布局 Navigation & Layout

```css
:root {
  --topbar-height: 72px; /* 顶部导航高 */
  --topbar-bg: var(--primary); /* 顶栏底 */
  --topbar-fg: var(--n1); /* 顶栏字 */
  --sidebar-width: 240px; /* 侧边栏宽 */
  --sidebar-collapsed-width: 80px; /* 侧边栏折叠宽 */
  --sidebar-bg: var(--primary); /* 侧边栏底 */
  --sidebar-fg: var(--n1); /* 侧边栏字 */
  --footer-height: 32px; /* 底栏高 */
  --footer-bg: var(--primary); /* 底栏底 */
  --footer-fg: var(--n1); /* 底栏字 */
  --content-bg: #F5F7FB; /* 内容区底 N4 #F5F7FB */
  --content-padding: 16px; /* 内容区内边距 */
  --tab-height: 32px; /* 页签高 */
  --tab-gap: 4px; /* 页签间距 */
  --pagination-height: 44px; /* 分页器高 */
  --status-dot: 10px; /* 状态指示灯直径（约） */
  --grid-columns: 24; /* Ant Design 24 栅格 */
}
```

## 十、响应式断点（Ant Design 基准）

```css
:root {
  --bp-sm: 576px; /* 断点 sm */
  --bp-md: 768px; /* 断点 md */
  --bp-lg: 992px; /* 断点 lg */
  --bp-xl: 1200px; /* 断点 xl */
  --bp-xxl: 1600px; /* 断点 xxl */
}
```

