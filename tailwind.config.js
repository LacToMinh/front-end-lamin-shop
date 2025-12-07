/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      textColor: {
        primary: "#0E1D61",
      },
      color: {
        primary: "#0E1D61",
      },
      backgroundColor: {
        primary: "#0E1D61",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        marquee: "marquee 16s linear infinite",
      },
    },
  },
  plugins: [],
};
