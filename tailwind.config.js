/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {},
      colors: {
        brand: {
          DEFAULT: "#4F46E5", // Indigo
          light: "#6366F1",
          dark: "#312E81",
    },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
    plugins: [],
  }
}
}
