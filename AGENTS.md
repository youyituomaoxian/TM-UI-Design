# 弘讯设计系统 · Agent 使用入口（AGENTS.md）

> 本文件是 **Codex / Reasonix / Cursor / 任何认 AGENTS.md 的 Agent** 的入口。**Claude Code 读 `CLAUDE.md`**（其内容 `@AGENTS.md` 导入本文件，同源不漂移）。先读它，再决定读哪些规范文件。
> 人读使用说明见 `团队使用指南.md`；Agent 生成规范总纲见 `GENERATION-SOP.md`。

## 这是什么

弘讯 B 端 Web / 移动端设计系统：把品牌风格（颜色/字阶/组件/图表/页面规格）做成机器可执行资产，
让任何 AI 生成页面时风格统一、不漂移。

## 生成 HTML 页面（视觉预览）的标准流程

1. 读 `GENERATION-SOP.md`（生成总纲：选端 → 框架判定 → 页面选型 → 克隆模板 → 产出落盘 → 门禁）。
2. 克隆模板（框架来源，**唯一可复制的结构**）：优先用脚手架（自动克隆 + 注入克隆凭证 meta + 修正 CSS link）：
   - Web B 端后台：`node scripts/new-page-web.js <语义名>`（克隆 `弘讯web端design-system/page-template.html`）
   - 移动端：`node scripts/new-page-mobile.js <语义名>`（克隆 `弘讯移动端design-system/page-template.html`；自由布局用 `agent-starter.html`）
   - 克隆后**按业务定制作业树**：结构零改动（层级/图标/折叠/选中/**无 group-title 分类、顶级节点并列**，RULES §0.2 第 9 条），**节点文本、分组、选中态随当前系统定制**（禁保留示例树）
   - 移动端**底部导航 3-5 项随需求增减**（最少 3、最多 5；登录/详情等无 BottomNav 合法，RULES §1.1b，门禁 bottomnav.count）
3. 页面内容**从零自建**（禁参照 output/、packages/ 或任何既有页面 DOM，防风格漂移）：
   - 页面类型规格：各端 `RULES.md §1.1b`（登录/列表/详情/弹窗/看板等）
   - 组件规格（尺寸/色值/状态）：各端 `components.json`（机器契约）+ `template.css`（类真源）
   - **图标：一律从各端 `icons/` 取**（`icons/icons.md` 索引 → path 内联进 `.ico/.tree-ico/.kpi-ico` 等尺寸类；库缺才手写且符合统一规格并上报，RULES §7.9③）
   - **字体：只用 `var(--font-cn)` / `var(--font-mono)` 栈**，禁具体字体名（宋体/微软雅黑等字符串，门禁 font.family MED；tabular-nums 仅限纯数字，中文内容会回退宋体；headless 验证字体会误判，须真实浏览器核对，RULES 字体守则）
   - 图表：`CHART-SPEC.md`（原子 SVG 自建，色走 `--chart-*`）
   - 跨端中性色契约：`CROSS-PLATFORM-COLORS.md`（N1-N10 两端对照 + 语义守则）
   - 非默认品牌色/暗色：`brand-color-engine/`（一键生成整套配色）；**非默认品牌默认双模式**（亮 + 暗两块 :root，附录 B 亮暗双映射；顶栏已内置「暗色模式」切换按钮，RULES §0.1）
4. 产出落盘：**「用户项目」的 `output/`**（不是本仓库；CSS link 指向本仓库对应端 `template.css`）。
5. 门禁（风格合规才交付）：
   - 单页：`node 弘讯web端design-system/validate-spec.js <页面.html>`（移动端同理）→ 必须 **0 HIGH**
   - 全链路：`node ci-local.js` → 必须 **86 pass / 0 fail**
6. 转发/交付：生成分享版（把 `<link …template.css>` 内联为 `<style>` 全量 CSS，零外链）。

## 阅读策略（必读：按需读规范，禁止通读）

- **必读（不可跳过）**：本节流程 + 对应端 RULES 页首「软规则必读清单」+ 对应端 `RULES.md §1.1b` 页面类型段（按页面类型检索）+ 所用组件的 `components.json` 对应段（按组件名检索）。
- **按需检索（用到才读）**：`CHART-SPEC.md`（页面含图表才读）；`DESIGN-TOKENS.md`（查色值/字号才读）；GENERATION-SOP 附录（首次走流程或遇到异常才读）。
- **禁止**：通读 RULES / GENERATION-SOP / CHART-SPEC 全文（~80KB，耗时且易漏；硬规则有门禁兜底，按需读即可）。
- **动态调节**：若门禁报错发散（同一页面反复出现新错误）→ **退回通读对应端 RULES 相关章节**再改，不得盲目修补。
- **警告**：软规则无门禁兜底，缺读即事故（风格漂移/层级混乱）。必读区须逐条核对，不可跳读。

## 视觉规范速览（给人看的活体展示）

- Web：`弘讯web端design-system/web规范展示_框架版_*.html`（旁边同名 `_分享版.html` 零外链）
- 移动端：`弘讯移动端design-system/移动端规范展示_*.html`

## 改视觉样式（维护者）

- Web：改 `packages/web-ui/src/styles/` 四件 CSS → `node packages/web-ui/scripts/build-template-css.js` 重新生成 `template.css`。若直接手改 `template.css`，必须同步 `packages/web-ui/src/styles/` 对应文件（build 会覆盖，两处须一致）。
- 移动端：移动端冻结已于 2026-08-06 解除，可修改（`弘讯移动端design-system/template.css` 为真源）；改动仍须用户拍板。
