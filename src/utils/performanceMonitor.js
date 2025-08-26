// Performance monitoring utility for measuring optimization improvements

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fps: [],
      renderTime: [],
      scrollLatency: [],
      cacheHits: 0,
      cacheMisses: 0
    };
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
  }

  // Measure FPS
  measureFPS() {
    const now = performance.now();
    const delta = now - this.lastFrameTime;
    
    if (delta >= 1000) { // Update every second
      const fps = Math.round((this.frameCount * 1000) / delta);
      this.metrics.fps.push(fps);
      
      // Keep only last 10 measurements
      if (this.metrics.fps.length > 10) {
        this.metrics.fps.shift();
      }
      
      this.frameCount = 0;
      this.lastFrameTime = now;
      
      return fps;
    }
    
    this.frameCount++;
    return this.getAverageFPS();
  }

  // Get average FPS
  getAverageFPS() {
    if (this.metrics.fps.length === 0) return 60;
    const sum = this.metrics.fps.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.metrics.fps.length);
  }

  // Measure render time
  measureRenderTime(callback) {
    const start = performance.now();
    const result = callback();
    const duration = performance.now() - start;
    
    this.metrics.renderTime.push(duration);
    
    // Keep only last 50 measurements
    if (this.metrics.renderTime.length > 50) {
      this.metrics.renderTime.shift();
    }
    
    return result;
  }

  // Measure scroll latency
  measureScrollLatency(timestamp) {
    const latency = performance.now() - timestamp;
    this.metrics.scrollLatency.push(latency);
    
    // Keep only last 50 measurements
    if (this.metrics.scrollLatency.length > 50) {
      this.metrics.scrollLatency.shift();
    }
    
    return latency;
  }

  // Record cache hit
  recordCacheHit() {
    this.metrics.cacheHits++;
  }

  // Record cache miss
  recordCacheMiss() {
    this.metrics.cacheMisses++;
  }

  // Get cache hit rate
  getCacheHitRate() {
    const total = this.metrics.cacheHits + this.metrics.cacheMisses;
    if (total === 0) return 0;
    return Math.round((this.metrics.cacheHits / total) * 100);
  }

  // Get performance summary
  getSummary() {
    const avgRenderTime = this.metrics.renderTime.length > 0
      ? this.metrics.renderTime.reduce((a, b) => a + b, 0) / this.metrics.renderTime.length
      : 0;
    
    const avgScrollLatency = this.metrics.scrollLatency.length > 0
      ? this.metrics.scrollLatency.reduce((a, b) => a + b, 0) / this.metrics.scrollLatency.length
      : 0;

    return {
      averageFPS: this.getAverageFPS(),
      currentFPS: this.metrics.fps[this.metrics.fps.length - 1] || 60,
      averageRenderTime: Math.round(avgRenderTime * 100) / 100,
      averageScrollLatency: Math.round(avgScrollLatency * 100) / 100,
      cacheHitRate: this.getCacheHitRate(),
      totalCacheHits: this.metrics.cacheHits,
      totalCacheMisses: this.metrics.cacheMisses
    };
  }

  // Reset all metrics
  reset() {
    this.metrics = {
      fps: [],
      renderTime: [],
      scrollLatency: [],
      cacheHits: 0,
      cacheMisses: 0
    };
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
  }

  // Log performance to console
  logPerformance() {
    const summary = this.getSummary();
    console.log('%c Performance Metrics ', 'background: #222; color: #bada55; font-weight: bold');
    console.table(summary);
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Auto-log performance every 5 seconds in development
if (import.meta.env.DEV) {
  setInterval(() => {
    performanceMonitor.logPerformance();
  }, 5000);
}