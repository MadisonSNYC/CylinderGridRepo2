import { expect } from '@playwright/test';
import { TEST_CONFIG } from '../config/test.config.js';

/**
 * Page Object Model for Helix Showcase functionality
 */
export class HelixPage {
  constructor(page) {
    this.page = page;
    
    // Main helix components
    this.helixScene = page.locator(TEST_CONFIG.selectors.helixScene);
    this.helixAssembly = page.locator(TEST_CONFIG.selectors.helixAssembly);
    this.helixCards = page.locator(TEST_CONFIG.selectors.helixCard);
    this.helixOrbs = page.locator(TEST_CONFIG.selectors.helixOrb);
    
    // Fallback selectors (temporary until data-testid migration)
    this.helixSceneFallback = page.locator('.helix-scene');
    this.helixAssemblyFallback = page.locator('.helix-assembly');
    this.helixCardsFallback = page.locator('.helix-node:not([data-orb-index])');
    this.helixOrbsFallback = page.locator('.helix-node[data-orb-index]');
  }

  /**
   * Navigate to helix page and wait for full load
   */
  async goto() {
    await this.page.goto('/');
    await this.waitForLoad();
    await this.hideTestPanels();
  }

  /**
   * Smart wait for helix components to fully load
   */
  async waitForLoad() {
    // Wait for network to settle
    await this.page.waitForLoadState('networkidle');
    
    // Try data-testid first, fallback to class selectors
    try {
      await this.helixScene.waitFor({ 
        state: 'visible', 
        timeout: TEST_CONFIG.timeouts.medium 
      });
      await this.helixAssembly.waitFor({ 
        state: 'visible', 
        timeout: TEST_CONFIG.timeouts.short 
      });
    } catch {
      // Fallback to existing selectors
      await this.helixSceneFallback.waitFor({ 
        state: 'visible', 
        timeout: TEST_CONFIG.timeouts.medium 
      });
      await this.helixAssemblyFallback.waitFor({ 
        state: 'visible', 
        timeout: TEST_CONFIG.timeouts.short 
      });
    }
    
    // Wait for animations to settle
    await this.page.waitForTimeout(TEST_CONFIG.timeouts.animation);
  }

  /**
   * Get helix scene element (with fallback)
   */
  getHelixScene() {
    return this.helixScene.or(this.helixSceneFallback);
  }

  /**
   * Get helix assembly element (with fallback)
   */
  getHelixAssembly() {
    return this.helixAssembly.or(this.helixAssemblyFallback);
  }

  /**
   * Get helix cards (with fallback)
   */
  getHelixCards() {
    return this.helixCards.or(this.helixCardsFallback);
  }

  /**
   * Get helix orbs (with fallback)
   */
  getHelixOrbs() {
    return this.helixOrbs.or(this.helixOrbsFallback);
  }

  /**
   * Perform scroll interaction with enhanced detection
   */
  async scroll(amount = TEST_CONFIG.testData.scrollAmounts.medium) {
    const scene = this.getHelixScene();
    await scene.focus();
    
    // Try multiple scroll methods for better compatibility
    try {
      await this.page.mouse.wheel(0, amount);
    } catch (error) {
      // Fallback to wheel event dispatch
      await scene.dispatchEvent('wheel', { deltaY: amount });
    }
    
    await this.page.waitForTimeout(TEST_CONFIG.performance.interactionDelay);
  }

  /**
   * Perform keyboard navigation
   */
  async keyboardNavigate(key) {
    const scene = this.getHelixScene();
    await scene.focus();
    await this.page.keyboard.press(key);
    await this.page.waitForTimeout(TEST_CONFIG.performance.interactionDelay);
  }

  /**
   * Get CSS transform of helix assembly
   */
  async getHelixTransform() {
    const assembly = this.getHelixAssembly();
    return await assembly.evaluate(el => 
      window.getComputedStyle(el).transform
    );
  }

  /**
   * Count visible helix elements with smart detection
   */
  async getElementCounts() {
    const cards = this.getHelixCards();
    const orbs = this.getHelixOrbs();
    
    // Wait a bit for elements to potentially load
    await this.page.waitForTimeout(1000);
    
    const cardCount = await cards.count();
    const orbCount = await orbs.count();
    
    // Also check for any generic helix elements if specific ones aren't found
    if (cardCount === 0 && orbCount === 0) {
      const anyHelixElements = this.page.locator('[class*="helix"], [data-testid*="helix"]');
      const anyCount = await anyHelixElements.count();
      
      return {
        cards: 0,
        orbs: 0, 
        total: anyCount,
        fallback: true
      };
    }
    
    return {
      cards: cardCount,
      orbs: orbCount,
      total: cardCount + orbCount,
      fallback: false
    };
  }

  /**
   * Get video metrics for aspect ratio testing
   */
  async getVideoMetrics() {
    const videos = this.page.locator('video');
    const count = await videos.count();
    
    if (count === 0) return [];
    
    return await videos.evaluateAll(videoElements => 
      videoElements.map(video => ({
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight, 
        displayWidth: video.clientWidth,
        displayHeight: video.clientHeight,
        aspectRatio: video.clientWidth / video.clientHeight,
        isLoaded: video.videoWidth > 0 && video.videoHeight > 0
      }))
    );
  }

  /**
   * Verify helix is fully loaded and interactive
   */
  async verifyHelixLoaded() {
    const scene = this.getHelixScene();
    const assembly = this.getHelixAssembly();
    
    // Verify visibility
    await expect(scene).toBeVisible();
    await expect(assembly).toBeVisible();
    
    // Verify interactivity (check if element can receive focus)
    await scene.focus();
    const isFocused = await scene.evaluate(el => el === document.activeElement);
    expect(isFocused).toBe(true);
    
    return true;
  }

  /**
   * Disable animations for consistent testing
   */
  async disableAnimations() {
    await this.page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `
    });
  }

  /**
   * Hide dev panels and UI overlays during testing
   */
  async hideTestPanels() {
    await this.page.addStyleTag({
      content: `
        /* Hide all dev panels and testing UI */
        [data-testid="dev-panel"],
        [data-testid="performance-monitor"],
        [data-testid="test-dashboard"],
        [data-testid="comprehensive-test"],
        [data-testid="playwright-dashboard"],
        .fixed.bottom-4.right-4,
        .fixed.bottom-4.left-4,
        .fixed.top-4.right-4,
        .fixed.top-4.left-4,
        /* Hide any floating panels */
        .z-50,
        .z-40 {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
        
        /* Ensure helix scene is fully visible */
        .helix-scene {
          z-index: 1 !important;
        }
        
        /* Hide performance monitor visual */
        [class*="performance"] {
          display: none !important;
        }
      `
    });
    
    console.log('🎭 Test panels hidden - focusing on helix core functionality');
  }

  /**
   * Verify we're testing the actual helix component
   */
  async verifyHelixFocus() {
    // Check that helix scene is visible and not obstructed
    const helixScene = this.getHelixScene();
    const isVisible = await helixScene.isVisible();
    const boundingBox = await helixScene.boundingBox();
    
    console.log('🎯 Helix Component Verification:', {
      visible: isVisible,
      dimensions: boundingBox ? `${boundingBox.width}x${boundingBox.height}` : 'not found',
      position: boundingBox ? `${boundingBox.x},${boundingBox.y}` : 'not found'
    });
    
    return isVisible && boundingBox && boundingBox.width > 100 && boundingBox.height > 100;
  }
}