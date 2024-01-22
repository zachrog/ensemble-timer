import { useState } from 'react';
import { sendMessage } from './communicationBridge/rendererCommunicationBridge';
import { WindowControls } from './components/mockWindowControls';

function App() {
  const [opacity, setOpacity] = useState(1);
  const [clickCount, setClickCount] = useState(0);
  return (
    <>
      <div className="bg-zinc-600 antialiased">
        <WindowControls />
        <div>
          <h1 className="bg-green-500">Yo this is the heading</h1>
        </div>
        <p>Click Count: {clickCount}</p>
        <button
          onClick={(e) => {
            e.preventDefault();
            const newOpacity = opacity === 1 ? 0.5 : 1;
            setOpacity(newOpacity);
            sendMessage({ action: 'setOpacity', payload: newOpacity });
            setClickCount(clickCount + 1);
          }}
        >
          Change Transparency!
        </button>
      </div>
    </>
  );
}

export default App;
