---
name: tm-design-system
description: 弘讯设计系统（DSH 入口薄壳）：生成/修改/审计 B 端 Web 或移动端 HTML 页面，按 GENERATION-SOP + 端 RULES 执行，0 HIGH 门禁交付
---

# tm-design-system · DSH 项目级入口

> 本文件是**入口指针**，不承载规范正文（避免双份维护）。
> 规范本体唯一真源 = `<仓库根>/.workbuddy/skills/tm-design-system/SKILL.md`（workbuddy / DSH / 其他 Agent 共用同一份）。

## 1. 定位仓库根（按序）

1. 环境变量 `TM_DESIGN_REPO` 已设置 → 其值即仓库根。
2. 未设置 → 本文件**向上 3 级**（`.dsh/skills/tm-design-system/` → 仓库根）。
3. 校验特征：该目录含 `ci-local.js` + `弘讯web端design-system/` + `弘讯移动端design-system/` + `output/`；不符则回退到当前 workspace 内查找含 `ci-local.js` 的目录。

## 2. 加载并执行（必做，按序）

1. 读 `<仓库根>/.workbuddy/skills/tm-design-system/SKILL.md`，**整份照其执行**（仓库定位 / 规范加载顺序 / 脚本调用 / 铁律），不要另起流程。
2. 动手前读 `<仓库根>/HANDOFF.md`（§1 现状快照 + §4 未决事项）；本轮收尾按该文件 §0 铁律更新 §1 / §4 / §7，未更新不算完成。
3. 用户口语需求（「表格 / 看板 / 夜间模式 / 转圈」）不确定对应哪个弘讯组件时，检索 `<仓库根>/.workbuddy/skills/tm-design-system/data/vocabulary.json`（按需，勿整份加载）。

## 3. 禁止

- 不在本文件复制 / 摘抄本体内容；本体更新后本文件无需改动。
- 不把 `.dsh/skills/` 当规范真源引用——真源永远是 `tokens.json` / `components.json` / `template.css` / `validate-spec.js`。
- 不主动 `git commit` / `push`（无用户显式授权不动 git）。
