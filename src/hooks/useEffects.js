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
  
  // Constant Tile Size
  constantTileSize: true,    // ON by default for double-helix test
  compStrength: 0.85,        // 0..1 (1 = full compensation)
  
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
  
  // Readability Mode
  readabilityMode: true,
  
  // Geometry/spacing (readability-first defaults)
  tileW: 140,                // px
  tileH: 220,                // px
  gutterPx: 24,              // px, min gap between neighbors
  radiusPx: 340,             // wider ring
  pitchPerTurnPx: 1100,      // more vertical distance per 360°
  tilesPerTurn: 12,          // fallback; autoSpacing will override
  autoSpacing: true,         // compute tilesPerTurn from R + W + gutter

  // Motion feel (softer)
  smoothing: 0.16,
  friction: 0.95,
  maxDegPerTick: 1.5,
  pixelsPerDeg: 4,

  // Section length (svh)
  sectionSVH: 360,           // sticky section height in svh
  visibleTurns: 2.8,         // we'll show more turns
  bufferTurns: 0.7,
  repeatTurns: 3.0,          // richer band, still performant
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

