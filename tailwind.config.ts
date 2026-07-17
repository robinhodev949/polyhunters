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
                    DEFAULT: "var(--brand)",
                    dark: "var(--brand-dark)",
                    lime: "var(--accent-lime)",
                },
                success: "var(--success)",
                error: "var(--error)",
                border: "var(--border)",
                text: {
                    primary: "var(--text-primary)",
                    secondary: "var(--text-secondary)",
                    muted: "var(--text-muted)",
                },
                bg: {
                    primary: "var(--bg)",
                    secondary: "var(--bg-card)",
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
