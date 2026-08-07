# 弘讯移动端组件规格层 (Components Spec Layer)

> **机器真源**：`components.json`（结构化 spec + `contract` 硬约束）。
> 本文件是它的**人读镜像**，修改请一律改 `components.json`，再同步本文件。
> **校验门禁**：`validate-spec.js`（node，纯读档，HIGH 违反 exit 1）。

---

## 角色与北极星

- **唯一真源**：`components.json` 是移动端组件唯一格式中立 spec。Ardot 组件库与 HTML/小程序产物均须对齐，禁止各自另立尺寸/色值。
- **两类消费者**：① 同事（非 Ardot）读本层 + `referenceCss/referenceHtml` → 直接生成合规 HTML / 小程序 WXML；② UI 设计师（Ardot）读本层 → 在 Ardot 内搭建/维护组件库，对齐 `ardot` 字段。
- **北极星**：让 Agent 读规范 → 自然语言生成**合规移动端页面**。本层是规范消费者模型的「移动端那一半」，与 Web 端 `components.json` 同构。

## 命名约定（与 Web 对齐，统一短名）

为让 Agent 跨平台共用一套变量名，本层一律采用短名：`--primary` / `--n1`…`--n10` / `--suc` / `--warn` / `--err` / `--run` / `--radius-*` / `--shadow-*` / `--font-cn`。
`DESIGN-TOKENS.md` 已在 **v1.2.0** 用 `scripts/generate-design-tokens-md.js` 从 `tokens.json` 重生成，统一为短名（旧 `--color-*` 长名已废弃）。

> ⚠️ **跨端命名语义差异（已知，待后续统一）**：移动端 `--suc` / `--warn` / `--err` / `--run` 代表**背景色**（filled 态）；Web 端 `--suc` 等代表**前景/文字色**（`--suc-bg` 才是背景）。两端命名"短名形似、语义不同"，跨端复用组件时请勿混用。移动端选择此约定是为与既有 `page-template.html` / 本层 `referenceCss` 保持一致，未改动已验证组件。

## 关键平台差异（移动端 vs Web）

| 维度 | 移动端 | Web |
|------|--------|-----|
| 按钮字重 | **Medium 500**（大/中/登录）；小按钮 Regular 400 | Regular 400 |
| 成功绿 | **#10B981 合法** | 禁 #10B981，用 #389E0D |
| 运行/在线绿 | #16A34A 两端共用 | #16A34A 两端共用 |
| 禁用 Web 功能色 | 禁 #389E0D / #FA8C16 / #F5222D | — |
| 落位宽 | 375 视口 / **343 内容**（gutter 16） | 自适应栅格 |
| 平台差异 | Android / iOS 双套高度与半径 | 顶栏72/侧栏240 固定 |

---

## 组件清单（11 个，v1.1）

| # | 组件 | 关键尺寸 | 字重 | 状态色 |
|---|------|---------|------|--------|
| 1 | 顶部导航 Navbar | iOS 高88 / Android 高80；主色底白字；标题 17/22 | 500 | 主色 |
| 2 | 底部导航 BottomNav | Android 高56 / iOS 高83(含34安全区)；N1底 | 标签 400 | 未激活 N7 / 激活 primary |
| 3 | 按钮 Button | 登录56 / 大48 / 中40 / 小32；圆角 Android8 / iOS6 | 大/中/登录 500；小 400 | 主色；禁用浅 primary 底+灰字 |
| 4 | 标签 Tag | 大28 / 中24 / 小20；半径4 | 500 | 线型/面型(主色) / 成功#10B981 / 警告#F59E0B / 错误#EF4444 / 运行#16A34A |
| 5 | 列表 List | 单行56(pad-x16) / 双行116 / 三行101；底分割线 N4 | 标题 500 | 标题 N8 / 右文字 N7 |
| 6 | 卡片 Card | B 头40 / C 高101；半径 Android8 / iOS10 | 标题 500 | N1底 / 阴影 M |
| 7 | 弹窗 Modal | 单选 375×296；标题栏46；选项56；半径16 | 500 | 遮罩 rgba(0,0,0,.45)；危险用 err |
| 8 | 搜索 Search | 高36 / 宽343 / 半径16(pill)；N1底 | 占位 400 | 占位 N5 |
| 9 | 页签 Tabs | 单Tab高44；字14 | 500 | 激活 primary+2px下划线 / 未激活 N7 |
| 10 | 状态点 StatusDot | 直径10；圆 | — | 运行#16A34A / 成功#10B981 / 警告#F59E0B / 错误#EF4444 / 离线 N7 |
| 11 | 图标 Icon | 24(导航/功能) / 20(列表/操作) / 12(标签/辅助) | — | 默认 N8 / 激活 primary |

> 每个组件的 `referenceCss` / `referenceHtml` / `ardot` / `do` / `dont` 见 `components.json`。

---

## 机器可校验契约（contract 摘要）

`validate-spec.js` 扫描目标 HTML 的 `<style>`，对照以下硬约束；HIGH 违反 exit 1。

| 契约 id | 组件 | 检查 | 严重度 |
|---------|------|------|--------|
| navbar.height | 顶部导航 | 高 80/88 | HIGH |
| navbar.bg | 顶部导航 | 背景须 token（主色） | HIGH |
| bottomnav.height | 底部导航 | 高 56/83 | HIGH |
| bottomnav.bg | 底部导航 | 背景须 token（N1） | HIGH |
| button.height | 按钮 | 高 32/40/48/56 | HIGH |
| button.weight | 按钮 | 大/中/登录字重 500 | HIGH |
| button.radius | 按钮 | 半径 6/8（iOS/Android） | MED |
| tag.height | 标签 | 高 20/24/28 | HIGH |
| tag.weight | 标签 | 字重 500 | HIGH |
| tag.radius | 标签 | 半径 4 | HIGH |
| list.height | 列表 | 单行高 56 | HIGH |
| list.padx | 列表 | 左右 padding 16 | MED |
| card.header | 卡片 | B 标题栏高 40 | HIGH |
| card.radius | 卡片 | 半径 8/10 | MED |
| modal.title | 弹窗 | 标题栏高 46 | HIGH |
| modal.item | 弹窗 | 选项行高 56 | HIGH |
| modal.radius | 弹窗 | 半径 16 | HIGH |
| search.height | 搜索 | 高 40 | HIGH |
| search.radius | 搜索 | 半径 16 | HIGH |
| search.width | 搜索 | 落位宽 343 | MED |
| tabs.font | 页签 | 字 14 | MED |
| tabs.weight | 页签 | 字重 500 | HIGH |
| dot.size | 状态点 | 直径 10 | HIGH |
| icon.size | 图标 | 宽 12/20/24 | MED |
| mobile.forbid.web-green | 全组件 | 禁 Web 功能色 #389E0D/#FA8C16/#F5222D | HIGH |
| mobile.nontoken.hex | 全组件 | 禁非 token 硬编码色 | MED |

---

## 列表 List 三态结构（明细，与 page-template.html / components.json 对齐）

列表组件前缀统一 `mlist-*`；单行 `.mlist`、双行 `.mlist-double`、三行 `.mlist-triple`，均 N1 底 + 底分割线 N4，落位宽 343（屏幕内 343，不在 375 边缘）。

**① 单行（Single）** — 高 56，pad-x 16
- 图标 24（可选，右距标题 8px）→ 标题 16/24 Medium N8 → 右文字 12 N7（箭头/值）。
- `referenceHtml`：`<div class="mlist"><span class="mlist-icon">⚙</span><span class="mlist-title">注塑机 A-01</span><span class="mlist-right">›</span></div>`

**② 双行（Double）** — 高 116，padding 16，纵向 flex（两端对齐）
- `.mlist-double-top`（横向 flex，gap 16）：
  - `.mlist-thumb`：52×52，半径 4，N2 底（左侧缩略图）
  - `.mlist-double-text`（flex 1，纵向 flex，gap 3）：
    - `.mlist-double-head`（横向 flex，gap 8）：标题 16/24 Medium N8 + 小标签（如 `mtag-sm mtag-run` 运行中）
    - `.mlist-sub`：14/21 N8（副标题，如「温度 218℃ · 压力 12.4MPa」）
  - `.mlist-more`：24×24，N7，竖向更多图标（⋮）
- `.mlist-double-foot`：12/16 N7 页脚（如更新时间/操作员）+ 顶部 N4 分割线 + padding-top 8

**③ 三行（Triple）** — 高 101，padding 16，横向 flex（垂直居中，gap 16）
- `.mlist-slot`：89.7×69，半径 4，N2 底（图片/视频位）
- `.mlist-triple-text`（flex 1，纵向 flex，gap 3）：
  - `.mlist-double-head`：标题 16/24 Medium N8 + 小标签
  - `.mlist-sub`：14/21 N8
  - `.mlist-foot`：12/16 N7 页脚

> `list.height` 契约仅约束单行 `.mlist` 高 56；双行/三行及其所有子元素（`.mlist-thumb`/`.mlist-more`/`.mlist-slot`/`.mlist-double-*`/`.mlist-triple-text`/`.mlist-foot`/`.mlist-double-foot`）已列入 `exclude`，不触发 height 检查。完整 `referenceCss` / `referenceHtml` 见 `components.json` 的 `list` 组件。

---

## Ardot 对账（2026-07-28，状态）

移动端 Ardot 组件库（`【20260519】弘讯移动端`）已存在 36 组 Component Sets + ~38 独立组件。
本规格层从 MASTER.md §6 实测值抽取，与 Ardot 组件库对齐关系见各组件 `ardot` 字段。

- 11 个核心组件均已对齐 `components.json` 尺寸/色值契约（导航栏/底栏/按钮/标签/列表/卡片/弹窗/搜索/页签/状态点/图标）。
- ⚠️ 待做：在 Ardot 内逐项核对 variant 命名与 `ardot.variantMapping` 一致；按钮字重 500、标签字重 500、列表标题 500 是移动端要点，需确认 Ardot 组件未沿用 Web 的 400。

## 待办 / 已知漂移

1. **Token 命名统一（已完成 v1.2.0）**：`DESIGN-TOKENS.md` 已用移动端生成器从 `tokens.json` 重生成，短名对齐本层与 Web 命名约定。剩余跨端语义差异：移动端 `--suc`=背景色 vs Web `--suc`=前景色（见上方命名约定），待后续统一。
2. **button.weight 平台差异**：移动端小按钮 Regular 400，大/中/登录 Medium 500；contract 已按此分层（小按钮排除在 weight 检查外）。
3. **pre-commit / CI 接入**：`validate-spec.js` 已可作门禁，待接 git hook（任务③，仓库级，Web/移动端共用）。

## Elevation 引用规范（A 包，2026-07-30）

> 组件按 elevation 层级引用 shadow/surface。详见 MASTER.md §5.1 场景表。值真源 `tokens.json` 的 `elevation` 节；引证见 `TOKENS-EVIDENCE.md`。移动端 shadow 发丝线保留品牌色调。

| 组件 | elevation 级别 | CSS 引用 |
|------|--------------|---------|
| Modal / Dialog（mmodal） | overlay | `box-shadow: var(--elev-overlay)`（或 `--shadow-l`） |
| Popover / Dropdown | overlay | `box-shadow: var(--elev-overlay)` |
| Card（mcard-b/c，强调） | raised | `box-shadow: var(--elev-raised)`（或 `--shadow-m`） |
| Card（flat） | default | `border` 区分（无阴影） |
| 长列表滚动边界 | overflow | `box-shadow: var(--elev-overflow)` |
| 看板列/分组容器 | sunken | `background: var(--n2)`（无阴影） |

**迁移提示**：旧 `--shadow-s/m/l` 仍可用（值已升级双层复合）；新组件优先用 `--elev-*` 语义层级。Motion token（`--motion-duration-*` / `--motion-ease-*`）用于组件过渡动画。

## 等宽 / 密度引用规范（B 包，2026-07-30）

> **字阶**：移动端保持 android/ios 双套（9 级，H1=26-28），B 包不对齐 Web 13 级（结构差异属存量，待 W2 选型后统一）。
> **等宽**（B 包新增）：`--font-mono` 用于工控数据展示（设备参数/数值表格/代码）；数值对齐用 `font-variant-numeric: tabular-nums`。
> **密度**（B 包新增）：移动端只 `comfortable` 基准（`--density-row-height:56px`），compact/spacious 不启用。
> **bottom-nav**（B 包顺手）：已纳入 `tokens.json` shadows 节（`shadows.bottom-nav`），值双层复合，与 page-template/生成器对齐。
