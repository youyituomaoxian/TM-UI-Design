# 弘讯设计系统 · 使用 SOP

工业控制（注塑机）领域设计系统，覆盖 **Web 后台管理** 与 **移动端（小程序/Android/iOS）**。品牌色 `#005EAE`。
人读速览版见 `团队使用指南.md`；Agent 生成总纲见 `GENERATION-SOP.md`。

---

## 快速开始（git clone）

```bash
git clone https://github.com/youyituomaoxian/TM-UI-Design.git
cd TM-UI-Design
```

> 仓库为**公开**——任何人可直接 clone（无需加成员）；如需限制访问可改回私有并加 Collaborators。
> clone 后即插即用：
> - **codex / Reasonix / Cursor / 通用 Agent**：仓库根 `AGENTS.md` 自动加载，零配置。
> - **Claude Code**：读 `CLAUDE.md`（`@AGENTS.md` 导入，与通用入口同源）。
> - **workbuddy**：项目级 skill 自动生效（`.workbuddy/skills/tm-design-system/`）。
> - **其他 Agent**：设环境变量 `TM_DESIGN_REPO=<clone 路径>`。
> - **规范更新**：`git pull`（维护者 push 后）。

---

## 一页看懂

**三条并行链路**，各自独立产出符合规范的视觉页面。没有接力、没有上下游：

```
                tokens.json + components.json（唯一真源 · 冻结只读）
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
   UI设计师                产品经理                前端工程师
   Agent + UI 设计工具     Agent + HTML 模板       Agent + 组件库
   (Ardot/Figma/即时设计…)  (page-template.html)   (web-ui / mobile-ui)
        │                       │                       │
     设计稿               HTML 视觉预览            参考实现（React/Taro，可选）
```

- **并行**：三条链路互不依赖，各自从真源出发直接产出，谁也不给谁供输入。
- **视觉一致**是真源保证的（同一份 tokens + 契约 + 门禁），不是流程保证的。

---

## 共同前提（三角色通用）

| 项 | 内容 |
|----|------|
| 真源 | 两端目录下 `tokens.json`（值）+ `components.json`（契约）+ `RULES.md §1.1b`（页面类型规格） |
| 铁律 | 不硬编码色值；不自造规范；页面内容按 `RULES.md §1.1b` 从零自建（**禁参照既有页面 DOM**）；组件词汇与代码库同源 |
| 质量闸 | HTML 预览产物 → `validate-spec.js` **0 HIGH**；参考实现产物 → `validate-static.js` 全绿；总门禁 `node ci-local.js` → **86 pass / 0 fail** |
| 禁区 | 不改真源 / 门禁 / 引擎；Web 端任何文件禁 `#10B981`（移动端成功绿） |
| 边界 | 规范交付「视觉规格 + HTML 预览」，**上线实现（平台/框架）由使用者决定**；参考实现仅供同栈使用者复用 |
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

### Agent 读取顺序

| 顺序 | 文件 | 取什么 |
|------|------|--------|
| 1 | `tokens.json` | 色板 / 字阶 / 间距 / 圆角 / 阴影的值 |
| 2 | `components.json` | 组件结构化规格（尺寸 / 状态 / 变体） |
| 3 | `MASTER.md` | 布局规则（Web 顶栏 72 / 侧栏 240；移动端 375 宽 / 落位 343） |
| 4 | `RULES.md`（含 §1.1b 页面类型规格） | 组件选型 + 页面规格（2026-08-06：pages/*.md 已并入 §1.1b） |

### 铁律

1. **0 裸 HEX**：颜色绑变量或严格等于 tokens.json；白色也是 token（`neutral/N1`）。
2. **词汇同源**：组件名 = 代码库组件名（`packages/web-ui` 33 件 / `packages/mobile-ui` NutUI），不造野组件。
3. **字阶照 spec**：Web 12 级 / 移动端 android+ios 双套 9 级；字体 Source Han Sans CN。
4. **文本必绑 neutral 色**，禁默认黑。

### Ardot 资产（仅 Ardot 用户）

| 端 | 文件 | fileId | 已建内容 |
|----|------|--------|---------|
| Web | 【20260731】弘讯B端视觉系统V3.0 | `709697838782860` | 83 变量（双模式）+ 33 组件 + 12 级字阶 |
| 移动端 | 【20260731】弘讯移动端V3.0 | `709734372369429` | 60 变量（双模式）+ 37 组件 cell + 双套字阶 |

> 旧文件 `701545559030003` / `701218509066139` 弃用只读。MCP 做不到的需人工收尾：合并变体、发布 Text Style。

### 产出

**设计稿 = 视觉交付物**。验收：截图自查 0 裸 HEX、字阶正确、组件名与代码一致。

---

## 角色二：产品经理 → HTML 视觉预览

**详细 SOP**：`GENERATION-SOP.md`（含非默认品牌色 / 暗色的引擎映射段）。

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
2. **起手**：跑脚手架 `node <仓库根>/scripts/new-page-web.js <语义名>`（移动端换 `new-page-mobile.js`）落「**用户项目**」`output/`——自动克隆 page-template 框架 + 注入克隆凭证 meta + 修正 CSS link（禁裸写空文件、禁参照既有页面 DOM；产出一律落用户项目 output/，见 GENERATION-SOP 步骤4 产出落盘规则）。Web 用 `page-template.html`（纯框架：顶栏 72 + 侧栏 240 + content 空壳 + 底栏 32）；移动端用 `page-template.html`（手机壳 + 导航 + 屏内滚动 + 底部导航；自由布局用 `agent-starter.html`）。
3. **写内容**：按 `RULES.md §1.1b` 页面类型规格**从零自建**（登录/列表/详情/弹窗/看板等）；组件用规范 class（Web `.btn`/`.input`/`.table`；移动端 `.mbtn`/`.mtag`/`.mlist-double`/`.mcard`…），色 / 尺寸 / 字重全走 `var(--*)`，禁硬编码 hex；图表按 `CHART-SPEC.md` 原子 SVG 自建（色走 `--chart-*`）。**移动端组件体系规格读移动端 RULES §9；审美规范读 §10**；文字用 `.m-text-*` 语义类（禁裸 font-size）。
4. **门禁**：`cd <端目录> && node validate-spec.js <用户项目路径>/output/<文件>.html` → **0 HIGH 才交付**。

### 产出

**HTML 视觉预览** —— 视觉规格的呈现载体（看板、报表、监控、工具页等视觉效果确认用），**不是上线文件**；上线实现（平台/框架）由使用者自行决定，照此预览 + `tokens.json` 实现即可。

> 📤 **分享/交付**：把 `<link …template.css>` 替换为内联 `<style>`（template.css 全量内容）生成 `_分享版.html`（零外链，任何设备双击即看）。

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

- 暗色：`<html data-theme="dark">`（禁 shadcn 原生 `.dark` 类）
- 密度：`<html data-density="compact">` / `comfortable` / `spacious`
- 预览：`cd packages/web-ui && npm install && npm run dev`
- **样式真源（N=1）**：`packages/web-ui/src/styles/` 四件 CSS（globals/components/framework/utilities）→ `node packages/web-ui/scripts/build-template-css.js` 合并生成端目录 `template.css`。**改视觉样式改四件再 build，不要直接手改 template.css**。

### 移动端（`packages/mobile-ui`，Taro + NutUI）

```bash
cd packages/mobile-ui && npm install
npx taro build --type weapp   # 产物 dist/ 导入微信开发者工具
```

### 结构映射（页面 → 组件树）

| 页面结构 | 组件 |
|---------|------|
| 按钮 | `<Button>` / NutUI `<Button>` |
| 输入 | `<Input>` / `<Textarea>` |
| 表格 | `<Table>` |
| 标签 | `<Tag>` / `<Badge>` |
| 页签 | `<Tabs>` |
| 分页 | `<Pagination>` |
| 状态点 | `<StatusDot>` |
| 弹窗 | `<Dialog>` / `<AlertDialog>` |

### 产出

**参考实现代码（可选）**。验收：`cd packages/web-ui && node scripts/validate-static.js` → 门禁全绿。

---

## 改规范的唯一正确姿势

1. **改视觉（Web）**：改 `packages/web-ui/src/styles/` 四件 CSS → `node packages/web-ui/scripts/build-template-css.js` 重新生成 `template.css`（N=1 构建链，勿手改 template.css）。移动端规范已解冻（2026-08-06 用户拍板，恢复可修改）；结构性/视觉性改动仍建议先与用户确认方向。
2. **改 token**：改 `tokens.json` → 重跑 `scripts/generate-design-tokens-md.js` 生成 `DESIGN-TOKENS.md`。
3. **改品牌色**：`node brand-color-engine/generate.js <brand> light <web|mobile>` 与 dark 各一次（非默认品牌默认双模式，功能色不随品牌变）。
4. **总门禁**：`node ci-local.js` → 期望 `86 pass / 0 fail`。

三条链路各自重新生成，**禁止从任何产物（设计稿 / HTML / 代码）倒推 spec**。

---

## 文件清单（GitHub 已上传口径）

### ✅ 仓库内（使用流程依赖，随仓库分发）

| 路径 | 用途 |
|------|------|
| `AGENTS.md` | codex / 通用 Agent 入口（标准生成流程） |
| `README.md` / `团队使用指南.md` | 项目入口 / 人读速览 |
| `USAGE-GUIDE.md` | 本文件，三角色总 SOP |
| `GENERATION-SOP.md` | 产品链路详细 SOP（含引擎映射段） |
| `CHART-SPEC.md` / `DARK-MODE.md` / `VISUAL-SPEC.md` | 图表 / 暗色 / 视觉规格 |
| `LICENSE` | 许可证（MIT，版权已脱敏） |
| `ci-local.js` | 86 项总门禁 |
| `.gitignore` / `.github/workflows/` | 忽略规则 + CI（validate.yml 校验两端 page-template） |
| `.workbuddy/skills/tm-design-system/SKILL.md` | workbuddy 项目级 skill |
| `brand-color-engine/` | 品牌色→调色板引擎（含 `examples/gen-examples.js` 示例页生成器） |
| `弘讯web端design-system/` | Web spec 全家桶（tokens/components/MASTER/RULES（含 §1.1b）/模板/门禁/规范展示页） |
| `弘讯移动端design-system/` | 移动端 spec 全家桶（同构） |
| `packages/web-ui/` | Web React 组件库源码（**不含** node_modules/dist） |
| `packages/mobile-ui/` | 移动端 Taro 组件库源码（**不含** node_modules/dist） |
| `scripts/` | git hooks（pre-commit 门禁） |

> 两端 `pages/` 已空（2026-08-06：覆写文档并入 `RULES.md §1.1b`）；规范展示页在端目录根（`web规范展示_框架版_*.html` / `移动端规范展示_*.html`）。

### ❌ 不随仓库分发（本地 / 历史归档，.gitignore 已排除）

| 路径 | 性质 |
|------|------|
| `output/` | 历史示例/产物归档（新生成页落用户项目 output/） |
| `.reasonix/` | 本机 Agent 记忆 / 回滚点 |
| `.workbuddy/`（skills/ 除外） | Agent 工作目录（记忆 / 截图 / 临时） |
| `node_modules/` `dist/` `dist-static/` `.swc/` `package-lock.json` `*.tsbuildinfo` | 依赖与构建产物 |

---

## 常见问题

**Q: 非成员能 clone 吗？**
A: 能——仓库为公开，任何人 `git clone https://github.com/youyituomaoxian/TM-UI-Design.git` 即可；如需限制访问可改回私有并加 Collaborators。

**Q: 换品牌色？**
A: `node brand-color-engine/generate.js <brand> light <web|mobile>` 与 dark 各一次（非默认品牌默认双模式）→ 按 GENERATION-SOP 附录 B 映射进模板短名 `:root`。功能色（成功/警告/错误/运行）固定不随品牌变。

**Q: 加新组件？**
A: token 需求写入 `tokens.json` → `packages/web-ui/src/components/ui/` 加 `.tsx` → `src/styles/components.css` 加样式 → `build-template-css.js` 重建 → 设计端同步加同名组件 → `validate-static.js` / `validate-spec.js` 全绿。

**Q: 怎么确认没改坏？**
A: `node ci-local.js`，期望 `86 pass / 0 fail`。

**Q: 规范更新怎么同步？**
A: 维护者 commit + push → 成员 `git pull`（私有仓库成员认证）。

---

## Agent 接入（codex / workbuddy / 其他）

- **codex / Claude Code / 通用 Agent**：仓库根 `AGENTS.md` 自动加载（标准生成流程：克隆 page-template → §1.1b 自建 → 0 HIGH 门禁），零配置。
- **workbuddy**：项目级 skill `.workbuddy/skills/tm-design-system/SKILL.md` 自动生效（可移植定位：`TM_DESIGN_REPO` 环境变量或相对自身向上找仓库根）。
- **Reasonix**：全局薄壳 skill 指向本仓库（`TM_DESIGN_REPO`）；兼容分支优先加载仓库内 `.workbuddy/skills/` 本体。
- 一句话需求 → 过门禁 0 HIGH 的合规 HTML 页，详见 `AGENTS.md` + `GENERATION-SOP.md`。
