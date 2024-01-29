import { useEffect } from 'react';
import { RendererWindowBrowser } from '../communicationBridge/fakeWindowBrowser';
import { useAppStore } from '../state.ts/defaultState';
import { Badge } from '@/components/ui/badge';
import { CloseIcon, MinusIcon, PlusIcon } from '@/components/icons/icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotationProgress } from '@/components/RotationProgress';

export function EditEnsemble() {
  useEffect(() => {
    RendererWindowBrowser.setOpacity(1.0);
    RendererWindowBrowser.maximize();
    RendererWindowBrowser.setAlwaysOnTop(false);
    RendererWindowBrowser.setIgnoreMouseEvents(false);
  }, []);

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
    startProgramming: state.startTurn,
  }));

  return (
    <>
      <div className="">
        <RotationProgress />
        <EnsembleOptions />
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
  const {
    timerLength,
    setTimerLength,
    breakLength,
    setBreakLength,
    rotationsPerBreak,
    setRotationsPerBreak,
  } = useAppStore((state) => ({
    timerLength: state.timerLength,
    setTimerLength: state.setTimerLength,
    breakLength: state.breakLength,
    setBreakLength: state.setBreakLength,
    rotationsPerBreak: state.rotationsPerBreak,
    setRotationsPerBreak: state.setRotationsPerBreak,
  }));

  const timerLengthInMinutes = Math.round(timerLength / (60 * 1000));
  const breakLengthInMinutes = Math.round(breakLength / (60 * 1000));
  return (
    <>
      <Card className="bg-zinc-800 text-zinc-200">
        <CardHeader>
          <CardTitle>Options</CardTitle>
        </CardHeader>
        <CardContent>
          <h1>Timer</h1>
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
            <span>Minutes</span>
          </div>
          <h1>Breaks</h1>
          <div>
            <Button
              onClick={() => {
                setBreakLength(breakLength - 60 * 1000);
              }}
              disabled={breakLengthInMinutes <= 1}
            >
              <MinusIcon />
            </Button>
            <span className="w-5 h-5">{breakLengthInMinutes}</span>
            <Button
              onClick={() => {
                setBreakLength(breakLength + 60 * 1000);
              }}
            >
              <PlusIcon />
            </Button>
            <span>Minutes</span>
          </div>
          <div>
            <Button
              onClick={() => {
                setRotationsPerBreak(rotationsPerBreak - 1);
              }}
              disabled={rotationsPerBreak <= 1}
            >
              <MinusIcon />
            </Button>
            <span className="w-5 h-5">{rotationsPerBreak}</span>
            <Button
              onClick={() => {
                setBreakLength(rotationsPerBreak + 1);
              }}
            >
              <PlusIcon />
            </Button>
            <span>
              Every {rotationsPerBreak * timerLengthInMinutes} Minutes
            </span>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
