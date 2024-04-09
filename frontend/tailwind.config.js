/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily:{
        poppins:["Poppins", "sans-serif"]
      },
      colors:{
        themeBlue:"#0162C4",
        themeDarkPrimary:"#212b36",
        themeDarkSecondary:"#161c24",
        themeLightPrimary:"#f8faff",
        themeLightSecondary:"#f0f4fa",
        themeGray:'#676767'
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}