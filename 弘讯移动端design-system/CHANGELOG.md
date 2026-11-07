# 弘讯移动端设计系统 — Changelog

> 语义版本（与 Web 端 `CHANGELOG.md` 同构）。所有「值」以 `tokens.json` 为唯一真源；所有「组件尺寸/色值」以 `components.json` 为唯一真源。

---
> 📦 历史条目已滚动归档：mobile 归档 `[1.14.13]`（2026-09-10）及更早见 [`CHANGELOG-archive.md`](CHANGELOG-archive.md)（2026-09-22）。

---

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

## [1.14.24] — 2026-09-23 · 对称留痕：Web 修复 page-template.html 畸形 `:root` 块（移动端无同构缺陷）

- **背景**：维护侧消费应用侧报告 DS-20260923-01 核验回执，修复 Web `page-template.html` L111–114 畸形块（孤立 `:root` + 缩进重复密度声明）。
- **移动端核验结论**：移动端 `page-template.html` 经扫描**无同构缺陷**（无孤立 `:root`、无缩进重复 density 声明），**不联动修改**——仅对称留痕。
- **验证**：ci-local 全绿（100 pass / 0 fail，项数以输出为准）。

---

## [1.14.23] — 2026-09-23 · 监督闭环修复批（与 Web 1.9.36 对称）

- **词典交付通道**：.gitignore 嵌套负向链放行 skills/tm-design-system/（vocabulary.json 不再被目录级忽略，推送后消费者侧词典可见）。
- **M-07 白名单双源化**：audit-spec 并收 @keyframes 定义名（16→19），规范 shimmer/toast 动画不再误报节拍超限；四用例复测通过。
- **RULES §1.1c**：登记 workbench 骨架判据为 web 侧 .stat-grid（mobile 真源无 stat-grid 骨架，暂不机器判——已知边界）。
- **check-size**：清单封闭扩展名 +.txt/.log（堵膨胀转移）；audit-rules.json v1.6.1。
- **验证**：ci-local 全绿（项数以输出为准）。

---

## [1.14.22] — 2026-09-23 · 页面 species 正交维度 + register 口径显式化（与 Web 1.9.35 对称）

- **RULES 新增 §1.1c**：`<body data-species="workbench|document">` 与 §1.1b 页面类型正交组合（防物种爆炸）；register 口径显式化（B 端工具页 product / Brand Visual Kit brand，互不越界）。
- **page-template.html**：body 预置 `data-species="document"`。
- **validate-spec.js**：species 检查（缺失 MEDIUM / 非法值 HIGH），正反例实测通过。
- **验证**：check-size 通过；ci-local 全绿（项数以输出为准）。

---

## [1.14.21] — 2026-09-23 · M-07 节拍预算 + Design Read 停等（与 Web 1.9.34 对称）

- **audit-rules.json v1.6.0**：新增 M-07 `motion.beat.budget`（一页最多一个 heavy 动效；页面内 animation 声明唯一 name 去重 >1 即超，`<link>` CSS 与 transition 不计）。
- **audit-spec.js 实现**：checkMotionBeat 挂载（正反例实测：多动画测试页报 HIGH / page-template 零误报）。
- **GENERATION-SOP §①**：新增步骤 1.6 Design Read 停等确认（生成前输出设计读，停等用户确认）。
- **验证**：check-size 通过；ci-local 全绿（项数以输出为准）。
- **误报修正（同日）**：首版 M-07 对内联真源 CSS 的分享版产物误报 15 条 HIGH——模板真源动画名集合白名单化（buildTemplateMotionNames），预算只管页面自加动画；audit-spec 阈值 20,400→22,000（功能增长，六步留痕）。正反例三层复测通过。

---

## [1.14.20] — 2026-09-23 · D 层 trap+pairs + 口语→术语词典（与 Web 1.9.33 对称）

- **audit-rules.json v1.5.0**：D-1~D-12 每维新增 trap（最常犯错误）+ pairs（正误对照，12 维 14 对）——审查与生成共用对照语料。
- **语汇词典**：tm-design-system skill data/vocabulary.json（24 词条，口语→弘讯组件/规范落点）；SKILL.md §2 加按需检索指针（不整份进上下文）。
- **check-size**：audit-rules.json 阈值 25,600 → 28,600（合法内容增长，六步留痕）。
- **验证**：ci-local 全绿（项数以输出为准）。

---

## [1.14.19] — 2026-09-22 · 文档体积门禁 check-size 接入 ci-local（与 Web 1.9.32 对称）

- **check-size.js 新增**：真源文件字符限额（阈值 = 实测现值 + 分级余量）+ 清单封闭防膨胀转移（未登记新文件即阻断）+ 剩余空间 <2% 预警。移动端 RULES / MASTER / DESIGN-TOKENS / components / template.css / tokens / page-template / validate-spec / CHANGELOG 等全部入清单。
- **ci-local.js 挂载**：check-sync 后新增阻断段；门禁基线相应 +1。
- **验证**：`node check-size.js` 通过（0 FAIL）；ci-local 全绿（项数以输出为准）。

---
