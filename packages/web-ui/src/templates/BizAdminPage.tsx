/*
 * BizAdminPage — B端后台页起步模板（生成器克隆源）
 * 新页面一律从本模板生成：scripts/new-page-react.js <PageName> [outputPath]
 * 一切视觉来自 @techmation/web-ui 真实组件 + globals.css token，禁止手写 HTML 重搓组件。
 */
import * as React from 'react';
import {
  AdminLayout, type NavItem, Card, CardHeader, CardContent, Button, Icon,
} from '@/index';

const nav: NavItem[] = [
  { key: 'm1', label: '菜单项一', icon: 'dashboard' },
  {
    key: 'm2', label: '菜单项二', icon: 'settings', children: [
      { key: 'm2-1', label: '子项 2-1', icon: 'machine' },
    ],
  },
];

export default function BizAdminPage() {
  const [selected, setSelected] = React.useState('m1');
  return (
    <AdminLayout title="页面标题" nav={nav} selectedKey={selected} onSelect={setSelected}>
      <div className="page-head">
        <div className="page-title">页面标题</div>
        <div className="page-actions">
          <Button><Icon name="refresh" size={16} />操作</Button>
        </div>
      </div>
      <Card>
        <CardHeader>卡片标题</CardHeader>
        <CardContent>
          <p className="t-body1">
            在此放置页面内容（表格 / 表单 / 图表），全部使用 @techmation/web-ui 真实组件。
          </p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
