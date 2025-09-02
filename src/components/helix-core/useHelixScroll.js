import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook for managing helix scroll state and interactions
 */
export const useHelixScroll = (config = {}) => {
  const {
    initialOffset = 0,
    scrollSpeed = 0.001,
    inertia = 0.95,
    minVelocity = 0.001,
    enableInertia = true,
    enableKeyboard = true,
    keyboardSpeed = 0.05
  } = config;
  
  const [scrollOffset, setScrollOffset] = useState(initialOffset);
  const [activeIndex, setActiveIndex] = useState(0);
  const velocityRef = useRef(0);
  const animationRef = useRef(null);
  const containerRef = useRef(null);
  
  // Handle wheel events
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY * scrollSpeed;
    
    if (enableInertia) {
      velocityRef.current += delta;
    } else {
      setScrollOffset(prev => prev + delta);
    }
  }, [scrollSpeed, enableInertia]);
  
  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!enableKeyboard) return;
    
    switch(e.key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        velocityRef.current -= keyboardSpeed;
        break;
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        velocityRef.current += keyboardSpeed;
        break;
      case 'Home':
        e.preventDefault();
        setScrollOffset(0);
        velocityRef.current = 0;
        break;
      case 'End':
        e.preventDefault();
        setScrollOffset(1);
        velocityRef.current = 0;
        break;
    }
  }, [enableKeyboard, keyboardSpeed]);
  
  // Inertia animation loop
  useEffect(() => {
    if (!enableInertia) return;
    
    const animate = () => {
      if (Math.abs(velocityRef.current) > minVelocity) {
        setScrollOffset(prev => prev + velocityRef.current);
        velocityRef.current *= inertia;
        animationRef.current = requestAnimationFrame(animate);
      } else {
        velocityRef.current = 0;
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [enableInertia, inertia, minVelocity]);
  
  // Setup event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.addEventListener('wheel', handleWheel, { passive: false });
    
    if (enableKeyboard) {
      container.addEventListener('keydown', handleKeyDown);
      container.tabIndex = 0;
    }
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleWheel, handleKeyDown, enableKeyboard]);
  
  // Scroll to specific index
  const scrollToIndex = useCallback((index, itemCount) => {
    const targetOffset = index / itemCount;
    setScrollOffset(targetOffset);
    setActiveIndex(index);
    velocityRef.current = 0;
  }, []);
  
  // Reset scroll
  const resetScroll = useCallback(() => {
    setScrollOffset(initialOffset);
    setActiveIndex(0);
    velocityRef.current = 0;
  }, [initialOffset]);
  
  return {
    scrollOffset,
    activeIndex,
    containerRef,
    setScrollOffset,
    setActiveIndex,
    scrollToIndex,
    resetScroll,
    velocity: velocityRef.current
  };
};

export default useHelixScroll;