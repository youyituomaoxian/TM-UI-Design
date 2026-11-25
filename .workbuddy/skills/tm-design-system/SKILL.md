---
name: tm-design-system
description: 弘讯设计系统规范（左右结构）：生成/修改/审计 B 端 Web 或移动端 HTML 页面；经 TM_DESIGN_REPO 或相对定位找到仓库根，按 GENERATION-SOP + 端 RULES 执行，交付口径 verify.js all 全绿
---

# tm-design-system · 弘讯设计规范（workbuddy skill）

> 本 skill 是**薄壳**：只负责定位仓库根并指示加载规范真源，不复制本体（避免双份维护）。
> 规范真源与可执行脚本全部在仓库根与端目录内。**2026-11-20 起仓库 = 左右结构新规范（main）**，旧 V2.1 已冻结在 `TM-UI-Design` 的 `backup/v2.1-final-*` 分支。

## 1. 定位仓库根（按序尝试）

1. 环境变量 `TM_DESIGN_REPO` → 其值即仓库根
2. 未设置 → 从本文件位置（`.workbuddy/skills/tm-design-system/`）**向上逐级查找**含 `scripts/verify.js` 的目录
3. 仍失败 → 在当前 workspace 查找含 `scripts/verify.js` 的目录

> 仓库根判定特征：根目录存在 `scripts/verify.js`、`ci-local.js`、`弘讯web端design-system/`、`弘讯移动端design-system/`。

## 2. 加载规范真源（动手前必读，按序；禁通读整份大文件）

1. `<仓库根>/AGENTS.md` — 行为入口（60 行内，全文读）。
2. `<仓库根>/GENERATION-SOP.md` — 流程总纲：**§① 生成主流程**（选端 / B 端固定框架判定 / 选型 §1.1b / 脚手架克隆 / 落盘 / 门禁）；**§② 存量项目改造**（audit-spec + D-1~D-13 逐维对照 → 映射决策 → 分批修复 → 收口）。按需读附录，不通读。
3. 端规范真源（两端同构）：
   - `<仓库根>/弘讯web端design-system/RULES.md` — §1.1b 页面类型规格、§1.1d 左右结构、§3 组件状态、§7 布局美学、§9 图表、页首治理契约（**按章节索引定点读**）
   - `<仓库根>/弘讯移动端design-system/RULES.md` — 同构（§1.1b / §9.7 / §10）
   - `<仓库根>/<端目录>/components.json`（组件契约）+ `template.css`（Web = build 产物 / 移动 = 手写真源）+ `tokens.json` + `DESIGN-TOKENS.md` + `MASTER.md`
4. `<仓库根>/CHART-SPEC.md` — 图表真源（原子 SVG 自建）。**页面含图表时必读 §4 色彩 / §5 交互 / §7 门禁**（加载集 `generate-web-chart`，见 `rule-index.json`）。
5. 克隆模板（唯一框架来源）：
   - Web：`<仓库根>/弘讯web端design-system/page-template.html`（`.shell/.rail` 216/64 + `.ws-global` 60 + `.ws-pagebar` 56；工具区由 `partials/shell-tools.html` 注入）
   - 移动端：`<仓库根>/弘讯移动端design-system/page-template.html`
6. 人读说明：`<仓库根>/团队使用指南.md` / `START-HERE.md`；视觉速览：`弘讯web端design-system/web规范展示_左右结构.html`、`showcase/`（v7 / 看板 / 登录 / 表格 / 规范展示）。
7. **口语→术语词典**（按需，勿整份加载）：`<本目录>/data/vocabulary.json`——对 `entries[].say` 做包含匹配取 `map` + `rule` 指针。

## 3. 脚本调用（Windows PowerShell，`$repo` = 仓库根绝对路径）

- **单页门禁**（0 HIGH 才交付）：`node "$repo\scripts\verify.js" page "<页面.html>"`（= validate + 页面契约 pager/stack + 组件复用 + 含 `.rail` 时的树运行时）
- **交付口径**（每次改动后必跑，须全绿）：`node "$repo\scripts\verify.js" all`（= 页面契约 fixtures/清单页/分享版 CSS 指纹 + 存量全链路 `ci-local` + 新规范范围 `verify-new`）；只验新规范用 `all --scope=new`
- **脚手架**（唯一克隆方式）：`node "$repo\scripts\new-page-web.js" <语义名> <你的项目目录>`（自动修 link/assets、注入克隆凭证）
- **分享版**（**必须脚本生成，禁手工内联**）：`node "$repo\scripts\build-share-web.js" "<页面.html>" [--out <输出.html>]`；改 `template.css`/`page-ui.js` 后必须重出（页面契约比对内联 CSS 指纹）
- **存量页面审计**（路径二 P0 盘点）：`node "$repo\audit-spec.js" "<页面.html>" --end web|mobile`（`--json` 出结构化台账）
- **外层工具区**（改 `.ws-tools` 时）：改 `<仓库根>/弘讯web端design-system/partials/shell-tools.html` → `node "$repo\scripts\sync-shell-tools.js"` → 再跑 `sync-showcase.js` / `build-share-web.js` 重出派生件；**禁改各页副本**
- **配色引擎**（非默认品牌 / 暗色）：`node "$repo\brand-color-engine\generate.js" <品牌色> <light|dark> <web|mobile>`

## 4. 铁律（违反 = 交付门禁拦截）

- 产出落「**用户项目**」的 `output/`（仓库根 `output/` 只是历史归档，不入库）；CSS 用 `<link>` 指向仓库 `template.css`，禁复制 CSS。
- 页面内容按 `RULES.md §1.1b` **从零自建**；**禁参照 output/、packages/ 或任何既有页面 DOM**；唯一可复制结构 = 克隆模板框架外壳（`.shell/.rail/.ws-global/.ws-body` 与 4 个运行 `<script>` 禁删）。
- 门禁 0 HIGH 才交付；MEDIUM（页面级布局/审美类）可接受但建议清零。
- **分页器层级**：见 `components.json#pageContracts`——`.card-body` / `.table-card` / `.card--fill` 直接子级 footer 合法；普通 `.card` 内裸 pager = HIGH。
- 颜色/尺寸/动效一律走 token（禁裸 hex、禁裸秒）：图表系列色只能 `--chart-*`；**系列色用通用语义色 / 拉伸贴边 / 数据区左右不对称 / 柱底悬空 = HIGH 拦截**。
- 登录页：法务行 = 服务条款/隐私政策 + **工信部备案号（可点击 `https://beian.miit.gov.cn/`）**；**不设「账号由系统管理员开通」帮助行**。
- **真源治理契约**：真源区（`template.css` / `tokens.json` / `components.json` / `partials/shell-tools.html` / `RULES.md` / 门禁脚本等）**默认只读**；改真源须用户显式下发任务并走维护者六步（登记 → 改 → 双端同步 → `verify.js all` 全绿 → 刷指纹 → CHANGELOG）。
- 存量改造走 `GENERATION-SOP §②`：先台账后修复（audit-spec 清零硬违规 + D-1~D-13 逐维对照），每批门禁回归；只改表现层，不动文案/字段/交互流程。
- Git：仓库是本目录（`main`）；改动先 `verify.js all` 全绿再 commit；**不 push 到未经用户确认的远端、禁 force-push**。
