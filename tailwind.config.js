module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // Bleu principal
          light: '#3b82f6',
          dark: '#1e40af',
        },
        success: {
          DEFAULT: '#22c55e', // Vert succès
          light: '#4ade80',
          dark: '#15803d',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        warning: {
          DEFAULT: '#f59e42', // Orange
          light: '#fbbf24',
          dark: '#b45309',
        },
        alert: {
          DEFAULT: '#facc15', // Jaune
          light: '#fef08a',
          dark: '#ca8a04',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
