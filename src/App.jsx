import React from 'react';
import { DevPanel } from './components/DevPanel.jsx';
import { EnhancedHelixProjectsShowcase } from './components/EnhancedHelixProjectsShowcase.jsx';
import { useEffects } from './hooks/useEffects.js';
import './App.css';

function App() {
  const { effects, toggleEffect, resetEffects } = useEffects();

  return (
    <div className="App relative">
      <DevPanel 
        effects={effects}
        onEffectToggle={toggleEffect}
        onReset={resetEffects}
      />
      
      <EnhancedHelixProjectsShowcase 
        autoRotate={true}
        scrollDriven={false}
        effects={effects}
      />
    </div>
  );
}

export default App;

