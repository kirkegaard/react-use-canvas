import { useState } from "react";
import { useCanvas } from "react-use-canvas";

export function Example02() {
  const [isPlaying, setIsPlaying] = useState(true);

  const radius = 50;

  const draw = ({ context, time, height, width }) => {
    context.clearRect(0, 0, width, height);

    context.save();

    context.translate(width / 2, height / 2);

    context.rotate(Math.sin((time / 2000) * Math.PI * 45));

    context.beginPath();
    context.rect(-radius / 2, -radius / 2, radius, radius);
    context.fillStyle = "rgba(255,255,255,0.2)";
    context.strokeStyle = "white";
    context.stroke();
    context.fill();

    context.restore();
  };

  const { ref } = useCanvas({
    draw,
    options: {
      pause: !isPlaying,
      height: 100,
      width: 100,
    },
  });

  return (
    <div>
      <div>
        <input
          id="ex02pause"
          type="checkbox"
          onClick={() => {
            setIsPlaying(!isPlaying);
          }}
        />
        <label htmlFor="ex02pause">Pause?</label>
      </div>
      <canvas ref={ref} />
    </div>
  );
}
