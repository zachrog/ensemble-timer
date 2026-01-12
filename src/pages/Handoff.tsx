import { BreakProgress } from '@/components/BreakProgress';
import { EnsembleRotationDisplay } from '@/components/EnsembleRotationDisplay';
import { GearIcon } from '@/components/icons/icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/state.ts/defaultState';
import { transitionToFullscreen } from '@/windowUtils/fullscreen';
import { useEffect } from 'react';

export function Handoff() {
  useEffect(() => {
    transitionToFullscreen();
  }, []);

  const {
    startTurn,
    goToEdit,
  } = useAppStore((state) => ({
    startTurn: state.startTurn,
    goToEdit: state.goToEdit,
  }));

  return (
    <div className="flex flex-col flex-1 min-h-0 p-6 gap-6 max-w-7xl mx-auto w-full overflow-hidden">
      {/* Hero Section - Continue Button */}
      <section className="flex flex-col gap-6 w-full">
        <Button
          onClick={() => startTurn()}
          className="w-full h-32 md:h-40 text-5xl md:text-6xl font-light tracking-tight bg-emerald-600 hover:bg-emerald-500 border-2 border-emerald-500/50 shadow-[0_0_30px_-5px_var(--tw-shadow-color)] shadow-emerald-900/40 text-white rounded-2xl transition-all transform hover:scale-[1.01]"
        >
          Start Turn
        </Button>
      </section>

      {/* Main Content Card */}
      <Card className="bg-zinc-800/50 border-zinc-700 shadow-xl flex-1 flex flex-col overflow-hidden min-h-0">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-zinc-700/50 mb-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl text-zinc-100">Next Up</CardTitle>
            <CardDescription className="text-zinc-400">
              Confirm roles for the next turn.
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToEdit}
            className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700"
          >
            <GearIcon className="h-6 w-6" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-8 flex-grow flex flex-col justify-center relative">
          
          <div className="flex-1 flex flex-col justify-center gap-8 md:gap-12 w-full">
             <EnsembleRotationDisplay />
          </div>

          <div className="pt-6 border-t border-zinc-700/50 w-full">
            <BreakProgress />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
