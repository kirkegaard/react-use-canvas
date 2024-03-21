"use client";
import { useCanvas } from "@kirkegaard/react-use-canvas";

export function BounceText() {
  const palette = [
    "#223e37",
    "#38675b",
    "#467f71",
    "#58a789",
    "#97c8b5",
    "#fff4bf",
    "#ffe87a",
    "#ffca53",
    "#ff893b",
    "#e52738",
  ];

  const string = "CANVAS<3";
  const size = 42;
  const spacing = 4;
  const trail = palette.length - 1;

  const setup = ({ context }) => {
    context.font = "bold 50px Arial Black";
  };

  const draw = ({ context, time, height, width }) => {
    context.clearRect(0, 0, width, height);

    for (let i = 0; i < string.length; i++) {
      for (let j = 0; j <= trail; j++) {
        const t = time - i * 15 + j * 2.5;
        const y = j + Math.sin(t * 0.05) * 50;
        const x = (size + spacing) * i - time * 2;
        context.fillStyle = palette[j % palette.length];
        context.fillText(
          string.charAt(i),
          width + (x % width) - size / 2,
          y + height / 2
        );
      }
    }
  };

  const { ref } = useCanvas({
    setup,
    draw,
    options: { height: 200, width: 500 },
  });

  return <canvas ref={ref} />;
}
