import React from 'react';

export const VisualEffects = ({ effects, children }) => {
  // Compute CSS variables from strength value
  const s = effects.placementStrength ?? 6;     // 0..10 (stronger default)

  // --- BASE scales that mimic the Depth Blur look (no blur) ---
  const baseNearScale = 1.060;   // near ≈ +6%
  const baseMidScale  = 1.000;   // mid = 0%
  const baseFarScale  = 0.940;   // far ≈ -6%

  // keep Z and tilt the same
  const nearZ     = 4 + s * 0.8;                // px
  const farZ      = -(7 + s * 1.1);             // px (negative = pushed back)
  const farTilt   = -(0.18 + s * 0.022);        // deg

  // OPTIONAL: small modulation from strength (subtle extra 0..±1%)
  const mod = (s - 5) * 0.001; // -0.005..+0.005 around mid
  const nearScale = baseNearScale + mod;    // ≈ 1.055..1.065
  const midScale  = baseMidScale;           // keep 1.000
  const farScale  = baseFarScale  - mod;    // ≈ 0.935..0.945

  // Always apply placement vars (placement is now always-on)
  const placementVars = {
    '--pp-near-z'    : `${Math.round(nearZ)}px`,
    '--pp-mid-z'     : `0px`,
    '--pp-far-z'     : `${Math.round(farZ)}px`,
    '--pp-near-scale': nearScale,
    '--pp-mid-scale' : midScale,
    '--pp-far-scale' : farScale,
    '--pp-near-tilt' : `0deg`,
    '--pp-mid-tilt'  : `-0.10deg`,
    '--pp-far-tilt'  : `${farTilt.toFixed(2)}deg`,
  };

  return (
    <div 
      className={`visual-effects-wrapper fx-depth-placement ${effects.depthBlur ? 'fx-depth-blur' : ''} ${effects.outwardTurn ? 'fx-outward' : ''} ${effects.centerLogo ? 'fx-center-logo' : ''} ${effects.rgbEdge ? 'fx-rgb-edge' : ''}`}
      style={placementVars}
      data-chromatic-aberration={effects.chromaticAberration}
      data-depth-blur={effects.depthBlur}
      data-glitch-effects={effects.glitchEffects}
      data-ambient-lighting={effects.ambientLighting}
      data-depth-hierarchy={effects.depthHierarchy}
      data-ashfall-cards={effects.ashfallCards}
      data-ashfall-colors={effects.ashfallColors}
      data-typography={effects.ashfallTypography}
      data-center-logo-mode={effects.centerLogoMode}
      data-cinematic-colors={effects.cinematicColors}
      data-screen-glow={effects.screenGlow}
      data-scan-lines={effects.scanLines}
      data-film-grain={effects.filmGrain}
      data-monitor-style={effects.monitorStyle}
      data-color-grade={effects.colorGrade}
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

