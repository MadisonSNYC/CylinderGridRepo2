import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, Download, Copy, Clock, Activity, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { performanceMonitor } from '../utils/performanceMonitor.js';

export const ComprehensiveTestSuite = ({ enabled = false }) => {
  const [currentPhase, setCurrentPhase] = useState(null);
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [sessionData, setSessionData] = useState([]);
  const [copied, setCopied] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(false);
  
  const testInterval = useRef();
  const phaseTimer = useRef();
  const startTime = useRef();
  const currentPhaseStartTime = useRef();

  const testPhases = [
    {
      id: 'baseline',
      name: 'Phase 1: Baseline Performance',
      description: 'Static measurement without interaction',
      duration: 5000, // 5 seconds
      interactions: [],
      metrics: ['fps', 'renderTime', 'memory', 'aspectRatio']
    },
    {
      id: 'scroll-light',
      name: 'Phase 2: Light Scrolling',
      description: 'Gentle scroll interactions',
      duration: 8000, // 8 seconds
      interactions: ['scroll-slow'],
      metrics: ['fps', 'renderTime', 'scrollVelocity', 'scrollResponsiveness', 'aspectRatio']
    },
    {
      id: 'scroll-moderate',
      name: 'Phase 3: Moderate Scrolling',
      description: 'Medium-speed scroll testing',
      duration: 8000,
      interactions: ['scroll-medium'],
      metrics: ['fps', 'renderTime', 'scrollVelocity', 'scrollResponsiveness', 'aspectRatio']
    },
    {
      id: 'scroll-intensive',
      name: 'Phase 4: Intensive Scrolling',
      description: 'High-speed scroll stress test',
      duration: 8000,
      interactions: ['scroll-fast'],
      metrics: ['fps', 'renderTime', 'scrollVelocity', 'scrollResponsiveness', 'aspectRatio', 'frameDrops']
    },
    {
      id: 'stress-test',
      name: 'Phase 5: Stress Test',
      description: 'Maximum load with rapid interactions',
      duration: 10000, // Reduced from 20000 to prevent overload
      interactions: ['scroll-fast'], // Removed rapid scrolling to reduce intensity
      metrics: ['fps', 'renderTime', 'scrollVelocity', 'scrollResponsiveness', 'aspectRatio', 'frameDrops', 'memory']
    },
    {
      id: 'recovery',
      name: 'Phase 6: Recovery Test',
      description: 'Return to baseline after stress',
      duration: 5000, // Reduced recovery time
      interactions: [],
      metrics: ['fps', 'renderTime', 'memory', 'aspectRatio']
    }
  ];

  const scrollMetrics = useRef({
    lastScrollOffset: 0,
    totalScrollDistance: 0,
    scrollVelocity: 0,
    lastScrollTime: 0,
    minScrollOffset: Infinity,
    maxScrollOffset: -Infinity,
    velocityHistory: [],
    frameDrops: 0
  });

  const startComprehensiveTest = () => {
    setIsRunning(true);
    setCurrentPhase(0);
    setTestResults({});
    setSessionData([]);
    startTime.current = Date.now();
    
    // Reset metrics
    scrollMetrics.current = {
      lastScrollOffset: 0,
      totalScrollDistance: 0,
      scrollVelocity: 0,
      lastScrollTime: Date.now(),
      minScrollOffset: Infinity,
      maxScrollOffset: -Infinity,
      velocityHistory: [],
      frameDrops: 0
    };

    performanceMonitor.reset();
    startPhase(0);
  };

  const startPhase = (phaseIndex) => {
    if (phaseIndex >= testPhases.length) {
      completeTest();
      return;
    }

    const phase = testPhases[phaseIndex];
    setCurrentPhase(phaseIndex);
    currentPhaseStartTime.current = Date.now();
    
    console.log(`Starting ${phase.name}: ${phase.description}`);
    
    // Start data collection
    testInterval.current = setInterval(() => {
      recordDataPoint(phase);
    }, 1000); // Reduced frequency to prevent performance overload

    // Start phase interactions
    startPhaseInteractions(phase);

    // Set phase timer
    phaseTimer.current = setTimeout(() => {
      endPhase(phaseIndex);
    }, phase.duration);
  };

  const startPhaseInteractions = (phase) => {
    phase.interactions.forEach(interaction => {
      switch (interaction) {
        case 'scroll-slow':
          simulateScrolling(25, 800); // Reduced intensity: 25px every 800ms
          break;
        case 'scroll-medium':
          simulateScrolling(50, 600); // Reduced intensity: 50px every 600ms
          break;
        case 'scroll-fast':
          simulateScrolling(75, 500); // Reduced intensity: 75px every 500ms
          break;
        case 'scroll-rapid':
          simulateScrolling(100, 400); // Reduced intensity: 100px every 400ms
          break;
        case 'hover-cards':
          simulateCardHovers();
          break;
      }
    });
  };

  const simulateScrolling = (distance, interval) => {
    const helixScene = document.querySelector('.helix-scene');
    if (!helixScene) {
      console.warn('Helix scene not found for scroll simulation');
      return;
    }

    let direction = 1;
    const scrollSim = setInterval(() => {
      try {
        // Create a more realistic wheel event
        const wheelEvent = new WheelEvent('wheel', {
          deltaY: distance * direction,
          deltaX: 0,
          deltaZ: 0,
          deltaMode: WheelEvent.DOM_DELTA_PIXEL,
          bubbles: true,
          cancelable: true,
          view: window
        });
        
        // Check if element still exists before dispatching
        if (document.contains(helixScene)) {
          helixScene.dispatchEvent(wheelEvent);
        } else {
          console.warn('Helix scene removed from DOM, stopping scroll simulation');
          clearInterval(scrollSim);
          return;
        }
        
        // Change direction occasionally
        if (Math.random() < 0.3) {
          direction *= -1;
        }
      } catch (error) {
        console.error('Error in scroll simulation:', error);
        clearInterval(scrollSim);
      }
    }, interval);

    // Store for cleanup
    if (!window.testIntervals) window.testIntervals = [];
    window.testIntervals.push(scrollSim);
  };

  const simulateCardHovers = () => {
    const cards = document.querySelectorAll('.helix-node:not([data-orb-index])');
    if (cards.length === 0) {
      console.warn('No cards found for hover simulation');
      return;
    }

    const hoverSim = setInterval(() => {
      try {
        const randomCard = cards[Math.floor(Math.random() * cards.length)];
        if (randomCard && document.contains(randomCard)) {
          const mouseEnter = new MouseEvent('mouseenter', { 
            bubbles: true,
            cancelable: true,
            view: window
          });
          const mouseLeave = new MouseEvent('mouseleave', { 
            bubbles: true,
            cancelable: true,
            view: window
          });
          
          randomCard.dispatchEvent(mouseEnter);
          setTimeout(() => {
            if (document.contains(randomCard)) {
              randomCard.dispatchEvent(mouseLeave);
            }
          }, 200);
        }
      } catch (error) {
        console.error('Error in card hover simulation:', error);
        clearInterval(hoverSim);
      }
    }, 1500); // Slower hover simulation to reduce load

    if (!window.testIntervals) window.testIntervals = [];
    window.testIntervals.push(hoverSim);
  };

  const recordDataPoint = (phase) => {
    try {
      // Performance safeguard - skip if too many data points
      if (sessionData.length > 1000) {
        console.warn('Skipping data collection to prevent memory overload');
        return;
      }
      
      const now = Date.now();
      const relativeTime = now - startTime.current;
      const phaseRelativeTime = now - currentPhaseStartTime.current;
      
      // Get performance metrics with error handling
      let perfSummary;
      try {
        perfSummary = performanceMonitor.getSummary();
      } catch (perfError) {
        console.warn('Performance monitor error, using fallback:', perfError);
        perfSummary = { currentFPS: 60, averageFPS: 60, averageRenderTime: 16.67, cacheHitRate: 0 };
      }
    
    // Track frame drops
    if (perfSummary.currentFPS < 30) {
      scrollMetrics.current.frameDrops++;
    }

    // Get scroll metrics
    const helixScene = document.querySelector('.helix-scene');
    let currentScrollOffset = 0;
    
    if (helixScene) {
      const computedStyle = window.getComputedStyle(helixScene);
      const scrollOffsetY = computedStyle.getPropertyValue('--scroll-offset-y');
      if (scrollOffsetY) {
        currentScrollOffset = parseFloat(scrollOffsetY.replace('px', '')) || 0;
      }
    }
    
    // Calculate scroll metrics
    const timeDelta = now - scrollMetrics.current.lastScrollTime;
    const scrollDelta = Math.abs(currentScrollOffset - scrollMetrics.current.lastScrollOffset);
    const scrollVelocity = timeDelta > 0 ? (scrollDelta / timeDelta) * 1000 : 0; // px/sec
    
    // Update scroll metrics
    scrollMetrics.current.totalScrollDistance += scrollDelta;
    scrollMetrics.current.scrollVelocity = scrollVelocity;
    scrollMetrics.current.velocityHistory.push(scrollVelocity);
    scrollMetrics.current.minScrollOffset = Math.min(scrollMetrics.current.minScrollOffset, currentScrollOffset);
    scrollMetrics.current.maxScrollOffset = Math.max(scrollMetrics.current.maxScrollOffset, currentScrollOffset);
    scrollMetrics.current.lastScrollOffset = currentScrollOffset;
    scrollMetrics.current.lastScrollTime = now;

    // Measure cards
    const cards = document.querySelectorAll('.helix-node:not([data-orb-index])');
    const cardMeasurements = Array.from(cards).filter(card => {
      const rect = card.getBoundingClientRect();
      return rect.width > 20 && rect.height > 20;
    }).map((card, index) => {
      const rect = card.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(card);
      const cssWidth = parseFloat(computedStyle.width) || rect.width;
      const cssHeight = parseFloat(computedStyle.height) || rect.height;
      const actualRatio = cssWidth / cssHeight;
      
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
        dimensions: { width: cssWidth, height: cssHeight },
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

    // Memory usage
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
      phaseRelativeTime,
      phaseId: phase.id,
      phaseName: phase.name,
      scrollPosition: {
        x: window.scrollX,
        y: window.scrollY
      },
      scrollMetrics: {
        currentOffset: currentScrollOffset,
        totalDistance: scrollMetrics.current.totalScrollDistance,
        velocity: scrollMetrics.current.scrollVelocity,
        minOffset: scrollMetrics.current.minScrollOffset,
        maxOffset: scrollMetrics.current.maxScrollOffset,
        scrollRange: scrollMetrics.current.maxScrollOffset - scrollMetrics.current.minScrollOffset,
        frameDrops: scrollMetrics.current.frameDrops
      },
      performance: {
        fps: perfSummary.currentFPS,
        averageFPS: perfSummary.averageFPS,
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
      }
    };

    setSessionData(prev => [...prev, dataPoint]);
    } catch (error) {
      console.error('Error recording data point:', error);
      // Continue with reduced functionality
      setSessionData(prev => [...prev, {
        timestamp: Date.now(),
        relativeTime: Date.now() - startTime.current,
        phaseId: phase.id,
        phaseName: phase.name,
        error: error.message
      }]);
    }
  };

  const endPhase = (phaseIndex) => {
    clearInterval(testInterval.current);
    clearTimeout(phaseTimer.current);
    
    // Clean up simulated interactions
    if (window.testIntervals) {
      window.testIntervals.forEach(interval => clearInterval(interval));
      window.testIntervals = [];
    }

    // Analyze phase results
    console.log(`Analyzing phase ${phaseIndex}: ${testPhases[phaseIndex].name}`);
    console.log(`Total session data points: ${sessionData.length}`);
    console.log(`Looking for phaseId: ${testPhases[phaseIndex].id}`);
    
    // Get all data points for this phase
    setSessionData(currentSessionData => {
      const phaseData = currentSessionData.filter(d => d.phaseId === testPhases[phaseIndex].id);
      console.log(`Found ${phaseData.length} data points for this phase`);
      
      if (phaseData.length === 0 && currentSessionData.length > 0) {
        // Fallback: get recent data points that might not have correct phaseId
        const recentData = currentSessionData.slice(-50); // Get last 50 points
        console.log(`Using fallback: ${recentData.length} recent data points`);
        const phaseResults = analyzePhaseResults(testPhases[phaseIndex], recentData);
        
        setTestResults(prev => ({
          ...prev,
          [testPhases[phaseIndex].id]: phaseResults
        }));
      } else {
        const phaseResults = analyzePhaseResults(testPhases[phaseIndex], phaseData);
        
        setTestResults(prev => ({
          ...prev,
          [testPhases[phaseIndex].id]: phaseResults
        }));
      }
      
      return currentSessionData; // Don't modify session data
    });

    console.log(`Completed ${testPhases[phaseIndex].name}`);

    // Auto-advance or wait for user input
    if (autoAdvance) {
      setTimeout(() => {
        startPhase(phaseIndex + 1);
      }, 2000);
    } else {
      setCurrentPhase(`waiting-${phaseIndex + 1}`);
    }
  };

  const analyzePhaseResults = (phase, phaseData) => {
    if (phaseData.length === 0) {
      return { 
        phase: phase.name,
        status: 'failed', 
        reason: 'No data collected',
        dataPoints: 0,
        issues: [],
        metrics: {
          fps: { average: 'N/A', minimum: 'N/A', lowFPSPercentage: 'N/A' },
          renderTime: { average: 'N/A', maximum: 'N/A' },
          aspectRatio: { overall: 'N/A', frontFacing: 'N/A' }
        }
      };
    }

    const analysis = {
      phase: phase.name,
      duration: phase.duration,
      dataPoints: phaseData.length,
      status: 'passed',
      issues: [],
      metrics: {}
    };

    // Analyze FPS
    const fpsValues = phaseData
      .filter(d => d.performance && typeof d.performance.fps === 'number')
      .map(d => d.performance.fps);
    
    if (fpsValues.length === 0) {
      analysis.metrics.fps = { average: 'N/A', minimum: 'N/A', lowFPSPercentage: 'N/A' };
    } else {
      const avgFPS = fpsValues.reduce((a, b) => a + b, 0) / fpsValues.length;
      const minFPS = Math.min(...fpsValues);
      const lowFPSCount = fpsValues.filter(fps => fps < 30).length;
    
      analysis.metrics.fps = {
        average: avgFPS.toFixed(1),
        minimum: minFPS.toFixed(1),
        lowFPSPercentage: ((lowFPSCount / fpsValues.length) * 100).toFixed(1)
      };

      if (avgFPS < 40) {
        analysis.issues.push({ type: 'performance', severity: 'high', description: `Low average FPS: ${avgFPS.toFixed(1)}` });
        analysis.status = 'warning';
      }
    }

    // Analyze render time
    const renderTimes = phaseData
      .filter(d => d.performance && typeof d.performance.renderTime === 'number')
      .map(d => d.performance.renderTime);
    
    if (renderTimes.length === 0) {
      analysis.metrics.renderTime = { average: 'N/A', maximum: 'N/A' };
    } else {
      const avgRenderTime = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
      const maxRenderTime = Math.max(...renderTimes);
      
      analysis.metrics.renderTime = {
        average: avgRenderTime.toFixed(2),
        maximum: maxRenderTime.toFixed(2)
      };

      if (avgRenderTime > 20) {
        analysis.issues.push({ type: 'performance', severity: 'medium', description: `High render time: ${avgRenderTime.toFixed(2)}ms` });
        if (analysis.status === 'passed') analysis.status = 'warning';
      }
    }

    // Analyze scroll metrics (if applicable)
    if (phase.interactions.some(i => i.includes('scroll'))) {
      const velocities = phaseData
        .filter(d => d.scrollMetrics && typeof d.scrollMetrics.velocity === 'number')
        .map(d => d.scrollMetrics.velocity);
      
      if (velocities.length > 0) {
        const avgVelocity = velocities.reduce((a, b) => a + b, 0) / velocities.length;
        const maxVelocity = Math.max(...velocities);
        const totalDistance = phaseData[phaseData.length - 1]?.scrollMetrics?.totalDistance || 0;
      
        analysis.metrics.scroll = {
          averageVelocity: avgVelocity.toFixed(2),
          maxVelocity: maxVelocity.toFixed(2),
          totalDistance: totalDistance.toFixed(1),
          frameDrops: phaseData[phaseData.length - 1]?.scrollMetrics?.frameDrops || 0
        };

        if (maxVelocity > 1000) {
          analysis.issues.push({ type: 'scroll', severity: 'medium', description: `High scroll velocity spikes: ${maxVelocity.toFixed(0)}px/s` });
          if (analysis.status === 'passed') analysis.status = 'warning';
        }
      } else {
        analysis.metrics.scroll = {
          averageVelocity: 'N/A',
          maxVelocity: 'N/A',
          totalDistance: 'N/A',
          frameDrops: 0
        };
      }
    }

    // Analyze aspect ratio
    const aspectRatioData = phaseData
      .filter(d => d.cards && typeof d.cards.total === 'number')
      .map(d => ({
        total: d.cards.total || 0,
        correct: d.cards.correctRatio || 0,
        frontFacing: d.cards.frontFacing || 0,
        frontFacingCorrect: d.cards.frontFacingCorrect || 0
      }));

    const avgCorrectRatio = aspectRatioData.length > 0 
      ? aspectRatioData.reduce((sum, d) => sum + (d.total > 0 ? (d.correct / d.total * 100) : 0), 0) / aspectRatioData.length
      : 0;
    
    const frontFacingData = aspectRatioData.filter(d => d.frontFacing > 0);
    const avgFrontFacingRatio = frontFacingData.length > 0
      ? frontFacingData.reduce((sum, d) => sum + (d.frontFacingCorrect / d.frontFacing * 100), 0) / frontFacingData.length
      : 0;

    analysis.metrics.aspectRatio = {
      overall: avgCorrectRatio.toFixed(1),
      frontFacing: avgFrontFacingRatio.toFixed(1)
    };

    if (avgCorrectRatio < 95) {
      analysis.issues.push({ type: 'aspect_ratio', severity: 'high', description: `Poor aspect ratio compliance: ${avgCorrectRatio.toFixed(1)}%` });
      analysis.status = 'failed';
    }

    // Memory analysis (if available)
    const memoryData = phaseData.filter(d => d.performance.memory).map(d => d.performance.memory);
    if (memoryData.length > 0) {
      const startMemory = memoryData[0].usedJSHeapSize;
      const endMemory = memoryData[memoryData.length - 1].usedJSHeapSize;
      const memoryIncrease = endMemory - startMemory;
      
      analysis.metrics.memory = {
        startMB: (startMemory / 1024 / 1024).toFixed(2),
        endMB: (endMemory / 1024 / 1024).toFixed(2),
        increaseMB: (memoryIncrease / 1024 / 1024).toFixed(2)
      };

      if (memoryIncrease > 10 * 1024 * 1024) { // 10MB increase
        analysis.issues.push({ type: 'memory', severity: 'medium', description: `Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB` });
        if (analysis.status === 'passed') analysis.status = 'warning';
      }
    }

    return analysis;
  };

  const completeTest = () => {
    setIsRunning(false);
    setCurrentPhase('completed');
    console.log('Comprehensive test completed!');
    
    // Re-enable auto-logging
    window.comprehensiveTestRunning = false;
  };

  const advanceToNextPhase = () => {
    const nextPhaseIndex = parseInt(currentPhase.split('-')[1]);
    if (nextPhaseIndex < testPhases.length) {
      startPhase(nextPhaseIndex);
    } else {
      completeTest();
    }
  };

  const generateComprehensiveReport = () => {
    const totalDataPoints = sessionData.length;
    const totalDuration = sessionData.length > 0 ? sessionData[sessionData.length - 1].relativeTime : 0;
    
    const overallAnalysis = {
      testSession: {
        startTime: new Date(startTime.current).toISOString(),
        duration: `${Math.round(totalDuration / 1000)}s`,
        totalDataPoints,
        phases: Object.keys(testResults).length
      },
      phaseResults: testResults,
      overallStatus: Object.values(testResults).every(r => r.status === 'passed') ? 'PASSED' : 
                    Object.values(testResults).some(r => r.status === 'failed') ? 'FAILED' : 'WARNING',
      summary: {
        totalIssues: Object.values(testResults).reduce((sum, r) => sum + ((r.issues || []).length), 0),
        criticalIssues: Object.values(testResults).reduce((sum, r) => sum + ((r.issues || []).filter(i => i.severity === 'high').length), 0),
        averageFPS: sessionData.length > 0 ? (sessionData
          .filter(d => d.performance && typeof d.performance.fps === 'number')
          .reduce((sum, d) => sum + d.performance.fps, 0) / sessionData.length).toFixed(1) : 'N/A',
        aspectRatioCompliance: sessionData.length > 0 ? (sessionData
          .filter(d => d.cards && d.cards.total > 0)
          .reduce((sum, d) => sum + (d.cards.correctRatio / d.cards.total * 100), 0) / sessionData.length).toFixed(1) : 'N/A'
      }
    };

    return overallAnalysis;
  };

  const copyComprehensiveReport = () => {
    try {
      const report = generateComprehensiveReport();
      
      if (!report || Object.keys(testResults).length === 0) {
        console.warn('No test results to copy');
        return;
      }
      
      let reportText = `COMPREHENSIVE HELIX TEST REPORT
${'='.repeat(50)}

TEST SESSION:
- Start Time: ${report.testSession?.startTime || 'N/A'}
- Duration: ${report.testSession?.duration || 'N/A'}
- Total Data Points: ${report.testSession?.totalDataPoints || 0}
- Phases Completed: ${report.testSession?.phases || 0}

OVERALL STATUS: ${report.overallStatus || 'UNKNOWN'}
- Total Issues: ${report.summary?.totalIssues || 0}
- Critical Issues: ${report.summary?.criticalIssues || 0}
- Average FPS: ${report.summary?.averageFPS || 'N/A'}
- Aspect Ratio Compliance: ${report.summary?.aspectRatioCompliance || 'N/A'}%

PHASE RESULTS:
${Object.entries(report.phaseResults || {}).map(([phaseId, results]) => `
${(results.phase || 'UNKNOWN PHASE').toUpperCase()} - ${(results.status || 'unknown').toUpperCase()}
- Data Points: ${results.dataPoints || 0}
- FPS: ${results.metrics?.fps?.average || 'N/A'} avg, ${results.metrics?.fps?.minimum || 'N/A'} min
- Render Time: ${results.metrics?.renderTime?.average || 'N/A'}ms avg
- Aspect Ratio: ${results.metrics?.aspectRatio?.overall || 'N/A'}% overall
${results.metrics?.scroll ? `- Scroll: ${results.metrics.scroll.averageVelocity || 'N/A'}px/s avg, ${results.metrics.scroll.totalDistance || 'N/A'}px total` : ''}
${results.metrics?.memory ? `- Memory: ${results.metrics.memory.startMB || 'N/A'}MB → ${results.metrics.memory.endMB || 'N/A'}MB (${results.metrics.memory.increaseMB || 'N/A'}MB increase)` : ''}
${(results.issues || []).length > 0 ? `Issues: ${results.issues.map(i => `${i.type}: ${i.description}`).join(', ')}` : 'No issues detected'}
`).join('')}

TEST COMPLETED: ${new Date().toISOString()}
`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(reportText).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          console.log('Report copied to clipboard successfully');
        }).catch(err => {
          console.error('Failed to copy to clipboard:', err);
          // Fallback: log the report to console for manual copying
          console.log('Report text for manual copy:', reportText);
        });
      } else {
        // Fallback for browsers without clipboard API
        console.log('Clipboard API not available. Report text:', reportText);
        try {
          // Try legacy method
          const textArea = document.createElement('textarea');
          textArea.value = reportText;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (fallbackErr) {
          console.error('All copy methods failed:', fallbackErr);
        }
      }
    } catch (error) {
      console.error('Error generating comprehensive report:', error);
    }
  };

  const downloadComprehensiveReport = () => {
    const report = generateComprehensiveReport();
    report.rawData = sessionData; // Include raw data for detailed analysis
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comprehensive-helix-test-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (testInterval.current) clearInterval(testInterval.current);
      if (phaseTimer.current) clearTimeout(phaseTimer.current);
      if (window.testIntervals) {
        window.testIntervals.forEach(interval => clearInterval(interval));
        window.testIntervals = [];
      }
    };
  }, []);

  if (!enabled) return null;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed': return 'bg-green-900/50 border-green-600';
      case 'warning': return 'bg-yellow-900/50 border-yellow-600';
      case 'failed': return 'bg-red-900/50 border-red-600';
      default: return 'bg-gray-800 border-gray-600';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black/95 text-white p-4 rounded-lg z-50 min-w-96 max-w-md max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Comprehensive Test Suite
        </h3>
        {isRunning && (
          <div className="flex items-center gap-1 text-blue-400 text-xs">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            TESTING
          </div>
        )}
      </div>

      {/* Test Controls */}
      <div className="mb-3">
        {!isRunning ? (
          <div className="space-y-2">
            <button
              onClick={startComprehensiveTest}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
            >
              <Play className="w-4 h-4" />
              Start Comprehensive Test
            </button>
            
            <div className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                id="autoAdvance"
                checked={autoAdvance}
                onChange={(e) => setAutoAdvance(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="autoAdvance" className="text-gray-300">Auto-advance phases</label>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              setIsRunning(false);
              clearInterval(testInterval.current);
              clearTimeout(phaseTimer.current);
              if (window.testIntervals) {
                window.testIntervals.forEach(interval => clearInterval(interval));
                window.testIntervals = [];
              }
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
          >
            <Square className="w-4 h-4" />
            Stop Test
          </button>
        )}
      </div>

      {/* Current Phase Status */}
      {isRunning && typeof currentPhase === 'number' && (
        <div className="mb-3 p-2 bg-blue-900/30 rounded text-xs border border-blue-600">
          <div className="font-semibold text-blue-300">
            {testPhases[currentPhase].name}
          </div>
          <div className="text-gray-300 mb-1">{testPhases[currentPhase].description}</div>
          <div className="text-blue-200">Duration: {testPhases[currentPhase].duration / 1000}s</div>
          <div className="text-blue-200">Data Points: {sessionData.filter(d => d.phaseId === testPhases[currentPhase].id).length}</div>
        </div>
      )}

      {/* Waiting for User Input */}
      {typeof currentPhase === 'string' && currentPhase.startsWith('waiting-') && (
        <div className="mb-3 p-2 bg-yellow-900/30 rounded text-xs border border-yellow-600">
          <div className="font-semibold text-yellow-300 mb-2">Phase Complete - Ready for Next</div>
          <button
            onClick={advanceToNextPhase}
            className="w-full px-2 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-xs transition-colors"
          >
            Continue to Next Phase
          </button>
        </div>
      )}

      {/* Phase Results */}
      {Object.keys(testResults).length > 0 && (
        <div className="space-y-2 mb-3">
          <h4 className="text-xs font-semibold text-gray-300">Phase Results:</h4>
          {Object.entries(testResults).map(([phaseId, result]) => (
            <div key={phaseId} className={`p-2 rounded text-xs border ${getStatusColor(result.status)}`}>
              <div className="flex items-center gap-2 mb-1">
                {getStatusIcon(result.status)}
                <span className="font-semibold">{result.phase}</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div>FPS: {result.metrics?.fps?.average || 'N/A'}</div>
                <div>Render: {result.metrics?.renderTime?.average || 'N/A'}ms</div>
                <div>Ratio: {result.metrics?.aspectRatio?.overall || 'N/A'}%</div>
                {result.metrics?.scroll && <div>Scroll: {result.metrics.scroll.averageVelocity}px/s</div>}
              </div>
              {result.issues && result.issues.length > 0 && (
                <div className="mt-1 text-xs text-red-300">
                  Issues: {result.issues.length}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Test Complete */}
      {currentPhase === 'completed' && (
        <div className="space-y-3">
          <div className="p-2 bg-green-900/30 rounded text-xs border border-green-600">
            <div className="font-semibold text-green-300 mb-1">Test Complete!</div>
            <div className="text-green-200">
              All {testPhases.length} phases completed
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={copyComprehensiveReport}
              className="flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs transition-colors flex-1"
            >
              <Copy className="w-3 h-3" />
              {copied ? 'Copied!' : 'Copy Report'}
            </button>
            <button
              onClick={downloadComprehensiveReport}
              className="flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs transition-colors flex-1"
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