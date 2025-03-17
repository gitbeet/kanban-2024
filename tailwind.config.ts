import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  darkMode: "class",
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    colors: {
      "neutral-950": "hsl(237, 50%, 4%)",
      "neutral-900": "hsl(235, 16%, 13%)",
      "neutral-850": "hsl(235, 16%, 15%)",
      "neutral-800": "hsl(235, 14%, 20%)",
      "neutral-750": "hsl(235, 15%, 23%)",
      "neutral-700": "hsl(236, 11%, 27%)",
      "neutral-650": "hsl(216, 15%, 37%)",
      "neutral-500": "hsl(216, 15%, 57%)",
      "neutral-350": "hsl(216, 15%, 64%)",
      "neutral-250": "hsl(219, 16%, 75%)",
      "neutral-100": "hsl(221, 69%, 94%)",
      "neutral-50": "hsl(220, 69%, 97%)",
      "neutral-25": "hsl(0, 0%, 98%)",
      white: "hsl(0, 0%, 100%)",

      "primary-700": "hsl(242, 48%, 58%)",
      "primary-650": "hsl(243, 54%, 61%)",
      "primary-600": "hsl(243, 54%, 64%)",

      "danger-600": "hsl(0, 78%, 45%)",
      "danger-400": "hsl(0, 78%, 62%)",
      "danger-300": "hsl(0, 100%, 70%)",

      "success-400": "#34d399",

      "backdrop-500": "hsla(237, 20%, 4%,.3)",
      transparent: "hsla(0, 0%, 100%,0)",
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-plus-jakarta-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;
