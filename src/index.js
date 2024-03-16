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
    [draw, getContext, fps, isPaused, height, width]
  );

  useEffect(() => {
    if (canvasRef.current) {
      const context = getContext();
      if (context) {
        const { canvas } = context;

        if (contextType === "2d") {
          const ratio = window.devicePixelRatio || 1;

          canvas.setAttribute("width", width * ratio);
          canvas.setAttribute("height", height * ratio);

          context.scale(ratio, ratio);
        } else {
          canvas.setAttribute("width", width);
          canvas.setAttribute("height", height);
        }

        canvas.style.width = width + "px";
        canvas.style.height = height + "px";

        if (typeof setup === "function") {
          setup({ context, height, width });
        }
        render();
      } else {
        throw Error(
          `Unable to get context of type "${contextType}". Is webgl enabled?`
        );
      }
    }

    return () => window.cancelAnimationFrame(animationFrameIdRef.current);
  }, [canvasRef, contextType, height, width, getContext, setup, draw, render]);

  return {
    ref: canvasRef,
    pause: () => setIsPaused(!isPaused),
    isPaused,
    setIsPaused,
    fps,
    setFPS,
  };
};
