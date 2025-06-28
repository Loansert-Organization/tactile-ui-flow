
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
				// New liquid glass color palette
				glass: {
					light: 'rgba(255, 255, 255, 0.1)',
					medium: 'rgba(255, 255, 255, 0.15)',
					strong: 'rgba(255, 255, 255, 0.25)',
					dark: 'rgba(0, 0, 0, 0.1)',
				},
				vivid: '#8F00FF',
				surface: 'rgba(255, 255, 255, 0.05)',
			},
			fontSize: {
				'xs': ['0.875rem', { lineHeight: '1.5' }],
				'sm': ['1rem', { lineHeight: '1.5' }],
				'base': ['1.125rem', { lineHeight: '1.5' }],
				'lg': ['1.25rem', { lineHeight: '1.5' }],
				'xl': ['1.375rem', { lineHeight: '1.4' }],
				'2xl': ['1.75rem', { lineHeight: '1.4' }],
				'3xl': ['2rem', { lineHeight: '1.3' }],
				'4xl': ['2.5rem', { lineHeight: '1.2' }],
				'5xl': ['3rem', { lineHeight: '1.1' }],
			},
			spacing: {
				'safe-top': 'env(safe-area-inset-top)',
				'safe-bottom': 'env(safe-area-inset-bottom)',
				'safe-left': 'env(safe-area-inset-left)',
				'safe-right': 'env(safe-area-inset-right)',
			},
			backgroundImage: {
				'gradient-magenta-orange': 'linear-gradient(135deg, #ff006e, #ff8500)',
				'gradient-teal-blue': 'linear-gradient(135deg, #06ffa5, #0099ff)',
				'gradient-purple-pink': 'linear-gradient(135deg, #8b5cf6, #ec4899)',
				'gradient-primary': 'linear-gradient(135deg, #0053B8, #8F00FF)',
				'gradient-accent': 'linear-gradient(135deg, #FFB200, #FF6C00)',
				'gradient-shimmer': 'linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)',
				'gradient-glass': 'linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
				'gradient-glass-dark': 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))',
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'gradient-slow': 'linear-gradient(-45deg, #0053B8, #8F00FF, #FFB200, #FF6C00)',
			},
			backdropBlur: {
				xs: '2px',
				'4xl': '72px',
			},
			borderRadius: {
				'4xl': '2rem',
				'5xl': '2.5rem',
			},
			boxShadow: {
				'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
				'glass-inset': 'inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
				'glow': '0 0 20px rgba(139, 92, 246, 0.3)',
				'glow-accent': '0 0 20px rgba(255, 178, 0, 0.3)',
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
				'gradient-slow': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'pulse-glow': {
					'0%, 100%': { boxShadow: '0 0 5px rgba(139, 92, 246, 0.5)' },
					'50%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.8)' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-in-left': {
					'0%': { transform: 'translateX(-100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'bounce-soft': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'shimmer': 'shimmer 2s infinite',
				'gradient-slow': 'gradient-slow 8s ease infinite',
				'float': 'float 3s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'slide-up': 'slide-up 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
				'slide-in-left': 'slide-in-left 0.3s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'bounce-soft': 'bounce-soft 2s ease-in-out infinite',
			},
			fontFamily: {
				sans: ['var(--font-sans)'],
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
