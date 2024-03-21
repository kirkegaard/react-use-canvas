"use client";
import { useCanvas } from "@kirkegaard/react-use-canvas";

export function Simple() {
  const radius = 20;

  const onInit = () => {
    context.translate(width / 2, height / 2);
  };

  const onUpdate = () => {
    context.clearRect(-width / 2, -height / 2, width, height);

    const x = (Math.cos(time * 1.25) * (radius * 2 - width)) / 2;
    const y = (Math.sin(time * 2.5) * (radius * 2 - height)) / 2;

    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fillStyle = "white";
    context.fill();
  };

  const { ref, context, time, height, width } = useCanvas({ onInit, onUpdate });

  return <canvas ref={ref} />;
}
