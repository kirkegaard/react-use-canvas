import { useCanvas } from "@kirkegaard/react-use-canvas";

export function Simple() {
  const radius = 20;

  const setup = ({ context, height, width }) => {
    context.translate(width / 2, height / 2);
  };

  const draw = ({ context, time, height, width }) => {
    context.clearRect(-width / 2, -height / 2, width, height);

    const x = (Math.cos(time / 20) * (radius * 2 - width)) / 2;
    const y = (Math.sin(time / 10) * (radius * 2 - height)) / 2;

    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fillStyle = "white";
    context.fill();
  };

  const { ref } = useCanvas({ setup, draw });

  return <canvas ref={ref} />;
}
