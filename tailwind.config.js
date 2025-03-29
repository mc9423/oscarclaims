/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FE938C',
        secondary: '#EDAF97',
        accent: '#C49792',
        muted: '#AD91A3',
        'muted-dark': '#9D91A3',
      },
    },
  },
  plugins: [],
} 