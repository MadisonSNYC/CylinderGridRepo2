// Helix Cinematic Package - Main Export
import { HelixCinematicPackage } from './HelixCinematicPackage.jsx';
import './cinematic-effects.css';

// Effect presets for easy configuration
export const presets = {
  cinema: {
    cinematic: true,
    monitor: false,
    logo: true,
    lighting: true,
    ghostBacks: true,
    everyNth: 1,
    rgbEdge: true
  },
  monitor: {
    cinematic: false,
    monitor: true,
    logo: true,
    lighting: false,
    ghostBacks: false,
    everyNth: 3,
    rgbEdge: true
  },
  holographic: {
    cinematic: true,
    monitor: false,
    logo: true,
    lighting: true,
    ghostBacks: true,
    everyNth: 2,
    rgbEdge: true
  },
  minimal: {
    cinematic: false,
    monitor: false,
    logo: false,
    lighting: false,
    ghostBacks: false,
    everyNth: 3,
    rgbEdge: false
  },
  showcase: {
    cinematic: true,
    monitor: true,
    logo: true,
    lighting: true,
    ghostBacks: true,
    everyNth: 3,
    rgbEdge: true
  }
};

// Performance configurations
export const performanceConfigs = {
  high: {
    animations: true,
    shadows: true,
    blur: true,
    grain: true,
    transitions: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  medium: {
    animations: true,
    shadows: true,
    blur: false,
    grain: false,
    transitions: 'all 0.2s ease'
  },
  low: {
    animations: false,
    shadows: false,
    blur: false,
    grain: false,
    transitions: 'opacity 0.2s ease'
  }
};

// Default export
export default HelixCinematicPackage;

// Named exports
export { HelixCinematicPackage };

// Helper function to create custom configuration
export const createConfig = (options = {}) => {
  const defaultConfig = {
    effects: presets.cinema,
    performance: 'high',
    theme: 'dark',
    projects: [],
    className: '',
    onProjectSelect: null
  };
  
  return {
    ...defaultConfig,
    ...options,
    effects: {
      ...defaultConfig.effects,
      ...(options.effects || {})
    }
  };
};

// Utility to merge preset with custom effects
export const withPreset = (presetName, customEffects = {}) => {
  const preset = presets[presetName] || presets.cinema;
  return {
    ...preset,
    ...customEffects
  };
};