import { create } from 'zustand';

export type AppStore = {
  timeStarted: number;
  setTimeStarted: () => void;
  timerLength: number;
  setTimerLength: (timer: number) => void;
  timeRemaining: number;
  setTimeRemaining: () => void;
};

export const useAppStore = create<AppStore>()((set, get) => ({
  timeStarted: 0,
  setTimeStarted: () => set((state) => ({ timeStarted: Date.now() })),
  timerLength: 5 * 60 * 1000,
  setTimerLength: (timerLength) => set(() => ({ timerLength })),
  timeRemaining: 0,
  setTimeRemaining: () =>
    set((state) => {
      const timeRemainingSec =
        (state.timeStarted + state.timerLength - Date.now()) / 1000;
      const timeRemainingClamped = Math.max(timeRemainingSec, 0);
      const timeRemainingInt = Math.floor(timeRemainingClamped);
      return { timeRemaining: timeRemainingInt };
    }),
}));
