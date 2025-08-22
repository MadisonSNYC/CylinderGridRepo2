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
  
  // Card Design
  ashfallCards: false,
  cardShadows: false,
  cardBorders: false,
  
  // Structure
  centralWireframe: false,
  smoothRotation: false,
  depthHierarchy: false,
  
  // Navigation
  projectCounter: false,
  navigationDots: false,
  minimalistControls: false,
  
  // Typography
  ashfallTypography: false,
  subtleText: false
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

  return {
    effects,
    toggleEffect,
    resetEffects,
    applyPreset
  };
};

