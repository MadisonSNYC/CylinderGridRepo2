/**
 * Cinematic effects library
 * Film-like visual effects for dramatic presentation
 */

export const cinematicEffects = {
  // Vignette effect - darkens edges
  vignette: {
    enabled: true,
    intensity: 0.8,
    color: '0,0,0',
    render: () => `
      <div class="cinematic-vignette" style="
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.8) 100%);
        pointer-events: none;
        z-index: 100;
      "></div>
    `
  },

  // Film grain effect - adds texture
  filmGrain: {
    enabled: true,
    opacity: 0.15,
    render: () => `
      <div class="film-grain" style="
        position: absolute;
        inset: 0;
        opacity: 0.15;
        background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Cfilter id="noise"%3E%3CfeTurbulence baseFrequency="0.9"/%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.5"/%3E%3C/svg%3E');
        pointer-events: none;
        animation: grain 8s steps(10) infinite;
        mix-blend-mode: overlay;
      "></div>
    `,
    keyframes: `
      @keyframes grain {
        0%, 100% { transform: translate(0, 0); }
        10% { transform: translate(-5%, -10%); }
        50% { transform: translate(-15%, 10%); }
        90% { transform: translate(-10%, 10%); }
      }
    `
  },

  // Color grading overlay
  colorGrading: {
    enabled: false,
    warmth: 0.05,
    coolness: 0.05,
    render: () => `
      <div class="color-grading" style="
        position: absolute;
        inset: 0;
        background: linear-gradient(
          45deg,
          rgba(6, 182, 212, 0.05) 0%,
          rgba(139, 69, 19, 0.05) 100%
        );
        mix-blend-mode: overlay;
        pointer-events: none;
      "></div>
    `
  },

  // Letterbox bars
  letterbox: {
    enabled: false,
    height: 60,
    render: (height = 60) => `
      <div class="letterbox-top" style="
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: ${height}px;
        background: black;
        z-index: 101;
      "></div>
      <div class="letterbox-bottom" style="
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: ${height}px;
        background: black;
        z-index: 101;
      "></div>
    `
  }
};

/**
 * Apply cinematic effects to container
 */
export function applyCinematicEffects(container, effects = cinematicEffects) {
  if (!container) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'cinematic-effects-wrapper';
  wrapper.style.position = 'absolute';
  wrapper.style.inset = '0';
  wrapper.style.pointerEvents = 'none';
  wrapper.style.zIndex = '100';

  let html = '';
  
  if (effects.vignette?.enabled) {
    html += effects.vignette.render();
  }
  
  if (effects.filmGrain?.enabled) {
    html += effects.filmGrain.render();
    
    // Add keyframes if not already present
    if (!document.getElementById('grain-keyframes')) {
      const style = document.createElement('style');
      style.id = 'grain-keyframes';
      style.textContent = effects.filmGrain.keyframes;
      document.head.appendChild(style);
    }
  }
  
  if (effects.colorGrading?.enabled) {
    html += effects.colorGrading.render();
  }
  
  if (effects.letterbox?.enabled) {
    html += effects.letterbox.render(effects.letterbox.height);
  }

  wrapper.innerHTML = html;
  container.appendChild(wrapper);
  
  return wrapper;
}

export default cinematicEffects;