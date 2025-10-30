import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/contexts/ThemeContext';

export default function App() {
  useEffect(() => {
    // Inject global styles for web to enable proper scrolling
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.textContent = `
        html, body, #root {
          height: 100%;
          width: 100%;
          overflow: hidden;
          margin: 0;
          padding: 0;
        }
        #root > div,
        #root > div > div,
        #root > div > div > div {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        /* Fix tab bar layout on web */
        div[role="tablist"] {
          display: flex !important;
          flex-direction: row !important;
          justify-content: space-around !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <ThemeProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </ThemeProvider>
  );
}
