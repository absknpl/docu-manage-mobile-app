import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the ThemeContext
const ThemeContext = createContext();

// Define color palettes for each theme
const themes = {
  light: {
    background: '#f4f6fb',
    card: '#fff',
    text: '#232946',
    accent: '#6366f1',
    border: '#e5e7eb',
    icon: '#6366f1',
    faded: '#e0e7ff',
    warning: '#facc15',
    success: '#22c55e',
    error: '#ef4444',
    textOnPrimary: '#ffffff',
    primary: '#6366f1', // Added for header consistency
  },
  dark: {
    background: '#181926',
    card: '#232946',
    text: '#f4f6fb',
    accent: '#6366f1',
    border: '#232946',
    icon: '#6366f1',
    faded: '#232946',
    warning: '#facc15',
    success: '#22c55e',
    error: '#ef4444',
    textOnPrimary: '#f4f6fb',
    primary: '#232946', // Added for header consistency
  },
  pop: {
    background: '#fffbe6', // Changed to solid color for StatusBar compatibility (gradients not supported)
    card: '#fff0f6',
    text: '#ff5e62',
    accent: '#ff5e62',
    border: '#ffb347',
    icon: '#ff5e62',
    faded: '#ffe0ec',
    warning: '#facc15',
    success: '#22c55e',
    error: '#ef4444',
    textOnPrimary: '#ffffff',
    primary: '#ff5e62', // Primary color for headers
    popGradient: ['#ffb347', '#ff5e62', '#f9d423', '#fc6076'],
    popShadow: '#ff5e62',
    popFont: Platform.OS === 'ios' ? 'Chalkboard SE' : 'monospace',
  },
};

// Utility to determine StatusBar barStyle based on background color
const getStatusBarStyle = (bgColor) => {
  // Map known background colors to appropriate barStyle
  const lightBackgrounds = ['#f4f6fb', '#fffbe6', '#e0e7ff', '#ffe0ec', '#fff'];
  const isLightBackground = lightBackgrounds.includes(bgColor);
  return isLightBackground ? 'dark-content' : 'light-content';
};

export function ThemeProvider({ children }) {
  // Initialize with system color scheme or default to 'light'
  const systemColorScheme = Appearance.getColorScheme() || 'light';
  const [themeMode, setThemeModeState] = useState(systemColorScheme);
  const [colorScheme, setColorScheme] = useState(systemColorScheme);
  const [theme, setTheme] = useState(themes[systemColorScheme]);

  // Load themeMode from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('arkive_theme_mode');
        if (storedTheme) {
          setThemeModeState(storedTheme);
        }
      } catch (e) {
        console.error('Failed to load theme mode:', e);
      }
    })();
  }, []);

  // Save themeMode to AsyncStorage whenever it changes
  useEffect(() => {
    AsyncStorage.setItem('arkive_theme_mode', themeMode).catch(e => {
      console.error('Failed to save theme mode:', e);
    });
  }, [themeMode]);

  const setThemeMode = (mode) => {
    setThemeModeState(mode);
  };

  useEffect(() => {
    if (themeMode === 'pop') {
      setColorScheme('pop');
      setTheme(themes.pop);
    } else if (themeMode === 'light' || themeMode === 'dark') {
      setColorScheme(themeMode);
      setTheme(themes[themeMode]);
    } else {
      setColorScheme('light');
      setTheme(themes.light);
    }
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, colorScheme, theme, getStatusBarStyle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeMode = () => useContext(ThemeContext);