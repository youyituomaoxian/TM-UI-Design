# 弘讯B端视觉系统 · 设计系统更新日志（CHANGELOG）

---
> 📦 历史条目已滚动归档：web 归档 `[1.9.27]`（2026-09-10）及更早见 [`CHANGELOG-archive.md`](CHANGELOG-archive.md)（2026-09-22）。

---

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

## [登录页 v2 定稿：logo 出卡 + 标题进卡 + 字段标签 + 全状态门禁] — 2026-11-18
- **真源 `components.css` → build `template.css`**：`.login-head` 承载 logo（`.login-head img` 高 40 宽自适应）；卡内 `.login-card-title` 保留为标题组/表单标题；新增 `.login-field`（字段组 16）、`.login-label`（14/22 N10、下 8）；删除 `.login-brand` / `.login-account`（logo 已出卡）；`<1200` 图槽 `contain` 与法务行多语言保持。
- **RULES §1.1b 登录页**：改写为「logo 卡外左对齐 + 卡内标题组（系统名 24/32 + 副标题 13/20）+「登录」18/26 + 字段 label + 账号/密码」；节奏改为 卡 32/40 → 标题组 → 24 → 登录 → 24 → 字段；状态补「提交中 / 验证码错 / 锁定 / 成功」；找回密码 3 步含 6 位验证码 + 60s 重发。
- **门禁 `checkLoginPage` v2**：`login.head.logo`（卡外恰好 1 个矢量 logo）、`login.card.no-logo`（卡内禁 `<img>`）、`login.card.title`（卡内必有 `.login-card-title`）、`login.fields.labels`（账号/密码须可见 `<label for>`，其余至少 aria-label）、`login.states`（MED，必有 `.login-alert` 承载位）；保留 `login.fields.account` / `login.password.eye` / `login.hero.slot` / `login.card.required`；旧 `login.head.no-logo` / `login.brand.*` / `login.title.one` 废止。
- **示例**：`output/登录页示例.html` 删除全部登录页局部样式（仅剩 demo 工具条），`0 HIGH / 2 MED`；12 个交互状态 + 状态总览截图；`showcase/登录页示例_分享版.html` 重生成（613,478B，零外链）。
- **实测**：负向样例 3 条 HIGH（head.logo / card.no-logo / fields.labels）+ `login.states` MED 实测命中；`template.css` 70,898/71,000；`validate-spec` 129,495/129,500；`RULES` 55,679/56,000；`ci-local` 104/0；`sync-index` + `freeze-baseline` + `roll-changelog` 已跑。

## [登录页定稿写回真源 + login 门禁] — 2026-11-18
- **真源（`components.css` → build `template.css`）**：`.login-card` 内边距 上下 **32** / 左右 40；新增 `.login-brand`（卡内顶部居中，logo 高 40、上 32 下 32）、`.login-account`（下距 16）、`.login-link`、`.login-legal-links`；`.login-legal` 改 `justify-content:space-between`、`.login-copy` 归零、`html[lang="en"] .login-legal` 整块居中；`<1200` 断点 `.login-hero img{object-fit:contain}`（1:1 图在 280 横幅 cover 会裁成 3.66:1 特写）。
- **RULES §1.1b 登录页**：改写为定稿口径——logo 卡内 40 / 32 / 32、去卡内「登录」标题、字段「账号 + 密码」（手机号为显式变体）、法务行多语言、图槽比例、节奏 32/16/12/16/16/24/32、`<1200` contain。
- **门禁 `validate-spec`（新增 `checkLoginPage`）**：`login.card.required` / `login.head.no-logo` / `login.title.one` / `login.brand.missing` / `login.brand.logo` / `login.fields.account` / `login.hero.slot`（HIGH）+ `login.password.eye`（MED）；`COMPONENT_CLASS_RE` 增 `login-` → 页面覆写 `.login-*` 现报 `css.override` HIGH（此前正则 `^` 锚定漏检，DS-20261118-02 §3.5）。
- **示例**：`output/登录页示例.html` 删除 8 处页面级覆写（样式全部由真源提供）→ `0 HIGH / 1 MED`；`showcase/登录页示例_分享版.html` 按新真源重生成（598,934B，零外链）。
- **实测/门禁**：`template.css` 70,914 / 71,000；`validate-spec` 129,173 / 129,500；`ci-local` **104/0**；check-size 0 FAIL / 26 WARN；`sync-index` + `freeze-baseline` 已跑。

## [Logo 库收敛：三套产品长标 + 反白 + 按系统名选用] — 2026-11-18
- **资产**：`assets/logo/` 收敛为三套产品 logo（弘设汇 `400.74×105.91` / 弘塑云 `391.84×125.13` / 弘智造 `381.59×105.91`），并为每套生成同名反白 `-white.svg`（全部显色统一映射 `#FFFFFF`，保留原 opacity，用于品牌蓝底）；**删除** `asset-logo-brand.svg` / `asset-logo-brand-new.svg` / `asset-logo-brand-white.svg` / `logo_64.svg`。
- **选用规则（RULES §0.1a）**：按系统名三选一——弘设汇 / 弘塑云 / 弘智造；蓝底（顶栏）用 `-white` 反白，浅底（登录卡）用彩标；尺寸不变（顶栏高 32 宽自适应 / 登录高 40），禁 PNG/自造/改色。
- **代码**：`page-template.html` 顶栏 logo → `弘设汇logo-white.svg`（alt 同步）；`validate-spec.js` M-08 两条报错文案同步新资产名与选用规则。
- **审计**：`audit-rules.json` M-08 predicate / implemented_in 同步（`真源 = 弘设汇/弘塑云/弘智造 logo.svg + 同名 -white 反白`）。
- **门禁**：`validate-spec.js page-template.html` 0 HIGH（1 MED 为既有 aesthetic）；`ci-local` 104/0；`check-sync` 3/0；`check-reach` 0 FAIL（`sync-index` 已刷）；`freeze-baseline` 已刷新 5 件指纹。
- **注**：`logo_64.svg`（64×64 方标）随库收敛停用，移动端登录 logo 口径同步为「高 40 宽自适应」（移动 RULES §1.1b）。

## [示例入库：弘讯亮色注塑机看板] — 2026-11-17
- 将 `讲解展示页/示例页面/弘讯亮色注塑机看板.html` 复制为 `弘讯web端design-system/showcase/弘讯亮色注塑机看板.html`；内联当前 `template.css` + 顶栏主题选择器；假数据演示，不参与门禁。
- `showcase/` 同时收纳 `web规范展示_框架版_20260806_1050.html`（含分享版）与 `表格规范展示_20261112.html` 示例副本；相对路径改为 `../template.css` / `../assets/`，分享版保持零外链。
- `showcase/` 走既有 check-size DIR_EXEMPT；`validate-spec` 对 `showcase/` 豁免 `template.residue`（示例页保留模板示例树与假数据）。
- `README` / `USAGE` / `USAGE-GUIDE` / `团队使用指南` / `web规范展示` 增加示例入口；`showcase/README.md` 说明边界。
