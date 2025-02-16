---
title: 'Typing event handler functions in React components'
published: '2025-02-16'
description: 'Avoiding type repetition in event handler functions.'
---

Here's a simple React application written in JavaScript that contains a `Rating` component:

```jsx
export default function App() {
  const [rating, setRating] = useState(0);

  function handleRatingChange(value, event) {
    console.log(event);
    setRating(value);
  }

  return (
    <div>
      <Rating onChange={handleRatingChange} />
      <p>Selected rating: {rating}</p>
    </div>
  );
}

function Rating({ ratingScale = 5, onChange }) {
  const ratingId = useId();

  const ratingRange = Array(ratingScale)
    .fill(1)
    .map((value, index) => value + index);

  function handleChange(e) {
    const ratingValue = Number(e.target.value);
    onChange(ratingValue, e);
  }

  return (
    <div>
      {ratingRange.map((value) => (
        <React.Fragment key={`rating-${ratingId}-${value}`}>
          <label>
            {`${value} star${value > 1 ? 's' : ''}`}
            <input
              name={`rating-${ratingId}`}
              type="radio"
              value={value}
              onChange={handleChange}
            />
          </label>
        </React.Fragment>
      ))}
    </div>
  );
}
```

The `Rating` component renders radio buttons for each rating value, with the number of radio buttons determined by the `ratingScale` prop. When one of the radio buttons is selected, the `handleChange` function is triggered. This function calls the `onChange` function, which is also passed as a prop.

The `App` component holds the state for the currently selected rating value, which is updated using the `handleRatingChange` function. This value is then displayed in a paragraph below the `Rating` component.

Both the `App` and `Rating` components, along with the event handler functions inside them, are defined using **function declarations**.

## Switching to TypeScript

Since this blog post is about **typing** event handler functions in React components (and also because it's _probably_ more common to use TypeScript over JavaScript), let's create the same application again but this time using TypeScript and see what changes:

```tsx
export default function App() {
  const [rating, setRating] = useState(0);

  function handleRatingChange(
    value: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    console.log(event);
    setRating(value);
  }

  return (
    <div>
      <Rating onChange={handleRatingChange} />
      <p>Selected rating: {rating}</p>
    </div>
  );
}

type RatingProps = {
  ratingScale?: number;
  onChange: (
    ratingValue: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
};

function Rating({ ratingScale = 5, onChange }: RatingProps) {
  const ratingId = useId();

  const ratingRange = Array(ratingScale)
    .fill(1)
    .map((value, index) => value + index);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const ratingValue = Number(e.target.value);
    onChange(ratingValue, e);
  }

  return (
    <div>
      {ratingRange.map((value) => (
        <React.Fragment key={`rating-${ratingId}-${value}`}>
          <label>
            {`${value} star${value > 1 ? 's' : ''}`}
            <input
              name={`rating-${ratingId}`}
              type="radio"
              value={value}
              onChange={handleChange}
            />
          </label>
        </React.Fragment>
      ))}
    </div>
  );
}
```

If you have ever used TypeScript, you probably knew what to expect from these changes. The core of the application remained pretty much the same, except for the addition of type annotations.

There might not be anything visibly wrong with this version of the application, but there is definitely an issue with it... well, at least I have an issue with it.

What if the application contained multiple `Rating` components? Let's add another `Rating` component to the application:

```tsx
export default function App() {
  const [rating, setRating] = useState(0);

  function handleRatingChange(
    value: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    console.log(event);
    setRating(value);
  }

  function handleRatingChange2(
    value: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    console.log(event);
    alert(value);
  }

  return (
    <div>
      <Rating onChange={handleRatingChange} />
      <p>Selected rating: {rating}</p>
      <Rating onChange={handleRatingChange2} />
    </div>
  );
}
```

Now that there are two event handler functions for each of the `Rating` components, the issue might be a bit more obvious. **Typing the same parameters for the event handler functions can quickly become repetitive and tiresome.** This is especially the case when there can be multiple functions, each taking multiple parameters, scattered across various parts of the application.

In this case, there are only two event handler functions that take only two parameters, but it's pretty easy to imagine how much worse this can get in larger applications.

Luckily, there is a more efficient way to do this.

## Applying a type to the entire function

Function declarations aren't the only way to create a function. You can also create a function using a **function expression**.

In TypeScript, function expressions allow you to apply a type to the entire function. This means there is no need to specify a type for each parameter individually or even for the return type:

```ts
type GenerateNameFun = (nameLength: number) => string;

const generateName: GenerateNameFun = (nameLength) => {
  // ...
};
```

Let's create the same application once again, but this time using arrow function expressions for the event handler functions, applying type annotations to entire functions instead of adding type annotations to the parameters:

```tsx {4, 17-20, 24, 34}
export default function App() {
  const [rating, setRating] = useState(0);

  const handleRatingChange: ChangeRatingHandler = (value, event) => {
    console.log(event);
    setRating(value);
  };

  return (
    <div>
      <Rating onChange={handleRatingChange} />
      <p>Selected rating: {rating}</p>
    </div>
  );
}

type ChangeRatingHandler = (
  ratingValue: number,
  event: React.ChangeEvent<HTMLInputElement>
) => void;

type RatingProps = {
  ratingScale?: number;
  onChange: ChangeRatingHandler;
};

function Rating({ ratingScale = 5, onChange }: RatingProps) {
  const ratingId = useId();

  const ratingRange = Array(ratingScale)
    .fill(1)
    .map((value, index) => value + index);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const ratingValue = Number(e.target.value);
    onChange(ratingValue, e);
  };

  return (
    <div>
      {ratingRange.map((value) => (
        <React.Fragment key={`rating-${ratingId}-${value}`}>
          <label>
            {`${value} star${value > 1 ? 's' : ''}`}
            <input
              name={`rating-${ratingId}`}
              type="radio"
              value={value}
              onChange={handleChange}
            />
          </label>
        </React.Fragment>
      ))}
    </div>
  );
}
```

There are a couple of important changes:

1. The `Rating` component now provides a `ChangeRatingHandler` type that is used when creating an `onChange` event handler function for the component.
2. The `Rating` component now uses the `ChangeEventHandler` type provided by React (`@types/react`) for typing the input's `onChange` event handler function.

Creating `onChange` event handler functions for the `Rating` component becomes much easier with the new `ChangeRatingHandler` type:

```tsx
const handleRatingChange1: ChangeRatingHandler = (value, event) => {
  // ...
};

const handleRatingChange2: ChangeRatingHandler = (value) => {
  // ...
};

const handleRatingChange3: ChangeRatingHandler = (_, event) => {
  // ...
};
```

When creating custom UI components, you should **always provide a type for the event handler functions**, especially for components that will be used throughout the application, because this makes using the component much simpler and improves the overall developer experience.

Also, it's worth repeating that React (`@types/react`) provides event handler types, such as `ChangeEventHandler` and `MouseEventHandler`, for [React Dom Components](https://react.dev/reference/react-dom/components). These types can be applied to the entire function, meaning there is no need to specify `ChangeEvent` or `MouseEvent` as parameter types.

To maintain consistency, I always create components using function declarations and the functions defined inside the components with arrow functions.

## TL;DR

When creating custom UI components that will be used throughout the application, always provide types for the event handler functions. Use arrow functions for the event handler functions and apply the type to the entire function rather than typing each parameter individually:

```tsx
// don't do this
function handleRatingChange(
  value: number,
  event: React.ChangeEvent<HTMLInputElement>
) {
  console.log(event);
  setRating(value);
}

// do this
type ChangeRatingHandler = (
  ratingValue: number,
  event: React.ChangeEvent<HTMLInputElement>
) => void;

const handleRatingChange: ChangeRatingHandler = (value, event) => {
  console.log(event);
  setRating(value);
};
```
