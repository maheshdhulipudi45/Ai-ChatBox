import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Load saved theme (default to system)
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('theme') || 'system';
  });

  // Load saved accent color (default to indigo)
  const [accentColor, setAccentColorState] = useState(() => {
    return localStorage.getItem('accentColor') || 'violet';
  });

  // Load saved font size (default to medium)
  const [fontSize, setFontSizeState] = useState(() => {
    return localStorage.getItem('fontSize') || 'medium';
  });

  // Effect to apply theme class
  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (resolvedTheme) => {
      if (resolvedTheme === 'dark') {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
    };

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches ? 'dark' : 'light');

      const listener = (e) => {
        applyTheme(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } else {
      applyTheme(theme);
    }

    localStorage.setItem('theme', theme);
  }, [theme]);

  // Effect to apply accent color variable
  useEffect(() => {
    const root = window.document.documentElement;
    // Remove previous accent classes
    root.classList.remove('accent-indigo', 'accent-violet', 'accent-blue', 'accent-emerald', 'accent-amber');
    root.classList.add(`accent-${accentColor}`);
    localStorage.setItem('accentColor', accentColor);
  }, [accentColor]);

  // Effect to apply font size class
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    root.classList.add(`font-size-${fontSize}`);
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  const toggleTheme = () => {
    setThemeState((prev) => {
      if (prev === 'system') {
        const darkPref = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return darkPref ? 'light' : 'dark';
      }
      return prev === 'light' ? 'dark' : 'light';
    });
  };

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
  };

  const setAccentColor = (newAccent) => {
    setAccentColorState(newAccent);
  };

  const setFontSize = (newSize) => {
    setFontSizeState(newSize);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        accentColor,
        setAccentColor,
        fontSize,
        setFontSize
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
