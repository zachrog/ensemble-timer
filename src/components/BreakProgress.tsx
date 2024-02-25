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
        <div className="flex items-center">
          <span className="text-zinc-200 text-xl font-bold">
            Break Progress
          </span>
          <div className="flex ml-3">
            {new Array(rotationsPerBreak).fill(undefined).map((_, index) => {
              const backgroundColor =
                index < breakRotation ? 'bg-emerald-500' : 'bg-zinc-700';
              return (
                <button
                  key={index}
                  className={'w-5 h-5 rounded-md  ' + backgroundColor}
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
