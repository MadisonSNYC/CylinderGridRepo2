import React from 'react';

export const VisualEffects = ({ effects, children }) => {
  // Gate/Orchestrator only - no per-tile math
  // All tile-specific calculations are in useHelixAngles.js
  
  const alpha = Math.max(0, Math.min(100, effects.rgbIntensity ?? 30)) / 100; // 0..1
  const offset = Math.max(0, Math.min(2, effects.rgbOffsetPx ?? 1));          // px
  
  // Derive responsive tilt in JS for clarity
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches;
  const trackTilt = isMobile ? (effects.trackTiltMobileDeg ?? -3) : (effects.trackTiltDeg ?? -10);
  
  // Perspective for constant tile size calculation
  const persp = 1200; // keep in sync with assembly style
  
  return (
    <div 
      className={`visual-effects-wrapper lab-compat
                  ${effects.depthBlur ? 'fx-depth-blur' : ''} 
                  ${effects.outwardTurn ? 'fx-outward' : ''} 
                  ${effects.centerLogo ? 'fx-center-logo' : ''} 
                  ${effects.rgbEdge ? 'fx-rgb-edge' : ''}
                  ${effects.depthOfField ? 'fx-lab-dof' : ''}
                  ${effects.ghostBack ? 'fx-lab-ghost' : ''}
                  ${effects.biasEffect ? 'fx-lab-bias' : ''}
                  ${effects.monitorStyle ? 'fx-lab-monitor' : ''}
                  ${effects.screenGlow ? 'fx-lab-glow' : ''}
                  ${effects.scanLines ? 'fx-lab-scan' : ''}
                  ${effects.chromaticAberration ? 'fx-lab-chroma' : ''}
                  ${effects.atmosphericGrain ? 'fx-lab-grain' : ''}
                  ${effects.filmNoise ? 'fx-lab-film' : ''}
                  ${effects.cinematicLighting ? 'fx-lab-light' : ''}
                  ${effects.constantTileSize ? 'fx-const-size' : ''}`}
      style={{
        '--rgb-alpha': alpha,
        '--rgb-offset': `${offset}px`,
        '--track-tilt-deg': `${trackTilt}`,  // degrees (numeric string)
        '--persp': `${persp}`,                // used by our calc (reference only)
        '--comp-strength': `${effects.compStrength ?? 0.85}`,
      }}
      data-chromatic-aberration={effects.chromaticAberration}
      data-depth-blur={effects.depthBlur}
      data-glitch-effects={effects.glitchEffects}
      data-ambient-lighting={effects.ambientLighting}
      data-depth-hierarchy={effects.depthHierarchy}
      data-ashfall-cards={effects.ashfallCards}
      data-ashfall-colors={effects.ashfallColors}
      data-typography={effects.ashfallTypography}
      data-center-logo-mode={effects.centerLogoMode}
      data-dof={effects.depthOfField ? 'on' : 'off'}
      data-ghost={effects.ghostBack ? 'on' : 'off'}
      data-bias={effects.biasEffect ? 'on' : 'off'}
      data-placement-strength={effects.placementStrength ?? 6}
    >
      <style jsx="true">{`
        /* Chromatic Aberration Effect */
        .visual-effects-wrapper[data-chromatic-aberration="true"] .helix-node::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, 
            rgba(255, 0, 0, 0.1) 0%, 
            transparent 25%, 
            transparent 75%, 
            rgba(0, 0, 255, 0.1) 100%
          );
          border-radius: inherit;
          pointer-events: none;
          z-index: -1;
        }

        .visual-effects-wrapper[data-chromatic-aberration="true"] .helix-node::after {
          content: '';
          position: absolute;
          top: 1px;
          left: 1px;
          right: 1px;
          bottom: 1px;
          background: linear-gradient(-45deg, 
            rgba(0, 255, 0, 0.05) 0%, 
            transparent 50%, 
            rgba(255, 0, 255, 0.05) 100%
          );
          border-radius: inherit;
          pointer-events: none;
          z-index: -1;
        }

        /* Depth Blur Effect */
        .visual-effects-wrapper[data-depth-blur="true"] .helix-node {
          transition: filter 0.3s ease, opacity 0.3s ease;
        }

        .visual-effects-wrapper[data-depth-blur="true"] .helix-node:not(.active) {
          filter: blur(1px);
          opacity: 0.7;
        }

        .visual-effects-wrapper[data-depth-blur="true"] .helix-node.active {
          filter: blur(0px);
          opacity: 1;
        }

        /* Glitch Effects */
        .visual-effects-wrapper[data-glitch-effects="true"] .helix-node:hover {
          animation: glitch-shake 0.3s ease-in-out;
        }

        @keyframes glitch-shake {
          0%, 100% { transform: translateX(0); }
          10% { transform: translateX(-1px) translateY(1px); }
          20% { transform: translateX(1px) translateY(-1px); }
          30% { transform: translateX(-1px) translateY(1px); }
          40% { transform: translateX(1px) translateY(-1px); }
          50% { transform: translateX(-1px) translateY(1px); }
          60% { transform: translateX(1px) translateY(-1px); }
          70% { transform: translateX(-1px) translateY(1px); }
          80% { transform: translateX(1px) translateY(-1px); }
          90% { transform: translateX(-1px) translateY(1px); }
        }

        .visual-effects-wrapper[data-glitch-effects="true"] .helix-node:hover::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(255, 0, 0, 0.1) 25%, 
            rgba(0, 255, 0, 0.1) 50%, 
            rgba(0, 0, 255, 0.1) 75%, 
            transparent 100%
          );
          animation: glitch-sweep 0.3s ease-out;
          pointer-events: none;
          z-index: 10;
        }

        @keyframes glitch-sweep {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }

        /* Ambient Lighting */
        .visual-effects-wrapper[data-ambient-lighting="true"] .helix-scene {
          position: relative;
        }

        .visual-effects-wrapper[data-ambient-lighting="true"] .helix-scene::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            ellipse at center,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.05) 30%,
            transparent 70%
          );
          pointer-events: none;
          z-index: 1;
        }

        .visual-effects-wrapper[data-ambient-lighting="true"] .helix-node {
          box-shadow: 
            0 4px 8px rgba(0, 0, 0, 0.1),
            0 2px 4px rgba(0, 0, 0, 0.06);
        }

        .visual-effects-wrapper[data-ambient-lighting="true"] .helix-node.active {
          box-shadow: 
            0 8px 16px rgba(0, 0, 0, 0.15),
            0 4px 8px rgba(0, 0, 0, 0.1);
        }

        /* Smooth transitions for all effects */
        .visual-effects-wrapper .helix-node {
          transition: all 0.3s ease;
        }
      `}</style>
      {children}
    </div>
  );
};

