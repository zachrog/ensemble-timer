import { WindowControls } from './components/WindowControls';
import { EditEnsemble } from './pages/EditEnsemble';
import { TimerOverlay } from './pages/TimerOverlay';
import { useAppStore } from './state.ts/defaultState';
import { Handoff } from '@/pages/Handoff';

function App() {
  const currentMode = useAppStore((state) => state.currentMode);

  return (
    <>
      <div className="bg-zinc-800 antialiased h-screen w-full">
        <WindowControls />
        {currentMode === 'timer' && <TimerOverlay />}
        {currentMode === 'edit' && <EditEnsemble />}
        {currentMode === 'handoff' && <Handoff />}
      </div>
    </>
  );
}

export default App;
