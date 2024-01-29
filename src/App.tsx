import { WantABreak } from '@/pages/WantABreak';
import { WindowControls } from './components/WindowControls';
import { EditEnsemble } from './pages/EditEnsemble';
import { TimerOverlay } from './pages/TimerOverlay';
import { useAppStore } from './state.ts/defaultState';
import { Handoff } from '@/pages/Handoff';

function App() {
  const currentMode = useAppStore((state) => state.currentMode);
  const shouldDisplayTimer = currentMode === 'timer' || currentMode === 'break';
  return (
    <>
      <div className="bg-zinc-800 antialiased h-screen w-full">
        <WindowControls />
        {shouldDisplayTimer && <TimerOverlay />}
        {currentMode === 'edit' && <EditEnsemble />}
        {currentMode === 'handoff' && <Handoff />}
        {currentMode === 'want-a-break?' && <WantABreak />}
      </div>
    </>
  );
}

export default App;
