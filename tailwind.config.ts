
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
			padding: {
				DEFAULT: '1rem',
				sm: '1.5rem',
				md: '2rem',
				lg: '2.5rem',
				xl: '3rem',
			},
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
				// New vibrant color palette
				vivid: '#8F00FF',
				surface: 'rgba(255, 255, 255, 0.1)',
				glass: {
					50: 'rgba(255, 255, 255, 0.05)',
					100: 'rgba(255, 255, 255, 0.1)',
					200: 'rgba(255, 255, 255, 0.2)',
					300: 'rgba(255, 255, 255, 0.3)',
				},
			},
			fontSize: {
				// Responsive typography
				'xs': ['0.875rem', { lineHeight: '1.4' }],
				'sm': ['1rem', { lineHeight: '1.4' }],
				'base': ['1.125rem', { lineHeight: '1.4' }],
				'lg': ['1.25rem', { lineHeight: '1.4' }],
				'xl': ['1.375rem', { lineHeight: '1.4' }],
				'2xl': ['1.75rem', { lineHeight: '1.4' }],
				'3xl': ['2rem', { lineHeight: '1.4' }],
				'4xl': ['2.5rem', { lineHeight: '1.3' }],
				'5xl': ['3rem', { lineHeight: '1.2' }],
				// Responsive fluid typography
				'fluid-sm': 'clamp(0.875rem, 2vw, 1rem)',
				'fluid-base': 'clamp(1rem, 2.5vw, 1.125rem)',
				'fluid-lg': 'clamp(1.125rem, 3vw, 1.375rem)',
				'fluid-xl': 'clamp(1.25rem, 3.5vw, 1.75rem)',
				'fluid-2xl': 'clamp(1.5rem, 4vw, 2rem)',
				'fluid-3xl': 'clamp(1.75rem, 5vw, 2.5rem)',
			},
			spacing: {
				// Enhanced spacing system
				'0.5': '0.125rem',
				'1': '0.25rem',
				'1.5': '0.375rem',
				'2': '0.5rem',
				'3': '0.75rem',
				'4': '1rem',
				'5': '1.25rem',
				'6': '1.5rem',
				'8': '2rem',
				'10': '2.5rem',
				'12': '3rem',
				'16': '4rem',
				'20': '5rem',
				'24': '6rem',
				'safe-top': 'env(safe-area-inset-top)',
				'safe-bottom': 'env(safe-area-inset-bottom)',
				'safe-left': 'env(safe-area-inset-left)',
				'safe-right': 'env(safe-area-inset-right)',
			},
			backgroundImage: {
				// Enhanced gradient system
				'gradient-primary': 'linear-gradient(135deg, #0053B8, #8F00FF)',
				'gradient-accent': 'linear-gradient(135deg, #FFB200, #FF6C00)',
				'gradient-vivid': 'linear-gradient(135deg, #8F00FF, #FF006E)',
				'gradient-hero': 'linear-gradient(135deg, #0053B8 0%, #8F00FF 50%, #FFB200 100%)',
				'gradient-card': 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
				'gradient-glass': 'linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
				'gradient-shimmer': 'linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)',
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				// Animated gradients
				'gradient-animated': 'linear-gradient(-45deg, #0053B8, #8F00FF, #FFB200, #FF6C00)',
			},
			backdropBlur: {
				xs: '2px',
				'4xl': '72px',
			},
			borderRadius: {
				lg: '0.75rem',
				md: '0.5rem',
				sm: '0.25rem',
				'2xl': '1rem',
				'3xl': '1.5rem',
				'4xl': '2rem',
			},
			boxShadow: {
				'glass-sm': '0 2px 8px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
				'glass-md': '0 4px 16px 0 rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
				'glass-lg': '0 8px 32px 0 rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
				'glass-xl': '0 16px 48px 0 rgba(0, 0, 0, 0.2), inset 0 2px 0 rgba(255, 255, 255, 0.25)',
				'neon': '0 0 20px rgba(143, 0, 255, 0.5)',
				'glow': '0 0 30px rgba(255, 178, 0, 0.3)',
			},
			keyframes: {
				// Enhanced animations
				'gradient-slow': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				},
				'gradient-fast': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				},
				'glass-shine': {
					'0%': { transform: 'translateX(-100%) rotate(45deg)' },
					'100%': { transform: 'translateX(300%) rotate(45deg)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'pulse-soft': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-down': {
					'0%': { transform: 'translateY(-20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'shimmer': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
			},
			animation: {
				// Enhanced animation utilities
				'gradient-slow': 'gradient-slow 8s ease infinite',
				'gradient-fast': 'gradient-fast 3s ease infinite',
				'glass-shine': 'glass-shine 2s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
				'scale-in': 'scale-in 0.2s ease-out',
				'slide-up': 'slide-up 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
				'slide-down': 'slide-down 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
				'fade-in': 'fade-in 0.3s ease-out',
				'shimmer': 'shimmer 2s infinite',
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
			fontFamily: {
				sans: ['var(--font-sans)'],
			},
			// Custom utilities
			screens: {
				'xs': '475px',
				'3xl': '1600px',
			},
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		// Custom plugin for glass effects and utilities
		function({ addUtilities, theme }) {
			const newUtilities = {
				'.glass-effect': {
					'backdrop-filter': 'blur(16px)',
					'background': 'rgba(255, 255, 255, 0.1)',
					'border': '1px solid rgba(255, 255, 255, 0.2)',
					'box-shadow': '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
				},
				'.glass-strong': {
					'backdrop-filter': 'blur(24px)',
					'background': 'rgba(255, 255, 255, 0.15)',
					'border': '1px solid rgba(255, 255, 255, 0.25)',
					'box-shadow': '0 16px 48px 0 rgba(0, 0, 0, 0.2)',
				},
				'.gradient-text': {
					'background': 'linear-gradient(135deg, #FFB200, #0053B8)',
					'background-clip': 'text',
					'-webkit-background-clip': 'text',
					'-webkit-text-fill-color': 'transparent',
				},
				'.gradient-text-vivid': {
					'background': 'linear-gradient(135deg, #8F00FF, #FF006E)',
					'background-clip': 'text',
					'-webkit-background-clip': 'text',
					'-webkit-text-fill-color': 'transparent',
				},
				'.touch-manipulation': {
					'touch-action': 'manipulation',
				},
				'.scroll-smooth-touch': {
					'scroll-behavior': 'smooth',
					'-webkit-overflow-scrolling': 'touch',
				},
				'.tap-highlight-none': {
					'-webkit-tap-highlight-color': 'transparent',
				},
			}
			addUtilities(newUtilities)
		}
	],
} satisfies Config;
