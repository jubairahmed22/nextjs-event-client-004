import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite/**/*.js", // Added Flowbite support
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      fontFamily: {
        marcellus: ["Marcellus", "serif"],
        jost: ["Jost", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        spaceMono: ["Space Mono", "monospace"],
        montserrat: ["Montserrat", "sans-serif"],
        courierPrime: ["Courier Prime", "monospace"],
        poppins: ["Poppins", "sans-serif"],
        raleway: ["Raleway", "sans-serif"],
        nunitoSans: ["Nunito Sans", "sans-serif"],
        playfairDisplay: ["Playfair Display", "serif"],
        lora: ["Lora", "serif"],
        abrilFatface: ["Abril Fatface", "serif"],
        pacifico: ["Pacifico", "cursive"],
      },
      letterSpacing: {
        tightest: '-0.075em', // Custom tighter spacing
        tighter: '-0.05em',  // Custom tighter spacing
        tight: '-0.025em',   // Custom tight spacing
        normal: '0',         // Default spacing
        wide: '0.025em',     // Custom wider spacing
        wider: '0.05em',     // Custom wider spacing
        widest: '0.1em',    // Custom widest spacing
        custom: '10 em',     // Your custom letter spacing
      },
    },
  },
  plugins: [
    require("daisyui"),
    require("flowbite/plugin"), // Added Flowbite plugin
  ],
};

export default config;