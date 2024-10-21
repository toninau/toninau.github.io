'use client';
import { ReactNode, useId, useRef, useState } from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { LightThemeIcon, DarkThemeIcon, SystemThemeIcon } from '@/components/icons/ThemeIcon';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [displayMenu, setDisplayMenu] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);

  const menuRef = useRef(null);
  const menuId = useId();

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
        type="button"
        className="w-fit rounded-full bg-button-base px-2 py-1 text-secondary"
        onClick={toggleDisplayMenu}
        aria-haspopup="menu"
        aria-controls={menuId}
      >
        <div className="dark:hidden">
          <LightThemeIcon />
        </div>
        <div className="hidden dark:block">
          <DarkThemeIcon />
        </div>
        <span className="sr-only">Switch theme</span>
      </button>
      {displayMenu && (
        <ul
          id={menuId}
          aria-label="Theme options"
          role="menu"
          className={`menu-list absolute left-1/2 mt-3 flex w-fit -translate-x-1/2 rounded-full bg-button-base px-2 py-1 ${isMenuMounted ? 'animate-fade-in' : 'animate-fade-out'}`}
          onAnimationEnd={handleAnimationEnd}
          ref={menuRef}
        >
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
