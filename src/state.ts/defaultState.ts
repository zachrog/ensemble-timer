import { create } from 'zustand';

export type AppStore = {
  timeStarted: number;
  timerLength: number;
  setTimeStarted: () => void;
};

export const useAppStore = create<AppStore>()((set) => ({
  // bears: 0,
  // increase: (by) => set((state) => ({ bears: state.bears + by })),
  timeStarted: 0,
  timerLength: 5 * 60 * 1000,
  setTimeStarted: () => set((state) => ({timeStarted: Date.now()})),
}));

