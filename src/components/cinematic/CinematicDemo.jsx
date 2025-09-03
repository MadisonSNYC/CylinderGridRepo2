import React, { useState } from 'react';
import { HelixCinematicPackage, presets, withPreset } from './index.js';
import { projects } from '../../data/projects.js';

export const CinematicDemo = () => {
  const [currentPreset, setCurrentPreset] = useState('showcase');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showControls, setShowControls] = useState(true);

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
  };

  const handlePresetChange = (presetName) => {
    setCurrentPreset(presetName);
  };

  return (
    <div className="cinematic-demo-wrapper">
      {/* Control Panel */}
      {showControls && (
        <div className="demo-controls">
          <div className="controls-header">
            <h2>Helix Cinematic Package Demo</h2>
            <button 
              onClick={() => setShowControls(false)}
              className="hide-controls-btn"
            >
              Hide Controls
            </button>
          </div>
          
          <div className="controls-grid">
            {/* Preset Selection */}
            <div className="control-group">
              <h3>Effect Presets</h3>
              <div className="preset-buttons">
                {Object.keys(presets).map((presetName) => (
                  <button
                    key={presetName}
                    onClick={() => handlePresetChange(presetName)}
                    className={`preset-btn ${currentPreset === presetName ? 'active' : ''}`}
                  >
                    {presetName.charAt(0).toUpperCase() + presetName.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Effects Status */}
            <div className="control-group">
              <h3>Active Effects</h3>
              <div className="effects-status">
                {Object.entries(presets[currentPreset]).map(([key, value]) => (
                  <div key={key} className="effect-item">
                    <span className={`effect-dot ${value ? 'active' : 'inactive'}`} />
                    <span className="effect-name">{key}</span>
                    <span className="effect-value">
                      {typeof value === 'boolean' ? (value ? 'ON' : 'OFF') : value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Project Info */}
            {selectedProject && (
              <div className="control-group">
                <h3>Selected Project</h3>
                <div className="project-info">
                  <h4>{selectedProject.title}</h4>
                  <p>{selectedProject.description}</p>
                  {selectedProject.videoAsset && (
                    <span className="project-has-video">📹 Video Available</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Show Controls Button (when hidden) */}
      {!showControls && (
        <button 
          onClick={() => setShowControls(true)}
          className="show-controls-btn"
        >
          Show Controls
        </button>
      )}

      {/* Main Cinematic Component */}
      <HelixCinematicPackage
        projects={projects}
        effects={presets[currentPreset]}
        onProjectSelect={handleProjectSelect}
        className="demo-helix"
      />

      {/* Instructions Overlay */}
      <div className="instructions-overlay">
        <div className="instructions-content">
          <h3>🎮 Navigation</h3>
          <ul>
            <li><strong>Mouse Wheel:</strong> Rotate helix</li>
            <li><strong>Click Cards:</strong> Select projects</li>
            <li><strong>Presets:</strong> Change effects above</li>
          </ul>
          <div className="features-list">
            <h4>✨ Features Demonstrated:</h4>
            <ul>
              <li>🎬 Cinematic color grading</li>
              <li>📺 CRT monitor simulation</li>
              <li>🌈 RGB edge glow effects</li>
              <li>💡 Advanced lighting system</li>
              <li>👻 Ghost card reflections</li>
              <li>🎯 Every-3rd card display</li>
              <li>🏷️ Center logo billboard</li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cinematic-demo-wrapper {
          position: relative;
          width: 100%;
          height: 100vh;
          background: #000;
          overflow: hidden;
        }

        .demo-controls {
          position: fixed;
          top: 20px;
          right: 20px;
          width: 320px;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 20px;
          z-index: 1000;
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-height: 80vh;
          overflow-y: auto;
        }

        .controls-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .controls-header h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #00ffff;
        }

        .hide-controls-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .hide-controls-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .show-controls-btn {
          position: fixed;
          top: 20px;
          right: 20px;
          background: rgba(0, 255, 255, 0.9);
          border: none;
          color: black;
          padding: 12px 20px;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          z-index: 1000;
          animation: pulse-glow 2s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 10px rgba(0, 255, 255, 0.5); }
          50% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.8); }
        }

        .controls-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .control-group h3 {
          margin: 0 0 10px 0;
          font-size: 14px;
          font-weight: 600;
          color: #ccc;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .preset-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .preset-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: capitalize;
        }

        .preset-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(0, 255, 255, 0.5);
        }

        .preset-btn.active {
          background: rgba(0, 255, 255, 0.2);
          border-color: #00ffff;
          color: #00ffff;
        }

        .effects-status {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .effect-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
        }

        .effect-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #666;
        }

        .effect-dot.active {
          background: #00ff88;
          box-shadow: 0 0 8px rgba(0, 255, 136, 0.5);
        }

        .effect-name {
          flex: 1;
          text-transform: capitalize;
        }

        .effect-value {
          color: #999;
          font-size: 11px;
        }

        .project-info {
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .project-info h4 {
          margin: 0 0 8px 0;
          color: #00ffff;
          font-size: 14px;
        }

        .project-info p {
          margin: 0 0 8px 0;
          font-size: 12px;
          line-height: 1.4;
          color: #ccc;
        }

        .project-has-video {
          font-size: 11px;
          color: #00ff88;
          background: rgba(0, 255, 136, 0.1);
          padding: 4px 8px;
          border-radius: 4px;
        }

        .instructions-overlay {
          position: fixed;
          bottom: 20px;
          left: 20px;
          max-width: 300px;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 16px;
          z-index: 1000;
          color: white;
          font-size: 12px;
          line-height: 1.4;
        }

        .instructions-content h3 {
          margin: 0 0 12px 0;
          color: #00ffff;
          font-size: 14px;
        }

        .instructions-content h4 {
          margin: 12px 0 8px 0;
          color: #ff8800;
          font-size: 12px;
        }

        .instructions-content ul {
          margin: 0;
          padding-left: 16px;
        }

        .instructions-content li {
          margin-bottom: 4px;
        }

        .features-list ul li {
          font-size: 11px;
        }

        .demo-helix {
          width: 100%;
          height: 100vh;
        }

        @media (max-width: 768px) {
          .demo-controls {
            width: 280px;
            top: 10px;
            right: 10px;
          }

          .instructions-overlay {
            bottom: 10px;
            left: 10px;
            max-width: 250px;
          }
        }
      `}</style>
    </div>
  );
};

export default CinematicDemo;