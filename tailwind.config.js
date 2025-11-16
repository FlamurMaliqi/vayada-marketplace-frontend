/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EFF2FF',
          100: '#DFE5FF',
          200: '#BFCBFF',
          300: '#9FB1FF',
          400: '#5F7FFF',
          500: '#2F52F5',
          600: '#1E3EDB',
          700: '#162FB8',
          800: '#0F2095',
          900: '#081172',
        },
      },
    },
  },
  plugins: [],
}

