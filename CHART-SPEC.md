# 信息化图表设计规范（CHART-SPEC.md）

> **真源章节（2026-08-06 建立 · 2026-08-07 重构为「样式 + 结果约束」）**：两端（Web / 移动）Agent 设计信息化图表的**唯一规范依据**。
> Web 端 RULES §9 与移动端 RULES §9.7 均为本章节的内联摘要/入口；GENERATION-SOP 步骤 4.5 图表段与本文对齐。
> 本文覆盖：通用决策流程、结果约束清单、布局铁律、色彩契约、交互与动画、门禁口径、扩展指引。

---

## 0. 定位与原则

- **方案 C（拍板）+ 2026-08-07 重构**：信息化图表**不设组件**、**不锁实现**——尺寸、数据量、实现方式（HTML flex / SVG 百分比 / 混合）**全放开，由 Agent 按容器自适应自选**；规范只约束「样式（token）」与「必须达成的画法结果（结果约束）」。
- **示范即规范**：实物参照 = Web 展示页 `#chart-demo` section（范式一~五）——多类型×多尺寸自适应示范，识图全过（`docs/examples/web-图表自适应测试.html` 测试文件已不在工作区，勿引用）。
- **图表 ≠ 装饰**：默认带数据语义（标注/图例）、交互（悬停/点按反馈）、进入动画。
- **两端差异先看 §6**：hover（Web）vs 点按（移动）；Web 8 色 / 移动 13 色 chart 色板。

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

2. **定实现方式（Agent 自选，2026-08-07 放开）**：
   - 柱状/横向柱：**HTML flex 柱/条**（高度/宽度百分比）天然自适应——或 SVG 百分比坐标；
   - 折线：**SVG `<polyline>` 画线（`viewBox="0 0 100 100"` + `preserveAspectRatio="none"` + `vector-effect="non-scaling-stroke"` 线宽恒定）+ HTML 点**（点与线**同一百分比坐标系** → 点严格落线、正圆不变形）——或全 SVG；
   - 环形/圆：**定尺寸正方形 SVG**（`width/height=viewBox 值`，居中，**禁 none**——圆会变椭圆）；中心文字 HTML 绝对定位（`transform:translate(-50%,-50%)`）不变形；
   - 面积图 = 折线 + 闭合 fill；堆叠柱 = 柱状图每根拆多段，柱顶数值标合计。
   - **禁裸 hex 色**（门禁 `svg.paint.non-palette` HIGH）；**禁未定义 var**（门禁 `token.svg-var` HIGH）。

3. **文字层铁律**：**SVG 内禁放文字**（`preserveAspectRatio="none"` 拉伸会变形）——轴标签/数值/图例**一律 HTML 叠层**：
   - x 轴标签：**独立标签行**（flex 等分，与柱子同列宽对齐）——**禁止标签作为柱子子级定位**（2026-08-07 实测：标签挂柱内 absolute 叠柱底）；
   - 柱顶/点旁数值：绝对定位（`left/top` 百分比 + `translateX(-50%)` 或 flex 排列），**必须在图表容器内**（放容器外失去定位参照 → 数值漂浮固定，2026-08-06 实测事故）；
   - 环中心：absolute 50%/50%；
   - 字号走 `.t-caption / .t-overline`（Web）/ `.m-text-*`（移动），**禁裸字号**。

4. **数据标注跟随图形**：数值贴图形末端（柱顶 ≥6px、横向条端、折线点旁），**不固定容器边缘**（实测固定右缘 → 数值与图形脱节）。

5. **交互（§5）**：Web → hover 数据元素本身（三合一反馈）；移动 → 点按段/元素显示数据。

6. **动画（§5）**：挂真源动画类（`.chart-bar` 升起 / `.chart-hbar` 生长 / `.chart-line` 描边 / `.chart-ring-anim` 放大 / 数据点 `.chart-dot` 延迟出现），时长全走 `--motion-duration-*`。

7. **自检**：过两端门禁（§7）+ §2 结果约束清单逐项核对；新范式在展示页加演示段后回填本文 §2。

---

## 2. 已定范式 + 结果约束清单（2026-08-07 重构，替代固定尺寸/数据量断言）

> **范式只定「图型 + 必须达成的结果」，尺寸/数据量/坐标 Agent 按容器自定。**

| 范式 | 图型 | 结果约束（必须全部达成） |
|---|---|---|
| 一 | 折线图 | 折线连贯；**数据点严格落在线上**（点与线同一百分比坐标系）；点正圆不变形；网格横线 ≥4 条浅色；x 轴标签行；图例；多系列必配图例 |
| 二 | 柱状图 | **柱底对齐基线**（flex 容器 `align-items:flex-end` + 基线）；柱区左右对称；**x 轴标签独立行与柱同列宽对齐、不叠柱**；柱顶数值必标（柱上方居中）；柱多时 x 标签**跳显**（柱宽不足间隔显示，不重叠） |
| 三 | 横向柱状图 | 条长百分比（容器宽窄自动伸缩不变形）；条高 ≥12px；数值贴条端；标签贴条左 |
| 四 | 环状图 | 圆环完整不变形（定尺寸方形 SVG）；环径/段数自定；中心数值常显（HTML 层不变形）；多段配图例 |
| 五 | 分组柱状图 | 每组 N 根柱双色系列；组内 gap ≥6px / 组间 gap ≥14px；柱顶数值必标；图例注明系列 |

### 结果约束总清单（两端通用，2026-08-07 测试页逐条实测通过）

1. **柱底对齐基线**：任何柱数/容器宽度下贴底（flex `align-items:flex-end` + 基线元素）。
2. **x 轴标签不重叠、不叠柱**：标签独立行（flex 与柱同列宽对齐）；柱多自动跳显；标签区固定高度（≥22px）不挤压。
3. **标签不溢出容器**：图表底部为 x 轴标签留白区（基线下方），x 标签与柱顶数值均**不得负定位溢出容器**。
4. **折线数据点严格落线**：polyline 与 HTML 点共用同一百分比坐标系（points 坐标 ÷100 = dot left/top）；点固定尺寸正圆（SVG 仅画线，`non-scaling-stroke` 线宽恒定）。
5. **环形图中心文字不变形**：HTML 绝对定位居中，SVG 只画环。
6. **多系列必配图例**：双系列柱/折线/多段环均有图例；单系列可省。
7. **颜色只用信息化图表色 `--chart-*`**（见 §4）——**禁通用语义色（--primary/--suc/--warn/--err）做系列色**。
8. **图表不溢出卡片**：图表容器高度自定（内容撑开或固定均可），禁止内容溢出卡片。
9. **网格线水平范围限于绘图区（2026-08-07 执行上报补齐）**：网格线两侧为 y 轴刻度标签留白（≥20），不贯穿标签区；y 轴刻度与网格线同高对齐但水平错开（刻度在留白区、网格线在绘图区）。**禁网格线贯穿到图表左右边缘贴卡边**。

---

## 3. 布局铁律（两端通用，血泪教训背书）

- **图表左右对称（间距系统铁律）**：数据区左右边距必须一致——**禁一侧贴边一侧留大**（实测 x 30-360 → 左 30 右 40 不对称）。内边距按间距规范选值，**不是简单居中就行**。
- **纵向占满 + 对称**：数据 y 范围与图表区纵向协调，上下留白对称；数据集中一条带 = 不达标。
- **柱底对齐基线**：柱底必须落在基线上，底部不留悬空。
- **最下网格线（基线）与 x 轴标签纵向间距 ≥20px**（标签独立行时 = 标签行高度）。
- **网格线水平留白（2026-08-07 补齐）**：网格线水平范围限于绘图区，两侧为 y 轴刻度标签留白 ≥20；y 轴刻度与网格线同高对齐但水平错开——**禁网格线贯穿左右边缘贴卡边**（移动端示例已隐性示范，Web 端补齐显式约束）。
- **禁衬线字体**：中文一律 `--font-cn`（黑体系）——**中文禁挂 `--font-mono`**（等宽无中文字形回退宋体衬线）；数字/百分比可用 `--font-mono`。
- **图表卡不强制加摘要行**（拍板）；卡片拉伸空白由图表区弹性吸收（`.card:has(.chart-box) .chart-box{flex:1;min-height:320px}` 保留作弹性兜底）。
- **弹性卡 vs 定高卡（2026-08-07，与 Web RULES §4.4b 联动）**：图表卡是**弹性卡**（图表区 `flex:1` 吸收行高）；与图表卡同排的列表/日志卡是**定高卡**——定高卡须显式定高（真源 `.scroll-fixed` 或 height/固定 max-height），禁仅 `max-height:100%`（在 `card--fill` 下等于行高，无效）。门禁 `scroll.container.height`（MED）兜底。

---

## 4. 色彩契约

- **系列数据色（柱/条/线/环段/点）一律 `--chart-*` token，禁通用语义色（--primary/--suc/--warn/--err）与裸 hex**：
  - Web 8 色：`--chart-tech-blue / --chart-smart-cyan / --chart-data-cyan / --chart-fresh-green / --chart-vivid-orange / --chart-alert-red / --chart-wisdom-purple / --chart-modern-pink`；
  - 移动 13 色：`--chart-blue / --chart-green / --chart-orange / --chart-red / --chart-blue-aux / --chart-green-g / --chart-yellow / --chart-red-neg / --chart-purple-a / --chart-purple-b / --chart-cyan / --chart-rose / --chart-gray`（语义见移动 DESIGN-TOKENS §2.3）。
- **辅助线例外**：网格线用中性 `--n4` 级、目标线可用 `--warn`（虚线辅助语义，非系列色）——仅限非数据系列元素。
- **同页 ≤5 个系列色**；使用顺序：主系列 → 对比系列 → 预警 → 扩展色。
- **同系列数据色统一**：同一数据系列柱/条/线一律同色（禁最高值强调色）；分组柱状图两系列用两色区分。
- SVG 内 `stroke=`/`fill=` 一律 `style="stroke:var(--chart-*)"`；**禁裸 hex**（门禁 `svg.paint.non-palette` HIGH）；**必须是真源已定义 token**（门禁 `token.svg-var` HIGH——2026-08-06 事故：用不存在的 `--chart-smart-blue` → stroke 失效折线不可见）。
- 图例用 `.chart-legend` / `.legend-item` + `.legend-dot`（圆点）/ `.legend-line`（线段，可 `--dash`）。
- **暗色（联动 DARK-MODE.md）**：两端 dark 段不重定义 `--chart-*`（沿用亮色，语义跨模式稳定）；暗底上**禁深色系作主系列线/描边**（Web `--chart-tech-blue` / 移动 `--chart-blue-aux` `--chart-green-growth`，对比 <3:1）——主系列优先亮系；图表文字走 n 级文字 token，不引 chart 色作文字。

---

## 5. 交互与动画（所有信息化图表默认即带）

- **Web hover（目标是数据元素本身，非整卡）**：柱/条上浮 2px + `brightness(1.12)` + drop-shadow；数据点放大 1.7×；折线加粗 3.5；环段微膨胀 1.04×——均走 fast token。**禁整卡 hover 浮起**（2026-08-06 拍板）。
  - 注意：柱/条进入动画 fill-mode 用 `backwards`（`both` 会锁死 transform 挡住 hover 上浮）。
- **悬停阴影层级**：一律 `drop-shadow(var(--shadow-data-hover))`——**禁 float/modal 级**（弥散过大不贴合小元素）。暗色 `--shadow-data-hover` 已补（2026-08-07）。
- **环状图分段数据**：中心常显主段数值，悬停环段切换为对应段数值（Web）；**移动端点按段**显示对应数值，默认态常显主段。
- **数据点延迟出现**（`.chart-dot` `animation-delay: var(--motion-duration-slow)`，线画完才淡入）——防「点漂移」错位。
- 时长一律 `--motion-duration-*` token（门禁 checkMotion：transition 裸值 HIGH / animation 裸值 MED）。
- 动画类（真源默认，Agent 给图形元素挂类即得）：`.chart-bar` / `.chart-hbar` / `.chart-line` / `.chart-ring-anim` / `.chart-dot`。

---

## 6. 移动端差异（Web §1-5 的移动对应物）

- **坐标**：柱状/横向柱/折线同 Web 放开（HTML flex / SVG 百分比自适应）；**环形/圆形禁 `preserveAspectRatio="none"`**（定尺寸 1:1，圆会变椭圆）。
- **内边距换算（防硬套 Web ⚠️）**：移动图表数据区左右内边距 = 移动间距 token（16px `--space-base` 级）——**禁套 Web 的「8-20 单位」口径**（会放大 2.5×）。
- **x 轴标签（2026-08-06 修正）**：HTML 层放**容器外**（`.chart-x-labels`，`margin-top` 4px）或独立标签行——viewBox 内**不再预留标签区**；柱顶数值 `.chart-v` 用 `translate(-50%,-100%)` 底部对齐锚点（防数值压柱体）。
- **字号（防硬套 Web）**：移动图表文字走**移动字阶**（`.m-text-caption` 12px / label 12px / num mono 12px）——**禁 Web 的 11px overline 档**；标签密度按移动屏宽（343px / 标签宽度 ≥32px 间距），柱窄时每 2 根柱标 1 个亦可。
- **交互**：无 hover → 环状分段/数据标注用**点按**（`touchstart` 切换，点按段显示该段数值，点空白恢复主段）；再点取消（附录 A）。
- **动画**：与 Web 同款动画类（时长走 token）；进入动画可省略（弱网/性能），点按反馈保留。
- **原子类**：`.chart-box` / `.chart-svg` / `.chart-grid` / `.chart-x-labels` / `.chart-v` / `.chart-hl` / `.chart-hr` / `.chart-ring-center` / `.chart-legend` / `.chart-dot` / 动画类——已入移动 template.css（2026-08-06 落地）；Web 自适应图表类（`.bar-chart/.bar-area/.xrow/.line-chart/.ring-chart`）见 `docs/examples/web-图表自适应测试.html` 示范（测试验证，非强制类）。

### 6.1 折线卡标准结构（对齐展示页 2026-08-06，Agent 生成折线卡照抄此结构）
- **卡片**：`.mcard`（mcard-head：标题 + `.mtag-sm .mtag-neutral`「tap 数据点」提示；mcard-body 承载图表）。
- **层级**：`mcard-body > chart-box.chart-box--sm(120px) > svg.chart-svg`，**`chart-x-labels` 与 `chart-legend` 都在 chart-box 外**（mcard-body 直接子，防定高容器溢出）。
- **SVG**：`viewBox="0 0 340 120"` + `preserveAspectRatio="xMidYMid meet"`（禁 none）；`class="chart-svg"`。
- **网格/目标线**：4 条水平网格线（y=20/50/80/110，`stroke="var(--n4)"` width 1，x 16→324）+ **目标线**（y=62，`stroke="var(--warn)"` width 1 `stroke-dasharray="4 4"`）。
- **折线**：`<polyline class="chart-line" fill="none" style="stroke:var(--chart-blue)" stroke-width="2" points="16,25 …324,65">`——**stroke 必须用 `style` 内联**（`stroke=` 属性会与 `.chart-line` 类动画冲突）；points 左右留 16 边距。
- **数据点**：`<circle class="chart-dot" data-val="产量 28" cx cy r="3.5" style="fill:var(--chart-blue)">`。
- **图例**：`chart-legend`（`.legend-line` 蓝实线「日产量」+ `.legend-line.legend-line--dash` warn「目标线」）。
- **动画/交互**：折线生长 + 圆点进入（真源类）；点按浮层用附录 A 脚本。

---

## 7. 门禁口径（两端 validate-spec.js）

| 检查 | Web | 移动 |
|---|---|---|
| `chart.container.missing`（图表未挂容器类）| MEDIUM | MEDIUM（同）|
| `svg.paint.non-palette`（SVG 裸 hex 自造色）| HIGH | HIGH（已有）|
| `svg.paint.non-token`（调色板内但裸 hex）| MEDIUM | MEDIUM（已有）|
| `chart.svg.fill`（chart-svg 带 meet 撑不满）| MEDIUM | 移动版：chart-svg 带 `none` → MEDIUM（禁拉伸变形）|
| `chart.text.inline`（SVG 内 `<text>`）| MEDIUM | MEDIUM（同）|
| `chart.symmetry`（数据区左右对称）| MEDIUM | MEDIUM（同）|
| `chart.baseline`（柱底对齐基线）| MEDIUM | MEDIUM（同）|
| `chart.series.color`（**2026-08-07 新增**：系列元素 fill/stroke 用通用语义色 --primary/--suc/--warn/--err 作系列色）| MEDIUM（建议 --chart-*，目标线 --warn 豁免）| MEDIUM（同）|
| `kpi.simple.forbidden` / `kpi.label.top.forbidden`（KPI 卡，见 KPI 两版规范）| HIGH | — |

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

- **雷达图**：多维度对比——定尺寸正方形 SVG（禁 none）；网格 = 同心多边形，维度标签 HTML 环绕。
- **面积图**：折线 + 底部闭合 `fill`（`fill-opacity ≤ .15` + 同色描边）。
- **堆叠柱状图**：范式二变体——每根柱拆 N 段（分段间同色系深浅或 chart 色序），柱顶数值 = 合计。
- **仪表盘 Gauge**：环状图变体——半环/270° 弧，指针或弧长表达进度，中心数值常显 + hover/点按显示明细。
- **散点/气泡**：双轴数值——点 = `.chart-dot` 复用 hover 交互。
- **KPI 迷你趋势线（sparkline）**：小尺寸折线（等比收缩），无轴无网格，数值走单值标注。
- 完成后：展示页 `#chart-demo` 加演示段 → 回填 §2 → 标注日期与血泪教训。

## 9. 待办计划

> 以下为复盘确认的缺口，按优先级登记待排期。

- **P2-A 图表空态/加载态/数据源**：无数据占位、加载骨架、异步渲染规范（B 端图表迟早接 API）。
- **P2-B 无障碍**：图例/数值对比度达标、aria-label 体系化。
- **P2-C KPI 迷你趋势（sparkline）**：§8 已提未给范式。
- **P2-D ECharts 边界阈值**：「仅限库级复杂图表」无量化（多少数据点/什么类型才够格走 canvas 库）。
- **P2-E 交互回归测试固化**：headless 自动点击验证固化为 `ci-chart-interaction.js` 进 ci-local。
- **P2-F 两端 chart token 命名统一**：Web 长名 vs 移动短名分裂（2026-08-07 颜色契约已明确两端各自色板；彻底统一待拍板）。

---

> 最后更新: 2026-08-07 | CHART-SPEC 重构为「样式 + 结果约束」（实现放开，尺寸/数据量/坐标 Agent 自定；颜色只用 --chart-*；结果约束清单实测通过；参考 `docs/examples/web-图表自适应测试.html`）
