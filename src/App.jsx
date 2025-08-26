import React from 'react';
import { DevPanel } from './components/DevPanel.jsx';
import { EnhancedHelixProjectsShowcase } from './components/EnhancedHelixProjectsShowcase.jsx';
import { HelixProvider } from './contexts/HelixContext.jsx';
import { useEffectsCompat } from './hooks/useMigrationBridge.js';
import './App.css';

function AppContent() {
  const { effects, toggleEffect, resetEffects, undoEffects, redoEffects, canUndo: canUndoEffects, canRedo: canRedoEffects, setPlacementStrength, setRepeatTurns } = useEffectsCompat();

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

