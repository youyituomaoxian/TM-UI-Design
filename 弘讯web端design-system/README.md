# 弘讯B端视觉系统（Web 设计系统）

> 工业控制（注塑机）B端后台管理系统 · Web / Ant Design 风格
> 品牌色 `#005EAE` · 来源弘讯 B端设计稿 V2.0（Ardot 提取）

---

## 文件地图

| 文件 | 角色 | 何时读 |
|------|------|--------|
| `MASTER.md` | 主规范：色彩 / 字体 / 间距 / 圆角 / 组件 / 布局 / **§7.3 页面搭建步骤** | 任何 UI 生成前先读 §7.3 |
| `DESIGN-TOKENS.md` | **CSS 变量输出（自动生成）**：由 `scripts/generate-design-tokens-md.js` 从 `tokens.json` 生成，短名统一（`--primary`/`--n5`/`--suc`/`--run`）；勿手改 | 写前端代码时引用；改 token 改 tokens.json 后重跑脚本 |
| `tokens.json` | 结构化 JSON Token（63 颜色变量 + 间距/圆角/字体/布局），**值真源**；供 Agent 程序化引用 | 程序化读取；改色值唯一切口 |
| `scripts/generate-design-tokens-md.js` | **Token 命名统一生成器**：读 `tokens.json` → 生成 `DESIGN-TOKENS.md`（短名）；`--check` 可做 CI 同步校验 | token 命名统一 / CI 门禁 |
| `CROSS-PLATFORM-COLORS.md` | **跨端功能色契约**：成功/警告/错误/运行 四语义两端共用、各带平台 HEX | 两端一致性对齐时读 |
| `RULES.md` | 组件决策树 + 禁止清单 + 状态机 + **§1.1b 页面类型规格** + **§6 Web 布局黄金法则** | 做组件选型 / 搭页面前**必读 §1.1b + §6** |
| `pages/examples/` | 品牌示例页已删除（2026-08-06）；需要时用 `brand-color-engine/examples/gen-examples.js` 重新生成 | — |
| `web规范展示_框架版_20260806_1050.html` | **Web 规范活体展示页**（人读入口，浏览器打开；同名 `_分享版.html` 零外链） | 概览设计系统全貌时打开 |
| `components.json` | **组件规格层（机器可读，唯一真源）**：全部 11 个组件（按钮/输入/表格/标签/页签/分页/状态点/下拉/日期/树/弹窗）的结构化规格 + referenceCss/Html + Ardot 映射；底部 `contract` 字段为机器可校验硬约束（驱动 validate-spec.js） | Agent/校验脚本读；生成任意组件前读 |
| `components.md` | 组件规格层的人读镜像（含可克隆 CSS 与 Ardot 搭建指引），v1.1 覆盖全部 11 组件 | 设计师在 Ardot 搭组件 / 同事写 HTML 时对照 |
| `validate-spec.js` | **规范合规扫描器**（node，纯读档）：读 components.json 的 `contract`，扫描目标 HTML 的 `<style>` 组件规则，捕获字重/尺寸/半径/非 token 色等回归；HIGH 违反 exit 1，可作 pre-commit / CI gate | 交付前门禁；或批量校验历史页面 |
| `page-template.html` | **可克隆起始模板（纯框架，2026-08-06）**：正确 `:root` token（短名对齐 components.json）+ 顶栏72/侧栏240/内容区空壳/底栏32，**无 demo 组件**（按 `RULES.md §1.1b` 自建内容）；经 `validate-spec.js` 校验 0 HIGH | 生成任意页面前先 `cp` 本文件起手 |

### 页面类型规格（2026-08-06：pages/*.md 已删除，并入 RULES §1.1b）
- 后台框架 → `RULES.md §0`（顶栏 72 / 侧边栏 240 / 内容区 / 底栏 32 + G8/G9）
- 数据看板 / 监控大屏 → `RULES.md §1.1b 看板`（KPI 卡两版 + §9 图表）
- 列表表格页 → `RULES.md §1.1b 列表页`（筛选 + 表格 48/44 + 分页 44）
- 表单 / 弹窗 → `RULES.md §1.1b 弹窗`（Modal 382 + 单行输入）
- 登录页 → `RULES.md §1.1b 登录页`（独立页，不套框架）
- 详情页 → `RULES.md §1.1b 详情页`（键值对 + 参数表 + 日志时间轴）

---

## Agent 使用顺序

> **起手**：生成任意页面**先 `cp page-template.html 你的页面.html`**，再按 `RULES.md §1.1b` 页面类型规格在 `.content` 内自建内容，**禁止裸写空文件**（降方差、保证 token 与布局骨架正确）。

1. 读 `MASTER.md` §7.3「页面搭建步骤」+ `RULES.md` §6「Web 布局黄金法则」→ 建立框架与防错意识
2. 按页面类型选规格：`RULES.md` §1.1 决策树 → §1.1b 页面类型规格（不再读 pages/*.md，直接按规格自建）
3. 取色 / 字号 / 间距：查 `MASTER.md` 色彩与间距 Token，**禁止硬编码非系统色（尤其禁止移动端 `#10B981`）**
4. 写代码：用 `DESIGN-TOKENS.md` 的 CSS 变量；Agent 程序化用 `tokens.json`
5. 生成任意组件：读 `components.json` 取结构化尺寸、状态与 `referenceCss`（已对齐 showcase 变量，可直抄）；下拉/日期/树/弹窗 4 类组件须严格按规格层
6. **交付前门禁**：跑 `node validate-spec.js <生成的.html>` → 必须 **0 HIGH 违反** 才许交付（脚本自动校验按钮字重400/圆角8、输入高32、表头高48字重500、标签高22、页签激活字重500、分页24圆钮、状态点10、Web 禁 #10B981 等）

---

## ⚠️ 三条铁律（来自 Ardot 实战）

1. **Web 功能色 ≠ 移动端功能色**：B端对齐 Ant Design — 成功 `#389E0D` / 警告 `#FA8C16` / 错误 `#F5222D`。移动端成功绿 `#10B981` **禁止**进入 Web 系统。
2. **侧边栏(主色)菜单项一律白字**：不在主色底用浅灰文字（对比度不足）。顶栏/底栏同此。
3. **变体更新必须用 `componentProperties` 包装**：`U(id, {"componentProperties": {"属性 1": "悬停"}})`，直接传键值对无效。

---

## 状态色速查

| 状态 | HEX | 说明 |
|------|-----|------|
| 成功 | `#389E0D` | Ant Design 成功绿（Web 专用，区别于移动端 `#10B981`） |
| 运行/在线 | `#16A34A` | 工业语境专用绿（与移动端运行中对齐，独立于成功绿） |
| 警告 / 注意 | `#FA8C16` | Ant Design 警告橙 |
| 错误 / 故障 | `#F5222D` | Ant Design 错误红 |
| 在线/生产（状态灯） | `#16A34A` | 设备运行（运行绿，非成功绿） |
| 故障（状态灯） | `#F5222D` | 设备异常 |
| 离线（状态灯） | `#ADB5BD` | N8 灰 |

> 完整色板见 `MASTER.md` §1；功能色专表见 `MASTER.md` §1.6。

## 与移动端设计系统的关系

- 同源品牌 `#005EAE`，但**平台规范独立**：移动端（小程序/iOS/Android）与 B端（Web）各自一套 Token 与组件。
- 移动端成功绿 `#10B981`；Web 成功绿 `#389E0D`。两者**不得混用**。
- **运行/在线绿 `#16A34A` 两端共用**（工业监控最高频状态），见 `CROSS-PLATFORM-COLORS.md`。
- 移动端文件路径：`../弘讯移动端design-system/`（同仓库下移动端目录）
