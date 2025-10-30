import { useTheme } from '../contexts/ThemeContext';

const lightColors = {
  // Primary Colors
  primary: '#667eea',
  primaryDark: '#764ba2',

  // Status Colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // Neutral Colors
  white: '#ffffff',
  gray50: '#f8f8f8',
  gray100: '#f0f0f0',
  gray200: '#e0e0e0',
  gray400: '#999999',
  gray600: '#666666',
  gray900: '#333333',
  black: '#000000',

  // Background Colors
  bgPrimary: '#ffffff',
  bgSecondary: '#f8f8f8',

  // Text Colors
  textPrimary: '#333333',
  textSecondary: '#666666',
  textTertiary: '#999999',

  // Gradient colors
  gradientStart: '#667eea',
  gradientEnd: '#764ba2',

  // Card/Surface Colors
  cardBg: '#ffffff',
  borderColor: '#e0e0e0',
};

const darkColors = {
  // Primary Colors - Using Color Hunt palette
  primary: '#F05454',
  primaryDark: '#d64444',

  // Status Colors (slightly brighter for dark mode)
  success: '#22c55e',
  warning: '#fbbf24',
  error: '#F05454',
  info: '#60a5fa',

  // Neutral Colors - Using Color Hunt palette
  white: '#222831',
  gray50: '#30475E',
  gray100: '#3d5570',
  gray200: '#4a6382',
  gray400: '#7a8a9e',
  gray600: '#b0b8c3',
  gray900: '#DDDDDD',
  black: '#ffffff',

  // Background Colors - Using Color Hunt palette
  bgPrimary: '#222831',
  bgSecondary: '#30475E',

  // Text Colors - Using Color Hunt palette
  textPrimary: '#DDDDDD',
  textSecondary: '#b0b8c3',
  textTertiary: '#7a8a9e',

  // Gradient colors - Using Color Hunt palette
  gradientStart: '#F05454',
  gradientEnd: '#30475E',

  // Card/Surface Colors - Using Color Hunt palette
  cardBg: '#30475E',
  borderColor: '#4a6382',
};

export const useColors = () => {
  const { isDarkMode } = useTheme();
  return isDarkMode ? darkColors : lightColors;
};

export { lightColors, darkColors };
