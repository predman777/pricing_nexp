/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-gold': '#F9B729',
        'brand-indigo': '#40358B',
        'brand-pale-blue': '#C9D8FA',
        'brand-darker-blue': '#dde6fa',
        'brand-pale-gold': '#FFF4DB',
        'brand-orange': '#F9920B',
      },
      fontFamily: {
        'display': ['Raleway', 'system-ui', 'sans-serif'],
        'body': ['Open Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
