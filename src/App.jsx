import React, { useState } from 'react';
import { DevPanel } from './components/DevPanel.jsx';
import { EnhancedHelixProjectsShowcase } from './components/EnhancedHelixProjectsShowcase.jsx';
import { HelixProvider } from './contexts/HelixContext.jsx';
import { useEffectsCompat } from './hooks/useMigrationBridge.js';
import { PerformanceMonitor } from './components/PerformanceMonitor.jsx';
import { AspectRatioTest } from './components/AspectRatioTest.jsx';
import { TestRecorder } from './components/TestRecorder.jsx';
import './App.css';

function AppContent() {
  const { effects, toggleEffect, resetEffects, undoEffects, redoEffects, canUndo: canUndoEffects, canRedo: canRedoEffects, setPlacementStrength, setRepeatTurns } = useEffectsCompat();
  const [showAspectTest, setShowAspectTest] = useState(false);
  const [showTestRecorder, setShowTestRecorder] = useState(true);

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
      
      {/* Test Control Buttons */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        <button
          onClick={() => setShowAspectTest(!showAspectTest)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
        >
          {showAspectTest ? 'Hide' : 'Show'} Aspect Test
        </button>
        <button
          onClick={() => setShowTestRecorder(!showTestRecorder)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
        >
          {showTestRecorder ? 'Hide' : 'Show'} Test Recorder
        </button>
      </div>
    </div>
  );
}

// Wrap with provider
function App() {
  return (
    <HelixProvider>
      <AppContent />
    </HelixProvider>
  );
}

export default App;

