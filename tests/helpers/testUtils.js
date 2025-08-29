import { TEST_CONFIG } from '../config/test.config.js';

/**
 * Test utility functions for common operations
 */

/**
 * Performance monitoring helper
 */
export class PerformanceMonitor {
  constructor(page) {
    this.page = page;
  }

  /**
   * Start performance monitoring
   */
  async startMonitoring(duration = 5000) {
    await this.page.evaluate((duration) => {
      window.testPerformance = {
        frameCount: 0,
        startTime: performance.now(),
        frameDrops: 0,
        memoryStart: performance.memory?.usedJSHeapSize || 0,
        duration
      };

      const trackFrames = () => {
        window.testPerformance.frameCount++;
        const now = performance.now();
        const elapsed = now - window.testPerformance.startTime;
        
        if (elapsed < duration) {
          requestAnimationFrame(trackFrames);
        }
      };
      
      requestAnimationFrame(trackFrames);
    }, duration);
  }

  /**
   * Get performance results with error handling
   */
  async getResults() {
    try {
      const results = await this.page.evaluate(() => {
        const perf = window.testPerformance;
        if (!perf) {
          console.warn('Performance monitoring was not started');
          return null;
        }

        const elapsed = performance.now() - perf.startTime;
        const fps = perf.frameCount > 0 ? (perf.frameCount * 1000) / elapsed : 0;
        const memoryEnd = performance.memory?.usedJSHeapSize || 0;
        const memoryGrowth = (memoryEnd - perf.memoryStart) / 1024 / 1024; // MB

        return {
          fps: Math.round(fps * 10) / 10,
          memoryGrowthMB: Math.round(memoryGrowth * 100) / 100,
          frameCount: perf.frameCount,
          duration: elapsed,
          success: true
        };
      });
      
      return results;
    } catch (error) {
      console.error('Failed to get performance results:', error);
      return {
        fps: 0,
        memoryGrowthMB: 0,
        frameCount: 0,
        duration: 0,
        success: false,
        error: error.message
      };
    }
  }
}

/**
 * Error tracking helper
 */
export class ErrorTracker {
  constructor(page) {
    this.page = page;
    this.errors = [];
    this.setupListeners();
  }

  setupListeners() {
    this.page.on('pageerror', error => {
      this.errors.push({
        type: 'javascript',
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
    });

    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        this.errors.push({
          type: 'console',
          message: msg.text(),
          timestamp: new Date().toISOString()
        });
      }
    });
  }

  getErrors() {
    return [...this.errors];
  }

  hasErrors() {
    return this.errors.length > 0;
  }

  clearErrors() {
    this.errors = [];
  }
}

/**
 * Wait for element with retry logic
 */
export async function waitForElementWithRetry(locator, options = {}) {
  const { timeout = TEST_CONFIG.timeouts.medium, retries = 3 } = options;
  
  for (let i = 0; i < retries; i++) {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      return true;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

/**
 * Smart scroll helper that adapts to different interaction methods
 */
export async function performSmartScroll(page, amount = 300) {
  try {
    // Try mouse wheel first
    await page.mouse.wheel(0, amount);
  } catch {
    // Fallback to keyboard
    await page.keyboard.press('ArrowDown');
  }
  
  await page.waitForTimeout(TEST_CONFIG.performance.interactionDelay);
}

/**
 * Clean page state between tests
 */
export async function resetPageState(page) {
  await page.evaluate(() => {
    // Clear storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Reset any global test variables
    if (window.testPerformance) {
      delete window.testPerformance;
    }
    
    // Reset scroll position
    window.scrollTo(0, 0);
  });
}

/**
 * Create standardized screenshot options
 */
export function getScreenshotOptions(name, options = {}) {
  return {
    name: `${name}.png`,
    threshold: TEST_CONFIG.visual.threshold,
    animations: 'disabled',
    mask: options.mask || TEST_CONFIG.visual.maskElements.map(selector => 
      page.locator(selector)
    ),
    ...options
  };
}

/**
 * Validate performance metrics against benchmarks with null safety
 */
export function validatePerformanceMetrics(metrics) {
  // Handle null or undefined metrics
  if (!metrics) {
    return {
      fps: { value: 0, passed: false, benchmark: TEST_CONFIG.performance.minFPS, error: 'No metrics available' },
      memory: { value: 0, passed: false, benchmark: TEST_CONFIG.performance.maxMemoryGrowth, error: 'No metrics available' },
      overall: false
    };
  }

  const fps = metrics.fps || 0;
  const memoryGrowth = metrics.memoryGrowthMB || 0;

  const results = {
    fps: {
      value: fps,
      passed: fps >= TEST_CONFIG.performance.minFPS,
      benchmark: TEST_CONFIG.performance.minFPS
    },
    memory: {
      value: memoryGrowth,
      passed: memoryGrowth <= TEST_CONFIG.performance.maxMemoryGrowth,
      benchmark: TEST_CONFIG.performance.maxMemoryGrowth
    }
  };

  results.overall = results.fps.passed && results.memory.passed;
  return results;
}

/**
 * Generate test report data
 */
export function generateTestReport(testName, metrics, errors, duration) {
  return {
    testName,
    timestamp: new Date().toISOString(),
    duration: duration,
    metrics: metrics || {},
    errors: errors || [],
    passed: !errors || errors.length === 0,
    environment: {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Node.js',
      viewport: 'detected at runtime'
    }
  };
}