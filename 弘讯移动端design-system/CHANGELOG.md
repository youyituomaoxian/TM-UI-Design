# 弘讯移动端设计系统 — Changelog

> 语义版本（与 Web 端 `CHANGELOG.md` 同构）。所有「值」以 `tokens.json` 为唯一真源；所有「组件尺寸/色值」以 `components.json` 为唯一真源。

---
> 📦 历史条目已滚动归档：mobile 归档 `[1.14.13]`（2026-09-10）及更早见 [`CHANGELOG-archive.md`](CHANGELOG-archive.md)（2026-09-22）。

---

## [双端对齐：模板残留 + 副本过期门禁；滚动口径登记] — 2026-11-12
- validate 新增 `template.residue`（HIGH）与 `template.css.stale`（HIGH，本地 `template.css` 副本 sha256 ≠ 真源即拦），与 web 端同口径。
- RULES 新增「完整交互与完整动效（移动端）」与「滚动口径：双端不对称」：移动端滚动由 `.screen-scroll` 承载，`.content--fill` 属 web 专有契约，勿套用；移动端无分页器。
- 上限 69,500 → 71,000（+2%，实测 70,329；下次再入规则前先拆 helper 回收）。

## [F10/F11/F12：扫描盲区 + MEDIUM 分档 + 截图证据门禁] — 2026-11-12
- `audit-spec.js`：inline style 支持单引号/无引号；新增 `css.js.injected`（MED）；`audit-rules.json` v1.8.0（M-10 + R-08）。
- `audit-batch.js` MEDIUM 分档；`scripts/audit-shots.js` 截图证据验收（缺图 exit 1）。


## [F1/F3/F4：P0 页面清单 + P3 截图证据 + DoD 升级] — 2026-11-12
- P0 先出页面清单再盘点；P3 截图证据落盘（缺图=未审）；P4 DoD =「0 HIGH + 台账全绿」。
- 同步 AGENTS / USAGE-GUIDE / README / 团队使用指南 / 提示词模板。


## [F9：同色不可见 / 近同色门禁 + 存量改造边界] — 2026-11-12
- 新增 `contrast.invisible`（HIGH）/ `contrast.near-invisible`（MEDIUM），`disabled` 豁免；`audit-rules.json` v1.7.0（M-09 登记）。
- 存量改造边界：只改表现层，禁改文案/字段/交互/数据口径（SOP §② 铁律 6）。
- 本端 `validate-spec.js` 上限 67,800→69,500（实测 68,956）。


## [F7：token 未定义判定并入真源] — 2026-11-12
- `token.undefined` 定义集改为「真源 template.css → 外链 → 内联」级联，修仓库外页面合法 token 被判 HIGH 的假阳性（`REPO_ROOT` 边界丢 `<link>`）。
- 回归：模板 4 MED 不变；仓库外夹具 2 HIGH→0；`var(--nope)` 仍 1 HIGH。


## [page.regions 门禁 + 门禁映射] — 2026-11-12
- validate 新增 `page.regions`（MEDIUM）：首页范式（hero/kingkong/porcelain）缺 `.mlist/.mcard` 列表区、或导航栏缺 `.m-statusbar` 即报（§9.6）；`gate-map.json` 补 12 条移动章节映射。

## [硬规则再分级：24 条转 [软]] — 2026-11-12
- 输入/Tag/列表状态、平台/字段/组件参考表、检查清单等 24 条无门禁 [硬] 转 [软] 并进「按需检索」；§2/§3 容器章改由子节覆盖判定；§9.6 保留 [硬] 待补门禁。

## [加载预算口径：计入入口 AGENTS] — 2026-11-12
- 加载预算改为「入口 + 规范包 ≤ 40k」：移动 37,115 ≤ 40,000（92.8%）；rule-index 加载计划同步。

## [规范可达性 P1：软规则分级] — 2026-11-12
- 「必读清单」新增「按需检索」行（§1/§1.1/§1.1c/§1.2/§2.2 不列为缺读事故）；双端 39 条软规则 0 unset；加载集 31,225/35,000。
- HANDOFF 移出体积门禁（本地交接文件，不设阈值、不参与加载预算）；已完成任务归档到 CHANGELOG。

## [规范可达性 P0：索引生成 + 可达性门禁] — 2026-11-12
- 双端同步：`sync-index.js` 重写移动端 RULES「章节索引」（49k 失真 → 实测 52k），`rule-index.json` 纳入移动 114 条规则路由；`check-reach.js` 入 ci-local（索引 0 漂移 / 加载集 31225≤35000 / 引用 0 断链）。
- 修正 `### [软] 1.2` 行内重复标题（锚点歧义，零语义变更）；check-size 登记 3 新文件 + 阈值重测。

## [64 方标 logo 入库] — 2026-11-12
- assets/logo/ 新增 logo_64.svg 方标；登录页 Logo 64×64「资产待补」→ 已入库（RULES §0.1a / M-08 同步）。配色偏离 VI 待拍板。
## [logo 规范对齐] — 2026-11-12
- 登录页 Logo 64×64 补 SVG 强制与真源取用说明，对齐 Web RULES §0.1a / audit-rules M-08（方标资产待补）。门禁 spec 级，无 validate 变更。
## [门禁：暗色品牌覆盖] — 2026-11-07
- validate 新增 `dark.brand.override`（暗色块品牌推导值 HIGH）；`docs/examples` 豁免 clone/fingerprint。

## [暗色固定主题] — 2026-11-06 · 暗色不随品牌（方案 A）

- 移动端暗色 `--brand-surface` `#0A2540 → #1E293B`（与 tokens.json / globals.css / 分享版同步）；引擎 `darkBrandMode:"fixed"`，暗色不随品牌。
## [规范展示页图表合规] — 2026-11-03

- `移动端规范展示_20260806_0755.html`（及分享版）：折线 points 拉伸至纵向覆盖 ≥70%；尺寸改 4px 网格（150→152 / 30→32 / 17→16px）。真源未改。
## [规范展示页框架升级] — 2026-11-03 · 移动端展示页对齐当前 page-template

- `移动端规范展示_20260806_0755.html`（及其分享版）补 `<body class="ios" data-species="document">`，与当前移动端 `page-template.html` 的 species 维度对齐；分享版按当前移动端 `template.css` 重新内联生成。移动端真源无语言切换（框架规格如此），故未加。真源未改。
## [产物刷新] — 2026-11-03 · 移动端规范展示分享版按当前真源重建

- `移动端规范展示_20260806_0755_分享版.html` 重新生成：内联**当前**移动端 `template.css`（1.14.28 功能色深档口径已在列）；真源未改，仅产物刷新。
- 产物内容审计 `audit-spec --end mobile` 0 HIGH。
## [1.14.28] — 2026-10-20 · 功能色实底标签改深档（M2 口径收敛）

- `.mtag-suc/.mtag-warn/.mtag-err/.mtag-run` 实底由 `--suc/--warn/--err/--run` 改为 `--suc-btn-bg/--warn-btn-bg/--err-btn-bg/--run-btn-bg`（亮 #047857 / #B45309 / #B91C1C / #15803D），白字保留：2.46 / 2.15 / 3.76 / 3.30 → **5.48 / 5.02 / 6.47 / 5.02**；暗色沿用明亮底 + 深字（6.4–9 级）。
- 新增 `--run-btn-bg`（亮 #15803D / 暗 #22C55E）与 `tokens.functional.running.btnBg`；移动 RULES §10.3b 补丁扩到标签。

---

## [1.14.27] — 2026-10-20 · 功能色对比与字阶整改（用户采纳 3 条移动项）

- **功能色当文字**：新增 `--suc-deep`/`--warn-deep`/`--err-deep`（亮 #047857/#B45309/#B91C1C，暗 #34D399/#FBBF24/#F87171）；`.m-notice-* .m-notice-ico`、`.m-po-item.* .m-po-value`、`.mmodal-item.on` 改用深变体（原 2.54/2.15/3.76 → 5.48/5.02/6.47）。
- **功能色实底按钮**：新增 `--suc-btn-bg`/`--warn-btn-bg`/`--err-btn-bg`；`.mbtn-success`/`.mbtn-danger` 底色加深（#047857/#B91C1C + 白字 5.48/6.47，原 #10B981 上的近白字仅 2.46）。
- **字号三套值收敛**：`.m-text-h1` 24/32 → **28/36**（对齐 tokens.android H1），新增 `[data-os="ios"] .m-text-h1{26/34}`；不再出现第三套。
- 附带：暗色 `.m-text-caption` 由 n7（#475569 描边色）改 n9，修暗底几乎不可读。

---

## [1.14.26] — 2026-10-20 · 表格行选中口径澄清（无代码改动）

- RULES §3.3 补注：Web 表格「已选 / 当前行」双态（`.is-selected` + `.cbx` / 2px 左条），本端列表项保持 `.08` + 标题加粗，**双端不统一**（§3.6 分治）。

## [1.14.26] — 2026-10-20 · 对称留痕：跨智能体交接制度（HANDOFF 每轮更新）

- 流程文档改动（`HANDOFF.md` / `AGENTS.md` / `GENERATION-SOP.md §0`），移动端真源无改动；主条目见 web CHANGELOG [1.9.39]。

---

## [1.14.25] — 2026-10-10 · 对称留痕：check-sync T-7 结案（Mobile 检查一「不适用」定性）+ T-6 登记闭环

- **T-7 结案**：mobile vendor 46 类全 mn-*（Taro 组件层自有命名空间），同构段 0 类 = 检查一对本端显式不适用（设计如此），check-sync 输出 ⏭️；非缺口、不阻断。
- **T-6/T-8**：vendor-coverage.json 登记闭环 + 阈值上调治理约束（主条目见 web CHANGELOG [1.9.38]），移动端真源无同构改动。

---
