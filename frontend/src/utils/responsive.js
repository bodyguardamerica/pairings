import { Dimensions, Platform } from 'react-native';

export const getResponsiveStyle = () => {
  const { width } = Dimensions.get('window');

  // Breakpoints
  const isSmallDevice = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  return {
    isSmallDevice,
    isTablet,
    isDesktop,
    isMobile: isSmallDevice,
    width,
  };
};

export const getContentMaxWidth = () => {
  const { isDesktop } = getResponsiveStyle();
  return isDesktop ? 1200 : '100%';
};

export const getFormMaxWidth = () => {
  const { isDesktop } = getResponsiveStyle();
  return isDesktop ? 600 : '100%';
};
