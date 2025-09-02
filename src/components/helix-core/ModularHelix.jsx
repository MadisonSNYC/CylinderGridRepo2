import React, { useMemo } from 'react';
import { HelixCore } from './HelixCore';
import { useHelixScroll } from './useHelixScroll';
import { HelixEffectComposer, effectStyles } from './HelixEffects';

/**
 * Modular helix component with optional effects
 * 
 * @example
 * // Minimal usage
 * <ModularHelix items={projects} />
 * 
 * @example 
 * // With effects
 * <ModularHelix 
 *   items={projects}
 *   effects={{
 *     vignette: true,
 *     scanlines: { animated: true },
 *     glow: { color: '0,255,255' }
 *   }}
 * />
 * 
 * @example
 * // Custom render
 * <ModularHelix
 *   items={projects}
 *   renderItem={(item, index) => (
 *     <CustomCard data={item} />
 *   )}
 * />
 */
export const ModularHelix = ({
  items = [],
  config = {},
  scrollConfig = {},
  effects = null,
  renderItem,
  onItemClick,
  className = '',
  style = {},
  children
}) => {
  // Setup scroll handling
  const {
    scrollOffset,
    activeIndex,
    containerRef,
    setActiveIndex,
    scrollToIndex
  } = useHelixScroll(scrollConfig);
  
  // Handle item clicks
  const handleItemClick = (index) => {
    setActiveIndex(index);
    onItemClick?.(items[index], index);
  };
  
  // Default render function if none provided
  const defaultRenderItem = (item, index) => {
    if (children) {
      return typeof children === 'function' 
        ? children(item, index, activeIndex === index)
        : children;
    }
    
    return (
      <div 
        className="helix-default-item"
        style={{
          width: '200px',
          height: '300px',
          marginLeft: '-100px',
          marginTop: '-150px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          border: activeIndex === index ? '2px solid #00ffff' : '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
        }}
      >
        {item.title || item.name || `Item ${index + 1}`}
      </div>
    );
  };
  
  // Core helix content
  const helixContent = (
    <HelixCore
      items={items}
      scrollOffset={scrollOffset}
      config={config}
      onItemClick={handleItemClick}
      renderItem={renderItem || defaultRenderItem}
      className={className}
      style={style}
      containerProps={{ ref: containerRef }}
    />
  );
  
  // Apply effects if specified
  const content = effects ? (
    <HelixEffectComposer effects={effects}>
      {helixContent}
    </HelixEffectComposer>
  ) : helixContent;
  
  return (
    <>
      {content}
      <style>{effectStyles}</style>
    </>
  );
};

/**
 * Preset configurations for common use cases
 */
export const helixPresets = {
  minimal: {
    config: { radius: 300, verticalSpacing: 80 },
    scrollConfig: { scrollSpeed: 0.001, enableInertia: false }
  },
  
  cinematic: {
    config: { radius: 320, verticalSpacing: 100, rotateX: -10 },
    scrollConfig: { scrollSpeed: 0.001, enableInertia: true, inertia: 0.95 },
    effects: {
      vignette: true,
      filmGrain: { opacity: 0.1 },
      scanlines: { animated: true },
      lighting: true
    }
  },
  
  cyberpunk: {
    config: { radius: 350, verticalSpacing: 120, rotateX: -15 },
    scrollConfig: { scrollSpeed: 0.002, enableInertia: true },
    effects: {
      vignette: { color: '0,255,255', intensity: 0.5 },
      scanlines: { color: '255,0,255', animated: true },
      glow: { color: '0,255,255' },
      chromatic: { trigger: 'always' }
    }
  },
  
  retro: {
    config: { radius: 280, verticalSpacing: 90 },
    scrollConfig: { scrollSpeed: 0.0015 },
    effects: {
      monitor: { bezelColor: '#8B7355' },
      scanlines: { lineHeight: 4, opacity: 0.05 },
      vignette: { color: '139,69,19', intensity: 0.3 }
    }
  },
  
  gallery: {
    config: { radius: 400, verticalSpacing: 150, rotateX: 0 },
    scrollConfig: { scrollSpeed: 0.0008, enableKeyboard: true }
  }
};

/**
 * Helper hook to use preset configurations
 */
export const useHelixPreset = (presetName) => {
  return useMemo(() => {
    const preset = helixPresets[presetName];
    if (!preset) {
      console.warn(`Helix preset "${presetName}" not found`);
      return {};
    }
    return preset;
  }, [presetName]);
};

export default ModularHelix;