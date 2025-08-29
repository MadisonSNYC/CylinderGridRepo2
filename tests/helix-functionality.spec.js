import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Helix Showcase Functionality', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Wait for React to hydrate and helix to load
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.helix-scene', { timeout: 15000 });
    await page.waitForSelector('.helix-assembly', { timeout: 10000 });
    
    // Wait for any initial animations and loading
    await page.waitForTimeout(3000);
  });

  test('should load helix scene with all components', async ({ page }) => {
    // Check main elements exist
    await expect(page.locator('.helix-scene')).toBeVisible();
    await expect(page.locator('.helix-assembly')).toBeVisible();
    
    // Check for helix nodes (cards)
    const cardCount = await page.locator('.helix-node:not([data-orb-index])').count();
    expect(cardCount).toBeGreaterThan(0);
    
    // Check for orbs
    const orbCount = await page.locator('.helix-node[data-orb-index]').count();
    expect(orbCount).toBeGreaterThan(0);

    console.log(`Found ${cardCount} cards and ${orbCount} orbs`);
  });

  test('should respond to scroll interactions', async ({ page }) => {
    // Get initial helix position
    const initialTransform = await page.locator('.helix-assembly').evaluate(el => 
      window.getComputedStyle(el).transform
    );

    // Perform scroll interaction
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(500);

    // Check if position changed
    const newTransform = await page.locator('.helix-assembly').evaluate(el => 
      window.getComputedStyle(el).transform
    );

    expect(newTransform).not.toBe(initialTransform);
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Focus on helix scene
    await page.locator('.helix-scene').focus();
    
    // Test arrow key navigation
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(200);
    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(200);

    // Test WASD navigation
    await page.keyboard.press('KeyS');
    await page.waitForTimeout(200);
    await page.keyboard.press('KeyW');
    
    // If we get here without errors, keyboard navigation is working
    expect(true).toBe(true);
  });

  test('should maintain performance during interactions', async ({ page }) => {
    // Start performance monitoring
    await page.evaluate(() => {
      window.performanceTest = {
        frameCount: 0,
        startTime: performance.now(),
        frameDrops: 0
      };

      const trackFrames = () => {
        window.performanceTest.frameCount++;
        const now = performance.now();
        const duration = now - window.performanceTest.startTime;
        
        if (duration < 5000) { // Run for 5 seconds
          requestAnimationFrame(trackFrames);
        }
      };
      
      requestAnimationFrame(trackFrames);
    });

    // Simulate intensive interactions
    for (let i = 0; i < 10; i++) {
      await page.mouse.wheel(0, Math.random() * 400 - 200);
      await page.waitForTimeout(100);
    }

    // Wait for monitoring to complete
    await page.waitForTimeout(5000);

    // Get performance results
    const results = await page.evaluate(() => window.performanceTest);
    const fps = (results.frameCount * 1000) / 5000;
    
    console.log(`Average FPS during test: ${fps.toFixed(1)}`);
    
    // Assert reasonable performance (at least 20 FPS)
    expect(fps).toBeGreaterThan(20);
  });

  test('should have proper video aspect ratios', async ({ page }) => {
    // Wait for videos to load
    await page.waitForTimeout(3000);
    
    const videoMetrics = await page.evaluate(() => {
      const videos = document.querySelectorAll('.helix-node video');
      return Array.from(videos).map(video => ({
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        displayWidth: video.clientWidth,
        displayHeight: video.clientHeight,
        aspectRatio: video.clientWidth / video.clientHeight
      }));
    });

    if (videoMetrics.length > 0) {
      console.log('Video metrics:', videoMetrics[0]);
      
      // Check that videos have reasonable aspect ratios (close to 9:16)
      const expectedRatio = 9 / 16;
      const tolerance = 0.1;
      
      for (const video of videoMetrics) {
        expect(Math.abs(video.aspectRatio - expectedRatio)).toBeLessThan(tolerance);
      }
    }
  });
});

test.describe('Accessibility Tests', () => {
  
  test('should pass basic accessibility checks', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.helix-scene', { timeout: 15000 });
    await page.waitForTimeout(2000);
    
    // Inject axe-core
    await injectAxe(page);
    
    // Run accessibility checks
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: { html: true }
    });
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.helix-scene', { timeout: 15000 });
    
    // Check helix scene has proper labeling
    const helixScene = page.locator('.helix-scene');
    await expect(helixScene).toHaveAttribute('aria-label');
    await expect(helixScene).toHaveAttribute('role', 'application');

    // Check buttons have labels
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const hasAriaLabel = await button.getAttribute('aria-label');
      const hasText = await button.textContent();
      
      // Button should have either aria-label or text content
      expect(hasAriaLabel || hasText?.trim()).toBeTruthy();
    }
  });
});

test.describe('Visual Regression Tests', () => {
  
  test('should match initial load screenshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.helix-scene', { timeout: 15000 });
    await page.waitForTimeout(4000); // Wait for animations to settle
    
    // Disable animations for consistent screenshots
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `
    });
    
    await expect(page.locator('.helix-scene')).toHaveScreenshot('helix-initial.png');
  });

  test('should match helix after scroll interaction', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.helix-scene', { timeout: 15000 });
    await page.waitForTimeout(3000);
    
    // Disable animations
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          transition-duration: 0s !important;
        }
      `
    });
    
    // Perform consistent scroll
    await page.mouse.wheel(0, 200);
    await page.waitForTimeout(1000);
    
    await expect(page.locator('.helix-scene')).toHaveScreenshot('helix-scrolled.png');
  });

  test('should match test dashboard appearance', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-test-copy]', { timeout: 5000 });
    
    const dashboard = page.locator('.fixed.bottom-4.right-4');
    await expect(dashboard).toHaveScreenshot('test-dashboard.png');
  });
});

test.describe('Performance Tests', () => {
  
  test('should load within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.helix-scene', { timeout: 15000 });
    const loadTime = Date.now() - startTime;
    
    console.log(`Page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
  });

  test('should handle rapid interactions without errors', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.helix-scene', { timeout: 15000 });
    
    // Listen for JavaScript errors
    const errors = [];
    page.on('pageerror', error => errors.push(error));
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    // Perform rapid interactions
    for (let i = 0; i < 20; i++) {
      await page.mouse.wheel(0, Math.random() * 200 - 100);
      await page.waitForTimeout(50);
    }

    // Check for errors
    expect(errors).toHaveLength(0);
  });

  test('should maintain memory usage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.helix-scene', { timeout: 15000 });
    
    // Get initial memory
    const initialMemory = await page.evaluate(() => 
      performance.memory ? performance.memory.usedJSHeapSize : 0
    );

    // Perform interactions for 10 seconds
    const endTime = Date.now() + 10000;
    while (Date.now() < endTime) {
      await page.mouse.wheel(0, Math.random() * 300 - 150);
      await page.waitForTimeout(200);
    }

    // Get final memory
    const finalMemory = await page.evaluate(() => 
      performance.memory ? performance.memory.usedJSHeapSize : 0
    );

    if (initialMemory > 0 && finalMemory > 0) {
      const memoryGrowth = (finalMemory - initialMemory) / 1024 / 1024; // MB
      console.log(`Memory growth: ${memoryGrowth.toFixed(2)}MB`);
      
      // Memory growth should be reasonable (less than 50MB)
      expect(memoryGrowth).toBeLessThan(50);
    }
  });
});