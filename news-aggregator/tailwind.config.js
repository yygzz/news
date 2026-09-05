/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gn-blue': '#1a73e8',
        'gn-gray': '#5f6368',
        'gn-bg': '#f8f9fa',
        'gn-border': '#dadce0',
      },
    },
  },
  plugins: [],
}
