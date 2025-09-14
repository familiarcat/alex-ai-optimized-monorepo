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
        'comm-primary': '#7c3aed',
        'comm-secondary': '#a855f7',
        'comm-accent': '#06b6d4',
        'comm-success': '#10b981',
        'comm-warning': '#f59e0b',
        'comm-error': '#ef4444',
      },
      fontFamily: {
        'comm-mono': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'comm-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'comm-bounce': 'bounce 1s infinite',
        'comm-spin': 'spin 1s linear infinite',
      },
    },
  },
  plugins: [],
}


