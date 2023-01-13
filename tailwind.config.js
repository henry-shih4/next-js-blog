/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        comfortaa: ["Comfortaa", "ui-sans-serif", "sans-serif"],
        nunito: ["Nunito", "ui-sans-serif", "sans-serif"],
      },
      transitionProperty: {
        height: "height",
      },
    },
  },
  plugins: [],
};
