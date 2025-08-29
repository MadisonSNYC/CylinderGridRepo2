import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for intersection observer
 * Used for lazy loading videos in the helix
 * @param {React.RefObject} elementRef - Reference to the element to observe
 * @param {Object} options - Intersection observer options
 * @returns {Object} - { isIntersecting, hasIntersected }
 */
export const useIntersectionObserver = (
  elementRef,
  {
    threshold = 0.1,
    root = null,
    rootMargin = '200px',
    freezeOnceVisible = false
  } = {}
) => {
  const [entry, setEntry] = useState();
  const [hasIntersected, setHasIntersected] = useState(false);

  const frozen = entry?.isIntersecting && freezeOnceVisible;

  const updateEntry = ([entry]) => {
    setEntry(entry);
    if (entry?.isIntersecting && !hasIntersected) {
      setHasIntersected(true);
    }
  };

  useEffect(() => {
    const node = elementRef?.current;
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !node) return;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(updateEntry, observerParams);

    observer.observe(node);

    return () => observer.disconnect();
  }, [elementRef, threshold, root, rootMargin, frozen]);

  return {
    isIntersecting: !!entry?.isIntersecting,
    hasIntersected,
    entry
  };
};