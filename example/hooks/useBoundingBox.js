import { useEffect, useState } from "react";

export const useBoundingBox = ({ ref }) => {
  const [bounds, setBounds] = useState({});

  useEffect(() => {
    const getBounds = () => {
      const bounds = ref.current.getBoundingClientRect();
      setBounds(bounds);
    };

    getBounds();

    window.addEventListener("resize", getBounds);
    return () => window.removeEventListener("resize", getBounds);
  }, [ref]);

  return bounds;
};
