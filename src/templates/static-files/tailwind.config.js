/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    /*---Start Addapter to bootstrap breakpoints---*/
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "calc(18px + 1rem)",
        md: "calc(24px + 1rem)",
        lg: "calc(16px + 1rem)",
        xl: "calc(30px + 1rem)",
        "2xl": "calc(40px + 1rem)",
      },
      screens: {
        sm: "576px",
        md: "768px",
        lg: "992px",
        xl: "1200px",
        "2xl": "1400px",
      },
    },
    /*---End Addapter to bootstrap breakpoints---*/
    extend: {
      colors: {
        "bcp-orange": "#ff7800",

        "bcp-blue-1": "#007aff",
        "bcp-blue-2": "#002A8D",

        "bcp-gray-1": "#202E44",
        "bcp-gray-2": "#4D5B70",
        "bcp-gray-3": "#868F9E",
        "bcp-gray-4": "#7F95B1",
      },
      fontFamily: {
        flexo: ["var(--font-flexo)"],
        roboto: ["var(--font-roboto)"],
      },
    },
  },

  plugins: [],
};
console.log("Hola mundo xd");
