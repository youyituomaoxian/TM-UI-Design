# 登录页背景图资产 · 提示词模板 v3.2（2026-10-30）

> v3.2 变更：**撤销 v3.1 的硬留白量化**（实测生成效果差、画面被压平）；改为「**生成 4:3 → 裁 1:1**」；
> 交付时**同时给两份模板**：默认模板（带变量）+ 行业映射模板（变量已填）。
> 风格基准：用户提供的 diorama 提示词（抛光 3D 数字插画 / 建筑可视化 · 等距微缩立体场景）。

---

## 0. 默认图

| 文件 | 规格 | 用途 |
|---|---|---|
| `login-hero-default.webp` | 2160×2160，373KB | **默认背景**，页面 `src` 指向它 |
| `login-hero-default@1x.webp` | 1024×1024，92KB | 1x 档 |
| `login-hero-default.png` | 2160×2160 | 源文件（重新导出用，勿删） |

- 换图：覆盖同名 webp 即可，**不改 HTML**；1:1 素材 `object-position:50% 50%`。
- 边缘：**羽化 160**（`--login-hero-feather`，用户定稿）；要硬切改 0。
- 无图/离线：`.login-hero` 自带浅色径向底，不会出现破图。

---

## 1. 默认模板（带 `[变量]`，交付必给）

```text
[INTENT]. A brand hero visual for [DOMAIN] software.

A [MACHINE_SUBJECT] presented as a miniature high-tech facility. The main device is a sleek white
and pale-gray [DEVICE_FORM], with dark glass inspection windows, small blue indicator lights,
metallic fittings and a cylindrical component mounted on top. It sits above a glowing cyan-blue
[NETWORK_KIND] of tiny structures, channels and data pathways, suggesting [DOMAIN_MEANING].
Several translucent interface panels hover behind the machine, showing [PANEL_CONTENT].

A pristine, minimal, bright-white studio-like space with a smooth tiled or paneled floor and faint
geometric seams extending into the background. No people and no natural elements present. Subtle
luminous lines and delicate grid patterns surround the miniature installation, creating a clean
futuristic technology showcase with an airy, clinical atmosphere.

Polished 3D digital illustration or architectural visualization with a refined isometric miniature-
diorama aesthetic, blending [DOMAIN_STYLE] and holographic data visualization. The palette is
predominantly white, pearl gray and icy blue, accented by luminous cyan circuitry and restrained
darker details in the machine's glass panels. Surfaces are smooth, precise and lightly reflective,
with clean material rendering and a sleek, premium technology-advertising finish.

Soft, high-key studio illumination from above, with broad diffused highlights across the white
surfaces and very gentle shadows beneath the platform and equipment. Cyan-blue light glows from
the digital network and traces of the interface, adding subtle cool reflections without harsh
contrast. The overall lighting is clean, bright and ethereal.

A 4:3 image (2400x1800) in an elevated three-quarter isometric view, showing the entire miniature
platform and equipment from above with open white floor around it. The main machine anchors the
center, the luminous network spreads across the foreground, and the floating analytics panels form
a loose backdrop behind the device. Keep the composition balanced inside the central square so it
survives a 1:1 crop, and keep the outer edges calm with generous negative space.

NEGATIVE
No text, no letters, no numbers, no logos, no watermarks, no UI labels, no browser chrome, no
device frames, no screenshots, no people, no hands, no neon cyberpunk, no dark background, no
particles or smoke, no wide-angle distortion, no cheap plastic, no cartoon.
```

---

## 2. 行业映射表（变量取值）

| 行业 | `[DOMAIN]` | `[MACHINE_SUBJECT]` | `[DEVICE_FORM]` | `[NETWORK_KIND]` | `[DOMAIN_MEANING]` |
|---|---|---|---|---|---|
| 注塑机 / 智能工厂 | injection molding MES | compact injection molding machine | white machine with clamping unit, screw barrel and hopper | factory-floor layout | mold cycles, machine groups and production flow |
| 新能源 / 电池 | battery manufacturing MES | battery module assembly line | white modular line with stacked cells and busbars | process-flow lattice | cell stacking, welding and quality gates |
| 半导体 | semiconductor fab MES | wafer handling robot cell | white EFEM with load ports and a wafer cassette | wafer-scale grid | wafer lots, tool utilization and yield |
| 机加工 | machining MES | five-axis CNC machining center | white machining center with tool magazine | factory-floor layout | spindle load, tool life and machining orders |
| 3C / SMT | SMT production MES | SMT pick-and-place line | white line with feeders and a reflow tunnel | process-flow lattice | feeder status, placement throughput and first-pass yield |
| 医疗 / 实验室 | lab automation system | automated laboratory analysis instrument | white benchtop analyzer with sample carousel | circuit-board-like network | sample routing, assay runs and instrument uptime |
| 通用 / 平台 | industrial software platform | modular precision production cell | white cell with an articulated arm | circuit-board-like network | equipment connectivity, data pipelines and OEE |

固定项（不随行业变）：`[PANEL_CONTENT]` = `a doughnut chart with short list rows, a smooth area chart and a small kanban grid`；
`[DOMAIN_STYLE]` = `laboratory equipment, smart-factory design`。

---

## 3. 映射模板 · 注塑机（变量已填，可直接粘）

```text
A brand hero visual for injection molding MES software.

A compact injection molding machine presented as a miniature high-tech facility. The main device
is a sleek white and pale-gray machine with a clamping unit, screw barrel and hopper, dark glass
inspection windows, small blue indicator lights and metallic fittings, with a cylindrical hopper
mounted on top. It sits above a glowing cyan-blue factory-floor layout of tiny machine blocks,
channels and data pathways, suggesting mold cycles, machine groups and production flow. Several
translucent interface panels hover behind the machine, showing a doughnut chart with short list
rows, a smooth area chart and a small kanban grid.

A pristine, minimal, bright-white studio-like space with a smooth tiled or paneled floor and faint
geometric seams extending into the background. No people and no natural elements present. Subtle
luminous lines and delicate grid patterns surround the miniature installation, creating a clean
futuristic technology showcase with an airy, clinical atmosphere.

Polished 3D digital illustration or architectural visualization with a refined isometric miniature-
diorama aesthetic, blending injection molding equipment and smart-factory design with holographic
data visualization. The palette is predominantly white, pearl gray and icy blue, accented by
luminous cyan circuitry and restrained darker details in the machine's glass panels. Surfaces are
smooth, precise and lightly reflective, with clean material rendering and a sleek, premium
technology-advertising finish.

Soft, high-key studio illumination from above, with broad diffused highlights across the white
surfaces and very gentle shadows beneath the platform and equipment. Cyan-blue light glows from
the digital network and traces of the interface, adding subtle cool reflections without harsh
contrast. The overall lighting is clean, bright and ethereal.

A 4:3 image (2400x1800) in an elevated three-quarter isometric view, showing the entire miniature
platform and equipment from above with open white floor around it. The machine anchors the center,
the luminous factory network spreads across the foreground, and the floating analytics panels form
a loose backdrop behind the device. Keep the composition balanced inside the central square so it
survives a 1:1 crop, and keep the outer edges calm with generous negative space.

NEGATIVE
No text, no letters, no numbers, no logos, no watermarks, no UI labels, no browser chrome, no
device frames, no screenshots, no people, no hands, no neon cyberpunk, no dark background, no
particles or smoke, no wide-angle distortion, no cheap plastic, no cartoon.
```

**短版**（限长模型，约 600 字符）：

```text
Brand hero for an injection molding MES. Polished 3D diorama: a sleek white injection molding
machine (clamping unit, barrel, hopper, dark glass) on a miniature white platform, above a glowing
cyan factory-floor layout of machine blocks and data paths. Translucent analytics panels (doughnut,
area chart, kanban) float behind, no text. Pristine white studio, tiled floor, faint seams, no
people. Palette white / pearl gray / icy blue + cyan glow; soft high-key light from above, gentle
shadows, ethereal. Isometric three-quarter, whole platform visible with open white floor around it.
4:3, 2400x1800 (crop to 1:1). No text, logos, people, neon, dark background.
```

---

## 4. 交付规则（用户给了行业/功能时，两份都要给）

用户提供行业、功能等信息后，交付登录页时必须**同时输出**：

| # | 内容 | 作用 |
|---|---|---|
| A | **默认模板**（§1，保留 `[变量]`） | 让用户看清结构与可调项，后续可自行微调 |
| B | **映射模板**（§3 或按 §2 表填充） | 变量已按行业/功能填好，可直接粘去生成 |
| C | **生成建议**（一句话） | `建议先生成 4:3（2400×1800），再裁成 1:1；裁剪时保留主体，右侧留白给登录卡。` |

落盘位置：`output/<项目>/<页面>-hero-prompt.md`，同时贴在对话里。缺 A 或缺 B 都算交付不完整。

---

## 5. 模型后缀与「出特写」的急救

- **即梦 / 可灵**：整段贴；末尾加 `C4D 渲染, OC 渲染, 商业产品摄影, 等距视角, 8K`。
- **GPT Image**：构图段加 `the outer edges of the frame stay open white`；负向段首行加 `Absolutely no text anywhere.`
- **Midjourney**：压成逗号串，参数 `--ar 4:3 --style raw --no text, logo, people, neon, dark background`。

**还是出特写时**（按成本从低到高）：

1. 把 4:3 改成 16:9 再裁 —— 宽幅天然压制特写。
2. 构图段加一句 `the camera is far enough that the whole platform fits with open floor around it`。
3. 删掉细节级形容词（micro-detail、intricate、detailed texture）。
4. 首尾各贴一次 `wide establishing shot, not a close-up`。

---

## 6. 资产准入

| 检查 | 谁判 | 标准 |
|---|---|---|
| 尺寸/比例 | 脚本 | 裁后 **2400×2400（1:1）** ±1% |
| 体积 | 脚本 | WebP ≤400KB |
| 留白 | 脚本 | 右 30% 区域亮度方差低、无高对比结构 |
| 主色比 | 脚本 | 白 ≥60%，cyan/品牌蓝光 5–12%，纯黑 <3% |
| 文字/水印/人脸 | 人（OCR 辅助） | 有则弃用 |
| 品牌气质 | **只能人** | 是否“精密”、蓝是否偏青紫、有无廉价塑料感 |

## 7. manifest

```json
{
  "file": "login-hero-default.webp",
  "prompt_version": "v3.2",
  "model": "jimeng-4.0",
  "seed": 123456,
  "generated_ratio": "4:3",
  "cropped_to": "1:1",
  "size": "2400x2400",
  "industry": "injection-molding",
  "generated_at": "2026-10-30",
  "approved_by": "用户",
  "license": "自有生成物"
}
```

## 8. 替换契约

1. 文件名固定 `login-hero-default.webp` / `login-hero-default@1x.webp`，**换图不改 HTML**。
2. 页面 `<img alt="">` + 父级 `aria-hidden="true"`（纯装饰）；`object-fit:cover` + `object-position:50% 50%`。
3. 生成物默认“候选”，人工确认后才进本目录。
