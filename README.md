# 弘讯 Design System 设计规范

> 📖 第一次来？先看 [START-HERE.md](./START-HERE.md)。
> ⚠️ **本项目 = 「左右结构」新规范（2026-11-18 起）**；V2.1 已冻结，仅历史，不读、不克隆。本文件不是真源——真源永远是 `tokens.json` / `components.json` / `template.css` / `RULES.md`。

工业控制（注塑机）领域的设计系统，覆盖 **Web 后台管理**（`.shell/.rail` 左右结构工作台）与 **移动端**。品牌色 `#005EAE`，亮/暗双模式 + 5 品牌主题换肤。

## 现行版式（Web）

- 左栏 `.rail`：全高品牌色，216 / 折叠 64，logo 区 56，作业树行 40，底部版权 + 折叠按钮。
- 右侧 `.workspace`：`.ws-global` 60（白色全局条：页标题 18/500 + LIVE/刷新 + 工具区 `首页 | 全屏·主题·APP | 语言 | 用户`）、`.ws-pagebar` 56（页签行）、`.ws-body`（内容从 `.page-sec` 开始）。
- 行为真源：`弘讯web端design-system/js/{shell-ui,tree-nav,i18n,page-ui}.js`（主题/APP/用户浮层、作业树交互、中英双语、页签/视图/筛选）。
- 机器状态：生产 / 空闲 / 停机 / 故障 / 离线 五主状态，第二层 mode / productionStatus / reason / plannedStop。

## 仓库结构

```
├── 弘讯web端design-system/            # Web 规范真源（`.shell/.rail` 工作台）
│   ├── tokens.json / components.json  # 值真源 / 组件机器契约
│   ├── template.css                   # build 产物（源 = packages/web-ui/src/styles/ 五件 CSS）
│   ├── page-template.html             # 唯一克隆源（脚手架自动克隆）
│   ├── partials/shell-tools.html      # 外壳工具区单点真源（sync-shell-tools 注入各页）
│   ├── js/                            # 运行真源：shell-ui / tree-nav / i18n / page-ui
│   ├── validate-spec.js               # 单页门禁（0 HIGH 才交付）
│   ├── RULES.md / MASTER.md / components.md / DESIGN-TOKENS.md
│   ├── web规范展示_左右结构.html        # 规范活体展示（+ `_分享版.html`）
│   └── showcase/                      # 示例页（v7 / 看板 / 登录页 / 表格 / 规范展示副本，均含 +分享版）
├── 弘讯移动端design-system/            # 移动端规范（同构；模板手写）
├── packages/web-ui/src/styles/        # Web CSS 真源：globals/components/framework/utilities/workbench 五件
├── scripts/                           # verify / new-page / build-share / shell-tools / gate-manifest / audit-*
├── GENERATION-SOP.md                  # 生成流程总纲（§① 生成 / §② 存量改造）
├── USAGE-GUIDE.md / 团队使用指南.md / USAGE.html   # 使用说明（人读）
├── CHART-SPEC.md / DARK-MODE.md / VISUAL-SPEC.md  # 图表 / 暗色 / 视觉规格
├── audit-rules.json / audit-spec.js   # 存量审计规则真源 / 审计脚本
├── output/                            # 历史示例与过程产物，不随规范分发
```

## 工作流（现行）

```bash
# 1) 起手：克隆唯一模板到「你的项目」output/（自动修 CSS/assets 路径、注入克隆凭证）
node <仓库根>/scripts/new-page-web.js 设备总览 <你的项目目录>

# 2) 只在 .ws-body .page-sec 内填业务（外壳零改动，不写页面级样式）

# 3) 单页门禁：validate + 组件复用 + 作业树运行时，0 HIGH 才交付
node <仓库根>/scripts/verify.js page <你的项目目录>/output/设备总览_*.html

# 4) 新规范全链路（真源 / 生成页 / 分享版）
node <仓库根>/scripts/verify.js all --scope=new

# 5) 分享版：由脚本内联 CSS + 4 个 js + 本地资源，禁手工内联
node <仓库根>/scripts/build-share-web.js <你的项目目录>/output/设备总览_*.html
```

> **交付口径 = `node scripts/verify.js all`**：先跑 `ci-local.js`（存量全链路），再跑 `verify-new`（新规范范围）；两者全绿才算可交付，项数以命令输出为准。只验新规范用 `--scope=new`。旧 `output/` 为历史归档，不阻塞新规范。

## 快速开始（Git 仓库）

- 本目录即仓库根，分支 `main`：`git clone https://github.com/youyituomaoxian/TM-UI-Design.git design-system` → `cd design-system`；之后 `git pull` 取更新。
- 仓库不含 `output/`（历史产出，本地留档）与 `HANDOFF.md`（维护者交接件）；`.dsh`/`.workbuddy` 的 `tm-design-system` **skill 入口随仓库分发**（`.workbuddy/.../SKILL.md` + `.dsh/.../SKILL.md` 指针），拉仓即用；规范仍以仓内文件为准（`AGENTS.md` / `START-HERE.md` / 各端真源）。
- 改完先跑门禁（`node scripts/verify.js all --scope=new`）再 `git commit`；禁 `force-push`，禁把 `output/` 加回版本库。

## 查看展示页（推荐入口）

| 内容 | 文件 |
|------|------|
| 规范活体展示（新左右结构） | `弘讯web端design-system/web规范展示_左右结构.html`（`_分享版.html` 零外链） |
| 工作台示例（主从表 / 工单 / 图表 / 5 状态） | `弘讯web端design-system/showcase/左右结构_v7_设备运维工作台.html`（+ `_分享版.html`） |
| 亮色看板示例 | `弘讯web端design-system/showcase/弘讯亮色注塑机看板.html`（+ `_分享版.html`） |
| 移动端规范展示 | `弘讯移动端design-system/移动端规范展示_*.html`（+ `_分享版.html`） |

## 配色引擎（brand-color-engine）

- 目录：`brand-color-engine/`；入口文档 `engine.md`。
- 调用：`generatePalette(brand, { mode: 'light'|'dark', platform: 'web'|'mobile' })` → 完整调色板 + 可注入 `:root` 的变量。
- 权威基准：`base-spec.json`；应用页示例：`node brand-color-engine/build-app.js <brand> [mode] [platform]`。
- 约束：功能色（成功/警告/错误/运行）固定语义、不随品牌推导。

## 核心约定

1. **Web 功能色 ≠ 移动端功能色**，两套不得混用。
2. **运行绿 ≠ 成功绿**：「设备运行中」与「操作完成」是不同语义。
3. 所有颜色走变量，禁硬编码非系统 HEX；页面禁写组件私有 CSS（门禁 `component.reuse`）。
4. 改真源走维护者六步（缺口登记 → 改真源 → 双端同步 → 门禁全绿 → 刷指纹 → CHANGELOG 留痕），无痕迹即违规。

## Agent 接入

- **Codex / Cursor / 通用**：根 `AGENTS.md` 自动加载；**Claude Code**：`CLAUDE.md`（`@AGENTS.md` 导入）。
- **DSH / WorkBuddy**：skill 入口在本仓库内（`.workbuddy/skills/tm-design-system/SKILL.md` 为薄壳，DSH 走 `.dsh/...` 指针），定位仓库根后按 `AGENTS.md` + `START-HERE.md` + 各端真源执行。
- 存量项目改造走 `GENERATION-SOP.md §②`：先台账（`scripts/audit-batch.js` 覆盖率 100%）→ 映射决策 → 分批修复 → `0 HIGH + 台账全绿` 收口。

## 版权

© 2013-2026 · MIT License
