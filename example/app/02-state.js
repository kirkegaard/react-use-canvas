"use client";

import { useState } from "react";
import { useCanvas } from "@kirkegaard/react-use-canvas";

export function States() {
  const [isPlaying, setIsPlaying] = useState(true);

  const radius = 50;

  const onUpdate = () => {
    context.clearRect(0, 0, width, height);

    context.save();

    context.translate(width / 2, height / 2);

    context.rotate(Math.sin(time * 0.04 * Math.PI * 45));

    context.beginPath();
    context.rect(-radius / 2, -radius / 2, radius, radius);
    context.fillStyle = "rgba(255,255,255,0.2)";
    context.strokeStyle = "white";
    context.stroke();
    context.fill();

    context.restore();
  };

  const { ref, context, time, height, width } = useCanvas({
    onUpdate,
    isPlaying,
    height: 100,
    width: 100,
  });

  return (
    <div>
      <div>
        <label htmlFor="ex02pause">isPlaying: </label>
        <input
          id="ex02pause"
          type="checkbox"
          defaultChecked={isPlaying}
          onClick={() => setIsPlaying(!isPlaying)}
        />
      </div>
      <canvas ref={ref} />
    </div>
  );
}
