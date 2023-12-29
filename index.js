import { useCallback, useRef, useEffect } from "react";

export const useCanvas = ({ setup, draw, options = {} }) => {
  const canvasRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const previousDeltaRef = useRef(0);
  const frameCountRef = useRef(0);

  const {
    height = 250,
    width = 250,
    fps = 120,
    pause = false,
    contextType = "2d",
    contextAttributes = {},
  } = options;

  const getContext = useCallback(() => {
    const canvas = canvasRef.current;
    return canvas.getContext(contextType, contextAttributes);
  }, [canvasRef, contextType, contextAttributes]);

  const render = useCallback(
    (currentDelta) => {
      if (!pause) {
        animationFrameIdRef.current = window.requestAnimationFrame(render);
      }

      const delta = currentDelta - previousDeltaRef.current;

      if (delta < 1000 / fps) {
        return;
      }

      previousDeltaRef.current = currentDelta;
      frameCountRef.current++;

      const context = getContext();

      if (typeof draw === "function") {
        draw({ context, time: frameCountRef.current, height, width });
      }
    },
    [draw, getContext, fps, pause],
  );

  useEffect(() => {
    if (canvasRef.current) {
      const context = getContext();
      const { canvas } = context;

      const ratio = window.devicePixelRatio || 1;

      canvas.width = width * ratio;
      canvas.height = height * ratio;

      canvas.style.width = width + "px";
      canvas.style.height = height + "px";

      context.scale(ratio, ratio);

      if (typeof setup === "function") {
        setup({ context, height, width });
      }
      render();
    }

    return () => window.cancelAnimationFrame(animationFrameIdRef.current);
  }, [canvasRef, height, width, getContext, setup, draw, render]);

  return { ref: canvasRef };
};
