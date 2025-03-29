import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
