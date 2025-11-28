import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./redux/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "tw-",
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
