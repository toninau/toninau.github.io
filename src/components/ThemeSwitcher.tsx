'use client';
import React, { MouseEventHandler, ReactNode, useEffect, useId, useRef, useState } from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { LightTheme, LightThemeSolid } from './icons/LightTheme';
import { DarkTheme, DarkThemeSolid } from './icons/DarkTheme';
import { DefaultTheme, DefaultThemeSolid } from './icons/DefaultTheme';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isMenuDisplayed, setIsMenuDisplayed] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);

  const themeMenuRef = useRef<HTMLUListElement | null>(null);
  const themeButtonId = useId();

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as HTMLElement)) {
        setIsMenuMounted(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  });

  const handleThemeClick: HandleThemeClick = (e) => {
    setTheme(e.currentTarget.id);
    setIsMenuMounted(false);
  };

  const toggleDisplayMenu = () => {
    setIsMenuMounted((prevValue) => !prevValue);
    if (!isMenuDisplayed) {
      setIsMenuDisplayed(true);
    }
  };

  const handleAnimationEnd = () => {
    if (!isMenuMounted) {
      setIsMenuDisplayed(false);
    }
  };

  return (
    <div className="relative">
      <button
        id={themeButtonId}
        type="button"
        className={`w-fit rounded-full bg-button px-2 py-1 text-secondary transition hover:bg-button-hover active:bg-button-active ${isMenuMounted ? 'scale-90' : ''}`}
        onClick={toggleDisplayMenu}
        aria-haspopup="dialog"
        aria-expanded={isMenuDisplayed}
      >
        <span className="dark:hidden">
          <LightTheme />
        </span>
        <span className="hidden dark:inline">
          <DarkTheme />
        </span>
        <span className="sr-only">Theme options</span>
      </button>
      {isMenuDisplayed && (
        <div aria-labelledby={themeButtonId} role="dialog" className="absolute left-1/2">
          <ul
            className={`menu-list relative -left-1/2 mt-4 flex w-fit rounded-full bg-button p-1 shadow-md ${isMenuMounted ? 'animate-fade-in' : 'animate-fade-out'}`}
            onAnimationEnd={handleAnimationEnd}
            ref={themeMenuRef}
          >
            <li className="flex items-center justify-center p-1">
              <ThemeButton id="light" onClick={handleThemeClick} theme={theme} />
            </li>
            <li className="flex items-center justify-center p-1">
              <ThemeButton id="system" onClick={handleThemeClick} theme={theme} />
            </li>
            <li className="flex items-center justify-center p-1">
              <ThemeButton id="dark" onClick={handleThemeClick} theme={theme} />
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

type HandleThemeClick = MouseEventHandler<HTMLButtonElement>;

type ThemeButtonProps = {
  id: 'system' | 'light' | 'dark';
  onClick: HandleThemeClick;
  theme?: string;
};

const themeButtonById = {
  system: {
    icon: <DefaultTheme />,
    solidIcon: <DefaultThemeSolid />,
    label: 'OS Default'
  },
  light: {
    icon: <LightTheme />,
    solidIcon: <LightThemeSolid />,
    label: 'Light'
  },
  dark: {
    icon: <DarkTheme />,
    solidIcon: <DarkThemeSolid />,
    label: 'Dark'
  }
};

function ThemeButton({ id, onClick, theme }: ThemeButtonProps) {
  return (
    <button
      id={id}
      className="group rounded-full bg-button px-2 py-1 text-secondary aria-pressed:shadow-button-pressed aria-[pressed=false]:hover:bg-button-hover aria-[pressed=false]:active:bg-button-active"
      type="button"
      onClick={onClick}
      aria-pressed={theme === id}
    >
      <span className="group-aria-[pressed=false]:hidden">{themeButtonById[id].solidIcon}</span>
      <span className="hidden group-aria-[pressed=false]:inline">{themeButtonById[id].icon}</span>
      <span className="sr-only">{themeButtonById[id].label}</span>
    </button>
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
