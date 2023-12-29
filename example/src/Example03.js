import { useState } from "react";
import { useCanvas } from "react-use-canvas";

export function Example03() {
  const [isPlaying, setIsPlaying] = useState(true);

  const draw = ({ context, time, height, width }) => {
    context.clearRect(0, 0, width, height);
    context.font = "14px sans-serif";
    context.fillStyle = "white";
    context.fillText(`Time count: ${time}`, 0, height / 2);
  };

  const { ref } = useCanvas({
    draw,
    options: {
      pause: !isPlaying,
      height: 50,
      width: 250,
    },
  });

  return (
    <div>
      <div>
        <input
          id="ex03pause"
          type="checkbox"
          onClick={() => {
            setIsPlaying(!isPlaying);
          }}
        />
        <label htmlFor="ex03pause">Pause?</label>
      </div>
      <canvas ref={ref} />
    </div>
  );
}
