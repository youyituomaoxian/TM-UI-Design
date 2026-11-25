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

变量命名与 `template.css :root` 一致（`--primary`/`--n5`/`--n6`/`--n3`/`--radius-base`/`--radius-md`/`--shadow-float` …），写 CSS 前先读真源。

> **布局与卡片对齐契约（2026-08-04 补强，详见 RULES §3.7 / §4.3 / §4.4）**：
> - 带 `.btn-ico` 的按钮文字一律 `.btn-label` 包裹（门禁 `btn.label.required` HIGH）
> - KPI 卡数 ≠4 必须 `.stat-grid--N`（门禁 `stat-grid.count.match` HIGH）
> - 图表 SVG 用 `.chart-svg--fill` + 禁 `meet`（`chart.svg.fill`）+ viewBox 右留 ≥20px 边距（`chart.svg.viewbox-edge`）
> - `.grid12 > .col-N` 内卡片一律 `.card--fill`（col-N 弹性容器 flex column + 卡片 flex:1 平分列高，`card.fill-in-grid` MEDIUM）
> - 动态表格补 `minRow` 占位行（`layout.table-minrow` MEDIUM）；模块间距模板兜底、页面禁覆盖容器 margin（`layout.module-spacing` MEDIUM）
>
> **产出落盘（2026-08-06 更新）**：HTML 原型 / 视觉稿一律写「**用户项目**」的 `output/`（无则建，**不是设计系统仓库 output/**），文件名自动拼 `<页面语义名>_<YYYYMMDD>_<HHmm>.html`（同日重名递增 `_2`，禁覆盖）；CSS 链接相对路径指向 `弘讯web端design-system/template.css`；门禁对 `<用户项目路径>/output/<文件>` 自检（详见 GENERATION-SOP 步骤4 产出落盘规则）。

## 范围（v1.1）

已覆盖全部组件；原缺口 4 个已补建（清单见 `components.json`）。
每个组件的完整 `referenceCss / referenceHtml / Ardot 搭建指引` 见 `components.json`（机器/Agent/校验脚本均读 JSON）。

> **Pager 层级**：见 `components.json#pageContracts`（`.card--fill` footer 合法；普通 `.card` 裸 pager HIGH）。

> Ardot 对账（2026-07-28）历史见 `CHANGELOG-archive-2026-08_09.md`；契约以 `components.json#ardot` 为准。

> **表格行态（2026-10-20 v2）**：单选/多选选中统一 = `.is-selected` 底色 + 2px 左条；多选由 `.cbx` 复选框触发（`data-select="multi"`，列宽 40，`th.ck/td.ck`），单选由行点击触发（`data-select="single"`，无控件，整行 `cursor:pointer`）；未选中行点击只表现为 hover。文字恒 N10，表格内禁 N9 次级文字（细节见 RULES §3.3）。

> 契约以 `components.json` 为准（referenceCss/Html + ardot 字段）。

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
.sel-opt.on{background:var(--select-item-bg);color:var(--select-item-fg)}
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
| 节点图标 | 16px（`.ico`，stroke=currentColor）· **每个节点（含二级子节点）必带** · 收起左栏(.rail.collapsed)只显示图标 |
| 每级缩进 | 16px |
| 展开箭头 | 16 · N9(hover N10) |

**状态**：节点默认(N10) · hover(底 N3)；箭头默认 N9 · hover N10。

**折叠态（2026-11-06 拍板）**：`.rail.collapsed` 只显示一级节点，二/三级隐藏；点一级按分型弹浮层或直接选中。`.branch-active` 是一级「当前分支」态，**不是选中态**。

| 项 | 规则 |
|---|---|
| 折叠态显隐 | `.rail.collapsed .tree > .tree-group{display:none}`；存量页兼容按 DOM 判断 |
| 一级分型 | `data-group`（分组→弹浮层）/ `data-page`（可导航→选中）；**`data-page` + 子级 → 弹浮层，首项「进入本页」**（门禁 `tree.node.split` 查 `data-self`）；无属性按 DOM 兜底 |
| `.branch-active` 展开 | `rgba(255,255,255,.08)`，hover `.16`，圆角 4 |
| `.branch-active` 折叠 | `rgba(255,255,255,.18)`，圆角 4 |
| 一级自身是页面 | `.on` 实底 `--primary-active` + 白字（覆盖 branch） |
| 浮层 `.tree-popover` | min 200 / max 260；padding 6；标题 12/N9；项 36/14；三级 32/13 缩进 34；白底选中 `--select-item-bg/fg`；暗色底 `--n2` |
| 浮层定位 | `position:fixed`，左栏右缘 +8，底部溢出向上翻；一次只开一个；外部点击/Esc/选中后关闭 |

**⚠️ 左栏折叠按钮定位 + 滚动条（真源 = template.css）**：

| 项 | 规则 |
|---|---|
| 折叠按钮定位 | `.rail-foot > .rail-toggle` **固定在左栏底部**，30×30，与版权同排（不随菜单多少移动） |
| 作业树滚动区 | `.rail .tree` 单独 `flex:1 1 auto; min-height:0; overflow-y:auto` —— 菜单溢出时只在左栏高度内截断/滚动 |
| 滚动条 | **视觉隐藏、保留滚动**：`.rail .tree{scrollbar-width:none;-ms-overflow-style:none}` + `.rail .tree::-webkit-scrollbar{width:0;height:0;display:none}`（兼容 Chrome/Safari/FF/Edge） |
| 折叠态居中 | `.rail.collapsed` 按钮居中；`.tree` 底部 padding 归零 |

**⚠️ 选中态按「树所在表面」分两种，必须对号入座：**

| 表面 | 用在哪 | 选中底 | 选中字 | 强调条(已取消) | 箭头 |
|---|---|---|---|---|---|
| **白底/内容表面** | 卡片内、内容区筛选树、抽屉树 | `--select-item-bg`（亮 `#DAEAFA` / 暗 `#23395D`） | `--select-item-fg`（亮 `#004A8F` / 暗 `#F1F5F9`） | 无（靠实底+字重 500 表达） | 同选中字色 |
| **品牌色表面** | `.rail` / `.tree--brand`（品牌蓝底左栏） | `#004A8F`（`--primary-active` 实底） | `#FFFFFF`（`--n1`） | 无（2026-07-31 领导裁定取消） | 白 |

判定口诀：**树的父容器是不是品牌蓝底？是 → 深 primary 实底 + 白字；否 → 浅 primary 底 + 深 primary 字。**

> ⚠️ **暗色下取白字要换 token**：中性梯在暗色是反相的（亮色 `--n1`=白、`--n11`=近黑；暗色 `--n1`=`#1E293B` 深表面、`--n11`=`#FFFFFF`）。所以品牌表面选中的白字/白箭头，**亮色写 `--n1`、暗色写 `--n11`**。照抄亮色规则到暗色页会得到"深字压深蓝底"。

**`referenceCss`**
```css
.tree{font-family:var(--font-cn);font-size:14px;color:var(--n10)}
.tree-node{height:32px;display:flex;align-items:center;padding:0 8px;border-radius:var(--radius-base);cursor:pointer;transition:background var(--motion-duration-fast),color var(--motion-duration-fast)}
.tree-node:hover{background:var(--n3)}
/* 白底/内容表面 */
.tree-node.on{background:var(--select-item-bg);color:var(--select-item-fg);font-weight:500}
.tree-node.on .tree-sw{color:var(--select-item-fg)}
/* 品牌色表面（蓝底左栏）—— 覆盖上面一组；不用左侧白强调条（2026-07-31 取消） */
.rail .tree-node.on,.tree--brand .tree-node.on{background:var(--primary-active);color:var(--n1);font-weight:500}
.rail .tree-node.on .tree-sw,.tree--brand .tree-node.on .tree-sw{color:var(--n1)}
.tree-sw{width:16px;height:16px;margin-right:4px;color:var(--n9);display:inline-flex;align-items:center;justify-content:center;transition:transform var(--motion-duration-fast),color var(--motion-duration-fast)}
.tree-sw:hover{color:var(--n10)}
.tree-sw.collapsed-sw{transform:rotate(-90deg)}
.tree-label{flex:1}
.tree-group{overflow:hidden;transition:max-height var(--motion-duration-fast) var(--motion-ease-out)}
```

**Ardot 搭建指引**：Tree/作业树组件，node 高40 对应 tree-item；switcher 对应 expand-icon 变体；缩进每级16 对应 padding 变体。**选中态做两个变体：`selected`（白底表面 = `#DAEAFA` 底 + `#004A8F` 字，与下拉统一）与 `selectedOnBrand`（品牌蓝底左栏 = `#004A8F` 实底 + 白字，不用左侧白强调条）。连接线用 N6。** 每个节点（含二级子节点）必须带图标；收起左栏时只显示图标。

**DO** 节点高40、按级缩进16 · 每个节点（含二级子节点）带图标，收起左栏只显示图标 · 选中先看表面再选样式（白底=浅 primary 底+深 primary 字；品牌底=深 primary 实底+白字，不用左侧白强调条） · switcher 跟随选中字色
**DON'T** **在品牌蓝底左栏里用 `#DAEAFA` 浅 chip 当选中（`--primary-dis-bg` 的语义是"禁用态"，蓝底上会读成一块逃出来的禁用块）** · 在白底内容区用整行 primary 实底 · 选中了箭头还留浅色（蓝底上白箭头 / 浅底上白箭头都算对比度错） · 节点不带图标 · 缩进非 16 倍数 · switcher 默认态用品牌色

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
| 页头标题 | `.page-title` | 18/26 | Medium 500 | **内页页头标题**（非字阶层；RULES §1.4 例外：内页页头不走 .t-display/.t-h1） | N11 |
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

> 组件按 elevation 层级引用 shadow/surface。详见 MASTER.md §5.1 场景表。值真源 `tokens.json` 的 `elevation` 节；对标引证文件已移除。

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

## 空态 / 步骤 / 时间线 / 描述列表（2026-10-20 新增）

| 组件 | 类 | 关键规格 |
|---|---|---|
| 空态 | `.empty` `.empty-ico` `.empty-title` `.empty-desc` `.empty-actions` | 图标 48 圆（N3 底/N9 字）、标题 14/500/N11、说明 12/N9、主操作 1 个；表格 0 行时替换表格 |
| 步骤条 | `.steps` `.step` `.step-dot` `.step-text` `.step-line` | 点 24 圆、连接线 1px N6；`.is-done` 实底 primary+白字，`.is-active` 描边 primary+primary 字 |
| 时间线 | `.timeline` `.tl-item` `.tl-dot` `.tl-time` `.tl-text` | 点 8、线 1px N6、时间 12/N9、正文 14/N10；`.is-active` 圆点实心 |
| 描述列表 | `.descriptions` `.desc-item` `.desc-label` `.desc-value` | 自适应列 min240、行高 40、label 96/13/N9、value 14/N10 省略号 |
| 工序流程（2026-11-20） | `.flow` `.flow-step` `.flow-ico` `.flow-info` `.flow-tag` `.flow-conn` `.flow-arrow` `.flow--row` | 节点 = 图标块 28 + 文字块（`.t-*`）+ `.badge`；纵向链用 `.flow-conn` 虚线连接，`.flow--row` 横向节点卡 + `.flow-arrow` 箭头；`.is-err`/`.is-warn` 改图标块与边框 |

**用法**：空数据禁止留白表格；步骤/时间线/键值对统一复用上述类，不自造。

> **`.steps` vs `.flow`**：`.steps` = 线性进度（`is-done/is-active`）；`.flow` = 流程健康态 + 节点指标（设备工序链）。工序图禁页面自造 `.flow*`（门禁已纳入前缀）。
> **Badge 六态（补 `.badge-info`）**：统一「同系 soft 底 + 同系深字」；`.badge-warn` 文字改 `--warn × --n11` 混色（亮 4.97:1 AA、暗回 `--warn`）；「提示」不得再用 `.badge-muted`。
> **卡头高度**：含 32px 控件（`.btn:not(.btn-sm)`/`.filter-chip`/`.input`/`.sel-trigger`）时 `:has()` 自动 48（上下各 8），页面无需改类。

## 页面模板（非组件，独立页）

- **登录页 v2**（2026-10-30，2026-11-18 定稿）：左右分栏 58/42 + 白卡浮层 + 卡外 logo（高 40）+ 卡内标题组/「登录」/字段标签 + 账号/密码 + 卡内 3 步找回（含 6 位验证码）→ 规格见 `RULES.md §1.1b 登录页`；类名 `.login-*` / `.login-field` / `.login-label` / `.input-lg`（40 高）；背景图与提示词模板见 `assets/login-hero/README.md`（资产准入脚本 `validate-hero.js`）。

## 机器卡片（machine-card · 2026-11-19 新增）

- **用途**：设备列表卡片视图，展示状态、当前产品/工艺、周期、四项过程指标、进度与计数。
- **结构**：`.machine-list`（3 列）→ `.machine-card`（左 3px 状态条）→ `.mc-head` / `.mc-row` / `.mc-cycle` / `.mc-metrics` / `.mc-bar` / `.mc-foot`。
- **状态**：`.machine-card--idle`（state-idle）、`.machine-card--stop` / `--off`（state-stop）、`.machine-card--fault`（state-fault）、`.machine-card--offline`（state-offline 虚线）；默认 state-run。
- **规格**：状态条 3px；标题 16/600 + 编码 12；周期 24/28 mono；指标条 n3 四列；进度条 6px；footer 11。
- **禁忌**：关机不用蓝色；指标不超过 4 项；卡内不再套卡；状态不只靠 badge，必须有左侧状态条。
- **代码**：`referenceCss / referenceHtml` 见 `components.json#machine-card`；示例 `showcase/左右结构_v7_设备运维工作台.html`（机器群览区）。
- **真源**：`packages/web-ui/src/styles/components.css`；`template.css` 由 `build-template-css.js` 生成。

---

## 工作台页面模式（workbench · 2026-11-19）

- **真源**：`packages/web-ui/src/styles/workbench.css`（build 进 template.css 第五件）。
- **骨架**：`.shell`（rail 216/64 + workspace）→ `.ws-global` 60 → `.ws-pagebar` 56 → `.ws-body` 内滚；左栏 `.rail/.tree/.rail-foot`。
- **页面模式**：`.page-sec` / `.pane-note` / `.seg-row` / `.monitor-split`（1476 侧栏，≤1475 抽屉）/ `.detail-card`。
- **表格卡**：`.table-card` / `.table-scroll` / `.table-tools` / `.table-empty` / `.table-placeholder`；8 行位、补位行无分割线与选中态（只撑高度）、0 条空状态、两态同高。
- **弹窗**：`.modal` 382；`.spec-modal--520/--640/--720` 宽表单；长表单整页。
- **状态**：5 主状态 `.dot-run/idle/stop/fault/offline` + `.machine-card--idle/stop/fault/offline`；模式/生产子状态/原因只用文字层。
- **复用门禁**：`scripts/audit-component-reuse.js`；页面不得新造同族组件类。
