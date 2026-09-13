/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#002366',       // Deep Navy
          accent: '#0A84FF',        // Electric Blue
          light: '#2FA8FF',         // Light Blue
          soft: '#EAF6FF',          // Soft Blue
          surface: '#F8FBFF',       // Surface Light
          border: '#D6EFFF',        // Border Light
          text: '#1A1A1A',          // Text Light
          muted: '#5B6B7A',         // Secondary Text Light
          dark: {
            bg: '#080B12',          // Dark Background
            surface: '#101826',     // Dark Surface
            card: '#162235',        // Dark Card
            primary: '#0A84FF',     // Dark Primary
            highlight: '#2FA8FF',   // Dark Highlight
            text: '#F5F9FF',        // Dark Text
            secondary: '#A8C0D8',   // Dark Secondary
            border: '#22324A',      // Dark Border
          },
        },
        navy: {
          DEFAULT: '#002366',
          50: '#F0F6FF',
          100: '#E0EEFF',
          200: '#B8DCFF',
          300: '#85C2FF',
          400: '#4DA2FF',
          500: '#0A84FF',
          600: '#0062CC',
          700: '#004799',
          800: '#002366',
          900: '#001640',
          950: '#000C24',
        },
        indigo: {
          DEFAULT: '#0A84FF',
          50: '#EAF6FF',
          100: '#D6EFFF',
          200: '#B0DEFF',
          300: '#75C3FF',
          400: '#2FA8FF',
          500: '#0A84FF',
          600: '#0066CC',
          700: '#004C99',
          800: '#003366',
          900: '#002366',
        },
        purple: {
          DEFAULT: '#2FA8FF',
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#2FA8FF',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
        emerald: {
          DEFAULT: '#10B981',
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        orange: {
          DEFAULT: '#F97316',
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #002366 0%, #0A84FF 60%, #2FA8FF 100%)',
        'workstation-gradient': 'linear-gradient(135deg, #002366 0%, #0A84FF 100%)',
        'electric-gradient': 'linear-gradient(135deg, #0A84FF 0%, #2FA8FF 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(10, 132, 255, 0.08) 0%, rgba(47, 168, 255, 0.04) 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 35, 102, 0.08)',
        'glass-lg': '0 16px 48px rgba(0, 35, 102, 0.14)',
        'glow': '0 0 25px rgba(10, 132, 255, 0.45)',
        'glow-lg': '0 0 45px rgba(10, 132, 255, 0.6)',
        'glow-soft': '0 0 20px rgba(47, 168, 255, 0.25)',
        'workstation-card': '0 10px 30px -5px rgba(0, 35, 102, 0.08)',
        'workstation-dark': '0 10px 30px -5px rgba(0, 0, 0, 0.6)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out 2s infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
