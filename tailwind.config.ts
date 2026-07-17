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
                    DEFAULT: "#3358FF",
                    dark: "#2244DD",
                    light: "#5B7AFF",
                },
                success: "#00C853",
                border: "#E5E7EB",
                text: {
                    primary: "#111827",
                    secondary: "#4B5563",
                    muted: "#9CA3AF",
                },
                bg: {
                    primary: "#F9FAFB",
                    secondary: "#FFFFFF",
                    tertiary: "#F3F4F6",
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
