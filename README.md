[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/tanguyMichardiere/hooks/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/@tanguymichardiere/hooks.svg?style=flat)](https://www.npmjs.com/package/@tanguymichardiere/hooks)

A lightweight personal collection of React hooks, with only one dependency: React

# Installation

```shell
npm install @tanguymichardiere/hooks
yarn add @tanguymichardiere/hooks
```

# Usage

## Modals

Push and pop modals to and from the screen (like a stack)

Make sure to wrap any component that wishes to push modals (typically your entire app) in a `ModalProvider`:

```tsx
export default function App() {
  return <ModalProvider>{/* your app */}</ModalProvider>;
}
```

```tsx
const modals = useModals();
return (
  <button
    onClick={function () {
      modals.push(
        <div>
          <h2>Modal</h2>
          <button onClick={modals.pop}>Close modal</button>
        </div>
      );
    }}
  >
    Show modal
  </button>
);
```

## Matrix

Render a Matrix-like rain of green characters on a black background in a canvas

```tsx
const matrix = useMatrix();
return <canvas ref={matrix} />;
```

## Interval

```tsx
const [count, setCount] = useState(0);
useInterval(function () {
  setCount((count) => count + 1);
}, 1000);
return <div>{count}</div>;
```

The interval can be dynamic too:

```tsx
const [ms, setMs] = useState(1000);
useInterval(function () {
  setMs((ms) => ms * 2);
}, ms);
return <div>{ms}</div>;
```

## Toggle

```tsx
const [showMenu, toggleShowMenu] = useToggle();
return (
  <>
    <button onClick={toggleShowMenu}>Menu</button>
    {showMenu && <Menu />}
  </>
);
```

## TextInput

```tsx
const name = useTextInput();
return <input type="text" {...name} />;
```

## Checkbox

```tsx
const checkbox = useCheckbox();
return <input type="checkbox" {...checkbox} />;
```
