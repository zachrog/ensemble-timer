import { useEffect } from 'react';
import { RendererWindowBrowser } from '../communicationBridge/fakeWindowBrowser';
import { sendMessage } from '../communicationBridge/rendererCommunicationBridge';
import { customCommandChannelName } from '../../electron/communicationBridge/constants';
import {
  EnsembleMember,
  EnsembleModes,
  getCurrentDriver,
  getCurrentNavigator,
  useAppStore,
} from '../state.ts/defaultState';
import { CoffeeIcon, NavigatorIcon, WheelIcon } from '@/components/icons/icons';

export function TimerOverlay() {
  const {
    setTimeRemaining,
    timeRemaining,
    endTurn,
    ensembleMembers,
    currentRotation,
    currentMode,
    endBreak,
  } = useAppStore((state) => ({
    setTimeRemaining: state.setTimeRemaining,
    timeRemaining: state.timeRemaining,
    endTurn: state.endTurn,
    ensembleMembers: state.ensembleMembers,
    currentRotation: state.currentRotation,
    currentMode: state.currentMode,
    endBreak: state.endBreak,
  }));

  useEffect(() => {
    RendererWindowBrowser.restore();
    RendererWindowBrowser.setOpacity(0.5);
    RendererWindowBrowser.setSize(240, 240);
    RendererWindowBrowser.setAlwaysOnTop(true);
    RendererWindowBrowser.setIgnoreMouseEvents(true);
    sendMessage({
      channel: customCommandChannelName,
      message: 'move-to-bottom-right',
    });

    const interval = setInterval(() => {
      setTimeRemaining();
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timeRemaining <= 0 && currentMode === 'break') {
      endBreak();
      return;
    }
    if (timeRemaining <= 0 && currentMode === 'timer') {
      endTurn();
      return;
    }
  }, [timeRemaining, currentMode]);

  const minutesRemaining = Math.floor(timeRemaining / (60 * 1000));
  const secondsRemaining = Math.floor(timeRemaining / 1000) % 60;
  const secondsPadded = `${secondsRemaining}`.padStart(2, '0');
  const currentNavigator = getCurrentNavigator({
    ensembleMembers,
    currentRotation,
  });
  const currentDriver = getCurrentDriver({ ensembleMembers, currentRotation });

  return (
    <>
      <div className="h-60 w-60 bg-black text-white-700 flex items-center flex-col">
        <h1 className="text-white font-normal flex text-8xl font-sans">
          {minutesRemaining}:{secondsPadded}
        </h1>
        <TimerDisplay
          currentDriver={currentDriver}
          currentMode={currentMode}
          currentNavigator={currentNavigator}
        />
        <BreakDisplay currentMode={currentMode} />
      </div>
    </>
  );
}

function TimerDisplay({
  currentDriver,
  currentNavigator,
  currentMode,
}: {
  currentDriver: EnsembleMember;
  currentNavigator: EnsembleMember;
  currentMode: EnsembleModes;
}) {
  if (currentMode !== 'timer') {
    return;
  }
  return (
    <>
      <div className="flex items-center">
        <WheelIcon className="w-6 h-6 text-white" />
        <span className="text-white text-4xl font-light pl-3">
          {currentDriver.name}
        </span>
      </div>
      <div className="flex items-center mt-6">
        <NavigatorIcon className="w-6 h-6 text-white" />
        <span className="text-white text-4xl font-light pl-3">
          {currentNavigator.name}
        </span>
      </div>
    </>
  );
}

function BreakDisplay({ currentMode }: { currentMode: EnsembleModes }) {
  if (currentMode !== 'break') {
    return;
  }

  return (
    <>
      <div className="flex-auto h-max">
        <CoffeeIcon className="text-emerald-400 w-20 h-20 mt-7" />
      </div>
    </>
  );
}
