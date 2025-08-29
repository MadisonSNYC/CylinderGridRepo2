import { chromium } from 'playwright';
import { injectAxe, getAxeResults } from '@axe-core/playwright';
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import prettyBytes from 'pretty-bytes';
import { 
  TEST_PAGES, 
  DEVICE_PROFILES, 
  MODES, 
  INTERACTION_SCRIPTS, 
  PERFORMANCE_THRESHOLDS,
  BASE_URL 
} from './testConfig.js';

class HelixTestRunner {
  constructor() {
    this.results = [];
    this.startTime = null;
    this.onProgress = null; // Callback for progress updates
  }

  setProgressCallback(callback) {
    this.onProgress = callback;
  }

  async runLighthouse(url, formFactor) {
    let chrome = null;
    try {
      chrome = await launch({
        chromeFlags: [
          '--headless=new',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-extensions',
          ...(formFactor === 'mobile' ? [
            '--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15'
          ] : [])
        ],
      });

      const opts = {
        logLevel: 'error',
        output: 'json',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        port: chrome.port,
        formFactor,
        screenEmulation: { 
          mobile: formFactor === 'mobile', 
          disabled: false 
        },
        throttling: {
          rttMs: formFactor === 'mobile' ? 150 : 40,
          throughputKbps: formFactor === 'mobile' ? 1638.4 : 10240,
          cpuSlowdownMultiplier: formFactor === 'mobile' ? 4 : 1
        }
      };

      const { lhr } = await lighthouse(url, opts);
      
      return {
        performance: Math.round((lhr.categories.performance?.score || 0) * 100),
        accessibility: Math.round((lhr.categories.accessibility?.score || 0) * 100),
        bestPractices: Math.round((lhr.categories['best-practices']?.score || 0) * 100),
        seo: Math.round((lhr.categories.seo?.score || 0) * 100),
        metrics: {
          LCP: lhr.audits['largest-contentful-paint']?.numericValue,
          CLS: lhr.audits['cumulative-layout-shift']?.numericValue,
          FID: lhr.audits['max-potential-fid']?.numericValue,
          TBT: lhr.audits['total-blocking-time']?.numericValue,
          FCP: lhr.audits['first-contentful-paint']?.numericValue,
          SI: lhr.audits['speed-index']?.numericValue
        },
        opportunities: lhr.audits ? Object.keys(lhr.audits)
          .filter(key => lhr.audits[key]?.scoreDisplayMode === 'numeric' && 
                         lhr.audits[key]?.score < 0.9)
          .slice(0, 5)
          .map(key => ({
            id: key,
            title: lhr.audits[key].title,
            description: lhr.audits[key].description,
            score: Math.round((lhr.audits[key].score || 0) * 100)
          })) : []
      };
    } catch (error) {
      console.error('Lighthouse error:', error);
      return {
        error: error.message,
        performance: 0,
        accessibility: 0,
        bestPractices: 0,
        seo: 0,
        metrics: {},
        opportunities: []
      };
    } finally {
      if (chrome) {
        await chrome.kill().catch(() => {});
      }
    }
  }

  async runHelixSpecificTests(page) {
    const helixMetrics = {};
    
    try {
      // Inject performance monitoring
      await page.addScriptTag({
        content: `
          window.helixTestMetrics = {
            frameCount: 0,
            renderTimes: [],
            memorySnapshots: [],
            scrollEvents: 0,
            startTime: performance.now()
          };
          
          // Monitor performance
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.entryType === 'measure') {
                window.helixTestMetrics.renderTimes.push(entry.duration);
              }
            }
          });
          observer.observe({ entryTypes: ['measure'] });
          
          // Monitor scroll events
          let lastScrollTime = 0;
          window.addEventListener('wheel', () => {
            const now = performance.now();
            if (now - lastScrollTime > 16) { // Throttle to ~60fps
              window.helixTestMetrics.scrollEvents++;
              lastScrollTime = now;
            }
          });
          
          // Monitor memory if available
          if (performance.memory) {
            setInterval(() => {
              window.helixTestMetrics.memorySnapshots.push({
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                timestamp: performance.now()
              });
            }, 1000);
          }
          
          // Monitor frame rate
          let lastFrameTime = performance.now();
          function measureFPS() {
            const now = performance.now();
            const delta = now - lastFrameTime;
            if (delta > 16) { // Only count meaningful frames
              window.helixTestMetrics.frameCount++;
            }
            lastFrameTime = now;
            requestAnimationFrame(measureFPS);
          }
          measureFPS();
        `
      });

      // Wait for helix to initialize
      await page.waitForSelector('.helix-scene', { timeout: 10000 });
      await page.waitForTimeout(2000);

      // Run helix-specific interactions
      await INTERACTION_SCRIPTS.helix_specific(page);

      // Collect metrics
      helixMetrics = await page.evaluate(() => {
        const metrics = window.helixTestMetrics;
        const duration = performance.now() - metrics.startTime;
        
        return {
          duration: Math.round(duration),
          averageFPS: Math.round((metrics.frameCount * 1000) / duration),
          averageRenderTime: metrics.renderTimes.length > 0 
            ? Math.round(metrics.renderTimes.reduce((a, b) => a + b, 0) / metrics.renderTimes.length * 100) / 100
            : 0,
          scrollResponsiveness: Math.round(metrics.scrollEvents / (duration / 1000)),
          memoryGrowth: metrics.memorySnapshots.length > 1 
            ? Math.round((metrics.memorySnapshots[metrics.memorySnapshots.length - 1].used - 
                         metrics.memorySnapshots[0].used) / 1024 / 1024 * 100) / 100
            : 0,
          totalScrollEvents: metrics.scrollEvents,
          totalRenderEvents: metrics.renderTimes.length,
          peakMemoryUsage: metrics.memorySnapshots.length > 0 
            ? Math.round(Math.max(...metrics.memorySnapshots.map(s => s.used)) / 1024 / 1024 * 100) / 100
            : 0
        };
      });

      // Check for helix-specific elements
      const helixElements = await page.evaluate(() => {
        return {
          totalCards: document.querySelectorAll('.helix-node:not([data-orb-index])').length,
          visibleCards: Array.from(document.querySelectorAll('.helix-node:not([data-orb-index])'))
            .filter(card => {
              const rect = card.getBoundingClientRect();
              return rect.width > 0 && rect.height > 0;
            }).length,
          helixScenePresent: !!document.querySelector('.helix-scene'),
          devPanelPresent: !!document.querySelector('[data-testid="dev-panel"]') || !!document.querySelector('.dev-panel'),
          testSuitePresent: !!document.querySelector('[data-testid="comprehensive-test"]')
        };
      });

      return { ...helixMetrics, ...helixElements };
    } catch (error) {
      console.error('Helix-specific test error:', error);
      return { error: error.message };
    }
  }

  async runFullTestSuite() {
    this.startTime = new Date();
    this.results = [];
    
    let totalTests = TEST_PAGES.length * DEVICE_PROFILES.length * MODES.length * 2; // 2 interaction types
    let currentTest = 0;

    if (this.onProgress) {
      this.onProgress({ 
        phase: 'starting',
        current: 0, 
        total: totalTests,
        message: 'Initializing test suite...' 
      });
    }

    for (const pageDef of TEST_PAGES) {
      for (const device of DEVICE_PROFILES) {
        for (const mode of MODES) {
          for (const interaction of ['none', 'helix_specific']) {
            currentTest++;
            const url = `${BASE_URL}${pageDef.url}`;
            
            if (this.onProgress) {
              this.onProgress({ 
                phase: 'testing',
                current: currentTest, 
                total: totalTests,
                message: `Testing ${pageDef.label} on ${device.name} (${mode.name}, ${interaction})` 
              });
            }

            let browser = null;
            try {
              browser = await chromium.launch({ 
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
              });
              
              const context = await browser.newContext({
                viewport: device.viewport,
                userAgent: device.userAgent,
                reducedMotion: mode.reducedMotion ? 'reduce' : 'no-preference',
                // Disable animations for consistent testing
                ...(mode.reducedMotion && {
                  extraHTTPHeaders: {
                    'prefers-reduced-motion': 'reduce'
                  }
                })
              });

              const page = await context.newPage();
              
              // Navigate with extended timeout for helix loading
              await page.goto(url, { 
                waitUntil: 'networkidle', 
                timeout: 30000 
              });

              // Inject axe for accessibility testing
              await injectAxe(page);

              // Run interaction script
              await INTERACTION_SCRIPTS[interaction](page);

              // Get accessibility results
              const axeResults = await getAxeResults(page);
              
              // Run helix-specific tests
              const helixMetrics = await this.runHelixSpecificTests(page);
              
              // Run Lighthouse
              const lighthouse = await this.runLighthouse(url, device.name);

              // Collect final result
              const result = {
                page: pageDef.label,
                url,
                device: device.name,
                motion: mode.name,
                interaction,
                timestamp: new Date().toISOString(),
                lighthouse,
                accessibility: {
                  violations: axeResults.violations.length,
                  passes: axeResults.passes.length,
                  incomplete: axeResults.incomplete.length,
                  topViolations: axeResults.violations.slice(0, 5).map(v => ({
                    id: v.id,
                    impact: v.impact,
                    description: v.description,
                    nodes: v.nodes.length
                  }))
                },
                helixMetrics,
                issues: this.analyzeIssues(lighthouse, axeResults.violations, helixMetrics)
              };

              this.results.push(result);

            } catch (error) {
              console.error(`Test failed for ${pageDef.label}:`, error);
              this.results.push({
                page: pageDef.label,
                url,
                device: device.name,
                motion: mode.name,
                interaction,
                timestamp: new Date().toISOString(),
                error: error.message,
                issues: [{ type: 'error', severity: 'critical', message: error.message }]
              });
            } finally {
              if (browser) {
                await browser.close().catch(() => {});
              }
            }
          }
        }
      }
    }

    if (this.onProgress) {
      this.onProgress({ 
        phase: 'complete',
        current: totalTests, 
        total: totalTests,
        message: 'Test suite completed!' 
      });
    }

    return this.generateReport();
  }

  analyzeIssues(lighthouse, axeViolations, helixMetrics) {
    const issues = [];
    const thresholds = PERFORMANCE_THRESHOLDS;

    // Lighthouse issues
    if (lighthouse.performance < thresholds.lighthouse.performance) {
      issues.push({
        type: 'performance',
        severity: lighthouse.performance < 50 ? 'critical' : 'warning',
        message: `Low Lighthouse performance score: ${lighthouse.performance}`,
        metric: 'lighthouse_performance',
        value: lighthouse.performance,
        threshold: thresholds.lighthouse.performance
      });
    }

    if (lighthouse.accessibility < thresholds.lighthouse.accessibility) {
      issues.push({
        type: 'accessibility',
        severity: lighthouse.accessibility < 70 ? 'critical' : 'warning',
        message: `Low accessibility score: ${lighthouse.accessibility}`,
        metric: 'lighthouse_accessibility',
        value: lighthouse.accessibility,
        threshold: thresholds.lighthouse.accessibility
      });
    }

    // Core Web Vitals
    if (lighthouse.metrics?.LCP > thresholds.metrics.LCP) {
      issues.push({
        type: 'performance',
        severity: 'warning',
        message: `Poor LCP: ${Math.round(lighthouse.metrics.LCP)}ms`,
        metric: 'lcp',
        value: Math.round(lighthouse.metrics.LCP),
        threshold: thresholds.metrics.LCP
      });
    }

    if (lighthouse.metrics?.CLS > thresholds.metrics.CLS) {
      issues.push({
        type: 'performance',
        severity: 'warning',
        message: `Poor CLS: ${lighthouse.metrics.CLS.toFixed(3)}`,
        metric: 'cls',
        value: lighthouse.metrics.CLS,
        threshold: thresholds.metrics.CLS
      });
    }

    // Helix-specific issues
    if (helixMetrics.averageFPS && helixMetrics.averageFPS < thresholds.helix_specific.minFPS) {
      issues.push({
        type: 'performance',
        severity: helixMetrics.averageFPS < 20 ? 'critical' : 'warning',
        message: `Low FPS in helix: ${helixMetrics.averageFPS}fps`,
        metric: 'helix_fps',
        value: helixMetrics.averageFPS,
        threshold: thresholds.helix_specific.minFPS
      });
    }

    if (helixMetrics.averageRenderTime && helixMetrics.averageRenderTime > thresholds.helix_specific.maxRenderTime) {
      issues.push({
        type: 'performance',
        severity: helixMetrics.averageRenderTime > 100 ? 'critical' : 'warning',
        message: `High render time: ${helixMetrics.averageRenderTime}ms`,
        metric: 'helix_render_time',
        value: helixMetrics.averageRenderTime,
        threshold: thresholds.helix_specific.maxRenderTime
      });
    }

    if (helixMetrics.memoryGrowth && helixMetrics.memoryGrowth > thresholds.helix_specific.maxMemoryIncrease) {
      issues.push({
        type: 'memory',
        severity: helixMetrics.memoryGrowth > 100 ? 'critical' : 'warning',
        message: `High memory growth: ${helixMetrics.memoryGrowth}MB`,
        metric: 'helix_memory_growth',
        value: helixMetrics.memoryGrowth,
        threshold: thresholds.helix_specific.maxMemoryIncrease
      });
    }

    // Accessibility violations
    const criticalA11yViolations = axeViolations.filter(v => v.impact === 'critical' || v.impact === 'serious');
    if (criticalA11yViolations.length > 0) {
      issues.push({
        type: 'accessibility',
        severity: 'critical',
        message: `${criticalA11yViolations.length} critical accessibility violations`,
        metric: 'axe_violations',
        value: criticalA11yViolations.length,
        details: criticalA11yViolations.slice(0, 3).map(v => v.description)
      });
    }

    return issues;
  }

  generateReport() {
    const endTime = new Date();
    const duration = Math.round((endTime - this.startTime) / 1000);
    
    // Overall statistics
    const totalTests = this.results.length;
    const successfulTests = this.results.filter(r => !r.error).length;
    const failedTests = totalTests - successfulTests;
    
    // Performance averages
    const validResults = this.results.filter(r => r.lighthouse && !r.error);
    const avgPerformance = validResults.length > 0 
      ? Math.round(validResults.reduce((sum, r) => sum + (r.lighthouse.performance || 0), 0) / validResults.length)
      : 0;
    const avgAccessibility = validResults.length > 0 
      ? Math.round(validResults.reduce((sum, r) => sum + (r.lighthouse.accessibility || 0), 0) / validResults.length)
      : 0;
    
    // Issue analysis
    const allIssues = this.results.flatMap(r => r.issues || []);
    const criticalIssues = allIssues.filter(i => i.severity === 'critical');
    const warningIssues = allIssues.filter(i => i.severity === 'warning');
    
    // Per-page summary
    const pageGroups = new Map();
    this.results.forEach(result => {
      if (!pageGroups.has(result.page)) {
        pageGroups.set(result.page, []);
      }
      pageGroups.get(result.page).push(result);
    });
    
    const perPageSummary = Array.from(pageGroups.entries()).map(([page, results]) => {
      const validResults = results.filter(r => r.lighthouse && !r.error);
      const avgPerf = validResults.length > 0 
        ? Math.round(validResults.reduce((sum, r) => sum + (r.lighthouse.performance || 0), 0) / validResults.length)
        : 0;
      const avgA11y = validResults.length > 0 
        ? Math.round(validResults.reduce((sum, r) => sum + (r.lighthouse.accessibility || 0), 0) / validResults.length)
        : 0;
      const pageIssues = results.flatMap(r => r.issues || []);
      
      return {
        page,
        runs: results.length,
        successful: results.filter(r => !r.error).length,
        avgPerformance: avgPerf,
        avgAccessibility: avgA11y,
        criticalIssues: pageIssues.filter(i => i.severity === 'critical').length,
        warningIssues: pageIssues.filter(i => i.severity === 'warning').length,
        totalIssues: pageIssues.length
      };
    });
    
    // Generate human-readable summary
    const overallStatus = criticalIssues.length > 0 ? 'CRITICAL' : 
                         warningIssues.length > 0 ? 'WARNING' : 'PASS';
    
    return {
      meta: {
        startTime: this.startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration: `${duration}s`,
        testRunner: 'HelixTestRunner v1.0',
        baseUrl: BASE_URL
      },
      overall: {
        status: overallStatus,
        totalTests,
        successfulTests,
        failedTests,
        avgPerformance,
        avgAccessibility,
        totalIssues: allIssues.length,
        criticalIssues: criticalIssues.length,
        warningIssues: warningIssues.length
      },
      perPageSummary,
      detailedResults: this.results,
      issuesSummary: {
        critical: criticalIssues,
        warnings: warningIssues
      },
      recommendations: this.generateRecommendations(allIssues)
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
          'Consider implementing virtual scrolling for large datasets',
          'Optimize video loading and compression',
          'Review CSS animations and transitions for GPU acceleration',
          'Implement proper image lazy loading and optimization'
        ]
      });
    }
    
    if (issuesByType.memory) {
      recommendations.push({
        category: 'Memory Management',
        priority: 'high',
        items: [
          'Review event listener cleanup in useEffect hooks',
          'Implement proper disposal of Three.js objects',
          'Consider using WeakMap for caching to allow garbage collection',
          'Monitor for memory leaks in animation loops'
        ]
      });
    }
    
    if (issuesByType.accessibility) {
      recommendations.push({
        category: 'Accessibility',
        priority: 'critical',
        items: [
          'Add proper ARIA labels to interactive elements',
          'Ensure sufficient color contrast ratios',
          'Implement keyboard navigation support',
          'Add screen reader support for dynamic content'
        ]
      });
    }
    
    return recommendations;
  }
}

export { HelixTestRunner };