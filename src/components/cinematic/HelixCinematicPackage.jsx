import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { projects as defaultProjects } from '../../data/projects.js';
import { VideoLazy } from '../video/VideoLazy.jsx';

// Ghost reflection card component
const GhostCard = React.memo(({ transform, opacity, color, blur = 2 }) => (
  <div 
    className="helix-ghost-card"
    style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      transform: `${transform} translateZ(-30px) rotateY(180deg) scale(0.98)`,
      opacity: opacity * 0.4,
      filter: `blur(${blur}px)`,
      background: `linear-gradient(135deg, ${color}22, ${color}11)`,
      borderRadius: '12px',
      pointerEvents: 'none',
      backfaceVisibility: 'hidden',
      transformStyle: 'preserve-3d'
    }}
  />
));

// Individual helix node with cinematic effects
const CinematicNode = React.memo(({ 
  project, 
  index, 
  total, 
  scrollOffset = 0,
  isNthCard,
  effects,
  onClick,
  isActive 
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
  const isFront = normalizedAngle < 60 || normalizedAngle > 300;
  const opacity = isFront ? 1 : 0.3 + (Math.cos(radians) + 1) * 0.35;
  
  const transform = `
    rotateY(${currentAngle}deg)
    translateZ(${radius}px)
    translateY(${yOffset}px)
  `;

  // Render orb for non-nth cards
  if (!isNthCard) {
    return (
      <div
        className="helix-orb"
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
          opacity: opacity * 0.5
        }}
        onClick={() => onClick(index)}
      >
        <div 
          className="orb-core"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: `radial-gradient(circle at 30% 30%, 
              rgba(0, 255, 255, 0.9), 
              rgba(0, 100, 255, 0.4))`,
            boxShadow: `
              0 0 20px rgba(0, 255, 255, 0.8),
              inset 0 0 10px rgba(255, 255, 255, 0.3)
            `,
            animation: 'pulse 3s ease-in-out infinite'
          }}
        />
      </div>
    );
  }

  // Full card render
  return (
    <div
      className={`helix-card ${isActive ? 'active' : ''}`}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: '200px',
        height: '300px',
        marginLeft: '-100px',
        marginTop: '-150px',
        transform,
        transformStyle: 'preserve-3d',
        opacity,
        cursor: 'pointer',
        transition: 'opacity 0.3s ease'
      }}
      onClick={() => onClick(index)}
      data-index={index}
    >
      {/* RGB Edge Glow */}
      {effects.rgbEdge && (
        <div 
          className="rgb-edge"
          style={{
            position: 'absolute',
            inset: '-2px',
            borderRadius: '12px',
            background: 'linear-gradient(45deg, #ff0080, #00ff88, #0080ff, #ff0080)',
            backgroundSize: '300% 300%',
            animation: 'rgbShift 3s ease infinite',
            filter: 'blur(8px)',
            opacity: 0.8,
            zIndex: -1
          }}
        />
      )}

      {/* Main Card Content */}
      <div 
        className="card-content"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
        }}
      >
        {project.videoAsset ? (
          <VideoLazy
            src={project.videoAsset}
            thumbnail={project.thumbnail}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            autoPlay
          />
        ) : (
          <div className="flex items-center justify-center h-full p-4">
            <h3 className="text-white text-center">{project.title}</h3>
          </div>
        )}

        {/* Lighting Effects */}
        {effects.lighting && (
          <div 
            className="lighting-overlay"
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(
                circle at 30% 20%,
                rgba(255, 255, 255, 0.1) 0%,
                transparent 50%
              )`,
              pointerEvents: 'none'
            }}
          />
        )}
      </div>

      {/* Ghost Back */}
      {effects.ghostBacks && (
        <GhostCard 
          transform={transform}
          opacity={opacity}
          color="#00ffff"
          blur={3}
        />
      )}
    </div>
  );
});

// Main Cinematic Helix Component
export const HelixCinematicPackage = ({
  projects = defaultProjects,
  effects = {
    cinematic: true,
    monitor: true,
    logo: true,
    lighting: true,
    ghostBacks: true,
    everyNth: 3,
    rgbEdge: true
  },
  className = '',
  onProjectSelect
}) => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  // Handle scroll
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY * 0.001;
    setScrollOffset(prev => prev + delta);
  }, []);

  // Handle project selection
  const handleProjectClick = useCallback((index) => {
    setActiveIndex(index);
    onProjectSelect?.(projects[index % projects.length]);
  }, [projects, onProjectSelect]);

  // Setup scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  // Render multiple sets for continuous scroll
  const renderSets = 3;
  const totalCards = projects.length * renderSets;

  return (
    <div className={`helix-cinematic-package ${className}`}>
      {/* Monitor Effect Wrapper */}
      {effects.monitor && (
        <div className="monitor-frame">
          <div className="monitor-bezel" />
          <div className="monitor-screen">
            <div className="scanlines" />
            <div className="screen-flicker" />
          </div>
        </div>
      )}

      {/* Main Viewport */}
      <div 
        ref={containerRef}
        className="helix-viewport"
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          perspective: '1200px',
          perspectiveOrigin: '50% 50%',
          background: effects.cinematic ? 
            'radial-gradient(circle at center, #0a0a0f 0%, #000000 100%)' : 
            '#000'
        }}
      >
        {/* Cinematic Effects */}
        {effects.cinematic && (
          <>
            <div className="cinematic-vignette" 
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.8) 100%)',
                pointerEvents: 'none',
                zIndex: 100
              }}
            />
            <div className="film-grain"
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.15,
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
                pointerEvents: 'none',
                zIndex: 101,
                mixBlendMode: 'overlay'
              }}
            />
          </>
        )}

        {/* Helix Container */}
        <div 
          className="helix-assembly"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transformStyle: 'preserve-3d',
            transform: 'translateX(-50%) translateY(-50%) rotateX(-10deg)'
          }}
        >
          {/* Center Logo */}
          {effects.logo && (
            <div 
              className="center-logo"
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) rotateY(${-scrollOffset * 360}deg)`,
                width: '150px',
                height: '150px',
                zIndex: 50
              }}
            >
              <img 
                src="/Ravielogo1.png" 
                alt="Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 0 30px rgba(0, 255, 255, 0.8))'
                }}
              />
            </div>
          )}

          {/* Render Cards */}
          {Array.from({ length: totalCards }, (_, i) => {
            const projectIndex = i % projects.length;
            const isNthCard = effects.everyNth ? i % effects.everyNth === 0 : true;
            
            return (
              <CinematicNode
                key={i}
                project={projects[projectIndex]}
                index={i}
                total={totalCards}
                scrollOffset={scrollOffset}
                isNthCard={isNthCard}
                effects={effects}
                onClick={handleProjectClick}
                isActive={i === activeIndex}
              />
            );
          })}
        </div>

        {/* Advanced Lighting */}
        {effects.lighting && (
          <div className="lighting-system">
            <div className="key-light" 
              style={{
                position: 'absolute',
                top: '20%',
                left: '30%',
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
                filter: 'blur(40px)',
                pointerEvents: 'none'
              }}
            />
            <div className="fill-light"
              style={{
                position: 'absolute',
                bottom: '20%',
                right: '30%',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(100,200,255,0.1) 0%, transparent 70%)',
                filter: 'blur(60px)',
                pointerEvents: 'none'
              }}
            />
          </div>
        )}
      </div>

      {/* Styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes rgbShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .monitor-frame {
          position: fixed;
          inset: -20px;
          background: #222;
          border-radius: 20px;
          padding: 20px;
          z-index: 200;
          pointer-events: none;
        }

        .monitor-bezel {
          position: absolute;
          inset: 0;
          border: 20px solid #333;
          border-radius: 20px;
          box-shadow: 
            inset 0 0 20px rgba(0,0,0,0.8),
            0 0 40px rgba(0,0,0,0.5);
        }

        .scanlines::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,255,255,0.03) 2px,
            rgba(0,255,255,0.03) 4px
          );
          animation: scanlines 8s linear infinite;
          pointer-events: none;
        }

        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(10px); }
        }
      `}</style>
    </div>
  );
};

export default HelixCinematicPackage;