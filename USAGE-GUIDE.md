# 弘讯设计系统 · 使用 SOP

工业控制（注塑机）领域设计系统，覆盖 **Web 后台管理** 与 **移动端（小程序/Android/iOS）**。品牌色 `#005EAE`。
人读速览版见 `团队使用指南.md`；Agent 生成总纲见 `GENERATION-SOP.md`。

---

## 快速开始（Git 仓库）

> 本目录即仓库根（`main`）：`git clone <内部仓库地址>` 后 `git pull` 取更新。`output/`（历史产物）与 `HANDOFF.md`（维护者交接件）不入库，分发不再靠整目录拷贝。

- **codex / Reasonix / Cursor / 通用 Agent**：项目根 `AGENTS.md` 自动加载，零配置。
- **Claude Code**：读 `CLAUDE.md`（`@AGENTS.md` 导入，同源）。
- **WorkBuddy / DSH**：本项目 skill 入口已停用（`.dsh`/`.workbuddy` 的 `SKILL.md.disabled`）；会话落在项目目录时按 `AGENTS.md` + `START-HERE.md` 执行。
- **其他 Agent**：把项目根路径写进任务书（`TM_DESIGN_REPO` 仅兼容旧入口）。

---

## 一页看懂

**三条并行链路**，各自从同一真源产出符合规范的视觉页面，没有接力与上下游：

| 角色 | 工具 | 产出 |
|---|---|---|
| UI 设计师 | Ardot / Figma / 即时设计 等 + Agent | 设计稿 |
| 产品经理 | Agent + `page-template.html` | HTML 视觉预览 |
| 前端工程师 | Agent + `packages/` 组件库（可选） | React/Taro 参考实现 |

- **视觉一致**由真源保证（同一份 tokens + 契约 + 门禁），不是由流程保证。
- 三条链路互不依赖；谁都不从别人产物倒推 spec。

---

## 共同前提（三角色通用）

| 项 | 内容 |
|----|------|
| 真源 | 两端目录下 `tokens.json`（值）+ `components.json`（契约）+ `RULES.md §1.1b`（页面类型规格） |
| 铁律 | 不硬编码色值；不自造规范；页面内容按 `RULES.md §1.1b` 从零自建（**禁参照既有页面 DOM**）；组件词汇与代码库同源 |
| 质量闸 | HTML 预览产物 → `scripts/verify.js page <页面>` **0 HIGH**（validate + 组件复用 + 作业树运行时）；交付口径 `scripts/verify.js all`（= ci-local 105 项 + 新规范范围）**全绿** |
| 禁区 | 真源/门禁/引擎**使用者只读**（改真源走维护者六步流程，真源治理契约）；Web 端任何文件禁 `#10B981`（移动端成功绿） |
| 边界 | 交付「视觉规格 + HTML 预览」，上线实现由使用者决定；参考实现仅供同栈复用 |
| 落盘 | 生成页一律落「**用户项目**」的 `output/`；设计系统仓库根 `output/` 仅历史归档，不随仓库分发 |

---

## 角色一：UI设计师 → 设计稿

**工具中立**：Ardot、Figma、即时设计、MasterGo、Pixso 均可——只要 Agent 能读规范、能操作画布。

### 对 Agent 说

```
按弘讯设计系统规范，在 <设计工具名> 里搭建 <页面描述>。
规范读 弘讯web端design-system/ 的 tokens.json、components.json、MASTER.md、RULES.md §1.1b。
颜色必须绑变量或严格等于 tokens.json 的值，禁止裸 HEX；
组件结构与命名对齐代码组件库。
```

（移动端换 `弘讯移动端design-system/`）

### Agent 读取顺序（加载纪律见 `GENERATION-SOP.md §0`）

**加载预算 ≤40k 字符/任务（入口 + 规范包）——只读命中章节。** ① `GENERATION-SOP.md` §①（存量读 §②）；② 对应端 `RULES.md` 命中章节（页面规格 §1.1b / 左右结构 §1.1d）；③ `tokens.json` 的 `colors`。**禁通读** `components.json` / `template.css` / `validate-spec.js` / `ci-local.js`（门禁与构建消费，看输出即可）；`MASTER` / `DESIGN-TOKENS` 按章取。

### 铁律

1. **0 裸 HEX**：颜色绑变量或严格等于 tokens.json（白色也是 token）。
2. **词汇同源**：组件名 = 代码库组件名，不造野组件；字阶照 spec（Web 12 级 / 移动双套 9 级）；文本必绑 neutral 色。

### Ardot 资产（仅 Ardot 用户）

Web 文件 `709697838782860`（83 变量 + 33 组件 + 12 级字阶）；移动 `709734372369429`（60 变量 + 37 组件 cell）。旧文件 `701545559030003` / `701218509066139` 只读。MCP 未覆盖的合并变体 / 发布 Text Style 需人工收尾。

### 产出

**设计稿 = 视觉交付物**。验收：截图自查 0 裸 HEX、字阶正确、组件名与代码一致。

---

## 角色二：产品经理 → HTML 视觉预览

**详细 SOP**：`GENERATION-SOP.md`（含品牌色 / 暗色引擎映射段）。成品示例：`弘讯web端design-system/showcase/`（工作台 v7 / 亮色看板 / 规范展示；不参与门禁）。

### 对 Agent 说

**认 AGENTS.md 的 Agent（codex / Claude Code / Reasonix，克隆目录内对话）——一句话即可：**

```
按弘讯设计系统生成 <需求描述> 页面。
```

**外部 Agent（不加载 AGENTS.md）——给「任务 + 入口」完整版：**

```
按弘讯设计系统生成 <需求描述>：node <仓库根>/scripts/new-page-<web|mobile>.js <语义名>，
遵循 GENERATION-SOP.md 与 <对应端>design-system/RULES.md，门禁 0 HIGH 才交付。
```

### 流程 4 步

1. **选端**：「后台 / 表格 / 侧边栏」→ Web；「小程序 / 手机 / 卡片」→ 移动端。
2. **起手**：跑脚手架 `node <仓库根>/scripts/new-page-web.js <语义名>`（移动端换 `new-page-mobile.js`）落「**用户项目**」`output/`——自动克隆 page-template 框架 + 注入克隆凭证 meta + 修正 CSS link（禁裸写空文件、禁参照既有页面 DOM；产出一律落用户项目 output/，见 GENERATION-SOP 步骤4 产出落盘规则）。Web 用 `page-template.html`（纯框架：`.shell/.rail` 216/64 + `.ws-global` 60 + `.ws-pagebar` 56 + `.ws-body`；内容从 `.page-sec` 开始）；移动端用 `page-template.html`（手机壳 + 导航 + 屏内滚动 + 底部导航；自由布局也从 page-template 克隆，`agent-starter.html` 仅为同源极简克隆示例）。
3. **写内容**：按 `RULES.md §1.1b` 页面类型规格**从零自建**（登录/列表/详情/弹窗/看板等）；组件用规范 class（Web `.btn`/`.input`/`.table`；移动端 `.mbtn`/`.mtag`/`.mlist-double`/`.mcard`…），色 / 尺寸 / 字重全走 `var(--*)`，禁硬编码 hex；图表按 `CHART-SPEC.md` 原子 SVG 自建（色走 `--chart-*`）。**移动端组件体系规格读移动端 RULES §9；审美规范读 §10**；文字用 `.m-text-*` 语义类（禁裸 font-size）。
4. **门禁**：`node scripts/verify.js page <用户项目路径>/output/<文件>.html` → **0 HIGH 才交付**；分享版重出后同样复跑。

### 产出

**HTML 视觉预览** —— 视觉规格的呈现载体（看板、报表、监控、工具页等视觉效果确认用），**不是上线文件**；上线实现（平台/框架）由使用者自行决定，照此预览 + `tokens.json` 实现即可。

> 📤 **分享/交付**：`node scripts/build-share-web.js <页面.html> [--out <输出.html>]`——脚本内联 `template.css` + 4 个 js + 本地资源并校验零外链；**禁止手工内联**（会漏 js / 资源）。

---

## 角色三：前端工程师 → 参考实现（可选）

**核心：不手写样式。** 组件库已消费 tokens.json，样式与规范天然一致。**仅当你的项目技术栈恰为 React/Taro 时复用**；异栈照 HTML 预览 + tokens.json 自实现。

### 对 Agent 说

```
用 packages/web-ui（或 mobile-ui）组件库实现 <需求描述>。
引入 globals.css + components.css，只用库内组件拼装，不写自定义样式。
```

### Web（`packages/web-ui`，33 件）

```tsx
import '@techmation/web-ui/src/styles/globals.css';    // token 变量（亮+暗）
import '@techmation/web-ui/src/styles/components.css'; // 组件样式
import { Button, Input, Table, Tag, StatusDot, Dialog } from '@techmation/web-ui';
```

- 主题：`<html data-skin="green">`（默认/青/绿/橙/紫）；暗色：`<html data-theme="dark">`（禁 shadcn 原生 `.dark` 类）
- 密度：`<html data-density="compact">` / `comfortable` / `spacious`
- 预览：`cd packages/web-ui && npm install && npm run dev`
- **样式真源（N=1）**：`packages/web-ui/src/styles/` **五件** CSS（globals/components/framework/utilities/workbench）→ `node packages/web-ui/scripts/build-template-css.js` 合并生成端目录 `template.css`。**改视觉样式改五件再 build，不要直接手改 template.css**。

### 移动端（`packages/mobile-ui`，Taro + NutUI）

```bash
cd packages/mobile-ui && npm install
npx taro build --type weapp   # 产物 dist/ 导入微信开发者工具
```

### 结构映射（页面 → 组件树）

按钮/输入/表格/标签/页签/分页/状态点/弹窗 → `<Button>` `<Input>` `<Table>` `<Tag>` `<Tabs>` `<Pagination>` `<StatusDot>` `<Dialog>`。只拼装库内组件，不写自定义样式。

### 产出

**参考实现代码（可选）**。验收：`cd packages/web-ui && node scripts/validate-static.js` → 门禁全绿。

---

## 改规范的唯一正确姿势

> 🏛️ **真源治理契约（2026-09-10 起）**：真源区文件使用者只读；要改 = 维护者六步流程（缺口登记 → 改真源 → 双端同步 → 门禁全绿 → 刷指纹 → CHANGELOG 留痕），详见双端 `RULES.md` 页首。双端同步由 `check-sync.js` 机器门禁兜底。

1. **改视觉（Web）**：改 `packages/web-ui/src/styles/` **五件** CSS（含 workbench）→ `node packages/web-ui/scripts/build-template-css.js` 重新生成 `template.css`（N=1 构建链，勿手改 template.css）。移动端规范已解冻（2026-08-06 用户拍板）；结构性/视觉性改动仍建议先与用户确认方向。
2. **改 token**：改 `tokens.json` → 重跑 `scripts/generate-design-tokens-md.js` 生成 `DESIGN-TOKENS.md`。
3. **改品牌色**：`node brand-color-engine/generate.js <brand> light <web|mobile>` 与 dark 各一次（非默认品牌默认双模式，功能色不随品牌变）。
4. **总门禁**：`node ci-local.js` → 期望全绿 `0 fail`（2026-09-10 起；项数以输出为准）。

三条链路各自重新生成，**禁止从任何产物（设计稿 / HTML / 代码）倒推 spec**。

---

## 存量项目审查修改（路径二）

已有 HTML 页面/项目按弘讯规范改造（审计修复 / 存量迁移）——**不走生成流程**，走 `GENERATION-SOP.md` **§② 存量项目改造 SOP** 五阶段。审查目的：找出视觉不符合弘讯设计系统的地方，修改成符合弘讯设计系统的视觉。

1. **P0 盘点**：先出**页面清单**（`node scripts/audit-batch.js <项目目录> --list`），再逐页双门禁（`audit-spec` 清零硬违规 + `validate-spec` 0 HIGH）并落台账（`--json` 含覆盖率；<100% 即未完成）+ 按 `audit-rules.json` D-1~D-13 **逐维对照**，差异全部落台账（禁止逐条手改式找问题）。
2. **P1 映射决策**：每个差异按 D 层 map_to 定「改成什么」——这个色映射到哪个 token、这个元素映射到哪个组件类、这个字号映射到哪级字阶。
3. **P2 修复**：分批修复，每批 `node ci-local.js` 回归全绿。
4. **P3 表现层**：截图审查运行时问题（截断/溢出/交互态/图表渲染）；**证据落 `output/audit-shots/`，逐 tab × 亮暗 × 滚动态，缺图即未审**。
5. **P4 收口**：**0 HIGH + 台账全绿**（覆盖率 100% / D 维无空白 / 截图齐全）+ CHANGELOG 留痕；「0 HIGH」单独不算交付。

**边界**：只改视觉表现层——禁改文案与信息项、字段与数据口径、交互流程与功能行为（SOP §② 铁律 6）；确需内容/功能变更另立需求。

**改真源区文件必须有台账 + 用户显式拍板**（台账即授权载体）。提示词模板见 `标准提示词模板.md`「审计/修复既有页面」「存量系统弘讯化迁移」。

---

## 发现设计系统问题怎么办（单向报告流 · 2026-09-10）

先归因：**执行问题**（规范写了没执行）→ 直接改页面，不记录；**设计系统问题**（token/组件/图标缺口、规范歧义、门禁漏洞、文档缺陷）→ 复制 `templates/设计系统问题报告模板.md` 落盘**你的项目** `output/设计系统问题_YYYYMMDD_NN.md`，对话内请用户转交维护者（**不直连、不改真源**）。报告须给定位（真源文件:行 / 规则 id / token 名）+ 最小复现 + 建议规则文本 + 建议回归样例；P0 当场转交，P1/P2 攒批。制度真源：`audit-rules.json → issue_reporting`。

---

## 文件清单（仓库口径）

### ✅ 随目录分发（使用流程依赖）

| 路径 | 用途 |
|------|------|
| `AGENTS.md` / `CLAUDE.md` | Agent 入口（Claude Code 经 `@AGENTS.md` 同源） |
| `README.md` / `START-HERE.md` / `团队使用指南.md` | 项目入口 / 10 分钟上手 / 人读速览 |
| `USAGE-GUIDE.md` / `USAGE.html` | 本文件（三角色 SOP） / 网页版说明 |
| `GENERATION-SOP.md` / `CHART-SPEC.md` / `DARK-MODE.md` / `VISUAL-SPEC.md` | 生成总纲 / 图表 / 暗色 / 视觉规格 |
| `scripts/verify.js` | 统一门禁入口（page / all / tree / themes / docs / sync / reach / reuse / showcase / chrome / icons / spec） |
| `scripts/new-page-web.js` / `new-page-mobile.js` | 脚手架：克隆唯一模板并注入克隆凭证 |
| `scripts/build-share-web.js` | 分享版构建（内联 CSS + 4 js + 资源，零外链） |
| `ci-local.js` / `check-size.js` / `check-reach.js` / `check-sync.js` / `sync-index.js` | 全链路 / 体积 / 可达性 / 双端一致性 / 索引生成 |
| `audit-rules.json` / `audit-spec.js` / `scripts/audit-*.js` | 存量审计规则真源 / 审计 / 批量 / 截图 / 复用 / 树运行时 |
| `gate-capture.js` / `roll-changelog.js` / `gate-map.json` / `rule-index.json` / `vendor-coverage.json` | 门禁捕获 / 归档 / 章节映射 / 规则路由 / 双端覆盖登记 |
| `brand-color-engine/` | 品牌色→调色板引擎（`engine.md` 入口） |
| `弘讯web端design-system/` | Web 全家桶：tokens/components/RULES/MASTER/模板/`js/`（shell-ui、tree-nav、i18n、page-ui）/门禁/规范展示/showcase |
| `弘讯移动端design-system/` | 移动端全家桶（同构；模板手写） |
| `packages/web-ui/src/styles/` | **CSS 五件真源**（globals/components/framework/utilities/workbench） |
| `templates/` | 设计系统问题报告模板等应用侧可复制模板 |

> 两端 `pages/` 已空（2026-08-06：页面规格并入 `RULES.md §1.1b`）；Web 规范入口 = `web规范展示_左右结构.html`（+ `_分享版.html`）、`showcase/左右结构_v7_设备运维工作台.html`（+ `_分享版.html`）。

### ❌ 不随目录分发（本地 / 历史归档）

| 路径 | 性质 |
|------|------|
| `output/` | 历史示例/产物归档（新生成页落**用户项目** output/） |
| `.edge-*` / `.workbuddy/` | 浏览器缓存 / Agent 工作目录 |
| `node_modules/` `dist/` `dist-static/` `package-lock.json` | 依赖与构建产物 |

---

## 常见问题

**Q: 怎么拿到最新规范？**
A: `git pull` 拉「左右结构」仓库 `main` 分支即可（V2.1 旧仓 `TM-UI-Design` 已冻结，不再 clone/pull，不是规范源）。

**Q: 换品牌色？**
A: `node brand-color-engine/generate.js <brand> light <web|mobile>` 生成亮色映射（暗色固定、不随品牌），按 GENERATION-SOP 附录 B 写进模板短名 `:root`；功能色（成功/警告/错误/运行）固定不随品牌变。

**Q: 加新组件？**
A: token 需求写 `tokens.json` → `packages/web-ui/src/components/ui/` 加 `.tsx` → 五件中对应 CSS 加样式（组件层 `components.css`，页面模式 `workbench.css`）→ `build-template-css.js` 重建 → 设计端同步（`components.json` / `components.md`）→ `validate-spec` / `validate-static` 全绿。

**Q: 怎么确认没改坏？**
A: 单页 `node scripts/verify.js page <页面>` → 0 HIGH；新规范范围 `node scripts/verify.js all --scope=new` → 通过。`ci-local` 含旧 V2.1 派生检查，当前有历史红灯（`START-HERE §6`），不要用它冒充新页验收。

**Q: 规范更新怎么同步？**
A: 维护者改完跑 `sync-index` + `verify`，更新双端 `CHANGELOG`；成员拿到新目录后重跑门禁。仓库建立后改为 `git pull`。

---

## Agent 接入（codex / Claude Code / 其他）

- **codex / Claude Code / 通用 Agent**：项目根 `AGENTS.md` 自动加载（脚手架克隆 → `RULES §1.1d` 自建 → `verify.js page` 0 HIGH）。
- **WorkBuddy / DSH**：本项目 skill 入口已停用（`SKILL.md.disabled`）；按 `AGENTS.md` + `START-HERE.md` 执行。
- 一句话需求 → 过门禁 0 HIGH 的合规 HTML 页，详见 `AGENTS.md` + `GENERATION-SOP.md`。
