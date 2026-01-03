import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            keyframes: {
                aurora: {
                    "0%": { transform: "rotate(0deg) scale(1)" },
                    "50%": { transform: "rotate(180deg) scale(1.1)" },
                    "100%": { transform: "rotate(360deg) scale(1)" },
                },
            },
            animation: {
                aurora: "aurora 20s linear infinite",
            },
        },
    },
    plugins: [],
    darkMode: 'class',
};
export default config;
