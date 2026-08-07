#!/usr/bin/env python3
"""wcag-contrast-calc.py — WCAG 对比度计算工具（GAP-01 修复 2026-08-07）。

独立可用：python scripts/wcag-contrast-calc.py <前景色> <背景色>
颜色格式：hex（#RRGGBB / #RGB）或 rgb(r,g,b)。

输出：对比度比值 + WCAG 达标判定（正文 4.5:1 / 大字号与 UI 组件 3:1）。
设计系统内 validate-spec.js 已有 checkWcagContrast 内建检查，本脚本供人工/独立校验使用。
"""
import re
import sys


def parse_color(s):
    s = s.strip().lower()
    m = re.fullmatch(r'#?([0-9a-f]{6})', s)
    if m:
        h = m.group(1)
        return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))
    m = re.fullmatch(r'#?([0-9a-f]{3})', s)
    if m:
        h = m.group(1)
        return tuple(int(c * 2, 16) for c in h)
    m = re.fullmatch(r'rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)', s)
    if m:
        return tuple(int(x) for x in m.groups())
    raise ValueError(f'无法解析颜色: {s}')


def _linear(c):
    c /= 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def luminance(rgb):
    r, g, b = (_linear(x) for x in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(fg, bg):
    l1, l2 = luminance(fg), luminance(bg)
    hi, lo = max(l1, l2), min(l1, l2)
    return (hi + 0.05) / (lo + 0.05)


def main():
    if len(sys.argv) < 3:
        print('用法: python wcag-contrast-calc.py <前景色> <背景色>')
        print('示例: python wcag-contrast-calc.py #334155 #FFFFFF')
        sys.exit(1)
    fg, bg = parse_color(sys.argv[1]), parse_color(sys.argv[2])
    ratio = contrast(fg, bg)
    print(f'对比度: {ratio:.2f}:1')
    print(f'正文文本 (>=4.5:1): {"PASS" if ratio >= 4.5 else "FAIL"}')
    print(f'大字号/UI 组件 (>=3:1): {"PASS" if ratio >= 3 else "FAIL"}')


if __name__ == '__main__':
    main()
