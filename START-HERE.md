# START HERE · 弘讯设计系统

> 给第一次接手的人：**10 分钟知道该读什么、跑什么、不要改什么。**  
> 这里不替代 `RULES` / `GENERATION-SOP`，只做入口和索引；规范冲突时以真源和门禁为准。

## 1. 一句话

弘讯设计系统是一套**机器可读的页面约束**：把品牌色、字阶、组件、图标、页面结构固化成 `tokens.json` / `components.json` / `template.css` / `RULES`，让任意 Agent 生成的页面保持同一风格，并由门禁阻止漂移。

- 交付主线：**HTML 静态页面**（Web / 移动端）
- 可选组件库：`packages/`（React / Taro，非 HTML 主线）
- 唯一克隆源：`弘讯web端design-system/page-template.html` / `弘讯移动端design-system/page-template.html`

## 2. 六条命令

```bash
# 全链路：audit + validate + check-sync + check-themes + check-size + check-reach
node scripts/verify.js all

# 单页：自动按路径选择 Web / 移动端 validator
node scripts/verify.js page 弘讯web端design-system/showcase/弘讯亮色注塑机看板.html

# 主题契约 / 文档体积
node scripts/verify.js themes
node scripts/verify.js docs
node scripts/verify.js showcase

# 改 Web 样式真源后重建 template.css
node packages/web-ui/scripts/build-template-css.js
```

`verify.js` 只按固定顺序调用现有脚本，**不新增检查、不改判定**。需要细分时仍可直接跑原脚本。

## 3. 先认这 6 个文件

| 文件 | 作用 | 读法 |
|---|---|---|
| `AGENTS.md` | Agent 行为入口 | 全文，约 4k |
| `GENERATION-SOP.md` | 生成流程（选端→框架→选型→克隆→落盘→门禁） | 先读 §①，按需读 §② |
| `弘讯web端design-system/RULES.md` | Web 规范正文 | 按章节索引定点读，禁止通读 |
| `弘讯web端design-system/tokens.json` | token 值真源 | 读 `colors` / `themes`；不要手改生成物 |
| `弘讯web端design-system/page-template.html` | 唯一克隆源 | 生成页面从这里开始 |
| `弘讯web端design-system/validate-spec.js` | 页面门禁 | 只跑，不读全文；失败再定位 |

## 4. 真源 vs 生成物

| 层 | 文件 | 规则 |
|---|---|---|
| Token 真源 | `tokens.json` | 改值改这里 |
| CSS 生成 | `packages/web-ui/src/styles/*.css` → `template.css` | 改源后 `build-template-css.js`；**不要手改 template.css** |
| 组件契约 | `components.json` + `components.md` | 机器契约 / 人读说明 |
| 页面模板 | `page-template.html` | 唯一克隆源 |
| 示例 | `showcase/`、根目录 `web规范展示` | 根目录是源；`showcase/` 里三个规范展示由 `scripts/sync-showcase.js` 生成，勿手改；`弘讯亮色注塑机看板.html` 是独立示例 |
| 历史 | `CHANGELOG-archive`、`output/` | 只读；新产出落用户项目 `output/` |

## 5. 五个不要改

1. **不要手改 `template.css`**：Web 端会被 `build-template-css.js` 覆盖；要改 `packages/web-ui/src/styles/`。
2. **不要把 `docs/` 当入库目录**：当前 `.gitignore` 忽略它；团队说明以根目录文档为准。
3. **不要复制 `web规范展示` 当模板**：克隆源是 `page-template.html`。
4. **不要用 `.tabs` 做数据筛选**：页签是导航语义；数据范围用 `.filter-chip`。
5. **不要为了过门禁改阈值、删检查或扩大豁免**：先读失败 contract，再改对应真源。

## 6. 门禁地图

| 命令 | 检查什么 | 失败时先看 |
|---|---|---|
| `scripts/verify.js all` | 全链路 104 项 | 输出中的 FAIL 段 |
| `validate-spec.js` | 单页 0 HIGH：结构/标题/颜色/组件/指纹 | `contract` 名 + 页面行号 |
| `audit-spec.js` | 存量页审计：M/R/H + D-1~D-13 | `audit-rules.json` 对应条目 |
| `check-themes.js` | 主题 token、对比度、下拉选项 | `tokens.json.themes` / `page-template` |
| `check-size.js` | 文档体积 + 清单封闭 | 超限文件 / 未登记新文件 |
| `check-reach.js` | 索引、引用、加载预算 | 断链 / 索引漂移 |
| `check-sync.js` | Web/Mobile 同名类与 vendor 同构 | `vendor-coverage.json` |

## 7. 常见任务去哪

| 想做什么 | 先改 |
|---|---|
| 改品牌色/主题 | `tokens.json.colors` / `tokens.json.themes` → 重建 `template.css` |
| 改页面标题/页头 | `page-template.html` + `RULES §1.1b`；标题 `.page-title` 18/500 |
| 改一级页签 | `.tab-row` + `.tabs`；数据筛选改 `.filter-chip` |
| 改图标 | `icons/` + `icons.md`；页面内联同一 path |
| 改门禁 | 先读对应 contract；不要先改 validator 让它过 |
| 查失败 | `node scripts/verify.js page <file>` 或 `all` |

## 8. 示例与限制

- 可直接打开：`showcase/弘讯亮色注塑机看板.html`（主题切换）、`showcase/web规范展示...html`、`showcase/表格规范展示...html`。
- 示例保留演示树/假数据，`validate` 对 `showcase/` 豁免 `template.residue`；业务页必须替换品牌、底栏、作业树。
- `showcase/` 里三个规范展示是**生成物**：改根目录源后运行 `node scripts/sync-showcase.js`；`node scripts/verify.js showcase` 检查是否漂移，不要手改副本。

## 9. 当前状态以运行结果为准

不要相信任何静态“全绿”快照。接手后先跑：

```bash
node scripts/verify.js all
```

最近一次记录：2026-11-17，`104 pass / 0 fail`（以实际输出为准）。失败时先看 `contract`，再回对应端 `RULES` 命中章节；不要盲目修补。
