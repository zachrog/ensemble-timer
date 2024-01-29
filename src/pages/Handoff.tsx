import { RendererWindowBrowser } from '@/communicationBridge/fakeWindowBrowser';
import { RotationProgress } from '@/components/RotationProgress';
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

export function Handoff() {
  useEffect(() => {
    RendererWindowBrowser.setOpacity(1.0);
    RendererWindowBrowser.maximize();
    RendererWindowBrowser.setAlwaysOnTop(false);
    RendererWindowBrowser.setIgnoreMouseEvents(false);
  }, []);

  const {
    ensembleMembers,
    currentRotation,
    removeMember,
    previousDriver,
    nextDriver,
    startTurn,
  } = useAppStore((state) => ({
    ensembleMembers: state.ensembleMembers,
    currentRotation: state.currentRotation,
    removeMember: state.removeMember,
    previousDriver: state.previousDriver,
    nextDriver: state.nextDriver,
    startTurn: state.startTurn,
  }));
  const currentDriver = getCurrentDriver({ currentRotation, ensembleMembers });
  const currentNavigator = getCurrentNavigator({
    currentRotation,
    ensembleMembers,
  });

  return (
    <>
      <RotationProgress />
      <Settings />
      <div>
        <Button
          onClick={() => {
            previousDriver();
          }}
        >
          <LeftIcon />
        </Button>
        <div>
          <WheelIcon className="w-20 h-20 text-white" />
          <span className="text-white">{currentDriver.name}</span>
          <Button
            onClick={() => {
              removeMember({ id: currentDriver.id });
            }}
          >
            <CloseIcon />
            <p>Away</p>
          </Button>
        </div>
        <div>
          <NavigatorIcon className="w-20 h-20 text-white" />
          <span className="text-white">{currentNavigator.name}</span>
          <Button
            onClick={() => {
              removeMember({ id: currentNavigator.id });
            }}
          >
            <CloseIcon />
            <p>Away</p>
          </Button>
        </div>

        <Button
          onClick={() => {
            nextDriver();
          }}
        >
          <RightIcon />
        </Button>
      </div>
      <Separator className="bg-zinc-300" />
      <div>
        <Button
          onClick={() => {
            startTurn();
          }}
        >
          Continue
        </Button>
      </div>
    </>
  );
}
