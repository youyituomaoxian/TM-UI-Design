# 弘讯B端视觉系统 · 设计系统更新日志（CHANGELOG）

---
> 📦 历史条目已滚动归档：web 归档 `[1.9.27]`（2026-09-10）及更早见 [`CHANGELOG-archive.md`](CHANGELOG-archive.md)（2026-09-22）。

---

## [登录页：品牌区去 logo + 背景图 1:1 口径] — 2026-11-13
- RULES §1.1b 登录页：卡外 `.login-head` **不放 logo**，仅「系统名 24/32 + 副标题 13/20」一组（组内 4、与登录卡间距 24），左沿与登录卡左沿对齐。
- RULES §1.1b 背景图：58/42 左栏内使用 **1:1** hero（`object-fit:cover` + `object-position:50% 50%` + 羽化 160），明示**禁 2.2:1 宽图硬撑竖栏**（本次实测裁切错位的真因）。

## [真源归位 + SVG 空图形门禁 + .content--fill 用法入规范] — 2026-11-12
- **规则归位**：一屏撑满/分页器贴底/页头间距/标题竖条等**布局类规则**从 `components.css` 迁到 `framework.css`（组件文件只留组件；避免加载顺序与职责混淆）。
- **新门禁 `svg.invalid`（HIGH）**：`<svg>` 内无 path/circle/rect/line/polyline/polygon/ellipse/g/use/text/image 时拦截——实测坑：把 path 的 d 数据当文本写入，图标"有盒子无图形"。
- **RULES** 列表页规格新增「`.content--fill` 用法」三步（content--fill → card--fill → is-placeholder 补位），明示禁 `calc(100vh - N)`、嵌层须补 flex 链。

## [一屏撑满 / 表格填充 / KPI 图标卡：页面 hack 收敛进真源] — 2026-11-12
- `components.css` 新增真源契约：`.content--fill`（内容区纵向 flex，页头固定 + 末卡吃剩余高）、`.card--fill .pager{margin-top:auto}`（分页器恒贴底）、`.table tr.is-placeholder`（补位空行保留分割线）、`.stat-card--compact`（紧凑 KPI）；随 `build-template-css.js` 生成 `template.css`。
- `validate-spec.js`：① `table.pager.required` 由字面量 `class="pager"` 改为词元正则（分页器带附加类不再误报）；② 新增 `template.css.stale`（HIGH）：页面链接的本地 `template.css` 副本与真源 sha256 不一致即拦——此前真源改了、副本没同步，导致「间距又出现」。
- RULES 新增「一屏撑满契约」；页面侧删除 `.fill-*` 私有类与 `calc(100vh - N)` 自算高度，改用真源类。

## [F10/F11/F12：扫描盲区 + MEDIUM 分档 + 截图证据门禁] — 2026-11-12
- `audit-spec.js`：inline style 支持单引号/无引号（原只认双引号，实测全漏）；新增 `css.js.injected`（MED，脚本内 `style./cssText/innerHTML/<style>` 注入）；`audit-rules.json` v1.8.0（M-10 + R-08）。
- `audit-batch.js`：MEDIUM 分「必修/提示」（台账 `mediumMust`/`mediumAdvisory`）；新增 `scripts/audit-shots.js`：P3 截图矩阵验收（缺图/占位图 exit 1）。
- `AGENTS.md` 压缩 5,895→3,968（重复内容指向 HANDOFF/RULES），上限 5,900→4,500。


## [F1/F3/F4：P0 页面清单 + P3 截图证据 + DoD 升级] — 2026-11-12
- P0 改为「先出页面清单再盘点」（`audit-batch --list` 枚举全项目 + `--json` 台账带覆盖率，<100% 即 P0 未完成）；P3 强制截图落盘 `output/audit-shots/<页面>/<theme>-<state>.png`（缺图=该格未审）；P4 DoD 由「0 HIGH」升级为 **「0 HIGH + 台账全绿」**。
- 同步交付线：AGENTS 门禁条、USAGE-GUIDE 路径二、README、团队使用指南、标准提示词模板——**「0 HIGH」单独不再构成交付**。


## [F9：同色不可见 / 近同色门禁 + 存量改造边界] — 2026-11-12
- 新增 `contrast.invisible`（HIGH）/ `contrast.near-invisible`（MEDIUM）：同一选择器内 `color` 与 `background` 解析为同色 → 拦截（白字白底类）；`:disabled/.is-disabled` 豁免。`audit-rules.json` v1.6.2→**v1.7.0**（M-09 登记）。
- **存量改造边界**写入 SOP §② 铁律 6：只改表现层（色彩/字阶/间距/圆角/图标/组件外观），禁改文案与信息项、字段与数据口径、交互流程与功能行为；台账模板 + 标准提示词模板同步。
- 回归：双端模板 24/4 MED 不变；夹具白字白底→HIGH、近同色→MED、`:disabled` 不报。移动 `validate-spec.js` 上限 67,800→69,500（实测 68,956；仅留 0.8%，下轮优先拆 helper 回收）。


## [F7：token 未定义判定并入真源] — 2026-11-12
- `token.undefined` 定义集改为「真源 template.css → 外链 CSS → 内联」三级级联：仓库外页面 link 的真源 CSS 原被 `REPO_ROOT` 边界丢弃 → 合法 token 全判 HIGH（假阳性洪水），进而被 `var(--x, 兜底)` 掩盖。
- 回归：双端模板 24/4 MED 不变；仓库外夹具 2 HIGH→0；`var(--nope)` 仍 1 HIGH。方案 `output/F7-token定义源修复方案_20261112.md`。


## [门禁映射补全 + mobile page.regions] — 2026-11-12
- 新增 `gate-map.json`：29 条 [硬] 叶子节 → validate/audit 门禁人工映射（web 17 / mobile 12）；`sync-index` 合并进 `rule-index`，`check-reach` 增死链校验（validate 规则名 + audit id 必须真实存在）。
- 移动端 validate 新增 `page.regions`（MEDIUM）：首页范式缺列表区 / 导航栏缺透明状态栏即报（RULES §9.6）；`[硬]` 叶子节 33 条 **100% 有门禁映射**，R3 **0 WARN**。

## [硬规则再分级：30 条不可机检章节转 [软]] — 2026-11-12
- 按「[硬] = 可机检」口径复核 64 条无门禁 [硬] 章节：30 条无机器门禁（输入/Tag/列表状态、平台/字段/组件参考表、检查清单等）转 [软] 并进「按需检索」；mobile §2/§3 容器章保留 [硬]，改由子节覆盖判定（check-reach R3）；mobile §9.6 保留 [硬] 待补页区域门禁。
- 结果：硬叶子节 34 条 / 已映射 4 / 待映射 30（候选映射批次，见 `output/硬规则门禁分诊_20261112.md`）；check-reach 0 FAIL / 1 WARN。

## [容量维护批：三资产上限重定 + 加载预算 40k] — 2026-11-12
- 机器资产上限按实测 + 分级余量重定（六步留痕）：`audit-rules.json` 24,000→25,900（23,991 + 8%，>10k 档）、`template.css` 67,000→70,000（66,636 + 5%，>50k 档）、`components.json` 77,200→80,000（76,640 + 4.4%）。三者由门禁/构建消费，非 Agent 阅读面；**下次再调须附回收记录**。
- 加载预算口径改为「入口 + 规范包」：AGENTS 5,890 计入，web 37,870 / mobile 37,115 ≤ 40,000（94.7% / 92.8%）；`rule-index.json` 加载计划与 SOP §0 同步。
- 验收：干净环境 `ci-local` **103 pass / 0 fail**；DSH 沙箱内 101/3 为子进程管道限制（非回归）。
- GENERATION-SOP：清 2 段历史过程注记（-380 字符），上限 44,300→45,000（全文非 Agent 加载面，仅 §① 进包）；USAGE_分享版按当前 `template.css` 全量重建（108,799 字符，零外链）。

## [规范可达性 P1：软规则分级 + 零语义回收] — 2026-11-12
- `[软]` 分级补全：RULES「必读清单」新增「按需检索」行（§0.3/§1/§1.1/§1.2/§1.1c/§2.2 不列为缺读事故）；`rule-index.json` 双端 39 条软规则 **0 条 unset**，check-reach R3 由 WARN 转 PASS。
- RULES 零语义回收：清除 63 处括号内历史日期（`（2026-xx-xx …）` → `（…）`），**净回收 647 字符**（日期清理 680，分级行 +84、标点修整 -51）；规则文本与语义未改，日期留痕在 CHANGELOG。
- 阈值按可读性预算重定：RULES 53000 → **55000**（加载集 31,994/35,000 由 check-reach 守；文件上限降为膨胀告警，不再当质量判据）。
- HANDOFF 为本地交接文件，移出 check-size 清单：**不设体积阈值、不参与加载预算**，已完成任务归档到 CHANGELOG。
- 验收：check-reach **0 FAIL / 1 WARN**（[硬] 64/75 未映射门禁，逐批补）；ci-local 101 pass（3 项沙箱故障沿用）。

## [规范可达性 P0：索引生成 + 可达性门禁] — 2026-11-12
- 新增 `sync-index.js`：按标题实测重写双端 RULES「章节索引」表（生成物），并生成 `rule-index.json`（114 条规则路由：id/端/层级/硬软/行/字符/必读级/门禁映射 + 3 个加载计划）。索引从 47k 失真值校正为实测 53k；各章字符数同步实测。
- 新增 `check-reach.js`（已入 ci-local，阻断）：R1 索引 0 漂移；R2 加载集实测（web 32240/35000、mobile 31225/35000、交接 19065/20000）；R3 [软] 11 条未分级 / [硬] 64 条未映射（WARN，逐批补）；R4 引用 541 处 0 断链；R5 入口链齐全。
- 修正 RULES 标题缺陷：web 重复 `## [硬] 2` 两处、mobile `### [软] 1.2` 行内重复；两处均属锚点歧义，零语义变更。
- check-size 登记 3 新文件；阈值按实质增长重测：check-size.js 7500→8000、ci-local.js 18200→18600。ci-local 增 1 项 → **101 pass**（3 项沙箱子进程故障沿用）。
- 依据：用户 2026-11-12 拍板「先建可达性门禁、不先拆/压 RULES」；方案见应用侧 `output/规范可达性治理方案_20261112.md`。

## [分层页头紧凑间距真源化] — 2026-11-12 · DS-20261112-04 消费
- 拍板 8/12 回灌真源（方案 b 紧凑变体，基础形态默认 16 不变）：components.css 新增 `.breadcrumb--compact`（面包屑→标题 8=--space-sm）、framework.css 新增 `.page-head--compact`（标题行→tab 行 12=--space-md），build 进 template.css；vendor-coverage gaps 登记 page-head--compact；components.json breadcrumb 条目同步（variants/tokens/referenceCss/do）；RULES §1.1b 拍板行补变体指针并归位压缩；audit-rules.json feedback_log 登记（六步第 1 步）。移动端无同名类无双端项。ci-local **102 pass / 0 fail**。

---

## [64 方标 logo 入库] — 2026-11-12
- assets/logo/ 新增 logo_64.svg（viewBox 64×64 方标，viewBox 合规）；RULES §0.1a 方标档「待补」→ 已入库，M-08 真源清单同步。⚠️ 配色（#456fec→#00c6ff 渐变 + #ffba24/#ffe39e 黄）偏离 VI（主色 #005EAE / 橙 #FA8C16 仅点缀），改色待用户拍板。
## [品牌 logo 规范 + 资产门禁 M-08] — 2026-11-12
- RULES §0.1a 新增：logo 一律 SVG 强制（assets/logo/ 真源：asset-logo-brand.svg 彩标 / asset-logo-brand-white.svg 白标），锁高宽自适应（viewBox 168.76×43.9，禁写死宽高比）；尺寸分级 = 顶栏 32 白标 / Web 登录 40 彩标 / 移动登录 64×64（方标资产待补）；MASTER.md「logo 40×40」旧值同步修正（原与 RULES 高 32 冲突）。
- validate-spec.js 新增 `logo.asset.format` / `logo.asset.missing` 双 HIGH（展示页/_框架版/USAGE 豁免）；page-template.html 顶栏占位符替换为真源白标 logo、页面 CSS 宽 32→auto。audit-rules.json v1.6.2 登记 M-08；check-size validate-spec.js 阈值按实测现值 +5%（>50k 档）重测并行内留痕。
## [内页页头结构 + 二级分段器] — 2026-11-12 · 两层 tab 方案 B 拍板
- 新增真源组件 **.seg 分段器**（utilities.css → template.css）：容器 N3 底胶囊高 30（item 26/字 12/圆角 15），选中 primary 实底 + var(--text-on-brand) 白字 500，动效走 motion token；语义 = 内容视图切换，与 .filter-chip（数据过滤）禁混用。components.json 登记组件条目 + 契约 `seg.size`（高 30 HIGH，exclude .item 防派生规则误扫）/ `seg.active`（字重 500 HIGH + 底 token MEDIUM）；vendor-coverage tokenProjection 登记 seg/tab-row。
- 新增真源布局工具 **.tab-row**：两层 tab 内页一级 tab 行 = .tabs 左 + .page-actions 右同行底部对齐，行底线统一、tab 下划线压线。
- RULES §1.1b 新增「**内页页头结构**」：基础形态（无 tab：标题+操作区同行，真源默认间距）/ 分层形态（面包屑→页标题→一级tab行→二级seg→卡片）；分层页头紧凑间距 8/12/16/16（用户拍板：页头收紧为内容让空间）；红线 = tab 最多两层、二级禁进卡片、seg/filter-chip 语义互斥。
- 契约红→绿验证：真源默认值 0 HIGH；height 28/weight 400/#999 底 → seg.size+seg.active 双 HIGH。ci-local **102 pass / 0 fail**。视觉演示页（方案 A/B）在应用侧 output/，未入库。

## [面包屑固定形式] — 2026-11-12 · 去 N5 底改纯文本（用户拍板）
- 真源 `.breadcrumb` 取消 N5 底条带/圆角/水平 padding（components.css → template.css build），固定为**无底纯文本**：32 高保留、› 分隔、item N9/当前 N11、下方间距 16 不变；components.json 组件条目同步（summary/tokens 删 --n5/--radius-base/sizing paddingH 0/variants 改「基础（无底纯文本）」/dont 由「无底色纯文本导航」反转为「加底色/边框/圆角胶囊」）；RULES 面包屑铁律/列表页变体 B/详情页 3 处文字对齐。移动端无同名类无双端项。ci-local **102 pass / 0 fail**（check-size 触发 RULES 超 25 字符，按归位治理压缩今日条款文字消除，未调阈值）。

## [表格占位行真源化 + 表头口径清漂] — 2026-11-12 · DS-20261112-01/02 消费
- **表格承载形态拍板（方案 1 堵灰区）**：RULES §1.1b 新增条款——列表页/详情页表格一律卡片式承载，变体 A「全宽表格」=全宽卡片（白底+Shadow-Card+圆角 8），**禁裸表格**；密度用 行高/分页/列宽预算消化。零新增组件，门禁不变。
- **DS-02（组件缺口）**：RULES §4.4 第 4 条定义的 minRow 占位行 `tr.table-placeholder` 落地真源——utilities.css 新增 `.table-placeholder{pointer-events:none}`（td 提示文案 N8）并 build 进 template.css（L1060）；components.json 契约数组登记 `table.placeholder`（pointer-events=none，HIGH）；vendor-coverage.json tokenProjection 登记（31 项）。应用侧 `表格规范展示.html` 页内临时定义已回滚，validate-spec + audit-spec 双跑 0 HIGH。
- **DS-01（文档口径冲突）**：2026-10-20 表头改版（14px/44px）未同步人读文档——RULES §3.3b L468（13px→14px、删「不得统一字号」旧原则句）、§1.1b L204 / §2.1 G6 L713 / 交付清单 L722 / 门禁说明 L667（表头 48→44）；components.json 弃用 table 条目 summary/sizing.fontSize/referenceCss/ardot.variantMapping/notes/do 六处 48→44、13→14。文档现与契约 `table.head`（44/14/500/N2）完全一致。
- 验证：ci-local **102 pass / 0 fail** 全绿（含 check-sync 检查三新类登记）；修复样例红→绿双向复测通过（DS-01 样例 A/B 依据契约现值成立、样例 C grep 旧值清零）。

## [作业树 · 自身页+子级 折叠态] — 2026-11-09
- 新增第三分型：`data-page` + 子级 → 折叠弹浮层，首项「进入本页」(`data-self`)；page-template JS/CSS（`.pop-self`）；RULES §0.2-10 / components.md/json / SOP 同步；门禁 `tree.node.split` 改为「data-page+子级须含 data-self」；示例页恢复该分型。

## [门禁：折叠半迁移 + 暗色品牌覆盖] — 2026-11-07
- 新增 `tree.collapsed.partial`、`dark.brand.override`（双端）、`tree.popover.order`；`gen-examples` 品牌覆盖只留亮色 + `.tag→.badge`；历史品牌页清理 2387aa ×4。

## [暗色固定主题] — 2026-11-06 · 暗色不随品牌（方案 A）
- `darkBrandMode:"fixed"`：暗色 background 固定、不随品牌推导（`derived` 保留旧能力）；`--brand-surface` `#0A2540 → #1E293B`（= 卡片色），内容 `#121826`，主色固定 `#3B82F6`；框架三边 1px `.07` 分区线；双端 tokens / globals / template 重生成；DARK-MODE / SOP / VISUAL-SPEC 同步；ci-local 加「换品牌暗色不变」断言。

## [作业树折叠浮层 P1-P7] — 2026-11-06 · 折叠态只显一级 + 二级浮层
- RULES §0.2-10；折叠态只显一级（`.tree-collapsed` 兼容旧页）；`.tree-popover` 浮层；`.branch-active` 展开 8% / 折叠 18%；`data-group/data-page/data-key`；page-template JS；tree.tsx `collapsed`/`onGroupClick`；AdminLayout 浮层；check-size 调阈。validate 0 HIGH + tsc 通过。

## [文档死链与口径清漂] — 2026-11-05 · 说明文档对齐现行规范

- 登记说明文档（根 + 双端）机检漂移，修 15 处：①死链——TOKENS-EVIDENCE.md（文件已移除，9 处引证改「对标引证文件已移除」）、web RULES 机器群览页示范、mobile RULES dashboard.md §2、components.md design-system-showcase :root 改指 template.css、CHART-SPEC 两处已移除测试文件标注（ci-chart-interaction.js 属 §9 待办登记，保留）；②口径——团队使用指南「模板 ×7」更正「两级通用+4 专用」；GENERATION-SOP 分享版口径改「重建后 audit-spec + validate-spec 双跑 0 HIGH 分发」。
- 真值核对：图标 web 185 / 移动 184、版本 1.9.46 / 1.14.28 一致；USAGE-GUIDE 所引 packages 脚本实测存在，未改。ci-local 100 pass / 0 fail。
## [USAGE 使用指南内容同步] — 2026-11-05 · 提示词逻辑对齐现行 SOP / 审计口径

- USAGE.html（dev + 两份 USAGE_分享版）提示词内容同步到当前真源口径：审计卡完整版改「audit-spec 台账 + D-1~D-12 逐维对照 → 逐项映射决策 → 分批修复 → validate-spec 双跑收口」（旧版仅 validate 逐条修，已废止）；迁移卡完整版改「SOP §② 五阶段（P0 台账 → P1 映射 → P2 修复 → P3 截图审查 → P4 收口）」；完整版提示词统一补 SOP §0 加载纪律（≤35k 只读命中章节）与问题上报口径（templates/设计系统问题报告模板.md）。
- 资产地图补 tokens.json / audit-rules.json / audit-spec.js 3 行（13→16 条）；「提示词模板 ×7」更正为「两级通用 + 4 个专用（共 6 个）」；FAQ 新增 data-species 条目；分享步骤改「重建后 audit-spec + validate-spec 双跑 0 HIGH 再分发」；新增「环境路径 · 从克隆到使用」节（CLI Agent / WorkBuddy / 网页版 AI 三条上手套路 + 导航项）；body 补 data-species="document"。
- 页面布局类与真源未改；分享版按当前 template.css 重新内联重建（仓库根 + 讲解展示页两副本，仅横幅注释差 2 字符）。门禁：ci-local 全绿；validate-spec dev 与两份分享版 0 HIGH（仅文档页自建布局类 MEDIUM，设计如此）；audit-spec dev / 分享版 exit 0。
## [规范展示页图表合规] — 2026-11-03 · 系列色 / 折线纵向覆盖 / 4px 网格

- `web规范展示_框架版_20260806_1050.html`（及分享版）：SVG 系列元素绘制色由语义色 `--warn` / `--primary` 改为图表色 `--chart-wisdom-purple` / `--chart-tech-blue`；折线静态 points 拉伸至纵向覆盖 ≥70%（CHART-SPEC §3，上下对称）；主题按钮尺寸改 4px 网格（30→32px / 10→12px）。页面层修复，真源未改。