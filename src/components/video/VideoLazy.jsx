import React, { useState, useRef, useEffect } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

/**
 * Lazy-loading video component with thumbnail placeholder
 * Reduces initial load from 311MB to <50MB
 * Part of Phase 1: Emergency Video Lazy Loading
 */
export const VideoLazy = React.memo(({ 
  src, 
  thumbnail,
  className = '',
  style = {},
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
  onLoad,
  onError,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  
  // Use intersection observer to detect when video enters viewport
  const { hasIntersected } = useIntersectionObserver(containerRef, {
    threshold: 0.1,
    rootMargin: '200px', // Start loading 200px before entering viewport
    freezeOnceVisible: true // Don't unload once loaded
  });

  useEffect(() => {
    if (hasIntersected && !isLoaded && !hasError) {
      // Mark as loaded to start rendering video element
      setIsLoaded(true);
      
      // Performance mark for measuring load time
      if (performance && performance.mark) {
        performance.mark(`video-load-start-${src}`);
      }
    }
  }, [hasIntersected, isLoaded, hasError, src]);

  // Handle video load completion
  const handleVideoLoad = (e) => {
    if (performance && performance.mark && performance.measure) {
      performance.mark(`video-load-end-${src}`);
      performance.measure(
        `video-load-${src}`,
        `video-load-start-${src}`,
        `video-load-end-${src}`
      );
    }
    
    if (onLoad) onLoad(e);
    
    // Auto-play if needed (handles browser restrictions)
    if (autoPlay && videoRef.current) {
      videoRef.current.play().catch(err => {
        console.warn('Video autoplay failed, will play on user interaction:', err);
      });
    }
  };

  // Handle video error
  const handleVideoError = (e) => {
    console.error('Video failed to load:', src);
    setHasError(true);
    if (onError) onError(e);
  };

  // Generate thumbnail path if not provided
  const getThumbnailSrc = () => {
    if (thumbnail) return thumbnail;
    
    // Generate thumbnail path from video path
    // e.g., /assets/projects/video.mp4 -> /assets/projects/thumbnails/video.jpg
    const videoName = src.split('/').pop().replace('.mp4', '');
    return `/assets/projects/thumbnails/${videoName}.jpg`;
  };

  return (
    <div 
      ref={containerRef}
      className={`video-lazy-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        ...style
      }}
      data-video-loaded={isLoaded}
    >
      {!isLoaded ? (
        // Show thumbnail placeholder before video loads
        <div 
          className="video-placeholder"
          style={{
            width: '100%',
            height: '100%',
            background: `url(${getThumbnailSrc()}) center/cover no-repeat`,
            backgroundColor: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {!thumbnail && (
            <div style={{ 
              color: '#666', 
              fontSize: '12px',
              padding: '10px',
              textAlign: 'center'
            }}>
              Loading video...
            </div>
          )}
        </div>
      ) : hasError ? (
        // Show error state if video fails to load
        <div 
          className="video-error"
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
            fontSize: '12px'
          }}
        >
          Video unavailable
        </div>
      ) : (
        // Render actual video once in viewport
        <video
          ref={videoRef}
          className="lazy-loaded-video"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          src={src}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          preload="metadata"
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
          {...props}
        />
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for memo - only re-render if src changes
  return prevProps.src === nextProps.src;
});

VideoLazy.displayName = 'VideoLazy';