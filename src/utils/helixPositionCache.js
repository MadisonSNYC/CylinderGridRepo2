// Position cache system for optimizing helix calculations
// Uses memoization to avoid redundant position computations

class HelixPositionCache {
  constructor() {
    this.positions = new Map();
    this.transformCache = new Map();
    this.maxCacheSize = 1000; // Prevent memory leaks
  }

  // Generate unique key for position lookup
  generateKey(index, scrollOffset, config) {
    // Round scroll offset to reduce cache misses while maintaining smoothness
    const roundedScroll = Math.round(scrollOffset * 100) / 100;
    return `${index}-${roundedScroll}-${config.radius}-${config.verticalSpan}-${config.repeatTurns}`;
  }

  // Clear cache if it gets too large
  checkCacheSize() {
    if (this.positions.size > this.maxCacheSize) {
      // Remove oldest entries (first half of the cache)
      const keysToDelete = Array.from(this.positions.keys()).slice(0, this.maxCacheSize / 2);
      keysToDelete.forEach(key => this.positions.delete(key));
    }
  }

  // Compute position for a card (expensive calculation)
  computePosition(index, totalProjects, scrollOffset, config) {
    const repeatTurns = config.repeatTurns || 2;
    const totalCards = totalProjects * Math.ceil(repeatTurns + 1);
    
    // Core helix mathematics
    const angle = (index / totalProjects) * 468; // 360 * 1.3 for increased rotation
    const radius = config.radius || 325;
    const verticalSpan = config.verticalSpan || 585;
    
    // Vertical positioning
    const spacingMultiplier = 3.25;
    const normalizedPosition = index / (totalCards - 1);
    const totalHeight = verticalSpan * repeatTurns * spacingMultiplier;
    const yOffset = normalizedPosition * totalHeight - (totalHeight / 2);
    
    // Current rotation based on scroll
    const currentRotation = scrollOffset * (468 * repeatTurns / totalProjects);
    
    // Normalized angle for depth calculations
    const normalizedAngle = ((angle - currentRotation) % 360 + 360) % 360;
    const radians = (normalizedAngle * Math.PI) / 180;
    
    // Depth-based scaling
    const depthFactor = Math.cos(radians);
    const baseScale = config.cardScale || 1;
    const scaleRange = 0.2;
    const scale = baseScale * (1 - (scaleRange * (1 - depthFactor) / 2));
    
    // Opacity calculation
    let opacity = 1;
    if (normalizedAngle < 45 || normalizedAngle > 315) {
      opacity = config.opacityFront || 1;
    } else if (normalizedAngle >= 135 && normalizedAngle <= 225) {
      opacity = config.opacityBack || 0.3;
    } else {
      const sideProgress = normalizedAngle < 180 
        ? (normalizedAngle - 45) / 90 
        : (315 - normalizedAngle) / 90;
      const frontOpacity = config.opacityFront || 1;
      const sideOpacity = config.opacitySide || 0.7;
      const backOpacity = config.opacityBack || 0.3;
      
      if (normalizedAngle < 135) {
        opacity = frontOpacity - (frontOpacity - sideOpacity) * sideProgress;
      } else {
        opacity = backOpacity + (sideOpacity - backOpacity) * sideProgress;
      }
    }
    
    return {
      angle,
      currentRotation,
      normalizedAngle,
      radius,
      yOffset,
      scale,
      opacity,
      depthFactor,
      // Pre-calculate the vertical scroll offset separately
      scrollY: yOffset - (scrollOffset * 13),
      // Rotation for card to face viewer
      cardRotation: angle - currentRotation
    };
  }

  // Get cached position or compute if not cached
  getPosition(index, totalProjects, scrollOffset, config) {
    const key = this.generateKey(index, scrollOffset, config);
    
    if (!this.positions.has(key)) {
      this.checkCacheSize();
      const position = this.computePosition(index, totalProjects, scrollOffset, config);
      this.positions.set(key, position);
    }
    
    return this.positions.get(key);
  }

  // Generate transform string (also cached)
  getTransform(position, config) {
    const transformKey = `${position.scrollY}-${position.cardRotation}-${position.radius}-${position.scale}`;
    
    if (!this.transformCache.has(transformKey)) {
      // Build transform string without horizontal movement
      const transform = `
        translate(-50%, -50%)
        translateY(${position.scrollY}px)
        rotateY(${position.cardRotation}deg)
        translateZ(${position.radius}px)
        scale(${position.scale})
      `.replace(/\s+/g, ' ').trim();
      
      this.transformCache.set(transformKey, transform);
    }
    
    return this.transformCache.get(transformKey);
  }

  // Clear all caches
  clear() {
    this.positions.clear();
    this.transformCache.clear();
  }

  // Get cache statistics for debugging
  getStats() {
    return {
      positionCacheSize: this.positions.size,
      transformCacheSize: this.transformCache.size,
      totalMemory: (this.positions.size + this.transformCache.size) * 100 // Rough estimate in bytes
    };
  }
}

// Singleton instance
export const helixPositionCache = new HelixPositionCache();