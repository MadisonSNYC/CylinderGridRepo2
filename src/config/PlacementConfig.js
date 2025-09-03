/**
 * Card placement configuration system
 * Different geometric patterns and layouts for the helix
 */

/**
 * Calculate card position for different placement modes
 */
export class PlacementCalculator {
  constructor(mode = 'helix', config = {}) {
    this.mode = mode;
    this.config = {
      ...placementModes[mode],
      ...config
    };
  }

  /**
   * Calculate transform for a card at given index
   */
  calculateTransform(index, total, scrollOffset = 0) {
    switch (this.mode) {
      case 'helix':
        return this.calculateHelixTransform(index, total, scrollOffset);
      case 'cylinder':
        return this.calculateCylinderTransform(index, total, scrollOffset);
      case 'spiral':
        return this.calculateSpiralTransform(index, total, scrollOffset);
      case 'wave':
        return this.calculateWaveTransform(index, total, scrollOffset);
      case 'grid':
        return this.calculateGridTransform(index, total, scrollOffset);
      default:
        return this.calculateHelixTransform(index, total, scrollOffset);
    }
  }

  /**
   * Classic helix transform
   */
  calculateHelixTransform(index, total, scrollOffset) {
    const { radius, verticalSpan, turns, spacing, angleFactor = 1.3 } = this.config;
    
    const angle = (index / (total / turns)) * 360 * angleFactor;
    const currentRotation = scrollOffset * (360 * angleFactor * turns / total);
    const cardRotation = angle - currentRotation;
    
    const normalizedPosition = index / (total - 1);
    const totalHeight = verticalSpan * turns * spacing;
    const yOffset = normalizedPosition * totalHeight - (totalHeight / 2);
    const scrollY = yOffset - (scrollOffset * 13);
    
    return {
      translateX: '-50%',
      translateY: '-50%',
      translateZ: `${radius}px`,
      rotateY: `${cardRotation}deg`,
      y: `${scrollY}px`
    };
  }

  /**
   * Cylinder transform (no vertical movement)
   */
  calculateCylinderTransform(index, total, scrollOffset) {
    const { radius, turns = 1, angleFactor = 1 } = this.config;
    
    const angle = (index / total) * 360 * turns * angleFactor;
    const currentRotation = scrollOffset * (360 * turns * angleFactor);
    const cardRotation = angle - currentRotation;
    
    return {
      translateX: '-50%',
      translateY: '-50%',
      translateZ: `${radius}px`,
      rotateY: `${cardRotation}deg`,
      y: '0px'
    };
  }

  /**
   * Spiral transform (dynamic radius)
   */
  calculateSpiralTransform(index, total, scrollOffset) {
    const { baseRadius = 300, radiusGrowth = 20, verticalSpan, turns, spacing } = this.config;
    
    const dynamicRadius = baseRadius + (index * radiusGrowth);
    const angle = (index / (total / turns)) * 360;
    const currentRotation = scrollOffset * (360 * turns / total);
    const cardRotation = angle - currentRotation;
    
    const normalizedPosition = index / (total - 1);
    const totalHeight = verticalSpan * turns * spacing;
    const yOffset = normalizedPosition * totalHeight - (totalHeight / 2);
    const scrollY = yOffset - (scrollOffset * 13);
    
    return {
      translateX: '-50%',
      translateY: '-50%',
      translateZ: `${dynamicRadius}px`,
      rotateY: `${cardRotation}deg`,
      y: `${scrollY}px`
    };
  }

  /**
   * Wave transform (sinusoidal radius variation)
   */
  calculateWaveTransform(index, total, scrollOffset) {
    const { baseRadius = 470, waveAmplitude = 100, waveFrequency = 0.5, verticalSpan, turns, spacing } = this.config;
    
    const waveRadius = baseRadius + Math.sin(index * waveFrequency) * waveAmplitude;
    const angle = (index / (total / turns)) * 360;
    const currentRotation = scrollOffset * (360 * turns / total);
    const cardRotation = angle - currentRotation;
    
    const normalizedPosition = index / (total - 1);
    const totalHeight = verticalSpan * spacing;
    const yOffset = normalizedPosition * totalHeight - (totalHeight / 2);
    const scrollY = yOffset - (scrollOffset * 10);
    
    return {
      translateX: '-50%',
      translateY: '-50%',
      translateZ: `${waveRadius}px`,
      rotateY: `${cardRotation}deg`,
      y: `${scrollY}px`
    };
  }

  /**
   * Grid transform (3D grid layout)
   */
  calculateGridTransform(index, total, scrollOffset) {
    const { columns = 4, rowSpacing = 200, columnSpacing = 200, depth = 500 } = this.config;
    
    const row = Math.floor(index / columns);
    const col = index % columns;
    
    const x = (col - columns / 2) * columnSpacing;
    const y = (row * rowSpacing) - (scrollOffset * 20);
    const z = -depth + (Math.abs(col - columns / 2) * 50);
    
    return {
      translateX: `${x}px`,
      translateY: `${y}px`,
      translateZ: `${z}px`,
      rotateY: '0deg',
      y: '0px'
    };
  }

  /**
   * Get opacity based on position
   */
  calculateOpacity(index, total, scrollOffset) {
    const transform = this.calculateTransform(index, total, scrollOffset);
    const rotation = parseFloat(transform.rotateY) || 0;
    const normalizedAngle = ((rotation % 360) + 360) % 360;
    
    if (normalizedAngle < 45 || normalizedAngle > 315) {
      return 1; // Front
    } else if (normalizedAngle >= 135 && normalizedAngle <= 225) {
      return 0.3; // Back
    } else {
      return 0.7; // Sides
    }
  }
}

/**
 * Predefined placement modes
 */
export const placementModes = {
  helix: {
    radius: 470,
    verticalSpan: 650,
    turns: 1.5,
    spacing: 3.25,
    angleFactor: 1.3,
    description: 'Classic DNA helix spiral'
  },
  
  cylinder: {
    radius: 500,
    verticalSpan: 0,
    turns: 1,
    spacing: 1,
    angleFactor: 1,
    description: 'Simple cylinder carousel'
  },
  
  spiral: {
    baseRadius: 300,
    radiusGrowth: 20,
    verticalSpan: 800,
    turns: 2.5,
    spacing: 2,
    description: 'Expanding spiral outward'
  },
  
  wave: {
    baseRadius: 470,
    waveAmplitude: 100,
    waveFrequency: 0.5,
    verticalSpan: 400,
    turns: 1,
    spacing: 2.5,
    description: 'Sinusoidal wave pattern'
  },
  
  grid: {
    columns: 4,
    rowSpacing: 200,
    columnSpacing: 200,
    depth: 500,
    description: '3D grid layout'
  },
  
  // Additional presets
  tight: {
    radius: 300,
    verticalSpan: 500,
    turns: 2,
    spacing: 2,
    angleFactor: 1.2,
    description: 'Compact helix'
  },
  
  wide: {
    radius: 600,
    verticalSpan: 700,
    turns: 1,
    spacing: 4,
    angleFactor: 1.4,
    description: 'Wide spread helix'
  },
  
  tower: {
    radius: 250,
    verticalSpan: 900,
    turns: 3,
    spacing: 3,
    angleFactor: 1.1,
    description: 'Tall vertical tower'
  },
  
  carousel: {
    radius: 500,
    verticalSpan: 100,
    turns: 1,
    spacing: 1,
    angleFactor: 1,
    description: 'Horizontal carousel'
  }
};

/**
 * Get placement preset by name
 */
export function getPlacementPreset(name) {
  return placementModes[name] || placementModes.helix;
}

/**
 * Create custom placement configuration
 */
export function createPlacementConfig(base = 'helix', overrides = {}) {
  const baseConfig = getPlacementPreset(base);
  return {
    ...baseConfig,
    ...overrides
  };
}

export default PlacementCalculator;