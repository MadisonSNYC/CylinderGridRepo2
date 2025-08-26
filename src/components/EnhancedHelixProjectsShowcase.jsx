import React, { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button.jsx';
import { Pause, Play, SkipForward, Square } from 'lucide-react';
import { projects } from '../data/projects.js';

// Effect components
import { ColorSchemeEffects } from './effects/ColorSchemeEffects.jsx';
import { VisualEffects } from './effects/VisualEffects.jsx';
import { CardDesignEffects } from './effects/CardDesignEffects.jsx';
import { StructureEffects } from './effects/StructureEffects.jsx';
import { NavigationEffects } from './effects/NavigationEffects.jsx';
import { TypographyEffects } from './effects/TypographyEffects.jsx';

// Advanced controls
import { AdvancedHelixPanel } from './AdvancedHelixPanel.jsx';
import { EffectsControlPanel } from './EffectsControlPanel.jsx';
import { useHelixConfig } from '../hooks/useHelixConfig.js';
import { useLockedEffects } from '../hooks/useLockedEffects.js';

const HelixNode = ({ project, index, totalProjects, isActive, onClick, effects, scrollOffset = 0, helixConfig, showAsOrb = false }) => {
  // Calculate position along the extended helix
  const repeatTurns = helixConfig?.repeatTurns || effects.repeatTurns || 2;
  const totalCards = totalProjects * Math.ceil(repeatTurns + 1);
  
  // Use modulo for display purposes
  const effectiveIndex = index % totalProjects;
  
  // Position calculation for extended helix - ensure even spacing
  const angle = (index / totalProjects) * 360; // One full rotation per set of projects
  const radius = helixConfig?.radius || 250; // Use config radius
  
  // DNA Helix arrangement - proper spacing for infinite scroll
  const verticalSpan = helixConfig?.verticalSpan || 450;
  // Calculate position within the total vertical range with extra spacing
  const spacingMultiplier = 2.5; // Increase spacing between all elements
  const normalizedPosition = index / (totalCards - 1);
  const totalHeight = verticalSpan * repeatTurns * spacingMultiplier;
  const yOffset = normalizedPosition * totalHeight - (totalHeight / 2);
  
  // Calculate the current rotation to always face forward
  const currentRotation = scrollOffset * (360 * repeatTurns / totalProjects);
  const cardFaceAngle = angle - currentRotation;
  
  // Calculate depth-based opacity like Ashfall Studio
  const normalizedAngle = ((angle - currentRotation) % 360 + 360) % 360;
  let opacity = 1;
  let scale = 1;
  
  // Front cards (facing viewer) - use config opacity
  if (normalizedAngle < 45 || normalizedAngle > 315) {
    opacity = helixConfig?.opacityFront || 1;
    scale = helixConfig?.cardScale || 1;
  }
  // Side cards - medium opacity
  else if ((normalizedAngle >= 45 && normalizedAngle < 135) || (normalizedAngle >= 225 && normalizedAngle < 315)) {
    opacity = helixConfig?.opacitySide || 0.7;
    scale = (helixConfig?.cardScale || 1) * 0.9;
  }
  // Back cards - low opacity for depth
  else {
    opacity = helixConfig?.opacityBack || 0.3;
    scale = (helixConfig?.cardScale || 1) * 0.8;
  }
  
  // Calculate depth for hierarchy effects
  let depthClass = '';
  if (effects.depthHierarchy) {
    if (normalizedAngle > 315 || normalizedAngle < 45) depthClass = 'depth-near';
    else if (normalizedAngle > 135 && normalizedAngle < 225) depthClass = 'depth-far';
    else depthClass = 'depth-medium';
  }
  
  return (
    <div
      className={`
        helix-node absolute cursor-pointer
        ${isActive ? 'active z-20' : 'z-10'}
        ${depthClass}
      `}
      style={{
        width: showAsOrb ? '15px' : `${helixConfig?.cardWidth || 80}px`,
        height: showAsOrb ? '15px' : `${helixConfig?.cardHeight || 142}px`,
        left: '50%',
        top: '50%',
        transform: `
          translate(-50%, -50%)
          rotateY(${angle - currentRotation}deg) 
          translateZ(${radius}px) 
          translateY(${yOffset - (scrollOffset * 30)}px)
          scale(${scale})
        `,
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'visible',
        WebkitBackfaceVisibility: 'visible',
        opacity: opacity,
        transition: effects.smoothRotation ? 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'all 0.3s ease'
      }}
      onClick={() => onClick(index)}
    >
      {showAsOrb ? (
        // Orb visualization for placement debugging
        <div 
          className="w-full h-full rounded-full shadow-lg"
          style={{
            background: `radial-gradient(circle at 30% 30%, 
              hsl(${(index * 360 / totalCards) % 360}, 70%, 60%), 
              hsl(${(index * 360 / totalCards) % 360}, 70%, 40%))`,
            border: '2px solid rgba(255, 255, 255, 0.3)',
            boxShadow: `
              0 0 15px hsl(${(index * 360 / totalCards) % 360}, 70%, 50%),
              inset 0 0 10px rgba(255, 255, 255, 0.2)
            `,
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'visible',
            WebkitBackfaceVisibility: 'visible',
            opacity: opacity, // Apply same opacity as cards
            zIndex: 1 // Ensure orbs are visible
          }}
        />
      ) : (
        // Rich/Simple card view based on effects
        effects.richCardContent ? (
          // Rich card with video/image content
          <div 
            className={`w-full h-full bg-gray-800 border border-gray-600 transition-all duration-300 cursor-pointer overflow-hidden group ${
              effects.cardHoverEffects ? 'hover:border-gray-400 hover:scale-105' : ''
            }`}
            style={{
              // Always face the viewer - counter-rotate by the card's angle
              transform: `rotateY(${-angle}deg)`,
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'visible',
              WebkitBackfaceVisibility: 'visible',
              borderRadius: '12px',
              boxShadow: effects.cardShadows ? '0 4px 20px rgba(0, 0, 0, 0.3)' : 'none',
              border: effects.cardBorders ? '2px solid rgba(255, 255, 255, 0.1)' : undefined,
              willChange: effects.cardHoverEffects ? 'transform' : 'auto'
            }}
          >
          {/* Video/Image Content - taking 75% of card height for 9:16 ratio */}
          <div className="relative w-full h-3/4 bg-gray-900 overflow-hidden">
            {project.videoAsset && (
              <video
                key={project.videoAsset}
                className="absolute inset-0 w-full h-full object-cover"
                src={project.videoAsset}
                muted={true}
                loop={true}
                playsInline={true}
                autoPlay={true}
              />
            )}
            
            {/* Only show fallback if no video asset */}
            {!project.videoAsset && (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-gray-400 text-sm">
                      {project.title}
                    </div>
                  </div>
                </div>
                {project.thumbnail && (
                  <img
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    src={project.thumbnail}
                    alt={project.title}
                    loading="lazy"
                  />
                )}
              </>
            )}
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
          </div>

          {/* Card Content - remaining 25% height */}
          <div className="p-2 h-1/4 flex flex-col justify-between">
            <div>
              <h3 className="text-white text-xs font-semibold mb-0.5 line-clamp-1 leading-tight">
                {project.title}
              </h3>
              <p className="text-gray-400 text-xs line-clamp-1 leading-tight mb-1">
                {project.description}
              </p>
            </div>
            
            {/* Technology badges - more compact */}
            <div className="flex flex-wrap gap-1">
              {project.technologies.slice(0, 2).map(tech => (
                <span 
                  key={tech} 
                  className="bg-blue-600/20 text-blue-300 text-xs px-1.5 py-0.5 rounded-full border border-blue-500/30"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 2 && (
                <span className="text-gray-500 text-xs self-center">
                  +{project.technologies.length - 2}
                </span>
              )}
            </div>
          </div>
        </div>
        ) : (
          // Simple card view
          <div 
            className={`w-full h-full bg-gray-700 border border-gray-500 transition-colors flex items-center justify-center ${
              effects.cardHoverEffects ? 'hover:border-gray-400 hover:bg-gray-600' : ''
            }`}
            style={{
              // Always face the viewer - counter-rotate by the card's angle
              transform: `rotateY(${-angle}deg)`,
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'visible',
              WebkitBackfaceVisibility: 'visible',
              transition: effects.cardHoverEffects ? 'all 0.3s ease' : 'none',
              borderRadius: '12px',
              boxShadow: effects.cardShadows ? '0 4px 20px rgba(0, 0, 0, 0.2)' : 'none',
              border: effects.cardBorders ? '2px solid rgba(255, 255, 255, 0.1)' : undefined,
              visibility: 'visible'
            }}
          >
            <div className="text-center">
              <div className="text-white text-sm font-medium">
                {project.title}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

const ProjectsGrid = ({ projects, className = '' }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8 ${className}`}>
    {projects.map(project => (
      <article key={project.id} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
        <img 
          src={project.thumbnail} 
          alt={project.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-white text-lg font-semibold mb-2">
            {project.title}
          </h3>
          <p className="text-gray-300 text-sm mb-3">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map(tech => (
              <span key={tech} className="tech-tag text-xs bg-blue-600 text-white px-2 py-1 rounded">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </article>
    ))}
  </div>
);

const MotionControls = ({ isPaused, onPause, onResume, onEmergencyStop, onSkipIntro, effects }) => {
  if (effects.minimalistControls) return null;
  
  return (
    <div className="motion-controls fixed top-4 right-4 z-50 flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onSkipIntro}
        className="bg-gray-900/80 border-gray-700 text-white hover:bg-gray-800"
      >
        <SkipForward className="w-4 h-4 mr-1" />
        Skip Intro
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={isPaused ? onResume : onPause}
        className="bg-gray-900/80 border-gray-700 text-white hover:bg-gray-800"
      >
        {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onEmergencyStop}
        className="bg-red-900/80 border-red-700 text-white hover:bg-red-800"
      >
        <Square className="w-4 h-4" />
      </Button>
    </div>
  );
};

export const EnhancedHelixProjectsShowcase = ({ 
  autoRotate = true,
  scrollDriven = false,
  effects = {},
  onEffectToggle,
  onReset,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  setPlacementStrength,
  setRepeatTurns
}) => {
  const helixRef = useRef(null);
  const [currentProject, setCurrentProject] = useState(0);
  const [enhanced, setEnhanced] = useState(true); // Force 3D mode for testing
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0); // For endless scroll
  
  // Advanced helix configuration
  const { 
    config: helixConfig, 
    updateConfig: updateHelixConfig, 
    resetConfig: resetHelixConfig, 
    undoConfig: undoHelixConfig,
    redoConfig: redoHelixConfig,
    canUndo: canUndoHelix,
    canRedo: canRedoHelix,
    updateRuntimeInfo 
  } = useHelixConfig();
  
  // Locked effects management
  const { lockedEffects, toggleLock } = useLockedEffects();

  // Protected effect toggle function that respects locks
  const handleEffectToggle = (effectKey, value) => {
    if (!lockedEffects[effectKey]) {
      onEffectToggle?.(effectKey, value);
    }
  };

  // Update runtime info for the panel
  useEffect(() => {
    updateRuntimeInfo({
      totalProjects: projects.length,
      scrollOffset: scrollOffset,
      visibleCards: Math.ceil((helixConfig.repeatTurns || 2) + 1) * projects.length
    });
  }, [scrollOffset, projects.length, helixConfig.repeatTurns, updateRuntimeInfo]);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Feature detection and enhancement
  useEffect(() => {
    const supports3D = CSS.supports('transform-style', 'preserve-3d');
    if (supports3D && !prefersReducedMotion) {
      setEnhanced(true);
    }
  }, [prefersReducedMotion]);

  // Mouse wheel / trackpad scroll support
  useEffect(() => {
    if (!enhanced) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 1 : -1;
      const sensitivity = helixConfig.scrollSensitivity || 1;
      setScrollOffset(prev => prev + delta * 0.2 * sensitivity); // Apply scroll sensitivity
    };

    const helixElement = helixRef.current?.parentElement;
    if (helixElement) {
      helixElement.addEventListener('wheel', handleWheel, { passive: false });
      return () => helixElement.removeEventListener('wheel', handleWheel);
    }
  }, [enhanced, helixConfig.scrollSensitivity]);

  // Auto-rotation logic - DISABLED by default
  useEffect(() => {
    // Disabled auto-rotation
    return;
    
    if (!autoRotate || isPaused || prefersReducedMotion || !enhanced) return;
    
    const rotationSpeed = effects.smoothRotation ? 6000 : 4000;
    const interval = setInterval(() => {
      setScrollOffset(prev => prev + 0.05); // Much slower auto-rotation
    }, 100);
    
    return () => clearInterval(interval);
  }, [autoRotate, isPaused, prefersReducedMotion, enhanced, effects.smoothRotation]);

  // Keyboard navigation
  useEffect(() => {
    if (!enhanced) return;

    const handleKeyDown = (e) => {
      const sensitivity = helixConfig.scrollSensitivity || 1;
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          setScrollOffset(prev => prev + 0.5 * sensitivity); // Apply scroll sensitivity
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          setScrollOffset(prev => prev - 0.5 * sensitivity); // Apply scroll sensitivity
          break;
        case 'Home':
          e.preventDefault();
          setScrollOffset(0);
          break;
        case 'Escape':
          e.preventDefault();
          setEnhanced(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enhanced, helixConfig.scrollSensitivity]);

  const handleProjectClick = (index) => {
    const targetOffset = index;
    setScrollOffset(targetOffset);
  };

  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);
  const handleEmergencyStop = () => {
    setEnhanced(false);
    setIsPaused(true);
  };
  const handleSkipIntro = () => setEnhanced(false);

  // Fallback to 2D grid for reduced motion or unsupported browsers
  if (prefersReducedMotion || !enhanced) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto py-8">
          <h1 className="text-4xl font-bold text-white text-center mb-8">
            Featured Projects
          </h1>
          <ProjectsGrid projects={projects} />
        </div>
      </div>
    );
  }

  return (
    <ColorSchemeEffects effects={effects}>
      <VisualEffects effects={effects}>
        <CardDesignEffects effects={effects}>
          <StructureEffects effects={effects}>
            <NavigationEffects 
              effects={effects} 
              currentProject={currentProject}
              totalProjects={projects.length}
              onProjectSelect={handleProjectClick}
            >
              <TypographyEffects effects={effects}>
                <section className="projects-showcase relative" data-enhanced={enhanced}>
                  {/* Skip link for accessibility */}
                  <a 
                    href="#projects-list" 
                    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded"
                  >
                    Skip 3D animation and view projects list
                  </a>

                  {/* Motion controls */}
                  <MotionControls 
                    isPaused={isPaused}
                    onPause={handlePause}
                    onResume={handleResume}
                    onEmergencyStop={handleEmergencyStop}
                    onSkipIntro={handleSkipIntro}
                    effects={effects}
                  />

                  {/* 3D Helix Scene */}
                  <div className="helix-scene relative h-screen overflow-hidden flex items-center justify-center">
                    <div 
                      className="helix-assembly"
                      ref={helixRef}
                      style={{
                        transformStyle: 'preserve-3d',
                        perspective: `${helixConfig.perspective}px`,
                        perspectiveOrigin: `${helixConfig.perspectiveOriginX}% ${helixConfig.perspectiveOriginY}%`,
                        // Static container - rotation happens on individual cards
                        transform: `
                          rotateX(${helixConfig.rotateX}deg)
                          rotateY(${helixConfig.rotateY}deg)
                          rotateZ(${helixConfig.rotateZ}deg)
                          translateZ(-1200px)
                        `,
                        // Pass scene rotation as CSS variable for billboard mode
                        '--sceneDeg': `${scrollOffset * (360 * (helixConfig.repeatTurns || 2) / projects.length)}deg`,
                        transition: 'none',
                        width: `${helixConfig.containerWidth}px`,
                        height: `${helixConfig.containerHeight}px`,
                        position: 'relative'
                      }}
                    >
                      {/* Render multiple sets of cards for infinite scroll */}
                      {/* Use repeatTurns to control number of card sets */}
                      {Array.from({ length: Math.ceil(helixConfig.repeatTurns || 1.5) + 1 }, (_, setIndex) => 
                        projects.map((project, index) => {
                          const globalIndex = setIndex * projects.length + index;
                          const showEveryNth = helixConfig.showEveryNth || 1;
                          
                          
                          // Always render all cards, but decide if they should be orbs or full cards
                          // Use globalIndex for continuous pattern across all sets
                          const isNthCard = globalIndex % showEveryNth === 0;
                          const shouldShowAsOrb = showEveryNth > 1 && !isNthCard;
                          
                          return (
                            <HelixNode
                              key={`${setIndex}-${project.id}`}
                              project={project}
                              index={globalIndex}
                              totalProjects={projects.length}
                              isActive={Math.abs((globalIndex % projects.length) - (Math.floor(scrollOffset) % projects.length)) < 0.5}
                              onClick={() => handleProjectClick(globalIndex)}
                              effects={effects}
                              scrollOffset={scrollOffset}
                              helixConfig={helixConfig}
                              showAsOrb={shouldShowAsOrb} // Show as orb if not an Nth card
                            />
                          );
                        })
                      )}
                      
                      {/* Center Logo (when enabled, replaces wireframe) */}
                      {effects.centerLogo && (
                        <img
                          src="/Ravielogo1.png"
                          alt="Ravie logo"
                          className={`center-logo no-select ${effects.centerLogoMode || 'billboard'}`}
                          aria-hidden="true"
                        />
                      )}
                    </div>

                    {/* Navigation instructions */}
                    <div className="navigation-instructions absolute top-8 left-8 text-white text-sm">
                      <div className="bg-gray-900/80 rounded-lg p-4 backdrop-blur-sm">
                        <h3 className="font-semibold mb-2">Navigation</h3>
                        <ul className="space-y-1 text-xs">
                          <li>← → Arrow keys to navigate</li>
                          <li>Mouse wheel / trackpad to scroll</li>
                          <li>Click projects to select</li>
                          <li>Esc to exit 3D view</li>
                          <li>Infinite scroll - cards repeat endlessly</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Accessible fallback (hidden but present for screen readers) */}
                  <div id="projects-list" className="sr-only">
                    <h2>Projects List</h2>
                    <ProjectsGrid projects={projects} />
                  </div>
                </section>
                
                {/* Effects Control Panel */}
                <EffectsControlPanel
                  effects={effects}
                  onEffectToggle={handleEffectToggle}
                  onReset={onReset}
                  onUndo={onUndo}
                  onRedo={onRedo}
                  canUndo={canUndo}
                  canRedo={canRedo}
                  setPlacementStrength={setPlacementStrength}
                  setRepeatTurns={setRepeatTurns}
                  lockedEffects={lockedEffects}
                  onToggleLock={toggleLock}
                />

                {/* Advanced Helix Control Panel */}
                <AdvancedHelixPanel
                  helixConfig={helixConfig}
                  onConfigChange={updateHelixConfig}
                  onReset={resetHelixConfig}
                  onUndo={undoHelixConfig}
                  onRedo={redoHelixConfig}
                  canUndo={canUndoHelix}
                  canRedo={canRedoHelix}
                />
              </TypographyEffects>
            </NavigationEffects>
          </StructureEffects>
        </CardDesignEffects>
      </VisualEffects>
      
      {/* Rich Card Styles */}
    <style>{`
      .line-clamp-1 {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .helix-node .group:hover video {
        filter: brightness(1.1) contrast(1.05);
      }
      
      .helix-node .group:hover {
        box-shadow: 
          0 8px 32px rgba(0, 0, 0, 0.4),
          0 0 0 1px rgba(255, 255, 255, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
      }
      
      .helix-node video {
        transition: filter 0.3s ease;
        transform: translateZ(0); /* Force hardware acceleration */
      }
      
      .helix-node .group {
        transform: translateZ(0); /* Force hardware acceleration */
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
      }
      
      .tech-badge {
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
      }
      
      /* Performance optimizations */
      .helix-node {
        contain: layout style paint;
        will-change: transform;
      }
      
      .helix-node video,
      .helix-node img {
        image-rendering: optimizeSpeed;
        image-rendering: -moz-crisp-edges;
        image-rendering: -webkit-optimize-contrast;
        image-rendering: optimize-contrast;
      }
      
      @media (prefers-reduced-motion: reduce) {
        .helix-node .group {
          transition: none;
        }
        .helix-node .group:hover {
          transform: none;
          scale: none;
        }
        .helix-node video {
          transition: none;
        }
      }
    `}</style>
    </ColorSchemeEffects>
  );
};

