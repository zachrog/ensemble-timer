import { useEffect } from 'react';
import { RendererWindowBrowser } from '../communicationBridge/fakeWindowBrowser';
import { useAppStore } from '../state.ts/defaultState';
import { Badge } from '@/components/ui/badge';
import { CloseIcon, MinusIcon, PlusIcon } from '@/components/icons/icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function EditEnsemble() {
  const {
    ensembleMembers,
    removeMember,
    addMember,
    newMemberName,
    setNewMemberName,
    startProgramming,
  } = useAppStore((state) => ({
    ensembleMembers: state.ensembleMembers,
    removeMember: state.removeMember,
    addMember: state.addMember,
    newMemberName: state.newMemberName,
    setNewMemberName: state.setNewMemberName,
    startProgramming: state.startProgramming,
  }));
  useEffect(() => {
    RendererWindowBrowser.setOpacity(1.0);
    RendererWindowBrowser.maximize();
    RendererWindowBrowser.setAlwaysOnTop(false);
    RendererWindowBrowser.setIgnoreMouseEvents(false);
  }, []);

  return (
    <>
      <div className="">
        <EnsembleOptions />
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
        <Button
          onClick={() => {
            startProgramming();
          }}
        >
          Start
        </Button>
      </div>
    </>
  );
}

function EnsembleOptions() {
  const { timerLength, setTimerLength } = useAppStore((state) => ({
    timerLength: state.timerLength,
    setTimerLength: state.setTimerLength,
  }));

  const timerLengthInMinutes = Math.round(timerLength / (60 * 1000));
  return (
    <>
      <Card className="bg-zinc-800 text-zinc-200">
        <CardHeader>
          <CardTitle>Options</CardTitle>
        </CardHeader>
        <CardContent>
          <h1>Timer Options</h1>
          <div>
            <Button
              onClick={() => {
                setTimerLength(timerLength - 60 * 1000);
              }}
              disabled={timerLengthInMinutes <= 1}
            >
              <MinusIcon />
            </Button>
            <span className="w-5 h-5">{timerLengthInMinutes}</span>
            <Button
              onClick={() => {
                setTimerLength(timerLength + 60 * 1000);
              }}
            >
              <PlusIcon />
            </Button>
          </div>
          <h1>Break Options</h1>
        </CardContent>
      </Card>
    </>
  );
}
