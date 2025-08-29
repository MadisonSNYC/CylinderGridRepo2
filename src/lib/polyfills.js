// Browser polyfills and compatibility fixes

// RequestAnimationFrame polyfill
(function() {
  let lastTime = 0;
  const vendors = ['ms', 'moz', 'webkit', 'o'];
  
  for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || 
                                 window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback) {
      const currTime = new Date().getTime();
      const timeToCall = Math.max(0, 16 - (currTime - lastTime));
      const id = window.setTimeout(function() { 
        callback(currTime + timeToCall); 
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
}());

// Performance.now polyfill
if (!window.performance) {
  window.performance = {};
}

if (!window.performance.now) {
  let nowOffset = Date.now();
  
  if (performance.timing && performance.timing.navigationStart) {
    nowOffset = performance.timing.navigationStart;
  }
  
  window.performance.now = function now() {
    return Date.now() - nowOffset;
  };
}

// CSS.supports polyfill
if (!window.CSS || !window.CSS.supports) {
  window.CSS = window.CSS || {};
  
  window.CSS.supports = function(prop, value) {
    const el = document.createElement('div');
    
    if (value === undefined) {
      // Property syntax: CSS.supports('display: flex')
      const match = prop.match(/([^:]+):(.+)/);
      if (!match) return false;
      prop = match[1].trim();
      value = match[2].trim();
    }
    
    // Convert prop from kebab-case to camelCase
    const camelProp = prop.replace(/-([a-z])/g, function(g) { 
      return g[1].toUpperCase(); 
    });
    
    // Check if property exists
    if (!(camelProp in el.style)) {
      return false;
    }
    
    // Try to set the value
    el.style[camelProp] = value;
    return el.style[camelProp] !== '';
  };
}

// Object.entries polyfill
if (!Object.entries) {
  Object.entries = function(obj) {
    const ownProps = Object.keys(obj);
    let i = ownProps.length;
    const resArray = new Array(i);
    
    while (i--) {
      resArray[i] = [ownProps[i], obj[ownProps[i]]];
    }
    
    return resArray;
  };
}

// Array.from polyfill
if (!Array.from) {
  Array.from = function(arrayLike, mapFn, thisArg) {
    const C = this;
    const items = Object(arrayLike);
    
    if (arrayLike == null) {
      throw new TypeError('Array.from requires an array-like object');
    }
    
    const len = parseInt(items.length) || 0;
    const A = typeof C === 'function' ? new C(len) : new Array(len);
    
    for (let k = 0; k < len; k++) {
      if (k in items) {
        A[k] = mapFn ? mapFn.call(thisArg, items[k], k) : items[k];
      }
    }
    
    A.length = len;
    return A;
  };
}

// IntersectionObserver polyfill check
if (!window.IntersectionObserver) {
  console.warn('IntersectionObserver not supported. Consider adding a polyfill.');
}

// Add vendor prefixes for transform
export function applyTransform(element, transform) {
  if (!element || !transform) return;
  
  const prefixes = ['webkit', 'moz', 'ms', 'o'];
  
  // Try unprefixed first
  element.style.transform = transform;
  
  // Apply vendor prefixes
  prefixes.forEach(prefix => {
    const prefixedProp = prefix + 'Transform';
    if (prefixedProp in element.style) {
      element.style[prefixedProp] = transform;
    }
  });
}

// Add vendor prefixes for animation
export function applyAnimation(element, animation) {
  if (!element || !animation) return;
  
  const prefixes = ['webkit', 'moz', 'ms', 'o'];
  
  // Try unprefixed first
  element.style.animation = animation;
  
  // Apply vendor prefixes
  prefixes.forEach(prefix => {
    const prefixedProp = prefix + 'Animation';
    if (prefixedProp in element.style) {
      element.style[prefixedProp] = animation;
    }
  });
}

// Check for 3D transform support
export function supports3DTransforms() {
  if (!window.getComputedStyle) {
    return false;
  }
  
  const el = document.createElement('div');
  const transforms = [
    'perspective',
    'webkitPerspective',
    'mozPerspective',
    'msPerspective',
    'oPerspective'
  ];
  
  document.body.appendChild(el);
  
  for (let i = 0; i < transforms.length; i++) {
    if (el.style[transforms[i]] !== undefined) {
      document.body.removeChild(el);
      return true;
    }
  }
  
  document.body.removeChild(el);
  return false;
}

// Fix for Safari autoplay
export function enableVideoAutoplay(videoElement) {
  if (!videoElement) return;
  
  // Set required attributes
  videoElement.muted = true;
  videoElement.playsInline = true;
  videoElement.setAttribute('playsinline', 'true');
  videoElement.setAttribute('webkit-playsinline', 'true');
  
  // Try to play
  const playPromise = videoElement.play();
  
  if (playPromise !== undefined) {
    playPromise.catch(error => {
      console.warn('Video autoplay failed:', error);
      // Retry on user interaction
      document.addEventListener('click', function playOnClick() {
        videoElement.play();
        document.removeEventListener('click', playOnClick);
      }, { once: true });
    });
  }
}

// Export for use in other modules
export default {
  applyTransform,
  applyAnimation,
  supports3DTransforms,
  enableVideoAutoplay
};