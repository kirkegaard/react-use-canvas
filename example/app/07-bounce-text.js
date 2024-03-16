"use client";
import { useCanvas } from "@kirkegaard/react-use-canvas";

export function BounceText() {
  const string = "CANVAS<3";
  const size = 42;
  const spacing = 4;
  const trail = 10;
  const palette = [
    "#000000",
    // "#ffffff",
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
    "#8e111c",
  ];

  const setup = ({ context, height, width }) => {
    context.font = "50px Arial Black";
  };

  const draw = ({ context, time, height, width }) => {
    context.clearRect(0, 0, width, height);

    for (let i = 0; i < string.length; i++) {
      for (let j = 0; j <= trail; j++) {
        const t = time + i * 10 - j * 2;
        const y = j + Math.sin(t / 25) * 90 + height / 2;
        context.fillStyle = palette[j % palette.length];
        context.fillText(string.charAt(i), 10 + (size + spacing) * i, y);
      }
    }
  };

  const { ref } = useCanvas({
    setup,
    draw,
    options: { height: 300, width: 560 },
  });

  return <canvas ref={ref} />;
}
