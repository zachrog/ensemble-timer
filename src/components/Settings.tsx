import { GearIcon } from '@/components/icons/icons';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/state.ts/defaultState';

export function Settings({ className }: { className?: string }) {
  const { goToEdit } = useAppStore((state) => ({ goToEdit: state.goToEdit }));

  return (
    <>
      <div className={className}>
        <Button
          className="h-16 w-16 p-1 border-zinc-700 border bg-zinc-900 hover:bg-zinc-700"
          onClick={() => {
            goToEdit();
          }}
        >
          <GearIcon className="h-16 w-16" />
        </Button>
      </div>
    </>
  );
}
