# 弘讯B端视觉系统 · 设计系统更新日志（CHANGELOG）

---
> 📦 历史条目已分卷归档：[`CHANGELOG-archive.md`](CHANGELOG-archive.md)（2026-10 起）+ [`CHANGELOG-archive-2026-08_09.md`](CHANGELOG-archive-2026-08_09.md)（2026-09 及更早，冻结卷）。

---

## [洁癖收尾：跨端契约文件归一改名 + 过程件清理] — 2026-11-20
- **命名归一**：根目录 `CROSS-PLATFORM-COLORS.md`（跨端中性色契约）与 `弘讯web端design-system/CROSS-PLATFORM-COLORS.md`（跨端功能色契约）**同名异义**，Agent 按名检索必混读——前者改名 `CROSS-PLATFORM-NEUTRALS.md`（git mv 保历史），check-size 键 / AGENTS / 团队使用指南同步更新，AGENTS 增「同名两文件勿混读」提示。
- **过程件清理**（均 gitignored 本地件）：repo `output/` 删 12 个迭代过程件（v3-v6 / 方案A·B / 框架预览 v1·v2 / v7 分享版重复副本 / 真源变更清单 / 规范改动分析 / _dash_main）；`.workbuddy/review/`（≈95 个一次性探针脚本 + 8 份过程审查 md）整体清除；外层用户 output 已消费问题报告 11 份归入 `设计系统问题_归档/`。保留：`图表示例页.html`（components.json 引用）、`_cdp-shot.js`（audit-shots 注释引用）、`信息化图表示例_分享版`。
- **记忆**：workspace 新增 `.workbuddy/memory/MEMORY.md`（纯指针索引，知识主体留 docs）；相对时间扫描 9 份规范文档清零。
- **实测**：check-reach 0 FAIL / 2 WARN；check-size 0 FAIL / 18 WARN；`verify.js all` 全绿。
## [LIVE/刷新落真源 + 双 pane 演示 + validate-static 收口 + 暗色 text 修正] — 2026-11-20
- **pagebar LIVE/刷新对齐 v7**（用户指令）：page-template.html pagebar 改为 v7 视觉——`.live-badge` LIVE 徽章 + `.bar-sep` + `.bar-refresh`（图标 + 文字 + `.bar-refresh-sec` 30s 倒计时）；CSS 类真源已在 workbench.css（零新增样式）；`page-ui.js` 追加倒计时 IIFE（点击旋转 + 重置 + toast，无 #pageRefresh 零介入）；i18n 增 `page.refreshLabel`、`page.live` 改「数据实时状态」。遗留 1 个 icon.source MED：refresh 图标库版与 v7 版两形并存（DS-20261120-04③）。
- **双 pane 演示**（DSH 遗留①）：page-template 页签补 `data-pane`（页面/页面二），正文两个 `.page-sec[data-pane]`；Edge headless 探针实测双向切换 + tab 高亮 + body[data-pane] 全通过。
- **validate-static 收口**（DSH 遗留②）：重导 dist-static 后暴露 78 项（原 14 为老产物残影）；根因 = 白名单只采集 page-template 内联样式、左右结构改版后已为空 → 真源既有值误判 HIGH。修法：白名单采集源补真源 build 产物 template.css（间距值级 + 字号值级，语义不变）；`globals.css` dark `--text-1/2/3` 与 `map-tokens.js` 暗色映射错档（N11/N10/N9 → N10/N9/N8，按 DARK-MODE.md textPrimary=#F1F5F9 真源修正）；template.css 重建（112.5KB）+ dist-static 重导 + freeze-baseline 重刷 → validate-static **0 HIGH**。
- **CHANGELOG 归档**（DSH 遗留③）：web 主文件 14,733→1,797 字符（20 条旧条目移入 archive 并更新切割线）；mobile 5,284→1,416（2026-11-18 及更早移入）。
- **二轮（反向检验后拍板执行，DS-20261120-04 三项全落）**：① workbench.css 增 `.tab-row > .row{padding-bottom:var(--space-sm)}`（meta 行形态，直接子选择器）；② components.css `.flow--row .flow-step` 竖排居中→横排左对齐（反方检验推翻原 b/c 推荐：组件除 dist-static 外零消费者，布局为空白第一成因）；③ page-template 刷新图标回归图标库 refresh.svg path（v7 2-path 弃用；page-ui.js IIFE 去 toast，机制/业务分层）。回灌：看板页 pagebar v7 化（bar-refresh + refreshSec 倒计时 + 页面自绑业务）+ 重出分享版；Edge 截图实测 meta 行留白恢复、工序卡空白消除。门禁：validate-static 0 HIGH、看板页 0 HIGH/1 MED（既有自造类）、verify.js all 全绿。
- **门禁**：page-template 单页 0 HIGH/1 MED；`verify.js all` 全绿（ci-local + verify-new）；check-size 0 FAIL；roll-changelog dry 0 条。
- **问题台账**：output/设计系统问题_20261120_04.md（tab-row meta 形态 / flow--row 密度 / refresh 图标两版，均待拍板）。

## [DS-20261120：图表高度链 / pane / 卡头 / badge / flow] — 2026-11-20
- **DS-02** `.chart-svg--fill` 去 `aspect-ratio` 改绝对填充（auto 高按宽反推 → 溢出裁切）；父级须 `.chart-box`。
- **DS-01** 新增 `.chart-x-labels--abs`（脚本自动挂载）；**DS-03** 新增 `.page-sec.is-active` + `page-ui.js` tab→pane。
- **DS-07** `.card-head:has(32px 控件)` 自动 48 高；**DS-04** `.badge-warn` 改 `--warn×--n11` 混色（4.97:1 AA）+ 新增 `.badge-info`。
- **DS-06** `.flow` 工序流程入库；**DS-05** 模板补 `.live-badge`+`.page-refresh`，i18n 增 `page.live`。
- **门禁**：复用前缀补 `step|flow`（USAGE `.step-*`→`.guide-*`）；白名单 + vendor-coverage 同步；删 4 处重复规则守住体积上限；`freeze-baseline` 重刷。`verify all` 全绿。
## [仓库瘦身：参考素材 / 大体积源文件 / 过程截图不入库] — 2026-11-20
- **移出仓库**：`参考不入设计系统库/`（用户参考图，非规范资产）、`assets/login-hero/login-hero-default.png`（4.5MB 源文件，本地保留，README 标注改「不入库」）、`弘讯移动端design-system/状态色_回灌_移动端.png`（过程截图，无引用）。
- **清理历史**：三路径用 `git filter-branch` 从全部提交移除后强推；旧 V2.1 历史仍在 `backup/v2.1-final-20261120`。
- **体积**：约 10.6MB → 6.1MB；文件 601 → 598。
- **实测**：`verify all` 全绿；新克隆复验。

## [skill 入口随仓库启用（团队拉仓即用）] — 2026-11-20
- **workbuddy**：`.workbuddy/skills/tm-design-system/SKILL.md` 重写并启用（原 `.disabled`）——仓库定位改用 `scripts/verify.js`；加载顺序补 CHART-SPEC §4/§5/§7（`generate-web-chart`）；命令改 `verify.js page` / `verify all`（交付口径）/ `build-share-web`（禁手工内联）；铁律补外壳真源、图表 HIGH、登录备案号、D-1~D-13、git 约定。
- **DSH**：`.dsh/.../SKILL.md` 指针启用，去掉「读 HANDOFF」硬依赖（HANDOFF gitignored，新克隆不存在）。
- **分发**：`.gitignore` 放行 `SKILL.md` + `data/`；`check-reach` R5 由「入口已停用」自动转为「入口文件齐全」；README / START-HERE / USAGE-GUIDE / 团队指南 / AGENTS 的「skill 停用」口径全部改为「随仓库启用」，clone 地址换成真实仓库。
- **实测**：`verify all` 全绿；check-size 0/19；check-reach 0/1。
