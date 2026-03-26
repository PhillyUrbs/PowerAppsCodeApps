import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface ThemeContextValue {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('part11-theme');
    return stored ? stored === 'dark' : true;
  });

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('part11-theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
