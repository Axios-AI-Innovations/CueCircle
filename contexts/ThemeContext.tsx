import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { updateUserPreferences } from '@/store/slices/userSlice';

export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    accent: string;
  };
  fonts: {
    regular: string;
    medium: string;
    bold: string;
    dyslexia: string;
  };
}

// Create stable theme objects to prevent weak map issues
const createTheme = (name: string, colors: any, fonts: any): Theme => ({
  name,
  colors: { ...colors },
  fonts: { ...fonts }
});

export const themes: Record<string, Theme> = {
  light: createTheme('Light', {
    primary: '#4299e1',
    secondary: '#805ad5',
    background: '#f7fafc',
    surface: '#ffffff',
    text: '#2d3748',
    textSecondary: '#4a5568',
    textMuted: '#718096',
    border: '#e2e8f0',
    success: '#48bb78',
    warning: '#ed8936',
    error: '#e53e3e',
    accent: '#f6ad55',
  }, {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    dyslexia: 'OpenDyslexic',
  }),
  dark: createTheme('Dark', {
    primary: '#63b3ed',
    secondary: '#9f7aea',
    background: '#1a202c',
    surface: '#2d3748',
    text: '#ffffff',
    textSecondary: '#e2e8f0',
    textMuted: '#a0aec0',
    border: '#4a5568',
    success: '#68d391',
    warning: '#f6ad55',
    error: '#fc8181',
    accent: '#fbb6ce',
  }, {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    dyslexia: 'OpenDyslexic',
  }),
};

interface ThemeContextType {
  currentTheme: Theme;
  themeName: string;
  setTheme: (themeName: string) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  
  const [themeName, setThemeName] = useState<string>('light');
  
  const currentTheme = useMemo(() => themes[themeName] || themes.light, [themeName]);

  // Load theme from user preferences on mount
  useEffect(() => {
    if (currentUser?.preferences?.theme) {
      setThemeName(currentUser.preferences.theme);
    }
  }, [currentUser]);

  const setTheme = useMemo(() => async (newThemeName: string) => {
    setThemeName(newThemeName);
    
    // Update user preferences in Redux and Firebase
    if (currentUser) {
      dispatch(updateUserPreferences({
        userId: currentUser.id,
        preferences: {
          ...currentUser.preferences,
          theme: newThemeName
        }
      }));
    }
  }, [currentUser, dispatch]);

  const toggleTheme = useMemo(() => () => {
    const themeOrder = ['light', 'dark'];
    const currentIndex = themeOrder.indexOf(themeName);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  }, [themeName, setTheme]);

  const contextValue = useMemo(() => ({
    currentTheme,
    themeName,
    setTheme,
    toggleTheme,
  }), [currentTheme, themeName, setTheme, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
