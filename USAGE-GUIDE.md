# 弘讯设计系统 · 使用 SOP

工业控制（注塑机）领域设计系统，覆盖 **Web 后台管理** 与 **移动端（小程序/Android/iOS）**。品牌色 `#005EAE`。

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
   (Ardot/Figma/即时设计…)  (agent-starter.html)    (web-ui / mobile-ui)
        │                       │                       │
     设计稿               HTML 视觉预览            参考实现（React/Taro，可选）
```

- **并行**：三条链路互不依赖，各自从真源出发直接产出，谁也不给谁供输入。
- **视觉一致**是真源保证的（同一份 tokens + 契约 + 门禁），不是流程保证的。

---

## 共同前提（三角色通用）

| 项 | 内容 |
|----|------|
| 真源 | `弘讯web端design-system/` 和 `弘讯移动端design-system/` 下的 `tokens.json`（值）+ `components.json`（契约） |
| 铁律 | 不硬编码色值；不自造规范；组件词汇与代码库同源（Web 34 件 / 移动端 NutUI） |
| 质量闸 | HTML 预览产物 → `validate-spec.js` 0 HIGH；参考实现产物 → `validate-static.js` 5 门禁全绿 |
| 禁区 | 不改真源 / 门禁 / 引擎；Web 端任何文件禁 `#10B981`（移动端成功绿，Web 用 `#389E0D`） |
| 边界 | 规范交付「视觉规格 + HTML 预览」，**上线实现（平台/框架）由使用者决定**；参考实现仅供同栈使用者复用 |

---

## 角色一：UI设计师 → 设计稿

**工具中立**：Ardot、Figma、即时设计、MasterGo、Pixso 均可——只要 Agent 能读规范、能操作画布。

### 对 Agent 说

```
按弘讯设计系统规范，在 <设计工具名> 里搭建 <页面描述>。
规范读 弘讯web端design-system/ 的 tokens.json、components.json、MASTER.md。
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
| 4 | `RULES.md`（含 §1.1b 页面类型规格） | 组件选型 + 页面规格（2026-08-06：Web pages/*.md 已并入 RULES §1.1b） |

### 铁律

1. **0 裸 HEX**：颜色绑变量或严格等于 tokens.json；白色也是 token（`neutral/N1`）。
2. **词汇同源**：组件名 = 代码库组件名（`packages/web-ui` 34 件 / `packages/mobile-ui` NutUI），不造野组件。
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

```
按弘讯设计系统 GENERATION-SOP 生成移动端（或 Web）视觉预览：<需求描述>。
起手克隆模板落「用户项目」output/（自动命名），颜色走 var(--*)，跑 validate-spec.js 0 HIGH 交付。
```

### 流程 4 步

1. **选端**：「后台 / 表格 / 侧边栏」→ Web；「小程序 / 手机 / 卡片」→ 移动端。
2. **起手**：克隆模板落「**用户项目**」`output/<语义名>_<时间戳>.html`（禁裸写空文件、禁复制 Demo 页；产出一律落用户项目 output/，见 GENERATION-SOP 步骤4 产出落盘规则；设计系统仓库 output/ 仅历史归档）。Web 用 `page-template.html`；移动端用 `page-template.html`（自由布局用 `agent-starter.html`）。
3. **写内容**：保留组件 class（Web `.btn`/`.input`/`.table`；移动端 `.mbtn`/`.mtag`/`.mlist-double`/`.mcard`…），色 / 尺寸 / 字重全走 `var(--*)`，禁硬编码 hex。**移动端组件体系规格（按钮/标签/弹窗/导航/列表卡片）读移动端 RULES §9；审美规范（构图/层次/留白/色彩克制）读 §10；组件级样例与色彩应用理念（不改颜色值）读 §11**；数值用 `.m-num`。**文字层级**：移动端文字一律 `.m-text-*` 语义类（§10.3），页面 `<style>` 只定义布局类，禁裸 font-size（门禁 text.layer 拦截）。
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

### Web（`packages/web-ui`，34 件）

```tsx
import '@techmation/web-ui/src/styles/globals.css';    // token 变量（亮+暗）
import '@techmation/web-ui/src/styles/components.css'; // 组件样式
import { Button, Input, Table, Tag, StatusDot, Dialog } from '@techmation/web-ui';
```

- 暗色：`<html data-theme="dark">`（禁 shadcn 原生 `.dark` 类）
- 密度：`<html data-density="compact">` / `comfortable` / `spacious`
- 预览：`cd packages/web-ui && npm install && npm run dev`

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

**参考实现代码（可选）**。验收：`cd packages/web-ui && node scripts/validate-static.js` → 5 门禁全绿。

---

## 改规范的唯一正确姿势

1. 改真源：`tokens.json`（值）或 `components.json`（契约）。
2. Web 代码端：`cd packages/web-ui && node scripts/map-tokens.js --brand '#新色'` → `export-static.js` → `validate-static.js`。
3. 设计端：同步变量值（任何工具同理：先改 token 定义，产物自动跟随）。
4. 总门禁：`node ci-local.js` → 期望 `86 pass / 0 fail`。

三条链路各自重新生成，**禁止从任何产物（设计稿 / HTML / 代码）倒推 spec**。

---

## 文件清单（上传 GitHub 口径）

### ✅ 必须上传（使用流程依赖）

| 路径 | 用途 |
|------|------|
| `README.md` | 项目入口 |
| `USAGE-GUIDE.md` | 本文件，三角色总 SOP |
| `GENERATION-SOP.md` | 产品链路详细 SOP（含引擎映射段） |
| `DARK-MODE.md` | 暗色模式规范 |
| `LICENSE` | 许可证 |
| `ci-local.js` | 86 项总门禁 |
| `.gitignore` / `.github/workflows/` | 忽略规则 + CI |
| `brand-color-engine/`（5 文件） | 品牌色→调色板引擎 |
| `弘讯web端design-system/`（顶层文件） | Web spec 全家桶（tokens/components/MASTER/RULES（含 §1.1b 页面规格）/模板/门禁） |
| `弘讯移动端design-system/`（15 顶层文件） | 移动端 spec 全家桶 |
| `packages/web-ui/` | Web React 组件库源码（**不含** node_modules/dist） |
| `packages/mobile-ui/` | 移动端 Taro 组件库源码（**不含** node_modules/dist） |
| `scripts/` | git hooks（pre-commit 门禁） |

### ❌ 不上传（设计过程产生的临时/内部文件，.gitignore 已排除）

| 路径 | 性质 |
|------|------|
| `.workbuddy/` | Agent 工作目录（记忆 / 截图 / 临时）——**其中 `skills/` 随仓库分发，不忽略** |
| `node_modules/` `dist/` `dist-static/` `package-lock.json` `*.tsbuildinfo` | 依赖与构建产物 |
| `【20251226】弘讯UI色彩系统_马守坤.html` | 早期色彩探索稿（本地资产） |
| `A-PACK-SHOWCASE.html` | A 包（阴影/层级/动效）展示快照 |
| `Techmation设计系统使用说明.html` | 旧版人读说明页，功能已被本文件取代 |
| `W1-TASKBOOK.md` ~ `W3B-TASKBOOK.md`（5 份） | 阶段任务书 |
| `PROGRESS.md` | 项目进度记录 |
| `HANDOFF.md` | 内部交接文档 |
| `BLOCKED.md` | 阻塞项清单 |
| `TOKENS-EVIDENCE.md` | 设计决策国际对标引证 |

> 临时文件**保留本地不删除**（有追溯价值），`.gitignore` 负责排除，push 时自然不带上去。

---

## 常见问题

**Q: 换品牌色？**
A: 改 `tokens.json` 的 `colors.primary.default` → `packages/web-ui/scripts/map-tokens.js --brand '#新色'` → `export-static.js` 重新生成。功能色（成功/警告/错误/运行）固定不随品牌变。

**Q: 加新组件？**
A: token 需求写入 `tokens.json` → `packages/web-ui/src/components/ui/` 加 `.tsx` → `components.css` 加样式 → `export-static.js` → `validate-static.js` 全绿 → 设计端同步加同名组件。

**Q: 怎么确认没改坏？**
A: `node ci-local.js`，期望 `86 pass / 0 fail`。

**Q: 能不能 git commit / push？**
A: 暂缓。本地改动已齐，等统一指令一次性 push（.gitignore 已配好，临时文件不会带上去）。

---

## Agent Skill（tm-design-system）

- 本仓库已内置 WorkBuddy skill `tm-design-system`：`.workbuddy/skills/tm-design-system/SKILL.md`（编排指令；可移植定位：`TM_DESIGN_REPO` 环境变量或相对自身向上找仓库根）。
- 一句话需求 → 过门禁 0 HIGH 的合规 HTML 页，详见该 SKILL.md。
