/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{ex,heex}",
  ],
  theme: {
    extend: {
      colors:{
        // KubeDaily Brand Tokens from https://github.com/kubernetesdaily/kubernetesdaily.github.io
        'brand-purple-100': '#caa2f5',
        'brand-purple-200': '#cfbae6',
        'brand-purple-300': '#967ab4',
        'brand-purple-800': '#7c6f89',
        purple: {
          DEFAULT: '#7c6f89',
          dark: '#caa2f5',
        },
        'brand-gray-100': '#f9fafb',
        'brand-gray-200': '#f5f6f7',
        'brand-gray-300': '#f4f6f7',
        'brand-gray-400': '#A1A1AA',
        'brand-gray-500': '#9fa3a6',
        'brand-gray-550': '#717171',
        'brand-gray-600': '#666666',
        'brand-gray-650': '#4a4a4a',
        'brand-gray-700': '#3d4449',
        'brand-gray-750': '#3c4349',
        'brand-gray-800': '#31373b',
        'brand-gray-900': '#22272e',
        'brand-red-300': '#f56a6a',
        'brand-red-500': '#c0394d',

        primary: '#f8f8f2',
        bgGray : '#282a36',
        bgPrimary : '#191a21',
        grayFill : '#6b6f8c',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        theme: {
          primary: {
            DEFAULT: '#6366f1',
            light: '#818cf8',
            dark: '#4f46e5',
          },
          secondary: {
            DEFAULT: '#0891b2',
            light: '#22d3ee',
            dark: '#0e7490',
          },
          neutral: {
            DEFAULT: '#f8fafc',
            dark: '#0f172a',
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "pulse-slow": {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 0.4 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-slow": "pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#334155', // slate-700 for light mode
            maxWidth: 'none',
            h1: {
              color: '#0f172a', // slate-900
              fontWeight: '800',
            },
            h2: {
              color: '#0f172a', // slate-900
              fontWeight: '700',
            },
            h3: {
              color: '#1e293b', // slate-800
              fontWeight: '600',
            },
            h4: {
              color: '#1e293b', // slate-800
              fontWeight: '600',
            },
            strong: {
              color: '#0f172a', // slate-900
              fontWeight: '700',
            },
            a: {
              color: '#7c3aed', // purple-600
              textDecoration: 'none',
              fontWeight: '600',
              '&:hover': {
                color: '#6d28d9',
                textDecoration: 'underline',
              },
            },
            code: {
              color: '#7c3aed',
              backgroundColor: '#f1f5f9',
              padding: '0.15rem 0.35rem',
              borderRadius: '0.375rem',
              fontWeight: '600',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: '#0c0915',
              color: '#e2e8f0',
              code: {
                backgroundColor: 'transparent',
                padding: '0',
                color: '#e2e8f0',
              },
            },
            blockquote: {
              borderLeftColor: '#7c3aed',
              color: '#475569',
            },
          },
        },
        invert: {
          css: {
            color: '#cbd5e1', // slate-300 for dark mode
            h1: {
              color: '#f8fafc', // slate-50
            },
            h2: {
              color: '#f8fafc', // slate-50
            },
            h3: {
              color: '#f1f5f9', // slate-100
            },
            h4: {
              color: '#f1f5f9', // slate-100
            },
            strong: {
              color: '#ffffff',
            },
            a: {
              color: '#caa2f5', // brand purple light
              '&:hover': {
                color: '#e9d5ff',
              },
            },
            code: {
              color: '#caa2f5',
              backgroundColor: '#1e1b2e',
            },
            pre: {
              backgroundColor: '#0c0915',
              color: '#f1f5f9',
            },
            blockquote: {
              borderLeftColor: '#caa2f5',
              color: '#94a3b8',
            },
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require('@tailwindcss/typography')],
}
