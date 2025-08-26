import React, { useState } from 'react';
import { DevPanel } from './components/DevPanel.jsx';
import { EnhancedHelixProjectsShowcase } from './components/EnhancedHelixProjectsShowcase.jsx';
import { HelixProvider } from './contexts/HelixContext.jsx';
import { useEffectsCompat } from './hooks/useMigrationBridge.js';
import { PerformanceMonitor } from './components/PerformanceMonitor.jsx';
import { AspectRatioTest } from './components/AspectRatioTest.jsx';
import './App.css';

function AppContent() {
  const { effects, toggleEffect, resetEffects, undoEffects, redoEffects, canUndo: canUndoEffects, canRedo: canRedoEffects, setPlacementStrength, setRepeatTurns } = useEffectsCompat();
  const [showAspectTest, setShowAspectTest] = useState(false);

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
      
      {/* Test Toggle Button */}
      <button
        onClick={() => setShowAspectTest(!showAspectTest)}
        className="fixed bottom-20 right-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm z-50"
      >
        {showAspectTest ? 'Hide' : 'Show'} Aspect Test
      </button>
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

