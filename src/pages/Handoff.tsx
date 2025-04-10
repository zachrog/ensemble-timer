import { BreakProgress } from '@/components/BreakProgress';
import { Settings } from '@/components/Settings';
import {
  CloseIcon,
  LeftIcon,
  NavigatorIcon,
  RightIcon,
  WheelIcon,
} from '@/components/icons/icons';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  getCurrentDriver,
  getCurrentNavigator,
  useAppStore,
} from '@/state.ts/defaultState';
import { useEffect } from 'react';
import { transitionToFullscreen } from '@/windowUtils/fullscreen';

export function Handoff() {
  useEffect(() => {
    transitionToFullscreen();
  }, []);

  const {
    ensembleMembers,
    currentRotation,
    removeMember,
    previousDriver,
    nextDriver,
    startTurn,
    vibeCodingMode,
  } = useAppStore((state) => ({
    ensembleMembers: state.ensembleMembers,
    currentRotation: state.currentRotation,
    removeMember: state.removeMember,
    previousDriver: state.previousDriver,
    nextDriver: state.nextDriver,
    startTurn: state.startTurn,
    vibeCodingMode: state.vibeCodingMode,
  }));
  const currentDriver = getCurrentDriver({ currentRotation, ensembleMembers });
  const currentNavigator = getCurrentNavigator({
    currentRotation,
    ensembleMembers,
  });

  return (
    <>
      <div className="p-3">
        <div className="flex justify-between content-center">
          <BreakProgress />
          <Settings />
        </div>
        <div className="flex justify-around items-center">
          <Button
            className="h-16 hover:bg-zinc-700"
            onClick={() => {
              previousDriver();
            }}
          >
            <LeftIcon className="h-16 w-16" />
          </Button>
          <div className="flex items-center">
            <NavigatorIcon className="w-24 h-24 text-white" />
            <span className="text-white text-6xl ml-5">
              {currentNavigator.name}
            </span>
            <Button
              className="ml-5 text-5xl h-22 hover:bg-zinc-700"
              onClick={() => {
                removeMember({ id: currentNavigator.id });
              }}
            >
              <p className="text-5xl">Away</p>
              <CloseIcon className="w-10 h-10 ml-2 text-red-500" />
            </Button>
          </div>
          {!vibeCodingMode && (
            <div className="flex items-center">
              <WheelIcon className="w-24 h-24 text-white" />
              <span className="text-white text-6xl ml-5">
                {currentDriver.name}
              </span>
              <Button
                className="ml-5 text-5xl h-19 hover:bg-zinc-700"
                onClick={() => {
                  removeMember({ id: currentDriver.id });
                }}
              >
                <p>Away</p>
                <CloseIcon className="w-10 h-10 ml-2 text-red-500" />
              </Button>
            </div>
          )}
          <Button
            className="h-16 hover:bg-zinc-700"
            onClick={() => {
              nextDriver();
            }}
          >
            <RightIcon className="h-16 w-16" />
          </Button>
        </div>
        <Separator className="bg-zinc-500 my-10" />
        <div className="flex justify-center">
          <Button
            onClick={() => {
              startTurn();
            }}
            className="hover:bg-emerald-500 flex-grow h-25 text-6xl flex font-thin p-5 border-zinc-700 border bg-emerald-600"
          >
            Continue
          </Button>
        </div>
      </div>
    </>
  );
}
