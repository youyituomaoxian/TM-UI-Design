# 弘讯移动端 — Design Tokens (CSS Variables)

> ⚠️ **本文件由 `scripts/generate-design-tokens-md.js` 自动生成，请勿手改。** 改 token 请编辑 `tokens.json`（值真源）或脚本内的命名映射后重跑。
> **命名规范**：全文使用「短名」CSS 变量（`--primary` / `--n1` / `--suc` / `--run` / `--radius-md` …），与 `components.json` referenceCss 及 `page-template.html :root` **1:1 对齐**。旧版 `--color-*` 全名已废弃。
> **平台**: 微信小程序 / Android / iOS 跨端
> **生成日期**: 2026-08-06

---

## 一、品牌信息

```css
:root {
  --brand-name: "弘讯科技 TECHMATION";
  --product: "注塑机工业控制移动端";
  --style: "极简轻工业风，跨平台通用";
  --viewport: 375px;        /* 设计基准宽度 */
  --grid-unit: 4px;         /* 最小原子网格 */
}
```

## 二、色彩体系

### 2.1 品牌色 Primary

```css
:root {
  --primary: #005EAE; /* 主色默认 — 按钮、导航栏填充 */
  --primary-hover: #1A75D2; /* 主色聚焦 — 输入框聚焦、Tab 激活 */
  --primary-active: #004ABF; /* 主色点击 — 按钮按压态 */
  --primary-dis-bg: #DAEAFA; /* 主色禁用背景 */
  --primary-dis-fg: #A0B4C0; /* 主色禁用文字 */
}
```

### 2.2 品牌渐变

```css
:root {
  --gradient-data-card: linear-gradient(180deg, #005EAE 0%, #003868 100%); /* 个人中心头部渐变背景 */
  --gradient-dark: linear-gradient(180deg, #005EAE 0%, #0F172A 100%); /* 深色场景渐变 */
  --gradient-highlight: linear-gradient(180deg, #005EAE 0%, #0606D4 100%); /* 高亮数据卡片 */
}
```

### 2.3 信息化图表 Chart Palette（13 色）

```css
:root {
  --chart-blue: #0061FF; /* 核心指标 */
  --chart-green: #10B981; /* 正向状态 */
  --chart-orange: #F59E0B; /* 中性状态 */
  --chart-red: #EF4444; /* 负向状态 */
  --chart-blue-aux: #1D4ED8; /* 辅助线 */
  --chart-green-growth: #059669; /* 增长数据 */
  --chart-yellow: #D97706; /* 警示数据 */
  --chart-red-neg: #DC2626; /* 负面数据 */
  --chart-purple-a: #A78BFA; /* 多维对比 A */
  --chart-purple-b: #8B5CF6; /* 深度分析 B */
  --chart-cyan: #06B6D4; /* 基准参考线 */
  --chart-rose: #EC4899; /* 紧急标注 */
  --chart-gray: #64748B; /* 未分类数据 */
}
```

### 2.4 功能色 Functional（成功 / 警告 / 错误 / 运行）

> ⚠️ **跨端命名差异（已知，待后续统一）**：移动端 `--suc` / `--warn` / `--err` / `--run` 代表**背景色**（filled 态）；Web 端 `--suc` 等代表**前景/文字色**（`--suc-bg` 才是背景）。本脚本遵循移动端自身约定（与 `page-template.html` 一致）。跨端复用组件时请勿混用两端 `--suc` 语义。

```css
:root {
  --suc: #10B981; /* 成功背景 #10B981（移动端合法，≠Web #389E0D） */
  --suc-pressed: #0D9E6F; /* 成功背景按压 */
  --suc-dis: #A6D4C5; /* 成功背景禁用 */
  --suc-text: #F0FFFA; /* 成功文字（浅色） */
  --warn: #F59E0B; /* 警示背景 */
  --warn-pressed: #DB8E09; /* 警示背景按压 */
  --warn-dis: #F5D9A6; /* 警示背景禁用 */
  --warn-text: #FEF2E8; /* 警示文字 */
  --err: #EF4444; /* 错误背景 */
  --err-pressed: #D63B3B; /* 错误背景按压 */
  --err-dis: #F5A6A6; /* 错误背景禁用 */
  --err-text: #FEDED8; /* 错误文字 */
  --link: #1A75D2; /* 链接（同主色聚焦） */
  --run: #16A34A; /* 运行/在线绿 #16A34A（跨端共用，≠成功绿） */
  --run-hover: #22C55E; /* 运行绿 hover */
  --run-pressed: #15803D; /* 运行绿 pressed/active */
  --run-bg: #ECFDF5; /* 运行绿底 */
  --run-bg-hover: #D1FAE5; /* 运行绿底 hover */
  --run-border: #BBF7D0; /* 运行绿边 */
  --run-border-hover: #86EFAC; /* 运行绿边 hover */
}
```

### 2.5 中性色 Neutral（N1–N10）

```css
:root {
  --n1: #FFFFFF; /* N1 — 卡片底色 */
  --n2: #F5F7FB; /* N2 — 页面背景、表头底色 */
  --n3: #E9ECF0; /* N3 — 输入框、次按钮按压 */
  --n4: #DEE2E5; /* N4 — 分割线、组件边框、表格内线 */
  --n5: #CED4E4; /* N5 — 未激活图标边框 */
  --n6: #ADB5BF; /* N6 — 禁用状态文字 */
  --n7: #6C757D; /* N7 — 辅助说明、表单提示 */
  --n8: #334155; /* N8 — 正文文字 */
  --n9: #343A46; /* N9 — 副标题 */
  --n10: #21253C; /* N10 — 主标题、关键数据 */
}
```

## 三、字体体系

```css
:root {
  --font-mono: 'JetBrains Mono', 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace; /* 等宽（B 包新增；工控数据/代码） */
}
```

### 3.0 密度模式（B 包新增；移动端只 comfortable 基准）

```css
:root {
  --density-comfortable-row-height: 52px; /* comfortable 行高（移动端基准，单行列表56） */
  --density-comfortable-padding: 16px; /* comfortable padding */
}
```

### 3.1 安卓字体

```css
:root {
  --font-android-cn: "Noto Sans SC", sans-serif; /* 安卓中文 */
  --font-android-en: "Roboto", sans-serif; /* 安卓英文 / 数字 */
}
```

### 3.2 iOS 字体

```css
:root {
  --font-ios-cn: "PingFang SC", sans-serif; /* iOS 中文 */
  --font-ios-en: "SF Pro Display (20+) / SF Pro Text (20-)", sans-serif; /* iOS 英文 / 数字 */
}
```

### 3.3 字体层级 Token（iOS 基准）

:root {
  /* 语义字体 Token — 适用范围：iOS */
  --font-display:      Bold   38px/49px "PingFang SC"; /* 全屏模态标题 */
  --font-h1:           Bold   26px/34px "PingFang SC"; /* 页面主标题 */
  --font-h2:           Medium 22px/31px "PingFang SC"; /* 弹窗/分区标题 */
  --font-h3:           Medium 18px/27px "PingFang SC"; /* 卡片标题 */

  /* 正文 */
  --font-body-emphasis: Medium 17px/27px "PingFang SC"; /* 强调正文 */
  --font-body:          Regular 17px/27px "PingFang SC"; /* 标准正文 */
  --font-body-aux:      Regular 15px/23px "PingFang SC"; /* 辅助正文 */

  /* 辅助 */
  --font-helper:        Medium  13px/20px "PingFang SC"; /* 表单提示 */
  --font-caption:       Regular 11px/15px "PingFang SC"; /* 版权/时间 */
}

/* 跨平台通用族（组件默认引用） */
:root {
  --font-cn: "Noto Sans SC", "PingFang SC", sans-serif;
}
### 3.4 组件级字体 Token（跨平台共用）

:root {
  --font-nav-title:     Medium 17px/22px "PingFang SC"; /* 导航栏标题 */
  --font-card-title:    Medium 16px/24px "Noto Sans SC"; /* 卡片/分区标题 */
  --font-tab:           Medium 14px/20px "PingFang SC"; /* Tab 导航文字 */

  --font-data-large:    Medium 20px/26px "Noto Sans SC"; /* 数据重点数值 */
  --font-data-medium:   Medium 16px/24px "Noto Sans SC"; /* 数据中等数值 */

  /* 按钮 */
  --font-btn-large:     Medium 16px/24px "PingFang SC";
  --font-btn-medium:    Medium 14px/21px "PingFang SC";
  --font-btn-small:     Regular 12px/16px "PingFang SC";

  /* 标签 */
  --font-tag-large:     Medium 14px/28px "PingFang SC";
  --font-tag-medium:    Medium 12px/23px "PingFang SC";
  --font-tag-small:     Medium 11px/20px "PingFang SC";
}
### 3.5 安卓字体映射（覆盖语义 Token）

.android {
  /* 字体家族替换 */
  --font-display:       Medium 36px/40px "Noto Sans SC";
  --font-h1:            Medium 28px/36px "Noto Sans SC";
  --font-h2:            Medium 24px/32px "Noto Sans SC";
  --font-h3:            Medium 20px/28px "Noto Sans SC";
  --font-body-emphasis:  Medium 16px/24px "Noto Sans SC";
  --font-body:          Regular 16px/24px "Noto Sans SC";
  --font-body-aux:      Regular 14px/21px "Noto Sans SC";
  --font-helper:        Regular 12px/18px "Noto Sans SC";
  --font-caption:       Regular 10px/12px "Noto Sans SC";

  --font-nav-title:     Medium 17px/22px "Noto Sans SC";
  --font-card-title:    Medium 16px/24px "Noto Sans SC";
  --font-tab:           Medium 14px/20px "Noto Sans SC";
  --font-data-large:    Medium 20px/26px "Noto Sans SC";
  --font-data-medium:   Medium 16px/24px "Noto Sans SC";
}
## 四、间距体系

```css
:root {
  --space-min: 4px; /* 微间距，图标文字基准间距 */
  --space-xs: 8px; /* 最小单元间距，栅格步进 */
  --space-sm: 16px; /* 组件内边距、列表项、内容区左右边距 */
  --space-md: 24px; /* 模块间间距、卡片外边距 */
  --space-lg: 40px; /* 区块分割（如卡片间距） */
  --space-xl: 48px; /* 页面级分隔 */
  --space-xxl: 56px; /* 主要区块间距 */
  --grid-gutter-android: 8px; /* 安卓栅格间距 */
  --grid-gutter-ios: 16px; /* iOS 栅格间距 */
}
```

## 五、圆角体系

```css
:root {
  --radius-sm: 4px; /* Tag、Input、小型控件 */
  --radius-md: 8px; /* Card、Button (Android 默认) */
  --radius-lg: 16px; /* Modal、FAB、搜索框 */
  --radius-full: 999px; /* Avatar、FAB Button */
  --radius-btn-ios: 6px; /* 按钮 iOS 半径 */
  --radius-btn-android: 8px; /* 按钮 Android 半径 */
  --radius-card-ios: 10px; /* 卡片 iOS 半径 */
  --radius-card-android: 8px; /* 卡片 Android 半径 */
}
```

## 六、投影体系（双层复合）

> 升级为双层复合阴影（柔光层 + 1px 品牌色调发丝线），对标 Atlassian elevation.shadow + AntD boxShadow。s/m 保留品牌色调 rgba(0,94,174,*)，l 黑柔光+品牌发丝线。旧名保留，引用方零改动。详见 TOKENS-EVIDENCE.md。

```css
:root {
  --shadow-s: 0 1px 2px rgba(0,94,174,0.06), 0 0 0 1px rgba(0,94,174,0.05); /* 按钮、标签（双层复合） */
  --shadow-m: 0 2px 8px rgba(0,94,174,0.10), 0 0 0 1px rgba(0,94,174,0.08); /* 卡片、输入框（双层复合） */
  --shadow-l: 0 8px 24px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,94,174,0.10); /* 弹窗、悬浮层（双层复合） */
  --shadow-bottom-nav: 0 -4px 4px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,94,174,0.08); /* 底部导航投影（双层复合） */
  --shadow-data-hover: 0 1px 2px rgba(0,0,0,0.15); /* 图表数据元素悬停/点按（单阴影格式，card/row-hover 级轻弥散，禁 float/modal 级；CHART-SPEC §5） */
}
```

## 七、Elevation 层级体系（5 级）

> 国际对标：Atlassian 5 级（sunken/default/raised/overlay/overflow）surface+shadow 配对 + Material 3 层级递进 + Polaris 组件映射。移动端 shadow 发丝线保留品牌色调。暗色值属 C 包。详见 TOKENS-EVIDENCE.md。

```css
:root {
  --elev-sunken: #F5F7FB / none; /* 凹槽/分组容器底（看板列、筛选区）— 仅在 default 层使用 */
  --elev-default: #FFFFFF / none; /* 基线平面（页面、flat card 配 border） */
  --elev-raised: #FFFFFF / 0 1px 2px rgba(0,94,174,0.10), 0 0 0 1px rgba(0,94,174,0.08); /* 可移动卡片/强调卡片（Jira 卡、hover 提升）— resting 态 */
  --elev-overlay: #FFFFFF / 0 6px 16px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,94,174,0.10); /* 浮层（modal/dialog/dropdown/popover/tooltip）— 交互态最高层 */
  --elev-overflow: #FFFFFF / 0 0 8px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,94,174,0.08); /* 滚动溢出（表格横向滚动、长列表边界）— border 不够明显时用 */
}
```

## 八、Motion 动效体系

> 国际对标：Material 3 duration 档位 + Ant Design motion token。两端同名同构同值。详见 TOKENS-EVIDENCE.md。

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

:root {
  /* 登录按钮 */
  --btn-login-height:  56px;
  --btn-login-min-w:   300px;
  --btn-login-font:    var(--font-btn-large);
  --btn-login-padding: auto center;

  /* 大按钮 */
  --btn-large-height:  48px;  /* ⚠️ 实测值，非之前记录的 44px */
  --btn-large-min-w:   120px;
  --btn-large-font:    var(--font-btn-large);
  --btn-large-pad-x:   16px;

  /* 中按钮 */
  --btn-medium-height: 40px;
  --btn-medium-min-w:  80px;
  --btn-medium-font:   var(--font-btn-medium);
  --btn-medium-pad-x:  16px;

  /* 小按钮 */
  --btn-small-height:  32px;
  --btn-small-min-w:   64px;
  --btn-small-font:    var(--font-btn-small);
  --btn-small-pad-x:   16px;

  /* 通用按钮 Token */
  --btn-primary-bg:      var(--primary);
  --btn-primary-fg:      var(--n1);
  --btn-primary-bg-down: var(--primary-active);
  --btn-primary-bg-disabled: var(--primary-dis-bg);
  --btn-primary-fg-disabled: var(--primary-dis-fg);
  --btn-secondary-bg:    var(--n1);
  --btn-secondary-border: var(--primary);
  --btn-secondary-fg:    var(--primary);
  --btn-border-radius: var(--radius-btn-ios); /* 通过平台变量间接引用 */
}
### 7.2 标签 Tag

:root {
  /* 大标签 */
  --tag-large-height:   28px;
  --tag-large-min-w:    96px;
  --tag-large-font:     var(--font-tag-large);
  --tag-large-pad-x:    12px;
  --tag-large-icon:     12px × 12px;
  --tag-large-gap:      4px;

  /* 中标签 */
  --tag-medium-height:  24px;
  --tag-medium-min-w:   86px;
  --tag-medium-font:    var(--font-tag-medium);
  --tag-medium-pad-x:   12px;
  --tag-medium-dot:     10px × 10px;
  --tag-medium-gap:     4px;

  /* 小标签 */
  --tag-small-height:   20px;
  --tag-small-min-w:    72px;
  --tag-small-font:     var(--font-tag-small);
  --tag-small-pad-x:    8px;
  --tag-small-dot:      8px × 8px;
  --tag-small-gap:      4px;

  /* 标签样式 Token */
  --tag-linear-bg:    var(--n1);
  --tag-linear-border: var(--primary);
  --tag-linear-fg:    var(--primary);
  --tag-filled-bg:    var(--primary);
  --tag-filled-fg:    var(--n1);
}
### 7.3 列表 List Items

:root {
  /* 单行标题列表 */
  --list-single-height:   56px;
  --list-single-pad-x:    16px;
  --list-single-pad-y:    16px;
  --list-single-icon:     24px × 24px;
  --list-single-icon-gap: 8px;
  --list-single-title-font: Medium 16px/24px "PingFang SC";
  --list-single-title-color: var(--n8);
  --list-single-right-font:  Regular 12px/16px "PingFang SC";

  /* 双行列表 */
  --list-double-height:   116px;
  --list-double-pad-x:    16px;
  --list-double-pad-y:    16px;
  --list-double-thumb:    52px × 52px;
  --list-double-thumb-gap: 16px;
  --list-double-title-font:  Medium 16px/24px "PingFang SC";
  --list-double-subtitle-font: Regular 14px/21px "PingFang SC";
  --list-double-footer-font:   Regular 12px/16px "PingFang SC";

  /* 三行列表 */
  --list-triple-height:   101px;
  --list-triple-pad-x:    16px;
  --list-triple-pad-y:    16px;
  --list-triple-slot-w:   89.7px;
  --list-triple-slot-h:   69px;
  --list-triple-gap:      10px;

  /* 通用 */
  --list-divider-color: var(--n4);
  --list-bg:            var(--n1);
}
### 7.4 卡片 Card

:root {
  /* 卡片 B */
  --card-b-height:        120px;
  --card-b-header-height: 40px;
  --card-b-header-pad-x:  16px;
  --card-b-title-font:    Medium 16px/22px "Noto Sans SC";
  --card-b-title-color:   var(--n9);

  /* 卡片 C */
  --card-c-height:        101px;
  --card-c-pad-x:         16px;
  --card-c-pad-y:         8px;
  --card-c-title-font:    Medium 16px/24px "Noto Sans SC";
  --card-c-body-font:     Regular 16px/24px "Roboto";
  --card-c-footer-font:   Regular 12px/20px "Noto Sans SC";
  --card-c-footer-icon:   12px × 12px;

  /* 通用 */
  --card-bg:            var(--n1);
  --card-shadow:        var(--shadow-m);
  --card-radius:        var(--radius-md);
  --card-divider-color: var(--n4);
}
### 7.5 搜索 Search Bar

:root {
  --search-height:      36px;
  --search-width:       343px;
  --search-inner-w:     315px;
  --search-radius:      16px; /* ⚠️ 实测 16px，pill 形 */
  --search-bg:          var(--n1);
  --search-icon:        24px × 24px;
  --search-icon-gap:    9px;
  --search-icon-x:      8px;
  --search-placeholder: Regular 14px/21px "Noto Sans SC";
  --search-placeholder-color: var(--n5);
  --search-mic-icon:    24px × 24px;
}
### 7.6 弹窗 Dialog / Modal

:root {
  /* 单选弹窗 */
  --modal-select-width:  375px;
  --modal-select-height: 296px;
  --modal-title-height:  46px;
  --modal-title-font:    Medium 17px/22px "PingFang SC";
  --modal-title-color:   var(--n9);
  --modal-item-height:   56px;
  --modal-divider-color: var(--n4);
  --modal-btn-gap:       16px;
  --modal-pad-x:         16px;

  /* 多项输入弹窗 */
  --modal-input-height: 408px; /* 5个输入行 */

  /* 长文本弹窗 */
  --modal-text-height:  285px;
  --modal-body-font:    Regular 14px/21px "PingFang SC";
  --modal-body-color:   var(--n8);

  /* 通用 */
  --modal-bg:       var(--n1);
  --modal-shadow:   var(--shadow-l);
  --modal-radius:   var(--radius-lg);
  --ios-safe-bottom: 34px;
}
### 7.7 导航 Navigation

:root {
  /* 顶部导航 (iOS) */
  --navbar-ios-height:   88px;  /* status 44 + nav 44 */
  --navbar-ios-status:   44px;
  --navbar-ios-nav:      44px;
  --navbar-bg:           var(--primary);
  --navbar-icon:         24px × 24px;
  --navbar-title-font:   var(--font-nav-title);
  --navbar-title-color:  var(--n1);

  /* 顶部导航 (Android) */
  --navbar-android-height: 80px; /* status 24 + nav 56 */
  --navbar-android-status: 24px;
  --navbar-android-nav:    56px;
}

:root {
  /* 底部导航 */
  --bottomnav-ios-height:     83px; /* 49 + 34 safe */
  --bottomnav-ios-nav:        49px;
  --bottomnav-android-height: 56px;
  --bottomnav-bg:             var(--n1);
  --bottomnav-shadow:         var(--shadow-bottom-nav);
  --bottomnav-icon:           24px × 24px;
  --bottomnav-icon-ios:       25px × 25px;
  --bottomnav-label-font:     Regular 12px/16px "PingFang SC";

  --ios-safe-area-bottom:     34px;
}
## 十、平台差异化 Token 汇总

/* iOS 覆盖 */
.ios {
  --platform-font-cn:    var(--font-ios-cn);
  --platform-font-en:    var(--font-ios-en);
  --platform-btn-radius: var(--radius-btn-ios);
  --platform-card-radius: var(--radius-card-ios);
  --platform-gutter:     16px;
  --platform-safe-top:   44px;
  --platform-safe-bottom: 34px;
  --platform-nav-height: 44px;
  --platform-status-height: 44px;
  --platform-list-height: 44pt;
  --platform-list-arrow: ">";

  /* 组件级字体覆盖（iOS → PingFang SC / SF Pro）*/
  --font-card-title:  Medium 16px/24px "PingFang SC";
  --font-data-large:  Medium 20px/26px "PingFang SC";
  --font-data-medium: Medium 16px/24px "PingFang SC";

  --btn-border-radius: var(--radius-btn-ios);
  --card-radius:       var(--radius-card-ios);
  --card-b-title-font: Medium 16px/22px "PingFang SC";
  --card-c-title-font: Medium 16px/24px "PingFang SC";
  --card-c-body-font:  Regular 16px/24px "SF Pro Text";
  --card-c-footer-font: Regular 12px/20px "PingFang SC";

  --search-placeholder-font: Regular 14px/21px "PingFang SC";
}

/* Android 覆盖 */
.android {
  --platform-font-cn:    var(--font-android-cn);
  --platform-font-en:    var(--font-android-en);
  --platform-btn-radius: var(--radius-btn-android);
  --platform-card-radius: var(--radius-card-android);
  --platform-gutter:     8px;
  --platform-safe-top:   24px;
  --platform-safe-bottom: 0px;
  --platform-nav-height: 56px;
  --platform-status-height: 24px;
  --platform-list-height: 56dp;
  --platform-list-arrow: "→";
  --platform-fab-size:   56px;

  /* 组件级覆盖（Android → Noto Sans SC / Roboto）*/
  --font-card-title:  Medium 16px/24px "Noto Sans SC";
  --font-data-large:  Medium 20px/26px "Noto Sans SC";
  --font-data-medium: Medium 16px/24px "Noto Sans SC";

  --btn-border-radius: var(--radius-btn-android);
  --card-radius:       var(--radius-card-android);
  --card-b-title-font: Medium 16px/22px "Noto Sans SC";
  --card-c-title-font: Medium 16px/24px "Noto Sans SC";
  --card-c-body-font:  Regular 16px/24px "Roboto";
  --card-c-footer-font: Regular 12px/20px "Noto Sans SC";

  --search-placeholder-font: Regular 14px/21px "Noto Sans SC";
}
## 十一、Figma 原始变量索引

| Variable ID | Token 名称 | 类型 | 值 |
|-------------|-----------|------|-----|
| `12:6` | Color/主色/主色默认 | COLOR | #005EAE |
| `12:8` | Color/主色/主色点击 | COLOR | #004ABF |
| `12:12` | Color/主色/主色聚焦 | COLOR | #1A75D2 |
| `12:13` | Color/主色/主色禁用填充 | COLOR | #DAEAFA |
| `12:14` | Color/主色/主色禁用文字 | COLOR | #A0B4C0 |
| `13:28` | Color/中性色/N1 纯白色 | COLOR | #FFFFFF |
| `13:29` | Color/中性色/N2 背景色 | COLOR | #F5F7FB |
| `13:30` | Color/中性色/N3 | COLOR | #E9ECF0 |
| `13:31` | Color/中性色/N4 分割线 | COLOR | #DEE2E5 |
| `13:32` | Color/中性色/N5 按钮边框 | COLOR | #CED4E4 |
| `13:33` | Color/中性色/N6 禁用文字 | COLOR | #ADB5BF |
| `13:34` | Color/中性色/N7 辅助说明 | COLOR | #6C757D |
| `13:35` | Color/中性色/N8 正文 | COLOR | #334155 |
| `13:36` | Color/中性色/N9 副标题 | COLOR | #343A46 |
| `13:37` | Color/中性色/N10 主标题 | COLOR | #21253C |
| `13:38` | 间距/基础间距/最小间距 | FLOAT | 4 |
| `13:39` | 间距/基础间距/小间距 | FLOAT | 8 |
| `13:41` | 间距/基础间距/中间距 | FLOAT | 16 |
| `13:42` | 间距/基础间距/大间距 | FLOAT | 24 |
| `13:43` | 间距/大间距/小 | FLOAT | 40 |
| `13:44` | 间距/大间距/中 | FLOAT | 48 |
| `13:45` | 间距/大间距/大 | FLOAT | 56 |
