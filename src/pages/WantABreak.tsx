import { RendererWindowBrowser } from '@/communicationBridge/fakeWindowBrowser';
import { Settings } from '@/components/Settings';
import { CoffeeIcon } from '@/components/icons/icons';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/state.ts/defaultState';
import { useEffect } from 'react';

export function WantABreak() {
  useEffect(() => {
    RendererWindowBrowser.setOpacity(1.0);
    RendererWindowBrowser.maximize();
    RendererWindowBrowser.setAlwaysOnTop(false);
    RendererWindowBrowser.focus();
    RendererWindowBrowser.moveTop();
    RendererWindowBrowser.setIgnoreMouseEvents(false);
  }, []);

  const { takeBreak, skipBreak } = useAppStore((state) => ({
    takeBreak: state.takeBreak,
    skipBreak: state.skipBreak,
  }));
  return (
    <>
      <Settings className="flex justify-end m-3" />
      <div className="flex items-center justify-center flex-grow p-3">
        <div className="flex items-center justify-center flex-grow">
          <Button
            className="hover:bg-zinc-700 flex-grow h-25 text-6xl flex font-thin p-5 border-zinc-700 border bg-zinc-900"
            onClick={() => skipBreak()}
          >
            Skip Break
          </Button>
          <div className="w-10"></div>
          <Button
            className="bg-emerald-600 hover:bg-emerald-500 flex-grow h-25 text-6xl flex font-thin p-5"
            onClick={() => takeBreak()}
          >
            <span>Take a Break</span>
            <CoffeeIcon className="h-16 ml-7" />
          </Button>
        </div>
      </div>
    </>
  );
}
