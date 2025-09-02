// Core helix components
export { HelixCore, calculateHelixPosition } from './HelixCore';
export { ModularHelix, helixPresets, useHelixPreset } from './ModularHelix';

// Scroll management
export { useHelixScroll } from './useHelixScroll';

// Visual effects
export {
  VignetteEffect,
  FilmGrainEffect,
  ScanlinesEffect,
  ChromaticEffect,
  GlowEffect,
  LightingSystem,
  MonitorFrame,
  HelixEffectComposer,
  effectStyles
} from './HelixEffects';

// Re-export everything as namespace for convenience
import * as HelixCore from './HelixCore';
import * as HelixEffects from './HelixEffects';
import * as HelixScroll from './useHelixScroll';
import * as ModularHelix from './ModularHelix';

export const Helix = {
  ...HelixCore,
  ...HelixEffects,
  ...HelixScroll,
  ...ModularHelix
};