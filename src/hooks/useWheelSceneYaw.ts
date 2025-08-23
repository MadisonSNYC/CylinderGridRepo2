import { useState, useEffect, useCallback, useRef } from 'react';

interface UseWheelSceneYawOptions {
  /** Base yaw value (default: 0) */
  base?: number;
  /** Pixels per degree ratio for sensitivity (default: 3) */
  pixelsPerDeg?: number;
  /** Invert scroll direction (default: false) */
  invert?: boolean;
  /** Enable wheel handling (default: true) */
  enabled?: boolean;
  /** Smoothing factor for velocity (default: 0.15) */
  smoothing?: number;
}

interface WheelSceneYawResult {
  /** Current scene yaw in degrees */
  sceneYaw: number;
  /** Current scroll velocity */
  velocity: number;
  /** Manual set scene yaw */
  setSceneYaw: (yaw: number) => void;
  /** Reset to zero */
  reset: () => void;
}

/**
 * Hook for normalized wheel scroll handling with direction control.
 * Provides consistent cross-browser wheel delta normalization and
 * allows toggling scroll direction with invertScroll flag.
 */
export const useWheelSceneYaw = (elementId: string, options: UseWheelSceneYawOptions = {}): WheelSceneYawResult => {
  const {
    base = 0,
    pixelsPerDeg = 3,
    invert = false,
    enabled = true,
    smoothing = 0.15
  } = options;

  const [sceneYaw, setSceneYaw] = useState(base);
  const [velocity, setVelocity] = useState(0);
  const rafRef = useRef<number>();
  const lastTimeRef = useRef(0);
  const targetVelocityRef = useRef(0);
  const accRef = useRef(base);

  // Normalize wheel delta with dead-zone and pixel-per-degree conversion
  const normalizeWheelDelta = useCallback((event: WheelEvent): number => {
    // Convert deltaY to pixels based on deltaMode
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
    const deltaPx = event.deltaY * unit;
    
    // Dead-zone: ignore sub-pixel noise
    const px = Math.abs(deltaPx) < 0.5 ? 0 : deltaPx;
    
    if (px === 0) return 0;
    
    // Apply inversion and convert pixels to degrees
    const sign = invert ? -1 : 1;
    return sign * (px / pixelsPerDeg);
  }, [invert, pixelsPerDeg]);

  // Smooth velocity animation
  useEffect(() => {
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      if (deltaTime > 0) {
        // Exponential smoothing for velocity
        setVelocity(prev => {
          const target = targetVelocityRef.current;
          return prev + (target - prev) * smoothing;
        });

        // Decay target velocity over time
        targetVelocityRef.current *= 0.95;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [smoothing]);

  // Wheel event handler
  useEffect(() => {
    if (!enabled) return;
    
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      
      const deltaDeg = normalizeWheelDelta(event);
      if (deltaDeg === 0) return;
      
      // Accumulate degrees
      accRef.current += deltaDeg;
      setSceneYaw(accRef.current);
      
      // Update velocity target
      targetVelocityRef.current = deltaDeg;
    };

    // Attach to window for global wheel capture  
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [normalizeWheelDelta, enabled]);

  const reset = useCallback(() => {
    setSceneYaw(base);
    setVelocity(0);
    targetVelocityRef.current = 0;
    accRef.current = base;
  }, [base]);

  const manualSetSceneYaw = useCallback((yaw: number) => {
    setSceneYaw(yaw);
    accRef.current = yaw;
  }, []);

  return {
    sceneYaw,
    velocity,
    setSceneYaw: manualSetSceneYaw,
    reset
  };
};

export default useWheelSceneYaw;