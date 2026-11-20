/*
 * DeviceList — 移动端设备列表页（生产路：NutUI 真实组件 + globals.css token）
 * 对齐弘讯移动端design-system/RULES.md §1.1b 列表-详情页 覆写文档。
 * 结构：NavBar(品牌蓝底+返回+更多) → SearchBar(实时过滤) → 列表(双行带缩略图+状态Tag+⋮) → ActionSheet(编辑/报修/停用)。
 * 死规矩：全 var(--*) token，禁硬编码色；不手写 HTML 重搓 NutUI 组件；交互全实现。
 */
import { useRef, useState } from 'react';
import { View, Text, ScrollView, ITouchEvent } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { NavBar, SearchBar, Tag, ActionSheet } from '@nutui/nutui-react-taro';
import { ArrowLeft, More, Category } from '@nutui/icons-react-taro';
import { Device, DeviceStatus, MOCK_DEVICES } from '../../data/devices';
import './index.scss';

// 状态 → 文案 + NutUI Tag type 映射（running→success / maintain→warning / error→danger，语义走 token）
const STATUS_MAP: Record<DeviceStatus, { text: string; type: 'success' | 'warning' | 'danger' }> = {
  running: { text: '运行中', type: 'success' },
  maintain: { text: '待维护', type: 'warning' },
  error: { text: '故障', type: 'danger' },
};

// ActionSheet 动作（编辑/报修/停用）
const SHEET_ACTIONS = [{ name: '编辑' }, { name: '报修' }, { name: '停用' }];

export default function DeviceList() {
  const [keyword, setKeyword] = useState('');
  const [sheetVisible, setSheetVisible] = useState(false);
  const [activeDevice, setActiveDevice] = useState<Device | null>(null);

  // 搜索过滤（名称 / 型号 本地匹配；D07 2026-08-05：toLowerCase 归一化，防大小写误报空态）
  const kw = keyword.trim().toLowerCase();
  const filtered = kw
    ? MOCK_DEVICES.filter(
        (d) => d.name.toLowerCase().includes(kw) || d.model.toLowerCase().includes(kw)
      )
    : MOCK_DEVICES;

  const openSheet = (device?: Device) => {
    setActiveDevice(device ?? null);
    setSheetVisible(true);
  };

  const closeSheet = () => {
    setSheetVisible(false);
    setActiveDevice(null);
  };

  const onSheetSelect = (item: { [k: string]: string | boolean }, _index: number) => {
    const action = String(item.name ?? '');
    Taro.showToast({
      title: activeDevice ? `${action} · ${activeDevice.name}` : action,
      icon: 'none',
    });
    closeSheet();
  };

  // 列表项点击：跳转真实详情页（传设备 id 参数；D09 2026-08-05：300ms 连点节流防重复入栈。
  //   useRef 持久化时间戳——函数体内 let 变量每次重渲染重置会导致节流失效（对抗审查 DEFECT-06 加固））
  const navLockRef = useRef(0);
  const openDetail = (device: Device) => {
    const now = Date.now();
    if (now - navLockRef.current < 300) return;
    navLockRef.current = now;
    Taro.navigateTo({ url: '/pages/device-detail/index?id=' + device.id });
  };
  // D08 2026-08-05（拍板④）：页面栈守卫——直达页无页可退时 reLaunch 回首页
  const safeBack = () => {
    const pages = Taro.getCurrentPages();
    if (pages.length > 1) Taro.navigateBack();
    else Taro.reLaunch({ url: '/pages/index/index' });
  };

  return (
    <View className="page-page">
      {/* 顶部导航：品牌蓝底白字，左返回 / 右更多 */}
      <NavBar
        className="page-navbar"
        title="设备列表"
        left={<ArrowLeft onClick={safeBack} />}
        right={<More onClick={() => openSheet()} />}
        safeAreaInsetTop
      />

      {/* 搜索栏：实时过滤 */}
      <View className="page-search">
        <SearchBar
          value={keyword}
          placeholder="搜索设备名称 / 型号"
          onChange={(v) => setKeyword(v ?? '')}
        />
      </View>

      {/* 列表区（可滚动）：343 落位，列表项 gap 16 */}
      <ScrollView className="page-list" scrollY>
        {filtered.map((d) => {
          const s = STATUS_MAP[d.status];
          return (
            <View className="page-item" key={d.id} onClick={() => openDetail(d)}>
              {/* 左侧缩略图占位（token 圆角块） */}
              <View className="page-thumb">
                <Category />
              </View>

              {/* 中间文字区（双行 + 辅助行） */}
              <View className="page-body">
                <View className="page-row1">
                  <Text className="page-title">{d.name}</Text>
                  <Tag type={s.type} className="page-tag">
                    {s.text}
                  </Tag>
                </View>
                <Text className="page-sub">型号: {d.model}</Text>
                <Text className="page-foot">
                  {d.area} | 操作员: {d.op}
                </Text>
              </View>

              {/* 右侧 ⋮ 更多（点击打开 ActionSheet，阻止冒泡避免触发详情） */}
              <View
                className="page-more"
                onClick={(e: ITouchEvent) => {
                  e.stopPropagation();
                  openSheet(d);
                }}
              >
                <More />
              </View>
            </View>
          );
        })}

        {filtered.length === 0 && (
          <View className="page-empty">
            <Text className="page-empty-text">未找到匹配的设备</Text>
          </View>
        )}
      </ScrollView>

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
