import { useState } from "react";
import { useCanvas } from "react-use-canvas";
import "./App.css";

function Example01() {
  const setup = ({ context }) => {
    const { width, height } = context.canvas;
    context.translate(width / 2, height / 2);
  };

  const draw = ({ context, time }) => {
    const { width, height } = context.canvas;
    context.clearRect(-width / 2, -height / 2, width, height);

    const x = Math.cos(time / 20) * 100;
    const y = Math.sin(time / 10) * 100;

    context.beginPath();
    context.arc(x, y, 10, 0, 2 * Math.PI);
    context.fillStyle = "white";
    context.fill();
  };

  const { ref } = useCanvas({ setup, draw });

  return <canvas ref={ref} />;
}

function Example02() {
  const [isPlaying, setIsPlaying] = useState(true);

  const radius = 50;

  const draw = ({ context, time }) => {
    const { width, height } = context.canvas;
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
    },
  });

  return (
    <div>
      <div>
        <input
          id="pause"
          type="checkbox"
          onClick={() => {
            setIsPlaying(!isPlaying);
          }}
        />
        <label htmlFor="pause">Pause?</label>
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
    </main>
  );
}

export default App;
