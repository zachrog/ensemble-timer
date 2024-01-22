import { useState } from 'react';
import { RendererWindowBrowser } from '../communicationBridge/fakeWindowBrowser';

type WindowState = 'maximized' | 'minimized' | 'default' | 'closed';

export function WindowControls() {
  const [windowState, setWindowState] = useState('default' as WindowState);
  const hideWindowControls = false;
  if (hideWindowControls) {
    return;
  }
  return (
    <header>
      <div className="bg-zinc-900 h-10 draggable flex align-middle">
        <div className="flex-grow"></div>
        <button
          className="hover:bg-zinc-700 text-zinc-300 no-drag"
          onClick={() => {
            setWindowState('minimized');
            RendererWindowBrowser.minimize();
          }}
        >
          <MinimizeIcon />
        </button>
        <button
          className="hover:bg-zinc-700 text-zinc-300 no-drag"
          onClick={() => {
            if (windowState === 'default') {
              setWindowState('maximized');
              RendererWindowBrowser.maximize();
            } else {
              setWindowState('default');
              RendererWindowBrowser.restore();
            }
          }}
        >
          <WindowIcon />
        </button>
        <button
          className="hover:bg-red-600 text-zinc-300 no-drag"
          onClick={() => {
            setWindowState('closed');
            RendererWindowBrowser.close();
          }}
        >
          <CloseIcon />
        </button>
      </div>
    </header>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-10 h-10 p-3"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
}

function MinimizeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-10 h-10 p-3"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
    </svg>
  );
}

function WindowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-10 h-10 p-3"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6"
      />
    </svg>
  );
}
