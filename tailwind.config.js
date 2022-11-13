const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      indigo: colors.indigo,

      faded: colors.gray[300],
    },
    extend: {
      gridTemplateColumns: {
        layout: '1fr 400px',
      },

      fontFamily: {
        sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'IBM Plex Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('@headlessui/tailwindcss')],
};
