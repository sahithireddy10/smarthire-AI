// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Inter'", "sans-serif"],
        sora: ["'Sora'", "sans-serif"],
        dm: ["'DM Sans'", "sans-serif"]
      },
      colors: {
        bg: {
          base: "#f8fafc",
          surface: "#ffffff",
          elevated: "#f1f5f9"
        },
        border: {
          subtle: "#e2e8f0"
        }
      }
    }
  },
  plugins: []
}
