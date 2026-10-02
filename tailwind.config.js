/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00E676", // Electric Green
        secondary: "#00B0FF", // Electric Blue
        cyberBg: "#0A0F1C", // Dark Background
        accent: "#00E5FF", // Neon Cyan
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 15px rgba(0, 230, 118, 0.4)',
        neonBlue: '0 0 15px rgba(0, 176, 255, 0.4)',
        neonCyan: '0 0 15px rgba(0, 229, 255, 0.4)',
      }
    },
  },
  plugins: [],
}
