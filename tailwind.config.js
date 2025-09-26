/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        emoji: ['"Apple Color Emoji"', '"Segoe UI Emoji"', '"Noto Color Emoji"'],
      },
      colors: {
        // Core
        primary: "#605b5b",        // Deep corporate blue - main headers
        "primary-light": "#2563EB", // Vibrant blue accent
        "button-green": "#0a7e57",   // Dark green - header bg
        "blue-light": "#317efb",           // Light blue - header bg
        "primary-dark": "#261818",  // Dark navy sections/navbars
        secondary: "#F3F4F6",       // Light gray - background
        "secondary-dark": "#D1D5DB",// Medium gray for contrast
        text: "#1F2937",            // Dark gray text

        // Accents
        accent: {
          emerald: "#10B981",       // Success / growth metrics
          teal: "#059669",          // Deep teal for highlights
          lightTeal: "#14B8A6",     // Lighter teal
          purple: "#6D28D9",        // Sophisticated analytics color
          violet: "#7C3AED",        // Lighter purple accent
          amber: "#F59E0B",         // Warnings / highlights
          red: "#EF4444",           // Negative metrics / errors
          orange: "#F97316",        // Optional alert color
        },

        // Neutrals
        neutral: {
          dark: "#0b0f1a",          // Almost black - dashboard bg
          card: "#1e293b",          // Dark slate - card panels
          border: "rgba(255, 255, 255, 0.08)", // Subtle borders
          text: "#f1f5f9",          // Slate-100 - primary text
          light: "#cbd5e1",         // Slate-300 - secondary text
          muted: "#64748b",         // Slate-500 - muted placeholders
        },

        // Status colors
        success: "#10B981",         // Finance green
        error: "#EF4444",           // Finance red
      },
    },
  },
  plugins: [],
};
