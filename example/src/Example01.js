import { useState } from "react";
import { useCanvas } from "react-use-canvas";

export function Example01() {
  const [fps, setFPS] = useState(60);

  const setup = ({ context, height, width }) => {
    context.translate(width / 2, height / 2);
  };

  const draw = ({ context, time, height, width }) => {
    context.clearRect(-width / 2, -height / 2, width, height);

    const x = Math.cos(time / 20) * 100;
    const y = Math.sin(time / 10) * 100;

    context.beginPath();
    context.arc(x, y, 10, 0, 2 * Math.PI);
    context.fillStyle = "white";
    context.fill();
  };

  const { ref } = useCanvas({ setup, draw, options: { fps } });

  return (
    <div>
      <div>
        <label htmlFor="ex01fps">FPS </label>
        <select
          id="ex01fps"
          type="checkbox"
          defaultValue={60}
          onChange={(e) => {
            setFPS(parseInt(e.target.value));
          }}
        >
          <option value="5">5</option>
          <option value="15">15</option>
          <option value="30">30</option>
          <option value="60">60</option>
          <option value="120">120</option>
          <option value="240">240</option>
        </select>
      </div>
      <canvas ref={ref} />
    </div>
  );
}
