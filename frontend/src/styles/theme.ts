import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    // Palette adjusted to match provided mock
    mintBg: '#71c3a8',
    primary: '#2F6E62',
    primaryDark: '#23564D',
    primaryDarker: '#1F4E42',
    primaryLight: '#5BA89A',
    avatarBg: '#3F8C82',
    surface: '#FFFFFF',
    textOnMint: '#FFFFFF',
    textOnSurface: '#1F2A37',
    textSecondary: '#6B7280',
    muted: '#5B7A72',
    accentOrange: '#F19B18',
    background: '#71c3a8',
    border: '#E5E7EB',
    borderLight: '#E0E0E0',
    grayLight: '#E8E8E8',
    grayLighter: '#F0F0F0',
    grayLightest: '#F5F5F5',
    success: '#10B981',
    successLight: '#d1fae5',
    warning: '#F59E0B',
    error: '#EF4444',
    errorLight: '#fee2e2',
    errorBorder: '#fecaca',
    errorDark: '#DC3545',
    errorDarker: '#C82333',
    errorDarkest: '#DC2626',
    disabled: '#9CA3AF',
    disabledLight: '#f3f4f6',
  },
  radii: {
    sm: '8px',
    md: '12px',
    lg: '28px',
    pill: '999px'
  },
  shadow: {
    soft: '0 10px 24px rgba(0,0,0,0.14)'
  },
  layout: {
    maxWidth: '1200px'
  }
} as const;

export const GlobalStyles = createGlobalStyle`
  :root { color-scheme: light; }
  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root { height: 100%; }
  body {
    margin: 0;
    font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
    background: ${({ theme }) => theme.colors.background};
    color: white;
    line-height: 1.4;
  }
  a { color: inherit; text-decoration: none; }
  img { display: block; max-width: 100%; height: auto; }
  button { font: inherit; }
`;

export type AppTheme = typeof theme;
declare module 'styled-components' {
  export interface DefaultTheme extends AppTheme {}
}


