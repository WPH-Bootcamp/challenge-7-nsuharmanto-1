import colors from 'tailwindcss/colors';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Nunito', 'Arial', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000000',
      white: '#ffffff',
      primary: '#C12116',
      accent: {
        pink: '#D9206E',
        green: '#079455',
        yellow: '#FDB022',
      },
      success: '#079455',
      warning: '#FDB022',
      gray: {
        50: '#FDFDFD',
        100: '#FAFAFA',
        200: '#F5F5F5',
        300: '#E9EAEB',
        400: '#D5D7DA',
        500: '#A4A7AE',
        600: '#717680',
        700: '#535862',
        800: '#414651',
        900: '#252B37',
        950: '#181D27',
        1000: '#0A0D12',
      },
      red: colors.red,
      green: colors.green,
      yellow: colors.yellow,
      blue: colors.blue,
      sky: colors.sky,
      stone: colors.stone,
      neutral: colors.neutral,
      slate: colors.slate,
    },
    extend: {
      borderRadius: {
        none: '0px',
        xxs: '2px',
        xs: '4px',
        sm: '6px',
        md: '8px',
        lg: '10px',
        xl: '12px',
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
        full: '9999px',
      },
      spacing: {
        none: '0px',
        xxs: '2px',
        xs: '4px',
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '32px',
        '5xl': '40px',
        '6xl': '48px',
        '7xl': '64px',
        '8xl': '80px',
        '9xl': '96px',
        '10xl': '128px',
        '11xl': '140px',
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
      fontSize: {
        'display-3xl': ['3.75rem', { lineHeight: '4.5rem' }], // 60px/72px
        'display-2xl': ['3rem', { lineHeight: '3.75rem', letterSpacing: '-0.02em' }], // 48px/60px
        'display-xl': ['2.5rem', { lineHeight: '3rem', letterSpacing: '-0.02em' }], // 40px/48px
        'display-lg': ['2.25rem', { lineHeight: '2.75rem', letterSpacing: '-0.02em' }], // 36px/44px
        'display-md': ['2rem', { lineHeight: '2.5rem' }], // 32px/40px
        'display-sm': ['1.75rem', { lineHeight: '2.375rem' }], // 28px/38px
        'display-xs': ['1.5rem', { lineHeight: '2.25rem' }], // 24px/36px
        'text-xl': ['1.25rem', { lineHeight: '2.125rem' }], // 20px/34px
        'text-lg': ['1.125rem', { lineHeight: '2rem' }], // 18px/32px
        'text-md': ['1rem', { lineHeight: '1.875rem' }], // 16px/30px
        'text-sm': ['0.875rem', { lineHeight: '1.75rem' }], // 14px/28px
        'text-xs': ['0.75rem', { lineHeight: '1.5rem' }], // 12px/24px
      },
    },
  },
  plugins: [],
};