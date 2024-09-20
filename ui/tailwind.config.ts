import type { Config } from 'tailwindcss';

const config = {
    darkMode: ['class'],
    content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: '0.75rem',
                sm: '1rem',
                md: '1.25rem',
                lg: '2rem',
                xl: '3rem',
                '2xl': '9rem'
            }
        },
        extend: {
            colors: {
                'green-blue': '#004e59',
                'uh-blue4': '#4c90a8',
                'uh-black': '#212121',
                'uh-teal': '#0d7078',
                seafoam: '#e3f2ef',
                'text-color': '#1c6070',
                'text-primary': '#004252',
                'link-color': '#006ffa',
                'link-hover-color': '#0056b3',
                'blue-background': '#00a6b2',
                'light-grey': '#f2f2f2',
                'light-green': '#c7e7e0',
                'input-text-grey': '#495057'
            },
            fontFamily: {
                'source-sans-3': ['var(--font-source-sans-3)', 'Helvetica', 'Arial', 'sans-serif']
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out'
            }
        },
        screens: {
            sm: '576px',
            md: '768px',
            lg: '992px',
            xl: '1200px',
            '2xl': '1400px'
        }
    },
    plugins: [require('tailwindcss-animate')]
} satisfies Config;

export default config;
