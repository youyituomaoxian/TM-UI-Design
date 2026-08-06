# 信息化图表设计规范（CHART-SPEC.md）

> **真源章节（2026-08-06 建立）**：两端（Web / 移动）Agent 设计信息化图表的**唯一规范依据**。
> Web 端 RULES §9 与移动端 RULES §9.7 均为本章节的内联摘要/入口；GENERATION-SOP 步骤 4.5 图表段与本文对齐。
> 本文覆盖：通用决策流程（新图表类型自建）、已定范式、布局铁律、色彩契约、交互与动画、门禁口径、扩展指引。

---

## 0. 定位与原则

- **方案 C（拍板）**：信息化图表**不设组件**——SVG 复杂度在坐标系与文字布局，组件封装不了（折线图组件化后反复出现拉伸/压缩/文字不全/撑不满/变形）。**保留容器原语（`.chart-box`），图表内部 Agent 按原子自建**。
- **示范即规范**：已定范式见 Web 展示页 `#chart-demo` section（范式一~五）。新范式完成后回填本文 §2。
- **图表 ≠ 装饰**：默认带数据语义（标注/图例）、交互（悬停/点按反馈）、进入动画。
- **两端差异先看 §8**：hover（Web）vs 点按（移动）、`none` 拉伸（Web 折线/柱状）vs 定尺寸 1:1（移动，禁 none）、chart 色板数量（Web 8 / 移动 13）。

---

## 1. 通用决策流程（新图表类型自建 ⭐核心）

遇到范式未覆盖的图表类型时，**按顺序**走完 7 步，禁止跳步自造：

1. **查变体**：先确认现有范式能否变体表达——
   | 想画的 | 先试 | 示例 |
   |---|---|---|
   | 多系列对比 | 分组柱状（范式五）| 计划 vs 实际 |
   | 构成占比 | 环状图（范式四）多段 | 运行/待机/停机 |
   | 排名/对比 | 横向柱状（范式三）| 车间产能排名 |
   | 趋势 | 折线（范式一）| 产量趋势 |
   | 阶段累计 | 柱状（范式二）| 月度产量 |
   | 目标达成 | 环状图/仪表盘变体 | 达成率 |

2. **定坐标方式**（决定 viewBox 与拉伸策略）：
   - **横向铺开数据**（时间/类别轴）：Web → `viewBox 0 0 400 160`（2.5:1）+ `preserveAspectRatio="none"` + `.chart-svg--fill`；移动端 → 定尺寸 SVG（宽高=viewBox 值，**禁 none**，见 §8）
   - **圆形/比例数据**（占比/进度/仪表盘）：两端都**定尺寸正方形 SVG**（`width/height=viewBox 值`，居中，**禁 none**——圆会变椭圆）
   - 面积图 = 折线 + 闭合 fill；堆叠柱 = 柱状图每根拆多段，柱顶数值标合计

3. **文字层铁律**：**SVG 内禁放文字**（`preserveAspectRatio="none"` 拉伸会变形，`non-scaling-stroke` 只保线条保不住文字）——轴标签/数值/图例**一律 HTML 叠层**：
   - x 轴标签：`.chart-x-labels`（flex 等分，`span` 居中）
   - 柱顶/点旁数值：`.chart-v`（`left/top` 百分比绝对定位，`transform:translateX(-50%)` 居中）——**必须放在 `.chart-box` 内**（svg 之后、chart-box `</div>` 之前）；放 chart-box 外会失去定位参照（absolute 相对页面 → 数值漂浮固定，2026-08-06 实测事故，门禁 `chart.v.position` 拦截）
   - 横向柱状左右文字：`.chart-hl`（左标签）/ `.chart-hr`（右数值）
   - 环中心：`.chart-ring-center`（absolute 50%/50%）
   - 字号走 `.t-caption / .t-overline`（Web）/ `.m-text-*`（移动），**禁裸字号**

4. **数据标注跟随图形**：数值贴图形末端（柱顶 ≥6px、横向条端 `left=(条起点+条宽)/宽×100%+2%`、折线点旁），**不固定容器边缘**（实测固定右缘 → 数值与图形脱节）。

5. **交互（§6）**：Web → hover 数据元素本身（三合一反馈）；移动 → 点按段/元素显示数据（环状分段 hover 的移动对应物）。

6. **动画（§6）**：挂真源动画类（`.chart-bar` 升起 / `.chart-hbar` 生长 / `.chart-line` 描边 / `.chart-ring-anim` 放大 / 数据点 `.chart-dot` 延迟出现），时长全走 `--motion-duration-*`。

7. **自检**：过两端门禁（§7）+ §3 布局铁律逐项核对；新范式在展示页加演示段后回填本文 §2。

---

## 2. 已定范式（Web 展示页 #chart-demo 为实物参照）

| 范式 | 图型 | viewBox | preserveAspectRatio | 关键约束 |
|---|---|---|---|---|
| 一 | 折线图 | `0 0 400 160` | `none` + `.chart-svg--fill` | 数据点 ≥8 个（演示 12 月）、网格横线 ≥4 条、数据点 `.chart-dot` 坐标=折线顶点 |

> **§2 折线图五要素（2026-08-06 事故复盘，必读）**：折线图**缺一不可**——① `<g class="chart-grid">` 横向网格线（≥4 条，浅色）② `<polyline>` 折线（`stroke` 用真源 `--chart-*` token，**禁未定义变量**——`--chart-smart-blue` 事故：stroke 失效 → 折线不可见只剩数据点）③ `.chart-dot` 数据点（坐标 = 折线顶点）④ `.chart-x-labels` 横轴标签 ⑤ `.chart-legend` 图例。示例页 2026-08-06 曾缺 ①④⑤ + ②token 错 → 视觉只剩点。门禁 `token.svg-var`（SVG 属性未定义变量）+ `chart.container.missing` 已拦截。
| 二 | 柱状图 | `0 0 400 160` | 同上 | 柱底对齐最下网格线（基线）、柱顶数值必标（`.chart-v`）、柱宽与 gap 使数据区左右对称 |

> **§2 柱状图必备要素（2026-08-06 事故复盘，必读）**：柱状图**缺一不可**——① `<g class="chart-grid">` 横向网格线（≥4 条，浅色）② `.chart-bar` 柱子（`fill` 用真源 `--chart-*` token）③ **`.chart-v` 柱顶数值标签**（每根柱上方，`left`=柱中心 x 比例、`top`=柱顶 y 比例，数值=柱高）④ `.chart-x-labels` 横轴标签 ⑤ `.chart-legend` 图例。示例页 2026-08-06 曾缺 ①③ → 视觉只有柱子没有分割线和数据。写柱状图先对照展示页「柱状图 · Bar（范式二）」示范。
> **§2 柱状图三对齐（2026-08-06 用户复检，必读）**：① **柱底 = 最下网格线基线**（`rect.y + rect.height` 必须等于 grid 最下横向线的 y——示例页曾柱底 152 ≠ 基线 145；门禁 `chart.baseline.align` HIGH 已拦截）② **柱区左右对称居中**（首柱 x 与末柱右缘相对数据区中心对称——示例页曾 30~310 左偏；数据区 `20~380` 中心 200，柱区应对称于 200）③ **`.chart-v` 数值与柱左右居中（left = 柱中心 x%）且在柱顶上方（top 略小于柱顶 y%）**——示例页曾 top=柱顶 y 数值压柱顶。写柱状图三对齐都要满足。
| 三 | 横向柱状图 | `0 0 400 160` | 同上 | 条起点 x=40（宽 10%）、标签贴条（与条起点间距 ≤8px）、条高 ≥12px、数值贴条端（**两端差异见 §2 下注**）|
| 四 | 环状图 | `0 0 260 260` 定尺寸 | **不设**（禁 none）| 环居中（`.chart-box--ring` flex）、中心常显主段数值、悬停分段显示对应段数值（Web）|
| 五 | 分组柱状图 | `0 0 400 160` | `none` + `.chart-svg--fill` | 每组 N 根柱双色系列、组内 gap ≥6px / 组间 gap ≥14px、柱顶数值必标、图例注明系列 |

> **§2 下注 · 横向柱状图两端差异（2026-08-06 明确，防跨端照搬）**：
> - **Web**：数值在**条外右端**（`.chart-hr`，`left=(条起点+条宽)/宽×100% + 2%`，深色字 n9）；标签在条左（`.chart-hl`）。
> - **移动**：数值在**条内右端白字**（`.chart-hr--onbar`，`left=(条起点+条宽−22)/宽×100%`，条用全色 `--chart-*` 保证白字对比）；移动无底部 X 轴标签区（类别在左），viewBoxH = 绘图区 + 底留 ≥10（无标签区公式）。
> - 共通：条起点后标签区宽度 ≤ 10%（Web）/ 44px（移动 3 字标签），标签与条起点间距 ≤8px。

---

## 3. 布局铁律（两端通用，血泪教训背书）

- **图表左右对称（间距系统铁律）**：数据区左右边距必须一致——数据 x 起点/终点对称、网格线 x1/x2 对称；**禁一侧贴边一侧留大**（实测 x 30-360 → 左 30 右 40 不对称）。内边距按间距规范选值（Web 演示 8-12 单位 ≈ 20-30px），**不是简单居中就行**。
- **内容 x ≤ viewBox 宽 − 20**（防拉伸后 padding 裁切）——网格线也收至宽−20；移动端同（§9.7「右侧边距」）。
- **纵向占满 + 对称**：数据 y 范围中心对齐网格中心，上下留白对称；数据集中中间一条带 = 不达标（实测折线 66-120 集中中段，改 30-140 后中心对齐）。
- **柱底对齐基线**：柱底必须落在最下网格线（基线）上，底部留空 ≤15px——柱底悬空无基线 = 漂移。
- **最下网格线与轴标签纵向间距 ≥20px**（Web 折线/柱状演示 y=150 标签 y=152+）；移动端**纵向三段式**（绘图区 + 标签保护区 ≥8px + 标签区 ≥16px，见 §8）。
- **数据密度**：折线 ≥8 点、网格横线 ≥4 条、柱状图 12 根（Web 演示）——数据稀疏/网格过疏视为不达标。
- **禁衬线字体**：中文一律 `--font-cn`（黑体系）——**中文禁挂 `--font-mono`**（等宽无中文字形回退宋体衬线，实测横向柱状图标签）；数字/百分比可用 `--font-mono`。
- **禁图表卡拉伸空白**：Web `card--fill` 列拉伸由图表区弹性吸收（`.card:has(.chart-box) .chart-box{flex:1;min-height:320px}`），**不加摘要行填充**（拍板：图表卡不强制加摘要）。

---

## 4. 色彩契约

- 图表色一律 `--chart-*` token：Web 8 色（tech-blue/data-cyan/smart-cyan/fresh-green/vivid-orange/alert-red/wisdom-purple/modern-pink）、移动 13 色（chart-blue/green/orange/red/blue-aux/green-growth/yellow/red-neg/purple-a/purple-b/cyan/rose/gray，语义见移动 DESIGN-TOKENS §2.3）；功能强调用 primary/warn/err。
- **同页 ≤5 个系列色**；使用顺序：主系列 → 对比系列 → 预警 → 扩展色。
- **同系列数据色统一**：同一数据系列柱/条/线一律同色（禁最高值强调色）；分组柱状图两系列用两色区分。
- SVG 内 `stroke=`/`fill=`/`stop-color=` 一律 `style="stroke:var(--chart-*)"`（SVG 属性支持 var()，比裸属性稳）；**禁裸 hex**（门禁 `svg.paint.non-palette` HIGH）。
- **SVG 属性 var() 必须是真源已定义的 token（2026-08-06 新增，必读）**：`stroke="var(--chart-smart-blue)"` 这类**用了真源不存在的变量名**（Web 真源是 `--chart-tech-blue / --chart-smart-cyan / --chart-data-cyan / --chart-fresh-green / --chart-vivid-orange / --chart-alert-red / --chart-wisdom-purple / --chart-modern-pink`——**无 --chart-smart-blue**）→ 该声明在浏览器整条失效 → **折线/柱/环 stroke/fill 不可见（只剩数据点）**。写 SVG 属性 var 前先对照本表；门禁 `token.svg-var` HIGH 已拦截（2026-08-06 事故复盘：示例页折线图 stroke 用 --chart-smart-blue → 折线消失只剩点）。
- 图例用 `.chart-legend` / `.legend-item` + `.legend-dot`（圆点）/ `.legend-line`（线段，可 `--dash`）。
- **暗色（2026-08-06 联动 DARK-MODE.md）**：两端 dark 段不重定义 `--chart-*`（沿用亮色，语义跨模式稳定）；暗底上**禁深色系作主系列线/描边**（Web `--chart-tech-blue` / 移动 `--chart-blue-aux` `--chart-green-growth`，对比 <3:1）——主系列优先亮系（Web data-cyan/fresh-green/vivid-orange/alert-red；移动 cyan/orange/red/rose/purple-a）；图表文字走 n 级文字 token，不引 chart 色作文字。明细见 DARK-MODE.md「图表色 chart」节。

---

## 5. 交互与动画（所有信息化图表默认即带）

- **Web hover（目标是数据元素本身，非整卡）**：柱/条上浮 2px + `brightness(1.12)` + drop-shadow；数据点放大 1.7×；折线加粗 3.5；环段微膨胀 1.04×——均走 fast token。**禁整卡 hover 浮起**（图表卡不再悬浮，2026-08-06 拍板）。
  - 注意：柱/条进入动画 fill-mode 用 `backwards`（`both` 会锁死 transform 挡住 hover 上浮）。
- **悬停阴影层级**：一律 `drop-shadow(var(--shadow-data-hover))`（`0 1px 2px rgba(0,0,0,.15)` 单阴影，card/row-hover 级轻弥散）——**禁 float/modal 级**（弥散过大不贴合小元素）。
- **环状图分段数据**：中心常显主段数值，悬停环段切换为对应段数值（Web，`:has(.ring-seg--x:hover)`）；**移动端点按段**显示对应数值（`touch` 事件），默认态常显主段。
- **数据点延迟出现**（`.chart-dot` `animation-delay: var(--motion-duration-slow)`，线画完才淡入）——防「点漂移」错位。
- 时长一律 `--motion-duration-*` token（门禁 checkMotion：transition 裸值 HIGH / animation 裸值 MED）。
- 动画类（真源默认，Agent 给图形元素挂类即得）：`.chart-bar` / `.chart-hbar` / `.chart-line` / `.chart-ring-anim` / `.chart-dot`。

---

## 6. 移动端差异（Web §2-5 的移动对应物）

- **坐标**：**禁 `preserveAspectRatio="none"`**（定尺寸 1:1，`.chart-svg` 宽高 100% 匹配 `chart-box` 高度 = viewBoxH）——移动图表是固定设计宽度，拉伸会变形。
- **viewBox 宽 = 容器内容宽**（屏 375 − 卡片 padding 16×2 ≈ 340-343），**1:1 无缩放**（viewBox 宽与容器宽差 ≤1%）；高度按纵向三段式公式。
- **内边距换算（防硬套 Web ⚠️）**：移动端 1 viewBox 单位 ≈ 1px 屏幕（1:1），Web 1 单位 ≈ 2.5px（400 → ~1000px 容器）。**移动图表数据区左右内边距 = 移动间距 token（16px `--space-base` 级，即 viewBox 16 单位）**——禁套 Web 的「8-20 单位」口径（会放大 2.5×，实测 44 单位 → 50px 屏幕空白）。
- **坐标模型（HTML 标签层优先，2026-08-06 修正）**：X 轴标签一律 HTML 层放**容器外**（`.chart-x-labels`，`margin-top` 4px）——viewBox 内**不再预留标签区**（否则「基线到标签 40px 过远」，实测柱底 117 + viewBoxH 140 + 容器外 4px）：
  - `viewBoxH = 绘图区高 + 底部余量 ≥10 单位`（4px 网格取整）；柱底/折线最低点 `y+height ≤ viewBoxH − 10`
  - 基线（最下网格线）贴近 viewBox 底（底留 10）→ 标签与基线视觉间距 ≈ 14px（10 + margin 4），与 Web 观感一致
  - 柱顶数值 `.chart-v` 用 `translate(-50%,-100%)` **底部对齐锚点**（锚点 = 柱顶上方 8 单位），防数值压柱体（实测 1:1 下 8 单位 < 文字高 17px，顶部对齐会压柱）
  - 网格线/目标线全在绘图区内（基线之上）
  - `chart-box` 高度与 viewBoxH 一致（1:1 不缩放）
  - 注：§9.7「SVG 内三段式（标签基线 y=viewBoxH−6、柱底 ≤ viewBoxH−23）」为 SVG 内文字场景的旧模型，**HTML 标签层方案下不适用**（二者选一，推荐 HTML 层）
- **字号（防硬套 Web）**：移动图表文字走**移动字阶**（`.m-text-caption` 12px / label 12px / num mono 12px）——**禁 Web 的 11px overline 档**（移动字阶无 11 档）；标签密度按移动屏宽（343px / 标签宽度 ≥ 32px 间距），**不照搬 Web 的 12 标签**（移动 8 根柱配 8 标签可，但更窄时每 2 根柱标 1 个亦可）。
- **交互**：无 hover → 环状分段/数据标注用**点按**（`touchstart` 切换，点按段显示该段数值，点空白恢复主段）；图形元素点按反馈（`active` 提亮）。
- **动画**：与 Web 同款动画类（时长走 token）；进入动画可省略（弱网/性能，但点按反馈保留）。
- **原子类**：`.chart-box`（180px）/ `.chart-svg` / `.chart-grid` / `.chart-x-labels` / `.chart-v` / `.chart-hl` / `.chart-hr` / `.chart-ring-center` / `.chart-ring-svg` / `.chart-legend` / `.legend-item` / `.legend-line`（可 `--dash`）/ `.chart-dot` / 动画类——已入移动 template.css（2026-08-06 落地）。

### 6.1 折线卡标准结构（对齐展示页 2026-08-06，Agent 生成折线卡照抄此结构）
- **卡片**：`.mcard`（mcard-head：标题 + `.mtag-sm .mtag-neutral`「tap 数据点」提示；mcard-body 承载图表）。
- **层级**：`mcard-body > chart-box.chart-box--sm(120px) > svg.chart-svg`，**`chart-x-labels` 与 `chart-legend` 都在 chart-box 外**（mcard-body 直接子，防定高容器溢出——实测放 box 内星期文字溢出）。
- **SVG**：`viewBox="0 0 340 120"` + `preserveAspectRatio="xMidYMid meet"`（禁 none，1:1 不拉伸）；`class="chart-svg"`（非 --fill）。
- **网格/目标线**：4 条水平网格线（y=20/50/80/110，`stroke="var(--n4)"` width 1，x 16→324）+ **目标线**（y=62，`stroke="var(--warn)"` width 1 `stroke-dasharray="4 4"`）。
- **折线**：`<polyline class="chart-line" fill="none" style="stroke:var(--chart-blue)" stroke-width="2" points="16,25 …324,65">`——**stroke 必须用 `style` 内联**（`stroke=` 属性会与 `.chart-line` 类动画冲突，实测折线不显示）；points 左右留 16 边距（16→324）。
- **数据点**：`<circle class="chart-dot" data-val="产量 28" cx cy r="3.5" style="fill:var(--chart-blue)">`——data-val 供附录 A 点按浮层用。
- **图例**：`chart-legend`（`.legend-line` 蓝实线「日产量」+ `.legend-line.legend-line--dash` warn「目标线」）。
- **动画/交互**：折线生长 + 圆点进入（真源类）；点按浮层用附录 A 脚本。

---

## 7. 门禁口径（两端 validate-spec.js）

| 检查 | Web | 移动 |
|---|---|---|
| `chart.container.missing`（canvas 未挂 .chart-box）| MEDIUM | MEDIUM（同）|
| `svg.paint.non-palette`（SVG 裸 hex 自造色）| HIGH | HIGH（已有）|
| `svg.paint.non-token`（调色板内但裸 hex）| MEDIUM | MEDIUM（已有）|
| `chart.svg.fill`（chart-svg 带 meet 撑不满）| MEDIUM | **移动版：chart-svg 带 `none` → MEDIUM（禁拉伸变形）** |
| `chart.svg.viewbox-edge`（内容 x 贴 viewBox 右缘）| MEDIUM | MEDIUM（同，x ≤ 宽−20）|
| `chart.text.inline`（SVG 内 `<text>`）| MEDIUM | MEDIUM（同，2026-08-06 补）|
| `chart.symmetry`（网格线 x1+x2=W / 柱与折线数据区左右对称）| MEDIUM | MEDIUM（同，2026-08-06 补）|
| `chart.baseline`（柱底对齐最下网格线，差 ≤2）| MEDIUM | MEDIUM（同，2026-08-06 补）|

---

## 附录 A：移动端点按交互脚本（2026-08-06 沉淀，Agent 生成图表页时复制）

> 移动端无 hover，图表交互 = 点按。以下脚本为展示页实测通过的完整实现（v5 委托版），复制到页面 `<script>` 即可；依赖原子类已入移动 template.css（`.chart-bar--active` / `.chart-hbar--active` / `.chart-dot--active` / `.chart-tip`）。

**接入要求**：
- 数据元素挂类：柱/条 `.chart-bar` / `.chart-hbar`、数据点 `.chart-dot`、环状段 `.chart-ring-seg`（带 `data-val="70% 运行"`）
- 环状中心容器 `.chart-ring-center`（默认内容 + `data-default` 属性存恢复 HTML）
- 数值浮层 `.chart-tip` 由脚本动态生成（柱 → 「产能 值」、点 → data-val）

**交互语义**：点数据元素 → 选中高亮 + 数值浮层；**再点同一元素 → 取消（返回原始状态）**；点其他元素 → 切换；点空白/其他图表卡 → 全部清除。

```html
<script>
(function () {
  /* 图表点按交互（CHART-SPEC 附录 A）：点数据元素选中+数值浮层；再点取消；点空白/他卡清除 */
  document.querySelectorAll('.chart-box').forEach(function (box) {
    function clearSel() {
      var els = box.querySelectorAll('.chart-bar, .chart-hbar, .chart-dot');
      for (var i = 0; i < els.length; i++) {
        els[i].classList.remove('chart-bar--active');
        els[i].classList.remove('chart-hbar--active');
        els[i].classList.remove('chart-dot--active');
      }
      removeTip(box);
    }
    box.addEventListener('click', function (e) {
      var el = e.target && e.target.closest ? e.target.closest('.chart-bar, .chart-hbar, .chart-dot, .chart-ring-seg') : null;
      if (!el || !box.contains(el)) {
        var c0 = box.querySelector('.chart-ring-center');
        if (c0 && c0.getAttribute('data-default')) c0.innerHTML = c0.getAttribute('data-default');
        clearSel();
        return;
      }
      e.stopPropagation();
      if (el.classList.contains('chart-ring-seg')) {
        var c = box.querySelector('.chart-ring-center');
        if (c) {
          var p = (el.getAttribute('data-val') || '').split(' ');
          c.innerHTML = '<span class="m-num-lg">' + p[0] + '</span><span class="m-text-caption">' + (p[1] || '') + '</span>';
        }
        return;
      }
      var isActive = el.classList.contains('chart-bar--active') || el.classList.contains('chart-hbar--active') || el.classList.contains('chart-dot--active');
      clearSel();
      if (!isActive) {
        var act = el.classList.contains('chart-dot') ? 'chart-dot--active' : (el.classList.contains('chart-hbar') ? 'chart-hbar--active' : 'chart-bar--active');
        el.classList.add(act);
        showTip(box, el);
      }
    });
  });
  document.addEventListener('click', function (e) {
    var cur = e.target && e.target.closest ? e.target.closest('.chart-box') : null;
    document.querySelectorAll('.chart-box').forEach(function (b) {
      if (b === cur) return;
      var els = b.querySelectorAll('.chart-bar, .chart-hbar, .chart-dot');
      for (var i = 0; i < els.length; i++) {
        els[i].classList.remove('chart-bar--active');
        els[i].classList.remove('chart-hbar--active');
        els[i].classList.remove('chart-dot--active');
      }
      removeTip(b);
      var c = b.querySelector('.chart-ring-center');
      if (c && c.getAttribute('data-default')) c.innerHTML = c.getAttribute('data-default');
    });
  });
  function showTip(box, el) {
    var svg = box.querySelector('svg');
    if (!svg) return;
    var vb = svg.viewBox.baseVal;
    removeTip(box);
    var tip = document.createElement('div');
    tip.className = 'chart-tip';
    if (el.tagName === 'rect') {
      tip.style.left = ((el.x.baseVal.value + el.width.baseVal.value / 2) / vb.width * 100) + '%';
      tip.style.top = Math.max((el.y.baseVal.value - 10) / vb.height * 100, 2) + '%';
      tip.textContent = '产能 ' + Math.round(el.height.baseVal.value);
    } else if (el.tagName === 'circle') {
      tip.style.left = (el.cx.baseVal.value / vb.width * 100) + '%';
      tip.style.top = Math.max((el.cy.baseVal.value - 16) / vb.height * 100, 2) + '%';
      tip.textContent = el.getAttribute('data-val') || '';
    }
    box.appendChild(tip);
  }
  function removeTip(box) {
    var t = box.querySelector('.chart-tip');
    if (t) t.remove();
  }
})();
</script>
```

**血泪记录（2026-08-06）**：初版用 `el.classList.remove.apply(el.classList, ACT)` 在 click 事件上下文内**静默失效**（add 正常、remove 无声失败，headless 自动点击实测定位）——**必须逐个元素、逐个类名直接 remove**，勿用 apply/逗号选择器「优化」回去。

---

## 8. 扩展类型指引（未来范式，按 §1 流程自建后回填）

- **雷达图**：多维度对比——定尺寸正方形 SVG（禁 none），Web 可用 `.chart-svg--fill` 容器等比；网格 = 同心多边形，维度标签 HTML 环绕。
- **面积图**：折线 + 底部闭合 `fill`（`fill-opacity ≤ .15` + 同色描边）；沿用范式一坐标。
- **堆叠柱状图**：范式二变体——每根柱拆 N 段（分段间同色系深浅或 chart 色序），柱顶数值 = 合计。
- **仪表盘 Gauge**：环状图变体——半环/270° 弧，指针或弧长表达进度，中心数值常显 + hover/点按显示明细。
- **散点/气泡**：双轴数值——沿用范式一网格，点 = `.chart-dot` 复用 hover 交互。
- **KPI 迷你趋势线（sparkline）**：小尺寸折线（viewBox 等比收缩），无轴无网格，数值走 `.chart-v` 单值。
- 完成后：展示页 `#chart-demo` 加演示段 → 回填 §2 表格 → 标注日期与血泪教训。

## 9. 待办计划（2026-08-06 复盘登记，未执行）

> 以下为复盘确认的缺口，按优先级登记待排期（**本期未执行**，避免范围失控）。

- **P2-A 图表空态/加载态/数据源**：无数据占位、加载骨架、异步渲染规范（B 端图表迟早接 API）。
- **P2-B 无障碍**：图例/数值对比度达标、aria-label 体系化。
- **P2-C KPI 迷你趋势（sparkline）**：§8 已提未给范式（viewBox 等比收缩 + 单值标注）。
- **P2-D ECharts 边界阈值**：「仅限库级复杂图表」无量化（多少数据点/什么类型才够格走 canvas 库）。
- **P2-E 交互回归测试固化**：本次 headless 自动点击验证（发现 `remove.apply` 问题）是临时脚本，建议固化为 `ci-chart-interaction.js` 进 ci-local。
- **P2-F 两端 chart token 命名统一**：Web `--chart-tech-blue/data-cyan` vs 移动 `--chart-blue/cyan` 分裂，跨端复用成本高（涉及两端 token 体系，需拍板）。

---

> 最后更新: 2026-08-06 | CHART-SPEC 建立（方案 A 落地：Web §9 + 移动 §9.7 + SOP §4.5 统一到本文）
