# @techmation/web-ui — 弘讯B端 Web 组件库（W1 修订版 v2）

vendored shadcn 风格组件库。**唯一真源 = `弘讯web端design-system/tokens.json`**（12 级字阶 + 双层 elevation + motion 4 档 + density 三档 + dark 顶层节），本包只做「真源 → 可 import 组件」的投影，不复制任何设计决策。

## W1v2 纠偏（相对 v1）

- **① 解除 `components.json` 依赖**：v1 仅 vendored 原 11 组件以对齐 `弘讯web端design-system/components.json` 契约。v2 改为**全量 vendored shadcn 组件集**（表单 / 选择 / 展示 / 反馈 / 弹出等 33 组件），组件只消费 `tokens.json` 派生 CSS 变量，不再直接引用旧 11 组件契约。
- **② 暗色禁用 `.dark` 类**：v1 暗色走 shadcn 原生 `.dark` 类。v2 改为我方换色引擎驱动的 `:root[data-theme="dark"]`，与 `page-template.html` 机制一致。**边界：暗色不得回退到 `.dark` 类实现**（validate-static 规则① 会拦截 `.dark` 承载颜色）。

## 目录

```
packages/web-ui/
├── package.json / vite.config.ts / tsconfig.json / tailwind.config.ts
├── sha256-baseline.json          # 任务0 冻结的旧生成流水线 5 文件指纹
├── index.html                    # vite dev 入口（npm run dev 预览组件）
├── scripts/
│   ├── freeze-baseline.js        # （一次性）生成 sha256-baseline.json
│   ├── map-tokens.js             # tokens.json → src/styles/globals.css（:root 亮 + :root[data-theme="dark"] 暗，引擎驱动）
│   ├── export-static.js          # 全量组件默认态 → dist-static/ 3 样例页（无 React 运行时）
│   └── validate-static.js        # 门禁：①硬编码色/禁.dark ②字阶白名单 ③间距4倍数 ④sha256 ⑤暗色逐键=引擎
├── src/
│   ├── index.ts                  # 组件统一出口（33 组件）
│   ├── lib/utils.ts              # cn()（离线极简版，无 clsx/tailwind-merge 依赖）
│   ├── styles/
│   │   ├── globals.css           # 生成物（map-tokens.js），勿手改
│   │   └── components.css        # 组件参考样式单一真源（契约类名 1:1，React 与静态导出共用）
│   ├── components/ui/            # 全量 vendored shadcn 组件（radix-free 离线实现）
│   └── demo/                     # dev 预览页
└── dist-static/                  # 生成物（export-static.js），勿手改
    ├── sample-default-light.html # 默认品牌亮色
    ├── sample-brand-2E7D5B.html  # 品牌换肤（primary 系=brand-color-engine 推导）
    └── sample-dark.html          # 暗色（[data-theme="dark"]，值=引擎 dark 快照）
```

## 组件清单（全量 vendored，不绑 components.json）

> 组件仅消费 `tokens.json` 派生 CSS 变量，契约类名在 `components.css` 中集中定义，React 与静态导出共用。

| 分组 | 导出名 | 契约类名 |
|---|---|---|
| 基础输入 | `Button` `Input` `Textarea` `Label` | `.btn` `.input` `.textarea` `.label` |
| 选择/表单 | `Checkbox` `Radio` `Switch` `Slider` `Toggle` | `.checkbox` `.radio` `.switch` `.slider` `.toggle` |
| 选择器 | `Select` `DatePicker` `Tree` `DropdownMenu` `Popover` | `.sel*` `.dp*` `.tree*` `.dropdown*` `.popover-content` |
| 展示/容器 | `Card` `Badge` `Avatar` `Table` `Tag` `Tabs` `Pagination` `StatusDot` `Progress` `Skeleton` `Separator` | `.card*` `.badge` `.avatar` `.table` `.tag` `.tabs*` `.pager*` `.status-dot*` `.progress*` `.skeleton` `.separator*` |
| 反馈/弹出 | `Accordion` `Alert` `Dialog` `AlertDialog` `Sheet` `Tooltip` `Breadcrumb` `Spinner` | `.accordion*` `.alert*` `.modal*` `.alert-dialog*` `.sheet*` `.tooltip*` `.breadcrumb*` `.spinner` |

完整导出（含类型）见 `src/index.ts`。

## 消费方式

```tsx
import '@techmation/web-ui/src/styles/globals.css';    // token 变量层（含 :root[data-theme="dark"]）
import '@techmation/web-ui/src/styles/components.css'; // 组件参考样式
import { Button, Card, Badge, StatusDot } from '@techmation/web-ui';
```

- **暗色**：`<html data-theme="dark">` 或任意容器加 `[data-theme="dark"]`（换色引擎驱动；`globals.css` 的 `:root[data-theme="dark"]` 块值 = `generatePalette('#005EAE',{mode:'dark',platform:'web'})`）。**禁用 shadcn 原生 `.dark` 类**。
- **密度**：`:root[data-density="compact|comfortable|spacious"]` 或容器类 `.density-*`。
- **品牌换肤**：`node scripts/map-tokens.js --brand '#2E7D5B' --out <目标css>`（primary 系走 brand-color-engine 亮色推导；中性/功能色为引擎不变式，不随品牌变）。
- **改 token**：改 `弘讯web端design-system/tokens.json` → 重跑 `npm run map-tokens && npm run export-static`。**禁止手改 globals.css / dist-static**。

## 验收命令（明卷）

```bash
node packages/web-ui/scripts/validate-static.js          # 五门禁 0 HIGH → exit 0（含⑤暗色块逐键=引擎）
node packages/web-ui/scripts/export-static.js            # 重新导出 3 样例页
node 弘讯web端design-system/validate-spec.js packages/web-ui/dist-static/sample-default-light.html
node 弘讯web端design-system/validate-spec.js packages/web-ui/dist-static/sample-brand-2E7D5B.html
node 弘讯web端design-system/validate-spec.js packages/web-ui/dist-static/sample-dark.html
```

**反向验证（红 → 绿）**：删 `:root[data-theme="dark"]` 块 → exit 1（规则⑤）；注入 `.hack{color:#ABCDEF}` → exit 1（规则①）；还原 → exit 0。

## 迁移说明（手写 HTML → 组件库）

1. **同事写页面**：不再从 page-template.html 手抄组件 CSS。React 项目直接 import 组件；非 React 场景复制 `dist-static/sample-*.html` 的 `<style>`（globals + components 已内联、无注释、过双门禁）。
2. **生成器/Agent**：克隆源仍可用 page-template.html（旧轨不动）；新轨用 `export-static.js` 的 SECTIONS 模板拼页，产物天然过 validate-spec。
3. **旧线不动**：`tokens.json / components.json / validate-spec.js / page-template.html / generate-design-tokens-md.js` 5 文件指纹被 `sha256-baseline.json` 冻结，validate-static 每跑必校验。
4. **shadcn 说明**：离线约束下组件为 radix-free 的 shadcn 风格 vendored 实现（forwardRef + variant props + cn()），无 npx 在线拉取，`npm install` 后 `npm run dev` 即可预览、`npm run build` 可构建。

## W1 已知边界

- 组件覆盖默认态 + 常用变体；复杂交互态（datepicker 日历面板、tree 异步加载等）留待 W1.x 迭代。
- Tailwind 主题扩展已对齐 tokens（`darkMode: ['selector','[data-theme="dark"]']`，类名可用），但 components.css 才是契约样式真源；用 Tailwind 工具类拼页时仍须过 validate-static。
- 间距门禁的「参考模板遗留白名单」（如 tag 横向 padding 10px、status-dot gap 6px）动态采集自冻结的 page-template.html，旧线改动会自动失效并报警。
