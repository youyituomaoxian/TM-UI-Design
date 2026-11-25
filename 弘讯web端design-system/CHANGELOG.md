# 弘讯B端视觉系统 · 设计系统更新日志（CHANGELOG）

---
> 📦 历史条目已分卷归档：[`CHANGELOG-archive.md`](CHANGELOG-archive.md)（2026-10 起）+ [`CHANGELOG-archive-2026-08_09.md`](CHANGELOG-archive-2026-08_09.md)（2026-09 及更早，冻结卷）。

---

## [补位行收敛单一真源类 + 去选中态（用户拍板）] — 2026-11-25
- **收敛**：补位行三类名 `.table tr.is-placeholder`（components.css）/ `.table-placeholder`（utilities.css）/ `.row-empty`（workbench.css）合并为唯一真源类 `.table-placeholder`（以 `components.json#table.placeholder` 契约选择器为锚点）。删旧两处 CSS 规则；展示页 HTML/JS 同步（表格规范展示 3 处、v7 工作台静态 3 处 + JS 选择器/赋值 2 处）；`.row-empty-state` 属完全空态，保留不动。
- **去选中态**：根因=`.table tbody tr:hover{background:var(--n3)}` 与 `tr.is-selected` 底色设在 **tr** 上，旧 `.row-empty td{background:transparent}` 只作用于 td 挡不住 tr 底色。修法=utilities.css 显式覆盖 `.table tbody tr.table-placeholder` 及其 `:hover` / `.is-selected` 态 `background:transparent` + 选中首列 `border-left:none;padding-left:16px`，并加 `user-select:none` 禁拖拽文本高亮（`pointer-events:none` 只挡鼠标，挡不住 JS 加选中态与键盘选中）。
- **口径**：RULES 5 处 + components.md + components.json note 同步；v7 工作台旧文案「有数据时补分割线」改新口径；7 个 Web 分享版重建。

## [表格规范：补位空行不画分割线（用户拍板）] — 2026-11-25
- **需求变更**：表格两种空态分工明确——0 条数据走 `.empty` 空状态（撑开表格，保持不变）；部分数据的撑开表格，空数据部分（补位空行）**不再画分割线**（原画 `--n6` 线）。
- **真源三件**：`components.css` 的 `.table tr.is-placeholder td`、`utilities.css` 的 `.table-placeholder td`、`workbench.css` 的 `#specView .row-empty td` / `.shell .table .row-empty td` 一律显式 `border-bottom:none`。第一性原理：`.table td` 基础样式自带 `border-bottom:1px solid var(--n6)`，仅删补位行原声明会被通用边框继承、视觉无变化，必须显式覆盖。注释同步；`build-template-css.js` 重建产物（114,606→114,575，余量 394→425）。
- **口径同步**：RULES §1.1b 表格规范③ / 组件速查表 / §4.4 min-row 契约 / 一屏撑满段，components.md 表格卡条；`表格规范展示_20261112` ⑦标题改「补位不画分割线」；7 个分享版重建（内联快照零外链）。

## [门禁修订：pager 判据反转 + stack 降级/夹具 + 契约入 JSON] — 2026-11-25
- **PAGER-CONTEXT-01 判据反转**：由「必须在 `.card-body` / `.table-card` / `.comp-card` 内」改为「pager 位于 `.card` 内、且到该 card 之间无 `.card-body` / `.table-card`、也不是 `.card--fill` 直接子级（footer）→ HIGH」。内容级卡片网格分页（RULES §1.1b）、`.modal-body`、`.comp-card` 陈列位、`.card--fill` footer 自然放行；删除页面局部类 `.comp-card` 白名单。工单页甘特卡（`.card` 内无 body）仍 HIGH。
- **card footer pager 合法**（用户拍板）：`.card--fill` 直接子级 `.pager` 放行；源 `components.css` 补 `.card--fill>.pager{flex:none;margin:8px 16px}`，重建产物；fixture +1（共 9 组）。
- **STACK-SPACING-01 修解析 + 降 MED**：解析前剥 HTML 注释 / `<script>` / `<style>`；相邻只认元素序列里紧挨的两个块（占位 `div` / `hr` 即断开）；证据补 padding/border 与父容器 gap；提示不再声称「≥ MD 12」（实现只查有无间距声明）。fixture 与清单页回归通过前不阻断。
- **STATE-CLASS-01**：契约调用未找到改为 MED（门禁失明报警），不再静默通过；`activate` 匹配不绑变量名。
- **新增页面契约测试**：`scripts/page-contracts.js` + `scripts/check-page-contracts.js` + `scripts/fixtures/page-contracts/`（9 组正/反例）；接入 `verify all`、CI（`validate.yml`）与 `ci-local` fixtures。
- **契约入 JSON**：`components.json#pageContracts` 登记 pager 层级 / stack 间距；RULES 只留 pager 指针，并把「唯一判据」改「页面判据」+ 补 `CHART-SPEC.md`。
- **RULES 容量**：压缩 ~190 字符（治理契约 / 卡片分页 / 页头注释）并补 §4.1「card-body 内相邻内容块须有显式间距」；RULES 58,795/60,000（余 1,205），template.css 114,606/115,000（余 394）。
- **RULES §5 迁移**（用户拍板）：第 5 节「Agent 生成 UI 检查清单」迁入 `GENERATION-SOP` 步骤 5（Must/Should/Nice；门禁口径改 `verify.js page`；深色模式措辞更新）；RULES 只留指针，59,835→58,795（余 1,205）；SOP 42,361/45,000；`rule-index` 重生成。
- **文档容量（components/START）**：`components.md` Ardot 历史表迁入 `CHANGELOG-archive-2026-08_09.md`（18,910→17,990）；`START-HERE` 门禁状态/数字压成指针（4,888→4,000）；`check-size` 17→15 WARN。
- **template.css 空白规范化**（容量治理）：`build-template-css.js` 产物去行尾空格/空行（CSS 空白无语义），114,967→114,606（余 33→394）；源文件保持可读；6 个分享版重建 + CSS 指纹复验。
- **卡头反序兜底**：`.card-head-actions ~ .card-head-meta{margin-left:var(--space-lg)}`（源 `utilities.css` + 重建 `template.css`），meta/actions 任意顺序均有 24 间距。
- **清理**：`page-template.html` body 去掉残留 `data-page="workbench"`；移动 CHANGELOG 更正「跨端通用」措辞（仅 Web 生效）。
- **文档对齐（neat-freak）**：`AGENTS` / `README` / `START-HERE` / `USAGE-GUIDE` / `团队指南` / `GENERATION-SOP` / `.workbuddy` skill 统一「`verify all` = 页面契约 + ci-local + verify-new；单页含 pager/stack；分享版 CSS 指纹」；`components.md` 与 RULES pager 条款补 `.card--fill` footer；HANDOFF §1/§4/§7 修正 skill 状态、文件数、#110 闭环、#111 容量。

## [真源修复：卡头并用间距兜底 + 堆叠块 0 间距门禁] — 2026-11-25
- **卡头并用间距兜底**（用户授权）：`.card-head-meta`/`.card-head-actions` 均 `margin-left:auto`，并用时第二组 auto 无空间可分→组间距恒 0（工单总览「计数贴日期切换」根因）。源 `packages/web-ui/src/styles/utilities.css` 增 `.card-head-meta ~ .card-head-actions{margin-left:var(--space-lg)}`，`build-template-css.js` 重建产物双同步；RULES 卡片头条款改写为「真源已兜底，页面免补」。顺带修复：重建把前几轮未入产物的源改动 `.sel-arrow` 一并同步（源↔产物重新一致）。
- **堆叠块 0 间距门禁 STACK-SPACING-01**（用户授权）：`scripts/verify.js` page（web）新增——card-body 内相邻业务块双方及父容器均无垂直间距证据（margin/gap）→ HIGH `stack-spacing.zero-gap`；红→绿实证 + 存量全量扫描 0 误报。
- 页面侧：工单总览卡头操作组改用真源 `.card-head-actions` 类，删页面级 margin 补丁；重建分享版。门禁见 HANDOFF §7。
- **禁装饰性单 tab**（用户拍板）：RULES 内页页头结构红线增 ④——`.tabs` 仅 1 项且无第二 pane 可切换 = 脚手架克隆残留，降级基础形态（删 tab-row、page-actions 升 page-head--compact）。起因为本轮两交付页的装饰性单 tab 被用户指出。
- **真源边界**（用户拍板）：RULES 治理契约段增必读条——`output/`（用户项目产物+仓库根归档）非真源，禁作规范判据/设计先例；唯一判据 = RULES/template/page-template/components/tokens + 门禁。同步删除 RULES 内 4 处引 `output/` 历史页做示范的句子（showcase 同样禁作判据，不设替代示范）。
- **页面级修复**（非真源）：工单总览 4 项 KPI 从固定高单行 `.card-head` 移入 card-body 内 `.wo-statline` 独立行，翻页组 `margin-left:auto` 靠右——根治 KPI 与日期切换在窄视口的挤压重叠。
- **门禁**：check-size 净增受控（删 4 处示范腾位）；check-reach 0 断链；验证见 HANDOFF §7。

## [盲测三真源缺口修复：#107/#108/#109] — 2026-11-23
- **#107 `.sel-arrow`**：`components.json` 已声明、`template.css` 未定义；源 `components.css` 补 `.sel-arrow{color:var(--n9);font-size:12px}`，`build:template` 重建产物，双同步。
- **#108 审美门禁误伤**：`validate-spec.js` 主题词匹配由全文收窄到 `<title>/<h1>/<h2>`（导航含「监控」不再误判；真看板标题仍触发），MED 级不变。
- **#109 物种 / pager 口径**：`page-template.html` / `agent-starter.html` 默认 species 改 `document`（与 RULES §1.1c 一致）；RULES 收窄 workbench 判据（仅 KPI+图表+列表同屏）、pager 补「静态 tbody > 5 行，JS 动态行不计」；`sync-index` 重生成。

## [洁癖收尾：跨端契约文件归一改名 + 过程件清理] — 2026-11-20
- **命名归一**：根目录 `CROSS-PLATFORM-COLORS.md`（跨端中性色契约）与 `弘讯web端design-system/CROSS-PLATFORM-COLORS.md`（跨端功能色契约）**同名异义**，Agent 按名检索必混读——前者改名 `CROSS-PLATFORM-NEUTRALS.md`（git mv 保历史），check-size 键 / AGENTS / 团队使用指南同步更新，AGENTS 增「同名两文件勿混读」提示。
- **过程件清理**（均 gitignored 本地件）：repo `output/` 删 12 个迭代过程件（v3-v6 / 方案A·B / 框架预览 v1·v2 / v7 分享版重复副本 / 真源变更清单 / 规范改动分析 / _dash_main）；`.workbuddy/review/`（≈95 个一次性探针脚本 + 8 份过程审查 md）整体清除；外层用户 output 已消费问题报告 11 份归入 `设计系统问题_归档/`。保留：`图表示例页.html`（components.json 引用）、`_cdp-shot.js`（audit-shots 注释引用）、`信息化图表示例_分享版`。
- **记忆**：workspace 新增 `.workbuddy/memory/MEMORY.md`（纯指针索引，知识主体留 docs）；相对时间扫描 9 份规范文档清零。
- **实测**：check-reach 0 FAIL / 2 WARN；check-size 0 FAIL / 18 WARN；`verify.js all` 全绿。
## [LIVE/刷新落真源 + 双 pane 演示 + validate-static 收口 + 暗色 text 修正] — 2026-11-20
- **pagebar LIVE/刷新对齐 v7**（用户指令）：page-template.html pagebar 改为 v7 视觉——`.live-badge` LIVE 徽章 + `.bar-sep` + `.bar-refresh`（图标 + 文字 + `.bar-refresh-sec` 30s 倒计时）；CSS 类真源已在 workbench.css（零新增样式）；`page-ui.js` 追加倒计时 IIFE（点击旋转 + 重置 + toast，无 #pageRefresh 零介入）；i18n 增 `page.refreshLabel`、`page.live` 改「数据实时状态」。遗留 1 个 icon.source MED：refresh 图标库版与 v7 版两形并存（DS-20261120-04③）。
- **双 pane 演示**（DSH 遗留①）：page-template 页签补 `data-pane`（页面/页面二），正文两个 `.page-sec[data-pane]`；Edge headless 探针实测双向切换 + tab 高亮 + body[data-pane] 全通过。
- **validate-static 收口**（DSH 遗留②）：重导 dist-static 后暴露 78 项（原 14 为老产物残影）；根因 = 白名单只采集 page-template 内联样式、左右结构改版后已为空 → 真源既有值误判 HIGH。修法：白名单采集源补真源 build 产物 template.css（间距值级 + 字号值级，语义不变）；`globals.css` dark `--text-1/2/3` 与 `map-tokens.js` 暗色映射错档（N11/N10/N9 → N10/N9/N8，按 DARK-MODE.md textPrimary=#F1F5F9 真源修正）；template.css 重建（112.5KB）+ dist-static 重导 + freeze-baseline 重刷 → validate-static **0 HIGH**。
- **CHANGELOG 归档**（DSH 遗留③）：web 主文件 14,733→1,797 字符（20 条旧条目移入 archive 并更新切割线）；mobile 5,284→1,416（2026-11-18 及更早移入）。
- **二轮（反向检验后拍板执行，DS-20261120-04 三项全落）**：① workbench.css 增 `.tab-row > .row{padding-bottom:var(--space-sm)}`（meta 行形态，直接子选择器）；② components.css `.flow--row .flow-step` 竖排居中→横排左对齐（反方检验推翻原 b/c 推荐：组件除 dist-static 外零消费者，布局为空白第一成因）；③ page-template 刷新图标回归图标库 refresh.svg path（v7 2-path 弃用；page-ui.js IIFE 去 toast，机制/业务分层）。回灌：看板页 pagebar v7 化（bar-refresh + refreshSec 倒计时 + 页面自绑业务）+ 重出分享版；Edge 截图实测 meta 行留白恢复、工序卡空白消除。门禁：validate-static 0 HIGH、看板页 0 HIGH/1 MED（既有自造类）、verify.js all 全绿。
- **门禁**：page-template 单页 0 HIGH/1 MED；`verify.js all` 全绿（ci-local + verify-new）；check-size 0 FAIL；roll-changelog dry 0 条。
- **问题台账**：output/设计系统问题_20261120_04.md（tab-row meta 形态 / flow--row 密度 / refresh 图标两版，均待拍板）。

## [DS-20261120：图表高度链 / pane / 卡头 / badge / flow] — 2026-11-20
- **DS-02** `.chart-svg--fill` 去 `aspect-ratio` 改绝对填充（auto 高按宽反推 → 溢出裁切）；父级须 `.chart-box`。
- **DS-01** 新增 `.chart-x-labels--abs`（脚本自动挂载）；**DS-03** 新增 `.page-sec.is-active` + `page-ui.js` tab→pane。
- **DS-07** `.card-head:has(32px 控件)` 自动 48 高；**DS-04** `.badge-warn` 改 `--warn×--n11` 混色（4.97:1 AA）+ 新增 `.badge-info`。
- **DS-06** `.flow` 工序流程入库；**DS-05** 模板补 `.live-badge`+`.page-refresh`，i18n 增 `page.live`。
- **门禁**：复用前缀补 `step|flow`（USAGE `.step-*`→`.guide-*`）；白名单 + vendor-coverage 同步；删 4 处重复规则守住体积上限；`freeze-baseline` 重刷。`verify all` 全绿。
## [仓库瘦身：参考素材 / 大体积源文件 / 过程截图不入库] — 2026-11-20
- **移出仓库**：`参考不入设计系统库/`（用户参考图，非规范资产）、`assets/login-hero/login-hero-default.png`（4.5MB 源文件，本地保留，README 标注改「不入库」）、`弘讯移动端design-system/状态色_回灌_移动端.png`（过程截图，无引用）。
- **清理历史**：三路径用 `git filter-branch` 从全部提交移除后强推；旧 V2.1 历史仍在 `backup/v2.1-final-20261120`。
- **体积**：约 10.6MB → 6.1MB；文件 601 → 598。
- **实测**：`verify all` 全绿；新克隆复验。

## [skill 入口随仓库启用（团队拉仓即用）] — 2026-11-20
- **workbuddy**：`.workbuddy/skills/tm-design-system/SKILL.md` 重写并启用（原 `.disabled`）——仓库定位改用 `scripts/verify.js`；加载顺序补 CHART-SPEC §4/§5/§7（`generate-web-chart`）；命令改 `verify.js page` / `verify all`（交付口径）/ `build-share-web`（禁手工内联）；铁律补外壳真源、图表 HIGH、登录备案号、D-1~D-13、git 约定。
- **DSH**：`.dsh/.../SKILL.md` 指针启用，去掉「读 HANDOFF」硬依赖（HANDOFF gitignored，新克隆不存在）。
- **分发**：`.gitignore` 放行 `SKILL.md` + `data/`；`check-reach` R5 由「入口已停用」自动转为「入口文件齐全」；README / START-HERE / USAGE-GUIDE / 团队指南 / AGENTS 的「skill 停用」口径全部改为「随仓库启用」，clone 地址换成真实仓库。
- **实测**：`verify all` 全绿；check-size 0/19；check-reach 0/1。
