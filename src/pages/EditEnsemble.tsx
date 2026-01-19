import { useEffect } from 'react';
import {
  useAppStore,
} from '../state.ts/defaultState';
import { EnsembleRotation } from '@/components/EnsembleRotation';
import {
  DiceIcon,
  MinusIcon,
  PlusIcon,
} from '@/components/icons/icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BreakProgress } from '@/components/BreakProgress';
import { restoreNormalWindow } from '@/windowUtils/fullscreen';
import { ActiveMembersList } from '@/components/ActiveMembersList';
import { InactiveMembersList } from '@/components/InactiveMembersList';
import { TimerPositionControl } from '@/components/TimerPositionControl';

export function EditEnsemble() {
  useEffect(() => {
    restoreNormalWindow();
  }, []);

  const { startProgramming } = useAppStore((state) => ({
    startProgramming: state.startTurn,
  }));

  return (
    <div className="flex flex-col flex-1 min-h-0 p-6 gap-6 max-w-7xl mx-auto w-full overflow-hidden">
      {/* Hero Section */}
      <section className="flex flex-col gap-6 w-full">
        <Button
          onClick={startProgramming}
          className="w-full h-32 md:h-40 text-5xl md:text-6xl font-light tracking-tight bg-emerald-600 hover:bg-emerald-500 border-2 border-emerald-500/50 shadow-[0_0_30px_-5px_var(--tw-shadow-color)] shadow-emerald-900/40 text-white rounded-2xl transition-all transform hover:scale-[1.01]"
        >
          Start Session
        </Button>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full overflow-hidden flex-1 min-h-0">
        {/* Options Panel */}
        <div className="xl:col-span-4 space-y-6 h-full min-w-0 w-full flex flex-col min-h-0 overflow-hidden">
          <EnsembleOptions />
        </div>

        {/* Roster Panel */}
        <div className="xl:col-span-8 space-y-6 h-full min-w-0 flex flex-col min-h-0 overflow-hidden">
          <RosterEdit /> 
        </div>
      </div>
    </div>
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
    timerStartCorner,
    setTimerStartCorner,
  } = useAppStore((state) => ({
    timerLength: state.timerLength,
    setTimerLength: state.setTimerLength,
    breakLength: state.breakLength,
    setBreakLength: state.setBreakLength,
    rotationsPerBreak: state.rotationsPerBreak,
    setRotationsPerBreak: state.setRotationsPerBreak,
    timerStartCorner: state.timerStartCorner,
    setTimerStartCorner: state.setTimerStartCorner,
  }));

  const timerLengthInMinutes = Math.round(timerLength / (60 * 1000));
  const breakLengthInMinutes = Math.round(breakLength / (60 * 1000));

  return (
    <Card className="bg-zinc-800/50 border-zinc-700 shadow-xl h-full w-full flex flex-col overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl text-zinc-100">Session Settings</CardTitle>
        <CardDescription className="text-zinc-400">
          Configure timer turns and breaks.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 flex-grow flex flex-col overflow-x-hidden">
        {/* Timer Duration */}
        <div className="space-y-3 w-full">
          <div className="flex justify-between items-center text-zinc-200">
            <span className="text-lg font-medium">Turn Duration</span>
          </div>
          <div className="flex items-center gap-4 bg-zinc-900/50 p-2 rounded-lg border border-zinc-800">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setTimerLength(timerLength - 60 * 1000)}
              disabled={timerLengthInMinutes <= 1}
              className="hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100"
            >
              <MinusIcon className="h-6 w-6" />
            </Button>
            <div className="flex-grow text-center">
              <span className="font-mono text-xl text-emerald-400">
                {timerLengthInMinutes} min
              </span>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setTimerLength(timerLength + 60 * 1000)}
              className="hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100"
            >
              <PlusIcon className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Break Duration */}
        <div className="space-y-3 w-full">
          <div className="flex justify-between items-center text-zinc-200">
            <span className="text-lg font-medium">Break Duration</span>
          </div>
          <div className="flex items-center gap-4 bg-zinc-900/50 p-2 rounded-lg border border-zinc-800">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setBreakLength(breakLength - 60 * 1000)}
              disabled={breakLengthInMinutes <= 1}
              className="hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100"
            >
              <MinusIcon className="h-6 w-6" />
            </Button>
            <div className="flex-grow text-center">
              <span className="font-mono text-xl text-emerald-400">
                {breakLengthInMinutes} min
              </span>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setBreakLength(breakLength + 60 * 1000)}
              className="hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100"
            >
              <PlusIcon className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Rotations */}
        <div className="space-y-3 w-full">
          <div className="flex justify-between items-center text-zinc-200">
            <span className="text-lg font-medium">Break Frequency</span>
          </div>
          <div className="flex items-center gap-4 bg-zinc-900/50 p-2 rounded-lg border border-zinc-800">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setRotationsPerBreak(rotationsPerBreak - 1)}
              disabled={rotationsPerBreak <= 1}
              className="hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100"
            >
              <MinusIcon className="h-6 w-6" />
            </Button>
            <div className="flex-grow text-center">
              <div className="font-mono text-xl text-emerald-400">
                Every {rotationsPerBreak} turns
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setRotationsPerBreak(rotationsPerBreak + 1)}
              className="hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100"
            >
              <PlusIcon className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Timer Position */}
        <TimerPositionControl
          timerStartCorner={timerStartCorner}
          setTimerStartCorner={setTimerStartCorner}
        />

        <div className="pt-4 border-t border-zinc-700 mt-auto w-full">
          <BreakProgress className="w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

function RosterEdit() {
  const {
    ensembleMembers,
    removeMember,
    addMember,
    newMemberName,
    setNewMemberName,
    randomizeMembers,
    inactiveMembers,
    removeInactiveMember,
    inactiveToActive,
  } = useAppStore((state) => ({
    ensembleMembers: state.ensembleMembers,
    removeMember: state.activeToInactive,
    addMember: state.addMember,
    newMemberName: state.newMemberName,
    setNewMemberName: state.setNewMemberName,
    randomizeMembers: state.randomizeMembers,
    inactiveMembers: state.inactiveMembers,
    removeInactiveMember: state.removeInactiveMember,
    inactiveToActive: state.inactiveToActive,
  }));

  return (
    <Card className="bg-zinc-800/50 border-zinc-700 shadow-xl h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-2xl text-zinc-100">Team Roster</CardTitle>
          <CardDescription className="text-zinc-400">
            Manage drivers, navigators, and active participants.
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="bg-zinc-900 border-zinc-700 hover:bg-zinc-800 hover:text-emerald-400 text-zinc-300 gap-2"
          onClick={randomizeMembers}
        >
          <DiceIcon className="w-4 h-4" />
          <span>Shuffle</span>
        </Button>
      </CardHeader>

      <CardContent className="space-y-6 flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Driver Selection */}
        <EnsembleRotation />

        {/* Add Member Input */}
        <form
          className="flex gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (newMemberName) {
              addMember({ name: newMemberName });
              setNewMemberName('');
            }
          }}
        >
          <Input
            value={newMemberName}
            placeholder="Enter name to add..."
            onChange={(e) => setNewMemberName(e.target.value)}
            className="bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-600"
          />
          <Button
            type="submit"
            disabled={!newMemberName}
            className="bg-zinc-700 hover:bg-zinc-600 text-white"
          >
            Add
          </Button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0 flex-1 overflow-hidden">
          {/* Active Members List */}
          <ActiveMembersList
            ensembleMembers={ensembleMembers}
            removeMember={removeMember}
          />

          {/* Inactive Members List */}
          <InactiveMembersList
            inactiveMembers={inactiveMembers}
            inactiveToActive={inactiveToActive}
            removeInactiveMember={removeInactiveMember}
          />
        </div>
      </CardContent>
    </Card>
  );
}
