import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Button } from './ui/button.jsx';
import { Pause, Play, SkipForward, Square } from 'lucide-react';
import { projects } from '../data/projects.js';
import { helixPositionCache } from '../utils/helixPositionCache.js';
import { performanceMonitor } from '../utils/performanceMonitor.js';
import { useHelixScroll, useHelixConfig } from '../contexts/HelixContext.jsx';

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
import { useHelixConfig as useOldHelixConfig } from '../hooks/useHelixConfig.js';
import { useLockedEffects } from '../hooks/useLockedEffects.js';

const SpringConnection = ({ start, end, opacity = 1, color = "#00ffff", intensity = 1 }) => {
  // Check if positions are properly populated
  if (!start || !end || 
      start.screenX === undefined || start.screenY === undefined ||
      end.screenX === undefined || end.screenY === undefined) {
    return null;
  }
  
  // Calculate control points for electric arc path
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dz = end.z - start.z;
  
  // Create electric arc with multiple control points
  const midX = (start.screenX + end.screenX) / 2;
  const midY = (start.screenY + end.screenY) / 2;
  
  // Electric arc with random jitter for lightning effect
  const jitter = Math.random() * 30 - 15;
  const waveAmplitude = 60 + (intensity * 40);
  const control1X = midX + waveAmplitude * Math.sin((start.angle || 0) * 0.05) + jitter;
  const control1Y = midY - Math.abs(dy || 0) * 0.5 + jitter;
  const control2X = midX - waveAmplitude * Math.sin((end.angle || 0) * 0.05) - jitter;
  const control2Y = midY + Math.abs(dy || 0) * 0.5 - jitter;
  
  return (
    <svg
      className="spring-connection"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5
      }}
    >
      <defs>
        <linearGradient id={`electric-gradient-${start.index}-${end.index}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ffff" stopOpacity="1" />
          <stop offset="20%" stopColor="#00ffff" stopOpacity="1" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="80%" stopColor="#00ffff" stopOpacity="1" />
          <stop offset="100%" stopColor="#00ffff" stopOpacity="1" />
        </linearGradient>
        <filter id={`electric-glow-${start.index}-${end.index}`}>
          <feGaussianBlur stdDeviation={12 + intensity * 8} result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {/* Main electric neon arc */}
      <path
        d={`M ${start.screenX} ${start.screenY} 
            C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${end.screenX} ${end.screenY}`}
        stroke={`url(#electric-gradient-${start.index}-${end.index})`}
        strokeWidth={4 + intensity * 6}
        fill="none"
        opacity="1"
        filter={`url(#electric-glow-${start.index}-${end.index})`}
        className="electric-path"
        strokeLinecap="round"
      />
      {/* Core bright white line */}
      <path
        d={`M ${start.screenX} ${start.screenY} 
            C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${end.screenX} ${end.screenY}`}
        stroke="#ffffff"
        strokeWidth={1 + intensity * 2}
        fill="none"
        opacity="0.9"
        className="electric-core"
        strokeLinecap="round"
      />
      {/* Electric sparks */}
      <path
        d={`M ${start.screenX} ${start.screenY} 
            C ${control1X + jitter} ${control1Y - jitter}, ${control2X - jitter} ${control2Y + jitter}, ${end.screenX} ${end.screenY}`}
        stroke="#00ffff"
        strokeWidth="0.5"
        fill="none"
        opacity={0.6 + intensity * 0.3}
        strokeDasharray="2 8"
        className="spring-path-secondary"
      />
    </svg>
  );
};

const HelixNode = React.memo(({ project, index, totalProjects, isActive, onClick, effects, scrollOffset = 0, helixConfig, showAsOrb = false, orbPosition = null, scrollSpeed = 0 }) => {
  // Measure render time
  useEffect(() => {
    const startTime = window.performance.now();
    
    // Use RAF to measure after paint
    requestAnimationFrame(() => {
      const endTime = window.performance.now();
      const renderTime = endTime - startTime;
      if (renderTime > 0) {
        performanceMonitor.metrics.renderTime.push(renderTime);
        if (performanceMonitor.metrics.renderTime.length > 50) {
          performanceMonitor.metrics.renderTime.shift();
        }
      }
    });
  });
  
  // Calculate position along the extended helix
  const repeatTurns = helixConfig?.repeatTurns || effects.repeatTurns || 2;
  const totalCards = totalProjects * Math.ceil(repeatTurns + 1);
  const videoRef = useRef(null);
  
  // Use modulo for display purposes
  const effectiveIndex = index % totalProjects;
  
  // Get cached position or compute if not cached
  const position = useMemo(() => {
    const config = {
      radius: helixConfig?.radius || 325,
      verticalSpan: helixConfig?.verticalSpan || 585,
      repeatTurns: repeatTurns,
      cardScale: helixConfig?.cardScale || 1,
      opacityFront: helixConfig?.opacityFront || 1,
      opacitySide: helixConfig?.opacitySide || 0.7,
      opacityBack: helixConfig?.opacityBack || 0.3
    };
    return helixPositionCache.getPosition(index, totalProjects, scrollOffset, config);
  }, [index, totalProjects, scrollOffset, helixConfig, repeatTurns]);
  
  // Extract values from cached position
  const { angle, currentRotation, normalizedAngle, radius, yOffset, scale, opacity: cachedOpacity, depthFactor, scrollY, cardRotation } = position;
  
  // Use cached opacity
  const opacity = cachedOpacity;
  
  // Calculate perspective-corrected dimensions for accurate aspect ratios
  const isFrontFacing = normalizedAngle < 45 || normalizedAngle > 315;
  const baseWidth = 180;
  const baseHeight = 320;
  
  // Get container perspective settings
  const containerPerspective = helixConfig.perspective || 3000;
  const perspectiveOriginX = (helixConfig.perspectiveOriginX || 71) / 100;
  const perspectiveOriginY = (helixConfig.perspectiveOriginY || 32) / 100;
  
  // Calculate card's position relative to perspective origin
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const perspectiveOriginXPx = viewportWidth * perspectiveOriginX;
  const perspectiveOriginYPx = viewportHeight * perspectiveOriginY;
  
  // Card position (center of viewport + helix offset)
  const cardX = viewportWidth / 2;
  const cardY = viewportHeight / 2 + scrollY;
  
  // Distance from perspective origin
  const deltaX = cardX - perspectiveOriginXPx;
  const deltaY = cardY - perspectiveOriginYPx;
  
  // Calculate Z-distance considering helix radius and transforms
  const zDistance = containerPerspective + radius;
  
  // Calculate perspective foreshortening factors
  const perspectiveScaleX = containerPerspective / zDistance;
  const perspectiveScaleY = containerPerspective / zDistance;
  
  // NUCLEAR OPTION: Remove ALL JavaScript dimension calculations
  // Let CSS handle ALL sizing - no JS overrides whatsoever
  
  // Calculate depth for hierarchy effects
  let depthClass = '';
  if (effects.depthHierarchy) {
    if (normalizedAngle > 315 || normalizedAngle < 45) depthClass = 'depth-near';
    else if (normalizedAngle > 135 && normalizedAngle < 225) depthClass = 'depth-far';
    else depthClass = 'depth-medium';
  }
  
  // Store position for spring connections (for ALL nodes)
  if (orbPosition) {
    const radians = (cardRotation * Math.PI) / 180;
    orbPosition.x = Math.sin(radians) * radius;
    orbPosition.z = Math.cos(radians) * radius;
    orbPosition.y = scrollY; // Use cached scrollY
    orbPosition.angle = cardRotation;
    orbPosition.index = index;
    // Calculate screen position for SVG rendering - using actual transform calculations
    const screenRadius = radius * (helixConfig?.cardScale || 1);
    orbPosition.screenX = window.innerWidth / 2 + Math.sin(radians) * screenRadius;
    orbPosition.screenY = window.innerHeight / 2 + scrollY * (helixConfig?.cardScale || 1); // Use cached scrollY
  }

  // Control video playback based on visibility
  useEffect(() => {
    if (videoRef.current) {
      const shouldPlay = normalizedAngle < 90 || normalizedAngle > 270;
      if (shouldPlay && videoRef.current.paused) {
        videoRef.current.play().catch(() => {}); // Ignore play errors
      } else if (!shouldPlay && !videoRef.current.paused) {
        videoRef.current.pause();
      }
    }
  }, [normalizedAngle]);

  return (
    <div
      className={`
        helix-node absolute cursor-pointer
        ${isActive ? 'active z-20' : 'z-10'}
        ${depthClass}
      `}
      data-orb-index={showAsOrb ? index : undefined}
      style={{
        // NUCLEAR OPTION: CSS handles ALL dimensions - no JS overrides
        // Even orbs will be handled by CSS rules
        left: '50%',
        top: '50%',
        transform: `
          translate(-50%, -50%)
          translateY(${scrollY}px)
          rotateY(${cardRotation}deg)
          translateZ(${radius}px)
        `,
        transformStyle: 'preserve-3d',
        transformOrigin: 'center center',
        backfaceVisibility: 'visible',
        WebkitBackfaceVisibility: 'visible',
        willChange: 'transform, opacity',
        opacity: opacity * (0.7 + (scale - 0.8) * 0.75), // Use scale for opacity instead of size
        transition: 'transform 0.08s ease-out, opacity 0.2s ease'
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
              width: '100%',
              height: '100%'
            }}
          >
          {/* Video/Image Content - maintaining aspect ratio */}
          <div 
            className="relative w-full h-full bg-gray-900 overflow-hidden"
          >
            {project.videoAsset && (
              <video
                ref={videoRef}
                key={project.videoAsset}
                className="absolute inset-0 w-full h-full object-cover"
                src={project.videoAsset}
                muted={true}
                loop={true}
                playsInline={true}
                autoPlay={false} // Controlled by useEffect
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

          {/* Card Content - overlay text */}
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/70 z-10">
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
              width: '100%',
              height: '100%'
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
}, (prevProps, nextProps) => {
  // Only re-render if critical props change
  return prevProps.scrollOffset === nextProps.scrollOffset &&
         prevProps.index === nextProps.index &&
         prevProps.isActive === nextProps.isActive &&
         prevProps.showAsOrb === nextProps.showAsOrb;
});

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
  
  // Use new state management for scroll
  const { scroll, updateScroll, batchScrollUpdate } = useHelixScroll();
  const { config: contextConfig } = useHelixConfig();
  const scrollOffset = scroll?.offset || 0;
  const scrollSpeed = useRef(0); // Track current scroll speed without re-renders
  const scrollAnimationId = useRef(null); // For RAF throttling
  
  // Simplified scroll speed tracking without re-renders
  // Speed is now calculated inline when needed
  
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
  } = useOldHelixConfig();
  
  // Locked effects management
  const { lockedEffects, toggleLock } = useLockedEffects();

  // Protected effect toggle function that respects locks
  const handleEffectToggle = (effectKey, value) => {
    if (!lockedEffects[effectKey]) {
      onEffectToggle?.(effectKey, value);
    }
  };

  // Update runtime info for the panel - throttled to reduce re-renders
  useEffect(() => {
    const roundedOffset = Math.round(scrollOffset * 10) / 10; // Round to 1 decimal
    updateRuntimeInfo({
      totalProjects: projects.length,
      scrollOffset: roundedOffset,
      visibleCards: Math.ceil((helixConfig.repeatTurns || 2) + 1) * projects.length
    });
  }, [Math.round(scrollOffset), projects.length, helixConfig.repeatTurns, updateRuntimeInfo]);

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

  // Optimized scroll handler with RAF throttling and momentum
  useEffect(() => {
    if (!enhanced) return;

    let pendingDelta = 0;
    let isUpdating = false;
    let velocity = 0;
    let lastTime = performance.now();
    const friction = 0.95; // Momentum decay
    const minVelocity = 0.001; // Threshold to stop momentum

    const updateScrollAnimation = () => {
      const now = performance.now();
      const deltaTime = Math.min((now - lastTime) / 1000, 0.1); // Cap deltaTime to avoid jumps
      lastTime = now;

      // Measure FPS on every animation frame
      performanceMonitor.measureFPS();

      // Apply pending delta with momentum
      if (pendingDelta !== 0 || Math.abs(velocity) > minVelocity) {
        // Update velocity
        velocity = velocity * friction + pendingDelta;
        
        // Apply velocity to scroll using new state management
        updateScroll(velocity, now);
        
        pendingDelta = 0;
        
        // Continue animation if velocity is significant
        if (Math.abs(velocity) > minVelocity) {
          scrollAnimationId.current = requestAnimationFrame(updateScrollAnimation);
        } else {
          velocity = 0;
          isUpdating = false;
        }
      } else {
        isUpdating = false;
      }
    };

    const handleWheel = (e) => {
      e.preventDefault();
      // Only use vertical delta, ignore horizontal
      const deltaY = e.deltaY;
      const deltaX = 0; // Explicitly ignore horizontal scroll
      
      // Normalize the delta for consistent behavior across devices
      const normalizedDelta = deltaY * 0.0026; // Increased by 30% for more transformation
      const sensitivity = helixConfig.scrollSensitivity || 1;
      
      pendingDelta = normalizedDelta * sensitivity * 0.15; // Apply smoothing factor
      
      if (!isUpdating) {
        isUpdating = true;
        lastTime = performance.now();
        scrollAnimationId.current = requestAnimationFrame(updateScrollAnimation);
      }
    };

    const helixElement = helixRef.current?.parentElement;
    if (helixElement) {
      helixElement.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        helixElement.removeEventListener('wheel', handleWheel);
        if (scrollAnimationId.current) {
          cancelAnimationFrame(scrollAnimationId.current);
        }
      };
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
          updateScroll(0.65 * sensitivity, performance.now()); // Increased by 30% (0.5 * 1.3)
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          updateScroll(-0.65 * sensitivity, performance.now()); // Increased by 30% (0.5 * 1.3)
          break;
        case 'Home':
          e.preventDefault();
          // Reset scroll to 0 - need to update this
          updateScroll(-scrollOffset, performance.now());
          break;
        case 'Escape':
          e.preventDefault();
          setEnhanced(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enhanced, helixConfig.scrollSensitivity, updateScroll, scrollOffset]);

  const handleProjectClick = (index) => {
    const targetOffset = index;
    updateScroll(targetOffset - scrollOffset, performance.now());
  };

  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);
  const handleEmergencyStop = () => {
    setEnhanced(false);
    setIsPaused(true);
  };
  const handleSkipIntro = () => setEnhanced(false);

  // Continuous FPS measurement loop
  useEffect(() => {
    if (!enhanced) return;

    let animationFrameId;
    const measureContinuousFPS = () => {
      performanceMonitor.measureFPS();
      animationFrameId = requestAnimationFrame(measureContinuousFPS);
    };
    
    // Start the continuous measurement loop
    animationFrameId = requestAnimationFrame(measureContinuousFPS);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [enhanced]);

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
                  <div 
                    className={`helix-scene fx-scroll-movement relative h-screen overflow-hidden flex items-center justify-center ${
                      effects.cinematicColors ? 'fx-cinematic' : ''
                    } ${
                      effects.screenGlow ? 'fx-screen-glow' : ''
                    } ${
                      effects.scanLines ? 'fx-scan-lines' : ''
                    } ${
                      effects.chromaticAberration ? 'fx-chromatic' : ''
                    } ${
                      effects.filmGrain ? 'fx-film-grain' : ''
                    } ${
                      effects.monitorStyle ? 'fx-monitor-style' : ''
                    } ${
                      effects.colorGrade ? 'fx-color-grade' : ''
                    } ${
                      scrollSpeed.current > 15 ? 'scroll-ultra-fast' : 
                      scrollSpeed.current > 8 ? 'scroll-fast' : ''
                    }`}
                    style={{
                      '--scroll-offset-y': `${scrollOffset * 2.6}px` // Increased by 30% (2 * 1.3)
                    }}
                  >
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
                        // Pass scene rotation as CSS variable for billboard mode - include all rotations
                        '--sceneDeg': `${(scrollOffset * (468 * (helixConfig.repeatTurns || 1.5) / projects.length)) + (helixConfig.rotateY || 0)}deg`,
                        '--logo-z': '0px',
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
                          const showEveryNth = helixConfig.showEveryNth || 1; // Use config value for orbs
                          
                          
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
                              scrollSpeed={scrollSpeed.current}
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
                          style={{
                            transform: effects.centerLogoMode === 'billboard' 
                              ? `translate(-50%, -50%) translateY(var(--scroll-offset-y, 0px)) rotateY(${-((scrollOffset * (468 * (helixConfig.repeatTurns || 1.5) / projects.length)) + (helixConfig.rotateY || 0))}deg)`
                              : `translate(-50%, -50%) translateY(var(--scroll-offset-y, 0px))`
                          }}
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
      /* Electric Neon Connection Animations */
      @keyframes electric-pulse {
        0% { 
          filter: drop-shadow(0 0 10px #00ffff) drop-shadow(0 0 20px #00ffff) drop-shadow(0 0 30px #00ffff);
        }
        50% { 
          filter: drop-shadow(0 0 15px #00ffff) drop-shadow(0 0 30px #00ffff) drop-shadow(0 0 45px #00ffff);
        }
        100% { 
          filter: drop-shadow(0 0 10px #00ffff) drop-shadow(0 0 20px #00ffff) drop-shadow(0 0 30px #00ffff);
        }
      }
      
      @keyframes electric-flow {
        0% { 
          stroke-dashoffset: 0;
        }
        100% { 
          stroke-dashoffset: -20;
        }
      }
      
      @keyframes electric-spark {
        0%, 100% { 
          opacity: 0.4;
        }
        25% {
          opacity: 1;
        }
        50% { 
          opacity: 0.6;
        }
        75% {
          opacity: 0.9;
        }
      }
      
      .electric-path {
        filter: drop-shadow(0 0 15px #00ffff) drop-shadow(0 0 30px #00ffff) drop-shadow(0 0 50px #0088ff);
        animation: electric-pulse 1.5s ease-in-out infinite;
      }
      
      .electric-core {
        filter: drop-shadow(0 0 5px #ffffff) drop-shadow(0 0 10px #ffffff);
        animation: electric-spark 0.5s ease-in-out infinite;
      }
      
      .spring-path-secondary {
        animation: electric-flow 0.8s linear infinite;
      }
      
      .spring-connection {
        mix-blend-mode: screen;
      }
      
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

