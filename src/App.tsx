import { WantABreak } from '@/pages/WantABreak';
import { WindowControls } from './components/WindowControls';
import { EditEnsemble } from './pages/EditEnsemble';
import { TimerOverlay } from './pages/TimerOverlay';
import { useAppStore } from './state.ts/defaultState';
import { Handoff } from '@/pages/Handoff';

function App() {
  const { currentMode } = useAppStore((state) => ({
    currentMode: state.currentMode,
  }));
  const shouldDisplayTimer = currentMode === 'timer' || currentMode === 'break';
  return (
    <>
      <div className="flex flex-col bg-zinc-800 antialiased h-screen">
        <WindowControls />
        <div className='overflow-hidden'>{shouldDisplayTimer && <TimerOverlay />}</div>
        {currentMode === 'edit' && <EditEnsemble />}
        {currentMode === 'handoff' && <Handoff />}
        {currentMode === 'want-a-break?' && <WantABreak />}
      </div>
    </>
  );
}

export default App;
