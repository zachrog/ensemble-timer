import { Corner } from '@/state.ts/defaultState';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TimerPositionControlProps {
  timerStartCorner: Corner;
  setTimerStartCorner: (corner: Corner) => void;
}

export function TimerPositionControl({
  timerStartCorner,
  setTimerStartCorner,
}: TimerPositionControlProps) {
  return (
    <div className="space-y-3 w-full">
      <div className="flex justify-between items-center text-zinc-200">
        <span className="text-lg font-medium">Timer Position</span>
      </div>
      <div className="grid grid-cols-2 gap-2 bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 w-48 mx-auto">
        <Button
          variant={timerStartCorner === 'top-left' ? 'default' : 'outline'}
          className={cn(
            'h-12 w-full',
            timerStartCorner === 'top-left'
              ? 'bg-emerald-600 hover:bg-emerald-500 border-transparent'
              : 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-400',
          )}
          onClick={() => setTimerStartCorner('top-left')}
        />
        <Button
          variant={timerStartCorner === 'top-right' ? 'default' : 'outline'}
          className={cn(
            'h-12 w-full',
            timerStartCorner === 'top-right'
              ? 'bg-emerald-600 hover:bg-emerald-500 border-transparent'
              : 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-400',
          )}
          onClick={() => setTimerStartCorner('top-right')}
        />
        <Button
          variant={timerStartCorner === 'bottom-left' ? 'default' : 'outline'}
          className={cn(
            'h-12 w-full',
            timerStartCorner === 'bottom-left'
              ? 'bg-emerald-600 hover:bg-emerald-500 border-transparent'
              : 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-400',
          )}
          onClick={() => setTimerStartCorner('bottom-left')}
        />
        <Button
          variant={timerStartCorner === 'bottom-right' ? 'default' : 'outline'}
          className={cn(
            'h-12 w-full',
            timerStartCorner === 'bottom-right' || !timerStartCorner
              ? 'bg-emerald-600 hover:bg-emerald-500 border-transparent'
              : 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-400',
          )}
          onClick={() => setTimerStartCorner('bottom-right')}
        />
      </div>
    </div>
  );
}
