// packages/mobile-ui/src/data/devices.ts — 设备 mock 数据（列表页 + 详情页共享）
// 值来源：弘讯移动端design-system/RULES.md §1.1b 列表-详情页（3 条 SX 系列设备 ASCII 定义）
export type DeviceStatus = 'running' | 'maintain' | 'error';
export interface Device { id: number; name: string; model: string; status: DeviceStatus; area: string; op: string; }
export const MOCK_DEVICES: Device[] = [
  { id: 1, name: 'SX-2000', model: 'SX-2000', status: 'running', area: '车间一区', op: '张工' },
  { id: 2, name: 'SX-1500', model: 'SX-1500', status: 'maintain', area: '车间二区', op: '李工' },
  { id: 3, name: 'SX-3000', model: 'SX-3000', status: 'error', area: '车间一区', op: '王工' },
];
export function getDeviceById(id: number): Device | undefined {
  return MOCK_DEVICES.find((d) => d.id === id);
}
