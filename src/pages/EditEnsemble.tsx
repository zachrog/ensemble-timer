import { useEffect } from 'react';
import { RendererWindowBrowser } from '../communicationBridge/fakeWindowBrowser';
import { useAppStore } from '../state.ts/defaultState';
import { Badge } from '@/components/ui/badge';

export function EditEnsemble() {
  const ensembleMembers = useAppStore((state) => state.ensembleMembers);
  useEffect(() => {
    RendererWindowBrowser.setOpacity(1.0);
    RendererWindowBrowser.maximize();
    RendererWindowBrowser.setAlwaysOnTop(false);
    RendererWindowBrowser.setIgnoreMouseEvents(false);
  }, []);

  return (
    <>
      <h1>Hey you are in edit mode</h1>
      {ensembleMembers.map((member) => (
        <Badge>{member.name}</Badge>
      ))}
    </>
  );
}
