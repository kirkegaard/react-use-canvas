"use client";
import { useRef } from "react";
import { useCanvas } from "@kirkegaard/react-use-canvas";
import { useBoundingBox } from "hooks/useBoundingBox";

export function BounceText() {
  const viewportRef = useRef(null);
  const bounds = useBoundingBox({ ref: viewportRef });

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
  const size = 45;
  const spacing = -10;
  const trail = palette.length - 1;

  const onInit = async () => {
    const fontFile = new FontFace(
      "Roboto",
      "url(https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmYUtfBBc4AMP6lQ.woff2)"
    );
    document.fonts.add(fontFile);
    await fontFile.load();
  };

  const onUpdate = () => {
    context.font = `${size}px 'Roboto'`;

    context.clearRect(0, 0, width, height);

    for (let i = 0; i < string.length; i++) {
      for (let j = 0; j <= trail; j++) {
        const t = time / 8 - i * 15 + j * 2.5;
        const y = j + Math.sin(t / 25) * 50;
        const x = (size + spacing) * i - time / 8 + t * -0.5;
        context.fillStyle = palette[j % palette.length];
        context.fillText(
          string.charAt(i),
          width + (x % width) - size / 2,
          y + height / 2
        );
      }
    }
  };

  const { ref, time, context, height, width } = useCanvas({
    onInit,
    onUpdate,
    isPlaying: true,
    height: 200,
    width: bounds.width,
  });

  return (
    <div ref={viewportRef}>
      <canvas ref={ref} />
    </div>
  );
}
