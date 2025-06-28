
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '1rem',
			screens: {
				'sm': '640px',
				'md': '768px',
				'lg': '1024px',
				'xl': '1280px',
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'rgb(var(--border) / <alpha-value>)',
				input: 'rgb(var(--input) / <alpha-value>)',
				ring: 'rgb(var(--ring) / <alpha-value>)',
				background: 'rgb(var(--background) / <alpha-value>)',
				foreground: 'rgb(var(--foreground) / <alpha-value>)',
				primary: {
					DEFAULT: '#0053B8',
					foreground: 'rgb(var(--primary-foreground) / <alpha-value>)'
				},
				secondary: {
					DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
					foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)'
				},
				destructive: {
					DEFAULT: 'rgb(var(--destructive) / <alpha-value>)',
					foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)'
				},
				muted: {
					DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
					foreground: 'rgb(var(--muted-foreground) / <alpha-value>)'
				},
				accent: {
					DEFAULT: '#FFB200',
					foreground: 'rgb(var(--accent-foreground) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'rgb(var(--popover) / <alpha-value>)',
					foreground: 'rgb(var(--popover-foreground) / <alpha-value>)'
				},
				card: {
					DEFAULT: 'rgb(var(--card) / <alpha-value>)',
					foreground: 'rgb(var(--card-foreground) / <alpha-value>)'
				},
			},
			fontSize: {
				// Updated base font sizes for better readability
				'xs': ['0.875rem', { lineHeight: '1.4' }],     // 14px
				'sm': ['1rem', { lineHeight: '1.4' }],         // 16px
				'base': ['1.125rem', { lineHeight: '1.4' }],   // 18px (was 16px)
				'lg': ['1.25rem', { lineHeight: '1.4' }],      // 20px
				'xl': ['1.375rem', { lineHeight: '1.4' }],     // 22px (was 20px)
				'2xl': ['1.75rem', { lineHeight: '1.4' }],     // 28px (was 24px)
				'3xl': ['2rem', { lineHeight: '1.4' }],        // 32px
				'4xl': ['2.5rem', { lineHeight: '1.3' }],      // 40px
				'5xl': ['3rem', { lineHeight: '1.2' }],        // 48px
			},
			spacing: {
				// 8pt grid system
				'0.5': '0.125rem',  // 2px
				'1': '0.25rem',     // 4px
				'1.5': '0.375rem',  // 6px
				'2': '0.5rem',      // 8px
				'3': '0.75rem',     // 12px
				'4': '1rem',        // 16px
				'5': '1.25rem',     // 20px
				'6': '1.5rem',      // 24px
				'8': '2rem',        // 32px
				'10': '2.5rem',     // 40px
				'12': '3rem',       // 48px
				'16': '4rem',       // 64px
				'20': '5rem',       // 80px
				'24': '6rem',       // 96px
			},
			backgroundImage: {
				'gradient-magenta-orange': 'linear-gradient(135deg, #ff006e, #ff8500)',
				'gradient-teal-blue': 'linear-gradient(135deg, #06ffa5, #0099ff)',
				'gradient-purple-pink': 'linear-gradient(135deg, #8b5cf6, #ec4899)',
				'gradient-shimmer': 'linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)',
				'gradient-glass': 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
			backdropBlur: {
				xs: '2px',
			},
			borderRadius: {
				lg: '0.75rem',    // 12px - consistent rounded-lg
				md: '0.5rem',     // 8px
				sm: '0.25rem',    // 4px
				'2xl': '1rem',
				'3xl': '1.5rem',
				'4xl': '2rem',
			},
			boxShadow: {
				'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
				'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'shimmer': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'shimmer': 'shimmer 2s infinite',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-up': 'slide-up 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
			},
			fontFamily: {
				sans: ['var(--font-sans)'],
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
