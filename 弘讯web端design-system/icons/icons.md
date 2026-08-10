# Web 端图标集 Icons（B 端后台）

> 注塑机 / 工业控制 / 智能控制系统 · B 端后台统一图标
> 统一规格：viewBox 24×24 · stroke-width 1.8 · linecap/linejoin round · fill none · currentColor
> 尺寸类（template.css 已落地）：`.ico` 16px（表格/菜单操作）· `.btn-ico` 16px（按钮内）· `.tree-ico` 16px（侧栏树节点）· `.kpi-ico` 20px / `.kpi-ico--lg` 24px（指标卡）
> 语义色联动：状态图标用功能色 token（`var(--suc/--warn/--err/--run)` 等）
> **共 144 个**（2026-08-07 索引对齐）：其中 129 个与移动端 icons/ 同源共用，15 个 Web 特有；下方索引含 B 端特有 14 + 旧图标迁移批 1/2 + 批 3 补充 71。

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
| `logout.svg` | 退出登录 | 退出登录（门在右、左出箭头，2026-08-07 旧造型重画） | 操作 |
| `key.svg` | 修改密码 | 修改密码（钥匙+锁孔，2026-08-07 新增，旧造型重画） | 操作 |
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

## 批 3 · 索引补全（2026-08-07）：通用 / 设备 / 工艺 / 状态 71

| 文件名 | 图标 | 用途 | 类目 |
|---|---|---|---|
| `home.svg` | 首页 | 首页（房屋） | 通用导航 |
| `user.svg` | 用户 | 用户/管理员（人形） | 通用 |
| `search.svg` | 搜索 | 搜索（放大镜） | 通用 |
| `settings.svg` | 设置 | 设置（齿轮） | 通用 |
| `message.svg` | 消息 | 消息（气泡） | 通用 |
| `cloud.svg` | 云 | 云端（云） | 通用 |
| `remote.svg` | 远程 | 远程/实时监控（信号） | 通用 |
| `meter.svg` | 仪表 | 仪表/度量（仪表盘） | 通用 |
| `schedule.svg` | 日程 | 日程/排期（日历） | 通用 |
| `click.svg` | 点击 | 点击/交互（手） | 通用 |
| `close.svg` | 关闭 | 关闭（叉） | 操作 |
| `plus.svg` | 新增 | 新增（加号） | 操作 |
| `edit.svg` | 编辑 | 编辑（铅笔） | 操作 |
| `trash.svg` | 删除 | 删除（垃圾桶） | 操作 |
| `refresh.svg` | 刷新 | 刷新（循环箭头） | 操作 |
| `export.svg` | 导出 | 导出（导出箭头） | 操作 |
| `lock.svg` | 锁定 | 锁定/权限（锁） | 操作 |
| `more.svg` | 更多 | 更多（三点） | 操作 |
| `check_list.svg` | 检查清单 | 检查清单（清单+勾） | 操作 |
| `alarm_bell.svg` | 报警 | 报警（铃铛） | 状态 |
| `warning.svg` | 警告 | 警告（三角叹号） | 状态 |
| `fault.svg` | 故障 | 故障（叹号三角） | 状态 |
| `running.svg` | 运行 | 运行（播放三角） | 状态 |
| `stopped.svg` | 停机 | 停机/停止（方块） | 状态 |
| `offline.svg` | 离线 | 离线（断线） | 状态 |
| `injection_machine.svg` | 注塑机 | 注塑机（机器） | 设备 |
| `robot_arm.svg` | 机械手 | 机械手（机械臂） | 设备 |
| `dryer_loader.svg` | 干燥机 | 干燥机（干燥+上料） | 设备 |
| `clamp_force.svg` | 锁模力 | 锁模力（压力表） | 设备 |
| `hold_pressure.svg` | 保压 | 保压（压力） | 设备 |
| `inject_pressure.svg` | 注射压力 | 注射压力（压力） | 设备 |
| `pressure.svg` | 压力 | 压力（压力表） | 设备 |
| `temperature.svg` | 温度 | 温度（温度计） | 设备 |
| `mold_temp.svg` | 模温 | 模温（温度计+模具） | 设备 |
| `temp_zone.svg` | 温区 | 温区（温区分布） | 设备 |
| `mold.svg` | 模具 | 模具（模具） | 设备 |
| `motor.svg` | 电机 | 电机（马达） | 设备 |
| `e_stop.svg` | 急停 | 急停（急停按钮） | 设备 |
| `downtime.svg` | 停机时长 | 停机/宕机时长（暂停） | 设备 |
| `lubricate.svg` | 润滑 | 润滑（油滴） | 设备 |
| `energy.svg` | 能耗 | 能耗（闪电） | 业务-生产 |
| `energy_save.svg` | 节能 | 节能（节能） | 业务-生产 |
| `carbon.svg` | 碳排放 | 碳排放（叶片） | 业务-生产 |
| `oee.svg` | OEE | 设备综合效率 OEE（效率） | 业务-生产 |
| `cycle_time.svg` | 周期时间 | 周期时间（循环箭头） | 业务-生产 |
| `production.svg` | 生产管理 | 生产管理（生产） | 业务-生产 |
| `production_plan.svg` | 排产计划 | 排产计划（排产） | 业务-生产 |
| `work_order.svg` | 工单 | 工单（工单） | 业务-生产 |
| `report_work.svg` | 生产报表 | 生产报表（报表） | 业务-生产 |
| `quality.svg` | 质量 | 质量/质检（质检） | 业务-质量 |
| `defect.svg` | 缺陷 | 缺陷/不良（不良品） | 业务-质量 |
| `measure.svg` | 测量 | 测量（尺） | 业务-质量 |
| `measure_report.svg` | 测量报告 | 测量报告（报告） | 业务-质量 |
| `spc.svg` | SPC | 统计过程控制 SPC（控制图） | 业务-质量 |
| `yield.svg` | 良率 | 良率（良率） | 业务-质量 |
| `formula.svg` | 配方 | 配方（公式） | 业务-工艺 |
| `load_param.svg` | 参数载入 | 参数载入（载入） | 业务-工艺 |
| `param_compare.svg` | 参数对比 | 参数对比（对比） | 业务-工艺 |
| `process_param.svg` | 工艺参数 | 工艺参数（滑杆） | 业务-工艺 |
| `maintenance.svg` | 保养 | 保养（扳手） | 业务-维护 |
| `maintain_plan.svg` | 保养计划 | 保养计划（日历+扳手） | 业务-维护 |
| `spare_parts.svg` | 备件 | 备件（备件） | 业务-维护 |
| `wear_part.svg` | 磨损件 | 磨损件（磨损） | 业务-维护 |
| `data_collect.svg` | 数据采集 | 数据采集（采集） | 业务-数据 |
| `report_chart.svg` | 报表图表 | 报表图表（图表） | 业务-数据 |
| `trend.svg` | 趋势 | 趋势（折线） | 业务-数据 |
| `order.svg` | 订单 | 订单（订单） | 业务-销售 |
| `safe_check.svg` | 安全检查 | 安全检查（盾+勾） | 业务-安全 |
| `shield.svg` | 安全 | 安全（盾） | 通用 |
