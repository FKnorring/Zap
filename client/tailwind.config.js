/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		keyframes: {
  			'zoom-in': {
  				'0%': {
  					transform: 'scale(0.5)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'scale(1)',
  					opacity: '1'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'collapsible-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-collapsible-content-height)'
  				}
  			},
  			'collapsible-up': {
  				from: {
  					height: 'var(--radix-collapsible-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			shake: {
  				'10%, 90%': {
  					transform: 'translate3d(-0.5px, 0, 0)'
  				},
  				'20%, 80%': {
  					transform: 'translate3d(1px, 0, 0)'
  				},
  				'30%, 50%, 70%': {
  					transform: 'translate3d(-1.5px, 0, 0)'
  				},
  				'40%, 60%': {
  					transform: 'translate3d(1.5px, 0, 0)'
  				}
  			},
  			flash: {
  				'0%': { opacity: '0.25' },
  				'100%': { opacity: '0' },
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			shake: 'shake 0.6s cubic-bezier(.36,.07,.19,.97) both',
  			'zoom-in': 'zoom-in 0.5s ease-in-out',
  			'collapsible-down': 'collapsible-down 0.2s ease-out',
  			'collapsible-up': 'collapsible-up 0.2s ease-out',
  			flash: 'flash 150ms ease-out forwards'
  		},
  		colors: {
  			primary: 'hsl(var(--primary))',
  			'primary-foreground': 'hsl(var(--primary-foreground))',
  			secondary: 'hsl(var(--secondary))',
  			'secondary-foreground': 'hsl(var(--secondary-foreground))',
  			accent: 'hsl(var(--accent))',
  			'accent-foreground': 'hsl(var(--accent-foreground))',
  			destructive: 'hsl(var(--destructive))',
  			'destructive-foreground': 'hsl(var(--destructive-foreground))',
  			muted: 'hsl(var(--muted))',
  			'muted-foreground': 'hsl(var(--muted-foreground))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: 'hsl(var(--card))',
  			'card-foreground': 'hsl(var(--card-foreground))',
  			popover: 'hsl(var(--popover))',
  			'popover-foreground': 'hsl(var(--popover-foreground))',
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			'chart-1': 'hsl(var(--chart-1))',
  			'chart-2': 'hsl(var(--chart-2))',
  			'chart-3': 'hsl(var(--chart-3))',
  			'chart-4': 'hsl(var(--chart-4))',
  			'chart-5': 'hsl(var(--chart-5))',
  			component: 'hsl(var(--component))',
  			'component-background': 'hsl(var(--component-background))',
  			textonwbg: 'hsl(var(--textonwbg))',
  			'textonwbg-grayonw': 'hsl(var(--textonwbg-grayonw))'
  		}
  	}
  },
  safelist: ['animate-[zoom-in_0.5s_ease-in-out]'],
  plugins: [tailwindcssAnimate],
};
