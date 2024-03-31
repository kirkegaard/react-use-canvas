"use client";
import { useCanvas, Vec2, Vec3 } from "@kirkegaard/react-use-canvas";

export function Math() {
  const setup = ({ context, height, width }) => {
    console.log("setup");
    const vec2 = new Vec2(0, 0);
    const vec3 = new Vec3(0, 0, 0);
    console.log(vec2, vec3);
  };

  const draw = ({ context, time, height, width }) => {
    // context.clearRect(-width / 2, -height / 2, width, height);
  };

  const { ref } = useCanvas({ setup, draw });

  return <canvas ref={ref} />;
}
