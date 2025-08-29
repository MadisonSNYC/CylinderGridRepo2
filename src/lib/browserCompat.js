/**
 * Browser Compatibility Utilities
 * Detects browser capabilities and provides fallbacks
 */

// Detect browser type
export const getBrowserInfo = () => {
  const ua = navigator.userAgent;
  const isFirefox = /Firefox/i.test(ua);
  const isWebKit = /WebKit/i.test(ua) && !/Chrome/i.test(ua);
  const isChrome = /Chrome/i.test(ua) && /Google Inc/.test(navigator.vendor);
  const isSafari = /Safari/i.test(ua) && /Apple Computer/.test(navigator.vendor);
  const isEdge = /Edg/i.test(ua);
  
  // Get version numbers
  let version = null;
  if (isFirefox) {
    const match = ua.match(/Firefox\/(\d+)/);
    version = match ? parseInt(match[1]) : null;
  } else if (isChrome) {
    const match = ua.match(/Chrome\/(\d+)/);
    version = match ? parseInt(match[1]) : null;
  } else if (isSafari || isWebKit) {
    const match = ua.match(/Version\/(\d+)/);
    version = match ? parseInt(match[1]) : null;
  }
  
  return {
    isFirefox,
    isWebKit,
    isChrome,
    isSafari,
    isEdge,
    version,
    userAgent: ua
  };
};

// Check for CSS 3D transform support
export const supports3DTransforms = () => {
  if (!window.CSS || !window.CSS.supports) {
    // Fallback check
    const el = document.createElement('div');
    el.style.transform = 'translateZ(1px)';
    return el.style.transform !== '';
  }
  
  return CSS.supports('transform-style', 'preserve-3d') && 
         CSS.supports('perspective', '1000px');
};

// Check for specific transform support
export const supportsTransform = (transform) => {
  const el = document.createElement('div');
  const prefixes = ['', '-webkit-', '-moz-', '-ms-', '-o-'];
  
  for (const prefix of prefixes) {
    try {
      el.style.transform = prefix + transform;
      if (el.style.transform !== '') {
        return true;
      }
    } catch (e) {
      // Continue checking other prefixes
    }
  }
  
  return false;
};

// Get vendor prefix for CSS property
export const getVendorPrefix = () => {
  const styles = window.getComputedStyle(document.documentElement, '');
  const pre = (Array.prototype.slice
    .call(styles)
    .join('') 
    .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
  )[1];
  
  return pre ? `-${pre}-` : '';
};

// Apply vendor prefixes to transform string
export const getPrefixedTransform = (transform) => {
  const browserInfo = getBrowserInfo();
  
  // Firefox needs -moz- prefix for some transforms
  if (browserInfo.isFirefox && browserInfo.version < 100) {
    return {
      transform,
      WebkitTransform: transform,
      MozTransform: transform
    };
  }
  
  // WebKit/Safari needs -webkit- prefix
  if (browserInfo.isWebKit || browserInfo.isSafari) {
    return {
      transform,
      WebkitTransform: transform
    };
  }
  
  // Modern Chrome/Edge usually don't need prefixes
  return { transform };
};

// Check for performance.now() support
export const supportsPerformanceNow = () => {
  return window.performance && typeof window.performance.now === 'function';
};

// Polyfill for performance.now()
export const performanceNow = () => {
  if (supportsPerformanceNow()) {
    return window.performance.now();
  }
  // Fallback to Date.now()
  return Date.now();
};

// Check for requestAnimationFrame support
export const supportsRAF = () => {
  return typeof window.requestAnimationFrame === 'function';
};

// Get requestAnimationFrame with vendor prefix
export const getRAF = () => {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         ((callback) => window.setTimeout(callback, 1000 / 60));
};

// Check video codec support
export const supportsVideoCodec = (codec) => {
  const video = document.createElement('video');
  
  // Common codec strings
  const codecs = {
    'h264': 'video/mp4; codecs="avc1.42E01E"',
    'webm': 'video/webm; codecs="vp8, vorbis"',
    'ogg': 'video/ogg; codecs="theora"'
  };
  
  const codecString = codecs[codec] || codec;
  return video.canPlayType(codecString) !== '';
};

// Get supported video format
export const getSupportedVideoFormat = () => {
  if (supportsVideoCodec('h264')) return 'mp4';
  if (supportsVideoCodec('webm')) return 'webm';
  if (supportsVideoCodec('ogg')) return 'ogg';
  return null;
};

// CSS feature detection for specific properties
export const supportsCSSProperty = (property, value) => {
  // Use CSS.supports if available
  if (window.CSS && window.CSS.supports) {
    return CSS.supports(property, value);
  }
  
  // Fallback method
  const el = document.createElement('div');
  el.style[property] = value;
  return el.style[property] !== '';
};

// Get transform origin with vendor prefix
export const getTransformOrigin = (origin) => {
  const browserInfo = getBrowserInfo();
  
  if (browserInfo.isWebKit || browserInfo.isSafari) {
    return {
      transformOrigin: origin,
      WebkitTransformOrigin: origin
    };
  }
  
  if (browserInfo.isFirefox) {
    return {
      transformOrigin: origin,
      MozTransformOrigin: origin
    };
  }
  
  return { transformOrigin: origin };
};

// Debug logging for browser issues
export const logBrowserInfo = () => {
  const info = getBrowserInfo();
  const supports3D = supports3DTransforms();
  const supportsPerf = supportsPerformanceNow();
  const supportsRAFCheck = supportsRAF();
  const videoFormat = getSupportedVideoFormat();
  
  console.group('🌐 Browser Compatibility Check');
  console.log('Browser:', info);
  console.log('3D Transforms:', supports3D ? '✅ Supported' : '❌ Not supported');
  console.log('Performance.now:', supportsPerf ? '✅ Supported' : '⚠️ Using fallback');
  console.log('RequestAnimationFrame:', supportsRAFCheck ? '✅ Supported' : '⚠️ Using fallback');
  console.log('Video Format:', videoFormat || '❌ No supported format');
  console.log('Vendor Prefix:', getVendorPrefix() || 'None needed');
  console.groupEnd();
  
  return {
    browser: info,
    supports3D,
    supportsPerf,
    supportsRAF: supportsRAFCheck,
    videoFormat,
    vendorPrefix: getVendorPrefix()
  };
};

// Export all utilities
export default {
  getBrowserInfo,
  supports3DTransforms,
  supportsTransform,
  getVendorPrefix,
  getPrefixedTransform,
  supportsPerformanceNow,
  performanceNow,
  supportsRAF,
  getRAF,
  supportsVideoCodec,
  getSupportedVideoFormat,
  supportsCSSProperty,
  getTransformOrigin,
  logBrowserInfo
};