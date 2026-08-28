# 弘讯B端视觉系统 · 设计系统更新日志（CHANGELOG）

---

## [1.9.21] — 2026-08-28 · V12 六缺陷：外部生成页实战暴露的系统层修复（订单总览V2）

> 背景：另一智能体用最新设计系统生成「订单总览V2」页——首份外部实战样本。组件层 8 项新守则全部被正确使用（filter-chip/badge-row/table--fixed/chart-grid/mono 兜底/i18n JS），但暴露 6 个系统层缺陷，本轮全数闭环：

- **A1 fold-gate 判定盲区（漏报根治）**：旧判定只查「stat-grid 后首个 grid12」——V2 用裸 .card 排首屏直接绕过（表格卡被切 49% 门禁报 0）。修：判定改**通用口径**——content 内所有 .card 凡「起点在可视底边之上、终点越过底边」即报，次屏（起点在底边下）豁免。正反验证：V2 报出 订单列表 51% ✓、老订单页 0 切 ✓
- **A4 table.fixed.no-budget（HIGH）**：.table--fixed 无列宽预算（th 无显式 width、无 colgroup）→ 拦截——fixed 只锁分配算法不锁总宽，V2 实测照样撑出 1308 vs 1120 横向滚动。V10 宽表守则的机器化落点
- **A6 btn.variant.no-base（HIGH）**：.btn-* 变体（primary/secondary/text/ghost/danger/outline/link）脱离 .btn 基类单独使用 → 拦截——布局全在基类（inline-flex+gap6+height32），落单即退化（V2 实测 15 处图标文字上下排列）。Button SSoT 的「变体必须带基类」补锁
- **A3 图表 x 轴标签组件化（SSoT）**：新增 `scripts/chart-x-labels.js` **renderChartXLabels()**——从 polyline points 反解数据点 x，标签与数据点共用同一坐标系（absolute+left%+translateX(-50%)+端点钳制），**禁页面自绘标签行**。x 标签「两套坐标系」缺陷连续两代页面复犯（V2 实测 delta -54/+36px、「7月」叠「客单价」）；组件注入实测 delta 归零 0/0。配套 RULES「图表底部结构顺序」硬规则（SVG→x-labels→legend→summary 四层独立行）
- **A5 滚动列表条数无界禁令（RULES）**：等高行内条目数不定的列表卡必须 .scroll-fixed 定高滚动（窗口 ≤6 条 + 其余进抽屉），禁裸渲染无界条目——V2 预警卡 20 条裸渲染把等高行撑到 1152px，同排环形卡拉出 ~930px 死白
- **A2 金额类 KPI 列数/字号守则（RULES）**：stat-num--lg 金额主值 KPI ≤6 列（单卡 ≥180px）；7–8 列等分降 stat-num--md 或数值+单位分离；卡宽 <160px 触发 stat-sub 逐字竖排同样降档——V2 的 8 卡等分 130px 装不下 ¥3,486@28px
- **验证**：ci-local 97 pass / 0 fail；fold-gate 新口径正反例通过；x 标签组件注入 delta 0/0

---

---

## [1.9.20] — 2026-08-27 · V11 首屏预算守则（用户原则拍板：滚动自由、切点只落 gap、核心区块禁截断）

### Added
- **V11 RULES §4.4c 首屏预算守则（七条款）**：A 预算公式 `= 视口高 − 120`（768→648/900→796/1080→960，实测三方验证，禁硬编码）；B 页面类型 × 首屏构成矩阵（看板/列表/详情/表单各有核心定义）；C 首屏行规则（禁叠加行、flex 弹性与预算闭环）；D minRow 冲突裁决；E 超预算裁决顺序（精简头部→收敛→移次屏→接受滚动并标注）；F 切点自查；G 生效范围（新页面即日、存量不回溯）。
- **V11 GENERATION-SOP 步骤 3.5「首屏预算规划」**：生成 IA 前必做预算核算 + 裁决 + 交付切点自查。
- **V11-T5 运行时门禁落地（提前执行）**：新增 `scripts/fold-gate-web.js`（Playwright + 系统 Chrome，浏览器不可用自动 SKIP）——判定看板页（含 stat-grid）主图行（stat-grid 后首个 grid12）内每卡完整在 content 可视底边内，次屏行不查（滚动形态豁免）；ci-local 新增接入段（**一期信息性不计 fail**，观察误报后另议阻断）。实测三看板页全过（辅机 3 卡/订单 1 卡）。**负例验证**：剥 hx-lang 副本被 template.i18n.missing HIGH 拦截 ✓（新门禁首版在 stripScriptTags 后找 JS 指纹的乌龙已修——指纹必须查原始 html）。

### Fixed
- **V11 订单总览按守则适配（示范页）**：① 通知行（40px）删除，三条业务提醒降级为**页头副标题行内嵌 mini 徽标**（保留 id/数据填充/点击筛选行为）；② 图表行重排——趋势卡升 **col-12 全宽**（box 定高 228，首屏预算内）、机型分布与预警中心降次屏 **col-6 + col-6**（消除叠加行与右空位）；③ 图例行与汇总行**合并单行**（省 55px）。实测：首屏内容 772px 预算内（764），**视口底边精确落在趋势行底与次屏之间的 gap——核心区块零截断**。
- **V11 趋势图 aspect-ratio 全宽爆炸修复（执行教训）**：`chart-svg--fill` 的 `aspect-ratio:16/9` 兜底在**全宽容器**（1152px）下推出 648px 固有高、把行撑到 766——兜底比例在宽容器会反向爆炸。解：全宽独行场景 box 用**定高**（`chart-box` + 页面级 `--chart-height` 覆盖 228），不用 `--flex`（无等高兄弟、无死白风险，与 V8b 不冲突）。**教训：模式迁移必须盘点旧模式配套参数**（PB=42 底部预留同批回收：42→8，消除 102px 死空间）。

---

## [1.9.19] — 2026-08-27 · V10：--chart-grid 暗色网格 token + 宽表列宽预算 + 行内菜单 fixed 定位 + 多语言 JS 移植（订单总览页第二轮实战）

### Changed
- **V10-① 新增 `--chart-grid` token（治暗色分割线消失，对比度 0 实锤）**：亮 `#EAEAED`（`colors.chartGrid`）/ 暗 `#3E4C63`（`dark.colors.chartGrid`）——原网格线用 `--n5`，dark N5 恰等于暗色卡片表面色 → 暗色下网格全灭。真源 `.chart-grid` 改用新 token；`--chart-grid` 独立于 `colors.chart` 数据系列调色板（NEW-006 引擎逐项锁定约束，放 chart 内会破坏 8 色序列——初版踩坑已纠正）。map-tokens 亮/暗双块映射 + DESIGN-TOKENS 文档 + page-template 内联同步。
- **V10-② 宽表列宽预算（RULES 新增）**：≥8 列或含宽内容列的宽表**必须 `.table--fixed` + 全部 th 显式 width 百分比**（合计 100%），禁裸 auto 放任 min-content 溢出；fixed 下长文本配 ellipsis；`.table--fixed` 补 `border-collapse:separate;border-spacing:0`（collapse + 百分比列宽的 Chromium 幻影 2px scrollWidth）。
- **V10-③ 行内浮层菜单 fixed 定位（RULES 新增）**：表格操作 ⋯ 下拉禁 absolute 展开——overflow:auto 容器内 absolute 面板撑宽 scrollWidth（「点击操作按钮后出现横向滚动条」根因），用 fixed 定位（JS 按按钮坐标计算）。订单总览已按此修复，实测面板视口内、滚动条消失。
- **V10-④ 多语言切换 JS 移植**：page-template 的框架 i18n IIFE（DICT/LANGS/apply/绑定）在克隆生成页时**丢失**（DOM 齐全、JS 缺失 → 语言切换无效）。订单总览已移植恢复（实测切 English：顶栏 Home/Admin、htmlLang=en、localStorage 持久化）。**脚手架/克隆流程需排查 lang JS 注入缺口**。
- **V10-⑤ 趋势图数据逻辑重构（用户拍板：双量纲共轴无意义 + 数据失真）**：① 删「订单数量」第二折线（万元 vs 台归一化共轴后两线近乎重合、对比无意义），改单系列金额——数量保留在汇总行与数据点 tooltip；② 三组时间序列数据从「完美单调递增」改为带波动的真实形态（真实订单必有涨跌）；③ `ys()` 纵向改 min-max 归一映射（viewBox 12–88%，覆盖 76% 满足 `chart.line.vertical`）——原按 max 比例直接映射导致数据挤上半区、下半区空网格。RULES 图表结果约束新增第 3 条「禁不同量纲共单轴」+ 数据业务常识要求。
- **V10-⑥ 月份标签与数据点对齐（用户红框实战）**：数据点 x 在绘图区 X0–X1(10.5%–94.3%)内均布，标签是 flex **全宽**均分（首格中心 6.3%）——两套坐标系错位。修复：标签改 absolute + `left = xs(i)%` + `translateX(-50%)`，容器 `relative` 定高，实测对齐 delta = **0**。
- **V10-⑦ `.pg` 补 background（治暗色分页器文字不可见）**：真源漏设 background → button UA 默认浅灰底(#F0F0F0)在亮色恰好像设计效果、暗色暴露（浅底 + 暗色亮字 #F1F5F9 = 对比度趋零）。补 `background:var(--n1)` 亮暗自适应（暗色深底 #1E293B + 亮字）。button 类组件 audit 注意：凡未显式设 background 的 button 在暗色都会踩同雷。
- **V10-⑧ content 滚动条统一细样式（用户拍板）**：纵向滚动条=框架 G8 设计（`.app` 100vh 固定 + `.content{overflow:auto}` 内容区滚动），非 bug；样式统一 **thin/悬停加深**（scrollbar-width:thin + webkit 8px/n6→n7 悬停，与侧栏树「滚动条视觉隐藏」条款同族）。RULES 显式化「≤12 列表格禁滚动条（预算内消化）」条款至表格主规格段（源头：常见问题表 L313「>12 列才横向滚动」+ 检查清单「无元素超出父容器」，原分散未被遵守）。
- **V10-⑨ 表格徽章组间距 + td 垂直呼吸（用户红框实战）**：① 徽章组裸 span 堆叠无间距——真源 `.badge-row` 组件早已存在（flex wrap + gap 8）但执行未用，新增 `.table .badge-row{margin-top:0}`（badge-row 本体 margin-top:12 是卡片底部语义，td 场景清零）；② `.table td` 垂直 padding `0 → 8`——行高自适应（多行内容）时上下贴边无呼吸；单行 td 行高仍由 `height:44` 保证**不变**，多行行高收敛 **"+N" 折叠已实施（V10-B2 用户拍板 b）**：徽章最多显 2 个 + "+N"（title 悬停看全，详情抽屉有完整清单），行高统一 91/99 双行节奏——选配窄列 badge 竖排（每 badge 宽 > 列内容宽）是 11 列预算下的信息密度物理形态，非缺陷。RULES 宽表指引同步「表格内徽章组必须 badge-row + td 垂直 padding 8」。**归因：组件存在未用（执行）+ td 无垂直呼吸（真源缺陷）各半**。
- **验证**：ci-local 93 pass / 0 fail；实测暗色网格 #3E4C63 可见、表格 fixed 1120 无横向滚动、x 标签归位无重叠、多语言切换正常。

---

## [1.9.18] — 2026-08-27 · V9 四连：mono 中文兜底 + 入场动画层叠地雷排除 + 筛选 chip 组件 + 弹性归属细则（订单总览页实战）

### Changed
- **V9-① `--font-mono` 栈补中文兜底（治「万」字宋体）**：栈尾追加 `'Source Han Sans CN', '思源黑体'`——mono 场景中文字符（KPI 单位「万」、JS 拼接文案）不再落 monospace 泛型（Windows = 宋体衬线），自动落黑体；数字/符号仍走西文等宽。根因：栈尾只有 monospace 泛型，中文无字形命中。全量页面自动修复。
- **V9-② 入场动画层叠地雷排除（治下拉被 KPI 遮挡）**：**Chrome 行为**——fill 含 forwards/both 时，动过 transform 的元素动画结束后 computed 永远返回 identity matrix（即使 underlying=none）→ 挂 `.anim-float-up` 等入场类的区块成为**永久 stacking context**，区块内 absolute 浮层（下拉，z 再高也被封印）被 DOM 靠后区块整体盖住（角色下拉被 KPI 卡遮挡实战）。修复双管：① `float-up`/`slide-in-right`/`scale-in`/`list-in` keyframes 省略 to 的 transform（结束回归基准）；② 入场类 fill `both → backwards`（结束不保留帧，transform 归 none，结界消失，视觉不变）。退场类（float-down 等，配 display:none）与 toast-in（to 为功能性定位）不动。实测：page-head/stat-grid transform → **none**，面板上下缘 elementFromPoint 均命中自身。
- **V9-③ 新增真源组件 `.filter-chip`（治筛选各页各造）**：数据范围/快速过滤专用互斥胶囊（高 32/圆角 round/字 13，选中 `.on` = primary-dis-bg 底 + primary 边框 + 500）。真源曾缺此组件 → 辅机总览自造 ord-chip、订单总览误用页签 `.tab`。RULES 列表页规格同步：**数据范围筛选禁用页签（tabs=导航语义）**。components.json 新增契约。
- **V9-④ V8b 弹性归属细则**：吸收者**只能是图表本体**——图例行/汇总行（`.metric-row`）一律 `flex-shrink:0` **禁 flex:1**（订单总览实战：metric-row 被拉到 356px 死白，弹性职责安反 = 死白转移非消灭）。
- **验证**：ci-local 93 pass / 0 fail；订单总览页实测——趋势卡 chart-box 320→589（弹性吃满）、metric-row 356→87（自然高）、面板点击命中自身、mono 栈含中文兜底、chip 交互正常。

---

## [1.9.17] — 2026-08-27 · V8 环形容器解耦 + V8b 等高行图表弹性吸收守则

### Changed
- **V8 `.chart-box--ring` 与基类定高解耦**：`--ring` 加 `height:auto`——环形容器高由内容（自带尺寸的 SVG 环）决定，与 `.chart-box` 基类 `--chart-height=320`（canvas/ECharts 渲染锚点）彻底解耦。**与基类连用从此安全**，误挂不再产生 320 定高大空白。实战背景（辅机总览页，Playwright 实测 1440×900）：160 环装 320 容器，容器内上下各空 77/83px；移动端真源 `--ring` 自带 height:200，Web 端环尺寸多样（160/240）故取 auto 更通用。
- **V8b 等高行图表弹性吸收守则（用户拍板：居中是均分死白不是消灭死白）**：等高行内一切图表内容容器**必须弹性**（`flex:1 1 auto` + `min-height` 保底）、**禁止定高**——SVG 拉伸型折线用 `.chart-box--flex`（+ 页面级 `--chart-height` 覆盖压保底）、HTML flex 柱状区用 `flex:1;min-height:Npx`、环形卡用「环上 + 图例纵排下」布局自然填满（环 SVG 保留固定等宽高属性保证**正圆不拉伸**）。实测（辅机总览行1）：行高 449→402，三卡底部死白 57/107/0 → **0/0/0 全归零**，环形正圆。
- **新增 `.card-body--center`**：`display:flex;flex-direction:column;justify-content:center`——**降级为文字类卡片兜底**，图表卡禁用（中间方案：环形卡居中后上下各 ~85px 仍违反内边距语义，被 V8b 取代，类保留供非图表场景）。与 `--scroll` 互斥。
- **文档**：RULES §4.4b 第 3 条补 V8 解耦 + V8b 弹性守则；components.json chart-box 契约同步。
- **V8c 拉伸 SVG 禁数据点 + 图表文字显式锁字体（用户实战反馈）**：① 守则升级——`preserveAspectRatio="none"` 拉伸 SVG **禁放一切需保形元素**（文字+数据点圆标，r=1.6 圆实测被拉成 10.9×8.7 椭圆），数据点一律 HTML 叠层（absolute span，left/top 百分比与 polyline 同源，天然正圆）；② `.chart-x-labels`（曾漏显式声明：字号错继承 body 14px、字体靠继承链——暗底细灰字渲染发虚被误读为衬线）等 5 类图表文字（x-labels/caption/hl/legend-item/metric-label）**显式锁定** `var(--font-cn)`/`var(--font-mono)` + x-labels 12px，兑现「显式 font-family 锁定黑体家族」守则。
- **验证**：ci-local 93 pass / 0 fail。

---

## [1.9.16] — 2026-08-26 · 图表 SVG 1:1 回退修复 + 表格列宽变体 + 真源-产物漂移回写（19 项）

### Changed
- **V6 图表 SVG 1:1 回退修复**：`.chart-svg--fill` 加 `aspect-ratio:16/9` 兜底——阻断 auto 高度链（`.chart-box--flex` 置于 `.card--fill` 等 auto 高度容器）下 SVG `height:100%` 无基准 → 回退 viewBox 1:1 爆炸；`.chart-box--flex` 前置条件文档化（确定高度容器，auto 高度链须用定高 `.chart-box`）。
- **V7 表格列宽分配**：新增 `.table--fixed{table-layout:fixed}` opt-in 变体——fixed 下按 th 显式 width 分配、无宽度列等宽均分，避免 auto 布局把剩余宽度全给最长文本列（「项目」列 67% 挤压其余列）；长文本列对 th 设 width 百分比（如 30%）、操作列建议 ≤12%。
- **🔴 真源-产物漂移回写（19 项）**：template.css 是 build 产物（真源 = packages/web-ui/src/styles/ 四件 CSS + map-tokens.js 从 tokens.json 生成），历史上有大量「直接改产物不回写源」的手写补丁。build 后暴露并回写：**6 个 token**（`--focus-ring`/`--mask`/`--shadow-data-hover`/`--topbar-subtitle-fg`/`--topbar-sep-bg`/`--text-on-brand`）+ **13 个排版类**（`.t-display`/`.t-h1~h5`/`.t-body1/2`/`.t-caption`/`.t-label`/`.t-overline`/`.t-link`/`.t-mono`）。
- **token 真源闭环**：`--chart-height` 从 tokens.json `layout.chartBoxHeight` 映射（map-tokens.js 补映射，此前是产物手写）；3 个固定值（`--mask`/`--topbar-subtitle-fg`/`--topbar-sep-bg`）补进 tokens.json；DESIGN-TOKENS.md 自动生成补 7 个 token 文档（generate-design-tokens-md.js）。
- **page-template.html 内联 :root 同步**：补 `--focus-ring`/`--mask`/`--topbar-subtitle-fg`/`--topbar-sep-bg`（template.root.sync 校验）。
- **验证**：ci-local 93 pass / 0 fail（build 曾暴露 91/2——19 项漂移被冲掉导致 USAGE.html HIGH 6，回写后恢复全绿；output/ 历史归档 HIGH 合计 60→21，token.undefined 全消）。
- **教训**：改 Web 端样式必须「改源（四件 CSS 或 map-tokens.js）→ 跑 map-tokens.js + build-template-css.js → 跑 ci-local」，禁止直接改产物 template.css。

---

## [1.9.15] — 2026-08-25 · 门禁加固：文档图标计数门禁 + RED-003 升级阻断

### Changed
- **P0-1 文档图标计数门禁（治文档漂移）**：ci-local.js 新增 `iconCountAssertions()`——逐行解析双端 MASTER/RULES 的「图标库/图标集/Icon … N 个」声明，与 `icons/` 目录实际 SVG 数比对，漂移即 fail。正则限定图标语境（避免误抓「~38 个独立组件」等组件计数），逐行取首个声明（一行写双端数字时以首个即本端总数为准）。
- **P0-2 RED-003 升级为阻断**：根目录 *.html 由「信息性」升级为硬门禁（任一 HIGH 即 fail）。前提核实：NEW-001 假阳性已在 validate-spec.js L624-628 彻底修复（类名判定分两级），当前根 USAGE.html / USAGE_分享版.html 实测 HIGH 0。
- **output/ 历史归档扫描（信息性不阻断）**：分层决策——output/ 是历史产物（规范效果验证_20260807 实测 HIGH 17），非新交付标准，硬阻断会对历史欠账误红；交付物 0 HIGH 才是门禁本义。
- **文档数字对齐**：MASTER.md「图标集 Icon 196 个」→ 185 个（2026-08-14 换新后，以目录为准）；RULES.md 图标库「84 个：B 端特有 14 + 通用 70」→「185 个，分类明细见 icons/icons.md」。
- **验证**：ci-local 86 → **93 pass / 0 fail**（新增 7 项断言：P0-1 六项 + RED-003 阻断一项）。

---

## [1.9.14] — 2026-08-12 · 内容布局多样化（布局模式库）+ 分页器/面包屑修复 + 顶栏暗色切换

### Changed
- **顶栏多语言切换（框架级双语，2026-08-12 拍板）**：framework.css 新增 `.lang-sel` 系列（半透明胶囊下拉，同 theme-btn 视觉）；page-template 顶栏末位（暗色后）加语言下拉——简体中文（默认）/ English 可切换，日本語/한국어/Deutsch/Français/Русский/Español 置灰待支持；**框架级双语字典**（`data-i18n`/`data-i18n-title` 顶栏/底栏文案 + localStorage `hx-lang` 记忆，业务文案后续扩展）；`icons/language.svg` 手绘入库（B 端特有 16→17，共 199）；生成器 webPage 同步 + 7 测试页注入。RULES §0.1/§0.2 顶栏顺序加「语言」。
- **顶栏 logo 占位符 + 亮暗按钮去胶囊（2026-08-12 拍板）**：framework.css `.topbar-logo` 高度固定 32（`.topbar-logo .ico{width:auto;height:32px}` 宽度自适应）+ page-template logo 加占位注释（后期替换项目 logo）；删 `.theme-btn` 胶囊背景（半透明圆角），亮暗按钮回退 `.topbar-item` 默认（纯图标、hover 降透明，与全屏/退出一致），HTML 同步删 `theme-btn` 类。
- **作业树去菜单分类（2026-08-12 拍板）**：page-template 侧栏删 group-title 分类标题（生产监控/运营管理），顶级 tree-node（注塑车间/设备中心/运营中心/生产管理）直接并列；RULES §0.1 侧边栏 + §0.2 规则 8/9（并列 group-title → 顶级节点并列）同步；AGENTS/SOP 同步；7 测试页清理。
- **布局模式库（用户拍板：框架/组件锁死、内容区构图开放）**：RULES §1.1b 重构为「必含区块 + 布局变体 A/B/C」（列表/详情/看板）+ 构图开放性总则 + 面包屑铁律（有父级路径必带）；SOP 步骤 5 新增「布局模式库」章节（Web 7 区块 + 移动 5 区块模式 + 选择路由表 + 论证式自造出口 + 示范页）；6 个同框架多样化示范页（`output/布局多样化测试/`：顶筛全宽表 / KPI 2×2+图告 / 图表主导+侧摘要 / 左右分栏 / 页签表单 / 左筛右表）。
- **分页器**：门禁 `table.pager.required` 2500 字符窗口缺陷修复（列多/行多表格误报缺 pager，实测工单列表 pager 距表格 2876 字符）→ 改「本表格后至下一表格前」区间；RULES §1.1b 分页器规则（>5 行完整 `.pager` / ≤5 行尾部统一「共 N 条」复用 `.pg-tot` / 明细表豁免）。
- **面包屑**：真源 `.breadcrumb` 改 **32px 高 + N5 底条带**（兑现 RULES §1.1b/§6.1「Breadcrumb 条 32 N5 底」规格）；margin `--space-lg` 24 → `--space-base` 16（页头组内档，§4.3 补录）。
- **纵向溢出根治**：utilities.css `.col-* > .card` min-height:0 → **auto**（兑现 §4.4 文档承诺，表格/时间轴等定高内容不再溢出卡片）。
- **顶栏暗色切换按钮（2026-08-12 拍板，推翻 2026-07-31「模板不内置切换」）**：framework.css 新增 `.theme-btn` 半透明胶囊；page-template 顶栏「全屏」后加「暗色模式」按钮（moon/sun svg + `data-theme` 切换 + localStorage 记忆）；RULES §0.1/§0.2 顶栏顺序加「暗色模式」。
- **附录 B 双模式**：亮暗双映射（2a 亮色 `:root` + 2b 暗色 `:root[data-theme="dark"]` 块，palLight/palDark 各调一次）；C 段改「暗色骨架深色（framework.css 已兑现 `.topbar/.sidebar/.footer → var(--brand-surface)`）」。
- **克隆流程**：SOP 克隆清单 3→6 件（补删 head 展示样式 `<style>` 块 + link 相对路径层级）；两端 RULES 视觉自检截图 `--virtual-time-budget` → `--timeout`（不驱动 CSS 动画）。
- **5问/6问统一**：两端 RULES 软规则清单「布局决策 5 问」→「6 问」（与 SOP 一致）。
- **验证**：ci-local 86 pass；6 测试页 + page-template 门禁 0 HIGH；森绿 #2E7D5B 双模式页实测（亮色森绿 / 暗色深绿黑 #020604）。

---

## [1.9.13] — 2026-08-07 · 图标库收编三阶段 + Web 图标重画替换（144 全量）

### Changed
- **三阶段收编（2026-08-07 拍板）**：① page-template 图标全部来自 `icons/` 库（克隆源根治，stroke 1.8 统一）② RULES §0.2 作业树业务化（结构零改动、节点文本/分组/选中态随业务）+ §7.9 图标守则（图标一律从 `icons/` 取，库缺才手写并上报）+ SOP/AGENTS/标准提示词模板入口 ③ validate `icon.source` 门禁（MEDIUM：内联 SVG path 未命中库即报，page-template/USAGE/规范展示页豁免）。
- **图标重画替换**：用户 Figma 重画 144 个（线性 stroke 1.8 / viewBox 24 / currentColor），`icons/` 全量更新；page-template 重跑换库（19 svg 43 path 全命中）。
- **icons.md 索引对齐**：头部 84→144（129 与移动端同源 + 15 Web 特有），批 3 补全 71 个缺失登记（144/144）。
- **USAGE.html v3 活泼版**：品牌渐变 Hero + sticky 锚点导航 + 需求卡搜索/一键复制（线性图标 + 已复制反馈）+ 批量派发卡 + FAQ 折叠 + 资产地图徽章。
- **图表规范补齐（执行 Agent 上报）**：结果约束新增第 9 条「网格线水平范围限于绘图区」（两侧 y 轴刻度标签留白 ≥20、不贯穿贴边；y 轴刻度与网格线同高对齐但水平错开）——CHART-SPEC §2/§3 + Web RULES §9 + 移动 RULES §9.7 + 移动自检同步；顺带清 `docs/examples/web-图表自适应测试.html` 死引用（文件已不在工作区）。
- **字体守则（用户实测：衬线回退 + Agent 改字体"验证已改事实没改"）**：① 双端 `--font-cn` 栈补 `"Microsoft YaHei","微软雅黑"`（Windows 兜底，根治宋体衬线回退；Web 真源 globals.css rebuild）② validate 双端新增 `font.family` 门禁（MED：页面自造 CSS 写具体字体名即报）③ RULES 双端「字体守则」：字体只用 token 栈、tabular-nums 仅限纯数字、**headless computed font-family 会误判"已改"（无用户系统中文字体）——字体改动须真实浏览器渲染核对** ④ SOP/AGENTS 执行路径同步。
- **验证**：page-template 0 HIGH、ci-local 86 pass、截图图标纤细 1.8 无异常。

---

## [1.9.12] — 2026-08-07 · 克隆框架三层机制（P1+P2+P0）：跳过克隆从提示变为门禁拦截

> 事故：外部 Agent 多次跳过克隆 page-template.html 框架直接自搭 HTML（SOP 已写但不执行）。按用户拍板（P1+P2+P0 全上、P0 报 HIGH、存量不管、`.topbar+.sidebar` 即视为 B 端需框架）落地。

### Changed
- **P2 脚手架**：`scripts/new-page-web.js` / `new-page-mobile.js`——克隆 page-template → 目标 output/（命名防覆盖）+ CSS link 修正（同盘相对/跨盘警告）+ 注入克隆凭证 `<meta name="x-template-clone">`。
- **P1 门禁** `template.clone.missing`（HIGH）：B 端框架页（`.app+.topbar+.sidebar`）/ 手机壳页（`.phone`）缺克隆 meta → 拦截。
- **P0 门禁** `framework.fingerprint`（HIGH）：Web 框架 8 件套（app/topbar/sidebar/tree/collapse-btn/main/content/footer + 顺序）、移动 7 件套（phone-stage/phone/m-statusbar/navbar/screen-scroll/page-view/bottomnav + 顺序），缺件/错序 → 拦截。
- **豁免**：page-template.html、USAGE.html（文档页）、规范展示页（`*规范展示*`/`*_框架版*`/`*展示页测试*`）。
- **流程**：标准提示词模板第零步改脚手架命令；GENERATION-SOP 步骤 4 升级 V4.0（脚手架优先 + 克隆三件事）。
- **验证**：ci-local 86 pass；正例（脚手架）双端 0 HIGH；负例（删 meta / 删 footer）双双 HIGH 拦截；展示页/agent-starter/USAGE 零误报。

---

## [1.9.11] — 2026-08-07 · 卡片高度诉求：定高卡 vs 弹性卡（§4.4b + scroll-fixed + 门禁）

> 事故：注塑机实时监控看板——趋势大图卡（弹性）与报警列表卡（仅 max-height）并排，`col-* > .card{flex:1}` 行等高把滚动卡拉伸成空洞。归因：执行层空间预判盲区（LLM 无法预渲染），规范未表达「卡片高度诉求」维度。

### Changed
- **RULES §4.4b（新）**：卡片按内容确定方式分「定高卡 / 弹性卡」；同行组合铁律（定高配定高、弹性配弹性；混排 → 定高卡套 `.scroll-fixed`；禁仅 `max-height:100%` 对抗行高）。
- **真源 utilities.css**：新增 `.scroll-fixed{height:320px;overflow-y:auto}` 定高滚动容器（build:template 后入 template.css）。
- **门禁 `scroll.container.height`（MEDIUM）**：页面自造滚动类（overflow-y:auto/scroll）无 height/固定 max-height 即报；inlineClone 豁免。
- **流程**：GENERATION-SOP 布局决策 5 问→6 问（追加「高度」）+ 软规则自查表「空间预判四查」；CHART-SPEC §3 补弹性/定高卡条款；移动端对称（RULES §8.3 + validate 同构门禁）。
- **验证**：正例（.scroll-fixed 写法）门禁 0 误报；负例（旧写法不定高）被 `scroll.container.height` 精确拦截；看板页已按 §4.4b 修复（报警卡 scroll-fixed + 列表充实），截图确认空洞消失；ci-local 86 pass。

---

## [1.9.10] — 2026-08-07 · 阅读策略改造：RULES 事故记录迁移（只迁事故，保留现役约束）

> 本次把 `RULES.md` 中的「事故记录」（何时发生/症状/根因）迁移至此，RULES 只保留规则正文 + 门禁名 + 设计理由。事故对应的现役约束位置见各条末尾。

### 事故记录（Web RULES 迁出）

1. **侧栏折叠按钮漂移**（§0.2-6）：旧版 `position:sticky` 折叠按钮随作业树滚动漂到内容流末尾。根因：sticky 定位随滚动容器移动。现役约束：折叠按钮固定右下角（flex-shrink:0 + 高 44 + z-index:2），作业树单独 flex 滚动区。
2. **KPI 图标黑图标 bug**（§0 工具类清单）：SVG 图标渲染成黑色。根因：在 `<svg>` 上直接写颜色覆盖了 `currentColor`。现役约束：SVG 一律走 `currentColor`，禁止在 svg 上写颜色。
3. **th.num 右对齐失效**（§3.3b，2026-08-06 实测）：给表头加 `.num` 类仍左对齐。根因：`.table th` 的 `text-align:left` 特异性（0-1-1）高于 `.num` 的 `right`（0-1-0）。现役约束：真源 `.table th.num{text-align:right}` 显式覆盖 + 契约 `table.head.num-align` HIGH。
4. **中文表头回退宋体**（§3.3b，2026-08-06 用户实测）：表头「计划数/完成数」在真实浏览器被回退到宋体（衬线），与其余表头黑体不统一。根因：`.num` 的 `font-variant-numeric:tabular-nums` 在系统装有衬线字体时触发字体特性回退（headless 无衬线字体无法复现、computed style 全一致）。现役约束：表头 `th.num` 必须 `font-variant-numeric:normal`（真源写死）+ 契约 `table.head.font`。
5. **机器群览页 3 类执行级缺陷**（§3.7，2026-08-04 实测）：按钮文字竖排截断 / 5 张 KPI 第 5 张掉行 / 折线图未撑开。根因：CSS 真源已就位、HTML 没按契约组 DOM。现役约束：`btn.label.required` / `stat-grid.count.match` / `chart.svg.fill` 三条 DOM 契约门禁。
6. **chart-svg--fill viewBox 末端裁切**（§3.7-5，2026-08-04 实测）：viewBox `0 0 400` + 数据末端 `x=400`，`preserveAspectRatio="none"` 拉伸后被 card-body padding 16px 裁切（X 轴「21:00」变「21」）。现役约束：viewBox 右侧留 16-20px 内部边距（x 坐标 ≤ 宽-20）+ 门禁 `chart.svg.viewbox-edge` MEDIUM。
7. **跨模块间距失控**（§4.3，2026-08-04）：KPI 区与图表区 0 间距贴死 / 卡片间距失控。根因有二：① `.stat-grid` 无底部间距；② 旧 `.grid12>.card{margin-bottom:0}` 只匹配直接子，实际 `.grid12 > .col-* > .card` 两层嵌套归零失效。现役约束：stat-grid→grid12 24px、grid12 兄弟 16px（utilities.css 真源）+ `layout.module-spacing` / `layout.grid12-margin` 门禁。
8. **grid12 列内卡片高度不齐**（§4.4，2026-08-04）：表格数据不足（2 行）卡片缩到 240px、各列底部随机留白。用户裁定「col-* 内卡片先撑起来对齐、表格空数据用占位行」。现役约束：col-* 弹性容器 + card `flex:1` + minRow=8 占位 + `card.fill-in-grid` / `layout.table-minrow` 门禁。
9. **x 轴标签叠柱**（§9 结果约束 2）：x 轴标签与柱体重叠。根因：标签作为柱子子级定位。现役约束：标签独立行（flex 与柱同列宽对齐）+ 柱多自动跳显。

### 验证
两端 RULES 瘦身后页面门禁 0 HIGH；ci-local 86 pass。

---

## [1.9.9] — 2026-08-06 晚 · KPI 两版定稿 + 图表五要素/三对齐 + 顶栏补全 + 生成器对齐
### Changed
- **KPI 两版定稿**：标准版 stat-card--icon（回滚点布局：图标块 + 数字 + 底部行标题左/趋势右）+ 环形版 stat-card--ring 保留；删除简约版（--row/--mini 变体）；门禁 kpi.simple.forbidden 拦截简约版。
- **图表 CHART-SPEC 五要素 + 三对齐**：chart-grid / chart-bar+chart-v / polyline+dot / legend / x-labels；柱底基线对齐、柱区对称居中、chart-v 柱顶上方居中；chart-v 必须放 chart-box 内（门禁 chart.v.position 拦截，修复数值漂浮固定）；SVG var 必须真源 token（token.svg-var）；门禁 chart.baseline.align / chart.value.required。
- **图表并排**：grid12 col-7（折线）+ col-5（柱状）布局（生成器模板）。
- **表格分页器**：列表表格 >5 行必须 .pager（门禁 table.pager.required）。
- **顶栏补全**：管理员 / 修改密码 / 退出登录 / 全屏（对齐 page-template 顶栏）。
- **validate 修复**：checkOverride 加「与真源完全相同规则跳过」（页面内联 template.css 不再误报 css.override；canonMap 对比）。
- **生成器对齐**：gen-examples.js webPage/mobilePage 内联 template.css 自包含 + 输出 docs/examples/（7 个视觉预览文件 + README）。
- **移动暗色框架特例**（真源 template.css）：[data-theme="dark"] navbar/statusbar 用 bottomnav 同色（--n1/--n8），不用引擎提亮 --primary。

---
## [1.9.8] — 2026-08-06 · 页面类型规格并入 RULES §1.1b + 纯框架化 + 产出分离 + N=1 构建链
### Changed
- **pages/ 删除并入 RULES §1.1b**：6 个页面覆写文档删除，页面类型规格（登录/列表/详情/弹窗/看板）并入 `RULES.md §1.1b`；Agent 不再找近似模板，按规格自建。
- **示例页删除**：`pages/examples/` 删除（生成器保留 `brand-color-engine/examples/gen-examples.js`）。
- **page-template 纯框架化**：删 15 个 DEMO section，content 空壳 + 占位注释；规范展示由 `web规范展示_框架版_*.html`（移至端目录根）承担。
- **产出分离**：生成页落「用户项目」`output/`，不再落设计系统仓库；仓库根 `output/` 仅历史归档。
- **N=1 构建链恢复**：`packages/web-ui/src/styles/` 四件 CSS 为 `template.css` 构建真源（`node packages/web-ui/scripts/build-template-css.js`），build 产物与 template.css 逐字一致。
- **视觉更新**：输入框白底（n1）+ 聚焦描边、表头 48px、表格 th.num 数值列右对齐（表头 13/数据 14 区分）、pager 上下居中、图表卡纵向撑满。
- **Agent 入口**：新增 `AGENTS.md`（codex/通用）+ `.workbuddy/skills/tm-design-system/SKILL.md`（workbuddy）。
### 验证
两端 page-template + 展示页门禁 0 HIGH；ci-local 86 pass。

## [1.9.7] — 2026-08-05 · 拍板 5 项落地（status-dot 语义 + tokens 键集 + shadow-float + Low 加固）

### ① status-dot 机器状态独立语义
机器状态 = run/中性灰/err，不用 suc/warn。m-dot 增 .idle/.off/.offline；Web .dot-idle/.dot-off/.dot-offline；设备台帐"待机" warn→idle；RULES §11.11 语义表。

### ② tokens 解冻修补（T07-T10 + D-T2-16/17 + DEFECT-12）
dark.colors 补 secondary/link/chart；light functional 4 色补 softActive/disabledFg（亮暗键集对称）；statusRunning 补 bgDisabled/borderActive；map-tokens 加 :undefined→:inherit 守卫；radius.btnIos 6。map-tokens 重跑 + build:template + DESIGN-TOKENS + freeze。

### ③ shadow-float 废弃归 overlay
components.json dropdown/datepicker referenceCss → --elev-overlay-shadow（2 处 + varUsage 清理）；tokens shadow.float 保留 deprecated。

### ④ Low 安全加固批量放行
D07 搜索大小写 / D08 navigateBack 守卫 / D09 连点节流 / D13 rem 死代码——tsc 0 错误；卫生类 D10/D11/D12/D05 保持 BLOCKED。

### 验证
设备台帐/注塑机 HIGH 0；ci-local 86 pass；分享版重生成；BLOCKED 拍板记录入档。
