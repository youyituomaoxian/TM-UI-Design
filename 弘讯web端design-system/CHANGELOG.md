# 弘讯B端视觉系统 · 设计系统更新日志（CHANGELOG）

---
> 📦 历史条目已滚动归档：web 归档 `[1.9.27]`（2026-09-10）及更早见 [`CHANGELOG-archive.md`](CHANGELOG-archive.md)（2026-09-22）。

---

## [1.9.45] — 2026-10-20 · `.tag` 物理删除 + 全库迁移（用户追认）

- **删除 `.tag` 组件**：`template.css` 移除 `.tag/.tag-suc/.tag-warn/.tag-err/.tag-run/.tag-def` 及 hover/disabled 规则；`components.json` 删除 tag 组件条目与 `tag.size` 契约、两处 selector 去 `.tag`；`DESIGN-TOKENS §7.3` 改为「标签 Badge」规格；组件数 22 → **25**（-tag +empty/steps/timeline/descriptions）。
- **迁移**：`web规范展示_框架版_20260806_1050.html` 与其分享版共 **22 处** `class="tag tag-*"` → `badge badge-*`（tag-def → badge-muted），分享版内联 `.tag*` CSS 同步删除；文档（RULES ×5、VISUAL-SPEC、packages/web-ui/README）同步为 `.badge`/徽章。
- **体积上限追认**（用户 2026-10-20 确认）：`components.json` 77200、`template.css` 62000、`components.md` 16800、`DESIGN-TOKENS.md` 15600。
- **焦点环不做**（用户 2026-10-20 决策）：现 20% primary 环保留，理由「视觉上无问题，符合科技克制的设计哲学」；`--focus-ring` 与 11 处 focus 规则维持原状，HANDOFF 不再列为待办。

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

## [1.9.43] — 2026-10-20 · 三处同根因缺陷修复（暗色选中 / badge-muted / badge 溢出）

- **暗色白底表面选中 1.99:1 → 10.56:1**：新增 `--select-item-bg` / `--select-item-fg`（亮 `#DAEAFA`/`#004A8F`，暗 `#23395D`/`#F1F5F9`），`.sel-opt.on` / `.tree-node.on` / `.filter-chip.on` / `.lang-opt.on` 改用这对 token；品牌蓝底侧栏变体仍走自己的覆盖，不受影响。
- **`.badge-muted` 4.44:1 → 9.40:1**：文字由 N9 提为 N10（`#334155` on `#F6F9FC`）；暗色同理达标。
- **`.badge` 文字溢出定高盒**：改 `display:inline-block` + `line-height:22px` + `white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%`（原内容 38px 撑不进 22px 盒、第二行无底色溢出；现超宽显示 `…`）；窄列仍按 RULES §1.1b 收敛为「2 个 + +N」。
- 派生产物：`globals.css` / `template.css` 重生成，`page-template.html` 内联 `:root` 同步两个新变量，`DESIGN-TOKENS.md` §2.8 补两行。

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

## [1.9.41] — 2026-10-20 · 复选框补单选变体（`.cbx--radio`）

- `components.css` 增 `.cbx--radio`：同 `.cbx` 尺寸/边框（16/3.03:1），圆形 + 主色内点 8px；用于表格「单选」列（互斥）。
- `components.json` checkbox `variants` 补「单选（圆形 .cbx--radio）」。
- `.cbx svg` 默认 `opacity:0`，仅勾选/半选显示（防未选行露出勾）；
- `validate-spec` 的 `table.row.selected.cue` 接受单选控件（`role=radio` / `input[type=radio]`），不再只认 checkbox。
- 语义：`.is-selected` = 被选中（多选 checkbox / 单选 radio 均可）；`.is-current` = 键盘/定位当前行，两者独立。

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
