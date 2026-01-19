import { Corner } from '@/state.ts/defaultState';
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
    <div className="space-y-1 w-full">
      <div className="flex justify-between items-center text-zinc-200">
        <span className="text-lg font-medium">Timer Position</span>
      </div>
      {/* Screen representation with corner indicators */}
      <div className="relative bg-zinc-900/50 rounded-lg border border-zinc-800 w-64 h-40 mx-auto p-3">
        {/* Top-left corner */}
        <button
          onClick={() => setTimerStartCorner('top-left')}
          className={cn(
            'absolute top-3 left-3 w-10 h-10 rounded transition-all',
            timerStartCorner === 'top-left'
              ? 'bg-emerald-600 hover:bg-emerald-500'
              : 'bg-zinc-700 hover:bg-zinc-600 border border-zinc-600',
          )}
        />
        
        {/* Top-right corner */}
        <button
          onClick={() => setTimerStartCorner('top-right')}
          className={cn(
            'absolute top-3 right-3 w-10 h-10 rounded transition-all',
            timerStartCorner === 'top-right'
              ? 'bg-emerald-600 hover:bg-emerald-500'
              : 'bg-zinc-700 hover:bg-zinc-600 border border-zinc-600',
          )}
        />
        
        {/* Bottom-left corner */}
        <button
          onClick={() => setTimerStartCorner('bottom-left')}
          className={cn(
            'absolute bottom-3 left-3 w-10 h-10 rounded transition-all',
            timerStartCorner === 'bottom-left'
              ? 'bg-emerald-600 hover:bg-emerald-500'
              : 'bg-zinc-700 hover:bg-zinc-600 border border-zinc-600',
          )}
        />
        
        {/* Bottom-right corner */}
        <button
          onClick={() => setTimerStartCorner('bottom-right')}
          className={cn(
            'absolute bottom-3 right-3 w-10 h-10 rounded transition-all',
            timerStartCorner === 'bottom-right' || !timerStartCorner
              ? 'bg-emerald-600 hover:bg-emerald-500'
              : 'bg-zinc-700 hover:bg-zinc-600 border border-zinc-600',
          )}
        />
      </div>
    </div>
  );
}
