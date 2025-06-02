import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // 'system' | 'light' | 'dark'
  const [themeMode, setThemeMode] = useState('system');
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme() || 'light');

  useEffect(() => {
    if (themeMode === 'system') {
      const listener = ({ colorScheme }) => setColorScheme(colorScheme || 'light');
      const subscription = Appearance.addChangeListener(listener);
      setColorScheme(Appearance.getColorScheme() || 'light');
      return () => {
        if (typeof subscription?.remove === 'function') {
          subscription.remove();
        } else if (typeof subscription === 'function') {
          subscription();
        }
      };
    } else {
      setColorScheme(themeMode);
    }
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, colorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeMode = () => useContext(ThemeContext);
