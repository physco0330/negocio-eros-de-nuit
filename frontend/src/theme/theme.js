import { createTheme } from '@mui/material/styles';

const gold = '#C9A84C';
const goldLight = '#E8D48B';
const goldDark = '#A68A3E';
const black = '#0D0D0D';
const white = '#FAFAFA';

export const getTheme = (mode =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: gold,
        light: goldLight,
        dark: goldDark,
        contrastText: black,
      },
      secondary: {
        main: '#1A1A2E',
        light: '#2D2D44',
        dark: '#0F0F1A',
      },
      background: {
        default: mode === 'dark' ? '#0A0A0F' : '#F8F6F0',
        paper: mode === 'dark' ? '#141420' : '#FFFFFF',
      },
      text: {
        primary: mode === 'dark' ? '#F0ECE0' : '#1A1A1A',
        secondary: mode === 'dark' ? '#8A8A9A' : '#6B6B7B',
      },
      gold: { main: gold, dark: goldDark, light: goldLight },
      divider: mode === 'dark' ? 'rgba(201,168,76,0.12)' : 'rgba(0,0,0,0.06)',
    },
    typography: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      h1: { fontFamily: '"Playfair Display", serif', fontWeight: 700, letterSpacing: '-0.02em' },
      h2: { fontFamily: '"Playfair Display", serif', fontWeight: 700, letterSpacing: '-0.02em' },
      h3: { fontFamily: '"Playfair Display", serif', fontWeight: 700, letterSpacing: '-0.01em' },
      h4: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
      h5: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
      h6: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
      subtitle1: { fontWeight: 500, letterSpacing: '0.01em' },
      body1: { lineHeight: 1.7, letterSpacing: '0.01em' },
      body2: { lineHeight: 1.6 },
      button: { fontWeight: 600, letterSpacing: '0.03em' },
      caption: { letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 500 },
    },
    shape: { borderRadius: 16 },
    shadows: [
      'none',
      mode === 'dark' ? '0 1px 3px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.06)',
      mode === 'dark' ? '0 2px 6px rgba(0,0,0,0.5)' : '0 2px 6px rgba(0,0,0,0.08)',
      mode === 'dark' ? '0 4px 12px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.08)',
      mode === 'dark' ? '0 6px 16px rgba(0,0,0,0.5)' : '0 6px 16px rgba(0,0,0,0.1)',
      ...Array(20).fill(mode === 'dark' ? '0 8px 32px rgba(0,0,0,0.6)' : '0 8px 32px rgba(0,0,0,0.12)'),
    ],
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 12,
            padding: '10px 28px',
            fontSize: '0.95rem',
            letterSpacing: '0.02em',
            transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          },
          contained: {
            background: `linear-gradient(135deg, ${gold} 0%, ${goldDark} 100%)`,
            color: black,
            '&:hover': {
              background: `linear-gradient(135deg, ${goldLight} 0%, ${gold} 100%)`,
              transform: 'translateY(-1px)',
              boxShadow: `0 6px 20px rgba(201,168,76,0.35)`,
            },
          },
          outlined: {
            borderWidth: 2,
            '&:hover': { borderWidth: 2 },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            border: `1px solid ${mode === 'dark' ? 'rgba(201,168,76,0.08)' : 'rgba(0,0,0,0.04)'}`,
            transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
          rounded: { borderRadius: 20 },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600, letterSpacing: '0.02em' },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              transition: 'all 0.3s ease',
              '&:hover fieldset': { borderColor: gold },
              '&.Mui-focused fieldset': { borderColor: gold, borderWidth: 2 },
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 24,
            padding: '8px',
          },
        },
      },
    },
  })
);
