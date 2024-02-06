/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*"],
  darkMode: "class",
  theme: {
    screens: {
      xs: "320px",
      xss: "426px",
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
  },
  extend: {},
  plugins: [],
};
