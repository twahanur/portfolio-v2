import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backdropBlur: {
        sm: "4px",
      },
      keyframes: {
        tubelightFlicker: {
          "0%": { opacity: "0", filter: "brightness(0.5)" },
          "3%": { opacity: "1", filter: "brightness(1.3)" },
          "5%": { opacity: "0", filter: "brightness(0.4)" },
          "7%": { opacity: "1", filter: "brightness(1.2)" },
          "10%": { opacity: "0" },
          "13%": { opacity: "1" },
          "16%": { opacity: "0.5" },
          "20%": { opacity: "1", filter: "brightness(1.4)" },
          "25%": { opacity: "0" },
          "30%": { opacity: "1" },
          "40%": { opacity: "0.8" },
          "50%": { opacity: "1" },
          "60%": { opacity: "0.3" },
          "70%": { opacity: "1" },
          "80%": { opacity: "0.5" },
          "90%": { opacity: "1" },
          "100%": { opacity: "1", filter: "brightness(1.6)" }, // final ON state
        },
        gradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        tubelightFlicker: "tubelightFlicker 3s ease-in-out infinite",
        gradient: "gradient 8s linear infinite",
      },
    },
  },
  plugins: [typography],
};
