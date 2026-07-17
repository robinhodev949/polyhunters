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
                brand: {
                    DEFAULT: "#165DFC",
                    dark: "#0047ca",
                    light: "#165DFC",
                },
                success: "#00C853",
                border: "#E8E8E8",
                text: {
                    primary: "#111111",
                    secondary: "#6B6B6B",
                    muted: "#9CA3AF",
                },
                bg: {
                    primary: "#FAFAFA",
                    secondary: "#FFFFFF",
                    tertiary: "#FAFAFA",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
            },
            borderRadius: {
                lg: "0.5rem",
                xl: "0.75rem",
            },
            boxShadow: {
                card: "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px 0 rgba(0,0,0,0.04)",
                "card-hover": "0 4px 12px 0 rgba(0,0,0,0.08)",
            },
        },
    },
    plugins: [],
};

export default config;
