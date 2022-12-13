# useBetterEffect

A wrapper around `React.useEffect` but with improved API

## Installation

With Yarn:

```bash
yarn add use-better-effect
```

With npm:

```bash
npm install --save use-better-effect
```

## Background

`useEffect` is a powerful tool but the API has some gotchas. See the following examples:

```ts
// someFn runs on every render
useEffect(() => someFn());

// someFn only run on mount
useEffect(() => someFn(), []);

// someFn rerun when a or b changes
useEffect(() => someFn(), [a, b]);

// the returned function of the passed in callback function is called on mount.
useEffect(() => {
  someFn();
  return () => anotherFn();
}, [a, b]);
```

These implicit behaviors are hard to understand by just looking at the code.

## Improved API

`useBetterEffect` uses typescript function overloading to improve the developer experience when using the effect for different conditions. There are 3 supports run conditions:

- ON_MOUNT
- EVERY_RENDER
- DEPENDENCIES_CHANGED

For `ON_MOUNT` and `EVERY_RENDER`, passing in dependencies will result in a type error and `useBetterEffect` auto computes the dependency argument as `[]` and `undefined` respectively.

The cleanup function is passing as an explict optional arugment.

## Examples

```ts
import { useBetterEffect } from "use-better-effect";

useBetterEffect({
  callbackFn: () => console.log("yay better"),
  cleanupFn: () => console.log("so fresh and so clean"),
  runCondition: "ON_MOUNT",
});

useBetterEffect({
  callbackFn: () => console.log("yay better"),
  cleanupFn: () => console.log("so fresh and so clean"),
  runCondition: "EVERY_RENDER",
});

useBetterEffect({
  callbackFn: () => console.log("yay better"),
  cleanupFn: () => console.log("so fresh and so clean"),
  runCondition: "DEPENDENCIES_CHANGED",
  dependencies: [count],
});
```
