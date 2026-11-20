# 弘讯设计系统 · Agent 使用入口（AGENTS.md）

> Codex / Cursor 等认 AGENTS.md；Claude Code 读 `CLAUDE.md`（`@AGENTS.md` 同源）。先读本文件，按需加载规范；人读说明见 `团队使用指南.md`。

## 收尾与项目约定（任何 Agent、任何轮次）

**本轮收尾：真源/门禁/文档改动写双端 `CHANGELOG.md` 留痕，再向用户汇报。本文件不是真源，禁当规格引用。**

**项目约定（2026-11-20 更新）**：本项目 = 「左右结构」新规范；规范只读本项目文件，`.dsh`/`.workbuddy` 的 `tm-design-system` 已 `.disabled`（不加载、不修改）。**本目录即 Git 仓库根（`main`）**：改动先跑门禁再 `git add/commit`；不 `push` 到未经用户确认的远端、禁 `force-push`、禁把 `output/` 与 `HANDOFF.md` 入库；交付口径 `verify.js all` 全绿，新页以 `verify.js page` 为准。

## 这是什么

弘讯 B 端 Web / 移动端设计系统：把品牌风格做成机器可执行资产，让 AI 页面风格统一、不漂移。入口：Codex/Cursor → 本文件；Claude Code → `CLAUDE.md`；WorkBuddy/DSH → 本文件。

## 生成 HTML 页面（视觉预览）

1. 读 `GENERATION-SOP.md`（选端→框架→选型→克隆→落盘→门禁）。
2. 克隆唯一模板（优先脚手架）：Web `node scripts/new-page-web.js <语义名>`；移动 `node scripts/new-page-mobile.js <语义名>`；自由布局也从 `page-template.html` 克隆（`agent-starter.html` 只是说明页）。作业树结构零改动（层级/图标/选中/无 group-title，RULES §0.2-9/10），节点文本随系统定制；移动底导 3–5 项（`bottomnav.count`）。Web 模板自带 `.ws-global` 工具区与 `js/{shell-ui,tree-nav,i18n,page-ui}.js`——**禁删 script 段**，业务只写 `.page-sec`。
3. 内容从零自建（禁参照 output/、packages/、既有页 DOM）：
   - 页面规格：`RULES.md §1.1b/§1.1d`；组件：`components.json` + `template.css`（按名检索，不通读）
   - 图标从 `icons/` 取（`icons.md` 索引 → path 内联；缺件才手写并上报，RULES §7.9③）
   - 字体只用 `var(--font-cn)` / `var(--font-mono)`；`tabular-nums` 仅纯数字
   - 图表 `CHART-SPEC.md`（原子 SVG，色走 `--chart-*`）；跨端色 `CROSS-PLATFORM-COLORS.md`
   - 非默认品牌：`brand-color-engine/`（暗色固定不随品牌）
4. 产出落「**用户项目**」`output/`（CSS link 指向本仓库 `template.css`）。
5. 门禁：单页 `node scripts/verify.js page <页面>` → **0 HIGH**；**交付口径** `verify.js all` = 存量全链路（`ci-local`）+ 新规范范围（`verify-new`），两者全绿；只验新规范用 `verify.js all --scope=new`。
6. 分享：`node scripts/build-share-web.js <页面> [--out]`（内联 CSS + js + 资源，零外链），禁手工内联。

## 存量项目改造（路径二）

读 `GENERATION-SOP §②`：P0 页面清单（`scripts/audit-batch.js <项目> --list`，覆盖率 <100% 未完成）→ 双门禁台账（`audit-spec` 清零硬违规 **且** `validate-spec` 0 HIGH）→ D-1~D-13 逐维对照 → P1 映射决策 → 每批门禁回归。**只改表现层**：禁改文案/字段口径/交互流程（SOP §② 铁律 6）。改真源须台账 + 用户拍板。

## 发现设计系统问题必须记录（单向报告流）

归因二分：系统问题（token/组件/图标缺口、规范歧义、门禁漏洞、文档缺陷）→ 复制 `templates/设计系统问题报告模板.md` 落盘自己项目 `output/设计系统问题_YYYYMMDD_NN.md`，对话内请用户转交（不直连维护者、不改真源）；执行问题 → 直接改页面。见 `audit-rules.json → issue_reporting`。

## 阅读策略（按需读，禁通读）

> 一次任务（含入口）≤ 40k 字符（SOP §0）。

- 必读：SOP §①（存量 §②）＋对应端 RULES 命中章节＋`tokens.json` 的 `colors`。
- 按需：`CHART-SPEC.md` / `audit-rules.json` / `DESIGN-TOKENS.md` / `MASTER.md`（按章）。
- 禁通读：`components.json` · `template.css` · `validate-spec.js` · `ci-local.js` 及门禁脚本；禁整份 RULES/SOP/CHART-SPEC。
- SSOT：色→`tokens.json`｜组件→`components.json`+`components.md`｜审计→`audit-rules.json`｜图表→`CHART-SPEC.md`｜治理→双端 RULES 页首｜交付线→`verify.js`/`validate-spec` 输出。
- 门禁报错发散 → 回读对应端 RULES 章节，禁盲目修补。

## 视觉速览

- Web：`web规范展示_左右结构.html`（+ `_分享版.html` 零外链）
- 示例：`showcase/`（工作台 v7 / 亮色看板 / 登录页示例 / 规范展示；参与 validate / 树运行时 / 工具区门禁）
- 移动：`移动端规范展示_*.html`

## 改视觉样式（维护者）

> 真源治理契约：真源区使用者只读；改真源 = 六步（登记→改→双端同步→门禁全绿→刷指纹→CHANGELOG）。Agent 默认使用者区，改真源须用户显式任务。详见双端 RULES 页首。

> 双端不对称：Web `template.css` = build 产物（源 `packages/web-ui/src/styles/` **五件** + `map-tokens.js`；改源后 `build-template-css.js`，手改会被覆盖）；移动 `template.css` = 手写真源。`check-sync.js` 校验双端一致。

> 顶部工具区（`.ws-tools`）= `弘讯web端design-system/partials/shell-tools.html` 单点真源：改完跑 `node scripts/sync-shell-tools.js` 注入各页；**禁改各页副本**（会被覆盖，且 `verify.js chrome` 会拦）。门禁清单见 `scripts/gate-manifest.json`（`verify.js manifest` 自检）。

- Web：改五件 CSS → `node packages/web-ui/scripts/build-template-css.js`。
- 移动：直接改 `template.css`；改动须用户拍板。
