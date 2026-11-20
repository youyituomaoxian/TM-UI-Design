# 弘讯移动端设计系统 — Changelog

> 语义版本（与 Web 端 `CHANGELOG.md` 同构）。所有「值」以 `tokens.json` 为唯一真源；所有「组件尺寸/色值」以 `components.json` 为唯一真源。

---
> 📦 历史条目已滚动归档：mobile 归档 `[1.14.13]`（2026-09-10）及更早见 [`CHANGELOG-archive.md`](CHANGELOG-archive.md)（2026-09-22）。

---

## [DS-20261120-04：本端未改（web 真源轮 + 主文件归档）] — 2026-11-20
- Web 端落 LIVE/刷新真源、双 pane 演示、validate-static 白名单扩源、暗色 text 映射修正；移动端零语义变更（左右结构仅 Web，#9 已拍板）。
- 本文件主文件手工归档：2026-11-18 及更早条目移入 `CHANGELOG-archive.md`（切割线已更新），主文件 5,284→1,416 字符。

## [DS-20261120：本端未改] — 2026-11-20

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
