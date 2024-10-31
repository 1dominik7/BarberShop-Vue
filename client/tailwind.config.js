/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#231F20',
        secondary: '#E4DECB',
        bgSecond: '#D9D9D9',
        bgThird: '#CAC9C9'
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif']
      }
    }
  },
  plugins: []
}
