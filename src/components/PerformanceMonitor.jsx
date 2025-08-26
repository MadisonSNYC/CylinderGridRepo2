// Performance monitoring component with visual display
import React, { useEffect, useRef, useState } from 'react';
import { useHelixPerformance } from '../contexts/HelixContext.jsx';
import { performanceMonitor } from '../utils/performanceMonitor.js';
import { helixPositionCache } from '../utils/helixPositionCache.js';

export function PerformanceMonitor({ showVisual = true }) {
  const { performance, updateFPS } = useHelixPerformance();
  const [metrics, setMetrics] = useState({
    fps: 60,
    avgFPS: 60,
    renderTime: 0,
    cacheHitRate: 0,
    visibleCards: 0,
    totalMemory: 0
  });
  
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  
  useEffect(() => {
    const updateMetrics = () => {
      const now = window.performance.now();
      frameCount.current++;
      
      // Update FPS every second
      if (now - lastTime.current >= 1000) {
        const currentFPS = Math.round(frameCount.current * 1000 / (now - lastTime.current));
        const perfSummary = performanceMonitor.getSummary();
        const cacheStats = helixPositionCache.getStats();
        
        // Update local metrics
        setMetrics({
          fps: currentFPS,
          avgFPS: perfSummary.averageFPS || currentFPS,
          renderTime: perfSummary.averageRenderTime,
          cacheHitRate: perfSummary.cacheHitRate,
          visibleCards: performance?.visibleCards || 0,
          totalMemory: cacheStats.totalMemory
        });
        
        // Update context
        updateFPS(currentFPS, perfSummary.averageFPS);
        
        // Measure FPS for performance monitor
        performanceMonitor.measureFPS();
        
        frameCount.current = 0;
        lastTime.current = now;
      }
      
      requestAnimationFrame(updateMetrics);
    };
    
    const rafId = requestAnimationFrame(updateMetrics);
    return () => cancelAnimationFrame(rafId);
  }, [performance, updateFPS]);
  
  if (!showVisual) return null;
  
  // Determine performance status
  const getStatusColor = (fps) => {
    if (fps >= 55) return 'text-green-400';
    if (fps >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  const getStatusLabel = (fps) => {
    if (fps >= 55) return 'Excellent';
    if (fps >= 40) return 'Good';
    if (fps >= 30) return 'Fair';
    return 'Poor';
  };
  
  return (
    <div className="fixed bottom-4 right-4 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-3 shadow-lg z-50 min-w-[200px]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-white uppercase tracking-wide">Performance</h3>
        <span className={`text-xs font-mono ${getStatusColor(metrics.fps)}`}>
          {getStatusLabel(metrics.fps)}
        </span>
      </div>
      
      <div className="space-y-1">
        {/* FPS Display */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">FPS</span>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-mono ${getStatusColor(metrics.fps)}`}>
              {metrics.fps}
            </span>
            <span className="text-xs text-gray-500">
              (avg: {metrics.avgFPS})
            </span>
          </div>
        </div>
        
        {/* Render Time */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">Render</span>
          <span className="text-xs font-mono text-gray-300">
            {metrics.renderTime.toFixed(2)}ms
          </span>
        </div>
        
        {/* Cache Hit Rate */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">Cache</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-300">
              {metrics.cacheHitRate}%
            </span>
            <div className="w-12 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${metrics.cacheHitRate}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Memory Usage */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">Memory</span>
          <span className="text-xs font-mono text-gray-300">
            {(metrics.totalMemory / 1024).toFixed(1)}KB
          </span>
        </div>
        
        {/* FPS Graph */}
        <div className="mt-2 pt-2 border-t border-gray-700">
          <FPSGraph fps={metrics.fps} />
        </div>
      </div>
    </div>
  );
}

// Mini FPS graph component
function FPSGraph({ fps }) {
  const [history, setHistory] = useState(new Array(20).fill(60));
  
  useEffect(() => {
    setHistory(prev => [...prev.slice(1), fps]);
  }, [fps]);
  
  const maxFPS = 60;
  const graphHeight = 20;
  
  return (
    <div className="flex items-end gap-px h-5">
      {history.map((value, i) => {
        const height = (value / maxFPS) * graphHeight;
        const color = value >= 55 ? 'bg-green-500' : value >= 40 ? 'bg-yellow-500' : 'bg-red-500';
        
        return (
          <div
            key={i}
            className={`w-1 ${color} opacity-70 transition-all duration-300`}
            style={{ height: `${height}px` }}
          />
        );
      })}
    </div>
  );
}