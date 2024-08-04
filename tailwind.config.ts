import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  darkMode: "class",
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      colors: {
        "neutral-950": "hsl(237, 100%, 4%)",
        "neutral-850": "hsl(235, 16%, 15%)",
        "neutral-800": "hsl(235, 12%, 19%)",
        "neutral-750": "hsl(235, 12%, 22%)",
        "neutral-700": "hsl(236, 11%, 27%)",
        "neutral-650": "hsl(216, 15%, 37%)",
        "neutral-500": "hsl(216, 15%, 57%)",
        "neutral-350": "hsl(216, 15%, 64%)",
        "neutral-200": "hsl(239, 69%, 88%)",
        "neutral-100": "hsl(221, 69%, 94%)",
        "neutral-50": "hsl(220, 69%, 97%)",
        "neutral-25": "hsl(0, 0%, 98%)",

        "primary-700": "hsl(242, 48%, 58%)",
        "primary-600": "hsl(243, 54%, 64%)",

        "danger-400": "hsl(0, 78%, 45%)",
        "danger-500": "hsl(0, 78%, 63%)",
        "danger-600": "hsl(0, 100%, 70%)",

        "backdrop-500": "hsla(237, 20%, 4%,.3)",
        transparent: "hsla(0, 0%, 100%,0)",
      },
    },
  },
  plugins: [],
} satisfies Config;
