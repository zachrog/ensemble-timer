import { useAppStore } from '@/state.ts/defaultState';

export function BreakProgress({ className }: { className?: string }) {
  const { rotationsPerBreak, breakRotation, setBreakRotation } = useAppStore(
    (state) => ({
      breakRotation: state.breakRotation,
      rotationsPerBreak: state.rotationsPerBreak,
      setBreakRotation: state.setBreakRotation,
    }),
  );

  return (
    <>
      <div className={className}>
        <div className="flex flex-col gap-2 w-full overflow-hidden">
          <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
            Break Progress
          </span>
          <div className="flex flex-wrap gap-1.5 min-h-[3.375rem] content-start w-full max-w-full">
            {new Array(rotationsPerBreak).fill(undefined).map((_, index) => {
              const backgroundColor =
                index < breakRotation ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-zinc-700/50 border border-zinc-700';
              return (
                <button
                  key={index}
                  className={'w-6 h-6 rounded-md transition-all ' + backgroundColor}
                  onClick={() => setBreakRotation(index +1)}
                ></button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
