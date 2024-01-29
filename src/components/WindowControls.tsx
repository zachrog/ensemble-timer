import { useState } from 'react';
import { RendererWindowBrowser } from '../communicationBridge/fakeWindowBrowser';
import { useAppStore } from '../state.ts/defaultState';
import { CloseIcon, MinusIcon, WindowIcon } from '@/components/icons/icons';

type WindowState = 'maximized' | 'minimized' | 'default' | 'closed';

export function WindowControls() {
  const [windowState, setWindowState] = useState('default' as WindowState);
  const currentMode = useAppStore((state) => state.currentMode);
  if (currentMode === 'timer' || currentMode === 'break') {
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
          <MinusIcon className="w-10 h-10 p-3" />
        </button>
        <button
          className="hover:bg-zinc-700 text-zinc-300 no-drag"
          onClick={() => {
            if (windowState === 'maximized') {
              setWindowState('default');
              RendererWindowBrowser.restore();
            } else {
              setWindowState('maximized');
              RendererWindowBrowser.maximize();
            }
          }}
        >
          <WindowIcon className="w-10 h-10 p-3" />
        </button>
        <button
          className="hover:bg-red-600 text-zinc-300 no-drag"
          onClick={() => {
            setWindowState('closed');
            RendererWindowBrowser.close();
          }}
        >
          <CloseIcon className="w-10 h-10 p-3" />
        </button>
      </div>
    </header>
  );
}
