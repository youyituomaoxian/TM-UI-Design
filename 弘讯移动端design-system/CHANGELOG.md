# 弘讯移动端设计系统 — Changelog

> 语义版本（与 Web 端 `CHANGELOG.md` 同构）。所有「值」以 `tokens.json` 为唯一真源；所有「组件尺寸/色值」以 `components.json` 为唯一真源。

---

## [1.14.7] — 2026-08-12 · 内容区构图开放（与 Web 对称）+ 流程修正

### Changed
- **§1.1b 开放总则（用户拍板：框架/组件锁死、内容区构图开放）**：与 Web 对称，区块排列/顺序/取舍按「布局决策 6 问 + 布局模式库」（GENERATION-SOP 步骤 5）自由选择，受 343 列宽 + gap 12 间距体系约束。
- **§9.6 首页区域顺序可调**：固定顺序 → 可选区域 + 顺序按业务可调（告警优先页 = 列表提前 / 工具页 = 金刚区置顶）；铁律保留（首屏 ≥3 区域、透明 StatusBar、区域间距 16px）。
- **§10.9 视觉自检截图**：`--virtual-time-budget` → `--timeout`（不驱动 CSS 动画，图表空白）。
- **5问/6问统一**：软规则清单「布局决策 5 问」→「6 问」。
- **预览壳亮暗切换（2026-08-12 拍板：按钮在手机框外，非页面内容）**：template.css 新增 `.stage-wrap`（预览壳包裹层，顶部 44px 按钮区）+ `.theme-toggle`（半透明胶囊，absolute 顶部右缘对齐手机框）；page-template 加框外 moon/sun 切换按钮 + JS（`data-theme` + localStorage `hx-theme` 记忆）；agent-starter / 展示页测试 / docs/examples 全部移动 HTML 同步注入；**真实移动端页面内容无切换按钮**（预览壳层自带）。RULES §1.1b 补「预览壳亮暗切换」说明（克隆勿删）。
- **图标 sun/moon 入库**：`icons/sun.svg` + `moon.svg`（stroke 1.8 规格），icons.md 登记（共 184→186）。
- **gen-examples.js**：mobilePage 加预览壳按钮（与 page-template 同构）+ brandCover 双模式（上轮）。
- **验证**：ci-local 86 pass。

---

## [1.14.6] — 2026-08-07 · 底部导航 3-5 项收编 + 图标同步 Web 新库（129）

### Changed
- **bottomnav.count 门禁**（MEDIUM）：`.bottomnav` 内 `.bn-item` 3-5 个（最少 3、最多 5，按业务需求增减）；无 BottomNav 的页面（登录/详情等）不查；RULES §1.1b + SOP/AGENTS/标准提示词模板同步补指令。
- **图标同步**：123 个与 Web 端新图标同源替换（双端 icons.md 语义对照，命名差异但语义一致均同步）；6 个移动端独有语义重画入库（report_work 报工 / production 产量统计 / schedule 排产任务 / temp_zone 温度区段 / load_param 工艺调取 / meter 电表）；page-template 换库（4 svg 命中）；icons.md 头部对齐 129。
- **验证**：page-template 0 HIGH、ci-local 86 pass、截图图标纤细 1.8 无异常。

---

## [1.14.5] — 2026-08-07 · 克隆框架三层机制（P1+P2+P0，与 Web 对称）

### Changed
- **P2 脚手架**：`scripts/new-page-mobile.js`——克隆移动 page-template（375×812 手机壳）+ link 修正 + 注入克隆凭证 meta。
- **P1 门禁** `template.clone.missing`（HIGH）：含 `.phone-stage/.phone` 的页面缺克隆 meta → 拦截。
- **P0 门禁** `framework.fingerprint`（HIGH）：手机壳 7 件套（phone-stage/phone/m-statusbar/navbar/screen-scroll/page-view/bottomnav + 顺序）。
- **豁免**：page-template.html、USAGE.html、规范展示页、展示页测试。
- **验证**：移动端展示页/agent-starter 零误报；正例 0 HIGH。

---

## [1.14.4] — 2026-08-07 · 滚动容器显式定高守则（与 Web §4.4b 对称）

> 移动端 375 固定画布无 Web 的 grid 行等高机制，但滚动列表容器（页面自造 overflow-y:auto/scroll 类）仍须显式定高，防止被外层弹性容器拉伸成空洞。

### Changed
- **RULES §8.3 防溢出清单**：新增「滚动列表容器带显式 height 或固定 max-height」检查项。
- **validate-spec.js**：对称新增 `scroll.container.height` 门禁（MEDIUM，inlineClone 豁免），判定逻辑与 Web 一致。

---

## [1.14.3] — 2026-08-07 · 阅读策略改造：RULES 事故记录迁移（只迁事故，保留现役约束）

> 本次把 `RULES.md` 中的「事故记录」（何时发生/症状/根因）迁移至此，RULES 只保留规则正文 + 门禁名 + 设计理由。事故对应的现役约束位置见各条末尾。

### 事故记录（移动端 RULES 迁出）

1. **设备台帐执行级缺陷**（§3.5，2026-08-04 多轮复盘）：Tag 尺寸 / 卡片间距 / 文本层级 / Tab 竖排 / 卡片无圆角。根因：组件真源已就位、HTML 没按契约组 DOM（与 Web §3.7 同源）。现役约束：`mlist.structure` / `mtag.size.in-card` / `kv.row.required` / `m.empty.placeholder` 四条 DOM 契约门禁。
2. **类名凭记忆写错**（§3.5 速查，2026-08-06 展示页测试）：`mlist-row/label/value`、`mlist-double-row/main/sub`、`msearch-placeholder`、`m-dot-run/warn/err` 共 9 个类名全部 HIGH `class.undefined`。根因：真源是子类结构、凭记忆造类名。现役约束：写组件 DOM 前先查速查或 template.css。
3. **双容器间距视觉 21px**（§4.3/§10.4，2026-08-05 v9）：gap12+margin4=16 设计值视觉实测 21px，用户反馈「间距改错方向，是否把组件外框算进去了」。根因：box-shadow 外扩被误当作间距计入。现役约束：v10 终态纯 gap 12px、禁任何 margin 叠加。
4. **卡片套卡片**（§4.3 嵌套降级，2026-08-05 用户反馈）：`.mcard` 内 `.mlist-double` 双层白底+阴影，层级太多。根因：列表项嵌卡片容器未降级。现役约束：`.mlist*` 嵌卡片状容器必须降级扁平行（去 shadow/圆角/背景 + border-top 分隔）；2026-08-06 另验证 padding 归零会文字贴卡片左缘。
5. **msearch 固定 343 超卡**（§4.3，2026-08-06）：form-card 内容区 311px、msearch 写死 343px 超卡片 32px 顶出屏幕。现役约束：msearch 双场景自动自适应、禁再写固定 343。
6. **双行列表双重横线**（§4.3 双行列表排版，2026-08-05 复盘）：foot border-top 与条目间 border-top 双重横线导致区分混乱。现役约束：条目间一条横线、条目内数据区用 n2 浅灰底微块。
7. **bottomnav 渲染到页面顶部**（§4.3，2026-08-06 实测）：多/少 `</div>` 把 bottomnav 挤出手机壳。现役约束：bottomnav 必须是 `.phone` 直接子项 + `html.structure.pairing` / `html.structure.bottomnav` / `html.structure.body` 门禁 HIGH。
8. **Tab 筛选滚动跳顶**（§4.4，2026-08-05 v1/v2 均失败）：v1 `scrollTop=0` 跳顶、v2 内容收缩漂移。现役约束：`.mtabs` 必须 `position:sticky` 固定、禁任何 scrollTo/scrollTop 重置。
9. **设备群览页三元素溢出**（§8）：Content（407px）、FilterRow（354px）、Nav（360px）连续溢出画板。根因：组件库默认宽 375px 而屏幕内容列实际宽 343px（375−16×2 gutter），插入实例不自动适配父容器、父框架未锁 FIXED 宽未 clipsContent。现役约束：八条铁律 G1-G7。
10. **图表 X 轴标签叠柱**（§9.7）：产能趋势柱状图 X 轴标签与柱体底部重叠。根因：标签作为 SVG 内元素/柱子子级定位、无纵向边界约束。现役约束：标签一律 HTML 层 + 结果约束 8 条。
11. **设备群览页三排版反例**（§10.0，2026-08-05 复盘）：①双行列表 sub 14px 与 title 16px 同色 → 对比不足；②条目内 3px 与条目间 44px 失衡 → 亲密性错误；③foot 与条目间双重横线 → 信息区分混乱。现役约束：四原则（亲密性/对齐/重复/对比）+ 10.0 落地要点。
12. **间距补丁落空、模块 0px 贴死**（§10.4，2026-08-05 复盘）：此前 §4.5 间距补丁全部写死 `.screen > X + Y` 且 `.page-view` 为 `display:block`，而标准结构是 `.screen > .page-view > 模块`——gap 只作用于多屏之间、屏内模块间距全部落空（Hero→瓷片→产能卡→胶囊 0px 贴死）。现役约束：.page-view flex gap + 间距排查守则（禁页面级 margin 硬顶，规范级 `!important` 兜底）。
13. **状态点灰阶不可见**（§11.11，2026-08-05 对抗审查 D02）：初版用 n5/n6（亮色 1.2~2.1 / 暗色坍塌 1.0~1.4）。现役约束：状态点用 n7/n8/n9（移动）/ n9/n10/n11（Web）深灰递进，亮暗双模式达标。
14. **待机状态误用 .warn**（§11.11，2026-08-05）：设备列表「待机」用黄 `.warn` 语义混淆。现役约束：机器状态用 run/中性灰/err 独立语义，功能状态（操作/校验反馈）才用 ok/warn。

### 验证
两端 RULES 瘦身后页面门禁 0 HIGH；ci-local 86 pass。

---

## [1.14.2] — 2026-08-06 · 落位体系定稿 + 折线卡标准 + mlist 对齐（沉淀展示页基准）
### Changed
- **`.screen` 落位体系定稿**：page-template 补 `.screen` 容器（343 居中 + gap:12 + padding-top:16）——业务页不再全宽贴边；落位 = 容器提供，组件**不加水平 margin**。
- **视觉唯一基准**：RULES 顶部声明「移动端规范展示_20260806_0755.html = 视觉唯一基准」；**冻结解除**（🔓，用户拍板进入规范修改阶段）。
- **bottomnav 规则**：菜单项 **3–5 个**按业务增减（非定死）；`m-home-indicator--show` 挂最后一项后（iOS 黑条）。
- **折线卡标准**（CHART-SPEC §6.1 沉淀）：mcard 结构 + chart-x-labels/chart-legend **在 chart-box 外**（防星期文字溢出）+ 网格线 4 条 + 目标线（warn dashed）+ 折线 `style` 内联 stroke（属性会与类动画冲突）+ 数据点 data-val + 点按浮层（附录 A）。
- **mlist 对齐**：`.mlist-thumb` 加 flex 居中（图标在灰块中心）；`.mlist-double-foot` padding 8/12（内容不贴左缘）；components.json `list` 契约 referenceCss 同步真源（卡片形态）。
### Fixed
- 折线图无数据线（stroke 属性被类动画覆盖）→ style 内联；超出容器（preserveAspectRatio none + 贴边）→ meet + 留边 16。
### 验证
两端 page-template / 展示页 / 示例页门禁 0 HIGH；ci-local 86 pass；截图确认缩略图图标居中、灰条内容有左距、折线图完整。

## [1.14.1] — 2026-08-06 · 内容区组件 343 落位（修复业务页贴边）
### Fixed
- **真源落位缺口**：`.page-view.on` 无水平 padding，内容区组件（`.mlist-double`/`.mlist`/`.msearch`/`.chart-box`）无 `margin:0 16px` → 业务页内容贴手机壳边缘（§1.1b「内容区落位宽 343」此前只在文档未实现）。
- 已给上述 4 组件加 `margin:0 16px`（343 落位，与规范展示页「区块自带落位」同构）；`.mbtn` 为行内组件不加（表单并排场景）。
### 验证
移动 page-template / 展示页 / 示例页门禁 0 HIGH；ci-local 86 pass；示例页截图确认搜索/KPI 条/卡片左右均 16px 落位。

## [1.14.0] — 2026-08-06 · 页面类型规格并入 RULES §1.1b + Hero 纯色裁决 + 示例页删除
### Changed
- **pages/ 删除并入 RULES §1.1b**：7 个页面覆写文档删除，页面类型规格（列表-详情/表单/仪表盘/个人中心/设备分组/告警列表/登录页）并入 `RULES.md §1.1b`（含登录页独立页规则）；Agent 不再找近似模板。
- **个人中心 Hero 纯色裁决**：Hero 改用纯 `--primary` 底，旧渐变 A（#005EAE→#003868）废弃（MASTER §1.2 同步作废）。
- **示例页删除**：`pages/examples/` 删除（生成器保留 `brand-color-engine/examples/gen-examples.js`）。
- **page-template 纯框架化**：重写为 link template.css + phone-stage/screen-scroll/page-view 结构，无内联组件 CSS。
- **产出分离**：生成页落「用户项目」`output/`；规范展示页 `移动端规范展示_*.html` 移至端目录根。
### 验证
移动 page-template + 展示页门禁 0 HIGH；ci-local 86 pass。

## [1.13.0] — 2026-08-05 · 标签宽度自适应（去固定 min-width）

> 触发：设备群览页验收反馈——标签（运行中/待机/故障等）左右内边距太大且宽度固定，应根据文字自适应。

### Changed
- **`.mtag` 系列去 `min-width` 固定宽**（md 86 / sm 72 / lg 96 → 全部移除）：标签宽度随文字自适应；padding 收敛（基础 0 12→0 10px、sm 0 10→0 8px）。实测：达标 44px、运行中 56px（原统一 86px）。分享版同步。

---

## [1.12.0] — 2026-08-05 · 排版四原则总纲 + 双行列表数据区灰底

> 触发：设备群览页验收反馈 ① 需将 Robin Williams 四原则写入规范指导 Agent 排版 ② 每个加工中心信息区分不明显（原「foot border-top 内部横线 + 条目间横线」双重横线导致混乱）。

### Added
- **`RULES.md §10.0 排版四原则总纲`**（Robin Williams《写给大家看的设计书》）：亲密性/对齐/重复/对比四原则定义 + 落地要点 + 应用顺序（先分组→对齐→重复→对比）+ 反例（设备群览页复盘）。
- **`RULES.md §4.3 双行列表排版 v2`**：条目内部不再用横线切断同一加工中心信息，数据区改 n2 浅灰底圆角微块。

### Changed
- **`template.css` `.mlist-double-foot`**：`border-top` 内部横线 → `background:var(--n2)` 浅灰底 + `radius-sm` 圆角微块（对比/亲密性）；条目之间保留一条 `border-top` 横线区分。分享版同步。

---

## [1.11.0] — 2026-08-05 · 双行列表排版规范（Robin Williams 四原则）

> 触发：设备群览页群组卡内设备列表项排版问题——文字层级不清、间距失衡（用户要求遵循平面设计原则：亲密性、对齐、重复、对比）。实测 `.mlist-double` 高 128px（min-height 92 被撑爆）：`justify-content:space-between` 拉伸 text 块至 71px、title 渲染 48px（line-height 24 被 flex 拉伸）、head→sub gap 3px 过密、top→foot 44px 过疏。

### Fixed（template.css 四原则落地）
- **对比**：`.mlist-sub` 14px/n8 → **13px/n7**（title 16px/500/n8 > sub 13px/400/n7 > foot 12px/n7 三层递减）
- **亲密性**：`.mlist-double-text` gap 3→4px（同组信息紧邻）；top→foot 用 `margin-top:12px` + `border-top` 分隔（不同信息组）
- **对齐**：`.mlist-double` 去 `justify-content:space-between`（改自然高度堆叠，禁拉伸 text）；`.mlist-title` 加 `flex:none`；`.mlist-double-head` `min-height:24px`；`.mlist-double-top` `min-height:52px`——修复 title 48px/thumb 撑高问题，条目 128→119px
- **重复**：同屏列表项统一

### Added
- **`RULES.md §4.3` 新增「双行列表排版」规范**：四原则量化（字号/间距/对齐），附反例（space-between 拉伸、3px 过密/44px 过疏）。

---

## [1.10.0] — 2026-08-05 · 间距纯 gap 化 + 红点白字 + Tabs 横滑（间距计算纠偏）

> 触发：设备群览页验收反馈 ① 纵向间距仍偏大，用户质疑「间距改错方向，是否把组件的外框算进去了」——实测 v9 的 gap12+margin4=16 视觉达 21px（box-shadow 外扩被误算进间距）② 底部导航消息红点深字不通透，应白字 ③ 筛选 Tabs 右侧被截断，应可横向滑动容纳更多选项。

### Fixed（间距计算纠偏 v10）
- **间距纯由 flex gap 控制（12px），全部 margin 叠加归零**：`.mtabs/.msearch/.m-capsule` margin-bottom 4→0、`.mcard+.mcard` margin-top 4→0、区域交界 margin-top 4→0、`.kpi-grid/.anim-list-in/.mtabs` gap 16→12。组件外框（box-shadow 外扩/border）不计入间距。`RULES.md §10.4` + `template.css §4.5` 同步 v10 终态。

### Changed
- **`.bn-badge` 红底白字**（`color:var(--n10)`→`var(--n1)`）：与功能色标签白字一致，审美优先。
- **`.mtabs` 可横向滑动**：gap 24→12（容纳更多选项）+ `overflow-x:auto`（已具备）右侧新增淡出渐变遮罩（`.mtabs::after`）提示可横滑；`.mtab` 保持 `flex-shrink:0` 不被压缩截断。

---

## [1.9.0] — 2026-08-05 · 间距二次收敛 + 筛选 sticky + 标签白字（审美优先）

> 触发：设备群览页验收反馈 ① 纵向间距仍太大（工业后台调性）② 筛选「scrollTop=0 跳顶」方案仍漂移，需筛选组件固定不动 ③ 功能色标签深色字不通透，要白色（审美优先，WCAG 仅参考）。

### Changed（间距二次收敛）
- **基础 gap 16px→12px，模块间距 20px→16px**（工业后台紧凑档）：`.screen`/`.page-view` gap 12px；卡片叠/区域交界/线状组件一律 `12 + 4 = 16px`。`RULES.md §10.4` + `template.css §4.5` 同步（v8 的 20px 中点对工业后台仍偏大）。

### Fixed（筛选视觉漂移 v3 终态）
- **`.mtabs` 改 `position:sticky;top:0` 固定**：筛选组件本身固定不动，列表在下方变化；**删除 v1 的错误方案 `scrollTop=0`（跳顶）**，禁任何滚动重置。`RULES.md §4.4` 更新为 sticky 终态（v1/v2 失败复盘）。

### Changed（功能色标签/按钮白字，审美优先）
- `.mtag-suc/warn/err/run` + `.mbtn-success/danger` 文字色 **深字 n10 → 白字 n1**（用户反馈深色字不通透）；`RULES.md §10.3b` 重写为「审美优先，WCAG 2.0 仅参考」——白字 on 功能色为设计首选，对比度仅供参考；暗色模式保留深字覆盖。

---

## [1.8.0] — 2026-08-05 · 筛选滚动锚定 + 间距收敛 + 圆角系统统一（交互/调性反哺规范）

> 触发：设备群览页验收反馈 ① 筛选「全部→针车群」后内容高度骤变、滚动位置残留 → 视觉漂移 ② 模块纵向间距仍偏大，不符合工业后台调性 ③ 卡片圆角过大，需统一圆角系统。

### Added（交互规范缺失）
- **`RULES.md §4.4` 新增「筛选滚动锚定」**：Tab 筛选 / 搜索过滤改变列表内容高度后，必须重置滚动位置（`screenScroll.scrollTop = 0` 或锚定列表区顶部），禁止内容收缩后滚动条停在原处造成视觉漂移。页面 JS 已落地（`groupTabs` click 处理器内 scrollTop 重置）。

### Changed（间距收敛 + 圆角统一）
- **区域交界间距 30px → 20px 统一**：v8 原「Tab/搜索/胶囊/Hero → 卡片 30px 视觉分组」对工业后台过大（用户反馈「模块纵向间距还是有点大」），一律按卡片叠 20px（gap16 + margin-top:4px）紧凑处理。`RULES.md §10.4` + `template.css §4.5` 同步（含瓷片区，全部区域交界并入统一规则）。
- **圆角系统统一（卡片禁 16px 弹窗级）**：`.mcard`/`.m-hero`/`.m-kingkong`/`.mbtn-lg-android` 原误用 `--radius-lg`(16px，弹窗级) → 一律 `--radius-md`(8px)，iOS 覆盖 `--radius-card-ios`(10px)。`MASTER.md §4` 新增「圆角系统铁律」：卡片状容器禁引用 `--radius-lg`，16px 仅保留 Modal/FAB/搜索框；`DESIGN-TOKENS.md §五` 注释同步。

---

## [1.7.1] — 2026-08-05 · 列表项嵌套降级规范（消除双重卡片）

> 触发：设备群览页视觉验收反馈「带阴影的双重卡片，太多层级，不符合克制原则」——`.mcard`（群组卡，白底+阴影）内嵌 `.mlist-double`（设备项，也是白底+阴影）叠出双层卡片。反向推导：规范只定义了列表项「卡片形态」，**缺失嵌套上下文降级规则**。

### Added（规范规则缺失）
- **`RULES.md §4.3` 新增「列表项嵌套降级」**：`.mlist*` 直接嵌在卡片状容器（`.mcard`/`.mcard-b` 等）内部时，必须降级为扁平行——去 `box-shadow` / 去独立 `border-radius` / 去卡片背景（`background:transparent`），相邻项改用 `border-top:1px solid var(--n4)` 分隔线；**禁止卡片套卡片 / 双层阴影**。容器级列表（`.screen`/`.page-view` 直接子级）保持卡片形态不变。
- **`template.css` 实现**：`.mcard .mlist*`、`.mcard-b .mlist*` 嵌套降级（去阴影/圆角/背景、去左右 padding、相邻 `border-top` 分隔线、首项无 border）。

### Changed
- 反例固化：`.mcard` 内 `.mlist-double` 双层白底+阴影（用户 2026-08-05 反馈）→ 新规范降级为扁平行 + 分隔线（设备群览页复盘案例，见 RULES §4.3）。

---

## [1.7.0] — 2026-08-05 · 间距分类修正 + 图表 X 轴标签区规范（页面缺陷反哺规范）

> 触发：设备群览页视觉验收反馈 ① 瓷片区→产能趋势卡间距 30px 太大 ② 柱状图 X 轴时间标签与柱体底部重叠。反向推导规范根因后沉淀，**先改规范、再按规范重新生成页面**。

### Fixed（间距分类错误）
- **瓷片区/金刚区（网格宫格型容器）从「区域交界 30px」拆出，归「卡片叠 20px」**：瓷片区是卡片状容器集合（`m-po-item` 卡片形态），与后续卡片交界按 `gap16 + margin-top:4px = 20px`，不再按线状组件（Tab/搜索/胶囊）的 30px 区域交界。`RULES.md §10.4` 表格 + 克制间距体系表同步拆行；`template.css §4.5` `.m-porcelain + .mcard{margin-top:14px} → 4px`（双选择器）。

### Added（图表布局规则缺失）
- **`RULES.md §9.7 图表布局规范（Chart Layout）`**：SVG 纵向三段式 = 绘图区 + 标签保护区（≥8px）+ X 轴标签区（≥16px）。公式 `viewBoxH ≥ 最高数据元素高 + 8 + 16 + 8`；柱底/折线最低点 `y+height ≤ viewBoxH − 23`；X 轴标签基线 `y = viewBoxH − 6`；chart-box 高度 = viewBoxH（1:1 不缩放）；禁柱体/网格线/目标线伸入标签区、禁标签与柱体重叠、禁标签触 viewBox 底；附自检清单。
- **`template.css §8.5` 图表段注释**同步补纵向三段式约束。
- **`GENERATION-SOP.md 步骤 4.5`** 补移动端 viewBox 纵向三段式条目（与既有右侧边距规则对称）。

### Changed
- 反例固化：柱底 `y+height=126` + 标签基线 `y=122`（重叠）→ 新规范 `柱底 ≤ 114` + `标签 y=124`（设备群览页复盘案例，见 RULES §9.7）。

---

## [1.6.0] — 2026-08-02 · M1–M5 动效补全（@keyframes 原语库 + 组件 transition + checkMotion 门禁 + motion 契约）

### Added
- `template.css` @keyframes 原语库补到 **11 个**：`spin`/`pulse` + `fade-in`/`fade-out`/`float-up`/`float-down`/`slide-in-right`/`slide-out-right`/`scale-in`/`scale-out`/`shimmer`（仅 opacity/transform，shimmer 为 background-position 特例；与 Web 端同构同值）。
- **9 个 `.anim-*` 工具类**（duration/easing 全部走 token）：`.anim-fade-in/.anim-fade-out/.anim-float-up/.anim-float-down/.anim-slide-in-right/.anim-slide-out-right/.anim-scale-in/.anim-scale-out/.anim-spin`。
- **组件 transition**（对标 Web 语义，全部 fast + ease-out）：`.mbtn`（background/color）、`.mtab`（color/border）、`.mlist`（background）、`.msearch`（border-color）、`.mtag`（background）。`.mmodal` 保持纯显示。
- **`prefers-reduced-motion` 无障碍降级**：`@media (prefers-reduced-motion: reduce)` 全部 transition/animation 归零。
- **`checkMotion` 门禁**（`validate-spec.js`，与 Web 端镜像，对所有页面生效）：transition 时长裸数字秒 → HIGH；animation 时长裸数字秒 → MEDIUM；`0s/0ms` 白名单；`var(--motion-duration-*)` 通过；@keyframes 块内部不扫。
- **`components.json` motion 契约字段**：button/tag/list/search/tabs（transition）。modal 纯显示无动画，note 注明。
- **修复批次 H 遗留缺陷**：`.mtag-*:hover` 引用仅在暗色定义的 `--*-hover`/`--run-dis` 变量，限定 `:root[data-theme="dark"]` 作用域（亮色行为不变，消除悬空声明）。

---

## [1.4.0] — 2026-07-30 · B 包字阶 + 等宽 + 密度 + bottom-nav

### Added（等宽 + 密度 + bottom-nav）
- `typography.fontFamilyMono` = `'JetBrains Mono','SF Mono',Consolas,...`（B 包新增，对标 AntD fontFamilyCode + Polaris mono）。`page-template.html` 注入 `--font-mono`。用于工控数据/代码；数值对齐用 `tabular-nums`。
- `density` 节：移动端只 `comfortable` 基准（rowHeight 56，对标 M3 48dp+ 触达）；`compact`/`spacious` = null 不启用（移动端密度债待后续评估）。`page-template.html` 注入 `--density-row-height`/`--density-content-padding`。
- `shadows` 节补 `bottom-nav`（值双层复合 `0 -4px 4px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,94,174,0.08)`，与 page-template/生成器对齐；A 包 BLOCKED #3 解决）。

### Note（字阶）
- 移动端字阶保持 android/ios 双套（9 级，H1=26-28），B 包不对齐 Web 13 级命名（移动端字阶结构差异属存量，待 W2 选型后统一）。

### 门禁
- `validate-spec.js page-template.html` → 0 HIGH；`ci-local.js` 全绿 69 pass。
- `validate-spec.js` 补 A 包缺口：`elev-*-shadow` dual-layer 检查 + density 存在检查。反向验证 5/5 红→绿。

### 引证
- `TOKENS-EVIDENCE.md` 补 7 条（字阶 3 + 密度 2 + 等宽 2）。

---

## [1.3.0] — 2026-07-30 · A 包国际化升级（elevation/motion + shadow 双层复合）

### Added（elevation 5 级 + motion）
- `tokens.json` 新增 `elevation` 节：5 级 sunken/default/raised/overlay/overflow，每级 surface 色 + shadow 配对（对标 Atlassian 5 级 + Material 3 层级递进；移动端 shadow 发丝线保留品牌色调 rgba(0,94,174,*)）。
- `tokens.json` 新增 `motion` 节：duration 4 档（instant 100ms / fast 200ms / normal 300ms / slow 400ms）+ easing 5 条 cubic-bezier（两端同名同构同值）。
- `page-template.html :root` 注入 `--elev-*`（10 变量）+ `--motion-*`（9 变量）。
- `MASTER.md` §5.1 elevation 场景表 + §5.2 motion；`components.md` Elevation 引用规范；`DESIGN-TOKENS.md` §七/§八 新节。

### Changed（shadow 升级双层复合）
- `tokens.json` 的 `shadows` 节 s/m/l 新增 `value` 字段（双层复合 CSS 真源），保留原参数化字段做溯源。s/m 保留品牌色调 rgba(0,94,174,*)，l 黑柔光 + 品牌色调发丝线。旧名保留，引用方零改动。
- `page-template.html :root` 的 `--shadow-s/m/l/bottom-nav` 值同步升级双层；生成器优先用 `value` 字段输出。

### 门禁（validate-spec.js 只加不删）
- 新增 `checkRootVars`：elevation/motion 新 token 组在 :root 存在、shadow 双层（rgba≥2）、duration 白名单、easing 合法 cubic-bezier。仅对 page-template.html 生效。旧 contract 零删除。
- 反向验证 4 种改坏 → 均 HIGH exit 1 → 还原 0 HIGH。

### 引证 + 校验
- 新建 `TOKENS-EVIDENCE.md`（仓库根）：8 条国际对标引证。
- `ci-local.js`（仓库根）：全绿 exit 0（58 pass / 0 fail）。

---

## 迁移指南：阴影视觉升级为双层（设计审查清单）

> 升级后阴影由单层变为双层复合（柔光层 + 1px 品牌色调发丝线）。设计审查时逐项核对：

- [ ] **视觉对比**：按钮/卡片/弹窗阴影是否变"更清晰有层次"，且保留品牌色调（发丝线 rgba(0,94,174,*)）。若觉过重，检查同屏 raised 数量。
- [ ] **引用零改动**：组件 CSS 用 `var(--shadow-s/m/l)` 等的，值自动升级，无需改代码。确认无组件硬编码旧单层 shadow 值。
- [ ] **新组件优先 --elev-\***：新增浮层用 `--elev-overlay`，可移动卡片用 `--elev-raised`，flat 卡片用 border 无阴影。`--shadow-l` 与 `--elev-overlay` 强度对齐可互换。
- [ ] **暗色待 C 包**：本包仅亮色值；暗色属 C 包。
- [ ] **门禁接入**：`validate-spec.js` 已对新 token 组强制检查；命名必须 `--elev-{级}-surface/shadow`，否则门禁报 HIGH。

---

## [1.2.1] — 2026-07-28 · Modal 修复 + spec 对账修正

### Fixed
- `page-template.html` 弹窗 Modal：`.mmodal` 宽 375→**343 + margin auto**（对齐落位宽）；圆角改**仅顶部** `16px 16px 0 0`（底部弹出面板）；`.mmask` 改 `position:absolute;inset:0;z-index:10` 正确盖全屏；`.mmodal` 加 `overflow:hidden`。`components.json` modal `referenceCss` 同步。

### Changed（Ardot 对账后 spec 修正 4 项）
- 去掉移动端**文字按钮**类型（anatomy/states/variants/referenceCss/referenceHtml/variantMapping 全清，Ardot 实际无此类型）。
- button 补 `Button/小/次按钮B` 子集说明；单行列表 variantMapping 补「更多图标」；modal variantMapping 涵盖三项弹窗。
- bottomnav `ardot.variantMapping` 更新：「是否有文字 × 选中，共 4 变体」（用户已在 Ardot 完成合并）。
- `components.md` 新增「列表 List 三态结构（明细）」节（单56/双116/三101 子结构）。

### Note
- v1.2.0 的「跨端功能色语义差异」已消除：Web 端 v1.4.0（2026-07-28）把 `--suc/--warn/--err/--run` 统一为**背景色**语义，两端一致；色值仍分治（移动端 #10B981 / Web #389E0D）。

---

## [1.2.0] — 2026-07-28 · Token 命名统一（移动端生成器）

### Added
- 新增 `scripts/generate-design-tokens-md.js`：读 `tokens.json`（值真源）→ 重生成 `DESIGN-TOKENS.md`（短名），与 `components.json` / `page-template.html :root` **1:1 对齐**。
- 生成器支持 `--check`：CI 同步校验，drift 即 `exit 1`（不写盘），为后续 pre-commit / CI 门禁（任务③）预埋。

### Changed
- `DESIGN-TOKENS.md` 全部 `--color-*` 长名重构为短名（`--primary` / `--n1`…`--n10` / `--suc` / `--warn` / `--err` / `--run` / `--radius-*` / `--shadow-*`），旧长名废弃（仅头注说明）。
- `components.json` `meta.tokensSource`、`components.md` 命名约定、`README.md` 文件地图：更新"待统一"描述为"已统一 v1.2.0"。

### Known Differences（已知，待后续统一）
- ~~**跨端功能色语义**：移动端 `--suc` 等=背景色，Web 端=前景色~~ → **已于 2026-07-28 统一**（Web v1.4.0 改为背景色语义，见 v1.2.1 Note）。

---

## [1.1.0] — 2026-07-28 · 组件规格层（机器 SSoT）

### Added
- `components.json`：11 组件结构化 spec（navbar / bottomnav / button / tag / list / card / modal / search / tabs / status-dot / icon）+ `contract` 26 条机器可校验硬约束（驱动 `validate-spec.js`）。
- `components.md`：人读镜像（平台差异表 + 契约摘要 + Ardot 对账）。
- `validate-spec.js`：合规扫描器（移动端调色板，`#10B981` 合法、禁 Web `#389E0D/#FA8C16/#F5222D`），HIGH 违反 exit 1。
- `page-template.html`：可克隆起始模板（375 骨架 + 343 落位 + 11 组件，零硬编码非 token 色），经校验 0 HIGH。
- `README.md`：写入"起手先 clone 模板"铁律 + 交付前门禁步骤。

### 关键平台差异（固化进规格层）
- 按钮/标签/列表标题字重 **Medium 500**（Web 按钮 Regular 400；移动端小按钮例外 400）。
- 成功绿移动端 **#10B981 合法**（Web 用 #389E0D）；运行/在线绿 #16A34A 两端共用。

---

## [1.0.0] — 2026-07-07 · 基础规范

- 初始交付：`MASTER.md` / `DESIGN-TOKENS.md`（长名）/ `tokens.json`（40 变量）/ `RULES.md`（决策树 + §8 防溢出黄金法则）/ `pages/*.md` ×5 / `design-system-showcase.html`。
- 品牌色 `#005EAE`；运行绿 `#16A34A` 跨端共用。
