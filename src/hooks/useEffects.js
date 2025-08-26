import { useState, useCallback, useRef } from 'react';

const defaultEffects = {
  // Color Scheme
  ashfallColors: false,
  monochrome: false,
  cinematicColors: false,     // Disabled for performance
  screenGlow: false,          // Disabled for performance
  scanLines: false,           // Disabled for performance
  monitorStyle: false,        // Disabled for performance
  colorGrade: false,
  filmGrain: false,
  
  // Visual Effects
  chromaticAberration: false,
  depthBlur: false,           // Disabled for performance
  glitchEffects: false,
  ambientLighting: false,     // Disabled for performance
  rgbEdge: false,             // Disabled for performance
  
  // Card Design
  ashfallCards: false,
  cardShadows: false,
  cardBorders: false,
  richCardContent: true,        // Show rich content vs simple cards
  cardHoverEffects: true,       // Enable hover interactions
  videoPlayOnHover: true,       // Auto-play videos on hover
  
  // Structure
  centralWireframe: false,
  centerLogo: true,          // Show logo in center by default
  centerLogoMode: 'billboard', // 'rotate' | 'billboard'
  smoothRotation: false,
  depthHierarchy: false,
  repeatTurns: 2.0,          // Extra turns for endless feel
  
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
  const history = useRef([defaultEffects]);
  const historyIndex = useRef(0);
  const maxHistory = 50; // Keep last 50 changes

  const addToHistory = useCallback((newEffects) => {
    const newHistory = history.current.slice(0, historyIndex.current + 1);
    newHistory.push(newEffects);
    
    if (newHistory.length > maxHistory) {
      newHistory.shift();
    }
    
    history.current = newHistory;
    historyIndex.current = newHistory.length - 1;
  }, []);

  const toggleEffect = useCallback((effectKey, value) => {
    setEffects(prev => {
      const newEffects = {
        ...prev,
        [effectKey]: value
      };
      addToHistory(newEffects);
      return newEffects;
    });
  }, [addToHistory]);

  const resetEffects = useCallback(() => {
    setEffects(defaultEffects);
    history.current = [defaultEffects];
    historyIndex.current = 0;
  }, []);

  const undoEffects = useCallback(() => {
    if (historyIndex.current > 0) {
      historyIndex.current -= 1;
      const previousEffects = history.current[historyIndex.current];
      setEffects(previousEffects);
    }
  }, []);

  const redoEffects = useCallback(() => {
    if (historyIndex.current < history.current.length - 1) {
      historyIndex.current += 1;
      const nextEffects = history.current[historyIndex.current];
      setEffects(nextEffects);
    }
  }, []);

  const canUndo = historyIndex.current > 0;
  const canRedo = historyIndex.current < history.current.length - 1;

  const applyPreset = useCallback((preset) => {
    setEffects(prev => {
      const newEffects = {
        ...prev,
        ...preset
      };
      addToHistory(newEffects);
      return newEffects;
    });
  }, [addToHistory]);

  const setPlacementStrength = useCallback((n) => {
    setEffects(prev => {
      const newEffects = {
        ...prev,
        placementStrength: n
      };
      addToHistory(newEffects);
      return newEffects;
    });
  }, [addToHistory]);

  const setRepeatTurns = useCallback((n) => {
    setEffects(prev => {
      const newEffects = {
        ...prev,
        repeatTurns: n
      };
      addToHistory(newEffects);
      return newEffects;
    });
  }, [addToHistory]);

  return {
    effects,
    toggleEffect,
    resetEffects,
    undoEffects,
    redoEffects,
    canUndo,
    canRedo,
    applyPreset,
    setPlacementStrength,
    setRepeatTurns
  };
};

