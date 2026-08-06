# 弘讯移动端设计系统

> 工业控制（注塑机）跨端设计系统 · 微信小程序 / Android / iOS
> 品牌色 `#005EAE` · 来源 Figma `【20260519】弘讯移动端`

---

## 文件地图

| 文件 | 角色 | 何时读 |
|------|------|--------|
| `MASTER.md` | 主规范：色彩 / 字体 / 间距 / 圆角 / 组件 / 布局 / **§7.3 屏幕搭建步骤** | 任何 UI 生成前先读 §7.3 |
| `DESIGN-TOKENS.md` | CSS 变量输出（短名，由 `scripts/generate-design-tokens-md.js` 从 `tokens.json` 自动生成；含 `.ios`/`.android` 平台覆盖） | 写前端代码时引用；**改 token 请编辑 tokens.json 后重跑生成器** |
| `tokens.json` | 结构化 JSON Token（40 变量），供 Agent 程序化引用 | 程序化读取 |
| `components.json` | **组件规格层（机器 SSoT）**：11 组件结构化 spec + `contract` 硬约束 | Agent / 设计师对齐尺寸色值的唯一真源 |
| `scripts/generate-design-tokens-md.js` | **Token 命名统一生成器**：读 `tokens.json`（值真源）→ 重生成 `DESIGN-TOKENS.md`（短名）；支持 `--check` 供 CI 同步校验 | 改 token 后重跑；或接 pre-commit / CI |
| `CHANGELOG.md` | 版本治理：v1.0.0 基础 / v1.1.0 规格层 / v1.2.0 命名统一 | 追溯变更 |
| `components.md` | 组件规格层人读镜像（修改以 `components.json` 为准） | 人读概览 |
| `validate-spec.js` | **规范合规扫描器**（node，纯读档）：读 contract 扫 HTML 组件规则，HIGH 违反 exit 1，可作交付门禁 | 交付前门禁 |
| `page-template.html` | **可克隆起始模板（纯框架，2026-08-06）**：:root 短名 token + 手机壳（状态栏/导航/屏内滚动/底部导航）空壳，无 demo 组件（按 `RULES.md §1.1b` 自建）；经 `validate-spec.js` 校验 0 HIGH | **Agent 起手一律 clone 本文件** |
| `RULES.md` | 组件决策树 + 禁止清单 + 状态机 + **§1.1b 页面类型规格** + **§8 防溢出黄金法则** | 做组件选型 / 搭页面前**必读 §1.1b + §8** |
| `pages/examples/` | 品牌示例页（2026-08-06 已删除，见 brand-color-engine/examples/ 生成器） | — |
| `移动端规范展示_20260806_0755.html` | **移动端规范活体展示页**（人读入口，浏览器打开；同名 `_分享版.html` 零外链） | 概览设计系统全貌时打开 |
| `../弘讯web端design-system/CROSS-PLATFORM-COLORS.md` | **跨端功能色契约**（与 Web 共用，成功/警告/错误/运行 四语义两端对齐） | 两端一致性对齐时读 |

### 页面类型规格（2026-08-06：pages/*.md 已删除，并入 RULES §1.1b）
- 列表-详情页 / 表单页 / 仪表盘 / 个人中心 / 设备分组 / 告警列表 / 登录页 → `RULES.md §1.1b`（7 种页面规格）

---

## Agent 使用顺序

> **铁律 · 起手先 clone 模板**：`cp page-template.html 你的页面.html`，再增删组件，不要从空白页写。模板已对齐所有契约。

1. 读 `MASTER.md` §7.3「屏幕搭建步骤」+ `RULES.md` §8「黄金法则」→ 建立防溢出意识
2. **`cp page-template.html`** 起手 → 按 `RULES.md §1.1b` 页面类型规格在内容区自建
3. 按页面类型选规格：`RULES.md` §1.1 决策树 → §1.1b 页面类型规格（不再读 pages/*.md，直接按规格自建）
4. 取色 / 字号 / 间距：查 `MASTER.md` 色彩与间距 Token 或 `components.json` 各组件 sizing；**禁止硬编码非系统色**
5. 写代码：用短名 CSS 变量（`--primary`/`--n1`…/`--suc`/`--run`/`--radius-*`），与 `components.json` 1:1 对齐
6. **交付前门禁**：`node validate-spec.js 你的页面.html` → **0 HIGH 才许交付**（HIGH 违反 exit 1）

---

## ⚠️ 三条铁律（来自 Ardot 实战）

1. **组件库尺寸 ≠ 屏幕落位尺寸**：组件规格 `width=375px` 是 Figma 独立画框全宽；真实屏幕内容列必须是 **343px**（375−16×2 gutter）。插入实例后**立即**设 `width=343 + FIXED`。
2. **Ardot 不可向实例内部插子节点**：卡片 B 与列表用外层 `Group` 帧包裹为同级兄弟（见 `RULES.md §1.1b 设备分组` §7）。列表无法进入卡片 B 实例内部。
3. **变体更新必须用 `componentProperties` 包装**：`U(id, {"componentProperties": {"类型": "小程序"}})`，直接传键值对无效。

---

## 状态色速查

| 状态 | HEX | 说明 |
|------|-----|------|
| 运行中 / 在线 | `#16A34A` | 设备运行绿（**区别于成功绿 `#10B981`**，语义不同） |
| 故障 / 告警 | `#EF4444` | 错误红（同 §1.4） |
| 离线 | `#6C757D` | N7 灰 |
| 维护中 | `#F59E0B` | 警示橙（同 §1.4） |

> 完整色板见 `MASTER.md` §1；设备状态色专表见 `MASTER.md` §1.6。

---

## 与 Web 端设计系统的关系

- 同源品牌 `#005EAE`，但**平台规范独立**：移动端（小程序/iOS/Android）与 B端（Web）各自一套 Token 与组件。
- **运行/在线绿 `#16A34A` 两端共用**（工业监控最高频状态），与 Web 成功绿 `#389E0D` 语义不同、不得混用。
- 跨端功能色契约见 `../web/CROSS-PLATFORM-COLORS.md`。
- Web 端路径：`../web/`（同仓库下 `web/` 目录）
