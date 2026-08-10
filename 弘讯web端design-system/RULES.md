# 设计决策规则 RULES（B端 Web）

> 弘讯B端视觉系统 · 组件选择与使用约束
> 供 AI Agent / 开发者做 UI 决策时查阅
> **平台**: Web / B端 / 后台管理系统（Ant Design 风格）

> **⚠️ 跨端守则（2026-08-06）：移动端已锁定（见移动端 RULES 顶部锁定声明）。**
> 改 Web 若涉及移动端（共享 token / 组件体系 / validate-spec 对称改动 / 两端联动规则），
> **必须先提醒用户拍板**，不得静默改动移动端冻结资产。

---

## 软规则必读清单（无门禁兜底 · 缺读即事故 · 生成前逐条核对）

> **[硬]** = 可机检（class/token/结构/尺寸/对齐/间距，有门禁兜底 → 按需检索）；**[软]** = 不可机检（布局/层级/审美/守则/必备区块，无兜底 → 必读）。

- §1.1b 页面类型必备区块（选型后必读对应段：列表/看板/详情/弹窗/登录）
- §7 布局美学（信息层级 / 留白节奏 / 对齐）⚠️ 必读
- §7.9 页面级自造类守则（组合 → 变体 → 自造，值全落 token）⚠️ 必读
- §9 图表结果约束 8 条（页面含图表时读；真源 = 根 CHART-SPEC.md）
- 布局决策 5 问（任务 / 优先级 / 关系 / 倾向 / 论证；定义见 GENERATION-SOP 步骤 5 自查表）

---

## [硬] 0. B 端后台固定框架（Agent 判定必读 ⚠️）

**这是弘讯 B 端 Web 后台系统的「固定框架」——一旦 Agent 判定当前页面属于 B 端后台，就必须统一套用此框架，不得擅自改版式。判定为非 B 端系统（如营销落地页、门户、大屏可视化）时，才按需求自由设计。**

### [硬] 0.1 框架固定结构（四维）

| 区域 | 高度/宽度 | 强制项 |
|---|---|---|
| 顶栏 Topbar | 高 **72** | 品牌蓝底、白字；**左：logo + 平台名 + 副标题**；**右：首页、用户名、修改密码、退出登录、全屏** |
| 侧边栏 Sidebar | 宽 **240**，可折叠至 **80** | 作业树/导航树，**第一层与第二层节点必须带图标**，第三层可不带；收起时只显示图标；**折叠按钮固定在右下角（不随菜单多少移动），作业树滚动条隐藏** |
| 内容区 Content | 自适应 | 卡片/表格/表单，沿用组件库 |
| 底栏 Footer | 高 **32** | 版权/系统信息**居中**显示 |

### [硬] 0.2 框架硬性规则（不可违反）

1. **顶栏结构固定**：从左到右必须是 `平台 logo` → `平台名称（大字）` + `副标题（小字）` → `spacer` → `首页` | `用户名` | `修改密码` | `退出登录` | `全屏`。不得擅自增加中间主导航或改变顺序。
2. **作业树层级**：最多 **3 层**，最少 **1 层**；**第一层和第二层节点必须带图标**（`.tree-ico` 内嵌 `.ico` SVG，`stroke=currentColor`），第三层可不带；收起侧栏（`.sidebar.collapsed`）时**只显示图标**，文字与箭头隐藏。
   - **DOM 契约（2026-08-04 补强，防折叠态文字泄漏）**：文字节点**必须**用 `<span class="tree-text">`，**禁止**用 `class="tree-label"` 当文字容器——否则折叠态 CSS `.sidebar.collapsed .tree-text{display:none}` 命中不到，文字会在 80px 侧栏里换行泄漏。React 参考实现可把 `.tree-ico` + `.tree-text` 包在 `.tree-label` 里再用 `display:contents` 让图标参与 flex 居中，但叶子文字本身仍是 `.tree-text`。HTML 预览页与参考实现页统一此契约。
3. **选中态不用左侧白色强调条** —— 靠「实底 + 白字 + 字重 500」三重表达（2026-07-31 领导裁定取消左强调条，避免与折叠态图标居中打架）。
4. **底栏文字居中**：`弘讯B端视觉规范 · page-template.html · 所有视觉特征取自 template.css / tokens.json 真源` 必须居中，不要左对齐或右对齐。
5. 顶栏 72 / 侧栏 240（折叠 80）/ 底栏 32 的尺寸与品牌蓝底白字不可改。
6. **折叠按钮固定右下角 + 滚动条隐藏**（2026-08-03 裁定）：
   - 折叠按钮（`.sidebar-foot > .collapse-btn`）**固定在侧栏右下角**，`flex-shrink:0` + 高 44px + `z-index:2`（始终在作业树之上），**不随作业菜单多少改变位置**。
   - 作业树（`.sidebar .tree`）单独占 `flex:1 1 auto; min-height:0; overflow-y:auto` 滚动区，**菜单再多只在侧栏高度内截断/滚动，红线下方不显示**。
   - 滚动条**视觉隐藏**但保留滚动行为：`.sidebar .tree{scrollbar-width:none;-ms-overflow-style:none}` + `.sidebar .tree::-webkit-scrollbar{width:0;height:0;display:none}`（兼容 Chrome/Safari/FF/Edge）。
   - 折叠态（`.sidebar.collapsed`）按钮 44×44 与 `.tree-node` 同高（44px）→ **与作业树图标自然垂直居中**；`.tree` 底部 padding 归零紧贴按钮。
7. **单树导航（2026-08-03 拍板）**：仅左侧作业树承载模块导航；顶栏内容白名单 = 品牌区（logo/平台名/副标题）| 工具区（首页/管理员/修改密码/退出登录/全屏）；**禁止在顶栏增加模块级菜单/tab**（如 运营中心/生产管理 挂顶栏 → 门禁 `topbar.nav-menu` HIGH）。`.topbar-link` 类已废弃（framework.css L63 deprecated），生成页禁用。
8. **侧栏信息架构（2026-08-03 拍板）**：平级一级模块必须**并列 group-title**（如 运营中心 / 生产管理 / 设备中心 各自独立 group），**禁止把平级模块嵌套成某中心的 `tree-node` 子项**（层级错误 + 双导航根源）。
   - **并列 group-title 结构契约（2026-08-04 补强）**：并列 group-title **必须全部收进【单一 `.tree` 滚动区】**作段落标题（`<div class="tree">` 内直接放 `<div class="group-title">`），**禁止多个 `.tree` 并列**——`.sidebar .tree` 是 `flex:1 1 auto`（flex-grow），多个 `.tree` 会平分剩余空间，把并列 group-title 之间的间距撑得过大（optA 演示页 2026-08-03 实测间距失控）。
   - **段落间距**：CSS 真源 `framework.css` 已定 `.sidebar .tree .group-title{margin-top:12px}`，首个 `:first-child` 归零贴树顶。HTML 预览与参考实现页统一此结构，不得另写间距。
9. **作业树业务定制（2026-08-07 拍板）**：作业树**结构**是框架契约（层级≤3 / 一二级带图标 / 折叠 / 选中态 / group-title 并列 / DOM 契约零改动）；**节点文本、分组、选中态是业务内容**——克隆 page-template 后按当前系统的模块结构定制（增删分组/节点、改文本、把 `.on` 选中态移到当前页所在节点），**禁止保留示例树**（示例树是制造业演示，不是通用骨架）。节点图标从 `icons/` 取（见 §7.9 图标守则）。

### [软] 0.3 Agent 判定流程

```
当前任务是不是「B 端后台管理系统页面」？
│
├─ 是（管理后台 / 控制台 / 运维台 / 设备作业树 / 工单列表 / 配置中心 …）
│  └─→ 克隆固定框架：page-template.html（顶栏72 + 侧栏240可折叠+树带图标 + 底栏32居中）
│     - 所有视觉特征取自 template.css / tokens.json 真源
│     - 不得擅自改版式、加暗色切换、改尺寸
│
└─ 否（营销页 / 门户 / 数据大屏可视化 / 纯展示页 …）
   └─→ 按需求自由设计，不受本框架约束
```

**判定信号清单（命中即判 B 端后台）**：包含「管理/控制台/后台/运维/配置」语义；有左侧导航树 + 顶部系统名栏 + 底部版权；面向内部运营/设备/工单操作；使用 Ant Design 风格组件库。
**反信号（判非 B 端）**：对外营销、品牌展示、纯数据可视化大屏、无后台框架语义。

> **⚠️ 规范边界（2026-08-04 拍板）**：本设计系统是**视觉规范**——职责到「视觉规格 + HTML 预览」为止，回答「页面长什么样」（色板/间距/字阶/组件形态/状态/布局节奏）；**上线实现（平台/框架/产物格式）由使用者决定**，规范不替使用者选技术栈。下列组件库 / 脚手架为**参考实现（可选）**：恰好采用 React / Taro 技术栈的使用者可直接复用；异栈（Vue/Flutter/原生…）使用者照 `tokens.json` / 组件规格 / 预览稿自行实现，视觉效果一致。
> - **参考实现（可选）**：Web `packages/web-ui`（`@techmation/web-ui`，shadcn/ui 33 件 + Tailwind）——React 组件库；移动端 `packages/mobile-ui`（`@techmation/mobile-ui`，NutUI-React-Taro + Taro 4.2.1）——Taro/小程序/App 组件库。二者 CSS 真源 = `packages/web-ui/src/styles/{globals,components,framework,utilities}.css`（四件手写，N=1，`npm run build:template` 合并生成 template.css）。
> - **HTML 视觉预览（规范交付物）**：`弘讯web端design-system/template.css` 及 `.html` 原型页用于 Agent 快速验证、设计师对照、门禁演示，**是视觉规格的呈现载体，不是上线文件**（仓库根 `output/` 仅历史归档，新产出落用户项目 output/）。预览页 link `template.css`，**只可使用其中已定义的类**（validate-spec.js 类名白名单门禁拦截自造组件）。
> - **参考实现路径（可选，仅同栈使用者）**：React 页从脚手架 `packages/web-ui/src/templates/BizAdminPage.tsx`（`AdminLayout` 固定框架 + `@techmation/web-ui` 真实组件）生成，命令 `node packages/web-ui/scripts/new-page-react.js <PageName>`，**禁止基于 template.css 自搓组件**；Taro 页从 `packages/mobile-ui/scripts/new-page-mobile.js <PageName>` 生成。预览页与参考实现**统一遵守**本 RULES 的 DOM 契约 / 类名白名单。
>
> **框架维度真源**：框架外壳唯一真源 = `packages/web-ui/src/styles/framework.css`（G8 固定滚动 / G9 折叠 / 品牌表面树选中 / 暗色 chrome），维度变量（72/240/80/32）来自 `globals.css` token。已按 Ardot 旧文件 `701545559030003` 画板 `19:3578`「框架布局」校准：侧栏高 **1008px**（顶栏下方至底部）。
>
> **📌 待后续修改（已记录）**：画板中底栏位于侧栏右侧（宽 1680px），当前 HTML 结构仍用与 `.body` 平级的全宽底栏。因改动涉及全部既有 HTML 页面 DOM 结构，**暂不推进**，后续统一调整时提醒并执行。
>
> **参考样例**：`packages/web-ui/src/demo/pages/CncDashboard.tsx`（复刻 cnc 看板，`npm run build` 端到端验证）；`npm run dev` 指向该样例。HTML 起手 Clone 源 = `弘讯web端design-system/page-template.html`（link template.css，已 0 违反）。
>
> **页面拼装工具类清单（utilities.css，Agent 必须优先复用，不得自造）**：
> - 布局：`.row` `.row-tight` `.row-between` `.col` `.mt` `.mt-sm` `.mt-lg` `.mb`
> - 栅格：`.grid12` + `.col-3/4/5/6/7/8/9/12`（≤1200px 自动堆叠为 12 列满宽）
> - 标题：`.page-title` `.section-title`
> - 指标卡：`.stat-grid`（容器）+ **KPI 两版（2026-08-06 用户拍板：标准版 = 图标卡，环形版保留需时使用）**：标准版 `.stat-card--icon`（KPI 图标卡——左浅底高圆角图标块 kpi-ico--lg 48×48 · radius-lg 16 + 右上大数字 stat-num + 底部行 stat-foot（标题左 stat-sub / 变化量右 stat-delta，贴图标底部对齐；变化量 12px 500 ↑=run 绿 ↓=err 红）——布局基准 = 回滚点 20260806_Web完成态 展示页）；环形版 `.stat-card--ring`（左环 64 + ring-info label/num/trend，需时使用）。**禁简约 stat-num+stat-sub 独立卡**（门禁 kpi.simple.forbidden HIGH 拦截）
> - KPI 图标：`.kpi-ico`（+ `--lg` 尺寸，+ `--primary/--run/--warn/--neutral` 语义底色）。SVG 走 `currentColor`，**禁止在 `<svg>` 上写颜色**
> - KPI 环（环形版需时使用）：`.ring`（64 svg 圆环，dashoffset = 163.4 × (1−%)）+ `.ring-val` + `.ring-fg--primary/run/warn/err/secondary`
> - 图表：`.chart-wrap` `.chart-svg` `.chart-grid` `.chart-axis` `.chart-value` `.chart-caption` `.chart-legend`（+ `--list`）`.legend-item` `.legend-dot` `.legend-line`（+ `--dash`）`.legend-val`
> - 指标行：`.metric-row` `.metric-label` `.metric-val` `.metric-unit`
> - 迷你柱图：`.bars` `.bar-col`（+ `--muted`）`.bar-cap` `.bars-axis`
> - 表内进度：`.progress-cell` `.progress--inline` `.progress-val` `.progress-bar--run/--warn/--err`
> - 卡头操作槽：`.card-head-actions`
> - 图表色：`.c-tech-blue` `.c-smart-cyan` `.c-data-cyan` `.c-fresh-green` `.c-vivid-orange` `.c-alert-red` `.c-wisdom-purple` `.c-modern-pink`（或直接 `var(--chart-*)`）
>
> 清单外确需新类 → **先加进 `utilities.css`/`components.css` 再跑 `npm run build:template`**，绝不在页面内 `<style>` 自造（validate-spec 类名白名单门禁会判 HIGH）。

---

## [软] 1. 组件选择决策树

### [软] 1.1 页面级组件选型

```
START: 我要做什么类型的页面？
│
├─ 后台框架（任何管理页）
│  └─→ §0 固定框架（四维：顶栏 72 + 侧边栏 240 可折叠 + 内容区 + 底栏 32）
│
├─ 数据概览 / 监控大屏（KPI、图表）
│  └─→ §1.1b 看板规格（KPI 卡两版 + §9 图表自建）
│
├─ 列表 / 表格数据（角色、设备、工单…）
│  └─→ §1.1b 列表页规格（筛选 + 表格 + 分页）
│
├─ 表单录入 / 弹窗编辑
│  └─→ §1.1b 弹窗规格（Modal + 输入 + 按钮组）
│
├─ 登录页
│  └─→ §1.1b 登录页规格（独立页，不套框架）
│
└─ 详情页
   └─→ §1.1b 详情页规格（键值对 + 参数表 + 日志时间轴）
```

### [软] 1.1b 页面类型规格（2026-08-06：pages/ 已删除并入本节 ⚠️ 必读）

> 页面级布局与专属规则（从原 `pages/*.md` 提炼的真增量，2026-08-06 并入）。
> 组件尺寸 / 色值 / 状态一律以 `components.json` + `template.css` 为准；本节只记「页面级结构与页面专属规则」，不重复组件规格。

#### 登录页（独立页，不套后台框架）
- 整页居中登录卡：卡 400px 宽、`--radius-md` 圆角、Shadow-Card、内边距 40、margin-top≈120；页面背景 N4。
- 产品名 H2 24/32 Medium N11；Logo 40×40。
- 输入 `.input` 高 32 宽 320（占位 N8）；「记住密码」Checkbox + Caption；「忘记密码」`.t-link` 右对齐。
- 登录按钮 `.btn-primary .btn-lg` 高 40 宽 320，**字重 400 禁 600**（Web 按钮绑 Body1）。
- **主色仅用于**：Logo 强调 / 按钮实底 / 链接 / 输入聚焦边框；大面积背景用 N4，禁主色铺满。
- 错误态：输入校验失败边框 `--err`，下方 Caption 错误提示 `--err`。
- 可访问性：输入框需 `label`（可见或 aria-label）；按钮 `type=submit`。

#### 列表页（筛选 + 表格 + 分页）
- 内容区结构：Breadcrumb 条 32（N5 底）→ 左侧筛选卡（宽 303，白底 Shadow-Card，内部表单项 itemSpacing 8）→ 工具栏（操作按钮区 56 + 搜索/批量区 48）→ 表格卡（表头 48 / 行 44 / 分页器 44）。
- 表格 / 分页规格走 `components.json` 的 `table` / `pager` 契约（数值列 th.num↔td.num 右对齐），勿自造。

#### 详情页
- 面包屑 32（N5 底，`›` 分隔）+ 返回 `.btn-text`；页面标题 H1 28/36 Medium + 右上 `.btn-lg` 操作按钮。
- 基础信息卡 = 键值对网格：label 120 宽 / 行高 40 / label Body2 13 N9 / value Body1 14 N10 / padding 16。
- 运行参数卡 = `.table`（表头 48 / 行 44），状态列 `.status-dot` + `.tag`（运行 `--run` / 正常 `--suc` / 警告 `--warn` / 故障 `--err`；Web 禁 `#10B981`）。
- 操作日志卡 = 时间轴：每条 = 时间戳(Body2 13 N9) + 操作人 + 动作(Body1 14 N10)，itemSpacing 12；时间轴圆点 8×8（未激活 N6 边框 + N1 底 / 当前 primary 实底）；连接线 1px N6。

#### 弹窗 / 表单（Modal）
- Modal 宽 382（窄表单；宽表单 520–720 属同族变体）、头 40（标题 16 + 右上关闭）、主体 padding 16、Shadow-Modal、圆角 8。
- 底部按钮组右对齐 itemSpacing 16：次按钮（取消）+ 主按钮（确定）。
- 禁在 Modal 内用移动端组件；所有尺寸 / 颜色走 Web Token。

#### 看板 / 数据大屏
- KPI 卡用 `components.json` 登记的两版：标准版 `stat-card--icon`（图标卡 · 回滚点布局）+ 环形版 `stat-card--ring`（需时使用）；禁自造其他版本（简约 stat-num+stat-sub 独立卡被门禁 kpi.simple.forbidden HIGH 拦截）；KPI 图标卡唯一排列 = 数值大字在上 + 底部行(标题左/趋势右)，**禁止「标题在上/数值居中」排列**（stat-label 首行 + stat-num 居中——门禁 kpi.label.top.forbidden HIGH 拦截，stat-label 仅限环形卡 ring-info）
- 图表按 §9 自建范式 + CHART-SPEC（原子 SVG，色走 `--chart-*` token，禁裸 hex）。

### [软] 1.2 组件粒度选型

```
需要展示什么内容？
│
├─ 主操作按钮
│  → 主按钮（默认/hover/点击/禁用），高 32，主色填充
│
├─ 次要操作
│  → 次按钮（白底+主色描边）或 文字按钮（行内低强调）
│
├─ 文本输入
│  → 单行输入（可选左图标/右搜索图标，状态 默认/输入/失效），高 32
│
├─ 开关 / 单选 / 多选
│  → Switch(大/小) / 单选 / 多选，按状态变体
│
├─ 设备/任务状态
│  → 状态指示灯（关机离线/在线生产/空闲/故障）
│
├─ 状态标签
│  → Tag（成功/警告/错误/默认），高 22，背景+文字语义色
│
├─ 数据容器
│  → 卡片（头40+内容，白底阴影圆角8）
│
├─ 批量数据
│  → 表格（表头48+N2底 / 行44+hover N3 / 多选16）+ 分页器(44)
│
├─ 多视图切换
│  → 标签分页 Tabs（高32，图标+关闭按钮）
│
└─ 确认 / 编辑弹层
   → 弹窗 Modal（382宽，头40）
```

### [硬] 1.3 色彩选择决策树

```
这个元素表达什么语义？
│
├─ 品牌/主要操作/顶栏/侧边栏
│  → 主色 #005EAE
│
├─ 次级强调 / 图表高亮 / 操作辅助
│  → 辅助色 #0A84FF
│
├─ 正向状态（正常/成功/完成）
│  → 成功绿 #389E0D（文字）/ #F6FFED（背景）
├─ 运行/在线/生产（工业监控最高频状态）
│  → 运行绿 #16A34A（跨端共用，独立于成功绿）
│
├─ 警告/注意
│  → 警告橙 #FA8C16（文字）/ #FFF7E6（背景）
│
├─ 错误/告警/危险
│  → 错误红 #F5222D（文字）/ #FFF1F0（背景）
│
├─ 链接 / 输入框聚焦
│  → 链接 #1A75D2
│
├─ 页面背景
│  → N4 #F5F7FB
│
├─ 卡片/容器背景
│  → N1 #FFFFFF
│
└─ 文字层级
   → 一级 N11 #212532 / 正文 N10 #334155 / 辅助 N9 #6C757D / 禁用 N8 #ADB5BD
```

**KPI 环色**（`.ring-fg--*` 语义色，2026-08-03 拍板：**不得 4 卡 4 色炫技**）：

| 场景 | 变体 |
|------|------|
| 默认（无特殊语义） | `.kpi-ico--primary` |
| 生产类指标（产量/产能/稼动率） | `.kpi-ico--run` |
| 有告警语义（异常数/超限） | `.kpi-ico--warn` |
| 中性信息（配置/版本） | `.kpi-ico--neutral` |

**进度条阈值**（`.progress-bar--*`，按**剩余**比例判色，2026-08-03 拍板）：

| 剩余比例 | 变体 |
|---------|------|
| 剩余 > 20% | `.progress-bar--run`（绿，正常推进） |
| 剩余 10–20% | `.progress-bar--warn`（黄，接近到期） |
| 剩余 < 10% | `.progress-bar--err`（红，严重超期风险） |

> ⚠️ **40% 剩余不得标 warn**——只有真正接近到期才升级颜色；常态进度一律 `--run`。

### [硬] 1.4 字号选择决策树

**唯一真源**：`MASTER.md §2 Typography`。所有角色直接映射到 13 级字阶 class，禁止自行发明字号。

```
这是什么级别的文字？                    class        字号 / 行高（来自 MASTER §2）
│
├─ 页面主标题（页面最高级标题）         .t-display   32px / 40px  Medium
├─ 模块标题                             .t-h1        28px / 36px  Medium
├─ 区块标题                             .t-h2        24px / 32px  Medium
├─ 卡片标题 / 弹窗标题                  .t-h3        20px / 28px  Medium
├─ 子标题                               .t-h4        18px / 26px  Medium
├─ 小节标题                             .t-h5        16px / 24px  Medium
├─ 正文 / 列表 / 表单内容               .t-body1     14px / 22px  Regular
├─ 辅助说明 / 次要文本                  .t-body2     13px / 20px  Regular
├─ 图表标注 / 表单提示                  .t-caption   12px / 16px  Regular
├─ 标签 / 按钮文字                      .t-label     12px / 16px  Medium
├─ 极小标注                             .t-overline  11px / 16px  Medium
└─ 文本链接                             .t-link      14px / 22px  Regular  色 var(--link)
```

**用类不用裸值（2026-08-03 拍板）**：文本字号一律 `.t-*` class，**禁裸 `font-size`**（哪怕值合法——13px 是合法 `body2`，但必须写 `class="t-body2"`，裸 `font-size:13px` 绕过类体系即违规）。字阶口径：12 字号键 + Mono = 13 级（`.t-display`/`.t-h1`…`.t-link` + `.t-mono`），勿混。

---

## [硬] 2. 禁止清单 Anti-Patterns

### [硬] 2.1 ❌ 绝对禁止

| # | 禁止事项 | 原因 | 正确做法 |
|---|---------|------|---------|
| 1 | 使用非设计系统的颜色 | 破坏品牌一致性 | 仅用 DESIGN-TOKENS.md / 变量集 |
| 2 | 移动端成功绿 `#10B981` 用在 Web | Web 功能色对齐 Ant Design `#389E0D` | Web 一律 `#389E0D`(成功)/`#FA8C16`(警告)/`#F5222D`(错误) |
| 3 | 自定义圆角值 | 视觉不统一 | 用 Token：2/4/8/16/999 |
| 4 | 字号小于 12px | Web 不可读 | 最小 12px（Caption），正文 ≥ 14px |
| 5 | 主色底（顶栏/侧边栏）上用白字以外的浅色 | 对比不足 | 主色底一律白字 `#FFFFFF` |
| 6 | 按钮高度 < 24px | 触控/点击热区不足 | 大 40 / 默认 32 / 小 24 |
| 7 | 表格行高 < 40px | Web 表格密度过低可读差 | 表头 48px、行高 44px |
| 8 | 深色侧边栏用浅色菜单文字 | 对比不足 | 侧边栏(主色)菜单项白字 |
| 9 | 卡片无阴影直接贴背景 | 层级不清 | 卡片用 Shadow-Card |

### [软] 2.2 ⚠️ 不推荐

| # | 不推荐事项 | 原因 | 替代方案 |
|---|-----------|------|---------|
| 1 | 单页放超过 7 个一级菜单 | 侧边栏过长 | 分组折叠 / 二级菜单 |
| 2 | 表格超过 12 列不横向滚动 | 拥挤 | 固定关键列 + 横向滚动 |
| 3 | KPI 超过 4 个一行 | 数值太小 | 2×2 网格 |
| 4 | 卡片内超过 3 层嵌套 | 密度太高 | 拆详情页 / Tab 切换 |
| 5 | 阴影模糊 > 12px | 显脏 | Shadow-Card(5)/Float(8)/Modal(2) |

---

## [硬] 3. 组件状态机

### [硬] 3.1 按钮 Button States

| 状态 | 背景 Token | 文字 Token | 可交互 | 场景 |
|------|-----------|-----------|--------|------|
| Default | `主色` `#005EAE` | `#FFFFFF` | ✅ | 正常可点 |
| Hover | `主色悬停` `#1A75D2` | `#FFFFFF` | ✅ | 鼠标悬停 |
| Active | `主色点击` `#004A8F` | `#FFFFFF` | ✅ | 鼠标按下 |
| Disabled | `主色禁用填充` `#DAEAFA` | `主色禁用文字` `#A0B4C0` | ❌ | 权限不足/未填完 |

#### 场景矩阵（2026-08-03 拍板：动作语义决定 class）

| 动作语义 | class | 示例 |
|---------|-------|------|
| 主操作（页面核心动作） | `btn-primary` | 提交 / 保存 / 处理未完成项 |
| 次操作（辅助/可逆/低风险） | `btn-secondary` | 查看 / 取消 / 忽略 / 导出 |
| 已终结态（不再可点） | `tag-suc` / `tag-def` | 已处理 / 已读（不是 `btn-primary`/`btn-secondary`，已终结不再是 button） |

**铁律：同一列表、同一动作，必须同一样式**（「处理」按钮要么全 `btn-primary`、要么全 `btn-secondary`，不得混用；已终结态统一转 `tag-suc`/`tag-def`，不再是 `btn-primary`/`btn-secondary`）。拿不准 → 主操作语义优先，默认 `btn-primary`。

### [硬] 3.2 输入框 Input States

| 状态 | 边框颜色 | 文字/光圈 | 说明 |
|------|---------|----------|------|
| 默认 | `#DEE2E6` (N6) | 占位 `#ADB5BD` | 未输入 |
| 输入(聚焦) | `#005EAE` | ring `rgba(0,94,174,0.2)` | 键盘激活 |
| 失效 | `#DEE2E6` | 底色 N4，置灰 | 不可编辑 |

### [硬] 3.3 表格行 Table Row States

| 状态 | 背景色 | 说明 |
|------|--------|------|
| Normal | `#FFFFFF` | 默认 |
| Hover | `#F6F9FC` (N3) | 鼠标悬停 |
| Selected | 微主色底 `rgba(0,94,174,0.06)` | 多选选中 |

### [硬] 3.3b 表格列对齐语义（2026-08-06 补强）⚠️ 必读

**列对齐由列语义决定，表头必须与数据同对齐**（门禁 `table.align` HIGH 强制）：

| 列类型 | 对齐 | 用法 |
|--------|------|------|
| 文本列（工单号/产品/机台/备注/时间） | 左对齐 | th/td 默认（无需类） |
| 数值列（数量/金额/百分比/计数/产能） | **右对齐** | **th 与 td 都加 `.num`**（`.num{text-align:right;font-variant-numeric:tabular-nums}` 真源） |
| 状态列（tag/badge/状态灯） | 左对齐 | 默认 |
| 操作列（按钮/链接） | 左对齐 | 默认 |
| 进度列（progress 条） | 左对齐 | 默认（条左起，th 跟随） |

**门禁双向校验**：① 任一数据单元格 `td.num` → 对应列表头必须 `th.num`；② 表头 `th.num` → 该列所有数据 `td` 必须带 `num`。违反即 HIGH（表头与数据错位）。数值列数字用 `tabular-nums` 等宽对齐（千分位对齐）。

**⚠️ 特异性陷阱**：`.table th` 的 `text-align:left` 特异性高于 `.num` 的 `right`——仅给 th 加 `num` 类不会右对齐。**必须由真源 `.table th.num{text-align:right}` 显式覆盖**（契约 `table.head.num-align` HIGH 锁定该规则值）。

**⚠️ 字体回退陷阱**：`.num` 的 `font-variant-numeric:tabular-nums` **只用于数据单元格**——表头 `th.num` 必须 `font-variant-numeric:normal`（真源已写死，契约锁定；中文表头遇衬线字体系统会回退宋体，事故细节见 CHANGELOG）。

**表头/数据字体规范（2026-08-06 定稿）**：**表头与数据必须区分**（不得统一字号）——`.table th`：`font-family:var(--font-cn)` 显式 + `font-size:13px` + `font-weight:500`（全表头内部统一黑体）；`.table td`：`font-family:var(--font-cn)` 显式 + `font-size:14px`（数据统一，与表头区分）。th/td **显式 font-family 锁定黑体家族**，字体特性回退只能在黑体家族内发生、绝不落宋体。契约 `table.head.font` 校验 th 的 font-family 为 var(--font-cn)。

**字体守则（2026-08-07 扩充，防衬线回退）**：
- **字体只用 token 栈**：`var(--font-cn)`（黑体：思源黑体 → 微软雅黑，Windows 兜底已补）/ `var(--font-mono)`。页面自造 CSS **禁写具体字体名**（`宋体`/`SimSun`/`微软雅黑`/`Microsoft YaHei`/`Helvetica` 等字符串直接进 font-family 即违规）——门禁 `font.family` MED 兜底。
- **tabular-nums 仅限纯数字单元格**：`font-variant-numeric:tabular-nums` 只用于**无中文混排**的数据（纯数字/纯数值列）；中文表头与中英混合内容一律 `normal`（数字特性会触发浏览器找支持等宽数字的字体 → 中文环境回退宋体衬线）。
- **字体验证须知（headless 误判陷阱）**：headless Chrome **无用户系统中文字体**，`computed font-family` 与 CSS 文本检查都会**误判「字体已改/已生效」**——字体改动必须用**真实浏览器（用户系统）渲染**核对；Agent 报告「字体已修」须附真实浏览器截图，不以 computed style / CSS 文本为准（th.num 衬线事故同源，2026-08-06 CHANGELOG）。

### [硬] 3.4 Tag 状态

| 状态 | 背景色 | 文字色 |
|------|--------|--------|
| 成功 | `#F6FFED` | `#389E0D` |
| 警告 | `#FFF7E6` | `#FA8C16` |
| 错误 | `#FFF1F0` | `#F5222D` |
| 默认 | `#F6F9FC` | `#6C757D` |

### [硬] 3.5 状态指示灯 Status Light

> **语义（2026-08-05 对抗审查 D02 修正）**：机器状态用 run/中性灰/err 独立语义（**不用 suc/warn**，那是功能状态）；状态点须配文字（纯色不得单独传信息，WCAG）；**灰阶深灰递进**（n9/n10/n11 on 白 4.69/10.35/11.42 全达标，禁 n5/n6 浅灰不可见）。类名见 template.css `.dot-*`。

| 状态 | 类 | 颜色 | 含义 |
|------|------|------|------|
| 运行中 | `.dot-run` | `--run` `#16A34A` | 正在工作 |
| 待机 | `.dot-idle` | `--n9` `#6C757D` | 就绪未运行 |
| 停机 | `.dot-off` | `--n10` `#334155` | 主动停止 |
| 离线 | `.dot-offline` | `--n11` `#212532` | 无连接 |
| 故障 | `.dot-err` | `--err` `#F5222D` | 异常/报警 |
| 成功（功能）| `.dot-ok` | `--suc` `#389E0D` | 操作成功 |
| 预警（功能）| `.dot-warn` | `--warn` `#FA8C16` | 功能预警 |

### [硬] 3.6 表面感知：选中态按底色分治 ⚠️ 必读

**规则：任何"选中/激活"样式，先判断组件坐在什么表面上，再选配色。同一个组件在两种表面上是两套值，不是一套。**

| 组件所在表面 | 选中底 | 选中字 | 强调条(已取消) | 图标/箭头 |
|---|---|---|---|---|
| **白底 / 内容表面**（卡片、内容区、抽屉、下拉） | `#DAEAFA`（`--primary-dis-bg`） | `#004A8F`（`--primary-active`） | 无（靠实底+字重 500 表达） | 同选中字色 |
| **品牌色表面**（`.sidebar` 侧栏 240 / `.demo-sidebar` / `.tree--brand` 等品牌蓝底容器） | `#004A8F`（`--primary-active` 实底） | `#FFFFFF`（`--n1`） | 无（2026-07-31 领导裁定取消） | `#FFFFFF` |

**为什么必须分治**：`--primary-dis-bg`(`#DAEAFA`) 的语义是**禁用态底色**。它放在白底上因为足够浅、只做"轻高亮"才成立；一旦放到品牌蓝底(`#005EAE`)上，它变成整屏最亮的一块，视觉上读作"一块逃出来的禁用块"，而不是"当前选中项"。品牌底上的选中必须比底色**更深**（`#004A8F`）+ 白字，才能既是品牌色、又是选中语义。

**DON'T**
- ❌ 在品牌蓝底侧栏里用 `#DAEAFA` 浅 chip 当选中
- ❌ 选中改了底色却不改图标/箭头色（浅底留白箭头、深底留浅箭头，都是对比度事故）
- ❌ 在白底内容区用整行 primary 实底（那是侧栏语义，会喧宾夺主）

**⚠️ 暗色下"白"不是 `--n1`**：中性梯在暗色反相 —— 亮色 `--n1`=`#FFFFFF`、`--n11`=`#212532`；暗色 `--n1`=`#1E293B`（深表面）、`--n11`=`#FFFFFF`。品牌表面上的白字/白箭头，**亮色取 `--n1`、暗色取 `--n11`**。把亮色规则原样搬到暗色页 = 深字压深底。

**自检一句话**：*选中项的父容器是不是品牌蓝底？是 → 深 primary 实底 + 白字（亮 `--n1` / 暗 `--n11`）；否 → 浅 primary 底 + 深 primary 字。*

适用组件：Tree 作业树、侧栏菜单项、垂直 Tab、品牌底上的列表项。落地 CSS 见 `components.json#tree.referenceCss` 与 `template.css` 中 `.sidebar .tree-node.on` 一组。

### [硬] 3.7 组件 DOM 契约（2026-08-04 补强）⚠️ 必读

以下三条为**机器可校验的 DOM 契约**，validate-spec 已落地同名门禁，违反即报：

| 契约 ID（门禁） | 适用组件 | 违规形态（❌） | 正确写法（✅） |
|---|---|---|---|
| `btn.label.required`（HIGH） | 带图标的按钮 | `<button class="btn btn-secondary"><svg class="btn-ico">…</svg>刷新数据</button>` —— 文字裸放、无 `.btn-label`，容器收窄时中文逐字断行（"刷/新/数/据"竖排截断） | `<button class="btn btn-secondary"><svg class="btn-ico">…</svg><span class="btn-label">刷新数据</span></button>` |
| `stat-grid.count.match`（HIGH） | 栅格卡片容器 | `<div class="stat-grid">` 内放 5 张卡 —— 默认 4 列，第 5 张掉第 2 行只占 1/4 宽 | 卡数=4 → `class="stat-grid"`；卡数=5/6/8 → `class="stat-grid stat-grid--5/6/8"`；卡数≠N 直接违规 |
| `chart.svg.fill`（MEDIUM） | 图表 SVG | `<svg class="chart-svg" viewBox="…" preserveAspectRatio="xMidYMid meet">` —— 等比缩放撑不满容器，上下/左右留白 | `<svg class="chart-svg--fill" viewBox="…" preserveAspectRatio="none">`（或按容器比例设 viewBox）；polyline/path 坐标须拉满 viewBox 边界 |

**配套约定**
1. 按钮内图标一律用 `.btn-ico`（规范 16×16），文本一律 `.btn-label` 包裹（`white-space:nowrap` 兜底）；**禁止**页面 `<style>` 自造 `.btn-ico svg{width:14px}` 覆盖规范尺寸。
2. `.stat-grid` 基础类默认 4 列；卡数 ≠ 4 必须显式 `--N` 后缀（N=实际卡数）。门禁按「直接子元素计数」比对。
3. 图表 SVG 优先 `.chart-svg--fill`（`width/height:100%` + `vector-effect:non-scaling-stroke`，stroke 不随拉伸变形）；如需保持纵横比，viewBox 纵横比须与容器一致，不得用 `meet` 硬塞。
4. 三条门禁均先 `stripScriptTags` 再扫（JS 模板字符串里的 `<button>`/`<svg>` 不参与判定），行号统一 0。
5. **`.chart-svg--fill` 的 viewBox 末端边距**：`preserveAspectRatio="none"` 强制拉伸时，viewBox 右侧须留 **16-20px 内部边距**——即所有元素（polyline/path 末端、X 轴标签居中锚点 `x`、圆点 `cx`、网格线 `x2`）的 x 坐标 ≤ `viewBox 宽度 - 20`。正确写法：`viewBox="0 0 420 160"` + 数据元素末端 `x=400`（视觉上折线仍撑满，文字留 16px 余量）。门禁 `chart.svg.viewbox-edge`（MEDIUM）自动核对。

---

## [硬] 4. 间距与布局规范速查

### [硬] 4.1 核心间距 Token

| Token | px | 使用场景 |
|-------|-----|---------|
| XS | 4 | 图标文字基准间距 |
| SM | 8 | 紧凑元素间隙 |
| MD | 12 | 组件内次级间距 |
| BASE | 16 | 卡片内边距、列表项、内容区边距 |
| LG | 24 | 模块间、卡片外边距 |
| XL | 32 | 区块分割 |
| XXL | 48 | 页面级分隔 |

### [硬] 4.2 固定布局常量

| 参数 | 值 | 说明 |
|------|-----|-----|
| 顶栏高度 | 72px | 全局固定 |
| 侧边栏宽 | 240px | 折叠 80px |
| 侧边栏底色 | `#005EAE` | 菜单项白字 |
| 底栏高度 | 32px | 主色底 |
| 内容区背景 | `#F5F7FB` (N4) | 页面底色 |
| 表格表头高 | 48px | N2 底 |
| 表格行高 | 44px | hover N3 |
| 卡片头高 | 40px | 标题 N11 |
| Tab 高 | 32px | 选中主色 |
| 分页器高 | 44px | 圆钮 24 |
| 栅格 | 24 列 | Ant Grid |
| 断点 | 576/768/992/1200/1600 | sm/md/lg/xl/xxl |

### [硬] 4.3 跨模块间距（2026-08-04 补强）⚠️ 必读

**规则**（已落真源 utilities.css）：

| 相邻模块 | 间距 | 由谁保证 |
|---|---|---|
| `.stat-grid`（KPI 区）→ `.grid12`（图表区） | **24px**（`--space-lg`） | `.stat-grid{margin-bottom:var(--space-lg)}` |
| `.grid12` → `.grid12` | **16px**（`--space-base`） | `.grid12{margin-bottom:var(--space-base)}`（兄弟间距）+ `.grid12 .card{margin-bottom:0}`（卡 margin 归零，内部间距由 grid gap 接管） |
| `.page-head` → `.stat-grid` | 16px | `.page-head{margin-bottom:16px}` + `.stat-grid` 无 margin-top |
| `.content` 上下边 | 24px | `.content{padding:var(--space-lg)}` |

**DOM 契约**
- `.grid12` / `.stat-grid` / `.stat-grid--N` **内部任意层级**的 `.card` 一律 `margin-bottom:0`（模板已用空格全后代选择器覆盖，页面**禁止**自造 `.grid12>.card` 之类的直接子选择器覆盖）。
- 页面 `<style>` **禁止**把 `.stat-grid` / `.grid12` 的 `margin-bottom` 覆盖为 `< 16px`（门禁 `layout.module-spacing` / `layout.grid12-margin` MEDIUM 会拦）。
- 页面若需微调模块间距，用模板工具类 `.mt/.mt-sm/.mt-lg/.mb`，不直接改容器 margin。

### [硬] 4.4 Grid 列内卡片高度对齐 + 表格空数据占位（2026-08-04 补强）⚠️ 必读

**规则**（已落真源 utilities.css）：

1. **`col-*` 是弹性容器**：`.col-3/4/5/6/7/8/9/12` 一律 `display:flex;flex-direction:column;gap:var(--space-base)`（grid item 身份不变，内部转 flex column，col 内多卡片间距 16px 由 col 自身 gap 接管）。
2. **col 内卡片一律 `flex:1` 平分 col 高度**（模板 `.col-* > .card{flex:1;min-height:0}`）：单卡片 = 撑满 col 高度；多卡片 = 平分。内容超高的卡片由 `min-height:auto` 保底不被压缩（高卡片决定 col 高度，矮卡片 stretch 对齐底部）。
3. **图表/列表卡片配 `.card--fill`**（`flex column` + `.card-body{flex:1;min-height:0}`）：`card-body` 内的内容容器（`.donut-wrap` / `.chart-box` / `.table-wrap`）须 `flex:1` 吃掉剩余高度，杜绝"卡片撑满但内部内容悬空"。
4. **表格空数据占位（min-row 契约）**：表格数据行数 < 8 行时，渲染到 **8 行**（`minRow=8`，行高 44px）——不足部分用空占位行 `<tr class="table-placeholder"><td colspan="N">&nbsp;</td></tr>`（无内容、保持行高、`pointer-events:none` 禁 hover）。数据为 0 时同样渲染 8 行占位 + 首行提示「无数据」。门禁 `layout.table-minrow`（MEDIUM）核对 JS 渲染模板是否含 minRow 常量。
5. **适用**：机器列表、告警列表、工单列表、环形图/折线图/柱状图等图表卡片，及一切在 `.grid12 > .col-*` 内的卡片；**不适用**：详情弹窗表单、非 grid12 列的独立卡片。门禁 `card.fill-in-grid`（MEDIUM）核对 col-* 直接子 .card 是否缺 `.card--fill`。

**落地参照**：`机器群览页.html`（2026-08-04 修订）——机器列表/环形图/折线图/告警速览/换模计划五张卡片全部 `.card--fill`，`.donut-wrap/.chart-box--sm/.table-wrap--h` 各 `flex:1`，JS `MIN_ROW=8` 表格占位。

### [硬] 4.4b 卡片高度诉求：定高卡 vs 弹性卡（2026-08-07 补强）⚠️ 必读

> 事故背景：趋势大图卡（弹性）与报警列表卡（仅 max-height）并排 → 行等高把报警卡拉伸成空洞（2026-08-07 注塑机看板）。根因 = 滚动卡未显式定高，被 `col-* > .card{flex:1}` 行等高弹性拉伸。

**按内容确定方式把卡片分两类**：

| 类型 | 判定 | 高度来源 | 示例 |
|---|---|---|---|
| **定高卡** | 内容天然定高 / 滚动列表 | 内容或显式 `height`/固定 `max-height` | 报警列表、日志、参数行、表单 |
| **弹性卡** | 内容可吸收空白 | 图表区 `flex:1` 弹性吸收（CHART-SPEC §3） | 趋势图、柱状图、统计卡 |

**同行组合铁律**：

1. **定高卡与定高卡同排；弹性卡与弹性卡同排**（避免行高等差）。
2. **确需混排**（如趋势大图旁挂报警列表）→ 定高卡必须套真源 **`.scroll-fixed`**（`height:320px;overflow-y:auto`）或显式 `height`/固定 `max-height`；**禁仅靠 `max-height:100%` 对抗行高**（在 `.card--fill` 下等于行高，无效）。
3. **滚动容器不定高 → 门禁 `scroll.container.height`（MEDIUM）拦截**（页面自造滚动类无 height/固定 max-height 即报）。
4. `.card-body--scroll{max-height:100%}` 是「弹性滚动」语义（配合 `card--fill` 弹性吸收），仅适用于弹性卡内部；定高卡内部滚动用 `.scroll-fixed`。

**示例**：趋势卡（弹性，`.chart-box{flex:1}` 吸收）+ 报警卡（定高，`<div class="card-body scroll-fixed">`）并排 → 报警卡恒高 320px 滚动，不被行高拉伸。

---

## [硬] 5. Agent 生成 UI 时的检查清单

### [硬] Must Have（必须满足）

- [ ] **起手一律 clone `page-template.html`**（含正确 :root token 与 顶栏72/侧栏240/内容区 N4 骨架），禁止裸写空文件
- [ ] 顶栏高度 = **72px**，主色 `#005EAE` 底，白字
- [ ] 侧边栏宽度 = **240px**（折叠 80px），主色底，白字菜单
- [ ] 内容区背景 = `#F5F7FB` (N4)
- [ ] 卡片底 = `#FFFFFF` (N1)，圆角 = **8px**，Shadow-Card
- [ ] 主操作按钮颜色 = `#005EAE`，文字 = `#FFFFFF`，高 32
- [ ] **所有颜色来自 DESIGN-TOKENS.md / Ardot 变量集**（禁止硬编码 HEX，禁止移动端 `#10B981`）**
- [ ] 字号 ≥ 12px，正文 ≥ 14px
- [ ] 表格表头 = **48px** / 行高 = **44px**
- [ ] **选中态过了 §3.6 表面自检**：品牌蓝底容器（侧栏 / 作业树 / 品牌底列表）内的选中 = `#004A8F` 实底 + 白字 + 白箭头（**无左白条**，2026-07-31 裁定取消左强调条）；白底容器内的选中 = `#DAEAFA` 底 + `#004A8F` 字。**禁止在品牌蓝底上用 `#DAEAFA` 浅 chip**
- [ ] **交付前门禁**：跑 `node validate-spec.js <页面.html>` → **0 HIGH 违反**才许交付（脚本自动核验按钮字重400/圆角8、输入高32、表头48字重500、标签高22、页签激活字重500、分页24圆钮、状态点10、Web 禁 `#10B981` 等）

### [软] Should Have（推荐满足）

- [ ] 列表项/卡片间距 = 16px
- [ ] 表单标签与输入值字号一致（14px）
- [ ] 分页器高 44px，激活项主色底
- [ ] 状态用 Tag / 状态指示灯表达语义色
- [ ] 卡片阴影用 Shadow-Card（0 0 5px）

### [软] Nice to Have（锦上添花）

- [ ] 侧边栏折叠交互
- [ ] 表格行悬停 N3 高亮
- [ ] 响应式：断点 576/768/992/1200/1600 下栅格重排
- [ ] 空状态插图 + 引导
- [ ] 深色模式占位（当前变量集为单模式，预留切换）

---

## [硬] 6. Web 布局黄金法则（必读）

> 后台 Web 系统的稳定性来自**框架结构正确 + 颜色/尺寸全部走 Token**。
> 以下为强制规则，生成任何页面前先应用。

### [硬] 6.1 布局骨架

```
TopBar         height=72   FIXED   主色底 白字
├─ Sidebar     width=240   FIXED   主色底（折叠 80）  ← 菜单项白字
├─ Content              FLEX       背景 N4 #F5F7FB
│   ├─ Breadcrumb / Tabs  height=32
│   ├─ Card Grid (24 列)  gap=16
│   └─ Table / Form ...
└─ Footer       height=32   FIXED   主色底 白字
```

### [硬] 6.2 七条铁律

| # | 铁律 | 原因 |
|---|------|------|
| **G1** | 顶栏/底栏/侧边栏尺寸锁死（72/32/240），内容区用 FLEX 自适应 | 框架错位会导致整页塌陷 |
| **G2** | 侧边栏(主色)菜单项一律白字 `#FFFFFF`，不在主色底用浅灰文字 | 对比度不足（< 4.5:1） |
| **G3** | 所有颜色来自变量集；Web 功能色用 `#389E0D`/`#FA8C16`/`#F5222D`，**严禁移动端 `#10B981`** | 两套成功绿色语义混用破坏一致性 |
| **G4** | 内容区用 24 列栅格 + gap 16，卡片宽度走栅格而非硬编码 px | 响应式断点下自动重排 |
| **G5** | 插入卡片/表格实例后**立即复核实际宽高**，确认未超父容器 | Ardot 插入不继承父宽，易静默撑大 |
| **G6** | 表格表头固定 48px；行高 44px；分页器 44px；Tab 32px | 行高不一致显杂乱 |
| **G7** | 变体更新用 `componentProperties` 包装：`U(id, {"componentProperties": {"属性 1": "悬停"}})` | 直接传键值对无效 |

### [硬] 6.3 防溢出/错位生成检查清单（Must-Check）

- [ ] 顶栏高 = 72，侧边栏宽 = 240（折叠 80），底栏高 = 32
- [ ] 侧边栏菜单文字 = 白 `#FFFFFF`
- [ ] 内容区背景 = `#F5F7FB`，卡片白底阴影圆角 8
- [ ] 卡片宽度走 24 列栅格，未写死超大 px
- [ ] 表格表头/行 = 48px；分页器 = 44px；Tab = 32px
- [ ] 无元素宽高超出父容器（横向滚动仅在表格多列时启用）
- [ ] 内容防溢出三件套（2026-08-06 补强，缺一即溢出）：① Grid/Flex 子项（`.grid12 > .col-*`、`.stat-grid` 卡等）带 `min-width:0` 防内容撑破；② 文本类容器（`.alert-desc`、`.card-body` 内长文本）带 `overflow-wrap:anywhere` 防长串撑破；③ 徽章/标签行 `.badge-row` 必须 `flex-wrap:wrap` 防不换行横向溢出
- [ ] 所有 HEX 来自 DESIGN-TOKENS.md（无 `#10B981` 等移动端值）

### [硬] 6.4 关键认知（写进 Agent 记忆）

> **Web 功能色 ≠ 移动端功能色**。B端对齐 Ant Design：成功 `#389E0D`、警告 `#FA8C16`、错误 `#F5222D`。
> 移动端成功绿 `#10B981` 仅用于小程序/iOS/Android，**禁止**进入 Web 系统。
> 任何颜色/尺寸改动，第一步永远是引用 Token，而不是写死值。

---

> 最后更新: 2026-08-03 | 基于 Ardot `【20260731】弘讯B端视觉系统V3.0` 提取 + 人工审核


## [软] 7. 布局美学规范（2026-08-04 新增 · 本地化改写自 ui-ux-pro-max 审美规则）⚠️ 必读

> **来源**：与移动端 §10 同源——抽取 ui-ux-pro-max 中适用于 B 端后台的审美规则，改写进弘讯 Web 语境。
> **不抽取**：Touch/a11y（B 端键鼠场景）、动效（M1-M5）、图表（chart 规范）、字体配对/行业色板（弘讯已定品牌色 + Source Han Sans）。
> **目标**：与移动端 §10 对称——门禁保下限（§3.7/§4.3/§4.4/§6），本规范给上限（构图/层次/留白/色彩）。


### [软] 7.1 审美总则（工控美学三原则）

1. **克制**：数据说话，装饰最少。无 AI 粉紫渐变、无无意义动效循环、无营销风花哨卡片。
2. **层次**：每页一个视觉焦点（页面标题 + KPI 区），内容按「标题 → KPI 数字 → 图表/表格 → 元信息」四级递减。
3. **数据化**：KPI 数字用 `.kpi-count`（28px/mono）+ 文本用 `.t-*` 字阶类；语义色只点状态（suc/warn/err/run），不铺底。

### [软] 7.2 构图（B 端看板/列表/详情页面）

| 规则 | 值 | 依据 |
|---|---|---|
| 看板页必含 | KPI 区（`.stat-grid`）+ 图表区（`.grid12`）+ 表格区 | 三区骨架（§6 黄金法则）|
| 首屏焦点 | 页面标题（h4 18px/500）+ KPI 卡（≤8 张，stat-grid--N 显式）| KPI 即焦点 |
| 页面信息块 | ≤6-7 个模块（B 端宽度可容）| 防信息过载 |
| 栅格 | `.grid12 > .col-N` 对齐 + 卡片 `.card--fill` 等高 | §4.4 |
| 卡片 | ≤3 行核心信息 + 空数据占位（`minRow`）| 密度阈值 |



### [软] 7.3 层次（字阶 + 对比度）

| 规则 | 值 |
|---|---|
| 字阶强制 | 文本一律 `.t-*` 类（h1-h5/body/caption/label），**禁裸 font-size inline** |
| KPI 数字 | `.kpi-count`（28px/mono）+ `.kpi-trend` 12px/n9 |
| 正文对比度 | **≥4.5:1**（n10 #334155 on n1 合格；n8 #ADB5BD 作正文不合格）|
| 标题层级 | h4(18) → 卡标题(16/500) → 正文(14/400)，不跳级 |
| 数值对齐 | 表格数字 `tabular-nums` / mono |


### [软] 7.4 密度留白

| 规则 | 值 |
|---|---|
| 行高 | 44px（density-row-height）|
| 跨模块间距 | ≥16px（grid12 兄弟）；KPI 区→图表区 ≥24px（§4.3 门禁）|
| 卡片内 padding | 16px（--density-content-padding）|
| 表格空态 | `minRow` 占位（§4.4）|
| 留白呼吸 | 模块间必有 gap；禁"贴一起" |

### [软] 7.5 色彩克制

| 规则 | 值 |
|---|---|
| 主色面积 | ≤30%（顶栏/侧栏选中/主按钮允许，内容区克制）|
| 语义色 | 只点状态（Tag/进度/状态点），不铺底 |
| 背景层次 | n1 卡 / n2-4 区 / n5-6 分隔 |
| 禁止 | AI 粉紫渐变 / 霓虹色 / 满屏单一功能色 |

### [软] 7.5b WCAG 2.0 前景/背景色使用（2026-08-05，与移动端 §10.3b 对称）

> **标准**（WCAG 2.0）：普通文字 ≥ **4.5:1**（AA）/ 7:1（AAA）；大文本（≥24px 或 ≥18.66px 粗体）与图形/UI 组件 ≥ **3:1**；纯色不得单独传达信息。

**Web 亮色关键组合**（已按实际 token 计算）：

| 等级 | 组合 | 对比度 | 说明 |
|---|---|---|---|
| ✅ AA | `n10/n11 on n1` | 10.3 / 12.7 | 正文全达标 |
| ✅ AA | `n9 on n1` | 4.69 | 辅助文（n9 = 移动端 n7）|
| ✅ AA | `n1 on primary #005EAE` | 6.54 | 品牌按钮白字 ✅ |
| ✅ AA（深字方案）| `n11 on warning #FA8C16` | 6.42 | 警示按钮/标签深字 |
| ✅ AA（深字方案）| `n11 on run #16A34A` | 4.63 | 运行按钮深字 |
| ⚠️ 仅大文本/图形 | `n1 on danger #F5222D` 4.08 / `n1 on success #389E0D` 3.46 / `n1 on warning` 2.38 | — | 白字 on 功能色正文不达标 → 用深字 n11（danger 3.74 / success 4.41 近 AA）|
| ⛔ 禁止 | `n8 on n1` 2.07 / `n6 on n1` | — | 作正文不可用（禁用/装饰）|

> **组件现状**：Web `.tag-suc/warn/err` 已用「`-soft` 浅底 + 同系深字」方案（对比达标 ✅）；按钮功能色建议深字 `n11`。禁止页面覆盖回「白 on 功能色」。

### [软] 7.6 视觉反馈与层级

| 规则 | 实现 |
|---|---|
| hover | 卡片/行 hover 阴影 + 光标 pointer（`.card:hover` / `.table tr:hover`）|
| active/loading | 按钮 `:active` + loading 态（禁用防重复提交）|
| 成功反馈 | toast/message 确认（操作成功必反馈）|
| z-index 分层 | 系统化 10/20/30/50，禁任意 9999 |
| 内容防跳动 | 图表定高（chart-box--sm）+ 异步区预留（aspect-ratio/固定高）|

### [软] 7.7 反廉价清单（Anti-Patterns，生成后自查）

- [ ] 满屏品牌蓝（>30%）→ 收敛为顶栏/KPI/主按钮
- [ ] 卡片无投影/无圆角 → `.shadow-card` + radius-md
- [ ] 文本裸 font-size inline（无 .t-*）→ 字阶类
- [ ] KPI 数字不用 `.kpi-count`（普通字号）→ 28px/mono
- [ ] 看板页无 stat-grid/grid12 骨架 → 三区构图
- [ ] 图表 `meet` 不撑开 / viewBox 末端被裁 → `.chart-svg--fill`
- [ ] 表格空数据无占位 → `minRow`
- [ ] 动效循环/渐变滥用/无空态/无 hover 反馈 → 补齐

### [软] 7.8 生成后视觉自检闭环（必做）

1. 页面生成 → `headless` 截图（`--virtual-time-budget=6000`，窗口 ≥1440）
2. 按 §7.7 清单自查（构图/层次/留白/色彩 4 项）
3. 不合格 → 回改；合格 → 交付（门禁 + 截图双证）

---

### [软] 7.9 页面级自造类守则（2026-08-06 拍板修订 v2：与移动端 §10.10 对称·解禁视觉属性·禁覆写真源·门禁落地）⚠️ 必读

> **平衡原则：Agent 可以自造（含视觉属性），但必须引用现有原子 token——禁止产生新的裸值。**
> 自造前先自问：我引用的每个值，是否都落在现有 token 上？

**① 优先级铁律——自造是最后手段，不是默认选项**

生成任何页面元素前按序尝试，上一步能解决就停：

| 顺序 | 手段 | 说明 |
|---|---|---|
| 1 | **组合** | 现有组件 + 变体 + 容器原语拼装（90% 需求止步于此）|
| 2 | **变体** | 现有组件加状态/尺寸/语义变体（主/次/危险按钮、Tag 语义、折叠态等）|
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
| 覆写 `.btn`/`.table` 等真源组件类 | ❌ 禁（H2）| 门禁 HIGH `css.override` |

**③ 自造底线（即使自造也必须守）**

- 颜色必须 `var(--*)` 禁裸 hex · 文字必须 `.t-*` 禁裸 font-size · 动效必须 `var(--motion-duration-*)` 禁裸秒
- **4px 网格**：所有 px 值 %4==0（**含 calc 内**）
- **禁覆写真源组件类**（`.btn`/`.table`/`.card`/`.tag`/`.tabs` 等 template.css 组件）——需调整用变体/组合/上报维护者
- 语义命名（`.stat-card`，禁 `.a1`/`.box1`）· **禁 `t-` 前缀**（保留给正式组件）· 禁与真源类重名
- 自造类数量 >15 = 「组合失败」信号，回退组合方案重做
- 自造类**不要求登记/注释**（使用者页面不出现维护注释，2026-08-06 拍板）

**④ 新增原子是兜底资源、不是自造许可**

- 原子已补齐（图表色 8 / 间距 7 档 / 字阶 13 级 / soft 色 / 图标 84），自造前必须确认现有原子不可用
- 原子确实不足 → 走「上报维护者」通道，**不自造原子**

**⑤ 门禁口径（2026-08-06 P2 落地，两端 validate-spec.js 已实现）**

- 自造布局/视觉类（值全 token）= 规范内合法扩展，`class.self-defined` MED 可接受（非违规）
- **覆写真源组件类 → HIGH `css.override`**（checkOverride）
- 自造类**非 4px 布局值（含 calc 内）→ MED `grid.4px`**（checkGrid4px）
- 自造类**裸 font-size → MED `text.layer-custom`**（checkCustomProps）
- 裸 hex / 裸动效秒 = 既有门禁 HIGH/MED，必须修

**③ 图标来源守则（2026-08-07 拍板）⚠️ 必读**

> 图标库：`弘讯web端design-system/icons/`（84 个：B 端特有 14 + 通用 70，索引见 `icons/icons.md`）；移动端同源（`弘讯移动端design-system/icons/`）。
> 统一规格：viewBox 24×24 · stroke-width 1.8 · linecap/linejoin round · fill none · currentColor。

1. **页面图标一律从 `icons/` 取**：打开 `icons/icons.md` 索引表找到语义图标，把对应 `.svg` 的 **path 内联**进尺寸类（`.ico` 16 / `.btn-ico` 16 / `.tree-ico` 16 / `.kpi-ico` 20 / `.kpi-ico--lg` 24）。
2. **禁止手写库内已有的图标**（如首页/用户/退出/全屏/返回/警告/温度——库都有）；禁止照抄 page-template 之外页面（克隆页框架图标已来自库）。
3. **库缺才手写**：库内无对应语义时允许手写，但必须符合统一规格（viewBox 24 / stroke 1.8 / round / currentColor），且作为**新增图标上报维护者**补进 `icons/`（走 components.json 通道）。
4. **状态栏/品牌 logo 类系统图形**（移动端信号/wifi/电池、Web 顶栏 logo）不在库语义内，保留原样即可。

---

## [硬] 8. 动效与交互自动添加（2026-08-06 拍板：页面生成即携带交互）⚠️ 必读

> **原则：静态可读 + 动态可感。生成 HTML 页面时必须自动添加与组件语义匹配的动效与交互，
> 不得输出无反馈的「死」页面。** 动效值一律走 motion token（MASTER §5.2：`--motion-duration-instant/fast/normal/slow` + 5 种 ease），交互 JS 随页面一起生成（参照 page-template / 展示页脚本段）。

**① 自动添加对照表（按组件语义匹配，默认即带）**

| 元素 | 交互反馈 | 动效 token |
|---|---|---|
| KPI 卡 / 卡片 / 面板 | hover 浮起 2px + 阴影提升至 float 层（`.card:has(.stat-card--icon):hover` 同款） | fast + ease-out |
| 按钮 | hover 背景变深 + 按压 `scale(.97)` | fast |
| 列表行 / 表格行 | hover 行高亮（row-hover 阴影/底色） | instant |
| 弹窗 / 遮罩 | 打开 fade + scale、遮罩 fade | fast |
| Toast / 轻提示 | 滑入 + 淡出 | fast |
| 折叠 / 展开 | 高度 + 透明度过渡 | fast |
| 页面区块进入 | `anim-*` 工具类（fade-in / float-up） | normal |
| Tab / 筛选切换 | 激活态过渡（下划线 / 底色） | fast |

**② 强制规则**

- transition/animation 时长**必须走 token**（`var(--motion-duration-*)`）——门禁 checkMotion：transition 裸值 **HIGH** / animation 裸值 **MED**；`0s/0ms` 即时切换合法
- 交互元素（按钮/卡片/可点行）**无 hover/press 反馈 = 违规**（对照 §3 组件状态机）
- **禁止裸动效值**（`0.2s`/`300ms`）与手写裸 ease（cubic-bezier 必须走 `--motion-ease-*`）

**③ 交互 JS 自动附带**

- hover / press / 点击处理器与页面一起生成（page-template 脚本段已含：toast / 侧栏折叠 / Tab / Pager / 弹窗 / Select / 树）
- 纯展示页（规范展示类）可不带 JS，但 CSS 层 hover / transition 必带

**④ 例外**

- 静态示意 / 无障碍降级：可省略进入动画，但 hover 反馈保留
- 页面级进入动画仅用于区块首次展示，不与 hover 反馈冲突

---

## [软] 9. 图表自建范式（2026-08-07 重构：「样式 + 结果约束」——实现放开，结果锁死）⚠️ 必读

> **完整真源 = 仓库根 CHART-SPEC.md**（含通用决策流程 / 结果约束清单 / 两端差异 / 门禁口径 / 扩展类型指引 / 附录 A 点按脚本）。本节约为 Web 端内联摘要，冲突以 CHART-SPEC 为准。
> **实物示范 = 展示页 #chart-demo section**（2026-08-07 多类型×多尺寸自适应，识图全过）

**① 实现放开（2026-08-07 拍板，替代固定 viewBox/尺寸/数据量）**

- 图表**不设组件、不锁实现**：尺寸、数据量、坐标方式（HTML flex 柱 / SVG polyline + HTML 点 / 定尺寸方形 SVG 环）**Agent 按容器自适应自选**——不再固定 viewBox 400×160、chart-box 320px、折线 ≥8 点、柱状 12 根等实现级断言。
- 环形/圆形图**禁 preserveAspectRatio="none"**（圆变椭圆）——定尺寸方形 SVG 居中，中心文字 HTML 绝对定位。
- SVG 拉伸区**禁放文字**——轴标签 / 数值 / 图例一律 HTML 叠层；SVG 属性 stroke/fill 一律 style="var(--chart-*)"（禁裸 hex：svg.paint.non-palette HIGH；禁未定义 var：token.svg-var HIGH）。

**② 结果约束清单（8 条，缺一不可）**

1. **柱底对齐基线**：任何柱数/容器宽度下柱底贴基线（flex 容器 + 基线元素）。
2. **x 轴标签不重叠、不叠柱**：标签独立行（flex 与柱同列宽对齐）——禁止标签作为柱子子级定位；柱多自动跳显。
3. **标签不溢出容器**：图表底部为 x 轴标签留白区（基线下方 ≥20px），x 标签与柱顶数值均不得负定位溢出容器。
4. **折线数据点严格落线**：polyline 与 HTML 点共用同一百分比坐标系（points 坐标 ÷100 = dot left/top）；点固定尺寸正圆（non-scaling-stroke 线宽恒定）。
5. **环形图中心文字不变形**：HTML 绝对定位居中，SVG 只画环。
6. **多系列必配图例**：双系列柱/折线/多段环均有图例；单系列可省。
7. **颜色只用信息化图表色 --chart-***（见 ③）。
8. **图表不溢出卡片**：图表容器高度自定，禁止内容溢出卡片。
9. **网格线水平范围限于绘图区**：网格线两侧为 y 轴刻度标签留白（≥20），不贯穿标签区；y 轴刻度与网格线同高对齐但水平错开（刻度在留白区、网格线在绘图区）——**禁网格线贯穿到图表左右边缘贴卡边**（2026-08-07 执行上报补齐）。

**③ 色彩契约（2026-08-07 强化：系列色只能用 --chart-*）**

- **系列数据色（柱/条/线/环段/点）一律 --chart-* token**（Web 8 色：tech-blue/data-cyan/smart-cyan/fresh-green/vivid-orange/alert-red/wisdom-purple/modern-pink）——**禁通用语义色（--primary/--suc/--warn/--err）做系列色**（门禁 chart.series.color MED 建议）；**禁裸 hex**（HIGH）。
- **辅助线例外**：网格线用中性 --n4 级、目标线可用 --warn（虚线辅助语义）——仅限非数据系列元素。
- 同页 ≤5 个系列色；**同系列数据色统一**（禁最高值强调色）；分组柱状图两系列用两色区分（如 tech-blue + data-cyan）。
- 图例用 .chart-legend / .legend-item + .legend-dot（圆点）/ .legend-line（线段，可 --dash）。

**④ 默认交互与动画（2026-08-06，所有信息化图表默认即带）**

- 图形动画类（真源默认，Agent 给图形元素挂类即得）：柱 .chart-bar（底部升起）、横向条 .chart-hbar（左侧生长）、折线 .chart-line（描边生长）、环 .chart-ring-anim（放大淡入）——时长全走 motion token。
- **数据点 .chart-dot 延迟出现**（animation-delay: var(--motion-duration-slow)，线画完才淡入）——防「点漂移」错位。
- **图形元素悬停（hover 目标是数据元素本身，非整卡；表现 = 阴影 + 微动画 + 颜色强调 三合一）**：柱/条上浮 2px + brightness(1.12) + drop-shadow；圆点放大 1.7×；折线加粗 3.5；环段微膨胀 1.04×——均走 fast token。**禁整卡 hover 浮起**；柱/条进入动画 fill-mode 须用 backwards（both 会锁死 transform 挡住 hover 上浮）。
- **数据悬停阴影层级**：一律 drop-shadow(var(--shadow-data-hover))（单阴影 token，card/row-hover 级轻弥散）——**禁 float/modal 级**。暗色 --shadow-data-hover 已补（2026-08-07）。
- 环状图分段数据：中心常显主段数值，悬停环段切换对应段数值（Web）；移动端点按段（附录 A 脚本）。

**⑤ 门禁口径**

- 容器缺失（chart.container.missing）→ HIGH；SVG 裸 hex（svg.paint.non-palette）→ HIGH；未定义 var（token.svg-var）→ HIGH；**系列色用通用语义色（chart.series.color）→ MED**（建议 --chart-*，目标线 polyline+dasharray 豁免）；meet 撑不满（chart.svg.fill）→ MED；内容贴边（chart.svg.viewbox-edge）→ MED；SVG 内文字（chart.text.inline）→ MED；数据区左右对称（chart.symmetry）→ MED；柱底对齐基线（chart.baseline）→ MED。


