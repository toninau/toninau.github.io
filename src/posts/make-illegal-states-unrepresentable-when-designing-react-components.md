---
title: 'Make illegal states unrepresentable when designing React components'
description: 'Representing the logic of the component using types.'
published: '2025-04-22'
updated: '2025-04-29'
---

_This post was inspired by [Designing with types: Making illegal states unrepresentable](https://fsharpforfunandprofit.com/posts/designing-with-types-making-illegal-states-unrepresentable/)._

---

Let's say we're working on a React project and we need to create a basic reusable button component.

So, we create a component that looks something like this:

```tsx
type ButtonProps = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  label?: string;
};

function Button({ label, onClick }: ButtonProps) {
  return (
    <button
      className="rounded-md bg-blue-500 px-2 py-2 text-white"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
```

It works, hooray! But as we keep working on the project, a new requirement emerges: the button component needs to be able to display an icon.

Also, buttons created using this component should **always** have an [accessible name](https://developer.mozilla.org/en-US/docs/Glossary/Accessible_name). This is especially **important** to take into consideration in cases where the button contains just an icon without any text.

So, we modify the previously created button component to fulfill this new requirement:

```tsx
type ButtonProps = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  label?: string;
  ariaLabel?: string;
  icon?: React.ReactNode;
};

function Button({ label, onClick, ariaLabel, icon }: ButtonProps) {
  return (
    <button
      className="flex gap-2 rounded-md bg-blue-500 px-2 py-2 text-white"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {icon}
      {label}
    </button>
  );
}
```

Now that the button component has support for icons, it can be used to create three different types of buttons based on different prop combinations:

1. **Text-only**: Uses `label` and `onClick`.
2. **Icon-only**: Uses `icon`, `ariaLabel` and `onClick`.
3. **Text & Icon**: Uses `label`, `icon` and `onClick`.

Here’s how it looks like to use these buttons:

```tsx
// Text-only
<Button label="Dark mode" onClick={handleClick} />

// Icon-only
<Button icon={<DarkMode />} ariaLabel="Dark mode" onClick={handleClick} />

// Text & Icon
<Button icon={<DarkMode />} label="Dark mode" onClick={handleClick} />
```

Everything seems to be working, but actually there is a **major issue** with the button component: it can be misused to create all sorts of **broken combinations**. For example, users could create buttons without an accessible name, even though every button should have one:

```tsx
// Missing 'label' or 'ariaLabel',
// meaning the button doesn't have an accessible name
<Button icon={<DarkMode />} onClick={handleClick} />
```

This happens because we have made the component's current type definition too flexible, defining every prop as optional:

```ts
type ButtonProps = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  label?: string;
  ariaLabel?: string;
  icon?: React.ReactNode;
};
```

Which doesn't seem to work very well, since it enables illegal states. Ideally, the component should be designed in a way that allows users to create only valid button types:

- **Text-only**: Should only allow the `label` prop and optionally `onClick` prop.
- **Icon-only**: Should only allow `icon` and `ariaLabel` props, and optionally `onClick` prop.
- **Text & Icon**: Should only allow `label` and `icon` props, and optionally `onClick` prop.

But is there any way to do that?

.

.

.

Well... yes, there is!

The simplest solution would be to create three different button components:

- `<TextButton />`
- `<IconButton />`
- `<TextIconButton />`

And type the relevant props in those components without using optional:

```tsx
interface ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

interface TextButtonProps extends ButtonProps {
  label: string;
}

interface IconButtonProps extends ButtonProps {
  ariaLabel: string;
  icon: React.ReactNode;
}

interface TextIconButtonProps extends ButtonProps {
  label: string;
  icon: React.ReactNode;
}
```

So that each button component explicitly defines its required props, allowing only valid button types to be created:

```tsx
// Text-only
<TextButton label="Dark mode" onClick={handleClick} />

// Icon-only
<IconButton icon={<DarkMode />} ariaLabel="Dark mode" onClick={handleClick} />

// Text & Icon
<TextIconButton icon={<DarkMode />} label="Dark mode" onClick={handleClick} />

// Error: missing 'ariaLabel'
<IconButton icon={<DarkMode />} onClick={handleClick} />
```

But let's say we'd prefer a single button component over multiple ones, what are our options then?

.

.

.

We can define a union of types that use an [optional `never` type](https://effectivetypescript.com/2021/11/11/optional-never/) to disallow certain properties:

```tsx {3, 4, 8, 15}
type TextButtonProps = {
  label: string;
  ariaLabel?: never;
  icon?: never;
};

type IconButtonProps = {
  label?: never;
  ariaLabel: string;
  icon: React.ReactNode;
};

type TextIconButtonProps = {
  label: string;
  ariaLabel?: never;
  icon: React.ReactNode;
};

type ButtonProps = (TextButtonProps | IconButtonProps | TextIconButtonProps) & {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

function Button({ label, onClick, ariaLabel, icon }: ButtonProps) {
  return (
    <button
      className="flex gap-2 rounded-md bg-blue-500 px-2 py-2 text-white"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {icon}
      {label}
    </button>
  );
}
```

Now, while having a single button component, users can still create only valid button types:

```tsx
// Text-only
<Button label="Dark mode" onClick={handleClick} />

// Icon-only
<Button icon={<DarkMode />} ariaLabel="Dark mode" onClick={handleClick} />

// Text & Icon
<Button icon={<DarkMode />} label="Dark mode" onClick={handleClick} />

// Error: missing 'label' or 'ariaLabel'
<Button icon={<DarkTheme />} onClick={handleClick} />
```

Which is what we were originally trying to achieve ✨

To wrap things up, making a component too flexible can lead to unintended misuse, and if there's nothing representing the logic of the component, how can developers be expected to use the component properly? Sure, documentation and Storybook can be a thing, but honestly, how often do people actually read them?

It's really up to you how you design your components. Maybe your use case requires flexibility but being stricter with the types and representing the logic of the component using types, can help catch "dumb" mistakes earlier and improve developer experience.
