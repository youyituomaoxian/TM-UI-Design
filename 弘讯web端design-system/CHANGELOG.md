# 弘讯B端视觉系统 · 设计系统更新日志（CHANGELOG）

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
