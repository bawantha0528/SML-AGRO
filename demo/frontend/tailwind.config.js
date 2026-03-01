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
          dark: '#2c1810',
          cream: '#FDF5E6',
          'cream-dark': '#F0DFC0',
          green: '#2E7D32',
          'green-light': '#4CAF50',
          amber: '#C8A45C',
          text: '#2D2418',
          light: '#F5E6C8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'palm-pattern': "url('https://www.transparenttextures.com/patterns/cubes.png')", // Subtle texture placeholder
      }
    },
  },
  plugins: [],
}
