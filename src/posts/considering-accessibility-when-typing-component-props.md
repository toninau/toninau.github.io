---
title: 'TODO: Considering accessibility when typing component props'
published: '2025-02-25'
description: 'TODO: Making illegal states unrepresentable.'
---

> Onko propsien tyypitys paapointti vai komponentointi?

For the purpose of this blog post I'm using buttons as an example, dividing them into three different categories:

1. Buttons with just text
2. Buttons with just an icon
3. Buttons with both text and an icon

## Buttons with just text

There isn't anything special about this button, this is the most basic form of a button:

```tsx
<button>Dark theme</button>
```

The button doesn't do anything since there is no `onClick` event handler, but the button is is visible and most importantly, it has an [accessible name](https://developer.mozilla.org/en-US/docs/Glossary/Accessible_name).

TODO: Label or accessible name?

## Buttons with just an icon

The second type of button has just an icon. The icon doesn't have any text in it, and since there is no text either, there is no way to derive accessible name for the button.

```tsx
<button>
  <DarkThemeIcon />
</button>
```

This can be fixed using `aria-label`, so let's add the label:

```tsx
<button aria-label="Dark theme">
  <DarkThemeIcon />
</button>
```

## Buttons with both text and an icon

The third type of button has both text and an icon, because there is text content, there is no need to provide `aria-label`:

```tsx
<button>
  <DarkThemeIcon /> Dark theme
</button>
```

## Creating a button component

Should there be multiple different components? Or should there be only one component?

If creating only one component how to type it? Union? Tagged union? No, we using optional `never` trick!

## The whole thing

```tsx
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
```

Component usage:

```tsx
export default function App() {
  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
    console.log('button clicked!');
  };

  return (
    <>
      {/** Button with just text */}
      <Button label="Dark theme" onClick={handleClick} />
      {/** Button with just icon */}
      <Button
        icon={<DarkTheme />}
        ariaLabel="Dark theme"
        onClick={handleClick}
      />
      {/** Button with text and icon */}
      <Button icon={<DarkTheme />} label="Dark theme" onClick={handleClick} />
    </>
  );
}
```

It isn't possible to create an icon button that is missing the label. This results in type error:
