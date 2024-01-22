import { useState } from 'react';
import { sendMessage } from './communicationBridge/rendererCommunicationBridge';

function App() {
  const [opacity, setOpacity] = useState(1)
  return (
    <>
      <div>
        <h1 className="bg-green-500">Yo this is the heading</h1>
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          const newOpacity = opacity === 1 ? 0.5 : 1;
          setOpacity(newOpacity);
          sendMessage({ type: 'setOpacity', payload: newOpacity });
        }}
      >
        Change Transparency!
      </button>
    </>
  );
}

export default App;
