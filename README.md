# react-use-canvas

A tiny react hook for rendering canvas.

## Installation

```
yarn add @kirkegaard/react-use-canvas
```

or

```
npm i @kirkegaard/react-use-canvas
```

## Examples

Check the [example folder](https://github.com/kirkegaard/react-use-canvas/tree/main/example/src/examples)

## Usage

```jsx
function Example() {
  const setup = ({ context, height, width }) => {};
  const draw = ({ context, time, height, width }) => {};

  const { ref } = useCanvas({ setup, draw });

  return <canvas ref={ref} />;
}
```
