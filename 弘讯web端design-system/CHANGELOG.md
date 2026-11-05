# 弘讯B端视觉系统 · 设计系统更新日志（CHANGELOG）

---
> 📦 历史条目已滚动归档：web 归档 `[1.9.27]`（2026-09-10）及更早见 [`CHANGELOG-archive.md`](CHANGELOG-archive.md)（2026-09-22）。

---

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
