// src/contexts/themeContext.tsx
import { createContext, useState, useContext, type ReactNode, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '../styles/themes';
import { type DefaultTheme } from 'styled-components'; 

interface ThemeContextData {
  themeName: 'light' | 'dark';
  theme: DefaultTheme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeName, setThemeName] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setThemeName(savedTheme);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeName(prefersDark ? 'dark' : 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newThemeName = themeName === 'light' ? 'dark' : 'light';
    setThemeName(newThemeName);
    localStorage.setItem('theme', newThemeName);
  };

  const currentTheme = themeName === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ themeName, theme: currentTheme, toggleTheme }}>
      <StyledThemeProvider theme={currentTheme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
export const useTheme = () => {
  return useContext(ThemeContext);
};