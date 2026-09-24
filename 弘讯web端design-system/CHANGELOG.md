# 弘讯B端视觉系统 · 设计系统更新日志（CHANGELOG）

---
> 📦 历史条目已滚动归档：web 归档 `[1.9.27]`（2026-09-10）及更早见 [`CHANGELOG-archive.md`](CHANGELOG-archive.md)（2026-09-22）。

---

## [1.9.37] — 2026-09-23 · 消费应用侧报告 DS-20260923-01 核验回执：修复 page-template.html 畸形 `:root` 块

- **修复内容**：删除 `page-template.html` 第 111–114 行的畸形块——L111 孤立 `:root` + L112–114 缩进重复的密度声明（`:root[data-density=compact/comfortable/spacious]`）。该块自仓库首个提交 `5aca169`（2026-08-06 init）即存在，属历史导入携带缺陷。
- **定性修正（维护侧核验）**：非应用侧报告所称「4 行纯死代码」，实为 **1 条死规则 + 2 条活着的重复声明**——L111 与 L112 合成后代选择器 `:root :root[…]` 永不命中；L113/L114 各自独立成合法命中规则（取值与 L108/L109 正确块重复）。严重级维持 P2（无功能/视觉/门禁影响）。
- **影响面**：仓内 12 个历史产物 + 应用侧克隆页共 13 处同构命中（模板克隆传播）——本次只修真源模板，存量产物不回改（历史快照纪律）。
- **门禁未削弱**：核验实测 `extractRootScopeVars` 对畸形块不采信（投毒 token 不可见），无假阴性放行。
- **回归验证**：删除后模板 `root[data-density]` 仅正确块 3 处、无孤立 `:root` 行、`<style>` 配对完整；ci-local 全绿（100 pass / 0 fail，项数以输出为准）。
- **冻结指纹刷新**：page-template.html 在 web-ui `sha256-baseline.json` 冻结清单内，已跑 `freeze-baseline.js` 刷新（含此前批 2/3 未提交的 validate-spec.js 指纹一并归位）。

---

## [1.9.36] — 2026-09-23 · 监督闭环修复批（SUP-20260923-0855 audit · T-E2/E3/F1/F2）

- **词典交付通道修复（ISSUE-02）**：.gitignore 改嵌套负向链（`**/.workbuddy/*` 逐级放行 `skills/tm-design-system/` 全目录）——vocabulary.json 此前被 `**/.workbuddy/` 目录级忽略，推送后 SKILL §2 指针在消费者侧悬空；验证 check-ignore 不再命中、嵌套子项目 .workbuddy 仍忽略。
- **M-07 白名单双源化（ISSUE-01）**：buildTemplateMotionNames 并收 `@keyframes` 定义名（16→19）——shimmer/toast-in/toast-out 等规范动画只定义未在模板内引用，页面正常使用规范骨架屏/规范 toast 即误报 HIGH。四用例复测：模板页 0 / 白名单豁免 / 自造双动画 HIGH×1 / shimmer+toast-in 回归 0。
- **species workbench 最小判据（T-F1）**：validate-spec 新增——声明 workbench 但无 `.stat-grid` 工作台骨架 → MEDIUM（提示级，防形式字段退化）；RULES §1.1c 门禁 bullet 同步。双用例实测：无骨架出现 / 有骨架不出现。
- **check-size 清单封闭扩展名（T-F2）**：+`.txt`/`.log`，堵「换扩展名落根目录」的膨胀转移盲区（A1 FAIL 根因同源）。
- **audit-rules.json v1.6.0 → v1.6.1**：M-07 predicate 补白名单双源口径。
- **验证**：ci-local 全绿（项数以输出为准）；check-size 0 FAIL。

---

## [1.9.35] — 2026-09-23 · 页面 species 正交维度 + register 口径显式化（批 2e · C-3/C-4）

- **RULES 新增 §1.1c「页面 species 正交维度 + register 口径」**：①`<body data-species="workbench|document">` 与 §1.1b 页面类型**正交组合**（不新增平行页型，防物种爆炸——J2 修正形态）；语义约定：workbench 页首屏模块数 ≥3 且每模块带标题条，document 页禁 KPI 网格拼盘。②register 口径显式化（C-4，零行为变更）：B 端工具页 = `product` register（克制哲学显式登记，不引入新旋钮）；Brand Visual Kit = `brand` register（允许表现力），brand 手法带回工具页 = §2 违规。
- **page-template.html**：body 预置 `data-species="document"`（克隆即带默认值）。
- **validate-spec.js 新增 species 检查**：缺失 → MEDIUM（存量渐进补齐，不阻断）；值非法 → HIGH（防物种爆炸机器判据）。正反例实测：模板页 0 HIGH / 非法值页 HIGH 拦截。
- **验证**：check-size 通过；ci-local 全绿（项数以输出为准）。

---

## [1.9.34] — 2026-09-23 · M-07 节拍预算（机器实现）+ Design Read 停等（批 2d · C-5/C-6）

- **audit-rules.json v1.5.0 → v1.6.0**：新增 **M-07 `motion.beat.budget` 节拍预算**——一页最多一个 heavy 动效。scope：页面内 `<style>`/inline 的 animation 声明（`<link>` CSS 不扫，template.css 规范动效合法；transition 微交互不计；@keyframes 定义行不算引用）；predicate：唯一 animation-name 去重 >1 → 超出部分每条 HIGH。
- **audit-spec.js 实现并正反例实测**：正例（3 动画测试页）→ 报出超预算 HIGH、transition 正确豁免、重复 name 去重；反例（page-template.html）→ M-07 零违规零误报。
- **GENERATION-SOP §① 新增步骤 1.6「Design Read 停等确认」**：生成前向用户输出设计读（选端/框架判定/页面类型/内容结构模块清单/规范依据）并停等——不确认不动手；跳过 = 流程违规（用户明示「直接做」可记录跳过）。
- **验证**：check-size 通过（0 FAIL）；ci-local 全绿（项数以输出为准）。
- **误报修正（同日）**：首版 M-07 对内联真源 CSS 的分享版产物误报 15 条 HIGH——模板真源动画名集合白名单化（buildTemplateMotionNames），预算只管页面自加动画；audit-spec 阈值 20,400→22,000（功能增长，六步留痕）。正反例三层复测通过。

---

## [1.9.33] — 2026-09-23 · D 层 trap+pairs + 口语→术语词典（批 2c · T-C 落地）

> finesse 借鉴项经监督修正后落地（J1/J2 修正形态）。另：批 2③ 复述收尾盘点结论——双端 RULES + SOP 共 158 行含 hex，全部为教学性提及（状态矩阵表/功能色对照/禁令表，且与 token 名并列、失真显式可见），**判定保留不治理**；「复述会失真」的害处集中在静默的数字基线，已于批 2a 治理收口。

- **audit-rules.json v1.4.1 → v1.5.0**：migration_dimensions D-1~D-12 每维新增 `trap`（该维最常犯错误，AI 生成页典型病）+ `pairs`（正误对照 bad/good，12 维共 14 对）——审查与生成共用同一份「错误长什么样」的对照语料，供 LLM 对照识别，非机器断言（机器断言仍走 M/R 层）。
- **语汇词典（C-1，data 与 prompt 分离）**：`.workbuddy/skills/tm-design-system/data/vocabulary.json` 新建（24 词条：say 口语数组 → map 弘讯术语/组件类 → rule 规范落点指针）；SKILL.md §2 新增第 5 条指针（触发条件：解析口语需求、不确定组件归属时按需检索，**不整份进上下文**）。J1 修正口径：正文留指针+触发条件，内容下沉 data。
- **check-size 阈值调整（维护者六步）**：audit-rules.json 25,600 → 28,600（D 层新增字段属合法内容增长，26,263 现值 + 8% 余量；归位治理优先于调阈值的原则不受影响）。
- **漏网补清**：`.workbuddy/` 为隐藏目录，ripgrep 默认跳过致 A-1 漏扫——tm-design-system SKILL.md「99 pass」复述已补改指针，深层复扫零残留。
- **验证**：ci-local 全绿（项数以输出为准）；audit-rules.json JSON 合法 + 12 维 trap/pairs 复测齐全。

---

## [1.9.32] — 2026-09-22 · 文档体积门禁 check-size 接入 ci-local（批 2b · T-B）

> 承 [1.9.31] 批 2a——体积门禁按监督实战沉淀的 J5 修正实现：字符数为主行数为辅、阈值先实测现值、先归位治理、防膨胀转移。

- **check-size.js 新增（根目录，与 check-sync.js 并列）**：①清单内真源文件字符数超限阻断（阈值 = 2026-09-22 实测现值 + 分级余量：≤10k +15% / 10~50k +8% / >50k +5%，共 42 项）；②**清单封闭防膨胀转移**——根 / 双端目录顶层新增 .md/.json/.js/.html/.css 未登记且未豁免即 FAIL（堵「拆文件绕阈值」）；③预警口径 = 剩余增长空间 <2%（首版 90% 线在 +8% 余量下数学上必然低于现值，全表误报，已修正）；④豁免清单登记产物与过程记录（USAGE.html、规范展示页、创作记录等）。
- **ci-local.js 挂载**：check-sync 之后新增 check-size 阻断段（子进程 + ok() 断言，同构现有模式）。门禁基线相应 +1。
- **阈值调整纪律**：走维护者六步（登记 → 改 check-size.js → ci-local 全绿 → 双端 CHANGELOG 留痕）；**归位治理优先于调阈值**。
- **验证**：`node check-size.js` 独立通过（0 FAIL / 8 WARN，WARN 为信息性）；ci-local 全绿（项数以输出为准）。

---

## [1.9.31] — 2026-09-22 · 加载纪律（批 2a）：基线治理——SSOT 复述指针化 + CHANGELOG 滚动归档 + 数字引用纪律

> 背景：跨窗口监督实战（SUP-20260922-1640）暴露「以记忆/旧值代替实测」系统性缺口——3 条断言同源失真于引用旧提交基线值（7789a2c 时的行数/项数，实际 main 已 d3c83dd）。归因：执行缺口（活文档复述数字会漂移）+ 制度缺口（无数字引用规则）。

- **SSOT 复述指针化（A-1）**：AGENTS / README / USAGE-GUIDE / USAGE.html / USAGE_分享版 / 团队使用指南 / HANDOFF 共 17 处「99 pass」类门禁项数复述改为指针（「项数以输出为准」）；CHANGELOG 条目与 `output/` 复盘中的数字属历史快照，按新纪律不回改。
- **CHANGELOG 滚动归档（A-2）**：web 主文件 29,906 → 9,352 字符（[1.9.21] 及更早 21 条原样移入 `CHANGELOG-archive.md`）；切割由确定性脚本完成（行数 + 锚点双重断言），主文件头部加归档指针。
- **数字引用纪律（A-3）**：SOP §0 新增第五节——①活文档禁复述会漂移的数字（一律指针化）；②快照值须标注「实测命令 + 实测日期」；③历史记录不回改、不作当前基线引用。
- **验证**：`node ci-local.js` 全绿（项数以输出为准）。本批不动样式真源与冻结区，指纹无需刷新。


## [1.9.30] — 2026-09-10 · 维护侧自发现：M-06 判级与文案自相矛盾（v1.4.1）

> 背景：维护侧复核应用侧报告 DS-20260910-01 的 §10 自愈结论时**主动实测**发现的新题（应用侧未提请）——11242 `page_dashboard.html` 报「HIGH 0」，实际 `content/shared/tm-ui-design.css` **L163/L183** 的 `color:#94a3b8`（∈ web 色板 `dark.colors.neutral.N8`）是**色板内裸 hex 引用行**，按 M-01 同口径应判 HIGH 却被放行。归因：设计系统问题（真源谓词未声明分层 + 实现私自套用他规则语义），无执行缺口。

- **根因**：`audit-spec.js` M-06 分支写成 `severity = frozen ? 'MEDIUM' : (inPalette ? 'MEDIUM' : 'HIGH')`——`inPalette ? MEDIUM` 是**从 M-01 私自套用**的；而 M-06 真源只定义 frozen(dist) 一条降级路径、谓词明写自维护层「维持 HIGH 口径」。**同一行代码判 MEDIUM、文案却说「维持 HIGH 口径」→ 实现与规则自相矛盾**。
- **真源 v1.4.0 → v1.4.1**（**用户拍板方案 A：对齐 M-01 口径**）：M-06 `predicate` 补「色板内外分层」明写——自维护层 ∈ 色板 → MEDIUM（合法色，必须改 `var()`）/ ∉ 色板 → HIGH（自造色，须映射 token 或回 tokens.json）；`severity` 字段由二分改三分（`HIGH(自维护·自造色)/MEDIUM(自维护·色板内应改引用)/MEDIUM(冻结 dist 产物)`）。
- **audit-spec.js**：M-06 文案拆三分支并与判级一致；沿用 M-01 同款措辞（「合法色但必须改用 var(--token)」/「自造色」），消除跨规则措辞漂移。
- **选 A 的理由（第一性）**：M-01 的 `HIGH(非色板)/MEDIUM(色板内)` 分层是有意义的设计——**自造色是规则缺口（须映射），色板内是执行惰性（改 var 即可）**。M-06 必须同口径，否则「同一个 `#005EAE` 裸 hex，写在 `<style>` 里判 MEDIUM、写在 `<link>` CSS 里判 HIGH」这类荒谬判定会持续。真正要修的是**文案说谎** + **真源缺分层声明**，而非收紧判级。
- **对应用侧结论的影响**：11242「2 项 MEDIUM」**判级结论有效、无需回改**（色板内 MEDIUM 与 M-01 一致）；但其「按 MEDIUM 可接受口径保留」的理由须更正为「色板内合法色 → MEDIUM，应改 `var()`」，而非「色板内无对应 var 故保留」。§10 其余处置（token 化收敛、纯 `:root{}` 块下沉）**依然合规、无需回滚**。
- **报告 §3 根因勘误**：报告称根因是「掩码正则 `:root\s*\{[^}]*\}` 不覆盖 `:root:not(...){...}` 条件根块」——**v1.4.0 实测不成立**：条件根块内 `--bg-deep:#070b12` → MEDIUM `css.vardef.hex`（正确）、引用行 → HIGH（正确）。`css.vardef.hex` 是**行级谓词（属性名以 `--` 开头）**，先于掩码生效，掩码非必经路径；**两处掩码（页面 L136 / 引用 CSS L345）均无需改**。该描述系应用侧在 v1.3.1 旧版下的推断、未在 v1.4.0 复测，已在 feedback_log 更正。
- **回归验证**：`#94A3B8`（∈色板，引用行）→ MEDIUM + 文案「色板内·须改 var」；`#070B12`（∉色板，引用行）→ HIGH；`fixture` 复测判级不因所在文件（`<style>` vs `<link>` CSS）而异。ci-local 99 pass / 0 fail。

---

## [1.9.29] — 2026-09-10 · 回灌应用侧报告 DS-20260910-01：M-06 口径修正（v1.4.0）

> 背景：应用侧按新制度提交**首份合格报告**（`I:/workbuddy/弘讯设计系统应用/output/设计系统问题_20260910_01_M06口径.md`，P1，合格线三判据全过）。两题均复现属实：① M-06 把**自维护 CSS 的变量定义行**（`--x:#hex`）也判 HIGH「自造色」→ 自维护层陷入「定义违规、引用违规、平台无 token」死锁（11242 实测 147 处 HIGH）；② `audit-spec.js` 横幅硬编码 v1.2.0，真源已 v1.3.1。归因：规则缺口（设计系统问题），无执行缺口。

- **audit-rules.json v1.3.1 → v1.4.0**：新增子契约 **`css.vardef.hex`**（M-01/M-06 共用）——声明属性名以 `--` 开头者 = **色板本体非用法**，判 MEDIUM 清单级不阻断（自造色板须可见：映射 token / 回 tokens.json / exemptions 按块登记）。根因是原豁免绑在 `:root`/`[data-theme]` **选择器**上（绑错维度），换作用域即误报；**修法比报告建议更进一步**：统一以**属性名**判定，M-01 页面侧同步（避免双规则口径不一致），不只改 M-06。
- **audit-spec.js**：M-01/M-06 双路径加 `css.vardef.hex` 判定（抽 `declPropAt()`/`isVarDef()` helper 去重）；**版本号改动态读取** `audit-rules.json $meta.version`——横幅（L368）与 `--json` 输出 `ruleset` **两处**均修（报告只发现横幅一处，JSON 侧仍硬编码 v1.0.0，已一并修，符合 §0 SSOT「不复述数字」原则）。
- **双端 RULES 自造底线**补「自维护色板定义出口」条：定义行不计「裸 hex 用法」违规，**引用处仍必须 `var()`**。
- **回归验证（报告 §9 样例）**：定义行 → MEDIUM `css.vardef.hex`；引用行 → 维持 HIGH `css.asset.hex`；横幅/JSON 版本随真源。**应用侧因此可达 0 HIGH**——其 §10 拟定豁免预案（定义行按 exemptions 登记）**无需执行，可撤**。ci-local 99 pass / 0 fail。

---

## [1.9.28] — 2026-09-10 · 加载纪律（批 1）：必读集预算 + 章节索引 + SSOT 清单

> 背景：实测文档层 23 份核心文本 = 468k 字符；单端「skill 声称必读」≈300~340k 字符 ≈100~140k tokens，最小必读集（SOP §① 13.3k + 单端 RULES 46k + tokens 12k = 71k）≈45~55k tokens。根因（设计系统问题）：全文加载无章节检索 / 同一事实多处复述（#005EAE 72 次 · 44px 36 次 · 0 HIGH 44 次）/ 机器资产被列入必读（components.json 70k、validate-spec.js 107k）/ 无体积预算。

- **GENERATION-SOP 新增 §0「加载预算与章节索引」**：必读 3 项（SOP §① + 端 RULES 命中章节 + tokens.json colors 段）；**不通读清单**（components.json / template.css / validate-spec.js / ci-local.js）；章节索引（SOP §①②③ 各附录字符数）；**单点事实源 SSOT 表**（品牌色→tokens.json / 组件契约→components.json / 审计规则→audit-rules.json / 图表→CHART-SPEC / 治理契约→RULES 页首 / 交付线→ci-local 输出：同一事实只认一处，其余写指针）。**预算 ≤35k 字符**。
- **双端 RULES.md 页首新增「章节索引」**：逐章字符数 + 何时读 + [软]/[硬] 标记，明确「别整份加载」与机器资产不通读。
- **AGENTS.md 阅读策略重写**：必读 3 项 / 按需检索 / 不通读清单 / SSOT / 禁用整份加载（实测数字替换旧的「~80KB」）；流程步骤 3 的 components.json·template.css 处标注「门禁与构建消费，Agent 不通读」。
- **tm-design-system skill §2 重写**：加载预算 ≤35k + 必读 3 项 + 按需检索 + 不通读清单（薄壳原则，不复制规范本体）。
- **批 2 遗留（未做）**：正文复述文本按 SSOT 表替换为指针（需逐处核对语义）；CHANGELOG 滚动归档；文档体积门禁。
- **同批追加（v1.3.1 · 制度冲突实证收口）**：应用侧克隆内发现未提交的真源改动（自行登记 11242 `page_dashboard.html` FOUC 启动色 `#0a0e17` 豁免）——旧 change_policy 要求无写权角色回灌所致的越权写入。维护侧**吸收进真源 `exemptions`**（内容合法：与平台 dist `--bg-deep` 精确同值 + 用户已拍板），`registered_by` 注明来源与回灌确认；应用侧回滚本地改动后从 GitHub 拉取。**分发口径同时确立：下游唯一来源 = GitHub 拉取**，维护侧不做跨项目巡检（与 `issue_reporting.consumption_model` 被动消费一致）。

---
