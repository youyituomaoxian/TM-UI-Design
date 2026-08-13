# 弘讯 Web 端视觉规范（VISUAL-SPEC）

> **版本**：1.9.7（2026-08-05）｜ 与移动端 §10 对称
> **用途**：Web/B 端后台（注塑机 / 橡胶机 / CNC 工控）的**视觉设计规范**——给 UI 设计师、前端开发、AI Agent 一份自包含的"画得对、用得对"参考。
> **真源关系**：本规范是**人读视图**；机器唯一真源 = `tokens.json`（值）+ `components.json`（组件契约）+ `packages/web-ui/src/styles/*.css`（组件 CSS）。数值若有出入，以真源为准。
> **配套**：RULES.md（生成规则/门禁）、DESIGN-TOKENS.md（token 短名速查）、MASTER.md（背景规范）、CHANGELOG.md（变更史）。

---

## 1. 设计原则（工控美学三原则）

| 原则 | 含义 | 落地 |
|---|---|---|
| **克制** | 数据说话，装饰最少 | 无 AI 粉紫渐变、无营销风花哨卡片、无无意义动效循环 |
| **层次** | 每页一个视觉焦点 | 内容按「标题 → KPI 数字 → 图表/表格 → 元信息」四级递减 |
| **数据化** | 数字是主角 | KPI 数字 28px/mono + tabular-nums；语义色只点状态不铺底 |

---

## 2. 色彩体系

### 2.1 品牌色 Primary

| Token | 值 | 用途 |
|---|---|---|
| `--primary` | `#005EAE` | 主色：顶栏 / 侧栏 / 主按钮 / 品牌强调 |
| `--primary-hover` | `#1A75D2` | 悬停：按钮 hover / 链接 / 聚焦 |
| `--primary-active` | `#004A8F` | 点击：按钮 active/pressed |
| `--primary-dis-bg` | `#DAEAFA` | 禁用背景 |
| `--primary-dis-fg` | `#A0B4C0` | 禁用文字 |

### 2.2 辅助色 Secondary + 链接

| Token | 值 | 用途 |
|---|---|---|
| `--secondary` | `#0A84FF` | 次级强调 / 图表高亮（暗色独立 `#38BDF8` 系）|
| `--secondary-hover` | `#3DA0FF` | 悬停 |
| `--secondary-active` | `#0066CC` | 点击 |
| `--link` | `#1A75D2` | 超链接（同主色悬停）|

### 2.3 中性色 Neutral（N1–N11）

| 档位 | 值 | 用途 |
|---|---|---|
| `--n1` | `#FFFFFF` | 卡片底色、次按钮填充 |
| `--n2` | `#FAFAFA` | 表头底色 |
| `--n3` | `#F6F9FC` | 行悬停 |
| `--n4` | `#F5F7FB` | **页面背景**、禁用填充 |
| `--n5` | `#EAEAED` | 输入框底色、按钮选中填充 |
| `--n6` | `#DEE2E6` | 分割线、组件边框 |
| `--n7` | `#CED4DA` | 次按钮边框、未激活图标 |
| `--n8` | `#ADB5BD` | 禁用文字、辅助说明（**禁作正文**，2.07:1）|
| `--n9` | `#6C757D` | 三级文字、辅助说明（= 移动端 n7）|
| `--n10` | `#334155` | 二级文字、正文（on n1 = 10.35 AAA）|
| `--n11` | `#212532` | 一级文字、主标题、关键数据 |

> **层级**：正文 n10 / 辅助 n9 / 禁用 n8；深字一律 n11/n10。

### 2.4 功能色 Functional（成功 / 警告 / 错误 / 运行）

| 语义 | 底 `--x` | hover | active | 禁用 | soft 浅底 | fg 字 | 深字档 |
|---|---|---|---|---|---|---|---|
| 成功 `--suc` | `#389E0D` | `#52C41A` | `#237804` | `#B7EB8F` | `#F6FFED` | 白 | `--suc-active`（on soft 5.44）|
| 警告 `--warn` | `#FA8C16` | `#FFA940` | `#D46B08` | `#FFD591` | `#FFF7E6` | 白 | `--n11`（橙系无深档）|
| 错误 `--err` | `#F5222D` | `#FF4D4F` | `#CF1322` | `#FFC8C5` | `#FFF1F0` | 白 | `--err-fg-deep` `#101010`（5.06）|
| 运行 `--run` | `#16A34A` | `#22C55E` | `#15803D` | `#B8E3C9` | `#ECFDF5` | 白 | `--run-active`（on soft 4.76）|

- 完整态键：`bg/bgHover/bgActive/bgDisabled/soft/softHover/softActive/border/borderHover/borderActive/fg/fgDeep/disabledFg`（亮暗键集对称，08-05 补齐）。
- **文字色铁律（WCAG）**：功能色实底按钮/标签 = **深字**（`--suc-active`/`--n11`/`--err-fg-deep`/`--run-active`）；`-soft` 浅底 = 同系深字档。**白字只允许 on primary**（6.54 AA）。

### 2.5 图表色 Chart（8 色）

`--chart-tech-blue #0066CC`（核心指标）/ `smart-cyan #00A3E0`（趋势线）/ `data-cyan #00C7BE`（对比）/ `fresh-green #00D4A1`（正向）/ `vivid-orange #FF9500`（预警）/ `alert-red #FF4D4D`（负向）/ `wisdom-purple #8A5CF5`（多维）/ `modern-pink #FF66C2`（标注）。暗色复用同值（深底上对比更高）。

### 2.6 色彩应用理念（§7.5 克制）

- **主色面积 ≤30%**（顶栏 / 侧栏选中 / 主按钮允许，内容区克制）。
- **语义色只点状态**（Tag / 进度 / 状态点），不铺底。
- **背景层次**：n1 卡 / n2-4 区 / n5-6 分隔。
- **禁止**：AI 粉紫渐变 / 霓虹色 / 满屏单一功能色。

### 2.7 WCAG 2.0 前景/背景对比度（§7.5b）

> 标准：正文 ≥ **4.5:1**（AA）/ 7:1（AAA）；大文本（≥24px 或 ≥18.66px 粗体）与图形 ≥ **3:1**；纯色不得单独传达信息。

| 等级 | 组合 | 对比度 | 说明 |
|---|---|---|---|
| ✅ AA | `n10/n11 on n1` | 10.3 / 12.7 | 正文全达标 |
| ✅ AA | `n9 on n1` | 4.69 | 辅助文 |
| ✅ AA | `n1 on primary` | 6.54 | 品牌按钮白字 |
| ✅ AA | `n11 on warning` | 6.42 | 警示深字 |
| ✅ AA | `n11 on run` | 4.63 | 运行深字 |
| ⚠️ 仅大文本 | `n1 on danger` 4.08 / `n1 on success` 3.46 / `n1 on warning` 2.38 | — | 白 on 功能色不达正文线 |
| ⛔ 禁止 | `n8 on n1` 2.07 / `n6 on n1` | — | 禁作正文 |

**组件文字色现状（两端策略不同，08-05 拍板移动白字首选）**：Web 端 `.tag-*`/`.badge-*`/`.alert-*` 用 `-soft 浅底 + 深字档`（suc 5.44 / err 5.07 / run 4.76）；**移动端功能色标签/按钮白字首选（实底 + 白字，视觉通透，深字方案已废弃，见移动 RULES §10.3b）**。门禁 `wcag.contrast.banned` 仅拦 hex `#fff`/`white` 硬编码白字（白字须走 `var(--n1)`），**不拦移动白字首选组合**。

---

## 3. 字体与文字层级

### 3.1 字体族

| Token | 字体 | 用途 |
|---|---|---|
| `--font-cn` | Source Han Sans CN（思源黑体）| 中文 |
| `--font-en` | Roboto | 英文 / 数字 |
| `--font-mono` | JetBrains Mono / SF Mono / Consolas | 工控数据 / 代码（tabular-nums 对齐）|

### 3.2 字阶（13 级，硬切换，禁裸 font-size）

| 层级 | 字重/字号/行高 | 用途 |
|---|---|---|
| `--font-display` | Medium 32/40 | 页面主标题 |
| `--font-h1` | Medium 28/36 | 模块标题 |
| `--font-h2` | Medium 24/32 | 区块标题 |
| `--font-h3` | Medium 20/28 | 卡片标题 / 弹窗标题 |
| `--font-h4` | Medium 18/26 | 子标题 / 页面标题 |
| `--font-h5` | Medium 16/24 | 小节标题 |
| `--font-body1` | Regular 14/22 | **正文 / 列表 / 表单**（默认）|
| `--font-body2` | Regular 13/20 | 辅助说明 |
| `--font-caption` | Regular 12/16 | 图表标注 / 表单提示 |
| `--font-label` | Medium 12/16 | 标签 / 按钮文字 |
| `--font-overline` | Medium 11/16 | 极小标注 |
| `--font-link` | Regular 14/22 | 超链接 |

> **KPI 数字**：`stat-card` 内数值用 28px/mono（`.kpi-ico` 为图标容器类，24/48px 变体 + 语义底色；⚠️ RULES §7.3 提的 `.kpi-count` 数字类**真源未实现**——见 BLOCKED 漂移记录，暂以 `stat-card` 内 `b/span` + mono 字阶实现）。表格数字 mono + tabular-nums。
> **层级不跳级**：h4(18) → 卡标题(16/500) → 正文(14/400)。

### 3.3 密度模式 Density

| 档位 | 行高 | padding | 场景 |
|---|---|---|---|
| compact | 36px | 12px | 数据密集（opt-in）|
| comfortable | **44px** | 16px | 默认基准 |
| spacious | 52px | 20px | 聚焦 / 大间距 |

---

## 4. 间距体系

| Token | 值 | 用途 |
|---|---|---|
| `--space-xs` | 4px | 图标与文字、栅格步进 |
| `--space-sm` | 8px | 紧凑元素间隙 |
| `--space-md` | 12px | 组件内次级间距 |
| `--space-base` | 16px | 标准：卡片内边距、列表项、内容区边距 |
| `--space-lg` | 24px | 模块间、卡片外边距 |
| `--space-xl` | 32px | 区块分隔 |
| `--space-xxl` | 48px | 页面级分隔 |
| `--page-padding-x` | 24px | 页面左右 padding |
| `--content-padding` | 16px | 内容卡内边距 |
| `--card-gap` | 16px | 卡片间距 |

**间距铁律（§4.3 门禁）**：
- 跨模块（grid12 兄弟）间距 **≥16px**；KPI 区 → 图表区 **≥24px**。
- 卡片内 padding 16px；行高 44px。
- 模块间必有 gap，**禁"贴一起"**；克制以 16-24px 为带（20px 中点）。

---

## 5. 圆角体系

| Token | 值 | 用途 |
|---|---|---|
| `--radius-sm` | 2px | 细微圆角 |
| `--radius-base` | 4px | 输入框、标签、小型控件 |
| `--radius-md` | **8px** | 卡片、按钮、下拉（默认档）|
| `--radius-lg` | 16px | 大卡片、形象区 |
| `--radius-round` | 999px | 状态点、头像、分页圆钮 |

---

## 6. 投影与 Elevation

### 6.1 投影（双层复合：柔光层 + 1px 发丝线）

| Token | 值 | 用途 |
|---|---|---|
| `--shadow-card` | `0 1px 2px rgba(0,0,0,.10), 0 0 0 1px rgba(0,0,0,.04)` | 卡片 |
| `--shadow-modal` | `0 6px 16px rgba(0,0,0,.08), 0 0 0 1px rgba(0,0,0,.04)` | 弹窗 |
| `--shadow-float` | `0 4px 8px rgba(0,0,0,.10), 0 0 0 1px rgba(0,0,0,.04)` | 悬浮块（**deprecated**，归 overlay）|
| `--shadow-row-hover` | `0 1px 2px rgba(0,0,0,.06), 0 0 0 1px rgba(0,0,0,.03)` | 表格行悬停 |

### 6.2 Elevation 5 级（Atlassian 对齐）

| 层级 | surface | shadow | 用途 |
|---|---|---|---|
| sunken | `#F5F7FB` | none | 凹槽 / 分组容器底（看板列、筛选区）|
| default | `#FFFFFF` | none | 基线平面（页面、flat card 配 border）|
| raised | `#FFFFFF` | 卡片影 | 可移动 / 强调卡片 |
| **overlay** | `#FFFFFF` | 弹窗影 | 浮层（modal/dialog/**dropdown**/popover/tooltip）|
| overflow | `#FFFFFF` | `0 0 8px rgba(0,0,0,.12)`+线 | 滚动溢出边界 |

> 下拉/日期浮层统一 **overlay**（08-05 拍板：`--shadow-float` 废弃归 overlay）。

---

## 7. 动效体系（M1-M5）

### 7.1 Duration（4 档）

`instant 120ms`（微交互）/ `fast 240ms`（小型 enter/exit）/ `normal 360ms`（标准转场）/ `slow 480ms`（全屏转场）。

### 7.2 Easing（AntD 曲线）

`ease-out cubic-bezier(.215,.61,.355,1)`（默认出）/ `ease-in-out cubic-bezier(.645,.045,.355,1)` / `ease-out-quint cubic-bezier(.23,1,.32,1)` / `ease-in-out-circ` / `ease-out-circ cubic-bezier(.08,.82,.17,1)`。

### 7.3 动效能力（1.9.6 补齐，两端对称）

- **13 个 @keyframes**：spin / pulse + fade-in/out、float-up/down、slide-in/out-right、scale-in/out、shimmer、list-in、toast-in/out。
- **11 个 `.anim-*` 工具类**：`.anim-fade-in` 等（时长/缓动全走 motion token）；`.anim-press`（按压 scale .98）；`.anim-list-in`（渐进增强，JS 加 `.mounted` 才播）。
- **`prefers-reduced-motion`** 段：系统"减少动效"下全部动效归零（WCAG 配套）。
- 门禁：transition/animation 时长必须 `var(--motion-duration-*)`；`.spinner .8s` 等持续指示动画 MED 级豁免。

---

## 8. 布局骨架

### 8.1 固定框架（§6.1）

```
TopBar        height=72   FIXED   主色底 白字
├─ Sidebar    width=240   FIXED   主色底（折叠 80）← 菜单白字
├─ Content              FLEX     背景 n4 #F5F7FB
│   ├─ Breadcrumb / Tabs  height=32
│   ├─ Card Grid (24 列)  gap=16
│   └─ Table / Form ...
└─ Footer      height=32   FIXED   主色底 白字
```

### 8.2 三区构图（看板/运营页必含，§7.2）

1. **KPI 区** `.stat-grid`（≤8 张卡，`stat-grid--N` 显式列数）
2. **图表区** `.grid12 > .col-N` + `.chart-box`（定高，`chart-svg--fill` 撑开）
3. **表格区** `.table`（表头 44 / 行 44 / 空数据 `minRow` 占位）

**页面信息块 ≤6-7 个**；卡片 ≤3 行核心信息 + 空态占位。

---

## 9. 组件视觉规格（components.json 契约镜像）

| 组件 | 尺寸 | 圆角 | 字 | 视觉要点 |
|---|---|---|---|---|
| **按钮 Button** | 默认 32 / lg 40 / sm 24，paddingX 16 | 8 | 14/400 | primary 蓝底白字；secondary 白底蓝边；text 纯文字；`-ico` 16px 图标；禁用降级 |
| **输入 Input** | 高 32，paddingX 12 | 4 | 14 | 底 n5 / 边 n6；聚焦 primary 边框 + 光晕；禁用 n4/n8 |
| **标签 Tag** | 高 22，paddingX 10 | 4 | 12 | 5 色 `-soft 浅底 + 深字`；禁用 opacity .6 |
| **表格 Table** | 表头 44 / 行 44 | — | 13 | 表头 n2/500；数字 mono；行 hover n3；空态 minRow |
| **页签 Tabs** | 高 32 | — | 13/500 active | 底部指示条；激活 w500 |
| **分页 Pager** | 高 44，按钮 24×24 | 999 | 12 | 激活 primary 底；总条数 n9/14 |
| **状态点** | 10×10 | 999 | — | 机器状态 7 语义色（见 §10）|
| **弹窗 Modal** | 382×257 min | 8 | — | 头 40；overlay 投影；z 分层 10/20/30/50 |
| **下拉 Select / 日期 DatePicker** | 触发器高 32 | 4/8 | 14 | 浮层 overlay 投影；选项 hover n3；选中 primary 底 |
| **树菜单 Tree** | 节点高 32 | 4 | 14 | 缩进 16/级；品牌底用 `.tree--brand`（白字）|
| **卡片 Card** | — | 8 | — | `.shadow-card` + radius-md；`.card--fill` 等高收底 |
| **KPI 统计卡** | 4 列默认（5/6/8 变体）| 8 | — | `.stat-card` 28px/mono（`.kpi-count` 未实现见 BLOCKED #39）|

> 详细尺寸/状态机/伪类见 `components.json`（机器真源）+ components.css（CSS 真源）。

---

## 10. 状态语义（机器状态 vs 功能色，拍板①）

| 状态 | 类 | 颜色 | 语义 |
|---|---|---|---|
| 运行中 | `.dot-run` | `--run` 绿 | 正在工作 |
| 待机 | `.dot-idle` | n9 `#6C757D` | 就绪未运行 |
| 停机 | `.dot-off` | n10 `#334155` | 主动停止 |
| 离线 | `.dot-offline` | n11 `#212532` | 无连接 |
| 故障 | `.dot-err` | `--err` 红 | 异常 / 报警 |
| 成功（功能）| `.dot-ok` | `--suc` | 操作成功 |
| 预警（功能）| `.dot-warn` | `--warn` | 功能预警 |

> **机器状态用 run/中性灰/err 独立语义，不用 suc/warn**；状态点须配文字（纯色不得单独传信息，WCAG）。灰阶深灰递进（08-05 对抗审查 D02 修正：n9/n10/n11 on 白 4.69/10.35/11.42 全达标）。

---

## 11. 视觉自查清单（§7.7 反廉价）

- [ ] 满屏品牌蓝（>30%）→ 收敛为顶栏/KPI/主按钮
- [ ] 卡片无投影/无圆角 → `.shadow-card` + radius-md
- [ ] 文本裸 font-size inline → 字阶类（13 级）
- [ ] KPI 数字不用 28px/mono 字阶 → 数据不突出
- [ ] 看板页无 stat-grid/grid12 骨架 → 三区构图
- [ ] 图表不撑开 / 被裁 → `.chart-svg--fill`
- [ ] 表格空数据无占位 → `minRow`
- [ ] 白 on 功能色 → 深字 n11/err-fg-deep
- [ ] 无 hover/无空态/无 loading → 补齐反馈
- [ ] 动效循环/渐变滥用 → 收敛

**生成后必做**：headless 截图（`--virtual-time-budget=6000`，窗口 ≥1440）→ 按清单自查 → 门禁 0 HIGH + 截图双证交付。

---

## 12. 暗色模式（`:root[data-theme="dark"]`）

- **切换**：属性选择器（非 `.dark` 类）；值 = tokens.json dark 节（唯一值真源）。
- **品牌区**：顶栏/侧栏/底栏 dark 下用 `--brand-surface` 深蓝黑 `#0A2540`（避免"蓝壳+黑芯"），文字 `--text-on-brand`（dark = n11 亮白，对比达标）。
- **dark primary** `#3B82F6`（引擎快照，**不可手改**——主按钮深字/白字对比 3.68-3.98 属品牌特性，待引擎解冻调整，已记录跟踪）。
- **功能色底** dark 变亮（suc `#34D399` 等），组件文字用 dark n1（`#1E293B` 深色）——对比 5.29~8.76 全达标。
- **键集对称**：dark 已补 secondary `#38BDF8` 系 / link `#60A5FA` / chart 8 色（08-05）。
- **状态点**：灰阶经深灰递进修正，dark 下可见（配文字）。

---

## 13. 参考索引

| 文档 | 内容 |
|---|---|
| `RULES.md` | 生成规则 / 决策树 / 状态机 / DOM 契约 / 布局美学（§7）/ WCAG（§7.5b）|
| `DESIGN-TOKENS.md` | 全部 token 短名速查（本节速查版，完整见它）|
| `MASTER.md` | 背景规范 / 搭建步骤 |
| `components.json` | 组件尺寸/状态/契约（机器真源）|
| `packages/web-ui/src/styles/*.css` | 组件 CSS 真源（globals/components/framework/utilities）|
| `CHANGELOG.md` | 1.9.x 变更史 |
| 移动端 `RULES.md §10/§11` | 两端对称参考（组件样例 / 色彩理念）|

---

> 最后更新：2026-08-05 ｜ 与 tokens.json / components.json / components.css 真源对齐；含 1.9.5 WCAG、1.9.6 动效、1.9.7 状态语义 + 对抗审查修复。
