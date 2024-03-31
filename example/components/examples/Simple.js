"use client";

import { useRef } from "react";
import { useCanvas } from "@kirkegaard/react-use-canvas";
import { useBoundingBox } from "hooks/useBoundingBox";

export const randomFloat = (min, max) => {
  return Math.random() * (max - min) + min;
};

export function Simple() {
  const viewportRef = useRef(null);
  const bounds = useBoundingBox({ ref: viewportRef });

  const frameTime = useRef(1);
  const lastTime = useRef(1);

  const fps = useRef(0);
  const radius = 20;

  const onInit = () => {};

  const onUpdate = () => {
    frameTime.current = time - lastTime.current;
    lastTime.current = time;

    context.clearRect(0, 0, width, height);

    context.fillStyle = "white";

    context.save();
    context.translate(width / 2, height / 2);

    const x = (Math.cos((time / 1000) * 2.25) * (radius * 2 - width)) / 2;
    const y = (Math.sin((time / 1000) * 4.5) * (radius * 2 - height)) / 2;

    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fill();
    context.restore();
  };

  const { ref, context, time, height, width } = useCanvas({
    onInit,
    onUpdate,
    // onComplete: () => ({
    //   shouldRepeat: true,
    //   newStartAt: randomFloat(0, 2000),
    // }),
    // duration: 2000,
    startAt: 0,
    width: bounds.width,
    height: 300,
    updateInterval: 1 / 120,
  });

  return (
    <div ref={viewportRef}>
      <div>FPS: {Math.round(1000 / frameTime.current)}</div>
      <div>Frame time: {frameTime.current.toFixed(4)}</div>
      <div>Time: {(time / 1000).toFixed(2)}</div>
      <canvas ref={ref} />
    </div>
  );
}
