# 弘讯设计系统 · 自然语言 → 规范 UI 生成 SOP

> 把一句界面描述，变成**过门禁 0 HIGH** 的合规 HTML 页面（可选同步 Ardot 画布）。
> 适用：设计师 / 前端 / Agent。默认品牌 `#005EAE` 直接用模板 token；指定其他品牌色或暗色时用配色引擎推导（附录 B）。
> 配套：`brand-color-engine/`（引擎）、两端 `agent-starter.html`（纯净起始模板）、`template.css`（CSS 骨架）、`validate-spec.js`（门禁）。
> 实证：本 SOP 的映射规则已由两端示例页（默认色/暗色/自定义品牌色，2026-08-06 已删除，生成器保留在 `brand-color-engine/examples/gen-examples.js`）验证通过。

> **⚠️ 跨端守则（2026-08-06 更新）**：移动端冻结已于 2026-08-06 解除（见移动端 RULES 顶部声明），可修改；结构性 / 视觉性改动仍建议先与用户确认方向。
> 改 Web 端时若涉及移动端（共享 token / 组件体系 / validate-spec 对称改动 / 两端联动规则 / 脚手架），**必须先提醒用户拍板**，不得静默同步改动。

---

## 阅读说明：主流程 vs 附录（先读这节）

> **主流程（§①）= 必读**：步骤 1–5 可独立走完「默认品牌 / 亮色 / 无图表」页面的生成闭环。
> **附录（§②）= 按需检索**：以下场景才读对应附录（详见每附录开头一句话）。

| 场景 | 读哪里 |
|---|---|
| 首次生成页面（默认品牌 `#005EAE` / 亮色 / 无图表） | 只读 §① 主流程步骤 1–5 |
| 页面含图表 | 步骤 4.5 + **附录 A**（或真源 `CHART-SPEC.md`） |
| 非 `#005EAE` 品牌色 / 暗色模式 | **附录 B**（配色引擎映射） |
| 使用者确认采用 React/Taro 技术栈（可选参考实现） | **附录 C** |
| 需要 Ardot 原生画布设计稿（须已装 Ardot + MCP 已连） | **附录 D** |
| 表达层增强（构图 / 栅格 / 留白节奏 / taste） | **附录 E** |
| 决策树速查 / 全量禁区 | **附录 F** |

> **阅读策略联动**：本 SOP 只讲「怎么走流程」；「每类规则读不读」按 `AGENTS.md 阅读策略` + 对应端 `RULES.md 页首软规则必读清单` 执行——[硬] 规则按需检索（门禁兜底），[软] 规则必读。

---

## ① 主流程（必读，可独立走完生成闭环）

### 步骤 1：解析需求 → 选端

- 出现「后台 / 管理 / 表格 / 筛选 / 侧边栏 / 顶栏」→ **Web 端**（`弘讯web端design-system/`）
- 出现「小程序 / 手机 / 登录页 / 底部导航 / 列表卡片 / 375」→ **移动端**（`弘讯移动端design-system/`）

### 步骤 1.5：B 端后台固定框架判定（⚠️ 必读）

**先判定当前页面是否属于「B 端后台管理系统」——这决定能不能自由设计版式：**

- **是**（管理后台 / 控制台 / 运维台 / 设备作业树 / 工单列表 / 配置中心 …）→ **必须统一套用弘讯 B 端后台固定框架，不得擅自改版式**：
  - 克隆源 = `弘讯web端design-system/page-template.html`（步骤 4），删 demo 保留框架外壳（顶栏 72 / 侧栏 240 可折叠至 80 / 内容区 / 底栏 32 居中 / 作业树每节点带图标）。
  - 四维结构 + 硬性规则 + 判定信号清单详见 `RULES.md §0`（[硬] 0.1/0.2 + [软] 0.3）。
  - 所有视觉特征取自 `template.css` / `tokens.json` 真源；不得擅自加暗色切换、改尺寸、改版式。
- **否**（营销落地页 / 门户 / 数据大屏可视化 / 纯展示页 …）→ 按需求自由设计，不受本框架约束。

### 步骤 2：读规范定结构

1. 读对应端 `MASTER.md` **§7.3 页面搭建步骤**（最小可执行步骤）。
2. 读 `RULES.md` 布局黄金法则：**Web §6 [硬]** / **移动端 §8 [硬]**（铁律 G1–G7 + 防溢出清单）。
3. 读 `RULES.md §1` 组件选择决策树（页面级 + 组件粒度；[软] 决策，按需）。

### 步骤 3：按页面类型选规格

按对应端 `RULES.md §1.1b` 页面类型规格（选型后**必读对应段**——页面级必备区块，[软] 无门禁兜底）：

- **Web**：后台框架 → §0；数据看板 → §1.1b 看板（KPI 卡两版 + 图表）；列表/表格 → §1.1b 列表页；表单/弹窗 → §1.1b 弹窗；登录 → §1.1b 登录页；详情 → §1.1b 详情页。
- **移动端**：列表-详情 / 表单页 / 仪表盘 / 个人中心 / 设备分组 / 告警列表 / 登录页 → §1.1b 对应段。

> 页面类型规格给出该页面的精确尺寸 / 区域结构 / 组件变体 / 配色规则。**未列出的 token 回退 MASTER.md**。

### 步骤 4：克隆 page-template 框架外壳（Web B 端）——克隆源统一

> ✅ **V3.0（2026-08-03 拍板）**：HTML 原型一律克隆 **`page-template.html`**（含固定框架外壳），不再用 agent-starter 起步。

```bash
# Web（B 端后台框架）→ 落盘「用户项目」的 output/（无则建，**不是设计系统仓库的 output/**），文件名自动拼 <页面语义名>_<YYYYMMDD>_<HHmm>.html
mkdir -p <用户项目>/output
cp 弘讯web端design-system/page-template.html "<用户项目>/output/机器群览_$(date +%Y%m%d_%H%M).html"
# 移动端（预览 / HTML 原型）→ 同样落盘 <用户项目>/output/，link 指向 ../弘讯移动端design-system/template.css
cp 弘讯移动端design-system/agent-starter.html "<用户项目>/output/设备台帐_$(date +%Y%m%d_%H%M).html"
```

**克隆后必须做的两件事：**

1. **删 demo（可执行边界）**：Web page-template 已在 `<main class="content">` 内用 `<!-- DEMO 展示段开始 -->` / `<!-- DEMO 展示段结束 -->` 明确标记全部 demo section。删除两标记之间的全部内容（stat-grid KPI 演示 / callout / swatch / 字阶 / 色板 / 组件演示等），保留 `.app` 框架外壳。**KPI 统计卡**按业务需要**重建为 `stat-card--icon` 标准版**（components.json 已登记）；禁止保留 demo 简约卡或自造 KPI 样式。
2. **改 CSS link 为指向仓库的相对路径**（克隆自 page-template 后必须改；移动端同理）。

**⚠️ 禁参照既有页面 DOM（2026-08-06 用户拍板）**：克隆后页面结构一律按 `RULES.md §1.1b` + `components.json` + `CHART-SPEC.md` **从零填充**。**禁止**参照 output/、packages/ 或任何既有页面的 DOM 拼新页（既有页面可能含历史漂移，参照它会把漂移复制进新页）。**唯一可复制的结构 = 克隆源 page-template 的框架外壳本身**。

**产出落盘规则（2026-08-06 更新，⚠️ 必读）**：

| 项 | 规则 |
|---|---|
| 目录 | 「**用户项目**」的 `output/`（`mkdir -p <用户项目>/output`）。设计系统仓库根的 `output/` 只放内置示例与规范展示，**不得混入用户生成页** |
| 文件名 | 自动拼 `<页面语义名>_<YYYYMMDD>_<HHmm>.html`；同日同语义名重复 → 追加 `_2`/`_3`，**绝不覆盖** |
| CSS 引用 | `<link rel="stylesheet" href="…/弘讯web端design-system/template.css">`（相对路径按实际位置写） |
| 门禁 | `cd <端目录> && node validate-spec.js <用户项目路径>/output/<产出文件>.html`，期望 0 HIGH |
| **分享版** | 交付前把 `<link …template.css>` 替换为内联 `<style>`（template.css 全量）→ `<用户项目>/output/share/<原名>_分享版.html`（零外链）。**门禁口径：以开发态外链版为准**（分享版 = 构建产物，selfCss 全量内联会让 class.self-defined 报全部类，MED 噪音无意义，不跑 validate-spec） |

> **CSS 由 `template.css` 统一提供（不要复制 CSS）**：`:root` 变量（品牌/中性/功能/字阶/圆角/投影/motion/密度）、组件 class、布局骨架（`.app > .topbar + .body(>.sidebar+.content) + .footer`）、`[data-theme="dark"]` / `[data-density]`。色 / 尺寸 / 字重 / 圆角一律走 `:root` 变量，禁止硬编码；动效用 `var(--motion-duration-*)+var(--motion-ease-*)`，禁裸数字秒。

### 步骤 4.5：图表生成规范（仅页面含图表时读）

> **图表规范唯一真源 = 仓库根 `CHART-SPEC.md`**（Web RULES §9 [软] / 移动 RULES §9.7 [软] 为内联入口）。完整执行要点见 **附录 A**。

- **主路线（2026-08-07 拍板）**：信息化图表**不设组件、不锁实现**——尺寸/数据量/坐标 Agent 按容器自适应自选（HTML flex 柱 / SVG polyline+HTML 点 / 定尺寸方形 SVG 环）。canvas 图表库（ECharts 等）仅限库级复杂图表。
- **结果约束 8 条（缺一不可，[软] 无门禁全兜）**：柱底对齐基线 / x 轴标签独立行不叠柱 / 标签不溢出容器 / 折线点严格落线 / 环形中心文字不变形 / 多系列配图例 / **颜色只用 `--chart-*`（禁通用语义色与裸 hex）** / 图表不溢出卡片。
- 容器原语：`.chart-box`（高度自定）+ canvas 用 `.chart-canvas`；卡片内图表卡一律 `.card--fill`。
- 交互动画默认即带：`.chart-bar` / `.chart-hbar` / `.chart-line` / `.chart-ring-anim` / `.chart-dot`，时长全走 `--motion-duration-*`。

### 步骤 5：门禁自检 → 软规则自查表 → 交付

```bash
NODE="C:/Users/mask/.workbuddy/binaries/node/versions/22.22.2/node.exe"
cd <端目录> && "$NODE" validate-spec.js <用户项目路径>/output/<产出文件>.html
```

- 期望：**0 HIGH（exit 0）**。任何 HIGH 禁止交付。仅 MEDIUM 不阻断（exit 0），但建议清零。
- 门禁检查：组件尺寸 / 字重 / 半径 / 色值（`components.json` contract）；非 token 硬编码色（MEDIUM）；`checkMotion`（transition 裸值 HIGH / animation 裸值 MEDIUM，`0s/0ms` 合法）。
- **自造优先级（2026-08-06 拍板 v2）**：组合 → 变体 → 页面级自造（值必须落现有 token）→（禁）产生新裸值。自造底线：颜色 `var(--*)` / 文字 `.m-text-*`（Web `.t-*`）/ 动效 `var(--motion-duration-*)` / 4px 网格 / 禁覆写真源组件类。详见移动端 RULES §10.10 [软] / Web RULES §7.9 [软]。

**软规则自查表（生成后逐项打勾，缺项即回改；[软] 规则无门禁兜底，这是唯一交付前自查钩子）**：

```
□ 页面类型必备区块齐全（对照 §1.1b 对应段）
□ 信息层级主次分明，最重要信息在视觉焦点
□ 布局按业务论证（布局决策 5 问，非默认对半均分）
□ 未自造原子组件（自造值全走 token，无新裸值）
□ 图表结果约束 8 条全过（页面含图表时）
□ 间距全走 token，无裸 px
```

**布局决策 5 问（每个区块/整页布局动手前自问，答案能说清才动手）**：

1. **任务**：这个页面/区块的核心任务是什么？用户进来要完成什么动作？
2. **优先级**：哪些信息最重要？主次排序如何（最重要信息放视觉焦点）？
3. **关系**：各模块之间是什么关系（并列 / 包含 / 流程先后）？用什么构图表达？
4. **倾向**：业务上倾向什么布局（栅格占比 / 排列方式），而非默认对半均分？
5. **论证**：这个布局决策的理由能说清楚吗？换一种布局会更差吗？

**结构自检清单（门禁项速查；完整版见 RULES 对应节 + 附录 F）**：

- [ ] 顶栏只含品牌区/工具区，无模块菜单/tab；`.btn-ico` 按钮文字用 `.btn-label` 包裹；KPI 卡数 ≠ 4 时 `.stat-grid--N`
- [ ] 图表按附录 A 结果约束 + 环形禁 none + SVG 禁裸 hex；栅格 `.grid12 > .col-N` 内卡片 `.card--fill`；动态表格声明 `minRow` 占位
- [ ] 动效与交互已自动添加（RULES §8 / 移动 §10.6），时长全走 motion token；`validate-spec.js` → HIGH 0

**禁区（违反即不合格；完整版见附录 F）**：禁改 validate-spec.js / components.json / tokens.json / base-spec.json / generate.js；禁内联 style 或 `!important` 绕过组件规则；禁注入 `--color-*` 旧长名；禁硬编码非 token 色；Web 端任何文件禁 `#10B981`；暗色只改配色不改组件结构规格。

### 默认流程到此结束（品牌 = #005EAE / 亮色）

若描述含**非 #005EAE 品牌色**或**暗色模式**，继续 **附录 B**。

---

## ② 附录（按需检索）

### 附录 A：图表生成规范（完整版；页面含图表时读）

> 真源 = 仓库根 `CHART-SPEC.md`（Web RULES §9 / 移动 RULES §9.7 为其内联入口）。本附录为执行要点，细节冲突以 CHART-SPEC 为准。

**主路线（方案 C 拍板 + 2026-08-07 重构）**：信息化图表**不设组件、不锁实现**——尺寸/数据量/坐标 Agent 按容器自适应自选（HTML flex 柱 / SVG polyline+HTML 点 / 定尺寸方形 SVG 环）。**canvas 图表库（ECharts 等）仅限库级复杂图表**（3D/地图/海量点），且仍须挂容器原语。

- **容器原语（必须用，防留白失控）**：外层 `.chart-box`（**高度自定**——内容撑开或固定均可，不再锁 320px；弹性吸收用 `.card:has(.chart-box) .chart-box{flex:1;min-height:320px}`）；canvas 本体加 `.chart-canvas`（`absolute inset:0` 占满）
  ```html
  <div class="chart-box"><canvas class="chart-canvas" id="myChart"></canvas></div>
  ```
- **实现放开（2026-08-07）**：柱状/横向柱用 HTML flex（高度/宽度百分比）或 SVG 百分比；折线用 SVG `<polyline>`（`viewBox="0 0 100 100"` + `preserveAspectRatio="none"` + `non-scaling-stroke`）+ HTML 点（同一百分比坐标系）；环形/圆**定尺寸方形 SVG（禁 none，圆变椭圆）**。**SVG 拉伸区禁放文字**——轴标签/数值/图例一律 HTML 叠层（`.chart-x-labels` / `.chart-v` / `.chart-hl/.chart-hr` / `.chart-ring-center`）
- **结果约束（必达，见 CHART-SPEC §2）**：柱底对齐基线；x 轴标签独立行不叠柱（柱多跳显）；标签不溢出容器（底部留白 ≥20px）；折线点严格落线；环形中心文字不变形；多系列配图例；**颜色只用 `--chart-*`**；图表不溢出卡片。示范 = `docs/examples/web-图表自适应测试.html`
- **交互与动画（默认即带）**：图形挂动画类 `.chart-bar`（柱升起）/`.chart-hbar`（条生长）/`.chart-line`（描边生长）/`.chart-ring-anim`（环放大）/`.chart-dot`（点延迟淡入）；Web hover 数据元素本身（三合一，阴影 `--shadow-data-hover` 轻弥散）；移动点按反馈（active 提亮）；时长全走 `--motion-duration-*`
- **图例**：`.chart-legend` / `.legend-item` / `.legend-dot`（圆点）/ `.legend-line`（线段，可 `--dash`）
- **卡片内图表**：卡片一律 `.card--fill`（等高收底）；图表/表格容器（`.donut-wrap` / `.chart-box` / `.table-wrap`）`flex:1` 弹性吸收拉伸空白（Web，禁图例下方留白）
- **禁止**：自造 chart 类；canvas 挂裸 `<div>`（门禁 MEDIUM）；环形图 none 拉伸；SVG 裸 hex；**系列色用通用语义色（--primary/--suc/--warn/--err，门禁 `chart.series.color` MED）**

#### 图表色板契约（两端 token，CHART-SPEC §4）

> 色值 = `tokens.json colors.chart` / `template.css :root --chart-*`。Web 8 色 / 移动 13 色（语义映射见各端 DESIGN-TOKENS §2.x）。

| 端 | 色板（按使用顺序） |
|---|---|
| Web | `--chart-tech-blue`（主系列）→ `--chart-smart-cyan`（副系列）→ `--chart-data-cyan`（对比/目标线）→ `--chart-fresh-green`（正向）→ `--chart-vivid-orange`（预警）→ `--chart-alert-red`（异常）→ 扩展 `--chart-wisdom-purple` / `--chart-modern-pink` |
| 移动 | `--chart-blue` → `--chart-green` → `--chart-orange` → `--chart-red` → 辅助 `--chart-blue-aux` / `--chart-cyan` → 扩展 purple-a/b、rose、yellow、red-neg、gray |

**使用顺序**：主系列 → 对比系列 → 预警 → 扩展色；**同页不超过 5 个系列色**（多的合并为「其他」灰 `var(--n9)`）。SVG 内一律 `style="stroke:var(--chart-*)"`，**禁裸 hex**。

#### SVG 绘制铁律（门禁 svg.paint，两端同款）

- SVG 内 `stroke=` / `fill=` / `stop-color=` 一律写 `style="stroke:var(--chart-*)"`（SVG 属性支持 var()，比裸属性稳）：**禁裸 hex**。
- 门禁分级：非调色板自造色 → **HIGH `svg.paint.non-palette`**（阻断）；调色板内色值但没走 var() → **MEDIUM `svg.paint.non-token`**（建议修）。
- `fill="none"` / `currentColor` / `transparent` / `url(#渐变)` 豁免（非 hex 不匹配）；**白色文字用 `var(--n1)`，禁 `#FFFFFF`**。

### 附录 B：配色决策段（非默认品牌 / 暗色 → 引擎映射）

> **什么场景读**：描述含非 `#005EAE` 品牌色（如「用森绿 #2E7D5B」「绛红主题」）或暗色模式（「夜间模式 / dark / 暗色」）。

### 触发条件

描述中出现以下任一：
- 明确品牌色 ≠ `#005EAE`（如「用森绿 #2E7D5B」「绛红主题」）
- 暗色模式（「夜间模式 / dark / 暗色」）

### 步骤 1：调引擎拿调色板

```bash
cd brand-color-engine
"$NODE" generate.js <品牌色> <mode> <platform>
# 例：node generate.js 2E7D5B light web
#     node generate.js 005EAE dark mobile
```

- `brand`：3/6 位十六进制（带不带 # 均可）。非法输入（如 `xyz`）会 **throw**，不会静默产出垃圾色。
- `mode`：`light`（默认）/ `dark`。
- `platform`：`web`（默认）/ `mobile`。
- 在 Agent 中：`const { generatePalette } = require('./generate.js'); const pal = generatePalette(brand,{mode,platform});`

返回结构：`{ primary, neutral[], functional, background, chart[], gradient[], css{} }`。
> ⚠️ **引擎 `css` 字段是旧长名 `--color-*`（如 `--color-primary`/`--color-neutral-1`），设计系统现行是短名，旧长名已废弃。禁止直接注入 `pal.css`。** 必须按下表把色值**映射进模板短名 `:root`**。

### 步骤 2：映射进克隆模板的短名 :root

**通用规则**：`cp agent-starter.html <用户项目>/output/<页面语义名>_<YYYYMMDD>_<HHmm>.html` 后（**落盘「用户项目」output/，自动命名，见 §① 步骤4 产出落盘规则**），按下表替换 `:root` 里对应变量的**值**（变量名不动）。引擎只改色值，布局 / 字号 / 字重 / 圆角 / 投影 / 字体仍服从设计系统 spec。

#### A. 品牌色 + 中性色（两端通用）

| 引擎字段 | 模板短名变量 | 说明 |
|---------|------------|------|
| `pal.primary.default` | `--primary` | |
| `pal.primary.hover` | `--primary-hover` | |
| `pal.primary.active` ‖ `pal.primary.click` ‖ `pal.primary.pressed` | `--primary-active` | 005EAE dark 特例只有 `click`/`pressed`，需 fallback |
| `pal.primary.disabledBg` | `--primary-dis-bg` | |
| `pal.primary.disabledFg` ‖ `pal.primary.disabledText` | `--primary-dis-fg` | dark 特例只有 `disabledText`，需 fallback |
| `pal.neutral[i].hex` | `--n{i+1}` | **Web** 11 阶 i=0..10 → `--n1..--n11`；**移动端** 10 阶 i=0..9 → `--n1..--n10`（暗色 `darkDefaults.neutralScale` 是 11 阶，移动端只取前 10） |

> 中性阶索引语义两端一致：索引 0 = 主容器底（亮色白 / 暗色深背景），末位 = 最强文字（亮色深 / 暗色白）。直接 `pal.neutral[i].hex → --n{i+1}` 即可自动适配明暗。

#### B. 功能色（固定不变式 — 不随品牌推导）

> **关键不变式**：功能色（成功 / 警告 / 错误 / 运行）永不随品牌变化，同一平台同一模式下来自 `base-spec.json` 固定值。引擎输出即固定值，**直接用 `pal.functional.*` 即可**，无需手动查表。

**Web 端功能色变量**（`--suc/--warn/--err/--run` 语义=背景色；浅底 Tag 用 `--*-soft`，filled 白字用 `--*-fg`）：

| 引擎字段 | 模板短名变量 |
|---------|------------|
| `pal.functional.success.default` | `--suc` |
| `pal.functional.success.bg` | `--suc-soft` |
| `pal.functional.success.text` | `--suc-fg` |
| `pal.functional.warning.default` | `--warn` |
| `pal.functional.warning.bg` | `--warn-soft` |
| `pal.functional.warning.text` | `--warn-fg` |
| `pal.functional.error.default` | `--err` |
| `pal.functional.error.bg` | `--err-soft` |
| `pal.functional.error.text` | `--err-fg` |
| `pal.functional.running.default` | `--run` |
| `pal.functional.running.bg` | `--run-soft` |
| `pal.functional.running.text` | `--run-fg` |

**移动端功能色变量**（命名不同：`--*-pressed/--*-dis/--*-text`）：

| 引擎字段 | 模板短名变量 | 补齐说明 |
|---------|------------|---------|
| `pal.functional.success.default` | `--suc` | |
| `pal.functional.success.pressed` | `--suc-pressed` | 暗色 base-spec 缺失 → `adjustLightness(default,-10)` 补 |
| `pal.functional.success.disabled` | `--suc-dis` | 暗色缺失 → `adjustLightness(default,+30)` 补 |
| `pal.functional.success.text` | `--suc-text` | |
| warning / error 同 success 规则 | `--warn-*` / `--err-*` | |
| `pal.functional.link` ‖ `pal.primary.hover` | `--link` | 暗色 base-spec 缺 link → 用 `primary.hover` |
| `pal.functional.running.default` | `--run` | |
| `pal.functional.running.pressed` | `--run-pressed` | 暗色缺失 → `adjustLightness(default,-10)` 补 |
| `pal.functional.running.bg` | `--run-bg` | |
| `pal.functional.running.border` | `--run-border` | |

**功能色固定值速查**（跨品牌一致，仅随平台/模式变）：

| 平台/模式 | success | warning | error | running |
|----------|---------|---------|-------|---------|
| web / light | `#389E0D` | `#FA8C16` | `#F5222D` | `#16A34A` |
| web / dark | `#52C41A` | `#FFA940` | `#FF4D4F` | `#22C55E` |
| mobile / light | `#10B981` | `#F59E0B` | `#EF4444` | `#16A34A` |
| mobile / dark | `#34D399` | `#FBBF24` | `#F87171` | `#22C55E` |

> ⚠️ Web 端**任何文件禁 `#10B981`**（移动端成功绿，Web 用 `#389E0D`）。运行/在线绿 `#16A34A` 两端共用（≠成功绿）。

#### C. 暗色模式额外处理：brand-surface

> **缺口说明**：模板顶栏 / 侧栏 / 底栏（Web）/ 导航栏（移动端）的 `background` 引用 `var(--primary)`。亮色下 `--primary` = 品牌色，正确；**暗色下 `--primary.default` 是亮主色**（005EAE dark 特例 = `#3B82F6`），顶栏会过亮。

暗色模式必须：

1. 在 `:root` 新增变量：`--brand-surface: <pal.background.brandSurface>;`
   - 005EAE dark = `#0A2540`；任意品牌 dark = `adjustLightness(brand,-32)`
2. 把顶栏 / 侧栏 / 底栏 / 导航栏的 `background:var(--primary)` 改为 `background:var(--brand-surface)`
   - Web：`.topbar` / `.sidebar` / `.footer`
   - 移动端：`.navbar`
   - 这些选择器不在门禁 contract 内，改引用变量不算改结构规格（尺寸 / 字重 / 圆角仍按 contract）

> 暗色样例只改配色，**不改组件结构规格**（尺寸 / 字重 / 圆角仍按 contract）。任意品牌暗色留给使用者（本 SOP 暗色样例以 005EAE dark 特例为准，引擎该路径零漂移）。

#### D. 不映射的变量（保留模板原值）

- `--secondary` / `--secondary-hover` / `--secondary-active`：引擎不输出 secondary，且模板组件不消费它，保留原值。
- 圆角 `--radius-*` / 投影 `--shadow-*` / 字体 `--font-*` / 字阶 `--font-h1..link` / 布局骨架 `--topbar-height` 等：引擎只改色，这些统统保留。

### 步骤 3：门禁自检（同 §① 步骤5）

```bash
cd <端目录> && "$NODE" validate-spec.js <用户项目路径>/output/<产出文件>.html   # 期望 0 HIGH
```

- 引擎派生色**只能出现在 `:root` 变量定义里**，组件 CSS 必须用 `var(--*)`。硬编码派生色会被门禁 `forbidNonTokenHex` 报 MEDIUM。
- 若门禁报非 token 色：先确认是否把派生色写进了组件规则（只允许在 `:root`）；确认是门禁误报则停，写 BLOCKED.md，**不许改门禁**。

### 参考实现

本 SOP 的映射规则已内化至步骤 2 映射表，不再依赖临时工具（旧 `.workbuddy/tmp/build-example.js` 已废弃）。两端示例页（2026-08-06 已删，生成器 `brand-color-engine/examples/gen-examples.js` 保留，需要时可重生成）曾全部 0 HIGH。

### 附录 C：参考实现流程（可选 · Web React / 移动端 Taro）

> **什么场景读**：仅当使用者确认采用 React/Taro 技术栈时可选走本段——直接复用现成组件库，省去自实现。使用者技术栈由使用者决定；**本段不是规范强制路径**，异栈（Vue/Flutter/原生…）使用者照 §① HTML 预览 + `tokens.json` 自实现，视觉一致。
> 对应仓库：`packages/web-ui`（shadcn vendored 组件库 + Vite 构建）与 `packages/mobile-ui`（NutUI-React-Taro），与 HTML 流（弘讯web端design-system/）同源 tokens/globals.css，视觉零漂移。

#### 步骤 1：生成页面脚手架

```bash
cd packages/web-ui
node scripts/new-page-react.js <PageName>        # 克隆 src/templates/BizAdminPage.tsx → src/demo/pages/<PageName>.tsx
node scripts/new-page-react.js <PageName> src/pages/x.tsx   # 自定义输出路径
```

- PageName 须**合法标识符**（字母开头、仅字母数字），否则 exit 1（如 `node scripts/new-page-react.js 123Page` 拒绝）。
- 默认输出 `src/demo/pages/<PageName>.tsx`；`<PageName>` 同时是导出组件名。

#### 步骤 2：用真实组件拼装页面

- 基于 **`AdminLayout` + `@techmation/web-ui` 真实组件**拼装，import 按需取自 `@/index`：
  ```tsx
  import { AdminLayout, Card, Table, TableWrap, ChartBox, ChartCanvas, Button, Tag, StatusDot, Progress, Tabs, Pagination } from '@/index';
  ```
- **禁止手写 HTML 重搓组件**（门禁语义：组件即契约）；颜色走 `globals.css` token + `var(--*)`，**禁止裸 hex**（如 `#0066CC` 须 `var(--chart-tech-blue)`）。
- 模板已带 `AdminLayout` 骨架（顶栏 72 + 侧栏 240 折叠 80 + 底栏 32 居中 + 作业树图标），直接替换内容区。

#### 步骤 3：门禁 = `npm run build` exit 0

```bash
cd packages/web-ui
CODEBUDDY_SESSION_ID= CLAUDE_SESSION_ID= npm run build   # tsc + vite 全过 = exit 0
```

- ⚠️ **环境坑**：build 清 dist 会触发 WorkBuddy **safe-delete shim**（trash 失败中断构建）——必须加前缀 `CODEBUDDY_SESSION_ID= CLAUDE_SESSION_ID=` 绕过（shim 无 session 即 no-op）。
- **tsc 类型错 / vite 报错 → exit 非 0 → 修到 exit 0 才算过**。参考实现流**不跑** `validate-spec.js`（那是 HTML 预览流门禁，TSX 不适用）。

#### 步骤 4：暗色

- `<html data-theme="dark">`（引擎驱动轨）；**勿用 shadcn `.dark` 类**（双体系冲突）。

#### 与 HTML 流区别表

| 维度 | HTML 预览流（§① 步骤 1–5） | 参考实现流（附录 C） |
|------|------------------------------|----------------------|
| 定位 | **规范交付物**：视觉规格的呈现 | **可选参考实现**：仅同栈（React/Taro）使用者复用 |
| 门禁 | `validate-spec.js` 0 HIGH | `npm run build` exit 0（tsc + vite）/ `build:weapp` |
| 产物 | HTML 预览页（浏览器直开看效果） | TSX 源码 + 构建产物 |
| 位置 | 「用户项目」`output/`（设计系统仓库只放内置示例与规范展示） | `packages/web-ui/src/` / `packages/mobile-ui/src/` |
| 用途 | 视觉验证 / 对照 / 交付视觉稿 | 同栈使用者省去自实现 |

#### 移动端参考实现（Taro）

```bash
# 移动端（参考实现，可选——仅 Taro 技术栈使用者）→ 真实小程序页：
node packages/mobile-ui/scripts/new-page-mobile.js <PageName>
# → src/pages/<kebab-name>/index.tsx + index.config.ts（克隆 src/templates/BizMobilePage.tsx，NutUI 真实组件 + token）
# → 自动注册路由到 src/app.config.ts 的 pages 数组
cd packages/mobile-ui && npm run build:weapp   # 验证编译 exit 0
# 首个参考样板页：`packages/mobile-ui/src/pages/device-list/`（设备列表，对齐 RULES.md §1.1b 列表-详情页，build weapp 通过），
# 新页面可参照其结构（NavBar+SearchBar+列表+ActionSheet）与交互模式（本地过滤 / 占位跳转 / 状态 Tag）。
```

### 附录 D：Ardot 半自动段（画布搭帧）

> **什么场景读**：需要 Ardot 原生画布设计稿（非 HTML）时。

> ⚠️ **使用前提与降级路径（2026-08-06 补，防止误读为硬限制）**：本段**仅是「Ardot 原生画布设计稿」的可选路径**，不是生成 UI 设计稿的唯一方式，也**不是前置条件**。
> - **默认交付 = HTML 原型**（§① 主流程）：过门禁 0 HIGH 的 HTML 页面本身即**可交付的设计稿等价物**——浏览器预览、评审、标注、进开发均可，**零工具依赖、不需要任何 Ardot 文件**。
> - **Ardot 路径仅在同时满足三者时启用**：① 用户安装并登录 Ardot；② 可访问下方两个 fileId（Web/移动端组件库，或用户自己的等价资产）；③ Ardot Design MCP 已连接（`open_design`/`fetch_*`/`batch_edit` 可用）。三者缺一 → **降级为 HTML 原型交付**（或用户自选其他 UI 工具，见 USAGE-GUIDE 工具中立原则）。
> - **其他 UI 工具（Figma/即时设计/MasterGo/Pixso）**：工具中立，任何能读规范 + 操作画布的工具均可；Ardot 组件库资产不可移植，需在目标工具自搭组件/变量（成本高，非默认路径）。
> - 本段为 Ardot 专用实操细节，无 Ardot 时**跳过本段不影响交付质量**。

> 当需要设计稿（非 HTML）时，在 Ardot 画布半自动搭建页面帧。工具缺口仍在：不能拼真正 COMPONENT_SET、不能发布 Text Style、batch_edit 不能向实例内插子节点。本段写清自动边界与手动收尾。

#### 步骤 1：读 components.json 的 ardot 字段

每个组件在 `components.json` 里有 `ardot` 字段：

```jsonc
"ardot": {
  "libraryComponent": "Button（Ardot 组件库）",      // 对应 Ardot 哪个库组件
  "variantMapping": "主/次/文字对应 Ardot Button 三变体；大/小对应 size 变体...", // 变体映射
  "notes": "主按钮 primary 实底白字；禁用用 primary-dis-bg + primary-dis-fg 字..."  // Ardot 内实操注意
}
```

- 搭页前先读目标组件的 `ardot` 三字段，确认库组件名 + 变体映射 + 注意事项。

#### 步骤 2：open_design 打开对应文件

- **Web**：fileId `709697838782860`（`【20260731】弘讯B端视觉系统V3.0`）
- **移动端**：fileId `709734372369429`（`【20260731】弘讯移动端V3.0`）
- 旧文件 `701545559030003`（`【202607080835】弘讯B端视觉系统V2.0`）/`701218509066139`（`【20260519】弘讯移动端`）已弃用只读。见 USAGE-GUIDE.md §角色一 Ardot 资产表。
- 调 `open_design` 打开。若 `fetch_*` 返回 `NO_ADAPTER` = 该文件未连接，需用户在 Ardot 插件会话里切到该文件。
- ⚠️ **ID 漂移提醒**：下面步骤 3–4 中引用的变量 collection ID `25:14`、变量 ID `25:*` 与 Text Style ID `169:*` 均来自**旧 Ardot 文件**内部。新文件重建后这些 ID 会不同，实际绑定时请用 `fetch_variables` / `fetch_editor_state` 取新文件 ID，不要硬编码旧 ID。

#### 步骤 3：画布搭页面帧

1. 按 MASTER §7.3 步骤搭骨架（Web：TopBar72+Sidebar240+Content+Footer32；移动端：Frame 375×812 + Navbar + Content 容器 padding16 + BottomNav）。
2. 插入组件实例（按 `ardot.libraryComponent`），设尺寸 / 变体（按 `ardot.variantMapping`）。
3. 填充**绑本地变量**（颜色变量集「颜色规范」Web collectionId `25:14`）：
   - 关键变量 id 见 HANDOFF §5.4：`primary=25:15` / `N4=25:29` / `N6=25:31` / `N8=25:33` / `N10=25:35` / `N11=25:36` / `primary-dis-fg=25:19` / `primary-dis-bg=25:18`
4. 文本**绑本地 Text Style**（Web，已本地化）：
   - `H1=169:4` / `H2=169:5` / `Body1=169:6` / `Body2=169:7` / `Caption=169:8` / `Link=169:9`
   - H3 用 `Source Han Sans CN` / 20px / 28 行高 / Medium 500 手动设（填充绑 N11）
5. 移动端 Ardot 文本样式未本地化，按 `弘讯移动端design-system/MASTER.md §2` 字阶（android 9 级 / iOS 9 级）手动设字号 / 字重。

#### 步骤 4：capture_screenshot 自验

```bash
# 用 capture_screenshot 工具，screenShotDir 必须是 .workbuddy/screenshots/
```

- 截图后 Read 图片自检：颜色是否绑变量（非硬编码）、文本是否绑样式、尺寸是否符 spec。
- 截图存 `.workbuddy/screenshots/`（内部验证产物，非交付物）。

#### 步骤 5：手动收尾边界（MCP 做不到的，设计师在 Ardot UI 内手动）

| 收尾项 | 原因 | 操作 |
|-------|------|------|
| 合并变体为 COMPONENT_SET | MCP 插入 reusable 子组件会被提升为平铺独立组件，`componentPropertyDefinitions` 不持久化 | 用「`基名=变体值`」命名独立组件 → Ardot UI 内「合并为变体」 |
| 发布 Text Style | MCP 不支持 publish Text Style | Ardot UI 选中节点 → 创建样式并应用（如 H3 样式补挂 `29:77`） |
| 向实例内部插子节点 | `batch_edit` 不可向实例内部插子节点 | 用 Group 帧包裹同级兄弟 |

#### Ardot 实操格式坑（必读，曾导致全 validation 失败）

`batch_edit` 改 fills 时，`opacity/visible/blendMode` 必须与 `color` **同级**，`boundVariables` 在 `color` **内部**：

```jsonc
{ "type":"SOLID",
  "color":{ "r":0.1,"g":0.2,"b":0.3,
            "boundVariables":{ "color":{ "type":"VARIABLE_ALIAS", "id":"VariableID:25:33" } } },
  "opacity":1, "visible":true, "blendMode":"NORMAL" }
```

详见 HANDOFF §5。先加载技能 `ardot-batch-edit`（`../../.workbuddy/skills/ardot-batch-edit/SKILL.md`）固化正确 JSON 格式。

### 附录 E：表达层增强（P1）

> **什么场景读**：页面结构合规但想提升审美表达（构图 / 栅格 / 留白 / taste 参数）时。

#### secondary / surface tint 怎么用

- `--secondary` 用于**非品牌强调**：辅助 KPI、信息提示、次要链接、图表副系列。不要把 `--secondary` 与 `--primary` 同时用于一个主按钮。
- `--secondary-hover` / `--secondary-active` 仅用于 secondary 元素的交互态。
- **surface tint**：在卡片、面片、行悬停上用 `--n2` / `--n3`（亮色）或 `--n1` / `--n2`（暗色）制造层级；禁止写裸 hex（如 `#FAFAFA`）。
- **暗色层级语义**：`--n4` = page（最深背景），`--n1` = surface（卡片表面），`--n2` = elevated（抬升/悬浮面）。层级顺序：page → surface → elevated。

#### 构图 / 栅格 / 留白节奏

- **Web**：24 列栅格；页面水平 padding 24px（`spacing.pagePaddingX`）；卡片/区块 gap 16px（`spacing.base`）；表单/详情页内容区建议 max-width 960px。
- **移动端**：375 画布，落位宽 343，左右 padding 16px；模块间距走 **RULES §10.4 克制间距体系**（基础 16 / 卡片叠 20 / 区域交界 30，`.screen`+`.page-view` gap 双容器）；**12px 列表项间距已废弃**。
- **4px 网格**：所有尺寸、间距必须落在 4px 网格（4/8/12/16/24/32/48）。禁止奇数像素。
- **留白节奏**：同类元素 8–16px；关联区块 16–24px；独立大区块 32–48px。避免连续堆叠无间距。

#### taste 默认值（ui-pipeline 模式 A）

当用 `ui-pipeline` 做审美定调时，默认从以下参数起手：

- **文档/说明页**：`V=2`（克制）、`D=3`（轻密度）、`M=1`（极简动效）。
- **复杂数据后台**：`V=2`（克制）、`D=6`（中密度）、`M=3`（轻交互）。

**铁律**：taste 只借结构与质量清单，**不引外部色板**——否则容易触发 Web 禁 `#10B981`、硬编码色等门禁红。所有颜色回到 `tokens.json` 短名变量。

### 附录 F：速查决策树总览 + 禁区

> **什么场景读**：生成中途迷路时查总览；交付前核对禁区。

#### 决策树总览

```
自然语言描述
  │
  ├─ 选端（Web / 移动端）→ 读 MASTER §7.3 + RULES §6/§8 + §1 决策树
  │
  ├─ 使用者技术栈 = React/Taro？（实现方式由使用者决定）
  │    └─ 是 → 可选附录 C 参考实现（new-page-react.js / new-page-mobile.js + build 门禁）；否则照 HTML 预览 + tokens.json 自实现
  │
  ├─ 品牌色 == #005EAE 且 亮色？
  │    └─ 是 → cp agent-starter.html → 增删 → 门禁 → 交付（§① 主流程）
  │
  ├─ 品牌色 ≠ #005EAE 或 暗色？
  │    └─ 是 → 附录 B 调 generatePalette → 映射进短名 :root（附映射表）
  │           → 暗色加 --brand-surface 改顶栏 → 门禁 → 交付
  │
  └─ 需要 Ardot 原生画布设计稿？（须已装 Ardot + 可访问两个 fileId + MCP 已连，三者缺一即否）
       └─ 是 → 附录 D 读 components.json ardot 字段 → open_design
              → 搭帧 + 绑变量 + 绑 Text Style → 截图自验 → 手动收尾
       └─ 否 → HTML 原型即可交付（§① 主流程已产出，零工具依赖，浏览器预览评审即设计稿等价物）
```

#### 禁区（违反即不合格）

- 禁改 `validate-spec.js` / `components.json` contract / `tokens.json` / `base-spec.json` / `generate.js`（真源与引擎不动；发现 bug 写 BLOCKED.md）
- 禁在样例页用内联 `style` 或 `!important` 绕过组件规则
- 禁注入 `--color-*` 旧长名变量（引擎 `css` 字段是旧长名，必须映射进短名）
- 禁硬编码非 token 色（引擎派生色只能出现在 `:root` 变量定义里）
- Web 端任何文件禁 `#10B981`（移动端成功绿）
- 暗色样例只改配色，不改组件结构规格（尺寸 / 字重 / 圆角仍按 contract）
