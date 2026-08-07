# 弘讯 Design System 设计规范

> 📖 第一次来？先看 [USAGE-GUIDE.md](./USAGE-GUIDE.md)（3 分钟找到你的入口）

> 工业控制（注塑机）领域的设计系统，覆盖 **Web 后台管理** 与 **移动端（小程序 / Android / iOS）** 两套平台规范。
>
> 品牌色 `#005EAE` · 来源弘讯官方设计稿

---

## 仓库结构

```
├── 弘讯移动端design-system/          # 移动端设计系统（小程序 / Android / iOS）
├── 弘讯web端design-system/           # Web/B端 设计系统（Ant Design 风格）
│   │   （两端目录结构同构，各含：）
│   ├── MASTER.md                    # 主规范（10 章）
│   ├── tokens.json                  # 结构化 Token —— 值的唯一真源
│   ├── DESIGN-TOKENS.md             # CSS 变量（脚本生成·勿手改）
│   ├── components.json              # 组件规格层 —— 机器可读 SSoT（含 contract 硬约束）
│   ├── components.md                # 规格层人读镜像
│   ├── page-template.html           # Web 端 Agent 起手克隆模板（0 HIGH 基准）
│   ├── agent-starter.html           # 移动端起手模板（手机壳 375×812 + 屏内滚动 + hash 跳转 + 弹窗 API + StatusBar）
│   ├── validate-spec.js             # 合规扫描器（HIGH 违反 exit 1，交付门禁；含移动端 DOM 契约门禁）
│   ├── scripts/generate-design-tokens-md.js  # tokens.json → DESIGN-TOKENS.md（支持 --check）
│   ├── RULES.md / CHANGELOG.md / README.md
│   ├── （页面类型规格已并入 RULES.md §1.1b，2026-08-06；pages/ 目录已空）
│   ├── web规范展示_框架版_*.html   # Web 规范活体展示页（人读入口）
│   （Web 端另有 CROSS-PLATFORM-COLORS.md 跨端功能色契约）
│
├── CHART-SPEC.md                   # 图表规范（样式 + 结果约束，Agent 自建图表，色走 --chart-*）
├── output/                          # 历史示例/产物归档（不随设计系统分享）；新生成页落「用户项目」的 output/
├── AGENTS.md                        # codex / 通用 Agent 入口（标准生成流程）
├── .workbuddy/skills/tm-design-system/SKILL.md  # workbuddy 项目级 skill（可移植定位）
├── brand-color-engine/              # 品牌色→应用页配色引擎（engine.md 为入口）
├── scripts/git-hooks/pre-commit     # 提交门禁：两端 validate-spec.js 全过才许提交
├── scripts/setup-hooks.sh           # 队友一键启用 hook
├── .github/workflows/validate.yml   # CI 校验（push/PR→main）
├── LICENSE                          # MIT License
└── README.md                        # 本文件
```

## 快速开始（git clone）

```bash
git clone https://github.com/youyituomaoxian/TM-UI-Design.git
cd TM-UI-Design
```

> 仓库为**公开**——任何人可 clone（无需加成员）；如需限制访问可改回私有并加 Collaborators。
> clone 后：**codex/Claude Code** 自动读 `AGENTS.md` 零配置；**workbuddy** 自动加载 `.workbuddy/skills/`；其他 Agent 设 `TM_DESIGN_REPO=<路径>`；规范更新 `git pull`。

### 查看展示页（推荐入口）

直接在浏览器中打开：

| 系统 | 文件 |
|------|------|
| Web 规范活体展示 | `弘讯web端design-system/web规范展示_框架版_*.html`（同名 `_分享版.html` 零外链） |
| 移动端规范活体展示 | `弘讯移动端design-system/移动端规范展示_*.html`（同名 `_分享版.html`） |

### Agent / 开发者使用

1. **起手铁律**：Web B 端一律 `cp 弘讯web端design-system/page-template.html`；移动端一律 `cp 弘讯移动端design-system/page-template.html`（自由布局用 `agent-starter.html`）——模板已含正确 token + 框架外壳
2. **产出落盘**：生成页一律落「**用户项目**」的 `output/`（自动命名 `<语义名>_<YYYYMMDD>_<HHmm>.html`，禁写入设计系统仓库）；**转发/交付前**把 `<link …template.css>` 替换为内联 `<style>`（template.css 全量）生成 `_分享版.html`（零外链）
3. 组件尺寸/状态/色值查 `components.json`（机器 SSoT）或 `components.md`（人读）；移动端组件体系规格读移动端 `RULES.md §9`，组件级样例/色彩应用理念读 `§11`（§11.8 色彩应用理念 / §11.9 新增组件 / §11.10 对齐铁律），**前景/背景对比度规则读 §10.3b（功能色底禁白字，用深字 n10）**
4. 决策规则读 `RULES.md`（Web §3.7 组件 DOM 契约 + §7 布局美学 / 移动端 §3.5 DOM 契约 + §4 间距布局 + §9 组件体系 + §10 布局美学）；背景规范读 `MASTER.md`
5. 写代码用 DESIGN-TOKENS.md 的短名 CSS 变量（`--primary/--n1..n11/--suc/--run` 等）；程序化引用 tokens.json
6. **文字层级**：移动端文字一律 `.m-text-*` 语义类（h1/h2/h3/body1/body2/caption/label/num，见 §10.3），页面 `<style>` 只定义布局类，**禁用裸 font-size**（门禁 text.layer 拦截）
7. **交付门禁**：`node validate-spec.js <你的页面.html>` → 0 HIGH 才许交付（pre-commit / CI 同样拦截）

### 移动端 HTML 预览 = 手机壳

移动端页面预览是**手机壳形态**（375×812 固定屏 + 深色底居中 + StatusBar + home indicator），内容在 `.screen-scroll` 屏内滚动（禁长页向下追加），多屏用 hash 路由切换（`go/back/openModal/closeModal` API 模板内置）。组件体系：按钮（胶囊）/ 标签 5 色 / 弹窗（ActionSheet + Dialog）/ 导航（三槽位 + 底部）/ 列表卡片（Cell/Avatar/Card/Upload/Progress）+ 区域划分（Hero/金刚区/瓷片区/列表区/TabBar）—— 规格见移动端 `RULES.md §9`，**审美规范（构图/层次/留白/色彩克制）见 §10，组件级样例与色彩应用理念见 §11**；空态 `.m-empty`、数值 `.m-num`。

### 跨端色值对齐

两端功能色**分治但共享语义**：

- 成功绿：Web `#389E0D`（Ant Design）/ 移动端 `#10B981`（鲜亮）
- **运行绿 `#16A34A`：两端共用同一 HEX**（工业监控最高频状态）

完整契约见 `弘讯web端design-system/CROSS-PLATFORM-COLORS.md`。

## 配色引擎（brand-color-engine）

在智能体中根据**任意品牌色 / 暗色模式**生成「应用页」配色（注意：产出是应用页 HTML 原型，不是可视化规范展示页）：

- 目录：`brand-color-engine/`
- 入口文档：`brand-color-engine/engine.md`
- 调用：`generatePalette(brand, { mode: 'light'|'dark', platform: 'web'|'mobile' })` → 完整调色板 JSON（含可直接注入 `:root` 的 `css` 变量）
- 权威基准：`brand-color-engine/base-spec.json`（005EAE 亮色全量值 + 暗色共享常量）
- 应用页示例：`node brand-color-engine/build-app.js <brand> [mode] [platform]`

关键约束：**功能色（成功/警告/错误/运行）固定语义、不随品牌色推导**，保证状态全局可识别；默认 `#005EAE` 直接返回 2026 规范原值。

## 核心约定

1. **Web 功能色 ≠ 移动端功能色**——两套不得混用
2. **运行绿 ≠ 成功绿**——「设备运行中」与「操作完成」是不同语义
3. 所有颜色必须通过变量引用，禁止硬编码非系统 HEX

## 适用场景

- 注塑机设备监控 / 生产管理后台
- 工业物联网（IIoT）移动端应用
- 企业级 B 端管理界面

## Agent 接入（codex / workbuddy / 其他）

- **codex / Claude Code / 通用 Agent**：仓库根 `AGENTS.md` 即入口（标准生成流程，自动加载，零配置）。
- **workbuddy**：仓库内 `.workbuddy/skills/tm-design-system/SKILL.md`（项目级 skill，可移植定位：`TM_DESIGN_REPO` 环境变量或相对自身向上找仓库根）。
- **Reasonix**：全局薄壳 skill（`%APPDATA%\reasonix\skills\tm-design-system\SKILL.md`）指向本仓库（`TM_DESIGN_REPO`）；其兼容分支会优先加载仓库内 `.workbuddy/skills/` 本体。
- 生成合规页：按 `GENERATION-SOP.md` 克隆 `弘讯web端design-system/page-template.html` → 按 `RULES.md §1.1b` 自建内容 → `node 弘讯web端design-system/validate-spec.js <页面.html>`（HIGH 0 才交付）。
- 全仓总门禁：`node ci-local.js`（86 项全绿 EXIT 0）。
- 部署/分发：Git 仓库（私有）clone 或整目录拷贝（打包时排除 `output/`、`node_modules/`、`.git/`、`.reasonix/`）——详见 `团队使用指南.md`「部署与团队分发」。

## 版权

© 2013-2026 · MIT License
