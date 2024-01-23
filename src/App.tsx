import { WindowControls } from './components/WindowControls';
import { TimerOverlay } from './pages/TimerOverlay';

function App() {
  return (
    <>
      <div className="bg-zinc-600 antialiased">
        <WindowControls />
        <TimerOverlay />
      </div>
    </>
  );
}

export default App;
