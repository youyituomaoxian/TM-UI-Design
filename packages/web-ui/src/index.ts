/*
 * @techmation/web-ui — 弘讯B端 Web 组件库统一出口
 *
 * W1v2 修订版：全量 vendored shadcn 组件，重写适配我方 tokens.json 规范。
 * - 已解除对 弘讯web端design-system/components.json 的依赖（见任务 brief 纠偏点①）
 *   组件仅消费 tokens.json 派生 CSS 变量，不直接引用旧 11 组件契约。
 * - 暗色走我方换色引擎驱动的 [data-theme="dark"]（见纠偏点②），
 *   禁用 shadcn 原生 .dark 类。
 *
 * 消费方式：
 *   import '@techmation/web-ui/src/styles/globals.css';    // token 变量层（map-tokens.js 生成，含 [data-theme="dark"]）
 *   import '@techmation/web-ui/src/styles/components.css'; // 组件参考样式（契约类名）
 *   import '@techmation/web-ui/src/styles/framework.css';  // B端后台固定框架外壳（AdminLayout 消费；含 --text-on-brand 暗色覆盖）
 *   import '@techmation/web-ui/src/styles/utilities.css';  // 布局工具 / KPI / 图表原语（.stat-*、.kpi-ico、.grid12 等）
 *   import { Button, Tag, Card, Badge } from '@techmation/web-ui';
 * 暗色：<html data-theme="dark"> 或任意容器加 [data-theme="dark"]（引擎驱动轨）。
 */

// ===== 基础输入 / 表单 =====
export { Button } from './components/ui/button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/ui/button';
export { Input } from './components/ui/input';
export type { InputProps } from './components/ui/input';
export { Textarea } from './components/ui/textarea';
export type { TextareaProps } from './components/ui/textarea';
export { Label } from './components/ui/label';
export type { LabelProps } from './components/ui/label';
export { Checkbox, CheckboxWrap } from './components/ui/checkbox';
export type { CheckboxProps, CheckboxWrapProps } from './components/ui/checkbox';
export { Radio, RadioGroup } from './components/ui/radio';
export type { RadioProps, RadioGroupProps } from './components/ui/radio';
export { Switch } from './components/ui/switch';
export type { SwitchProps } from './components/ui/switch';
export { Slider } from './components/ui/slider';
export type { SliderProps } from './components/ui/slider';
export { Toggle } from './components/ui/toggle';
export type { ToggleProps } from './components/ui/toggle';

// ===== 选择 / 数据录入 =====
export { Select } from './components/ui/select';
export type { SelectProps, SelectOption } from './components/ui/select';
export { DatePicker } from './components/ui/date-picker';
export type { DatePickerProps } from './components/ui/date-picker';
export { Tree } from './components/ui/tree';
export type { TreeProps, TreeNodeData } from './components/ui/tree';
export { DropdownMenu, DropdownTrigger, DropdownContent, DropdownItem, DropdownSep } from './components/ui/dropdown-menu';
export type { DropdownMenuProps, DropdownTriggerProps, DropdownContentProps, DropdownItemProps, DropdownSepProps } from './components/ui/dropdown-menu';
export { Popover, PopoverTrigger, PopoverContent } from './components/ui/popover';
export type { PopoverProps, PopoverTriggerProps, PopoverContentProps } from './components/ui/popover';

// ===== 展示 / 容器 =====
export { Card, CardHeader, CardTitle, CardContent, CardFooter } from './components/ui/card';
export type { CardProps, CardHeaderProps, CardTitleProps, CardContentProps, CardFooterProps } from './components/ui/card';
export { Badge } from './components/ui/badge';
export type { BadgeVariant, BadgeProps } from './components/ui/badge';
export { Avatar } from './components/ui/avatar';
export type { AvatarSize, AvatarProps } from './components/ui/avatar';
export { Table, TableWrap, TableHeader, TableBody, TableRow, TableHead, TableCell } from './components/ui/table';
export { ChartBox, ChartCanvas } from './components/ui/chart';
export type { ChartBoxProps, ChartCanvasProps } from './components/ui/chart';
export { Tag } from './components/ui/tag';
export type { TagProps, TagVariant } from './components/ui/tag';
export { Tabs } from './components/ui/tabs';
export type { TabsProps, TabItem } from './components/ui/tabs';
export { Pagination } from './components/ui/pagination';
export type { PaginationProps } from './components/ui/pagination';
export { StatusDot } from './components/ui/status-dot';
export type { StatusDotProps, StatusDotStatus } from './components/ui/status-dot';
export { Progress } from './components/ui/progress';
export type { ProgressProps } from './components/ui/progress';
export { Skeleton } from './components/ui/skeleton';
export type { SkeletonProps } from './components/ui/skeleton';
export { Separator } from './components/ui/separator';
export type { SeparatorProps } from './components/ui/separator';

// ===== 反馈 / 弹出 =====
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './components/ui/accordion';
export type { AccordionProps, AccordionItemProps, AccordionTriggerProps, AccordionContentProps } from './components/ui/accordion';
export { Alert, AlertTitle, AlertDesc, AlertIcon } from './components/ui/alert';
export type { AlertVariant, AlertProps, AlertTitleProps, AlertDescProps, AlertIconProps } from './components/ui/alert';
export { Dialog } from './components/ui/dialog';
export type { DialogProps } from './components/ui/dialog';
export { AlertDialog, AlertDialogHead, AlertDialogBody, AlertDialogFoot } from './components/ui/alert-dialog';
export type { AlertDialogProps, AlertDialogHeadProps, AlertDialogBodyProps, AlertDialogFootProps } from './components/ui/alert-dialog';
export { Sheet, SheetHead } from './components/ui/sheet';
export type { SheetSide, SheetProps, SheetHeadProps } from './components/ui/sheet';
export { Tooltip } from './components/ui/tooltip';
export type { TooltipProps } from './components/ui/tooltip';
export { Breadcrumb, BreadcrumbItem, BreadcrumbSep } from './components/ui/breadcrumb';
export type { BreadcrumbProps, BreadcrumbItemProps, BreadcrumbSepProps } from './components/ui/breadcrumb';
export { Spinner } from './components/ui/spinner';
export type { SpinnerProps } from './components/ui/spinner';

export { cn } from './lib/utils';

// ===== B端后台固定框架（布局外壳 + 图标） =====
export { AdminLayout } from './components/layout/AdminLayout';
export type { AdminLayoutProps, NavItem } from './components/layout/AdminLayout';
export { Icon } from './components/layout/icons';
export type { IconName, IconProps } from './components/layout/icons';
