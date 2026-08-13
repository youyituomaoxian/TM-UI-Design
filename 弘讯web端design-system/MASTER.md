# 弘讯B端视觉系统

> **来源**: 弘讯 B端设计稿 V3.0（Ardot 提取 + 2026-07-30 B包/A包 + 2026-08-02 动效 M1-M5 更新）
> **平台**: Web / B端 / 后台管理系统（Ant Design 风格）
> **变量集**: 颜色规范（单模式：默认）
> **生成日期**: 2026-08-03
> **整理**: Ardot Design MCP + 人工审核

---

## 品牌信息

| 属性 | 值 |
|------|-----|
| 产品 | 弘讯科技 — 注塑机工业控制 B端后台管理系统 |
| 风格 | Ant Design 风格 · 极简工业风 |
| 主色 | `#005EAE`（深海蓝，与移动端一致） |
| 辅助色 | `#0A84FF`（科技蓝，web 端特有强调色） |
| 字体 · 中文 | Source Han Sans CN（思源黑体） |
| 字体 · 英文/数字 | Roboto |
| 设计基准 | 1440px 视口宽度 / 4px 最小网格 / 24 栅格 |
| 功能色语义 | 对齐 Ant Design（成功 `#389E0D` / 警告 `#FA8C16` / 错误 `#F5222D`） |

---

## 1. Color Tokens

> **配色引擎**：若需在智能体中根据任意品牌色 / 暗色模式生成「应用页」配色，见仓库根 `brand-color-engine/`（读 `engine.md` → 调 `generate.js` 的 `generatePalette(brand,{mode,platform})`）。默认 `#005EAE` 直接返回本规范原值；**功能色固定语义、不随品牌推导**。

### 1.1 品牌色 Primary

| Token 名称 | HEX | 用途 |
|-----------|-----|------|
| 主色默认 | `#005EAE` | 按钮、顶栏、侧边栏、品牌强调 |
| 主色悬停 | `#1A75D2` | 按钮 hover、链接、输入框聚焦 |
| 主色点击 | `#004A8F` | 按钮 active/pressed |
| 主色禁用填充 | `#DAEAFA` | 禁用按钮背景 |
| 主色禁用文字 | `#A0B4C0` | 禁用按钮文字 |

### 1.2 辅助色 Secondary

| Token 名称 | HEX | 用途 |
|-----------|-----|------|
| 辅助色默认 | `#0A84FF` | 次级强调、图表高亮、操作辅助 |
| 辅助色悬浮 | `#3DA0FF` | hover 态 |
| 辅助色点击 | `#0066CC` | active 态 |
| 辅助色禁用填充 | `#0A84FF` | 注：源变量与默认同值，实际建议降透明度 |
| 辅助色禁用文字 | `#FFFFFF` | 禁用态文字 |

### 1.3 链接 Link

| Token 名称 | HEX | 用途 |
|-----------|-----|------|
| 链接默认 | `#1A75D2` | 文本链接（同主色悬停） |

### 1.4 中性色 Neutral（N1–N11）

| Token | HEX | 语义用途 |
|-------|-----|---------|
| N1 卡片底色 | `#FFFFFF` | 卡片、次按钮填充、弹窗底 |
| N2 表头 | `#FAFAFA` | 表格表头底色 |
| N3 行悬停 | `#F6F9FC` | 表格行 / 列表项悬停 |
| N4 背景 | `#F5F7FB` | 页面背景、禁用填充、悬停底色 |
| N5 输入框底色 | `#EAEAED` | 输入框、行悬停、按钮选中填充 |
| N6 分割线 | `#DEE2E6` | 分割线、组件边框、按钮禁用边框 |
| N7 次按钮边框 | `#CED4DA` | 次按钮边框、未激活图标、表单提示 |
| N8 禁用文字 | `#ADB5BD` | 禁用文字、次按钮悬停边框、辅助说明 |
| N9 三级文字 | `#6C757D` | 辅助说明、选中边框、三级文字 |
| N10 正文 | `#334155` | 二级文字、正文、按钮默认悬停、选中文字 |
| N11 主标题 | `#212532` | 一级文字、主标题、关键数据 |

### 1.5 信息化图表 Chart Palette（8 色）

| Token 名称 | HEX | 用途语义 |
|-----------|-----|---------|
| 科技蓝 | `#0066CC` | 核心指标、同比数据 |
| 智能青 | `#00A3E0` | 趋势线、辅助数据 |
| 数据青 | `#00C7BE` | 对比维度 |
| 清新绿 | `#00D4A1` | 正向状态、增长 |
| 活力橙 | `#FF9500` | 中性状态、预警 |
| 醒目红 | `#FF4D4D` | 负向状态、告警 |
| 智慧紫 | `#8A5CF5` | 多维分析、深度维度 |
| 现代粉 | `#FF66C2` | 关键标注、突发事件 |

### 1.6 功能色 Functional

**成功 Success**

| Token | HEX | 用途 |
|-------|-----|------|
| 成功文字 | `#389E0D` | 成功文字、状态标签文字 |
| 成功文字悬停 | `#52C41A` | hover |
| 成功文字点击 | `#237804` | active |
| 成功文字禁用 | `#B7EB8F` | 禁用 |
| 成功背景 | `#F6FFED` | Tag / Badge 背景 |
| 成功背景悬停 | `#D9F7BE` | hover |
| 成功边框 | `#B7EB8F` | 边框 |
| 成功边框悬停 | `#95DE64` | hover |
| 成功边框点击 | `#73D13D` | active |

**警告 Warning**

| Token | HEX | 用途 |
|-------|-----|------|
| 警告文字 | `#FA8C16` | 警告文字、状态标签 |
| 警告文字悬停 | `#FFA940` | hover |
| 警告文字点击 | `#D46B08` | active |
| 警告文字禁用 | `#FFD591` | 禁用 |
| 警告背景 | `#FFF7E6` | Tag / Badge 背景 |
| 警告背景悬停 | `#FFE7BA` | hover |
| 警告边框 | `#FFD591` | 边框 |
| 警告边框悬停 | `#FFC069` | hover |
| 警告边框点击 | `#FF9C2A` | active |

**错误 Error**

| Token | HEX | 用途 |
|-------|-----|------|
| 错误文字 | `#F5222D` | 错误文字、状态标签 |
| 错误文字悬停 | `#FF4D4F` | hover |
| 错误文字点击 | `#CF1322` | active |
| 错误文字禁用 | `#FFC8C5` | 禁用 |
| 错误背景 | `#FFF1F0` | Tag / Badge 背景 |
| 错误背景悬停 | `#FFCCC7` | hover |
| 错误边框 | `#FFA39E` | 边框 |
| 错误边框悬停 | `#FF7875` | hover |
| 错误边框点击 | `#FF4D4F` | active |

**运行/在线 Running**

| Token | HEX | 用途 |
|-------|-----|------|
| 运行文字 | `#16A34A` | 设备运行/在线状态、状态指示灯、状态点（独立于成功绿） |
| 运行文字悬停 | `#22C55E` | hover |
| 运行背景 | `#ECFDF5` | 运行态 Tag / Badge 背景 |
| 运行背景悬停 | `#D1FAE5` | hover |
| 运行边框 | `#BBF7D0` | 边框 |
| 运行边框悬停 | `#86EFAC` | hover |
| 运行文字点击 | `#15803D` | active |

> ⚠️ 功能色**严格对齐 Ant Design**（成功 `#389E0D` / 警告 `#FA8C16` / 错误 `#F5222D`），与移动端成功绿 `#10B981` 不同，B端/Web 一律用本表数值。「运行/在线」为工业语境新增专用绿 `#16A34A`（与移动端运行中对齐），**不可与成功绿混用**，状态指示灯「在线/生产」绑定此色。

---

## 2. Typography（B 包字阶硬切换 13 级；对标 M3 15 级 + AntD heading）

> **B 包 breaking（2026-07-30）**：字阶从旧 7 级硬切换到 13 级（H1 达 32px 国际标准，对标 M3 headlineLarge）。旧 7 级不留 alias，全链路改（tokens.font.scale + components.json contract type.* + page-template .t-* + DESIGN-TOKENS.md）。行高对齐 4px 网格（对标 Polaris）。

| 层级 | class | 字号 / 行高 | 字重 | 应用场景 |
|------|-------|------------|------|---------|
| Display | `.t-display` | 32px / 40px | Medium 500 | 页面主标题（最高级，对标 M3 headlineLarge） |
| H1 | `.t-h1` | 28px / 36px | Medium 500 | 模块标题（对标 M3 headlineMedium） |
| H2 | `.t-h2` | 24px / 32px | Medium 500 | 区块标题（对标 M3 headlineSmall） |
| H3 | `.t-h3` | 20px / 28px | Medium 500 | 卡片标题/弹窗标题（对标 M3 titleLarge） |
| H4 | `.t-h4` | 18px / 26px | Medium 500 | 子标题 |
| H5 | `.t-h5` | 16px / 24px | Medium 500 | 小节标题（对标 M3 titleMedium） |
| Body1 | `.t-body1` | 14px / 22px | Regular 400 | 正文/列表/表单（对标 M3 bodyMedium） |
| Body2 | `.t-body2` | 13px / 20px | Regular 400 | 辅助说明/次要文本 |
| Caption | `.t-caption` | 12px / 16px | Regular 400 | 图表标注/表单提示（对标 M3 bodySmall） |
| Label | `.t-label` | 12px / 16px | Medium 500 | 标签/按钮文字（对标 M3 labelMedium） |
| Overline | `.t-overline` | 11px / 16px | Medium 500 | 极小标注（对标 M3 labelSmall） |
| Link | `.t-link` | 14px / 22px | Regular 400 | 超链接（`#1A75D2`） |
| Mono | `.t-mono` | — | — | 等宽（工控数据/代码，`--font-mono`） |

> 字体家族：中文 `Source Han Sans CN`（思源黑体），英文/数字 `Roboto`，等宽 `JetBrains Mono`（B 包新增，对标 AntD fontFamilyCode + Polaris mono）。
> 后台 UI 字号整体小于移动端（web 信息密度更高），正文基准 14px。行高对齐 4px 网格。
> **等宽使用**：`.t-mono` 用于代码、设备参数、数值数据；数值对齐优先 `font-variant-numeric: tabular-nums`（Polaris 建议，勿用 mono 对齐数字）。

### 2.1 密度模式 Density（B 包新增；对标 Material compact/comfortable/spacious）

| 档位 | 行高 | padding | 适用 |
|------|------|---------|------|
| compact | 36px | 12px | 数据密集（表格/长表单），opt-in 非默认 |
| comfortable | 44px | 16px | 默认基准（对标 Material default） |
| spacious | 52px | 20px | 聚焦/大间距 |

> 切换：`:root[data-density="compact|comfortable|spacious"]` 改 `--density-row-height` / `--density-content-padding`。compact 遵循 4px interval（对标 Material），保留 48px 最小触达目标。

---

## 3. Spacing

### 3.1 基础网格

- **最小原子单位**: `4px`
- **标准梯度**: `4 / 8 / 12 / 16 / 24 / 32 / 48`
- **页面左右 padding**: `24px`；**内容卡内边距**: `16px`；**卡片间距**: `16px`
- **跨模块间距（2026-08-04 补强，详见 RULES §4.3）**: `.stat-grid`（KPI 区）→ `.grid12`（图表区）**24px**（`--space-lg`）；兄弟 `.grid12` 之间 **16px**（`.grid12{margin-bottom:16px}`）；`page-head` → `.stat-grid` 16px。模板已兜底，页面禁覆盖容器 margin。

### 3.2 间距 Token

| 类别 | 值 (px) | 语义用途 |
|------|-----------|---------|
| XS | 4 | 图标与文字微间距、栅格步进 |
| SM | 8 | 紧凑元素间隙 |
| MD | 12 | 组件内次级间距 |
| BASE | 16 | 卡片内边距、列表项、内容区边距 |
| LG | 24 | 模块间间距、卡片外边距 |
| XL | 32 | 区块分割 |
| XXL | 48 | 页面级分隔 |

---

## 4. Radius

| 名称 | 值 | 适用场景 |
|------|----|---------|
| 小圆角 | `2px` | 弹窗投影等细微圆角 |
| 基础圆角 | `4px` | 输入框、标签、小型控件 |
| 中圆角 | `8px` | 卡片、按钮、下拉 |
| 大圆角 | `16px` | 大卡片、形象区 |
| 全圆角 | `999px` | 状态点、头像、分页圆钮 |

---

## 5. Shadow（双层复合）

> **A 包升级（2026-07-30）**：shadow 由单层升级为**双层复合**（柔光层 + 1px 发丝线），对标 Atlassian elevation.shadow + AntD boxShadow。旧名保留，引用方零改动。值真源 `tokens.json` 的 `shadow` 节；引证见 `TOKENS-EVIDENCE.md`。

| 级别 | 参数（双层复合） | 适用对象 |
|------|------|---------|
| Shadow-Card | `0 1px 2px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)` | 卡片 |
| Shadow-Modal | `0 6px 16px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)` | 弹窗 |
| Shadow-Float | `0 4px 8px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)` | 悬浮块、按钮 |
| Shadow-RowHover | `0 1px 2px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)` | 表格行悬停 |

## 5.1 Elevation 层级体系（5 级，A 包新增）

> 国际对标：Atlassian 5 级（sunken/default/raised/overlay/overflow）surface+shadow 配对 + Material 3 层级递进 + Polaris 组件映射。每级 = surface 色 + shadow 配对；raised/overlay 必须配对使用。暗色值属 C 包。

| 级别 | surface | shadow | 适用场景 |
|------|---------|--------|---------|
| **sunken** | N4 `#F5F7FB` | none | 凹槽/分组容器底（看板列、筛选区）— 仅在 default 层使用，不叠在 raised/overlay 上 |
| **default** | N1 `#FFFFFF` | none | 基线平面（页面背景、flat card）— 用 border 区分，不用阴影 |
| **raised** | N1 `#FFFFFF` | `0 1px 2px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)` | 可移动卡片/强调卡片（Jira 卡、hover 提升）— resting 态，每屏至多 1 处 |
| **overlay** | N1 `#FFFFFF` | `0 6px 16px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)` | 浮层（modal/dialog/dropdown/popover/tooltip）— 交互态最高层，可叠 overlay |
| **overflow** | N1 `#FFFFFF` | `0 0 8px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)` | 滚动溢出（表格横向滚动、长列表边界）— border 不够明显时用 |

**使用规则**：① default/raised 为 resting 态，overlay 为交互浮层态，overflow 为滚动溢出态。② raised 配 shadow-raised，overlay 配 shadow-overlay，不可混用。③ 优先用 border + 间距区分层级，阴影是最后手段（"less is more"）。④ 同屏 raised 至多 1 处，overlay 可叠。

## 5.2 Motion 动效体系（A 包新增）

> 国际对标：Material 3 duration 档位 + Ant Design motion token。两端同名同构同值。

**Duration（4 档）**：

| 档位 | 值 | 适用 |
|------|----|----|
| instant | 100ms | 微交互（状态切换、ripple）— 对齐 AntD motionDurationFast |
| fast | 200ms | 小型组件 enter/exit — 对齐 AntD motionDurationMid / M3 standard-accelerate |
| normal | 300ms | 标准转场 — 对齐 AntD motionDurationSlow / M3 standard |
| slow | 400ms | 全屏转场、复杂展开 — 对齐 M3 emphasized-decelerate |

**Easing（cubic-bezier 曲线库，AntD 官方值）**：

| 名称 | 曲线 | 适用 |
|------|------|----|
| ease-in-out | `cubic-bezier(0.645, 0.045, 0.355, 1)` | 通用进出场 |
| ease-out | `cubic-bezier(0.215, 0.61, 0.355, 1)` | 元素进入（减速着陆） |
| ease-out-quint | `cubic-bezier(0.23, 1, 0.32, 1)` | 强调进入 |
| ease-in-out-circ | `cubic-bezier(0.78, 0.14, 0.15, 0.86)` | 圆弧进出场 |
| ease-out-circ | `cubic-bezier(0.08, 0.82, 0.17, 1)` | 圆弧进入 |

### 5.2.1 @keyframes 动画原语（M1 补全，2026-08-02）

> 全部只动 opacity/transform 合成属性（shimmer 为 background-position 特例，见下），暗色安全。两端 template.css 同构。

| 原语 | 关键帧 | 用途 |
|------|--------|------|
| `spin` | `to{transform:rotate(360deg)}` | 加载旋转（存量） |
| `pulse` | `0/100% opacity 1 → 50% opacity .4` | 骨架屏呼吸（存量） |
| `fade-in` | `opacity 0 → 1` | 弹窗遮罩/提示进场 |
| `fade-out` | `opacity 1 → 0` | 退场 |
| `float-up` | `opacity 0 + translateY(8px) → 1 + 0` | 下拉浮层进场 |
| `float-down` | 反向 | 浮层退场 |
| `slide-in-right` | `opacity 0 + translateX(16px) → 1 + 0` | 通知右滑入 |
| `slide-out-right` | 反向 | 通知右滑出 |
| `scale-in` | `opacity 0 + scale(.95) → 1 + 1` | 弹窗放大进场 |
| `scale-out` | 反向 | 弹窗缩小退场 |
| `shimmer` | `background-position -200% → 200%` | 骨架屏流光（唯一 background-position 特例） |

### 5.2.2 动效工具类（9 个 `.anim-*`，duration/easing 走 token）

| 工具类 | 值 |
|--------|----|
| `.anim-fade-in` | `fade-in fast ease-out both` |
| `.anim-fade-out` | `fade-out fast ease-in-out both` |
| `.anim-float-up` | `float-up normal ease-out both` |
| `.anim-float-down` | `float-down fast ease-in-out both` |
| `.anim-slide-in-right` | `slide-in-right fast ease-out both` |
| `.anim-slide-out-right` | `slide-out-right fast ease-in-out both` |
| `.anim-scale-in` | `scale-in normal ease-out-circ both` |
| `.anim-scale-out` | `scale-out fast ease-in-out both` |
| `.anim-spin` | `spin slow linear infinite` |

> 组件级挂载：`.modal-mask.show`（fade-in）/ `.modal`（scale-in）/ `.dropdown`（float-up）/ `.tooltip`（fade-in）。`fill-mode: both` 保证动画后保持终态。`.spinner .8s` / `.skeleton.pulse 1.5s` 为存量合理持续动画周期，保留数值写法。

---

## 6. Components

### 6.1 组件清单总览

| # | 组件 | 变体 | 说明 |
|---|------|------|------|
| 1 | **顶部导航** | 单实例 | 高 72，主色底，logo + 用户/主题/全屏 |
| 2 | **主按钮** | 默认 / 悬停 / 点击 / 禁用 | 主操作 |
| 3 | **次按钮** | 默认 / 悬停 / … | 次要操作 |
| 4 | **文字按钮** | 默认 / 悬停 / 点击 / 禁用 | 低强调操作、行内链接式按钮 |
| 5 | **Button/中** | 类型(主/次) × 状态(默认/点击/禁用) | 中等按钮 |
| 6 | **单行输入** | 左图标 × 右搜索图标 × 状态(默认/输入/失效) | 文本输入 |
| 7 | **单行输入B** | 同上 | 变体 B |
| 8 | **Switch 开关(大)** | 开 / 关 / 关禁用 / 开禁用 | 开关 |
| 9 | **Switch 开关(小)** | 开 / 关 / 关禁用 / 开禁用 | 紧凑开关 |
| 10 | **单选** | 未选中 / 悬停 / 选中 / 失效 | Radio |
| 11 | **多选** | 未选中 / 选中 / 悬停 / 失效 | Checkbox |
| 12 | **状态指示灯** | 关机/离线 / 在线/生产 / 空闲 / 故障 | 设备状态点 |
| 13 | **绿色标签 / Tag** | 成功/警告/错误/默认 | 状态标签（高 22） |
| 14 | **卡片** | 单实例 | 容器（头 40，阴影） |
| 15 | **弹窗** | 单实例 | Modal（382×257，头 40） |
| 16 | **表格表头** | 单实例 | 表头（高 44，N2 底，含多选） |
| 17 | **单行表格** | 默认 / 悬停 / … | 表格行（高 44） |
| 18 | **标签分页 Tabs** | 选中 / 默认 / 悬停 / 关闭按钮 / 图标 | 页签（高 32） |
| 19 | **分页器** | 单实例 | 分页（高 44，圆钮 24） |
| 20 | **日期选择框** | 选择-时分秒 | 日期/时间选择 |
| 21 | **日历** | 单实例 | 日历 |
| 22 | **数据展示-折叠面板** | 单实例 | Collapse |
| 23 | **展开or收缩** | 收缩 / 展开 | 树/面板开关 |
| 24 | **作业树二级菜单** | 默认 / 悬停 / 点击 | 侧边树菜单 |
| 25 | **滚动条** | 单实例 | 自定义滚动条 |
| 26 | **更多 / 关闭 / 选择器开** | 多状态 | 图标按钮 |
| 27 | **底部信息** | 单实例 | Footer 条（高 32，主色底） |
| 28 | **图标集 Icon** | 196 个（2026-08-10） | `icons/` 目录 SVG；通用 70 个与移动端同源 + B 端特有扩展（menu/chevron/sort/filter/upload/import/user-group/log/dashboard/columns/eye-off/fullscreen + 2026-08-10 业务扩展 53 个看板/监控/管理类）；规格 stroke 1.8/round/currentColor；尺寸类 `.ico`16 `.btn-ico`16 `.tree-ico`16 `.kpi-ico`20 `.kpi-ico--lg`24（见 icons/icons.md） |
| 29 | **KPI 环形卡（StatCard Ring）** | 5 色环（primary/run/warn/err/secondary） | `.stat-card--ring` 变体：左环 64 + 右 label/num/trend；环周长 163.4（2π×26）、stroke 6、linecap round、svg rotate(-90deg)；环心 14px mono 500、右侧数值 22px（2026-08-06 登记，见 components.json `stat-card--ring`；CSS 沉淀 template.css L664-679） |
| 30 | **KPI 图标卡（StatCard Icon）** | 5 色图标块（primary/run/warn/err/neutral） | `.stat-card--icon` 变体：左浅底高圆角图标块（48×48、radius-lg 16、低饱和底+高饱和图标，复用 kpi-ico--lg）+ 右上大数字 + 底部行（标题左/变化量右贴图标底）；变化量 12px 500 ↑run 绿 ↓err 红；同批沉淀 `.kpi-ico--err` 与 `.stat-card--mini` 迷你统计卡（2026-08-06 登记，见 components.json `stat-card--icon`） |

### 6.2 核心组件详解（含实测 px）

#### 顶部导航 Top Navigation
```
高度              = 72px（实测：顶部导航组件 605×72；设计图中 1920×72）
背景色            = 主色 #005EAE
文字/图标色       = 白 #FFFFFF
左侧              = 项目 logo 40×40 + 产品名（容器）
右侧              = 首页 / 用户名 / 修改密码 / 退出登录 / 全屏（无主题切换——暗色不携开关），itemSpacing 19
```

#### 按钮 Button System
```
┌────────┬────────┬────────┬──────────┬─────────┐
│ 尺寸   │ 高度   │ 最小宽  │ 字号       │ 内边距  │
├────────┼────────┼────────┼──────────┼─────────┤
│ 大     │ 40px   │ 自动   │ 14/22 (M) │ 左右16  │
│ 默认(中)│ 32px  │ 64px   │ 14/22 (M) │ 左右16  │
│ 小     │ 24px   │ 自动   │ 12/20 (R) │ 左右12  │
└────────┴────────┴────────┴──────────┴─────────┘
⚠️ 高度基准：Ant Design 标准。Figma「主按钮」组件集合整体 72px 含多变体排版，
   单按钮高以 32px（默认）为准。
```
```
主按钮填充        = #005EAE，文字 #FFFFFF
主按钮 hover      = #1A75D2
主按钮 active     = #004A8F
主按钮禁用        = #DAEAFA 底 / #A0B4C0 字
次按钮           = 白底 + 主色描边 + 主色文字
文字按钮         = 主色文字，无背景
圆角             = 8px
```

#### 输入 Input
```
高度              = 32px
内边距            = 左右 12px
底色              = N5 #EAEAED
边框              = N6 #DEE2E6，圆角 4px
占位符            = N8 #ADB5BD
聚焦              = 边框 #005EAE + ring rgba(0,94,174,0.2)
失效              = 底色 N4，文字置灰
可选             = 左侧图标 / 右侧搜索图标
```

#### 标签 Tag
```
高度              = 22px（实测：绿色标签 44×22）
内边距            = 左右 10px
字号              = 12px / 20px
圆角              = 4px
成功态            = 背景 #F6FFED + 文字 #389E0D
警告态            = 背景 #FFF7E6 + 文字 #FA8C16
错误态            = 背景 #FFF1F0 + 文字 #F5222D
默认态            = 背景 #F6F9FC + 文字 #6C757D
```

#### 卡片 Card
```
宽度              = 自适应（设计图常用 400 / 1200）
高度              = 头 40 + 内容（实测组件 400×284）
头部高            = 40px，标题 16px 左，14/24 Medium，N11
头部底分割线      = N6 #DEE2E6
内容区内边距      = 16px
底色              = N1 #FFFFFF
阴影              = Shadow-Card（0 0 5px rgba(0,0,0,0.10)）
圆角              = 8px（设计图亦有 4 / 16 变体）
```

#### 弹窗 Modal
```
宽度              = 382px（实测）
高度              = 257px（实测），随内容增长
头部高            = 40px，标题 16px 左
底色              = N1 #FFFFFF
阴影              = Shadow-Modal（0 3px 2px rgba(11,23,55,0.10)）
圆角              = 8px
```

#### 表格 Table
```
表头高            = 44px（实测：表格表头 1232×44）
表头底色          = N2 #FAFAFA
行高              = 44px
行悬停底色        = N3 #F6F9FC
单元格左右 padding = 16px
首列多选框        = 16×16，选中态主色 #005EAE
分割线            = N6 #DEE2E6
```

#### 状态指示灯 Status Light
```
直径              ≈ 10px（组件集合 78×12）
关机/离线         = N8 #ADB5BD（灰）
在线/生产         = 运行绿 #16A34A
空闲              = 辅助色 #0A84FF（或 N9）
故障              = 错误红 #F5222D
```

#### 标签分页 Tabs
```
高度              = 32px（实测：标签分页2 高 32）
itemSpacing       = 4px
支持              = 图标 + 关闭按钮
选中态            = 主色文字/下划线；默认态 N9 文字
```

#### 分页器 Pagination
```
高度              = 44px（实测）
每页项圆钮        = 24×24，圆角 999
激活项            = 主色 #005EAE 底 + 白字
文字「共 N 条」   = 14px N9 #6C757D
```

---

## 7. Grid & Layout Framework

### 7.1 后台管理布局骨架（实测自设计图）

```
┌───────────────────────────────────────────────┐
│            顶部导航 TopBar (72px, 主色)          │  ← 全局固定
├──────────┬────────────────────────────────────┤
│          │  面包屑 / Tab 栏 (可选)              │
│ 侧边栏   ├────────────────────────────────────┤
│ Sidebar  │                                    │
│ (240px,  │      内容区 Content                 │
│  主色)    │   （N4 背景，卡片栅格 24 列）        │
│          │                                    │
│          ├────────────────────────────────────┤
│          │  底部信息 Footer (32px, 主色)        │
└──────────┴────────────────────────────────────┘
```

### 7.2 关键布局常量（实测）

| 维度 | 值 | 说明 |
|------|-----|------|
| 顶部导航高 | 72px | 全局固定 |
| 侧边栏宽 | 240px | 可折叠至 80px |
| 侧边栏底色 | 主色 `#005EAE` | 菜单项白字 |
| 内容区背景 | N4 `#F5F7FB` | 页面底色 |
| 底部信息高 | 32px | 主色底，白字版权 |
| 内容卡片间距 | 16px | 栅格 GAP |
| 栅格 | 24 列 | Ant Design Grid |
| 响应式断点 | 576/768/992/1200/1600 | sm/md/lg/xl/xxl |

### 7.3 页面搭建步骤（Screen Assembly）

> 详见 RULES.md §6 Web 布局黄金法则 + §4.3/§4.4 跨模块间距与卡片对齐契约。最小可执行步骤：

1. **整体框架**：TopBar(72) + Sidebar(240, 可折叠) + Content + Footer(32)。顶栏右依次为 首页/用户名/修改密码/退出登录/全屏/**暗色模式**（`.theme-btn` 亮/暗切换，2026-08-12 拍板）。
2. **内容区**：背景 N4 `#F5F7FB`，内边距 16–24px，使用 24 列栅格（`.grid12 > .col-N`）排布卡片。**col-* 是弹性容器**（`display:flex;flex-direction:column`，模板已配），col 内卡片自动 flex:1 平分列高——单卡撑满/多卡平分，与同 grid 行其他列对齐。
3. **面包屑/Tab**：位于内容区顶部，面包屑条 32px 高 + N5 底（`›` 分隔，下方间距 16px）；Tab 高 32px，选中态主色。
4. **卡片/表格**：插入卡片实例（白底、阴影、圆角 8），**col 内卡片一律 `.card--fill`**（图表/列表/统计卡均适用）；表格用表头(48)+行(44)，动态表格数据不足补 `minRow` 占位行（RULES §4.4）。KPI 卡用 `.stat-card` 族 + 卡数匹配 `--N`（`stat-grid--5/6/8`，RULES §3.7）。
5. **按钮/输入**：主按钮 32px 高、输入 32px 高，严格用 DESIGN-TOKENS 变量；带图标按钮文字用 `.btn-label` 包裹（RULES §3.7）。
6. **复核**：Batch_read 抽查 3 个元素，确认无硬编码 HEX、宽度未超容器、颜色来自变量集；图表 SVG 用 `.chart-svg--fill` + viewBox 末端留 ≥20px 边距（RULES §3.7）。
7. **落盘（2026-08-06 更新）**：产出写「**用户项目**」的 `output/`（无则自动创建，**不是设计系统仓库 output/**——仓库 output/ 仅历史归档），文件名自动拼 `<页面语义名>_<YYYYMMDD>_<HHmm>.html`（同日重名递增 `_2`，禁覆盖）；CSS 链接相对路径指向 `弘讯web端design-system/template.css`；门禁 `cd 弘讯web端design-system && node validate-spec.js <用户项目路径>/output/<文件>.html`（详见 GENERATION-SOP 步骤4 产出落盘规则）。

---

## 8. Interaction

### 8.1 动效原则
- **按钮反馈**：hover 变亮（`#1A75D2`），active 变深（`#004A8F`），disabled 置灰。
- **表格行**：hover 底色变 N3 `#F6F9FC`，轻微阴影。
- **侧边栏**：折叠/展开平滑过渡；菜单项 hover/点击态切换。
- **弹窗**：淡入 + 轻微上浮（Shadow-Modal）。
- **分页/Tab**：激活态即时高亮。

### 8.1.1 无障碍（reduced-motion）

两端 `template.css` 末尾内置：

```css
@media (prefers-reduced-motion: reduce) {
  *,*::before,*::after{animation-duration:0s !important;animation-delay:0s !important;transition-duration:0s !important;transition-delay:0s !important;}
}
```

系统开启「减少动效」时全部动画/过渡归零（即时切换合法），无需逐组件处理。

### 8.1.2 门禁强制（checkMotion，M4 新增 2026-08-02）

`validate-spec.js` 的 `checkMotion()` 对所有页面生效（含外链 template.css），按拍板分级：

| 时长写法 | transition | animation |
|----------|-----------|-----------|
| `var(--motion-duration-*)` | ✅ 通过 | ✅ 通过 |
| `0s` / `0ms`（即时切换） | ✅ 通过 | ✅ 通过 |
| 裸数字秒（`.2s`/`200ms`/`1.5s`） | 🔴 HIGH | 🟡 MEDIUM |

- 只扫组件规则（页面 `<style>` + 外链 CSS）；`@keyframes` 块内部不扫。
- `transition`/`transition-duration`/`animation`/`animation-duration` 简写与单属性都查；逗号多段每段独立判定。
- 契约↔实现一致性留给人读文档，门禁不做强比对（契约先行不误伤）。
- 存量 `.spinner .8s` / `.skeleton.pulse 1.5s` 报 MEDIUM，属合理持续动画周期，保留。

### 8.2 状态体系（通用）
- **Default**：默认态
- **Hover**：悬停（`#1A75D2` / `#3DA0FF`）
- **Active/Pressed**：按压/点击（`#004A8F` / `#0066CC`）
- **Disabled**：禁用（降透明度 + 灰化）
- **Focus**：输入框聚焦（主色边框 + ring）

---

## 9. Figma 变量汇总

| 分类 | 数量 | 说明 |
|------|------|------|
| Colors | 63 | 主色5 + 辅助色5 + 链接1 + 中性色11 + 图表色8 + 功能色(成功/警告/错误 各9 + 运行 3) |
| 模式 | 1 | 默认（单模式） |
| **合计变量** | **63** | 变量集「颜色规范」，含新增运行绿 3 变量 |

### 组件库统计
- **Component Sets**: 20 组（主按钮 / 次按钮 / 文字按钮 / Button中 / 单行输入 / 单行输入B / Switch大 / Switch小 / 单选 / 多选 / 状态指示灯 / 标签分页2 ×2 / 关闭 / 展开收缩 / 选择器开 / 更多 / 14px图标 / 作业树二级菜单 / 单行表格）
- **独立组件**: 约 120+（含大量业务页组件：设备监控/看板/角色管理等）
- **页面**: 3 页（全局规范 / 组件 / 设计图）

---

## 10. 设计稿页面 & 覆写文档

### 页面类型规格（2026-08-06：pages/ 已删除，并入 RULES §1.1b）

| 页面类型 | 规格位置 | 说明 |
|------|---------|------|
| 后台管理布局（顶栏+侧边栏+内容+底部） | `RULES.md §0` | 全局布局骨架与固定常量（72/240/32 + G8/G9） |
| 数据看板 / 监控大屏 | `RULES.md §1.1b 看板` | KPI 卡两版 + 图表自建（§9/CHART-SPEC） |
| 列表表格页 | `RULES.md §1.1b 列表页` | 筛选 + 表格 + 分页标准页 |
| 弹窗 / 表单 | `RULES.md §1.1b 弹窗` | Modal 与表单字段规范 |
| 登录页 | `RULES.md §1.1b 登录页` | 独立页，不套后台框架 |
| 详情页 | `RULES.md §1.1b 详情页` | 键值对 + 参数表 + 日志时间轴 |

### 原始设计稿画面索引（设计图页）

| 画面 | 说明 |
|------|------|
| 系统管理/角色管理 (16:5, 144:310) | 标准后台表格页：侧边栏 240 + 顶栏 72 + 内容卡片 |
| 后台管理 (16:111) | 完整后台框架 2048×990 |
| 弘设汇 (64:1110) / 弘塑云 (111:2144) | 营销/门户落地页风格 |
| Frame 11 (124:2825) | 4 张统计卡片（1200×255） |
| tab (144:703) | 页签栏示例 |

> 说明：本系统颜色严格来自 Ardot 变量集，组件 px 来自 batch_read 实测骨架；按钮高度以 Ant Design 标准为基准并注明。
