// Migration bridge to smoothly transition from old to new state management
// This ensures backward compatibility during the integration phase

import { useHelixConfig, useHelixScroll } from '../contexts/HelixContext.jsx';
import { useCallback, useMemo } from 'react';

// Bridge hook that provides old API using new state management
export function useMigrationBridge() {
  const { config, effects, updateConfig, toggleEffect, resetConfig, resetEffects, undo, redo, canUndo, canRedo } = useHelixConfig();
  const { scroll, updateScroll } = useHelixScroll();
  
  // Map new state structure to old effects format
  const legacyEffects = useMemo(() => ({
    // Preserve all existing effect keys
    ...effects,
    // Ensure compatibility with existing components
    repeatTurns: effects.repeatTurns || config.repeatTurns || 2,
    placementStrength: effects.placementStrength || 6
  }), [effects, config]);
  
  // Map new config to old helixConfig format
  const legacyHelixConfig = useMemo(() => ({
    ...config,
    scrollOffset: scroll.offset,
    scrollSensitivity: config.scrollSensitivity || 0.5
  }), [config, scroll.offset]);
  
  // Legacy toggleEffect function
  const legacyToggleEffect = useCallback((key, value) => {
    if (value !== undefined) {
      toggleEffect(key, value);
    } else {
      // Toggle boolean values
      toggleEffect(key, !effects[key]);
    }
  }, [toggleEffect, effects]);
  
  // Legacy setters for specific values
  const setPlacementStrength = useCallback((value) => {
    toggleEffect('placementStrength', value);
  }, [toggleEffect]);
  
  const setRepeatTurns = useCallback((value) => {
    toggleEffect('repeatTurns', value);
  }, [toggleEffect]);
  
  // Legacy config update
  const updateHelixConfig = useCallback((key, value) => {
    updateConfig(key, value);
  }, [updateConfig]);
  
  return {
    // Old hook API
    effects: legacyEffects,
    toggleEffect: legacyToggleEffect,
    resetEffects,
    undoEffects: undo,
    redoEffects: redo,
    canUndo: canUndo,
    canRedo: canRedo,
    setPlacementStrength,
    setRepeatTurns,
    
    // Config API
    config: legacyHelixConfig,
    updateConfig: updateHelixConfig,
    resetConfig,
    
    // Scroll API
    scrollOffset: scroll.offset,
    updateScroll
  };
}

// Drop-in replacement for useEffects hook
export function useEffectsCompat() {
  const bridge = useMigrationBridge();
  
  return {
    effects: bridge.effects,
    toggleEffect: bridge.toggleEffect,
    resetEffects: bridge.resetEffects,
    undoEffects: bridge.undoEffects,
    redoEffects: bridge.redoEffects,
    canUndo: bridge.canUndo,
    canRedo: bridge.canRedo,
    applyPreset: (preset) => {
      Object.entries(preset).forEach(([key, value]) => {
        bridge.toggleEffect(key, value);
      });
    },
    setPlacementStrength: bridge.setPlacementStrength,
    setRepeatTurns: bridge.setRepeatTurns
  };
}

// Drop-in replacement for useHelixConfig hook
export function useHelixConfigCompat() {
  const bridge = useMigrationBridge();
  
  return {
    config: bridge.config,
    updateConfig: bridge.updateConfig,
    resetConfig: bridge.resetConfig,
    undoConfig: bridge.undoEffects,
    redoConfig: bridge.redoEffects,
    canUndo: bridge.canUndo,
    canRedo: bridge.canRedo,
    updateRuntimeInfo: () => {} // No-op for compatibility
  };
}