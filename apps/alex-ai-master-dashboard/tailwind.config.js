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
        'master-primary': '#1e3a8a',
        'master-secondary': '#3b82f6',
        'master-accent': '#fbbf24',
        'master-success': '#10b981',
        'master-warning': '#f59e0b',
        'master-error': '#ef4444',
        // Crew-specific theme colors
        'picard': '#1e3a8a',      // Strategic blue
        'data': '#1e40af',        // Analytical blue
        'riker': '#dc2626',       // Tactical red
        'la-forge': '#ea580c',    // Engineering orange
        'worf': '#dc2626',        // Security red
        'troi': '#7c3aed',        // Empathy purple
        'uhura': '#8b5cf6',       // Communication purple
        'crusher': '#059669',     // Health green
        'quark': '#d97706',       // Business gold
      },
      fontFamily: {
        'master-mono': ['JetBrains Mono', 'monospace'],
        'master-display': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'master-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'master-bounce': 'bounce 1s infinite',
        'master-spin': 'spin 1s linear infinite',
        'master-float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}










