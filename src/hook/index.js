"use client";

import { useCallback, useRef, useEffect, useState } from "react";

export const useCanvas = ({
  duration,
  isPlaying = true,
  startAt = 0,
  updateInterval = 0,

  onInit,
  onUpdate,
  onComplete,

  height = 250,
  width = 250,

  contextType = "2d",
  contextAttributes = {},
}) => {
  const [time, setTime] = useState(startAt);
  const [context, setContext] = useState(null);

  const canvasRef = useRef(null);
  const elapsedTimeRef = useRef(0);
  const startAtRef = useRef(startAt);
  const totalElapsedTimeRef = useRef(startAt * -1000);
  const requestFrameRef = useRef(null);
  const previousTimeRef = useRef(null);
  const repeatTimeoutRef = useRef(null);

  const loop = useCallback((time) => {
    const timeSec = time / 1000;
    if (previousTimeRef.current === null) {
      previousTimeRef.current = timeSec;
      requestFrameRef.current = requestAnimationFrame(loop);
      return;
    }

    const deltaTime = timeSec - previousTimeRef.current;
    const currentElapsedTime = elapsedTimeRef.current + deltaTime;

    previousTimeRef.current = timeSec;
    elapsedTimeRef.current = currentElapsedTime;

    const currentDisplayTime =
      startAtRef.current +
      (updateInterval === 0
        ? currentElapsedTime
        : ((currentElapsedTime / updateInterval) | 0) * updateInterval);

    const totalTime = startAtRef.current + currentElapsedTime;
    const isCompleted = typeof duration === "number" && totalTime >= duration;
    setTime(isCompleted ? duration : currentDisplayTime);

    if (!isCompleted) {
      requestFrameRef.current = requestAnimationFrame(loop);
    }
  }, []);

  const cleanup = () => {
    requestFrameRef.current && cancelAnimationFrame(requestFrameRef.current);
    repeatTimeoutRef.current && clearTimeout(repeatTimeoutRef.current);
    previousTimeRef.current = null;
  };

  const reset = useCallback(
    (newStartAt) => {
      cleanup();

      elapsedTimeRef.current = 0;
      const nextStartAt = typeof newStartAt === "number" ? newStartAt : startAt;
      startAtRef.current = nextStartAt;

      setTime(nextStartAt);

      if (isPlaying) {
        requestFrameRef.current = window.requestAnimationFrame(loop);
      }
    },
    [isPlaying, startAt]
  );

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext(
        contextType,
        contextAttributes
      );

      if (context) {
        if (contextType === "2d") {
          const ratio = window.devicePixelRatio || 1;
          canvasRef.current.setAttribute("width", width * ratio);
          canvasRef.current.setAttribute("height", height * ratio);
          context.scale(ratio, ratio);
        } else {
          canvasRef.current.setAttribute("width", width);
          canvasRef.current.setAttribute("height", height);
        }

        canvasRef.current.style.width = `${width}px`;
        canvasRef.current.style.height = `${height}px`;

        setContext(context);
      } else {
        console.error("Could not get context");
      }
    }
  }, [canvasRef, height, width]);

  useEffect(() => {
    if (context && typeof onInit === "function") {
      onInit();
    }
  }, [context]);

  useEffect(() => {
    if (context && typeof onUpdate === "function") {
      onUpdate();
    }

    if (duration && time >= duration) {
      totalElapsedTimeRef.current += duration * 1000;

      const {
        shouldRepeat = false,
        delay = 0,
        newStartAt,
      } = onComplete?.(totalElapsedTimeRef.current / 1000) || {};

      if (shouldRepeat) {
        repeatTimeoutRef.current = setTimeout(
          () => reset(newStartAt),
          delay * 1000
        );
      }
    }
  }, [context, time, duration]);

  useEffect(() => {
    if (isPlaying) {
      requestFrameRef.current = window.requestAnimationFrame(loop);
    }

    return cleanup;
  }, [loop, isPlaying, duration, updateInterval]);

  return { ref: canvasRef, time, reset, context, height, width };
};
