// Context providers for helix state management
// Separated by update frequency to optimize re-renders

import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useHelixState } from '../hooks/useHelixState.js';

// High-frequency context (scroll, animation)
const HelixScrollContext = createContext(null);

// Medium-frequency context (config, effects)
const HelixConfigContext = createContext(null);

// Low-frequency context (performance metrics)
const HelixPerformanceContext = createContext(null);

// Provider component that manages all contexts
export function HelixProvider({ children }) {
  const {
    state,
    scrollState,
    configState,
    effectsState,
    performanceState,
    updateScroll,
    batchScrollUpdate,
    updateConfig,
    resetConfig,
    toggleEffect,
    applyPreset,
    resetEffects,
    updateFPS,
    updateVisibleCards,
    undo,
    redo,
    canUndo,
    canRedo
  } = useHelixState();
  
  // High-frequency scroll context value
  const scrollContextValue = useMemo(() => ({
    scroll: scrollState,
    cards: state.cards,
    updateScroll,
    batchScrollUpdate,
    updateVisibleCards
  }), [scrollState, state.cards, updateScroll, batchScrollUpdate, updateVisibleCards]);
  
  // Medium-frequency config context value
  const configContextValue = useMemo(() => ({
    config: configState,
    effects: effectsState,
    updateConfig,
    resetConfig,
    toggleEffect,
    applyPreset,
    resetEffects,
    undo,
    redo,
    canUndo,
    canRedo
  }), [
    configState,
    effectsState,
    updateConfig,
    resetConfig,
    toggleEffect,
    applyPreset,
    resetEffects,
    undo,
    redo,
    canUndo,
    canRedo
  ]);
  
  // Low-frequency performance context value
  const performanceContextValue = useMemo(() => ({
    performance: performanceState,
    updateFPS
  }), [performanceState, updateFPS]);
  
  return (
    <HelixScrollContext.Provider value={scrollContextValue}>
      <HelixConfigContext.Provider value={configContextValue}>
        <HelixPerformanceContext.Provider value={performanceContextValue}>
          {children}
        </HelixPerformanceContext.Provider>
      </HelixConfigContext.Provider>
    </HelixScrollContext.Provider>
  );
}

// Custom hooks for consuming contexts
export function useHelixScroll() {
  const context = useContext(HelixScrollContext);
  if (!context) {
    throw new Error('useHelixScroll must be used within HelixProvider');
  }
  return context;
}

export function useHelixConfig() {
  const context = useContext(HelixConfigContext);
  if (!context) {
    throw new Error('useHelixConfig must be used within HelixProvider');
  }
  return context;
}

export function useHelixPerformance() {
  const context = useContext(HelixPerformanceContext);
  if (!context) {
    throw new Error('useHelixPerformance must be used within HelixProvider');
  }
  return context;
}

// Subscription-based updates for specific components
export function useHelixSubscription(selector, equalityFn = Object.is) {
  const scrollContext = useContext(HelixScrollContext);
  const configContext = useContext(HelixConfigContext);
  
  const selectedValue = useMemo(() => {
    if (!scrollContext || !configContext) return null;
    
    return selector({
      ...scrollContext,
      ...configContext
    });
  }, [scrollContext, configContext, selector]);
  
  // Use equalityFn to prevent unnecessary re-renders
  const [value, setValue] = React.useState(selectedValue);
  
  React.useEffect(() => {
    if (!equalityFn(value, selectedValue)) {
      setValue(selectedValue);
    }
  }, [selectedValue, value, equalityFn]);
  
  return value;
}