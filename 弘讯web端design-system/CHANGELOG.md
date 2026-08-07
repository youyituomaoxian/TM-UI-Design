# 弘讯B端视觉系统 · 设计系统更新日志（CHANGELOG）

---

## [1.9.10] — 2026-08-07 · 阅读策略改造：RULES 事故记录迁移（只迁事故，保留现役约束）

> 本次把 `RULES.md` 中的「事故记录」（何时发生/症状/根因）迁移至此，RULES 只保留规则正文 + 门禁名 + 设计理由。事故对应的现役约束位置见各条末尾。

### 事故记录（Web RULES 迁出）

1. **侧栏折叠按钮漂移**（§0.2-6）：旧版 `position:sticky` 折叠按钮随作业树滚动漂到内容流末尾。根因：sticky 定位随滚动容器移动。现役约束：折叠按钮固定右下角（flex-shrink:0 + 高 44 + z-index:2），作业树单独 flex 滚动区。
2. **KPI 图标黑图标 bug**（§0 工具类清单）：SVG 图标渲染成黑色。根因：在 `<svg>` 上直接写颜色覆盖了 `currentColor`。现役约束：SVG 一律走 `currentColor`，禁止在 svg 上写颜色。
3. **th.num 右对齐失效**（§3.3b，2026-08-06 实测）：给表头加 `.num` 类仍左对齐。根因：`.table th` 的 `text-align:left` 特异性（0-1-1）高于 `.num` 的 `right`（0-1-0）。现役约束：真源 `.table th.num{text-align:right}` 显式覆盖 + 契约 `table.head.num-align` HIGH。
4. **中文表头回退宋体**（§3.3b，2026-08-06 用户实测）：表头「计划数/完成数」在真实浏览器被回退到宋体（衬线），与其余表头黑体不统一。根因：`.num` 的 `font-variant-numeric:tabular-nums` 在系统装有衬线字体时触发字体特性回退（headless 无衬线字体无法复现、computed style 全一致）。现役约束：表头 `th.num` 必须 `font-variant-numeric:normal`（真源写死）+ 契约 `table.head.font`。
5. **机器群览页 3 类执行级缺陷**（§3.7，2026-08-04 实测）：按钮文字竖排截断 / 5 张 KPI 第 5 张掉行 / 折线图未撑开。根因：CSS 真源已就位、HTML 没按契约组 DOM。现役约束：`btn.label.required` / `stat-grid.count.match` / `chart.svg.fill` 三条 DOM 契约门禁。
6. **chart-svg--fill viewBox 末端裁切**（§3.7-5，2026-08-04 实测）：viewBox `0 0 400` + 数据末端 `x=400`，`preserveAspectRatio="none"` 拉伸后被 card-body padding 16px 裁切（X 轴「21:00」变「21」）。现役约束：viewBox 右侧留 16-20px 内部边距（x 坐标 ≤ 宽-20）+ 门禁 `chart.svg.viewbox-edge` MEDIUM。
7. **跨模块间距失控**（§4.3，2026-08-04）：KPI 区与图表区 0 间距贴死 / 卡片间距失控。根因有二：① `.stat-grid` 无底部间距；② 旧 `.grid12>.card{margin-bottom:0}` 只匹配直接子，实际 `.grid12 > .col-* > .card` 两层嵌套归零失效。现役约束：stat-grid→grid12 24px、grid12 兄弟 16px（utilities.css 真源）+ `layout.module-spacing` / `layout.grid12-margin` 门禁。
8. **grid12 列内卡片高度不齐**（§4.4，2026-08-04）：表格数据不足（2 行）卡片缩到 240px、各列底部随机留白。用户裁定「col-* 内卡片先撑起来对齐、表格空数据用占位行」。现役约束：col-* 弹性容器 + card `flex:1` + minRow=8 占位 + `card.fill-in-grid` / `layout.table-minrow` 门禁。
9. **x 轴标签叠柱**（§9 结果约束 2）：x 轴标签与柱体重叠。根因：标签作为柱子子级定位。现役约束：标签独立行（flex 与柱同列宽对齐）+ 柱多自动跳显。

### 验证
两端 RULES 瘦身后页面门禁 0 HIGH；ci-local 86 pass。

---

## [1.9.9] — 2026-08-06 晚 · KPI 两版定稿 + 图表五要素/三对齐 + 顶栏补全 + 生成器对齐
### Changed
- **KPI 两版定稿**：标准版 stat-card--icon（回滚点布局：图标块 + 数字 + 底部行标题左/趋势右）+ 环形版 stat-card--ring 保留；删除简约版（--row/--mini 变体）；门禁 kpi.simple.forbidden 拦截简约版。
- **图表 CHART-SPEC 五要素 + 三对齐**：chart-grid / chart-bar+chart-v / polyline+dot / legend / x-labels；柱底基线对齐、柱区对称居中、chart-v 柱顶上方居中；chart-v 必须放 chart-box 内（门禁 chart.v.position 拦截，修复数值漂浮固定）；SVG var 必须真源 token（token.svg-var）；门禁 chart.baseline.align / chart.value.required。
- **图表并排**：grid12 col-7（折线）+ col-5（柱状）布局（生成器模板）。
- **表格分页器**：列表表格 >5 行必须 .pager（门禁 table.pager.required）。
- **顶栏补全**：管理员 / 修改密码 / 退出登录 / 全屏（对齐 page-template 顶栏）。
- **validate 修复**：checkOverride 加「与真源完全相同规则跳过」（页面内联 template.css 不再误报 css.override；canonMap 对比）。
- **生成器对齐**：gen-examples.js webPage/mobilePage 内联 template.css 自包含 + 输出 docs/examples/（7 个视觉预览文件 + README）。
- **移动暗色框架特例**（真源 template.css）：[data-theme="dark"] navbar/statusbar 用 bottomnav 同色（--n1/--n8），不用引擎提亮 --primary。

---
## [1.9.8] — 2026-08-06 · 页面类型规格并入 RULES §1.1b + 纯框架化 + 产出分离 + N=1 构建链
### Changed
- **pages/ 删除并入 RULES §1.1b**：6 个页面覆写文档删除，页面类型规格（登录/列表/详情/弹窗/看板）并入 `RULES.md §1.1b`；Agent 不再找近似模板，按规格自建。
- **示例页删除**：`pages/examples/` 删除（生成器保留 `brand-color-engine/examples/gen-examples.js`）。
- **page-template 纯框架化**：删 15 个 DEMO section，content 空壳 + 占位注释；规范展示由 `web规范展示_框架版_*.html`（移至端目录根）承担。
- **产出分离**：生成页落「用户项目」`output/`，不再落设计系统仓库；仓库根 `output/` 仅历史归档。
- **N=1 构建链恢复**：`packages/web-ui/src/styles/` 四件 CSS 为 `template.css` 构建真源（`node packages/web-ui/scripts/build-template-css.js`），build 产物与 template.css 逐字一致。
- **视觉更新**：输入框白底（n1）+ 聚焦描边、表头 48px、表格 th.num 数值列右对齐（表头 13/数据 14 区分）、pager 上下居中、图表卡纵向撑满。
- **Agent 入口**：新增 `AGENTS.md`（codex/通用）+ `.workbuddy/skills/tm-design-system/SKILL.md`（workbuddy）。
### 验证
两端 page-template + 展示页门禁 0 HIGH；ci-local 86 pass。

## [1.9.7] — 2026-08-05 · 拍板 5 项落地（status-dot 语义 + tokens 键集 + shadow-float + Low 加固）

### ① status-dot 机器状态独立语义
机器状态 = run/中性灰/err，不用 suc/warn。m-dot 增 .idle/.off/.offline；Web .dot-idle/.dot-off/.dot-offline；设备台帐"待机" warn→idle；RULES §11.11 语义表。

### ② tokens 解冻修补（T07-T10 + D-T2-16/17 + DEFECT-12）
dark.colors 补 secondary/link/chart；light functional 4 色补 softActive/disabledFg（亮暗键集对称）；statusRunning 补 bgDisabled/borderActive；map-tokens 加 :undefined→:inherit 守卫；radius.btnIos 6。map-tokens 重跑 + build:template + DESIGN-TOKENS + freeze。

### ③ shadow-float 废弃归 overlay
components.json dropdown/datepicker referenceCss → --elev-overlay-shadow（2 处 + varUsage 清理）；tokens shadow.float 保留 deprecated。

### ④ Low 安全加固批量放行
D07 搜索大小写 / D08 navigateBack 守卫 / D09 连点节流 / D13 rem 死代码——tsc 0 错误；卫生类 D10/D11/D12/D05 保持 BLOCKED。

### 验证
设备台帐/注塑机 HIGH 0；ci-local 86 pass；分享版重生成；BLOCKED 拍板记录入档。
