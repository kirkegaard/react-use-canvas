import { useCanvas } from "react-use-canvas";

export function States() {
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

  const { ref, pause, setFPS } = useCanvas({
    draw,
    options: {
      height: 100,
      width: 100,
    },
  });

  return (
    <div>
      <div>
        <label htmlFor="ex02pause">pause: </label>
        <input id="ex02pause" type="checkbox" onClick={pause} />
      </div>
      <div>
        <label htmlFor="ex02fps">setFPS </label>
        <select
          id="ex02fps"
          type="checkbox"
          defaultValue={120}
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
