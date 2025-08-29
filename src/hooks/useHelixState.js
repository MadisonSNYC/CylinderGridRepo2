// Unified state management for helix with reducer pattern
import { useReducer, useCallback, useMemo, useRef } from 'react';
import { helixPositionCache } from '../utils/helixPositionCache.js';

// Action types
const ACTIONS = {
  // Scroll actions
  UPDATE_SCROLL: 'UPDATE_SCROLL',
  SET_SCROLL_VELOCITY: 'SET_SCROLL_VELOCITY',
  BATCH_SCROLL_UPDATE: 'BATCH_SCROLL_UPDATE',
  
  // Config actions
  UPDATE_CONFIG: 'UPDATE_CONFIG',
  RESET_CONFIG: 'RESET_CONFIG',
  
  // Effects actions
  TOGGLE_EFFECT: 'TOGGLE_EFFECT',
  APPLY_PRESET: 'APPLY_PRESET',
  RESET_EFFECTS: 'RESET_EFFECTS',
  
  // Performance actions
  UPDATE_FPS: 'UPDATE_FPS',
  UPDATE_VISIBLE_CARDS: 'UPDATE_VISIBLE_CARDS',
  
  // History actions
  UNDO: 'UNDO',
  REDO: 'REDO',
  SAVE_HISTORY: 'SAVE_HISTORY'
};

// Initial state
const initialState = {
  // Scroll state
  scroll: {
    offset: 0,
    velocity: 0,
    direction: 'idle',
    isAnimating: false,
    lastUpdateTime: performance.now()
  },
  
  // Card visibility and positioning
  cards: {
    visibleIndices: new Set(),
    activeIndex: 0,
    totalProjects: 16,
    repeatTurns: 2
  },
  
  // Helix configuration
  config: {
    perspective: 3000,
    perspectiveOriginX: 71,
    perspectiveOriginY: 32,
    radius: 470,
    verticalSpan: 650,
    rotateX: -10,
    rotateY: 0,
    rotateZ: 0,
    cardWidth: 180,
    cardHeight: 320,
    cardScale: 1,
    opacityFront: 1,
    opacitySide: 0.7,
    opacityBack: 0.3,
    containerWidth: 500,
    containerHeight: 400,
    scrollSensitivity: 0.5,
    showEveryNth: 1,
    enableCulling: false,
    enableLOD: false,
    activeCards: null,
    renderDistance: null
  },
  
  // Effects configuration
  effects: {
    centerLogo: true,
    centerLogoMode: 'billboard',
    richCardContent: true,
    cardHoverEffects: true,
    videoPlayOnHover: true,
    smoothRotation: false,
    depthHierarchy: false,
    placementStrength: 6,
    repeatTurns: 2.0,
    outwardTurn: true,
    invertScroll: false,
    scrollMode: 'wheel'
  },
  
  // Performance metrics
  performance: {
    currentFPS: 60,
    averageFPS: 60,
    renderTime: 0,
    cacheHitRate: 0
  },
  
  // History for undo/redo
  history: {
    past: [],
    future: [],
    maxHistory: 50
  }
};

// Reducer function with optimized state updates
function helixReducer(state, action) {
  switch (action.type) {
    case ACTIONS.UPDATE_SCROLL: {
      const { delta, timestamp = performance.now() } = action.payload;
      const newOffset = state.scroll.offset + delta;
      const velocity = delta / Math.max(1, timestamp - state.scroll.lastUpdateTime);
      
      return {
        ...state,
        scroll: {
          ...state.scroll,
          offset: newOffset,
          velocity,
          direction: delta > 0 ? 'down' : delta < 0 ? 'up' : 'idle',
          lastUpdateTime: timestamp,
          isAnimating: Math.abs(velocity) > 0.001
        }
      };
    }
    
    case ACTIONS.BATCH_SCROLL_UPDATE: {
      const { updates } = action.payload;
      return {
        ...state,
        scroll: {
          ...state.scroll,
          ...updates
        }
      };
    }
    
    case ACTIONS.UPDATE_CONFIG: {
      const { key, value } = action.payload;
      
      // Clear position cache when config changes
      if (['radius', 'verticalSpan', 'repeatTurns', 'cardScale'].includes(key)) {
        helixPositionCache.clear();
      }
      
      return {
        ...state,
        config: {
          ...state.config,
          [key]: value
        }
      };
    }
    
    case ACTIONS.RESET_CONFIG: {
      helixPositionCache.clear();
      return {
        ...state,
        config: initialState.config
      };
    }
    
    case ACTIONS.TOGGLE_EFFECT: {
      const { key, value } = action.payload;
      return {
        ...state,
        effects: {
          ...state.effects,
          [key]: value
        }
      };
    }
    
    case ACTIONS.APPLY_PRESET: {
      const { preset } = action.payload;
      return {
        ...state,
        effects: {
          ...state.effects,
          ...preset
        }
      };
    }
    
    case ACTIONS.RESET_EFFECTS: {
      return {
        ...state,
        effects: initialState.effects
      };
    }
    
    case ACTIONS.UPDATE_VISIBLE_CARDS: {
      const { indices } = action.payload;
      return {
        ...state,
        cards: {
          ...state.cards,
          visibleIndices: new Set(indices)
        }
      };
    }
    
    case ACTIONS.UPDATE_FPS: {
      const { current, average } = action.payload;
      return {
        ...state,
        performance: {
          ...state.performance,
          currentFPS: current,
          averageFPS: average
        }
      };
    }
    
    case ACTIONS.SAVE_HISTORY: {
      const newHistory = [...state.history.past, action.payload];
      if (newHistory.length > state.history.maxHistory) {
        newHistory.shift();
      }
      
      return {
        ...state,
        history: {
          ...state.history,
          past: newHistory,
          future: []
        }
      };
    }
    
    case ACTIONS.UNDO: {
      if (state.history.past.length === 0) return state;
      
      const previous = state.history.past[state.history.past.length - 1];
      const newPast = state.history.past.slice(0, -1);
      
      return {
        ...previous,
        history: {
          ...state.history,
          past: newPast,
          future: [state, ...state.history.future]
        }
      };
    }
    
    case ACTIONS.REDO: {
      if (state.history.future.length === 0) return state;
      
      const next = state.history.future[0];
      const newFuture = state.history.future.slice(1);
      
      return {
        ...next,
        history: {
          ...state.history,
          past: [...state.history.past, state],
          future: newFuture
        }
      };
    }
    
    default:
      return state;
  }
}

// Custom hook for unified helix state
export function useHelixState() {
  const [state, dispatch] = useReducer(helixReducer, initialState);
  const batchUpdates = useRef([]);
  const batchTimeout = useRef(null);
  
  // Memoized selectors for performance
  const scrollState = useMemo(() => state.scroll, [state.scroll]);
  const configState = useMemo(() => state.config, [state.config]);
  const effectsState = useMemo(() => state.effects, [state.effects]);
  const performanceState = useMemo(() => state.performance, [state.performance]);
  
  // Scroll actions
  const updateScroll = useCallback((delta, timestamp) => {
    dispatch({
      type: ACTIONS.UPDATE_SCROLL,
      payload: { delta, timestamp }
    });
  }, []);
  
  // Batch scroll updates for performance
  const batchScrollUpdate = useCallback((updates) => {
    batchUpdates.current.push(updates);
    
    if (batchTimeout.current) {
      clearTimeout(batchTimeout.current);
    }
    
    batchTimeout.current = setTimeout(() => {
      const combinedUpdates = batchUpdates.current.reduce((acc, update) => ({
        ...acc,
        ...update
      }), {});
      
      dispatch({
        type: ACTIONS.BATCH_SCROLL_UPDATE,
        payload: { updates: combinedUpdates }
      });
      
      batchUpdates.current = [];
      batchTimeout.current = null;
    }, 16); // Batch within one frame
  }, []);
  
  // Config actions
  const updateConfig = useCallback((key, value) => {
    dispatch({
      type: ACTIONS.UPDATE_CONFIG,
      payload: { key, value }
    });
  }, []);
  
  const resetConfig = useCallback(() => {
    dispatch({ type: ACTIONS.RESET_CONFIG });
  }, []);
  
  // Effects actions
  const toggleEffect = useCallback((key, value) => {
    dispatch({
      type: ACTIONS.TOGGLE_EFFECT,
      payload: { key, value }
    });
  }, []);
  
  const applyPreset = useCallback((preset) => {
    dispatch({
      type: ACTIONS.APPLY_PRESET,
      payload: { preset }
    });
  }, []);
  
  const resetEffects = useCallback(() => {
    dispatch({ type: ACTIONS.RESET_EFFECTS });
  }, []);
  
  // Performance actions
  const updateFPS = useCallback((current, average) => {
    dispatch({
      type: ACTIONS.UPDATE_FPS,
      payload: { current, average }
    });
  }, []);
  
  const updateVisibleCards = useCallback((indices) => {
    dispatch({
      type: ACTIONS.UPDATE_VISIBLE_CARDS,
      payload: { indices }
    });
  }, []);
  
  // History actions
  const undo = useCallback(() => {
    dispatch({ type: ACTIONS.UNDO });
  }, []);
  
  const redo = useCallback(() => {
    dispatch({ type: ACTIONS.REDO });
  }, []);
  
  const canUndo = state.history.past.length > 0;
  const canRedo = state.history.future.length > 0;
  
  return {
    // State
    state,
    scrollState,
    configState,
    effectsState,
    performanceState,
    
    // Actions
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
    
    // Helpers
    canUndo,
    canRedo
  };
}