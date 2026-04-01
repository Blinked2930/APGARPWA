/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pop': 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) both',
        'float-up': 'floatUp 1.5s ease-out forwards',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.92)' },
          '100%': { transform: 'scale(1)' },
        },
        floatUp: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(0.95)' },
          '20%': { opacity: '1', transform: 'translateY(-10px) scale(1.05)' },
          '100%': { opacity: '0', transform: 'translateY(-50px) scale(1)' },
        }
      }
    },
  },
  plugins: [],
}
