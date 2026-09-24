# 弘讯移动端设计系统 — Changelog

> 语义版本（与 Web 端 `CHANGELOG.md` 同构）。所有「值」以 `tokens.json` 为唯一真源；所有「组件尺寸/色值」以 `components.json` 为唯一真源。

---
> 📦 历史条目已滚动归档：mobile 归档 `[1.14.13]`（2026-09-10）及更早见 [`CHANGELOG-archive.md`](CHANGELOG-archive.md)（2026-09-22）。

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

## [1.14.18] — 2026-09-22 · 加载纪律（批 2a）：基线治理（与 Web 1.9.31 对称）

> 背景：同 Web 端 [1.9.31]——监督实战暴露「以记忆/旧值代替实测」缺口，批 2a 三项治理落地。

- **CHANGELOG 滚动归档**：主文件 23,122 → 4,137 字符；[1.14.8]（2026-08-25）及更早条目原样移入 `CHANGELOG-archive.md`（行数 + 锚点断言脚本切割）。
- **数字引用纪律**：SOP §0 新增第五节（活文档禁复述会漂移的数字 / 快照值标注实测来源 / 历史记录不回改）。
- **验证**：`node ci-local.js` 全绿（项数以输出为准）。


## [1.14.17] — 2026-09-10 · 维护侧自发现：M-06 判级与文案自相矛盾（v1.4.1）

> 背景：同 Web 端 [1.9.30]——维护侧复核应用侧报告 DS-20260910-01 的 §10 时主动实测发现：M-06 对自维护 CSS 套用了 M-01 的 `inPalette` 分层，而 M-06 真源只定义 frozen(dist) 一条降级路径、谓词明写自维护层「维持 HIGH 口径」，同一行代码判 MEDIUM 却输出「维持 HIGH 口径」文案。归因设计系统问题。

- **真源 v1.4.0 → v1.4.1**（用户拍板方案 A：对齐 M-01 口径）：M-06 `predicate` 补「色板内外分层」明写（自维护层 ∈ 色板 → MEDIUM「合法色必须改 var」/ ∉ 色板 → HIGH「自造色」）；`severity` 字段二分改三分。
- **audit-spec.js**：M-06 文案拆三分支并与判级一致，措辞对齐 M-01（消除跨规则漂移）。
- **报告 §3 勘误**：报告声称根因是「掩码正则不覆盖 `:root:not(...)` 条件根块」——实测在 v1.4.0 下**不成立**（条件根块定义行 → MEDIUM、引用行 → HIGH 均正确）；`css.vardef.hex` 为行级谓词，先于掩码生效，两处掩码均无需改。
- **Mobile 侧同受益**：移动自维护 CSS 中色板内颜色裸 hex（引用行）不再因误判降级而漏放；判级与 Web 端一致。ci-local 99 pass / 0 fail。

---

## [1.14.16] — 2026-09-10 · 回灌应用侧报告 DS-20260910-01：M-06 口径修正（v1.4.0）

> 背景：同 Web 端 [1.9.29]——应用侧首份合格报告（M-06 口径两题）复现属实，归因规则缺口。audit-rules v1.4.0 新增子契约 `css.vardef.hex`（定义行判 MEDIUM 清单级，引用行维持 HIGH）；audit-spec.js M-01/M-06 双路径落地 + 版本号改动态读取（横幅与 `--json` ruleset 两处）；双端 RULES 自造底线补「自维护色板定义出口」条。Mobile 侧同受益：移动自维护 CSS 的色板定义不再误判 HIGH。

---

## [1.14.15] — 2026-09-10 · 加载纪律（批 1）：必读集预算 + 章节索引 + SSOT 清单

> 背景：同 Web 端 [1.9.28]——实测单端必读集 71k 字符 ≈45~55k tokens，根因为全文加载 / 事实复述 / 机器资产被列入必读 / 无预算。本批零风险组织优化，真源不动：GENERATION-SOP 新增 §0（必读 3 项 + 不通读清单 + 章节索引 + SSOT 表，预算 ≤35k 字符）；双端 RULES 页首加「章节索引」（Mobile 11 章逐章字符数 + 何时读）；AGENTS.md 阅读策略重写；skill §2 重写。批 2 遗留：复述文本指针化替换、CHANGELOG 归档、文档体积门禁。
>
> 同批追加（audit-rules v1.3.1 · 制度冲突实证收口）：应用侧克隆内未提交的真源改动（自行登记 FOUC 启动色豁免）→ 维护侧吸收进真源 `exemptions`，应用侧回滚后从 GitHub 拉取；**下游唯一来源 = GitHub 拉取**，维护侧不做跨项目巡检。

---

## [1.14.14] — 2026-09-10 · 报告制度闭环补齐 v1.3.0（模板 + schema + 通道 + 回执 + 被动消费）

> 背景：同 Web 端 [1.9.27]——工作流五拍复盘查出 8 缺口。用户拍板：G3 通道=对话内告知用户转交；G5 不建应用项目注册表（应用者反馈，不去打扰）；其余按推荐执行。audit-rules.json v1.3.0 `issue_reporting` 补齐 `template_file`（新增 `templates/设计系统问题报告模板.md`）/ `report_schema`（报告头 + 必填六项 + 执行关键五项）/ `report_quality_bar` 三判据 / `channel` / `consumption_model`（被动消费）/ `maintainer_duty`（回执三件套 + 仲裁 + 临时处置回滚）/ `feedback_log_contract`（related_reports）。GENERATION-SOP 记录义务节升级 + G6 维护会话入口检查；tm-design-system skill 补指路与铁律。

---
