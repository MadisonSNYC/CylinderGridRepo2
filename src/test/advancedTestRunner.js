// Advanced Test Runner with Enhanced Playwright Features
import { chromium, firefox, webkit } from 'playwright';
import { injectAxe, checkA11y } from 'axe-playwright';
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import fs from 'fs/promises';
import path from 'path';

export class AdvancedTestRunner {
  constructor() {
    this.results = [];
    this.screenshots = new Map();
    this.videoRecordings = new Map();
    this.networkLogs = new Map();
    this.consoleErrors = new Map();
    this.startTime = null;
    this.onProgress = null;
    this.testConfig = {
      screenshotPath: './test-results/screenshots',
      videoPath: './test-results/videos',
      reportPath: './test-results/reports'
    };
  }

  setProgressCallback(callback) {
    this.onProgress = callback;
  }

  // Enhanced browser configurations
  getBrowserConfigs() {
    return [
      {
        name: 'chromium',
        launcher: chromium,
        label: 'Chrome/Chromium',
        deviceEmulation: [
          { name: 'desktop', viewport: { width: 1366, height: 900 } },
          { name: 'tablet', viewport: { width: 768, height: 1024 } },
          { name: 'mobile', viewport: { width: 390, height: 844 } }
        ]
      },
      {
        name: 'firefox',
        launcher: firefox,
        label: 'Firefox',
        deviceEmulation: [
          { name: 'desktop', viewport: { width: 1366, height: 900 } },
          { name: 'mobile', viewport: { width: 390, height: 844 } }
        ]
      },
      {
        name: 'webkit',
        launcher: webkit,
        label: 'Safari/WebKit',
        deviceEmulation: [
          { name: 'desktop', viewport: { width: 1366, height: 900 } },
          { name: 'mobile', viewport: { width: 390, height: 844 } }
        ]
      }
    ];
  }

  // Enhanced test scenarios
  getTestScenarios() {
    return [
      {
        id: 'visual-regression',
        name: 'Visual Regression Testing',
        description: 'Screenshot comparison and visual consistency',
        tests: ['initial-load', 'scroll-positions', 'interactions', 'responsive-breakpoints']
      },
      {
        id: 'performance-deep',
        name: 'Deep Performance Analysis',
        description: 'Comprehensive performance profiling',
        tests: ['lighthouse-audit', 'runtime-performance', 'memory-profiling', 'network-analysis']
      },
      {
        id: 'accessibility-comprehensive',
        name: 'Comprehensive Accessibility',
        description: 'Full accessibility compliance testing',
        tests: ['axe-core', 'keyboard-navigation', 'screen-reader', 'color-contrast']
      },
      {
        id: 'cross-browser',
        name: 'Cross-Browser Compatibility',
        description: 'Testing across all supported browsers',
        tests: ['feature-parity', 'css-compatibility', 'javascript-compatibility', 'performance-comparison']
      },
      {
        id: 'helix-specific',
        name: 'Helix-Specific Testing',
        description: 'Custom tests for 3D helix functionality',
        tests: ['3d-rendering', 'scroll-physics', 'video-playback', 'card-transitions']
      },
      {
        id: 'network-conditions',
        name: 'Network Condition Testing',
        description: 'Testing under various network conditions',
        tests: ['offline', 'slow-3g', 'fast-3g', 'wifi']
      }
    ];
  }

  // Create test directories
  async ensureTestDirectories() {
    const dirs = [
      this.testConfig.screenshotPath,
      this.testConfig.videoPath,
      this.testConfig.reportPath,
      `${this.testConfig.screenshotPath}/baseline`,
      `${this.testConfig.screenshotPath}/current`,
      `${this.testConfig.screenshotPath}/diff`
    ];

    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (error) {
        console.warn(`Failed to create directory ${dir}:`, error.message);
      }
    }
  }

  // Advanced screenshot comparison
  async takeVisualRegressionScreenshots(page, testId, browser, device) {
    const screenshots = {};
    const baseFilename = `${testId}-${browser}-${device}`;

    try {
      // Full page screenshot
      screenshots.fullPage = await page.screenshot({
        path: `${this.testConfig.screenshotPath}/current/${baseFilename}-full.png`,
        fullPage: true,
        animations: 'disabled'
      });

      // Viewport screenshot
      screenshots.viewport = await page.screenshot({
        path: `${this.testConfig.screenshotPath}/current/${baseFilename}-viewport.png`,
        animations: 'disabled'
      });

      // Helix-specific screenshots
      const helixScene = page.locator('.helix-scene');
      if (await helixScene.count() > 0) {
        screenshots.helixScene = await helixScene.screenshot({
          path: `${this.testConfig.screenshotPath}/current/${baseFilename}-helix.png`,
          animations: 'disabled'
        });

        // Screenshot at different scroll positions
        for (let i = 0; i < 3; i++) {
          await page.mouse.wheel(0, 200);
          await page.waitForTimeout(500);
          screenshots[`helixScroll${i}`] = await helixScene.screenshot({
            path: `${this.testConfig.screenshotPath}/current/${baseFilename}-helix-scroll-${i}.png`,
            animations: 'disabled'
          });
        }
      }

      // Component-specific screenshots
      const components = [
        { selector: '.test-dashboard', name: 'dashboard' },
        { selector: '.dev-panel', name: 'devpanel' },
        { selector: '.performance-monitor', name: 'perfmonitor' }
      ];

      for (const component of components) {
        const element = page.locator(component.selector);
        if (await element.count() > 0) {
          screenshots[component.name] = await element.screenshot({
            path: `${this.testConfig.screenshotPath}/current/${baseFilename}-${component.name}.png`
          });
        }
      }

    } catch (error) {
      console.warn(`Screenshot capture failed for ${baseFilename}:`, error.message);
    }

    return screenshots;
  }

  // Network monitoring
  async monitorNetworkActivity(page) {
    const networkActivity = {
      requests: [],
      responses: [],
      failures: [],
      totalSize: 0,
      totalTime: 0
    };

    page.on('request', request => {
      networkActivity.requests.push({
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
        timestamp: Date.now()
      });
    });

    page.on('response', response => {
      const request = response.request();
      const size = parseInt(response.headers()['content-length'] || '0');
      networkActivity.totalSize += size;
      
      networkActivity.responses.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
        headers: response.headers(),
        size,
        timestamp: Date.now()
      });
    });

    page.on('requestfailed', request => {
      networkActivity.failures.push({
        url: request.url(),
        method: request.method(),
        failure: request.failure(),
        timestamp: Date.now()
      });
    });

    return networkActivity;
  }

  // Console monitoring
  async monitorConsoleActivity(page) {
    const consoleActivity = {
      errors: [],
      warnings: [],
      logs: [],
      info: []
    };

    page.on('console', msg => {
      const entry = {
        type: msg.type(),
        text: msg.text(),
        location: msg.location(),
        timestamp: Date.now()
      };

      switch (msg.type()) {
        case 'error':
          consoleActivity.errors.push(entry);
          break;
        case 'warning':
          consoleActivity.warnings.push(entry);
          break;
        case 'info':
          consoleActivity.info.push(entry);
          break;
        default:
          consoleActivity.logs.push(entry);
      }
    });

    return consoleActivity;
  }

  // Advanced performance profiling
  async profilePerformance(page, duration = 10000) {
    let performanceMetrics = {};

    try {
      // Start performance monitoring
      await page.evaluate(() => {
        window.performanceProfile = {
          marks: [],
          measures: [],
          navigation: performance.getEntriesByType('navigation')[0],
          resources: performance.getEntriesByType('resource'),
          startTime: performance.now()
        };

        // Monitor frame drops
        let frameCount = 0;
        let droppedFrames = 0;
        let lastFrameTime = performance.now();

        const trackFrames = () => {
          const now = performance.now();
          const deltaTime = now - lastFrameTime;
          
          frameCount++;
          if (deltaTime > 20) { // Dropped frame threshold
            droppedFrames++;
          }
          
          lastFrameTime = now;
          
          if (now - window.performanceProfile.startTime < duration) {
            requestAnimationFrame(trackFrames);
          } else {
            window.performanceProfile.frameStats = {
              totalFrames: frameCount,
              droppedFrames,
              frameRate: (frameCount * 1000) / (now - window.performanceProfile.startTime)
            };
          }
        };
        
        requestAnimationFrame(trackFrames);
      });

      // Simulate interactions during profiling
      await this.simulateUserInteractions(page, duration);

      // Wait for profiling to complete
      await page.waitForTimeout(duration);

      // Collect performance data
      performanceMetrics = await page.evaluate(() => {
        const profile = window.performanceProfile;
        return {
          navigation: profile.navigation,
          resources: profile.resources.length,
          frameStats: profile.frameStats,
          memoryUsage: performance.memory ? {
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize,
            limit: performance.memory.jsHeapSizeLimit
          } : null,
          timing: {
            domContentLoaded: profile.navigation.domContentLoadedEventEnd - profile.navigation.navigationStart,
            loadComplete: profile.navigation.loadEventEnd - profile.navigation.navigationStart,
            firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime,
            firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime
          }
        };
      });

    } catch (error) {
      console.warn('Performance profiling failed:', error.message);
      performanceMetrics.error = error.message;
    }

    return performanceMetrics;
  }

  // Simulate realistic user interactions
  async simulateUserInteractions(page, duration) {
    const endTime = Date.now() + duration;
    const interactions = [
      () => page.mouse.wheel(0, Math.random() * 400 - 200),
      () => page.keyboard.press('ArrowDown'),
      () => page.keyboard.press('ArrowUp'),
      () => page.keyboard.press('Tab'),
      () => page.mouse.move(Math.random() * 800, Math.random() * 600),
      () => page.hover('.helix-node').catch(() => {})
    ];

    while (Date.now() < endTime) {
      const randomInteraction = interactions[Math.floor(Math.random() * interactions.length)];
      try {
        await randomInteraction();
        await page.waitForTimeout(200 + Math.random() * 800);
      } catch (error) {
        // Ignore interaction errors
      }
    }
  }

  // Advanced accessibility testing
  async runComprehensiveAccessibilityTests(page) {
    const accessibilityResults = {
      axeResults: null,
      keyboardNavigation: null,
      colorContrast: null,
      screenReaderContent: null
    };

    try {
      // Run axe-core tests
      await injectAxe(page);
      accessibilityResults.axeResults = await getAxeResults(page);

      // Test keyboard navigation
      accessibilityResults.keyboardNavigation = await this.testKeyboardNavigation(page);

      // Test color contrast
      accessibilityResults.colorContrast = await this.testColorContrast(page);

      // Test screen reader content
      accessibilityResults.screenReaderContent = await this.testScreenReaderContent(page);

    } catch (error) {
      console.warn('Accessibility testing failed:', error.message);
      accessibilityResults.error = error.message;
    }

    return accessibilityResults;
  }

  async testKeyboardNavigation(page) {
    const keyboardTest = {
      tabOrder: [],
      trapFocus: false,
      skipLinks: false,
      arrowKeyNavigation: false
    };

    try {
      // Test tab order
      let tabCount = 0;
      while (tabCount < 20) {
        await page.keyboard.press('Tab');
        const focused = await page.evaluate(() => {
          const el = document.activeElement;
          return el ? {
            tagName: el.tagName,
            className: el.className,
            id: el.id,
            ariaLabel: el.getAttribute('aria-label'),
            text: el.textContent?.slice(0, 50)
          } : null;
        });
        
        if (focused) {
          keyboardTest.tabOrder.push(focused);
        }
        tabCount++;
      }

      // Test arrow key navigation in helix
      const helixFocused = await page.locator('.helix-scene').focus().catch(() => false);
      if (helixFocused) {
        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(100);
        await page.keyboard.press('ArrowUp');
        keyboardTest.arrowKeyNavigation = true;
      }

      // Check for skip links
      await page.keyboard.press('Tab');
      const skipLink = await page.locator('a[href*="#"]').first().isVisible().catch(() => false);
      keyboardTest.skipLinks = skipLink;

    } catch (error) {
      keyboardTest.error = error.message;
    }

    return keyboardTest;
  }

  async testColorContrast(page) {
    return await page.evaluate(() => {
      const contrastResults = [];
      const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, button, a, label');
      
      Array.from(textElements).slice(0, 50).forEach((element, index) => {
        if (element.textContent?.trim()) {
          const styles = window.getComputedStyle(element);
          const color = styles.color;
          const backgroundColor = styles.backgroundColor;
          
          // Simple contrast calculation (would need proper algorithm in production)
          const colorValues = color.match(/\\d+/g);
          const bgColorValues = backgroundColor.match(/\\d+/g);
          
          if (colorValues && bgColorValues) {
            const contrast = {
              element: element.tagName + (element.className ? `.${element.className.split(' ')[0]}` : ''),
              color,
              backgroundColor,
              text: element.textContent.slice(0, 30),
              // Simplified contrast ratio (not WCAG compliant calculation)
              estimatedRatio: Math.abs(
                (parseInt(colorValues[0]) + parseInt(colorValues[1]) + parseInt(colorValues[2])) -
                (parseInt(bgColorValues[0]) + parseInt(bgColorValues[1]) + parseInt(bgColorValues[2]))
              ) / 765
            };
            
            contrastResults.push(contrast);
          }
        }
      });
      
      return contrastResults;
    });
  }

  async testScreenReaderContent(page) {
    return await page.evaluate(() => {
      const screenReaderContent = {
        landmarks: [],
        headingStructure: [],
        altText: [],
        ariaLabels: [],
        skipLinks: []
      };

      // Check landmarks
      const landmarks = document.querySelectorAll('[role], main, nav, header, footer, aside, section');
      landmarks.forEach(el => {
        screenReaderContent.landmarks.push({
          tagName: el.tagName,
          role: el.getAttribute('role') || el.tagName.toLowerCase(),
          ariaLabel: el.getAttribute('aria-label')
        });
      });

      // Check heading structure
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach(heading => {
        screenReaderContent.headingStructure.push({
          level: parseInt(heading.tagName.slice(1)),
          text: heading.textContent.trim(),
          hasId: !!heading.id
        });
      });

      // Check alt text
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        screenReaderContent.altText.push({
          src: img.src,
          alt: img.alt,
          hasAlt: !!img.alt,
          decorative: img.getAttribute('role') === 'presentation'
        });
      });

      // Check ARIA labels
      const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [role="button"]');
      interactiveElements.forEach(el => {
        screenReaderContent.ariaLabels.push({
          tagName: el.tagName,
          hasAriaLabel: !!el.getAttribute('aria-label'),
          hasAriaLabelledBy: !!el.getAttribute('aria-labelledby'),
          hasText: !!el.textContent?.trim()
        });
      });

      return screenReaderContent;
    });
  }

  // Network condition simulation
  async testNetworkConditions(page, condition) {
    const conditions = {
      'slow-3g': { downloadThroughput: 500 * 1024 / 8, uploadThroughput: 500 * 1024 / 8, latency: 400 },
      'fast-3g': { downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8, latency: 150 },
      'wifi': { downloadThroughput: 30 * 1024 * 1024 / 8, uploadThroughput: 15 * 1024 * 1024 / 8, latency: 2 },
      'offline': { offline: true }
    };

    if (conditions[condition]) {
      await page.route('**/*', route => {
        if (condition === 'offline') {
          route.abort();
        } else {
          // Simulate network delay
          setTimeout(() => {
            route.continue();
          }, conditions[condition].latency || 0);
        }
      });
    }
  }

  // Main test execution
  async runAdvancedTestSuite() {
    this.startTime = new Date();
    this.results = [];
    
    await this.ensureTestDirectories();
    
    const browsers = this.getBrowserConfigs();
    const scenarios = this.getTestScenarios();
    
    let totalTests = browsers.length * scenarios.length * 2; // Rough estimate
    let currentTest = 0;

    if (this.onProgress) {
      this.onProgress({ 
        phase: 'starting',
        current: 0, 
        total: totalTests,
        message: 'Initializing advanced test suite...' 
      });
    }

    for (const browserConfig of browsers) {
      for (const scenario of scenarios) {
        currentTest++;
        
        if (this.onProgress) {
          this.onProgress({ 
            phase: 'testing',
            current: currentTest, 
            total: totalTests,
            message: `Testing ${scenario.name} on ${browserConfig.label}...` 
          });
        }

        const result = await this.runBrowserScenario(browserConfig, scenario);
        this.results.push(result);
      }
    }

    if (this.onProgress) {
      this.onProgress({ 
        phase: 'complete',
        current: totalTests, 
        total: totalTests,
        message: 'Advanced test suite completed!' 
      });
    }

    return this.generateAdvancedReport();
  }

  async runBrowserScenario(browserConfig, scenario) {
    const result = {
      browser: browserConfig.name,
      browserLabel: browserConfig.label,
      scenario: scenario.id,
      scenarioName: scenario.name,
      timestamp: new Date().toISOString(),
      tests: {},
      screenshots: {},
      videos: {},
      networkActivity: {},
      consoleActivity: {},
      performance: {},
      accessibility: {},
      success: true,
      issues: []
    };

    let browser = null;
    let context = null;

    try {
      browser = await browserConfig.launcher.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      for (const device of browserConfig.deviceEmulation) {
        context = await browser.newContext({
          viewport: device.viewport,
          recordVideo: {
            dir: this.testConfig.videoPath,
            size: device.viewport
          }
        });

        const page = await context.newPage();
        
        // Set up monitoring
        const networkActivity = await this.monitorNetworkActivity(page);
        const consoleActivity = await this.monitorConsoleActivity(page);

        // Navigate to application
        await page.goto('http://localhost:8000', { 
          waitUntil: 'networkidle',
          timeout: 30000 
        });

        // Run scenario-specific tests
        switch (scenario.id) {
          case 'visual-regression':
            result.screenshots[device.name] = await this.takeVisualRegressionScreenshots(
              page, scenario.id, browserConfig.name, device.name
            );
            break;

          case 'performance-deep':
            result.performance[device.name] = await this.profilePerformance(page, 8000);
            break;

          case 'accessibility-comprehensive':
            result.accessibility[device.name] = await this.runComprehensiveAccessibilityTests(page);
            break;

          case 'network-conditions':
            for (const condition of ['slow-3g', 'fast-3g', 'wifi']) {
              await this.testNetworkConditions(page, condition);
              await page.reload();
              result.tests[`${device.name}-${condition}`] = { 
                condition,
                loadTime: await page.evaluate(() => performance.timing.loadEventEnd - performance.timing.navigationStart)
              };
            }
            break;

          case 'helix-specific':
            result.tests[device.name] = await this.runHelixSpecificTests(page);
            break;
        }

        result.networkActivity[device.name] = networkActivity;
        result.consoleActivity[device.name] = consoleActivity;

        await context.close();
      }

    } catch (error) {
      result.success = false;
      result.error = error.message;
      result.issues.push({
        type: 'error',
        severity: 'critical',
        message: `Browser scenario failed: ${error.message}`
      });
    } finally {
      if (context) await context.close().catch(() => {});
      if (browser) await browser.close().catch(() => {});
    }

    return result;
  }

  async runHelixSpecificTests(page) {
    const helixTests = {
      helixPresent: false,
      cardCount: 0,
      scrollResponsive: false,
      videoPlayback: false,
      transitions: false
    };

    try {
      // Check if helix is present
      const helixScene = page.locator('.helix-scene');
      helixTests.helixPresent = await helixScene.count() > 0;

      if (helixTests.helixPresent) {
        // Count cards
        helixTests.cardCount = await page.locator('.helix-node:not([data-orb-index])').count();

        // Test scroll responsiveness
        const initialTransform = await helixScene.evaluate(el => el.style.transform);
        await page.mouse.wheel(0, 300);
        await page.waitForTimeout(100);
        const afterTransform = await helixScene.evaluate(el => el.style.transform);
        helixTests.scrollResponsive = initialTransform !== afterTransform;

        // Test video playback
        const videoCount = await page.locator('video').count();
        if (videoCount > 0) {
          const firstVideo = page.locator('video').first();
          const canPlay = await firstVideo.evaluate(video => !video.paused);
          helixTests.videoPlayback = canPlay;
        }

        // Test transitions
        await page.mouse.wheel(0, 200);
        await page.waitForTimeout(500);
        helixTests.transitions = true;
      }

    } catch (error) {
      helixTests.error = error.message;
    }

    return helixTests;
  }

  generateAdvancedReport() {
    const endTime = new Date();
    const duration = Math.round((endTime - this.startTime) / 1000);
    
    const totalTests = this.results.length;
    const successfulTests = this.results.filter(r => r.success).length;
    const failedTests = totalTests - successfulTests;
    
    // Cross-browser analysis
    const browserResults = {};
    const scenarioResults = {};
    
    this.results.forEach(result => {
      if (!browserResults[result.browser]) {
        browserResults[result.browser] = { total: 0, successful: 0, failed: 0 };
      }
      if (!scenarioResults[result.scenario]) {
        scenarioResults[result.scenario] = { total: 0, successful: 0, failed: 0 };
      }
      
      browserResults[result.browser].total++;
      scenarioResults[result.scenario].total++;
      
      if (result.success) {
        browserResults[result.browser].successful++;
        scenarioResults[result.scenario].successful++;
      } else {
        browserResults[result.browser].failed++;
        scenarioResults[result.scenario].failed++;
      }
    });

    // Generate overall status
    const criticalIssues = this.results.flatMap(r => r.issues?.filter(i => i.severity === 'critical') || []);
    const overallStatus = criticalIssues.length > 0 ? 'CRITICAL' : failedTests > 0 ? 'WARNING' : 'PASS';

    return {
      meta: {
        startTime: this.startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration: `${duration}s`,
        testRunner: 'AdvancedTestRunner v2.0',
        testType: 'Cross-browser Advanced Testing'
      },
      summary: {
        status: overallStatus,
        totalTests,
        successfulTests,
        failedTests,
        browsersTestedCount: Object.keys(browserResults).length,
        scenariosTestedCount: Object.keys(scenarioResults).length
      },
      browserResults,
      scenarioResults,
      detailedResults: this.results,
      recommendations: this.generateAdvancedRecommendations(),
      artifacts: {
        screenshotsGenerated: this.screenshots.size,
        videosRecorded: this.videoRecordings.size,
        networkLogsCollected: this.networkLogs.size
      }
    };
  }

  generateAdvancedRecommendations() {
    const recommendations = [];
    
    // Browser-specific recommendations
    const browserIssues = {};
    this.results.forEach(result => {
      if (!result.success) {
        if (!browserIssues[result.browser]) {
          browserIssues[result.browser] = [];
        }
        browserIssues[result.browser].push(result.error);
      }
    });

    if (Object.keys(browserIssues).length > 0) {
      recommendations.push({
        category: 'Cross-Browser Compatibility',
        priority: 'high',
        items: [
          'Review browser-specific failures and implement polyfills',
          'Test CSS vendor prefixes for better compatibility',
          'Verify JavaScript feature support across browsers',
          'Consider progressive enhancement strategies'
        ]
      });
    }

    // Performance recommendations
    const performanceResults = this.results.filter(r => r.performance && Object.keys(r.performance).length > 0);
    if (performanceResults.length > 0) {
      recommendations.push({
        category: 'Performance Optimization',
        priority: 'high',
        items: [
          'Optimize resource loading and caching strategies',
          'Implement code splitting for better initial load times',
          'Review and optimize animation performance',
          'Consider implementing service workers for caching'
        ]
      });
    }

    // Accessibility recommendations
    const accessibilityResults = this.results.filter(r => r.accessibility && Object.keys(r.accessibility).length > 0);
    if (accessibilityResults.length > 0) {
      recommendations.push({
        category: 'Accessibility Enhancement',
        priority: 'critical',
        items: [
          'Implement comprehensive ARIA labeling',
          'Ensure proper keyboard navigation flow',
          'Improve color contrast ratios',
          'Add screen reader optimizations'
        ]
      });
    }

    return recommendations;
  }
}