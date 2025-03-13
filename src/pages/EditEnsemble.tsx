import { useEffect } from 'react';
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
import { BreakProgress } from '@/components/BreakProgress';
import { Separator } from '@/components/ui/separator';
import { transitionToFullscreen, restoreLastWindowSize } from '@/windowUtils/fullscreen';
import { RendererWindowBrowser } from '@/communicationBridge/fakeWindowBrowser';

export function EditEnsemble() {
  useEffect(() => {
    // Check if we should restore window size from timer mode
    const { shouldRestoreWindowSize, resetShouldRestoreWindowSize } = useAppStore.getState();
    
    if (shouldRestoreWindowSize) {
      // Coming from timer, restore saved size instead of maximizing
      console.log('Restoring window size from timer mode');
      RendererWindowBrowser.setOpacity(1.0);
      
      // First focus the window and make sure it's visible
      RendererWindowBrowser.focus();
      
      // Then restore the saved window size
      restoreLastWindowSize();
      
      // Reset the flag so we don't restore next time
      resetShouldRestoreWindowSize();
    } else {
      // Normal flow, go to fullscreen
      console.log('Normal transition to fullscreen');
      transitionToFullscreen();
    }
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
        <BreakProgress />
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

  // Display time in minutes and seconds
  const timerMinutes = Math.floor(timerLength / (60 * 1000));
  const timerSeconds = (timerLength % (60 * 1000)) / 1000;
  const timerDisplay = timerSeconds > 0 ? `${timerMinutes}:${timerSeconds === 30 ? '30' : '00'}` : `${timerMinutes}`;
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
                // Reduce by 30 seconds
                setTimerLength(timerLength - 30 * 1000);
              }}
              // Allow a minimum of 30 seconds
              disabled={timerLength <= 30 * 1000}
              className="hover:bg-zinc-700"
            >
              <MinusIcon />
            </Button>
            <div className="inline h-10 w-16">
              <p className="text-2xl mx-3 inline h-10 w-16">
                {timerDisplay}
              </p>
            </div>
            <Button
              onClick={() => {
                // Increase by 30 seconds
                setTimerLength(timerLength + 30 * 1000);
              }}
              className="hover:bg-zinc-700"
            >
              <PlusIcon />
            </Button>
            <span className="text-2xl ml-3">{timerSeconds > 0 ? 'Min:Sec' : 'Minutes'}</span>
          </div>
          <h1 className="mt-3 text-2xl">Breaks</h1>
          <div className="mt-2">
            <Button
              className="hover:bg-zinc-700"
              onClick={() => {
                setBreakLength(breakLength - 30 * 1000);
              }}
              disabled={breakLength <= 30 * 1000}
            >
              <MinusIcon />
            </Button>
            <div className="inline h-10 w-16">
              {breakLength % (60 * 1000) === 0 ? (
                <span className="text-2xl mx-3">{Math.floor(breakLength / (60 * 1000))}</span>
              ) : (
                <span className="text-2xl mx-3">
                  {Math.floor(breakLength / (60 * 1000))}:30
                </span>
              )}
            </div>
            <Button
              className="hover:bg-zinc-700"
              onClick={() => {
                setBreakLength(breakLength + 30 * 1000);
              }}
            >
              <PlusIcon />
            </Button>
            <span className="text-2xl ml-3">
              {breakLength % (60 * 1000) === 0 ? "Minutes" : "Min:Sec"}
            </span>
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
              Every {rotationsPerBreak * timerMinutes + (timerSeconds > 0 ? rotationsPerBreak * 0.5 : 0)} Minutes
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
    inactiveToActive,
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
    inactiveToActive: state.inactiveToActive,
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
          <CardTitle className="text-4xl flex text-zinc-200">
            Active{' '}
            <Button
              className="ml-6 hover:bg-zinc-700"
              onClick={() => {
                randomizeMembers();
              }}
            >
              <DiceIcon className="text-zinc-200 w-6 h-6" />
            </Button>
          </CardTitle>
          <form className="flex items-center gap-3">
            <Input
              value={newMemberName}
              placeholder="Name"
              onChange={(e) => setNewMemberName(e.target.value)}
              className="w-30 bg-zinc-800 text-2xl h-10 mt-3"
            ></Input>
            <Button
              className="mt-3 inline"
              onClick={(e) => {
                e.preventDefault();
                addMember({ name: newMemberName });
                setNewMemberName('');
              }}
              disabled={!newMemberName}
              type="submit"
            >
              Add
            </Button>
          </form>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Button
              className="hover:bg-zinc-700"
              onClick={() => {
                previousDriver();
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
                      className="w-6 h-6 rounded-full text-zinc-200 hover:text-red-500"
                      strokeWidth={2}
                    />
                  </Button>
                </Badge>
              ))}
            </div>
            <Button
              className="hover:bg-zinc-700"
              onClick={() => {
                nextDriver();
              }}
            >
              <RightIcon className="h-6 w-6" />
            </Button>
          </div>
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
                <Badge
                  key={member.id}
                  className="text-2xl cursor-pointer hover:bg-zinc-700"
                  onClick={() => {
                    inactiveToActive({ id: member.id });
                  }}
                >
                  <span className="text-zinc-200 ml-2">{member.name}</span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeInactiveMember({ id: member.id });
                    }}
                    className="ml-2"
                  >
                    <CloseIcon
                      className="w-6 h-6 rounded-full text-zinc-200 hover:text-red-500"
                      strokeWidth={2}
                    />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
