/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(220 15% 8%)',
        foreground: 'hsl(45 20% 92%)',
        card: 'hsl(220 15% 12%)',
        'card-foreground': 'hsl(45 20% 92%)',
        popover: 'hsl(220 15% 10%)',
        'popover-foreground': 'hsl(45 20% 92%)',
        primary: 'hsl(175 70% 50%)',
        'primary-foreground': 'hsl(220 15% 8%)',
        secondary: 'hsl(220 15% 16%)',
        'secondary-foreground': 'hsl(45 20% 92%)',
        muted: 'hsl(220 15% 18%)',
        'muted-foreground': 'hsl(220 10% 55%)',
        accent: 'hsl(175 70% 50%)',
        'accent-foreground': 'hsl(220 15% 8%)',
        destructive: 'hsl(0 84% 60%)',
        'destructive-foreground': 'hsl(45 20% 92%)',
        border: 'hsl(220 15% 20%)',
        input: 'hsl(220 15% 20%)',
        ring: 'hsl(175 70% 50%)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

