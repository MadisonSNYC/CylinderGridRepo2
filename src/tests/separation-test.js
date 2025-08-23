// Quick test to verify modular separation

import { normalizeSignedDeg, clamp01, getDepth, getTier, getLabVars } from '../helix/useHelixAngles.js';
import { safeNumber, safeAngle, safeClamp, safeStyle, safeClassName } from '../utils/guards.js';

console.log('=== SEPARATION TEST ===');

// Test math utilities
console.log('Math Utils:');
console.log('  normalizeSignedDeg(370):', normalizeSignedDeg(370), '(expect: 10)');
console.log('  normalizeSignedDeg(-10):', normalizeSignedDeg(-10), '(expect: -10)');
console.log('  clamp01(1.5):', clamp01(1.5), '(expect: 1)');
console.log('  clamp01(-0.5):', clamp01(-0.5), '(expect: 0)');

// Test depth calculations
console.log('\nDepth Calculations:');
console.log('  getDepth(0, 0):', getDepth(0, 0), '(expect: 0)');
console.log('  getDepth(90, 0):', getDepth(90, 0), '(expect: 0.5)');
console.log('  getDepth(180, 0):', getDepth(180, 0), '(expect: 1)');

// Test tier determination
console.log('\nTier Detection:');
console.log('  getTier(0.1):', getTier(0.1), '(expect: depth-near)');
console.log('  getTier(0.4):', getTier(0.4), '(expect: depth-mid)');
console.log('  getTier(0.9):', getTier(0.9), '(expect: depth-far)');

// Test guardrails
console.log('\nGuardrails:');
console.log('  safeNumber(NaN, 5):', safeNumber(NaN, 5), '(expect: 5)');
console.log('  safeNumber(Infinity, 10):', safeNumber(Infinity, 10), '(expect: 10)');
console.log('  safeAngle(370):', safeAngle(370), '(expect: 10)');
console.log('  safeClamp(5, 0, 3):', safeClamp(5, 0, 3), '(expect: 3)');
console.log('  safeClassName("a", null, "b"):', safeClassName("a", null, "b"), '(expect: "a b")');

// Test lab vars generation
console.log('\nLab Variables:');
const mockWindow = { innerWidth: 1024, matchMedia: () => ({ matches: false }) };
const labVars = getLabVars(90, 0, { thumbnail: 'test.jpg' }, mockWindow);
console.log('  Lab vars keys:', Object.keys(labVars).join(', '));
console.log('  --d:', labVars['--d'], '(depth value)');
console.log('  --front-o:', labVars['--front-o'], '(front opacity)');
console.log('  --ghost-o:', labVars['--ghost-o'], '(ghost opacity)');

console.log('\n✅ All modules loaded successfully');
console.log('=== TEST COMPLETE ===');