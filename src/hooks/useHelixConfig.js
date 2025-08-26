import { useState, useCallback, useRef } from 'react';

const defaultHelixConfig = {
  // Global Perspective
  perspective: 3000,
  perspectiveOriginX: 71,
  perspectiveOriginY: 32,
  
  // Helix Structure
  radius: 470,
  verticalSpan: 650,
  repeatTurns: 1.5,
  rotateX: -10,
  rotateY: 0,
  rotateZ: 0,
  
  // Card Properties (9:16 aspect ratio)
  cardWidth: 90,
  cardHeight: 160,
  cardScale: 1.8,
  opacityFront: 1,
  opacitySide: 0.7,
  opacityBack: 0.3,
  
  // Container
  containerWidth: 500,
  containerHeight: 400,
  scrollSensitivity: 0.5,
  
  // Performance
  enableCulling: false,
  enableLOD: false,
  activeCards: null,
  renderDistance: null,
  
  // Visualization
  showEveryNth: 3, // Show every 3rd card as full cards, others as orbs
  
  // Runtime (read-only)
  totalProjects: 16,
  visibleCards: null,
  scrollOffset: 0
};

export const useHelixConfig = () => {
  const [config, setConfig] = useState(defaultHelixConfig);
  const history = useRef([defaultHelixConfig]);
  const historyIndex = useRef(0);
  const maxHistory = 50; // Keep last 50 changes

  const updateConfig = useCallback((key, value) => {
    setConfig(prev => {
      const newConfig = {
        ...prev,
        [key]: value
      };
      
      // Add to history (but not runtime info updates)
      if (!['totalProjects', 'visibleCards', 'scrollOffset'].includes(key)) {
        const newHistory = history.current.slice(0, historyIndex.current + 1);
        newHistory.push(newConfig);
        
        if (newHistory.length > maxHistory) {
          newHistory.shift();
        }
        
        history.current = newHistory;
        historyIndex.current = newHistory.length - 1;
      }
      
      return newConfig;
    });
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(defaultHelixConfig);
    history.current = [defaultHelixConfig];
    historyIndex.current = 0;
  }, []);

  const undoConfig = useCallback(() => {
    if (historyIndex.current > 0) {
      historyIndex.current -= 1;
      const previousConfig = history.current[historyIndex.current];
      setConfig(previousConfig);
    }
  }, []);

  const redoConfig = useCallback(() => {
    if (historyIndex.current < history.current.length - 1) {
      historyIndex.current += 1;
      const nextConfig = history.current[historyIndex.current];
      setConfig(nextConfig);
    }
  }, []);

  const canUndo = historyIndex.current > 0;
  const canRedo = historyIndex.current < history.current.length - 1;

  const updateRuntimeInfo = useCallback((updates) => {
    setConfig(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  return {
    config,
    updateConfig,
    resetConfig,
    undoConfig,
    redoConfig,
    canUndo,
    canRedo,
    updateRuntimeInfo
  };
};