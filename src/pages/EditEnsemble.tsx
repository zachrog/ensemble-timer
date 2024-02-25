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
  DiceIcon,
  LeftIcon,
  MinusIcon,
  NavigatorIcon,
  PlusIcon,
  RightIcon,
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
    RendererWindowBrowser.focus();
    RendererWindowBrowser.moveTop();
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
      <div className="p-3">
        <RotationProgress />
        <div className="flex mt-3">
          <EnsembleOptions />
          <RosterEdit />
        </div>
        <Separator className="my-10" />
        <div className="flex">
          <Button
            onClick={() => {
              startProgramming();
            }}
            className="hover:bg-emerald-500 flex-grow h-25 text-6xl flex font-thin p-3 border-zinc-700 border bg-emerald-600 text-zinc-200"
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
              className="hover:bg-zinc-700"
            >
              <MinusIcon />
            </Button>
            <div className="inline h-10 w-10">
              <p className="text-2xl mx-3 inline h-10 w-10">
                {timerLengthInMinutes}
              </p>
            </div>
            <Button
              onClick={() => {
                setTimerLength(timerLength + 60 * 1000);
              }}
              className="hover:bg-zinc-700"
            >
              <PlusIcon />
            </Button>
            <span className="text-2xl ml-3">Minutes</span>
          </div>
          <h1 className="mt-3 text-2xl">Breaks</h1>
          <div className="mt-2">
            <Button
              className="hover:bg-zinc-700"
              onClick={() => {
                setBreakLength(breakLength - 60 * 1000);
              }}
              disabled={breakLengthInMinutes <= 1}
            >
              <MinusIcon />
            </Button>
            <span className="text-2xl mx-3">{breakLengthInMinutes}</span>
            <Button
              className="hover:bg-zinc-700"
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
              className="hover:bg-zinc-700"
              onClick={() => {
                setRotationsPerBreak(rotationsPerBreak - 1);
              }}
              disabled={rotationsPerBreak <= 1}
            >
              <MinusIcon />
            </Button>
            <span className="text-2xl mx-3">{rotationsPerBreak}</span>
            <Button
              className="hover:bg-zinc-700"
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
    randomizeMembers,
    nextDriver,
    previousDriver,
    inactiveMembers,
    removeInactiveMember,
  } = useAppStore((state) => ({
    ensembleMembers: state.ensembleMembers,
    removeMember: state.removeMember,
    addMember: state.addMember,
    newMemberName: state.newMemberName,
    setNewMemberName: state.setNewMemberName,
    currentRotation: state.currentRotation,
    randomizeMembers: state.randomizeMembers,
    nextDriver: state.nextDriver,
    previousDriver: state.previousDriver,
    inactiveMembers: state.inactiveMembers,
    removeInactiveMember: state.removeInactiveMember,
  }));

  const currentDriver = getCurrentDriver({ ensembleMembers, currentRotation });
  const currentNavigator = getCurrentNavigator({
    ensembleMembers,
    currentRotation,
  });

  return (
    <>
      <Card className="bg-zinc-800 text-zinc-200 ml-3 flex-grow">
        <CardHeader>
          <CardTitle className="text-4xl items-center flex text-zinc-200">
            Active{' '}
            <Button
              className="ml-6 hover:bg-zinc-700"
              onClick={() => {
                randomizeMembers();
              }}
            >
              <DiceIcon className="text-zinc-200 w-6 h-6" />
              <span className="ml-2 text-xl text-zinc-200">Randomize</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Button
              className="hover:bg-zinc-700"
              onClick={() => {
                nextDriver();
              }}
            >
              <LeftIcon className="h-6 w-6" />
            </Button>
            <div className="flex gap-2 flex-wrap px-3">
              {ensembleMembers.map((member) => (
                <Badge key={member.id} className="text-2xl">
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
            <Button
              className="hover:bg-zinc-700"
              onClick={() => {
                previousDriver();
              }}
            >
              <RightIcon className="h-6 w-6" />
            </Button>
          </div>
          <form className="flex items-center gap-4">
            <Input
              value={newMemberName}
              placeholder="Name"
              onChange={(e) => setNewMemberName(e.target.value)}
              className="w-30 bg-zinc-800 text-2xl h-13 mt-3"
            ></Input>
            <Button
              className="mt-3 inline"
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
        <CardHeader>
          <CardTitle className="text-4xl items-center flex text-zinc-200">
            Inactive
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="flex gap-2 flex-wrap">
              {inactiveMembers.map((member) => (
                <Badge key={member.id} className="text-2xl">
                  <span className="text-zinc-200 ml-2">{member.name}</span>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      removeInactiveMember({ id: member.id });
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
          </div>
        </CardContent>
      </Card>
    </>
  );
}
