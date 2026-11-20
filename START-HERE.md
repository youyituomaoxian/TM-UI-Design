# START HERE · 弘讯设计系统（左右结构 · 新规范）

> ⚠️ **本项目 = 「左右结构」新设计规范（2026-11-18 起）。V2.1 已冻结，仅历史：不读、不克隆、不引用。**
> 当前状态见 §6 / §9；本文件不是真源。页面统一从 `page-template.html`（`.shell/.rail` 工作台）克隆；skill 入口已停用；本目录即 Git 仓库根（`main`），`output/` 不入库。

## 1. 一句话

弘讯设计系统是一套**机器可读的页面约束**：把品牌色、字阶、组件、图标、页面结构固化成 `tokens.json` / `components.json` / `template.css` / `RULES.md`，让任意 Agent 生成的页面保持同一风格，并由门禁阻止漂移。交付主线 = HTML 静态页（Web / 移动端）；唯一克隆源 = 各端 `page-template.html`。

## 2. 常用命令

```bash
# 单页：validate + 组件复用 + 作业树运行时（0 HIGH 才交付）
node scripts/verify.js page <页面.html>

# 新规范全链路：6 页 + 5 分享版 + 文档体积
node scripts/verify.js all --scope=new

# 主题契约 / 文档体积 / 示例副本
node scripts/verify.js themes
node scripts/verify.js docs
node scripts/verify.js showcase
node scripts/verify.js chrome
node scripts/verify.js icons
node scripts/verify.js spec

# 分享版（内联 CSS + 4 个 js + 本地资源，禁手工内联）
node scripts/build-share-web.js <页面.html> [--out <输出.html>]

# 改 Web 样式真源（五件）后重建 template.css
node packages/web-ui/scripts/build-template-css.js
```

`verify.js` 只按固定顺序调用现有脚本，**不新增检查、不改判定**。全量 `verify.js all`（=`ci-local.js`）含旧 V2.1 派生检查，当前有历史红灯，见 §6。

## 3. 先认这 6 个入口

| 文件 | 作用 | 读法 |
|---|---|---|
| `AGENTS.md` | Agent 行为入口 | 全文，约 3.7k |
| `GENERATION-SOP.md` | 生成流程（选端→框架→选型→克隆→落盘→门禁） | 先读 §①，存量读 §② |
| `弘讯web端design-system/RULES.md` | Web 规范正文（§1.1d = 左右结构） | 按章节索引定点读，禁止通读 |
| `弘讯web端design-system/tokens.json` | token 值真源 | 读 `colors` / `themes`；不要手改生成物 |
| `弘讯web端design-system/page-template.html` | 唯一克隆源（`.rail` 216/64 + `.ws-global` 60 + `.ws-pagebar` 56） | 通过脚手架克隆，不要手抄 |
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
| 历史 | `CHANGELOG-archive`、`output/` | 只读；新产出落**用户项目** `output/` |

## 5. 五个不要改

1. **不要手改 `template.css`**：会被 `build-template-css.js` 覆盖；改 `packages/web-ui/src/styles/`。
2. **不要复制旧展示页 / 旧 v7 当模板**：克隆源是 `page-template.html`（`.shell/.rail`）。
3. **不要用 `.tabs` 做数据筛选**：页签是导航语义；数据范围用 `.filter-chip`。
4. **不要在页面 `<style>` 里写组件私有类**：门禁 `component.reuse` HIGH；缺组件回真源补。
5. **不要为了过门禁改阈值、删检查或扩大豁免**：先读失败 contract，再改真源。

## 6. 门禁地图（2026-11-20 实测）

| 命令 | 检查什么 | 当前状态 |
|---|---|---|
| `verify.js page` | 单页 0 HIGH：结构/标题/颜色/组件/克隆凭证/作业树运行时 | ✅ 6 页 0 HIGH（USAGE 64 MED 属 doc-* 布局类；登录示例 0 违反） |
| `verify.js all --scope=new` | 6 页 validate + 8 页 tree runtime + 5 分享版零外链 + 清单/工具区 + check-size | ✅ 通过 |
| `ci-local.js`（`verify all`） | 旧全链路 + 双端一致性 | ✅ **105 pass / 0 fail** |
| `check-size.js` | 文档体积 + 清单封闭 | ✅ 0 FAIL / 23 WARN |
| `check-reach.js` | 索引 / 引用 / 加载预算 | ✅ 0 FAIL / 2 WARN（加载余量 3.7%） |
| `check-sync.js` | 双端同名类 + vendor 同构 | ✅ 3 pass / 0 fail（4 类平台差异入白名单；141 类已扩容登记 gaps） |
| `verify.js chrome` | 工具区与真源 `partials/shell-tools.html` 一致 + 4 个运行 js 可加载（9 页含分享版） | ✅ 通过 |
| `verify.js shell` | 工具区真源是否已注入各页（漂移检查，失败给正确修复命令） | ✅ 4 / 4 |
| `verify.js manifest` | 清单存在性/组内去重/页面覆盖性/契约声明 | ✅ 29 条登记 / 1 条忽略 |
| `verify.js icons` | 图标库每个图标都在规范展示「图标集」出现 + 计数一致 | ✅ 190 / 190 |
| `verify.js spec` | 规范展示页自检：图表坐标/柱值标签/计数声明/锚点/旧分页器/未定义变量 | ✅ 通过 |

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

- 可直接打开：`showcase/左右结构_v7_设备运维工作台.html`（+ `_分享版.html`）、`showcase/弘讯亮色注塑机看板.html`、`web规范展示_左右结构.html`。
- 示例保留演示树 / 假数据，`validate` 对 `showcase/` 豁免 `template.residue`；业务页必须替换品牌与作业树。
- `showcase/` 的规范展示副本是**生成物**：改根目录源后运行 `node scripts/sync-showcase.js`；`verify.js showcase` 查漂移。分享版由 `build-share-web.js` 生成。

## 9. 当前状态以运行结果为准

不要相信静态“全绿”快照；先跑 `node scripts/verify.js all --scope=new`，失败先归因再动文件。
