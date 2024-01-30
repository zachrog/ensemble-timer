import { useEffect } from 'react';
import { RendererWindowBrowser } from '../communicationBridge/fakeWindowBrowser';
import {
  getCurrentDriver,
  getCurrentNavigator,
  useAppStore,
} from '../state.ts/defaultState';
import { Badge } from '@/components/ui/badge';
import {
  CloseIcon,
  MinusIcon,
  NavigatorIcon,
  PlusIcon,
  WheelIcon,
} from '@/components/icons/icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotationProgress } from '@/components/RotationProgress';
import { Separator } from '@/components/ui/separator';

export function EditEnsemble() {
  useEffect(() => {
    RendererWindowBrowser.setOpacity(1.0);
    RendererWindowBrowser.maximize();
    RendererWindowBrowser.setAlwaysOnTop(false);
    RendererWindowBrowser.setIgnoreMouseEvents(false);
  }, []);

  const { startProgramming } = useAppStore((state) => ({
    ensembleMembers: state.ensembleMembers,
    removeMember: state.removeMember,
    addMember: state.addMember,
    newMemberName: state.newMemberName,
    setNewMemberName: state.setNewMemberName,
    startProgramming: state.startTurn,
  }));

  return (
    <>
      <div className="p-5">
        <RotationProgress className="" />
        <div className="flex mt-5">
          <EnsembleOptions />
          <RosterEdit />
        </div>
        <Separator className="my-10" />
        <div className="flex">
          <Button
            onClick={() => {
              startProgramming();
            }}
            className="hover:bg-zinc-700 flex-grow h-25 text-6xl flex font-thin p-5 border-zinc-700 border bg-zinc-900 text-zinc-200"
          >
            Start
          </Button>
        </div>
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
      <Card className="bg-zinc-800 text-zinc-200 flex-none">
        <CardHeader>
          <CardTitle className="text-4xl">Options</CardTitle>
        </CardHeader>
        <CardContent>
          <h1 className="text-2xl">Timer</h1>
          <div className="mt-2">
            <Button
              onClick={() => {
                setTimerLength(timerLength - 60 * 1000);
              }}
              disabled={timerLengthInMinutes <= 1}
            >
              <MinusIcon />
            </Button>
            <div className='inline h-10 w-10'>
              <p className="text-2xl mx-3 inline h-10 w-10">{timerLengthInMinutes}</p>
            </div>
            <Button
              onClick={() => {
                setTimerLength(timerLength + 60 * 1000);
              }}
            >
              <PlusIcon />
            </Button>
            <span className="text-2xl ml-3">Minutes</span>
          </div>
          <h1 className="mt-3 text-2xl">Breaks</h1>
          <div className="mt-2">
            <Button
              onClick={() => {
                setBreakLength(breakLength - 60 * 1000);
              }}
              disabled={breakLengthInMinutes <= 1}
            >
              <MinusIcon />
            </Button>
            <span className="text-2xl mx-3">{breakLengthInMinutes}</span>
            <Button
              onClick={() => {
                setBreakLength(breakLength + 60 * 1000);
              }}
            >
              <PlusIcon />
            </Button>
            <span className="text-2xl ml-3">Minutes</span>
          </div>
          <div className="mt-2">
            <Button
              onClick={() => {
                setRotationsPerBreak(rotationsPerBreak - 1);
              }}
              disabled={rotationsPerBreak <= 1}
            >
              <MinusIcon />
            </Button>
            <span className="text-2xl mx-3">{rotationsPerBreak}</span>
            <Button
              onClick={() => {
                setRotationsPerBreak(rotationsPerBreak + 1);
              }}
            >
              <PlusIcon />
            </Button>
            <span className="text-2xl ml-3">
              Every {rotationsPerBreak * timerLengthInMinutes} Minutes
            </span>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function RosterEdit() {
  const {
    ensembleMembers,
    removeMember,
    addMember,
    newMemberName,
    setNewMemberName,
    currentRotation,
  } = useAppStore((state) => ({
    ensembleMembers: state.ensembleMembers,
    removeMember: state.removeMember,
    addMember: state.addMember,
    newMemberName: state.newMemberName,
    setNewMemberName: state.setNewMemberName,
    currentRotation: state.currentRotation,
  }));

  const currentDriver = getCurrentDriver({ ensembleMembers, currentRotation });
  const currentNavigator = getCurrentNavigator({
    ensembleMembers,
    currentRotation,
  });

  return (
    <>
      <Card className="bg-zinc-800 text-zinc-200 ml-5 flex-grow">
        <CardHeader>
          <CardTitle className="text-4xl">Ensemble</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {ensembleMembers.map((member) => (
              <Badge key={member.id} className="text-2xl mb-2">
                {member.id === currentDriver.id && (
                  <WheelIcon className="w-6 h-6" />
                )}
                {member.id === currentNavigator.id && (
                  <NavigatorIcon className="w-6 h-6" />
                )}
                <span className="text-zinc-200 ml-2">{member.name}</span>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    removeMember({ id: member.id });
                  }}
                  className="w-8 h-8 p-1 ml-2"
                >
                  <CloseIcon
                    className="w-6 h-6 bg-zinc-700 rounded-full text-zinc-200 hover:text-red-500"
                    strokeWidth={2}
                  />
                </Button>
              </Badge>
            ))}
          </div>
          <form className="flex items-center gap-4">
            <Input
              value={newMemberName}
              placeholder="Name"
              onChange={(e) => setNewMemberName(e.target.value)}
              className="w-30 bg-zinc-800 text-2xl h-13 mt-5"
            ></Input>
            <Button
              className="mt-5 inline"
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
        </CardContent>
      </Card>
    </>
  );
}
