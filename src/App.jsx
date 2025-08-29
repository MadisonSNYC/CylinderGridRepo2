import React, { useState, useEffect, Suspense } from 'react';
import { DevPanel } from './components/DevPanel.jsx';
import { EnhancedHelixProjectsShowcase } from './components/EnhancedHelixProjectsShowcase.jsx';
import { HelixProvider } from './contexts/HelixContext.jsx';
import { useEffectsCompat } from './hooks/useMigrationBridge.js';
import { PerformanceMonitor } from './components/PerformanceMonitor.jsx';
import { AspectRatioTest } from './components/AspectRatioTest.jsx';
import { TestRecorder } from './components/TestRecorder.jsx';
import { ComprehensiveTestSuite } from './components/ComprehensiveTestSuite.jsx';
// Test dashboards - conditionally loaded in development only
const TestDashboard = import.meta.env.DEV
  ? React.lazy(() => import('./components/TestDashboard.jsx').then(module => ({ default: module.TestDashboard })))
  : () => null;
const AdvancedTestDashboard = import.meta.env.DEV
  ? React.lazy(() => import('./components/AdvancedTestDashboard.jsx').then(module => ({ default: module.AdvancedTestDashboard })))
  : () => null;
const PlaywrightTestDashboard = import.meta.env.DEV
  ? React.lazy(() => import('./components/PlaywrightTestDashboard.jsx').then(module => ({ default: module.PlaywrightTestDashboard })))
  : () => null;
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { logBrowserInfo } from './lib/browserCompat.js';
import './lib/polyfills.js'; // Load polyfills
import './App.css';
import './styles/browser-fixes.css'; // Browser-specific CSS fixes

function AppContent() {
  const { effects, toggleEffect, resetEffects, undoEffects, redoEffects, canUndo: canUndoEffects, canRedo: canRedoEffects, setPlacementStrength, setRepeatTurns } = useEffectsCompat();
  const [showAspectTest, setShowAspectTest] = useState(false);
  const [showTestRecorder, setShowTestRecorder] = useState(false);
  const [showComprehensiveTest, setShowComprehensiveTest] = useState(true);
  
  // Log browser info on mount for debugging
  useEffect(() => {
    console.log('🚀 App loaded - Checking browser compatibility...');
    const browserInfo = logBrowserInfo();
    
    // Warn about potential issues
    if (browserInfo.browser.isFirefox) {
      console.warn('⚠️ Firefox detected - Some 3D transforms may need adjustments');
    } else if (browserInfo.browser.isWebKit || browserInfo.browser.isSafari) {
      console.warn('⚠️ WebKit/Safari detected - Video autoplay and transforms may need adjustments');
    }
    
    if (!browserInfo.supports3D) {
      console.error('❌ 3D transforms not fully supported in this browser!');
    }
  }, []);

  return (
    <div className="App relative">
      <DevPanel 
        effects={effects}
        onEffectToggle={toggleEffect}
        onReset={resetEffects}
        onUndo={undoEffects}
        onRedo={redoEffects}
        canUndo={canUndoEffects}
        canRedo={canRedoEffects}
        setPlacementStrength={setPlacementStrength}
        setRepeatTurns={setRepeatTurns}
      />
      
      <EnhancedHelixProjectsShowcase 
        autoRotate={true}
        scrollDriven={false}
        effects={effects}
        onEffectToggle={toggleEffect}
        onReset={resetEffects}
        onUndo={undoEffects}
        onRedo={redoEffects}
        canUndo={canUndoEffects}
        canRedo={canRedoEffects}
        setPlacementStrength={setPlacementStrength}
        setRepeatTurns={setRepeatTurns}
      />
      
      <PerformanceMonitor showVisual={true} />
      <AspectRatioTest enabled={showAspectTest} />
      <TestRecorder enabled={showTestRecorder} />
      <ComprehensiveTestSuite enabled={showComprehensiveTest} />
      {/* Test dashboards - development only */}
      {import.meta.env.DEV && (
        <Suspense fallback={null}>
          <TestDashboard />
          <AdvancedTestDashboard />
          <PlaywrightTestDashboard />
        </Suspense>
      )}
      
      {/* Test Control Buttons */}
      <div className="fixed bottom-4 left-4 flex flex-col gap-2 z-40">
        <button
          onClick={() => setShowComprehensiveTest(!showComprehensiveTest)}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm transition-colors font-semibold"
          aria-label={`${showComprehensiveTest ? 'Hide' : 'Show'} comprehensive test suite panel`}
        >
          {showComprehensiveTest ? 'Hide' : 'Show'} Comprehensive Test
        </button>
        <button
          onClick={() => setShowAspectTest(!showAspectTest)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
          aria-label={`${showAspectTest ? 'Hide' : 'Show'} aspect ratio test panel`}
        >
          {showAspectTest ? 'Hide' : 'Show'} Aspect Test
        </button>
        <button
          onClick={() => setShowTestRecorder(!showTestRecorder)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
          aria-label={`${showTestRecorder ? 'Hide' : 'Show'} test recorder panel`}
        >
          {showTestRecorder ? 'Hide' : 'Show'} Test Recorder
        </button>
      </div>
    </div>
  );
}

// Wrap with provider and error boundary
function App() {
  return (
    <ErrorBoundary>
      <HelixProvider>
        <AppContent />
      </HelixProvider>
    </ErrorBoundary>
  );
}

export default App;

