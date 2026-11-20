---
name: tm-design-system
description: 弘讯设计系统（DSH 入口薄壳）：生成/修改/审计 B 端 Web 或移动端 HTML 页面，按 GENERATION-SOP + 端 RULES 执行，交付口径 verify.js all 全绿
---

# tm-design-system · DSH 项目级入口

> 本文件是**入口指针**，不承载规范正文（避免双份维护）。
> 规范本体唯一真源 = `<仓库根>/.workbuddy/skills/tm-design-system/SKILL.md`（workbuddy / DSH / 其他 Agent 共用同一份）。

## 1. 定位仓库根（按序）

1. 环境变量 `TM_DESIGN_REPO` 已设置 → 其值即仓库根。
2. 未设置 → 本文件**向上 3 级**（`.dsh/skills/tm-design-system/` → 仓库根）。
3. 校验特征：该目录含 `scripts/verify.js` + `弘讯web端design-system/` + `弘讯移动端design-system/`；不符则回退到当前 workspace 内查找含 `scripts/verify.js` 的目录。

## 2. 加载并执行（必做，按序）

1. 读 `<仓库根>/.workbuddy/skills/tm-design-system/SKILL.md`，**整份照其执行**（仓库定位 / 规范加载顺序 / 脚本调用 / 铁律），不要另起流程。
2. 维护者本机另有 `<仓库根>/HANDOFF.md`（跨会话现状快照）；**它是 gitignored 的本地文件，新克隆没有**——存在则读 §1/§4 并按 §0 铁律更新，缺失则跳过，不要新建。
3. 用户口语需求不确定对应哪个组件/章节时，检索 `<仓库根>/.workbuddy/skills/tm-design-system/data/vocabulary.json`（按需，勿整份加载）。

## 3. 禁止

- 不在本文件复制 / 摘抄本体内容；本体更新后本文件无需改动。
- 不把 `.dsh/skills/` 当规范真源引用——真源永远是 `tokens.json` / `components.json` / `template.css` / `RULES.md`。
- 不 `push` 到未经用户确认的远端、禁 `force-push`；改动先 `node scripts/verify.js all` 全绿再 commit。
