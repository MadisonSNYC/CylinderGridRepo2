// Test configuration for Helix Showcase Project
export const TEST_PAGES = [
  { url: '/', label: 'Helix Showcase' },
  { url: '/?phase=baseline', label: 'Baseline Performance' },
  { url: '/?phase=scroll-test', label: 'Scroll Performance' },
  { url: '/?phase=stress-test', label: 'Stress Test' },
];

export const DEVICE_PROFILES = [
  { 
    name: 'desktop', 
    viewport: { width: 1366, height: 900 }, 
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' 
  },
  { 
    name: 'mobile', 
    viewport: { width: 390, height: 844 }, 
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1' 
  },
];

export const MODES = [
  { name: 'defaultMotion', reducedMotion: false },
  { name: 'reducedMotion', reducedMotion: true },
];

export const INTERACTION_SCRIPTS = {
  none: async (_page) => {
    // Just wait for initial render
    await _page.waitForTimeout(2000);
  },
  
  basic: async (page) => {
    // Wait for helix to load
    await page.waitForSelector('.helix-scene', { timeout: 10000 });
    
    // Scroll interactions
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(1000);
    await page.mouse.wheel(0, -300);
    await page.waitForTimeout(1000);
    
    // Tab through interactive elements
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
    }
    
    // Test comprehensive test button if present
    const testButton = page.locator('button:has-text("Comprehensive Test")');
    if (await testButton.count() > 0) {
      await testButton.click();
      await page.waitForTimeout(1000);
    }
  },
  
  helix_specific: async (page) => {
    // Wait for helix to load
    await page.waitForSelector('.helix-scene', { timeout: 10000 });
    
    // Test various scroll speeds and directions
    const scrollTests = [
      { deltaY: 100, times: 5 },
      { deltaY: -100, times: 5 },
      { deltaY: 300, times: 3 },
      { deltaY: -300, times: 3 }
    ];
    
    for (const test of scrollTests) {
      for (let i = 0; i < test.times; i++) {
        await page.mouse.wheel(0, test.deltaY);
        await page.waitForTimeout(200);
      }
      await page.waitForTimeout(500);
    }
    
    // Test dev panel interactions
    const devPanelButtons = page.locator('.dev-panel button');
    const buttonCount = await devPanelButtons.count();
    for (let i = 0; i < Math.min(buttonCount, 3); i++) {
      await devPanelButtons.nth(i).click();
      await page.waitForTimeout(500);
    }
  }
};

// Performance thresholds
export const PERFORMANCE_THRESHOLDS = {
  lighthouse: {
    performance: 80,
    accessibility: 90,
    bestPractices: 80,
    seo: 80
  },
  metrics: {
    LCP: 2500, // ms
    CLS: 0.1,
    FID: 100, // ms
    TBT: 200 // ms
  },
  helix_specific: {
    minFPS: 30,
    maxRenderTime: 40, // ms
    maxMemoryIncrease: 50 // MB
  }
};

export const BASE_URL = 'http://localhost:8000';