/*
 * Chart — 图表容器原语（定高 .chart-box + 占满 .chart-canvas）。
 * 零依赖：不绑定 ECharts 等库，canvas 由业务页自行初始化。
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ChartBoxProps extends React.HTMLAttributes<HTMLDivElement> {}
const ChartBox = React.forwardRef<HTMLDivElement, ChartBoxProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('chart-box', className)} {...props} />
));
ChartBox.displayName = 'ChartBox';

export interface ChartCanvasProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {}
const ChartCanvas = React.forwardRef<HTMLCanvasElement, ChartCanvasProps>(({ className, ...props }, ref) => (
  <canvas ref={ref} className={cn('chart-canvas', className)} {...props} />
));
ChartCanvas.displayName = 'ChartCanvas';

export { ChartBox, ChartCanvas };
