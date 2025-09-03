/**
 * Minimal default effects for clean helix presentation
 * These are the essential effects that make the helix look good without being overwhelming
 */

export const minimalEffects = {
  // Card gradient - Clean modern appearance
  cardGradient: {
    enabled: true,
    style: {
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }
  },

  // Soft shadow - Depth perception
  softShadow: {
    enabled: true,
    style: {
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
    }
  },

  // Hover glow - User interaction feedback
  hoverGlow: {
    enabled: true,
    style: {
      transition: 'all 0.3s ease',
      ':hover': {
        boxShadow: '0 10px 50px rgba(0, 150, 255, 0.3)',
        transform: 'scale(1.02)'
      }
    }
  },

  // Smooth fade - Front/back opacity transitions
  smoothFade: {
    enabled: true,
    frontOpacity: 1,
    sideOpacity: 0.7,
    backOpacity: 0.3,
    transition: 'opacity 0.2s ease'
  }
};

/**
 * Apply minimal effects to a card element
 */
export function applyMinimalEffects(element, effects = minimalEffects) {
  if (!element) return;

  // Apply card gradient
  if (effects.cardGradient?.enabled) {
    Object.assign(element.style, effects.cardGradient.style);
  }

  // Apply soft shadow
  if (effects.softShadow?.enabled) {
    Object.assign(element.style, effects.softShadow.style);
  }

  // Apply hover effects
  if (effects.hoverGlow?.enabled) {
    element.addEventListener('mouseenter', () => {
      element.style.boxShadow = '0 10px 50px rgba(0, 150, 255, 0.3)';
      element.style.transform = 'scale(1.02)';
    });
    
    element.addEventListener('mouseleave', () => {
      element.style.boxShadow = effects.softShadow?.enabled 
        ? effects.softShadow.style.boxShadow 
        : 'none';
      element.style.transform = 'scale(1)';
    });
  }
}

export default minimalEffects;