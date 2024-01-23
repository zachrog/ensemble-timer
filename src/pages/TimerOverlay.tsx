import { useEffect } from 'react';
import { RendererWindowBrowser } from '../communicationBridge/fakeWindowBrowser';
import { sendMessage } from '../communicationBridge/rendererCommunicationBridge';
import { customCommandChannelName } from '../../electron/communicationBridge/constants';

export function TimerOverlay() {
  useEffect(() => {
    RendererWindowBrowser.setOpacity(0.5);
    RendererWindowBrowser.setSize(240, 240);
    RendererWindowBrowser.setAlwaysOnTop(true);
    RendererWindowBrowser.setIgnoreMouseEvents(true);
    sendMessage({
      channel: customCommandChannelName,
      message: 'move-to-bottom-right',
    });
  });

  return (
    <>
      <div className="h-60 w-60 bg-zinc-700 text-white-700">
        <h1 className='text-white'>5:00</h1>
      </div>
    </>
  );
}
