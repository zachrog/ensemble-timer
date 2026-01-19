import { EnsembleMember } from '@/state.ts/defaultState';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CloseIcon } from '@/components/icons/icons';

interface ActiveMembersListProps {
  ensembleMembers: EnsembleMember[];
  removeMember: (member: { id: number }) => void;
}

export function ActiveMembersList({
  ensembleMembers,
  removeMember,
}: ActiveMembersListProps) {
  return (
    <div className="space-y-3 flex flex-col min-h-0 h-full">
      <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider shrink-0">
        Active ({ensembleMembers.length})
      </h3>
      <div className="space-y-2 overflow-y-auto pr-2 min-h-0 flex-1">
        {ensembleMembers.map((member) => (
          <div
            key={member.id}
            className={cn(
              'group flex items-center justify-between p-3 rounded-lg border transition-all',
              'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700',
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg text-zinc-300 theme-transition">
                {member.name}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeMember({ id: member.id })}
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-red-400 hover:bg-red-900/20"
            >
              <CloseIcon className="w-5 h-5" />
            </Button>
          </div>
        ))}
        {ensembleMembers.length === 0 && (
          <div className="p-4 border border-dashed border-zinc-800 rounded-lg text-center text-zinc-600">
            No active members
          </div>
        )}
      </div>
    </div>
  );
}
