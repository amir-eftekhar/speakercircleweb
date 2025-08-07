/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f9f7f4',
          100: '#f0ebe3',
          200: '#e0d5c4',
          300: '#ccb89e',
          400: '#b59a76',
          500: '#a6875d',
          600: '#624D28', // Irish Coffee - Primary
          700: '#7a5f3a',
          800: '#654f31',
          900: '#56432a',
        },
        secondary: {
          50: '#f8faf9',
          100: '#f1f6f3',
          200: '#D2E1D9', // Paris White - Secondary
          300: '#b8d1c2',
          400: '#95bba7',
          500: '#76a18c',
          600: '#5e8471',
          700: '#4e6b5c',
          800: '#42574c',
          900: '#394940',
        },
        accent: {
          50: '#f7f7f6',
          100: '#eeeeec',
          200: '#ddddd8',
          300: '#c7c7c0',
          400: '#b0b0a5',
          500: '#9d9d90',
          600: '#8C8C74', // Granite Green - Accent
          700: '#7a7a68',
          800: '#656557',
          900: '#535349',
        },
        neutral: {
          50: '#f8f8f7',
          100: '#f0f0ee',
          200: '#e2e2de',
          300: '#d0d0ca',
          400: '#b8b8b0',
          500: '#a3a399',
          600: '#88957D', // Battleship Gray - Neutral
          700: '#7a8470',
          800: '#666d5e',
          900: '#555a4f',
        }
      }
    },
  },
  plugins: [],
};