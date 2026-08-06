# 弘讯设计系统 · Agent 使用入口（AGENTS.md）

> 本文件是 **codex / Claude Code / 任何通用 Agent** 的入口。先读它，再决定读哪些规范文件。
> 人读使用说明见 `团队使用指南.md`；Agent 生成规范总纲见 `GENERATION-SOP.md`。

## 这是什么

弘讯 B 端 Web / 移动端设计系统：把品牌风格（颜色/字阶/组件/图表/页面规格）做成机器可执行资产，
让任何 AI 生成页面时风格统一、不漂移。

## 生成 HTML 页面（视觉预览）的标准流程

1. 读 `GENERATION-SOP.md`（生成总纲：选端 → 框架判定 → 页面选型 → 克隆模板 → 产出落盘 → 门禁）。
2. 克隆模板（框架来源，**唯一可复制的结构**）：
   - Web B 端后台：`弘讯web端design-system/page-template.html`
   - 移动端：`弘讯移动端design-system/page-template.html`（或 `agent-starter.html`）
3. 页面内容**从零自建**（禁参照 output/、packages/ 或任何既有页面 DOM，防风格漂移）：
   - 页面类型规格：各端 `RULES.md §1.1b`（登录/列表/详情/弹窗/看板等）
   - 组件规格（尺寸/色值/状态）：各端 `components.json`（机器契约）+ `template.css`（类真源）
   - 图表：`CHART-SPEC.md`（原子 SVG 自建，色走 `--chart-*`）
   - 非默认品牌色/暗色：`brand-color-engine/`（一键生成整套配色）
4. 产出落盘：**「用户项目」的 `output/`**（不是本仓库；CSS link 指向本仓库对应端 `template.css`）。
5. 门禁（风格合规才交付）：
   - 单页：`node 弘讯web端design-system/validate-spec.js <页面.html>`（移动端同理）→ 必须 **0 HIGH**
   - 全链路：`node ci-local.js` → 必须 **86 pass / 0 fail**
6. 转发/交付：生成分享版（把 `<link …template.css>` 内联为 `<style>` 全量 CSS，零外链）。

## 视觉规范速览（给人看的活体展示）

- Web：`弘讯web端design-system/web规范展示_框架版_*.html`（旁边同名 `_分享版.html` 零外链）
- 移动端：`弘讯移动端design-system/移动端规范展示_*.html`

## 改视觉样式（维护者）

- Web：改 `packages/web-ui/src/styles/` 四件 CSS → `node packages/web-ui/scripts/build-template-css.js` 重新生成 `template.css`（**不要直接手改 template.css**，它是构建产物）。
- 移动端：移动端规范为冻结资产（见其 `RULES.md` 锁定声明），改动须用户拍板。
