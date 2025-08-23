import { useEffect, useRef, useState } from 'react';

/** Smooth velocity (deg/s) from a changing number (e.g., sceneDeg). */
export default function useScrollVelocity(value, smooth = 0.15) {
  const prev = useRef(value);
  const velRef = useRef(0);
  const [vel, setVel] = useState(0);

  useEffect(() => {
    let raf = 0;
    const step = () => {
      const dv = value - prev.current;
      // unwrap across 360 for yaw-like angles
      let delta = ((dv + 540) % 360) - 180;
      // exponential smoothing
      velRef.current = velRef.current * (1 - smooth) + delta * smooth;
      setVel(velRef.current);
      prev.current = value;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, smooth]);

  return vel; // units ≈ deg/frame; relative magnitude is what we need
}