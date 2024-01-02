"use client";

import { useCallback, useRef, useEffect, useState } from "react";

export const useCanvas = ({ setup, draw, options = {} }) => {
  const canvasRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const previousDeltaRef = useRef(0);
  const frameCountRef = useRef(0);

  const {
    height = 250,
    width = 250,
    contextType = "2d",
    contextAttributes = {},
    ...otherOptions
  } = options;

  const [fps, setFPS] = useState(otherOptions.fps || 120);
  const [isPaused, setIsPaused] = useState(false);

  const getContext = useCallback(() => {
    const canvas = canvasRef.current;
    return canvas ? canvas.getContext(contextType, contextAttributes) : null;
  }, [canvasRef, contextType, contextAttributes]);

  const render = useCallback(
    (currentDelta) => {
      if (!isPaused) {
        animationFrameIdRef.current = window.requestAnimationFrame(render);
      }

      const delta = currentDelta - previousDeltaRef.current;

      if (delta < 1000 / fps) {
        return;
      }

      previousDeltaRef.current = currentDelta;
      frameCountRef.current++;

      const context = getContext();

      if (context && typeof draw === "function") {
        draw({
          context,
          time: frameCountRef.current,
          height,
          width,
          fps,
          isPaused,
        });
      }
    },
    [draw, getContext, fps, isPaused]
  );

  useEffect(() => {
    if (canvasRef.current) {
      const context = getContext();
      const { canvas } = context;

      if (contextType === "2d") {
        const ratio = window.devicePixelRatio || 1;

        canvas.width = width * ratio;
        canvas.height = height * ratio;

        context.scale(ratio, ratio);
      } else {
        canvas.width = width;
        canvas.height = height;
      }

      canvas.style.width = width + "px";
      canvas.style.height = height + "px";

      if (typeof setup === "function") {
        setup({ context, height, width });
      }
      render();
    }

    return () => window.cancelAnimationFrame(animationFrameIdRef.current);
  }, [canvasRef, height, width, getContext, setup, draw, render]);

  return {
    ref: canvasRef,
    pause: () => setIsPaused(!isPaused),
    isPaused,
    setIsPaused,
    fps,
    setFPS,
  };
};
