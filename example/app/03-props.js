"use client";

import { useState } from "react";
import { useCanvas } from "@kirkegaard/react-use-canvas";

export function Props() {
  const [isPlaying, setIsPlaying] = useState(true);

  const onUpdate = () => {
    context.clearRect(0, 0, width, height);
    context.font = "14px sans-serif";
    context.fillStyle = "white";

    const lineHeight = 16;

    context.fillText(`Time: ${time}`, 0, lineHeight);
    context.fillText(`Size: ${width}x${height}`, 0, lineHeight * 2);
  };

  const { ref, context, time, height, width } = useCanvas({
    onUpdate,
    isPlaying,
    height: 50,
    width: 250,
  });

  return (
    <div>
      <div>
        <label htmlFor="ex03pause">Is playing: </label>
        <input
          id="ex03pause"
          type="checkbox"
          defaultChecked={isPlaying}
          onClick={() => {
            setIsPlaying(!isPlaying);
          }}
        />
      </div>
      <canvas ref={ref} />
    </div>
  );
}
