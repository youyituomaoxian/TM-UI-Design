/*
 * tailwind.config.ts — 任务3：Tailwind 主题扩展对齐 tokens
 * 全部值指向 globals.css 短名 CSS 变量（真源 tokens.json → map-tokens.js 生成），
 * Tailwind 层零硬编码色；字阶 12 级 / 半径 / 间距(4倍数) / 阴影 / elevation / motion 1:1。
 * 暗色：darkMode=['selector','[data-theme="dark"]']（我方换色引擎驱动的 data-theme 轨，弃 shadcn 原生 .dark 类，W1v2 纠偏）。
 */
import type { Config } from 'tailwindcss';

export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          active: 'var(--primary-active)',
          'dis-bg': 'var(--primary-dis-bg)',
          'dis-fg': 'var(--primary-dis-fg)'
        },
        'brand-surface': 'var(--brand-surface)',
        secondary: {
          DEFAULT: 'var(--secondary)',
          hover: 'var(--secondary-hover)',
          active: 'var(--secondary-active)'
        },
        n1: 'var(--n1)', n2: 'var(--n2)', n3: 'var(--n3)', n4: 'var(--n4)',
        n5: 'var(--n5)', n6: 'var(--n6)', n7: 'var(--n7)', n8: 'var(--n8)',
        n9: 'var(--n9)', n10: 'var(--n10)', n11: 'var(--n11)',
        suc: { DEFAULT: 'var(--suc)', soft: 'var(--suc-soft)', fg: 'var(--suc-fg)' },
        warn: { DEFAULT: 'var(--warn)', soft: 'var(--warn-soft)', fg: 'var(--warn-fg)' },
        err: { DEFAULT: 'var(--err)', soft: 'var(--err-soft)', fg: 'var(--err-fg)' },
        run: { DEFAULT: 'var(--run)', soft: 'var(--run-soft)', fg: 'var(--run-fg)' }
      },
      borderRadius: {
        sm: 'var(--radius-sm)',      /* 2px */
        DEFAULT: 'var(--radius-base)', /* 4px */
        md: 'var(--radius-md)',      /* 8px */
        lg: 'var(--radius-lg)',      /* 16px */
        round: 'var(--radius-round)' /* 999px */
      },
      spacing: {
        /* tokens.spacing（全部 4 倍数） */
        xs: 'var(--space-xs)',   /* 4px */
        sm: 'var(--space-sm)',   /* 8px */
        md: 'var(--space-md)',   /* 12px */
        base: 'var(--space-base)', /* 16px */
        lg: 'var(--space-lg)',   /* 24px */
        xl: 'var(--space-xl)',   /* 32px */
        xxl: 'var(--space-xxl)'  /* 48px */
      },
      fontSize: {
        /* 字阶 12 级硬切换（tokens.json.font.scale / contract type.* 1:1） */
        display: ['32px', { lineHeight: '40px', fontWeight: '500' }],
        h1: ['28px', { lineHeight: '36px', fontWeight: '500' }],
        h2: ['24px', { lineHeight: '32px', fontWeight: '500' }],
        h3: ['20px', { lineHeight: '28px', fontWeight: '500' }],
        h4: ['18px', { lineHeight: '26px', fontWeight: '500' }],
        h5: ['16px', { lineHeight: '24px', fontWeight: '500' }],
        body1: ['14px', { lineHeight: '22px', fontWeight: '400' }],
        body2: ['13px', { lineHeight: '20px', fontWeight: '400' }],
        caption: ['12px', { lineHeight: '16px', fontWeight: '400' }],
        label: ['12px', { lineHeight: '16px', fontWeight: '500' }],
        overline: ['11px', { lineHeight: '16px', fontWeight: '500' }],
        link: ['14px', { lineHeight: '22px', fontWeight: '400' }]
      },
      fontFamily: {
        cn: 'var(--font-cn)',
        en: 'var(--font-en)',
        mono: 'var(--font-mono)'
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        modal: 'var(--shadow-modal)',
        float: 'var(--shadow-float)',
        'row-hover': 'var(--shadow-row-hover)',
        'elev-raised': 'var(--elev-raised-shadow)',
        'elev-overlay': 'var(--elev-overlay-shadow)',
        'elev-overflow': 'var(--elev-overflow-shadow)'
      },
      backgroundColor: {
        'elev-sunken': 'var(--elev-sunken-surface)',
        'elev-default': 'var(--elev-default-surface)',
        'elev-raised': 'var(--elev-raised-surface)',
        'elev-overlay': 'var(--elev-overlay-surface)',
        'elev-overflow': 'var(--elev-overflow-surface)',
        page: 'var(--bg-page)',
        surface: 'var(--bg-surface)',
        elevated: 'var(--bg-elevated)'
      },
      transitionDuration: {
        instant: '100ms',
        fast: '200ms',
        normal: '300ms',
        slow: '400ms'
      },
      transitionTimingFunction: {
        'in-out': 'cubic-bezier(0.645, 0.045, 0.355, 1)',
        out: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
        'out-quint': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'in-out-circ': 'cubic-bezier(0.78, 0.14, 0.15, 0.86)',
        'out-circ': 'cubic-bezier(0.08, 0.82, 0.17, 1)'
      }
    }
  },
  plugins: []
} satisfies Config;
