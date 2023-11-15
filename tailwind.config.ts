import colors from "tailwindcss/colors"
import type { Config } from "tailwindcss"

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "2rem"
      }
    },
    extend: {
      colors: {
        darker: "hsl(234,19%,79%)",
        dark: "hsl(124,55%,24%)",
        faded: "hsl(240,14%,28%)",
        lighter: "hsl(0, 0%, 100%)",
        light: "hsl(220,9%,46%)",
        inverse: "hsl(235, 19%, 12%)",
        primary: "var(--color-primary)",
        "primary-transparent": "var(--color-primary-transparent)",
        secondary: "var(--color-secondary)",
        "secondary-darker": "var(--color-secondary-darker)",
        "secondary-lighter": "var(--color-secondary-lighter)",
        "background-main": "var(--color-background-main)",
        "primary-lighter": colors.teal["500"],
        "primary-darker": "var(--color-primary-darker)",
        "danger-darker": "hsl(345,96%,19%)",
        "main-kauri": "var(--color-main-kaury)",
        danger: "hsl(345, 86%, 56%)",
        "danger-lighter": "hsl(345, 86%, 80%)"
      },
      backgroundImage: {
        "accueil-button": "var(--bg-accueil-button)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))"
      },
      keyframes: {
        "scale-in": {
          "0%": { opacity: '0', transform: "scaleX(0.5)" },
          "100%": { opacity: '1', transform: "scaleX(1)" }
        },
        "translate-background-tptp": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "100% 0" }
        },
        enter: {
          "0%": { opacity: '0' },
          "100%": { opacity: '1' }
        }
      },
      animation: {
        "scale-in": "scale-in 0.1s ease-in-out forwards",
        enter: "enter 0.2s ease-in-out forwards",
        "translate-background": "translate-background-tptp 1s ease-in-out infinite"
      },
      gridTemplateColumns: {
        responsive: "repeat(auto-fill, minmax(max(var(--grid-item--min-width--xl), var(--grid-item--max-width)), 1fr))"
      }
    }
  },
  plugins: []
} satisfies Config
