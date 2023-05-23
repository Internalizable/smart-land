/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        bold: ['bold'],
        extra_bold: ['extra_bold'],
        light: ['light'],
        medium: ['medium'],
        regular: ['regular'],
        semi_bold: ['semi_bold']
      },
    },
  },
  plugins: [],
}

