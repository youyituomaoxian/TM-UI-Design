# 弘讯移动端设计系统

> **文件来源**: 【20260519】弘讯移动端 (Figma)
> **平台**: 微信小程序 / Android / iOS 跨端
> **变量集**: 弘讯小程序视觉系统（单模式：弘讯默认）
> **生成日期**: 2026-07-07
> **整理**: Ardot Design MCP + 人工审核
> **🔒 锁定**: 2026-08-06 用户拍板移动端定性冻结——仅修 bug，结构性/视觉性改动须用户明确拍板（见 RULES 顶部锁定声明）

---

## 品牌信息

| 属性 | 值 |
|------|-----|
| 产品 | 弘讯科技 — 注塑机工业控制移动端 |
| 风格 | 极简轻工业风，跨平台通用 |
| 主色 | `#005EAE`（深海蓝） |
| 字体 · 安卓 | 中文 Noto Sans SC / 英文 Roboto |
| 字体 · iOS | 中文 PingFang SC / 英文 SF Pro |
| 设计基准 | 375pt 视口宽度 / 4dp 最小网格单位 |

---

## 1. Color Tokens

> **配色引擎**：若需在智能体中根据任意品牌色 / 暗色模式生成「应用页」配色，见仓库根 `brand-color-engine/`（读 `engine.md` → 调 `generate.js` 的 `generatePalette(brand,{mode,platform})`）。默认 `#005EAE` 直接返回本规范原值；**功能色固定语义、不随品牌推导**。

### 1.1 品牌色 Primary

| Token 名称 | HEX | RGB | 用途 |
|-----------|-----|-----|------|
| 主色默认 | `#005EAE` | rgb(0, 94, 174) | 按钮、导航栏填充、品牌强调 |
| 主色点击 | `#004ABF` | rgb(0, 74, 143) | 按钮按压态 |
| 主色聚焦/悬停 | `#1A75D2` | rgb(26, 117, 210) | 输入框聚焦、Tab 激活 |
| 主色禁用填充 | `#DAEAFA` | rgb(218, 234, 250) | 禁用按钮背景 |
| 主色禁用文字 | `#A0B4C0` | rgb(160, 180, 192) | 禁用按钮文字 |

### 1.2 品牌渐变

| 渐变名称 | 色值组合 | 用途 |
|----------|---------|------|
| ~~渐变 A（数据卡片/个人中心）~~ | ~~`#005EAE` → `#003868`~~ | **废弃（2026-08-06）**：个人中心 Hero 改用纯 `--primary` 底，见 RULES §1.1b 个人中心 |
| 渐变 B（背景·个人主页头背景） | `#005EAE` → `#0F172A` | 深色场景渐变（预留：暗色模式 Hero 区） |
| 渐变 C（数据卡片） | `#005EAE` → `#0606D4` | 高亮数据卡片 |

### 1.3 信息化图表 Chart Palette

| Token 名称 | HEX | 用途语义 |
|-----------|-----|---------|
| 蓝色系列 | `#0061FF` | 核心指标、同比数据、性能指标等 |
| 绿色系 | `#10B981` | 正向状态：利好/健康/增长 |
| 橙色系 | `#F59E0B` | 中性状态：成本/柱状图、中风险预警等 |
| 红色系列 | `#EF4444` | 负向状态：告警/风险/负向状态 |
| 蓝色系（辅助） | `#1D4ED8` | 柱状图、折线图 |
| 绿色系（增长） | `#059669` | 增长数据、正数值 |
| 黄色系 | `#D97706` | 中性状态 |
| 红色系（负面） | `#DC2626` | 负向状态 |
| 紫色系列 A | `#A78BFA` | 专业紫/深度分析、多维度雷达、关联性分析 |
| 紫色系列 B | `#8B5CF6` | 对比性图标、深度分析维度、技术架构 |
| 青色系 | `#06B6D4` | 新青色/中性辅助/基础数据、基准线/参考线/技术文档辅助信息 |
| 玫红色系 | `#EC4899` | 突发事件、限时活动、关键告警点 |
| 灰色系 | `#64748B` | 图表"其他"隐区、未分类数据 |

> **Token（2026-08-06 落地 template.css）**：`--chart-blue` `--chart-green` `--chart-orange` `--chart-red` `--chart-blue-aux` `--chart-green-g` `--chart-yellow` `--chart-red-neg` `--chart-purple-a` `--chart-purple-b` `--chart-cyan` `--chart-rose` `--chart-gray`（顺序即上表）。SVG 内一律 `var(--chart-*)`，禁裸 hex。

### 1.4 功能色 Functional

**成功 Success**

| Token 名称 | HEX | 用途 |
|-----------|-----|------|
| 成功背景默认 | `#10B981` | 成功按钮、标签背景 |
| 成功背景点击 | `#0D9E6F` | 按钮按压态（明度降15%） |
| 成功背景禁用 | `#A6D4C5` | 禁用态 |
| 成功文字 | `#F0FFFA` | 文字浅色 |
| 成功浅底 | `#EAF9F3` | **--suc-bg**（2026-08-06）浅底状态块/Tag 浅底 |
| 成功浅边框 | `#B7E7D5` | **--suc-border**（2026-08-06）浅底描边 |

**警示 Warning**

| Token 名称 | HEX | 用途 |
|-----------|-----|------|
| 警示背景默认 | `#F59E0B` | 警示按钮、标签背景 |
| 警示背景点击 | `#DB8E09` | 按钮按压态（明度降10%） |
| 警示背景禁用 | `#F5D9A6` | 禁用态 |
| 警示文字 | `#FEF2E8` | 文字浅色 |
| 警示浅底 | `#FEF6E8` | **--warn-bg**（2026-08-06）浅底状态块/Tag 浅底 |
| 警示浅边框 | `#F9DBAA` | **--warn-border**（2026-08-06）浅底描边 |

**错误 Error**

| Token 名称 | HEX | 用途 |
|-----------|-----|------|
| 错误背景默认 | `#EF4444` | 错误按钮、标签背景 |
| 错误背景点击 | `#D63B3B` | 按钮按压态（明度降10%） |
| 错误背景禁用 | `#F5A6A6` | 禁用态 |
| 错误文字 | `#FEDED8` | 文字浅色 |
| 错误浅底 | `#FDEEEE` | **--err-bg**（2026-08-06）浅底状态块/Tag 浅底 |
| 错误浅边框 | `#F8C5C5` | **--err-border**（2026-08-06）浅底描边 |

**链接 Link**: `#1A75D2`

### 1.5 中性色 Neutral

| Token | HEX | 语义用途 |
|-------|-----|---------|
| N1 纯白 | `#FFFFFF` | 卡片底色 |
| N2 背景/表头 | `#F5F7FB` | 页面背景、表头底色 |
| N3 输入框底色 | `#E9ECF0` | 输入框、次按钮按压 |
| N4 分割线/边框 | `#DEE2E5` | 分割线、组件边框、表格内线 |
| N5 按钮边框 | `#CED4E4` | 未激活图标边框 |
| N6 禁用文字 | `#ADB5BF` | 禁用状态文字、极小标签 |
| N7 辅助说明 | `#6C757D` | 辅助说明、表单提示 |
| N8 正文 | `#334155` | 正文、基础按钮文字 |
| N9 副标题 | `#343A46` | 副标题、重要标签 |
| N10 主标题 | `#21253C` | 主标题、超大标题、关键数据 |

### 1.6 设备/工单状态色 Device Status

> 来源于 Figma 实测与页面规格（device-group / dashboard / list-detail），已在页面文档中落地。

| 状态 | HEX | 语义 | 用途 |
|------|-----|------|------|
| 运行中 / 在线 | `#16A34A` | 设备正常运行 | 列表副标题状态文字、仪表盘 KPI 状态 |
| 故障 / 告警 | `#EF4444` | 设备异常 | 列表副标题、告警数、错误状态（同 §1.4 错误红） |
| 离线 | `#6C757D` | 设备未连接 | 状态标签、辅助文字（同 N7） |
| 维护中 | `#F59E0B` | 计划维护 | 状态标签（同 §1.4 警示橙） |

> ⚠️ 与 §1.4 的「成功绿 `#10B981`」区分：#16A34A 专用于**设备运行/在线状态指示**，#10B981 用于**成功操作反馈**（按钮/标签背景）。两者语义不同，不得混用。

---

## 2. Typography

### 2.1 字体家族

| 平台 | 中文字体 | 英文字体 | 备注 |
|------|---------|---------|------|
| **Android** | Noto Sans SC | Roboto | - |
| **iOS** | PingFang SC | SF Pro Display(20号以上) / SF Pro Text(20以下) | - |

层级模式：**4+3+2** = 4级标题 + 3级正文 + 2级辅助

### 2.2 Android 字体规范

| 类型 | 字号 / 行高 | 字重 | 应用场景 |
|------|------------|------|---------|
| 显示文本 | 36sp / 40dp | Medium | 全屏模态标题/启动页 |
| H1 | 28sp / 36dp | Medium | 页面主标题（如首页） |
| H2 | 24sp / 32dp | Medium | 弹窗标题/分区标题 |
| H3 | 20sp / 28dp | Medium | 卡片标题/二级模块标题 |
| 强调正文 | 16sp / 24dp | Medium | 列表项 |
| 标准正文 | 16sp / 24dp | Regular | 默认正文、列表项说明 |
| 辅助正文 | 14sp / 21dp | Regular | 按钮文字/表单标签 |
| 辅助说明 | 12sp / 18dp | Regular | 表单提示/图片说明 |
| 次要注释 | 10sp / 12dp | Regular | 时间戳/版权信息 |

### 2.3 iOS 字体规范

| 类型 | 字号 / 行高 | 字重 | 应用场景 |
|------|------------|------|---------|
| 显示文本 | 38pt / 49pt | **Bold** | 全屏模态标题/启动页 |
| H1 | 26pt / 34pt | Bold | 页面主标题（如首页） |
| H2 | 22pt / 31pt | Medium | 弹窗标题/分区标题 |
| H3 | 18pt / 27pt | Medium | 卡片标题/二级模块标题 |
| 强调正文 | 17pt / 27pt | Medium | 长段落/详情描述 |
| 标准正文 | 17pt / 27pt | Regular | 默认正文、列表项说明 |
| 辅助正文 | 15pt / 23pt | Regular | 按钮文字/表单标签 |
| 辅助说明 | 13pt / 20pt | Medium | 表单提示/图片说明 |
| 次要注释 | 11pt / 15pt | Regular | 时间戳/版权信息 |

### 2.4 扩展字体规范（组件级）

| 层级 / 类型 | 字号 / 行高 | 字重 | 应用场景 |
|------------|------------|------|---------|
| H1 内页主标题 | 24/32 | Medium | 内页最大标题、活动页主标题、全屏弹窗大标题 |
| H2 导航栏标题 | 17/22 | Medium | 微信原生导航栏标题、自定义导航栏标题 |
| H3 卡片/分区标题 | 16/24 | Medium | 卡片标题、模块分区标题、列表分组标题、告警列表标题 |
| Tab 导航文字 | 14/20 | Medium | 顶部分段 Tab：监控/参数/配方/历史记录、报表切换标签 |
| 强调正文 | 16/24 | Medium | 重点信息、表单必填项、详情高亮文本、设备编号、机台 SN 编码 |
| 默认正文 | 14/21 | Regular | 常规正文、列表内容、详情描述、参数名称、工艺流程步骤 |
| 辅助 1 级 | 12/16 | Regular | 表单提示、图片说明、次要备注、输入框占位符、物理参数单位、角色权限标识 |
| 辅助 2 级 | 12/16 (透明度 60%) | Regular | 时间戳、版权信息、脚注最小文本、列表流水序号、记录编号 |
| 数据重点数值 | 20/26 | Medium | 注塑机实时温度、压力、转速、射速、产量/百分比、开机时长、统计大屏核心数值 |
| 按钮-大 | 16/24 | Medium | 主操作按钮、底部通栏按钮、弹窗确认按钮 |
| 按钮-中 | 14/21 | Medium | 常规按钮、卡片内操作按钮、次功能按钮 |
| 按钮-小 | 12/16 | Regular | 标签型小按钮、内联操作、次要功能按钮 |
| 状态标签-大 | 14/20 | Medium | 卡片头部状态（在线/离线/维修）、模块全局状态（如：整机运行中/停机） |
| 状态标签-中 | 12/16 | Medium | 列表项状态、表格状态、行内状态标签、告警等级标签（一级/二级预警/已恢复） |
| 状态标签-小 | 11/14 | Medium | 极小内联标签、紧凑列表状态（如：高密度设备列的极简状态标识） |

> **CSS 语义类映射（2026-08-06 补全，跨端通用类）**：`.m-text-h0`=26/34（主视觉大标题）、`.m-text-h1`=24/32、`.m-text-h2`=20/28、`.m-text-h3`=17/24、`.m-text-h4`=18/26（卡内大标题）、`.m-text-body1`=16/24、`.m-text-body2`=14/22、`.m-text-body3`=15/22（次级正文）、`.m-text-caption`=12/16、`.m-text-note`=13/20（次级辅助）、`.m-text-label`=12/16、`.m-text-num`=16/22 mono（详见 RULES §10.3）。

### 2.5 等宽字体 + 密度模式（B 包新增）

> **等宽**（B 包新增）：`--font-mono: "JetBrains Mono","SF Mono",Consolas,...`（对标 AntD fontFamilyCode + Polaris mono）。用于工控数据展示（设备参数/数值表格/代码）。数值对齐优先 `font-variant-numeric: tabular-nums`，mono 仅用于代码/设备参数。
> **密度**（B 包新增）：移动端只 `comfortable` 基准（`--density-row-height:56px` 单行列表 56，对标 M3 48dp+ 触达）；`compact`/`spacious` 标 null 不启用（移动端密度债待后续评估）。
> 移动端字阶保持 android/ios 双套（9 级，H1=26-28），B 包不对齐 Web 13 级命名（移动端字阶结构差异属存量，待 W2 选型后统一）。

---

## 3. Spacing

### 3.1 基础网格

- **最小原子单位**: `4 dp / pt`
- **基础倍数系统**: `8 / 16 / 24 / 32 / 48`
- **覆盖 90%+ 场景**

### 3.2 间距 Token

| 类别 | 值 (dp/pt) | 语义用途 |
|------|-----------|---------|
| 最小间距 | 4 | 图标与文字间距等微间距 |
| 小间距 | **8** | 最小单元间距（如图标间距）、栅格步进 |
| 中间距 | **16** | 组件内边距、列表项间距、内容区左右边距 |
| 大间距 | **24** | 模块间间距、卡片外边距 |
| 大间距-小 | 40 | 区块分割（如卡片间距） |
| 大间距-中 | 48 | 页面级分隔 |
| 大间距-大 | 56 | 主要区块间距 |

> **Token（2026-08-06 落地，命名对齐 Web）**：`--space-xs:4px` `--space-sm:8px` `--space-md:12px`（§10.4 克制体系核心 gap）`--space-base:16px` `--space-lg:24px` `--space-xl:32px` `--space-xxl:48px` `--space-huge:56px`。页面/组件间距取值以 RULES §10.4 为准，可用 token 引用替代裸 px。

> ⚠️ **间距 token 只是步进基值，页面/组件实际间距一律按 RULES §10.4 克制间距体系（v8 终态）取值**：基础区域 16px（`.screen`/`.page-view` gap 双容器）、卡片状容器内子 20px、卡片与卡片叠 20px、线状组件 20px、区域交界 30px。**旧的「列表项间距 12px」「模块间间距 24px」已废弃**，禁止再按 12/24 取值（会导致模块贴死或过空）。

### 3.3 栅格系统

| 平台 | 安全区左 | 内容区 | 安全区右 |
|------|---------|--------|---------|
| **Android** | 8 | 可变 | 8 |
| **iOS** | 16 | 可变 | 16 |

---

## 4. Radius

| 名称 | 值 | 描述 | 适用场景 |
|------|----|------|---------|
| 小圆角 | `4px` | 标签、小型按钮、开关空间 | Tag、Input、小型控件 |
| 中圆角 | `8px` | **卡片、列表项、宫格容器（mcard/mlist/m-kingkong/m-hero）、对话框、中等尺寸按钮** | Card、Dialog、Button（安卓默认） |
| 大圆角 | `16px` | **仅弹窗层**（底部 ActionSheet 上角、居中 Dialog）、搜索框 | Modal、FAB；**禁用于卡片/列表** |
| 100% 全圆角 | `999px` | 圆形图标、胶囊按钮、浮动按钮 FAB | Avatar、胶囊按钮 |

> **圆角系统铁律（2026-08-05 统一）**：卡片状容器（`.mcard`/`.mcard-b`/`.mcard-c`/`.mlist*`/`.m-hero`/`.m-kingkong`）一律 **8px**（Android）/ **10px**（iOS `--radius-card-ios`），**禁止引用 `--radius-lg`(16px)**——那是弹窗级圆角，卡片套 16px 在工业后台观感过圆、不符合克制调性（用户 2026-08-05 反馈「卡片圆角太大，请统一规划圆角系统」）。16px 仅保留给 Modal / FAB / 搜索框。

> **平台差异**：
> - Android 按钮默认 8 圆角；支持 FAB 直径 56，位于右下角
> - iOS 圆角按钮默认 6 圆角；导航栏按钮无圆角；卡片默认 10 圆角

---

## 5. Shadow（双层复合）

> **A 包升级（2026-07-30）**：shadow 由单层升级为**双层复合**（柔光层 + 1px 品牌色调发丝线），对标 Atlassian elevation.shadow + AntD boxShadow。s/m 保留品牌色调 rgba(0,94,174,*)，l 黑柔光+品牌发丝线。旧名保留，引用方零改动。值真源 `tokens.json` 的 `shadows` 节；引证见 `TOKENS-EVIDENCE.md`。

| 级别 | 别名 | 参数（双层复合） | 适用对象 |
|------|------|------|---------|
| **Shadow-S** | 按钮、标签 | `0 0 4px rgba(0,94,174,0.10), 0 0 0 1px rgba(0,94,174,0.08)` | 小元素投影 |
| **Shadow-M** | 卡片、输入框 | `0 0 8px rgba(0,94,174,0.15), 0 0 0 1px rgba(0,94,174,0.10)` | 卡片、输入框 |
| **Shadow-L** | 模态弹窗、悬浮操作栏 | `0 0 12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,94,174,0.10)` | 弹窗、悬浮层 |

> 每个级别包含居中/上/下/左/右 五方向变体（参数化字段保留于 tokens.json，value 字段为双层 CSS 真源）。

## 5.1 Elevation 层级体系（5 级，A 包新增）

> 国际对标：Atlassian 5 级（sunken/default/raised/overlay/overflow）surface+shadow 配对 + Material 3 层级递进 + Polaris 组件映射。移动端 shadow 发丝线保留品牌色调 rgba(0,94,174,*)。暗色值属 C 包。

| 级别 | surface | shadow | 适用场景 |
|------|---------|--------|---------|
| **sunken** | N2 `#F5F7FB` | none | 凹槽/分组容器底（看板列、筛选区）— 仅在 default 层使用 |
| **default** | N1 `#FFFFFF` | none | 基线平面（页面、flat card）— 用 border 区分 |
| **raised** | N1 `#FFFFFF` | `0 1px 2px rgba(0,94,174,0.10), 0 0 0 1px rgba(0,94,174,0.08)` | 可移动卡片/强调卡片（hover 提升）— resting 态 |
| **overlay** | N1 `#FFFFFF` | `0 6px 16px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,94,174,0.10)` | 浮层（modal/dialog/dropdown/popover）— 交互态最高层 |
| **overflow** | N1 `#FFFFFF` | `0 0 8px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,94,174,0.08)` | 滚动溢出（长列表边界）— border 不够明显时用 |

**使用规则**：① default/raised 为 resting 态，overlay 为交互浮层态，overflow 为滚动溢出态。② raised 配 shadow-raised，overlay 配 shadow-overlay，不可混用。③ 优先用 border + 间距区分层级。④ 移动端阴影保留品牌色调以维持品牌一致性。

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

> 全部只动 opacity/transform 合成属性（shimmer 为 background-position 特例），暗色安全。两端 template.css 同构同值。

| 原语 | 关键帧 | 用途 |
|------|--------|------|
| `spin` | `to{transform:rotate(360deg)}` | 加载旋转 |
| `pulse` | `0/100% opacity 1 → 50% opacity .4` | 骨架屏呼吸 |
| `fade-in` | `opacity 0 → 1` | 遮罩/提示进场 |
| `fade-out` | `opacity 1 → 0` | 退场 |
| `float-up` | `opacity 0 + translateY(8px) → 1 + 0` | 浮层进场 |
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

> 组件级 transition（对标 Web 语义，全部 fast + ease-out）：`.mbtn`（background/color）、`.mtab`（color/border）、`.mlist`（background）、`.msearch`（border-color）、`.mtag`（background）。移动端无 modal/dropdown/tooltip 类组件，不挂组件级 animation；`.mmodal` 保持纯显示。

---

## 6. Components

### 6.1 组件清单总览

| # | 组件名 | 变体数 | 说明 |
|---|--------|--------|------|
| 1 | **顶部导航** | 3×2=6 | 安卓/iOS × 小程序/默认 × 返回开关 |
| 2 | **安卓 Bars** | 2 | 默认 / Light 模式 |
| 3 | **IOS Bars** | 5×2=10 | title/Right/left/Miniprogram Button/个人中心 × Default/Light |
| 4 | **IOS StatusBar** | 2 | Default / 白色 |
| 5 | **安卓 Status Bar** | 2 | Default / 亮 |
| 6 | **底部导航** | 2×2=4 | 安卓/iOS × 有文字/无文字 |
| 7 | **底部导航元素** | 2 | 有文字 / 无文字 |
| 8 | **顶部 Tab A** | 2×2=4 | Default/选中 × 有图标/无图标 |
| 9 | **顶部 Tab B** | 2×2=4 | Default/选中 × 有图标/无图标 |
| 10 | **Tab 导航 A（数量固定）** | 2 | 有图标 / 无图标 |
| 11 | **Tab 导航 A（数量不固定）** | 2 | 有图标 / 无图标 |
| 12 | **Tab 导航 B（数量固定）** | 2 | 有图标 / 无图标 |
| 13 | **Tab 导航 B（数量不固定）** | 2 | 有图标 / 无图标 |
| 14 | **Button / 登录** | 3 | 默认/点击/禁用 |
| 15 | **Button / 大** | 2×3=6 | 主按钮/次按钮 × 默认/点击/禁用 |
| 16 | **Button / 中** | 2×3=6 | 同上 |
| 17 | **Button / 小** | 2×3=6 | 同上 |
| 18 | **Button / 小 / 次按钮 B** | 3 | 默认/点击/禁用 |
| 19 | **Tag / 大** | 5×2=10 | 主色线性/面型/绿/红/黄 × 图标开关 |
| 20 | **Tag / 中** | 5×2=10 | 同上 + 指示灯开关 |
| 21 | **Tag / 小** | 5 | 品牌/面型/绿/红/黄 |
| 22 | **查询搜索** | 5 | 白色输入框 A/B / 背景色输入框 A/B / 白色输入 |
| 23 | **单行标题列表输入** | 4 | Default/更多/单选/导向 + 左侧图标开关 |
| 24 | **单行标题列表展示** | 4 | Default/更多/单选/导向 + 左侧图标开关 |
| 25 | **双行列表** | 2 | 更多 / Variant2 + 辅助信息开关 |
| 26 | **三行列表** | 1 | 固定样式 |
| 27 | **导向** | 5 | 箭头/向下/向上/向左/向右 |
| 28 | **卡片 B** | 1 | 通用卡片 |
| 29 | **卡片 C** | 1 | 通用卡片（变体） |
| 30 | **单选弹窗** | 1 | 选择器弹窗 |
| 31 | **多项输入弹窗** | 1 | 多项编辑弹窗 |
| 32 | **长文本弹窗** | 1 | 文本展示弹窗 |
| 33 | **24 麦克风** | 2 | 线 / 面 |
| 34 | **24 单选** | 2 | 选择 / 默认 |
| 35 | **取消关闭** | 1 | 关闭按钮 |
| 36 | **图标集** | ~30+ | 返回/搜索/相机/邮件/用户/时间/通知/删除/关闭/展开/更多/语言/关于/帮助/隐私/客服/退出登录/富文本/消息提示 等 |

### 6.2 核心组件详解（含实测 px 精度）

> 以下尺寸来自 Figma 组件页实测。标注 `(图)` 为 Ardot MCP 实测值。

#### 顶部导航 Top Navigation
```
高度              = iOS 88pt (状态44+导航44) / Android 80dp (状态24+导航56)
导航标题字号        = 17pt/22pt Medium PingFang SC
标题位置           = iOS居中 / Android居左
图标尺寸           = 24×24pt/dp
背景色             = 主色默认 #005EAE
返回按钮           = iOS: <前页标题  /  Android: ← 符号
iOS状态栏文字       = 白色 (#FFF)
```
- **变体**: 系统(安卓/iOS) × 类型(小程序/默认) × 返回按钮(开/关)

#### 底部导航 Bottom Navigation
```
Android          = 高56dp (图标24dp+文字12sp), 支持纯图标, 最多5项
iOS              = 高49pt+34pt安全区=83pt (图标25pt+文字), 强制图标+文字, 最多5项
投影响应度         = 0px -4px 4px rgba(0,0,0,0.25) (图)
背景色             = N1 #FFFFFF
```

#### 按钮 Button System (实测修正)
```
┌────────┬────────┬────────┬──────────┬─────────┐
│ 尺寸   │ 高度   │ 最小宽  │ 字号       │ 内边距  │
├────────┼────────┼────────┼──────────┼─────────┤
│ 登录   │ 56px   │ 300px  │ 16/24 (M) │ 居中    │
│ 大     │ 48px ⚠️│ 120px  │ 16/24 (M) │ 左右16  │
│ 中     │ 40px   │ 80px   │ 14/21 (M) │ 左右16  │
│ 小     │ 32px   │ 64px   │ 12/16 (R) │ 左右16  │
└────────┴────────┴────────┴──────────┴─────────┘
⚠️ 大按钮实测高度 48px（非之前记录的 44px），以实测为准。
```
```
主按钮填充色         = #005EAE (主色默认)
主按钮文字色         = #FFFFFF (N1)
主按钮点击态         = #004ABF (主色点击)
主按钮禁用填充        = #DAEAFA (主色禁用填充)
主按钮禁用文字        = #A0B4C0 (主色禁用文字)
次按钮               = N1 白底 + 主色描边
圆角                = 8px (Android) / 6px (iOS)
```

#### Tag 标签
```
┌──────┬───────┬───────┬──────┬───────┬──────────┐
│ 尺寸 │ 高度  │ 最小宽 │ 字号  │ 图标  │ 图标位置  │
├──────┼───────┼───────┼──────┼───────┼──────────┤
│ 大   │ 28px  │ 96px  │ 14/28│ 12×12 │ 左间距 4  │
│ 中   │ 24px  │ 86px  │ 12/23│ 10×10◎│ 左内 12  │
│ 小   │ 20px  │ 72px  │ 11/20│ 8×8◎  │ 左内 8   │
└──────┴───────┴───────┴──────┴───────┴──────────┘
◎ = 圆形指示灯（dot），中标签 x=12, y=7; 小标签 x=8, y=6
```
```
线性标签            = N1 白底 + 主色描边 + 主色文字
面型标签            = 主色填充 + 白色文字
绿色/红色/黄色        = 对应 Success/Warning/Error 色值
文字内边距大/中        = x=28(含图标 24+4), 小= x=20
```

#### 列表 List Items
```
单行标题列表（Default）
  height           = 56px, width = 375px
  padding-x        = 16px, padding-y = 16px
  左侧图标          = 24×24px, 可选
  标题             = 16/24 Medium PingFang SC, N8 #334155
  右侧文字          = 12/16 Regular PingFang SC, "更多"
  右侧箭头          = > 导向图标, 24×24 可选
  图标-标题间距      = 8px
  底色              = N1 #FFFFFF

双行列表（更多变体）
  height           = 116px, width = 375px
  padding          = 16px 全方向
  缩略图            = 52×52px, N2 底色, 与文字间距 16px
  标题             = 16/24 Medium, N8
  副标题            = 14/21 Regular, N8, y=26
  底部分隔线         = N4 (#DEE2E5), x=16, y=76, width=343
  来源信息          = 12/16 Regular, N7 (#6C757D), 右对齐

三行列表
  height           = 101px, width = 375px
  padding          = 16px 全方向
  槽位区域          = 89.7×69px, N2 底色
  文字区            = x=115.7, 行间距 6px
    Row 1          = 标题 16/24 Medium + 右侧操作
    Row 2          = 副标题 14/21 Regular, N8, y=26
    Row 3          = 来源 12/16 Regular, N7, y=53
```

#### 卡片 Card
```
卡片 B (带标题栏)
  height           = 120px, width = 375px
  标题栏高           = 40px
  标题文字           = 16/22 Medium Noto Sans SC, N9 (#343A46)
  标题左侧内边距      = 16px
  右侧更多图标        = 24×24px, x=343
  标题底部分割线      = N4, 全宽
  内容区高           = 80px

卡片 C (内容卡片)
  height           = 101px, width = 375px
  padding-x        = 16px, padding-y = 8px
  标题              = 16/24 Medium Noto Sans SC, N8
  正文              = 16/24 Regular Roboto, N8, 距标题 28px
  分割线            = N4, x=16, y=65, width=343
  Footer           = 2列布局, height=20, y=73
    Left           = 12用户图标 + "李小明" 12/20 Regular N7
    Right          = 12时间图标 + "2025/9/24 10:24:21" 12/20 Regular N7
```

#### 弹窗 Dialog / Modal
```
单选弹窗
  width            = 375px, height = 296px
  标题栏高           = 46px
  标题              = 17/22 Medium PingFang SC, N9, 居中
  选项行             = 343×56px, 16/24 Medium, padding-x=16
  选项分隔线         = N4 1px
  按钮行             = 2×Button/小(次按钮+主按钮), 各147.5×32, gap=16
  底部安全区         = IOS底部预留 34pt

多项输入弹窗
  height           = 408px
  输入行数           = 5 行, 每行 56px
  组件              = 单行标题列表输入 (Default)
  其余同单选弹窗

长文本弹窗
  height           = 285px
  文本区             = 343×189px, y=54
  文本              = 14/21 Regular PingFang SC, N8 (#334155)
  底部安全区         = 34pt
```

#### 搜索 Search Bar
```
白色输入框 A（默认）
  width            = 343px, height = 36px
  内框              = 315×36px, 圆角 16px pill 形
  底色              = N1 #FFFFFF
  搜索图标          = 24×24px, x=8
  占位符            = 14/21 Regular Noto Sans SC, N5 (#CED4E4), x=41
  图标-文字间距      = 9px
  右侧麦克风         = 24×24px, x=319

其他变体            = 白色B/背景色A/背景色B/白色输入(聚焦), 结构相同仅底色不同

落位规则（2026-08-06 终态：双场景自适应）
  .msearch 基础规则 = width:100% + max-width:343px：
  ① 屏幕落位（.screen/.page-view 直接子级，容器 343）→ 恰好 343；
  ② 嵌入卡片/表单（.mcard/.mcard-b/.mcard-c/自造表单容器等更窄容器）→ 自动收窄自适应。
  禁再写固定 width:343（嵌入场景会横向溢出顶出容器，见 RULES §4.3）。
```

#### Tab 导航 Tab Navigation
```
顶部 Tab A (滑动型/数量不固定)
  单Tab高           = 约44px (依赖于图标高度)
  激活态            = 主色文字+下划线
  未激活            = N7 文字, 无下划线
  图标              = 24×24px (可选)

顶部 Tab A (数量固定型)
  单Tab             = 等分布局
  同 A 类型激活态

顶部 Tab B / Tab导航B = 同结构, A/B 为布局差异(是否固定宽度)
```

#### 图标 Icons
```
导航/功能类         = 24×24px → "24返回" "24搜索" "24用户" "24时间" "24mail" "24导航占位"
                                     "24/相机" "24消息提示" "24麦克风" "24退出登录" "24单选"
列表/操作类         = 20×20px → "20展开"
标签/辅助类         = 12×12px → "12时间" "12用户" "12占位符"
头像类              = 64×64px → "64默认头像" / 24×24px → "24默认头像"
图标风格            = 线性为主, 部分支持线/面切换 (如 24麦克风 line/面, 24单选 选择/默认)
```

---

## 7. Grid & Layout Framework

### 7.1 框架布局

```
┌─────────────────────────────┐
│      顶部导航（固定）         │  ← Top Navigation
├──────┬──────────────────────┤
│ 二级  │   Tab 栏（可选）       │  ← Tab Bar (optional)
│ 菜单  ├──────────────────────┤
│(可选) │                      │
│      │    内容区域            │  ← Content Area
│      │   （列表/卡片/表单）     │
│      │                      │
├──────┴──────────────────────┤
│   底部导航（一级菜单/可选）    │  ← Bottom Nav (optional)
└─────────────────────────────┘
```

### 7.2 平台差异对照

| 维度 | Android | iOS |
|------|---------|-----|
| 状态栏高度 | 24dp | 44pt |
| 顶部导航栏高度 | 56dp | 44pt |
| 底部标签栏高度 | 56dp（图标24+文字12） | 49pt（图标25+文字） |
| 安全区底部 | - | 34pt（iPhone X+） |
| 导航返回 | ← 符号 | < 前页标题 |
| 导航标题位置 | 居左 | 居中 |
| 列表项高度(单行) | 56dp | 56pt | 两者相同，以组件实测为准 |
| 列表项箭头 | →（图表） | ＞（系统灰色） |
| 抽屉导航 | 支持 | 不支持 |
| FAB | 支持（直径56 右下角） | 不支持 |

### 7.3 屏幕搭建步骤（Screen Assembly · 防溢出）

> 详见 RULES.md §8 屏幕自动布局黄金法则（铁律 G1–G7 + 防溢出清单）。以下为最小可执行步骤。

1. **画板**：Frame `375×812`，`FIXED` 宽高，背景 `#F5F7FB` (N2)。
2. **顶部导航**：插入「顶部导航」实例，设 `width=375 FIXED`，变体选 系统(安卓/iOS) × 类型(小程序/默认)。
3. **Content 容器**：Frame，`layoutMode=VERTICAL`，`padding=16/0/16/0`，`itemSpacing=12`，`width=375 FIXED`，`clipsContent=TRUE`。
4. **放入元素**：每插入一个组件实例（卡片/列表/统计条/筛选行/区块头），**立即**设 `width=343` + 对应 SizingMode：
   - 纵向子节点 → `counterAxisSizingMode:FIXED`
   - 横向行 → `primaryAxisSizingMode:FIXED`，主轴对齐 `SPACE_BETWEEN`
5. **横向行算宽**：FilterRow 等标签行，标签按内容宽排 + 间距，总宽必须 **≤ 343**（间距用 4/8 Token，必要时收紧）。
6. **复核**：Batch_read 抽查 3 个元素，确认无 `width=375/354/407`，无 `x+width>375`。

> ⚠️ **组件库尺寸 ≠ 屏幕落位尺寸**：组件规格里的 `width=375px` 是它在 Figma 独立画框里的全宽；在带 16px gutter 的真实屏幕里，落位宽必须是 **343px**。任何"把组件放进屏幕"的操作，第一步永远是设 `width=343 + FIXED`。

---

## 8. Interaction

### 8.1 动效原则
- **按钮反馈**: 点击时颜色加深（明度降低 10%~15%），提供即时视觉反馈
- **列表/卡片 Tap**: 轻触反馈，选中态高亮
- **页面转场**: 平滑过渡动画
- **Loading**: 加载指示器（圆形进度）
- **Toast**: 底部弹出轻提示
- **空态**: 占位插图 + 引导文案

### 8.1.1 无障碍（reduced-motion）

移动端 `template.css` 末尾内置：

```css
@media (prefers-reduced-motion: reduce) {
  *,*::before,*::after{animation-duration:0s !important;animation-delay:0s !important;transition-duration:0s !important;transition-delay:0s !important;}
}
```

系统开启「减少动效」时全部动画/过渡归零（即时切换合法），无需逐组件处理。

### 8.1.2 门禁强制（checkMotion，M4 新增 2026-08-02）

移动端 `validate-spec.js` 的 `checkMotion()` 与 Web 端镜像，对所有页面生效（含外链 template.css），按拍板分级：

| 时长写法 | transition | animation |
|----------|-----------|-----------|
| `var(--motion-duration-*)` | ✅ 通过 | ✅ 通过 |
| `0s` / `0ms`（即时切换） | ✅ 通过 | ✅ 通过 |
| 裸数字秒（`.2s`/`200ms`/`1.5s`） | 🔴 HIGH | 🟡 MEDIUM |

- 只扫组件规则（页面 `<style>` + 外链 CSS）；`@keyframes` 块内部不扫。
- `transition`/`transition-duration`/`animation`/`animation-duration` 简写与单属性都查；逗号多段每段独立判定。
- 契约↔实现一致性留给人读文档，门禁不做强比对。
- 本端已有 `checkRootVars` motion 段（:root 变量存在性），checkMotion 只加组件规则时长检查，不重复。

### 8.2 状态体系
- **Default**: 默认态
- **Pressed/Clicked**: 按压/点击态（加深）
- **Focused/Hover**: 聚焦态（用于 Tab、输入框）
- **Disabled**: 禁用态（降低透明度和对比度）

---

## 9. Figma 变量汇总

| 分类 | 数量 | 说明 |
|------|------|------|
| Colors | 31 | 品牌色 5 + 图表色 11 + 功能色 13 + 链接 1 + 中性色 10（含渐变色值来自节点） |
| Spacing | 7 | 4 / 8 / 16 / 24 / 40 / 48 / 56 |
| String | 1 | "更多"（默认文本） |
| Boolean | 1 | true（默认布尔值） |
| **合计** | **40** | 单模式「弘讯默认」 |

### 组件库统计
- **Component Sets**: 36 组
- **Components（非集合）**: ~38 个独立组件（图标/原子元件）
- **画板页面**: 3 页（全局规范 / 组件 / 设计稿UI）

---

## 10. 设计稿页面 & 覆写文档

### 页面类型规格（2026-08-06：pages/*.md 已删除，并入 RULES §1.1b）

| 页面类型 | 规格位置 | 说明 |
|------|---------|------|
| 列表-详情 | `RULES.md §1.1b 列表-详情页` | 搜索区双层 + 双行列表 + 缩进 32.8 |
| 表单页 | `RULES.md §1.1b 表单页` | 输入行 343×56 + 提交按钮 |
| 仪表盘 / KPI | `RULES.md §1.1b 仪表盘` | KPI 概览条 + 数据卡片 C |
| 个人中心 | `RULES.md §1.1b 个人中心` | Hero 纯色 + Avatar 64 + 列表卡片 |
| 设备分组 | `RULES.md §1.1b 设备分组` | 分区组合 + 筛选 Tag + Ardot 变体更新 |
| 告警列表 | `RULES.md §1.1b 告警列表` | Tab 角标 + 状态 Tag 映射 |
| 登录页 | `RULES.md §1.1b 登录页` | 独立页（无 BottomNav） |

### 原始设计稿画面索引

| 画面 ID | 画面名称 | 说明 |
|---------|---------|------|
| `4036:672` | 小程序个人中心 | 个人中心主页（iOS，小程序导航变体） |
| `4044:257` | 个人中心 B | 个人中心主页（iOS，默认导航变体） |

> ⚠️ **实测值**: Button/大 在实际页面中使用高度为 **48pt**（与 MASTER 组件尺寸表一致），以实测值为准。
