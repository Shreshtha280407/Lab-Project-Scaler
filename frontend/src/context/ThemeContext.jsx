import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();
const initialTheme = () => {
  try {
    const saved = localStorage.getItem('shopkart-theme');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch { /* Browsers can disable local storage. */ }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('shopkart-theme', theme); } catch { /* The toggle still works without storage. */ }
  }, [theme]);
  return <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme(value => value === 'light' ? 'dark' : 'light') }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
