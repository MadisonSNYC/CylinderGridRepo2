import { useState, useEffect } from 'react';

/**
 * Hook to detect page visibility changes
 * Pauses animations when tab is hidden to reduce CPU usage
 * @returns {boolean} isVisible - Whether the page is currently visible
 */
export const usePageVisibility = () => {
  const [isVisible, setIsVisible] = useState(!document.hidden);
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
      
      // Log visibility changes for performance monitoring
      if (import.meta.env.DEV) {
        console.log(`Page visibility changed: ${!document.hidden ? 'visible' : 'hidden'}`);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  return isVisible;
};