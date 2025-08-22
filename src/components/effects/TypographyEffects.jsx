import React from 'react';

export const TypographyEffects = ({ effects, children }) => {
  return (
    <div 
      className="typography-effects-wrapper"
      data-ashfall-typography={effects.ashfallTypography}
      data-subtle-text={effects.subtleText}
    >
      <style jsx>{`
        /* Ashfall Typography */
        .typography-effects-wrapper[data-ashfall-typography="true"] {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          font-feature-settings: 'kern' 1, 'liga' 1, 'calt' 1;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .typography-effects-wrapper[data-ashfall-typography="true"] h1 {
          font-size: 2.5rem;
          font-weight: 300;
          letter-spacing: -0.05em;
          line-height: 1.2;
        }

        .typography-effects-wrapper[data-ashfall-typography="true"] h2 {
          font-size: 1.875rem;
          font-weight: 400;
          letter-spacing: -0.025em;
          line-height: 1.3;
        }

        .typography-effects-wrapper[data-ashfall-typography="true"] h3 {
          font-size: 1rem;
          font-weight: 500;
          letter-spacing: -0.01em;
          line-height: 1.4;
        }

        .typography-effects-wrapper[data-ashfall-typography="true"] p {
          font-size: 0.875rem;
          font-weight: 400;
          line-height: 1.5;
          letter-spacing: 0.01em;
        }

        .typography-effects-wrapper[data-ashfall-typography="true"] .tech-tag {
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.025em;
          text-transform: uppercase;
        }

        /* Subtle Text Colors */
        .typography-effects-wrapper[data-subtle-text="true"] h1,
        .typography-effects-wrapper[data-subtle-text="true"] h2 {
          color: rgba(255, 255, 255, 0.9);
        }

        .typography-effects-wrapper[data-subtle-text="true"] h3 {
          color: rgba(255, 255, 255, 0.85);
        }

        .typography-effects-wrapper[data-subtle-text="true"] p {
          color: rgba(255, 255, 255, 0.7);
        }

        .typography-effects-wrapper[data-subtle-text="true"] .tech-tag {
          color: rgba(255, 255, 255, 0.6);
        }

        /* Ashfall color scheme text colors */
        .color-scheme-wrapper[data-ashfall-colors="true"] .typography-effects-wrapper[data-subtle-text="true"] h1,
        .color-scheme-wrapper[data-ashfall-colors="true"] .typography-effects-wrapper[data-subtle-text="true"] h2 {
          color: rgba(0, 0, 0, 0.9);
        }

        .color-scheme-wrapper[data-ashfall-colors="true"] .typography-effects-wrapper[data-subtle-text="true"] h3 {
          color: rgba(0, 0, 0, 0.8);
        }

        .color-scheme-wrapper[data-ashfall-colors="true"] .typography-effects-wrapper[data-subtle-text="true"] p {
          color: rgba(0, 0, 0, 0.6);
        }

        .color-scheme-wrapper[data-ashfall-colors="true"] .typography-effects-wrapper[data-subtle-text="true"] .tech-tag {
          color: rgba(0, 0, 0, 0.5);
        }

        /* Navigation instructions styling */
        .typography-effects-wrapper[data-ashfall-typography="true"] .navigation-instructions h3 {
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .typography-effects-wrapper[data-ashfall-typography="true"] .navigation-instructions li {
          font-size: 0.75rem;
          font-weight: 400;
          line-height: 1.4;
        }

        /* Project info overlay typography */
        .typography-effects-wrapper[data-ashfall-typography="true"] .project-info-overlay h2 {
          font-size: 2rem;
          font-weight: 300;
          letter-spacing: -0.03em;
          margin-bottom: 0.75rem;
        }

        .typography-effects-wrapper[data-ashfall-typography="true"] .project-info-overlay p {
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .typography-effects-wrapper[data-ashfall-typography="true"] .project-counter {
          font-size: 0.8125rem;
          font-weight: 500;
          letter-spacing: 0.05em;
        }

        /* Smooth text transitions */
        .typography-effects-wrapper h1,
        .typography-effects-wrapper h2,
        .typography-effects-wrapper h3,
        .typography-effects-wrapper p {
          transition: color 0.3s ease, font-size 0.3s ease;
        }

        /* Text selection styling */
        .typography-effects-wrapper[data-ashfall-typography="true"] ::selection {
          background: rgba(59, 130, 246, 0.2);
          color: inherit;
        }

        .color-scheme-wrapper[data-ashfall-colors="true"] .typography-effects-wrapper[data-ashfall-typography="true"] ::selection {
          background: rgba(59, 130, 246, 0.15);
        }
      `}</style>
      {children}
    </div>
  );
};

