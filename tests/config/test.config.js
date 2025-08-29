/**
 * Test Configuration - Centralized settings for all test suites
 */
export const TEST_CONFIG = {
  // Timeout configurations
  timeouts: {
    short: 5000,     // Quick element waits
    medium: 15000,   // Component loading
    long: 30000,     // Full page loads
    animation: 2000  // Animation settle time
  },

  // Performance benchmarks
  performance: {
    minFPS: 20,              // Minimum acceptable FPS
    maxMemoryGrowth: 50,     // Maximum memory growth in MB
    maxLoadTime: 5000,       // Maximum load time in ms
    interactionDelay: 100    // Delay between interactions
  },

  // Accessibility standards
  accessibility: {
    level: 'AA',
    rules: ['wcag2a', 'wcag2aa'],
    tags: ['best-practice', 'wcag21aa'],
    // Critical violations that must be fixed
    criticalRules: [
      'button-name',
      'form-field-multiple-labels', 
      'input-button-name',
      'label',
      'select-name'
    ]
  },

  // Visual regression settings
  visual: {
    threshold: 0.1,          // 10% difference threshold
    animations: false,       // Disable animations for consistency
    maskElements: [          // Elements to mask in screenshots
      '[data-testid="performance-monitor"]',
      '[data-testid="timestamp"]',
      '.animate-pulse'
    ]
  },

  // Test data
  testData: {
    scrollAmounts: {
      small: 100,
      medium: 300,
      large: 500
    },
    keyboardKeys: [
      'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight',
      'KeyW', 'KeyA', 'KeyS', 'KeyD'
    ],
    videoAspectRatio: {
      expected: 9/16,
      tolerance: 0.1
    }
  },

  // Selectors (will be replaced with data-testid)
  selectors: {
    // Main components
    helixScene: '[data-testid="helix-scene"]',
    helixAssembly: '[data-testid="helix-assembly"]', 
    helixCard: '[data-testid="helix-card"]',
    helixOrb: '[data-testid="helix-orb"]',
    
    // UI components
    performanceMonitor: '[data-testid="performance-monitor"]',
    testDashboard: '[data-testid="test-dashboard"]',
    devPanel: '[data-testid="dev-panel"]',
    
    // Interactive elements
    buttons: 'button[aria-label]',
    inputs: 'input[aria-label]',
    videos: 'video'
  }
};

/**
 * Environment-specific configurations
 */
export const ENV_CONFIG = {
  development: {
    baseURL: 'http://localhost:4000',
    headless: false,
    slowMo: 100
  },
  
  ci: {
    baseURL: 'http://localhost:4000', 
    headless: true,
    slowMo: 0,
    workers: 1
  },

  production: {
    baseURL: process.env.PROD_URL || 'http://localhost:4000',
    headless: true,
    slowMo: 0
  }
};