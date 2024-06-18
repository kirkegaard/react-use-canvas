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

Check the [example folder](https://github.com/kirkegaard/react-use-canvas/tree/main/example)

## Usage

```jsx
function Example() {
  const { ref, context, time, height, width } = useCanvas({ 
    // The initial setup function
    onInit,

    // Called every update interval
    onUpdate,

    // Called every completed loop. Return an object to loop the animation.
    onComplete,

    // The frame to start the animation at
    startAt: 0,

    // Duration of the animation
    duration: 2000,

    // Dimensions of the canvas 
    width: 300,
    height: 150,

    // The update interval or FPS if you want
    updateInterval: 1 / 120
  });

  function onInit () {}

  function onUpdate () {}

  function onComplete () {
    return {
      shouldRepeat: true,
      newStartAt: 1000
    }
  }

  return <canvas ref={ref} />;
}
```
