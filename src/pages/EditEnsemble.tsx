import { useEffect, useState } from 'react';
import { RendererWindowBrowser } from '../communicationBridge/fakeWindowBrowser';
import { useAppStore } from '../state.ts/defaultState';
import { Badge } from '@/components/ui/badge';
import { CloseIcon } from '@/components/icons/icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function EditEnsemble() {
  const { ensembleMembers, removeMember, addMember } = useAppStore((state) => ({
    ensembleMembers: state.ensembleMembers,
    removeMember: state.removeMember,
    addMember: state.addMember,
  }));
  const [newMemberName, setNewMemberName] = useState('');
  useEffect(() => {
    RendererWindowBrowser.setOpacity(1.0);
    RendererWindowBrowser.maximize();
    RendererWindowBrowser.setAlwaysOnTop(false);
    RendererWindowBrowser.setIgnoreMouseEvents(false);
  }, []);

  return (
    <>
      <div className="">
        <form>
          <Input
            value={newMemberName}
            placeholder="Name"
            onChange={(e) => setNewMemberName(e.target.value)}
          ></Input>
          <Button
            onClick={(e) => {
              e.preventDefault();
              addMember({ name: newMemberName });
              setNewMemberName('');
            }}
            disabled={!newMemberName}
          >
            Add
          </Button>
        </form>
        {ensembleMembers.map((member) => (
          <Badge key={member.id} className="text-4xl items-center">
            {member.name}{' '}
            <button
              onClick={(e) => {
                e.preventDefault();
                removeMember({ id: member.id });
              }}
            >
              <CloseIcon className="w-9 h-9" strokeWidth={2} />
            </button>
          </Badge>
        ))}
      </div>
    </>
  );
}
