/**
 * Default configuration for the simplified helix
 * Clean, performant settings that work well out of the box
 */

export const defaultHelixConfig = {
  // Core helix geometry
  geometry: {
    radius: 470,
    verticalSpan: 650,
    turns: 1.5,
    spacingMultiplier: 3.25,
    angleFactor: 1.3 // 360 * 1.3 = 468 degrees
  },

  // Card settings
  cards: {
    width: 180,
    height: 320,
    everyNth: 3, // Show full card every 3rd position
    orbSize: 40, // Size of orbs between cards
  },

  // Animation settings
  animation: {
    scrollSensitivity: 0.001,
    transitionDuration: '0.08s',
    transitionEasing: 'ease-out',
    autoRotate: false,
    autoRotateSpeed: 0.5
  },

  // Visual settings (minimal by default)
  visuals: {
    perspective: 3000,
    perspectiveOrigin: '71% 32%',
    sceneTilt: {
      rotateX: -10,
      rotateY: 0,
      rotateZ: 0,
      translateZ: -1200
    }
  },

  // Performance settings
  performance: {
    enableWillChange: true,
    enableBackfaceVisibility: true,
    enableGPUAcceleration: true,
    throttleScroll: true,
    throttleDelay: 16 // ~60fps
  }
};

/**
 * Get configuration with overrides
 */
export function getHelixConfig(overrides = {}) {
  return {
    ...defaultHelixConfig,
    ...overrides,
    geometry: {
      ...defaultHelixConfig.geometry,
      ...(overrides.geometry || {})
    },
    cards: {
      ...defaultHelixConfig.cards,
      ...(overrides.cards || {})
    },
    animation: {
      ...defaultHelixConfig.animation,
      ...(overrides.animation || {})
    },
    visuals: {
      ...defaultHelixConfig.visuals,
      ...(overrides.visuals || {}),
      sceneTilt: {
        ...defaultHelixConfig.visuals.sceneTilt,
        ...(overrides.visuals?.sceneTilt || {})
      }
    },
    performance: {
      ...defaultHelixConfig.performance,
      ...(overrides.performance || {})
    }
  };
}

export default defaultHelixConfig;