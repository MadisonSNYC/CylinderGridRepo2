import { useState, useCallback } from 'react';

const defaultEffects = {
  // Color Scheme
  ashfallColors: false,
  monochrome: false,
  
  // Visual Effects
  chromaticAberration: false,
  depthBlur: false,
  glitchEffects: false,
  ambientLighting: false,
  rgbEdge: true,             // desktop edge fringe
  rgbIntensity: 30,          // 0..100 (% alpha)
  rgbOffsetPx: 1,            // 0..2 (px offset)
  
  // Lab-compatible effects - MADISON PRESET DEFAULTS
  depthOfField: true,        // DoF ON
  ghostBack: true,           // Ghost ON
  biasEffect: false,         // Lab bias OFF (already have placement)
  monitorStyle: false,       // Lab monitor CRT style
  screenGlow: false,         // Lab screen glow effect
  scanLines: false,          // Lab scan lines
  atmosphericGrain: false,   // Lab atmospheric grain
  filmNoise: false,          // Lab film noise
  cinematicLighting: false,  // Lab cinematic lighting
  
  // Card Design
  ashfallCards: false,
  cardShadows: false,
  cardBorders: false,
  
  // Structure - MADISON PRESET DEFAULTS
  centralWireframe: true,    // Wireframe ON
  enhancedWireframe: true,   // Carousel-style component ON
  centerLogo: true,          // Logo ON
  centerLogoMode: 'billboard', // Billboard default
  smoothRotation: false,
  depthHierarchy: false,
  repeatTurns: 2.0,          // Endless feel baseline
  
  // Navigation
  projectCounter: false,
  navigationDots: false,
  minimalistControls: false,
  
  // Typography
  ashfallTypography: false,
  subtleText: false,
  
  // NEW: Depth Placement (always-on)
  // depthPlacement: true,      // no longer needed - always enabled
  placementStrength: 6,      // 0..10; maps to CSS vars (stronger default)
  
  // S6: Outward Turn + Ghost Back
  outwardTurn: true,         // default ON for dynamic scroll effects
  
  // FS1: Wheel Scroll Direction
  invertScroll: false,       // default: normal scroll direction
  
  // FS2: Single-Source Scroll Mode
  scrollMode: 'wheel',       // 'wheel' | 'sticky' - select scroll mode
  
  // Track Tilt Control - MADISON PRESET DEFAULTS
  trackTiltDeg: -10,         // desktop default
  trackTiltMobileDeg: -3,    // gentle on mobile
  
  // Sizing/Spacing - Double Helix
  tileW: 120,                // px
  tileH: 200,                // px
  gutterPx: 12,              // px spacing between neighbors (min)
  autoSpacing: true,         // compute tilesPerTurn from R + W + gutter
  radiusPx: 250,             // radius for helix
  pitchPerTurnPx: 800,       // vertical spacing per full turn
  tilesPerTurn: 16,          // will be overridden when autoSpacing = true
};

export const useEffects = () => {
  const [effects, setEffects] = useState(defaultEffects);

  const toggleEffect = useCallback((effectKey, value) => {
    setEffects(prev => ({
      ...prev,
      [effectKey]: value
    }));
  }, []);

  const resetEffects = useCallback(() => {
    setEffects(defaultEffects);
  }, []);

  const applyPreset = useCallback((preset) => {
    setEffects(prev => ({
      ...prev,
      ...preset
    }));
  }, []);

  const setPlacementStrength = useCallback((n) => {
    setEffects(prev => ({
      ...prev,
      placementStrength: n
    }));
  }, []);

  const setRepeatTurns = useCallback((n) => {
    setEffects(prev => ({
      ...prev,
      repeatTurns: n
    }));
  }, []);

  return {
    effects,
    toggleEffect,
    resetEffects,
    applyPreset,
    setPlacementStrength,
    setRepeatTurns
  };
};

