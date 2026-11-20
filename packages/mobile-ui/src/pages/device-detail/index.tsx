/*
 * DeviceDetail — 移动端设备详情页（生产路：NutUI 真实组件 + globals.css token）
 * 对齐弘讯移动端design-system/RULES.md §1.1b 列表-详情页 覆写文档（详情视图为推导，无独立设计稿，
 * 视觉对齐样板页 device-list 风格）。数据来自共享 devices.ts（与列表页同源）；路由参数 id 取数据。
 * 死规矩：全 var(--*) token，禁硬编码色；不手写 HTML 重搓 NutUI 组件；交互全实现。
 */
import { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import {
  NavBar,
  Button,
  Cell,
  CellGroup,
  Tag,
  ActionSheet,
  Empty,
} from '@nutui/nutui-react-taro';
import { ArrowLeft, More } from '@nutui/icons-react-taro';
import { Device, DeviceStatus, getDeviceById } from '../../data/devices';
import './index.scss';

// 状态 → 文案 + NutUI Tag type 映射（复制自列表页 STATUS_MAP，避免两处漂移；
// 未抽 status.ts 因白名单仅允许新建 devices.ts，见 PROGRESS.md 任务书 A 记录）
const STATUS_MAP: Record<DeviceStatus, { text: string; type: 'success' | 'warning' | 'danger' }> = {
  running: { text: '运行中', type: 'success' },
  maintain: { text: '待维护', type: 'warning' },
  error: { text: '故障', type: 'danger' },
};

// ActionSheet 动作（编辑/报修/停用）
const SHEET_ACTIONS = [{ name: '编辑' }, { name: '报修' }, { name: '停用' }];

export default function DeviceDetail() {
  const router = useRouter();
  const id = Number(router.params.id);
  const device = Number.isNaN(id) ? undefined : getDeviceById(id);

  const [sheetVisible, setSheetVisible] = useState(false);

  const openSheet = () => setSheetVisible(true);
  const closeSheet = () => setSheetVisible(false);
  // D08 2026-08-05（拍板④）：页面栈守卫——直达页（分享/二维码）无页可退时 reLaunch 回列表
  const safeBack = () => {
    const pages = Taro.getCurrentPages();
    if (pages.length > 1) Taro.navigateBack();
    else Taro.reLaunch({ url: '/pages/index/index' });
  };

  const onSheetSelect = (item: { [k: string]: string | boolean }, _index: number) => {
    const action = String(item.name ?? '');
    Taro.showToast({ title: action, icon: 'none' });
    closeSheet();
  };

  // 未找到设备（id 无效 / 不存在）→ Empty 分支
  if (!device) {
    return (
      <View className="page-page">
        <NavBar
          className="page-navbar"
          title="设备详情"
          left={<ArrowLeft onClick={safeBack} />}
          safeAreaInsetTop
        />
        <View className="page-empty">
          <Empty description="设备不存在" />
          <Button type="primary" onClick={safeBack}>
            返回列表
          </Button>
        </View>
      </View>
    );
  }

  const s = STATUS_MAP[device.status];

  return (
    <View className="page-page">
      {/* 顶部导航：品牌蓝底白字，左返回 / 右更多 */}
      <NavBar
        className="page-navbar"
        title="设备详情"
        left={<ArrowLeft onClick={safeBack} />}
        right={<More onClick={() => openSheet()} />}
        safeAreaInsetTop
      />

      {/* 内容区：343 落位，卡片 gap 16 */}
      <ScrollView className="page-content" scrollY>
        {/* 设备信息卡（--bg-surface 圆角 + padding token） */}
        <View className="page-card">
          <View className="page-card-head">
            <Text className="page-name">{device.name}</Text>
            <Tag type={s.type} className="page-tag">
              {s.text}
            </Tag>
          </View>
          <CellGroup>
            <Cell title="型号" description={device.model} />
            <Cell title="车间" description={device.area} />
            <Cell title="操作员" description={device.op} />
          </CellGroup>
        </View>
      </ScrollView>

      {/* 操作区：主操作按钮 + ActionSheet */}
      <View className="page-footer">
        <Button
          type="primary"
          block
          onClick={() => Taro.showToast({ title: '报修', icon: 'none' })}
        >
          报修
        </Button>
      </View>

      {/* 操作菜单：编辑 / 报修 / 停用 */}
      <ActionSheet
        visible={sheetVisible}
        options={SHEET_ACTIONS}
        cancelText="取消"
        onCancel={closeSheet}
        onSelect={onSheetSelect}
      />
    </View>
  );
}
