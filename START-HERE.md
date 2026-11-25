# START HERE · 弘讯设计系统（左右结构 · 新规范）

> ⚠️ **本项目 = 「左右结构」新设计规范（2026-11-18 起）。V2.1 已冻结，仅历史：不读、不克隆、不引用。**
> 当前状态见 §6 / §9；本文件不是真源。页面统一从 `page-template.html`（`.shell/.rail` 工作台）克隆；skill 入口随仓库启用（`.workbuddy/.../SKILL.md` + `.dsh/...` 指针）；本目录即 Git 仓库根（`main`），`output/` 不入库。

## 1. 一句话

弘讯设计系统是一套**机器可读的页面约束**：把品牌色、字阶、组件、图标、页面结构固化成 `tokens.json` / `components.json` / `template.css` / `RULES.md`，让任意 Agent 生成的页面保持同一风格，并由门禁阻止漂移。交付主线 = HTML 静态页（Web / 移动端）；唯一克隆源 = 各端 `page-template.html`。

## 2. 常用命令

```bash
# 单页：validate + 页面契约 + 组件复用 + 作业树运行时（0 HIGH 才交付）
node scripts/verify.js page <页面.html>

# 新规范全链路（页面契约 + 清单页 + 分享版 + 文档体积）
node scripts/verify.js all --scope=new

# 辅助子命令（themes/docs/showcase/chrome/shell/manifest/icons/spec）见 verify.js 用法

# 分享版（内联 CSS + 4 个 js + 本地资源，禁手工内联）
node scripts/build-share-web.js <页面.html> [--out <输出.html>]

# 改 Web 样式真源（五件）后重建 template.css
node packages/web-ui/scripts/build-template-css.js
```

`verify.js` 按固定顺序调用现有脚本/页面契约模块，**不重复实现判定**。`verify.js all` = 页面契约 + 存量全链路（`ci-local.js`）+ 新规范范围（`verify-new.js`）；`--scope=new` 只跑后者。

## 3. 先认这 6 个入口

| 文件 | 作用 | 读法 |
|---|---|---|
| `AGENTS.md` | Agent 行为入口 | 全文（体量以文件为准） |
| `GENERATION-SOP.md` | 生成流程（§①/§②） | 先读 §①，存量读 §② |
| `弘讯web端design-system/RULES.md` | Web 规范正文 | 按章节索引定点读，禁止通读 |
| `弘讯web端design-system/tokens.json` | token 值真源 | 读 `colors` / `themes`；不要手改生成物 |
| `弘讯web端design-system/page-template.html` | 唯一克隆源（`.shell/.rail`） | 通过脚手架克隆，不要手抄 |
| `弘讯web端design-system/js/` | 运行真源：`shell-ui` / `tree-nav` / `i18n` / `page-ui` | 克隆页必须保留 4 个 `<script>` |

## 4. 真源 vs 生成物

| 层 | 文件 | 规则 |
|---|---|---|
| Token 真源 | `tokens.json`（含 `themes`） | 改值改这里 |
| CSS 生成 | `packages/web-ui/src/styles/` **五件**（globals/components/framework/utilities/workbench）→ `template.css` | 改源后 `build-template-css.js`；**不要手改 template.css** |
| 组件契约 | `components.json` + `components.md` | 机器契约 / 人读说明 |
| 页面模板 | `page-template.html` | 唯一克隆源（`.rail` 216/64 + `.ws-global` 60 + `.ws-pagebar` 56） |
| 行为 | `js/*.js` | 页面只引用，不复制、不改写 |
| 外壳工具区 | `partials/shell-tools.html` | 单点真源；`sync-shell-tools.js` 注入各页，禁改副本 |
| 门禁输入清单 | `scripts/gate-manifest.json` | 门禁只读此处（页面/分享版/工具区真源），禁在脚本里写死路径 |
| 示例 | `showcase/`（含 v7 工作台）、`web规范展示_左右结构.html` | 示例可看，不参与生成；分享版由 `build-share-web.js` 生成 |
| 历史 | `CHANGELOG-archive`（含分卷 `-2026-08_09`）、`output/` | 只读；新产出落**用户项目** `output/` |

## 5. 五个不要改

1. **不要手改 `template.css`**：会被 `build-template-css.js` 覆盖；改 `packages/web-ui/src/styles/`。
2. **不要复制旧展示页 / 旧 v7 当模板**：克隆源是 `page-template.html`（`.shell/.rail`）。
3. **不要用 `.tabs` 做数据筛选**：页签是导航语义；数据范围用 `.filter-chip`。
4. **不要在页面 `<style>` 里写组件私有类**：门禁 `component.reuse` HIGH；缺组件回真源补。
5. **不要为了过门禁改阈值、删检查或扩大豁免**：先读失败 contract，再改真源。

## 6. 门禁地图

> 命令与检查范围以 `scripts/verify.js` 用法为准；当前状态/页数/WARN 数统一看 `HANDOFF §1` + 命令输出，本文不复述。

- **单页**：`verify.js page`（validate + 页面契约 + 组件复用 + 树运行时）
- **交付**：`verify.js all`（页面契约 + `ci-local` + `verify-new`）
- **辅助**：`themes / docs / showcase / chrome / shell / manifest / icons / spec`（各自检查范围见 `verify.js` 用法）

失败时先看输出里的 `contract` 名，回对应端 RULES 命中章节；不要盲目修补。

## 7. 常见任务去哪

| 想做什么 | 先改 |
|---|---|
| 改品牌色/主题 | `tokens.json.colors` / `.themes` → `build-template-css.js` |
| 改页面标题/全局条 | `page-template.html` + `.ws-global` + `RULES §1.1d`；标题 `.page-title` 18/500 |
| 改一级页签/页签操作 | `.ws-pagebar` 的 `.tab-row` + `.tabs` + `.page-actions` |
| 改图标 | `icons/` + `icons.md`；页面内联同一 path（Web 190 / 移动 185） |
| 改门禁 | 先读对应 contract；不要先改 validator 让它过 |
| 查失败 | `node scripts/verify.js page <file>`；分享版用 `build-share-web.js` 重出 |

## 8. 示例与限制

- 可直接打开：`showcase/左右结构_v7_设备运维工作台.html`（+ `_分享版.html`）、`showcase/弘讯亮色注塑机看板.html`、`showcase/登录页示例.html`、`showcase/表格规范展示_20261112.html`、`web规范展示_左右结构.html`。
- 示例保留演示树 / 假数据，`validate` 对 `showcase/` 豁免 `template.residue`；业务页必须替换品牌与作业树。
- `showcase/` 的规范展示副本是**生成物**：改根目录源后运行 `node scripts/sync-showcase.js`；`verify.js showcase` 查漂移。分享版由 `build-share-web.js` 生成；改 `template.css`/`page-ui.js` 后必须重出（页面契约比对 CSS 指纹）。

## 9. 当前状态以运行结果为准

不要相信静态“全绿”快照；先跑 `node scripts/verify.js all --scope=new`，失败先归因再动文件。
