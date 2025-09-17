import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const THEME_STORAGE_KEY = 'ks-theme';

export type ThemeMode = 'light' | 'dark';

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
  if (stored === 'light' || stored === 'dark') return stored;
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => getInitialTheme());

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-md border transition-colors ${
        theme === 'dark' 
          ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90' 
          : 'bg-background text-foreground border-border hover:bg-accent'
      }`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      <span className="text-sm">{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </button>
  );
};

export default ThemeToggle;


