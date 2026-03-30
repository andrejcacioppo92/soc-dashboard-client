/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['Fira Code', 'monospace'],
            },
            colors: {
                soc: {
                    bg: '#0f172a',
                    panel: '#1e293b',
                    text: '#e2e8f0',
                    accent: '#10b981',
                    alert: '#ef4444'
                }
            }
        },
    },
    plugins: [],
}