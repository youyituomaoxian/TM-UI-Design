# 弘讯设计系统 · Agent 使用入口（AGENTS.md）

> Codex / Reasonix / Cursor 等认 AGENTS.md 的 Agent 入口；Claude Code 读 `CLAUDE.md`（`@AGENTS.md` 导入，同源不漂移）。先读本文件，再按需加载规范。人读使用说明见 `团队使用指南.md`。

## 交接铁律（任何 Agent、任何轮次）

**接手先读根 `HANDOFF.md`，收尾必须更新它**（§1 现状快照 / §4 未决事项 / §7 更新记录；改真源、改页面、出报告、只做分析、只跑门禁都算）。**未更新 = 本轮未完成，不得宣告 done。** 本文件不是真源，禁当规格引用；协议全文见 `HANDOFF.md §0`。

## 这是什么

弘讯 B 端 Web / 移动端设计系统：把品牌风格（颜色/字阶/组件/图表/页面规格）做成机器可执行资产，让 AI 生成页面风格统一、不漂移。

**入口**：Codex / Cursor / 通用 → 本文件；Claude Code → `CLAUDE.md`（`@AGENTS.md`）；WorkBuddy / DSH → `.workbuddy/skills/tm-design-system/SKILL.md`（唯一本体；DSH 侧为薄指针，勿复制规范）。

## 生成 HTML 页面（视觉预览）

1. 读 `GENERATION-SOP.md`（选端 → 框架判定 → 选型 → 克隆 → 落盘 → 门禁）。
2. 克隆模板（**唯一可复制的结构**，优先脚手架）：Web `node scripts/new-page-web.js <语义名>`；移动 `node scripts/new-page-mobile.js <语义名>`（自由布局用 `agent-starter.html`）。克隆后按业务定制作业树：**结构零改动**（层级/图标/选中/无 group-title 分类、顶级节点并列，RULES §0.2-9/10），节点文本与选中态随系统定制（禁留示例树）；移动底部导航 3–5 项（RULES §1.1b，门禁 `bottomnav.count`）。
3. 页面内容**从零自建**（禁参照 output/、packages/ 或既有页面 DOM）：
   - 页面类型规格：各端 `RULES.md §1.1b`；组件规格：`components.json` + `template.css`（门禁与构建消费，Agent 不通读，按名定点检索）
   - 图标一律从各端 `icons/` 取（`icons.md` 索引 → path 内联进 `.ico` 等尺寸类；库缺才手写且符合规格并上报，RULES §7.9③）
   - 字体只用 `var(--font-cn)` / `var(--font-mono)`，禁具体字体名（门禁 `font.family` MED）；`tabular-nums` 仅限纯数字（中文会回退宋体），RULES 字体守则
   - 图表 `CHART-SPEC.md`（原子 SVG 自建，色走 `--chart-*`）；跨端语义色 `CROSS-PLATFORM-COLORS.md`
   - 非默认品牌/暗色：`brand-color-engine/`（亮暗双模式；暗色固定不随品牌，2026-11-06 方案 A）
4. 产出落盘到**用户项目** `output/`（CSS link 指向本仓库对应端 `template.css`）。
5. 门禁：单页 `node 弘讯web端design-system/validate-spec.js <页面.html>` → **0 HIGH**（存量另加台账全绿）；全链路 `node ci-local.js` → **0 fail**（含 audit / check-sync / check-size / check-reach，项数以实际输出为准）。
6. 转发：生成分享版（`template.css` 内联为 `<style>`，零外链）。

## 存量项目审查修改（路径二）

已有页面按规范改造，**不走生成流程**——读 `GENERATION-SOP.md §②` 五阶段。要点：P0 先出**页面清单**（`node scripts/audit-batch.js <项目> --list`，覆盖率 <100% 即未完成）→ 双门禁台账（`audit-spec` 清零硬违规 **且** `validate-spec` 0 HIGH——audit 通过 ≠ 可交付）→ D-1~D-13 逐维对照 → P1 映射决策（每个差异定「改成什么」）→ 每批门禁回归。**只改表现层**：禁改文案与信息项 / 字段与数据口径 / 交互流程与功能行为（SOP §② 铁律 6）。改真源区须台账 + 用户显式拍板（治理契约）。

## 发现设计系统问题必须记录（单向报告流 · 2026-09-10）

归因二分：**设计系统问题**（token/组件/图标缺口、规范歧义、门禁漏洞、文档缺陷）→ 复制 `templates/设计系统问题报告模板.md` 落盘自己项目 `output/设计系统问题_YYYYMMDD_NN.md`，对话内请用户转交（**不直连维护者、不改真源**）；**执行问题**（规范写了没执行）→ 直接改页面、不记录。合格线三判据与状态流转见 `GENERATION-SOP §②` + `audit-rules.json → issue_reporting`。

## 阅读策略（按需读，禁通读）

> **加载预算：一次任务（含入口）≤ 40k 字符**（纪律全表见 `GENERATION-SOP §0`）。

- **必读 3 项**：① `GENERATION-SOP.md` §①（存量读 §②）；② 对应端 `RULES.md` 命中章节（按章节索引挑）；③ 对应端 `tokens.json` 的 `colors` 段。
- **按需检索**：`CHART-SPEC.md`｜`audit-rules.json`（审查 / 回灌 / `issue_reporting`）｜`DESIGN-TOKENS.md`、`MASTER.md`（按章）｜SOP §③ 附录。
- **不要通读（门禁与构建消费）**：`components.json` · `template.css` · `validate-spec.js` · `ci-local.js` / `audit-spec.js` / `audit-batch.js` / `check-sync.js` / `check-size.js` / `gate-capture.js` / `roll-changelog.js`（体量以 `check-size.js` LIMITS 为准）。
- **禁止**整份加载 RULES / SOP / CHART-SPEC（单端约 100k）；用检索取段替代。
- **SSOT**：品牌色→`tokens.json`｜组件→`components.json`+`components.md`｜审计→`audit-rules.json`｜图表→`CHART-SPEC.md`｜治理→双端 RULES 页首｜交付线→`ci-local.js` 输出。
- **动态调节**：门禁报错发散 → 回读对应端 RULES 章节，禁盲目修补。软规则无门禁兜底，缺读即事故。

## 视觉规范速览

- Web：`弘讯web端design-system/web规范展示_框架版_*.html`（同名 `_分享版.html` 零外链）
- 移动：`弘讯移动端design-system/移动端规范展示_*.html`

## 改视觉样式（维护者）

> 🏛️ **真源治理契约**：真源区（template.css / tokens.json / components.json / 门禁脚本等）使用者只读；改真源 = 维护者六步（缺口登记 → 改真源 → 双端同步 → 门禁全绿 → 刷指纹 → CHANGELOG 留痕），无痕迹即违规。Agent 默认限使用者区，改真源须用户显式任务（台账即授权载体）。详见双端 `RULES.md` 页首。

> ⚠️ **双端真源不对称**：Web `template.css` = build 产物（真源 `packages/web-ui/src/styles/` 四件 CSS + `map-tokens.js`；改源后跑 `build-template-css.js`，手改产物会被覆盖）；移动 `template.css` = 手写真源。双端同步由 `check-sync.js` 阻断校验（vendor 同构段一致 + 同名类零漂移 + 未覆盖类登记 `vendor-coverage.json`）。

- Web：改 `packages/web-ui/src/styles/` 四件 CSS → `node packages/web-ui/scripts/build-template-css.js`；若手改 `template.css` 须同步源文件（build 会覆盖）。
- 移动：直接改 `弘讯移动端design-system/template.css`（2026-08-06 冻结已解除）；改动须用户拍板。
