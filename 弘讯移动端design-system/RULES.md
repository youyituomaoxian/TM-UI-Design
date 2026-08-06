# 设计决策规则 RULES

> 弘讯移动端设计系统 · 组件选择与使用约束
> 供 AI Agent / 开发者做 UI 决策时查阅

> **🔒 锁定声明（2026-08-06 用户拍板：移动端已定性冻结）**
> 移动端规范 / 组件 / token / 门禁为**冻结资产**：仅修复明确 bug，不接受结构性 / 视觉性改动。
> 任何改动须用户明确拍板；Web 端演进若涉及移动端（共享 token / 组件体系 / validate-spec 对称改动），
> **必须先提醒用户拍板**，不得静默同步改动移动端。

---

## 1. 组件选择决策树

### 1.1 页面级组件选型

```
START: 我要做什么类型的页面？
│
├─ 展示列表数据（设备/工单/消息...）
│  └─→ §1.1b 列表-详情页（顶部导航 + 搜索栏 + 列表内容区）
│
├─ 用户输入/提交信息（报修/登记/申请...）
│  └─→ §1.1b 表单页（顶部导航 + 表单行 + 提交按钮）
│
├─ 数据概览/KPI 监控（仪表盘/统计...）
│  └─→ §1.1b 仪表盘（顶部导航 + KPI 条 + 数据卡片列表）
│
├─ 个人信息/设置入口
│  └─→ §1.1b 个人中心（顶部导航 + Hero 纯色区 + 列表卡片 + 操作按钮）
│
├─ 登录页
│  └─→ §1.1b 登录页（独立页，无 BottomNav）
│
├─ 设备分组管理
│  └─→ §1.1b 设备分组（分区组合 + 筛选 Tag + Group 卡片）
│
├─ 告警列表
│  └─→ §1.1b 告警列表（Tab 角标 + 双行列表 + 状态 Tag 映射）
│
└─ Tab 首页（多入口聚合）
   └─→ 组合上述模板的 Tab 容器 + 底部导航
```

### 1.1b 页面类型规格（2026-08-06：pages/*.md 已删除并入本节 ⚠️ 必读）

> 页面级布局与专属规则（从原 `pages/*.md` 提炼的真增量，2026-08-06 并入）。
> 组件尺寸 / 色值 / 状态一律以 `components.json` + `template.css` 为准；本节只记「页面级结构与页面专属规则」。

#### 列表-详情页
- 搜索区双层：区域 N2 底 + 输入框 N1 白底（343×40、pill、图标 24、占位 14 N5）。
- 双行列表 92pt / 缩略图 52 / 标题 16 Medium N8（走 `.mlist-double`，卡片形态带 `--elev-raised-shadow`）。
- 辅助信息行 `padding-left 32.8pt` 对齐缩略图右侧；麦克风图标色 `#6C757D`（Figma 提取原值 #FFFFFF 与白底冲突，已修正）。

#### 表单页
- 输入行 343×56：标签 16pt/64×24 + 输入区 239×24 占位 N5 + 右侧操作区 24；单选圆点 ⊙ `--primary`。
- 提交按钮 343×48 主按钮（16/24 Medium；Android 8px / iOS 胶囊）。

#### 仪表盘 / KPI
- KPI 概览条：三列等宽、品牌蓝底 120pt、padding-h 16 / padding-v 29；数值 28pt 语义色（运行 `--run` #16A34A / 故障 `--err` #EF4444），标签 12pt `#DAEAFA`。
- 数据卡片 C 101pt：头部 16pt 标题 + 分割线 + 元数据 foot。

#### 个人中心
- **Hero 纯 `--primary` 底（旧渐变 #005EAE→#003868 废弃——MASTER 渐变 A 同步作废）**；用户信息 24pt 白 / 组织 16pt `#DAEAFA`。
- Avatar 64×64 圆 + 底色 `#82A7E5`（页面级实测值，无 token 对应，保留需注明）。
- 列表卡片：单行标题 ×2 导向 + 左侧品牌色图标，item-gap 8 / card-inner-padding 0。

#### 设备分组
- 分区组合：SectionHeader + SummaryStrip + FilterRow + GroupsContainer + Group（间距层级 16 / 24 / 8）。
- **筛选 Tag 隐藏指示灯**（避免与状态 Tag 混淆）；选中主色面型 / 未选中主色线性。
- Ardot 变体批量更新：`U(id, {"componentProperties": {...}})` 包装；批量 ≤25 个/批；流程 `I() → batch_read → U()`。

#### 告警列表
- 状态→标签映射：故障 `.mtag-err` / 警告 `.mtag-warn` / 已恢复 `.mtag-suc` / 运行中 `.mtag-run`（列表内标签用 `.mtag-md`，`.mtag-sm` 仅密集场景）。
- 筛选 Tab 数量角标：「未处理 12」用 `.mtag-sm .mtag-err`。
- 处理按钮：未处理项 `.mbtn-sm .mbtn-text` / 已处理项显示 N7 文本；空态「暂无告警」+ 下拉刷新。

#### 登录页（独立页，无 BottomNav）
- Logo 64×64 + 产品名 H1 28/36 Medium N10 + 副标题 14/21 N7。
- 验证码输入 343×40 + 右侧「获取验证码」`.mbtn-sm .mbtn-text` 高 32（倒计时态 N7 禁用）。
- 协议勾选 Checkbox 16×16 + `--link` 链接；「忘记密码」`.t-link` 类。
- 登录按钮 343 落位宽、高 56、胶囊（`.mbtn-login`；Android 才 8px）。
- 规则：无 BottomNav、顶部导航可选；协议未勾选禁用；主色用于按钮/链接/聚焦，背景用 N4 禁主色铺满；错误态 `--err`。

### 1.2 组件粒度选型

```
需要展示什么内容？
│
├─ 单条文字信息（一行标题）
│  → 单行标题列表展示 (List/SingleLine)
│  变体: 导向(>) / 开关(Switch) / 无操作
│
├─ 双层信息（主标题+副标题）
│  → 双行列表展示 (List/DoubleLine)
│  变体: 更多(⋮) / 导向(>)
│  可选: 辅助信息=true（第三行）
│
├─ 带缩略图的内容项
│  → 双行列表展示 + 左侧 52×52 缩略图占位
│
├─ 纯文本输入
│  → 单行输入行 (Form/InputRow)
│  含: 图标占位 + 标签 + 输入框 + 操作区
│
├─ 触发操作的按钮
│  → Button (按场景选尺寸)
│  登录 → Button/登录 (56pt)
│  提交/主操作 → Button/大 (48pt)
│  次要操作 → Button/中 (40pt)
│  文字链接 → Button/小 (32pt) / TextButton (无背景)
│
├─ 数据指标卡片
│  → Card/C (101pt 高, 含头部分割线+元数据)
│  简洁卡片   → Card/B (无分割线)
│  大图卡片   → Card/A (120pt, 含图片区域)
│
├─ 状态标签
│  → Tag (按尺寸选)
│  大(28pt) / 中(24pt) / 小(20pt)
│
├─ 关键数字展示 (KPI)
│  → 自定义 KPI 概览条 (dashboard.md §2)
│  三列等宽，品牌色底，数值语义色
│
└─ 搜索功能
   → 搜索栏 (343×40, pill 形圆角)
   含: 🔍图标 + 占位文字 + 🎤麦克风(可选)
```

**按钮场景矩阵（移动端语义，2026-08-03 同步）**：

| 场景 | 组件 | 说明 |
|------|------|------|
| 主操作（提交/保存/处理） | **实底主色 Button（大 48pt）** | 一屏至多一个主操作 |
| 次操作（查看/取消/忽略/导出） | **描边或文字 Button** | 不抢主操作视觉 |
| 已终结态（已处理/已读） | **Tag（不可点）** | 状态展示，不是按钮 |
| 铁律 | — | **同一列表同一动作必须同一样式**（禁同动作混用实底/描边/文字） |

### 1.3 色彩选择决策树

```
这个元素表达什么语义？
│
├─ 品牌/主要操作/导航填充
│  → 主色默认 #005EAE
│
├─ 正向状态（正常/成功/增长/完成）
│  → 绿色系 #10B981（成功绿；≠ 运行绿 #16A34A）
├─ 运行/在线/生产中（工业监控最高频状态）
│  → 运行绿 #16A34A（跨端共用；见 MASTER §1.6）
│
├─ 警告/注意/中性
│  → 橙色系 #F59E0B
│
├─ 错误/告警/危险
│  → 红色系 #EF4444
│
├─ 信息提示/链接
│  → 蓝色系列 #1A75D2（与 Web 链接一致，真源 functional.link）
│
├─ 禁用/不可用
│  → 主色禁用文字 #A0B4C0 或 填充 #DAEAFA
│
├─ 页面背景
│  → N2 #F5F7FB
│
├─ 卡片/容器背景
│  → N1 #FFFFFF
│
└─ 文字层级
   → 一级标题 N10 #21253C / 正文 N8 #334155 / 三级/辅助 N7 #6C757D / 禁用 N6 #ADB5BF
```

**KPI 数值语义色（2026-08-03 同步，仅限 KPI 数值）**：

| 状态 | 色值 | 说明 |
|------|------|------|
| 默认 | **白字** | KPI 卡品牌蓝底，数值白字 |
| 运行中 | 运行绿 `#16A34A` | 跨端共用运行色 |
| 故障 | 错误红 `#EF4444` | 与告警红同源 |
| 待维护 | 警告橙 `#F59E0B` | 需关注但非致命 |

> **禁止一屏彩虹**：4 个 KPI 不许 4 种色——状态色只给「非默认」状态，其余一律白字；同屏最多 1 个警示色 + 1 个故障色。

### 1.4 字号选择决策树

```
这是什么级别的文字？
│
├─ 页面大标题 / KPI 数值
│  → 28pt Medium (KPI 数值)
│  → 24pt Medium (Hero 用户名)
│
├─ 卡片标题 / 区块标题
│  → 16pt Medium（MASTER §2.4 H3 卡片标题标准）
│
├─ 导航标题 / 正文标题
│  → 17pt Medium (iOS Nav Title)
│  → 16pt Medium (表单标签、按钮文字、卡片标题)
│
├─ 正文内容 / 列表副标题 / 数据摘要
│  → 14pt Regular (搜索占位、列表副标题)
│  → 16pt Regular (输入值)
│
├─ 辅助信息 / 时间戳 / 元数据
│  → 12pt Regular (辅助信息行、时间戳、「更多」文字)
│
├─ KPI 标签 / 极小提示
│  → 12pt Regular (KPI 标签 / 极小标签；9 级字阶最小档)
│
└─ 状态栏时间 / 系统文字
   → 15pt Semibold (iOS Status Bar)
```

**用类不用裸值（2026-08-03 同步）**：移动端字阶 **9 级**（MASTER.md §2，android / ios 各 9 级）——用对应 **class**，**禁裸 `font-size`**（哪怕值合法）。字阶/类名映射以 MASTER.md §2 为准，跨平台字体走平台默认（Ardot 不可用 Noto/PingFang 时用 Source Han Sans CN）。

---

## 2. 禁止清单 Anti-Patterns

### 2.1 ❌ 绝对禁止

| # | 禁止事项 | 原因 | 正确做法 |
|---|---------|------|---------|
| 1 | 使用非设计系统的颜色 | 破坏品牌一致性 | 仅使用 DESIGN-TOKENS.md 定义的颜色变量 |
| 2 | 自定义圆角值 | 视觉不统一 | 使用 Token: 4pt(小)/8pt(Android btn)/10pt(card)/999(iOS btn 胶囊/circle) |
| 3 | 在 N2 背景上用白色文字 | 对比度不足 (< 4.5:1) | N2 上用 #334155 或更深 |
| 4 | 字号小于 10pt | 移动端不可读 | 最小 12pt（辅助信息），正文 ≥ 14pt |
| 5 | 列表项间距 < 8pt 或 > 24pt | 过密或过疏 | 使用 16pt gap（由父容器控制） |
| 6 | 按钮高度 < 32pt | 触控热区不够（Apple HIG 推荐 44pt） | 最小 32pt(Tag)，常规按钮 ≥ 40pt；`.mbtn-xs` 24px 为极小操作档（触控豁免场景，RULES §9） |
| 7 | 混合使用 iOS 和 Android 风格在同一页面 | 平台违和 | 按目标平台统一：iOS 用 PingFang+胶囊圆角/Android 用 Roboto+圆角8 |
| 8 | 导航栏高度写死 44pt | 忽略 status bar | 总高 = status bar(44) + nav bar(44) = **88pt** |
| 9 | 内容从 y=0 开始绘制 | 被 status bar 和导航遮挡 | 内容区从 y=88pt 开始 |

### 2.2 ⚠️ 不推荐

| # | 不推荐事项 | 原因 | 替代方案 |
|---|-----------|------|---------|
| 1 | 单屏放超过 7 个表单项 | 信息过载，滚动体验差 | 分组折叠或拆分多步骤表单 |
| 2 | KPI 超过 4 个指标在一行 | 数值太小难以阅读 | 折行 2×2 网格或横向滑动 |
| 3 | 卡片内超过 3 行核心信息 | 密度太高 | 拆分到详情页或用 Tab 切换 |
| 4 | 同时使用多种渐变 | 视觉噪音 | 渐变仅用于 Hero 区和 KPI 区，最多 2 种 |
| 5 | 阴影模糊 > 12pt | 显得脏/重 | Shadow-S(4) / Shadow-M(8) / Shadow-L(12) |

---

## 3. 组件状态机

### 3.1 按钮 Button States

```
        ┌──────────┐
        │  默认 Default │
        │  #005EAE 底  │
        │  #FFFFFF 字  │
        └─────┬────┘
              │ tap/click
              ▼
        ┌──────────┐
        │  点击 Pressed │
        │  #004ABF 底  │  ← 加深 10%
        │  #FFFFFF 字  │
        └─────┬────┘
              │ release
              ▼
        ┌──────────┐    ┌──────────────┐
        │  默认 Default │◄──│  禁用 Disabled │
        └──────────┘    │  #DAEAFA 底   │
              ▲         │  #A0B4C0 字   │
              │ enable  └──────────────┘
              └──────────────────┘
```

| 状态 | 背景 Token | 文字 Token | 可交互 | 场景 |
|------|-----------|-----------|--------|------|
| Default | `主色默认` `#005EAE` | `#FFFFFF` | ✅ | 正常可点 |
| Pressed | `主色点击` `#004ABF` | `#FFFFFF` | ✅ | 手指按下 |
| Disabled | `主色禁用填充` `#DAEAFA` | `主色禁用文字` `#A0B4C0` | ❌ | 表单未填完 / 权限不足 |
| Focused/Hover | `主色聚焦` `#1A75D2` | `#FFFFFF` | ✅ | Web hover / 键盘聚焦 |

### 3.2 输入框 Input States

```
        ┌──────────────────┐
        │  空态 Empty       │
        │  border: #E5E7EB │
        │  placeholder: #ADB5BD │
        └────┬─────────┬───┘
             │ fill    │ focus
             ▼         ▼
   ┌──────────────┐  ┌──────────────┐
   │  已填充 Filled│  │  聚焦 Focused │
   │  text: #334155│  │  border: #005EAE │
   └──────┬───────┘  │  ring: rgba(0,94,174,0.2)│
          │ error    └──────┬───────┘
          ▼                 │ blur/error
   ┌──────────────┐         │
   │  错误 Error   │◄────────┘
   │  border: #EF4444│
   │  text: #EF4444  │
   │  msg: "错误提示" │
   └──────────────┘
```

| 状态 | 边框颜色 | 文字/光圈 | 说明 |
|------|---------|----------|------|
| Empty | `#E5E7EB` (边框灰) | placeholder `#ADB5BD` | 未输入，显示占位符 |
| Filled | `#E5E7EB` | value `#334155` | 已有内容 |
| Focused | `#005EAE` (品牌色) | ring `rgba(0,94,174,0.2)` | 键盘激活 |
| Error | `#EF4444` (红色) | 错误文字 `#EF4444` | 校验失败，下方显示错误文案 |
| Disabled | `#E5E7EB` | `#CED4DA` | 不可编辑 |

### 3.3 列表项 List Item States

| 状态 | 背景色 | 文字处理 | 交互 |
|------|--------|---------|------|
| Normal | `#FFFFFF` | 全部显示 | 可点击 → push 导航 |
| Pressed | `#F5F7FB` (N2 浮起) | 不变 | 手指按下反馈 |
| Selected | 微蓝底 `rgba(0,94,174,0.08)` | 标题加粗 | 多选模式 |
| Disabled | `#F9FAFB` | `#CBD5E1` 灰化 | 不可点击 |
| Unread (新) | `#FFFFFF` | 标题 Bold | 新消息标记（可选） |

### 3.4 Tag 标签状态

| 状态 | 背景色 | 文字色 | 用途 |
|------|--------|--------|------|
| Primary | `#005EAE` | `#FFFFFF` | 主要分类 |
| Success | `rgba(16,185,129,0.1)` | `#10B981` | 正常/成功/完成（运行中见运行绿 #16A34A）|
| Warning | `rgba(245,158,11,0.1)` | `#F59E0B` | 待维护/注意 |
| Danger | `rgba(239,68,68,0.1)` | `#EF4444` | 故障/告警 |
| Default | `#F1F5F9` | N7 `#6C757D` | 默认/通用 |

### 3.5 组件 DOM 契约（移动端版，2026-08-04 补强）⚠️ 必读

**背景**：设备台帐多轮复盘，执行级缺陷（Tag 尺寸 / 卡片间距 / 文本层级 / Tab 竖排 / 卡片无圆角）根因全是「组件真源已就位、HTML 没按契约组 DOM」——与 Web 端 §3.7 同源。以下为**机器可校验的 DOM 契约**，validate-spec 已落地同名门禁（仅页面含 m 前缀组件类时触发，不误伤 Web 页），违反即报：

| 契约 ID（门禁） | 适用组件 | 违规形态（❌） | 正确写法（✅） |
|---|---|---|---|
| `mlist.structure`（MEDIUM） | 双行列表 | `<div class="mlist-double">` 自造内部结构（`.list-line/.list-sub/.nm` 等）或缺 `.mlist-double-top` 标准子树 | `.mlist-double > (.mlist-double-top > .mlist-thumb + .mlist-double-text > (.mlist-double-head + .mlist-sub) + .mlist-more) + .mlist-double-foot` |
| `mtag.size.in-card`（MEDIUM） | 卡片/列表内 Tag | `.mlist-double` 等卡片内用 `.mtag-sm`（20px 高）——信息醒目度不足 | 卡片内用 `.mtag-md`/`.mtag-lg`；`.mtag-sm` 仅用于标签云/密集列表等次要场景 |
| `kv.row.required`（MEDIUM） | 卡片数据指标行 | 卡片 foot 用 "·" 串文本（如 `12,480 模 · 78% 负载`）——无信息层级 | `.kv-row > .kv-item` 分 cell（`<b>` 数字等宽 + 细线分隔）；`.mlist-sub` 单行辅助信息允许 · 串（不同场景） |
| `m.empty.placeholder`（MEDIUM） | 动态列表空态 | 动态渲染列表（innerHTML 赋值）无空态占位——数据 0 时页面空白 | `.m-empty` 占位（居中提示 + 图标，template.css 原语） |

**配套约定**
1. 移动端门禁**仅在页面含 m 前缀组件类**（`mbtn/mlist/mtag/mtabs/m-dot/mcard/msearch` 任一）时触发，避免误伤 Web 页。
2. 全部先 `stripScriptTags` 再扫（JS 模板字符串不参与），行号统一 0。
3. `.mlist-sub`（单行辅助：型号·车间·负责人）允许 · 串；**仅数据指标行（foot）禁用 · 串**（须 `.kv-row`）。
4. Tag 尺寸语义：`sm`=密集次要 / `md`=卡片标准（默认）/ `lg`=强调。
5. 空态 `.m-empty` 为 template.css 原语（2026-08-04 新增）；动态列表必带空态分支。

---

## 4. 间距与布局规范速查

### 4.1 核心间距 Token

| Token 名称 | pt 值 | px (@2x) | 使用场景 |
|------------|-------|----------|---------|
| XS | 4pt | 8px | 元素内部微调、Icon 与文字间距 |
| S | 8pt | 16px | 列表项内部分割线间距、紧凑元素间隙 |
| M | 16pt | 32px | **页面左右 padding**（标准）、列表项间距 |
| L | 24pt | 48px | Section 之间的大间距、Hero 内边距 |
| XL | 32pt | 64px | 页面底部安全距离 |
| XXL | 48pt | 96px | 大区块分隔（极少使用） |

### 4.2 固定布局常量

| 参数 | 值 | 说明 |
|------|-----|------|
| 视口宽度 | 375pt | 所有页面基准宽度 |
| Status Bar 高度 | 44pt | iOS 系统状态栏 |
| Nav Bar 高度 | 44pt | iOS 导航栏 |
| **总导航区高度** | **88pt** | Status + Nav（⚠️ 不是 44pt！） |
| 底部安全区 | 34pt | iPhone X 系列 Home Indicator |
| 底部导航总高 | 83pt | Tab bar(49) + 安全区(34) |
| 页面水平 padding | 16pt | 左右各 16pt，内容宽度 = 343pt |
| 卡片圆角 | 10pt | iOS 卡片标准圆角 |
| 按钮圆角(iOS) | 6pt | iOS 按钮圆角 |
| 按钮圆角(Android) | 8pt | Android Material 圆角 |

### 4.3 HTML 预览结构契约（手机壳，2026-08-04）

> HTML 预览 = 视觉规格的呈现载体，**不是上线文件**（上线实现由使用者决定）。模板 `agent-starter.html` 已内置手机壳 + 交互 API，生成页面时遵循：

| 项 | 契约 |
|---|---|
| 手机壳 | `body` 深色底居中 `.phone-stage`（375 手机壳）> `.phone`（**固定 375×812**，禁长页向下追加） |
| 屏内滚动 | 所有内容在 `.screen-scroll`（`flex:1;overflow-y:auto`，**滚动条已隐藏**——webkit + firefox 都做）内滚动，`.screen`（343 列，gap:16px）为内容容器；navbar/bottomnav 固定不动；`padding-bottom:24px` 让最后项与 BottomNav 有呼吸 |
| 间距节奏 | **双容器机制（2026-08-05 v10 终态，必读）**：`.screen` 与 `.page-view` **均为 `flex column` + `gap:12px`**——间距**纯由 gap 提供，禁 margin 叠加**（v9 的 gap12+margin4=16 视觉实测 21px：box-shadow 外框被误算进间距，用户反馈「间距改错方向」）。**禁止把模块直接挂 `.screen` 下当子级**（`.screen > .mcard` 结构）——标准结构是 `.screen > .page-view > 模块`。`.section-title{margin:0 0 8px}`（上间距由容器 gap 12 提供；下 8 + 下方模块 gap 12 = 下方卡片 20px 间距——section-title 与卡片间距允许 20px，标题分组语义）；相邻 `.mlist-double` 由 `.anim-list-in gap:12px`（`!important` 兜底）提供（**禁止自造间距类**——用容器 gap + 模板类） |
| 列表项卡片形态 | `.mlist` / `.mlist-double` / `.mlist-triple` 一律 `border-radius:var(--radius-md) + box-shadow:var(--elev-raised-shadow)`（圆角 + 浅 elevation），**去 border-bottom**——相邻卡片由容器 gap 分隔，不再用分隔线堆叠 |
| **列表项嵌套降级（2026-08-05 新增，必读）** | `.mlist*` 直接嵌在**卡片状容器**（`.mcard` / `.mcard-b` 等）内部时，**必须降级为扁平行**：去 `box-shadow` / 去独立 `border-radius` / 去卡片背景（`background:transparent`），相邻项改用 `border-top:1px solid var(--n4)` 分隔线——**禁止卡片套卡片 / 双层阴影**（违反克制三原则；反例：`.mcard` 内 `.mlist-double` 双层白底+阴影，用户 2026-08-05 反馈「双重卡片层级太多」）。容器级列表（`.screen`/`.page-view` 直接子级）保持卡片形态不变；**降级后左右 padding 保持 16px 与卡片标题/正文对齐**（2026-08-06 视觉验证：padding 归零会文字贴卡片左缘、与 mcard-head 错位） |
| 卡片内搜索框（2026-08-06 终态，必读） | `.msearch` 是**双场景组件**：① 屏幕落位（`.screen`/`.page-view` 直接子级）→ `width:100%` + `max-width:343px`，容器恰 343；② 嵌入卡片/表单（`.mcard`/`.mcard-b`/`.mcard-c`/`.form-card` 及任何更窄容器）→ 自动收窄自适应。**基础规则已统一自适应，禁再写固定 343**（反例：form-card 内容区 311px，msearch 固定 343px 超卡片 32px 顶出屏幕） |
| 双行列表结构 | 必须用模板标准结构：`.mlist-double > (.mlist-double-top > .mlist-thumb + .mlist-double-text > (.mlist-double-head + .mlist-sub) + .mlist-more) + .mlist-double-foot`；自造 `.list-line/.list-sub/.nm` 等会触发 `class.self-defined` MED |
| **双行列表排版（2026-08-05 v2，Robin Williams 四原则：亲密性/对齐/重复/对比）⚠️ 必读** | ①**对比**：`.mlist-title`(16px/500/n8) > `.mlist-sub`(13px/400/n7) > `.mlist-double-foot`(12px/n7)——三层字号/字重/色阶逐级递减；②**亲密性**：同组信息靠近——`.mlist-double-head` 与 `.mlist-sub` 间距 4px；**条目内部不再用横线切断同一加工中心的信息**，数据区 `.mlist-double-foot` 用 `background:var(--n2)` 浅灰底 + `radius-sm` 圆角微块（对比+亲密性，一眼可扫）；③**对齐**：条目之间用一条 `border-top:1px solid var(--n4)` 横线区分（`.mlist-double + .mlist-double`），thumb(52px) 与文字块高度匹配禁撑高；④**重复**：同屏列表项统一字号/间距/灰底/横线，禁个别项特殊处理。**反例**：foot border-top 与条目间 border-top 双重横线导致区分混乱（2026-08-05 复盘）|
| 数据指标行（kv-row） | 卡片底部 / 数据指标行用 `.kv-row` 分 cell（flex + gap + 细线分隔）；**禁止"·"串文本**（如 `12,480 模 · 78% 负载`）——每项独立 cell、`<b>` value 用等宽字体、key 字色 n7 |
| Tag 尺寸推荐 | 卡片内 Tag 推荐 `.mtag-md` 或 `.mtag-lg`（24-28px 高，醒目）；`.mtag-sm`（20px 高）仅用于标签云/密集列表等次要场景 |
| Tabs 下划线指示器 | `.mtabs{overflow-x:auto;gap:24px;border-bottom:1px n4}`（支持 5+ Tab 横滑，滚动条隐藏；**5+ Tab 必须支持横滑**——模板已具备）；`.mtab{white-space:nowrap;flex-shrink:0;height:44px;border-bottom:2.5px transparent}`（不 flex:1 强等分，文字不被挤断）；`.mtab.active{color:var(--primary);border-bottom-color:var(--primary)}`（**下划线指示器选中态**——2026-08-04 用户拍板方案 B，替代胶囊实底）；`.mtab-add`（+ 新增）保持独立胶囊形态 |
| 多屏跳转 | 每屏一个 `<section class="page-view" data-route="…">`；hash 路由控制 `.on` 显隐（`go('#/route')`），返回用 `back()` |
| 弹窗 | `.mmask`（默认隐藏）+ `.mmodal`；`openModal('id')` / `closeModal()` 切换 `.show` |
| BottomNav 浮起 | `--shadow-bottom-nav` token（向上 6px + 12px rgba .08 + 1px 发丝线）；BottomNav 加 `position:relative;z-index:5` 浮在内容之上 |
| 长页 PNG | URL 加 `?export=1`（`<html data-export="long">` 按内容**完整高度**展开，不足 812 保持手机比例）→ DevTools「Capture full size screenshot」或 headless 截图 |
| 类名 | 一律 `m` 前缀组件类（白名单门禁），禁止自造布局类（页面级业务组件可接受 MED 提醒） |

### 4.4 HTML 预览交互演示清单（必读，2026-08-04 新增）

> 预览页**必须演示**以下交互（仅静态截图不算预览），否则视觉验收不完整：

| 交互 | 实现方式 |
|---|---|
| 列表项按压反馈 | `.anim-press`（active 时 scale(0.98)，100ms 极短反馈） |
| 列表进场动画 | `.anim-list-in`（容器类，nth-child 自动阶梯延迟 50ms，第 8 项后保持 0） |
| Tab 切换 | `.mtab.active` 视觉态 + hash 路由切屏演示 |
| **筛选滚动锚定（2026-08-05 终态，必读）** | 筛选组件（`.mtabs`）必须 `position:sticky;top:0;z-index:5;background:var(--n2)` 固定——**Tab 筛选/搜索过滤时组件本身固定不动，列表在下方变化，禁任何 scrollTop 重置**（v1 方案 `scrollTop=0` 会跳顶、v2 方案内容收缩致漂移均失败；正确做法见反例复盘：全部→针车群筛选后筛选条仍在视口顶部、列表在下方更新）。**切换 Tab 时不得调用 scrollTo/scrollTop 修改滚动位置** |
| 弹窗演示 | `.mmask.show` + ActionSheet（`.mmodal-item` 点击关闭） |
| 返回栈 | `back()` history.back；navbar 返回键随屏显隐 |
| Toast 反馈 | `.toast.show/.hide`（顶部滑入+停留+滑出，操作后反馈） |
| 搜索框聚焦 | `<input>` focus 态（msearch 自带 focus 样式） |
| 屏内滚动 | `.screen-scroll` overflow-y:auto（多屏内容超出滚动） |

新增 token-driven 类在 template.css「M5 交互演示类」段（`.anim-press` / `.anim-list-in` / `.toast`），禁止裸数字秒。

---

## 5. 平台差异对照表

> **已落地（2026-08-04 基准校准）**：`template.css` 新增 `.android` 平台类（Noto Sans 字体 + Material 圆角 8 + Ripple 近似：`:active` 径向背景扩散模拟水波纹），与既有 `.ios` 类（PingFang + 全胶囊圆角 + 高亮变暗）成对。页面 `<body class="ios">` / `<body class="android">` 声明目标平台。

| 属性 | iOS | Android | 处理方式 |
|------|-----|---------|---------|
| 字体-中文 | PingFang SC | Noto Sans SC | `.ios` / `.android` 类字体族 |
| 字体-英文/数字 | SF Pro | Roboto | 数字用 Roboto（等宽感更好）+ `.m-num` tabular-nums |
| 导航返回箭头 | `<` 符号风格 | ← 箭头图标 | 由「顶部导航」组件变体控制 |
| 按钮圆角 | 胶囊（=高/2） | 8px（radius-md） | `.android .mbtn` 覆盖 |
| 卡片圆角 | 10px（radius-lg） | 8px（radius-md） | `.android .mcard-b/.mcard-c` 覆盖 |
| 底部安全区 | 34pt | 0~24pt（视设备） | `env(safe-area-inset-bottom)` |
| Ripple 效果 | 无 | 有（Material Design） | `.android` :active 径向扩散近似 |
| 触控反馈 | 高亮变暗（scale .97） | 水波纹扩散 | `.ios` / `.android` 各自 :active |
| 卡片圆角 | 10px (iOS) | 8px (Android) | Token 差异覆盖 |
| 底部安全区 | 34pt | 0~24pt（视设备） | `env(safe-area-inset-bottom)` |
| Ripple 效果 | 无 | 有（Material Design） | Android 专用样式类 |
| 触控反馈 | 高亮变暗 | 水波纹扩散 | 平台原生行为，无需额外实现 |

---

## 6. 数据字段映射表

### 6.1 设备领域实体

```
Device（设备）
├── id: string          // 设备唯一标识 (SX-XXXX)
├── name: string        // 显示名称 (注塑机A-001)
├── model: string       // 型号 (SZ-2000)
├── status: enum        // 状态 (running/stopped/fault/maintenance)
│   ├── running    → 运行绿 #16A34A, 文字"运行中"
│   ├── stopped    → 灰色 N7 #6C757D, 文字"已停机"
│   ├── fault      → 红色 #EF4444, 文字"故障"
│   └── maintenance → 橙色 #F59E0B, 文字"维护中"
├── workshop: string   // 所属车间 (车间一区/二区/三区)
├── operator: string   // 当前操作员 (张工/李工/王工)
├── location: string   // 物理位置 (A区-03号线)
└── thumbnail: url      // 缩略图 (52×52, 圆角 8pt)

WorkOrder（工单）
├── id: string          // 工单编号 [后端自动生成]
├── type: enum          // 类型 (repair/maintenance/inspection) [表单输入]
├── deviceId: string    // 关联设备 ID [表单输入]
├── description: string // 故障描述 (10~500字符) [表单输入]
├── urgency: enum       // 紧急程度 (normal/urgent/critical) [表单输入]
│   ├── normal    → 蓝 #005EAE, 文字"普通"
│   ├── urgent    → 橙 #F59E0B, 文字"紧急"
│   └── critical  → 红 #EF4444, 文字"非常紧急"
├── reporter: string    // 报修人 [从登录会话提取]
├── createdAt: datetime // 创建时间 [后端自动生成]
└── status: enum        // 工单状态 (pending/in-progress/completed) [后端默认 pending]

KPI（关键指标）
├── totalDevices: number    // 设备总数 (白 #FFFFFF)
├── runningCount: number    // 运行中数 (运行绿 #16A34A)
├── faultCount: number      // 故障数 (红 #EF4444)
├── offlineCount: number    // 离线数 (灰 N7 #6C757D)
├── qualityRate: number     // 良品率 (%)
├── utilizationRate: number // 运行率 (%)
└── updatedAt: datetime     // 数据更新时间
```

### 6.2 列表 → 详情页数据传递

```
列表页点击事件 → 详情页接收参数:
{
  deviceId: "SX-2000",       // 用于 API 查询
  deviceName: "注塑机A-001",  // 详情页标题
  from: "list"                // 返回来源标识
}
```

---

## 7. Agent 生成 UI 时的检查清单

生成任何移动端页面后，逐项确认：

### Must Have（必须满足）

- [ ] 页面背景色 = `#F5F7FB` (N2)
- [ ] 顶部导航高度 = **88pt**（不是 44pt！）
- [ ] 画板 width=375 `FIXED`；Content 容器 width=375 `FIXED` + `clipsContent=TRUE`（见 §8 铁律 G1）
- [ ] 内容区左右 padding = **16pt**，有效内容宽度 = **343pt**
- [ ] **每个内容列元素 width=343 `FIXED`**（组件库默认 375 必须改！横向行用 `primaryAxisSizingMode`、纵向子节点用 `counterAxisSizingMode`，见 §8 G2/G3）
- [ ] 顶部导航 width = **375 `FIXED`**（非 360/其它）
- [ ] 卡片背景 = `#FFFFFF` (N1)，圆角 = **10pt**
- [ ] 主操作按钮颜色 = `#005EAE`，文字 = `#FFFFFF`
- [ ] 所有颜色来自 DESIGN-TOKENS.md（禁止硬编码 HEX）
- [ ] 字号 ≥ 12pt，正文 ≥ 14pt
- [ ] 按钮触控热区 ≥ 32pt（推荐 ≥ 40pt）
- [ ] 生成后用 §8.3 防溢出清单过一遍（Batch_read 抽查 3 个元素确认 width=343）
- [ ] **NavBar 只允许标题 / 返回 / 右侧操作**，禁模块级 tab 菜单（双导航）
- [ ] 跑门禁 `validate-spec.js`（移动端）→ **0 HIGH**

### Should Have（推荐满足）

- [ ] 列表项间距 = 16pt
- [ ] 搜索栏为 pill 形（全圆角），高 36pt
- [ ] 表单标签与输入值的字号一致（均为 16pt）
- [ ] KPI 区域使用品牌蓝底 + 语义色数值
- [ ] 卡片阴影使用 Shadow-M（y:0 blur:8）
- [ ] 辅助信息（时间戳/操作人）用 12pt 灰色

### Nice to Have（锦上添花）

- [ ] 平台差异化字体（iOS PingFang / Android Roboto）
- [ ] 列表骨架屏加载态
- [ ] 下拉刷新 + 上拉加载更多
- [ ] 空状态插图 + 引导文字
- [ ] 错误边界（网络异常/服务端错误）

---

## 8. 屏幕自动布局黄金法则（防溢出必读）

> **血泪教训**：在 Ardot 中实测搭建设备群览页时，Content（407px）、FilterRow（354px）、Nav（360px）连续溢出画板。
> 根因 = **组件库默认宽 375px（全框宽），而屏幕内容列实际宽 343px（375−16×2 gutter）**，插入实例不会自动适配父容器；父框架未锁 FIXED 宽也未 clipsContent。
> 以下法则为**强制规则**，生成任何页面前先应用，可 100% 避免再溢出。

### 8.1 屏幕搭建骨架（Screen Assembly Skeleton）

```
画板 Frame           width=375  height=812  sizingMode=FIXED  ← 绝对锁死，不允许超出
└─ 顶部导航实例         width=FIXED 375  (系统/类型按平台选)
└─ Content Frame     width=FIXED 375
                     layoutMode=VERTICAL
                     padding = 16 / 0 / 16 / 0   (上16 右0 下16 左16)
                     itemSpacing = 12 (组内) / 24 (组间分层时)
                     clipsContent = TRUE          ← 兜底，溢出即裁切
   ├─ SectionHeader  width=FIXED 343  primaryAxisAlignItems=SPACE_BETWEEN
   ├─ 统计/筛选行      width=FIXED 343  (横向行用 primaryAxisSizingMode=FIXED)
   ├─ 卡片/列表项      width=FIXED 343  (纵向子节点用 counterAxisSizingMode=FIXED)
   └─ ...            每个落入内容列的元素都必须显式 width=343
```

### 8.2 七条铁律

| # | 铁律 | 原因 |
|---|------|------|
| **G1** | 画板与 Content **必须 `FIXED` 宽 375**，Content 设 `clipsContent=TRUE` | 父框架不定宽，子元素一撑就溢出整页 |
| **G2** | 任何落入内容列的元素，**必须显式 `width=343`** + 对应 SizingMode=FIXED | 组件库默认 375，不手动改就撑破 16px gutter |
| **G3** | 纵向容器子节点用 **`counterAxisSizingMode:FIXED`**；横向行用 **`primaryAxisSizingMode:FIXED`** | 方向不同属性名不同，设错不生效 |
| **G4** | 插入实例后**立即复核其实际 width ≤ 343**（Batch_read 验证） | Ardot 插入不继承父宽，默认 375 会静默撑大 |
| **G5** | 横向行（FilterRow/统计条/区块头）：主轴对齐用 **`SPACE_BETWEEN`** + 间距用 Token（4/8/12），并算总宽 ≤ 343 | 标签按内容宽排 + 间距易超列宽（实测 354px 溢出） |
| **G6** | 所有带 padding 的框架插入实例后，**父框架设 `clipsContent=TRUE` 兜底** | 即便算错，视觉上也不会顶出画板 |
| **G7** | 复合组件（卡片B+内部列表）：Ardot **不可向实例内部插子节点** → 用外层 Frame 包裹卡片标题头与列表为同级，文档需标注此架构局限 | 实例内部子节点不可编辑，列表会被降级成兄弟节点 |

### 8.3 防溢出生成检查清单（Must-Check，生成后逐项过）

- [ ] 画板 width = 375 且 `FIXED`（非 HUG/AUTO）
- [ ] Content 容器 width = 375 `FIXED` + `clipsContent=TRUE`
- [ ] 顶部导航 width = 375 `FIXED`（非 360/其它）
- [ ] **每个内容列元素 width = 343**（`Batch_read` 抽查 3 个确认，非 375/354/407）
- [ ] 横向行（筛选/统计/区块头）总宽 ≤ 343，对齐 `SPACE_BETWEEN`
- [ ] 列表项 / 卡片为 `FIXED` 343，非自适应撑大
- [ ] 无元素 x+width > 375（右侧留白 ≤ 16）

### 8.4 关键认知（写进 Agent 记忆）

> **组件库尺寸 ≠ 屏幕落位尺寸**。
> 组件规格里的 `width=375px` 是它在 Figma **独立画框**里的全宽；在带 16px gutter 的真实屏幕里，它的落位宽必须是 **343px**。
> 任何"把组件放进屏幕"的操作，第一步永远是：**设 width=343 + FIXED**，而不是先插再修。

---

> 最后更新: 2026-08-03 | 基于 Ardot Figma 提取 + 人工审核 + 设备群览页防溢出复盘


## 9. 组件体系规格（2026-08-04 按 Design System 参考图补齐）⚠️ 必读

> 本表是移动端 HTML 预览的**组件真源规格**（template.css 已落地，Agent 生成页面时按此组合）。类名白名单门禁自动跟随 template.css，用错即报。

### 9.1 按钮体系（图2「按钮 / Button」参考）

| 类别 | 类名 | 尺寸 | 圆角 | 用途 |
|---|---|---|---|---|
| 大按钮 | .mbtn .mbtn-lg | 高 48 / 最小宽 120 | **胶囊**（48/2=24）| 主操作（提交/确认/登录）|
| 次按钮 | .mbtn .mbtn-md | 高 40 / 最小宽 80 | 胶囊 | 常规操作（打开/更多）|
| 小按钮 | .mbtn .mbtn-sm | 高 32 / 最小宽 64 | 胶囊 | 行内次要操作 |
| 极小按钮 | .mbtn .mbtn-xs | 高 24 / 最小宽 48 | 胶囊 | 标签内嵌操作 |
| 登录大按钮 | .mbtn .mbtn-login | 高 56 / 宽 300 | 胶囊 | 全宽主 CTA |
| 语义变体 | .mbtn-primary/-secondary/-text/-danger/-success | — | — | 主/次/链接/危险/成功 |
| 按压态 | :active | — | scale(.97) | 物理按压反馈（参考图"按压"）|
| 图标按钮 | .mbtn .m-icon | 16px + margin-right 6 | — | 按钮内图标 |

**铁律**：按钮圆角 = 高度/2（胶囊）；**禁用方角/小圆角按钮**（廉价感根源）。

### 9.2 标签体系（图2 标签参考）

| 变体 | 类名 | 场景 |
|---|---|---|
| 默认（品牌蓝）| .mtag .mtag-default | 主要分类 |
| 成功 | .mtag .mtag-suc | 正常/完成 |
| 警告 | .mtag .mtag-warn | 待维护/注意 |
| 失败 | .mtag .mtag-err | 故障/告警 |
| 中性 | .mtag .mtag-neutral | 默认/通用 |
| 运行 | .mtag .mtag-run | 运行中（工控专用绿）|
| 尺寸 | .mtag-lg(28) / .mtag-md(24) / .mtag-sm(20) | 卡片内用 md/lg，sm 仅密集场景 |
| 前后缀图标 | .mtag .mtag-icon / .mtag-suffix | 含图标标签 |

### 9.3 弹窗体系（图3「弹窗 / Dialog」参考）

| 弹窗类型 | 结构 |
|---|---|
| 底部 ActionSheet | .mmask > .mmodal（标题 + .mmodal-item 操作行 + .mmodal-cancel 取消 + home indicator）| **iOS 官方 ActionSheet 化（2026-08-06）**：标题 13px 灰（n7）居中；选项 **17px 品牌蓝居中、无分隔线**；destructive 项 `.on` 红色；取消**独立分区**（8px 灰底间隔 + 600 加粗）。行高契约不变（title 46 / item 56） |
| 居中 Dialog | .mmask.mmask--center > .mdialog（.mdialog-title 标题居中 + .mdialog-body 内容 + .mdialog-foot 取消/确认 + home indicator）|
| 单选/多项 | .mdialog-body > .md-item（on 选中态）|
| Home Indicator | .m-home-indicator（iOS 黑线 21px）—— **所有弹窗/底部导航/页面底部必带**（真机感）|

**铁律**：弹窗底部取消/确认按钮条 + home indicator；标题居中；禁用无按钮裸弹窗。

### 9.4 导航体系（图4「导航 / Navigation」参考）

| 形态 | 结构 |
|---|---|
| 顶部导航（三槽位）| .navbar-main > (.navbar-back 返回 + .navbar-title 标题 + .navbar-actions 右侧操作) |
| 搜索嵌入 | .navbar-search（内嵌输入 + 放大镜）+ .navbar-cancel（iOS Cancel）|
| 底部导航 | `.bottomnav` > `.bn-item`（图标 + 文字 + **选中实底圆点** .bn-item.active .bn-icon::before + .bn-badge 消息角标）+ **`.m-home-indicator--show`**（absolute 底部安全区，2026-08-06 铁律补全）|
| 标签导航 | .mtabs > .mtab（胶囊 + .m-tabdot 消息红点 + .mtab-add 可写新增）|
| 状态栏 | .m-statusbar（9:41 + 信号/WiFi/电量 svg；iOS 44 / Android 24；品牌色 .m-statusbar--brand）|
| Home Indicator | .m-home-indicator |

**铁律**：顶部导航必带 StatusBar（真机感）；底部选中态 = 实底圆点 + 图标/文字品牌色；禁用旧"仅文字变色"选中态。

### 9.5 列表卡片体系（图1 + 图5 参考）

| 组件 | 类名 | 变体 |
|---|---|---|
| 单元格 | .m-cell | 纯文字 / + .m-cell-chevron / + .m-cell-icon / + .m-cell-radio.on / + .m-cell-value key-value / 国家地区 / 上传预览 |
| 头像条目 | .m-item > .m-avatar(-sm/md/lg) + .m-item-text > (.m-item-title + .m-item-desc) + .m-item-more | 两级/三级 |
| 卡片 | .mcard > (.mcard-head > .mcard-title + .mcard-tag) + .mcard-body(.mcard-row) + .mcard-foot | 状态 Tag 右上 + 详情行 + chevron + .mcard.folded 折叠 |
| 上传 | .m-upload > .m-upload-item + .m-upload-add | 缩略图网格 + 删除角标 |
| 进度条 | .m-progress(-run/warn/err) > .m-progress-bar > .m-progress-inner + .m-progress-text | 绿色运行态/警告/错误 + 数值 |
| 数值工具 | .m-num(-md/-lg) | 工控数值 tabular-nums 对齐 + mono |

**铁律**：卡片圆角 10pt（radius-lg）+ 2dp 投影（elev-raised）；数值一律 .m-num 系列（对齐不漂移）；卡片右上状态 Tag 用 .mcard-tag。

### 9.6 页面区域划分（App 首页范式，2026-08-04 新增）⚠️ 必读

> 移动端页面（尤其首页/看板）按**区域划分**组织内容，自上而下：

```
状态栏（透明悬浮）→ 导航栏（品牌色）→ 首焦区 Hero → 金刚区 KingKong
→ 胶囊区 Capsule → 瓷片区 Porcelain → 列表区 → 标签栏 TabBar + home indicator
```

| 区域 | 类名 | 内容 | 要求 |
|---|---|---|---|
| 状态栏 | `.m-statusbar` | 时间 9:41 + 信号/WiFi/电量 | **透明悬浮**（absolute 在 navbar 上，白字）；白底导航栏用 `.m-statusbar--light` 深色字 |
| 导航栏 | `.navbar` | 返回 + 标题 + 右侧操作 | 品牌色背景延伸到状态栏区域（iOS 88 / Android 80 含状态栏，内容区 padding-top 下推） |
| 首焦区 | `.m-hero` | 运营焦点/banner（标题 + 副文 + 主数字 + CTA） | 品牌色大圆角卡 + 右上装饰圆；CTA 白色胶囊按钮 |
| 金刚区 | `.m-kingkong > .m-kk-item` | 4-8 个常用功能入口（4 列宫格，icon + 文字） | **精致化（2026-08-06 拍板：金刚区=流量分发视觉中心）**：白卡 `radius-lg` 大圆角 + elevation；icon 底 **48×48 浅品牌渐变**（`linear-gradient(145deg, primary-dis-bg → n2)`）+ `radius-lg` + `shadow-s` 轻投影；icon 24px 品牌蓝 SVG；文字 500/n9。参考消费级「渐变底+大圆角+阴影」，色板收敛为工控品牌浅色系，**禁 AI 粉紫糖果渐变** |
| 胶囊区 | `.m-capsule` | 公告/快捷操作条（如"3 台设备待维护"） | 圆角胶囊 + primary-dis-bg 浅色底 + 右箭头；**padding 0 16 / gap 8**（4px 网格 + iOS 惯例，2026-08-06 修正） |
| 瓷片区 | `.m-porcelain`（4 列）/ `.m-porcelain--lg`（2 列）> `.m-po-item` | 宫格磁贴（KPI/数据卡/内容块） | 白瓷块 + label + 数值(.m-po-value) + trend；语义色 run/warn/err/suc |
| 列表区 | `.page-view` 内 section-title + mlist/mcard 组 | 列表/详情流 | 遵循 §4.3 间距节奏（屏内 gap 16 / title margin 0 8） |
| 标签栏 | `.bottomnav` | 4 tab 图标 + 文字 | 选中态图标+文字品牌色（无实底点）；底部 + `.m-home-indicator` |

**铁律**：首页必须有 ≥3 个区域（首焦/金刚/瓷片至少其一，列表区必带）；导航栏上必须透明 StatusBar（非独立白条）；区域间间距 16px（`.screen`/`.page-view` gap，见 §4.3 双容器机制）。

### 9.7 图表布局规范（Chart Layout，2026-08-05 新增）⚠️ 必读

> **完整真源 = 仓库根 `CHART-SPEC.md`**（2026-08-06 建立：通用决策流程 / 两端差异 / 门禁口径 / 扩展类型指引）。本节约为移动端布局摘要，冲突以 CHART-SPEC 为准。

> **血泪教训**：设备群览页产能趋势柱状图曾出现 X 轴标签（`08:00` 等）与柱体底部重叠——SVG `viewBox="0 0 320 130"` 中柱底 `y+height=126`，而 X 轴文字基线 `y=122`、字形下缘约 124-125，直接压在柱体底上。根因 = **规范只约束了 viewBox 右侧边距（Web GENERATION-SOP §4.5），从未定义 X 轴标签区与绘图区在 Y 方向的边界**。
>
> **核心原则：SVG 纵向三段式——绘图区 + 标签保护区 + 标签区，三段互不侵犯**：
>
> ```
> ┌─────────────────────────────┐  viewBox 顶部
> │          绘图区               │  网格线 / 目标线 / 柱体 / 折线（主数据）
> │  (柱体底边 = 数据基线)         │
> ├─────────────────────────────┤  数据基线
> │        标签保护区（≥8px）      │  柱体底边与标签文字顶的缓冲，禁内容
> ├─────────────────────────────┤  标签区上沿
> │        X 轴标签区             │  时间/类别文字（基线居中）
> └─────────────────────────────┘  viewBox 底部
> ```

| 规则 | 值 | 约束 |
|---|---|---|
| **viewBox 高度公式** | `viewBoxH ≥ 最高数据元素高 + 顶余量(≥8px) + 标签区(≥16px) + 保护区(≥8px)` | 例：最高柱 106px → `viewBoxH ≥ 140`（4px 网格取整）|
| **柱底/数据基线上限** | `柱底 y+height ≤ viewBoxH − 23`（= 标签基线 6 + 字高 9 + 保护区 8）| 例：`viewBox 0 0 320 140` → 柱底 ≤ 117；**原页面 320×130 + 柱底 126 严重超限 → 重叠** |
| **X 轴标签基线** | `标签 y = viewBoxH − 6px` | 例：`viewBox 140` → `y=134`；字形下缘 ≈ y+2，不触 viewBox 底 |
| **标签保护区** | 柱底边与标签文字顶间距 **≥ 8px** | 禁柱体/折线/网格线伸入标签区；文字禁上浮与柱体重叠 |
| **网格线/目标线** | 全部落在绘图区内（数据基线之上） | 禁网格线穿过标签区 |
| **纵向边距双轴一致** | 右侧边距同 GENERATION-SOP §4.5（x ≤ 宽−20） | 底部边距 = 标签区 + 保护区，两侧对称克制 |
| **容器高度配套** | `chart-box` 高度与 `viewBoxH` 一致（1:1 不缩放，禁 `preserveAspectRatio="none"` 拉伸变形）| 原 `height:130px` + viewBox 130 装不下 106px 柱 → 重生成改 `height:140px` + viewBox 140 |

**反例（禁）**：柱底 `y+height=126` + 标签基线 `y=122` → 文字压柱体（重叠，320×130 时柱底应 ≤107）；标签基线 `y=128` 超出 viewBox → 字形被裁切（`overflow:visible` 只是兜底，禁依赖）。
**自检**：生成图表后逐项过——①柱底 y+height ≤ viewBoxH−23 ②标签基线 y = viewBoxH−6 ③标签文字顶 ≥ 柱底 + 8px ④网格线/目标线 y ≤ 柱底 ⑤chart-box 高度 = viewBoxH。

---

> 最后更新: 2026-08-04 | 组件体系规格（§9）+ 页面区域划分 9.6


## 10. 布局美学规范（2026-08-04 新增 · 本地化改写自 ui-ux-pro-max 审美规则）⚠️ 必读

> **来源**：抽取 ui-ux-pro-max（57 风格/99 UX 规则库）中适用于工控移动端的审美规则，改写进弘讯语境。
> **不抽取**：Touch/a11y 触达（弘讯已按 M3 48dp 覆盖）、性能、动效（弘讯 M1-M5）、图表（弘讯 chart 规范）、字体配对/行业色板（弘讯已定品牌色 #005EAE + PingFang/Noto）。
> **目标**：Agent 生成页面时有「美丑标准」可依——门禁保证"不犯错"，本规范保证"不难看"。

### 10.0 排版四原则总纲（Robin Williams《写给大家看的设计书》，2026-08-05 引入）⚠️ 必读

> **Agent 排版任何模块/组件前，先对照四原则自查**；本总纲是 §4.3 组件排版规范（双行列表等）的上层理论，具体组件数值以对应章节为准。

| 原则 | 定义 | 落地要点（弘讯移动端） |
|---|---|---|
| **亲密性 Proximity** | 相关元素放一起，不相关元素分开 | 同一信息组间距小（4-8px）、不同信息组间距大（12-16px）+ 分隔线/底色；**禁全屏等距**（所有间距一样 = 无分组）|
| **对齐 Alignment** | 页面上每个元素都与某条线对齐 | 同列文字左对齐、数值右对齐（tabular-nums）、图标/文字基线对齐；**禁随意偏移** |
| **重复 Repetition** | 一致的视觉元素贯穿全篇 | 同类组件字号/间距/圆角/色阶一致；列表项统一；**禁同屏同类项样式漂移** |
| **对比 Contrast** | 不同层级必须有明显差异 | 文字三档递减（标题>副文>元信息，字号+字重+色阶）；状态色只点状态；**禁两层相似难辨**（如 14px vs 16px 同色）|

**四原则应用顺序**：先分组（亲密性）→ 再对齐 → 统一重复 → 最后用对比突出层级。
**反例**（设备群览页复盘 2026-08-05）：①双行列表 sub 14px 与 title 16px 同色 → 对比不足；②条目内 3px 与条目间 44px 失衡 → 亲密性错误；③foot border-top 与条目间 border-top 双重横线 → 信息区分混乱（修复：条目内数据区用 n2 浅灰底、条目间一条横线）。

### 10.1 审美总则（工控美学三原则）

1. **克制**：数据说话，装饰最少。无渐变滥用、无 AI 粉紫渐变色（廉价感第一大来源）、无无意义的动效循环。
2. **层次**：每屏只有一个视觉焦点（首焦区 Hero），内容按「主数字 → 副文 → 元信息」三级递减。
3. **数据化**：数字用 `.m-num`（tabular-nums 对齐）、语义色只点状态（run/warn/err），不整屏铺色。

### 10.2 构图（首屏分区 + 区域占比）

| 规则 | 值 | 依据 |
|---|---|---|
| 首页必含区域 | ≥3 个（Hero/金刚/瓷片至少其一 + 列表区必带）| §9.6 |
| Hero 高度 | ≥120px（占首屏 1/6-1/5）| 视觉焦点 |
| 金刚区 | ≤2 行（8 个入口封顶）| 超出显拥挤 |
| 瓷片区 | ≤2 行 | 数据磁贴不堆叠 |
| 首屏信息 | 不超过 5 个信息块（Hero/金刚/胶囊/瓷片/趋势）| 防信息过载 |
| 卡片 | ≤3 行核心信息 + 1 行 foot（.kv-row）| 密度阈值 |

### 10.3 层次（文字语义类，2026-08-04 升级：哪里改用什么层级）

> **移动端 8 级文字语义类**（`.m-text-*`，对齐 antd-mobile 字阶 + typography 9 级）——**Agent 生成时按语义选类，禁用裸 font-size**（门禁 `text.layer`：裸 inline font-size ≥3 且无语义类 → MED）。

| 语义类 | 字号/行高/字重 | 用在哪 |
|---|---|---|
| `.m-text-h0` | 26/34/600 | 页面主视觉大标题（Hero 主数字区、全屏大标题）|
| `.m-text-h1` | 24/32/600 | 页面主标题 |
| `.m-text-h2` | 20/28/600 | 区块大标题 |
| `.m-text-h3` | 17/24/600 | 导航栏、卡标题 |
| `.m-text-h4` | 18/26/600 | 卡内大标题、模块副标题（2026-08-06 新增）|
| `.m-text-body1` | 16/24/400 | 列表主文（设备名）|
| `.m-text-body2` | 14/22/400 | 常规正文 |
| `.m-text-body3` | 15/22/400 | 次级正文、详情描述（2026-08-06 新增）|
| `.m-text-caption` | 12/16/400 n7 | 元信息、时间、辅助 |
| `.m-text-note` | 13/20/400 n7 | 次级辅助说明（2026-08-06 新增）|
| `.m-text-label` | 12/16/500 | 表单标签、卡 label |
| `.m-text-num` | 16/22/600 mono | 数值（= .m-num 升级）|

| 规则 | 值 |
|---|---|
| 主数字 | `.m-text-num` / `.m-num-lg`（24px）|
| 副文 / 元信息 | `.m-text-caption`（12px n7）|
| 正文对比度 | **≥4.5:1**（反例：n5 #CED4E4 作正文 = 2.8:1 不合格；n7 #6C757D on n1 ≈ 4.6 合格）|
| 标题层级 | h1 → h3 → body2 → caption，顺序不跳级 |
| 禁裸 font-size | `<style>`/inline 禁用裸 font-size（门禁 text.layer 强制）|

### 10.3b 前景/背景色使用（2026-08-05 终态：审美优先，WCAG 2.0 仅参考）

> **总则（用户拍板 2026-08-05）**：**最重要的是视觉美观，遵循审美规范**；WCAG 2.0 对比度作为参考基线、不作硬性门禁。功能色标签/按钮用**白字**（视觉通透、清爽），深字方案废弃（用户反馈「标签深色字不通透」）。
> **标准参考**（不强制）：普通文字 ≥4.5:1（AA）；大文本（≥18pt 或 ≥14pt 粗体）与图形/UI 组件 ≥3:1。纯颜色不单独传达信息（配文字/图标）。

**弘讯亮色组合表（白字 on 功能色为设计首选，对比度仅供参考）**：

| 组合 | 对比度 | 说明 |
|---|---|---|
| `n8/n9/n10 on n1·n2·n3` | 8.7~15.0 | 正文标准 |
| `n7 on n1` | 4.69 | 辅助文 |
| `n1 on primary / primary-active` | 6.54 / 7.69 | 品牌按钮白字 |
| `n1 on suc` / `n1 on warn` / `n1 on run` / `n1 on err` | 2.15~3.76 | **功能色标签/按钮白字（设计首选，视觉通透；对比度仅供参考）** |
| `n6 on n1` 2.07 / `n5 on n1` 1.48 | — | 禁用态、占位符、装饰（不作正文）|

**组件文字色规范（template.css 已落地，2026-08-05 终态）**：

| 组件 | 文字色 | 说明 |
|---|---|---|
| `.mtag-suc` / `.mbtn-success` | **白 `var(--n1)`** | 08-05 改回白字（原深字不通透）|
| `.mtag-warn` | **白 `var(--n1)`** | 同上 |
| `.mtag-err` / `.mbtn-danger` | **白 `var(--n1)`** | 同上 |
| `.mtag-run` | **白 `var(--n1)`** | 同上 |
| `.mtag-neutral` | `var(--n8)` on `var(--n3)` | 中性灰底深字保持 |
| `.mtag-default` | 白 `var(--n1)` on primary | 保持 |

> **暗色模式**：功能色底变亮（suc #34D399 等）时白字对比度不足，`template.css` 已加 `:root[data-theme="dark"]` 覆盖用深字 `n1`；亮色模式一律白字（审美优先）。

### 10.4 密度与留白

| 规则 | 值 |
|---|---|
| 相邻触达元素间距 | **≥8px**（按钮组 gap）|
| 基础区域间距 | 12px（`.screen gap` + `.page-view gap` 双容器，见 §4.3；2026-08-05 终态）|
| **投影卡片叠** | **12px**（`.mcard`/`.mlist`/`.mlist-double`/`.mlist-triple` 相邻——**纯 gap，无 margin 叠加**）|
| **区域交界间距** | **12px**（Tab/搜索/胶囊/Hero/瓷片/金刚 与后续卡片——**纯 gap 12px，margin 全部归零**；2026-08-05 v10 终态：v9 的 gap12+margin4=16 视觉实测 21px（把 box-shadow 外框算进间距），用户反馈「间距改错方向，是否把组件外框算进去了」）|
| **卡片叠** | **12px**（卡片与卡片：纯 gap）|
| 卡片内 padding | 14-16px |
| 卡片信息密度 | ≤3 行核心信息；foot 数据指标用 `.kv-row`（禁 · 串）|

**§10.4 间距终态（2026-08-05 v10，用户拍板）**：工业后台紧凑档——**间距纯由 flex gap 控制（12px），禁任何 margin 叠加**。组件外框（box-shadow 外扩、border）不计入间距；v9「gap12+margin4=16」视觉实测 21px 的根因 = box-shadow 外扩被误当作间距（用户：「间距改错方向，是否把组件的外框算进去了」）。

**克制间距体系（v10 终态，单一 gap 12px）**：
| 层级 | 间距 | 实现 |
|---|---|---|
| 基础区域 | 12px | `.screen gap`（多屏间）+ `.page-view gap`（屏内）|  
| 卡片状容器内子 | 12px | `.kpi-grid`/`.anim-list-in`/`.mtabs` gap:12px !important |
| 卡片与卡片叠 | 12px | `.screen > .mcard + .mcard, .page-view > .mcard + .mcard{margin-top:0}`（**纯 gap，margin 归零**）|
| 线状组件（Tab/搜索/胶囊）| 12px | `.mtabs,.msearch,.m-capsule{margin-bottom:0 !important}`（纯 gap）|
| 区域交界（Tab/搜索/胶囊/Hero/瓷片/金刚 → 卡片状容器）| 12px | `.screen > X + Y, .page-view > X + Y{margin-top:0}`（纯 gap）|
| 网格宫格（金刚/瓷片）| 12px / 8px | `.m-kingkong gap:12px 8px` / `.m-porcelain gap:8px` 保持紧凑（2026-08-06 4px 网格归位，14→12） |

> ⚠️ **2026-08-05 复盘沉淀**：此前 §4.5 间距补丁全部写死 `.screen > X + Y` 且 `.page-view` 为 `display:block`，而标准结构是 `.screen > .page-view > 模块`——**gap 只作用于多屏之间、屏内模块间距全部落空，Hero→瓷片→产能卡→胶囊之间 0px 贴死**。修复：① `.page-view` 改为 flex gap:16px；② 所有间距补丁选择器**必须同时覆盖 `.screen >` 与 `.page-view >`**；③ 类名必须与真源一致。**生成页面时若模块间贴一起，先查这两点，禁止用页面级 margin 硬顶（规范级间距一律 `!important` 兜底页面级覆盖，页面级禁止覆盖规范 token）。**
| 留白呼吸 | 内容块之间必有 gap；禁"贴一起"（§4.3 间距节奏）|

### 10.5 色彩克制

| 规则 | 值 |
|---|---|
| 主色（品牌蓝）面积 | ≤30% 页面（Hero/按钮/导航允许，内容区克制）|
| 语义色 | 只点状态（Tag/数值/进度条），不铺底 |
| 背景层次 | n1 卡 / n2 页 / n3 分隔，功能色 soft 只做图标底 |
| 禁止 | AI 粉紫渐变 / 纯黑底 + 霓虹色 / 满屏单一功能色 |

### 10.6 视觉反馈与层级（本地化自 ui-ux-pro-max Interaction/Stacking 类）

| 规则 | 实现 |
|---|---|
| 按压反馈 | `.anim-press` 或 `:active` scale(.97)（按钮/卡片/列表项必带）|
| 成功反馈 | 操作成功 toast（`window.board.toast`）|
| 选中态 | 胶囊 active / 品牌色双激活（§9.4）|
| z-index 分层 | 系统化：mask 10 / toast 20 / 弹层 30 / 全屏 50 —— **禁任意 9999** |
| 内容防跳动 | 图表/异步区定高（.chart-box height:180px）；禁无尺寸图片堆叠 |
| 移动端 100vh | 用 `.phone` 固定 375×812（勿 100vh，浏览器 chrome 裁切）|

> **自动添加（2026-08-06 拍板：生成页面即携带交互，不得输出无反馈页面）⚠️ 必读**
> 生成 HTML 页面时按组件语义自动附加动效与交互；时长一律走 `var(--motion-duration-*)`（门禁 checkMotion：transition 裸值 HIGH / animation 裸值 MED）。

| 元素 | 交互反馈 | 动效 token |
|---|---|---|
| 可点元素（按钮/卡片/列表项）| 触摸按压 `.anim-press` / `:active` scale(.97) | fast |
| 列表/分组进入 | `.anim-list-in`（屏内进入动画）| normal |
| 屏切换（hash 路由）| 屏切换过渡（fade / slide，走 anim-* 工具类）| fast |
| 弹窗 / ActionSheet | 遮罩 fade + 面板 scale 展开 | fast |
| Toast | 滑入 + 淡出 | fast |
| Tab / 筛选切换 | 激活态过渡（下划线 / 胶囊）| fast |
| 返回栈 | 二级页 push/pop 过渡（inter-detail + navBack）| fast |

交互 JS（路由 / 返回栈 / 重播 / 步进器 / 折叠 / Toast）随页面一起生成，参照展示页脚本段。

### 10.7 审美基调参数（V/D/M，2026-08-04 本地化自 ui-pipeline 阶段 1，不引入外部 skill）

> 工控移动端**适度放宽**基调（"稍微改一点点，不能过"——太工业端死板，放宽后保持克制）：

| 参数 | 含义 | 当前（放宽后）| 边界（不能过）| 落地 token |
|---|---|---|---|---|
| **V** VARIANCE | 视觉方差（活泼度）| **3**（原 2）| ≤4 | 动效种类/微交互适度（按压/入场/切换）|
| **D** DENSITY | 信息密度 | **5**（原 6）| 4-5 | `--density-row-height:52px`（原 56）|
| **M** MOTION | 动效强度 | **4**（原 3）| ≤4 | `--motion-duration-*:120/240/360/480ms`（原 100/200/300/400）|

**说明**：动效放宽 20% 更柔和自然（接近 iOS 275ms / Material 300ms）；密度 56→52 更透气紧凑。**不引入 ui-pipeline skill 本体**（与 §10 提取 ui-ux-pro-max 同理：本地化数值进规范，外部 skill 不依赖）。

### 10.8 反廉价清单（Anti-Patterns，生成后自查）

- [ ] 满屏品牌蓝（>30%）→ 收敛为 Hero/按钮/导航
- [ ] 卡片无投影/无圆角（贴纸感）→ `.elev-raised-shadow` + radius-md（8px；iOS 10px）
- [ ] 文字一长串无层次（· 串/同字号平铺）→ `.kv-row` + 三级字阶
- [ ] 首屏堆 >5 信息块 → 折叠到次级屏
- [ ] 动效循环不停（转圈/闪烁）→ M1-M5 单次/入场动效即可
- [ ] 数值不用 .m-num（数字错位）→ tabular-nums
- [ ] 颜色混用 Web 功能色（#389E0D 等）→ 移动端功能色
- [ ] 无空态/无按压反馈/操作无 toast → 补齐交互反馈

### 10.9 生成后视觉自检闭环（必做）

1. 页面生成 → `headless` 截图（`--virtual-time-budget=6000` 等动画播完）
2. 按 §10.7 清单自查（构图/层次/留白/色彩 4 项）
3. 不合格 → 回改；合格 → 交付（门禁 + 截图双证）

---

> 最后更新: 2026-08-04 | §10 布局美学规范（本地化改写 ui-ux-pro-max 审美规则）


---

### 10.10 页面级自造类守则（2026-08-06 拍板修订 v2：解禁视觉属性·禁覆写真源·门禁落地）⚠️ 必读

> **平衡原则：Agent 可以自造（含视觉属性），但必须引用现有原子 token——禁止产生新的裸值。**
> 自造前先自问：我引用的每个值，是否都落在现有 token 上？

**① 优先级铁律——自造是最后手段，不是默认选项**

生成任何页面元素前按序尝试，上一步能解决就停：

| 顺序 | 手段 | 说明 |
|---|---|---|
| 1 | **组合** | 现有组件 + 变体 + 容器原语拼装（90% 需求止步于此）|
| 2 | **变体** | 现有组件加状态/尺寸/语义变体（`.mtag-run`、`.mbtn-danger`、折叠态等）|
| 3 | **页面级自造** | 前两步不满足、且为一次性业务形态时，允许自造类（**含视觉属性**）|
| 4 | **禁止** | 产生**新的裸值**（新 hex/新字号/新间距值/新动效秒数）——必须引用现有 token；新增原子是兜底资源、不是自造许可 |

**② 三步判定（三步全过才自造）**

- [ ] 现有组件 + 变体确实无法表达该业务形态？
- [ ] 非复用性（页面级）而非通用需求？（通用需求 → 走上报维护者通道，不自行造组件）
- [ ] 自造类引用的每个值都能落在现有 token 上（无新裸值）？

**②b 边界判定表（新结构 vs 新原子，2026-08-06 M2 落地）**

| 自造内容 | 判定 | 依据 |
|---|---|---|
| 布局类 `.gantt-row`（flex/grid/间距=token）| ✅ 新结构，随便造 | 不产生新值 |
| 视觉类 `.warn-strip` 但颜色/字号/圆角全走 token | ✅ 新结构 | 值全落 token |
| 视觉类含**新 hex**（如 `#A1B2C3`）| ❌ 新原子 | 产生新值 → 上报维护者补 token |
| 含**新字号**（如 15px）| ❌ 新原子 | 同上 |
| 含**非 4px 网格值**（如 18px）| ❌ 违规 | 网格铁律，门禁 MED `grid.4px` |
| 覆写 `.mcard`/`.mbtn` 等真源组件类 | ❌ 禁（H2）| 门禁 HIGH `css.override` |

**③ 自造底线（即使自造也必须守）**

- 颜色必须 `var(--*)` 禁裸 hex · 文字必须 `.m-text-*` 禁裸 font-size · 动效必须 `var(--motion-duration-*)` 禁裸秒
- **4px 网格**：所有 px 值 %4==0（**含 calc 内**）
- **禁覆写真源组件类**（`.mbtn`/`.mcard`/`.mtag`/`.mlist*` 等 template.css 组件）——需调整用变体/组合/上报维护者
- 语义命名（`.clock-card`，禁 `.a1`/`.box1`）· **禁 `m-` 前缀**（保留给正式组件）· 禁与真源类重名
- 自造类数量 >10 = 「组合失败」信号，回退组合方案重做
- 自造类**不要求登记/注释**（使用者页面不出现维护注释，2026-08-06 拍板）

**④ 新增原子是兜底资源、不是自造许可**

- 原子已补齐（图表色 13 / 间距 8 档 / 字阶 12 级 / soft 6 / 图标 70），自造前必须确认现有原子不可用
- 原子确实不足 → 走「上报维护者」通道，**不自造原子**

**⑤ 门禁口径（2026-08-06 P2 落地，两端 validate-spec.js 已实现）**

- 自造布局/视觉类（值全 token）= 规范内合法扩展，`class.self-defined` MED 可接受（非违规）
- **覆写真源组件类 → HIGH `css.override`**（checkOverride）
- 自造类**非 4px 布局值（含 calc 内）→ MED `grid.4px`**（checkGrid4px）
- 自造类**裸 font-size → MED `text.layer-custom`**（checkCustomProps）
- 裸 hex / 裸动效秒 = 既有门禁 HIGH/MED，必须修

---

## 11. 组件级样例表（2026-08-04 新增 · 提取自 antd-mobile + WeUI 观感基准）⚠️ 必读

> **来源**：antd-mobile（字阶/间距/组件语义最完整）+ WeUI（微信官方，卡片极简观感）。
> **用途**：Agent 生成组件时"观感对照"——每个组件给"推荐观感/字重/圆角/间距"，避免凭感觉写。

### 11.1 按钮（对照 antd-mobile Button）

| 维度 | 当前 | antd-mobile 基准 | 结论 |
|---|---|---|---|
| 高度 | md 40 / lg 48 | 32/40/48 | ✅ 已对齐 |
| 字重 | 500 | 500 | ✅ |
| 圆角 | 胶囊（=高/2）| 胶囊（含边框按钮）| ✅ |
| 按压 | scale .97 | color/背景变 | ✅ |
| 文字按钮 | .mbtn-text | 支持 | ✅ |

### 11.2 标签 Tag（对照 antd-mobile Tag + WeUI）

| 维度 | 基准 | 结论 |
|---|---|---|
| 5 色语义 | antd-mobile 5 色 | ✅ 已对齐（default/suc/warn/err/neutral）|
| 圆角 | antd-mobile 圆角 4px / WeUI 胶囊 | ✅ 胶囊（radius-full）|
| 尺寸 | 小 20 / 中 24 / 大 28 | ✅ |

### 11.3 列表（对照 WeUI Cells + antd-mobile List）

| 维度 | 当前 | 基准 | 结论 |
|---|---|---|---|
| 行高 | mlist 56 / mlist-double 92 | WeUI 单行 50-56 | ✅ |
| 分隔 | 卡片化（圆角+投影）| WeUI 平铺+1px 线 / antd 卡片 | ✅ 卡片化（工控语义）|
| 文字 | .m-text-body1/body2 | 同 | ✅ 语义类 |

### 11.4 卡片 Card（对照 WeUI 极简观感）

| 维度 | 基准 | 结论 |
|---|---|---|
| 圆角 | WeUI 8px / antd 12px | ✅ radius-md（8px）——2026-08-05 统一：卡片禁 lg(16px)，iOS 覆盖 10px |
| 内边距 | 14-16px | ✅ |
| 阴影 | 轻（0 2px 8px 品牌蓝）| ✅ v8 定稿（用户拍板保留质感）|
| 卡头 | 标题左 + 状态 Tag 右 / --center 变体 | ✅ |

### 11.5 输入框 Input（对照 antd-mobile Input）

| 维度 | 基准 | 结论 |
|---|---|---|
| 高度 | 36px | antd 40px | ⚠️ 建议 40px（触达更友好）|
| 圆角 | radius-lg（16）| antd 8px | ⚠️ 建议 radius-md（8px，更收敛）|

### 11.6 弹窗 Dialog（对照 antd-mobile Dialog + WeUI）

| 维度 | 基准 | 结论 |
|---|---|---|
| 居中弹窗 | 标题 + body + foot 取消/确认 | ✅ |
| 圆角 | 16px | ✅ radius-lg（仅弹窗层合法；卡片禁 lg，见 MASTER §4 铁律）|
| home indicator | 弹窗内无 | ✅ v7 删除 |

### 11.7 字阶（对照 antd-mobile 10 级）

| 语义类 | 当前 | antd 基准 | 结论 |
|---|---|---|---|
| .m-text-h1 | 24/600 | 28 | ⚠️ 工控 24 克制，保持 |
| .m-text-h3 | 17/600 | 17 | ✅ |
| .m-text-body2 | 14/400 | 15 | ✅ 工控 14 克制 |
| .m-text-caption | 12/n7 | 13 | ✅ |

> **结论**：6 大组件基本对齐 antd-mobile/WeUI 基准；2 项微调建议（输入框 36→40 / 圆角 16→8）待 Phase 3 落地。

### 11.8 色彩应用理念（吸收 antd-mobile + WeUI，**不改现有颜色层级和值**）

> **原则**：只吸收"怎么用色"，不改"色值本身"。现有 token（primary/n1-n11/功能色）保持冻结。

| # | 理念 | 来源 | 落地规则 |
|---|---|---|---|
| 1 | **主色点睛不铺底** | antd-mobile | primary 只用于：选中态/CTA 按钮/Hero 横幅/激活图标 —— **面积 ≤30%**（§10.5）；卡片、背景、列表大面积一律 neutral 灰阶 |
| 2 | **功能色只点状态** | antd-mobile | suc/warn/err/run 只用于：状态 Tag、状态点 .m-dot、进度条、开关选中 —— **不做大面积背景**；需浅底时用 `n2` 底 + 语义色左侧色条（.m-notice 方案）或 `-bg/-dis` 变体 |
| 3 | **分割线优先于阴影** | WeUI | 列表内部分隔用 1px `n4` 线（.m-cell border-bottom / .mcard-head border-bottom）；阴影只用于**层级抬升**（浮层/卡片），不用阴影做分隔 |
| 4 | **文字三级色** | WeUI | 主文 `n9`（标题/数值）/ 次文 `n8`（正文）/ 辅文 `n7`（元信息/时间）→ 对应 .m-text-h3/body1/body2/caption；`n5` 只用于占位符与禁用 |
| 5 | **白底 + 弱分隔** | WeUI | 页面背景 `n2`、卡片 `n1`、分隔线 `n4`（#E5E5E5 级）；禁用纯白页面直接落 n2 上（无层级）|
| 6 | **状态色语义固化** | antd-mobile | run（运行绿）≠ suc（成功）——运行状态用 `--run`、操作成功反馈用 `--suc`，不可混用（已固化，勿改）|
| 7 | **禁用态降级** | antd-mobile | 禁用 = 降饱和 + 降对比：bg `n3` / 字 `n5` / 无阴影；功能色禁用用 `-dis` 变体 + opacity .6 |
| 8 | **对比度优先于审美**（08-05）| WCAG 2.0 | 前景/背景组合须达 AA（正文 4.5:1 / 大文本与图形 3:1）——**功能色底禁白字**（组件已改深字 n10），安全/禁止组合表见 §10.3b；纯色不得单独传达信息 |

### 11.9 新增组件（2026-08-04 精细化补全，对齐 antd-mobile/WeUI）

| 组件 | 类名 | 用法 | 颜色应用 |
|---|---|---|---|
| **开关 Switch** | `.m-switch > input[type=checkbox] + .sw-track + .sw-thumb` | 设置页/参数启停；选中轨道 `--primary`，禁用 `n3` | 理念 1+2 |
| **步进器 Stepper** | `.m-stepper > .st-btn(−) + .st-val + .st-btn(+)` | 数量微调（报工产量/参数值）；数值 `.m-num` 对齐 | 中性灰 |
| **多行输入** | `.m-textarea` | 异常详情/备注；focus 边框 `--primary` | 理念 4 |
| **通知条 Notice** | `.m-notice(--info/--suc/--warn/--err)` | 横幅提示/离线提醒；`n2` 底 + 左侧 3px 语义色条 | 理念 2+3 |
| **骨架屏 Skeleton** | `.m-skeleton > .sk-row > .sk-circle/.sk-line.sk-w40/60/80/100` | 加载占位；shimmer 扫光用规范 keyframes + `--motion-duration-slow` | 中性灰 |

### 11.10 对齐精细化铁律（2026-08-04 用户"标签文字居中"反馈）

| 组件 | 铁律 | 反例（禁） |
|---|---|---|
| **标签/胶囊** | inline-flex + **justify-content:center** + align-items:center | mtag 带 min-width 时文字左对齐 ❌ |
| 按钮 | justify-content:center ✅ | 文字贴左 |
| Tab | align-items:center + 文字垂直居中 ✅ | 文字偏上 |
| 弹窗标题 | justify-content:center ✅ | 标题偏左 |
| 状态栏 | space-between ✅ | 时间/图标贴边 |
| 瓷片/宫格 | flex column + align-items:center（kk）/ flex-start（po 内容左对齐为设计）| 混用 |
| 数值 | `.m-num` tabular-nums（宽度对齐不漂移）| 默认字体错位 |

> **自检**：生成后 headless 截图（§10.9）逐组件核对：标签文字是否居中、行内元素垂直是否居中对齐、数值是否 tabular 对齐。

### 11.11 状态点语义（2026-08-05 拍板①：机器状态独立语义）

> **机器状态**（设备/产线/工单）：用 **run/中性灰/err** 独立语义，**不用 suc/warn**——成功绿只表示"操作成功"，不是"机器在运行"。

| 机器状态 | 移动端 `.m-dot` | Web `.status-dot`/`.dot-*` | 语义 | 亮色对比(on 白) |
|---|---|---|---|---|
| 运行中 | `.run`（--run 绿）| `.dot-run` | 正在工作 | 3.30（图形 3:1 ✅）|
| 待机 | `.idle`（n7）| `.dot-idle`（n9=#6C757D）| 就绪未运行 | 4.69 ✅ |
| 停机 | `.off`（n8）| `.dot-off`（n10=#334155）| 主动停止 | 10.35 ✅ |
| 离线 | `.offline`（n9）| `.dot-offline`（n11=#212532）| 无连接 | 11.42 ✅ |
| 故障 | `.err`（--err 红）| `.dot-err` | 异常/报警 | 3.76 ✅ |

> **D02 修正（08-05 对抗审查）**：状态点灰阶初版用 n5/n6（亮色 1.2~2.1 / 暗色坍塌 1.0~1.4 不可见）→ 改为 **n7/n8/n9（移动）/ n9/n10/n11（Web）** 深灰递进，亮暗双模式达标。注意两端 n 编号不同：移动 n7=#6C757D=Web n9；移动 n8=#334155=Web n10；移动 n9=#343A46≈Web n11=#212532。

> **功能状态**（操作/校验反馈）才用：`.ok`（--suc 成功）/ `.warn`（--warn 预警）。**纯颜色不得单独传达信息**（WCAG）——状态点须配文字（`.m-dot` 天然带 label）。反例：设备列表"待机"用 `.warn`（黄）= 语义混淆（08-05 已修正为 `.idle`）。

---

> 最后更新: 2026-08-04 | §11 组件级样例表（antd-mobile + WeUI 观感基准）+ §11.8 色彩应用理念 + §11.9 新增组件 + §11.10 对齐铁律
