# 弘讯B端 · 组件规格层（Component Spec Layer）

> **版本** v1.1.0 · **平台** Web · **角色** 组件唯一真源（格式中立）
> ⚠️ 本文件为 `components.json` 的人读镜像。**修改请以 `components.json` 为准**（机器/Agent 读 JSON，校验脚本亦读 JSON）。
> 两类消费者：① 其他同事（非 Ardot）读 `referenceCss/referenceHtml` → 直接生成合规 HTML；② UI 设计师（你）读规格 → 在 Ardot 内搭建/维护组件库（见每组件 `Ardot 搭建指引`）。

## 通用约定（所有组件共用）

| 项 | 值 |
|---|---|
| 圆角 | sm 2 / base 4 / md 8 / lg 16 / full 999 |
| 字重 | Regular 400 / Medium 500 |
| 字号 | Caption 12 / Body 14 / Title 16 |
| 最小点击目标 | Web 32px |
| 色彩铁律 | 功能色对齐 Ant Design：成功 `#389E0D` / 警告 `#FA8C16` / 错误 `#F5222D`；运行绿 `#16A34A` 独立于成功绿（状态灯必用）；**Web 禁止 `#10B981`**。语义约定：`--suc/--warn/--err/--run` 现=**背景色**（与移动端对齐）；浅底 Tag 用 `--*-soft`，filled 白字场景用 `--*-fg` |

变量命名与 `design-system-showcase.html :root` 一致（`--primary`/`--n5`/`--n6`/`--n3`/`--radius-base`/`--radius-md`/`--shadow-float` …），写 CSS 前先读该文件。

> **布局与卡片对齐契约（2026-08-04 补强，详见 RULES §3.7 / §4.3 / §4.4）**：
> - 带 `.btn-ico` 的按钮文字一律 `.btn-label` 包裹（门禁 `btn.label.required` HIGH）
> - KPI 卡数 ≠4 必须 `.stat-grid--N`（门禁 `stat-grid.count.match` HIGH）
> - 图表 SVG 用 `.chart-svg--fill` + 禁 `meet`（`chart.svg.fill`）+ viewBox 右留 ≥20px 边距（`chart.svg.viewbox-edge`）
> - `.grid12 > .col-N` 内卡片一律 `.card--fill`（col-N 弹性容器 flex column + 卡片 flex:1 平分列高，`card.fill-in-grid` MEDIUM）
> - 动态表格补 `minRow` 占位行（`layout.table-minrow` MEDIUM）；模块间距模板兜底、页面禁覆盖容器 margin（`layout.module-spacing` MEDIUM）
>
> **产出落盘（2026-08-06 更新）**：HTML 原型 / 视觉稿一律写「**用户项目**」的 `output/`（无则建，**不是设计系统仓库 output/**），文件名自动拼 `<页面语义名>_<YYYYMMDD>_<HHmm>.html`（同日重名递增 `_2`，禁覆盖）；CSS 链接相对路径指向 `弘讯web端design-system/template.css`；门禁对 `<用户项目路径>/output/<文件>` 自检（详见 GENERATION-SOP 步骤4 产出落盘规则）。

## 范围（v1.1）

已覆盖**全部 11 个组件**：下拉 / 日期 / 树 / 弹窗（原缺口 4 个）+ 按钮 / 输入 / 表格 / 标签 / 页签 / 分页 / 状态点（原 MASTER §6.2 + showcase 已规范的 7 个）。
每个组件的完整 `referenceCss / referenceHtml / Ardot 搭建指引` 见 `components.json`（机器/Agent/校验脚本均读 JSON）。

### Ardot 对账（2026-07-28 收口，只读比对 + 缺口补建，已完成）

用 `ardot-design` MCP `fetch_component_lib` 拉取 Web Ardot 文件 `701545559030003` 本地组件库比对，并由 Agent 按 components.json 的 `ardot` 字段补建缺口组件；**下拉/页签/标签** 三处由设计师于 2026-07-28 在 Ardot 内「合并为变体」收口。

| 组件 | Ardot 对应 | 状态 |
|---|---|---|
| 按钮 Button | 主按钮+次按钮+文字按钮+Button/中 | ✅ 已覆盖 |
| 单行输入 Input | 单行输入+单行输入B | ✅ 已覆盖 |
| 表格 Table | 单行表格+表格表头 | ✅ 已覆盖（表头高44/N2/字重500） |
| 日期 DatePicker | 日期选择框/选择-时分秒+日历 | ✅ 已覆盖 |
| 树 Tree | 作业树二级菜单 | ✅ 已覆盖 |
| 弹窗 Modal | 弹窗 | ✅ 已覆盖 |
| 分页器 Pager | 分页器+分页器A | ✅ 已覆盖 |
| 状态指示灯 | 状态指示灯 | ✅ 已覆盖 |
| 标签 Tag | 绿色标签 → 补齐 成功/警告/错误/运行 4 态 | ✅ 已覆盖（原仅绿色单态，已补齐） |
| 下拉 Select | 仅箭头子件 → 新建 触发器+浮层+选项（默认/带搜索/禁用/多选） | ✅ 已覆盖（新建 + 合并为变体） |
| 页签 Tabs | 无 → 新建 基础/带徽标/滚动 3 变体 | ✅ 已覆盖（新建 + 合并为变体） |

> 结论：**11/11 全覆盖**。本层（components.json）现已成为 HTML 生成（referenceCss/Html）与 Ardot 搭建（ardot 字段）的单一真源；Agent 起手请 clone `page-template.html`（见 README 第 5 步 + 第 7 步）。

---

## 1. 下拉选择 Select / Dropdown

**数据录入 · 触发器外观与单行输入完全一致**

| 部位 | 尺寸/色 |
|---|---|
| 触发器 | 高 32 · 最小宽 120 · 内距 12 · 半径 4 · 字号 14/400 · 底 N5 `#EAEAED` · 边 N6 `#DEE2E6` |
| 浮层 | 半径 8 · 底 N1 `#FFFFFF` · 边 N6 · Shadow-Float · 内距上下 4 · 最大高 240 |
| 选项 | 高 32 · 内距 12 · 字号 14 |

**状态**：触发器默认(N5/N6/N10) · hover(边 N7) · focus(边 primary+ring) · 禁用(底 N4/字 N8)；选项 hover(底 N3) · 选中(底 `#DAEAFA`/字 `#004A8F`)。

**`referenceCss`**
```css
.sel{position:relative;display:inline-block;min-width:120px}
.sel-trigger{height:32px;width:100%;padding:0 12px;display:flex;align-items:center;justify-content:space-between;background:var(--n5);border:1px solid var(--n6);border-radius:var(--radius-base);font-size:14px;font-weight:400;color:var(--n10);font-family:var(--font-cn);cursor:pointer}
.sel-trigger:hover{border-color:var(--n7)}
.sel-trigger:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 2px rgba(0,94,174,.2)}
.sel-trigger:disabled{background:var(--n4);color:var(--n8);cursor:not-allowed}
.sel-arrow{color:var(--n9);font-size:12px}
.sel-panel{position:absolute;top:calc(100% + 4px);left:0;min-width:100%;max-height:240px;overflow:auto;background:var(--n1);border:1px solid var(--n6);border-radius:var(--radius-md);box-shadow:var(--shadow-float);padding:4px 0;z-index:50}
.sel-opt{height:32px;display:flex;align-items:center;gap:4px;padding:0 12px;font-size:14px;color:var(--n10);cursor:pointer}
.sel-opt:hover{background:var(--n3)}
.sel-opt.on{background:var(--primary-dis-bg);color:var(--primary-active)}
```

**Ardot 搭建指引**：Select/Dropdown 组件，trigger 对应主组件默认态（高32/半径4/N5底/N6边），panel 对应 overlay 变体，option 行高32 对应 option 变体。**选中项用 `#DAEAFA` 底 + `#004A8F` 字，勿整行纯 primary 填充；箭头用 N9 中性色。**

**DO** 触发器与输入框一致 · 选中浅 primary 底+深 primary 字 · 浮层 Shadow-Float+半径8
**DON'T** 整行 primary 填充 · 箭头用品牌色 · panel 圆角≠8 · 选项 hover 用 primary

---

## 2. 日期选择 DatePicker

**数据录入 · 触发器同输入，日历浮层 290 宽**

| 部位 | 尺寸/色 |
|---|---|
| 触发器 | 同输入：高 32 · 最小宽 160 · 半径 4 · 底 N5 · 边 N6 |
| 浮层 | 宽 290 · 半径 8 · 底 N1 · 边 N6 · Shadow-Float · 内距 12 |
| 头部 | 标题 14/500/N11 · 箭头 N9(hover N10) |
| 日期格 | 36×36 · 字号 14 · 圆角 4 · 格间距 2 |

**状态**：触发器默认(N5/N6/N10) · focus(边 primary+ring) · 禁用(底 N4/字 N8)；日期格默认(N10) · hover(底 N3) · 选中(底 primary/白字) · 今日(边 primary+字 primary) · 禁用/非本月(N8)。

**`referenceCss`**
```css
.dp{position:relative;display:inline-block}
.dp-trigger{height:32px;min-width:160px;padding:0 12px;display:flex;align-items:center;justify-content:space-between;background:var(--n5);border:1px solid var(--n6);border-radius:var(--radius-base);font-size:14px;color:var(--n10);font-family:var(--font-cn);cursor:pointer}
.dp-trigger:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 2px rgba(0,94,174,.2)}
.dp-panel{width:290px;background:var(--n1);border:1px solid var(--n6);border-radius:var(--radius-md);box-shadow:var(--shadow-float);padding:12px}
.dp-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.dp-title{font-size:14px;font-weight:500;color:var(--n11)}
.dp-nav{color:var(--n9);cursor:pointer;padding:4px}
.dp-nav:hover{color:var(--n10)}
.dp-week{display:grid;grid-template-columns:repeat(7,1fr);font-size:12px;color:var(--n8);text-align:center;margin-bottom:4px}
.dp-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px}
.dp-cell{height:36px;display:flex;align-items:center;justify-content:center;font-size:14px;color:var(--n10);border-radius:var(--radius-base);cursor:pointer}
.dp-cell:hover{background:var(--n3)}
.dp-cell.on{background:var(--primary);color:#fff}
.dp-cell.today{border:1px solid var(--primary);color:var(--primary)}
.dp-cell.di{color:var(--n8);cursor:not-allowed}
```

**Ardot 搭建指引**：DatePicker/Calendar 组件，trigger 复用 Input 组件；panel 对应 Calendar overlay；cell 36 对应 day-cell 变体。**选中日用 primary 实底白字，今日用 primary 描边+字；范围起止用 primary 实底、区间用 `#DAEAFA` 浅底。勿用成功绿表达选中。**

**DO** 触发器与输入一致 · 选中 primary 实底白字/今日 primary 描边 · cell hover N3
**DON'T** 选中用成功绿 `#389E0D` · cell 圆角≠4 · panel 宽≠290

---

## 3. 树菜单 Tree（作业树 / 二级菜单）

**导航 · 层级节点，节点高32，每级缩进16**

| 部位 | 尺寸/色 |
|---|---|
| 节点 | 高 32 · 字号 14/400 · 字 N10 · 内距左右 8 · 半径 4 |
| 节点图标 | 16px（`.ico`，stroke=currentColor）· **每个节点（含二级子节点）必带** · 收起侧栏(.sidebar.collapsed)只显示图标 |
| 每级缩进 | 16px |
| 展开箭头 | 16 · N9(hover N10) |

**状态**：节点默认(N10) · hover(底 N3)；箭头默认 N9 · hover N10。

**⚠️ 侧栏折叠按钮定位 + 滚动条（2026-08-03 裁定，真源 = template.css）**：

| 项 | 规则 |
|---|---|
| 折叠按钮定位 | `.sidebar-foot > .collapse-btn` **固定在侧栏右下角**，`flex-shrink:0` + 高 44px + `z-index:2`（始终在作业树之上），**不随菜单多少移动**（禁用旧版 `position:sticky`） |
| 作业树滚动区 | `.sidebar .tree` 单独 `flex:1 1 auto; min-height:0; overflow-y:auto` —— 菜单溢出时只在侧栏高度内截断/滚动，红线下方不显示 |
| 滚动条 | **视觉隐藏、保留滚动**：`.sidebar .tree{scrollbar-width:none;-ms-overflow-style:none}` + `.sidebar .tree::-webkit-scrollbar{width:0;height:0;display:none}`（兼容 Chrome/Safari/FF/Edge） |
| 折叠态居中 | `.sidebar.collapsed` 按钮 44×44 与 `.tree-node` 同高（44px）→ 与作业树图标垂直居中；`.tree` 底部 padding 归零 |

**⚠️ 选中态按「树所在表面」分两种，必须对号入座：**

| 表面 | 用在哪 | 选中底 | 选中字 | 强调条(已取消) | 箭头 |
|---|---|---|---|---|---|
| **白底/内容表面** | 卡片内、内容区筛选树、抽屉树 | `#DAEAFA`（`--primary-dis-bg`） | `#004A8F`（`--primary-active`） | 无（靠实底+字重 500 表达） | 同选中字色 |
| **品牌色表面** | `.sidebar` / `.demo-sidebar` / `.tree--brand`（品牌蓝底侧栏） | `#004A8F`（`--primary-active` 实底） | `#FFFFFF`（`--n1`） | 无（2026-07-31 领导裁定取消） | 白 |

判定口诀：**树的父容器是不是品牌蓝底？是 → 深 primary 实底 + 白字；否 → 浅 primary 底 + 深 primary 字。**

> ⚠️ **暗色下取白字要换 token**：中性梯在暗色是反相的（亮色 `--n1`=白、`--n11`=近黑；暗色 `--n1`=`#1E293B` 深表面、`--n11`=`#FFFFFF`）。所以品牌表面选中的白字/白箭头，**亮色写 `--n1`、暗色写 `--n11`**。照抄亮色规则到暗色页会得到"深字压深蓝底"。

**`referenceCss`**
```css
.tree{font-family:var(--font-cn);font-size:14px;color:var(--n10)}
.tree-node{height:32px;display:flex;align-items:center;padding:0 8px;border-radius:var(--radius-base);cursor:pointer;transition:background var(--motion-duration-fast),color var(--motion-duration-fast)}
.tree-node:hover{background:var(--n3)}
/* 白底/内容表面 */
.tree-node.on{background:var(--primary-dis-bg);color:var(--primary-active);font-weight:500}
.tree-node.on .tree-sw{color:var(--primary-active)}
/* 品牌色表面（蓝底侧栏）—— 覆盖上面一组；不用左侧白强调条（2026-07-31 取消） */
.sidebar .tree-node.on,.demo-sidebar .tree-node.on,.tree--brand .tree-node.on{background:var(--primary-active);color:var(--n1);font-weight:500}
.sidebar .tree-node.on .tree-sw,.demo-sidebar .tree-node.on .tree-sw,.tree--brand .tree-node.on .tree-sw{color:var(--n1)}
.tree-sw{width:16px;height:16px;margin-right:4px;color:var(--n9);display:inline-flex;align-items:center;justify-content:center;transition:transform var(--motion-duration-fast),color var(--motion-duration-fast)}
.tree-sw:hover{color:var(--n10)}
.tree-sw.collapsed-sw{transform:rotate(-90deg)}
.tree-label{flex:1}
.tree-group{overflow:hidden;transition:max-height var(--motion-duration-fast) var(--motion-ease-out)}
```

**Ardot 搭建指引**：Tree/作业树组件，node 高32 对应 tree-item；switcher 对应 expand-icon 变体；缩进每级16 对应 padding 变体。**选中态做两个变体：`selected`（白底表面 = `#DAEAFA` 底 + `#004A8F` 字，与下拉统一）与 `selectedOnBrand`（品牌蓝底侧栏 = `#004A8F` 实底 + 白字，不用左侧白强调条）。连接线用 N6。** 每个节点（含二级子节点）必须带图标；收起侧栏时只显示图标。

**DO** 节点高32、按级缩进16 · 每个节点（含二级子节点）带图标，收起侧栏只显示图标 · 选中先看表面再选样式（白底=浅 primary 底+深 primary 字；品牌底=深 primary 实底+白字，不用左侧白强调条） · switcher 跟随选中字色
**DON'T** **在品牌蓝底侧栏里用 `#DAEAFA` 浅 chip 当选中（`--primary-dis-bg` 的语义是"禁用态"，蓝底上会读成一块逃出来的禁用块）** · 在白底内容区用整行 primary 实底 · 选中了箭头还留浅色（蓝底上白箭头 / 浅底上白箭头都算对比度错） · 节点不带图标 · 缩进非 16 倍数 · switcher 默认态用品牌色

---

## 4. 弹窗 Modal / Dialog

**反馈 · 居中模态 382×257 基准**

| 部位 | 尺寸/色 |
|---|---|
| 对话框 | 宽 382 · 最小高 257 · 半径 8 · 底 N1 · 边 N6 · Shadow `0 3px 2px rgba(11,23,55,0.10)` |
| 头部 | 高 40 · 标题 16/500/N11 · 内距 16 · 底分割线 N6 |
| 内容 | 内距 16/24 · 字号 14 · 字 N10 |
| 底部 | 内距 12/16 · 顶分割线 N6 · 按钮右对齐 · 间距 8 |

**状态**：遮罩 `rgba(0,0,0,0.45)`；主按钮(底 primary/白字，hover `#1A75D2`/active `#004A8F`)；取消按钮(底 N1/字 primary/边 N6)。

**`referenceCss`**
```css
.modal-mask{position:fixed;inset:0;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;z-index:100}
.modal{width:382px;min-height:257px;background:var(--n1);border:1px solid var(--n6);border-radius:var(--radius-md);box-shadow:0 3px 2px rgba(11,23,55,0.10);display:flex;flex-direction:column}
.modal-head{height:40px;display:flex;align-items:center;padding:0 16px;border-bottom:1px solid var(--n6);font-size:16px;font-weight:500;color:var(--n11)}
.modal-body{flex:1;padding:16px 24px;font-size:14px;color:var(--n10);font-family:var(--font-cn)}
.modal-foot{display:flex;justify-content:flex-end;gap:8px;padding:12px 16px;border-top:1px solid var(--n6)}
.modal-foot .btn-p{height:32px;padding:0 16px;border:none;border-radius:var(--radius-md);background:var(--primary);color:#fff;font-size:14px;cursor:pointer}
.modal-foot .btn-p:hover{background:var(--primary-hover)}
.modal-foot .btn-c{height:32px;padding:0 16px;border:1px solid var(--n6);border-radius:var(--radius-md);background:var(--n1);color:var(--primary);font-size:14px;cursor:pointer}
```

**Ardot 搭建指引**：Modal/Dialog 组件，dialog 382 对应主组件；header 40 对应 modal-header 变体；footer 按钮用 Button 组件(高32/半径8)。**遮罩用半透明黑 `rgba(0,0,0,.45)`，勿用主色遮罩；危险操作用错误红主按钮（`err`），非 primary。**

**DO** dialog 宽382/圆角8/底N1/Shadow-Modal · 头40、标题16 Medium N11 · 遮罩半透明黑
**DON'T** 遮罩用主色 · 圆角≠8 · 头高≠40 · footer 按钮高≠32

---

## 字阶 Typography（十三级，2026-07-30 B 包硬切换）

> 唯一真源：`MASTER.md §2 Typography`（13 级：Display 32px ~ Mono）。本表是 MASTER §2 的角色→组件 class 映射，禁止自行发明字号。
> 真源链：`tokens.json.font.scale` ↔ `components.json.typography`（contract `type.*` 强制 `.t-*` 类）↔ `template.css .t-*` ↔ Ardot 本地 Text Style。字体 Source Han Sans CN / Roboto。

| 级别 | class | 字号/行高 | 字重 | 用途 | 填充 token |
|------|-------|-----------|------|------|-----------|
| Display | `.t-display` | 32/40 | Medium 500 | 页面主标题 | N11 |
| H1 | `.t-h1` | 28/36 | Medium 500 | 模块标题 | N11 |
| H2 | `.t-h2` | 24/32 | Medium 500 | 区块标题 | N11 |
| H3 | `.t-h3` | 20/28 | Medium 500 | 卡片/弹窗标题 | N11 |
| H4 | `.t-h4` | 18/26 | Medium 500 | 子标题 | N11 |
| H5 | `.t-h5` | 16/24 | Medium 500 | 小节标题 | N11 |
| Body1 | `.t-body1` | 14/22 | Regular 400 | 正文/表单/列表/**按钮文本** | N10（按钮文本保留语义色） |
| Body2 | `.t-body2` | 13/20 | Regular 400 | 辅助说明 | N9 |
| Caption | `.t-caption` | 12/16 | Regular 400 | 图表标注/表单提示 | N9 |
| Label | `.t-label` | 12/16 | Medium 500 | 表单标签/状态标签文本 | N10/N11 |
| Overline | `.t-overline` | 11/16 | Medium 500 | 极小标注 | N9 |
| Link | `.t-link` | 14/22 | Regular 400 | 超链接 | var(--link) |
| Mono | `.t-mono` | — | — | 等宽（工控数据/代码） | — |

**DO** 按钮文本一律绑 Body1（14px/Regular 400，含小按钮）· HTML 用 `.t-h1…t-link` 类
**DON'T** 按钮用 Medium 500（那是移动端约定）· 小按钮回退 12px · 硬编码字号绕过 `.t-*`

---

## 校验与接入

- 机器/Agent 读 `components.json`；人读本 `components.md`。
- 后续 `validate-spec.js` 将把本层 `sizing/states` 纳入 HTML 合规扫描（检查非法 hex、错误尺寸/字重/半径）。
- 设计师每次在 Ardot 改组件，须回查本层数值保持一致；本层为单一真源，Ardot 组件是下游消费者。

## Elevation 引用规范（A 包，2026-07-30）

> 组件按 elevation 层级引用 shadow/surface。详见 MASTER.md §5.1 场景表。值真源 `tokens.json` 的 `elevation` 节；引证见 `TOKENS-EVIDENCE.md`。

| 组件 | elevation 级别 | CSS 引用 |
|------|--------------|---------|
| Modal / Dialog | overlay | `box-shadow: var(--elev-overlay)`（或 `--shadow-modal`，已对齐 overlay 强度） |
| Dropdown / Popover / Tooltip | overlay | `box-shadow: var(--elev-overlay)` |
| Card（可移动/强调） | raised | `box-shadow: var(--elev-raised)`（或 `--shadow-card`） |
| Card（flat） | default | `border: 1px solid var(--n6)`（无阴影） |
| 表格横向滚动边界 | overflow | `box-shadow: var(--elev-overflow)` |
| 看板列/筛选区 | sunken | `background: var(--n4)`（无阴影，靠色差下沉） |

**迁移提示**：旧 `--shadow-*` 仍可用（值已升级双层复合）；新组件优先用 `--elev-*` 语义层级。`--shadow-modal` 与 `--elev-overlay` 强度对齐，可互换。Motion token（`--motion-duration-*` / `--motion-ease-*`）用于组件过渡动画。

## 字阶 / 等宽 / 密度引用规范（B 包，2026-07-30）

> **字阶硬切换 13 级**（breaking）：旧 7 级（H1 20/28）→ 新 13 级（Display 32px ~ Overline 11px）。详见 MASTER §2。class 名 `.t-display/.t-h1/.t-h2/.t-h3/.t-h4/.t-h5/.t-body1/.t-body2/.t-caption/.t-label/.t-overline/.t-link/.t-mono`。
> **等宽**：`.t-mono` 或 `font-family: var(--font-mono)` 用于代码/设备参数/数值数据；数值对齐用 `font-variant-numeric: tabular-nums`（勿用 mono 对齐数字）。
> **密度**：`:root[data-density="compact|comfortable|spacious"]` 切换 `--density-row-height` / `--density-content-padding`。compact 用于数据密集表格（opt-in 非默认），comfortable 默认基准。
> **迁移**：旧 `.t-h1`（20/28）→ 新 `.t-h1`（28/36），值变 class 名不变；新增 `.t-display/.t-h4/.t-h5/.t-label/.t-overline/.t-mono`。
