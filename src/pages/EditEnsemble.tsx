import { useEffect } from 'react';
import {
  getCurrentDriver,
  getCurrentNavigator,
  useAppStore,
} from '../state.ts/defaultState';
import { EnsembleRotationDisplay } from '@/components/EnsembleRotationDisplay';
import {
  CloseIcon,
  DiceIcon,
  MinusIcon,
  NavigatorIcon,
  PlusIcon,
  WheelIcon,
} from '@/components/icons/icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BreakProgress } from '@/components/BreakProgress';
import { transitionToFullscreen } from '@/windowUtils/fullscreen';
import { cn } from '@/lib/utils';

export function EditEnsemble() {
  useEffect(() => {
    transitionToFullscreen();
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

        <div className="pt-4 border-t border-zinc-700 mt-auto w-full overflow-x-hidden">
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
    currentRotation,
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
    currentRotation: state.currentRotation,
    randomizeMembers: state.randomizeMembers,
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
        <EnsembleRotationDisplay />

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
          <div className="space-y-3 flex flex-col min-h-0 h-full">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider shrink-0">
              Active ({ensembleMembers.length})
            </h3>
            <div className="space-y-2 overflow-y-auto pr-2 min-h-0 flex-1">
              {ensembleMembers.map((member) => (
                <div
                  key={member.id}
                  className={cn(
                    'group flex items-center justify-between p-3 rounded-lg border transition-all',
                    member.id === currentDriver?.id
                      ? 'bg-emerald-900/20 border-emerald-500/30'
                      : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700',
                  )}
                >
                  <div className="flex items-center gap-3">
                    {member.id === currentDriver?.id && (
                      <WheelIcon className="w-5 h-5 text-emerald-500" />
                    )}
                    {member.id === currentNavigator?.id && (
                      <NavigatorIcon className="w-5 h-5 text-indigo-400" />
                    )}
                    <span
                      className={cn(
                        'text-lg theme-transition',
                        member.id === currentDriver?.id
                          ? 'text-emerald-200 font-medium'
                          : 'text-zinc-300',
                      )}
                    >
                      {member.name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMember({ id: member.id })}
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-red-400 hover:bg-red-900/20"
                  >
                    <CloseIcon className="w-5 h-5" />
                  </Button>
                </div>
              ))}
              {ensembleMembers.length === 0 && (
                <div className="p-4 border border-dashed border-zinc-800 rounded-lg text-center text-zinc-600">
                  No active members
                </div>
              )}
            </div>
          </div>

          {/* Inactive Members List */}
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
        </div>
      </CardContent>
    </Card>
  );
}
