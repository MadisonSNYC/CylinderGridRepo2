import React from 'react';

export const NavigationEffects = ({ effects, currentProject, totalProjects, onProjectSelect, children }) => {
  return (
    <div 
      className="navigation-effects-wrapper"
      data-project-counter={effects.projectCounter}
      data-navigation-dots={effects.navigationDots}
      data-minimalist-controls={effects.minimalistControls}
    >
      <style jsx="true">{`
        /* Project Counter */
        .project-counter {
          position: absolute;
          bottom: 2rem;
          right: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
          background: rgba(0, 0, 0, 0.3);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
          z-index: 30;
        }

        .color-scheme-wrapper[data-ashfall-colors="true"] .project-counter {
          color: rgba(0, 0, 0, 0.7);
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .project-counter:hover {
          background: rgba(0, 0, 0, 0.5);
          color: rgba(255, 255, 255, 0.9);
        }

        .color-scheme-wrapper[data-ashfall-colors="true"] .project-counter:hover {
          background: rgba(255, 255, 255, 0.95);
          color: rgba(0, 0, 0, 0.9);
        }

        /* Navigation Dots */
        .navigation-dots {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.5rem;
          z-index: 30;
        }

        .nav-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .nav-dot:hover {
          background: rgba(255, 255, 255, 0.5);
          transform: scale(1.2);
        }

        .nav-dot.active {
          background: rgba(255, 255, 255, 0.9);
          border-color: rgba(255, 255, 255, 0.9);
          transform: scale(1.3);
        }

        .color-scheme-wrapper[data-ashfall-colors="true"] .nav-dot {
          background: rgba(0, 0, 0, 0.2);
          border-color: rgba(0, 0, 0, 0.1);
        }

        .color-scheme-wrapper[data-ashfall-colors="true"] .nav-dot:hover {
          background: rgba(0, 0, 0, 0.4);
        }

        .color-scheme-wrapper[data-ashfall-colors="true"] .nav-dot.active {
          background: rgba(0, 0, 0, 0.8);
          border-color: rgba(0, 0, 0, 0.8);
        }

        /* Minimalist Controls */
        .minimalist-controls {
          position: absolute;
          top: 2rem;
          right: 2rem;
          display: flex;
          gap: 0.5rem;
          z-index: 30;
        }

        .minimalist-control {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .minimalist-control:hover {
          background: rgba(0, 0, 0, 0.4);
          border-color: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        .color-scheme-wrapper[data-ashfall-colors="true"] .minimalist-control {
          background: rgba(255, 255, 255, 0.6);
          border-color: rgba(0, 0, 0, 0.1);
        }

        .color-scheme-wrapper[data-ashfall-colors="true"] .minimalist-control:hover {
          background: rgba(255, 255, 255, 0.8);
          border-color: rgba(0, 0, 0, 0.2);
        }

        .minimalist-control svg {
          width: 14px;
          height: 14px;
          color: rgba(255, 255, 255, 0.8);
        }

        .color-scheme-wrapper[data-ashfall-colors="true"] .minimalist-control svg {
          color: rgba(0, 0, 0, 0.7);
        }

        /* Hide default controls when minimalist is enabled */
        .navigation-effects-wrapper[data-minimalist-controls="true"] .motion-controls {
          display: none;
        }

        /* Smooth animations */
        .navigation-effects-wrapper * {
          transition: all 0.3s ease;
        }
      `}</style>

      {/* Project Counter */}
      {effects.projectCounter && (
        <div className="project-counter">
          {String(currentProject + 1).padStart(2, '0')} / {String(totalProjects).padStart(2, '0')}
        </div>
      )}

      {/* Navigation Dots */}
      {effects.navigationDots && (
        <div className="navigation-dots">
          {Array.from({ length: totalProjects }, (_, index) => (
            <button
              key={index}
              className={`nav-dot ${index === currentProject ? 'active' : ''}`}
              onClick={() => onProjectSelect(index)}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Minimalist Controls */}
      {effects.minimalistControls && (
        <div className="minimalist-controls">
          <button className="minimalist-control" aria-label="Previous project">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <button className="minimalist-control" aria-label="Next project">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
          <button className="minimalist-control" aria-label="Pause animation">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="6" y="4" width="4" height="16"/>
              <rect x="14" y="4" width="4" height="16"/>
            </svg>
          </button>
        </div>
      )}

      {children}
    </div>
  );
};

