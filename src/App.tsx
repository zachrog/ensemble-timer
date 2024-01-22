import { useState } from 'react';
import { WindowControls } from './components/WindowControls';
import { RendererWindowBrowser } from './communicationBridge/fakeWindowBrowser';

function App() {
  const [opacity, setOpacity] = useState(1);
  return (
    <>
      <div className="bg-zinc-600 antialiased">
        <WindowControls />
        <div>
          <h1 className="bg-green-500">Yo this is the heading</h1>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            const newOpacity = opacity === 1 ? 0.5 : 1;
            setOpacity(newOpacity);
            RendererWindowBrowser.setOpacity(newOpacity);
          }}
        >
          Change Transparency!
        </button>
      </div>
    </>
  );
}

export default App;
