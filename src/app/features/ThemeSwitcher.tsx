'use client';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { DarkThemeIcon } from '@/components/icons/ThemeIcon';
import { ReactNode, useRef, useState } from 'react';
import { SystemThemeIcon, LightThemeIcon } from '@/components/icons/ThemeIcon';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const themeMenuRef = useRef(null);

  const handleThemeClick = (theme: string) => {
    setMenuOpen(false);
    setTheme(theme);
  };

  return (
    <div>
      <button
        className="w-fit rounded-full bg-button-base px-2 py-1 text-secondary"
        onClick={() => setMenuOpen((prevValue) => !prevValue)}
      >
        <div className="dark:hidden">
          <LightThemeIcon />
        </div>
        <div className="hidden dark:block">
          <DarkThemeIcon />
        </div>
        <span className="sr-only">Toggle theme</span>
      </button>
      {menuOpen && (
        <nav
          className="absolute left-0 right-0 m-auto mt-1 w-fit rounded-full bg-button-base p-1"
          ref={themeMenuRef}
        >
          <ul className="flex">
            <li>
              <button
                className={`rounded-full bg-button-base px-2 py-1 text-secondary ${theme === 'system' ? 'bg-white/55' : ''}`}
                onClick={() => handleThemeClick('system')}
              >
                <SystemThemeIcon />
                <span className="sr-only">OS Default</span>
              </button>
            </li>
            <li>
              <button
                className={`rounded-full bg-button-base px-2 py-1 text-secondary ${theme === 'light' ? 'bg-white/55' : ''}`}
                onClick={() => handleThemeClick('light')}
              >
                <LightThemeIcon />
                <span className="sr-only">Light</span>
              </button>
            </li>
            <li>
              <button
                className={`rounded-full bg-button-base px-2 py-1 text-secondary ${theme === 'dark' ? 'bg-white/55' : ''}`}
                onClick={() => handleThemeClick('dark')}
              >
                <DarkThemeIcon />
                <span className="sr-only">Dark</span>
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
