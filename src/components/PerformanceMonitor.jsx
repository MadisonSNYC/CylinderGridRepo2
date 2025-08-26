// Performance monitoring component with visual display
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useHelixPerformance } from '../contexts/HelixContext.jsx';
import { performanceMonitor } from '../utils/performanceMonitor.js';
import { helixPositionCache } from '../utils/helixPositionCache.js';
import { Download, FileText, X, ChevronUp, ChevronDown } from 'lucide-react';

export function PerformanceMonitor({ showVisual = true }) {
  const { performance: perfState, updateFPS } = useHelixPerformance();
  const [metrics, setMetrics] = useState({
    fps: 60,
    avgFPS: 60,
    renderTime: 0,
    cacheHitRate: 0,
    visibleCards: 0,
    totalMemory: 0
  });
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const metricsHistory = useRef([]);
  const sessionStartTime = useRef(Date.now());
  
  const frameCount = useRef(0);
  const lastTime = useRef(window.performance.now());
  
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
        const newMetrics = {
          fps: currentFPS,
          avgFPS: perfSummary.averageFPS || currentFPS,
          renderTime: perfSummary.averageRenderTime,
          cacheHitRate: perfSummary.cacheHitRate,
          visibleCards: perfState?.visibleCards || 0,
          totalMemory: cacheStats.totalMemory
        };
        
        setMetrics(newMetrics);
        
        // Store metrics history for report generation
        metricsHistory.current.push({
          ...newMetrics,
          timestamp: Date.now()
        });
        
        // Keep only last 1000 entries
        if (metricsHistory.current.length > 1000) {
          metricsHistory.current.shift();
        }
        
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
  }, [perfState, updateFPS]);
  
  // Generate performance report
  const generateReport = useCallback(() => {
    const sessionDuration = (Date.now() - sessionStartTime.current) / 1000; // in seconds
    const history = metricsHistory.current;
    
    if (history.length === 0) {
      return {
        error: 'No metrics collected yet'
      };
    }
    
    // Calculate statistics
    const avgFPS = history.reduce((sum, m) => sum + m.fps, 0) / history.length;
    const minFPS = Math.min(...history.map(m => m.fps));
    const maxFPS = Math.max(...history.map(m => m.fps));
    
    const avgRenderTime = history.reduce((sum, m) => sum + m.renderTime, 0) / history.length;
    const maxRenderTime = Math.max(...history.map(m => m.renderTime));
    
    const avgCacheHitRate = history.reduce((sum, m) => sum + m.cacheHitRate, 0) / history.length;
    const avgMemory = history.reduce((sum, m) => sum + m.totalMemory, 0) / history.length;
    
    return {
      sessionInfo: {
        duration: `${Math.floor(sessionDuration / 60)}m ${Math.floor(sessionDuration % 60)}s`,
        samplesCollected: history.length,
        timestamp: new Date().toISOString()
      },
      fpsStats: {
        average: avgFPS.toFixed(1),
        min: minFPS,
        max: maxFPS,
        current: metrics.fps
      },
      renderStats: {
        average: avgRenderTime.toFixed(2) + 'ms',
        max: maxRenderTime.toFixed(2) + 'ms',
        current: metrics.renderTime.toFixed(2) + 'ms'
      },
      cacheStats: {
        hitRate: avgCacheHitRate.toFixed(1) + '%',
        currentMemory: (metrics.totalMemory / 1024).toFixed(1) + 'KB',
        avgMemory: (avgMemory / 1024).toFixed(1) + 'KB'
      }
    };
  }, [metrics]);
  
  // Download report as JSON
  const downloadReport = useCallback(() => {
    const report = generateReport();
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [generateReport]);
  
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
    <>
      {/* Main Performance Monitor */}
      <div className="fixed bottom-4 right-4 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg z-50" 
           style={{ width: '280px', maxHeight: isCollapsed ? '40px' : '320px' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-700 cursor-pointer overflow-hidden"
             onClick={() => setIsCollapsed(!isCollapsed)}>
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wide truncate">Performance</h3>
            <span className={`text-xs font-mono flex-shrink-0 ${getStatusColor(metrics.fps)}`}>
              {getStatusLabel(metrics.fps)}
            </span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowReport(true);
              }}
              className="p-1 hover:bg-gray-800 rounded transition-colors flex-shrink-0"
              title="Generate Report"
            >
              <FileText className="w-3 h-3 text-gray-400" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                downloadReport();
              }}
              className="p-1 hover:bg-gray-800 rounded transition-colors flex-shrink-0"
              title="Download Report"
            >
              <Download className="w-3 h-3 text-gray-400" />
            </button>
            {isCollapsed ? (
              <ChevronUp className="w-3 h-3 text-gray-400 flex-shrink-0" />
            ) : (
              <ChevronDown className="w-3 h-3 text-gray-400 flex-shrink-0" />
            )}
          </div>
        </div>
      
        {/* Content */}
        {!isCollapsed && (
          <div className="p-3 space-y-2" style={{ maxHeight: '250px', overflowY: 'auto', overflowX: 'hidden' }}>
            {/* FPS Display */}
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">FPS</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-mono ${getStatusColor(metrics.fps)}`}>
                  {metrics.fps}
                </span>
                <span className="text-xs text-gray-500">
                  ({metrics.avgFPS})
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
                    style={{ width: `${Math.min(100, metrics.cacheHitRate)}%` }}
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
            <div className="pt-2 border-t border-gray-700 overflow-hidden">
              <FPSGraph fps={metrics.fps} />
            </div>
          </div>
        )}
      </div>
      
      {/* Report Modal */}
      {showReport && (
        <ReportModal 
          report={generateReport()} 
          onClose={() => setShowReport(false)}
          onDownload={downloadReport}
        />
      )}
    </>
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
    <div className="flex items-end gap-px h-5 w-full overflow-hidden">
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

// Report Modal Component
function ReportModal({ report, onClose, onDownload }) {
  const [showJson, setShowJson] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  
  const copyToClipboard = () => {
    const jsonText = JSON.stringify(report, null, 2);
    navigator.clipboard.writeText(jsonText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  if (report.error) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md">
          <h2 className="text-lg font-bold text-white mb-4">Performance Report</h2>
          <p className="text-red-400">{report.error}</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-2xl max-h-[80vh] overflow-y-auto" 
           onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Performance Report</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowJson(!showJson)}
              className="px-3 py-1 text-xs bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors"
            >
              {showJson ? 'View Stats' : 'View JSON'}
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-800 rounded transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
        
        {showJson ? (
          /* JSON Text View */
          <div className="mb-6">
            <div className="bg-gray-800/50 rounded-lg p-4 relative">
              <pre className="text-xs text-gray-300 font-mono whitespace-pre overflow-x-auto select-all">
{JSON.stringify(report, null, 2)}
              </pre>
              {copied && (
                <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                  Copied!
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Stats View */
          <>
            {/* Session Info */}
            <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-400 mb-3">Session Information</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-400">Duration:</span>
                  <span className="ml-2 text-white">{report.sessionInfo.duration}</span>
                </div>
                <div>
                  <span className="text-gray-400">Samples:</span>
                  <span className="ml-2 text-white">{report.sessionInfo.samplesCollected}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400">Generated:</span>
                  <span className="ml-2 text-white">{new Date(report.sessionInfo.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            {/* FPS Statistics */}
            <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
              <h3 className="text-sm font-semibold text-green-400 mb-3">FPS Performance</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-400">Average:</span>
                  <span className="ml-2 text-white font-mono">{report.fpsStats.average}</span>
                </div>
                <div>
                  <span className="text-gray-400">Current:</span>
                  <span className="ml-2 text-white font-mono">{report.fpsStats.current}</span>
                </div>
                <div>
                  <span className="text-gray-400">Min:</span>
                  <span className="ml-2 text-white font-mono">{report.fpsStats.min}</span>
                </div>
                <div>
                  <span className="text-gray-400">Max:</span>
                  <span className="ml-2 text-white font-mono">{report.fpsStats.max}</span>
                </div>
              </div>
            </div>
            
            {/* Render Statistics */}
            <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
              <h3 className="text-sm font-semibold text-yellow-400 mb-3">Render Performance</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-400">Average:</span>
                  <span className="ml-2 text-white font-mono">{report.renderStats.average}</span>
                </div>
                <div>
                  <span className="text-gray-400">Current:</span>
                  <span className="ml-2 text-white font-mono">{report.renderStats.current}</span>
                </div>
                <div>
                  <span className="text-gray-400">Max:</span>
                  <span className="ml-2 text-white font-mono">{report.renderStats.max}</span>
                </div>
              </div>
            </div>
            
            {/* Cache Statistics */}
            <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
              <h3 className="text-sm font-semibold text-purple-400 mb-3">Cache & Memory</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-400">Hit Rate:</span>
                  <span className="ml-2 text-white font-mono">{report.cacheStats.hitRate}</span>
                </div>
                <div>
                  <span className="text-gray-400">Current Memory:</span>
                  <span className="ml-2 text-white font-mono">{report.cacheStats.currentMemory}</span>
                </div>
                <div>
                  <span className="text-gray-400">Avg Memory:</span>
                  <span className="ml-2 text-white font-mono">{report.cacheStats.avgMemory}</span>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onDownload}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download JSON
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}