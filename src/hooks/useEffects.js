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
  rgbEdge: true,             // RGB edge effect on cards
  
  // Lab-compatible effects
  depthOfField: false,       // Lab DoF blur
  ghostBack: false,          // Lab ghost back cards
  biasEffect: false,         // Lab bias (scale & tilt) - default OFF
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
  
  // Structure
  centralWireframe: false,
  centerLogo: true,          // Show logo in center by default
  centerLogoMode: 'billboard', // 'rotate' | 'billboard'
  smoothRotation: false,
  depthHierarchy: false,
  repeatTurns: 4.0,          // Extra turns for endless feel (+2.0 for better continuity)
  
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

