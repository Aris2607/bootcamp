/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
export default {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "rgba(151,150,156,255)",
        second: "rgba(88,98,112,255)",
        third: "rgba(175,174,174,255)",
        fourth: "rgba(106,114,124,255)",
        mainText: "rgba(247,246,247,255)",
      },
      screens: {
        "sm-425": "425px",
        "sm-360": "360px",
        "sm-375": "375px",
        "sm-376": "376px",
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [],
  },
};
