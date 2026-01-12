import { CoffeeIcon, GearIcon, RightIcon } from '@/components/icons/icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/state.ts/defaultState';
import { transitionToFullscreen } from '@/windowUtils/fullscreen';
import { useEffect } from 'react';

export function WantABreak() {
  useEffect(() => {
    transitionToFullscreen();
  }, []);

  const { takeBreak, skipBreak, goToEdit } = useAppStore((state) => ({
    takeBreak: state.takeBreak,
    skipBreak: state.skipBreak,
    goToEdit: state.goToEdit,
  }));

  return (
    <div className="flex flex-col flex-1 min-h-0 p-6 gap-6 max-w-7xl mx-auto w-full overflow-hidden justify-center">
      <Card className="bg-zinc-800/50 border-zinc-700 shadow-xl w-full max-w-2xl mx-auto transform transition-all">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-6">
          <div className="space-y-1">
            <CardTitle className="text-3xl text-zinc-100">Break Time?</CardTitle>
            <CardDescription className="text-zinc-400 text-lg">
              Time to rest your eyes and stretch.
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/50"
            onClick={goToEdit}
          >
            <GearIcon className="h-6 w-6" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            className="w-full h-32 text-4xl md:text-5xl font-light tracking-tight bg-emerald-600 hover:bg-emerald-500 border-2 border-emerald-500/50 shadow-[0_0_30px_-5px_var(--tw-shadow-color)] shadow-emerald-900/40 text-white rounded-2xl transition-all transform hover:scale-[1.01] gap-6"
            onClick={() => takeBreak()}
          >
            <span>Take a Break</span>
            <CoffeeIcon className="h-10 w-10 md:h-12 md:w-12" />
          </Button>

          <Button
            className="w-full h-20 text-2xl font-light bg-zinc-900/50 hover:bg-zinc-800 border-2 border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-xl transition-all gap-3"
            onClick={() => skipBreak()}
          >
            <span>Skip Break</span>
            <RightIcon className="h-6 w-6" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
