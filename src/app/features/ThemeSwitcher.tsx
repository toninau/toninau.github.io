'use client';
import React, { MouseEventHandler, ReactNode, useEffect, useId, useRef, useState } from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import {
  LightThemeIcon,
  DarkThemeIcon,
  DarkThemeSolidIcon,
  SystemThemeIcon,
  SystemThemeSolidIcon,
  LightThemeSolidIcon
} from '@/components/icons/ThemeIcon';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isMenuDisplayed, setIsMenuDisplayed] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);

  const themeMenuRef = useRef<HTMLUListElement | null>(null);
  const themeMenuId = useId();
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
        className="w-fit rounded-full bg-button px-2 py-1 text-secondary hover:bg-button-hover focus:outline-none focus:ring focus:ring-blue-300 active:bg-button-active"
        onClick={toggleDisplayMenu}
        aria-haspopup={true}
        aria-controls={themeMenuId}
        aria-expanded={isMenuDisplayed}
      >
        <span className="dark:hidden">
          <LightThemeIcon />
        </span>
        <span className="hidden dark:inline">
          <DarkThemeIcon />
        </span>
        <span className="sr-only">Theme options</span>
      </button>
      {isMenuDisplayed && (
        <ul
          id={themeMenuId}
          className={`menu-list absolute left-1/2 mt-3 flex w-fit -translate-x-1/2 rounded-full bg-button p-1 shadow-md ${isMenuMounted ? 'animate-fade-in' : 'animate-fade-out'}`}
          onAnimationEnd={handleAnimationEnd}
          ref={themeMenuRef}
          aria-labelledby={themeButtonId}
          role="dialog"
        >
          <li className="flex items-center justify-center p-1">
            <ThemeButton id="system" onClick={handleThemeClick} theme={theme} />
          </li>
          <li className="flex items-center justify-center p-1">
            <ThemeButton id="light" onClick={handleThemeClick} theme={theme} />
          </li>
          <li className="flex items-center justify-center p-1">
            <ThemeButton id="dark" onClick={handleThemeClick} theme={theme} />
          </li>
        </ul>
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
    icon: <SystemThemeIcon />,
    solidIcon: <SystemThemeSolidIcon />,
    label: 'OS Default'
  },
  light: {
    icon: <LightThemeIcon />,
    solidIcon: <LightThemeSolidIcon />,
    label: 'Light'
  },
  dark: {
    icon: <DarkThemeIcon />,
    solidIcon: <DarkThemeSolidIcon />,
    label: 'Dark'
  }
};

function ThemeButton({ id, onClick, theme }: ThemeButtonProps) {
  return (
    <button
      id={id}
      className="group rounded-full bg-button px-2 py-1 text-secondary hover:bg-button-hover focus:outline-none focus:ring focus:ring-blue-300 active:bg-button-active aria-pressed:text-blue-400 aria-pressed:shadow-inner"
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
