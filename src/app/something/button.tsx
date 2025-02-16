'use client';
import { DarkTheme } from '@/components/icons/DarkTheme';
import { MouseEventHandler, ReactNode } from 'react';

type TextButton = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  label: string;
  ariaLabel?: never;
  icon?: never;
};

type IconButton = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  label?: never;
  ariaLabel: string;
  icon: ReactNode;
};

type TextIconButton = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  label: string;
  ariaLabel?: never;
  icon: ReactNode;
};

type ButtonProps = TextButton | IconButton | TextIconButton;

function Button({ label, onClick, ariaLabel, icon }: ButtonProps) {
  return (
    <button
      className="flex bg-green-300 px-2 py-1 text-black"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {icon} {label}
    </button>
  );
}

export default function App() {
  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
    console.log('button clicked!');
  };

  return (
    <>
      {/** Button with just text */}
      <Button label="Dark theme" onClick={handleClick} />
      {/** Button with just icon */}
      <Button icon={<DarkTheme />} ariaLabel="Dark theme" onClick={handleClick} />
      {/** Button with text and icon */}
      <Button icon={<DarkTheme />} label="Dark theme" onClick={handleClick} />
    </>
  );
}
