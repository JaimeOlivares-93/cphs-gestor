/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#020617', // slate-950
          card: '#0f172a', // slate-900
          cardBorder: '#1e293b', // slate-800
          text: '#f8fafc', // slate-50
          muted: '#94a3b8', // slate-400
          primary: '#10b981', // emerald-500
          primaryHover: '#059669', // emerald-600
          secondary: '#06b6d4', // cyan-500
          warning: '#f59e0b', // amber-500
          danger: '#f43f5e', // rose-500
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
