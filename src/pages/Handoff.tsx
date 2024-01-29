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

export function Handoff() {
  const {
    ensembleMembers,
    currentRotation,
    removeMember,
    previousDriver,
    nextDriver,
  } = useAppStore((state) => ({
    ensembleMembers: state.ensembleMembers,
    currentRotation: state.currentRotation,
    removeMember: state.removeMember,
    previousDriver: state.previousDriver,
    nextDriver: state.nextDriver,
  }));
  const currentDriver = getCurrentDriver({ currentRotation, ensembleMembers });
  const currentNavigator = getCurrentNavigator({
    currentRotation,
    ensembleMembers,
  });

  return (
    <>
      <RotationProgress />
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
        <Button>Continue</Button>
      </div>
    </>
  );
}

function RotationProgress() {
  const { rotationsPerBreak, currentRotation } = useAppStore((state) => ({
    currentRotation: state.currentRotation,
    rotationsPerBreak: state.rotationsPerBreak,
  }));

  return (
    <>
      {new Array(rotationsPerBreak).fill(undefined).map((_, index) => {
        const backgroundColor =
          index < currentRotation ? 'bg-emerald-500' : 'bg-zinc-700';
        return (
          <div
            key={index}
            className={'w-5 h-5 rounded-md inline-block ' + backgroundColor}
          ></div>
        );
      })}
    </>
  );
}
