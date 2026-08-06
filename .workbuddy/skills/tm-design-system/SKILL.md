---
name: tm-design-system
description: 弘讯设计系统规范：生成/修改/审计 B 端 Web 或移动端 HTML 页面，经 TM_DESIGN_REPO 或相对定位找到仓库根，0 HIGH 门禁交付
---

# tm-design-system · 弘讯设计规范（workbuddy skill）

> 本 skill 是**薄壳**：负责定位仓库根并指示加载规范真源，不复制本体（避免双份维护）。
> 规范真源与可执行脚本全部位于仓库根与端目录内。

## 1. 定位仓库根（按序尝试）

1. 环境变量 `TM_DESIGN_REPO` → 其值即仓库根
2. 未设置 → 从本文件位置（`.workbuddy/skills/tm-design-system/`）**向上逐级查找**含 `ci-local.js` 的目录
3. 仍失败 → 在当前 workspace 查找含 `ci-local.js` 的目录

> 仓库根判定特征：根目录存在 `ci-local.js`、`弘讯web端design-system/`、`弘讯移动端design-system/`、`output/`。

## 2. 加载规范真源（动手前必读，按序）

1. `<仓库根>/GENERATION-SOP.md` — **生成流程总纲**（选端 / B 端固定框架判定 / 页面选型 §1.1b / 克隆模板 / 产出落盘 / 图表 / 配色引擎 / 禁区）。
2. 端目录规范真源（两端同构）：
   - `<仓库根>/弘讯web端design-system/RULES.md` — 组件决策树 + **§1.1b 页面类型规格**（登录/列表/详情/弹窗/看板）+ §6 布局黄金法则 + 自造类守则
   - `<仓库根>/弘讯移动端design-system/RULES.md` — 组件决策树 + **§1.1b 页面类型规格**（7 种页面）+ §8 防溢出 + §9 组件体系 + §10 审美
   - `<仓库根>/<端目录>/components.json`（组件契约，机器真源）+ `template.css`（组件类真源）+ `tokens.json` + `DESIGN-TOKENS.md` + `MASTER.md`
   - `<仓库根>/CHART-SPEC.md` — 图表规范（原子 SVG 自建）
3. 克隆模板（框架来源）：
   - Web B 端后台：`<仓库根>/弘讯web端design-system/page-template.html`
   - 移动端：`<仓库根>/弘讯移动端design-system/page-template.html` / `agent-starter.html`
4. 人读使用说明：`<仓库根>/团队使用指南.md`；视觉速览：各端 `web规范展示_框架版_*.html` / `移动端规范展示_*.html`。

## 3. 脚本调用（Windows PowerShell，`$repo` = 仓库根绝对路径）

- **全链路自检**（每次改动后必跑，须 86 pass / 0 fail / exit 0）：`node "$repo\ci-local.js"`
- **单页门禁**（0 HIGH 才交付）：`node "$repo\弘讯web端design-system\validate-spec.js" "<页面.html>"`（移动端同构换目录）
- **分享版**（交付用，内联全量 CSS 到 `<页面>_分享版.html`）：把 `<link rel="stylesheet" href="…template.css">` 替换为 `<style>` + template.css 全量内容
- **配色引擎**（非默认品牌 / 暗色）：`node "$repo\brand-color-engine\generate.js" <品牌色> <light|dark> <web|mobile>`

## 4. 铁律（违反 = 交付门禁拦截）

- 产出落盘「**用户项目**」的 `output/`（不是设计系统仓库；仓库根 `output/` 仅历史归档）
- 页面内容按 `RULES.md §1.1b` **从零自建**；**禁参照 output/、packages/ 或任何既有页面 DOM**（防风格漂移）；唯一可复制结构 = 克隆模板框架外壳
- 门禁 0 HIGH 才交付；MEDIUM（页面级布局类）可接受
- 页面 CSS 禁裸 hex（非 token 色）；动效时长必须 `var(--motion-duration-*)`
- 移动端规范为冻结资产，改动须用户拍板；不主动 git commit/push
