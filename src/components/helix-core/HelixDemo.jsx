import React, { useState } from 'react';
import { ModularHelix, helixPresets } from './ModularHelix';
import { projects } from '../../data/projects';
import { VideoLazy } from '../video/VideoLazy';

/**
 * Demo page showcasing different helix configurations
 */
export const HelixDemo = () => {
  const [activePreset, setActivePreset] = useState('minimal');
  const [showEffects, setShowEffects] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Get current preset configuration
  const preset = helixPresets[activePreset] || {};
  
  // Custom render function for project cards
  const renderProjectCard = (project, index, isActive) => (
    <div 
      style={{
        width: '240px',
        height: '320px',
        marginLeft: '-120px',
        marginTop: '-160px',
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        border: isActive ? '3px solid #00ffff' : '1px solid rgba(255,255,255,0.2)',
        boxShadow: isActive 
          ? '0 20px 60px rgba(0,255,255,0.4)' 
          : '0 10px 40px rgba(0,0,0,0.5)',
        transition: 'all 0.3s ease',
        transform: isActive ? 'scale(1.05)' : 'scale(1)'
      }}
    >
      {project.videoAsset ? (
        <VideoLazy
          src={project.videoAsset}
          thumbnail={project.thumbnail}
          className="w-full h-2/3 object-cover"
          muted
          loop
          playsInline
          autoPlay={isActive}
        />
      ) : (
        <div 
          style={{
            width: '100%',
            height: '66.67%',
            background: `linear-gradient(45deg, #667eea 0%, #764ba2 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <span style={{ fontSize: '48px' }}>📦</span>
        </div>
      )}
      <div style={{
        padding: '12px',
        color: 'white',
        height: '33.33%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
          {project.title}
        </h3>
        <p style={{ margin: '4px 0 0', fontSize: '12px', opacity: 0.7 }}>
          {project.description?.slice(0, 50)}...
        </p>
      </div>
    </div>
  );
  
  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      background: '#000',
      overflow: 'hidden'
    }}>
      {/* Control Panel */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 200,
        background: 'rgba(0,0,0,0.9)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '12px',
        padding: '20px',
        color: 'white',
        backdropFilter: 'blur(10px)',
        minWidth: '250px'
      }}>
        <h2 style={{ margin: '0 0 16px', fontSize: '18px' }}>Helix Configuration</h2>
        
        {/* Preset Selection */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
            Preset:
          </label>
          <select 
            value={activePreset}
            onChange={(e) => setActivePreset(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '4px',
              color: 'white',
              fontSize: '14px'
            }}
          >
            {Object.keys(helixPresets).map(name => (
              <option key={name} value={name}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        {/* Effects Toggle */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
            <input 
              type="checkbox"
              checked={showEffects}
              onChange={(e) => setShowEffects(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            Enable Effects
          </label>
        </div>
        
        {/* Selected Project Info */}
        {selectedProject && (
          <div style={{
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255,255,255,0.2)'
          }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '16px' }}>Selected:</h3>
            <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
              {selectedProject.title}
            </p>
          </div>
        )}
        
        {/* Instructions */}
        <div style={{
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.2)',
          fontSize: '12px',
          opacity: 0.6
        }}>
          <p style={{ margin: '0 0 4px' }}>• Scroll to rotate</p>
          <p style={{ margin: '0 0 4px' }}>• Click cards to select</p>
          <p style={{ margin: 0 }}>• Arrow keys to navigate</p>
        </div>
      </div>
      
      {/* Helix Display */}
      <ModularHelix
        items={projects}
        config={preset.config}
        scrollConfig={preset.scrollConfig}
        effects={showEffects ? (preset.effects || {
          vignette: true,
          scanlines: { animated: true },
          glow: { color: '0,255,255' }
        }) : null}
        renderItem={renderProjectCard}
        onItemClick={setSelectedProject}
      />
      
      {/* Performance Info */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        padding: '12px 16px',
        background: 'rgba(0,0,0,0.8)',
        border: '1px solid rgba(0,255,255,0.3)',
        borderRadius: '8px',
        color: '#00ffff',
        fontSize: '12px',
        fontFamily: 'monospace'
      }}>
        Modular Helix v2.0
      </div>
    </div>
  );
};

export default HelixDemo;