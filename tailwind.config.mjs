import { breakpoints } from './common.config.mjs'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    screens: {
      // Sử dụng breakpoints từ common.config.js
      ...breakpoints
    },
    extend: {}
  },
  plugins: []
}
