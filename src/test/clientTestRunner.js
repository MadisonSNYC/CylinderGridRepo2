// Client-side test runner that coordinates browser-based tests
// This runs in the browser and doesn't use Node.js dependencies directly

export class ClientTestRunner {
  constructor() {
    this.results = [];
    this.startTime = null;
    this.onProgress = null;
  }

  setProgressCallback(callback) {
    this.onProgress = callback;
  }

  async runBrowserTests() {
    this.startTime = new Date();
    this.results = [];
    
    // Test phases we can run in the browser
    const testPhases = [
      { id: 'page-load', name: 'Page Load Performance', duration: 3000 },
      { id: 'helix-interaction', name: 'Helix Interaction Tests', duration: 5000 },
      { id: 'scroll-performance', name: 'Scroll Performance', duration: 4000 },
      { id: 'memory-usage', name: 'Memory Usage Analysis', duration: 3000 },
      { id: 'accessibility-check', name: 'Basic Accessibility', duration: 2000 }
    ];

    let currentPhase = 0;
    const totalPhases = testPhases.length;

    for (const phase of testPhases) {
      currentPhase++;
      
      if (this.onProgress) {
        this.onProgress({
          phase: 'testing',
          current: currentPhase,
          total: totalPhases,
          message: `Running ${phase.name}...`
        });
      }

      const result = await this.runPhase(phase);
      this.results.push(result);
      
      // Small delay between phases
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    if (this.onProgress) {
      this.onProgress({
        phase: 'complete',
        current: totalPhases,
        total: totalPhases,
        message: 'Browser tests completed!'
      });
    }

    return this.generateReport();
  }

  async runPhase(phase) {
    const startTime = performance.now();
    const result = {
      id: phase.id,
      name: phase.name,
      startTime: new Date().toISOString(),
      duration: 0,
      metrics: {},
      issues: [],
      success: true
    };

    try {
      switch (phase.id) {
        case 'page-load':
          result.metrics = await this.measurePageLoadPerformance();
          break;
        case 'helix-interaction':
          result.metrics = await this.testHelixInteraction();
          break;
        case 'scroll-performance':
          result.metrics = await this.testScrollPerformance();
          break;
        case 'memory-usage':
          result.metrics = await this.analyzeMemoryUsage();
          break;
        case 'accessibility-check':
          result.metrics = await this.runBasicAccessibilityCheck();
          break;
      }

      // Analyze results for issues
      result.issues = this.analyzePhaseIssues(phase.id, result.metrics);
      
    } catch (error) {
      result.success = false;
      result.error = error.message;
      result.issues.push({
        type: 'error',
        severity: 'critical',
        message: `Phase failed: ${error.message}`
      });
    }

    result.duration = Math.round(performance.now() - startTime);
    return result;
  }

  async measurePageLoadPerformance() {
    const metrics = {
      loadTime: 0,
      domNodes: 0,
      totalResources: 0,
      helixElements: 0,
      renderTime: 0
    };

    // Get Navigation Timing API data
    if (performance.getEntriesByType) {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        metrics.loadTime = Math.round(navigation.loadEventEnd - navigation.navigationStart);
        metrics.domContentLoaded = Math.round(navigation.domContentLoadedEventEnd - navigation.navigationStart);
        metrics.renderTime = Math.round(navigation.domInteractive - navigation.navigationStart);
      }

      // Count resources
      const resources = performance.getEntriesByType('resource');
      metrics.totalResources = resources.length;
      metrics.imageResources = resources.filter(r => r.initiatorType === 'img').length;
      metrics.scriptResources = resources.filter(r => r.initiatorType === 'script').length;
      metrics.videoResources = resources.filter(r => r.initiatorType === 'video').length;
    }

    // Count DOM elements
    metrics.domNodes = document.querySelectorAll('*').length;
    
    // Count helix-specific elements
    metrics.helixElements = document.querySelectorAll('.helix-node').length;
    metrics.helixScenePresent = !!document.querySelector('.helix-scene');
    metrics.devPanelPresent = !!document.querySelector('.dev-panel');

    return metrics;
  }

  async testHelixInteraction() {
    const metrics = {
      helixNodesFound: 0,
      interactionsSuccessful: 0,
      averageResponseTime: 0,
      scrollEventsTriggered: 0
    };

    const helixScene = document.querySelector('.helix-scene');
    if (!helixScene) {
      throw new Error('Helix scene not found');
    }

    metrics.helixNodesFound = document.querySelectorAll('.helix-node').length;

    // Test scroll interactions
    const scrollTests = [
      { deltaY: 100, direction: 'down' },
      { deltaY: -100, direction: 'up' },
      { deltaY: 300, direction: 'fast-down' },
      { deltaY: -300, direction: 'fast-up' }
    ];

    let totalResponseTime = 0;
    let successfulInteractions = 0;

    for (const test of scrollTests) {
      const startTime = performance.now();
      
      try {
        // Create and dispatch wheel event
        const wheelEvent = new WheelEvent('wheel', {
          deltaY: test.deltaY,
          bubbles: true,
          cancelable: true
        });
        
        helixScene.dispatchEvent(wheelEvent);
        
        // Wait for potential animations
        await new Promise(resolve => setTimeout(resolve, 100));
        
        totalResponseTime += performance.now() - startTime;
        successfulInteractions++;
        metrics.scrollEventsTriggered++;
      } catch (error) {
        console.warn('Scroll interaction failed:', error);
      }
    }

    metrics.interactionsSuccessful = successfulInteractions;
    metrics.averageResponseTime = successfulInteractions > 0 
      ? Math.round((totalResponseTime / successfulInteractions) * 100) / 100 
      : 0;

    return metrics;
  }

  async testScrollPerformance() {
    const metrics = {
      fps: 0,
      frameDrops: 0,
      smoothness: 0,
      responseTime: 0
    };

    // Monitor frame rate during scroll
    let frameCount = 0;
    let frameDrops = 0;
    const startTime = performance.now();
    let lastFrameTime = startTime;

    const frameCallback = () => {
      const now = performance.now();
      const delta = now - lastFrameTime;
      
      frameCount++;
      if (delta > 20) { // Frame drop if > 20ms (below 50fps)
        frameDrops++;
      }
      lastFrameTime = now;
    };

    // Start frame monitoring
    const measureFrames = () => {
      if (performance.now() - startTime < 3000) {
        frameCallback();
        requestAnimationFrame(measureFrames);
      }
    };
    
    measureFrames();

    // Perform scroll test
    const helixScene = document.querySelector('.helix-scene');
    if (helixScene) {
      for (let i = 0; i < 10; i++) {
        const scrollStart = performance.now();
        
        helixScene.dispatchEvent(new WheelEvent('wheel', {
          deltaY: 50 * (i % 2 === 0 ? 1 : -1),
          bubbles: true
        }));
        
        await new Promise(resolve => setTimeout(resolve, 200));
        
        metrics.responseTime += performance.now() - scrollStart;
      }
    }

    // Wait for monitoring to complete
    await new Promise(resolve => setTimeout(resolve, 3000));

    const duration = performance.now() - startTime;
    metrics.fps = Math.round((frameCount * 1000) / duration);
    metrics.frameDrops = frameDrops;
    metrics.smoothness = frameCount > 0 ? Math.round(((frameCount - frameDrops) / frameCount) * 100) : 0;
    metrics.responseTime = Math.round((metrics.responseTime / 10) * 100) / 100;

    return metrics;
  }

  async analyzeMemoryUsage() {
    const metrics = {
      initialMemory: 0,
      currentMemory: 0,
      memoryGrowth: 0,
      memoryPressure: 'low'
    };

    if (performance.memory) {
      metrics.initialMemory = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024 * 100) / 100;
      
      // Trigger some interactions to stress memory
      const helixScene = document.querySelector('.helix-scene');
      if (helixScene) {
        for (let i = 0; i < 20; i++) {
          helixScene.dispatchEvent(new WheelEvent('wheel', {
            deltaY: Math.random() * 200 - 100,
            bubbles: true
          }));
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      metrics.currentMemory = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024 * 100) / 100;
      metrics.memoryGrowth = metrics.currentMemory - metrics.initialMemory;
      metrics.memoryLimit = Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024 * 100) / 100;
      metrics.memoryUsagePercent = Math.round((metrics.currentMemory / metrics.memoryLimit) * 100);
      
      if (metrics.memoryGrowth > 10) {
        metrics.memoryPressure = 'high';
      } else if (metrics.memoryGrowth > 5) {
        metrics.memoryPressure = 'medium';
      }
    }

    return metrics;
  }

  async runBasicAccessibilityCheck() {
    const metrics = {
      missingAltText: 0,
      missingAriaLabels: 0,
      lowContrastElements: 0,
      keyboardTrappedElements: 0,
      focusableElements: 0,
      score: 100
    };

    // Check for images without alt text
    const images = document.querySelectorAll('img');
    metrics.missingAltText = Array.from(images).filter(img => !img.alt || img.alt.trim() === '').length;

    // Check for buttons/interactive elements without accessible names
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [role="button"]');
    metrics.focusableElements = interactiveElements.length;
    
    let missingLabels = 0;
    interactiveElements.forEach(el => {
      const hasAccessibleName = el.textContent?.trim() || 
                              el.getAttribute('aria-label') || 
                              el.getAttribute('aria-labelledby') ||
                              el.getAttribute('title');
      if (!hasAccessibleName) {
        missingLabels++;
      }
    });
    metrics.missingAriaLabels = missingLabels;

    // Basic contrast check (simplified)
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, button, a');
    let lowContrastCount = 0;
    
    Array.from(textElements).slice(0, 50).forEach(el => {
      if (el.textContent?.trim()) {
        const styles = window.getComputedStyle(el);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        
        // Very basic check for obvious contrast issues
        if (color === backgroundColor || 
            (color === 'rgb(128, 128, 128)' && backgroundColor === 'rgb(255, 255, 255)')) {
          lowContrastCount++;
        }
      }
    });
    metrics.lowContrastElements = lowContrastCount;

    // Calculate basic score
    let deductions = 0;
    deductions += metrics.missingAltText * 5;
    deductions += metrics.missingAriaLabels * 3;
    deductions += metrics.lowContrastElements * 2;
    
    metrics.score = Math.max(0, 100 - deductions);

    return metrics;
  }

  analyzePhaseIssues(phaseId, metrics) {
    const issues = [];

    switch (phaseId) {
      case 'page-load':
        if (metrics.loadTime > 3000) {
          issues.push({
            type: 'performance',
            severity: 'warning',
            message: `Slow page load: ${metrics.loadTime}ms`
          });
        }
        if (metrics.domNodes > 2000) {
          issues.push({
            type: 'performance',
            severity: 'info',
            message: `Large DOM: ${metrics.domNodes} nodes`
          });
        }
        break;

      case 'helix-interaction':
        if (metrics.averageResponseTime > 100) {
          issues.push({
            type: 'performance',
            severity: 'warning',
            message: `Slow interaction response: ${metrics.averageResponseTime}ms`
          });
        }
        if (metrics.interactionsSuccessful < 3) {
          issues.push({
            type: 'functionality',
            severity: 'critical',
            message: `Failed interactions: ${4 - metrics.interactionsSuccessful} out of 4`
          });
        }
        break;

      case 'scroll-performance':
        if (metrics.fps < 30) {
          issues.push({
            type: 'performance',
            severity: 'warning',
            message: `Low FPS during scroll: ${metrics.fps}fps`
          });
        }
        if (metrics.smoothness < 70) {
          issues.push({
            type: 'performance',
            severity: 'warning',
            message: `Poor scroll smoothness: ${metrics.smoothness}%`
          });
        }
        break;

      case 'memory-usage':
        if (metrics.memoryGrowth > 20) {
          issues.push({
            type: 'memory',
            severity: 'critical',
            message: `High memory growth: ${metrics.memoryGrowth}MB`
          });
        } else if (metrics.memoryGrowth > 10) {
          issues.push({
            type: 'memory',
            severity: 'warning',
            message: `Moderate memory growth: ${metrics.memoryGrowth}MB`
          });
        }
        break;

      case 'accessibility-check':
        if (metrics.score < 80) {
          issues.push({
            type: 'accessibility',
            severity: 'warning',
            message: `Low accessibility score: ${metrics.score}%`
          });
        }
        if (metrics.missingAltText > 0) {
          issues.push({
            type: 'accessibility',
            severity: 'warning',
            message: `${metrics.missingAltText} images missing alt text`
          });
        }
        break;
    }

    return issues;
  }

  generateReport() {
    const endTime = new Date();
    const duration = Math.round((endTime - this.startTime) / 1000);
    
    const totalIssues = this.results.flatMap(r => r.issues || []);
    const criticalIssues = totalIssues.filter(i => i.severity === 'critical');
    const warningIssues = totalIssues.filter(i => i.severity === 'warning');
    const infoIssues = totalIssues.filter(i => i.severity === 'info');

    const overallStatus = criticalIssues.length > 0 ? 'CRITICAL' :
                         warningIssues.length > 0 ? 'WARNING' : 'PASS';

    // Calculate overall performance score
    const performanceMetrics = this.results.find(r => r.id === 'scroll-performance')?.metrics;
    const loadMetrics = this.results.find(r => r.id === 'page-load')?.metrics;
    const accessibilityMetrics = this.results.find(r => r.id === 'accessibility-check')?.metrics;

    let overallScore = 100;
    if (performanceMetrics?.fps < 30) overallScore -= 20;
    if (loadMetrics?.loadTime > 3000) overallScore -= 15;
    if (accessibilityMetrics?.score < 80) overallScore -= 15;

    return {
      meta: {
        startTime: this.startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration: `${duration}s`,
        testRunner: 'ClientTestRunner v1.0',
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`
      },
      overall: {
        status: overallStatus,
        score: Math.max(0, overallScore),
        totalPhases: this.results.length,
        successfulPhases: this.results.filter(r => r.success).length,
        totalIssues: totalIssues.length,
        criticalIssues: criticalIssues.length,
        warningIssues: warningIssues.length,
        infoIssues: infoIssues.length
      },
      results: this.results,
      issuesSummary: {
        critical: criticalIssues,
        warnings: warningIssues,
        info: infoIssues
      },
      recommendations: this.generateRecommendations(totalIssues)
    };
  }

  generateRecommendations(issues) {
    const recommendations = [];
    const issuesByType = {};

    issues.forEach(issue => {
      if (!issuesByType[issue.type]) {
        issuesByType[issue.type] = [];
      }
      issuesByType[issue.type].push(issue);
    });

    if (issuesByType.performance) {
      recommendations.push({
        category: 'Performance',
        priority: 'high',
        items: [
          'Optimize scroll event handling for better frame rates',
          'Consider implementing scroll throttling or debouncing',
          'Review CSS animations for GPU acceleration',
          'Minimize DOM manipulations during interactions'
        ]
      });
    }

    if (issuesByType.memory) {
      recommendations.push({
        category: 'Memory Management',
        priority: 'high',
        items: [
          'Review event listener cleanup',
          'Check for memory leaks in animation loops',
          'Consider object pooling for frequently created objects'
        ]
      });
    }

    if (issuesByType.accessibility) {
      recommendations.push({
        category: 'Accessibility',
        priority: 'medium',
        items: [
          'Add alt text to all images',
          'Ensure interactive elements have accessible names',
          'Improve color contrast ratios',
          'Add keyboard navigation support'
        ]
      });
    }

    return recommendations;
  }
}