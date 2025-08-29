import { test as base } from '@playwright/test';
import { HelixPage } from '../pages/HelixPage.js';
import { PerformanceMonitor, ErrorTracker, resetPageState } from '../helpers/testUtils.js';

/**
 * Extended test fixture with custom page objects and utilities
 */
export const test = base.extend({
  /**
   * Helix page object with all helix-specific functionality
   */
  helixPage: async ({ page }, use) => {
    const helixPage = new HelixPage(page);
    await use(helixPage);
  },

  /**
   * Performance monitoring utilities
   */
  performanceMonitor: async ({ page }, use) => {
    const monitor = new PerformanceMonitor(page);
    await use(monitor);
  },

  /**
   * Error tracking utilities
   */
  errorTracker: async ({ page }, use) => {
    const tracker = new ErrorTracker(page);
    await use(tracker);
  },

  /**
   * Page with automatic cleanup and state reset
   */
  cleanPage: async ({ page }, use) => {
    // Setup clean state before test
    await resetPageState(page);
    
    await use(page);
    
    // Cleanup after test
    await resetPageState(page);
  }
});

/**
 * Export expect from Playwright for convenience
 */
export { expect } from '@playwright/test';