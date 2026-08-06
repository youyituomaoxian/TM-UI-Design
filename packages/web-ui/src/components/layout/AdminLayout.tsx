/*
 * AdminLayout — 弘讯B端后台固定框架（React 版，对齐 framework.css 单一真源）
 * 四维结构：顶栏72(品牌蓝白字) / 侧栏240可折叠80(作业树带图标) / 内容区自适应 / 底栏32(居中)。
 * 框架维度全部走 globals.css token（--topbar-height / --sidebar-width 等），见 framework.css。
 * 已按 Ardot 画板 701545559030003 #19:3578 校准（2026-08-01）：侧栏高 1008px。
 */
import * as React from 'react';
import { Tree, type TreeProps } from '@/components/ui/tree';
import { cn } from '@/lib/utils';
import { Icon, type IconName } from './icons';
import '@/styles/framework.css';

export interface NavItem {
  key: string;
  label: string;
  icon?: IconName;
  children?: NavItem[];
}

export interface AdminLayoutProps {
  /** 平台名称（大字） */
  title?: string;
  /** 平台副标题（小字，如「弘讯科技智能工厂管理系统」） */
  subtitle?: string;
  nav: NavItem[];
  selectedKey?: string;
  onSelect?: (key: string) => void;
  footer?: string;
  /** 当前用户名 */
  userName?: string;
  /** 顶栏右侧操作回调 */
  onHome?: () => void;
  onChangePassword?: () => void;
  onLogout?: () => void;
  onFullscreen?: () => void;
  /** 顶栏右侧自定义内容（用户/通知等） */
  topbarRight?: React.ReactNode;
  children?: React.ReactNode;
}

const toTreeData = (nav: NavItem[]): TreeProps['data'] =>
  nav.map((n) => ({
    key: n.key,
    label: (
      <>
        {n.icon && (
          <span className="tree-ico">
            <Icon name={n.icon} size={16} />
          </span>
        )}
        <span className="tree-text">{n.label}</span>
      </>
    ),
    children: n.children ? toTreeData(n.children) : undefined,
  }));

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  title = '弘讯B端视觉规范',
  subtitle,
  nav,
  selectedKey,
  onSelect,
  footer,
  userName,
  onHome,
  onChangePassword,
  onLogout,
  onFullscreen,
  topbarRight,
  children,
}) => {
  const [collapsed, setCollapsed] = React.useState(false);
  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-brand">
          <span className="topbar-logo">
            <Icon name="logo" size={32} />
          </span>
          <div className="topbar-titles">
            <span className="topbar-title">{title}</span>
            {subtitle && <span className="topbar-subtitle">{subtitle}</span>}
          </div>
        </div>
        <div className="topbar-right">
          {topbarRight}
          <span className="topbar-item" onClick={onHome}>
            <Icon name="home" size={16} />首页
          </span>
          {userName && (
            <>
              <span className="topbar-sep" />
              <span className="topbar-item">
                <Icon name="user" size={16} />{userName}
              </span>
            </>
          )}
          <span className="topbar-sep" />
          <button className="topbar-item" onClick={onChangePassword} aria-label="修改密码">
            <Icon name="edit" size={16} />
          </button>
          <button className="topbar-item" onClick={onLogout} aria-label="退出登录">
            <Icon name="logout" size={16} />
          </button>
          <button className="topbar-item" onClick={onFullscreen} aria-label="全屏">
            <Icon name="fullscreen" size={16} />
          </button>
        </div>
      </header>

      <div className="body">
        <aside className={cn('sidebar', collapsed && 'collapsed')}>
          <Tree
            variant="sidebar"
            selectedKey={selectedKey}
            onSelect={onSelect}
            data={toTreeData(nav)}
          />
          <div className="sidebar-foot">
            <button
              className="collapse-btn"
              onClick={() => setCollapsed((c) => !c)}
              title={collapsed ? '展开侧栏' : '收起侧栏'}
              aria-label={collapsed ? '展开侧栏' : '收起侧栏'}
              aria-expanded={!collapsed}
            >
              <Icon name="panelLeft" size={18} />
            </button>
          </div>
        </aside>
        <div className="main">
          <main className="content">{children}</main>
          <footer className="footer">
            {footer ||
              '弘讯B端视觉规范 · 基于 @techmation/web-ui（shadcn，33 件）· 生成真源 packages/web-ui'}
          </footer>
        </div>
      </div>
    </div>
  );
};
