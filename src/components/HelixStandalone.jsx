/**
 * Standalone Helix Component - Ready for Export
 * 
 * This is a completely self-contained helix component with all effects built-in.
 * No external dependencies except React itself.
 * 
 * Features:
 * - Every 3rd item is a full card, others are orbs
 * - Cinematic effects (vignette, film grain)
 * - RGB edge glow on cards
 * - Monitor/CRT frame effect
 * - Ghost reflection backs
 * - Rotating center logo
 * - Smooth scroll interaction
 * 
 * Usage:
 * import HelixStandalone from './HelixStandalone';
 * <HelixStandalone items={yourItems} logoSrc="/your-logo.png" />
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { projects } from '../data/projects.js';

// Use actual projects as default items
const defaultItems = projects.length > 0 ? projects : [
  { id: 1, title: 'Project Alpha', color: '#ff6b6b' },
  { id: 2, title: 'Project Beta', color: '#4ecdc4' },
  { id: 3, title: 'Project Gamma', color: '#45b7d1' },
  { id: 4, title: 'Project Delta', color: '#f7b731' },
  { id: 5, title: 'Project Epsilon', color: '#5f27cd' },
  { id: 6, title: 'Project Zeta', color: '#00d2d3' },
  { id: 7, title: 'Project Eta', color: '#ff9ff3' },
  { id: 8, title: 'Project Theta', color: '#54a0ff' },
  { id: 9, title: 'Project Iota', color: '#48dbfb' }
];

// Individual Node Component (Card or Orb)
const HelixNode = React.memo(({ 
  item, 
  index, 
  total, 
  scrollOffset,
  isCard,
  isActive,
  onClick 
}) => {
  // Calculate helix position
  const angle = (index / total) * 360;
  const rotationOffset = scrollOffset * 360;
  const currentAngle = angle + rotationOffset;
  const radians = (currentAngle * Math.PI) / 180;
  
  const radius = 320;
  const verticalSpacing = 100;
  const yOffset = (index / total) * verticalSpacing * total - (total * verticalSpacing) / 2;
  
  // Calculate opacity based on position
  const normalizedAngle = ((currentAngle % 360) + 360) % 360;
  const isFront = normalizedAngle < 90 || normalizedAngle > 270;
  const opacity = isFront ? 1 : 0.3 + (Math.cos(radians) + 1) * 0.35;
  
  const transform = `
    rotateY(${currentAngle}deg)
    translateZ(${radius}px)
    translateY(${yOffset}px)
  `;

  // Render as orb if not a card position
  if (!isCard) {
    return (
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '40px',
          height: '40px',
          marginLeft: '-20px',
          marginTop: '-20px',
          transform,
          transformStyle: 'preserve-3d',
          opacity: opacity * 0.6,
          cursor: 'pointer'
        }}
        onClick={() => onClick(index)}
      >
        <div style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: `radial-gradient(circle at 30% 30%, 
            ${item.color || 'rgba(0, 255, 255, 0.9)'}, 
            rgba(0, 100, 255, 0.4))`,
          boxShadow: `
            0 0 20px ${item.color || 'rgba(0, 255, 255, 0.8)'},
            inset 0 0 10px rgba(255, 255, 255, 0.3)
          `,
          animation: 'helixPulse 3s ease-in-out infinite'
        }} />
      </div>
    );
  }

  // Render as full card
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: '220px',
        height: '320px',
        marginLeft: '-110px',
        marginTop: '-160px',
        transform,
        transformStyle: 'preserve-3d',
        opacity,
        cursor: 'pointer',
        transition: 'opacity 0.3s ease'
      }}
      onClick={() => onClick(index)}
    >
      {/* RGB Edge Glow */}
      <div style={{
        position: 'absolute',
        inset: '-3px',
        borderRadius: '16px',
        background: 'linear-gradient(45deg, #ff0080, #00ff88, #0080ff, #ff0080)',
        backgroundSize: '300% 300%',
        animation: 'helixRgbShift 3s ease infinite',
        filter: 'blur(8px)',
        opacity: isActive ? 1 : 0.7,
        zIndex: -1
      }} />

      {/* Main Card */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)`,
        borderRadius: '16px',
        overflow: 'hidden',
        border: isActive ? '2px solid rgba(0, 255, 255, 0.8)' : '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 15px 50px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Content */}
        {(item.videoAsset || item.thumbnail) ? (
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden'
          }}>
            {item.videoAsset && isActive ? (
              <video
                src={item.videoAsset}
                autoPlay
                muted
                loop
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            ) : item.thumbnail ? (
              <img
                src={item.thumbnail}
                alt={item.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            ) : null}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '16px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
              color: 'white'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                {item.title}
              </h3>
            </div>
          </div>
        ) : (
          <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            color: 'white',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px',
              filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.5))'
            }}>
              {item.icon || '✨'}
            </div>
            <h3 style={{
              margin: '0 0 8px',
              fontSize: '18px',
              fontWeight: 'bold',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
            }}>
              {item.title || `Item ${index + 1}`}
            </h3>
            {item.description && (
              <p style={{
                margin: 0,
                fontSize: '14px',
                opacity: 0.8
              }}>
                {item.description}
              </p>
            )}
          </div>
        )}

        {/* Cinematic lighting overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(
            circle at 30% 20%,
            rgba(255, 255, 255, 0.15) 0%,
            transparent 50%
          )`,
          pointerEvents: 'none'
        }} />
      </div>

      {/* Ghost reflection back */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        transform: `translateZ(-40px) rotateY(180deg) scale(0.95)`,
        opacity: opacity * 0.3,
        filter: 'blur(3px)',
        background: 'linear-gradient(135deg, rgba(0,255,255,0.1), rgba(0,100,255,0.05))',
        borderRadius: '16px',
        pointerEvents: 'none'
      }} />
    </div>
  );
});

// Main Standalone Helix Component
const HelixStandalone = ({ 
  items = defaultItems,
  logoSrc = '/Ravielogo1.png',
  onItemClick,
  className = ''
}) => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  // Handle scroll
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY * 0.001;
    setScrollOffset(prev => prev + delta);
  }, []);

  // Handle item click
  const handleItemClick = useCallback((index) => {
    setActiveIndex(index);
    onItemClick?.(items[index % items.length], index);
  }, [items, onItemClick]);

  // Setup event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    
    // Also handle keyboard navigation
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setScrollOffset(prev => prev - 0.05);
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setScrollOffset(prev => prev + 0.05);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleWheel]);

  // Triple the items for continuous scroll effect
  const totalItems = items.length * 3;

  return (
    <div 
      className={`helix-standalone ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: '#000'
      }}
    >
      {/* Monitor/CRT Frame */}
      <div style={{
        position: 'absolute',
        inset: '-20px',
        background: '#1a1a1a',
        borderRadius: '24px',
        padding: '20px',
        zIndex: 300,
        pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute',
          inset: '20px',
          border: '16px solid #2a2a2a',
          borderRadius: '20px',
          boxShadow: `
            inset 0 0 30px rgba(0,0,0,0.9),
            0 0 50px rgba(0,0,0,0.7)
          `
        }} />
      </div>

      {/* Main Viewport */}
      <div 
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          perspective: '1200px',
          perspectiveOrigin: '50% 45%',
          background: 'radial-gradient(circle at center, #0a0a0f 0%, #000000 100%)'
        }}
      >
        {/* Cinematic Vignette */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.9) 100%)',
          pointerEvents: 'none',
          zIndex: 200
        }} />

        {/* Film Grain */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.12,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence baseFrequency='0.85' numOctaves='4' /%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
          pointerEvents: 'none',
          zIndex: 201,
          mixBlendMode: 'overlay'
        }} />

        {/* Scanlines */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,255,255,0.03) 2px,
            rgba(0,255,255,0.03) 4px
          )`,
          animation: 'helixScanlines 8s linear infinite',
          pointerEvents: 'none',
          zIndex: 202
        }} />

        {/* Helix Assembly */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transformStyle: 'preserve-3d',
          transform: 'translateX(-50%) translateY(-50%) rotateX(-10deg)'
        }}>
          {/* Center Logo */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) rotateY(${-scrollOffset * 360}deg)`,
            width: '150px',
            height: '150px',
            zIndex: 50
          }}>
            {logoSrc && (
              <img 
                src={logoSrc}
                alt="Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 0 30px rgba(0, 255, 255, 0.8))'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
          </div>

          {/* Render Items - Every 3rd is a card */}
          {Array.from({ length: totalItems }, (_, i) => {
            const itemIndex = i % items.length;
            const isCard = i % 3 === 0; // Every 3rd item is a card
            
            return (
              <HelixNode
                key={i}
                item={items[itemIndex]}
                index={i}
                total={totalItems}
                scrollOffset={scrollOffset}
                isCard={isCard}
                isActive={i === activeIndex}
                onClick={handleItemClick}
              />
            );
          })}
        </div>

        {/* Lighting System */}
        <div style={{ pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute',
            top: '15%',
            left: '25%',
            width: '250px',
            height: '250px',
            background: 'radial-gradient(circle, rgba(100,200,255,0.15) 0%, transparent 70%)',
            filter: 'blur(50px)'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '20%',
            right: '30%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(255,100,200,0.1) 0%, transparent 70%)',
            filter: 'blur(70px)'
          }} />
        </div>
      </div>

      {/* Inline Styles */}
      <style>{`
        @keyframes helixPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.8; }
        }
        
        @keyframes helixRgbShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes helixScanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(10px); }
        }
        
        .helix-standalone {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        
        .helix-standalone * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default HelixStandalone;