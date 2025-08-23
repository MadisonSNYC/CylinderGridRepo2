import React from 'react';

export const StructureEffects = ({ effects, children }) => {
  return (
    <div 
      className="structure-effects-wrapper"
      data-central-wireframe={effects.centralWireframe}
      data-wireframe-lines={effects.centralWireframe && !effects.centerLogo}
      data-smooth-rotation={effects.smoothRotation}
      data-depth-hierarchy={effects.depthHierarchy}
    >
      <style jsx="true">{`
        /* Central Wireframe Structure */
        .structure-effects-wrapper[data-central-wireframe="true"] .helix-assembly::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 138px;  /* 15% bigger than 120px */
          height: 138px;  /* 15% bigger than 120px */
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          z-index: 5;
        }

        .structure-effects-wrapper[data-central-wireframe="true"] .helix-assembly::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotateX(90deg);
          width: 138px;  /* 15% bigger than 120px */
          height: 138px;  /* 15% bigger than 120px */
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          z-index: 5;
        }

        /* Ashfall-style wireframe for light theme */
        .color-scheme-wrapper[data-ashfall-colors="true"] .structure-effects-wrapper[data-central-wireframe="true"] .helix-assembly::before {
          border-color: rgba(0, 0, 0, 0.15);
        }

        .color-scheme-wrapper[data-ashfall-colors="true"] .structure-effects-wrapper[data-central-wireframe="true"] .helix-assembly::after {
          border-color: rgba(0, 0, 0, 0.08);
        }

        /* Tripod structure lines - only show when data-wireframe-lines is true */
        .structure-effects-wrapper[data-wireframe-lines="true"] .wireframe-tripod {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 200px;
          pointer-events: none;
          z-index: 4;
        }

        .structure-effects-wrapper[data-wireframe-lines="true"] .wireframe-line {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          transform-origin: center;
        }

        .structure-effects-wrapper[data-wireframe-lines="true"] .wireframe-line:nth-child(1) {
          top: 50%;
          left: 50%;
          width: 100px;
          height: 1px;
          transform: translate(-50%, -50%) rotate(0deg);
        }

        .structure-effects-wrapper[data-wireframe-lines="true"] .wireframe-line:nth-child(2) {
          top: 50%;
          left: 50%;
          width: 100px;
          height: 1px;
          transform: translate(-50%, -50%) rotate(120deg);
        }

        .structure-effects-wrapper[data-wireframe-lines="true"] .wireframe-line:nth-child(3) {
          top: 50%;
          left: 50%;
          width: 100px;
          height: 1px;
          transform: translate(-50%, -50%) rotate(240deg);
        }

        /* Ashfall-style wireframe lines */
        .color-scheme-wrapper[data-ashfall-colors="true"] .structure-effects-wrapper[data-wireframe-lines="true"] .wireframe-line {
          background: rgba(0, 0, 0, 0.1);
        }

        /* Smooth Rotation */
        .structure-effects-wrapper[data-smooth-rotation="true"] .helix-assembly {
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        .structure-effects-wrapper[data-smooth-rotation="false"] .helix-assembly {
          transition: transform 0.3s ease !important;
        }

        /* Depth Hierarchy */
        .structure-effects-wrapper[data-depth-hierarchy="true"] .helix-node {
          transition: transform 0.3s ease, opacity 0.3s ease, filter 0.3s ease;
        }

        .structure-effects-wrapper[data-depth-hierarchy="true"] .helix-node.depth-far {
          transform: scale(0.85);
          opacity: 0.6;
          filter: blur(0.5px);
        }

        .structure-effects-wrapper[data-depth-hierarchy="true"] .helix-node.depth-medium {
          transform: scale(0.95);
          opacity: 0.8;
        }

        .structure-effects-wrapper[data-depth-hierarchy="true"] .helix-node.depth-near {
          transform: scale(1.05);
          opacity: 1;
          z-index: 10;
        }

        .structure-effects-wrapper[data-depth-hierarchy="true"] .helix-node.active {
          transform: scale(1.1) !important;
          opacity: 1 !important;
          filter: blur(0px) !important;
          z-index: 20 !important;
        }

        /* Enhanced 3D perspective for smooth rotation */
        .structure-effects-wrapper[data-smooth-rotation="true"] .helix-scene {
          perspective: 1500px;
          perspective-origin: center center;
        }

        /* Subtle floating animation for wireframe lines */
        .structure-effects-wrapper[data-wireframe-lines="true"] .wireframe-tripod {
          animation: wireframe-float 8s ease-in-out infinite alternate;
        }

        @keyframes wireframe-float {
          0% { transform: translate(-50%, -50%) rotateZ(0deg); }
          100% { transform: translate(-50%, -50%) rotateZ(5deg); }
        }
      `}</style>
      
      {/* Wireframe Tripod Structure - only show if centerLogo is OFF */}
      {effects.centralWireframe && !effects.centerLogo && (
        <div className="wireframe-tripod">
          <div className="wireframe-line"></div>
          <div className="wireframe-line"></div>
          <div className="wireframe-line"></div>
        </div>
      )}
      
      {children}
    </div>
  );
};

