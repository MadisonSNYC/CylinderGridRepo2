// Virtual scrolling hook for optimized card rendering
// Only renders cards that are potentially visible in the viewport

import { useMemo, useEffect, useRef } from 'react';
import { useHelixScroll } from '../contexts/HelixContext.jsx';

export function useVirtualScroll(totalProjects, config) {
  const { scroll, updateVisibleCards } = useHelixScroll();
  const scrollOffset = scroll?.offset || 0;
  const visibilityCache = useRef(new Map());
  
  // Calculate which cards should be rendered based on scroll position
  const visibleCards = useMemo(() => {
    const repeatTurns = config.repeatTurns || 2;
    const totalCards = totalProjects * Math.ceil(repeatTurns + 1);
    const cardsPerRotation = totalProjects;
    
    // Calculate the current rotation position
    const currentRotation = scrollOffset * (468 * repeatTurns / totalProjects);
    
    // Determine visible range (cards in front hemisphere + buffer)
    const visibleRange = {
      start: -90,  // Start rendering 90 degrees before front
      end: 90      // Stop rendering 90 degrees after front
    };
    
    const visibleIndices = [];
    
    for (let i = 0; i < totalCards; i++) {
      const angle = (i / totalProjects) * 468;
      const normalizedAngle = ((angle - currentRotation) % 360 + 360) % 360;
      
      // Check if card is in visible range
      const isInFront = normalizedAngle <= visibleRange.end || normalizedAngle >= (360 + visibleRange.start);
      const isInVisibleRange = normalizedAngle >= (180 + visibleRange.start) && normalizedAngle <= (180 + visibleRange.end);
      
      if (isInFront || isInVisibleRange) {
        visibleIndices.push(i);
      }
    }
    
    return visibleIndices;
  }, [totalProjects, scrollOffset, config.repeatTurns]);
  
  // Update context with visible cards
  useEffect(() => {
    if (updateVisibleCards) {
      updateVisibleCards(visibleCards);
    }
  }, [visibleCards, updateVisibleCards]);
  
  // Check if a specific card index should be rendered
  const shouldRenderCard = (index) => {
    return visibleCards.includes(index);
  };
  
  // Get render priority for a card (lower = higher priority)
  const getRenderPriority = (index) => {
    const angle = (index / totalProjects) * 468;
    const currentRotation = scrollOffset * (468 * (config.repeatTurns || 2) / totalProjects);
    const normalizedAngle = ((angle - currentRotation) % 360 + 360) % 360;
    
    // Cards directly in front have highest priority
    if (normalizedAngle < 45 || normalizedAngle > 315) {
      return 0; // Highest priority
    } else if (normalizedAngle < 90 || normalizedAngle > 270) {
      return 1; // High priority
    } else if (normalizedAngle < 135 || normalizedAngle > 225) {
      return 2; // Medium priority
    } else {
      return 3; // Low priority (back cards)
    }
  };
  
  return {
    visibleCards,
    shouldRenderCard,
    getRenderPriority,
    totalVisible: visibleCards.length
  };
}

// Hook for viewport-based culling
export function useViewportCulling(elementRef, threshold = 0.1) {
  const inViewport = useRef(true);
  
  useEffect(() => {
    if (!elementRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          inViewport.current = entry.isIntersecting;
        });
      },
      { threshold }
    );
    
    observer.observe(elementRef.current);
    
    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [elementRef, threshold]);
  
  return inViewport.current;
}

// Performance-aware quality settings
export function useAdaptiveQuality(targetFPS = 60) {
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const currentFPS = useRef(60);
  const quality = useRef('high');
  
  useEffect(() => {
    const checkPerformance = () => {
      const now = performance.now();
      const delta = now - lastTime.current;
      
      if (delta >= 1000) {
        currentFPS.current = Math.round((frameCount.current * 1000) / delta);
        frameCount.current = 0;
        lastTime.current = now;
        
        // Adjust quality based on FPS
        if (currentFPS.current < 30) {
          quality.current = 'low';
        } else if (currentFPS.current < 50) {
          quality.current = 'medium';
        } else {
          quality.current = 'high';
        }
      }
      
      frameCount.current++;
      requestAnimationFrame(checkPerformance);
    };
    
    const rafId = requestAnimationFrame(checkPerformance);
    return () => cancelAnimationFrame(rafId);
  }, [targetFPS]);
  
  return {
    fps: currentFPS.current,
    quality: quality.current,
    shouldReduceQuality: quality.current !== 'high'
  };
}