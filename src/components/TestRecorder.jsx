import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, Download, Copy, Clock, Activity } from 'lucide-react';
import { performanceMonitor } from '../utils/performanceMonitor.js';

export const TestRecorder = ({ enabled = false }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [testSession, setTestSession] = useState(null);
  const [sessionData, setSessionData] = useState([]);
  const [copied, setCopied] = useState(false);
  const recordingInterval = useRef();
  const startTime = useRef();

  const startTest = () => {
    const now = new Date();
    startTime.current = now;
    
    setTestSession({
      id: `test-${now.getTime()}`,
      startTime: now.toISOString(),
      startTimestamp: now.getTime(),
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      initialUrl: window.location.href
    });
    
    setSessionData([]);
    setIsRecording(true);
    
    // Start recording at 500ms intervals
    recordingInterval.current = setInterval(recordDataPoint, 500);
  };

  const recordDataPoint = () => {
    const now = Date.now();
    const relativeTime = now - startTime.current.getTime();
    
    // Get performance metrics
    const perfSummary = performanceMonitor.getSummary();
    
    // Get scroll position and helix state
    const helixAssembly = document.querySelector('.helix-assembly');
    const scrollContainer = document.documentElement;
    
    // Measure all visible cards
    const cards = document.querySelectorAll('.helix-node:not([data-orb-index])');
    const cardMeasurements = Array.from(cards).map((card, index) => {
      const rect = card.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(card);
      const actualRatio = rect.width / rect.height;
      
      // Extract transform data
      const transform = computedStyle.transform;
      let rotationY = 0, translationZ = 0;
      try {
        const matrix = new DOMMatrix(transform);
        rotationY = Math.atan2(matrix.m13, matrix.m33) * (180 / Math.PI);
        translationZ = matrix.m43;
      } catch (e) {
        // Fallback if transform parsing fails
      }
      
      const normalizedAngle = ((rotationY + 180) % 360);
      const isFrontFacing = normalizedAngle < 45 || normalizedAngle > 315;
      
      return {
        cardIndex: index,
        dimensions: { width: rect.width, height: rect.height },
        aspectRatio: actualRatio,
        isCorrectRatio: Math.abs(actualRatio - 0.5625) < 0.01,
        rotationY,
        normalizedAngle,
        translationZ,
        isFrontFacing,
        opacity: parseFloat(computedStyle.opacity),
        visibility: rect.width > 0 && rect.height > 0 ? 'visible' : 'hidden'
      };
    });

    // Memory usage (if available)
    let memoryInfo = null;
    if (performance.memory) {
      memoryInfo = {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
      };
    }

    const dataPoint = {
      timestamp: now,
      relativeTime,
      scrollPosition: {
        x: scrollContainer.scrollLeft,
        y: scrollContainer.scrollTop
      },
      performance: {
        fps: perfSummary.averageFPS,
        renderTime: perfSummary.averageRenderTime,
        cacheHitRate: perfSummary.cacheHitRate,
        memory: memoryInfo
      },
      cards: {
        total: cardMeasurements.length,
        visible: cardMeasurements.filter(c => c.visibility === 'visible').length,
        frontFacing: cardMeasurements.filter(c => c.isFrontFacing).length,
        correctRatio: cardMeasurements.filter(c => c.isCorrectRatio).length,
        frontFacingCorrect: cardMeasurements.filter(c => c.isFrontFacing && c.isCorrectRatio).length,
        measurements: cardMeasurements
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio
      },
      interactions: {
        // Could be extended to track mouse/keyboard events
      }
    };

    setSessionData(prev => [...prev, dataPoint]);
  };

  const endTest = () => {
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
    }
    
    setIsRecording(false);
    
    // Finalize test session
    if (testSession) {
      const endTime = new Date();
      const finalSession = {
        ...testSession,
        endTime: endTime.toISOString(),
        endTimestamp: endTime.getTime(),
        duration: endTime.getTime() - testSession.startTimestamp,
        dataPoints: sessionData.length
      };
      setTestSession(finalSession);
    }
  };

  const generateReport = () => {
    if (!testSession || sessionData.length === 0) return null;
    
    // Analyze the session data
    const analysis = {
      session: testSession,
      summary: {
        totalDataPoints: sessionData.length,
        duration: `${Math.round(testSession.duration / 1000)}s`,
        averageFPS: (sessionData.reduce((sum, d) => sum + d.performance.fps, 0) / sessionData.length).toFixed(1),
        averageRenderTime: (sessionData.reduce((sum, d) => sum + d.performance.renderTime, 0) / sessionData.length).toFixed(2),
        averageCacheHitRate: (sessionData.reduce((sum, d) => sum + d.performance.cacheHitRate, 0) / sessionData.length).toFixed(1),
        scrollRange: {
          minY: Math.min(...sessionData.map(d => d.scrollPosition.y)),
          maxY: Math.max(...sessionData.map(d => d.scrollPosition.y)),
          totalScrollDistance: sessionData.reduce((sum, d, i) => {
            if (i === 0) return 0;
            const prevY = sessionData[i-1].scrollPosition.y;
            return sum + Math.abs(d.scrollPosition.y - prevY);
          }, 0)
        },
        aspectRatioSuccess: {
          overall: (sessionData.reduce((sum, d) => sum + (d.cards.correctRatio / d.cards.total * 100), 0) / sessionData.length).toFixed(1),
          frontFacing: sessionData.length > 0 ? (sessionData.reduce((sum, d) => {
            const frontCards = d.cards.frontFacing;
            if (frontCards === 0) return sum;
            return sum + (d.cards.frontFacingCorrect / frontCards * 100);
          }, 0) / sessionData.filter(d => d.cards.frontFacing > 0).length).toFixed(1) : '0'
        }
      },
      timeline: sessionData,
      issues: []
    };
    
    // Identify issues
    const lowFPSPoints = sessionData.filter(d => d.performance.fps < 30);
    if (lowFPSPoints.length > 0) {
      analysis.issues.push({
        type: 'performance',
        severity: 'high',
        description: `Low FPS detected at ${lowFPSPoints.length} points`,
        affectedTimeRange: `${lowFPSPoints[0].relativeTime}ms - ${lowFPSPoints[lowFPSPoints.length-1].relativeTime}ms`
      });
    }
    
    const poorRatioPoints = sessionData.filter(d => (d.cards.correctRatio / d.cards.total) < 0.5);
    if (poorRatioPoints.length > 0) {
      analysis.issues.push({
        type: 'aspect_ratio',
        severity: 'medium', 
        description: `Poor aspect ratio compliance at ${poorRatioPoints.length} points`,
        details: `Less than 50% cards had correct 9:16 ratio`
      });
    }

    return analysis;
  };

  const copyReport = () => {
    const report = generateReport();
    if (report) {
      navigator.clipboard.writeText(JSON.stringify(report, null, 2)).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const downloadReport = () => {
    const report = generateReport();
    if (report) {
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `test-session-${testSession.id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    };
  }, []);

  if (!enabled) return null;

  const report = generateReport();

  return (
    <div className="fixed bottom-4 left-4 bg-black/90 text-white p-4 rounded-lg z-50 min-w-80">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Test Recorder
        </h3>
        {isRecording && (
          <div className="flex items-center gap-1 text-red-400 text-xs">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            REC
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-2 mb-3">
        {!isRecording ? (
          <button
            onClick={startTest}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
          >
            <Play className="w-4 h-4" />
            Start Test
          </button>
        ) : (
          <button
            onClick={endTest}
            className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
          >
            <Square className="w-4 h-4" />
            End Test
          </button>
        )}
      </div>

      {/* Recording Status */}
      {isRecording && (
        <div className="mb-3 p-2 bg-gray-800 rounded text-xs">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-3 h-3" />
            <span>Recording: {Math.round((Date.now() - startTime.current.getTime()) / 1000)}s</span>
          </div>
          <div>Data Points: {sessionData.length}</div>
        </div>
      )}

      {/* Report Summary */}
      {report && !isRecording && (
        <div className="space-y-3">
          <div className="p-3 bg-gray-800 rounded">
            <h4 className="text-sm font-semibold mb-2">Test Summary</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>Duration: <span className="text-blue-300">{report.summary.duration}</span></div>
              <div>Data Points: <span className="text-blue-300">{report.summary.totalDataPoints}</span></div>
              <div>Avg FPS: <span className="text-green-300">{report.summary.averageFPS}</span></div>
              <div>Render Time: <span className="text-yellow-300">{report.summary.averageRenderTime}ms</span></div>
              <div>Cache Hit: <span className="text-purple-300">{report.summary.averageCacheHitRate}%</span></div>
              <div>Scroll: <span className="text-orange-300">{Math.round(report.summary.scrollRange.totalScrollDistance)}px</span></div>
            </div>
            
            <div className="mt-2 pt-2 border-t border-gray-700">
              <div className="text-xs">
                <div>Overall Ratio Success: <span className="text-blue-300">{report.summary.aspectRatioSuccess.overall}%</span></div>
                <div>Front Cards Success: <span className="text-green-300">{report.summary.aspectRatioSuccess.frontFacing}%</span></div>
              </div>
            </div>
            
            {report.issues.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-700">
                <div className="text-xs font-semibold text-red-300 mb-1">Issues Found:</div>
                {report.issues.map((issue, i) => (
                  <div key={i} className="text-xs text-red-200 mb-1">
                    • {issue.description}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={copyReport}
              className="flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs transition-colors"
            >
              <Copy className="w-3 h-3" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={downloadReport}
              className="flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs transition-colors"
            >
              <Download className="w-3 h-3" />
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
};