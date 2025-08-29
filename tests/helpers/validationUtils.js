/**
 * Test validation utilities for Phase 1 fixes
 */
import { TEST_CONFIG } from '../config/test.config.js';

/**
 * Validate test environment setup
 */
export async function validateTestEnvironment(page) {
  const results = {
    timestamp: new Date().toISOString(),
    checks: [],
    overall: true
  };

  // Check 1: Page loads successfully
  try {
    await page.goto('/');
    results.checks.push({
      name: 'Page Load',
      passed: true,
      details: 'Page loaded successfully'
    });
  } catch (error) {
    results.checks.push({
      name: 'Page Load',
      passed: false,
      details: error.message
    });
    results.overall = false;
  }

  // Check 2: Helix scene exists
  try {
    const helixScene = page.locator('.helix-scene').first();
    await helixScene.waitFor({ state: 'visible', timeout: 10000 });
    results.checks.push({
      name: 'Helix Scene Visibility',
      passed: true,
      details: 'Helix scene element found and visible'
    });
  } catch (error) {
    results.checks.push({
      name: 'Helix Scene Visibility',
      passed: false,
      details: 'Helix scene not found or not visible'
    });
    results.overall = false;
  }

  // Check 3: Basic interactivity
  try {
    const helixScene = page.locator('.helix-scene').first();
    await helixScene.focus();
    await page.mouse.wheel(0, 100);
    results.checks.push({
      name: 'Basic Interactivity',
      passed: true,
      details: 'Scroll interaction completed without errors'
    });
  } catch (error) {
    results.checks.push({
      name: 'Basic Interactivity', 
      passed: false,
      details: error.message
    });
  }

  // Check 4: Performance API available
  const perfAvailable = await page.evaluate(() => {
    return typeof performance !== 'undefined' && 
           typeof requestAnimationFrame !== 'undefined' &&
           (typeof performance.memory !== 'undefined' || true); // memory is optional
  });

  results.checks.push({
    name: 'Performance APIs',
    passed: perfAvailable,
    details: perfAvailable ? 'Performance monitoring APIs available' : 'Performance APIs missing'
  });

  return results;
}

/**
 * Generate Phase 1 completion report
 */
export function generatePhase1Report(testResults) {
  const report = {
    phase: 'Phase 1: Test Environment Standardization',
    timestamp: new Date().toISOString(),
    summary: {
      totalTests: 0,
      passed: 0,
      failed: 0,
      successRate: 0
    },
    achievements: [
      '✅ Page Object Model implementation',
      '✅ Centralized test configuration',
      '✅ Smart selector fallbacks',
      '✅ Performance monitoring utilities',
      '✅ Error tracking capabilities',
      '✅ Test environment validation'
    ],
    keyMetrics: {},
    nextSteps: [
      'Phase 2: Add data-testid attributes to components',
      'Phase 3: Fix accessibility violations',
      'Phase 4: Implement visual regression baselines',
      'Phase 5: Create specialized test suites'
    ]
  };

  // Calculate test statistics
  if (testResults && testResults.stats) {
    report.summary.totalTests = testResults.stats.expected + testResults.stats.unexpected;
    report.summary.passed = testResults.stats.expected;
    report.summary.failed = testResults.stats.unexpected;
    report.summary.successRate = report.summary.totalTests > 0 
      ? Math.round((report.summary.passed / report.summary.totalTests) * 100)
      : 0;
  }

  return report;
}

/**
 * Log formatted test results
 */
export function logTestResults(results, title = 'Test Results') {
  console.log(`\n🧪 ${title}`);
  console.log('=' .repeat(50));
  
  if (results.summary) {
    console.log(`📊 Summary: ${results.summary.passed}/${results.summary.totalTests} passed (${results.summary.successRate}%)`);
  }
  
  if (results.checks) {
    console.log('\n🔍 Environment Checks:');
    results.checks.forEach(check => {
      const icon = check.passed ? '✅' : '❌';
      console.log(`${icon} ${check.name}: ${check.details}`);
    });
  }
  
  if (results.achievements) {
    console.log('\n🎯 Achievements:');
    results.achievements.forEach(achievement => {
      console.log(achievement);
    });
  }
  
  if (results.nextSteps) {
    console.log('\n🚀 Next Steps:');
    results.nextSteps.forEach((step, index) => {
      console.log(`${index + 1}. ${step}`);
    });
  }
  
  console.log('=' .repeat(50));
}