/*
 * CncDashboard — B端设备运维控制台（React 版，真对齐 @techmation/web-ui）
 * 复刻原 cnc-dashboard HTML 的看板语义，但全部使用真实组件：AdminLayout / Card / Table / Tabs / StatusDot / Tag / Button / Icon。
 * 证明「生成页用真实组件库」端到端可行，且图标/按钮布局 bug 在根因层面已修复（currentColor + inline-flex）。
 */
import * as React from 'react';
import {
  AdminLayout, Icon, type NavItem, type IconName,
  Card, CardHeader, CardContent,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  Tabs, StatusDot, Tag, Button,
} from '@/index';

const nav: NavItem[] = [
  {
    key: 'ws1', label: '注塑车间', icon: 'factory', children: [
      { key: 'a01', label: 'A 线 · 注塑机 A-01', icon: 'machine' },
      { key: 'c07', label: 'B 线 · 机械手 C-07', icon: 'robot' },
    ],
  },
  {
    key: 'ws2', label: '装配车间', icon: 'settings', children: [
      { key: 'd02', label: '总装线 · 输送带 D-02', icon: 'bolt' },
    ],
  },
  { key: 'ov', label: '全局概览', icon: 'dashboard' },
];

const kpis: { key: string; label: string; value: string; icon: IconName; color: string; bg: string }[] = [
  { key: 'run', label: '在产设备', value: '12', icon: 'machine', color: 'var(--primary)', bg: 'var(--primary-dis-bg)' },
  { key: 'rate', label: '综合运行率', value: '87%', icon: 'chart', color: 'var(--run)', bg: 'var(--run-soft)' },
  { key: 'alert', label: '活动告警', value: '2', icon: 'alert', color: 'var(--warn)', bg: 'var(--warn-soft)' },
  { key: 'energy', label: '实时能耗', value: '4.2 MW', icon: 'bolt', color: 'var(--secondary)', bg: 'var(--n3)' },
];

const rows = [
  { dev: '注塑机 A-01', status: 'running' as const, statusText: '运行中', alert: null, load: '72%' },
  { dev: '机械手 C-07', status: 'warning' as const, statusText: '维护', alert: '温度过高', load: '—' },
  { dev: '输送带 D-02', status: 'running' as const, statusText: '运行中', alert: null, load: '55%' },
  { dev: '注塑机 A-03', status: 'error' as const, statusText: '故障', alert: '通讯中断', load: '—' },
];

export default function CncDashboard() {
  const [selected, setSelected] = React.useState('a01');
  return (
    <AdminLayout
      title="弘讯B端 · 设备运维控制台"
      nav={nav}
      selectedKey={selected}
      onSelect={setSelected}
      footer="弘讯B端视觉规范 · 基于 @techmation/web-ui（shadcn，33 件）· 生成真源 packages/web-ui"
    >
      <div className="page-head">
        <div className="page-title">设备实时监控</div>
        <div className="page-actions">
          <Button variant="secondary"><Icon name="refresh" size={16} />刷新</Button>
          <Button><Icon name="export" size={16} />导出报表</Button>
        </div>
      </div>

      <div className="stat-grid">
        {kpis.map((k) => (
          <Card key={k.key} className="stat-card--row">
            <span className="kpi-ico" style={{ color: k.color, background: k.bg }}>
              <Icon name={k.icon} size={20} />
            </span>
            <span className="stat-body">
              <span className="stat-num">{k.value}</span>
              <span className="stat-label">{k.label}</span>
            </span>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>设备状态总览</CardHeader>
        <CardContent>
          <Tabs
            defaultActiveKey="live"
            items={[
              { key: 'ov', label: '概览' },
              { key: 'live', label: '实时监控' },
              { key: 'his', label: '历史' },
            ]}
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>设备</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>告警</TableHead>
                <TableHead>负载</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.dev}>
                  <TableCell>{r.dev}</TableCell>
                  <TableCell><StatusDot status={r.status} label={r.statusText} /></TableCell>
                  <TableCell>
                    {r.alert ? <Tag variant="warning">{r.alert}</Tag> : <Tag variant="default">无</Tag>}
                  </TableCell>
                  <TableCell>{r.load}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
