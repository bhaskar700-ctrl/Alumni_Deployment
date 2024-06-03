/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.js', './public/index.html'],
  theme: {
    extend: {
      keyframes: {
        scroll: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(-100%)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scrollHorizontal: {
          '0%': { transform: 'translateX(-100%)', color: 'blue' },
          '50%': { color: 'red' },
          '100%': { transform: 'translateX(100%)', color: 'green' },
        },
      },
      animation: {
        scroll: 'scroll 10s linear infinite',
        scrollHorizontal: 'scrollHorizontal 10s linear infinite',
        slideIn: 'slideIn 1s ease-out',
      },
    },
  },
  plugins: [],
}

