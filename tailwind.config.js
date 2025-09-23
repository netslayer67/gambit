// tailwind.config.js
export default {
    darkMode: "class",
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "hsl(var(--primary))",
                "primary-foreground": "hsl(var(--primary-foreground))",
                secondary: "hsl(var(--secondary))",
                "secondary-foreground": "hsl(var(--secondary-foreground))",
                tertiary: "hsl(var(--tertiary))",
                "tertiary-foreground": "hsl(var(--tertiary-foreground))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                muted: "hsl(var(--muted))",
                border: "hsl(var(--border))",
                success: "hsl(var(--success))",
                warning: "hsl(var(--warning))",
                error: "hsl(var(--error))",
                info: "hsl(var(--info))",
                gold: "hsl(var(--gold))",
                platinum: "hsl(var(--platinum))",
                onyx: "hsl(var(--onyx))",
                ivory: "hsl(var(--ivory))",
                velvet: "hsl(var(--velvet))",
                pearl: "hsl(var(--pearl))",
                glass: "hsl(var(--glass))",
                "gradient-start": "hsl(var(--gradient-start))",
                "gradient-mid": "hsl(var(--gradient-mid))",
                "gradient-end": "hsl(var(--gradient-end))",
                "overlay-dark": "hsl(var(--overlay-dark))",
                "overlay-light": "hsl(var(--overlay-light))",
            },
            borderRadius: {
                xl: "1rem",
                "2xl": "1.5rem",
                "3xl": "2rem",
            },
            backdropBlur: {
                xs: "2px",
                sm: "4px",
                md: "8px",
                lg: "12px",
                xl: "20px",
            },
            boxShadow: {
                "liquid":
                    "0 8px 24px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.2)",
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
};
