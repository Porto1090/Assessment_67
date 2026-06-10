/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", ".dark"],
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0b0b0b",
        secondary: "#111111",
        "primary-200": "#1C1E20",
        "primary-300": "#1C1E20",
        "primary-400": "#1C1E20",
        "primary-500": "#1C1E20",
        "primary-600": "#1C1E20",
        "primary-700": "#1C1E20",
        "primary-800": "#1C1E20",
        "primary-900": "#1C1E20",
      },
    },
  },
  plugins: [],
};