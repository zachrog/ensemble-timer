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
    goToEdit,
  } = useAppStore((state) => ({
    setTimeRemaining: state.setTimeRemaining,
    timeRemaining: state.timeRemaining,
    endTurn: state.endTurn,
    ensembleMembers: state.ensembleMembers,
    currentRotation: state.currentRotation,
    currentMode: state.currentMode,
    endBreak: state.endBreak,
    goToEdit: state.goToEdit,
  }));

  useEffect(() => {
    RendererWindowBrowser.restore();
    RendererWindowBrowser.setOpacity(0.5);
    RendererWindowBrowser.setSize(240, 240);
    RendererWindowBrowser.setAlwaysOnTop(true);
    sendMessage({
      channel: customCommandChannelName,
      message: 'move-to-bottom-right',
    });

    const exitTimer = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        goToEdit();
      }
    };
    document.addEventListener('keydown', exitTimer);

    const interval = setInterval(() => {
      setTimeRemaining();
      RendererWindowBrowser.setAlwaysOnTop(true); // setAlwaysOnTop does not always work. Bug in electron. Need to constantly set: https://github.com/electron/electron/issues/2097
    }, 100);
    return () => {
      clearInterval(interval);
      document.removeEventListener('keydown', exitTimer);
    };
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
      <div
        className="h-60 w-60 bg-black text-white flex items-center flex-col justify-between p-2"
        onMouseEnter={() => {
          sendMessage({
            channel: customCommandChannelName,
            message: 'move-window-to-opposite-corner',
          });
        }}
      >
        <h1 className="text-white font-normal flex text-8xl font-sans">
          {minutesRemaining}:{secondsPadded}
        </h1>
        <TimerDisplay
          currentDriver={currentDriver}
          currentMode={currentMode}
          currentNavigator={currentNavigator}
        />
        <BreakDisplay currentMode={currentMode} />
        <div className="">
          <span className="text-zinc-300 text-sm font-light">
            <span className="border-2 rounded-md px-1 border-zinc-300">
              Esc
            </span>{' '}
            to stop
          </span>
        </div>
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
        <WheelIcon className="w-6 h-6 " />
        <span className=" text-4xl font-light pl-3">{currentDriver.name}</span>
      </div>
      <div className="flex items-center">
        <NavigatorIcon className="w-6 h-6" />
        <span className="text-4xl font-light pl-3">
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
      <div className="">
        <CoffeeIcon className="text-emerald-400 w-20 h-20" />
      </div>
    </>
  );
}
