# 弘讯B端视觉系统 · 设计系统更新日志（CHANGELOG）

---
> 📦 历史条目已滚动归档：web 归档 `[1.9.27]`（2026-09-10）及更早见 [`CHANGELOG-archive.md`](CHANGELOG-archive.md)（2026-09-22）。

---

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
## [规范展示页框架升级] — 2026-11-03 · 对齐当前 page-template 框架（语言切换 / data-species / i18n）

- `web规范展示_框架版_20260806_1050.html`（及其分享版）框架外壳升级到当前 `page-template.html` 规格：顶栏新增**语言切换**（.lang-sel 面板：简体中文 / English + 6 个待支持语言）与 `data-i18n` 标记（首页 / 管理员 / 修改密码 / 退出登录 / 全屏）、`<body data-species="document">`；移植框架 i18n JS（语言面板开合 + 文案替换 + localStorage 记忆）。
- 页面内容与真源 token 未改；分享版按当前 `template.css` 重新内联生成。真源未改（仅人读展示页 + 产物）。
## [产物刷新] — 2026-11-03 · 分享版规范展示页 / USAGE 分享版按当前真源重建

- `web规范展示_框架版_20260806_1050_分享版.html` 与根目录 `USAGE_分享版.html` 重新生成：内联**当前** `template.css`（含 1.9.46 登录页 v2 类与 `--radius-control` 等新 token），并删除 dev 页内冗余「内联 :root 变量（2026-08-06 同步）」副本——重复定义会压住真源新值（真源未改，仅产物刷新）。
- 分享版属构建产物（门禁以 dev 态为准）；本轮产物内容审计 `audit-spec` 0 HIGH。
## [1.9.46] — 2026-10-30 · 登录页 v2（白卡浮层 + 手机号密码 + 卡外系统名）

- 新增 token `--login-card-w:400px` / `--login-card-pad:40px` / `--login-hero-feather:160px`（tokens → map-tokens → globals → template 全链路重生成）。
- 新增 `.login-*` 18 类 + `.login-lang`（卡外右上语言，白底版触发器）+ `.input-lg`（40 高）；`input.size` 契约高度放开 **32/40**。
- 新契约 `login.card.width`（`.login-card` 宽 400，HIGH）。
- `RULES §1.1b 登录页` 整段改写：58/42 分栏、系统名卡外、手机号+密码、卡内 3 步找回、暗色豁免。
- 参考实现 `output/登录页v2_参考实现.html`：4 视图（登录 / 找回 3 步），`?view=r1|r2|r3`、`?state=error|locked|caps` 深链；validate **0 HIGH**（1 MED 图标库）。
- 提示词模板 **v3.2**：diorama 五段式，「4:3 生成 → 裁 1:1」，交付强制「默认模板 + 行业映射模板」两份。
- 默认图 `login-hero-default.webp`（2160²，373KB；@1x 92KB），源 `login-hero-default.png`；羽化 **160** 定稿。
- 手机号区号 `.login-cc`（112×40，默认 +86，12 地区，选项带 16×12 国旗 data-URI）；数据驱动可扩展。
- 密码眼睛**双态图标** `.ico-off/.ico-on`（`aria-pressed` 驱动）；连续输入框间距 16。
- 找回密码 3 步：`.steps` + 验证码 60s 倒计时 + 两次密码一致性校验。
- 登录三态：`.input.is-error` 字段错、`.login-alert` 表单错/锁定、`.login-hint` CapsLock。
- 阈值（用户追认）：`template.css` 62000 → **64500**（实测 554 条规则零重复，无可安全回收冗余）；`components.json` 72455/77200 未超线。
- 规范收口：登录段压缩（1710→约 1000 字符）；`DESIGN-TOKENS §7.7` 补 3 个 login token；`vendor-coverage` 清 `.login-prefix`。

## [1.9.45] — 2026-10-20 · `.tag` 物理删除 + 全库迁移（用户追认）

- **删除 `.tag` 组件**：`template.css` 移除 `.tag/.tag-suc/.tag-warn/.tag-err/.tag-run/.tag-def` 及 hover/disabled 规则；`components.json` 删除 tag 组件条目与 `tag.size` 契约、两处 selector 去 `.tag`；`DESIGN-TOKENS §7.3` 改为「标签 Badge」规格；组件数 22 → **25**（-tag +empty/steps/timeline/descriptions）。
- **迁移**：`web规范展示_框架版_20260806_1050.html` 与其分享版共 **22 处** `class="tag tag-*"` → `badge badge-*`（tag-def → badge-muted），分享版内联 `.tag*` CSS 同步删除；文档（RULES ×5、VISUAL-SPEC、packages/web-ui/README）同步为 `.badge`/徽章。
- **体积上限追认**（用户 2026-10-20 确认）：`components.json` 77200、`template.css` 62000、`components.md` 16800、`DESIGN-TOKENS.md` 15600。
- **焦点环不做**（用户 2026-10-20 决策）：现 20% primary 环保留，理由「视觉上无问题，符合科技克制的设计哲学」；`--focus-ring` 与 11 处 focus 规则维持原状，HANDOFF 不再列为待办。

---
