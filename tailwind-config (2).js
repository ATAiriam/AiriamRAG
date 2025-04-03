/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef7ff',
          100: '#d9edff',
          200: '#bce0ff',
          300: '#8ecbff',
          400: '#58adff',
          500: '#3189ff',
          600: '#1f6cf7',
          700: '#1957e6',
          800: '#1d46ba',
          900: '#1f4092',
          950: '#172758',
        },
        secondary: {
          50: '#f6f8fa',
          100: '#ebeef2',
          200: '#dce1e9',
          300: '#c5cdd8',
          400: '#a9b4c3',
          500: '#8e9aaf',
          600: '#717c93',
          700: '#5b6577',
          800: '#4c5464',
          900: '#424956',
          950: '#282d36',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      borderRadius: {
        lg: '0.5rem',
        xl: '1rem',
      },
      boxShadow: {
        card: '0 4px 8px rgba(0, 0, 0, 0.05)',
        dropdown: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
}
