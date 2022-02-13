module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
  },
  variants: {
    textColor: ['responsive', 'hover', 'focus', 'group-hover', 'focus-within'],
  },
  plugins: [],
}