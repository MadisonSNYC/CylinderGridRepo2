import React, { useState, useEffect } from 'react';
import { ExternalLink, Github, Play, Code, Calendar, Tag } from 'lucide-react';

const ProjectPreview = ({ project, isVisible, position }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!project || !isAnimating) return null;

  return (
    <div 
      className={`
        fixed z-50 pointer-events-none
        transition-all duration-300 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -120%)'
      }}
    >
      <div className="bg-gray-900/95 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700/50 min-w-[320px] max-w-[400px]">
        {/* Project Title */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            {project.title}
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </h3>
          <p className="text-gray-400 text-sm">{project.description}</p>
        </div>

        {/* Preview Image/Video */}
        {(project.thumbnail || project.videoAsset) && (
          <div className="mb-4 rounded-lg overflow-hidden bg-gray-800 aspect-video relative group">
            {project.videoAsset ? (
              <>
                <video
                  className="w-full h-full object-cover"
                  src={project.videoAsset}
                  muted
                  loop
                  autoPlay
                  playsInline
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play className="w-12 h-12 text-white/80" />
                </div>
              </>
            ) : (
              <img
                className="w-full h-full object-cover"
                src={project.thumbnail}
                alt={project.title}
              />
            )}
          </div>
        )}

        {/* Technologies */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500 uppercase tracking-wider">Technologies</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map(tech => (
              <span 
                key={tech}
                className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs border border-blue-500/30"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700/50">
          <div className="text-center">
            <Code className="w-5 h-5 mx-auto mb-1 text-gray-500" />
            <div className="text-xs text-gray-500">Source</div>
            <div className="text-sm text-white font-medium">Available</div>
          </div>
          <div className="text-center">
            <Calendar className="w-5 h-5 mx-auto mb-1 text-gray-500" />
            <div className="text-xs text-gray-500">Updated</div>
            <div className="text-sm text-white font-medium">Recent</div>
          </div>
          <div className="text-center">
            <Github className="w-5 h-5 mx-auto mb-1 text-gray-500" />
            <div className="text-xs text-gray-500">Status</div>
            <div className="text-sm text-green-400 font-medium">Active</div>
          </div>
        </div>

        {/* Hover Hint */}
        <div className="mt-4 text-center text-xs text-gray-500">
          Click to view project details
        </div>
      </div>

      {/* Arrow pointing to card */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0"
        style={{
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderTop: '10px solid rgb(55 65 81 / 0.5)'
        }}
      />
    </div>
  );
};

export default ProjectPreview;