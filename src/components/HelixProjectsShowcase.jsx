import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Pause, Play, SkipForward, Square } from 'lucide-react';

// Mock project data
const mockProjects = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'Modern React-based shopping platform with real-time inventory',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop',
    technologies: ['React', 'Node.js', 'MongoDB'],
    url: '/project/1'
  },
  {
    id: '2',
    title: 'AI Dashboard',
    description: 'Machine learning analytics dashboard with predictive insights',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
    technologies: ['Python', 'TensorFlow', 'React'],
    url: '/project/2'
  },
  {
    id: '3',
    title: 'Mobile Banking App',
    description: 'Secure mobile banking solution with biometric authentication',
    thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop',
    technologies: ['React Native', 'Node.js', 'PostgreSQL'],
    url: '/project/3'
  },
  {
    id: '4',
    title: 'IoT Monitoring System',
    description: 'Real-time IoT device monitoring and control platform',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop',
    technologies: ['Vue.js', 'MQTT', 'InfluxDB'],
    url: '/project/4'
  },
  {
    id: '5',
    title: 'Social Media Platform',
    description: 'Next-generation social networking with AR features',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=200&fit=crop',
    technologies: ['Next.js', 'GraphQL', 'Redis'],
    url: '/project/5'
  },
  {
    id: '6',
    title: 'Healthcare Portal',
    description: 'Patient management system with telemedicine capabilities',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop',
    technologies: ['Angular', 'Spring Boot', 'MySQL'],
    url: '/project/6'
  },
  {
    id: '7',
    title: 'Blockchain Wallet',
    description: 'Multi-currency cryptocurrency wallet with DeFi integration',
    thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=200&fit=crop',
    technologies: ['React', 'Web3.js', 'Solidity'],
    url: '/project/7'
  },
  {
    id: '8',
    title: 'Video Streaming App',
    description: 'High-performance video streaming platform with CDN',
    thumbnail: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=200&fit=crop',
    technologies: ['React', 'FFmpeg', 'AWS'],
    url: '/project/8'
  }
];

const HelixNode = ({ project, index, totalProjects, isActive, onClick }) => {
  const angle = (index / totalProjects) * 360;
  const radius = 300;
  const yOffset = (index / totalProjects) * 400 - 200; // Helix pitch
  
  return (
    <div
      className={`
        absolute w-48 h-32 cursor-pointer transition-all duration-300
        ${isActive ? 'scale-110 z-20' : 'scale-100 z-10'}
      `}
      style={{
        transform: `
          rotateY(${angle}deg) 
          translateZ(${radius}px) 
          translateY(${yOffset}px)
          rotateY(${-angle}deg)
        `,
        transformStyle: 'preserve-3d'
      }}
      onClick={() => onClick(index)}
    >
      <div className="w-full h-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-colors">
        <img 
          src={project.thumbnail} 
          alt={project.title}
          className={`w-full h-20 object-cover transition-all duration-300 ${
            isActive ? 'filter-none' : 'grayscale'
          }`}
        />
        <div className="p-2">
          <h3 className="text-white text-sm font-semibold truncate">
            {project.title}
          </h3>
          <div className="flex flex-wrap gap-1 mt-1">
            {project.technologies.slice(0, 2).map(tech => (
              <span key={tech} className="text-xs bg-blue-600 text-white px-1 py-0.5 rounded">
                {tech}
              </span>
            ))}
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
              <span key={tech} className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </article>
    ))}
  </div>
);

const MotionControls = ({ isPaused, onPause, onResume, onEmergencyStop, onSkipIntro }) => (
  <div className="fixed top-4 right-4 z-50 flex gap-2">
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

export const HelixProjectsShowcase = ({ 
  projects = mockProjects,
  autoRotate = true,
  scrollDriven = false 
}) => {
  const helixRef = useRef(null);
  const [currentProject, setCurrentProject] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const animationRef = useRef(null);

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

  // Auto-rotation logic
  useEffect(() => {
    if (!autoRotate || isPaused || prefersReducedMotion || !enhanced) return;
    
    const interval = setInterval(() => {
      setCurrentProject(prev => (prev + 1) % projects.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [autoRotate, isPaused, prefersReducedMotion, enhanced, projects.length]);

  // Scroll-driven animation
  useEffect(() => {
    if (!scrollDriven || !enhanced || prefersReducedMotion) return;

    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      const projectIndex = Math.floor(scrollPercent * projects.length);
      setCurrentProject(Math.min(projectIndex, projects.length - 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollDriven, enhanced, prefersReducedMotion, projects.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!enhanced) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          setCurrentProject(prev => (prev + 1) % projects.length);
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          setCurrentProject(prev => (prev - 1 + projects.length) % projects.length);
          break;
        case 'Home':
          e.preventDefault();
          setCurrentProject(0);
          break;
        case 'End':
          e.preventDefault();
          setCurrentProject(projects.length - 1);
          break;
        case 'Escape':
          e.preventDefault();
          setEnhanced(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enhanced, projects.length]);

  const handleProjectClick = (index) => {
    setCurrentProject(index);
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
      />

      {/* 3D Helix Scene */}
      <div className="helix-scene relative h-screen overflow-hidden bg-gradient-to-b from-gray-900 to-black">
        <div 
          className="helix-assembly absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          ref={helixRef}
          style={{
            transformStyle: 'preserve-3d',
            perspective: '1200px',
            transform: `rotateX(-10deg) rotateY(${currentProject * (360 / projects.length)}deg)`
          }}
        >
          {projects.map((project, index) => (
            <HelixNode
              key={project.id}
              project={project}
              index={index}
              totalProjects={projects.length}
              isActive={index === currentProject}
              onClick={handleProjectClick}
            />
          ))}
        </div>

        {/* Project info overlay */}
        <div className="absolute bottom-8 left-8 right-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-2">
            {projects[currentProject]?.title}
          </h2>
          <p className="text-gray-300 mb-4 max-w-2xl mx-auto">
            {projects[currentProject]?.description}
          </p>
          <div className="flex justify-center gap-2 mb-4">
            {projects[currentProject]?.technologies.map(tech => (
              <span key={tech} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                {tech}
              </span>
            ))}
          </div>
          <div className="text-sm text-gray-400">
            Project {currentProject + 1} of {projects.length}
          </div>
        </div>

        {/* Navigation instructions */}
        <div className="absolute top-8 left-8 text-white text-sm">
          <div className="bg-gray-900/80 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="font-semibold mb-2">Navigation</h3>
            <ul className="space-y-1 text-xs">
              <li>← → Arrow keys to navigate</li>
              <li>Click projects to select</li>
              <li>Esc to exit 3D view</li>
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
  );
};

