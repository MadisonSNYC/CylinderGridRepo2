import EnhancedHelixProjectsShowcase from '@/components/EnhancedHelixProjectsShowcase';
import { useEffects } from '@/hooks/useEffects';
import DevPanel from '@/components/DevPanel';

export default function App() {
  const { effects, toggleEffect, resetEffects } = useEffects();
  
  return (
    <main>
      <DevPanel 
        effects={effects}
        onEffectToggle={toggleEffect}
        onReset={resetEffects}
      />
      <EnhancedHelixProjectsShowcase 
        autoRotate={false}
        scrollDriven={false}
        effects={effects}
      />
    </main>
  );
}