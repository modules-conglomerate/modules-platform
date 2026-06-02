
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'moduli-bg':      '#0A0A0F',
        'moduli-surface': '#12121A',
        'moduli-border':  '#1E1E2E',
        'moduli-gold':    '#C9A84C',
        'moduli-gold-2':  '#E8C96B',
        'moduli-blue':    '#5B8CFF',
        'moduli-teal':    '#00D4AA',
        'moduli-text':    '#E8E8F0',
        'moduli-muted':   '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
