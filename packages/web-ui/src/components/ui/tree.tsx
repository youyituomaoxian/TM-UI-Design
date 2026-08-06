/*
 * Tree — 作业树 / 二级菜单（弘讯B端适配，radix-free 离线实现）
 * 节点高32；默认深色（主色底侧栏白字场景），light 变体供内容区亮底使用。
 * a11y: 节点 role=treeitem + aria-expanded/level；roving tabindex；方向键展开/收起/移动焦点；Enter 选中叶子。
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TreeNodeData {
  key: string;
  label: React.ReactNode;
  children?: TreeNodeData[];
}

export interface TreeProps {
  data: TreeNodeData[];
  selectedKey?: string;
  defaultSelectedKey?: string;
  onSelect?: (key: string) => void;
  variant?: 'sidebar' | 'light';
  className?: string;
}

interface FlatNode {
  key: string;
  depth: number;
  hasChildren: boolean;
}

/** 仅展平「可见」节点（折叠分支跳过）——键盘导航必须基于可见列表，否则 ArrowDown 会命中隐藏节点 */
const flattenVisible = (data: TreeNodeData[], expandedKeys: Set<string>, depth: number, out: FlatNode[]): FlatNode[] => {
  for (const n of data) {
    out.push({ key: n.key, depth, hasChildren: !!n.children?.length });
    if (n.children?.length && expandedKeys.has(n.key)) flattenVisible(n.children, expandedKeys, depth + 1, out);
  }
  return out;
};

const Tree: React.FC<TreeProps> = ({ data, selectedKey, defaultSelectedKey, onSelect, variant = 'sidebar', className }) => {
  const [inner, setInner] = React.useState(defaultSelectedKey);
  const [expandedKeys, setExpandedKeys] = React.useState<Set<string>>(
    () => new Set(data.filter(n => n.children?.length).map(n => n.key))
  );
  const sel = selectedKey !== undefined ? selectedKey : inner;
  const visible = React.useMemo(() => flattenVisible(data, expandedKeys, 0, []), [data, expandedKeys]);

  const handleSelect = (k: string) => {
    setInner(k);
    onSelect?.(k);
  };

  const toggleNode = (key: string, hasChildren: boolean) => {
    if (!hasChildren) return;
    setExpandedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const findNextNode = (dir: 1 | -1, fromIdx: number): string | undefined => {
    const next = visible[fromIdx + dir];
    return next ? next.key : undefined;
  };

  const renderNode = (node: TreeNodeData, depth: number): React.ReactNode => {
    const hasChildren = !!node.children?.length;
    const isOpen = expandedKeys.has(node.key);
    return (
      <div
        key={node.key}
        role="treeitem"
        aria-expanded={hasChildren ? isOpen : undefined}
        aria-level={depth + 1}
        aria-selected={sel === node.key}
        tabIndex={sel === node.key ? 0 : -1}
        className={cn('tree-node', sel === node.key && 'on')}
        style={depth > 0 ? { paddingLeft: 8 + depth * 16 } : undefined}
        onClick={() => {
          if (hasChildren) toggleNode(node.key, true);
          else handleSelect(node.key);
        }}
        onKeyDown={(e) => {
          const idx = visible.findIndex(f => f.key === node.key);
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (hasChildren) {
              toggleNode(node.key, true);
            } else {
              handleSelect(node.key);
            }
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            if (hasChildren && !isOpen) {
              toggleNode(node.key, true);
            } else {
              const next = findNextNode(1, idx);
              if (next) handleSelect(next);
            }
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            if (hasChildren && isOpen) {
              toggleNode(node.key, false);
            }
          } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const next = findNextNode(e.key === 'ArrowDown' ? 1 : -1, idx);
            if (next) handleSelect(next);
          } else if (e.key === 'Home') {
            e.preventDefault();
            if (visible[0]) handleSelect(visible[0].key);
          } else if (e.key === 'End') {
            e.preventDefault();
            if (visible[visible.length - 1]) handleSelect(visible[visible.length - 1].key);
          }
        }}
      >
        <span className="tree-sw" aria-hidden>{hasChildren ? (isOpen ? '▾' : '▸') : ''}</span>
        <span className="tree-label">{node.label}</span>
      </div>
    );
  };

  const walk = (nodes: TreeNodeData[], depth: number): React.ReactNode[] =>
    nodes.map(n => [
      renderNode(n, depth),
      ...(n.children?.length && expandedKeys.has(n.key) ? walk(n.children, depth + 1) : []),
    ]);

  return (
    <div className={cn('tree', variant === 'light' && 'tree-light', className)} role="tree">
      {walk(data, 0)}
    </div>
  );
};

export { Tree };
