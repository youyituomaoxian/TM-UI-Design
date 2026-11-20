# 弘讯B端视觉系统 · Web 端设计系统更新日志（归档）

> 本文件为 `CHANGELOG.md` 的滚动归档（2026-09-22 建立）：主文件只保留近期条目，更早条目**原样移入**此处，未做任何内容修改。
> **分卷（2026-11-20）**：归档容器触顶后按时间拆卷——本卷只保留 **2026-10 及之后**；**2026-09 及更早**见 [`CHANGELOG-archive-2026-08_09.md`](CHANGELOG-archive-2026-08_09.md)（冻结卷，不再追加）。
> 切割线（2026-11-20 手工归档）：web 归档 `[说明文档与门禁覆盖对齐：showcase 参与方式 / 死引用 / 写死体量]` 及更早。新条目一律写主文件顶部；超限时由 roll-changelog.js 自动滚动。

## [说明文档与门禁覆盖对齐：showcase 参与方式 / 死引用 / 写死体量] — 2026-11-20
- **showcase 描述**：AGENTS / USAGE-GUIDE / 团队指南 / USAGE.html 原写「参与门禁（validate/树运行时/工具区）」属一刀切——实际按文件类型：源页过 validate + 组件复用、含 `.rail` 的过树运行时、含 `.ws-tools` 的比对外壳真源、分享版查零外链；补 `表格规范展示` 两行（源 + 分享版），`showcase/README` 增门禁参与说明与入口清单。
- **其它过期**：README 仓库树/START-HERE 可直接打开清单补登录页与表格；START-HERE §4 历史行补冻结卷、AGENTS 读法去掉写死体量；USAGE-GUIDE 的 verify 子命令补 shell/manifest/chrome/icons/spec。
- **查漏手段**：全仓 `node <script>.js` 引用做存在性扫描（26 个引用，0 死链；brand-color-engine 为相对路径误报）。
- **实测**：`verify all` 全绿；check-size 0/18；check-reach 0/1；USAGE 分享版重出。

## [文档随门禁定级对齐：图表条款 / 写死计数 / 加载计划口径] — 2026-11-20
- **计数去写死**：RULES 双端「软规则必读清单」、SOP 自查表、USAGE 资产地图的「图表结果约束 8 条」→「结果约束清单」（实际 Web 12 / 移动 10 / CHART-SPEC §2 共通 9 条，写死必漂）。
- **双端差异说明**：移动 §9.7 ② 头改「缺一不可；共通条款见 CHART-SPEC §2，Web 端另有量纲/标签脚本 2 条」。
- **加载计划口径**：SOP §0 删 2026-11-12 的 37,870/37,115 快照，改为「3 个计划、以输出为准」；START-HERE 门禁地图更新为 7 页 / 6 分享版 / 19 WARN / 1 WARN / 31 条登记。
- **实测**：`verify all` 全绿；check-reach 0 FAIL/1 WARN；check-size 0 FAIL/19 WARN。

## [图表门禁逐条定级：3 条几何缺陷升 HIGH，2 条保留 MED] — 2026-11-20
- **逐条判定（存量命中 → 原因）**：`chart.baseline` 0 / `chart.symmetry` 0 / `chart.svg.viewbox-edge` 0 —— 三者都是**可量化的几何破损**（柱底悬空、左右留白不一致、拉伸后末端标签被裁切），升 **HIGH**（双端）；`chart.text.inline` 0 但属样式令牌政策（1:1 不拉伸不必然变形）、`chart.line.vertical` 在 v7 命中 2 条（覆盖率 54%，低波动真实序列）→ **保留 MED**。
- **回归**：9 页（web 7 + mobile 2）升级后 **HIGH 仍 0**，无存量真违规。
- **文档**：CHART-SPEC §7 表（新增 viewbox-edge 行 + 保留理由）、RULES §9 ⑤、SOP 附录 A 禁区同步；为守住图表任务加载集 ≤95% 顺带压缩 §9 表述（37,916/40,000 = 94.8%）。

## [残留风险收口：系列色语义色升 HIGH + 图表页读前提示] — 2026-11-20
- **门禁升级**：`chart.series.color`（系列元素用 --primary/--suc/--warn/--err 作系列色）双端 MEDIUM → **HIGH**（理由：语义色作系列色会误导数据语义）；同步 RULES §9 / 移动 §9.7、CHART-SPEC §7、SOP 附录 A 禁区。回归：8 页（web 6 + mobile 2）HIGH 仍 0，证明存量无真违规。
- **读前提示**：`verify.js page` 检测到 `.chart-box/.chart-svg` 时打印「图表页必读 CHART-SPEC §4/§5/§7（generate-web-chart ≈37.9k）」——把「靠自觉」再收一道。
- **残留**：其余图表 MED（基线/对称/贴边/纵向占满等）仍不阻断；逐条升 HIGH 需评估存量页，留待拍板。

## [登录帮助行移除 + 图表任务加载集显式化] — 2026-11-20
- **登录页**：`showcase/登录页示例.html` 删除「账号由系统管理员开通，登录问题请联系管理员」帮助行（含 i18n `login.help` 中英键）；RULES §1.1b 写明「不设帮助行，`.login-help` 只留给找回密码/返回链接」；分享版重出并截图核对。
- **图表可读性**：新增第 3 个加载计划 `generate-web-chart`（AGENTS + SOP §① + RULES §1.1b/§7/§9 + CHART-SPEC §4/§5/§7 + colors）= **37,922/40,000（94.8%）**；SOP 步骤 4.5、RULES §9 头、AGENTS 阅读策略统一为「图表页必读 CHART-SPEC §4/§5/§7，加载集 = generate-web-chart」——把「靠自觉读」升级为「加载集被实测、超预算即红」。
- **顺手**：§9 ② 去 6 处实战注记（−93）。
- **实测**：登录页 0 HIGH / 1 MED；`verify all` 全绿；check-reach 0 FAIL / 1 WARN。

## [容量治理：L2 加载预算回收 + 归档分卷 + 数据阈值重测] — 2026-11-20
- **L2 是真瓶颈**：`generate-web` 加载预算 39,168/40,000（97.9%）→ **34,724/40,000（86.8%）**；`generate-mobile` 35,799 → 32,356（80.9%）。做法：RULES §9 的 ③④⑤ 与 CHART-SPEC §4/§5/§7 逐条对照后压成红线 + 指针（−1,001）；§9 ② 修重号（3/4 各出现两次 → 1..12）；SOP 步骤 4/4.5 去实战叙事与重复清单（−3,443，步骤 4 保留全部 8 条规则 + 产出落盘表 + 分享版重出条件）。
- **L1 文件 cap**：web archive 触顶 → 按时间分卷：`CHANGELOG-archive.md` 留 2026-10 起（24,994），`CHANGELOG-archive-2026-08_09.md` 冻结卷（35,377）；`tokens.json` 13,300→14,500、`components.json` 84,000→87,000、`audit-rules.json` 26,200→27,000（均按实测 +3.9~9% 重测并留注释）。
- **未做（有意）**：治理契约未抽成 `GOVERNANCE.md`——抽离需进 loadPlan（+1.8k），会把刚回收的预算再吃回去；单源化留待下一轮。
- **实测**：check-size 0 FAIL / 19 WARN；RULES 58,998/60,000、SOP 41,109/45,000；`verify all` 全绿。

## [登录页法务行改工信部备案号（可点击）+ 表格规范展示入库] — 2026-11-20
- **真源**：RULES §1.1b 法务行加「备案号 = `工信部备案号 浙ICP备0000000号-1`，可点击 `https://beian.miit.gov.cn/`（`_blank`+`noopener`），en 同号」；components.json login note 同步；删 RULES 一条已废弃 `.app` 历史注记腾空间（59,999/60,000）。
- **页面**：`showcase/登录页示例.html` 版权文案 → 备案号，`.login-copy` 由 `span` 改 `a`（i18n `login.copy` zh/en 同步），分享版重出。
- **示例入库**：`showcase/表格规范展示_20261112.html`（团队视觉展示）登记 `newScope.pages` + 出 `_分享版`；manifest 31 条登记 / 1 条忽略。
- **实测**：登录页 0 HIGH / 1 MED；表格页 0 HIGH / 13 MED；两分享版零外链。

## [机制对齐：文档口径随门禁链收口] — 2026-11-20
- **口径**：6 份入口文档 + 双端 RULES 六步统一 `verify all`；按 SOP §0 删写死项数。
- **SOP**：补外壳工具区真源（SSOT / 克隆第 9 件 / 分享版重出 / 禁区）、修 `cp agent-starter` 与本机 node 路径、附录 F 改脚手架。
- **定位**：showcase 去「不参与门禁」；USAGE 资产地图 21→24；移动 RULES 同口径。
- **实测**：`verify all` 全绿；reach 0/2、sync 3/0、size 0 FAIL。

## [门禁清单化 + 工具区 DOM 契约：堵掉「删条目 = 绕过门禁」] — 2026-11-20
- **清单**：新增 `scripts/gate-manifest.json`（工具区真源/注入/派生 + newScope + pageScan + `schemaVersion`）；`verify-new`、`check-shell-chrome`、`sync-shell-tools` 改读清单，脚本不再写死页面；新增 `lib/shell-tools.js` 统一提取/归一/改写。
- **清单防篡改**：新增 `check-gate-manifest.js`（`verify.js manifest`）——存在性 / 组内去重 / inject⊥derived / `.html` 覆盖性（删条目即红）/ 含 `.ws-tools` 必登 inject|derived / ignore 带理由。
- **工具区契约**：真源须保住 shell-ui/i18n 钩子（4 pop id / fsBtn / aria-haspopup≥4 / theme-opt≥6 / ws-sep≥1 / data-i18n≥10 / data-theme=dark / data-skin=）与 `truthMaxChars` 上限；失败按类别给修复命令。
- **清理**：check-size 删死条目 `表格规范展示_20261112.html`；`verify.js` 增 `shell` / `manifest` 子命令。
- **治理**（三阶风险收口）：RULES 真源区名单补 `partials/`，六步 step3 补「无对端走注入门禁」、step4 改「`verify all` 全绿」；`verify.js all` 改为 ci-local 105 + verify-new 双跑（**交付口径唯一**，`--scope=new` 只跑后者）；manifest 声明单端假设与升 v2 路径。
- **实测**：manifest 29/1 通过；chrome 9/9；`verify all --scope=new` 与 `ci-local` 105/0 全绿。

## [外壳工具区收为单点真源：基准方向纠正 + 9 页门禁] — 2026-11-20
- **问题**：`check-shell-chrome` 以 V7 示例页为「视觉基准」，缺页 `continue`、基准缺失静默退回 page-template——示例页成了标准，红绿都不可信；V7 又躺在 `.gitignore` 的 `output/`，新克隆必红。
- **真源**：新增 `partials/shell-tools.html`（`.ws-tools` 片段，路径按 Web 根相对写）；新增 `scripts/sync-shell-tools.js`（含 `--check`）注入 page-template / 规范展示 / 看板 / V7，showcase 目标自动改写 `../assets/`。
- **门禁**：`check-shell-chrome` 改为以真源比对、缺页即 FAIL、覆盖 9 页（补上规范展示与看板的分享版）；RULES §7 基准口径、START-HERE 门禁表同步；`check-size` 登记 `partials/` 并给本文件留条目余量。
- **实测**：`verify.js chrome` 9/9 一致；`verify all --scope=new` 通过；`ci-local` 105/0。

## [GitHub 上传前整理：v7 迁 showcase / 死引用纠正] — 2026-11-20
- **结构**：`output/左右结构_v7_设备运维工作台.html` 迁 `showcase/`（改相对路径），仓库自包含；门禁脚本同步。
- **死引用**：`showcase/左右结构工作台_v7_分享版.html`（不存在）→ `showcase/左右结构_v7_设备运维工作台_分享版.html`；README / START-HERE / USAGE-GUIDE / 团队指南 / RULES §7 / 规范展示正文已改。
- **文档**：VISUAL-SPEC §10 改 5 状态 + 形状；入口文档「无 git / 拷贝分发」改仓库流程；图标 188→190。
- **CI/忽略**：`validate.yml` 扩到 6 页 validate + 复用 + size/reach/sync + chrome/icons/spec；`.gitignore` 补运行残留。
- **实测**：6 页 HIGH 0；size/reach/sync 绿。

## [机器状态色重设计落真源（方案 C）：空闲青 + 故障三角 + 离线空心环] — 2026-11-20
- **决策**：用户拍板方案 C——① 空闲有自己的颜色（青）② 故障接受三角 ③ 图表停机橙收口为石板灰。
- **真源**：`tokens.json` 新增 `colors.states` / `dark.colors.states`（idle `#0891B2`/`#22D3EE`、stop `#64748B`/`#94A3B8`、offline 环 `#8290A3`/`#6C7C93`，含 soft/fg）；`map-tokens.js` 改为读节点生成 `--state-*`（删除硬编码映射，暗色块显式覆盖，修「暗色下离线最亮」的层级反转）。
- **组件**：`components.css` 故障改三角（clip-path，ISO 3864 警告形）、离线改空心环、新增 `.badge-idle/.badge-stop/.badge-offline`；`workbench.css` 状态卡与内联点同步形状。
- **回灌**：v7 工作台「信息化示例」——工时构成 / 状态分布环图改取 `--state-*`，状态模型 5 卡与组合表加三角/空心环；规范展示页 `#machine-states` 更新色板、形状行、OEE 表与表格示例（顺带修掉旧的「待机用 warn」）。
- **文档**：RULES §3.5（新增形状列 + 图表状态色规则）、README 状态色速查、MASTER §1.6、`components.json#status-dot`。
- **门禁**：check-sync 3/0（登记 `ms-state-card--fault`、`ms-inline--fault`）、check-size 0 FAIL、check-reach 0 FAIL（sync-index 已刷）、ci-local **105/0**；verify page 两页 0 HIGH；分享版重建 + showcase 同步。

## [弹窗档位修复：spec-modal 四档宽度被 382 兜底吞掉] — 2026-11-20
- **现象**：v7 弹窗表单模块四档（382/520/640/720）渲染同宽——页面档位类用得对，真源 CSS 自相冲突：`workbench.css` 同权重三处宽度声明（旧基准 560 → 档位类 → 后置 382 兜底），按层叠顺序 382 兜底排在档位类之后，把 `--520/--640/--720` 全部吞掉。
- **修复（真源）**：①基准归一 `.spec-modal{width:382px}`（原 560 旧声明改正，删除后置重复 382）；②档位类加权为 `.spec-modal.spec-modal--520/--640/--720`（双类权重，与声明顺序解耦）；重建 template.css（110.5 KB）并重出 V7 分享版。
- **门禁**：V7 page HIGH 0/MED 9（存量 MED）；check-sync ✅；check-size ✅。信息化示例分享版无弹窗 DOM，不需重出。
- **归因**：设计系统问题（真源声明冲突 + 门禁缺「档位类宽度生效」检查）；页面执行层无责。

## [五项拍板落真源：rail 选中态 / KPI 5 个 / secondary 禁用态 / 批量选择契约] — 2026-11-20
- **rail 选中态（§4 #1 拍板）**：品牌色表面选中 = 白色提亮 `rgba(255,255,255,.18)` + 白字，弃用 `--primary-active`(#004A8F) 深实底（与 `workbench.css .rail .tree-node.on` 落地值对齐，规范-实现冲突收敛）。RULES §3.6 表格/分治说明/自检句、§5 清单、`components.json#tree.node.selectedOnBrand` + referenceCss、`validate-spec.js` 两处报错文案同步；白色提亮亮暗双模式通用，不再有 n1/n11 反相问题。
- **KPI 一行 5 个（§4 #12 拍板）**：workbench 工作台页上限 5 个/行（与 v7 参考图一致），其余页 ≤4；RULES §2.2 反模式表第 3 条已改。
- **secondary 禁用态（§4 #20 拍板）**：`btn-secondary:disabled` 改中性灰（N3 底 + N6 边框 + N8 字），不再吃 `--primary-dis-bg`（批量操作等场景不再"像块逃出的主按钮"）；`packages/web-ui/src/styles/components.css` 已改并重建 template.css（110.4 KB）；RULES §3.1 补「禁用态分档」表。
- **批量选择交互契约（§4 #18 拍板）**：六条契约入 RULES §3.3——筛选变更清空选择（翻页/排序保留）、表头全选=当前页、批量栏「已选 N 项+清除」、半选 `aria-checked="mixed"`、部分成功 toast + 失败明细入口、批量权限禁用+tooltip。
- **门禁**：sync-index 已刷；check-sync 3/0、check-size 0 FAIL、check-reach 0 FAIL（并行智能体同项目写盘期间 ci-local 偶发红为其在途项，非本批改动）。

## [规范展示页审计：图表 / 分页器 / 描述对齐 V7] — 2026-11-20
- **图表**：按 `showcase/左右结构工作台_v7_分享版.html`「信息化示例」重建 `#chart-demo`——折线 100×100 百分比坐标 + HTML 点（修 NaN / 点落线 / 纵向覆盖）；柱状与分组柱 100×100（内容不出界、柱顶数值必标）；横向柱改 HTML `.hbar-row`；环状定尺寸 SVG + ring-legend；`chart-card / chart-kind / chart-note` 与示例一致。
- **分页器**：demo 改「左统计 + 右 `.pg-nav`」结构；`workbench.css` 的 `space-between` 改为 `.pager:has(.pg-nav)` 作用域，旧平铺 pager 不再被拉散（已重建 template.css）。
- **描述性纠错**：Tabs 字 13→14；按钮/输入圆角 8/4→6（`--radius-control`）；DatePicker 260→290；Tree 节点 32（rail 内 40）；圆角 5 档→6 档（+control）；阴影补 data-hover、双层表述修正；动效 4 档→6 档（120/240/360/480/800/1500ms）；概览品牌色 5→6、「本页为克隆源」→ `page-template`、`.content`→`.ws-body`；范式 4→5。
- **门禁**：新增 `scripts/check-spec-page.js`（`verify.js spec`）——坐标 NaN / 折线点格式 / 柱值标签 / 计数声明 / 锚点 / 旧分页器 / 未定义 CSS 变量；接入 `verify-new`。
- **实测**：规范展示页 validate 0 HIGH / 2 MED；`verify-new` 通过；`ci-local` 105/0。

## [外壳 chrome 收敛：V7 图标回灌 + 生成副本运行门禁] — 2026-11-20
- **根因**：外壳（顶部工具区 + 4 个运行 js）在 page-template / 规范展示 / 看板 / V7 各存一份；V7 调整后的图标未入 `icons/`、模板仍用旧图标；`sync-showcase` 只改 CSS/assets 路径不改 `js/`，生成副本丢交互；门禁只跑手写页、不覆盖生成副本与分享版——同一问题反复出现。
- **修复**：page-template 顶部工具区对齐 V7（首页加大、调色盘、地球、默认头像、勾选）；`icons/` 更新 home/palette/language、新增 tick/avatar_default（Web 190 / 移动 185）；`sync-showcase` 补 `src="js/` 路径改写；新增 `scripts/check-shell-chrome.js`（`verify.js chrome`）校验工具区与 V7 一致 + 4 个 js 可加载；`verify-new` 的运行时门禁覆盖 8 页（含 showcase 非分享/分享与 V7 分享版），并对 6 页补跑 `audit-component-reuse`；规范展示 `.modal-preview` → `.demo-modal-stage`、看板 5 个 demo 类改 `demo-*` 前缀，消除示例脚手架误报；重建 V7 分享版（原缺 shell-ui/page-ui 内联）。
- **实测**：`ci-local` 105/0；`verify-new` 通过（6 页 validate+reuse、8 页 runtime、chrome、5 分享版）；V7 分享版运行时通过。
- **图标展示闭环**：规范展示「图标集」从 186 → **190**，补齐调色盘 / 显示 / APP 下载 / 勾选 / 默认头像 5 个单元，修正 首页 / 语言 / 关闭 三个旧 path；新增 `verify.js icons`（库内每个图标必须在展示页出现 + 计数一致）；USAGE 主题图标由旧调色盘改为 V7 调色盘。

## [check-sync 收敛 / 登录页示例 / vendor 登记扩容] — 2026-11-20
- **check-sync**：`.chart-bar` 移动端补 `stroke:none`（真 bug 同步）；`.chart-grid / .chart-tip / .toast` 入 `SYNC_WHITELIST`（平台合法差异）；`vendor-coverage.json` 登记左右结构 Web 独有 **141 类**、清理过期 32 类；阈值 4,000→7,000（实测 5,992）。check-sync **3 pass / 0 fail**。
- **登录页示例**：新增 `showcase/登录页示例.html` —— 按 RULES §1.1b 登录页规格自建（卡外 logo / 卡内标题组 / 账号密码 + 显隐 / 找回密码 3 步 / 完成态 / 中英切换）；`build-share-web.js` 出 `_分享版.html`（649KB，零外链）；`validate-spec` **0 违反**。
- **工作流覆盖**：`scripts/verify-new.js` 扩到 6 页 + 5 分享版；`showcase/README` 登记登录示例。
- **实测**：新规范 6 页 0 HIGH；`verify.js all --scope=new` 通过；`ci-local` **105 pass / 0 fail**。

## [文档与工作流对齐（左右结构）/ USAGE 重出 / 门禁口径] — 2026-11-20
- **文档对齐**：README / START-HERE / AGENTS / USAGE-GUIDE / 团队使用指南 / Web README 统一 `.shell/.rail` 216/64 + `.ws-global` 60 + `.ws-pagebar` 56；五件 CSS（含 workbench）；4 个运行 js；`build-share-web.js` 分享；图标 188；说明文档不再引用维护者本地日志。
- **RULES**：§0.1/§0.2 顶层框架改写（顶栏 72 / 侧栏 240 / 底栏 32 废止）；§4.2 固定常量、§5 清单、§6 骨架/G1、§7 首屏预算、§3.6 选择器同步；MASTER §7.3 / VISUAL-SPEC §8 / DARK-MODE 加外壳换代说明；components.md 树选择器 `.rail`、节点 40。
- **USAGE**：内容对齐新工作流（脚手架 / verify / 分享脚本 / 无 git / 图标 188 / 资产地图 21 条）；`#4ade80` 改 `--run-active`；`USAGE_分享版.html` 由 `build-share-web.js` 重出（零外链）。
- **门禁**：check-themes 识别 `#themePop`；check-reach R5 认可 SKILL `.disabled`；sync-showcase 复位规范展示副本生成；verify-new 覆盖 USAGE + 分享版；sync-index 已跑。
- **实测**：5 页 0 HIGH；`verify.js all --scope=new` 通过；check-size 0 FAIL/20 WARN；check-reach 0 FAIL/2 WARN；ci-local 102/4（仅 check-sync 双端漂移为真红，移动端同步待拍板）。

## [工作台真源化 / 5 状态模型 / 组件复用门禁] — 2026-11-19
- **page-template 迁移**：原 V2.1 `.app/.sidebar` 模板替换为 `.shell/.rail` 工作台（27KB/0 HIGH）；new-page-web 默认克隆并修正 assets；clone/fingerprint 门禁支持 `.shell`。
- **workbench.css 入真源**：v7 左右结构工作台视觉提升为第五件源（外壳/作业树/页签/主从表/明细/KPI/表格卡/弹窗），build 后 template.css 109KB；页面不再保留本地 `<style>`。
- **状态模型**：5 主状态 生产/空闲/停机/故障/离线（run/n9/n10/err/n11）；模式、生产子状态、原因、plannedStop 做第二层；machine-card 增 stop/fault/offline 变体。
- **门禁**：新增 `scripts/audit-component-reuse.js`（M-12 component.reuse），`verify.js page` 自动跑；修复堆叠柱基线误报（按 x 取最底段）；`.shell` 纳入框架滚动识别；表头字号回到 14。
- **图标**：新增 `icons/app_download.svg`（顶部 APP 下载，手机+下箭头），icons.md 计数同步 188；顶部 home/fullscreen/palette/language/user 均已在库。
- **示例**：v7 spec 新增「机器状态模型」模块，展示 5 主状态 + 模式/生产子状态/原因/OEE 组合。

## [文档对齐：登录页 v2 / 图标计数 / 示例说明] — 2026-11-18
- `components.md` 登录页 v2 描述改为定稿口径（卡外 logo / 卡内标题组 + 字段标签 / 账号密码 / 找回 3 步），并补 `validate-hero.js` 指针。
- `USAGE.html` + `USAGE_分享版.html` 图标库计数 186/184 → **187/185**；`RULES.md §7.9` 内「移动端同源 184 个」→ 185。
- `showcase/README.md` 登录页示例说明改「卡外 logo + 12 状态 + 法务行多语言」；`DESIGN-TOKENS.md` 明确 `--login-card-pad` 只管左右（上下 32 = `--space-xl`）。
- 门禁：`ci-local` **105/0**。

## [DS-20261118-02 收尾：eye_on 入库 + logo 门禁解析基准 + 背景图资产脚本] — 2026-11-18
- **图标**：新增 `icons/eye_on.svg`（24 viewBox / stroke 1.8 / round / currentColor，与 `eye_off` 成对）；`icons.md` 登记并改计数 186→**187**，`MASTER.md` / `RULES.md` 图标数声明同步（`ci-local` 图标数断言 187/187）。
- **门禁修正**：`validate-spec.js checkLogoAsset` 的 `<img src>` 解析基准由 `__dirname` 改为**页面所在目录**；仓库内页面缺失仍 HIGH，**仓库外页面降 MED**（跨项目仅提示）。实测 output 缺失 → MED、仓库内缺失 → HIGH。
- **新脚本**：`assets/login-hero/validate-hero.js`（零依赖解析 WebP 头 VP8/VP8L/VP8X）——default 2160²±1%、@1x 1024²±1%、任意 webp 1:1±1%、≤400KB；已接入 `ci-local`（`登录背景图资产`，105 项）；负向样例 1600×900 实测命中 2 条。
- **文档**：`assets/login-hero/README.md §6` 标注脚本实装与「留白/主色比仍靠人审」；manifest size 2400→2160；RULES §1.1b 背景图条补脚本名。
- **预算**：`ci-local.js` 压缩图标计数段/functional 注释（零语义）腾出 105 项位置，18,590/18,600；`validate-spec` 129,495/129,500、`template.css` 70,898/71,000 不变。
- **示例/分享版**：示例页改用库内 `eye_on` 与 `safe_check` 勾选 path（`icon.source` MED 清零），页面与分享版均 **0 HIGH / 1 MED**；分享版重生成 613,464B；12 状态截图 + 总览按中文态重出。
- **门禁**：`ci-local` **105/0**；`sync-index` / `freeze-baseline` 已跑。

---
## [登录页 v2 定稿：logo 出卡 + 标题进卡 + 字段标签 + 全状态门禁] — 2026-11-18
- **真源 `components.css` → build `template.css`**：`.login-head` 承载 logo（`.login-head img` 高 40 宽自适应）；卡内 `.login-card-title` 保留为标题组/表单标题；新增 `.login-field`（字段组 16）、`.login-label`（14/22 N10、下 8）；删除 `.login-brand` / `.login-account`（logo 已出卡）；`<1200` 图槽 `contain` 与法务行多语言保持。
- **RULES §1.1b 登录页**：改写为「logo 卡外左对齐 + 卡内标题组（系统名 24/32 + 副标题 13/20）+「登录」18/26 + 字段 label + 账号/密码」；节奏改为 卡 32/40 → 标题组 → 24 → 登录 → 24 → 字段；状态补「提交中 / 验证码错 / 锁定 / 成功」；找回密码 3 步含 6 位验证码 + 60s 重发。
- **门禁 `checkLoginPage` v2**：`login.head.logo`（卡外恰好 1 个矢量 logo）、`login.card.no-logo`（卡内禁 `<img>`）、`login.card.title`（卡内必有 `.login-card-title`）、`login.fields.labels`（账号/密码须可见 `<label for>`，其余至少 aria-label）、`login.states`（MED，必有 `.login-alert` 承载位）；保留 `login.fields.account` / `login.password.eye` / `login.hero.slot` / `login.card.required`；旧 `login.head.no-logo` / `login.brand.*` / `login.title.one` 废止。
- **示例**：`output/登录页示例.html` 删除全部登录页局部样式（仅剩 demo 工具条），`0 HIGH / 2 MED`；12 个交互状态 + 状态总览截图；`showcase/登录页示例_分享版.html` 重生成（613,478B，零外链）。
- **实测**：负向样例 3 条 HIGH（head.logo / card.no-logo / fields.labels）+ `login.states` MED 实测命中；`template.css` 70,898/71,000；`validate-spec` 129,495/129,500；`RULES` 55,679/56,000；`ci-local` 104/0；`sync-index` + `freeze-baseline` + `roll-changelog` 已跑。

---
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

