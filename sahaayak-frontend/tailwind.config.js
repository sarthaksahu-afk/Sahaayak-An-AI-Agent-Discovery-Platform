/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // <--- THIS IS THE MAGIC WORD FOR DARK MODE
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}