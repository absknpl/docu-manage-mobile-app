import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance, Platform } from 'react-native';

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
    // ...add more as needed
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
    // ...add more as needed
  },
  pop: {
    background: 'linear-gradient(135deg, #ffb347 0%, #ff5e62 100%)', // fallback: use #ffb347
    card: '#fff0f6',
    text: '#ff5e62',
    accent: '#ff5e62',
    border: '#ffb347',
    icon: '#ff5e62',
    faded: '#ffe0ec',
    warning: '#facc15',
    success: '#22c55e',
    error: '#ef4444',
    popGradient: ['#ffb347', '#ff5e62', '#f9d423', '#fc6076'],
    popShadow: '#ff5e62',
    popFont: Platform.OS === 'ios' ? 'Chalkboard SE' : 'monospace',
    // ...add more as needed
  },
};

export function ThemeProvider({ children }) {
  // 'pop' | 'light' | 'dark'
  const [themeMode, setThemeMode] = useState('light');
  const [colorScheme, setColorScheme] = useState('light');
  const [theme, setTheme] = useState(themes.light);

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
    <ThemeContext.Provider value={{ themeMode, setThemeMode, colorScheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeMode = () => useContext(ThemeContext);
