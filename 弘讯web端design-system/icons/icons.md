# Web 端图标集 Icons（B 端后台）

> 注塑机 / 工业控制 / 智能控制系统 · B 端后台统一图标
> 统一规格：viewBox 24×24 · stroke-width 1.8 · linecap/linejoin round · fill none · currentColor
> 尺寸类（template.css 已落地）：`.ico` 16px（表格/菜单操作）· `.btn-ico` 16px（按钮内）· `.tree-ico` 16px（侧栏树节点）· `.kpi-ico` 20px / `.kpi-ico--lg` 24px（指标卡）
> 语义色联动：状态图标用功能色 token（`var(--suc/--warn/--err/--run)` 等）
> 通用 70 个与移动端共用（icons/ 同源），B 端特有 14 个，共 196 个。

## B 端特有（14）

| 文件名 | 图标 | 用途 | 类目 |
|---|---|---|---|
| `menu.svg` | 菜单 | 侧栏折叠菜单入口 | B端导航 |
| `chevron_down.svg` | 展开 | 折叠面板/下拉展开 | B端操作 |
| `chevron_up.svg` | 收起 | 折叠面板/下拉收起 | B端操作 |
| `chevron_right.svg` | 右箭头 | 次级入口/前进 | B端操作 |
| `sort.svg` | 排序 | 列排序（升降） | B端表格 |
| `filter.svg` | 筛选 | 筛选漏斗 | B端表格 |
| `upload.svg` | 上传 | 文件上传 | B端操作 |
| `import.svg` | 导入 | 数据导入 | B端操作 |
| `user_group.svg` | 用户组 | 用户组/角色 | B端管理 |
| `log.svg` | 操作日志 | 操作日志/审计 | B端管理 |
| `dashboard.svg` | 仪表盘 | 数据看板 | B端导航 |
| `columns.svg` | 列设置 | 表格列显隐 | B端表格 |
| `eye_off.svg` | 隐藏 | 密码/内容隐藏 | B端操作 |
| `fullscreen.svg` | 全屏 | 全屏展开 | B端操作 |

> 通用 70 个索引见移动端 `icons/icons.md`（跨端共用同一份 SVG）。

## 旧图标迁移批 1（2026-08-06）：新增 14 + back 重画

| 文件名 | 图标 | 用途 | 类目 |
|---|---|---|---|
| `back.svg` | 返回 | 返回上一级（回退箭头，旧造型重画） | 通用导航 |
| `save.svg` | 保存 | 保存（软盘） | 操作 |
| `confirm.svg` | 确定 | 确认/确定（对勾） | 操作 |
| `cancel.svg` | 取消 | 取消（叉） | 操作 |
| `done.svg` | 完成 | 完成（圆角徽章+勾） | 操作 |
| `copy.svg` | 复制 | 复制（双矩形） | 操作 |
| `print.svg` | 打印 | 打印（打印机） | 操作 |
| `pause.svg` | 暂停 | 暂停（双竖条） | 状态 |
| `calendar.svg` | 日历 | 日历（日期） | 通用 |
| `logout.svg` | 退出登录 | 退出登录（右出箭头） | 操作 |
| `info.svg` | 关于 | 关于/信息（i 圆） | 通用 |
| `detail.svg` | 查看详情 | 查看详情（文档+眼睛） | 操作 |
| `list.svg` | 列表 | 列表（行） | 通用 |
| `location.svg` | 位置 | 位置/定位（图钉） | 通用 |
| `overview.svg` | 概览 | 概览/总览（井字格） | 导航 |

## 旧图标迁移批 2（2026-08-06）：业务图标 45

| 文件名 | 图标 | 用途 | 类目 |
|---|---|---|---|
| `patrol.svg` | 巡检 | 设备巡检（文档+放大镜） | 业务-维护 |
| `ipqc.svg` | IPQC | 过程质检（循环+勾） | 业务-质量 |
| `limit.svg` | 上下限 | SPC 上下限（线+箭头） | 业务-质量 |
| `quality_param.svg` | 品质参数监控 | 品质参数（双滑杆+勾） | 业务-质量 |
| `archive.svg` | 归档 | 归档（档案盒） | 操作 |
| `approve.svg` | 审核 | 审核（文档+双勾） | 操作 |
| `warehouse.svg` | 仓储 | 仓储（库房） | 业务-物料 |
| `stock.svg` | 库存管理 | 库存（箱+条码） | 业务-物料 |
| `customer.svg` | 客户管理 | 客户（人+加号） | 业务-销售 |
| `material.svg` | 材料管理 | 材料（立方体） | 业务-物料 |
| `permission.svg` | 权限管理 | 权限（人+盾） | 业务-管理 |
| `role.svg` | 角色授权 | 角色（人+勾） | 业务-管理 |
| `switch_user.svg` | 转换用户 | 转换用户（人+切换） | 业务-管理 |
| `inspect.svg` | 检测管理 | 检测（检测仪） | 业务-质量 |
| `init.svg` | 初始化数据 | 初始化（双向刷新） | 操作 |
| `upgrade.svg` | 升级 | 升级（上箭头+底座） | 操作 |
| `developer.svg` | 开发者 | 开发者（代码） | 业务-管理 |
| `basic.svg` | 基础资料 | 基础资料（书） | 业务-管理 |
| `transfer.svg` | 抛转 | 抛转（文档+抛出） | 操作 |
| `field_service.svg` | 外出服务 | 外出服务（人+外出） | 业务-销售 |
| `billing.svg` | 收费管理 | 收费（货币圆） | 业务-销售 |
| `renew.svg` | 续费 | 续费（刷新+勾） | 业务-销售 |
| `marketing.svg` | 营销规则 | 营销（喇叭） | 业务-销售 |
| `mapping.svg` | 标准库映射 | 映射（双框+箭头） | 业务-数据 |
| `add_machine.svg` | 添加机器 | 添加机器（机器+加号） | 设备 |
| `machine_setting.svg` | 机器设定 | 机器设定（机器+滑杆） | 设备 |
| `workshop.svg` | 车间 | 车间（厂房） | 业务-生产 |
| `tree_manage.svg` | 作业树管理 | 作业树管理（树+齿轮） | 业务-管理 |
| `tree_add_child.svg` | 增加下级 | 增加下级（树+加号） | 业务-管理 |
| `tree_add_sibling.svg` | 增加同级 | 增加同级（同级+加号） | 业务-管理 |
| `product.svg` | 产品管理 | 产品（盒子） | 业务-物料 |
| `product_category.svg` | 产品类别 | 产品类别（分类格） | 业务-物料 |
| `product_trace.svg` | 产品追溯 | 产品追溯（盒+追溯） | 业务-质量 |
| `dispatch.svg` | 下达 | 下达（下发箭头） | 操作 |
| `sim.svg` | SIM卡管理 | SIM 卡 | 业务-管理 |
| `expired.svg` | 设备过期 | 设备过期（时钟+叉） | 设备 |
| `throughput.svg` | 处理量 | 处理量（进出流量） | 业务-生产 |
| `shape.svg` | 图形 | 图形（菱形+圆） | 业务-数据 |
| `process_manage.svg` | 工艺管理 | 工艺管理（文件夹+滑杆） | 业务-工艺 |
| `process_monitor.svg` | 工艺监控 | 工艺监控（滑杆+曲线） | 业务-工艺 |
| `param_config.svg` | 参数配置 | 参数配置（齿轮+滑杆） | 业务-工艺 |
| `device_status.svg` | 设备状态监控 | 设备状态（机器+状态点） | 设备 |
| `capacity.svg` | 设备产能监控 | 产能（机器+柱） | 设备 |
| `device_manage.svg` | 设备管理 | 设备管理（机器+齿轮） | 设备 |
| `device_open.svg` | 设备开通 | 设备开通（机器+勾） | 设备 |

## 新增（2026-08-10 业务扩展，双端）

| 文件名 | 图标 | 用途 | 类目 |
|---|---|---|---|
| `add_item.svg` | 新增条目 | 新增条目（2026-08-10 业务扩展新画） | 业务扩展 |
| `base_data.svg` | 基础数据 | 基础数据（2026-08-10 业务扩展新画） | 业务扩展 |
| `big_screen.svg` | 大屏 | 大屏（2026-08-10 业务扩展新画） | 业务扩展 |
| `billing_manage.svg` | 计费管理 | 计费管理（2026-08-10 业务扩展新画） | 业务扩展 |
| `board_manage.svg` | 看板管理 | 看板管理（2026-08-10 业务扩展新画） | 业务扩展 |
| `cancel_archive.svg` | 取消归档 | 取消归档（2026-08-10 业务扩展新画） | 业务扩展 |
| `cancel_review.svg` | 取消审核 | 取消审核（2026-08-10 业务扩展新画） | 业务扩展 |
| `chart.svg` | 图表 | 图表（2026-08-10 业务扩展新画） | 业务扩展 |
| `customer_manage.svg` | 客户管理 | 客户管理（2026-08-10 业务扩展新画） | 业务扩展 |
| `custom_report.svg` | 自定义报表 | 自定义报表（2026-08-10 业务扩展新画） | 业务扩展 |
| `data_analysis.svg` | 数据分析 | 数据分析（2026-08-10 业务扩展新画） | 业务扩展 |
| `device_activate.svg` | 设备激活 | 设备激活（2026-08-10 业务扩展新画） | 业务扩展 |
| `device_activate_alt.svg` | 设备激活(备) | 设备激活(备)（2026-08-10 业务扩展新画） | 业务扩展 |
| `device_alarm_monitor.svg` | 设备报警监控 | 设备报警监控（2026-08-10 业务扩展新画） | 业务扩展 |
| `device_authorize.svg` | 设备授权 | 设备授权（2026-08-10 业务扩展新画） | 业务扩展 |
| `device_capacity_board.svg` | 设备产能看板 | 设备产能看板（2026-08-10 业务扩展新画） | 业务扩展 |
| `device_capacity_monitor.svg` | 设备产能监控 | 设备产能监控（2026-08-10 业务扩展新画） | 业务扩展 |
| `device_downtime_monitor.svg` | 设备停机监控 | 设备停机监控（2026-08-10 业务扩展新画） | 业务扩展 |
| `device_inactive.svg` | 设备停用 | 设备停用（2026-08-10 业务扩展新画） | 业务扩展 |
| `device_maintenance.svg` | 设备维护 | 设备维护（2026-08-10 业务扩展新画） | 业务扩展 |
| `device_oee_monitor.svg` | 设备OEE监控 | 设备OEE监控（2026-08-10 业务扩展新画） | 业务扩展 |
| `device_status_board.svg` | 设备状态看板 | 设备状态看板（2026-08-10 业务扩展新画） | 业务扩展 |
| `device_status_monitor.svg` | 设备状态监控 | 设备状态监控（2026-08-10 业务扩展新画） | 业务扩展 |
| `dispatch_alt.svg` | 派工(备) | 派工(备)（2026-08-10 业务扩展新画） | 业务扩展 |
| `energy_manage.svg` | 能耗管理 | 能耗管理（2026-08-10 业务扩展新画） | 业务扩展 |
| `exit_fullscreen.svg` | 退出全屏 | 退出全屏（2026-08-10 业务扩展新画） | 业务扩展 |
| `export_alt.svg` | 导出(备) | 导出(备)（2026-08-10 业务扩展新画） | 业务扩展 |
| `machine_overview.svg` | 设备总览 | 设备总览（2026-08-10 业务扩展新画） | 业务扩展 |
| `material_order.svg` | 物料订单 | 物料订单（2026-08-10 业务扩展新画） | 业务扩展 |
| `mold_maintenance.svg` | 模具维护 | 模具维护（2026-08-10 业务扩展新画） | 业务扩展 |
| `monitor.svg` | 监控 | 监控（2026-08-10 业务扩展新画） | 业务扩展 |
| `monitor_overview.svg` | 监控总览 | 监控总览（2026-08-10 业务扩展新画） | 业务扩展 |
| `param_change_board.svg` | 参数变更看板 | 参数变更看板（2026-08-10 业务扩展新画） | 业务扩展 |
| `param_change_monitor.svg` | 参数变更监控 | 参数变更监控（2026-08-10 业务扩展新画） | 业务扩展 |
| `production_overview_board.svg` | 生产总览看板 | 生产总览看板（2026-08-10 业务扩展新画） | 业务扩展 |
| `production_progress_board.svg` | 生产进度看板 | 生产进度看板（2026-08-10 业务扩展新画） | 业务扩展 |
| `production_unit.svg` | 生产单元 | 生产单元（2026-08-10 业务扩展新画） | 业务扩展 |
| `production_unit_manage.svg` | 生产单元管理 | 生产单元管理（2026-08-10 业务扩展新画） | 业务扩展 |
| `quality_analysis.svg` | 质量分析 | 质量分析（2026-08-10 业务扩展新画） | 业务扩展 |
| `quality_overview_board.svg` | 质量总览看板 | 质量总览看板（2026-08-10 业务扩展新画） | 业务扩展 |
| `realtime_monitor.svg` | 实时监控 | 实时监控（2026-08-10 业务扩展新画） | 业务扩展 |
| `repair_maintenance.svg` | 维修保养 | 维修保养（2026-08-10 业务扩展新画） | 业务扩展 |
| `repair_manage.svg` | 维修管理 | 维修管理（2026-08-10 业务扩展新画） | 业务扩展 |
| `report_export.svg` | 报表导出 | 报表导出（2026-08-10 业务扩展新画） | 业务扩展 |
| `report_preview.svg` | 报表预览 | 报表预览（2026-08-10 业务扩展新画） | 业务扩展 |
| `review.svg` | 审核 | 审核（2026-08-10 业务扩展新画） | 业务扩展 |
| `smart_mfg_board.svg` | 智能制造看板 | 智能制造看板（2026-08-10 业务扩展新画） | 业务扩展 |
| `standard_lib_map.svg` | 标准库映射 | 标准库映射（2026-08-10 业务扩展新画） | 业务扩展 |
| `stats_report.svg` | 统计报表 | 统计报表（2026-08-10 业务扩展新画） | 业务扩展 |
| `system_design.svg` | 系统设计 | 系统设计（2026-08-10 业务扩展新画） | 业务扩展 |
| `task_release.svg` | 任务下发 | 任务下发（2026-08-10 业务扩展新画） | 业务扩展 |
| `workshop_board.svg` | 车间看板 | 车间看板（2026-08-10 业务扩展新画） | 业务扩展 |
| `workshop_info.svg` | 车间信息 | 车间信息（2026-08-10 业务扩展新画） | 业务扩展 |
