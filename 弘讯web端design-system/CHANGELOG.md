# 弘讯B端视觉系统 · 设计系统更新日志（CHANGELOG）

---
> 📦 历史条目已滚动归档：web 归档 `[1.9.27]`（2026-09-10）及更早见 [`CHANGELOG-archive.md`](CHANGELOG-archive.md)（2026-09-22）。

---

## [生成 SOP：信息层级 × 亲密性双原则（选字阶/间距前置对齐）] — 2026-11-13
- GENERATION-SOP 步骤 2 新增第 4 条双原则：**层级逻辑优先选字阶**（档位跟信息层级角色走，唯一入口 RULES §1.4；典型错位 = 一级 tab 落辅助档 / 内页标题误用模块标题档）+ **亲密性原则定间距**（间距是分组语义非装饰节奏，取值唯一入口 RULES §4.1；观感与数值不符先查渲染根因再动数值）。
- 来源：机器群览标题降级 + 间距排查案例复盘（用户拍板沉淀）。RULES/MASTER/template.css 机制本轮未改动（D1–D4 字阶/间距迁移另行拍板），本条为生成流程原则。

## [分享版快照重建 ×6 + 页头口径收尾（t-h1 → .page-title）] — 2026-11-13
- **内联真源重建**：重建 4 分享版（login / machine_alarm / machine_group / status_report）+ web规范展示_框架版_分享版 + USAGE_分享版——内联块替换为当前 template.css（tabs 14 / .card-grid / .table--sticky / 滚动条 n5 全部带入），机器群览分享版挂 .card-grid。
- **页头口径收尾**：machine_alarm / status_report 两 dev 页与三分享版页头 `t-h1` → `.page-title`（RULES §1.4 内页例外补漏改面）；4 dev 页 template.css 缓存指纹 bump v=20261113。
- components.md 字阶表补「页头标题 .page-title 18/26」行。

## [表格表头跟随立项：.table--sticky（容器内滚动）] — 2026-11-13
- 真源新增修饰类 **`.table--sticky`**（thead th sticky top:0 / z-5，约 3 行 CSS）：定高/弹性卡内长列表滚动时表头跟随；th 自带 --table-header-bg 不透明底满足 sticky 前提，暗色 token 自适应。
- 边界（RULES 表格规范 ⑦ / MASTER 表格节）：**仅限容器内滚动**（.scroll-fixed / .card-body--scroll / .table-wrap），**禁页面级 sticky**（分页红线）；可与 `.table--fixed` 组合横+纵双向。
- 表格规范展示页新增 ⑫ 示例（定高卡左右对照：无 sticky / sticky 各 12 行）。
- **实测补强（2026-11-13）**：sticky 表格**禁中间再套 .table-wrap**——其 overflow:auto 成为 th 最近滚动祖先、截断 sticky 生效范围（table-wrap 无纵向溢出时表头不粘）；纵向滚动容器直接包 table，或 .table-wrap 自身定高充当滚动器（横+纵双向 sticky 均生效）。

## [滚动条统一浅色化：全局 thumb n6→n5 + 滚动容器补真源样式] — 2026-11-13
- 修复：`.table-wrap`/`.card-body--scroll`/`.scroll-fixed` 原无自定义滚动条样式，吃浏览器默认深灰——补统一浅色滚动条（thumb **n5** #EAEAED、hover n6、track 透明、8px/圆角 4、Firefox scrollbar-color n5）。
- 全局降浅一档：`.content` thumb n6→**n5**、hover n7→n6。亮暗双主题均走中性 token 自适应。表格规范展示页 ⑩⑪ 滚动示例即为受惠场景。

## [内页页头字阶/间距口径 D1–D5 迁移（机器群览案例拍板）] — 2026-11-13
- **D1 字阶口径**：RULES §1.4 决策树后补「内页页头标题例外」——内页页头标题一律 `.page-title` 18/500，不走 .t-display/.t-h1（消除 28/18 双口径）；MASTER §2 Tabs 补字号行。
- **D2 一级 tab**：`.tabs .tab` 13 → 14px（body1 档，导航不低于正文；二级 .seg 维持 12）。
- **D3 紧凑间距**：标题→tab 行 12 → **4（xs）**，`.page-head--compact` margin-bottom sm8→xs4。
- **D4 渲染修正**：`.page-actions` 移除 margin-top 16（纵向堆叠遗留；横排页头把行高撑到 48px，小标题居中产生 ~11px 死空——2026-11-13 机器群览实测）。
- **D5 网格组合规则**：真源 utilities.css 新增通用容器 **`.card-grid`**（gap 供行距 + 直接子 .card margin 归零；.card 文档流 margin 与 grid gap 双计 → 行距 32 为左右两倍，2026-11-13 机器群览实测）；页面禁覆写 .card（css.override HIGH），改挂 .card-grid 类。
- 重建页 page_machine_group.html 同步：标题 t-h1 → .page-title、.mg-grid>.card margin 归零；预演覆写块清除。

## [audit-rules 零语义压缩：25,859 → 24,780（余量 41 → 1,120）] — 2026-11-13
- `audit-rules.json` 压缩 8 处长文案（change_policy / machine_rules[0][5][6].predicate / scope_note / report_quality_bar / consumption_model / maintainer_duty），**规则语义零改动**（判级、出口、六步、回执三件套、仲裁全部保留）。
- 复测：`audit-spec` 输出项数与压缩前一致（80 项 / 0 HIGH）；`ci-local` 103 pass / 0 fail；`check-size` 余量从 41 → **1,120**。
- `updated` → 2026-11-13；版本号保持 1.8.0（无语义变更）。

## [默认长 logo 换新：asset-logo-brand.svg → 彩色长标 391.84×125.13] — 2026-11-13
- 默认彩标（浅底用）`assets/logo/asset-logo-brand.svg` 内容替换为新版彩色长标（原 168.76×43.9 单蓝 → 现 391.84×125.13 多色 #456fec/#ffba24/#00c6ff/#9f9f9f），旧版存档已按用户要求删除（2026-11-13）。
- 白标 `asset-logo-brand-white.svg` 未变（深蓝顶栏用）；页面引用无需改路径。

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
