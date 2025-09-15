/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'data-primary': '#1e40af',
        'data-secondary': '#3b82f6',
        'data-accent': '#06b6d4',
        'data-success': '#10b981',
        'data-warning': '#f59e0b',
        'data-error': '#ef4444',
      },
      fontFamily: {
        'data-mono': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'data-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'data-bounce': 'bounce 1s infinite',
        'data-spin': 'spin 1s linear infinite',
      },
    },
  },
  plugins: [],
}




