import { BreakProgress } from '@/components/BreakProgress';
import { EnsembleRotation } from '@/components/EnsembleRotation';
import { GearIcon } from '@/components/icons/icons';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAppStore } from '@/state.ts/defaultState';
import { restoreNormalWindow } from '@/windowUtils/fullscreen';
import { useEffect } from 'react';

export function Handoff() {
  useEffect(() => {
    restoreNormalWindow();
  }, []);

  const {
    startTurn,
    goToEdit,
  } = useAppStore((state) => ({
    startTurn: state.startTurn,
    goToEdit: state.goToEdit,
  }));

  return (
    <div className="flex flex-col flex-1 min-h-0 p-6 max-w-7xl mx-auto w-full overflow-hidden">
      {/* Header: Break Progress (Left) & Settings (Right) */}
      <div className="flex items-center justify-between w-full h-16 shrink-0">
        <div className="flex-1 max-w-2xl">
          <BreakProgress />
        </div>
        <TooltipProvider>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToEdit}
                className="h-12 w-12 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 shrink-0"
              >
                <GearIcon className="h-8 w-8" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Go to Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Middle: Ensemble Rotation */}
      <div className="w-full shrink-0">
        <EnsembleRotation />
      </div>

      {/* Start Turn Button */}
      <div className="flex-1 w-full min-h-0 pt-12 md:pt-16">
        <Button
          onClick={() => startTurn()}
          className="w-full h-32 md:h-40 text-5xl md:text-6xl font-light tracking-tight bg-emerald-600 hover:bg-emerald-500 border-2 border-emerald-500/50 shadow-[0_0_30px_-5px_var(--tw-shadow-color)] shadow-emerald-900/40 text-white rounded-2xl transition-all transform hover:scale-[1.01]"
        >
          Start Turn
        </Button>
      </div>
    </div>
  );
}
