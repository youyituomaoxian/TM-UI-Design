/*
 * demo/App.tsx — 11 组件开发预览（npm run dev）
 * 右上角切换 :root[data-theme=dark]（我方换色引擎轨，禁用 shadcn 原生 .dark）与密度三档。
 */
import * as React from 'react';
import {
  Button, Input, Select, DatePicker, Tree, Dialog,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  Tag, Tabs, Pagination, StatusDot
} from '../index';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="card">
    <div className="card-head">{title}</div>
    <div className="card-body">{children}</div>
  </div>
);

export default function App() {
  const [dark, setDark] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : '');
  }, [dark]);

  return (
    <div style={{ padding: 24, background: 'var(--bg-page)', minHeight: '100vh', fontFamily: 'var(--font-cn)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div className="t-h3" style={{ color: 'var(--text-1)' }}>@techmation/web-ui · 组件预览</div>
          <div className="t-body2" style={{ color: 'var(--text-2)' }}>vendored shadcn · tokens.json 唯一真源</div>
        </div>
        <Button variant="secondary" onClick={() => setDark(d => !d)}>{dark ? '☀ 亮色' : '🌙 暗色'}</Button>
      </div>

      <Section title="按钮 Button">
        <div className="row">
          <Button>主按钮</Button>
          <Button variant="secondary">次按钮</Button>
          <Button variant="text">文字按钮</Button>
          <Button size="lg">大按钮 40</Button>
          <Button size="sm" variant="secondary">小按钮 24</Button>
          <Button disabled>禁用</Button>
        </div>
      </Section>

      <Section title="输入 / 下拉 / 日期">
        <div className="row">
          <Input placeholder="请输入设备编号" />
          <Select
            defaultValue="all"
            options={[
              { value: 'all', label: '全部状态' },
              { value: 'run', label: '运行中' },
              { value: 'err', label: '故障' }
            ]}
          />
          <DatePicker defaultValue="2026-07-30" />
        </div>
      </Section>

      <Section title="树菜单 Tree（侧栏场景）">
        <div style={{ width: 240, background: 'var(--primary)', borderRadius: 'var(--radius-base)', padding: 8 }}>
          <Tree
            defaultSelectedKey="a01"
            data={[
              { key: 'ws1', label: '注塑车间', children: [
                { key: 'a01', label: 'A 线 · 注塑机 A-01' },
                { key: 'c07', label: 'B 线 · 机械手 C-07' }
              ]},
              { key: 'ws2', label: '装配车间', children: [{ key: 'd02', label: '总装线 · 输送带 D-02' }] }
            ]}
          />
        </div>
      </Section>

      <Section title="表格 Table + 标签 Tag + 状态点 StatusDot">
        <Table>
          <TableHeader>
            <TableRow><TableHead>设备</TableHead><TableHead>状态</TableHead><TableHead>告警</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>注塑机 A-01</TableCell>
              <TableCell><StatusDot status="running" label="运行中" /></TableCell>
              <TableCell><Tag variant="default">无</Tag></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>机械手 C-07</TableCell>
              <TableCell><StatusDot status="warning" label="维护" /></TableCell>
              <TableCell><Tag variant="warning">温度过高</Tag></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Section>

      <Section title="页签 Tabs + 分页 Pagination">
        <Tabs
          defaultActiveKey="live"
          items={[
            { key: 'ov', label: '概览' },
            { key: 'live', label: '实时监控' },
            { key: 'his', label: '历史' }
          ]}
        />
        <div style={{ marginTop: 16 }}>
          <Pagination total={27} pageSize={10} />
        </div>
      </Section>

      <Section title="弹窗 Dialog">
        <Button onClick={() => setDialogOpen(true)}>下发指令（打开弹窗）</Button>
        <Dialog
          open={dialogOpen}
          title="设备参数确认"
          onClose={() => setDialogOpen(false)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setDialogOpen(false)}>取消</Button>
              <Button onClick={() => setDialogOpen(false)}>确认下发</Button>
            </>
          }
        >
          确认将「注塑机 A-01」切换至自动模式？此操作将下发至现场控制器，执行后不可撤销。
        </Dialog>
      </Section>
    </div>
  );
}
