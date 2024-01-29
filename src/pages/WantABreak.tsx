import { RendererWindowBrowser } from '@/communicationBridge/fakeWindowBrowser';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/state.ts/defaultState';
import { useEffect } from 'react';

export function WantABreak() {
  useEffect(() => {
    RendererWindowBrowser.setOpacity(1.0);
    RendererWindowBrowser.maximize();
    RendererWindowBrowser.setAlwaysOnTop(false);
    RendererWindowBrowser.setIgnoreMouseEvents(false);
  }, []);

  const { takeBreak, skipBreak } = useAppStore((state) => ({
    takeBreak: state.takeBreak,
    skipBreak: state.skipBreak,
  }));
  return (
    <>
      <Button onClick={() => skipBreak()}>Skip Break</Button>
      <Button onClick={() => takeBreak()}>Take a Break</Button>
    </>
  );
}
