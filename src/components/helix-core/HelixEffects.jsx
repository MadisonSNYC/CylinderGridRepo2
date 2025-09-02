import React from 'react';

/**
 * Cinematic vignette effect overlay
 */
export const VignetteEffect = ({ intensity = 0.8, color = '0,0,0' }) => (
  <div 
    className="helix-vignette"
    style={{
      position: 'absolute',
      inset: 0,
      background: `radial-gradient(circle at center, transparent 40%, rgba(${color},${intensity}) 100%)`,
      pointerEvents: 'none',
      zIndex: 100
    }}
  />
);

/**
 * Film grain effect overlay
 */
export const FilmGrainEffect = ({ opacity = 0.15 }) => (
  <div 
    className="helix-film-grain"
    style={{
      position: 'absolute',
      inset: 0,
      opacity,
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
      pointerEvents: 'none',
      zIndex: 101,
      mixBlendMode: 'overlay'
    }}
  />
);

/**
 * CRT scanlines effect
 */
export const ScanlinesEffect = ({ 
  lineHeight = 2, 
  opacity = 0.03, 
  color = '0,255,255',
  animated = true 
}) => (
  <div 
    className="helix-scanlines"
    style={{
      position: 'absolute',
      inset: 0,
      background: `repeating-linear-gradient(
        0deg,
        transparent,
        transparent ${lineHeight}px,
        rgba(${color},${opacity}) ${lineHeight}px,
        rgba(${color},${opacity}) ${lineHeight * 2}px
      )`,
      animation: animated ? 'scanlines 8s linear infinite' : 'none',
      pointerEvents: 'none',
      zIndex: 102
    }}
  />
);

/**
 * RGB chromatic aberration effect
 */
export const ChromaticEffect = ({ children, offset = 2, trigger = 'hover' }) => {
  const [isActive, setIsActive] = React.useState(false);
  
  const handleMouseEnter = () => trigger === 'hover' && setIsActive(true);
  const handleMouseLeave = () => trigger === 'hover' && setIsActive(false);
  
  React.useEffect(() => {
    if (trigger === 'always') setIsActive(true);
  }, [trigger]);
  
  return (
    <div 
      className="helix-chromatic-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative' }}
    >
      {children}
      {isActive && (
        <>
          <div style={{
            position: 'absolute',
            inset: 0,
            transform: `translateX(-${offset}px)`,
            opacity: 0.5,
            mixBlendMode: 'screen',
            filter: 'hue-rotate(180deg)',
            pointerEvents: 'none'
          }}>
            {children}
          </div>
          <div style={{
            position: 'absolute',
            inset: 0,
            transform: `translateX(${offset}px)`,
            opacity: 0.5,
            mixBlendMode: 'screen',
            filter: 'hue-rotate(-180deg)',
            pointerEvents: 'none'
          }}>
            {children}
          </div>
        </>
      )}
    </div>
  );
};

/**
 * Glow effect for elements
 */
export const GlowEffect = ({ 
  color = '0,255,255', 
  intensity = 0.8, 
  blur = 20,
  children 
}) => (
  <div 
    className="helix-glow-wrapper"
    style={{
      position: 'relative',
      filter: `drop-shadow(0 0 ${blur}px rgba(${color},${intensity}))`
    }}
  >
    {children}
  </div>
);

/**
 * Lighting system with key and fill lights
 */
export const LightingSystem = ({ 
  keyLight = { x: 30, y: 20, size: 200, color: '255,255,255', intensity: 0.2 },
  fillLight = { x: 70, y: 80, size: 300, color: '100,200,255', intensity: 0.1 }
}) => (
  <div className="helix-lighting-system" style={{ pointerEvents: 'none' }}>
    <div 
      className="key-light"
      style={{
        position: 'absolute',
        top: `${keyLight.y}%`,
        left: `${keyLight.x}%`,
        width: `${keyLight.size}px`,
        height: `${keyLight.size}px`,
        background: `radial-gradient(circle, rgba(${keyLight.color},${keyLight.intensity}) 0%, transparent 70%)`,
        filter: 'blur(40px)',
        transform: 'translate(-50%, -50%)'
      }}
    />
    <div 
      className="fill-light"
      style={{
        position: 'absolute',
        top: `${fillLight.y}%`,
        left: `${fillLight.x}%`,
        width: `${fillLight.size}px`,
        height: `${fillLight.size}px`,
        background: `radial-gradient(circle, rgba(${fillLight.color},${fillLight.intensity}) 0%, transparent 70%)`,
        filter: 'blur(60px)',
        transform: 'translate(-50%, -50%)'
      }}
    />
  </div>
);

/**
 * Monitor/CRT frame effect
 */
export const MonitorFrame = ({ children, bezelColor = '#333', bezelWidth = 20 }) => (
  <div 
    className="helix-monitor-frame"
    style={{
      position: 'relative',
      padding: `${bezelWidth}px`,
      background: bezelColor,
      borderRadius: `${bezelWidth}px`,
      boxShadow: `
        inset 0 0 ${bezelWidth}px rgba(0,0,0,0.8),
        0 0 40px rgba(0,0,0,0.5)
      `
    }}
  >
    <div 
      className="monitor-screen"
      style={{
        position: 'relative',
        borderRadius: `${bezelWidth / 2}px`,
        overflow: 'hidden'
      }}
    >
      {children}
    </div>
  </div>
);

/**
 * Effect composer for combining multiple effects
 */
export const HelixEffectComposer = ({ 
  effects = {},
  children 
}) => {
  const {
    vignette,
    filmGrain,
    scanlines,
    chromatic,
    glow,
    lighting,
    monitor
  } = effects;
  
  let content = children;
  
  // Wrap with chromatic if enabled
  if (chromatic) {
    content = (
      <ChromaticEffect {...(typeof chromatic === 'object' ? chromatic : {})}>
        {content}
      </ChromaticEffect>
    );
  }
  
  // Wrap with glow if enabled
  if (glow) {
    content = (
      <GlowEffect {...(typeof glow === 'object' ? glow : {})}>
        {content}
      </GlowEffect>
    );
  }
  
  // Add overlay effects
  content = (
    <>
      {content}
      {vignette && <VignetteEffect {...(typeof vignette === 'object' ? vignette : {})} />}
      {filmGrain && <FilmGrainEffect {...(typeof filmGrain === 'object' ? filmGrain : {})} />}
      {scanlines && <ScanlinesEffect {...(typeof scanlines === 'object' ? scanlines : {})} />}
      {lighting && <LightingSystem {...(typeof lighting === 'object' ? lighting : {})} />}
    </>
  );
  
  // Wrap with monitor frame if enabled
  if (monitor) {
    content = (
      <MonitorFrame {...(typeof monitor === 'object' ? monitor : {})}>
        {content}
      </MonitorFrame>
    );
  }
  
  return content;
};

// CSS for animated effects
export const effectStyles = `
  @keyframes scanlines {
    0% { transform: translateY(0); }
    100% { transform: translateY(10px); }
  }
  
  @keyframes rgbShift {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 1; }
  }
`;

export default HelixEffectComposer;