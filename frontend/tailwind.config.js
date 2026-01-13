/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF7120',
          dark: '#e66310',
          darker: '#d45500',
        },
        navy: {
          DEFAULT: '#00273C',
          light: '#003a5c',
          dark: '#001a2b',
        },
      },
    },
  },
  plugins: [],
}
