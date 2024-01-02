import { useCanvas } from "@kirkegaard/react-use-canvas";

export function Props() {
  const draw = ({ context, time, height, width, isPaused, fps }) => {
    context.clearRect(0, 0, width, height);
    context.font = "14px sans-serif";
    context.fillStyle = "white";

    const lineHeight = 16;

    context.fillText(`Frame count: ${time}`, 0, lineHeight);
    context.fillText(`Size: ${width}x${height}`, 0, lineHeight * 2);
    context.fillText(`FPS: ${fps}`, 0, lineHeight * 3);
    context.fillText(`Is paused: ${isPaused}`, 0, lineHeight * 4);
  };

  const { ref, isPaused, setIsPaused } = useCanvas({
    draw,
    options: {
      height: 70,
      width: 250,
    },
  });

  return (
    <div>
      <div>
        <label htmlFor="ex03pause">Is paused:</label>
        <input
          id="ex03pause"
          type="checkbox"
          onClick={() => {
            setIsPaused(!isPaused);
          }}
        />
      </div>
      <canvas ref={ref} />
    </div>
  );
}
