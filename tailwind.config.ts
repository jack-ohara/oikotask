import type { Config } from "tailwindcss";
import colours from "tailwindcss/colors";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "primary-green": colours.emerald[800],
        "primary-bg": colours.slate[900],
        "primary-text": colours.gray[200],
        "secondary-green": colours.emerald[700],
      },
    },
  },
  plugins: [],
};
export default config;
