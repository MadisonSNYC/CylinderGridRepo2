import React from 'react';

export const CardDesignEffects = ({ effects, children }) => {
  return (
    <div 
      className="card-design-wrapper"
      data-ashfall-cards={effects.ashfallCards}
      data-card-shadows={effects.cardShadows}
      data-card-borders={effects.cardBorders}
    >
      <style jsx="true">{`
        /* Ashfall Card Style */
        .card-design-wrapper[data-ashfall-cards="true"] .helix-node > div {
          background: rgba(255, 255, 255, 0.95) !important;
          border: 1px solid rgba(0, 0, 0, 0.08) !important;
          backdrop-filter: blur(10px);
        }

        .card-design-wrapper[data-ashfall-cards="true"] .helix-node img {
          border-radius: 4px;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .card-design-wrapper[data-ashfall-cards="true"] .helix-node h3 {
          color: #333333 !important;
          font-weight: 500;
        }

        .card-design-wrapper[data-ashfall-cards="true"] .helix-node .tech-tag {
          background: rgba(0, 0, 0, 0.08) !important;
          color: #666666 !important;
          border: none !important;
        }

        /* Card Shadows */
        .card-design-wrapper[data-card-shadows="true"] .helix-node > div {
          box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: box-shadow 0.3s ease;
        }

        .card-design-wrapper[data-card-shadows="true"] .helix-node:hover > div,
        .card-design-wrapper[data-card-shadows="true"] .helix-node.active > div {
          box-shadow: 
            0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        /* Card Borders */
        .card-design-wrapper[data-card-borders="true"] .helix-node > div {
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: border-color 0.3s ease;
        }

        .card-design-wrapper[data-card-borders="true"][data-ashfall-cards="true"] .helix-node > div {
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .card-design-wrapper[data-card-borders="true"] .helix-node:hover > div,
        .card-design-wrapper[data-card-borders="true"] .helix-node.active > div {
          border-color: rgba(59, 130, 246, 0.5);
        }

        /* Enhanced hover states for Ashfall style */
        .card-design-wrapper[data-ashfall-cards="true"] .helix-node:hover > div {
          background: rgba(255, 255, 255, 1) !important;
          transform: translateY(-2px);
        }

        .card-design-wrapper[data-ashfall-cards="true"] .helix-node:hover img {
          filter: none !important;
        }

        /* Monochrome effect integration */
        .card-design-wrapper .helix-node img {
          transition: filter 0.3s ease;
        }

        .card-design-wrapper .helix-node:not(:hover):not(.active) img {
          filter: grayscale(100%) contrast(1.1);
        }

        .card-design-wrapper .helix-node:hover img,
        .card-design-wrapper .helix-node.active img {
          filter: grayscale(0%) contrast(1);
        }

        /* Refined typography for Ashfall style */
        .card-design-wrapper[data-ashfall-cards="true"] .helix-node {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .card-design-wrapper[data-ashfall-cards="true"] .helix-node h3 {
          font-size: 0.875rem;
          font-weight: 500;
          letter-spacing: -0.025em;
          line-height: 1.25;
        }

        .card-design-wrapper[data-ashfall-cards="true"] .tech-tag {
          font-size: 0.75rem;
          font-weight: 400;
          padding: 2px 6px;
          border-radius: 3px;
        }
      `}</style>
      {children}
    </div>
  );
};

