/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        sml: {
          dark: '#0A120E',       // Very deep forest green/black
          cream: '#F4F2EB',      // Soft, warm cream
          'cream-dark': '#E2DEC6', // Deeper, slightly colder cream
          green: '#157E54',        // Rich emerald green
          'green-light': '#249C6A',
          amber: '#CF994C',      // Vibrant gold/amber
          text: '#17241B',       // Deep text color
          light: '#FCFCFA',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Outfit', 'sans-serif'], // Outfit looks extremely modern for headings
      },
      backgroundImage: {
        'mesh-gradient': "radial-gradient(at 10% 20%, hsla(38, 59%, 57%, 0.12) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(118, 60%, 25%, 0.12) 0px, transparent 50%), radial-gradient(at 20% 80%, hsla(43, 100%, 75%, 0.08) 0px, transparent 50%)",
        'palm-pattern': "url('https://www.transparenttextures.com/patterns/cubes.png')",
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(21, 126, 84, 0.05)',
        'strong': '0 10px 40px -4px rgba(21, 126, 84, 0.15)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
