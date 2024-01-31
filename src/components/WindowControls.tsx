import { RendererWindowBrowser } from '../communicationBridge/fakeWindowBrowser';
import { useAppStore } from '../state.ts/defaultState';
import { CloseIcon, MinusIcon, WindowIcon } from '@/components/icons/icons';
import { sendMessage } from '@/communicationBridge/rendererCommunicationBridge';
import { customCommandChannelName } from '../../electron/communicationBridge/constants';

export function WindowControls() {
  const currentMode = useAppStore((state) => state.currentMode);
  if (currentMode === 'timer' || currentMode === 'break') {
    return;
  }
  return (
    <header className="flex align-middle bg-zinc-900 h-10 draggable">
      <div className="flex-grow"></div>
      <button
        className="hover:bg-zinc-700 text-zinc-300 no-drag"
        onClick={() => {
          RendererWindowBrowser.minimize();
        }}
      >
        <MinusIcon className="w-10 h-10 p-3" />
      </button>
      <button
        className="hover:bg-zinc-700 text-zinc-300 no-drag"
        onClick={() => {
          sendMessage({
            channel: customCommandChannelName,
            message: 'toggle-maximize',
          });
        }}
      >
        <WindowIcon className="w-10 h-10 p-3" />
      </button>
      <button
        className="hover:bg-red-600 text-zinc-300 no-drag"
        onClick={() => {
          RendererWindowBrowser.close();
        }}
      >
        <CloseIcon className="w-10 h-10 p-3" />
      </button>
    </header>
  );
}
