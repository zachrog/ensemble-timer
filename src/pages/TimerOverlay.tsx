import { useEffect } from 'react';
import { RendererWindowBrowser } from '../communicationBridge/fakeWindowBrowser';
import { sendMessage } from '../communicationBridge/rendererCommunicationBridge';
import { customCommandChannelName } from '../../electron/communicationBridge/constants';
import { useAppStore } from '../state.ts/defaultState';

export function TimerOverlay() {
  const { setTimeStarted, setTimeRemaining, timeRemaining } = useAppStore(
    (state) => ({
      setTimeStarted: state.setTimeStarted,
      setTimeRemaining: state.setTimeRemaining,
      timeRemaining: state.timeRemaining,
    }),
  );

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

    setTimeStarted();
    const interval = setInterval(() => {
      setTimeRemaining();
    }, 100);
    return () => clearInterval(interval);
  }, []);
  const minutesRemaining = Math.floor(timeRemaining / 60);
  const secondsRemaining = timeRemaining % 60;
  const secondsPadded = `${secondsRemaining}`.padStart(2, '0');

  return (
    <>
      <div className="h-60 w-60 bg-black text-white-700 flex items-center flex-col">
        <h1 className="text-white font-normal flex text-8xl font-sans">
          {minutesRemaining}:{secondsPadded}
        </h1>
        <div className="flex items-center mt-6">
          <NavigatorIcon />
          <span className="text-white text-4xl font-light pl-3"> Zach</span>
        </div>
        <div className="flex items-center">
          <WheelIcon />
          <span className="text-white text-4xl font-light pl-3">Rachel</span>
        </div>
      </div>
    </>
  );
}

function NavigatorIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6 text-white"
    >
      <path
        fillRule="evenodd"
        d="M8.161 2.58a1.875 1.875 0 0 1 1.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0 1 21.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 0 1-1.676 0l-4.994-2.497a.375.375 0 0 0-.336 0l-3.868 1.935A1.875 1.875 0 0 1 2.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437ZM9 6a.75.75 0 0 1 .75.75V15a.75.75 0 0 1-1.5 0V6.75A.75.75 0 0 1 9 6Zm6.75 3a.75.75 0 0 0-1.5 0v8.25a.75.75 0 0 0 1.5 0V9Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function WheelIcon() {
  return (
    <svg
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className="w-6 h-6 text-white"
    >
      <g>
        <g>
          <path
            d="M437.02,74.981C388.668,26.628,324.38,0,256,0S123.333,26.628,74.98,74.981C26.628,123.333,0,187.62,0,256
			s26.628,132.667,74.98,181.019C123.333,485.372,187.62,512,256,512s132.667-26.628,181.02-74.981
			C485.372,388.668,512,324.38,512,256S485.372,123.333,437.02,74.981z M256,57.263c100.782,0,184.276,75.409,197.04,172.765
			L329.849,218.03c-13.813-26.755-41.72-45.102-73.849-45.102s-60.036,18.347-73.849,45.102L58.96,230.028
			C71.724,132.672,155.218,57.263,256,57.263z M58.889,281.375l121.731,9.484c7.69,16.55,20.669,30.166,36.76,38.655l7.978,122.859
			C138.513,438.875,70.099,368.943,58.889,281.375z M256,281.809c-14.232,0-25.809-11.578-25.809-25.809S241.77,230.191,256,230.191
			S281.809,241.77,281.809,256S270.232,281.809,256,281.809z M286.644,452.373l7.978-122.859
			c16.091-8.488,29.069-22.105,36.76-38.655l121.731-9.484C441.901,368.943,373.487,438.875,286.644,452.373z"
          />
        </g>
      </g>
    </svg>
  );
}
