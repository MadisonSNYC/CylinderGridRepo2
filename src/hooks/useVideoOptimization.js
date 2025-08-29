// Video optimization hook for performance
// Manages video playback based on visibility and performance

import { useEffect, useRef, useCallback } from 'react';

export function useVideoOptimization(videoRef, isVisible, normalizedAngle) {
  const playPromise = useRef(null);
  const lastPlayState = useRef(null);
  
  // Determine if video should play based on position
  const shouldPlay = useCallback(() => {
    // Only play if visible and in the front hemisphere
    if (!isVisible) return false;
    return normalizedAngle < 90 || normalizedAngle > 270;
  }, [isVisible, normalizedAngle]);
  
  // Optimized play/pause logic
  useEffect(() => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    const shouldVideoPlay = shouldPlay();
    
    // Avoid redundant state changes
    if (lastPlayState.current === shouldVideoPlay) return;
    lastPlayState.current = shouldVideoPlay;
    
    const handlePlayback = async () => {
      try {
        if (shouldVideoPlay) {
          // Cancel any pending pause
          if (playPromise.current) {
            await playPromise.current;
          }
          
          // Only play if not already playing
          if (video.paused) {
            // Set quality based on performance
            if (video.playbackRate !== 1) {
              video.playbackRate = 1;
            }
            
            playPromise.current = video.play();
            await playPromise.current;
          }
        } else {
          // Cancel any pending play
          if (playPromise.current) {
            await playPromise.current;
          }
          
          // Only pause if not already paused
          if (!video.paused) {
            video.pause();
            // Reset to beginning for memory optimization
            if (normalizedAngle > 135 && normalizedAngle < 225) {
              video.currentTime = 0;
            }
          }
        }
      } catch (error) {
        // Silently handle play/pause errors
        if (error.name !== 'AbortError') {
          console.debug('Video playback error:', error);
        }
      } finally {
        playPromise.current = null;
      }
    };
    
    handlePlayback();
    
    return () => {
      // Cleanup: pause video when component unmounts
      if (video && !video.paused) {
        video.pause();
      }
    };
  }, [shouldPlay, normalizedAngle]);
  
  // Preload optimization
  useEffect(() => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    
    // Set preload strategy based on visibility
    if (normalizedAngle < 135 || normalizedAngle > 225) {
      video.preload = 'auto'; // Preload for potentially visible cards
    } else {
      video.preload = 'none'; // Don't preload back cards
    }
  }, [normalizedAngle]);
  
  // Quality adjustment based on performance
  const adjustQuality = useCallback((quality) => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    
    switch (quality) {
      case 'low':
        video.playbackRate = 0.75; // Slightly slower to reduce decode load
        break;
      case 'medium':
        video.playbackRate = 1;
        break;
      case 'high':
        video.playbackRate = 1;
        break;
      default:
        video.playbackRate = 1;
    }
  }, []);
  
  return {
    shouldPlay: shouldPlay(),
    adjustQuality
  };
}

// Batch video loading manager
export class VideoLoadManager {
  constructor(maxConcurrent = 3) {
    this.maxConcurrent = maxConcurrent;
    this.loading = new Set();
    this.queue = [];
  }
  
  async loadVideo(videoElement) {
    if (this.loading.size >= this.maxConcurrent) {
      // Queue this video
      return new Promise((resolve) => {
        this.queue.push({ element: videoElement, resolve });
      });
    }
    
    this.loading.add(videoElement);
    
    try {
      await videoElement.load();
    } finally {
      this.loading.delete(videoElement);
      this.processQueue();
    }
  }
  
  processQueue() {
    if (this.queue.length === 0) return;
    if (this.loading.size >= this.maxConcurrent) return;
    
    const { element, resolve } = this.queue.shift();
    this.loadVideo(element).then(resolve);
  }
  
  clearQueue() {
    this.queue = [];
    this.loading.clear();
  }
}

// Global video load manager instance
export const videoLoadManager = new VideoLoadManager(3);