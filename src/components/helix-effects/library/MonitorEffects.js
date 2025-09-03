/**
 * Monitor/CRT effects library
 * Retro monitor and screen effects
 */

export const monitorEffects = {
  // Monitor frame/bezel
  bezel: {
    enabled: true,
    thickness: 15,
    borderRadius: 15,
    render: () => `
      <div class="monitor-frame" style="
        position: fixed;
        inset: 0;
        z-index: 1000;
        pointer-events: none;
      ">
        <div class="monitor-bezel" style="
          position: absolute;
          inset: 20px;
          border: 15px solid;
          border-color: #2a2a2a #1a1a1a #0a0a0a #1a1a1a;
          border-radius: 15px;
          box-shadow: inset 0 2px 10px rgba(0,0,0,0.8), inset 0 -2px 10px rgba(0,0,0,0.8);
        "></div>
      </div>
    `
  },

  // CRT scanlines
  scanlines: {
    enabled: true,
    lineHeight: 2,
    opacity: 0.03,
    color: '0,255,255',
    animated: true,
    render: (config) => `
      <div class="scanlines" style="
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
          0deg,
          transparent,
          transparent ${config.lineHeight}px,
          rgba(${config.color},${config.opacity}) ${config.lineHeight}px,
          rgba(${config.color},${config.opacity}) ${config.lineHeight * 2}px
        );
        animation: ${config.animated ? 'scanlines-move 8s linear infinite' : 'none'};
        pointer-events: none;
        z-index: 102;
      "></div>
    `,
    keyframes: `
      @keyframes scanlines-move {
        0% { transform: translateY(0); }
        100% { transform: translateY(10px); }
      }
    `
  },

  // Screen flicker
  flicker: {
    enabled: false,
    intensity: 0.03,
    render: () => `
      <div class="screen-flicker" style="
        position: absolute;
        inset: 0;
        background: rgba(255,255,255,0);
        animation: flicker 0.15s infinite;
        pointer-events: none;
        z-index: 103;
      "></div>
    `,
    keyframes: `
      @keyframes flicker {
        0% { opacity: 0; }
        50% { opacity: 0.03; }
        100% { opacity: 0; }
      }
    `
  },

  // CRT curvature (subtle barrel distortion)
  curvature: {
    enabled: false,
    amount: 1.02,
    render: () => `
      <div class="crt-curvature" style="
        position: absolute;
        inset: -2%;
        transform: scale(1.02);
        border-radius: 50px;
        overflow: hidden;
        pointer-events: none;
      "></div>
    `
  },

  // Phosphor glow
  phosphorGlow: {
    enabled: false,
    color: '0,255,200',
    intensity: 0.1,
    render: (config) => `
      <div class="phosphor-glow" style="
        position: absolute;
        inset: 0;
        background: radial-gradient(
          circle at center,
          rgba(${config.color},${config.intensity}) 0%,
          transparent 70%
        );
        mix-blend-mode: screen;
        pointer-events: none;
      "></div>
    `
  }
};

/**
 * Apply monitor effects to container
 */
export function applyMonitorEffects(container, effects = monitorEffects) {
  if (!container) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'monitor-effects-wrapper';
  wrapper.style.position = 'absolute';
  wrapper.style.inset = '0';
  wrapper.style.pointerEvents = 'none';

  let html = '';
  
  if (effects.bezel?.enabled) {
    html += effects.bezel.render();
  }
  
  if (effects.scanlines?.enabled) {
    html += effects.scanlines.render(effects.scanlines);
    
    // Add keyframes if animated
    if (effects.scanlines.animated && !document.getElementById('scanlines-keyframes')) {
      const style = document.createElement('style');
      style.id = 'scanlines-keyframes';
      style.textContent = effects.scanlines.keyframes;
      document.head.appendChild(style);
    }
  }
  
  if (effects.flicker?.enabled) {
    html += effects.flicker.render();
    
    // Add flicker keyframes
    if (!document.getElementById('flicker-keyframes')) {
      const style = document.createElement('style');
      style.id = 'flicker-keyframes';
      style.textContent = effects.flicker.keyframes;
      document.head.appendChild(style);
    }
  }
  
  if (effects.curvature?.enabled) {
    html += effects.curvature.render();
  }
  
  if (effects.phosphorGlow?.enabled) {
    html += effects.phosphorGlow.render(effects.phosphorGlow);
  }

  wrapper.innerHTML = html;
  container.appendChild(wrapper);
  
  return wrapper;
}

/**
 * Card-level monitor overlay (contained within card boundaries)
 */
export function getCardMonitorOverlay() {
  return `
    <div class="card-monitor-overlay" style="
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 1px,
        rgba(0, 255, 255, 0.02) 1px,
        rgba(0, 255, 255, 0.02) 2px
      );
      pointer-events: none;
      border-radius: 12px;
    "></div>
  `;
}

export default monitorEffects;