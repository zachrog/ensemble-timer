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
    RendererWindowBrowser.setIgnoreMouseEvents(false);
  }, []);

  const { takeBreak, skipBreak } = useAppStore((state) => ({
    takeBreak: state.takeBreak,
    skipBreak: state.skipBreak,
  }));
  return (
    <>
      <div className="h-full p-10">
        <Settings className='flex justify-end'/>
        <div className="flex justify-center items-center h-full">
          <Button
            className="hover:bg-zinc-700 flex-grow h-25 text-6xl flex font-thin p-5"
            onClick={() => skipBreak()}
            variant='default'
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
