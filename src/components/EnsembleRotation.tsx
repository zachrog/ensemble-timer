import { useAppStore } from '@/state.ts/defaultState';
import { Button } from './ui/button';
import { CloseIcon, LeftIcon, NavigatorIcon, RightIcon, WheelIcon } from './icons/icons';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function EnsembleRotation() {
  const {
    ensembleMembers,
    currentRotation,
    nextDriver,
    previousDriver,
    activeToInactive,
  } = useAppStore((state) => ({
    ensembleMembers: state.ensembleMembers,
    currentRotation: state.currentRotation,
    nextDriver: state.nextDriver,
    previousDriver: state.previousDriver,
    activeToInactive: state.activeToInactive,
  }));

  if (ensembleMembers.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 border border-dashed border-zinc-700 rounded-xl bg-zinc-900/20 text-zinc-500">
        Add members to start the rotation
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-4 w-full">
        <div className="relative h-48 w-full bg-zinc-900/50 rounded-xl border border-zinc-800 overflow-hidden flex items-center justify-between px-2">
        
        {/* Previous Button (Static Z-Index High) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={previousDriver}
          className="h-12 w-12 shrink-0 z-50 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-100 bg-zinc-900/80 backdrop-blur-sm rounded-full"
          title="Previous Rotation"
        >
          <LeftIcon className="h-8 w-8" />
        </Button>

        {/* Carousel Container */}
        <div className="absolute inset-x-0 w-full h-full">
            {/* Static Role Headers */}
            <div className="absolute top-6 w-full h-8 z-30 pointer-events-none">
              {/* Navigator Label */}
              <div 
                className="absolute transition-all duration-300 -translate-x-1/2 flex items-center gap-2 text-xs uppercase tracking-widest text-indigo-400 font-semibold whitespace-nowrap"
                style={{ left: ensembleMembers.length === 2 ? '25%' : '20%' }}
              >
                <NavigatorIcon className="w-4 h-4" /> Navigator
              </div>
              
              {/* Driver Label */}
              <div 
                className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs uppercase tracking-widest text-emerald-500 font-semibold whitespace-nowrap"
              >
                <WheelIcon className="w-4 h-4" /> Driver
              </div>

              {/* On Deck Label */}
              {ensembleMembers.length > 2 && (
                <div 
                  className="absolute left-[80%] -translate-x-1/2 text-xs uppercase tracking-widest text-zinc-500 font-semibold whitespace-nowrap"
                >
                  On Deck
                </div>
              )}
            </div>

            {ensembleMembers.map((member, index) => {
                // Calculate slot index relative to current rotation
                const total = ensembleMembers.length;
                const offset = (index - (currentRotation % total) + total) % total;
                
                let targetLeft = '120%';
                let targetScale = 0.5;
                let targetOpacity = 0;
                let zIndex = 0;
                
                if (offset === 0) { // Navigator
                    targetLeft = '20%';
                    targetScale = 0.85;
                    targetOpacity = 0.7;
                    zIndex = 10;
                     if (total === 2) targetLeft = '25%';
                } else if (offset === 1) { // Driver
                    targetLeft = '50%';
                    targetScale = 1;
                    targetOpacity = 1;
                    zIndex = 20;
                } else if (offset === 2) { // On Deck
                    targetLeft = '80%';
                    targetScale = 0.85;
                    targetOpacity = 0.4;
                    zIndex = 5;
                } else if (offset === total - 1) { 
                     // Exit Left
                     targetLeft = '-20%';
                }
                
                // Special styles for active roles
                const isDriver = offset === 1;
                const isNavigator = offset === 0;
                
                return (
                    <div
                        key={member.id}
                        className="absolute top-1/2 transition-all duration-500 ease-in-out w-[140px] md:w-[180px]"
                        style={{
                            left: targetLeft,
                            transform: `translate(-50%, -50%) scale(${targetScale}) translateY(16px)`,
                            opacity: targetOpacity,
                            zIndex
                        }}
                    >
                         <div className="relative group flex items-center justify-center pt-4">                            
                                <span className={cn(
                                    "text-xl md:text-3xl font-light truncate max-w-full text-center pb-2 cursor-default select-none",
                                    isDriver ? "text-emerald-400" : 
                                    isNavigator ? "text-indigo-300" :
                                    "text-zinc-500"
                                )}>
                                    {member.name}
                                </span>
                                
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => { e.stopPropagation(); activeToInactive({ id: member.id }); }}
                                        className={cn(
                                            "absolute -right-0 md:-right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-zinc-600 transition-all hover:text-red-400 hover:bg-red-900/10",
                                            "opacity-0 group-hover:opacity-100"
                                        )}
                                    >
                                        <CloseIcon className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Mark as Away</p>
                                  </TooltipContent>
                                </Tooltip>
                        </div>
                    </div>
                );
            })}
        </div>
        
        {/* Next Button (Static Z-Index High) */}
         <Button
          variant="ghost"
          size="icon"
          onClick={nextDriver}
          className="h-12 w-12 shrink-0 z-50 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-100 bg-zinc-900/80 backdrop-blur-sm rounded-full"
          title="Next Rotation"
        >
          <RightIcon className="h-8 w-8" />
        </Button>
      </div>
    </div>
    </TooltipProvider>
  );
}
