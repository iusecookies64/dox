/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        lg: "0 0 5px rgba(0, 0, 0, 0.5)",
        sm: "0 0 2px rgba(0, 0, 0, 0.5)",
      },
      keyframes: {
        zoomin: {
          "0%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        zoomin: "zoomin 0.1s ease-in",
      },
    },
  },
  plugins: [],
};
