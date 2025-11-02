import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{astro,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui'],
        fugaz: ['"Fugaz One"', 'sans-serif'],
        mono: ['"Fira Mono"', 'monospace'],
        futura: ['"futura-pt"', '"Futura"', '"Futura PT"', 'futura-pt-n7', 'futura-pt-n4', 'sans-serif'],
      }
    }
  },
  plugins: [],
} satisfies Config;
