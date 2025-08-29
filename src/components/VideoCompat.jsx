import React, { useEffect, useRef, useState } from 'react';
import { getBrowserInfo } from '../lib/browserCompat.js';
import { enableVideoAutoplay } from '../lib/polyfills.js';

// Cross-browser compatible video component
export const VideoCompat = ({ src, className, style, ...props }) => {
  const videoRef = useRef(null);
  const [error, setError] = useState(false);
  const [fallbackSrc, setFallbackSrc] = useState(null);
  const browserInfo = getBrowserInfo();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Enable autoplay for Safari
    if (browserInfo.browser.isSafari || browserInfo.browser.isWebKit) {
      enableVideoAutoplay(video);
    }

    // Firefox-specific handling
    if (browserInfo.browser.isFirefox) {
      // Force video reload for Firefox
      video.load();
      
      // Add Firefox-specific attributes
      video.setAttribute('moz-opaque', '');
    }

    // Handle video errors
    const handleError = (e) => {
      console.error('Video error:', e);
      setError(true);
      
      // Try fallback formats
      if (src.endsWith('.mp4') && !fallbackSrc) {
        // Try WebM for Firefox
        const webmSrc = src.replace('.mp4', '.webm');
        setFallbackSrc(webmSrc);
      }
    };

    // Handle successful load
    const handleLoadedData = () => {
      setError(false);
      console.log('Video loaded successfully');
    };

    video.addEventListener('error', handleError);
    video.addEventListener('loadeddata', handleLoadedData);

    // Attempt to play
    const playVideo = async () => {
      try {
        await video.play();
      } catch (err) {
        console.warn('Autoplay failed, will play on user interaction:', err);
        
        // Add click-to-play fallback
        const playOnInteraction = () => {
          video.play();
          document.removeEventListener('click', playOnInteraction);
          document.removeEventListener('touchstart', playOnInteraction);
        };
        
        document.addEventListener('click', playOnInteraction, { once: true });
        document.addEventListener('touchstart', playOnInteraction, { once: true });
      }
    };

    // Delay play attempt to ensure video is ready
    setTimeout(playVideo, 100);

    return () => {
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [src, fallbackSrc, browserInfo]);

  // Fallback image for video errors
  if (error && !fallbackSrc) {
    return (
      <div 
        className={className}
        style={{
          ...style,
          backgroundColor: '#1a1a1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666'
        }}
      >
        <span>Video unavailable</span>
      </div>
    );
  }

  // Browser-specific styles
  const videoStyle = {
    ...style,
    // Firefox fixes
    ...(browserInfo.browser.isFirefox && {
      transform: 'translateZ(0)',
      backfaceVisibility: 'hidden'
    }),
    // Safari/WebKit fixes
    ...(browserInfo.browser.isSafari && {
      '-webkit-transform': 'translateZ(0)',
      '-webkit-backface-visibility': 'hidden',
      '-webkit-mask-image': '-webkit-radial-gradient(white, black)'
    })
  };

  return (
    <video
      ref={videoRef}
      className={className}
      style={videoStyle}
      src={fallbackSrc || src}
      autoPlay
      muted
      loop
      playsInline
      webkit-playsinline="true"
      x5-playsinline="true"
      {...props}
    >
      {/* Provide multiple sources for better compatibility */}
      {!fallbackSrc && (
        <>
          <source src={src} type="video/mp4" />
          {src.endsWith('.mp4') && (
            <source src={src.replace('.mp4', '.webm')} type="video/webm" />
          )}
        </>
      )}
      Your browser does not support the video tag.
    </video>
  );
};