import { useEffect, useState } from "react";

export const useWindowSize = () => {
  const [size, setSize] = useState({});

  useEffect(() => {
    const getWindowSize = () => {
      const { innerHeight: height, innerWidth: width } = window;
      setSize({ height, width });
    };

    getWindowSize();

    window.addEventListener("resize", getWindowSize);
    return () => window.removeEventListener("resize", getWindowSize);
  }, [ref]);

  return size;
};
