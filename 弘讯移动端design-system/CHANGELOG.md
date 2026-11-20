# 弘讯移动端设计系统 — Changelog

> 语义版本（与 Web 端 `CHANGELOG.md` 同构）。所有「值」以 `tokens.json` 为唯一真源；所有「组件尺寸/色值」以 `components.json` 为唯一真源。

---
> 📦 历史条目已滚动归档：mobile 归档 `[1.14.13]`（2026-09-10）及更早见 [`CHANGELOG-archive.md`](CHANGELOG-archive.md)（2026-09-22）。

---

## [机器状态色与 Web 同步：空闲青 / 故障三角 / 离线空心环] — 2026-11-20
- **tokens.json**：新增 `colors.states` + `dark.colors.states`（idle `#0891B2`/`#22D3EE`、stop `#64748B`/`#94A3B8`、offline 环 `#8290A3`/`#6C7C93`，含标签 bg/text），值真源与 Web 同值。
- **template.css**：新增 `--state-*` 变量（亮/暗）；`.m-dot.idle/.off/.offline` 改用状态色与形状，新增 `.m-dot.fault`（三角，ISO 3864）；新增 `.mtag-idle/.mtag-stop/.mtag-offline`（离线虚线描边）。
- **文档**：RULES §11.11（5 状态 + 形状列，删除两端 n 编号对照）、§11 组件变体、设备数据模型 enum；MASTER §1.6；README 状态速查；components.md / components.json#status-dot。
- **规范展示页**：m-dot 示例改为「生产/空闲/停机/故障/离线 + 正常/预警」，分享版重建。
- **门禁**：check-sync 3/0、check-size 0 FAIL、check-reach 0 FAIL（sync-index 已刷）、ci-local **105/0**。

## [secondary 禁用态同步（真 bug 双端同步）] — 2026-11-20
- `.mbtn-secondary:disabled` 补中性灰禁用（N3 底 + N5 边框 + N8 字），不再继承 `.mbtn:disabled` 的 `--primary-dis-bg`（与 Web §3.1「禁用态分档」拍板对齐，次操作禁用不再视觉过重）；`template.css` 已改。
- 左右结构**不改**（2026-11-20 拍板 #9：移动端维持现状）；本条仅组件级 bug 同步。

## [check-sync：图表柱描边同步] — 2026-11-20
- `.chart-bar` 补 `stroke:none`（与 Web 2026-11-19 修复对齐，根治柱体白边）；无其他真源改动。

## [文档对齐：平台差异表述] — 2026-11-20
- `components.md` 平台差异行改为「移动导航固定；Web 左栏 216/64」（原「顶栏72/侧栏240」为旧口径）。移动真源无改动。

## [图标库同源补齐 eye_on] — 2026-11-18
- 新增 `icons/eye_on.svg`（与 Web 端同款：24 viewBox / stroke 1.8 / round / currentColor），与 `eye_off.svg` 成对，供密码/内容显隐态使用。
- 计数同步：`icons.md` 登记 `eye_off` / `eye_on` 两行并改「共 185 个」，`MASTER.md` / `RULES.md` 图标数声明 184→**185**（`ci-local` 图标数断言 185/185）。
- 无组件/页面改动；`sync-index` 已跑。

## [登录页 logo 口径对齐 Web logo 库收敛] — 2026-11-18
- Web 端 logo 库收敛为三套产品长标（弘设汇 / 弘塑云 / 弘智造）+ 同名 `-white` 反白，`logo_64.svg`（64×64 方标）已停用 → 移动端 RULES §1.1b 登录页 logo 由「64×64 方标」改为「**高 40 宽自适应**，按系统名三选一，蓝底用 `-white`」。
- 仅文档口径同步（移动端未新增 logo 资产、无页面引用），`validate-spec` / `sync-index` 无需改动。

## [模板 :root 同步 + 双 body/注释清理 + agent-starter 并入克隆流] — 2026-11-17
- `page-template.html` 内联 `:root` 对齐 `template.css` 亮色段：`--font-cn` 补 `Microsoft YaHei/微软雅黑`；补 7 个功能色深变体/实底按钮变量（`--suc-deep/--warn-deep/--err-deep/--suc-btn-bg/...`）——`template.root.sync` 2 MED 清零。
- `page-template.html` 双 `<body>` 合一；`agent-starter.html` 注释伪标签转义。
- **agent-starter 并入模板克隆流（用户拍板）**：内置 `x-template-clone` meta + 手机壳框架骨架（m-statusbar/navbar/page-view/bottomnav，空 page-view），5 HIGH 清零（现 0 HIGH / 1 MED）；修复 `template.residue` 把克隆 meta 里的 `page-template.html` 误判残留——所有脚手架克隆页此前会被误杀。
- 门禁：`validate-spec.js page-template.html` 0 HIGH / 2 MED（icon.source、card.radius 沿用既有）；`agent-starter.html` 0 HIGH / 1 MED。

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