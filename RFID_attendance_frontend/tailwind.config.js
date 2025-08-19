/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
        fontFamily: {
      emoji: ['"Apple Color Emoji"', '"Segoe UI Emoji"', '"Noto Color Emoji"'],
    },
    },
  },
  plugins: [],
};
