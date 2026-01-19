import { EnsembleMember } from '@/state.ts/defaultState';
import { Button } from '@/components/ui/button';
import { CloseIcon } from '@/components/icons/icons';

interface InactiveMembersListProps {
  inactiveMembers: EnsembleMember[];
  inactiveToActive: (member: { id: number }) => void;
  removeInactiveMember: (member: { id: number }) => void;
}

export function InactiveMembersList({
  inactiveMembers,
  inactiveToActive,
  removeInactiveMember,
}: InactiveMembersListProps) {
  return (
    <div className="space-y-3 flex flex-col min-h-0 h-full">
      <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider shrink-0">
        Inactive ({inactiveMembers.length})
      </h3>
      <div className="space-y-2 overflow-y-auto pr-2 min-h-0 flex-1">
        {inactiveMembers.map((member) => (
          <div
            key={member.id}
            onClick={() => inactiveToActive({ id: member.id })}
            className="group cursor-pointer flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900/20 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all opacity-70 hover:opacity-100"
          >
            <span className="text-lg text-zinc-400 group-hover:text-zinc-200">
              {member.name}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                removeInactiveMember({ id: member.id });
              }}
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-600 hover:text-red-400 hover:bg-red-900/20"
            >
              <CloseIcon className="w-5 h-5" />
            </Button>
          </div>
        ))}
        {inactiveMembers.length === 0 && (
          <div className="p-4 border border-dashed border-zinc-800 rounded-lg text-center text-zinc-700 text-sm">
            No inactive members
          </div>
        )}
      </div>
    </div>
  );
}
