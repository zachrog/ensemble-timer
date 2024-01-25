import { useEffect } from 'react';
import { RendererWindowBrowser } from '../communicationBridge/fakeWindowBrowser';
import { useAppStore } from '../state.ts/defaultState';
import { Badge } from '@/components/ui/badge';
import { CloseIcon } from '@/components/icons/icons';

export function EditEnsemble() {
  const { ensembleMembers, removeMember } = useAppStore((state) => ({
    ensembleMembers: state.ensembleMembers,
    removeMember: state.removeMember,
  }));
  useEffect(() => {
    RendererWindowBrowser.setOpacity(1.0);
    RendererWindowBrowser.maximize();
    RendererWindowBrowser.setAlwaysOnTop(false);
    RendererWindowBrowser.setIgnoreMouseEvents(false);
  }, []);

  return (
    <>
      <div className="flex justify-items-center">
        {ensembleMembers.map((member) => (
          <Badge className="text-4xl items-center">
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
