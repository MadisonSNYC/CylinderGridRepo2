import { useRef, useCallback, useEffect, useMemo } from 'react';

/**
 * Enhanced inertia scroll hook with physics-based animation
 * Provides smooth, natural scrolling with momentum and spring physics
 */
export const useInertiaScroll = ({
  onScroll,
  sensitivity = 0.5,
  friction = 0.92,        // How quickly momentum decays (0-1, lower = faster decay)
  springStiffness = 0.1,  // How strongly it springs back to rest positions
  snapPoints = [],        // Optional array of positions to snap to
  minVelocity = 0.01,     // Minimum velocity before stopping
  maxVelocity = 50,       // Maximum velocity cap
  enabled = true
}) => {
  const velocity = useRef(0);
  const position = useRef(0);
  const targetPosition = useRef(0);
  const isAnimating = useRef(false);
  const lastTime = useRef(performance.now());
  const animationId = useRef(null);
  const lastTouchY = useRef(null);
  const lastWheelTime = useRef(0);
  const accumulatedDelta = useRef(0);

  // Physics animation loop
  const animate = useCallback(() => {
    const now = performance.now();
    const deltaTime = Math.min((now - lastTime.current) / 1000, 0.1); // Cap at 100ms
    lastTime.current = now;

    // Apply spring force if we have a target
    if (targetPosition.current !== null) {
      const displacement = targetPosition.current - position.current;
      const springForce = displacement * springStiffness;
      velocity.current += springForce;
    }

    // Apply friction
    velocity.current *= Math.pow(friction, deltaTime * 60); // Normalize to 60fps

    // Cap velocity
    velocity.current = Math.max(-maxVelocity, Math.min(maxVelocity, velocity.current));

    // Update position
    position.current += velocity.current * deltaTime * 60;

    // Snap to points if velocity is low
    if (Math.abs(velocity.current) < minVelocity * 10 && snapPoints.length > 0) {
      const nearestSnap = snapPoints.reduce((prev, curr) => 
        Math.abs(curr - position.current) < Math.abs(prev - position.current) ? curr : prev
      );
      
      if (Math.abs(nearestSnap - position.current) < 0.5) {
        position.current = nearestSnap;
        velocity.current = 0;
      } else {
        targetPosition.current = nearestSnap;
      }
    }

    // Call the scroll callback
    if (onScroll) {
      onScroll(position.current, velocity.current);
    }

    // Continue animation if velocity is significant
    if (Math.abs(velocity.current) > minVelocity || 
        (targetPosition.current !== null && Math.abs(targetPosition.current - position.current) > 0.01)) {
      animationId.current = requestAnimationFrame(animate);
    } else {
      velocity.current = 0;
      targetPosition.current = null;
      isAnimating.current = false;
    }
  }, [onScroll, friction, springStiffness, snapPoints, minVelocity, maxVelocity]);

  // Start animation if not running
  const startAnimation = useCallback(() => {
    if (!isAnimating.current && enabled) {
      isAnimating.current = true;
      lastTime.current = performance.now();
      animate();
    }
  }, [animate, enabled]);

  // Handle wheel events with momentum
  const handleWheel = useCallback((event) => {
    if (!enabled) return;
    
    event.preventDefault();
    
    const now = performance.now();
    const timeSinceLastWheel = now - lastWheelTime.current;
    
    // Accumulate small deltas for smoother motion
    let delta = event.deltaY * sensitivity;
    
    // Reset accumulation if too much time passed
    if (timeSinceLastWheel > 100) {
      accumulatedDelta.current = 0;
    }
    
    accumulatedDelta.current += delta;
    
    // Apply accumulated delta with smoothing
    if (Math.abs(accumulatedDelta.current) > 1) {
      velocity.current += accumulatedDelta.current * 0.3;
      accumulatedDelta.current *= 0.5; // Decay accumulation
    }
    
    lastWheelTime.current = now;
    targetPosition.current = null; // Clear any snap target
    startAnimation();
  }, [enabled, sensitivity, startAnimation]);

  // Handle touch events for mobile
  const handleTouchStart = useCallback((event) => {
    if (!enabled) return;
    lastTouchY.current = event.touches[0].clientY;
    velocity.current *= 0.2; // Reduce existing velocity when touching
  }, [enabled]);

  const handleTouchMove = useCallback((event) => {
    if (!enabled || lastTouchY.current === null) return;
    
    event.preventDefault();
    
    const currentY = event.touches[0].clientY;
    const delta = (lastTouchY.current - currentY) * sensitivity * 2;
    
    velocity.current = delta * 10; // Direct velocity for responsive touch
    lastTouchY.current = currentY;
    targetPosition.current = null;
    
    startAnimation();
  }, [enabled, sensitivity, startAnimation]);

  const handleTouchEnd = useCallback(() => {
    if (!enabled) return;
    lastTouchY.current = null;
    // Let momentum continue after touch release
  }, [enabled]);

  // Keyboard navigation
  const handleKeyDown = useCallback((event) => {
    if (!enabled) return;
    
    let impulse = 0;
    
    switch(event.key) {
      case 'ArrowUp':
        impulse = -10;
        break;
      case 'ArrowDown':
        impulse = 10;
        break;
      case 'PageUp':
        impulse = -30;
        break;
      case 'PageDown':
        impulse = 30;
        break;
      case 'Home':
        position.current = 0;
        velocity.current = 0;
        targetPosition.current = 0;
        startAnimation();
        return;
      case 'End':
        // Assuming we know the max scroll position
        // This would need to be passed in as a prop
        break;
      default:
        return;
    }
    
    if (impulse !== 0) {
      event.preventDefault();
      velocity.current += impulse;
      targetPosition.current = null;
      startAnimation();
    }
  }, [enabled, startAnimation]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, []);

  // API to control scroll programmatically
  const scrollTo = useCallback((target, animated = true) => {
    if (animated) {
      targetPosition.current = target;
      startAnimation();
    } else {
      position.current = target;
      velocity.current = 0;
      if (onScroll) {
        onScroll(target, 0);
      }
    }
  }, [onScroll, startAnimation]);

  const addImpulse = useCallback((force) => {
    velocity.current += force;
    targetPosition.current = null;
    startAnimation();
  }, [startAnimation]);

  const stop = useCallback(() => {
    velocity.current = 0;
    targetPosition.current = null;
    if (animationId.current) {
      cancelAnimationFrame(animationId.current);
    }
    isAnimating.current = false;
  }, []);

  // Attach non-passive wheel listener directly to element
  const attachWheelListener = useCallback((element) => {
    if (!element || !enabled) return;
    
    // Remove any existing listener
    element.removeEventListener('wheel', handleWheel);
    
    // Add non-passive listener
    element.addEventListener('wheel', handleWheel, { passive: false });
    
    // Cleanup function
    return () => {
      element.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel, enabled]);

  return {
    handlers: {
      // Don't include onWheel here - we'll attach it directly
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onKeyDown: handleKeyDown
    },
    attachWheelListener,
    controls: {
      scrollTo,
      addImpulse,
      stop
    },
    state: {
      position: position.current,
      velocity: velocity.current,
      isAnimating: isAnimating.current
    }
  };
};