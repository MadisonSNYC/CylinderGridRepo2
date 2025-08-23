import React from 'react';

export const ColorSchemeEffects = ({ effects, children }) => {
  const getBackgroundStyle = () => {
    if (effects.ashfallColors) {
      return {
        background: 'linear-gradient(135deg, #eee9e2 0%, #e8e3dc 100%)',
        color: '#929292'
      };
    }
    return {
      background: 'linear-gradient(135deg, #111111 0%, #000000 100%)',
      color: '#ffffff'
    };
  };

  const getSceneStyle = () => {
    if (effects.ashfallColors) {
      return {
        background: 'linear-gradient(135deg, #eee9e2 0%, #e8e3dc 100%)'
      };
    }
    return {
      background: 'linear-gradient(135deg, #111111 0%, #000000 100%)'
    };
  };

  return (
    <div 
      className="color-scheme-wrapper"
      style={getBackgroundStyle()}
      data-ashfall-colors={effects.ashfallColors}
      data-monochrome={effects.monochrome}
    >
      <style jsx="true">{`
        .color-scheme-wrapper {
          transition: all 0.5s ease;
        }
        
        .helix-scene {
          ${effects.ashfallColors ? `
            background: linear-gradient(135deg, #eee9e2 0%, #e8e3dc 100%) !important;
          ` : `
            background: linear-gradient(135deg, #111111 0%, #000000 100%) !important;
          `}
        }
        
        .project-info-overlay {
          ${effects.ashfallColors ? `
            color: #929292 !important;
          ` : `
            color: #ffffff !important;
          `}
        }
        
        .project-info-overlay h2 {
          ${effects.ashfallColors ? `
            color: #333333 !important;
          ` : `
            color: #ffffff !important;
          `}
        }
        
        .navigation-instructions {
          ${effects.ashfallColors ? `
            background: rgba(255, 255, 255, 0.9) !important;
            color: #333333 !important;
            border: 1px solid rgba(0, 0, 0, 0.1) !important;
          ` : `
            background: rgba(0, 0, 0, 0.8) !important;
            color: #ffffff !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
          `}
        }
      `}</style>
      {children}
    </div>
  );
};

