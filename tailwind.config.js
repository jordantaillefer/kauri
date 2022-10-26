const colors = require("tailwindcss/colors")

module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "2rem",
        md: "0"
      }
    },
    extend: {
      fontFamily: {
        roboto: [
          "Roboto Thin"
        ]
      },
      colors: {
        darker: "hsl(234,19%,79%)",
        dark: "hsl(124,55%,24%)",
        faded: "hsl(240,14%,28%)",
        lighter: "hsl(0, 0%, 100%)",
        light: "hsl(220,9%,46%)",
        inverse: "hsl(235, 19%, 12%)",
        primary: colors.emerald["500"],
        "primary-lighter": colors.teal["500"],
        "primary-darker": colors.emerald["700"],
        "danger-darker": "hsl(345,96%,19%)",
        danger: "hsl(345, 86%, 56%)",
        "danger-lighter": "hsl(345, 86%, 80%)"
      },
      keyframes: {
        "scale-in": {
          "0%": { opacity: 0, transform: "scaleX(0.5)" },
          "100%": { opacity: 1, transform: "scaleX(1)" }
        },
        "translate-background-tptp": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "100% 0" }
        },
        enter: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 }
        }
      },
      animation: {
        "scale-in": "scale-in 0.1s ease-in-out forwards",
        enter: "enter 0.2s ease-in-out forwards",
        "translate-background": "translate-background-tptp 1s ease-in-out infinite"
      },
      gridTemplateColumns: {
        "responsive": "repeat(auto-fill, minmax(max(var(--grid-item--min-width), var(--grid-item--max-width)), 1fr))"
      }
    }
  },
  plugins: []
}

