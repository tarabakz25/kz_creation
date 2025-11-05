import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{astro,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        fugaz: ['"Fugaz One"', 'sans-serif'],
        fira: ['"Fira Mono"', 'monospace'],
        futura: ['"Futura 100"', 'sans-serif'],
        comma: ['"Comma Sans"', 'sans-serif'],
        eurostile: ['eurostile', 'sans-serif'],
        eurostile_cond: ['eurostile-condensed', 'sans-serif'],
      }
    }
  },
  plugins: [],
} satisfies Config;
