// Pure math utilities for helix calculations
import { safeNumber, safeClamp } from '../utils/guards.js';

export const toRad = (deg) => deg * Math.PI / 180;
export const toDeg = (rad) => rad * 180 / Math.PI;

export const normalizeSignedDeg = (a) => {
  const angle = safeNumber(a, 0);
  let x = ((angle % 360) + 360) % 360; 
  return x >= 180 ? x - 360 : x;
};

export const clamp01 = (v) => safeClamp(v, 0, 1);

export function getDepth(thetaDeg, sceneYaw) {
  const delta = Math.abs(normalizeSignedDeg(thetaDeg + sceneYaw));
  return clamp01(delta / 180);
}

export function getTier(depth) {
  if (depth <= 30/180) return 'depth-near';
  if (depth <= 90/180) return 'depth-mid';
  return 'depth-far';
}

// Lab-specific calculations
export function getLabVars(angle, currentRotation, project, window) {
  const thetaDeg = normalizeSignedDeg(angle);
  const sceneYaw = normalizeSignedDeg(currentRotation);
  const depth = getDepth(thetaDeg, sceneYaw);
  
  // Lab front floors (desktop/mobile)
  const FRONT_FLOOR = window.innerWidth <= 768 ? 0.48 : 0.42;
  const DOF_SLOPE = window.innerWidth <= 768 ? 0.35 : 0.45;
  const frontO = Math.max(FRONT_FLOOR, 1 - depth * DOF_SLOPE);
  
  // Lab ghost back calculation (55-75° window)
  const signedDelta = normalizeSignedDeg(thetaDeg + sceneYaw);
  const absDelta = Math.abs(signedDelta);
  
  const FADE_START = 55;
  const FADE_END = 75;
  const isMobile = window.matchMedia('(max-width: 640px)').matches;
  const GHOST_MAX = isMobile ? 0.22 : 0.28;
  
  let backFade = 0;
  let ghostO = 0;
  
  if (absDelta < FADE_START) {
    backFade = 0;
    ghostO = 0;
  } else if (absDelta >= FADE_END) {
    backFade = 1;
    ghostO = GHOST_MAX;
  } else {
    backFade = (absDelta - FADE_START) / (FADE_END - FADE_START);
    const GHOST_GATE = 0.40;
    const ghostPhase = backFade <= GHOST_GATE ? 0 : (backFade - GHOST_GATE) / (1 - GHOST_GATE);
    ghostO = Math.min(GHOST_MAX, ghostPhase * GHOST_MAX);
  }
  
  // Bias (size & inward tilt)
  const SCALE_FRONT = 0.03;
  const SCALE_SIDE = 0.08;
  const BIAS_TILT_MAX = 5;
  
  const biasScale = 1 + SCALE_FRONT * (1 - depth) - SCALE_SIDE * depth;
  const biasTilt = -BIAS_TILT_MAX * depth;
  
  return {
    '--d': depth.toFixed(3),
    '--front-o': frontO.toFixed(3),
    '--ghost-o': ghostO.toFixed(3),
    '--back': backFade.toFixed(3),
    '--bias-scale': biasScale.toFixed(3),
    '--bias-tilt-deg': `${biasTilt.toFixed(2)}deg`,
    ...(project?.thumbnail ? { '--tile-bg': `url(${project.thumbnail})` } : {})
  };
}

export function suggestTilesPerTurn(radius, cardW, gutter, minDegGap = 24) {
  const span = (cardW + gutter) / (2 * radius);
  if (span >= 1) return 8; // degenerate: very tight radius; fall back safe
  const alphaRad = 2 * Math.asin(span);
  const alphaDeg = toDeg(alphaRad);
  const raw = Math.max(4, Math.floor(360 / Math.max(alphaDeg, minDegGap)));
  // force even for pairing
  return raw % 2 === 0 ? raw : raw - 1;
}