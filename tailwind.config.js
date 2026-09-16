/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"] },
      boxShadow: { soft: "0 18px 60px rgba(0,0,0,.07)" },
      colors: { ink: "#0A0A0A", paper: "#F7F7F5" }
    }
  },
  plugins: []
}
