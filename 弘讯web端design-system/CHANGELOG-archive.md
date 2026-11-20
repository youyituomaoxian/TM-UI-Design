# 弘讯B端视觉系统 · Web 端设计系统更新日志（归档）

> 本文件为 `CHANGELOG.md` 的滚动归档（2026-09-22 建立）：主文件只保留近期条目，更早条目**原样移入**此处，未做任何内容修改。
> **分卷（2026-11-20）**：归档容器触顶后按时间拆卷——本卷只保留 **2026-10 及之后**；**2026-09 及更早**见 [`CHANGELOG-archive-2026-08_09.md`](CHANGELOG-archive-2026-08_09.md)（冻结卷，不再追加）。
> 切割线（滚动更新）：web 归档 `[登录页定稿写回真源 + login 门禁]` 及更早。新条目一律写主文件顶部；超限时由 roll-changelog.js 自动滚动。

## [登录页定稿写回真源 + login 门禁] — 2026-11-18
- **真源（`components.css` → build `template.css`）**：`.login-card` 内边距 上下 **32** / 左右 40；新增 `.login-brand`（卡内顶部居中，logo 高 40、上 32 下 32）、`.login-account`（下距 16）、`.login-link`、`.login-legal-links`；`.login-legal` 改 `justify-content:space-between`、`.login-copy` 归零、`html[lang="en"] .login-legal` 整块居中；`<1200` 断点 `.login-hero img{object-fit:contain}`（1:1 图在 280 横幅 cover 会裁成 3.66:1 特写）。
- **RULES §1.1b 登录页**：改写为定稿口径——logo 卡内 40 / 32 / 32、去卡内「登录」标题、字段「账号 + 密码」（手机号为显式变体）、法务行多语言、图槽比例、节奏 32/16/12/16/16/24/32、`<1200` contain。
- **门禁 `validate-spec`（新增 `checkLoginPage`）**：`login.card.required` / `login.head.no-logo` / `login.title.one` / `login.brand.missing` / `login.brand.logo` / `login.fields.account` / `login.hero.slot`（HIGH）+ `login.password.eye`（MED）；`COMPONENT_CLASS_RE` 增 `login-` → 页面覆写 `.login-*` 现报 `css.override` HIGH（此前正则 `^` 锚定漏检，DS-20261118-02 §3.5）。
- **示例**：`output/登录页示例.html` 删除 8 处页面级覆写（样式全部由真源提供）→ `0 HIGH / 1 MED`；`showcase/登录页示例_分享版.html` 按新真源重生成（598,934B，零外链）。
- **实测/门禁**：`template.css` 70,914 / 71,000；`validate-spec` 129,173 / 129,500；`ci-local` **104/0**；check-size 0 FAIL / 26 WARN；`sync-index` + `freeze-baseline` 已跑。

---
## [Logo 库收敛：三套产品长标 + 反白 + 按系统名选用] — 2026-11-18
- **资产**：`assets/logo/` 收敛为三套产品 logo（弘设汇 `400.74×105.91` / 弘塑云 `391.84×125.13` / 弘智造 `381.59×105.91`），并为每套生成同名反白 `-white.svg`（全部显色统一映射 `#FFFFFF`，保留原 opacity，用于品牌蓝底）；**删除** `asset-logo-brand.svg` / `asset-logo-brand-new.svg` / `asset-logo-brand-white.svg` / `logo_64.svg`。
- **选用规则（RULES §0.1a）**：按系统名三选一——弘设汇 / 弘塑云 / 弘智造；蓝底（顶栏）用 `-white` 反白，浅底（登录卡）用彩标；尺寸不变（顶栏高 32 宽自适应 / 登录高 40），禁 PNG/自造/改色。
- **代码**：`page-template.html` 顶栏 logo → `弘设汇logo-white.svg`（alt 同步）；`validate-spec.js` M-08 两条报错文案同步新资产名与选用规则。
- **审计**：`audit-rules.json` M-08 predicate / implemented_in 同步（`真源 = 弘设汇/弘塑云/弘智造 logo.svg + 同名 -white 反白`）。
- **门禁**：`validate-spec.js page-template.html` 0 HIGH（1 MED 为既有 aesthetic）；`ci-local` 104/0；`check-sync` 3/0；`check-reach` 0 FAIL（`sync-index` 已刷）；`freeze-baseline` 已刷新 5 件指纹。
- **注**：`logo_64.svg`（64×64 方标）随库收敛停用，移动端登录 logo 口径同步为「高 40 宽自适应」（移动 RULES §1.1b）。

---
## [示例入库：弘讯亮色注塑机看板] — 2026-11-17
- 将 `讲解展示页/示例页面/弘讯亮色注塑机看板.html` 复制为 `弘讯web端design-system/showcase/弘讯亮色注塑机看板.html`；内联当前 `template.css` + 顶栏主题选择器；假数据演示，不参与门禁。
- `showcase/` 同时收纳 `web规范展示_框架版_20260806_1050.html`（含分享版）与 `表格规范展示_20261112.html` 示例副本；相对路径改为 `../template.css` / `../assets/`，分享版保持零外链。
- `showcase/` 走既有 check-size DIR_EXEMPT；`validate-spec` 对 `showcase/` 豁免 `template.residue`（示例页保留模板示例树与假数据）。
- `README` / `USAGE` / `USAGE-GUIDE` / `团队使用指南` / `web规范展示` 增加示例入口；`showcase/README.md` 说明边界。

---
## [主题换肤：双属性 + 4 主题 + 固定暗色（2026-11-17 拍板）] — 2026-11-17
- **双属性**：`data-skin`（品牌色轴）+ `data-theme`（light/dark 明暗轴）。skin 块用 `:root[data-skin="x"]:not([data-theme="dark"])`，暗色块完全不受影响；主题清单 = 默认蓝 / 科技青 / 工业绿 / 琥珀橙 / 深空紫 + 固定暗色。
- **token**：每 skin 5 个（`--primary/hover/active` + `--brand-surface` + `--text-on-brand`），disabled/选中行/下拉选中/`--secondary` 由一个 `color-mix` 派生块联动；`--chart-*` 保持固定。注册表入 `tokens.json.themes`，由 `build-template-css.js` + `brand-color-engine` 生成。
- **UI**：顶栏旧亮/暗单按钮 → 「主题」palette 图标 + 下拉（复用 `.lang-*` 下拉；色点 `.theme-dot`）；head 内先行应用 `hx-theme`/`hx-skin` 防闪烁；旧 `hx-theme=light|dark` 兼容。登录页不跟随。
- **修复**：多语言 IIFE 原来全局 `.lang-opt` 会清掉主题选项 `.on`，改为 `#langSel .lang-opt`；page-template 移除已废弃的展示页 `<style>` 块（SOP 步骤 6 同步）。
- **门禁**：新增 `scripts/check-themes.js`（token/对比度/选项）+ `validate` 跳过 `data-skin`；`palette.svg` 入库（Web 185→186）；template.css 70,279/71,000、page-template 37,9xx/40,000；`ci-local` 103/0。

---

## [白屏/按钮标题事故门禁 + 独立复核收口] — 2026-11-17
- **新门禁**：validate 新增 `page.title.missing` HIGH（main 内缺 h1.page-title）+ `html.skeleton.*`（head 未闭合/无 body/注释不配平/零样式 → HIGH；body≥2 → MED）；audit 注册 M-11 同口径（audit-rules v1.9.0）。
- **复核修正**：page-title 接 `isFrameworkExempt`（不再误伤 web规范展示_框架版），只认 main 内 `h1.page-title`（div/注释/顶层类名不再放行），main 允许附加属性；audit M-11 先剥 HTML 注释，注释掉的旧标题不再漏检。
- **契约/文档收口**：RULES §1.1b 详情页 `H1 28/36` → `.page-title` 18/500；§1.1b 补门禁引用；components.json tabs 13→14（summary/sizing/referenceCss/contract expect 全同步）。
- **起手件/模板**：web `agent-starter.html` 嵌套注释拆平（此前 L44 起被解析成真实 DOM）；`page-template.html` 头注释裸 `<main>` 转义、双 body 合一。
- **门禁**：双端 page-template 0 HIGH；web 成品规范页/起手件 0 HIGH；ci-local 103/0（非沙箱）/ DSH 沙箱 101/3（管道限制，非回归）。
- **容量回收（可读性第一）**：template.css 重 build 去注释（源注释保留）、page-template 注释压缩、audit-rules prose 就地压缩；RULES 阈值 55k→56k（本季 1 次，内容零搬移、不搬 docs）。

---

## [生成 SOP：信息层级 × 亲密性双原则（选字阶/间距前置对齐）] — 2026-11-13
- GENERATION-SOP 步骤 2 新增第 4 条双原则：**层级逻辑优先选字阶**（档位跟信息层级角色走，唯一入口 RULES §1.4；典型错位 = 一级 tab 落辅助档 / 内页标题误用模块标题档）+ **亲密性原则定间距**（间距是分组语义非装饰节奏，取值唯一入口 RULES §4.1；观感与数值不符先查渲染根因再动数值）。
- 来源：机器群览标题降级 + 间距排查案例复盘（用户拍板沉淀）。RULES/MASTER/template.css 机制本轮未改动（D1–D4 字阶/间距迁移另行拍板），本条为生成流程原则。

---

## [页头行上下间距相等：compact 默认 md12，分层形态 :has 保持 xs4] — 2026-11-13
- 用户实测拍板：基础形态页头行→内容间距应与框架→标题相等（原 compact xs4 < content padding-top md12，上下不均）。
- 真源：.page-head--compact margin-bottom xs→**md12**；新增 .page-head--compact:has(+ .tab-row) 保持分层形态 **xs4**（原 D3 拍板不回退）。RULES §1.1b 口径同步。
- 重建/template.css 副本 + 4 分享版重内联同步。

---

## [分享版快照重建 ×6 + 页头口径收尾（t-h1 → .page-title）] — 2026-11-13
- **内联真源重建**：重建 4 分享版（login / machine_alarm / machine_group / status_report）+ web规范展示_框架版_分享版 + USAGE_分享版——内联块替换为当前 template.css（tabs 14 / .card-grid / .table--sticky / 滚动条 n5 全部带入），机器群览分享版挂 .card-grid。
- **页头口径收尾**：machine_alarm / status_report 两 dev 页与三分享版页头 `t-h1` → `.page-title`（RULES §1.4 内页例外补漏改面）；4 dev 页 template.css 缓存指纹 bump v=20261113。
- components.md 字阶表补「页头标题 .page-title 18/26」行。

---

## [表格表头跟随立项：.table--sticky（容器内滚动）] — 2026-11-13
- 真源新增修饰类 **`.table--sticky`**（thead th sticky top:0 / z-5，约 3 行 CSS）：定高/弹性卡内长列表滚动时表头跟随；th 自带 --table-header-bg 不透明底满足 sticky 前提，暗色 token 自适应。
- 边界（RULES 表格规范 ⑦ / MASTER 表格节）：**仅限容器内滚动**（.scroll-fixed / .card-body--scroll / .table-wrap），**禁页面级 sticky**（分页红线）；可与 `.table--fixed` 组合横+纵双向。
- 表格规范展示页新增 ⑫ 示例（定高卡左右对照：无 sticky / sticky 各 12 行）。
- **实测补强（2026-11-13）**：sticky 表格**禁中间再套 .table-wrap**——其 overflow:auto 成为 th 最近滚动祖先、截断 sticky 生效范围（table-wrap 无纵向溢出时表头不粘）；纵向滚动容器直接包 table，或 .table-wrap 自身定高充当滚动器（横+纵双向 sticky 均生效）。

---

## [滚动条统一浅色化：全局 thumb n6→n5 + 滚动容器补真源样式] — 2026-11-13
- 修复：`.table-wrap`/`.card-body--scroll`/`.scroll-fixed` 原无自定义滚动条样式，吃浏览器默认深灰——补统一浅色滚动条（thumb **n5** #EAEAED、hover n6、track 透明、8px/圆角 4、Firefox scrollbar-color n5）。
- 全局降浅一档：`.content` thumb n6→**n5**、hover n7→n6。亮暗双主题均走中性 token 自适应。表格规范展示页 ⑩⑪ 滚动示例即为受惠场景。

---

## [内页页头字阶/间距口径 D1–D5 迁移（机器群览案例拍板）] — 2026-11-13
- **D1 字阶口径**：RULES §1.4 决策树后补「内页页头标题例外」——内页页头标题一律 `.page-title` 18/500，不走 .t-display/.t-h1（消除 28/18 双口径）；MASTER §2 Tabs 补字号行。
- **D2 一级 tab**：`.tabs .tab` 13 → 14px（body1 档，导航不低于正文；二级 .seg 维持 12）。
- **D3 紧凑间距**：标题→tab 行 12 → **4（xs）**，`.page-head--compact` margin-bottom sm8→xs4。
- **D4 渲染修正**：`.page-actions` 移除 margin-top 16（纵向堆叠遗留；横排页头把行高撑到 48px，小标题居中产生 ~11px 死空——2026-11-13 机器群览实测）。
- **D5 网格组合规则**：真源 utilities.css 新增通用容器 **`.card-grid`**（gap 供行距 + 直接子 .card margin 归零；.card 文档流 margin 与 grid gap 双计 → 行距 32 为左右两倍，2026-11-13 机器群览实测）；页面禁覆写 .card（css.override HIGH），改挂 .card-grid 类。
- 重建页 page_machine_group.html 同步：标题 t-h1 → .page-title、.mg-grid>.card margin 归零；预演覆写块清除。

---

## [audit-rules 零语义压缩：25,859 → 24,780（余量 41 → 1,120）] — 2026-11-13
- `audit-rules.json` 压缩 8 处长文案（change_policy / machine_rules[0][5][6].predicate / scope_note / report_quality_bar / consumption_model / maintainer_duty），**规则语义零改动**（判级、出口、六步、回执三件套、仲裁全部保留）。
- 复测：`audit-spec` 输出项数与压缩前一致（80 项 / 0 HIGH）；`ci-local` 103 pass / 0 fail；`check-size` 余量从 41 → **1,120**。
- `updated` → 2026-11-13；版本号保持 1.8.0（无语义变更）。

---

## [默认长 logo 换新：asset-logo-brand.svg → 彩色长标 391.84×125.13] — 2026-11-13
- 默认彩标（浅底用）`assets/logo/asset-logo-brand.svg` 内容替换为新版彩色长标（原 168.76×43.9 单蓝 → 现 391.84×125.13 多色 #456fec/#ffba24/#00c6ff/#9f9f9f），旧版存档已按用户要求删除（2026-11-13）。
- 白标 `asset-logo-brand-white.svg` 未变（深蓝顶栏用）；页面引用无需改路径。

---

## [登录页：品牌区去 logo + 背景图 1:1 口径] — 2026-11-13
- RULES §1.1b 登录页：卡外 `.login-head` **不放 logo**，仅「系统名 24/32 + 副标题 13/20」一组（组内 4、与登录卡间距 24），左沿与登录卡左沿对齐。
- RULES §1.1b 背景图：58/42 左栏内使用 **1:1** hero（`object-fit:cover` + `object-position:50% 50%` + 羽化 160），明示**禁 2.2:1 宽图硬撑竖栏**（本次实测裁切错位的真因）。

---

## [真源归位 + SVG 空图形门禁 + .content--fill 用法入规范] — 2026-11-12
- **规则归位**：一屏撑满/分页器贴底/页头间距/标题竖条等**布局类规则**从 `components.css` 迁到 `framework.css`（组件文件只留组件；避免加载顺序与职责混淆）。
- **新门禁 `svg.invalid`（HIGH）**：`<svg>` 内无 path/circle/rect/line/polyline/polygon/ellipse/g/use/text/image 时拦截——实测坑：把 path 的 d 数据当文本写入，图标"有盒子无图形"。
- **RULES** 列表页规格新增「`.content--fill` 用法」三步（content--fill → card--fill → is-placeholder 补位），明示禁 `calc(100vh - N)`、嵌层须补 flex 链。

---

## [一屏撑满 / 表格填充 / KPI 图标卡：页面 hack 收敛进真源] — 2026-11-12
- `components.css` 新增真源契约：`.content--fill`（内容区纵向 flex，页头固定 + 末卡吃剩余高）、`.card--fill .pager{margin-top:auto}`（分页器恒贴底）、`.table tr.is-placeholder`（补位空行保留分割线）、`.stat-card--compact`（紧凑 KPI）；随 `build-template-css.js` 生成 `template.css`。
- `validate-spec.js`：① `table.pager.required` 由字面量 `class="pager"` 改为词元正则（分页器带附加类不再误报）；② 新增 `template.css.stale`（HIGH）：页面链接的本地 `template.css` 副本与真源 sha256 不一致即拦——此前真源改了、副本没同步，导致「间距又出现」。
- RULES 新增「一屏撑满契约」；页面侧删除 `.fill-*` 私有类与 `calc(100vh - N)` 自算高度，改用真源类。

---

## [F10/F11/F12：扫描盲区 + MEDIUM 分档 + 截图证据门禁] — 2026-11-12
- `audit-spec.js`：inline style 支持单引号/无引号（原只认双引号，实测全漏）；新增 `css.js.injected`（MED，脚本内 `style./cssText/innerHTML/<style>` 注入）；`audit-rules.json` v1.8.0（M-10 + R-08）。
- `audit-batch.js`：MEDIUM 分「必修/提示」（台账 `mediumMust`/`mediumAdvisory`）；新增 `scripts/audit-shots.js`：P3 截图矩阵验收（缺图/占位图 exit 1）。
- `AGENTS.md` 压缩 5,895→3,968（重复内容指向 HANDOFF/RULES），上限 5,900→4,500。

---

## [F1/F3/F4：P0 页面清单 + P3 截图证据 + DoD 升级] — 2026-11-12
- P0 改为「先出页面清单再盘点」（`audit-batch --list` 枚举全项目 + `--json` 台账带覆盖率，<100% 即 P0 未完成）；P3 强制截图落盘 `output/audit-shots/<页面>/<theme>-<state>.png`（缺图=该格未审）；P4 DoD 由「0 HIGH」升级为 **「0 HIGH + 台账全绿」**。
- 同步交付线：AGENTS 门禁条、USAGE-GUIDE 路径二、README、团队使用指南、标准提示词模板——**「0 HIGH」单独不再构成交付**。

---

## [F9：同色不可见 / 近同色门禁 + 存量改造边界] — 2026-11-12
- 新增 `contrast.invisible`（HIGH）/ `contrast.near-invisible`（MEDIUM）：同一选择器内 `color` 与 `background` 解析为同色 → 拦截（白字白底类）；`:disabled/.is-disabled` 豁免。`audit-rules.json` v1.6.2→**v1.7.0**（M-09 登记）。
- **存量改造边界**写入 SOP §② 铁律 6：只改表现层（色彩/字阶/间距/圆角/图标/组件外观），禁改文案与信息项、字段与数据口径、交互流程与功能行为；台账模板 + 标准提示词模板同步。
- 回归：双端模板 24/4 MED 不变；夹具白字白底→HIGH、近同色→MED、`:disabled` 不报。移动 `validate-spec.js` 上限 67,800→69,500（实测 68,956；仅留 0.8%，下轮优先拆 helper 回收）。

---

## [F7：token 未定义判定并入真源] — 2026-11-12
- `token.undefined` 定义集改为「真源 template.css → 外链 CSS → 内联」三级级联：仓库外页面 link 的真源 CSS 原被 `REPO_ROOT` 边界丢弃 → 合法 token 全判 HIGH（假阳性洪水），进而被 `var(--x, 兜底)` 掩盖。
- 回归：双端模板 24/4 MED 不变；仓库外夹具 2 HIGH→0；`var(--nope)` 仍 1 HIGH。方案 `output/F7-token定义源修复方案_20261112.md`。

---

## [门禁映射补全 + mobile page.regions] — 2026-11-12
- 新增 `gate-map.json`：29 条 [硬] 叶子节 → validate/audit 门禁人工映射（web 17 / mobile 12）；`sync-index` 合并进 `rule-index`，`check-reach` 增死链校验（validate 规则名 + audit id 必须真实存在）。
- 移动端 validate 新增 `page.regions`（MEDIUM）：首页范式缺列表区 / 导航栏缺透明状态栏即报（RULES §9.6）；`[硬]` 叶子节 33 条 **100% 有门禁映射**，R3 **0 WARN**。

---

## [硬规则再分级：30 条不可机检章节转 [软]] — 2026-11-12
- 按「[硬] = 可机检」口径复核 64 条无门禁 [硬] 章节：30 条无机器门禁（输入/Tag/列表状态、平台/字段/组件参考表、检查清单等）转 [软] 并进「按需检索」；mobile §2/§3 容器章保留 [硬]，改由子节覆盖判定（check-reach R3）；mobile §9.6 保留 [硬] 待补页区域门禁。
- 结果：硬叶子节 34 条 / 已映射 4 / 待映射 30（候选映射批次，见 `output/硬规则门禁分诊_20261112.md`）；check-reach 0 FAIL / 1 WARN。

---

## [容量维护批：三资产上限重定 + 加载预算 40k] — 2026-11-12
- 机器资产上限按实测 + 分级余量重定（六步留痕）：`audit-rules.json` 24,000→25,900（23,991 + 8%，>10k 档）、`template.css` 67,000→70,000（66,636 + 5%，>50k 档）、`components.json` 77,200→80,000（76,640 + 4.4%）。三者由门禁/构建消费，非 Agent 阅读面；**下次再调须附回收记录**。
- 加载预算口径改为「入口 + 规范包」：AGENTS 5,890 计入，web 37,870 / mobile 37,115 ≤ 40,000（94.7% / 92.8%）；`rule-index.json` 加载计划与 SOP §0 同步。
- 验收：干净环境 `ci-local` **103 pass / 0 fail**；DSH 沙箱内 101/3 为子进程管道限制（非回归）。
- GENERATION-SOP：清 2 段历史过程注记（-380 字符），上限 44,300→45,000（全文非 Agent 加载面，仅 §① 进包）；USAGE_分享版按当前 `template.css` 全量重建（108,799 字符，零外链）。

---

## [规范可达性 P1：软规则分级 + 零语义回收] — 2026-11-12
- `[软]` 分级补全：RULES「必读清单」新增「按需检索」行（§0.3/§1/§1.1/§1.2/§1.1c/§2.2 不列为缺读事故）；`rule-index.json` 双端 39 条软规则 **0 条 unset**，check-reach R3 由 WARN 转 PASS。
- RULES 零语义回收：清除 63 处括号内历史日期（`（2026-xx-xx …）` → `（…）`），**净回收 647 字符**（日期清理 680，分级行 +84、标点修整 -51）；规则文本与语义未改，日期留痕在 CHANGELOG。
- 阈值按可读性预算重定：RULES 53000 → **55000**（加载集 31,994/35,000 由 check-reach 守；文件上限降为膨胀告警，不再当质量判据）。
- HANDOFF 为本地交接文件，移出 check-size 清单：**不设体积阈值、不参与加载预算**，已完成任务归档到 CHANGELOG。
- 验收：check-reach **0 FAIL / 1 WARN**（[硬] 64/75 未映射门禁，逐批补）；ci-local 101 pass（3 项沙箱故障沿用）。

---

## [规范可达性 P0：索引生成 + 可达性门禁] — 2026-11-12
- 新增 `sync-index.js`：按标题实测重写双端 RULES「章节索引」表（生成物），并生成 `rule-index.json`（114 条规则路由：id/端/层级/硬软/行/字符/必读级/门禁映射 + 3 个加载计划）。索引从 47k 失真值校正为实测 53k；各章字符数同步实测。
- 新增 `check-reach.js`（已入 ci-local，阻断）：R1 索引 0 漂移；R2 加载集实测（web 32240/35000、mobile 31225/35000、交接 19065/20000）；R3 [软] 11 条未分级 / [硬] 64 条未映射（WARN，逐批补）；R4 引用 541 处 0 断链；R5 入口链齐全。
- 修正 RULES 标题缺陷：web 重复 `## [硬] 2` 两处、mobile `### [软] 1.2` 行内重复；两处均属锚点歧义，零语义变更。
- check-size 登记 3 新文件；阈值按实质增长重测：check-size.js 7500→8000、ci-local.js 18200→18600。ci-local 增 1 项 → **101 pass**（3 项沙箱子进程故障沿用）。
- 依据：用户 2026-11-12 拍板「先建可达性门禁、不先拆/压 RULES」；方案见应用侧 `output/规范可达性治理方案_20261112.md`。

---

## [分层页头紧凑间距真源化] — 2026-11-12 · DS-20261112-04 消费
- 拍板 8/12 回灌真源（方案 b 紧凑变体，基础形态默认 16 不变）：components.css 新增 `.breadcrumb--compact`（面包屑→标题 8=--space-sm）、framework.css 新增 `.page-head--compact`（标题行→tab 行 12=--space-md），build 进 template.css；vendor-coverage gaps 登记 page-head--compact；components.json breadcrumb 条目同步（variants/tokens/referenceCss/do）；RULES §1.1b 拍板行补变体指针并归位压缩；audit-rules.json feedback_log 登记（六步第 1 步）。移动端无同名类无双端项。ci-local **102 pass / 0 fail**。

---

---

## [64 方标 logo 入库] — 2026-11-12
- assets/logo/ 新增 logo_64.svg（viewBox 64×64 方标，viewBox 合规）；RULES §0.1a 方标档「待补」→ 已入库，M-08 真源清单同步。⚠️ 配色（#456fec→#00c6ff 渐变 + #ffba24/#ffe39e 黄）偏离 VI（主色 #005EAE / 橙 #FA8C16 仅点缀），改色待用户拍板。

---

## [品牌 logo 规范 + 资产门禁 M-08] — 2026-11-12
- RULES §0.1a 新增：logo 一律 SVG 强制（assets/logo/ 真源：asset-logo-brand.svg 彩标 / asset-logo-brand-white.svg 白标），锁高宽自适应（viewBox 168.76×43.9，禁写死宽高比）；尺寸分级 = 顶栏 32 白标 / Web 登录 40 彩标 / 移动登录 64×64（方标资产待补）；MASTER.md「logo 40×40」旧值同步修正（原与 RULES 高 32 冲突）。
- validate-spec.js 新增 `logo.asset.format` / `logo.asset.missing` 双 HIGH（展示页/_框架版/USAGE 豁免）；page-template.html 顶栏占位符替换为真源白标 logo、页面 CSS 宽 32→auto。audit-rules.json v1.6.2 登记 M-08；check-size validate-spec.js 阈值按实测现值 +5%（>50k 档）重测并行内留痕。

---

## [内页页头结构 + 二级分段器] — 2026-11-12 · 两层 tab 方案 B 拍板
- 新增真源组件 **.seg 分段器**（utilities.css → template.css）：容器 N3 底胶囊高 30（item 26/字 12/圆角 15），选中 primary 实底 + var(--text-on-brand) 白字 500，动效走 motion token；语义 = 内容视图切换，与 .filter-chip（数据过滤）禁混用。components.json 登记组件条目 + 契约 `seg.size`（高 30 HIGH，exclude .item 防派生规则误扫）/ `seg.active`（字重 500 HIGH + 底 token MEDIUM）；vendor-coverage tokenProjection 登记 seg/tab-row。
- 新增真源布局工具 **.tab-row**：两层 tab 内页一级 tab 行 = .tabs 左 + .page-actions 右同行底部对齐，行底线统一、tab 下划线压线。
- RULES §1.1b 新增「**内页页头结构**」：基础形态（无 tab：标题+操作区同行，真源默认间距）/ 分层形态（面包屑→页标题→一级tab行→二级seg→卡片）；分层页头紧凑间距 8/12/16/16（用户拍板：页头收紧为内容让空间）；红线 = tab 最多两层、二级禁进卡片、seg/filter-chip 语义互斥。
- 契约红→绿验证：真源默认值 0 HIGH；height 28/weight 400/#999 底 → seg.size+seg.active 双 HIGH。ci-local **102 pass / 0 fail**。视觉演示页（方案 A/B）在应用侧 output/，未入库。

---

## [面包屑固定形式] — 2026-11-12 · 去 N5 底改纯文本（用户拍板）
- 真源 `.breadcrumb` 取消 N5 底条带/圆角/水平 padding（components.css → template.css build），固定为**无底纯文本**：32 高保留、› 分隔、item N9/当前 N11、下方间距 16 不变；components.json 组件条目同步（summary/tokens 删 --n5/--radius-base/sizing paddingH 0/variants 改「基础（无底纯文本）」/dont 由「无底色纯文本导航」反转为「加底色/边框/圆角胶囊」）；RULES 面包屑铁律/列表页变体 B/详情页 3 处文字对齐。移动端无同名类无双端项。ci-local **102 pass / 0 fail**（check-size 触发 RULES 超 25 字符，按归位治理压缩今日条款文字消除，未调阈值）。

---

## [表格占位行真源化 + 表头口径清漂] — 2026-11-12 · DS-20261112-01/02 消费
- **表格承载形态拍板（方案 1 堵灰区）**：RULES §1.1b 新增条款——列表页/详情页表格一律卡片式承载，变体 A「全宽表格」=全宽卡片（白底+Shadow-Card+圆角 8），**禁裸表格**；密度用 行高/分页/列宽预算消化。零新增组件，门禁不变。
- **DS-02（组件缺口）**：RULES §4.4 第 4 条定义的 minRow 占位行 `tr.table-placeholder` 落地真源——utilities.css 新增 `.table-placeholder{pointer-events:none}`（td 提示文案 N8）并 build 进 template.css（L1060）；components.json 契约数组登记 `table.placeholder`（pointer-events=none，HIGH）；vendor-coverage.json tokenProjection 登记（31 项）。应用侧 `表格规范展示.html` 页内临时定义已回滚，validate-spec + audit-spec 双跑 0 HIGH。
- **DS-01（文档口径冲突）**：2026-10-20 表头改版（14px/44px）未同步人读文档——RULES §3.3b L468（13px→14px、删「不得统一字号」旧原则句）、§1.1b L204 / §2.1 G6 L713 / 交付清单 L722 / 门禁说明 L667（表头 48→44）；components.json 弃用 table 条目 summary/sizing.fontSize/referenceCss/ardot.variantMapping/notes/do 六处 48→44、13→14。文档现与契约 `table.head`（44/14/500/N2）完全一致。
- 验证：ci-local **102 pass / 0 fail** 全绿（含 check-sync 检查三新类登记）；修复样例红→绿双向复测通过（DS-01 样例 A/B 依据契约现值成立、样例 C grep 旧值清零）。

---

## [作业树 · 自身页+子级 折叠态] — 2026-11-09
- 新增第三分型：`data-page` + 子级 → 折叠弹浮层，首项「进入本页」(`data-self`)；page-template JS/CSS（`.pop-self`）；RULES §0.2-10 / components.md/json / SOP 同步；门禁 `tree.node.split` 改为「data-page+子级须含 data-self」；示例页恢复该分型。

---

## [门禁：折叠半迁移 + 暗色品牌覆盖] — 2026-11-07
- 新增 `tree.collapsed.partial`、`dark.brand.override`（双端）、`tree.popover.order`；`gen-examples` 品牌覆盖只留亮色 + `.tag→.badge`；历史品牌页清理 2387aa ×4。

---

## [暗色固定主题] — 2026-11-06 · 暗色不随品牌（方案 A）
- `darkBrandMode:"fixed"`：暗色 background 固定、不随品牌推导（`derived` 保留旧能力）；`--brand-surface` `#0A2540 → #1E293B`（= 卡片色），内容 `#121826`，主色固定 `#3B82F6`；框架三边 1px `.07` 分区线；双端 tokens / globals / template 重生成；DARK-MODE / SOP / VISUAL-SPEC 同步；ci-local 加「换品牌暗色不变」断言。

---

## [作业树折叠浮层 P1-P7] — 2026-11-06 · 折叠态只显一级 + 二级浮层
- RULES §0.2-10；折叠态只显一级（`.tree-collapsed` 兼容旧页）；`.tree-popover` 浮层；`.branch-active` 展开 8% / 折叠 18%；`data-group/data-page/data-key`；page-template JS；tree.tsx `collapsed`/`onGroupClick`；AdminLayout 浮层；check-size 调阈。validate 0 HIGH + tsc 通过。

---

## [文档死链与口径清漂] — 2026-11-05 · 说明文档对齐现行规范

- 登记说明文档（根 + 双端）机检漂移，修 15 处：①死链——TOKENS-EVIDENCE.md（文件已移除，9 处引证改「对标引证文件已移除」）、web RULES 机器群览页示范、mobile RULES dashboard.md §2、components.md design-system-showcase :root 改指 template.css、CHART-SPEC 两处已移除测试文件标注（ci-chart-interaction.js 属 §9 待办登记，保留）；②口径——团队使用指南「模板 ×7」更正「两级通用+4 专用」；GENERATION-SOP 分享版口径改「重建后 audit-spec + validate-spec 双跑 0 HIGH 分发」。
- 真值核对：图标 web 185 / 移动 184、版本 1.9.46 / 1.14.28 一致；USAGE-GUIDE 所引 packages 脚本实测存在，未改。ci-local 100 pass / 0 fail。

---

## [USAGE 使用指南内容同步] — 2026-11-05 · 提示词逻辑对齐现行 SOP / 审计口径

- USAGE.html（dev + 两份 USAGE_分享版）提示词内容同步到当前真源口径：审计卡完整版改「audit-spec 台账 + D-1~D-12 逐维对照 → 逐项映射决策 → 分批修复 → validate-spec 双跑收口」（旧版仅 validate 逐条修，已废止）；迁移卡完整版改「SOP §② 五阶段（P0 台账 → P1 映射 → P2 修复 → P3 截图审查 → P4 收口）」；完整版提示词统一补 SOP §0 加载纪律（≤35k 只读命中章节）与问题上报口径（templates/设计系统问题报告模板.md）。
- 资产地图补 tokens.json / audit-rules.json / audit-spec.js 3 行（13→16 条）；「提示词模板 ×7」更正为「两级通用 + 4 个专用（共 6 个）」；FAQ 新增 data-species 条目；分享步骤改「重建后 audit-spec + validate-spec 双跑 0 HIGH 再分发」；新增「环境路径 · 从克隆到使用」节（CLI Agent / WorkBuddy / 网页版 AI 三条上手套路 + 导航项）；body 补 data-species="document"。
- 页面布局类与真源未改；分享版按当前 template.css 重新内联重建（仓库根 + 讲解展示页两副本，仅横幅注释差 2 字符）。门禁：ci-local 全绿；validate-spec dev 与两份分享版 0 HIGH（仅文档页自建布局类 MEDIUM，设计如此）；audit-spec dev / 分享版 exit 0。

---

## [规范展示页图表合规] — 2026-11-03 · 系列色 / 折线纵向覆盖 / 4px 网格

- `web规范展示_框架版_20260806_1050.html`（及分享版）：SVG 系列元素绘制色由语义色 `--warn` / `--primary` 改为图表色 `--chart-wisdom-purple` / `--chart-tech-blue`；折线静态 points 拉伸至纵向覆盖 ≥70%（CHART-SPEC §3，上下对称）；主题按钮尺寸改 4px 网格（30→32px / 10→12px）。页面层修复，真源未改。

---

## [规范展示页框架升级] — 2026-11-03 · 对齐当前 page-template 框架（语言切换 / data-species / i18n）

- `web规范展示_框架版_20260806_1050.html`（及其分享版）框架外壳升级到当前 `page-template.html` 规格：顶栏新增**语言切换**（.lang-sel 面板：简体中文 / English + 6 个待支持语言）与 `data-i18n` 标记（首页 / 管理员 / 修改密码 / 退出登录 / 全屏）、`<body data-species="document">`；移植框架 i18n JS（语言面板开合 + 文案替换 + localStorage 记忆）。
- 页面内容与真源 token 未改；分享版按当前 `template.css` 重新内联生成。真源未改（仅人读展示页 + 产物）。

---

## [产物刷新] — 2026-11-03 · 分享版规范展示页 / USAGE 分享版按当前真源重建

- `web规范展示_框架版_20260806_1050_分享版.html` 与根目录 `USAGE_分享版.html` 重新生成：内联**当前** `template.css`（含 1.9.46 登录页 v2 类与 `--radius-control` 等新 token），并删除 dev 页内冗余「内联 :root 变量（2026-08-06 同步）」副本——重复定义会压住真源新值（真源未改，仅产物刷新）。
- 分享版属构建产物（门禁以 dev 态为准）；本轮产物内容审计 `audit-spec` 0 HIGH。

---

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

---

## [1.9.45] — 2026-10-20 · `.tag` 物理删除 + 全库迁移（用户追认）

- **删除 `.tag` 组件**：`template.css` 移除 `.tag/.tag-suc/.tag-warn/.tag-err/.tag-run/.tag-def` 及 hover/disabled 规则；`components.json` 删除 tag 组件条目与 `tag.size` 契约、两处 selector 去 `.tag`；`DESIGN-TOKENS §7.3` 改为「标签 Badge」规格；组件数 22 → **25**（-tag +empty/steps/timeline/descriptions）。
- **迁移**：`web规范展示_框架版_20260806_1050.html` 与其分享版共 **22 处** `class="tag tag-*"` → `badge badge-*`（tag-def → badge-muted），分享版内联 `.tag*` CSS 同步删除；文档（RULES ×5、VISUAL-SPEC、packages/web-ui/README）同步为 `.badge`/徽章。
- **体积上限追认**（用户 2026-10-20 确认）：`components.json` 77200、`template.css` 62000、`components.md` 16800、`DESIGN-TOKENS.md` 15600。
- **焦点环不做**（用户 2026-10-20 决策）：现 20% primary 环保留，理由「视觉上无问题，符合科技克制的设计哲学」；`--focus-ring` 与 11 处 focus 规则维持原状，HANDOFF 不再列为待办。

---

---

## [1.9.44] — 2026-10-20 · 视觉缺口整改批（用户采纳 8 条 Web 项）

- **暗色卡面层次**：`dark.shadow.card` 改为 `0 8px 24px rgba(0,0,0,.35), 0 0 0 1px rgba(168,197,231,.14)`（描边并入 shadow 第二层，卡面对页面 1.21→描边 1.34）；新增 `--table-header-bg`（亮 #FAFAFA / 暗 #26364F，表头对卡面 1.10→1.20）。
- **文字三级**：`--text-1/2/3` 改为 N11/N10/N9（原 N11/N9/N8，N8 对白仅 2.07）；`.card-title/.page-title/.tabs .tab/.pager .pg-tot/.breadcrumb-item/::placeholder` 全部改用该三元组，不再零引用。
- **暗色图表色**：`dark.colors.chart` 换独立阶梯 8 色（tech-blue #4C9BE8 等，全部 ≥3:1；原 #0066CC 仅 2.63）。
- **控件圆角统一**：新增 `--radius-control:6`，`.btn/.input/.textarea/.sel-trigger/.dp-trigger` 由 8/4 混用改为 6；`.filter-chip` 保持胶囊。
- **表头规格**：`.table th` 48/13 → **44/14** + `border-bottom N6`；契约 `table.head` height 48→44、新增 font-size 14，`table.head.font` note 同步。
- **新组件**：`.empty` / `.steps` / `.timeline` / `.descriptions` 四件入真源（含 components.json 登记与 components.md 规格表）。
- **`.tag` 收敛**：就地改为 `.badge` 同款（inline-block、22/500、nowrap+ellipsis、`--text-2`），类名保留兼容 52 处示例页，文档标 deprecated 别名；契约 `tag.size` 字重 400→500。
- **图标描边按尺寸**：`.ico/.btn-ico svg/.tree-ico svg` 16px→2.2，`.kpi-ico svg` 20px→2.0，logo/empty 24px→1.8。
- **体积上限调整（须追认）**：`check-size.js` 中 `components.json` 74600→77200、`template.css` 57500→59500——因新增 4 组件 + 4 条契约产生的真实增长（实测 74530 / 58848），非阈值放水。

---

---

## [1.9.43] — 2026-10-20 · 三处同根因缺陷修复（暗色选中 / badge-muted / badge 溢出）

- **暗色白底表面选中 1.99:1 → 10.56:1**：新增 `--select-item-bg` / `--select-item-fg`（亮 `#DAEAFA`/`#004A8F`，暗 `#23395D`/`#F1F5F9`），`.sel-opt.on` / `.tree-node.on` / `.filter-chip.on` / `.lang-opt.on` 改用这对 token；品牌蓝底侧栏变体仍走自己的覆盖，不受影响。
- **`.badge-muted` 4.44:1 → 9.40:1**：文字由 N9 提为 N10（`#334155` on `#F6F9FC`）；暗色同理达标。
- **`.badge` 文字溢出定高盒**：改 `display:inline-block` + `line-height:22px` + `white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%`（原内容 38px 撑不进 22px 盒、第二行无底色溢出；现超宽显示 `…`）；窄列仍按 RULES §1.1b 收敛为「2 个 + +N」。
- 派生产物：`globals.css` / `template.css` 重生成，`page-template.html` 内联 `:root` 同步两个新变量，`DESIGN-TOKENS.md` §2.8 补两行。

---

---

## [1.9.42] — 2026-10-20 · 表格行选中态 v2（用户拍板：底 + 左条，单选无控件）

- **行态收敛为一种视觉**：单选 / 多选选中后都是「底色 `--row-selected-bg` + 2px `--row-selected-bar` 左条」（首列 `padding-left:14` + 边框 2 = 16，内容不位移）。
- **取消「当前行」**：删除 `.table tbody tr.is-current` 三条规则（未选中行点击/悬停只表现为 hover N3，不再出现左条）与 `.row-key` 600 规则。
- **单选无空间控件**：删除 `.cbx--radio`；单选表格用 `table[data-select="single"]`，行点击即选中（互斥）。多选表格 `data-select="multi"` 仍由 `.cbx` 复选触发。
- **token 改名**：`--row-current-bar` → `--row-selected-bar`（`tokens.json` 键 `selection.rowBar` 不变），`page-template.html` 内联 `:root` 同步。
- **门禁**：`table.row.selected.cue` 改为「已选行须有 `.cbx`，或所在表格声明 `data-select=single`」，不再接受 `role=radio`。
- **指针反馈**：`.table[data-select="single"] tbody tr` 整行 `cursor:pointer`。
- **规范**：RULES §3.3 重写为「两种选择方式 / 同一选中视觉」；§3.6 注记与移动端 §3.3 补注同步更新。

---

---

## [1.9.41] — 2026-10-20 · 复选框补单选变体（`.cbx--radio`）

- `components.css` 增 `.cbx--radio`：同 `.cbx` 尺寸/边框（16/3.03:1），圆形 + 主色内点 8px；用于表格「单选」列（互斥）。
- `components.json` checkbox `variants` 补「单选（圆形 .cbx--radio）」。
- `.cbx svg` 默认 `opacity:0`，仅勾选/半选显示（防未选行露出勾）；
- `validate-spec` 的 `table.row.selected.cue` 接受单选控件（`role=radio` / `input[type=radio]`），不再只认 checkbox。
- 语义：`.is-selected` = 被选中（多选 checkbox / 单选 radio 均可）；`.is-current` = 键盘/定位当前行，两者独立。

---

---

## [1.9.40] — 2026-10-20 · 表格行选中态落地（方案 D：已选 = 复选框 + 底 / 当前 = 左条）

- **tokens.json**：新增 `colors.selection`（亮 `rowBg #DAEAFA` / `rowBar #005EAE` / `checkboxBorder #949494` / `checkboxCheck #FFFFFF`；暗 `#23395D` / `#3B82F6` / `#94A3B8` / `#FFFFFF`）→ `map-tokens.js` 发射 `--row-selected-bg` / `--row-current-bar` / `--cbx-border` / `--cbx-check-fg`（亮暗双段）；`DESIGN-TOKENS.md` 增 §2.8。
- **components.css**：`.table tbody tr.is-selected`（底 + `:hover` 保底，防同权重覆盖）、`.table tbody tr.is-current>td:first-child`（2px 左条，`padding-left:14px` 与边框合计 16 不位移）、`.row-key` 600；新增 `.cbx` 复选框（16×16 / 边框 3.03:1 / 勾选主色底 + 白勾 / `:focus-visible` 环 / 禁用态）+ `th.ck/td.ck` 列宽 40。
- **components.json**：`table.states` 增 `row.selected`（bg + nonColorCue）与 `row.current`（bar + weight），组件新增 `checkbox`（22 个）；`components.md` 镜像同步（含表格行态说明）。
- **规范**：RULES §3.3 重写为「已选 / 当前」双态表 + selectable 默认关 + 标识列 `.row-key` + **表格内禁 N9 次级文字**（任何行底色击穿 4.5）；§3.6 注明表格行不适用单选语义。移动端 RULES §3.3 补口径注释（双端不统一）。
- **门禁**（validate-spec）：新增 `table.row.selected.cue`（已选行无 `.cbx`/checkbox → MED，1.4.1 颜色单信号）与 `table.row.state.classname`（`tr` 用 `.sel/.cur/.hov/.on/.col/.sheet` 通用短名 → MED，实测撞组件类整行塌陷）。
- **page-template.html**：内联 `:root` 同步 4 个新变量（`template.root.sync`）。
- **验证**：反例页命中 2 条新 MED、正例页 0 违反；`ci-local` 全绿（项数以输出为准）。

---

## [1.9.39] — 2026-10-20 · 跨智能体交接制度（HANDOFF 活文档 + 每轮更新铁律）

- `HANDOFF.md` 重构为活文档（现状快照 / 未决事项 / 命令 / 权限 / 更新记录 ≤10 轮），取代 2026-09-23「HANDOFF 冻结」决议。
- 更新铁律入 `AGENTS.md` 顶部 + `GENERATION-SOP.md §0`：任何 Agent 任何轮次结束未更新 HANDOFF = 本轮未完成。
- **真源区未改**（template.css / tokens.json / components.json / 门禁脚本零改动），本轮仅动流程文档。

---

## [1.9.38] — 2026-10-10 · 门禁复盘遗留拍板落地（T-6 三档登记 / T-7 结案 / T-8 治理约束）

- **T-6（RED-002 三档）**：check-sync 新增检查三「真源未覆盖类登记闭环」——Web 真源 282 类中 vendor 未覆盖 163 类原「从不比对即静默通过」，现须全部登记 vendor-coverage.json（tokenProjection 豁免 30 / gaps 真缺口 133），未登记 → FAIL。负向验证：删登记项 / 登记真源缺失均 exit 1，恢复回绿。
- **T-7 结案**：Mobile vendor 同构段 0 类定性「不适用」（mn-* Taro 组件层自有命名空间，设计如此，非遗漏），check-sync 输出 ⏭️ 非 ⚠️，不阻断、不读作一致。
- **T-8 治理约束**：check-size.js 新增规则 4——阈值上调须 CHANGELOG 留痕 + 复盘轮内用户追认，归位治理优先于调阈值。
- **阈值重测留痕（T-8 口径，已追认 2026-10-10）**：check-sync.js 10900→13000（检查三落码实测 11997 + 8% 档）；check-size.js 6200→7500（注释+登记实测 6478 + 15% 档）；新登记 vendor-coverage.json 4000。
- **回归**：ci-local 100 pass / 0 fail；本轮仅动门禁/工具层，真源 CSS/JSON/HTML 未动。

