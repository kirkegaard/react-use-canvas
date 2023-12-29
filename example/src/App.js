import { useState } from "react";
import { useCanvas } from "react-use-canvas";
import "./App.css";

function Example01() {
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

function Example02() {
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

function Example03() {
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

function App() {
  return (
    <main>
      <h1>useCanvas</h1>
      <p>
        A tiny hook that'll help you write neat canvas things. If you're
        familiar with processing it might seem familiar :)
      </p>
      <h2>Example01</h2>
      <Example01 />
      <h2>Example02</h2>
      <Example02 />
      <h2>Example03</h2>
      <Example03 />
    </main>
  );
}

export default App;
