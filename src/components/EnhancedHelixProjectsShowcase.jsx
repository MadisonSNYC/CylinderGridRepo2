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

const HelixNode = ({ project, index, totalProjects, isActive, onClick, effects, scrollOffset = 0 }) => {
  // Calculate position along the extended helix
  const repeatTurns = effects.repeatTurns || 2;
  const totalCards = totalProjects * Math.ceil(repeatTurns + 1);
  
  // Use modulo for display purposes
  const effectiveIndex = index % totalProjects;
  
  // Position calculation for extended helix
  const normalizedIndex = index / totalProjects;
  const angle = normalizedIndex * 360;
  const radius = 250; // Good radius for helix
  
  // DNA Helix arrangement - extend vertical span based on repeat turns
  const verticalSpan = 800 * repeatTurns; // Much taller helix
  const yOffset = (index / (totalCards - 1)) * verticalSpan - (verticalSpan / 2);
  
  // Calculate the current rotation to always face forward
  const currentRotation = scrollOffset * (360 / totalProjects);
  const cardFaceAngle = angle - currentRotation;
  
  // Calculate depth-based opacity like Ashfall Studio
  const normalizedAngle = ((angle - currentRotation) % 360 + 360) % 360;
  let opacity = 1;
  let scale = 1;
  
  // Front cards (facing viewer) - full opacity
  if (normalizedAngle < 45 || normalizedAngle > 315) {
    opacity = 1;
    scale = 1;
  }
  // Side cards - medium opacity
  else if ((normalizedAngle >= 45 && normalizedAngle < 135) || (normalizedAngle >= 225 && normalizedAngle < 315)) {
    opacity = 0.7;
    scale = 0.9;
  }
  // Back cards - low opacity for depth
  else {
    opacity = 0.3;
    scale = 0.8;
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
        width: '80px',  // 9:16 aspect ratio
        height: '142px', // 80 * 16/9 ≈ 142
        left: '50%',
        top: '50%',
        transform: `
          translate(-50%, -50%)
          rotateY(${angle}deg) 
          translateZ(${radius}px) 
          translateY(${yOffset}px)
          scale(${scale})
        `,
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'visible',
        WebkitBackfaceVisibility: 'visible',
        opacity: opacity,
        transition: 'opacity 0.3s ease, transform 0.05s linear' // Quick transform updates for smooth scroll
      }}
      onClick={() => onClick(index)}
    >
      <div 
        className="w-full h-full bg-gray-700 border border-gray-500 hover:border-gray-400 transition-colors flex items-center justify-center"
        style={{
          // Always face the viewer - counter-rotate by the card's angle
          transform: `rotateY(${-angle}deg)`,
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'visible',
          WebkitBackfaceVisibility: 'visible',
          transition: 'all 0.3s ease',
          // Consistent curved appearance like depth blur
          borderRadius: '12px',
          // Force visibility
          visibility: 'visible'
        }}
      >
        <div className="text-center">
          <div className="text-white text-xs font-medium">
            Project {String((effectiveIndex + 1)).padStart(2, '0')}
          </div>
        </div>
      </div>
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
  effects = {}
}) => {
  const helixRef = useRef(null);
  const [currentProject, setCurrentProject] = useState(0);
  const [enhanced, setEnhanced] = useState(true); // Force 3D mode for testing
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0); // For endless scroll
  
  // Smooth scroll state
  const scrollVelocity = useRef(0);
  const targetScrollOffset = useRef(0);
  const animationFrameId = useRef(null);
  const lastWheelTime = useRef(0);
  const wheelTimeout = useRef(null)

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

  // Smooth animation loop
  useEffect(() => {
    if (!enhanced) return;
    
    const animate = () => {
      const dampening = 0.95; // Higher friction for slower, smoother stop
      const snapThreshold = 0.0005; // Lower threshold for smoother stop
      
      // Apply velocity to target
      targetScrollOffset.current += scrollVelocity.current;
      
      // Apply dampening to velocity
      scrollVelocity.current *= dampening;
      
      // Stop if velocity is very small
      if (Math.abs(scrollVelocity.current) < snapThreshold) {
        scrollVelocity.current = 0;
      }
      
      // Smoothly interpolate actual scroll to target
      setScrollOffset(prev => {
        const diff = targetScrollOffset.current - prev;
        const smoothing = 0.15; // Lower = smoother but slower response
        return prev + diff * smoothing;
      });
      
      animationFrameId.current = requestAnimationFrame(animate);
    };
    
    animationFrameId.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [enhanced]);

  // Mouse wheel / trackpad scroll support with momentum
  useEffect(() => {
    if (!enhanced) return;

    const handleWheel = (e) => {
      e.preventDefault();
      
      const now = Date.now();
      const timeDelta = now - lastWheelTime.current;
      lastWheelTime.current = now;
      
      // Calculate scroll speed based on deltaY and time between events
      let speed = e.deltaY * 0.0003; // Even smaller multiplier for slower, smoother motion
      
      // Apply acceleration for quick scrolls
      if (timeDelta < 50) {
        speed *= 1.2; // Less acceleration
      }
      
      // Clamp speed to prevent too fast scrolling
      speed = Math.max(-0.2, Math.min(0.2, speed)); // Lower max speed
      
      // Add to velocity for momentum
      scrollVelocity.current += speed;
      
      // Clear existing timeout
      if (wheelTimeout.current) {
        clearTimeout(wheelTimeout.current);
      }
      
      // Set timeout to gradually stop momentum after scrolling stops
      wheelTimeout.current = setTimeout(() => {
        scrollVelocity.current *= 0.5; // Quick deceleration when user stops scrolling
      }, 150);
    };

    const helixElement = helixRef.current?.parentElement;
    if (helixElement) {
      helixElement.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        helixElement.removeEventListener('wheel', handleWheel);
        if (wheelTimeout.current) {
          clearTimeout(wheelTimeout.current);
        }
      };
    }
  }, [enhanced]);

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
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          scrollVelocity.current = 0.15; // Slower keyboard navigation
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          scrollVelocity.current = -0.15; // Slower keyboard navigation
          break;
        case 'Home':
          e.preventDefault();
          targetScrollOffset.current = 0;
          scrollVelocity.current = 0;
          break;
        case 'Escape':
          e.preventDefault();
          setEnhanced(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enhanced]);

  const handleProjectClick = (index) => {
    targetScrollOffset.current = index;
    scrollVelocity.current = 0; // Stop momentum when clicking
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
                        perspective: '1200px',
                        // Combine rotation and vertical translation for scroll effect
                        transform: `
                          rotateX(-10deg) 
                          rotateY(${scrollOffset * (360 / projects.length)}deg)
                          translateY(${-scrollOffset * 20}px)
                        `,
                        // Pass scene rotation as CSS variable for billboard mode
                        '--sceneDeg': `${scrollOffset * (360 / projects.length)}deg`,
                        '--wireframe-scroll-y': `${-scrollOffset * 20}px`, // Move wireframe with scroll
                        transition: 'none', // Remove transition for smoother animation loop
                        width: '600px',
                        height: '600px',
                        position: 'relative'
                      }}
                    >
                      {/* Render multiple sets of cards for infinite scroll */}
                      {/* Use repeatTurns to control number of card sets */}
                      {Array.from({ length: Math.ceil(effects.repeatTurns || 2) + 1 }, (_, setIndex) => 
                        projects.map((project, index) => {
                          const globalIndex = setIndex * projects.length + index;
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
                            />
                          );
                        })
                      )}
                      
                      {/* Wireframe Circles */}
                      {effects.centralWireframe && (
                        <>
                          <div 
                            className="wireframe-circle-1"
                            style={{
                              position: 'absolute',
                              left: '50%',
                              top: '50%',
                              transform: `translate(-50%, -50%) translateY(${-scrollOffset * 20}px)`,
                              width: '193px',
                              height: '193px',
                              border: '2px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: '50%',
                              pointerEvents: 'none',
                              zIndex: 150
                            }}
                          />
                          <div 
                            className="wireframe-circle-2"
                            style={{
                              position: 'absolute',
                              left: '50%',
                              top: '50%',
                              transform: `translate(-50%, -50%) translateY(${-scrollOffset * 20}px) rotateX(90deg)`,
                              width: '193px',
                              height: '193px',
                              border: '2px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: '50%',
                              pointerEvents: 'none',
                              zIndex: 150
                            }}
                          />
                        </>
                      )}
                      
                      {/* Center Logo */}
                      {effects.centerLogo && (
                        <img
                          src="/Ravielogo1.png"
                          alt="Ravie logo"
                          style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            width: '97px',
                            height: 'auto',
                            transform: `translate(-50%, -50%) translateY(${-scrollOffset * 20}px) ${effects.centerLogoMode === 'billboard' ? `rotateY(${-scrollOffset * (360 / projects.length)}deg)` : ''}`,
                            opacity: 1,
                            zIndex: 200,
                            filter: 'drop-shadow(0 2px 6px rgba(0,0,0,.25))',
                            pointerEvents: 'none',
                            userSelect: 'none',
                            WebkitUserSelect: 'none'
                          }}
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
              </TypographyEffects>
            </NavigationEffects>
          </StructureEffects>
        </CardDesignEffects>
      </VisualEffects>
    </ColorSchemeEffects>
  );
};

