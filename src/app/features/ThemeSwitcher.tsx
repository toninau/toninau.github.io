'use client';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { ReactNode, useRef, useState } from 'react';
import { SystemThemeIcon, LightThemeIcon, DarkThemeIcon } from '@/components/icons/ThemeIcon';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [displayMenu, setDisplayMenu] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const themeMenuRef = useRef(null);

  const handleThemeClick = (theme: string) => {
    setTheme(theme);
    setIsMenuMounted(false);
  };

  const toggleDisplayMenu = () => {
    setIsMenuMounted((prevValue) => !prevValue);
    if (!displayMenu) {
      setDisplayMenu(true);
    }
  };

  const handleAnimationEnd = () => {
    if (!isMenuMounted) {
      setDisplayMenu(false);
    }
  };

  return (
    <div className="relative">
      <button
        className="w-fit rounded-full bg-button-base px-2 py-1 text-secondary"
        onClick={toggleDisplayMenu}
      >
        <div className="dark:hidden">
          <LightThemeIcon />
        </div>
        <div className="hidden dark:block">
          <DarkThemeIcon />
        </div>
        <span className="sr-only">Toggle theme</span>
      </button>
      {displayMenu && (
        <nav
          className={`absolute left-1/2 mt-1 w-fit -translate-x-1/2 rounded-full bg-button-base px-2 py-1 ${isMenuMounted ? 'animate-fade-in' : 'animate-fade-out'}`}
          onAnimationEnd={handleAnimationEnd}
          ref={themeMenuRef}
        >
          <ul className="flex">
            <li className="p-1">
              <button
                className={`rounded-full bg-button-base px-2 py-1 text-secondary ${theme === 'system' ? 'bg-white/55' : ''}`}
                onClick={() => handleThemeClick('system')}
              >
                <SystemThemeIcon />
                <span className="sr-only">OS Default</span>
              </button>
            </li>
            <li className="p-1">
              <button
                className={`rounded-full bg-button-base px-2 py-1 text-secondary ${theme === 'light' ? 'bg-white/55' : ''}`}
                onClick={() => handleThemeClick('light')}
              >
                <LightThemeIcon />
                <span className="sr-only">Light</span>
              </button>
            </li>
            <li className="p-1">
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
