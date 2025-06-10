/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            opacity: {
                85: "0.85",
                98: "0.98"
            },
            colors: {
                slate: {
                    900: '#0f172a',
                    800: '#1e293b',
                    700: '#334155',
                    600: '#475569',
                    500: '#64748b',
                    400: '#94a3b8',
                    300: '#cbd5e1',
                    200: '#e2e8f0',
                    100: '#f1f5f9',
                },
                indigo: {
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                },
                amber: {
                    300: '#fcd34d',
                },
                green: {
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                },
                red: {
                    300: '#fca5a5',
                    400: '#f87171',
                },
                yellow: {
                    300: '#fde047',
                    400: '#facc15',
                },
                orange: {
                    300: '#fdba74',
                    400: '#fb923c',
                },
                purple: {
                    300: '#d8b4fe',
                    600: '#9333ea',
                },
                blue: {
                    300: '#93c5fd',
                },
            },
            keyframes: {
                pulse: {
                    '0%, 100%': {
                        opacity: '1',
                    },
                    '50%': {
                        opacity: '.5',
                    },
                },
            },
            animation: {
                pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
        },
    },
    plugins: [],
}